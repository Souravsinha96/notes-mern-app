import { render, screen, fireEvent } from '@testing-library/react';
import Card from './Card';

describe('Card', () => {
  it('renders successfully', () => {
    render(
      <Card
        title="Hello"
        tags={[{ id: '1', label: 'todo' }]}
        body="Todays note"
      />
    );

    let title = screen.getByRole('heading', { level: 3 });
    let tag = screen.getByText('todo');
    let indicator = screen.queryByText('Important');
    let badge = screen.queryByText('New Note');
    expect(title).toBeInTheDocument();
    expect(tag).toBeInTheDocument();
    expect(badge).not.toBeInTheDocument();
    expect(indicator).not.toBeInTheDocument();
  });
  test('important indicator renders successfully', () => {
    render(
      <Card
        title="Hello"
        tags={[{ id: '1', label: 'todo' }]}
        body="Todays note"
        indicator={true}
      />
    );
    let indicator = screen.getByText('Important');
    expect(indicator).toBeInTheDocument();
  });

  test('new note badge renders successfully', () => {
    render(
      <Card
        title="Hello"
        tags={[{ id: '1', label: 'todo' }]}
        body="Todays note"
        indicator={true}
        newNote={true}
      />
    );
    let badge = screen.getByText('New Note');
    expect(badge).toBeInTheDocument();
  });
  it('should call onClick function on enter key press', () => {
    const mockClick = jest.fn();
    render(
      <Card
        title="Hello"
        tags={[{ id: '1', label: 'todo' }]}
        body="Todays note"
        indicator={true}
        newNote={true}
        onClick={mockClick}
      />
    );
    let badge = screen.getByText('New Note');
    fireEvent.keyDown(badge, { key: 'Enter', code: 'Enter', charCode: 13 });
    expect(mockClick).toHaveBeenCalled();
  });
  it('should not call onClick function on space key press', () => {
    const mockClick = jest.fn();
    render(
      <Card
        title="Hello"
        tags={[{ id: '1', label: 'todo' }]}
        body="Todays note"
        indicator={true}
        newNote={true}
        onClick={mockClick}
      />
    );
    let badge = screen.getByText('New Note');
    fireEvent.keyDown(badge, { key: 'Space', code: 'Space' });
    expect(mockClick).not.toHaveBeenCalled();
  });
  it('should render span tag with ellipses when tags length is more than 3', () => {
    render(
      <Card
        title="Hello"
        tags={[
          { id: '1', label: 'todo' },
          { id: '2', label: 'todo' },
          { id: '3', label: 'todo' },
          { id: '4', label: 'todo' },
        ]}
        body="Todays note"
        indicator={true}
        newNote={true}
      />
    );
    const ellipses = screen.getByText('...');
    expect(ellipses).toBeInTheDocument();
  });
});
