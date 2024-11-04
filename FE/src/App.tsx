import { HashRouter } from 'react-router-dom';
import './App.css';
import Routes from './routes/Route';
import Loadable from './hoc/Lodable';
import { lazy } from 'react';
const Loader = Loadable(lazy(() => import('./components/loader/Loader')));
const StyledSnackbar = Loadable(
  lazy(() => import('./components/snackbar/Snackbar'))
);
function App() {
  return (
    <HashRouter>
      <Routes />
      <StyledSnackbar />
      <Loader />
    </HashRouter>
  );
}

export default App;
