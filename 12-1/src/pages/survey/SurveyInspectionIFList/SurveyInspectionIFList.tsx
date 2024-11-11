import { memo } from 'react';
import { Container } from 'reactstrap';
import Breadcrumb from '~/components/shared/Breadcrumb';
import SurveyInspectionDataList from '~/components/survey/SurveyInspectionDataList';
import { MENU0305 } from '~/constants/menu';

function SurveyInspectionIFList() {
  const queryParams = new URLSearchParams(window.location.search);

  const initData = {
    category: queryParams.get('category') ?? '',
    status: queryParams.get('status') ?? '',
    listType: MENU0305,
    paging: true,
    pageSize: queryParams.get('pageSize') ?? 10,
    curPage: queryParams.get('curPage') ?? 1,
    type: 'F', // 호출 api 구분 목적
    sv: queryParams.get('sv') ?? '',
  };

  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumb
          title="12-1 서베이 데이터"
          breadcrumbItem="의미정확성 검수"
        />
        <SurveyInspectionDataList initData={initData} />
      </Container>
    </div>
  );
}

export default memo(SurveyInspectionIFList);
