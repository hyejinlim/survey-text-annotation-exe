import { memo } from 'react';
import { Container } from 'reactstrap';
import Breadcrumb from '~/components/shared/Breadcrumb';
import SurveyInspectionDataList from '~/components/survey/SurveyInspectionDataList';
import { MENU0303 } from '~/constants/menu';

function SurveyInspectionI1List() {
  const queryParams = new URLSearchParams(window.location.search);

  const initData = {
    category: queryParams.get('category') ?? '',
    status: queryParams.get('status') ?? '',
    listType: MENU0303,
    paging: true,
    pageSize: queryParams.get('pageSize') ?? 10,
    curPage: queryParams.get('curPage') ?? 1,
    type: 'I1', // 호출 api 구분 목적
    sv: queryParams.get('sv') ?? '',
  };

  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumb
          title="12-1 서베이 데이터"
          breadcrumbItem="데이터 1차 검수"
        />
        <SurveyInspectionDataList initData={initData} />
      </Container>
    </div>
  );
}

export default memo(SurveyInspectionI1List);
