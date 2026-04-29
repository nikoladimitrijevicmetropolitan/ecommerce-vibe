import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import Login from './Login';

// Mock-ujemo globalni fetch
global.fetch = vi.fn();

describe('Login Komponenta', () => {
    beforeEach(() => {
        fetch.mockClear();
    });

    const renderLogin = () => {
        render(
            <BrowserRouter>
                <AuthProvider>
                    <Login />
                </AuthProvider>
            </BrowserRouter>
        );
    };

    it('treba da prikaže formu za prijavu', () => {
        renderLogin();
        expect(screen.getByPlaceholderText(/korisničko ime/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/lozinka/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /prijavi se/i })).toBeInTheDocument();
    });

    it('treba da prikaže grešku ako je prijava neuspešna', async () => {
        fetch.mockResolvedValueOnce({
            ok: false,
            json: async () => ({ message: 'Neispravni kredencijali' }),
        });

        renderLogin();

        fireEvent.change(screen.getByPlaceholderText(/korisničko ime/i), { target: { value: 'pogresan' } });
        fireEvent.change(screen.getByPlaceholderText(/lozinka/i), { target: { value: '123' } });
        fireEvent.click(screen.getByRole('button', { name: /prijavi se/i }));

        await waitFor(() => {
            expect(screen.getByText(/neispravni kredencijali/i)).toBeInTheDocument();
        });
    });
});
