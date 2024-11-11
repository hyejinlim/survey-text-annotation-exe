import { memo } from 'react';
import { Container } from 'reactstrap';
import Breadcrumb from '~/components/shared/Breadcrumb';

function InterviewSemanticAccuracy() {
  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumb
          title="12-2 인터뷰 데이터"
          breadcrumbItem="의미정확성 검수"
        />
      </Container>
    </div>
  );
}

export default memo(InterviewSemanticAccuracy);
