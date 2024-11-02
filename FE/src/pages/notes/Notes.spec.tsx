import { customAxios } from '../../api/axios';
import { renderWithProviders } from '../../utils/test-utils';
import Notes from './Notes';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { NOTES } from '../../constants/routeConstants';

jest.mock('../../api/axios', () => ({
  customAxios: {
    get: jest.fn(),
  },
}));
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));
describe('notes', () => {
  const mockedGet = customAxios.get as jest.MockedFunction<
    typeof customAxios.get
  >;
  const mockData = [
    {
      tags: [],
      _id: '65f282f98e7a6f69548ff47d',
      title: 'two',
      body: 'fucking wick',
      important: true,
      createdAt: '2024-03-14T04:54:17.510Z',
      updatedAt: '2024-06-19T13:01:15.773Z',
      __v: 0,
    },
    {
      tags: [],
      _id: '65f283058e7a6f69548ff481',
      title: 'one',
      body: 'dhfdfdl',
      important: true,
      createdAt: '2024-03-14T04:54:29.743Z',
      updatedAt: '2024-03-14T04:54:29.743Z',
      __v: 0,
    },
  ];

  test('renders succssfully', () => {
    const { baseElement } = renderWithProviders(<Notes />);
    expect(baseElement).toBeInTheDocument();
  });
  it('should render correct data', async () => {
    mockedGet.mockResolvedValue({
      data: mockData,
    });
    const { store } = renderWithProviders(<Notes />);
    expect(store.getState().loader).toBe(true);
    await waitFor(() => {
      expect(mockedGet).toHaveBeenCalledWith(NOTES);
    });
    await waitFor(() => {
      expect(store.getState().loader).toBe(false);
    });
    const bodyText = screen.queryByText('dhfdfdl');
    expect(bodyText).toBeInTheDocument();
  });
  it('shows error snackbar when fetch fails', async () => {
    mockedGet.mockRejectedValue(new Error('No Notes found'));
    const { store } = renderWithProviders(<Notes />);
    expect(store.getState().loader).toBe(true);
    await waitFor(() => {
      expect(store.getState().snackbar).toEqual({
        snackbarOpen: true,
        position: {
          horizontal: 'right',
          vertical: 'top',
        },
        severity: 'error',
        message: 'No Notes found',
        autoClose: true,
      });
    });
    await waitFor(() => {
      expect(store.getState().loader).toBe(false);
    });
    const bodyText = screen.queryByText('dhfdfdl');
    expect(bodyText).not.toBeInTheDocument();
  });
  it('shows error snackbar when fetch fails with default message', async () => {
    mockedGet.mockRejectedValue('');
    const { store } = renderWithProviders(<Notes />);
    expect(store.getState().loader).toBe(true);
    await waitFor(() => {
      expect(store.getState().snackbar).toEqual({
        snackbarOpen: true,
        position: {
          horizontal: 'right',
          vertical: 'top',
        },
        severity: 'error',
        message: 'No Notes found',
        autoClose: true,
      });
    });
    await waitFor(() => {
      expect(store.getState().loader).toBe(false);
    });
    const bodyText = screen.queryByText('dhfdfdl');
    expect(bodyText).not.toBeInTheDocument();
  });
  it('should navigate when we click on any card', async () => {
    const navigate = jest.fn();
    const { useNavigate } = require('react-router-dom');
    useNavigate.mockReturnValue(navigate);
    mockedGet.mockResolvedValue({
      data: mockData,
    });
    renderWithProviders(<Notes />);
    await waitFor(() => {
      expect(mockedGet).toHaveBeenCalledWith(NOTES);
    });
    const note1Card = await screen.findByText('one');
    fireEvent.click(note1Card);
    expect(navigate).toHaveBeenCalledWith('65f283058e7a6f69548ff481');
  });
});
