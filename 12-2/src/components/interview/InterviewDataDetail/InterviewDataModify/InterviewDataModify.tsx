import { memo, useCallback, useContext, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Button } from 'reactstrap';
import L from 'lodash';
import * as R from 'ramda';
import DataCounter from '~/components/form/DataCounter';
import FormItemInput from '~/components/form/FormItemInput';
import FormItemSelect from '~/components/form/FormItemSelect';
import FormItemTagInput from '~/components/form/FormItemTagInput';
import Selectbox from '~/components/shared/Selectbox';
import TextField from '~/components/shared/TextField';
import { InterviewTextAnnotationContext } from '~/libs/contexts/InterviewTextAnnotationContext';

type Props = {
  data?: any;
  setData?: any;
  readonly?: boolean;
};

function InterviewDataModify({
  data: dataTest,
  setData: setDataTest,
  readonly = false,
}: Props) {
  const methods = useFormContext();
  const { document } = useContext(InterviewTextAnnotationContext);
  const { info } = document;
  const { interviewText } = info || {};

  const [count, setCount] = useState<number>(0);
  const [data, setData] = useState<any>([]); // 인터뷰 대상자

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
    methods.setValue('intervieweeList', newData);
  };

  return (
    <>
      {!interviewText ? (
        <div className="p-2">
          <span className="d-flex justify-content-center py-2">
            데이터가 없습니다.
          </span>
        </div>
      ) : (
        <form>
          <div>
            <div className="px-3 py-2">
              <FormItemInput label="인터뷰 제목" name="interviewTitle" />
              <FormItemInput label="인터뷰 목적" name="interviewPurpose" />
              <FormItemSelect
                label="인터뷰 주제"
                name="interviewTopic"
                isMulti={false}
                options={[
                  {
                    label: '소비자 이해',
                    value: 'interviewtopic001',
                  },
                  {
                    label: '소비자 만족도',
                    value: 'interviewtopic002',
                  },
                  {
                    label: '매채/브랜드',
                    value: 'interviewtopic003',
                  },
                  {
                    label: '제품 개발',
                    value: 'interviewtopic004',
                  },
                  {
                    label: '기업평가',
                    value: 'interviewtopic005',
                  },
                  {
                    label: '사회 및 공공 조사',
                    value: 'interviewtopic006',
                  },
                  {
                    label: '학술',
                    value: 'interviewtopic007',
                  },
                ]}
              />
              <FormItemSelect
                label="인터뷰 상세주제"
                name="interviewTopicDetail"
                isMulti={false}
                options={[
                  {
                    label: '라이프 스타일',
                    value: 'interviewtopicdt001',
                  },
                  {
                    label: 'U&A(이용행태)',
                    value: 'interviewtopicdt002',
                  },
                  {
                    label: '구매행태',
                    value: 'interviewtopicdt003',
                  },
                  {
                    label: '고객 만족도',
                    value: 'interviewtopicdt004',
                  },
                  {
                    label: '광고효과',
                    value: 'interviewtopicdt005',
                  },
                  {
                    label: '브랜드인지/진단',
                    value: 'interviewtopicdt006',
                  },
                  {
                    label: '사용성UX',
                    value: 'interviewtopicdt007',
                  },
                  {
                    label: '컨셉/제품테스트',
                    value: 'interviewtopicdt008',
                  },
                  {
                    label: '기업평판',
                    value: 'interviewtopicdt009',
                  },
                  {
                    label: '직원 만족도',
                    value: 'interviewtopicdt010',
                  },
                  {
                    label: '사회현안',
                    value: 'interviewtopicdt011',
                  },
                  {
                    label: '정책평가',
                    value: 'interviewtopicdt012',
                  },
                  {
                    label: '행정서비스 평가',
                    value: 'interviewtopicdt013',
                  },
                  {
                    label: '정책수요',
                    value: 'interviewtopicdt014',
                  },
                  {
                    label: '심리 사회과학',
                    value: 'interviewtopicdt015',
                  },
                  {
                    label: '의학',
                    value: 'interviewtopicdt016',
                  },
                ]}
              />
              <FormItemTagInput
                label="인터뷰 키워드"
                name="interviewKeyword"
                placeholder="키워드 입력 후 Enter 해주세요."
              />
              <FormItemSelect
                label="인터뷰 출처"
                name="interviewSource"
                isMulti={false}
                options={[
                  {
                    label: '없음',
                    value: 'interviewsource000',
                  },
                  {
                    label: 'Kri',
                    value: 'interviewsource001',
                  },
                  {
                    label: '학술',
                    value: 'interviewsource002',
                  },
                ]}
              />
              <FormItemSelect
                label="진행자 성향"
                name="interviewStyle"
                isMulti={false}
                options={[
                  {
                    label: '설명형',
                    value: 'interviewersty001',
                  },
                  {
                    label: '요약형',
                    value: 'interviewersty002',
                  },
                  {
                    label: '예시형',
                    value: 'interviewersty003',
                  },
                  {
                    label: '기타',
                    value: 'interviewersty900',
                  },
                ]}
              />
              <FormItemSelect
                label="인터뷰 종류"
                name="interviewType"
                isMulti={false}
                options={[
                  {
                    label: 'IDI',
                    value: 'interviewtype001',
                  },
                  {
                    label: 'FGD',
                    value: 'interviewtype002',
                  },
                ]}
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
                            items={[
                              { label: '남', value: '남' },
                              { label: '여', value: '여' },
                              { label: '무관', value: '무관' },
                              { label: '모름', value: '모름' },
                            ]}
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
                            items={[
                              { label: '10대', value: '10대' },
                              { label: '20대', value: '20대' },
                              { label: '30대', value: '30대' },
                              { label: '40대', value: '40대' },
                              { label: '50대', value: '50대' },
                              { label: '60대 이상', value: '60대 이상' },
                              { label: '모름', value: '모름' },
                            ]}
                            value={item.intervieweeAge ?? ''}
                          />
                        </div>
                        <div className="d-flex justify-content-between align-items-center ms-2">
                          <span className="col-4">대상자 지역</span>
                          <TextField
                            name={`intervieweeLocation_${index}`}
                            value={item.intervieweeLocation}
                            onChange={handleChange}
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
