import { memo, useEffect, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import L from 'lodash';
import { fetchSurveyDetailSelectInfo } from '~/api/fetches/fetchSurvey';
import FormItemInput from '~/components/form/FormItemInput';
import FormItemSelect from '~/components/form/FormItemSelect';
import FormItemTagInput from '~/components/form/FormItemTagInput';
import { useSurveyDetailDataQuery } from '~/hooks';

type Props = {
  readonly?: boolean;
};

function SurveyDataModify({ readonly = false }: Props) {
  const methods = useFormContext();
  const { surveyId } = useParams();
  const { data: surveyData } = useSurveyDetailDataQuery(surveyId!);

  const { data: selectInfo } = useQuery({
    queryKey: ['surveyDetailSelectInfo'],
    queryFn: () =>
      fetchSurveyDetailSelectInfo().then(({ response }) => response.payload),
  });

  const {
    surveymethod,
    surveyindustry,
    surveytopic,
    surveytopicDetail,
    surveygender,
    surveyage,
  } = selectInfo || {};

  const defaultValues = useMemo(() => {
    if (surveyData) {
      const pickData = L.pick(surveyData.info, [
        'surveyPurpose',
        'surveyMethodView',
        'surveyIndustryView',
        'surveyTopicView',
        'surveyTopicDetailView',
        'surveyTitle',
        'surveySource',
        'surveyQuesNum',
        'surveyCalculation',
        'surveyCutoff',
        'surveyCredibility',
        'surveyValidity',
        'surveyGenderView',
        'surveyAgeView',
        'surveyLocation',
        'surveyStatusText',
        'surveyKeywordArray',
      ]);
      return pickData;
    }
  }, [surveyData]);

  const init = () => {
    L.flow(L.toPairs, (data) => {
      L.forEach(data, ([name, value]: any) => {
        methods.register(name);
        methods.setValue(name, value);
      });
    })(defaultValues);
  };

  console.log('defaultValues', defaultValues);

  useEffect(() => {
    if (defaultValues) init();
  }, [defaultValues]);

  return (
    <>
      {!surveyId ? (
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
                label="설문 목적"
                name="surveyPurpose"
                readonly={readonly}
              />
              <FormItemSelect
                label="설문 방법"
                name="surveyMethodView"
                isMulti={false}
                options={surveymethod}
                readonly={readonly}
              />
              <FormItemSelect
                label="산업 분야"
                name="surveyIndustryView"
                isMulti={false}
                options={surveyindustry}
                readonly={readonly}
              />
            </div>
            <div className="bg-light-subtle px-3 py-2">설문 주제</div>
            <div className="px-3 py-2">
              <FormItemSelect
                label="설문 주제"
                name="surveyTopicView"
                isMulti={false}
                options={surveytopic}
                readonly={readonly}
              />
              <FormItemSelect
                label="세부 설문 주제"
                name="surveyTopicDetailView"
                isMulti={false}
                options={surveytopicDetail}
                readonly={readonly}
              />
              <FormItemTagInput
                label="설문지 키워드"
                name="surveyKeywordArray"
                placeholder="키워드 입력 후 Enter 해주세요."
                readonly={readonly}
              />
              <FormItemInput
                label="설문지 제목"
                name="surveyTitle"
                readonly={readonly}
              />
              <FormItemInput
                label="설문지 출처"
                name="surveySource"
                readonly={readonly}
              />
              <FormItemInput
                label="설문 문항 개수"
                name="surveyQuesNum"
                type="number"
                readonly={readonly}
              />
            </div>
            <div className="bg-light-subtle px-3 py-2">척도 정보</div>
            <div className="px-3 py-2">
              <FormItemInput
                label="척도 채점 방법"
                name="surveyCalculation"
                readonly={readonly}
              />
              <FormItemInput
                label="척도 해석 기준"
                name="surveyCutoff"
                readonly={readonly}
              />
              <FormItemInput
                label="척도 신뢰도"
                name="surveyCredibility"
                readonly={readonly}
              />
              <FormItemInput
                label="척도 타당도"
                name="surveyValidity"
                readonly={readonly}
              />
            </div>
            <div className="bg-light-subtle px-3 py-2">조사대상자 정보</div>
            <div className="px-3 py-2">
              <FormItemSelect
                label="조사 대상자 성별"
                name="surveyGenderView"
                isMulti={false}
                options={surveygender}
                readonly={readonly}
              />
              <FormItemSelect
                label="조사 대상자 나이"
                name="surveyAgeView"
                options={surveyage}
                readonly={readonly}
              />
              <FormItemInput
                label="조사 대상자 지역"
                name="surveyLocation"
                readonly={readonly}
              />
            </div>
          </div>
        </form>
      )}
    </>
  );
}

export default memo(SurveyDataModify);
