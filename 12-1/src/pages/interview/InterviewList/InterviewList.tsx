import { memo } from 'react';
import { Container } from 'reactstrap';
import InterviewDataList from '~/components/interview/InterviewDataList/InterviewDataList';
import Breadcrumb from '~/components/shared/Breadcrumb';
import { MENU0402 } from '~/constants/menu';

function InterviewList() {
  const queryParams = new URLSearchParams(window.location.search);

  const initData = {
    category: queryParams.get('category') ?? '',
    status: queryParams.get('status') ?? '',
    listType: MENU0402,
    paging: true,
    pageSize: queryParams.get('pageSize') ?? 10,
    curPage: queryParams.get('curPage') ?? 1,
    sv: queryParams.get('sv') ?? '',
  };

  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumb
          title="12-2 인터뷰 데이터"
          breadcrumbItem="원시데이터 리스트"
        />
        <InterviewDataList initData={initData} />
      </Container>
    </div>
  );
}

export default memo(InterviewList);
