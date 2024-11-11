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
  fetchInterviewLabelingCreate,
  fetchInterviewLabelingDelete,
  fetchInterviewLabelingModify,
  fetchInterviewLabelingSelectInfo,
} from '~/api/fetches/fetchInterview';
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
  labelingRefetch: any;
};

function InterviewQuestionInfoModify({ labelingRefetch }: Props) {
  const {
    interviewId,
    document,
    setSelectedItem,
    setSelectedText,
    setSelectedKey,
  } = useContext(InterviewTextAnnotationContext);
  const { labelingList, labelingPage } = document;
  const [labelingIndex, setLabelingIndex] = useState<number>(0);
  const [page, setPage] = useState<number>(0);
  const [count, setCount] = useState<number>(0);
  const [data, setData] = useState<any>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const currentLabeling =
    typeof labelingList !== 'undefined' ? labelingList[labelingIndex] : {};

  const { data: selectInfo } = useQuery({
    queryKey: ['interviewLabelingSelectInfo'],
    queryFn: () =>
      fetchInterviewLabelingSelectInfo().then(
        ({ response }) => response.payload
      ),
    enabled: document !== undefined,
  });

  const createMutation = useMutation(fetchInterviewLabelingCreate, {
    onSuccess: (data: any) => {
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
    },
  });

  const modifyMutation = useMutation(fetchInterviewLabelingModify, {
    onSuccess: (data: any) => {
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
    },
  });

  const deleteMutation = useMutation(fetchInterviewLabelingDelete, {
    onSuccess: () => {
      labelingRefetch();
    },
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
      const lastIndex = count - 1;
      setCount((prev) => prev - 1);
      setData((prev: any) => {
        prev.pop(); // 마지막 요소 제거
        return [...prev];
      });

      // reset
      if (key === 'interviewAnswer') {
        methods.setValue(`interviewAKey_${lastIndex}`, '');
        methods.setValue(`interviewAContext_${lastIndex}`, '');
        methods.setValue(`interviewAMatch_${lastIndex}`, '');
        methods.setValue(`interviewAType_${lastIndex}`, '');
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
          methods.setValue(`interviewAKey_${i}`, data[i].interviewAKey);
          methods.setValue(`interviewAContext_${i}`, data[i].interviewAContext);
          methods.setValue(`interviewAMatch_${i}`, data[i].interviewAMatch);
          methods.setValue(`interviewAType_${i}`, data[i].interviewAType);
          continue;
        }
        methods.setValue(`interviewAKey_${i}`, '');
        methods.setValue(`interviewAContext_${i}`, '');
        methods.setValue(`interviewAMatch_${i}`, '');
        methods.setValue(`interviewAType_${i}`, '');
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
          interviewId,
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

  const handleLabelingSave = (values: any) => {
    const {
      labelingId,
      interviewTurnId,
      interviewQContext,
      interviewQTypeView,
      interviewQPurp,
      interviewQPost,
    } = values;

    const params = {
      interviewId,
      interviewTurnId,
      interviewQContext,
      interviewQType: interviewQTypeView?.value,
      interviewQPurp,
      interviewQPost,
      interviewAnswerList: data,
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
    let interviewAnswerData = {};

    if (labelingList?.[labelingIndex]) {
      const {
        createDatetime,
        createMember,
        createMemberName,
        updateDatetime,
        updateMember,
        updateMemberName,
        interviewAnswerList,
        ...rest
      } = currentLabeling;

      // 답변 정보
      if (interviewAnswerList?.length > 0) {
        interviewAnswerData = interviewAnswerList.reduce(
          (acc: any, cur: any, index: number) => {
            const {
              interviewAKey,
              interviewAContext,
              interviewAMatch,
              interviewAType,
            } = cur;
            const interviewAKeyData = {
              [`interviewAKey_${index}`]: interviewAKey,
            };
            const interviewAContextData = {
              [`interviewAContext_${index}`]: interviewAContext,
            };
            const interviewAMatchData = {
              [`interviewAMatch_${index}`]: interviewAMatch,
            };
            const interviewATypeData = {
              [`interviewAType_${index}`]: interviewAType,
            };
            return {
              ...acc,
              ...interviewAKeyData,
              ...interviewAContextData,
              ...interviewAMatchData,
              ...interviewATypeData,
            };
          },
          {}
        );
      }
      return { ...rest, ...interviewAnswerData };
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
      methods.reset(); // 이전 values reset
      init();
    }
  }, [defaultValues]);

  useEffect(() => {
    if (currentLabeling) {
      if (currentLabeling.labelingId) {
        setCount(currentLabeling?.interviewAnswerList?.length);
        const newData = currentLabeling?.interviewAnswerList.map(
          (item: any) => {
            const {
              interviewAMatchView,
              interviewAMatchName,
              interviewATypeView,
              interviewATypeName,
              ...rest
            } = item;
            return { ...rest };
          }
        );
        setData(newData);
      } else {
        setCount(0);
        setData([]);
      }
    }
  }, [currentLabeling, labelingIndex]);

  return (
    <CollapseBox title="문항별 정보" isOpen={true}>
      <FormProvider {...methods}>
        <form>
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
              name="interviewQTypeView"
              isMulti={false}
              options={selectInfo?.interviewqtype}
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
                          items={selectInfo?.interviewamatch}
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
                          items={selectInfo?.interviewatype}
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
            labelingId={currentLabeling?.labelingId}
            labelingIndex={labelingIndex}
            setLabelingIndex={setLabelingIndex}
            onDelete={handleDelete}
            onSave={methods.handleSubmit(handleLabelingSave)}
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
        <InterviewLabelingModal
          isOpen={isOpen}
          onClose={handleClose}
          onItemSave={handleItemSave}
        />
      </FormProvider>
    </CollapseBox>
  );
}

export default memo(InterviewQuestionInfoModify);
