import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (response.ok) {
                login(data);
                navigate('/');
            } else {
                setError(data.message || 'Neispravno korisničko ime ili lozinka');
            }
        } catch (err) {
            setError('Greška pri povezivanju sa serverom');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Dobrodošli nazad</h2>
                <p>Prijavite se da biste nastavili kupovinu</p>
                
                {error && <div className="auth-error">{error}</div>}
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Korisničko ime</label>
                        <input 
                            type="text" 
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)} 
                            required 
                            placeholder="Vaše korisničko ime"
                        />
                    </div>
                    <div className="form-group">
                        <label>Lozinka</label>
                        <input 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                            placeholder="Vaša lozinka"
                        />
                    </div>
                    <button type="submit" className="auth-btn" disabled={loading}>
                        {loading ? 'Prijava...' : 'Prijavi se'}
                    </button>
                </form>
                
                <p className="auth-footer">
                    Nemate nalog? <Link to="/register">Registrujte se</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
