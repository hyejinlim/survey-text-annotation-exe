import { useEffect, useRef, useCallback, Fragment } from 'react';
import { Link } from 'react-router-dom';
import Icon from '@ailibs/feather-react-ts';
import { useQuery } from '@tanstack/react-query';
import MetisMenu from 'metismenujs';
import SimpleBar from 'simplebar-react';
import { fetchMenuList } from '~/api/menu';
import withRouter from '../Common/withRouter';

function SidebarContent() {
  const ref: any = useRef();
  /** 메뉴 불러오기 */
  const { data: menuListData } = useQuery({
    queryKey: ['menuList'],
    queryFn: fetchMenuList,
  });

  const activateParentDropdown = useCallback((item: any) => {
    item.classList.add('active');
    const parent = item.parentElement;
    const parent2El = parent.childNodes[1];

    if (parent2El && parent2El.id !== 'side-menu') {
      parent2El.classList.add('mm-show');
    }

    if (parent) {
      parent.classList.add('mm-active');
      const parent2 = parent.parentElement;

      if (parent2) {
        parent2.classList.add('mm-show'); // ul tag

        const parent3 = parent2.parentElement; // li tag

        if (parent3) {
          parent3.classList.add('mm-active'); // li
          parent3.childNodes[0].classList.add('mm-active'); //a
          const parent4 = parent3.parentElement; // ul
          if (parent4) {
            parent4.classList.add('mm-show'); // ul
            const parent5 = parent4.parentElement;
            if (parent5) {
              parent5.classList.add('mm-show'); // li
              parent5.childNodes[0].classList.add('mm-active'); // a tag
            }
          }
        }
      }
      scrollElement(item);
      return false;
    }
    scrollElement(item);
    return false;
  }, []);

  const removeActivation = (items: any) => {
    for (var i = 0; i < items.length; ++i) {
      var item = items[i];
      const parent = items[i].parentElement;

      if (item && item.classList.contains('active')) {
        item.classList.remove('active');
      }
      if (parent) {
        const parent2El =
          parent.childNodes && parent.childNodes.lenght && parent.childNodes[1]
            ? parent.childNodes[1]
            : null;
        if (parent2El && parent2El.id !== 'side-menu') {
          parent2El.classList.remove('mm-show');
        }

        parent.classList.remove('mm-active');
        const parent2 = parent.parentElement;

        if (parent2) {
          parent2.classList.remove('mm-show');

          const parent3 = parent2.parentElement;
          if (parent3) {
            parent3.classList.remove('mm-active'); // li
            parent3.childNodes[0].classList.remove('mm-active');

            const parent4 = parent3.parentElement; // ul
            if (parent4) {
              parent4.classList.remove('mm-show'); // ul
              const parent5 = parent4.parentElement;
              if (parent5) {
                parent5.classList.remove('mm-show'); // li
                parent5.childNodes[0].classList.remove('mm-active'); // a tag
              }
            }
          }
        }
      }
    }
  };

  const activeMenu = () => {
    const pathName = window.location.pathname;
    let matchingMenuItem = null;
    const ul: any = document.getElementById('side-menu');
    const items = ul.getElementsByTagName('a');
    removeActivation(items);

    for (let i = 0; i < items.length; ++i) {
      if (pathName.includes(items[i].pathname)) {
        matchingMenuItem = items[i];
        break;
      }
    }
    if (matchingMenuItem) {
      activateParentDropdown(matchingMenuItem);
    }
  };

  const scrollElement = (item: any) => {
    if (item) {
      const currentPosition = item.offsetTop;
      if (currentPosition > window.innerHeight) {
        ref.current.getScrollElement().scrollTop = currentPosition - 300;
      }
    }
  };

  useEffect(() => {
    ref.current.recalculate();
  }, []);

  useEffect(() => {
    new MetisMenu('#side-menu');
    activeMenu();
  });

  return (
    <SimpleBar className="mh-100" ref={ref}>
      <div id="sidebar-menu">
        <ul className="metismenu list-unstyled" id="side-menu">
          {menuListData?.response.payload.map((menu: any) => {
            const { title, children } = menu;
            return (
              <Fragment key={title}>
                <li className="menu-title">{title}</li>
                {children.map((subMenu: any) => {
                  const { title, path, icon } = subMenu;
                  const isLabelingTool = path.includes('/labeling/tool');
                  return (
                    <li key={title}>
                      <Link
                        to={path}
                        target={isLabelingTool ? '_blank' : '_self'}
                      >
                        {icon && <Icon name={icon} />}
                        <span>{title}</span>
                      </Link>
                    </li>
                  );
                })}
              </Fragment>
            );
          })}
        </ul>
      </div>
    </SimpleBar>
  );
}

export default withRouter(SidebarContent);
