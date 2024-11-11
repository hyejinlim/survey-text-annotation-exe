import { Col, Row } from 'reactstrap';
import SelectTextData from '~/components/annotation/survey/SelectTextData';
import SurveyTextAnnotationTool from '~/components/annotation/survey/SurveyTextAnnotationTool';
import ToolHeader from '~/components/annotation/survey/ToolHeader';
import SurveyTextAnnotationContext from '~/libs/contexts/SurveyTextAnnotationContext';
import * as styles from './styles';

function SurveyTextAnnotation() {
  return (
    <div css={styles.container} className="h-100">
      <Row className="gx-0">
        <Col xs={2}>
          <SelectTextData />
        </Col>
        <Col xs={10}>
          <ToolHeader />
          <SurveyTextAnnotationTool />
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
