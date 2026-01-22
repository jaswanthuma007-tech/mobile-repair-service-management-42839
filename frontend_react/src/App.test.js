import { render, screen } from '@testing-library/react';
import App from './App';

test('renders auth entry (sign in) without blank screen', async () => {
  render(<App />);
  // Default route redirects to /login when unauthenticated
  const heading = await screen.findByText(/sign in/i);
  expect(heading).toBeInTheDocument();
});
