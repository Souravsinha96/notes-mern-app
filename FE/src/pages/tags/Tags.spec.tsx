import { fireEvent, screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '../../utils/test-utils';
import Tags from './Tags';
import { customAxios } from '../../api/axios';
import { AxiosResponse } from 'axios';
jest.mock('../../api/axios', () => ({
  customAxios: {
    get: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

describe('Tags', () => {
  const mockedGet = customAxios.get as jest.MockedFunction<
    typeof customAxios.get
  >;
  const mockedPut = customAxios.put as jest.MockedFunction<
    typeof customAxios.put
  >;
  const mockedDelete = customAxios.delete as jest.MockedFunction<
    typeof customAxios.delete
  >;
  const mockData = [
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
  let modalRoot: HTMLElement;
  beforeEach(() => {
    modalRoot = document.createElement('div');
    modalRoot.setAttribute('id', 'modal-root');
    document.body.appendChild(modalRoot);
    mockedGet.mockResolvedValue({
      status: 200,
      data: mockData,
    });
  });
  afterEach(() => {
    document.body.removeChild(modalRoot);
    jest.clearAllMocks();
  });
  it('should render successfully', async () => {
    renderWithProviders(<Tags />);

    const notetitle = await screen.findByText('Didifd dlsasasdist');
    const editBtn = await screen.findByRole('button', {
      name: /Edit Tag-dsdssasasas/i,
    });
    expect(notetitle).toBeInTheDocument();
    expect(editBtn).toBeInTheDocument();
  });
  it('should edit the tag successfully', async () => {
    mockedPut.mockResolvedValue({ status: 201 } as AxiosResponse);
    const mockData = [
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
        label: 'TestTag',
        notes: [],
        __v: 0,
      },
    ];
    renderWithProviders(<Tags />);
    const editBtn = await screen.findByRole('button', {
      name: /Edit Tag-dsdssasasas/i,
    });
    expect(editBtn).toBeInTheDocument();
    fireEvent.click(editBtn);
    const editInput = await screen.findByRole('textbox', { name: 'Label' });
    fireEvent.change(editInput, { target: { value: 'TestTag' } });
    mockedGet.mockResolvedValue({
      status: 201,
      data: mockData,
    });
    const modalSubmitBtn = screen.getByText(/submit/i);
    fireEvent.click(modalSubmitBtn);
    await waitFor(() => {
      expect(screen.getByText(/TestTag/i)).toBeInTheDocument();
    });
  });
  it('should delete the tag successfully', async () => {
    mockedDelete.mockResolvedValue({ status: 204 } as AxiosResponse);
    const mockData = [
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
    ];
    renderWithProviders(<Tags />);
    const deleteBtn = await screen.findByRole('button', {
      name: /Delete Tag-dsdssasasas/i,
    });
    expect(deleteBtn).toBeInTheDocument();
    fireEvent.click(deleteBtn);
    mockedGet.mockResolvedValue({
      status: 201,
      data: mockData,
    });
    const modalSubmitBtn = screen.getByText(/submit/i);
    fireEvent.click(modalSubmitBtn);
    await waitFor(() => {
      expect(screen.queryByText(/TestTag/i)).not.toBeInTheDocument();
    });
  });
  it('should show  msg on delete api failure', async () => {
    mockedDelete.mockRejectedValue({
      status: 400,
    });
    const { store } = renderWithProviders(<Tags />);
    const deleteBtn = await screen.findByRole('button', {
      name: /Delete Tag-dsdssasasas/i,
    });
    expect(deleteBtn).toBeInTheDocument();
    fireEvent.click(deleteBtn);
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
        message: 'No Tag found',
        autoClose: true,
      });
    });
  });
  it('should show  msg on edit api failure', async () => {
    mockedPut.mockRejectedValue({
      status: 400,
    });
    const { store } = renderWithProviders(<Tags />);
    const editBtn = await screen.findByRole('button', {
      name: /Edit Tag-dsdssasasas/i,
    });
    expect(editBtn).toBeInTheDocument();
    fireEvent.click(editBtn);
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
        message: 'No Tag found',
        autoClose: true,
      });
    });
  });
  it('should show the modal and stale data when response code on success does not match', async () => {
    mockedPut.mockResolvedValue({ status: 200 } as AxiosResponse);
    const mockData = [
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
        label: 'TestTag',
        notes: [],
        __v: 0,
      },
    ];
    renderWithProviders(<Tags />);
    const editBtn = await screen.findByRole('button', {
      name: /Edit Tag-dsdssasasas/i,
    });
    expect(editBtn).toBeInTheDocument();
    fireEvent.click(editBtn);
    const editInput = await screen.findByRole('textbox', { name: 'Label' });
    fireEvent.change(editInput, { target: { value: 'TestTag' } });
    mockedGet.mockResolvedValue({
      status: 201,
      data: mockData,
    });
    const modalSubmitBtn = screen.getByText(/submit/i);
    fireEvent.click(modalSubmitBtn);
    await waitFor(() => {
      expect(screen.queryByText(/TestTag/i)).not.toBeInTheDocument();
    });
  });
  it('should show  msg on tags api failure', async () => {
    mockedGet.mockRejectedValue({
      status: 400,
    });
    const { store } = renderWithProviders(<Tags />);
    await waitFor(() => {
      expect(store.getState().snackbar).toEqual({
        snackbarOpen: true,
        position: {
          horizontal: 'right',
          vertical: 'top',
        },
        severity: 'error',
        message: 'No Tags found',
        autoClose: true,
      });
    });
  });
  it('should select multiple files and delete the tags', async () => {
    mockedDelete.mockResolvedValue({ status: 204 } as AxiosResponse);
    const mockData = [
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
        label: 'test1234',
        notes: [],
        __v: 0,
      },
      {
        _id: '66cb125bf7695f6ff2d7a4a4s',
        label: 'test123',
        notes: [],
        __v: 0,
      },
    ];
    renderWithProviders(<Tags />);
    const deleteBtn = await screen.findByRole('button', {
      name: 'Delete Tags',
    });
    expect(deleteBtn).toBeInTheDocument();
    expect(deleteBtn).toBeDisabled();

    mockedGet.mockResolvedValue({
      status: 201,
      data: mockData,
    });
    const deleteAllCheckbox = screen.getByTestId('deleteAll');
    fireEvent.click(deleteAllCheckbox);
    expect(deleteBtn).not.toBeDisabled();
    fireEvent.click(deleteBtn);
    const modalSubmitBtn = screen.getByText(/submit/i);
    fireEvent.click(modalSubmitBtn);
    await waitFor(() => {
      expect(screen.queryByText(/test1234/i)).not.toBeInTheDocument();
    });
  });
  it('should toggle single checkbox on click', async () => {
    renderWithProviders(<Tags />);
    const deleteCheckbox = await screen.findByTestId(
      '66cb125bf7695f6ff2d7a4a4'
    );
    expect(deleteCheckbox).not.toBeChecked();
    fireEvent.click(deleteCheckbox);
    expect(deleteCheckbox).toBeChecked();
    fireEvent.click(deleteCheckbox);
    expect(deleteCheckbox).not.toBeChecked();
  });
  it('should toggle deleteall cehckbox successfully', async () => {
    renderWithProviders(<Tags />);
    const deleteAllCheckbox = await screen.findByTestId('deleteAll');
    expect(deleteAllCheckbox).not.toBeChecked();
    fireEvent.click(deleteAllCheckbox);
    expect(deleteAllCheckbox).toBeChecked();
    fireEvent.click(deleteAllCheckbox);
    expect(deleteAllCheckbox).not.toBeChecked();
  });
});
