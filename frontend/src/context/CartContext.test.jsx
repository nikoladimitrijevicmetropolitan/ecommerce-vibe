import { renderHook, act } from '@testing-library/react';
import { CartProvider, useCart } from './CartContext';
import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: vi.fn((key) => store[key] || null),
    setItem: vi.fn((key, value) => { store[key] = value.toString(); }),
    clear: vi.fn(() => { store = {}; }),
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('CartContext', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  const wrapper = ({ children }) => <CartProvider>{children}</CartProvider>;

  it('treba da inicijalizuje praznu korpu', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    expect(result.current.cart).toEqual([]);
    expect(result.current.totalItems).toBe(0);
  });

  it('treba da doda proizvod u korpu', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    const product = { id: 1, name: 'Test Product', price: 100 };

    act(() => {
      result.current.addToCart(product, 2);
    });

    expect(result.current.cart).toHaveLength(1);
    expect(result.current.cart[0].product).toEqual(product);
    expect(result.current.cart[0].quantity).toBe(2);
    expect(result.current.totalItems).toBe(2);
    expect(result.current.totalPrice).toBe(200);
  });

  it('treba da ažurira količinu ako se isti proizvod doda ponovo', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    const product = { id: 1, name: 'Test Product', price: 100 };

    act(() => {
      result.current.addToCart(product, 1);
      result.current.addToCart(product, 2);
    });

    expect(result.current.cart).toHaveLength(1);
    expect(result.current.cart[0].quantity).toBe(3);
    expect(result.current.totalItems).toBe(3);
  });

  it('treba da ukloni proizvod iz korpe', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    const product = { id: 1, name: 'Test Product', price: 100 };

    act(() => {
      result.current.addToCart(product, 1);
    });

    expect(result.current.cart).toHaveLength(1);

    act(() => {
      result.current.removeFromCart(1);
    });

    expect(result.current.cart).toHaveLength(0);
  });

  it('treba da isprazni celu korpu', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    
    act(() => {
      result.current.addToCart({ id: 1, price: 100 }, 1);
      result.current.addToCart({ id: 2, price: 200 }, 1);
      result.current.clearCart();
    });

    expect(result.current.cart).toHaveLength(0);
    expect(result.current.totalItems).toBe(0);
  });
});
