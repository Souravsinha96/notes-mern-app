import { Suspense } from 'react';
import LinearProgress from '../components/loader/LinearProgress';

const Loadable = (Component: any) => (props: any) =>
  (
    <Suspense fallback={<LinearProgress />}>
      <Component {...props} />
    </Suspense>
  );
export default Loadable;
