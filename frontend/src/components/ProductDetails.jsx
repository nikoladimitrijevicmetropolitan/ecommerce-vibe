import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './ProductDetails.css';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/products/${id}`);
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error('Greška pri učitavanju detalja:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <div className="loading">Učitavanje...</div>;
  if (!product) return <div className="error">Proizvod nije pronađen.</div>;

  return (
    <div className="product-details-container">
      <div className="product-details-grid">
        <div className="details-image">
          <img src={product.imageUrl} alt={product.name} />
        </div>
        <div className="details-info">
          <div className="details-category">{product.category}</div>
          <h1>{product.name}</h1>
          <div className="details-price">{product.price.toLocaleString()} RSD</div>
          <p className="details-description">{product.description}</p>
          
          <div className="details-actions">
            <div className="quantity-selector">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)}>+</button>
            </div>
            <button className="buy-btn" onClick={() => addToCart(product, quantity)}>
              Dodaj u korpu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
