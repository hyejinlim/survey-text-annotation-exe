import { useSelector } from 'react-redux';
import { Route, Routes } from 'react-router';
import HorizontalLayout from '~/components/HorizontalLayout';
import NonAuthLayout from '~/components/NonAuthLayout';
import VerticalLayout from '~/components/VerticalLayout';
import { authRoutes, userRoutes } from './allRoutes';
import Authmiddleware from './middleware/Authmiddleware';

function Router() {
  const { layoutType } = useSelector((state: any) => ({
    layoutType: state.Layout.layoutType,
  }));

  function getLayout() {
    let layoutCls: Object = VerticalLayout;
    switch (layoutType) {
      case 'horizontal':
        layoutCls = HorizontalLayout;
        break;
      default:
        layoutCls = VerticalLayout;
        break;
    }
    return layoutCls;
  }

  const Layout: any = getLayout();

  return (
    <Routes>
      {authRoutes.map((route, idx) => (
        <Route
          path={route.path}
          element={<NonAuthLayout>{route.component}</NonAuthLayout>}
          key={idx}
        />
      ))}

      {userRoutes.map((route, idx) => (
        <Route
          path={route.path}
          element={
            <Authmiddleware>
              <Layout>{route.component}</Layout>
            </Authmiddleware>
          }
          key={idx}
        />
      ))}
    </Routes>
  );
}

export default Router;
