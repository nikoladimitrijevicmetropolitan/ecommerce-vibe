import React from 'react';
import { Link } from 'react-router-dom';
import './OrderSuccess.css';

const OrderSuccess = () => {
  return (
    <div className="success-container">
      <div className="success-icon">✓</div>
      <h1>Porudžbina je uspešno poslata!</h1>
      <p>Hvala vam na poverenju. Uskoro ćete dobiti email sa detaljima potvrde.</p>
      <Link to="/" className="back-home-btn">Nastavi kupovinu</Link>
    </div>
  );
};

export default OrderSuccess;
