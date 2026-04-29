import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { token } = useAuth();

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/products?size=100');
            const data = await response.json();
            setProducts(data.content);
            setLoading(false);
        } catch (error) {
            console.error('Greška pri učitavanju proizvoda:', error);
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Da li ste sigurni da želite da obrišete ovaj proizvod?')) {
            try {
                const response = await fetch(`http://localhost:8080/api/products/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    setProducts(products.filter(p => p.id !== id));
                    alert('Proizvod uspešno obrisan!');
                } else {
                    alert('Greška pri brisanju proizvoda.');
                }
            } catch (error) {
                console.error('Greška:', error);
            }
        }
    };

    if (loading) return <div className="loading">Učitavanje dashboard-a...</div>;

    return (
        <div className="admin-dashboard">
            <header className="admin-header">
                <h1>Admin Panel</h1>
                <Link to="/admin/products/new" className="btn-add">+ Dodaj Novi Proizvod</Link>
            </header>

            <div className="admin-stats">
                <div className="stat-card">
                    <h3>Ukupno Proizvoda</h3>
                    <p className="stat-number">{products.length}</p>
                </div>
            </div>

            <div className="products-table-container">
                <table className="products-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Slika</th>
                            <th>Naziv</th>
                            <th>Kategorija</th>
                            <th>Cena</th>
                            <th>Stock</th>
                            <th>Akcije</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => (
                            <tr key={product.id}>
                                <td>{product.id}</td>
                                <td><img src={product.imageUrl} alt={product.name} className="admin-thumb" /></td>
                                <td>{product.name}</td>
                                <td>{product.category}</td>
                                <td>{product.price.toLocaleString()} RSD</td>
                                <td>{product.stock}</td>
                                <td className="actions">
                                    <Link to={`/admin/products/edit/${product.id}`} className="btn-edit">Izmeni</Link>
                                    <button onClick={() => handleDelete(product.id)} className="btn-delete">Obriši</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminDashboard;
