import { memo } from 'react';
import { Container } from 'reactstrap';
import Breadcrumb from '~/components/shared/Breadcrumb';
import SurveyDataList from '~/components/survey/SurveyDataList';
import { MENU0302 } from '~/constants/menu';

function SurveyList() {
  const queryParams = new URLSearchParams(window.location.search);

  const initData = {
    category: queryParams.get('category') ?? '',
    status: queryParams.get('status') ?? '',
    listType: MENU0302,
    paging: true,
    pageSize: queryParams.get('pageSize') ?? 10,
    curPage: queryParams.get('curPage') ?? 1,
    sv: queryParams.get('sv') ?? '',
  };

  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumb
          title="12-1 서베이 데이터"
          breadcrumbItem="원시데이터 리스트"
        />
        <SurveyDataList initData={initData} />
      </Container>
    </div>
  );
}

export default memo(SurveyList);
