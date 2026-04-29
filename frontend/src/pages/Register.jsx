import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Auth.css';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            return setError('Lozinke se ne podudaraju');
        }

        setLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:8080/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: formData.username,
                    email: formData.email,
                    password: formData.password
                })
            });

            if (response.ok) {
                setSuccess(true);
                setTimeout(() => navigate('/login'), 2000);
            } else {
                const msg = await response.text();
                setError(msg || 'Greška pri registraciji');
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
                <h2>Napravite nalog</h2>
                <p>Pridružite se Vibe zajednici</p>
                
                {error && <div className="auth-error">{error}</div>}
                {success && <div className="auth-success">Uspešna registracija! Preusmeravanje...</div>}
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Korisničko ime</label>
                        <input 
                            type="text" 
                            name="username"
                            value={formData.username} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input 
                            type="email" 
                            name="email"
                            value={formData.email} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label>Lozinka</label>
                        <input 
                            type="password" 
                            name="password"
                            value={formData.password} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label>Potvrdite lozinku</label>
                        <input 
                            type="password" 
                            name="confirmPassword"
                            value={formData.confirmPassword} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>
                    <button type="submit" className="auth-btn" disabled={loading || success}>
                        {loading ? 'Registracija...' : 'Registruj se'}
                    </button>
                </form>
                
                <p className="auth-footer">
                    Već imate nalog? <Link to="/login">Prijavite se</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
