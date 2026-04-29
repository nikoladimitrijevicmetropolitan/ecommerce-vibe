import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './CheckoutForm.css';

const CheckoutForm = () => {
  const { cart, totalPrice, clearCart } = useCart();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerAddress: ''
  });

  // Zaštita rute: ako nije ulogovan, šalji na login
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    } else if (user) {
      setFormData(prev => ({
        ...prev,
        customerName: user.username,
        customerEmail: user.email || ''
      }));
    }
  }, [user, authLoading, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const orderData = {
      ...formData,
      items: cart.map(item => ({
        product: { id: item.product.id },
        quantity: item.quantity
      })),
      totalPrice: totalPrice
    };

    try {
      const response = await fetch('http://localhost:8080/api/orders', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(orderData)
      });

      if (response.ok) {
        clearCart();
        navigate('/order-success');
      } else if (response.status === 401 || response.status === 403) {
        alert('Vaša sesija je istekla. Molimo prijavite se ponovo.');
        navigate('/login');
      } else {
        const errorMsg = await response.json();
        alert(errorMsg.message || 'Greška pri slanju porudžbine.');
      }
    } catch (error) {
      console.error('Greška:', error);
      alert('Sistem trenutno nije dostupan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-container">
      <h1>Završi kupovinu</h1>
      <form onSubmit={handleSubmit} className="checkout-form">
        <div className="form-group">
          <label>Ime i prezime</label>
          <input 
            type="text" 
            name="customerName" 
            required 
            value={formData.customerName}
            onChange={handleChange}
            placeholder="Petar Petrović"
          />
        </div>
        <div className="form-group">
          <label>Email adresa</label>
          <input 
            type="email" 
            name="customerEmail" 
            required 
            value={formData.customerEmail}
            onChange={handleChange}
            placeholder="petar@example.com"
          />
        </div>
        <div className="form-group">
          <label>Adresa isporuke</label>
          <textarea 
            name="customerAddress" 
            required 
            value={formData.customerAddress}
            onChange={handleChange}
            placeholder="Ulica i broj, Grad"
          ></textarea>
        </div>
        
        <div className="checkout-total">
          <span>Ukupno za uplatu:</span>
          <span>{totalPrice.toLocaleString()} RSD</span>
        </div>

        <button type="submit" disabled={loading || cart.length === 0} className="submit-order-btn">
          {loading ? 'Slanje...' : 'Potvrdi porudžbinu'}
        </button>
      </form>
    </div>
  );
};

export default CheckoutForm;
