import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ProductCard from './ProductCard';
import Pagination from './Pagination';
import './ProductList.css';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageData, setPageData] = useState({
    number: 0,
    totalPages: 0,
    totalElements: 0
  });
  
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  
  const currentPage = parseInt(searchParams.get('page')) || 0;
  const currentSort = searchParams.get('sort') || 'id,asc';

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const category = searchParams.get('category');
      const search = searchParams.get('search');
      const page = searchParams.get('page') || 0;
      const sort = searchParams.get('sort') || 'id,asc';

      let url = `http://localhost:8080/api/products?page=${page}&sort=${sort}`;
      if (category) url += `&category=${category}`;
      if (search) url += `&search=${search}`;

      try {
        const response = await fetch(url);
        const data = await response.json();
        // Spring Data Page objekat ima 'content' polje
        setProducts(data.content);
        setPageData({
          number: data.number,
          totalPages: data.totalPages,
          totalElements: data.totalElements
        });
      } catch (error) {
        console.error('Greška pri učitavanju proizvoda:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [location.search]);

  const handlePageChange = (newPage) => {
    searchParams.set('page', newPage);
    navigate({ search: searchParams.toString() });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSortChange = (e) => {
    searchParams.set('sort', e.target.value);
    searchParams.set('page', 0); // Resetuj na prvu stranu pri promeni sortiranja
    navigate({ search: searchParams.toString() });
  };

  if (loading) return <div className="loading">Učitavanje proizvoda...</div>;

  return (
    <div className="product-list-container">
      <div className="list-header">
        <h1>{searchParams.get('category') || 'Svi Proizvodi'}</h1>
        
        <div className="sort-controls">
          <label htmlFor="sort">Sortiraj po:</label>
          <select id="sort" value={currentSort} onChange={handleSortChange}>
            <option value="id,asc">Podrazumevano</option>
            <option value="price,asc">Cena: Niža ka višoj</option>
            <option value="price,desc">Cena: Viša ka nižoj</option>
            <option value="name,asc">Naziv: A-Z</option>
            <option value="name,desc">Naziv: Z-A</option>
          </select>
        </div>
      </div>

      <p className="results-count">Pronađeno {pageData.totalElements} proizvoda</p>

      <div className="product-grid">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {products.length === 0 && <p className="no-products">Nema pronađenih proizvoda.</p>}

      <Pagination 
        currentPage={pageData.number} 
        totalPages={pageData.totalPages} 
        onPageChange={handlePageChange} 
      />
    </div>
  );
};

export default ProductList;
