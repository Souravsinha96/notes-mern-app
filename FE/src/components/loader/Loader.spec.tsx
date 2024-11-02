import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../utils/test-utils';
import Loader from './Loader';

describe('Loader component', () => {
  it('should render loader when loading state is true', () => {
    renderWithProviders(<Loader />, { preloadedState: { loader: true } });
    const loaderElement = screen.getByTestId('loader');
    expect(loaderElement).toBeInTheDocument();
    expect(loaderElement).toHaveClass('visible');
  });

  it('should not render loader when loading state is false', () => {
    renderWithProviders(<Loader />, { preloadedState: { loader: false } });

    const loaderElement = screen.queryByTestId('loader');
    expect(loaderElement).not.toHaveClass('visible');
  });
});
