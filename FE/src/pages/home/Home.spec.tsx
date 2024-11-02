import { fireEvent, screen, waitFor } from '@testing-library/react';
import { customAxios } from '../../api/axios';
import { renderWithProviders } from '../../utils/test-utils';
import Home from './Home';
import { useNavigate } from 'react-router-dom';

jest.mock('../../api/axios', () => ({
  customAxios: {
    get: jest.fn(),
  },
}));
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), // Keep the original functionalities
  useNavigate: jest.fn(),
}));
describe('Note', () => {
  const mockedGet = customAxios.get as jest.MockedFunction<
    typeof customAxios.get
  >;

  const mockData = [
    {
      tags: [],
      _id: '65f282f98e7a6f69548ff47d',
      title: 'two',
      body: 'hello',
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

  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should render successfully', () => {
    const { baseElement } = renderWithProviders(<Home />);
    expect(baseElement).toBeInTheDocument();
  });
  it('should load the correct note', async () => {
    mockedGet.mockResolvedValue({
      data: mockData,
    });
    renderWithProviders(<Home />);

    const bodyText = await screen.findByText('hello');
    expect(bodyText).toBeInTheDocument();
  });
  it('should show  msg on api failure', async () => {
    mockedGet.mockRejectedValue(new Error());
    const { store } = renderWithProviders(<Home />);
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
  });
  it('should navigate when we click on any card', async () => {
    mockedGet.mockResolvedValue({
      data: mockData,
    });
    const navigate = jest.fn();
    (useNavigate as jest.Mock).mockReturnValue(navigate);
    renderWithProviders(<Home />);
    const note1Card = await screen.findByText('one');
    fireEvent.click(note1Card);
    expect(navigate).toHaveBeenCalledWith('/notes/65f283058e7a6f69548ff481');
  });

  it('should go to notespage on view notes button click', () => {
    const navigate = jest.fn();
    (useNavigate as jest.Mock).mockReturnValue(navigate);
    renderWithProviders(<Home />);
    const viewNotesBtn = screen.getByText('View Notes');
    fireEvent.click(viewNotesBtn);
    expect(navigate).toHaveBeenCalledWith('/notes');
  });
  it('should go to create note on create note button click', () => {
    const navigate = jest.fn();
    (useNavigate as jest.Mock).mockReturnValue(navigate);
    renderWithProviders(<Home />);
    const createNoteBtn = screen.getByText('Create Note');
    fireEvent.click(createNoteBtn);
    expect(navigate).toHaveBeenCalledWith('/create-note');
  });
});
