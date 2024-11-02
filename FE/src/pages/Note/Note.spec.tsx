import { fireEvent, screen, waitFor } from '@testing-library/react';
import { customAxios } from '../../api/axios';
import { renderWithProviders } from '../../utils/test-utils';
import Note from './Note';
import { EDITNOTE, NOTES } from '../../constants/routeConstants';

const mockedUseNavigate = jest.fn();
const mockedUseParams = jest.fn();
jest.mock('../../api/axios', () => ({
  customAxios: {
    get: jest.fn(),
    delete: jest.fn(),
  },
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), // Keep the original functionalities
  useParams: () => mockedUseParams,
  useNavigate: () => mockedUseNavigate,
}));
describe('Note', () => {
  const mockedGet = customAxios.get as jest.MockedFunction<
    typeof customAxios.get
  >;
  const mockedDelete = customAxios.delete as jest.MockedFunction<
    typeof customAxios.delete
  >;
  mockedUseParams.mockReturnValue({
    id: '65f282f98e7a6f69548ff47d',
  });
  const mockData = {
    tags: [{ id: '123', label: 'Hello tag' }],
    _id: '65f282f98e7a6f69548ff47d',
    title: 'two',
    body: 'hello',
    important: true,
    createdAt: '2024-03-14T04:54:17.510Z',
    updatedAt: '2024-06-19T13:01:15.773Z',
    __v: 0,
  };
  let modalRoot: HTMLElement;
  beforeEach(() => {
    modalRoot = document.createElement('div');
    modalRoot.setAttribute('id', 'modal-root');
    document.body.appendChild(modalRoot);
  });

  afterEach(() => {
    document.body.removeChild(modalRoot);
    jest.clearAllMocks();
  });
  it('should render successfully', () => {
    const { baseElement } = renderWithProviders(<Note />);
    expect(baseElement).toBeInTheDocument();
  });
  it('should load the correct note', async () => {
    mockedGet.mockResolvedValue({
      status: 200,
      data: mockData,
    });
    renderWithProviders(<Note />);

    const bodyText = await screen.findByText('hello');
    expect(bodyText).toBeInTheDocument();
  });
  it('should show  msg on get api failure', async () => {
    mockedGet.mockRejectedValue(new Error());
    const { store } = renderWithProviders(<Note />);
    await waitFor(() => {
      expect(store.getState().snackbar).toEqual({
        snackbarOpen: true,
        position: {
          horizontal: 'right',
          vertical: 'top',
        },
        severity: 'error',
        message: 'No Note found',
        autoClose: true,
      });
    });
  });
  it('should navigate to /edit on editnote button click', async () => {
    mockedGet.mockResolvedValue({
      status: 200,
      data: mockData,
    });
    renderWithProviders(<Note />);
    // eslint-disable-next-line testing-library/no-debugging-utils
    screen.debug();
    const editButton = screen.getByText('Edit Note');
    expect(editButton).toBeInTheDocument();
    fireEvent.click(editButton);
    expect(mockedUseNavigate).toHaveBeenCalledWith(EDITNOTE);
  });
  it('should delete the note and navigate to notes page on click of delete button', async () => {
    mockedGet.mockResolvedValue({
      status: 200,
      data: mockData,
    });
    mockedDelete.mockResolvedValue({
      status: 204,
    });
    renderWithProviders(<Note />);
    const deleteButton = screen.getByText('Delete Note');
    expect(deleteButton).toBeInTheDocument();
    fireEvent.click(deleteButton);
    const modalSubmitBtn = screen.getByText(/submit/i);
    fireEvent.click(modalSubmitBtn);
    await waitFor(() => {
      expect(mockedUseNavigate).toHaveBeenCalledWith(NOTES);
    });
  });
  it('should show  msg on delete api failure', async () => {
    mockedDelete.mockRejectedValue({
      status: 400,
      message: 'Invalid ID',
    });
    const { store } = renderWithProviders(<Note />);
    const deleteButton = screen.getByText('Delete Note');
    expect(deleteButton).toBeInTheDocument();
    fireEvent.click(deleteButton);
    const modalSubmitBtn = screen.getByText(/submit/i);
    fireEvent.click(modalSubmitBtn);
    await waitFor(() => {
      expect(store.getState().snackbar).toEqual({
        snackbarOpen: true,
        position: {
          horizontal: 'right',
          vertical: 'top',
        },
        severity: 'error',
        message: 'Invalid ID',
        autoClose: true,
      });
    });
  });
});
