import { screen } from '@testing-library/react';
import EditNote from './EditNote';
import { renderWithProviders } from '../../utils/test-utils';
jest.mock('../../components/noteForm/NoteForm', () => ({
  __esModule: true,
  default: ({ eventKey }: { eventKey: string }) => (
    <div data-testid="note-form" data-event-key={eventKey}>
      NoteForm Component
    </div>
  ),
}));
describe('EditNote Component', () => {
  test('renders the Create Note heading and NoteForm with correct props', () => {
    renderWithProviders(<EditNote />);

    // Check if the heading is rendered
    const heading = screen.getByRole('heading', { name: /edit note/i });
    expect(heading).toBeInTheDocument();

    // Check if the NoteForm is rendered with the correct eventKey prop
    const noteForm = screen.getByTestId('note-form');
    expect(noteForm).toBeInTheDocument();
    expect(noteForm).toBeInTheDocument();
    expect(noteForm).toHaveAttribute('data-event-key', 'onSubmitEditNote');
  });
});
