import { BrowserRouter } from 'react-router-dom';
import Router from '~/routes';
import '~/assets/scss/theme.scss';
import '~/assets/scss/preloader.scss';

function App() {
  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <Router />
    </BrowserRouter>
  );
}

export default App;
