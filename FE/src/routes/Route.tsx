import { lazy } from 'react';
import Loadable from '../hoc/Lodable';
import { Navigate, useRoutes } from 'react-router-dom';
import BaseLayout from '../layouts/BaseLayout';
import { CREATENOTE, HOME, NOTES, TAGS } from '../constants/routeConstants';

const Home = Loadable(lazy(() => import('../pages/home/Home')));
const Notes = Loadable(lazy(() => import('../pages/notes/Notes')));
const Tags = Loadable(lazy(() => import('../pages/tags/Tags')));
const CreateNote = Loadable(
  lazy(() => import('../pages/createNote/CreateNote'))
);
const EditNote = Loadable(lazy(() => import('../pages/editNote/EditNote')));

const Note = Loadable(lazy(() => import('../pages/Note/Note')));
const Page404 = Loadable(lazy(() => import('../pages/error/Page404')));
const Page500 = Loadable(lazy(() => import('../pages/error/Page500')));
const Routes = () => {
  const routes = useRoutes([
    {
      path: '/',
      element: <BaseLayout />,
      children: [
        { element: <Navigate to={HOME} />, index: true },
        {
          element: <Home />,
          path: HOME,
          index: true,
        },
        {
          path: NOTES,
          children: [
            {
              index: true,
              element: <Notes />,
            },
            {
              path: ':id',
              children: [
                {
                  index: true,
                  element: <Note />,
                },
                {
                  path: 'edit',
                  element: <EditNote />,
                },
              ],
            },
          ],
        },
        {
          element: <Tags />,
          path: TAGS,
          index: true,
        },
        {
          element: <CreateNote />,
          path: CREATENOTE,
          index: true,
        },
      ],
    },
    {
      element: <BaseLayout />,
      children: [
        { path: '404', element: <Page404 /> },
        { path: '500', element: <Page500 /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
};
export default Routes;
