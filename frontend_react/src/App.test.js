import { render, screen } from '@testing-library/react';
import App from './App';

test('renders login screen link to register', () => {
  render(<App />);
  const linkElement = screen.getByText(/create one/i);
  expect(linkElement).toBeInTheDocument();
});
