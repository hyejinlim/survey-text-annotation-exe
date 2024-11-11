import { memo, useContext } from 'react';
import FormItemText from '~/components/form/FormItemText';
import CollapseBox from '~/components/shared/CollapseBox';
import { SurveyTextAnnotationContext } from '~/libs/contexts/SurveyTextAnnotationContext';

function SurveyInfo() {
  const { document } = useContext(SurveyTextAnnotationContext);
  const { info } = document || {};
  const {
    surveyPurpose,
    surveyMethodName,
    surveyIndustryName,
    surveyTopicName,
    surveyTopicDetailName,
    surveyKeywordName,
    surveyTitle,
    surveySource,
    surveyQuesNum,
    surveyCalculation,
    surveyCutoff,
    surveyCredibility,
    surveyValidity,
    surveyGenderName,
    surveyAgeName,
    surveyLocation,
  } = info || {};

  return (
    <CollapseBox title="설문지 정보" isOpen={false}>
      <div>
        <div className="px-3 py-2">
          <FormItemText label="설문 목적" value={surveyPurpose} />
          <FormItemText label="설문 방법" value={surveyMethodName} />
          <FormItemText label="산업 분야" value={surveyIndustryName} />
        </div>
        <div className="bg-light-subtle px-3 py-2">설문 주제</div>
        <div className="px-3 py-2">
          <FormItemText label="설문 주제" value={surveyTopicName} />
          <FormItemText label="세부 설문 주제" value={surveyTopicDetailName} />
          <FormItemText label="설문지 키워드" value={surveyKeywordName} />
          <FormItemText label="설문지 제목" value={surveyTitle} />
          <FormItemText label="설문지 출처" value={surveySource} />
          <FormItemText label="설문 문항 개수" value={surveyQuesNum} />
        </div>
        <div className="bg-light-subtle px-3 py-2">척도 정보</div>
        <div className="px-3 py-2">
          <FormItemText label="척도 채점 방법" value={surveyCalculation} />
          <FormItemText label="척도 해석 기준" value={surveyCutoff} />
          <FormItemText label="척도 신뢰도" value={surveyCredibility} />
          <FormItemText label="척도 타당도" value={surveyValidity} />
        </div>
        <div className="bg-light-subtle px-3 py-2">조사대상자 정보</div>
        <div className="px-3 py-2">
          <FormItemText label="조사 대상자 성별" value={surveyGenderName} />
          <FormItemText label="조사 대상자 나이" value={surveyAgeName} />
          <FormItemText label="조사 대상자 지역" value={surveyLocation} />
        </div>
      </div>
    </CollapseBox>
  );
}

export default memo(SurveyInfo);
