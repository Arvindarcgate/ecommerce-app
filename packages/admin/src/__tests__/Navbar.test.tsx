import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import Navbar from '../component/Navbar';

describe('Navbar Component', () => {
  test('renders Admin Portal title', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    expect(screen.getByText('Admin Portal')).toBeInTheDocument();
  });

  test('renders all navigation links', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    expect(screen.getByText('Admin Login')).toBeInTheDocument();
    expect(screen.getByText('Admin Signup')).toBeInTheDocument();
    expect(screen.getByText('Add Product')).toBeInTheDocument();
    expect(screen.getByText('Product Launch')).toBeInTheDocument();
    expect(screen.getByText('Product edit')).toBeInTheDocument();
    expect(screen.getByText('Order History')).toBeInTheDocument();
     expect(screen.getByText('coupon')).toBeInTheDocument();
  });

  test('each link has correct route', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    expect(screen.getByText('Admin Login').closest('a')).toHaveAttribute(
      'href',
      '/'
    );
    expect(screen.getByText('Admin Signup').closest('a')).toHaveAttribute(
      'href',
      '/admin-signup'
    );
    expect(screen.getByText('Add Product').closest('a')).toHaveAttribute(
      'href',
      '/add-product'
    );
    expect(screen.getByText('Product Launch').closest('a')).toHaveAttribute(
      'href',
      '/adminproductlaunch'
    );
    expect(screen.getByText('Product edit').closest('a')).toHaveAttribute(
      'href',
      '/product-edit'
    );
    expect(screen.getByText('Order History').closest('a')).toHaveAttribute(
      'href',
      '/admin/orders'
    );

      expect(screen.getByText('coupon').closest('a')).toHaveAttribute(
      'href',
      '/coupon'
    );
  });

  test('matches snapshot', () => {
    const { container } = render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    expect(container).toMatchSnapshot();
  });
});
