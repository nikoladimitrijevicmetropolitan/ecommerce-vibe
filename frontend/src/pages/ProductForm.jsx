import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './ProductForm.css';

const ProductForm = () => {
    const { id } = useParams(); // Ako postoji id, znači da smo u "Edit" modu
    const navigate = useNavigate();
    const { token } = useAuth();
    const isEditMode = !!id;

    const [product, setProduct] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        imageUrl: '',
        stock: ''
    });

    useEffect(() => {
        if (isEditMode) {
            fetchProduct();
        }
    }, [id]);

    const fetchProduct = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/products/${id}`);
            const data = await response.json();
            setProduct(data);
        } catch (error) {
            console.error('Greška pri učitavanju proizvoda:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct(prev => ({
            ...prev,
            [name]: name === 'price' || name === 'stock' ? parseFloat(value) || 0 : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = isEditMode 
            ? `http://localhost:8080/api/products/${id}` 
            : 'http://localhost:8080/api/products';
        
        const method = isEditMode ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(product)
            });

            if (response.ok) {
                alert(isEditMode ? 'Proizvod ažuriran!' : 'Proizvod uspešno dodat!');
                navigate('/admin');
            } else {
                const errorData = await response.json();
                alert('Greška: ' + (errorData.message || 'Neuspešna operacija'));
            }
        } catch (error) {
            console.error('Greška:', error);
            alert('Serverska greška.');
        }
    };

    return (
        <div className="product-form-container">
            <h2>{isEditMode ? 'Izmeni Proizvod' : 'Dodaj Novi Proizvod'}</h2>
            <form onSubmit={handleSubmit} className="product-form">
                <div className="form-group">
                    <label>Naziv Proizvoda</label>
                    <input 
                        type="text" 
                        name="name" 
                        value={product.name} 
                        onChange={handleChange} 
                        required 
                        placeholder="npr. MacBook Air M2"
                    />
                </div>

                <div className="form-group">
                    <label>Kategorija</label>
                    <select name="category" value={product.category} onChange={handleChange} required>
                        <option value="">Izaberi kategoriju</option>
                        <option value="Elektronika">Elektronika</option>
                        <option value="Oprema">Oprema</option>
                        <option value="Nameštaj">Nameštaj</option>
                        <option value="Ostalo">Ostalo</option>
                    </select>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Cena (RSD)</label>
                        <input 
                            type="number" 
                            name="price" 
                            value={product.price} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label>Zalihe (Stock)</label>
                        <input 
                            type="number" 
                            name="stock" 
                            value={product.stock} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label>URL Slike</label>
                    <input 
                        type="text" 
                        name="imageUrl" 
                        value={product.imageUrl} 
                        onChange={handleChange} 
                        required 
                        placeholder="https://putanja-do-slike.jpg"
                    />
                </div>

                <div className="form-group">
                    <label>Opis</label>
                    <textarea 
                        name="description" 
                        value={product.description} 
                        onChange={handleChange} 
                        required 
                        rows="4"
                    ></textarea>
                </div>

                <div className="form-actions">
                    <button type="button" onClick={() => navigate('/admin')} className="btn-cancel">Odustani</button>
                    <button type="submit" className="btn-save">
                        {isEditMode ? 'Sačuvaj Izmene' : 'Kreiraj Proizvod'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProductForm;
