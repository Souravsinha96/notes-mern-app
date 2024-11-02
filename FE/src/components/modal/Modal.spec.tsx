import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Modal } from './Modal';

describe('Modal Component', () => {
  const mockOnClose = jest.fn();
  const mockOnSubmit = jest.fn();
  let modalRoot: HTMLElement;
  beforeEach(() => {
    mockOnClose.mockClear();
    mockOnSubmit.mockClear();
    modalRoot = document.createElement('div');
    modalRoot.setAttribute('id', 'modal-root');
    document.body.appendChild(modalRoot);
  });
  afterEach(() => {
    // Clean up the modal-root after each test
    document.body.removeChild(modalRoot);
  });

  test('renders the modal when open is true', () => {
    render(
      <Modal
        open={true}
        title="Test Modal"
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      >
        <p>Modal Content</p>
      </Modal>
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  test('does not render the modal when open is false', () => {
    render(
      <Modal
        open={false}
        title="Test Modal"
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      >
        <p>Modal Content</p>
      </Modal>
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  test('displays the title and children correctly', () => {
    render(
      <Modal
        open={true}
        title="Test Modal"
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      >
        <p>Modal Content</p>
      </Modal>
    );

    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Modal Content')).toBeInTheDocument();
  });

  test('calls onClose when close button is clicked', () => {
    render(
      <Modal
        open={true}
        title="Test Modal"
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      >
        <p>Modal Content</p>
      </Modal>
    );

    fireEvent.click(screen.getByLabelText(/close/i));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('calls onSubmit when submit button is clicked', () => {
    render(
      <Modal
        open={true}
        title="Test Modal"
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      >
        <p>Modal Content</p>
      </Modal>
    );

    fireEvent.click(screen.getByText(/submit/i));
    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
  });

  test('renders the divider when divider prop is true', () => {
    render(
      <Modal
        open={true}
        title="Test Modal"
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        divider={true}
      >
        <p>Modal Content</p>
      </Modal>
    );

    expect(screen.getByRole('separator')).toBeInTheDocument();
  });

  test('does not render the divider when divider prop is false', () => {
    render(
      <Modal
        open={true}
        title="Test Modal"
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        divider={false}
      >
        <p>Modal Content</p>
      </Modal>
    );

    expect(screen.queryByRole('separator')).not.toBeInTheDocument();
  });
});
