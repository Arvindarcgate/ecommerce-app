import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import GetReadyPage from '../pages/adminproductlaunch';
import toast from 'react-hot-toast';
import { BrowserRouter } from 'react-router-dom';

jest.mock('../config/env', () => ({
  API_BASE_URL: 'http://localhost:8000',
}));

jest.mock(
  '../pages/conformationModal',
  () => (props: any) =>
    props.open ? (
      <div data-testid="modal">
        <button onClick={props.onConfirm} data-testid="confirm-delete">
          Confirm
        </button>
        <button onClick={props.onCancel} data-testid="cancel-delete">
          Cancel
        </button>
      </div>
    ) : null
);

jest.mock('react-hot-toast', () => ({
  success: jest.fn(),
  error: jest.fn(),
}));

beforeEach(() => {
  jest.clearAllMocks();
  Storage.prototype.getItem = jest.fn(() =>
    JSON.stringify([
      {
        productName: 'Test Shoe',
        price: 500,
        size: '42',
        imagePreview: 'https://dummyimage.com/shoe.png',
      },
    ])
  );
  Storage.prototype.setItem = jest.fn();
});

const customRender = (ui: any) => render(<BrowserRouter>{ui}</BrowserRouter>);

describe('GetReadyPage', () => {
  test('launches product successfully', async () => {
    global.fetch = jest.fn((url: any) => {
      if (url.includes('dummyimage.com')) {
        return Promise.resolve({
          blob: () => Promise.resolve(new Blob(['img'], { type: 'image/png' })),
        });
      }

      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ message: 'Uploaded' }),
      });
    }) as any;

    customRender(<GetReadyPage />);

    fireEvent.click(screen.getByText('Launch'));
    fireEvent.click(screen.getByText('Confirm'));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        'Test Shoe launched successfully!'
      );
    });
  });

  test('shows toast error on failed launch response', async () => {
    global.fetch = jest.fn((url: any) => {
      if (url.includes('dummyimage.com')) {
        return Promise.resolve({
          blob: () => Promise.resolve(new Blob(['img'], { type: 'image/png' })),
        });
      }

      return Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ message: 'Launch failed' }),
      });
    }) as any;

    customRender(<GetReadyPage />);

    fireEvent.click(screen.getByText('Launch'));
    fireEvent.click(screen.getByText('Confirm'));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Launch failed');
    });
  });

  test('deletes product from queue', () => {
    customRender(<GetReadyPage />);

    fireEvent.click(screen.getByText('Delete'));
    fireEvent.click(screen.getByText('Confirm'));

    expect(localStorage.setItem).toHaveBeenCalled();
  });
});
