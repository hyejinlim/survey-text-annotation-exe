import { useState, memo } from 'react';
import { Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import clsx from 'clsx';
import FunctionAuthority from './FunctionAuthority';
import MenuAuthority from './MenuAuthority';
import * as styles from './styles';

type Props = {
  selectedId: any;
};

function Authority({ selectedId }: Props) {
  const [menu, setMenu] = useState<string>('MENU');

  const handleTab = (tab: string) => {
    if (menu !== tab) setMenu(tab);
  };

  return (
    <div>
      <Nav pills className="navtab-bg nav-justified mb-4" css={styles.menu}>
        <NavItem>
          <NavLink
            className={clsx({ active: menu === 'MENU' })}
            onClick={() => handleTab('MENU')}
          >
            메뉴권한
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={clsx({ active: menu === 'FUNCTION' })}
            onClick={() => handleTab('FUNCTION')}
          >
            기능권한
          </NavLink>
        </NavItem>
      </Nav>

      {selectedId ? (
        <TabContent activeTab={menu}>
          <TabPane tabId="MENU">
            <MenuAuthority mid={selectedId.id} />
          </TabPane>
          <TabPane tabId="FUNCTION">
            <FunctionAuthority mid={selectedId.id} />
          </TabPane>
        </TabContent>
      ) : (
        <div
          className="d-flex justify-content-center align-items-center text-center"
          css={styles.info}
        >
          <h5>
            선택된 회원이 없습니다. <br /> 좌측메뉴에서 회원을 먼저 선택해
            주세요
          </h5>
        </div>
      )}
    </div>
  );
}

export default memo(Authority);
