import { memo } from 'react';
import { useParams } from 'react-router-dom';
import { Container } from 'reactstrap';
import Authority from '~/components/setting/GroupAuthority/Authority';
import Breadcrumb from '~/components/shared/Breadcrumb';

function MemberAuthority() {
  const { mid } = useParams();
  const selectedId = { id: mid };

  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumb title="회원" breadcrumbItem="회원 개별 권한 설정" />
        <Authority selectedId={selectedId} />
      </Container>
    </div>
  );
}
export default memo(MemberAuthority);
