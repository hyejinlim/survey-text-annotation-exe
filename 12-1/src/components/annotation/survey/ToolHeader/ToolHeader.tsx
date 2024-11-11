import { memo, useContext } from 'react';
import { useFormContext } from 'react-hook-form';
import { Button } from 'reactstrap';
import { SurveyTextAnnotationContext } from '~/libs/contexts/SurveyTextAnnotationContext';
import * as styles from './styles';

function ToolHeader() {
  const methods = useFormContext();
  const { document } = useContext(SurveyTextAnnotationContext);
  const { info } = document;

  const handleClick = (values: any) => {
    console.log('values', values);
    const {
      surveyPurpose,
      surveyMethod,
      surveyIndustry,
      surveyTopic,
      surveyTopicDetail,
      surveyKeyword,
      surveyCalculation,
      surveyCutoff,
      surveyCredibility,
      surveyValidity,
      surveyGender,
      surveyAge,
      surveyLocation,
    } = values;
    const jsonData = {
      survey_info: {
        id: '',
        survey_purpose: surveyPurpose,
        method: surveyMethod?.label,
        industry: surveyIndustry?.label,
        topic: {
          topic: surveyTopic?.label,
          topic_detailed: surveyTopicDetail?.label,
        },
        keyword: surveyKeyword,
        q_result: {
          calculation: surveyCalculation,
          cutoff: surveyCutoff,
          credibility: surveyCredibility,
          validity: surveyValidity,
        },
        target_info: {
          gender: surveyGender?.label,
          age: surveyAge?.map(({ label }: any) => label),
          location: surveyLocation,
        },
      },
    };

    console.log('jsonData', jsonData);
  };

  return (
    <div css={styles.header}>
      <div className="font-size-20 fw-semibold">[12-1] {info?.surveyTitle}</div>
      <Button color="primary" onClick={methods.handleSubmit(handleClick)}>
        설문지 작업 완료
      </Button>
    </div>
  );
}

export default memo(ToolHeader);
