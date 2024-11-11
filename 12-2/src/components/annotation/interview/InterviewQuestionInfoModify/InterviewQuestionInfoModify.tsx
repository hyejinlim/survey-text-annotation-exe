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
import CollapseBox from '~/components/shared/CollapseBox';
import Selectbox from '~/components/shared/Selectbox';
import TextField from '~/components/shared/TextField';
import { InterviewTextAnnotationContext } from '~/libs/contexts/InterviewTextAnnotationContext';
import InterviewQuestionInfoButtons from './InterviewQuestionInfoButtons';
import InterviewLabelingModal from '../InterviewLabelingModal';

type Props = {
  labelingRefetch?: any;
};

function InterviewQuestionInfoModify({ labelingRefetch }: Props) {
  const questionMethods = useForm();
  questionMethods.watch();

  const {
    reset,
    document,
    setSelectedItem,
    setSelectedText,
    setSelectedKey,
    setExeLabelingList,
  } = useContext(InterviewTextAnnotationContext);

  const { info } = document;
  const { interviewText } = info || {};

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [count, setCount] = useState<number>(0);
  const [data, setData] = useState<any>([]);
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
      const lastIndex = count - 1;
      setCount((prev) => prev - 1);
      setData((prev: any) => {
        prev.pop(); // 마지막 요소 제거
        return [...prev];
      });

      // reset
      if (key === 'interviewAnswer') {
        questionMethods.setValue(`interviewAKey_${lastIndex}`, '');
        questionMethods.setValue(`interviewAContext_${lastIndex}`, '');
        questionMethods.setValue(`interviewAMatch_${lastIndex}`, '');
        questionMethods.setValue(`interviewAType_${lastIndex}`, '');
      }
    },
    [count]
  );

  const handlePlusCount = useCallback(() => {
    setCount((prev: any) => prev + 1);
    setData((prev: any) => [
      ...prev,
      {
        interviewAKey: '',
        interviewAContext: '',
        interviewAMatch: '',
        interviewAType: '',
      },
    ]);
  }, []);

  const handleSingleMinusCount = (key: string, index: any) => {
    const originKeyCount = count;
    const currentKeyCount = count - 1;

    data.splice(index, 1);

    setCount(currentKeyCount);
    setData(data);

    if (key === 'interviewAnswer') {
      for (let i = 0; i < originKeyCount; ++i) {
        if (i < currentKeyCount) {
          questionMethods.setValue(`interviewAKey_${i}`, data[i].interviewAKey);
          questionMethods.setValue(
            `interviewAContext_${i}`,
            data[i].interviewAContext
          );
          questionMethods.setValue(
            `interviewAMatch_${i}`,
            data[i].interviewAMatch
          );
          questionMethods.setValue(
            `interviewAType_${i}`,
            data[i].interviewAType
          );
          continue;
        }
        questionMethods.setValue(`interviewAKey_${i}`, '');
        questionMethods.setValue(`interviewAContext_${i}`, '');
        questionMethods.setValue(`interviewAMatch_${i}`, '');
        questionMethods.setValue(`interviewAType_${i}`, '');
      }
    }
  };

  const handleItemSave = (name: string, value: string, exclude = false) => {
    if (exclude) {
      const [key, index] = R.split('_', name);
      const newData = data.with(index, {
        ...data[index],
        [key]: value,
      });
      setData(newData);
    }

    questionMethods.setValue(name, value);

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
        labelingList.splice(labelingIndex, 1);
        setLabelingList(labelingList);
        setLabelingIndex(labelingList.length - 1); // 라벨링 인덱스 초기화
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
        interviewQType: labelingList?.[labelingIndex]?.interviewQType ?? null,
      };
    } else {
      questionMethods.reset();
      setCount(0);
      setData([]);
      return {
        interviewQType: labelingList?.[labelingIndex]?.interviewQType ?? null,
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
        const interviewAnswerList = Object.keys(currentLabeling)
          .reduce((acc: any, cur: any) => {
            const [key, index] = cur.split('_');
            if (
              /interviewAKey/.exec(key) ||
              /interviewAContext/.exec(key) ||
              /interviewAType/.exec(key) ||
              /interviewAMatch/.exec(key)
            ) {
              const newData = { ...acc[index], [key]: currentLabeling[cur] };
              acc[index] = newData;
              return acc;
            }
            return acc;
          }, [])
          .filter((el: any) => el);

        setCount(interviewAnswerList?.length);
        setData(interviewAnswerList);
      } else {
        setCount(0);
        setData([]);
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
      {!interviewText ? (
        <div className="p-2">
          <span className="d-flex justify-content-center py-2">
            데이터가 없습니다.
          </span>
        </div>
      ) : (
        <FormProvider {...questionMethods}>
          <div className="px-3 py-2">
            <FormItemInput
              label="턴 순서"
              name="interviewTurnId"
              readonly={true}
              onClick={handleItemClick.bind(null, '턴 순서', 'interviewTurnId')}
            />
            <FormItemInput
              label="질문 내용"
              name="interviewQContext"
              readonly={true}
              onClick={handleItemClick.bind(
                null,
                '질문 내용',
                'interviewQContext'
              )}
            />
            <FormItemSelect
              label="질문 분류"
              name="interviewQType"
              isMulti={false}
              options={[
                {
                  label: '주요 질문',
                  value: 'intervieqtype001',
                },
                {
                  label: '후속 질문',
                  value: 'intervieqtype002',
                },
                {
                  label: '기타',
                  value: 'intervieqtype900',
                },
              ]}
              onProductChange={(value) => {
                handleLabelingList('interviewQType', value);
              }}
            />
            <FormItemInput
              label="질문 목적"
              name="interviewQPurp"
              readonly={true}
              onClick={handleItemClick.bind(
                null,
                '질문 목적',
                'interviewQPurp'
              )}
            />
            <FormItemInput
              label="다음 질문 내용"
              name="interviewQPost"
              readonly={true}
              onClick={handleItemClick.bind(
                null,
                '다음 질문 내용',
                'interviewQPost'
              )}
            />
            <div className="d-flex justify-content-between py-1 align-items-center">
              <span>답변 정보</span>
              <DataCounter
                name="interviewAnswer"
                value={count}
                onMinusCount={handleMinusCount}
                onPlusCount={handlePlusCount}
              />
            </div>
            {!L.isEmpty(data) && (
              <div className="ps-2 py-2 d-flex gap-2 flex-column">
                {data.map((item: any, index: number) => {
                  return (
                    <div key={index} className="d-flex flex-column gap-1">
                      <div className="d-flex justify-content-between align-items-center">
                        <span>답변 정보 {index + 1}</span>
                        <Button
                          size="sm"
                          onClick={() =>
                            handleSingleMinusCount('interviewAnswer', index)
                          }
                        >
                          <i className="fas fa-minus" />
                        </Button>
                      </div>
                      <div className="d-flex justify-content-between align-items-center ms-2">
                        <span className="col-4">대상자 아이디</span>
                        <TextField
                          name={`interviewAKey_${index}`}
                          value={item.interviewAKey}
                          readOnly={true}
                          onClick={handleItemClick.bind(
                            null,
                            `답변 정보 > 대상자 아이디 ${index + 1}`,
                            `interviewAKey_${index}`
                          )}
                        />
                      </div>
                      <div className="d-flex justify-content-between align-items-center ms-2">
                        <span className="col-4">답변 내용</span>
                        <TextField
                          name={`interviewAContext_${index}`}
                          value={item.interviewAContext}
                          readOnly={true}
                          onClick={handleItemClick.bind(
                            null,
                            `답변 정보 > 답변 내용 ${index + 1}`,
                            `interviewAContext_${index}`
                          )}
                        />
                      </div>
                      <div className="d-flex justify-content-between align-items-center ms-2">
                        <span className="col-4">맥락일치 여부</span>
                        <Selectbox
                          name={`interviewAMatch_${index}`}
                          placeholder="Select..."
                          onChange={({ value }) =>
                            handleItemSave(
                              `interviewAMatch_${index}`,
                              value,
                              true
                            )
                          }
                          items={[
                            { label: '일치', value: '일치' },
                            { label: '불일치', value: '불일치' },
                          ]}
                          value={item.interviewAMatch}
                        />
                      </div>
                      <div className="d-flex justify-content-between align-items-center ms-2">
                        <span className="col-4">다음 질문 필요 여부</span>
                        <Selectbox
                          name={`interviewAType_${index}`}
                          placeholder="Select..."
                          onChange={({ value }) =>
                            handleItemSave(
                              `interviewAType_${index}`,
                              value,
                              true
                            )
                          }
                          items={[
                            { label: '있음', value: '있음' },
                            { label: '없음', value: '없음' },
                          ]}
                          value={item.interviewAType}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          <InterviewQuestionInfoButtons
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
          <InterviewLabelingModal
            isOpen={isOpen}
            onClose={handleClose}
            onItemSave={handleItemSave}
          />
        </FormProvider>
      )}
    </CollapseBox>
  );
}

export default memo(InterviewQuestionInfoModify);
