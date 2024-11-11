import { memo } from 'react';
import { Container } from 'reactstrap';
import InterviewDataUpload from '~/components/interview/InterviewDataUpload';
import Breadcrumb from '~/components/shared/Breadcrumb';

function InterviewUpload() {
  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumb title="12-2 인터뷰 데이터" breadcrumbItem="데이터 등록" />
        <InterviewDataUpload />
      </Container>
    </div>
  );
}
export default memo(InterviewUpload);
