import { memo } from 'react';
import { Container } from 'reactstrap';
import GroupAuthority from '~/components/setting/GroupAuthority';
import Guide from '~/components/setting/GroupAuthority/Guide';
import Breadcrumb from '~/components/shared/Breadcrumb';

function AuthoritySetting() {
  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumb title="세팅" breadcrumbItem="권한관리" />
        <Guide />
        <GroupAuthority />
      </Container>
    </div>
  );
}

export default memo(AuthoritySetting);
