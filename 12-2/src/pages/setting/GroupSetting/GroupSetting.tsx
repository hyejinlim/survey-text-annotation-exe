import { memo } from 'react';
import { Container } from 'reactstrap';
import Group from '~/components/setting/Group';
import Guide from '~/components/setting/Group/Guide';
import Breadcrumb from '~/components/shared/Breadcrumb';

function GroupSetting() {
  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumb title="세팅" breadcrumbItem="그룹관리" />
        <Guide />
        <Group />
      </Container>
    </div>
  );
}

export default memo(GroupSetting);
