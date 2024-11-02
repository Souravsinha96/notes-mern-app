import { render, screen } from '@testing-library/react';
import Input from './Input';
import userEvent from '@testing-library/user-event';
describe('input', () => {
  test('renders input with label', () => {
    render(<Input label="Test Label" />);
    const inputElement = screen.getByRole('textbox');
    expect(inputElement).toBeInTheDocument();
  });
  it('renders input with label without placeholder', () => {
    render(<Input label="hello" />);
    const inputElement = screen.getByRole('textbox');
    const inputPlaceHolderText = screen.queryByPlaceholderText('hello');

    expect(inputElement).toBeInTheDocument();
    expect(inputPlaceHolderText).not.toBeInTheDocument();
  });

  it('renders textarea with label when istextarea is true', () => {
    render(<Input label="Test Label" isTextarea />);
    const textareaElement = screen.getByRole('textbox');
    expect(textareaElement).toBeInTheDocument();
  });
  it('renders input element without label', () => {
    render(<Input />);
    const labelElement = screen.queryByText('Hello');
    const inputElement = screen.getByRole('textbox');

    expect(labelElement).not.toBeInTheDocument();
    expect(inputElement).toBeInTheDocument();
  });

  it('renders input element with disabled attribute', () => {
    render(<Input label="Test Label" disabled />);
    const inputElement = screen.getByRole('textbox');
    expect(inputElement).toBeDisabled();
  });
  it('renders input element with required attribute', () => {
    render(<Input label="Test Label" required />);
    const inputElement = screen.getByRole('textbox');
    expect(inputElement).toBeRequired();
  });
  it('renders with new value on chnage', () => {
    const onChangeMock = jest.fn();
    render(<Input onChange={onChangeMock} />);

    const inputElement = screen.getByRole('textbox');

    userEvent.type(inputElement, 'new value');

    expect(inputElement).toHaveValue('new value');

    expect(onChangeMock).toBeCalled();
  });
});
