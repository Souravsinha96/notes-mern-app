import { lazy } from 'react';
import Loadable from './Lodable';
import { render, screen } from '@testing-library/react';

describe('Loadable', () => {
  it('should render the fallback component while loading', async () => {
    // Lazy load a test component
    const LazyComponent = lazy(() => new Promise(() => {})); // This keeps the component in a loading state

    const LoadableComponent = Loadable(LazyComponent);

    render(<LoadableComponent />);

    // Expect the fallback loading component to be in the document
    expect(screen.getByTestId('linear-progress')).toBeInTheDocument();
  });
  it('should render the loaded component once loaded', async () => {
    // Lazy load a test component
    const LazyComponent = lazy(() =>
      Promise.resolve({
        default: () => (
          <div data-testid="loaded-component">Loaded Component</div>
        ),
      })
    );

    const LoadableComponent = Loadable(LazyComponent);

    render(<LoadableComponent />);

    // Wait for the lazy-loaded component to appear
    const loadedComponent = await screen.findByTestId('loaded-component');
    expect(loadedComponent).toBeInTheDocument();
  });
});
