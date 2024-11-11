import { memo } from 'react';
import { Container } from 'reactstrap';
import Breadcrumb from '~/components/shared/Breadcrumb';
import SurveyInspectionDataDetail from '~/components/survey/SurveyInspectionDataDetail';
import SurveyProvider from '~/libs/contexts/SurveyTextAnnotationContext';

function SurveyInspectionDetail() {
  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumb title="12-1 서베이 데이터" breadcrumbItem="상세보기" />
        <SurveyProvider>
          <SurveyInspectionDataDetail />
        </SurveyProvider>
      </Container>
    </div>
  );
}

export default memo(SurveyInspectionDetail);
