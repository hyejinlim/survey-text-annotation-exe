import { memo } from 'react';
import { Container } from 'reactstrap';
import Breadcrumb from '~/components/shared/Breadcrumb';
import SurveyDataDetail from '~/components/survey/SurveyDataDetail';

function SurveyDetail() {
  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumb title="12-1 서베이 데이터" breadcrumbItem="상세보기" />
        <SurveyDataDetail />
      </Container>
    </div>
  );
}

export default memo(SurveyDetail);
