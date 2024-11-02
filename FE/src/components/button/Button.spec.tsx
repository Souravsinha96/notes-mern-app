import { render, fireEvent, screen } from '@testing-library/react';
import Button from './Button';
describe('Button Component', () => {
  it('renders the button with default props', () => {
    render(<Button>Click Me</Button>);

    const btnElement = screen.getByText('Click Me');

    expect(btnElement).toBeInTheDocument();
    expect(btnElement).not.toBeDisabled();
    expect(btnElement).toHaveClass('md contained secondary rounded');
  });
  it('renders the button with specified props', () => {
    render(
      <Button
        size="lg"
        shape="square"
        variant="outline"
        color="secondary"
        startIcon={<span>🚀</span>}
        endIcon={<span>🌟</span>}
      >
        Custom Button
      </Button>
    );

    const btnElement = screen.getByText('Custom Button');

    expect(btnElement).toBeInTheDocument();
    expect(btnElement).toHaveClass('lg outline secondary square');
    expect(btnElement).toContainHTML(
      '<span>🚀</span>Custom Button<span>🌟</span>'
    );
  });
  it('calles onClick handler when button is clicked', () => {
    const mockOnClick = jest.fn();

    render(<Button onClick={mockOnClick}>Click Me</Button>);

    const btnElement = screen.getByText('Click Me');

    expect(btnElement).toBeInTheDocument();

    fireEvent.click(btnElement);

    expect(mockOnClick).toHaveBeenCalled();
  });
  it('renders a disabled button on passing diabled props', () => {
    render(<Button disabled>Click Me</Button>);

    const btnElement = screen.getByText('Click Me');

    expect(btnElement).toBeInTheDocument();
    expect(btnElement).toBeDisabled();
  });
});
