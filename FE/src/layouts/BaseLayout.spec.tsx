import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import BaseLayout from './BaseLayout';

// Mock the Header component
jest.mock('../components/header/Header.tsx', () => () => (
  <div data-testid="header">Header Component</div>
));
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  Outlet: () => <div data-testid="outlet">Outlet Component</div>,
}));
describe('BaseLayout', () => {
  it('should render the Header component', () => {
    render(
      <BrowserRouter>
        <BaseLayout />
      </BrowserRouter>
    );

    // Check if the Header component is rendered
    expect(screen.getByTestId('header')).toBeInTheDocument();
  });

  it('should render the Outlet for nested routes', () => {
    render(<BaseLayout />);

    // Check if the Outlet component is rendered
    expect(screen.getByTestId('outlet')).toBeInTheDocument();
  });
});
