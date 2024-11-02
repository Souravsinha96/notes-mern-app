import { screen } from '@testing-library/react';
import CreateNote from './CreateNote';
import { renderWithProviders } from '../../utils/test-utils';
jest.mock('../../components/noteForm/NoteForm', () => ({
  __esModule: true,
  default: ({ eventKey }: { eventKey: string }) => (
    <div data-testid="note-form" data-event-key={eventKey}>
      NoteForm Component
    </div>
  ),
}));
describe('CreateNote Component', () => {
  test('renders the Create Note heading and NoteForm with correct props', () => {
    renderWithProviders(<CreateNote />);

    // Check if the heading is rendered
    const heading = screen.getByRole('heading', { name: /create note/i });
    expect(heading).toBeInTheDocument();

    // Check if the NoteForm is rendered with the correct eventKey prop
    const noteForm = screen.getByTestId('note-form');
    expect(noteForm).toBeInTheDocument();
    expect(noteForm).toBeInTheDocument();
    expect(noteForm).toHaveAttribute('data-event-key', 'onSubmitCreateNote');
  });
});
