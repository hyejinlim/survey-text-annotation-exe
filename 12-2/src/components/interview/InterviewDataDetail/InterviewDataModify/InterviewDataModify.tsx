import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useParams } from 'react-router';
import { Button } from 'reactstrap';
import { useQuery } from '@tanstack/react-query';
import L from 'lodash';
import * as R from 'ramda';
import { fetchInterviewDetailSelectInfo } from '~/api/fetches/fetchInterview';
import DataCounter from '~/components/form/DataCounter';
import FormItemInput from '~/components/form/FormItemInput';
import FormItemSelect from '~/components/form/FormItemSelect';
import FormItemTagInput from '~/components/form/FormItemTagInput';
import Selectbox from '~/components/shared/Selectbox';
import TextField from '~/components/shared/TextField';
import { useInterviewDetailDataQuery } from '~/hooks';

type Props = {
  data?: any;
  setData?: any;
  readonly?: boolean;
};

function InterviewDataModify({ data, setData, readonly = false }: Props) {
  const methods = useFormContext();
  const { interviewId } = useParams();
  const [count, setCount] = useState<number>(0);

  const { data: interviewData } = useInterviewDetailDataQuery(interviewId!);

  const { data: selectInfo } = useQuery({
    queryKey: ['interviewDetailSelectInfo'],
    queryFn: () =>
      fetchInterviewDetailSelectInfo().then(({ response }) => response.payload),
  });

  const {
    selecttopic,
    selecttopicdt,
    selectsource,
    selectsty,
    selecttype,
    selectgender,
    selectage,
  } = selectInfo || {};

  const defaultValues = useMemo(() => {
    if (interviewData) {
      let intervieweeData = {};
      const pickData = L.pick(interviewData.info, [
        'interviewTitle',
        'interviewPurpose',
        'interviewTopicView',
        'interviewTopicDetailView',
        'interviewKeywordArray',
        'interviewSourceView',
        'interviewStyleView',
        'interviewTypeView',
        'intervieweeGender',
        'intervieweeAge',
        'intervieweeList',
        'interviewStatusText',
      ]);

      // 인터뷰 대상자
      if (interviewData.info.intervieweeList.length > 0) {
        intervieweeData = interviewData.info.intervieweeList.reduce(
          (acc: any, cur: any, index: number) => {
            const {
              intervieweeKey,
              intervieweeGender,
              intervieweeAge,
              intervieweeLocation,
            } = cur;
            const intervieweeKeyData = {
              [`intervieweeKey_${index}`]: intervieweeKey,
            };
            const intervieweeGenderData = {
              [`intervieweeGender_${index}`]: intervieweeGender,
            };
            const intervieweeAgeData = {
              [`intervieweeAge_${index}`]: intervieweeAge,
            };
            const intervieweeLocationData = {
              [`intervieweeLocation_${index}`]: intervieweeLocation,
            };
            return {
              ...acc,
              ...intervieweeKeyData,
              ...intervieweeGenderData,
              ...intervieweeAgeData,
              ...intervieweeLocationData,
            };
          },
          {}
        );
      }

      return { ...pickData, ...intervieweeData };
    }
  }, [interviewData]);

  const handlePlusCount = useCallback(() => {
    setCount((prev) => prev + 1);
    setData((prev: any) => [
      ...prev,
      {
        intervieweeKey: '',
        intervieweeGender: '',
        intervieweeAge: '',
        intervieweeLocation: '',
      },
    ]);
  }, []);

  const handleMinusCount = useCallback(
    (key: string) => {
      const lastIndex = count - 1;
      setCount((prev) => prev - 1);
      setData((prev: any) => {
        prev.pop(); // 마지막 요소 제거
        return [...prev];
      });

      // reset
      if (key === 'interviewee') {
        methods.setValue(`intervieweeKey_${lastIndex}`, '');
        methods.setValue(`intervieweeGender_${lastIndex}`, null);
        methods.setValue(`intervieweeAge_${lastIndex}`, null);
        methods.setValue(`intervieweeLocation_${lastIndex}`, '');
      }
    },
    [count]
  );

  const handleSingleMinusCount = (key: string, index: any) => {
    const originKeyCount = count;
    const currentKeyCount = count - 1;

    data.splice(index, 1);

    setCount(currentKeyCount);
    setData(data);

    if (key === 'interviewee') {
      for (let i = 0; i < originKeyCount; ++i) {
        if (i < currentKeyCount) {
          methods.setValue(`intervieweeKey_${i}`, data[i].intervieweeKey);
          methods.setValue(`intervieweeGender_${i}`, data[i].intervieweeGender);
          methods.setValue(`intervieweeAge_${i}`, data[i].intervieweeAge);
          methods.setValue(
            `intervieweeLocation_${i}`,
            data[i].intervieweeLocation
          );
          continue;
        }
        methods.setValue(`intervieweeKey_${i}`, '');
        methods.setValue(`intervieweeGender_${i}`, '');
        methods.setValue(`intervieweeAge_${i}`, '');
        methods.setValue(`intervieweeLocation_${i}`, '');
      }
    }
  };

  const handleChange = (e: any) => {
    const { name, value } = e;
    const [key, index] = R.split('_', name);
    const newData = data.with(index, { ...data[index], [key]: value });
    setData(newData);
    methods.setValue(name, value);
  };

  const init = () => {
    L.flow(L.toPairs, (data) => {
      L.forEach(data, ([name, value]: any) => {
        methods.register(name);
        methods.setValue(name, value);
      });
    })(defaultValues);
  };

  useEffect(() => {
    if (defaultValues) init();
  }, [defaultValues]);

  useEffect(() => {
    if (interviewData?.info.intervieweeList?.length > 0) {
      setCount(interviewData?.info.intervieweeList?.length);
      const newData = interviewData?.info.intervieweeList.map((item: any) => {
        const {
          intervieweeAgeView,
          intervieweeAgeName,
          intervieweeGenderView,
          intervieweeGenderName,
          ...rest
        } = item;
        return { ...rest };
      });

      setData(newData);
    }
  }, [interviewData]);

  return (
    <>
      {!interviewId ? (
        <div className="p-2">
          <span className="d-flex justify-content-center py-2">
            데이터가 없습니다.
          </span>
        </div>
      ) : (
        <form>
          <div>
            <div className="px-3 py-2">
              <FormItemInput
                label="인터뷰 제목"
                name="interviewTitle"
                readonly={readonly}
              />
              <FormItemInput
                label="인터뷰 목적"
                name="interviewPurpose"
                readonly={readonly}
              />
              <FormItemSelect
                label="인터뷰 주제"
                name="interviewTopicView"
                isMulti={false}
                options={selecttopic}
                readonly={readonly}
              />
              <FormItemSelect
                label="인터뷰 상세주제"
                name="interviewTopicDetailView"
                isMulti={false}
                options={selecttopicdt}
                readonly={readonly}
              />
              <FormItemTagInput
                label="인터뷰 키워드"
                name="interviewKeywordArray"
                placeholder="키워드 입력 후 Enter 해주세요."
                readonly={readonly}
              />
              <FormItemSelect
                label="인터뷰 출처"
                name="interviewSourceView"
                isMulti={false}
                options={selectsource}
                readonly={readonly}
              />
              <FormItemSelect
                label="진행자 성향"
                name="interviewStyleView"
                isMulti={false}
                options={selectsty}
                readonly={readonly}
              />
              <FormItemSelect
                label="인터뷰 종류"
                name="interviewTypeView"
                isMulti={false}
                options={selecttype}
                readonly={readonly}
              />
            </div>
            <div className="px-3 py-2">
              <div className="d-flex justify-content-between py-1 align-items-center">
                <span>인터뷰 대상자</span>
                <DataCounter
                  name="interviewee"
                  value={count}
                  onMinusCount={handleMinusCount}
                  onPlusCount={handlePlusCount}
                  disabled={readonly}
                />
              </div>
              {!L.isEmpty(data) && (
                <div className="ps-2 py-2 d-flex gap-2 flex-column">
                  {data.map((item: any, index: number) => {
                    return (
                      <div key={index} className="d-flex flex-column gap-1">
                        <div className="d-flex justify-content-between align-items-center">
                          <span>대상자 {index + 1}</span>
                          <Button
                            size="sm"
                            onClick={() =>
                              handleSingleMinusCount('interviewee', index)
                            }
                            disabled={readonly}
                          >
                            <i className="fas fa-minus" />
                          </Button>
                        </div>
                        <div className="d-flex justify-content-between align-items-center ms-2">
                          <span className="col-4">대상자 아이디</span>
                          <TextField
                            name={`intervieweeKey_${index}`}
                            value={item.intervieweeKey}
                            onChange={handleChange}
                            readOnly={readonly}
                          />
                        </div>
                        <div className="d-flex justify-content-between align-items-center ms-2">
                          <span className="col-4">대상자 성별</span>
                          <Selectbox
                            name={`intervieweeGender_${index}`}
                            placeholder="Select..."
                            onChange={handleChange}
                            items={selectgender}
                            value={item.intervieweeGender ?? ''}
                            disabled={readonly}
                          />
                        </div>
                        <div className="d-flex justify-content-between align-items-center ms-2">
                          <span className="col-4">대상자 나이</span>
                          <Selectbox
                            name={`intervieweeAge_${index}`}
                            placeholder="Select..."
                            onChange={handleChange}
                            items={selectage}
                            value={item.intervieweeAge ?? ''}
                            disabled={readonly}
                          />
                        </div>
                        <div className="d-flex justify-content-between align-items-center ms-2">
                          <span className="col-4">대상자 지역</span>
                          <TextField
                            name={`intervieweeLocation_${index}`}
                            value={item.intervieweeLocation}
                            onChange={handleChange}
                            readOnly={readonly}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </form>
      )}
    </>
  );
}

export default memo(InterviewDataModify);
