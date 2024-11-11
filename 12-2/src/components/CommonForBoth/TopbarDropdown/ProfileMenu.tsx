import { useState, useEffect, memo } from 'react';
import { Link } from 'react-router-dom';
import { Dropdown, DropdownToggle, DropdownMenu } from 'reactstrap';

function ProfileMenu() {
  const [menu, setMenu] = useState<boolean>(false);
  const [username, setusername] = useState('Admin');

  useEffect(() => {
    const getAuthUser = localStorage.getItem('user');

    if (getAuthUser) {
      const userObj = JSON.parse(getAuthUser);
      setusername(userObj.memberName);
    }
  }, []);

  return (
    <Dropdown
      isOpen={menu}
      toggle={() => setMenu(!menu)}
      className="d-inline-block"
    >
      <DropdownToggle
        className="btn header-item bg-soft-light border-start border-end"
        id="page-header-user-dropdown"
        tag="button"
      >
        <span className="d-none d-xl-inline-block ms-2 me-1">{username}</span>
        <i className="mdi mdi-chevron-down d-none d-xl-inline-block" />
      </DropdownToggle>
      <DropdownMenu className="dropdown-menu-end">
        <Link to="/logout" className="dropdown-item">
          <i className="bx bx-power-off font-size-16 align-middle me-1 text-danger" />
          <span>Logout</span>
        </Link>
      </DropdownMenu>
    </Dropdown>
  );
}

export default memo(ProfileMenu);
