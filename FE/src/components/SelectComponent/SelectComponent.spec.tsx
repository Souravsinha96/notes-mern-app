import { fireEvent, render, screen } from '@testing-library/react';
import SelectComponent, { SelectOption } from './SelectComponent';
describe('Select Component', () => {
  const onChangeMock = jest.fn();
  const options: SelectOption[] = [
    { label: 'First', id: 1 },
    { label: 'Second', id: 2 },
    { label: 'Third', id: 3 },
    { label: 'Fourth', id: 4 },
    { label: 'Fifth', id: 5 },
  ];
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('renders successfully', () => {
    render(
      <SelectComponent
        options={options}
        value={{ label: 'Fourth', id: 4 }}
        onChange={onChangeMock}
      />
    );
    const comboBox = screen.getByRole('combobox');
    expect(comboBox).toBeInTheDocument();
  });
  it('renders multiselect successfully', () => {
    render(
      <SelectComponent
        options={options}
        multiple
        value={[{ label: 'Fourth', id: 4 }]}
        onChange={onChangeMock}
      />
    );
    const comboBox = screen.getByRole('combobox');
    expect(comboBox).toBeInTheDocument();
  });
  it('renders single select with no initial value', () => {
    render(
      <SelectComponent
        value={undefined}
        onChange={onChangeMock}
        options={options}
      />
    );

    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.queryByTestId('selectedItem')).toHaveTextContent('');
  });

  it('renders multiple select with no initial values', () => {
    render(
      <SelectComponent
        multiple={true}
        value={[]}
        onChange={onChangeMock}
        options={options}
      />
    );

    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.queryByTestId('selectedItem')).toHaveTextContent('');
  });

  it('single select:renders with new value on change', () => {
    render(
      <SelectComponent
        options={options}
        value={{ label: 'Fourth', id: 4 }}
        onChange={onChangeMock}
      />
    );
    const comboBox = screen.getByRole('combobox');
    const selectedItem = screen.getByTestId('selectedItem');
    expect(selectedItem).toHaveTextContent('Fourth');
    fireEvent.click(comboBox);
    const listItem = screen.getByText('Second');
    fireEvent.click(listItem);
    expect(onChangeMock).toHaveBeenCalledWith(options[1]);
  });
  it('selects multiple options in multiple select mode', () => {
    render(
      <SelectComponent
        multiple={true}
        value={[]}
        onChange={onChangeMock}
        options={options}
      />
    );

    fireEvent.click(screen.getByRole('combobox'));
    fireEvent.click(screen.getByText('First'));
    fireEvent.click(screen.getByRole('combobox'));
    fireEvent.click(screen.getByText('Second'));

    expect(onChangeMock).toHaveBeenCalledWith([options[0]]);
    expect(onChangeMock).toHaveBeenCalledWith([options[1]]);
  });
  it('clears selected option in single select mode', () => {
    render(
      <SelectComponent
        value={options[1]}
        onChange={onChangeMock}
        options={options}
      />
    );

    fireEvent.click(screen.getByLabelText('clear button'));
    expect(onChangeMock).toHaveBeenCalledWith(undefined);
  });
  it('clears selected options in multiple select mode', () => {
    render(
      <SelectComponent
        multiple={true}
        value={[options[0], options[1]]}
        onChange={onChangeMock}
        options={options}
      />
    );

    fireEvent.click(screen.getByLabelText('clear button'));
    expect(onChangeMock).toHaveBeenCalledWith([]);
  });
  it('removes selected option badge in multiple select mode', () => {
    render(
      <SelectComponent
        multiple={true}
        value={[options[0], options[1]]}
        onChange={onChangeMock}
        options={options}
      />
    );
    const clearBadge = screen.getByLabelText('clear badge-1');
    expect(clearBadge).toBeInTheDocument();
    fireEvent.click(clearBadge);
    expect(onChangeMock).toHaveBeenCalledWith([options[1]]);
  });
  it('closes dropdown on escape', () => {
    render(
      <SelectComponent
        value={undefined}
        onChange={onChangeMock}
        options={options}
      />
    );
    const comboBox = screen.getByRole('combobox');
    fireEvent.click(comboBox);
    expect(comboBox).toHaveAttribute('aria-expanded', 'true');
    fireEvent.keyDown(comboBox, { code: 'Escape' });
    expect(comboBox).toHaveAttribute('aria-expanded', 'false');
  });
  it('navigates options with keyboard', () => {
    render(
      <SelectComponent
        value={undefined}
        onChange={onChangeMock}
        options={options}
      />
    );

    const combobox = screen.getByRole('combobox');
    fireEvent.keyDown(combobox, { code: 'ArrowDown' });
    fireEvent.keyDown(combobox, { code: 'Enter' });

    expect(onChangeMock).toHaveBeenCalledWith(options[0]);

    fireEvent.keyDown(combobox, { code: 'ArrowDown' });
    fireEvent.keyDown(combobox, { code: 'ArrowDown' });
    fireEvent.keyDown(combobox, { code: 'ArrowUp' });
    fireEvent.keyDown(combobox, { code: 'Enter' });

    expect(onChangeMock).toHaveBeenCalledWith(options[0]);
  });
  it('closes dropdown on blur', () => {
    render(
      <SelectComponent
        multiple={false}
        value={undefined}
        onChange={onChangeMock}
        options={options}
      />
    );

    const comboBox = screen.getByRole('combobox');

    // Open dropdown
    fireEvent.click(comboBox);
    expect(comboBox).toHaveAttribute('aria-expanded', 'true');

    // Trigger blur
    fireEvent.blur(comboBox);

    // Dropdown should close
    expect(comboBox).toHaveAttribute('aria-expanded', 'false');
  });
  it('highlights option on mouse enter', () => {
    render(
      <SelectComponent
        multiple={false}
        value={undefined}
        onChange={onChangeMock}
        options={options}
      />
    );

    const comboBox = screen.getByRole('combobox');

    // Open dropdown
    fireEvent.click(comboBox);
    const Second = screen.getByText('Second');

    // Trigger mouse enter on Option 2
    fireEvent.mouseEnter(Second);

    // Check if Option 2 is highlighted (assuming it applies a `highlighted` class)
    expect(Second).toHaveClass('highlighted');
  });
});
