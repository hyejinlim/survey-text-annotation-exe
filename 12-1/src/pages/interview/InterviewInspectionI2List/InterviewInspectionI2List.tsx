import { memo } from 'react';
import { Container } from 'reactstrap';
import InterviewInspectionDataList from '~/components/interview/InterviewInspectionDataList';
import Breadcrumb from '~/components/shared/Breadcrumb';
import { MENU0404 } from '~/constants/menu';

function InterviewInspectionI2List() {
  const queryParams = new URLSearchParams(window.location.search);

  const initData = {
    category: queryParams.get('category') ?? '',
    status: queryParams.get('status') ?? '',
    listType: MENU0404,
    paging: true,
    pageSize: queryParams.get('pageSize') ?? 10,
    curPage: queryParams.get('curPage') ?? 1,
    type: 'I2', // 호출 api 구분 목적
    sv: queryParams.get('sv') ?? '',
  };

  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumb
          title="12-2 인터뷰 데이터"
          breadcrumbItem="데이터 2차 검수"
        />
        <InterviewInspectionDataList initData={initData} />
      </Container>
    </div>
  );
}

export default memo(InterviewInspectionI2List);
