import { renderWithProviders } from '../../utils/test-utils';
import Page404 from './Page404';
import Page500 from './Page500';

describe('404 page', () => {
  it('should render 404 page successfully', () => {
    renderWithProviders(<Page404 />);
  });
});
describe('500 page', () => {
  it('should render 404 page successfully', () => {
    renderWithProviders(<Page500 />);
  });
});
