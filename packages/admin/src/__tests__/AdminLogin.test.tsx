import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AdminLogin from '../pages/Authetication/AdminLogin';

jest.mock('../config/env', () => ({
  API_BASE_URL: 'http://localhost:8000',
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('react-hot-toast', () => ({
  __esModule: true,
  default: {
    success: jest.fn(),
    error: jest.fn(),
  },
  success: jest.fn(),
  error: jest.fn(),
}));

global.fetch = jest.fn();

describe('AdminLogin Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders login form properly', () => {
    render(
      <MemoryRouter>
        <AdminLogin />
      </MemoryRouter>
    );

    expect(screen.getByText('Admin Login')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
  });
  test('shows error when fields are empty', async () => {
    const toast = require('react-hot-toast').default;

    render(
      <MemoryRouter>
        <AdminLogin />
      </MemoryRouter>
    );

    // Trigger form submit directly instead of clicking button
    fireEvent.submit(screen.getByRole('form'));

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith('Please fill all fields')
    );
  });

  test('successful login triggers navigation and stores token', async () => {
    const mockToken = 'mocked-jwt-token';

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ token: mockToken }),
    });

    const { default: toast } = require('react-hot-toast');

    render(
      <MemoryRouter>
        <AdminLogin />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('Enter Email'), {
      target: { value: 'admin@example.com' },
    });

    fireEvent.change(screen.getByPlaceholderText('Enter Password'), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(localStorage.getItem('token')).toBe(mockToken);
      expect(toast.success).toHaveBeenCalledWith('Admin Login Successful!');
      expect(mockNavigate).toHaveBeenCalledWith('/admin/orders');
    });
  });

  test('failed login shows error toast', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'Invalid credentials' }),
    });

    const { default: toast } = require('react-hot-toast');

    render(
      <MemoryRouter>
        <AdminLogin />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('Enter Email'), {
      target: { value: 'wrong@example.com' },
    });

    fireEvent.change(screen.getByPlaceholderText('Enter Password'), {
      target: { value: 'wrongpass' },
    });

    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Invalid credentials');
    });
  });

  test('handles network errors gracefully', async () => {
    const { default: toast } = require('react-hot-toast');

    (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    render(
      <MemoryRouter>
        <AdminLogin />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('Enter Email'), {
      target: { value: 'admin@example.com' },
    });

    fireEvent.change(screen.getByPlaceholderText('Enter Password'), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'Something went wrong while logging in'
      );
    });
  });

  test('navigates to signup screen on text click', () => {
    render(
      <MemoryRouter>
        <AdminLogin />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('Create New Account'));
    expect(mockNavigate).toHaveBeenCalledWith('/admin-signup');
  });
});
