import { memo } from 'react';
import { Col, Container, Row } from 'reactstrap';
import WorkBoardForm from '~/components/setting/WorkBoardForm';
import Breadcrumb from '~/components/shared/Breadcrumb';

function WorkBoard() {
  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumb title="세팅" breadcrumbItem="작업할당" />
        <Row>
          <Col xl={7}>
            <WorkBoardForm type="LABELING" />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default memo(WorkBoard);
