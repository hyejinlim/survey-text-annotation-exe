import { memo } from 'react';
import { Container } from 'reactstrap';
import InterviewDataDetail from '~/components/interview/InterviewDataDetail';
import Breadcrumb from '~/components/shared/Breadcrumb';

function InterviewDetail() {
  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumb title="12-2 인터뷰 데이터" breadcrumbItem="상세보기" />
        <InterviewDataDetail />
      </Container>
    </div>
  );
}

export default memo(InterviewDetail);
