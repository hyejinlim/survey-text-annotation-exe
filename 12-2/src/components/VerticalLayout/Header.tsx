import { memo, useState } from 'react';
import { Link } from 'react-router-dom';
import logoSvg from '~/assets/images/logo-sm.svg';
import ProfileMenu from '../CommonForBoth/TopbarDropdown/ProfileMenu';

function Header() {
  const [isClick, setClick] = useState<boolean>(true);

  /*** Sidebar menu icon and default menu set */
  const handleToogle = () => {
    var body = document.body;
    setClick(!isClick);
    if (isClick) {
      body.classList.add('sidebar-enable');
      document.body.setAttribute('data-sidebar-size', 'sm');
    } else {
      body.classList.remove('sidebar-enable');
      document.body.setAttribute('data-sidebar-size', 'lg');
    }
  };

  return (
    <header id="page-topbar">
      <div className="navbar-header">
        <div className="d-flex">
          <div className="navbar-brand-box">
            <Link to="/dashboard/survey" className="logo logo-dark">
              <span className="logo-sm">
                <img src={logoSvg} alt="" height="24" />
              </span>
              <span className="logo-lg">
                <img src={logoSvg} alt="" height="24" />
                <span className="logo-txt">CMS & Annotation</span>
              </span>
            </Link>
            <Link to="/dashboard/survey" className="logo logo-light">
              <span className="logo-sm">
                <img src={logoSvg} alt="" height="24" />
              </span>
              <span className="logo-lg">
                <img src={logoSvg} alt="" height="24" />
                <span className="logo-txt">CMS & Annotation</span>
              </span>
            </Link>
          </div>
          <button
            onClick={handleToogle}
            type="button"
            className="btn btn-sm px-3 font-size-16 header-item"
            id="vertical-menu-btn"
          >
            <i className="fa fa-fw fa-bars" />
          </button>
        </div>
        <div className="d-flex">
          <ProfileMenu />
        </div>
      </div>
    </header>
  );
}

export default memo(Header);
