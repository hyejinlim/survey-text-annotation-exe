import { Container } from 'reactstrap';
import Breadcrumb from '~/components/shared/Breadcrumb';
import BoardForm from '../../components/BoardForm';

function QnaCreate() {
  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumb title="게시판" breadcrumbItem="QnA 작성" />
        <BoardForm textSubmit="생성" formType="qna" create={true} />
      </Container>
    </div>
  );
}

export default QnaCreate;
