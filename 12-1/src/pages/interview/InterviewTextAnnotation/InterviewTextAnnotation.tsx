import { Col, Row } from 'reactstrap';
import InterviewTextAnnotationTool from '~/components/annotation/interview/InterviewTextAnnotationTool';
import SelectTextData from '~/components/annotation/interview/SelectTextData';
import ToolHeader from '~/components/annotation/interview/ToolHeader';
import InterviewTextAnnotationContext from '~/libs/contexts/InterviewTextAnnotationContext';
import * as styles from './styles';

function InterviewTextAnnotation() {
  return (
    <div css={styles.container} className="h-100">
      <Row className="gx-0">
        <Col xs={2}>
          <SelectTextData />
        </Col>
        <Col xs={10}>
          <ToolHeader />
          <InterviewTextAnnotationTool />
        </Col>
      </Row>
    </div>
  );
}

export default function AnnotationPage() {
  return (
    <InterviewTextAnnotationContext>
      <InterviewTextAnnotation />
    </InterviewTextAnnotationContext>
  );
}
