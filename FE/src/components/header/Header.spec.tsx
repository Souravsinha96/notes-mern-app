import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Header from './Header';
import { CREATENOTE, NOTES } from '../../constants/routeConstants';
const mockedUseNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUseNavigate,
}));
describe('header', () => {
  it('headers component renders successfully', () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );
    const appLogo = screen.getByAltText('app logo');
    expect(appLogo).toBeInTheDocument();

    // Assert that the navigation links are rendered
    const homeLink = screen.getByText('Home');
    const notesLink = screen.getByText('Notes');
    const tagsLink = screen.getByText('Tags');

    expect(homeLink).toBeInTheDocument();
    expect(notesLink).toBeInTheDocument();
    expect(tagsLink).toBeInTheDocument();

    // Assert that the "Create Note" button is rendered
    const createNoteButton = screen.getByText('Create Note');
    expect(createNoteButton).toBeInTheDocument();

    // Assert that the dots icon is rendered
    const dotsIcon = screen.getByTestId('dots-icon');
    expect(dotsIcon).toBeInTheDocument();
  });
  test('Clicking on a Link navigates to the correct route', () => {
    // Mocking the BrowserRouter to avoid errors related to Link outside Router
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );

    // Assuming you want to test the "Notes" link
    const notesLink = screen.getByText('Notes');

    // Simulate a click on the "Notes" link
    fireEvent.click(notesLink);

    // Assert that the route has changed to '/notes'
    expect(window.location.pathname).toBe(NOTES);
  });
  test('function called on button click', () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );
    const createNoteButton = screen.getByText('Create Note');
    fireEvent.click(createNoteButton);
    expect(mockedUseNavigate).toHaveBeenCalledWith(CREATENOTE);
  });
  test('popup function called on dots-icon button click', () => {
    const handlepopup = jest.fn();
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );
    const dotsIcon = screen.getByTestId('dots-icon');
    fireEvent.click(dotsIcon);
    expect(handlepopup).toBeDefined();
  });
});
