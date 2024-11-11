import { useEffect, memo, Fragment } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Collapse } from 'reactstrap';
import Icon from '@ailibs/feather-react-ts';
import { useQuery } from '@tanstack/react-query';
import { fetchMenuList } from '~/api/menu';
import withRouter from '../Common/withRouter';

const Navbar = () => {
  const { leftMenu } = useSelector((state: any) => ({
    leftMenu: state.Layout.leftMenu,
  }));

  useEffect(() => {
    var matchingMenuItem = null;
    var ul: any = document.getElementById('navigation');
    var items: any = ul.getElementsByTagName('a');
    for (var i = 0; i < items.length; ++i) {
      if (window.location.pathname === items[i].pathname) {
        matchingMenuItem = items[i];
        break;
      }
    }
    if (matchingMenuItem) {
      activateParentDropdown(matchingMenuItem);
    }
  });
  function activateParentDropdown(item: any) {
    item.classList.add('active');
    const parent = item.parentElement;
    if (parent) {
      parent.classList.add('active'); // li
      const parent2 = parent.parentElement;
      parent2.classList.add('active'); // li
      const parent3 = parent2.parentElement;
      if (parent3) {
        parent3.classList.add('active'); // li
        const parent4 = parent3.parentElement;
        if (parent4) {
          parent4.classList.add('active'); // li
          const parent5 = parent4.parentElement;
          if (parent5) {
            parent5.classList.add('active'); // li
            const parent6 = parent5.parentElement;
            if (parent6) {
              parent6.classList.add('active'); // li
            }
          }
        }
      }
    }
    return false;
  }

  const { data: menuListData } = useQuery({
    queryKey: ['menuList'],
    queryFn: fetchMenuList,
  });

  return (
    <Fragment>
      <div className="topnav">
        <div className="container-fluid">
          <nav
            className="navbar navbar-light navbar-expand-lg topnav-menu"
            id="navigation"
          >
            <Collapse
              isOpen={leftMenu}
              className="navbar-collapse"
              id="topnav-menu-content"
            >
              <ul className="navbar-nav">
                {menuListData?.response.payload.map((menu: any) => {
                  const { title: menuTitle, children } = menu;
                  const [{ icon }]: any = children;
                  if (children.length < 2) {
                    const [{ title, path, icon }]: any = children;
                    return (
                      <li className="nav-item dropdown">
                        <Link
                          className="nav-link dropdown-toggle arrow-none"
                          to={path}
                        >
                          {icon && <Icon name={icon} />}
                          <span>{title}</span>
                        </Link>
                      </li>
                    );
                  }
                  return (
                    <li className="nav-item dropdown">
                      <Link
                        to="/#"
                        className="nav-link dropdown-togglez arrow-none"
                      >
                        {icon && <Icon name={icon} />}
                        {menuTitle} <div className="arrow-down"></div>
                      </Link>
                      <div className="dropdown-menu">
                        {children.map((subMenu: any) => {
                          const { title, path } = subMenu;
                          return (
                            <Link to={path} className="dropdown-item">
                              {title}
                            </Link>
                          );
                        })}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </Collapse>
          </nav>
        </div>
      </div>
    </Fragment>
  );
};
export default memo(withRouter(Navbar));
