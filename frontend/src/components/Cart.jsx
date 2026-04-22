import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Cart.css';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, totalPrice } = useCart();

  if (cart.length === 0) {
    return (
      <div className="cart-empty">
        <h2>Vaša korpa je prazna</h2>
        <Link to="/" className="continue-shopping">Vrati se u prodavnicu</Link>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h1>Vaša Korpa</h1>
      <div className="cart-grid">
        <div className="cart-items">
          {cart.map(item => (
            <div key={item.product.id} className="cart-item">
              <img src={item.product.imageUrl} alt={item.product.name} />
              <div className="item-details">
                <h3>{item.product.name}</h3>
                <p>{item.product.price.toLocaleString()} RSD</p>
              </div>
              <div className="item-quantity">
                <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)}>+</button>
              </div>
              <div className="item-total">
                {(item.product.price * item.quantity).toLocaleString()} RSD
              </div>
              <button className="remove-btn" onClick={() => removeFromCart(item.product.id)}>
                Ukloni
              </button>
            </div>
          ))}
        </div>
        <div className="cart-summary">
          <h3>Rezime porudžbine</h3>
          <div className="summary-row">
            <span>Ukupno za artikle:</span>
            <span>{totalPrice.toLocaleString()} RSD</span>
          </div>
          <div className="summary-row">
            <span>Dostava:</span>
            <span>Besplatna</span>
          </div>
          <div className="summary-total">
            <span>UKUPNO:</span>
            <span>{totalPrice.toLocaleString()} RSD</span>
          </div>
          <Link to="/checkout" className="checkout-btn">Nastavi na plaćanje</Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;
