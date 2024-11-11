import { memo } from 'react';
import { Container } from 'reactstrap';
import InterviewInspectionDataDetail from '~/components/interview/InterviewInspectionDataDetail';
import Breadcrumb from '~/components/shared/Breadcrumb';
import InterviewProvider from '~/libs/contexts/InterviewTextAnnotationContext';

function InterviewInspectionDetail() {
  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumb title="12-2 인터뷰 데이터" breadcrumbItem="상세보기" />
        <InterviewProvider>
          <InterviewInspectionDataDetail />
        </InterviewProvider>
      </Container>
    </div>
  );
}

export default memo(InterviewInspectionDetail);
