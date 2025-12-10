import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from './Navbar';
import { AuthContext } from '../component/components/Authetication/Authcontext';

const renderNavbar = (
  user = null,
  logout = jest.fn(),
  login = jest.fn(),
  signup = jest.fn()
) => {
  return render(
    <AuthContext.Provider value={{ user, logout, login, signup }}>
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    </AuthContext.Provider>
  );
};

describe.only('Navbar Component', () => {
  test('renders navigation links', () => {
    renderNavbar();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Products')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
    expect(screen.getByText('Cart')).toBeInTheDocument();
  });

  test('shows Login button when no user is logged in', () => {
    renderNavbar();
    expect(screen.getByText('Login')).toBeInTheDocument();
  });

  test('shows username when user is logged in', () => {
    const user = { email: 'testuser@example.com' };
    renderNavbar(user);
    expect(screen.getByText('Welcome, testuser ▼')).toBeInTheDocument();
  });

  test('opens dropdown on username click', () => {
    const user = { email: 'testuser@example.com' };
    renderNavbar(user);

    fireEvent.click(screen.getByText('Welcome, testuser ▼'));

    expect(screen.getByTestId('dropdown-menu')).toBeInTheDocument();
  });

  test('calls logout when logout button clicked', () => {
    const user = { email: 'testuser@example.com' };
    const logoutMock = jest.fn();

    renderNavbar(user, logoutMock);

    fireEvent.click(screen.getByText('Welcome, testuser ▼'));
    fireEvent.click(screen.getByText('Logout'));

    expect(logoutMock).toHaveBeenCalled();
  });
});
