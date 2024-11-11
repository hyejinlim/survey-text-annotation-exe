import { useContext, useEffect, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Col, Row } from 'reactstrap';
import L from 'lodash';
import SelectTextData from '~/components/annotation/survey/SelectTextData';
import SurveyTextAnnotationTool from '~/components/annotation/survey/SurveyTextAnnotationTool';
import ToolHeader from '~/components/annotation/survey/ToolHeader';
import SurveyTextAnnotationContext, {
  SurveyTextAnnotationContext as Context,
} from '~/libs/contexts/SurveyTextAnnotationContext';
import * as styles from './styles';

function SurveyTextAnnotation() {
  const { reset } = useContext(Context);

  const methods = useForm();
  methods.watch();

  const defaultValues = useMemo(() => {
    return {
      surveyPurpose: '',
      surveyMethod: null,
      surveyIndustry: null,
      surveyTopic: null,
      surveyTopicDetail: null,
      surveyTitle: '',
      surveySource: '',
      surveyQuesNum: '',
      surveyCalculation: '',
      surveyCutoff: '',
      surveyCredibility: '',
      surveyValidity: '',
      surveyGender: null,
      surveyAge: null,
      surveyLocation: '',
      surveyKeyword: [],
    };
  }, [reset]);

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

  return (
    <div css={styles.container} className="h-100">
      <Row className="gx-0">
        <Col xs={2}>
          <SelectTextData />
        </Col>
        <Col xs={10}>
          <FormProvider {...methods}>
            <ToolHeader />
            <SurveyTextAnnotationTool />
          </FormProvider>
        </Col>
      </Row>
    </div>
  );
}

export default function AnnotationPage() {
  return (
    <SurveyTextAnnotationContext>
      <SurveyTextAnnotation />
    </SurveyTextAnnotationContext>
  );
}
