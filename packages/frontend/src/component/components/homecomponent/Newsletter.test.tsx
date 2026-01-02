import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Newsletter from './NewsLetter';
import { useSubscribeNewsletter } from '../../../hook/useSubscribeNewsletter';
import { toast } from 'react-hot-toast';

jest.mock('react-hot-toast', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const mutateMock = jest.fn();
jest.mock('../../../hook/useSubscribeNewsletter', () => ({
  useSubscribeNewsletter: jest.fn(),
}));

describe('Newsletter Component', () => {
  beforeEach(() => {
    (useSubscribeNewsletter as jest.Mock).mockReturnValue({
      mutate: mutateMock,
      isPending: false,
    });
    jest.clearAllMocks();
  });

  test('renders form elements correctly', () => {
    render(<Newsletter />);

    expect(
      screen.getByPlaceholderText(/enter your email/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /subscribe/i })
    ).toBeInTheDocument();
  });

  test('shows validation error if email is empty', async () => {
    render(<Newsletter />);

    fireEvent.click(screen.getByRole('button', { name: /subscribe/i }));

    expect(
      await screen.findByText(/please enter a valid email address/i)
    ).toBeInTheDocument();
  });

  test('calls mutate on valid submission', async () => {
    render(<Newsletter />);

    fireEvent.change(screen.getByPlaceholderText(/enter your email/i), {
      target: { value: 'test@example.com' },
    });

    fireEvent.click(screen.getByRole('button', { name: /subscribe/i }));

    await waitFor(() => {
      expect(mutateMock).toHaveBeenCalledWith(
        'test@example.com',
        expect.any(Object)
      );
    });
  });

  test('handles successful subscription', async () => {
    (useSubscribeNewsletter as jest.Mock).mockReturnValue({
      mutate: (email: string, callbacks: any) => {
        callbacks.onSuccess({ message: 'Subscribed!' });
      },
      isPending: false,
    });

    render(<Newsletter />);

    fireEvent.change(screen.getByPlaceholderText(/enter your email/i), {
      target: { value: 'john@example.com' },
    });

    fireEvent.click(screen.getByRole('button', { name: /subscribe/i }));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Subscribed!');
    });
  });

  test('handles subscription error', async () => {
    (useSubscribeNewsletter as jest.Mock).mockReturnValue({
      mutate: (email: string, callbacks: any) => {
        callbacks.onError(new Error('Subscription failed'));
      },
      isPending: false,
    });

    render(<Newsletter />);

    fireEvent.change(screen.getByPlaceholderText(/enter your email/i), {
      target: { value: 'john@example.com' },
    });

    fireEvent.click(screen.getByRole('button', { name: /subscribe/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Subscription failed');
    });
  });

  test('disables input and button when loading', () => {
    (useSubscribeNewsletter as jest.Mock).mockReturnValue({
      mutate: mutateMock,
      isPending: true,
    });

    render(<Newsletter />);

    const input = screen.getByPlaceholderText(/enter your email/i);
    const button = screen.getByRole('button');

    expect(input).toBeDisabled();
    expect(button).toBeDisabled();
    expect(button).toHaveTextContent(/subscribing/i);
  });
});
