'use client';

import { useRouter } from 'next/navigation';
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (token) {
            fetch('http://locahost:3001/auth/profile', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }).then(response => {

                setUser(response.data.user);

            }).catch(() => {

                localStorage.removeItem('token');
                setUser(null);

            }).finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (username, password) => {
        try {
            const res = await fetch('http://localhost:3001/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    password,
                }),
            });

            if (!res.ok) {
                throw new Error('Falha no login: Credenciais inválidas');
            }

            const { token } = await res.json();
            localStorage.setItem('token', token);

            const resUserData = await fetch('http://localhost:3001/auth/profile', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!resUserData.ok) {
                throw new Error('Falha ao buscar dados do usuário');
            }

            const { user } = await resUserData.json();

            setUser(user);

            router.push('/chat');
        } catch (err) {
            throw new Error(err.message || 'Erro no processo de login');
        }
    };

    const logout = () => {
        router.push('/');
        localStorage.removeItem('token');
        setUser(null);
    };

    const isAuthenticated = () => {
        return !!user;
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
};
