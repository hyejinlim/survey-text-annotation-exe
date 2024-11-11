import { memo } from 'react';
import { Container } from 'reactstrap';
import Breadcrumb from '~/components/shared/Breadcrumb';
import SurveyDataUpload from '~/components/survey/SurveyDataUpload';

function SurveyUpload() {
  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumb title="12-1 서베이 데이터" breadcrumbItem="데이터 등록" />
        <SurveyDataUpload />
      </Container>
    </div>
  );
}

export default memo(SurveyUpload);
