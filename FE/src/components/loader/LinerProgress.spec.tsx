import { render } from '@testing-library/react';
import LinearProgress from './LinearProgress';

describe('Linear Progress', () => {
  test('renders successfully', () => {
    const { baseElement } = render(<LinearProgress />);
    expect(baseElement).toBeInTheDocument();
  });
});
