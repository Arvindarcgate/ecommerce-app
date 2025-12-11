import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AdminSignup from '../pages/Authetication/adminsignup';

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

describe('AdminSignup Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test('renders signup form correctly', () => {
    render(
      <MemoryRouter>
        <AdminSignup />
      </MemoryRouter>
    );

    expect(screen.getByText('Admin Signup')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter Password')).toBeInTheDocument();
  });

  test('shows error if fields are empty', async () => {
    const toast = require('react-hot-toast').default;

    render(
      <MemoryRouter>
        <AdminSignup />
      </MemoryRouter>
    );

    fireEvent.submit(screen.getByRole('form'));

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith('Please fill all fields')
    );
  });

  test('successful signup stores token and navigates', async () => {
    const mockToken = 'mock-token';

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        token: mockToken,
      }),
    });

    const toast = require('react-hot-toast').default;

    render(
      <MemoryRouter>
        <AdminSignup />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('Enter Name'), {
      target: { value: 'John Doe' },
    });

    fireEvent.change(screen.getByPlaceholderText('Enter Email'), {
      target: { value: 'admin@example.com' },
    });

    fireEvent.change(screen.getByPlaceholderText('Enter Password'), {
      target: { value: 'password123' },
    });

    fireEvent.submit(screen.getByRole('form'));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        'Admin Account Created Successfully!'
      );
      expect(localStorage.getItem('token')).toBe(mockToken);
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  test('failed signup shows error message', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'Signup failed' }),
    });

    const toast = require('react-hot-toast').default;

    render(
      <MemoryRouter>
        <AdminSignup />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('Enter Name'), {
      target: { value: 'John Doe' },
    });

    fireEvent.change(screen.getByPlaceholderText('Enter Email'), {
      target: { value: 'wrong@example.com' },
    });

    fireEvent.change(screen.getByPlaceholderText('Enter Password'), {
      target: { value: 'wrongpass' },
    });

    fireEvent.submit(screen.getByRole('form'));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Signup failed');
    });
  });

  test('handles network error gracefully', async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network Error'));

    const toast = require('react-hot-toast').default;

    render(
      <MemoryRouter>
        <AdminSignup />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('Enter Name'), {
      target: { value: 'John Doe' },
    });

    fireEvent.change(screen.getByPlaceholderText('Enter Email'), {
      target: { value: 'admin@example.com' },
    });

    fireEvent.change(screen.getByPlaceholderText('Enter Password'), {
      target: { value: 'password123' },
    });

    fireEvent.submit(screen.getByRole('form'));

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith(
        'Something went wrong while signing up'
      )
    );
  });

  test('navigates to login screen when link clicked', () => {
    render(
      <MemoryRouter>
        <AdminSignup />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('Login Here'));

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});
