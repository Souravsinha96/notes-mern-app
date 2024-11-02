import { act, screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '../../utils/test-utils';
import Snackbar from './Snackbar';
import { snackbarState } from './snackbarTypes';
import { setupStore } from '../../core/store';
import userEvent from '@testing-library/user-event';
describe('snackbar', () => {
  type initialStateType = {
    snackbar: snackbarState;
  };
  test('does not renders Snackbar component', () => {
    renderWithProviders(<Snackbar />);
    const messageElement = screen.queryByText(/Example message/i);
    expect(messageElement).not.toBeInTheDocument();
  });
  test('renders Snackbar component when initial state', () => {
    const initialState: initialStateType = {
      snackbar: {
        snackbarOpen: true,
        severity: 'info',
        message: 'Example message',
        autoClose: false,
        position: { vertical: 'top', horizontal: 'right' },
      },
    };
    renderWithProviders(<Snackbar />, { preloadedState: initialState });
    const messageElement = screen.getByText(/Example message/i);
    const mainELt = screen.getByRole('alert');
    expect(mainELt).toHaveClass('open');
    expect(messageElement).toBeInTheDocument();
  });
  test('snakcbar calls handle close function', () => {
    const handleClose = jest.fn();
    const initialState: initialStateType = {
      snackbar: {
        snackbarOpen: true,
        severity: 'warning',
        message: 'Example message',
        autoClose: false,
        position: { vertical: 'top', horizontal: 'right' },
      },
    };
    renderWithProviders(<Snackbar />, { preloadedState: initialState });
    expect(handleClose).toBeDefined();
    const btnELement = screen.getByRole('button');
    expect(btnELement).toBeInTheDocument();
    act(() => {
      userEvent.click(btnELement);
    });
    // Verify that Snackbar is closed
    expect(setupStore().getState().snackbar.snackbarOpen).toBe(false);
    expect(setupStore().getState().snackbar.message).toBe('');
  });

  test('snackbar close button is having focus', () => {
    const initialState: initialStateType = {
      snackbar: {
        snackbarOpen: true,
        severity: 'info',
        message: 'Example message',
        autoClose: true,
        position: { vertical: 'top', horizontal: 'center' },
      },
    };
    renderWithProviders(<Snackbar />, { preloadedState: initialState });

    const btnELement = screen.getByRole('button');
    expect(btnELement).toBeInTheDocument();
    expect(btnELement).toHaveFocus();
  });
  it('should close the snackbar automatically when autoclose=true', async () => {
    const initialState: initialStateType = {
      snackbar: {
        snackbarOpen: true,
        severity: 'error',
        message: 'Example message',
        autoClose: true,
        position: { vertical: 'bottom', horizontal: 'left' },
      },
    };
    renderWithProviders(<Snackbar />, { preloadedState: initialState });
    const messageElement = screen.queryByText(/Example message/i);
    expect(messageElement).toBeInTheDocument();
    await waitFor(
      () => {
        expect(messageElement).toBeEmptyDOMElement();
      },
      { timeout: 4000 } // Wait a little longer than the autoClose duration
    );
  });
});
