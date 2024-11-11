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
import { useMutation, useQuery } from '@tanstack/react-query';
import L from 'lodash';
import Swal from 'sweetalert2';
import * as R from 'ramda';
import {
  fetchSurveyLabelingCreate,
  fetchSurveyLabelingDelete,
  fetchSurveyLabelingModify,
  fetchSurveyLabelingSelectInfo,
  fetchSurveyRequestInspection,
} from '~/api/fetches/fetchSurvey';
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
  labelingRefetch: any;
};

function SurveyQuestionInfoModify({ labelingRefetch }: Props) {
  const {
    surveyId,
    document,
    setSelectedItem,
    setSelectedText,
    setSelectedKey,
  } = useContext(SurveyTextAnnotationContext);
  const { labelingList, labelingPage } = document;

  console.log('document', document);
  const [labelingIndex, setLabelingIndex] = useState<number>(0);
  const [page, setPage] = useState<number>(0);
  const [count, setCount] = useState<typeof InitialCount>(InitialCount);
  const [data, setData] = useState<any>(InitialLabelingData);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const currentLabeling =
    typeof labelingList !== 'undefined' ? labelingList[labelingIndex] : {};

  const { data: selectInfo } = useQuery({
    queryKey: ['surveyLabelingSelectInfo'],
    queryFn: () =>
      fetchSurveyLabelingSelectInfo().then(({ response }) => response.payload),
    enabled: document !== undefined,
  });

  const handleMutationSuccess = (data: any) => {
    const { result, message } = data.response.payload;
    if (result === 'error') {
      Swal.fire({
        icon: 'error',
        title: `${message ?? 'API 오류'}`,
        confirmButtonText: '확인',
      });
    } else {
      Swal.fire({
        icon: 'success',
        title: '완료되었습니다.',
        confirmButtonText: '확인',
      });
      labelingRefetch();
    }
  };

  const createMutation = useMutation(fetchSurveyLabelingCreate, {
    onSuccess: handleMutationSuccess,
  });

  const modifyMutation = useMutation(fetchSurveyLabelingModify, {
    onSuccess: handleMutationSuccess,
  });

  const deleteMutation = useMutation(fetchSurveyLabelingDelete, {
    onSuccess: () => {
      labelingRefetch();
    },
  });

  const inspectionRequestMutation = useMutation(fetchSurveyRequestInspection, {
    onSuccess: handleMutationSuccess,
  });

  const methods = useForm();
  methods.watch();

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
        methods.setValue(`${key}_${lastIndex}`, '');
      } else if (key === 'surveyLogic') {
        methods.setValue(`surveyNextQNum_${lastIndex}`, '');
        methods.setValue(`surveyNextQCondition_${lastIndex}`, '');
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
          methods.setValue(`${key}_${i}`, data[key][i]);
          continue;
        }
        methods.setValue(`${key}_${i}`, '');
      }
    } else if (key === 'surveyLogic') {
      for (let i = 0; i < originKeyCount; ++i) {
        if (i < currentKeyCount) {
          methods.setValue(`surveyNextQNum_${i}`, data[key][i].surveyNextQNum);
          methods.setValue(
            `surveyNextQCondition_${i}`,
            data[key][i].surveyNextQCondition
          );
          continue;
        }
        methods.setValue(`surveyNextQNum_${i}`, '');
        methods.setValue(`surveyNextQCondition_${i}`, '');
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

    methods.setValue(name, value);
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
        deleteMutation.mutateAsync({
          surveyId,
          labelingId: currentLabeling.labelingId,
        });
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
    setPage(+value);
    setLabelingIndex(+value);
  };

  const handleRequest = () => {
    const params = { labelingId: currentLabeling.labelingId };
    inspectionRequestMutation.mutateAsync(params);
  };

  const handleLabelingSave = (values: any) => {
    const {
      labelingId,
      surveyQNum,
      surveyContext,
      surveyQPart,
      surveyQPurpose,
      surveyATypeView,
    } = values;

    const params = {
      surveyId,
      surveyQNum,
      surveyContext,
      surveyQPart,
      surveyQPurpose,
      surveyAType: surveyATypeView?.value,
      surveyAChoicesParam: R.reject((val) => !val, data.surveyAChoices),
      surveyLogicArray: data.surveyLogic,
      ...(labelingId && { labelingId }),
    };

    // labelingId === null create
    // labelingId > 0 modify
    if (!labelingId) {
      createMutation.mutateAsync(params);
    } else {
      modifyMutation.mutateAsync(params);
    }
  };

  const defaultValues = useMemo(() => {
    let surveyAChoicesData = {};
    let surveyLogicData = {};

    console.log('labelingIndex', labelingIndex, labelingList);
    console.log(444, labelingList?.[labelingIndex]);
    if (labelingList?.[labelingIndex]) {
      const {
        createDatetime,
        createMember,
        createMemberName,
        updateDatetime,
        updateMember,
        updateMemberName,
        surveyAChoicesArray,
        surveyLogicArray,
        ...rest
      } = currentLabeling;

      // 선택지 내용
      if (surveyAChoicesArray.length > 0) {
        surveyAChoicesData = surveyAChoicesArray.reduce(
          (acc: any, cur: any, index: number) => {
            const data = { [`surveyAChoices_${index}`]: cur };
            return { ...acc, ...data };
          },
          {}
        );
      }

      // 로직
      if (surveyLogicArray.length > 0) {
        surveyLogicData = surveyLogicArray.reduce(
          (acc: any, cur: any, index: number) => {
            const { surveyNextQNum, surveyNextQCondition } = cur;
            const qnumData = { [`surveyNextQNum_${index}`]: surveyNextQNum };
            const qconditionData = {
              [`surveyNextQCondition_${index}`]: surveyNextQCondition,
            };
            return { ...acc, ...qnumData, ...qconditionData };
          },
          {}
        );
      }
      return { ...rest, ...surveyAChoicesData, ...surveyLogicData };
    }
  }, [labelingList, labelingIndex]);

  const init = () => {
    L.flow(L.toPairs, (data) => {
      L.forEach(data, ([name, value]: any) => {
        methods.register(name);
        methods.setValue(name, value);
      });
    })(defaultValues);
  };

  useEffect(() => {
    if (defaultValues) {
      console.log('defaultValues', defaultValues);
      methods.reset(); // 이전 values reset
      init();
    }
  }, [defaultValues]);

  useEffect(() => {
    if (currentLabeling) {
      if (currentLabeling.labelingId) {
        setCount({
          surveyAChoices: currentLabeling.surveyAChoicesArray.length,
          surveyLogic: currentLabeling.surveyLogicArray.length,
        });
        setData({
          surveyAChoices: currentLabeling.surveyAChoicesArray,
          surveyLogic: currentLabeling.surveyLogicArray.map((item: any) => {
            const { surveyNextQNum, surveyNextQCondition } = item;
            return {
              surveyNextQNum,
              surveyNextQCondition,
            };
          }),
        });
      } else {
        setCount(InitialCount);
        setData(InitialLabelingData);
      }
    }
  }, [currentLabeling, labelingIndex]);

  return (
    <CollapseBox title="문항별 정보" isOpen={true}>
      <FormProvider {...methods}>
        <form>
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
              name="surveyATypeView"
              isMulti={false}
              options={selectInfo?.surveyAType}
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
            labelingId={currentLabeling?.labelingId}
            labelingIndex={labelingIndex}
            setLabelingIndex={setLabelingIndex}
            onDelete={handleDelete}
            onSave={methods.handleSubmit(handleLabelingSave)}
            onRequest={handleRequest}
          />
          <div className="px-2 py-3">
            <Selectbox
              name="labelingPage"
              placeholder="라벨링 이동"
              onChange={handleLabelingPage}
              items={labelingPage}
              value={page}
            />
          </div>
        </form>
        <SurveyLabelingModal
          isOpen={isOpen}
          onClose={handleClose}
          onItemSave={handleItemSave}
        />
      </FormProvider>
    </CollapseBox>
  );
}

export default memo(SurveyQuestionInfoModify);
