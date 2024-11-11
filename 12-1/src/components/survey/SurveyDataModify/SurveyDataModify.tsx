import { memo, useContext } from 'react';
import FormItemInput from '~/components/form/FormItemInput';
import FormItemSelect from '~/components/form/FormItemSelect';
import FormItemTagInput from '~/components/form/FormItemTagInput';
import { SurveyTextAnnotationContext } from '~/libs/contexts/SurveyTextAnnotationContext';

type Props = {
  readonly?: boolean;
};

function SurveyDataModify({ readonly = false }: Props) {
  const { document } = useContext(SurveyTextAnnotationContext);
  const { info } = document;
  const { surveyText } = info || {};

  return (
    <>
      {!surveyText ? (
        <div className="p-2">
          <span className="d-flex justify-content-center py-2">
            데이터가 없습니다.
          </span>
        </div>
      ) : (
        <form>
          <div>
            <div className="px-3 py-2">
              <FormItemInput label="설문 목적" name="surveyPurpose" />
              <FormItemSelect
                label="설문 방법"
                name="surveyMethod"
                isMulti={false}
                options={[
                  {
                    label: '10대',
                    value: 'surveyage001',
                  },
                  {
                    label: '20대',
                    value: 'surveyage002',
                  },
                  {
                    label: '30대',
                    value: 'surveyage003',
                  },
                  {
                    label: '40대',
                    value: 'surveyage004',
                  },
                  {
                    label: '50대',
                    value: 'surveyage005',
                  },
                  {
                    label: '60대 이상',
                    value: 'surveyage006',
                  },
                ]}
              />
              <FormItemSelect
                label="산업 분야"
                name="surveyIndustry"
                isMulti={false}
                options={[
                  {
                    label: '소비재',
                    value: 'surveyindustry001',
                  },
                  {
                    label: '내구재',
                    value: 'surveyindustry002',
                  },
                  {
                    label: '헬스케어',
                    value: 'surveyindustry003',
                  },
                  {
                    label: '서비스',
                    value: 'surveyindustry004',
                  },
                ]}
              />
            </div>
            <div className="bg-light-subtle px-3 py-2">설문 주제</div>
            <div className="px-3 py-2">
              <FormItemSelect
                label="설문 주제"
                name="surveyTopic"
                isMulti={false}
                options={[
                  {
                    label: '소비자 이해',
                    value: 'surveytopic001',
                  },
                  {
                    label: '소비자 만족도',
                    value: 'surveytopic002',
                  },
                  {
                    label: '매체/브랜드',
                    value: 'surveytopic003',
                  },
                  {
                    label: '제품 개발',
                    value: 'surveytopic004',
                  },
                  {
                    label: '기업평가',
                    value: 'surveytopic005',
                  },
                  {
                    label: '사회 및 공공 조사',
                    value: 'surveytopic006',
                  },
                  {
                    label: '학술',
                    value: 'surveytopic007',
                  },
                ]}
              />
              <FormItemSelect
                label="세부 설문 주제"
                name="surveyTopicDetail"
                isMulti={false}
                options={[
                  {
                    label: '라이프 스타일',
                    value: 'surveytopicdt001',
                  },
                  {
                    label: 'U&A(이용행태)',
                    value: 'surveytopicdt002',
                  },
                  {
                    label: '구매행태',
                    value: 'surveytopicdt003',
                  },
                  {
                    label: '고객 만족도',
                    value: 'surveytopicdt004',
                  },
                  {
                    label: '광고효과',
                    value: 'surveytopicdt005',
                  },
                  {
                    label: '브랜드인지/진단',
                    value: 'surveytopicdt006',
                  },
                  {
                    label: '사용성UX',
                    value: 'surveytopicdt007',
                  },
                  {
                    label: '컨셉/제품테스트',
                    value: 'surveytopicdt008',
                  },
                  {
                    label: '기업평판',
                    value: 'surveytopicdt009',
                  },
                  {
                    label: '직원 만족도',
                    value: 'surveytopicdt010',
                  },
                  {
                    label: '사회현안',
                    value: 'surveytopicdt011',
                  },
                  {
                    label: '정책평가',
                    value: 'surveytopicdt012',
                  },
                  {
                    label: '행정서비스 평가',
                    value: 'surveytopicdt013',
                  },
                  {
                    label: '정책수요',
                    value: 'surveytopicdt014',
                  },
                  {
                    label: '심리 사회과학',
                    value: 'surveytopicdt015',
                  },
                  {
                    label: '의학',
                    value: 'surveytopicdt016',
                  },
                ]}
              />
              <FormItemTagInput
                label="설문지 키워드"
                name="surveyKeyword"
                placeholder="키워드 입력 후 Enter 해주세요."
              />
              <FormItemInput label="설문지 제목" name="surveyTitle" />
              <FormItemInput label="설문지 출처" name="surveySource" />
              <FormItemInput
                label="설문 문항 개수"
                name="surveyQuesNum"
                type="number"
              />
            </div>
            <div className="bg-light-subtle px-3 py-2">척도 정보</div>
            <div className="px-3 py-2">
              <FormItemInput label="척도 채점 방법" name="surveyCalculation" />
              <FormItemInput label="척도 해석 기준" name="surveyCutoff" />
              <FormItemInput label="척도 신뢰도" name="surveyCredibility" />
              <FormItemInput label="척도 타당도" name="surveyValidity" />
            </div>
            <div className="bg-light-subtle px-3 py-2">조사대상자 정보</div>
            <div className="px-3 py-2">
              <FormItemSelect
                label="조사 대상자 성별"
                name="surveyGender"
                isMulti={false}
                options={[
                  {
                    label: '남',
                    value: 'surveygender001',
                  },
                  {
                    label: '여',
                    value: 'surveygender002',
                  },
                  {
                    label: '무응답',
                    value: 'surveygender900',
                  },
                ]}
              />
              <FormItemSelect
                label="조사 대상자 나이"
                name="surveyAge"
                options={[
                  {
                    label: '10대',
                    value: 'surveyage001',
                  },
                  {
                    label: '20대',
                    value: 'surveyage002',
                  },
                  {
                    label: '30대',
                    value: 'surveyage003',
                  },
                  {
                    label: '40대',
                    value: 'surveyage004',
                  },
                  {
                    label: '50대',
                    value: 'surveyage005',
                  },
                  {
                    label: '60대 이상',
                    value: 'surveyage006',
                  },
                ]}
              />
              <FormItemInput label="조사 대상자 지역" name="surveyLocation" />
            </div>
          </div>
        </form>
      )}
    </>
  );
}

export default memo(SurveyDataModify);
