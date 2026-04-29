import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import ProductCard from './ProductCard';
import { useCart } from '../context/CartContext';

// MockujuseCart hook
vi.mock('../context/CartContext', () => ({
  useCart: vi.fn(),
}));

describe('ProductCard', () => {
  const mockProduct = {
    id: 1,
    name: 'Test Laptop',
    price: 120000,
    category: 'Elektronika',
    imageUrl: 'test.jpg'
  };

  const mockAddToCart = vi.fn();

  it('treba da ispravno renderuje podatke o proizvodu', () => {
    useCart.mockReturnValue({ addToCart: mockAddToCart });

    render(
      <BrowserRouter>
        <ProductCard product={mockProduct} />
      </BrowserRouter>
    );

    expect(screen.getByText('Test Laptop')).toBeInTheDocument();
    expect(screen.getByText('120,000 RSD')).toBeInTheDocument();
    expect(screen.getByText('Elektronika')).toBeInTheDocument();
    expect(screen.getByAltText('Test Laptop')).toHaveAttribute('src', 'test.jpg');
  });

  it('treba da pozove addToCart kada se klikne na dugme', () => {
    useCart.mockReturnValue({ addToCart: mockAddToCart });

    render(
      <BrowserRouter>
        <ProductCard product={mockProduct} />
      </BrowserRouter>
    );

    const button = screen.getByText('Dodaj u korpu');
    fireEvent.click(button);

    expect(mockAddToCart).toHaveBeenCalledWith(mockProduct);
  });
});
