import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import ProductCard from './ProductCard';
import './ProductList.css';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const searchParams = new URLSearchParams(location.search);
      const category = searchParams.get('category');
      const search = searchParams.get('search');

      let url = 'http://localhost:8080/api/products';
      const params = [];
      if (category) params.push(`category=${category}`);
      if (search) params.push(`search=${search}`);
      
      if (params.length > 0) {
        url += '?' + params.join('&');
      }

      try {
        const response = await fetch(url);
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Greška pri učitavanju proizvoda:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [location.search]);

  if (loading) return <div className="loading">Učitavanje proizvoda...</div>;

  return (
    <div className="product-list-container">
      <h1>{new URLSearchParams(location.search).get('category') || 'Svi Proizvodi'}</h1>
      <div className="product-grid">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      {products.length === 0 && <p className="no-products">Nema pronađenih proizvoda.</p>}
    </div>
  );
};

export default ProductList;
