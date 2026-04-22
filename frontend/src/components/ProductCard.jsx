import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <div className="product-card">
      <Link to={`/product/${product.id}`} className="product-image">
        <img src={product.imageUrl} alt={product.name} />
      </Link>
      <div className="product-info">
        <div className="product-category">{product.category}</div>
        <Link to={`/product/${product.id}`} className="product-name">
          <h3>{product.name}</h3>
        </Link>
        <div className="product-price">{product.price.toLocaleString()} RSD</div>
        <button className="add-to-cart-btn" onClick={() => addToCart(product)}>
          Dodaj u korpu
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
