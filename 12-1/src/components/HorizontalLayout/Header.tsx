import { Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import Icon from '@ailibs/feather-react-ts';
import logo from '~/assets/images/logo-sm.svg';
import { toggleLeftmenu, showRightSidebarAction } from '../../store/actions';
import LightDark from '../CommonForBoth/Menus/LightDark';
import NotificationDropdown from '../CommonForBoth/TopbarDropdown/NotificationDropdown';
import ProfileMenu from '../CommonForBoth/TopbarDropdown/ProfileMenu';

const Header = (props: any) => {
  const dispatch = useDispatch();
  const { leftMenu, layoutMode, showRightSidebar } = useSelector(
    (state: any) => ({
      leftMenu: state.Layout.leftMenu,
      layoutMode: state.Layout.layoutMode,
      showRightSidebar: state.Layout.showRightSide,
    })
  );

  return (
    <Fragment>
      <header id="page-topbar">
        <div className="navbar-header">
          <div className="d-flex">
            <div className="navbar-brand-box">
              <Link to="/dashboard/survey" className="logo logo-dark">
                <span className="logo-sm">
                  <img src={logo} alt="" height="24" />
                </span>
                <span className="logo-lg">
                  <img src={logo} alt="" height="24" />
                  <span className="logo-txt">CMS & Annotation</span>
                </span>
              </Link>

              <Link to="/dashboard/survey" className="logo logo-light">
                <span className="logo-sm">
                  <img src={logo} alt="" height="24" />
                </span>
                <span className="logo-lg">
                  <img src={logo} alt="" height="24" />
                  <span className="logo-txt">CMS & Annotation</span>
                </span>
              </Link>
            </div>

            <button
              type="button"
              className="btn btn-sm px-3 font-size-16 d-lg-none header-item"
              data-toggle="collapse"
              onClick={() => {
                dispatch(toggleLeftmenu(!leftMenu));
              }}
              data-target="#topnav-menu-content"
            >
              <i className="fa fa-fw fa-bars" />
            </button>
          </div>

          <div className="d-flex">
            {/* light / dark mode */}
            <LightDark
              layoutMode={layoutMode}
              onChangeLayoutMode={props.onChangeLayoutMode}
            />

            <NotificationDropdown />

            <div className="dropdown d-inline-block">
              <button
                onClick={() => {
                  dispatch(showRightSidebarAction(!showRightSidebar));
                }}
                type="button"
                className="btn header-item noti-icon right-bar-toggle "
              >
                <Icon name="settings" className="icon-lg" />
              </button>
            </div>

            <ProfileMenu />
          </div>
        </div>
      </header>
    </Fragment>
  );
};

export default Header;
