import { memo } from 'react';
import { Container } from 'reactstrap';
import Breadcrumb from '~/components/shared/Breadcrumb';
import BoardForm from '../../components/BoardForm';

function NoticeCreate() {
  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumb title="게시판" breadcrumbItem="공지사항 작성" />
        <BoardForm textSubmit="생성" create={true} formType="notice" />
      </Container>
    </div>
  );
}

export default memo(NoticeCreate);
