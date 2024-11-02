import { render, screen } from '@testing-library/react';
import { CustomTag } from './CustomTag';
import { Tag } from '../card/cardTypes';
import userEvent from '@testing-library/user-event';

describe('custom tag', () => {
  const mockTagData: Tag = {
    id: '1',
    label: 'head',
  };
  const mockDeletefn = jest.fn();
  it('renders correctly', () => {
    render(<CustomTag tag={mockTagData} />);
    const tagElement = screen.getByText('head');
    expect(tagElement).toBeInTheDocument();
  });
  it('call onDelete function', () => {
    render(<CustomTag tag={mockTagData} onDelete={mockDeletefn} />);
    const deleteIcon = screen.getByTestId('1');
    userEvent.click(deleteIcon);
    expect(mockDeletefn).toBeCalled();
  });
  it('on tab press delete icon get the focus', () => {
    render(<CustomTag tag={mockTagData} onDelete={mockDeletefn} />);
    const deleteIcon = screen.getByTestId('1');
    userEvent.tab();
    expect(deleteIcon).toHaveFocus();
  });
  it('renders tag without deleteicon when onDelete function is not passed', () => {
    render(<CustomTag tag={mockTagData} />);
    const deleteIcon = screen.queryByTestId('1');
    expect(deleteIcon).not.toBeInTheDocument();
  });
  it('call onDelete function when pressed enter', async () => {
    render(<CustomTag tag={mockTagData} onDelete={mockDeletefn} />);
    const deleteIcon = screen.getByTestId('1');
    userEvent.type(deleteIcon, '{enter}');
    expect(mockDeletefn).toBeCalled();
  });
  it('call onDelete function when pressed space', async () => {
    render(<CustomTag tag={mockTagData} onDelete={mockDeletefn} />);
    const deleteIcon = screen.getByTestId('1');
    userEvent.type(deleteIcon, '{space}');
    expect(mockDeletefn).toBeCalled();
  });
  it('should not call onDelete function when pressed shift', async () => {
    render(<CustomTag tag={mockTagData} onDelete={mockDeletefn} />);
    const deleteIcon = screen.getByTestId('1');
    userEvent.tab();
    userEvent.keyboard('shift');
    expect(mockDeletefn).not.toHaveBeenCalled();
  });
});
