import { useEffect, useState, useRef, Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Header from './Header';
import Navbar from './Navbar';
import {
  changeLayout,
  changeTopbarTheme,
  changeLayoutWidth,
  changelayoutMode,
  changeLayoutPosition,
} from '../../store/actions';
import RightSidebar from '../CommonForBoth/RightSidebar';

type LayoutProps = {
  children: any;
};

const Layout = (props: LayoutProps) => {
  const dispatch = useDispatch();

  const {
    topbarTheme,
    layoutWidth,
    isPreloader,
    layoutType,
    layoutMode,
    layoutPosition,
    showRightSidebar,
  } = useSelector((state: any) => ({
    topbarTheme: state.Layout.topbarTheme,
    layoutWidth: state.Layout.layoutWidth,
    isPreloader: state.Layout.isPreloader,
    layoutType: state.Layout.layoutType,
    layoutMode: state.Layout.layoutMode,
    layoutPosition: state.Layout.layoutPosition,
    showRightSidebar: state.Layout.showRightSidebar,
  }));

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (layoutMode) {
      dispatch(changelayoutMode(layoutMode, layoutType));
    }
  }, [layoutMode, dispatch]);
  /*
  layout settings
  */
  useEffect(() => {
    dispatch(changeLayout('horizontal'));
  }, [dispatch]);

  useEffect(() => {
    const preloader: any = document.getElementById('preloader');

    if (isPreloader === true) {
      preloader.style.display = 'block';

      setTimeout(function () {
        preloader.style.display = 'none';
      }, 1000);
    } else {
      preloader.style.display = 'none';
    }
  }, [isPreloader]);

  useEffect(() => {
    if (topbarTheme) {
      dispatch(changeTopbarTheme(topbarTheme));
    }
  }, [dispatch, topbarTheme]);

  useEffect(() => {
    if (layoutMode) {
      dispatch(changelayoutMode(layoutMode, layoutType));
    }
  }, [layoutMode, layoutType, dispatch]);

  useEffect(() => {
    if (layoutPosition) {
      dispatch(changeLayoutPosition(layoutPosition));
    }
  }, [dispatch, layoutPosition]);

  useEffect(() => {
    if (layoutWidth) {
      dispatch(changeLayoutWidth(layoutWidth));
    }
  }, [dispatch, layoutWidth]);

  const [isMenuOpened, setIsMenuOpened] = useState<boolean>(false);

  const openMenu = () => {
    setIsMenuOpened(!isMenuOpened);
  };

  const ref = useRef<any>();

  /*
call dark/light mode
*/
  const onChangeLayoutMode = (value: any) => {
    if (changelayoutMode) {
      dispatch(changelayoutMode(value, layoutType));
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
        <Header onChangeLayoutMode={onChangeLayoutMode} />
        <Navbar menuOpen={openMenu} />
        <div className="main-content">{props.children}</div>
      </div>

      {showRightSidebar ? (
        <RightSidebar onChangeLayoutMode={onChangeLayoutMode} />
      ) : null}
    </Fragment>
  );
};

export default Layout;
