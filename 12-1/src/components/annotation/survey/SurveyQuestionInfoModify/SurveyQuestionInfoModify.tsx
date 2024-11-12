import {
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Button } from 'reactstrap';
import L from 'lodash';
import * as R from 'ramda';
import Swal from 'sweetalert2';
import DataCounter from '~/components/form/DataCounter';
import FormItemInput from '~/components/form/FormItemInput';
import FormItemSelect from '~/components/form/FormItemSelect';
import FormItemText from '~/components/form/FormItemText';
import CollapseBox from '~/components/shared/CollapseBox';
import Selectbox from '~/components/shared/Selectbox';
import TextField from '~/components/shared/TextField';
import { SurveyTextAnnotationContext } from '~/libs/contexts/SurveyTextAnnotationContext';
import SurveyQuestionInfoButtons from './SurveyQuestionInfoButtons';
import SurveyQuestionLogic from './SurveyQuestionInfoLogic';
import { InitialCount, InitialLabelingData } from '../../constants';
import SurveyLabelingModal from '../SurveyLabelingModal';

type Props = {
  labelingRefetch?: any;
};

function SurveyQuestionInfoModify({ labelingRefetch }: Props) {
  const questionMethods = useForm();
  questionMethods.watch();

  const {
    reset,
    document,
    setSelectedItem,
    setSelectedText,
    setSelectedKey,
    setExeLabelingList,
  } = useContext(SurveyTextAnnotationContext);
  const { info } = document;
  const { surveyText } = info || {};

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [count, setCount] = useState<typeof InitialCount>(InitialCount);
  const [data, setData] = useState<any>(InitialLabelingData);
  const [labelingIndex, setLabelingIndex] = useState<number>(0);
  const [labelingList, setLabelingList] = useState<any>([]);

  const handleItemClick = (name: string, key: string) => {
    setSelectedItem(name);
    setSelectedKey(key);
    setSelectedText('');
    setIsOpen(true); // 모달 보기
  };

  const handleMinusCount = useCallback(
    (key: string) => {
      const lastIndex = count[key] - 1;
      setCount((prev: any) => ({ ...prev, [key]: prev[key] - 1 }));

      setData((prev: any) => {
        prev[key].pop(); // 마지막 요소 제거
        return { ...prev, [key]: prev[key] };
      });

      // reset
      if (key === 'surveyAChoices') {
        questionMethods.setValue(`${key}_${lastIndex}`, '');
      } else if (key === 'surveyLogic') {
        questionMethods.setValue(`surveyNextQNum_${lastIndex}`, '');
        questionMethods.setValue(`surveyNextQCondition_${lastIndex}`, '');
      }
    },
    [count]
  );

  const handleSingleMinusCount = (key: string, index: any) => {
    const originKeyCount = count[key];
    const currentKeyCount = count[key] - 1;

    data[key].splice(index, 1);

    setCount((prev: any) => ({ ...prev, [key]: currentKeyCount }));
    setData(data);

    if (key === 'surveyAChoices') {
      for (let i = 0; i < originKeyCount; ++i) {
        if (i < currentKeyCount) {
          questionMethods.setValue(`${key}_${i}`, data[key][i]);
          continue;
        }
        questionMethods.setValue(`${key}_${i}`, '');
      }
    } else if (key === 'surveyLogic') {
      for (let i = 0; i < originKeyCount; ++i) {
        if (i < currentKeyCount) {
          questionMethods.setValue(
            `surveyNextQNum_${i}`,
            data[key][i].surveyNextQNum
          );
          questionMethods.setValue(
            `surveyNextQCondition_${i}`,
            data[key][i].surveyNextQCondition
          );
          continue;
        }
        questionMethods.setValue(`surveyNextQNum_${i}`, '');
        questionMethods.setValue(`surveyNextQCondition_${i}`, '');
      }
    }
  };

  const handlePlusCount = useCallback((key: string) => {
    setCount((prev: any) => ({ ...prev, [key]: prev[key] + 1 }));

    if (key === 'surveyAChoices') {
      setData((prev: any) => ({ ...prev, [key]: [...prev[key], ''] }));
    } else if (key === 'surveyLogic') {
      setData((prev: any) => ({
        ...prev,
        [key]: [...prev[key], { surveyNextQNum: '', surveyNextQCondition: '' }],
      }));
    }
    return;
  }, []);

  const handleItemSave = (name: string, value: string, exclude = false) => {
    if (exclude) {
      const [key, index] = R.split('_', name);
      if (key === 'surveyAChoices') {
        const newData = data.surveyAChoices.with(index, value);
        setData((prev: any) => ({ ...prev, [key]: newData }));
      } else if (key === 'surveyNextQNum' || key === 'surveyNextQCondition') {
        const newData = data.surveyLogic.with(index, {
          ...data.surveyLogic[index],
          [key]: value,
        });
        setData((prev: any) => ({ ...prev, surveyLogic: newData }));
      }
    }

    questionMethods.setValue(name, value); // 현재 라벨링

    handleLabelingList(name, value);
    handleClose();
  };

  const handleDelete = () => {
    Swal.fire({
      icon: 'info',
      title: '삭제하시겠습니까?',
      text: '삭제 시 복구가 불가능하며 재작업이 필요할 수 있습니다.',
      showCancelButton: true,
      confirmButtonText: '확인',
      cancelButtonText: `취소`,
    }).then((result) => {
      const { isConfirmed } = result;
      if (isConfirmed) {
        const newData = labelingList.filter(
          (_: any, index: number) => index !== labelingIndex
        );
        setLabelingList(newData);
      }
    });
  };

  // 모달 > 닫기
  const handleClose = useCallback(() => {
    setSelectedItem('');
    setSelectedText('');
    setIsOpen(false);
  }, []);

  // 라벨링 이동
  const handleLabelingPage = ({ value }: { value: number }) => {
    setLabelingIndex(+value);
  };

  const handleLabelingList = (key: any, value: any) => {
    const labelingData = {
      ...labelingList?.[labelingIndex],
      [key]: value,
    };

    if (labelingList[labelingIndex] === undefined) {
      labelingList.push(labelingData);
    } else {
      const newData = labelingList.with(labelingIndex, labelingData);
      setLabelingList(newData);
    }
  };

  const defaultValues = useMemo(() => {
    if (labelingList?.[labelingIndex]) {
      return {
        ...labelingList?.[labelingIndex],
        surveyAType: labelingList?.[labelingIndex]?.surveyAType ?? null,
      };
    } else {
      questionMethods.reset();
      setCount(InitialCount);
      setData(InitialLabelingData);
      return {
        surveyAType: labelingList?.[labelingIndex]?.surveyAType ?? null,
      };
    }
  }, [labelingList, labelingIndex]);

  const init = () => {
    L.flow(L.toPairs, (data) => {
      L.forEach(data, ([name, value]: any) => {
        questionMethods.register(name);
        questionMethods.setValue(name, value);
      });
    })(defaultValues);
  };

  useEffect(() => {
    if (defaultValues) {
      questionMethods.reset(); // 이전 values reset
      init();
    }
  }, [defaultValues]);

  useEffect(() => {
    if (labelingList?.[labelingIndex]) {
      const currentLabeling = labelingList?.[labelingIndex];
      if (Object.keys(currentLabeling).length > 0) {
        const surveyAChoicesArray = Object.keys(currentLabeling)
          .reduce((acc: any, cur: any) => {
            if (/surveyAChoices/.exec(cur))
              return [...acc, currentLabeling[cur]];
            return acc;
          }, [])
          .filter((el: any) => el);

        const surveyLogicArray = Object.keys(currentLabeling)
          .reduce((acc: any, cur: any) => {
            const [key, index] = cur.split('_');
            if (
              /surveyNextQNum/.exec(key) ||
              /surveyNextQCondition/.exec(key)
            ) {
              const newData = { ...acc[index], [key]: currentLabeling[cur] };
              acc[index] = newData;
              return acc;
            }
            return acc;
          }, [])
          .filter((el: any) => el);

        setCount({
          surveyAChoices: surveyAChoicesArray.length,
          surveyLogic: surveyLogicArray.length,
        });
        setData({
          surveyAChoices: surveyAChoicesArray,
          surveyLogic: surveyLogicArray.map((item: any) => {
            return item;
          }),
        });
      } else {
        setCount(InitialCount);
        setData(InitialLabelingData);
      }
    }
  }, [labelingList, labelingIndex]);

  useEffect(() => {
    setExeLabelingList(labelingList);
  }, [labelingList]);

  useEffect(() => {
    if (reset) setLabelingList([]);
  }, [reset]);

  return (
    <CollapseBox title="문항별 정보" isOpen={true}>
      {!surveyText ? (
        <div className="p-2">
          <span className="d-flex justify-content-center py-2">
            데이터가 없습니다.
          </span>
        </div>
      ) : (
        <FormProvider {...questionMethods}>
          <div className="px-3 py-2">
            <FormItemInput
              label="문항 번호"
              name="surveyQNum"
              readonly={true}
              onClick={handleItemClick.bind(null, '문항 번호', 'surveyQNum')}
            />
            <FormItemInput
              label="문항 내용"
              name="surveyContext"
              readonly={true}
              onClick={handleItemClick.bind(null, '문항 내용', 'surveyContext')}
            />
            <FormItemInput
              label="문항 파트"
              name="surveyQPart"
              readonly={true}
              onClick={handleItemClick.bind(null, '문항 파트', 'surveyQPart')}
            />
            <FormItemInput
              label="문항 목적"
              name="surveyQPurpose"
              readonly={true}
              onClick={handleItemClick.bind(
                null,
                '문항 목적',
                'surveyQPurpose'
              )}
            />
            <FormItemSelect
              label="답변 유형"
              name="surveyAType"
              isMulti={false}
              options={[
                {
                  label: 'single',
                  value: 'surveyatype001',
                },
                {
                  label: 'rank',
                  value: 'surveyatype002',
                },
                {
                  label: 'multi',
                  value: 'surveyatype003',
                },
                {
                  label: 'open',
                  value: 'surveyatype004',
                },
              ]}
              onProductChange={(value) => {
                handleLabelingList('surveyAType', value);
              }}
            />
            <FormItemText label="선택지 개수" value={count.surveyAChoices} />
            <div className="d-flex justify-content-between py-1 align-items-center">
              <span>선택지 내용</span>
              <DataCounter
                name="surveyAChoices"
                value={count.surveyAChoices}
                onMinusCount={handleMinusCount}
                onPlusCount={handlePlusCount}
              />
            </div>
            {!L.isEmpty(data.surveyAChoices) && (
              <div className="ps-2 py-2 d-flex gap-2 flex-column">
                {data.surveyAChoices.map((item: any, index: number) => {
                  return (
                    <div
                      key={index}
                      className="d-flex justify-content-end gap-2"
                    >
                      <TextField
                        name={`surveyAChoices_${index}`}
                        value={item}
                        readOnly={true}
                        onClick={handleItemClick.bind(
                          null,
                          `선택지 내용 ${index + 1}`,
                          `surveyAChoices_${index}`
                        )}
                      />
                      <Button
                        size="sm"
                        onClick={() =>
                          handleSingleMinusCount('surveyAChoices', index)
                        }
                      >
                        <i className="fas fa-minus" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
            <div className="d-flex justify-content-between py-1 align-items-center">
              <span>로직</span>
              <DataCounter
                name="surveyLogic"
                value={count.surveyLogic}
                onMinusCount={handleMinusCount}
                onPlusCount={handlePlusCount}
              />
            </div>
            {!L.isEmpty(data.surveyLogic) && (
              <SurveyQuestionLogic
                onItemClick={handleItemClick}
                data={data}
                onSingleMinusCount={handleSingleMinusCount}
              />
            )}
          </div>
          <SurveyQuestionInfoButtons
            labelingListLength={labelingList?.length}
            labelingId={0}
            labelingIndex={labelingIndex}
            setLabelingIndex={setLabelingIndex}
            onDelete={handleDelete}
          />
          {labelingList?.length > 0 && (
            <div className="px-2">
              <Selectbox
                name="labelingPage"
                placeholder="라벨링 이동"
                onChange={handleLabelingPage}
                items={labelingList.map((_: any, index: number) => ({
                  label: index,
                  value: index,
                }))}
                value={labelingIndex}
              />
            </div>
          )}
          <SurveyLabelingModal
            isOpen={isOpen}
            onClose={handleClose}
            onItemSave={handleItemSave}
          />
        </FormProvider>
      )}
    </CollapseBox>
  );
}

export default memo(SurveyQuestionInfoModify);
