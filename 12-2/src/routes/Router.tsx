import { Route, Routes } from 'react-router';
import { userRoutes } from './allRoutes';

function Router() {
  return (
    <Routes>
      {userRoutes.map((route, idx) => (
        <Route path={route.path} element={route.component} key={idx} />
      ))}
    </Routes>
  );
}

export default Router;
