import { memo, useState } from 'react';
import { Col, Row } from 'reactstrap';
import Authority from './Authority';
import GroupList from './GroupList';

function GroupAuthority() {
  const [selectedId, setSelectedId] = useState('');
  return (
    <Row>
      <Col xs={6} lg={3} md={3}>
        <GroupList setSelectedId={setSelectedId} />
      </Col>
      <Col xs={6} lg={9} md={9}>
        <Authority selectedId={selectedId} />
      </Col>
    </Row>
  );
}

export default memo(GroupAuthority);
