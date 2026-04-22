import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Navbar.css';

const Navbar = () => {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const { totalItems } = useCart();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/?search=${search}`);
  };

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
          <div className="navbar-categories">
            <Link to="/?category=Elektronika">Elektronika</Link>
            <Link to="/?category=Oprema">Oprema</Link>
          </div>
          <Link to="/cart" className="navbar-cart">
            Korpa <span>({totalItems})</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
