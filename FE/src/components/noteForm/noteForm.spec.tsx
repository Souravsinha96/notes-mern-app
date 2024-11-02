import { fireEvent, screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '../../utils/test-utils';
import NoteForm from './NoteForm';
import { customAxios } from '../../api/axios';
import { AxiosResponse } from 'axios';
import { NOTES } from '../../constants/routeConstants';
const mockedUseNavigate = jest.fn();
jest.mock('../../api/axios', () => ({
  customAxios: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
  },
}));
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUseNavigate,
}));
function getFormElement() {
  const checkInput = screen.getByRole('checkbox');
  const titleInput = screen.getByRole('textbox', { name: 'Title' });
  const comboBox = screen.getByRole('combobox');
  const bodyInput = screen.getByRole('textbox', { name: 'Body' });
  const saveBtn = screen.getByRole('button', { name: /Save/i });
  expect(checkInput).toBeInTheDocument();
  expect(titleInput).toBeInTheDocument();
  expect(comboBox).toBeInTheDocument();
  expect(comboBox).toBeInTheDocument();
  expect(bodyInput).toBeInTheDocument();
  expect(saveBtn).toBeInTheDocument();
  return { titleInput, checkInput, comboBox, saveBtn, bodyInput };
}

describe('create note form', () => {
  const mockedPost = customAxios.post as jest.MockedFunction<
    typeof customAxios.post
  >;
  const mockedPut = customAxios.put as jest.MockedFunction<
    typeof customAxios.put
  >;
  const mockedGet = customAxios.get as jest.MockedFunction<
    typeof customAxios.get
  >;

  const mockSelectedNote = {
    title: 'New title',
    body: 'New Body',
    tags: [{ label: 'Tag1', _id: '66ca29469dee53cf85c0d516' }],
    important: true,
    _id: '65f282f98e7a6f69548ff47d',
    createdAt: '2024-03-14T04:54:17.510Z',
    updatedAt: '2024-06-19T13:01:15.773Z',
    __v: 0,
  };
  const mockTagsData = [
    {
      _id: '66ca29469dee53cf85c0d516',
      label: 'v233',
      notes: [
        {
          _id: '66ca29379dee53cf85c0d50c',
          title: 'Didifd dlsasasdist',
        },
      ],
      __v: 1,
    },
    {
      _id: '66cb125bf7695f6ff2d7a4a4',
      label: 'dsdssasasas',
      notes: [],
      __v: 0,
    },
  ];

  beforeEach(() => {
    mockedGet.mockResolvedValue({
      status: 200,
      data: mockTagsData,
    });
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  test('render succssfully', () => {
    const { baseElement } = renderWithProviders(
      <NoteForm eventKey="onSubmitCreateNote" />
    );
    expect(baseElement).toBeInTheDocument();
  });
  test('fills form correctly', async () => {
    mockedPost.mockResolvedValue({ status: 201 } as AxiosResponse);

    const { store } = renderWithProviders(
      <NoteForm eventKey="onSubmitCreateNote" />
    );
    const { titleInput, checkInput, comboBox, saveBtn, bodyInput } =
      getFormElement();
    fireEvent.click(checkInput);
    expect(checkInput).toBeChecked();
    fireEvent.change(titleInput, { target: { value: 'New title' } });
    expect(titleInput).toHaveValue('New title');
    fireEvent.click(comboBox);
    const lists = screen.getAllByRole('list');
    fireEvent.click(lists[0]);
    const selectedTag = await screen.findByText('v233');
    fireEvent.click(selectedTag);
    expect(selectedTag).toBeInTheDocument();
    fireEvent.change(bodyInput, { target: { value: 'New Body' } });
    expect(bodyInput).toHaveValue('New Body');
    fireEvent.click(saveBtn);
    // Breakdown:
    // customAxios.post:

    // customAxios is an instance of Axios created using axios.create().
    // customAxios.post is the post method from the Axios instance, which is used to make POST requests.
    // typeof customAxios.post:

    // typeof customAxios.post retrieves the type of the post method. In this case, it returns the type signature of the post method, which is a function that takes a URL, data, and configuration options and returns a Promise of an Axios response.
    // jest.MockedFunction:

    // jest.MockedFunction is a utility type provided by Jest that represents a mocked function with the same type signature as the original function.
    // It essentially tells TypeScript that the function is a Jest mock, allowing you to use Jest-specific methods like mockResolvedValue or mockRejectedValue on it.
    // Type Assertion (as):

    // The as keyword is used for type assertions in TypeScript. It tells the TypeScript compiler to treat the expression as a specific type.
    // In this case, it asserts that customAxios.post is a jest.MockedFunction with the same type as customAxios.post.

    expect(store.getState().loader).toBe(true);
    await waitFor(() => {
      expect(mockedPost).toHaveBeenCalledWith(NOTES, {
        title: 'New title',
        body: 'New Body',
        tags: [{ label: 'v233', id: '66ca29469dee53cf85c0d516' }],
        important: true,
      });
    });
    await waitFor(() => {
      expect(store.getState().snackbar).toEqual({
        snackbarOpen: true,
        position: {
          horizontal: 'right',
          vertical: 'top',
        },
        severity: 'success',
        message: 'Notes Create Successfully',
        autoClose: true,
      });
    });
    await waitFor(() => {
      expect(store.getState().loader).toBe(false);
    });
    expect(mockedUseNavigate).toHaveBeenCalledWith(NOTES);
  });
  test('handles form submission failure', async () => {
    mockedPost.mockRejectedValue(new Error('No Notes found'));

    const { store } = renderWithProviders(
      <NoteForm eventKey="onSubmitCreateNote" />
    );

    const { titleInput, bodyInput } = getFormElement();
    fireEvent.change(titleInput, { target: { value: 'Test Title' } });
    fireEvent.change(bodyInput, { target: { value: 'Test Body' } });

    fireEvent.click(screen.getByRole('button', { name: /Save/i }));
    await waitFor(() => {
      expect(mockedPost).toHaveBeenCalledWith(NOTES, {
        title: 'Test Title',
        body: 'Test Body',
        tags: [],
        important: false,
      });
    });
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
    expect(mockedUseNavigate).not.toHaveBeenCalled();
  });

  test('render succssfully with editEventKey', () => {
    const { baseElement } = renderWithProviders(
      <NoteForm eventKey="onSubmitEditNote" selectedNote={mockSelectedNote} />
    );
    expect(baseElement).toBeInTheDocument();
    const { titleInput } = getFormElement();
    expect(titleInput).toHaveValue('New title');
  });
  test('fills edited form correctly', async () => {
    mockedPut.mockResolvedValue({ status: 201 } as AxiosResponse);
    const { store } = renderWithProviders(
      <NoteForm eventKey="onSubmitEditNote" selectedNote={mockSelectedNote} />
    );
    const { saveBtn, checkInput } = getFormElement();
    fireEvent.click(checkInput);
    expect(checkInput).not.toBeChecked();
    fireEvent.click(saveBtn);
    await waitFor(() => {
      expect(mockedPut).toHaveBeenCalledWith(NOTES, {
        title: 'New title',
        id: '65f282f98e7a6f69548ff47d',
        body: 'New Body',
        tags: [{ label: 'Tag1', id: '66ca29469dee53cf85c0d516' }],
        important: false,
      });
    });
    await waitFor(() => {
      expect(store.getState().snackbar).toEqual({
        snackbarOpen: true,
        position: {
          horizontal: 'right',
          vertical: 'top',
        },
        severity: 'success',
        message: 'Notes Create Successfully',
        autoClose: true,
      });
    });
    expect(mockedUseNavigate).toHaveBeenCalledWith(NOTES);
  });
  it('should navigate to previous screen on cancel button click', async () => {
    renderWithProviders(<NoteForm eventKey="onSubmitCreateNote" />);
    const CancelButton = screen.getByText('Cancel');
    expect(CancelButton).toBeInTheDocument();
    fireEvent.click(CancelButton);
    expect(mockedUseNavigate).toHaveBeenCalledWith(-1);
  });
});
