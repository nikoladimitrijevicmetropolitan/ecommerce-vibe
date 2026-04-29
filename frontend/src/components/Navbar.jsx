import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const { totalItems } = useCart();
  const { user, logout } = useAuth();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/?search=${search}`);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isAdmin = user && user.role === 'ROLE_ADMIN';

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">VibeShop</Link>
        
        <form className="navbar-search" onSubmit={handleSearch}>
          <input 
            type="text" 
            placeholder="Pretraži proizvode..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit">Traži</button>
        </form>

        <div className="navbar-links">
          <Link to="/">Proizvodi</Link>
          
          <Link to="/cart" className="navbar-cart">
            Korpa <span>({totalItems})</span>
          </Link>

          {isAdmin && (
            <Link to="/admin" className="admin-link-nav">Admin</Link>
          )}

          {user ? (
            <div className="navbar-user">
              <span className="user-name">Bok, {user.username}</span>
              <button onClick={handleLogout} className="logout-btn">Odjavi se</button>
            </div>
          ) : (
            <div className="navbar-auth">
              <Link to="/login" className="login-link">Prijava</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
