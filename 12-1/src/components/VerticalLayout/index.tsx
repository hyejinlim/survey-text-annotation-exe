import { Fragment, memo, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Footer from './Footer';
import Header from './Header';
import Sidebar from './Sidebar';
import {
  changeLayout,
  changeSidebarTheme,
  changeSidebarType,
  changeTopbarTheme,
  changeLayoutWidth,
  changelayoutMode,
  showRightSidebarAction,
} from '../../store/actions';
import RightSidebar from '../CommonForBoth/RightSidebar';

type Props = {
  children: React.ReactNode;
};
function Layout({ children }: Props) {
  const ref = useRef<any>();

  const dispatch = useDispatch();

  const {
    isPreloader,
    layoutWidth,
    topbarTheme,
    leftSideBarTheme,
    layoutMode,
    layoutType,
    leftSideBarType,
    showRightSidebar,
  } = useSelector((state: any) => ({
    isPreloader: state.Layout.isPreloader,
    layoutWidth: state.Layout.layoutWidth,
    topbarTheme: state.Layout.topbarTheme,
    leftSideBarTheme: state.Layout.leftSideBarTheme,
    layoutMode: state.Layout.layoutMode,
    layoutType: state.Layout.layoutType,
    leftSideBarType: state.Layout.leftSideBarType,
    showRightSidebar: state.Layout.showRightSidebar,
  }));

  const isMobile: any = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  //hides right sidebar on body click
  const hideRightbar = (event: any) => {
    var rightbar = document.getElementById('right-bar');
    //if clicked in inside right bar, then do nothing
    if (rightbar && rightbar.contains(event.target)) {
      return;
    } else {
      //if clicked in outside of rightbar then fire action for hide rightbar
      dispatch(showRightSidebarAction(false));
    }
  };

  useEffect(() => {
    //init body click event fot toggle rightbar
    document.body.addEventListener('click', hideRightbar, true);

    if (isPreloader === true) {
      ref.current.style.display = 'block';

      setTimeout(function () {
        if (ref.current) {
          ref.current.style.display = 'none';
        }
      }, 1000);
    } else {
      ref.current.style.display = 'none';
    }
  }, [isPreloader]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    dispatch(changeLayout('vertical'));
  }, [dispatch]);

  useEffect(() => {
    if (leftSideBarTheme) {
      dispatch(changeSidebarTheme(leftSideBarTheme));
    }
  }, [leftSideBarTheme, dispatch]);

  useEffect(() => {
    if (layoutMode) {
      dispatch(changelayoutMode(layoutMode, layoutType));
    }
  }, [layoutMode, dispatch]);

  useEffect(() => {
    if (leftSideBarType) {
      dispatch(changeSidebarType(leftSideBarType));
    }
  }, [leftSideBarType, dispatch]);

  useEffect(() => {
    if (layoutWidth) {
      dispatch(changeLayoutWidth(layoutWidth));
    }
  }, [layoutWidth, dispatch]);

  useEffect(() => {
    if (topbarTheme) {
      dispatch(changeTopbarTheme(topbarTheme));
    }
  }, [topbarTheme, dispatch]);

  /*
  call dark/light mode
  */
  const onChangeLayoutMode = (value: any) => {
    if (changelayoutMode) {
      dispatch(changelayoutMode(value, layoutType));
      if (value === 'dark') {
        dispatch(changeSidebarTheme('dark'));
      } else {
        dispatch(changeSidebarTheme('light'));
      }
    }
  };

  return (
    <Fragment>
      <div className="pace pace-active" id="preloader" ref={ref}>
        <div
          className="pace-progress"
          data-progress-text="100%"
          data-progress="99"
          style={{ transform: 'translate3d(100%, 0px, 0px)' }}
        >
          <div className="pace-progress-inner"></div>
        </div>
        <div className="pace-activity"></div>
      </div>

      <div id="layout-wrapper">
        <Header />
        <Sidebar
          theme={leftSideBarTheme}
          type={leftSideBarType}
          isMobile={isMobile}
        />
        <div className="main-content">
          {children}
          <Footer />
        </div>
      </div>
      {showRightSidebar ? (
        <RightSidebar onChangeLayoutMode={onChangeLayoutMode} />
      ) : null}
    </Fragment>
  );
}

export default memo(Layout);
