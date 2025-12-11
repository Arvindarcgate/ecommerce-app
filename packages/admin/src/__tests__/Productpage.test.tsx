import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProductPages from '../pages/productpages'; // update path!!
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

jest.mock('react-hot-toast', () => ({
  error: jest.fn(),
}));

describe('ProductPages Component', () => {
  let mockNavigate: jest.Mock;

  beforeEach(() => {
    mockNavigate = jest.fn();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    localStorage.clear();
    jest.clearAllMocks();
  });

  const setup = () =>
    render(
      <MemoryRouter>
        <ProductPages />
      </MemoryRouter>
    );

  test('renders product page', () => {
    setup();
    expect(screen.getByTestId('product-page')).toBeInTheDocument();
    expect(screen.getByText('Add New Product')).toBeInTheDocument();
  });

  test('updates input fields', () => {
    setup();

    fireEvent.change(screen.getByLabelText('Product Name'), {
      target: { value: 'Shirt' },
    });

    fireEvent.change(screen.getByLabelText('Product Price'), {
      target: { value: '999' },
    });

    fireEvent.change(screen.getByLabelText('Product Size'), {
      target: { value: 'L' },
    });

    expect(screen.getByLabelText('Product Name')).toHaveValue('Shirt');
    expect(screen.getByLabelText('Product Price')).toHaveValue(999);
    expect(screen.getByLabelText('Product Size')).toHaveValue('L');
  });

  test('shows image preview when file is uploaded', () => {
    setup();

    const file = new File(['dummy'], 'product.png', { type: 'image/png' });

    fireEvent.change(screen.getByTestId('file-input'), {
      target: { files: [file] },
    });

    const img = screen.getByTestId('image-preview');

    expect(img).toBeInTheDocument();

    expect(img).toHaveAttribute('src', 'data:image/png;base64,dummy');
  });

  test('shows validation toast if fields are empty', () => {
    setup();

    fireEvent.submit(screen.getByRole('button', { name: 'Preview Product' }));

    expect(toast.error).toHaveBeenCalledWith(
      'Please fill all fields before submitting.'
    );
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test('saves product to localStorage and navigates', () => {
    setup();

    fireEvent.change(screen.getByLabelText('Product Name'), {
      target: { value: 'Shirt' },
    });

    fireEvent.change(screen.getByLabelText('Product Price'), {
      target: { value: '999' },
    });

    fireEvent.change(screen.getByLabelText('Product Size'), {
      target: { value: 'L' },
    });

    const file = new File(['dummy'], 'product.png', { type: 'image/png' });
    fireEvent.change(screen.getByTestId('file-input'), {
      target: { files: [file] },
    });

    fireEvent.submit(screen.getByRole('button', { name: 'Preview Product' }));

    const stored = JSON.parse(localStorage.getItem('productQueue') || '[]');

    expect(stored.length).toBe(1);
    expect(stored[0]).toMatchObject({
      productName: 'Shirt',
      price: 999,
      size: 'L',
    });

    expect(mockNavigate).toHaveBeenCalledWith('/getReady');
  });
});
