'use client';

import { useRouter } from 'next/navigation';
import { createContext, useContext, useState, useEffect } from 'react';

import * as api from '../services/apiService';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [logged, setLogged] = useState(null);
    const router = useRouter();

    useEffect(() => {
        if (!logged) {
            router.push('/');
        }
    }, [logged, router]);

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (token) {
            api.get({
                endpoint: '/auth/profile',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }).then(response => {
                setLogged(response.data.user);
            }).catch(() => {
                localStorage.removeItem('token');
                setLogged(null);

            });
        }
    }, []);

    const login = async (username, password) => {
        try {
            const res = await api.post({
                endpoint: '/auth/login',
                body: {
                    username,
                    password,
                },
            });

            if (!res.ok) {
                throw new Error('Falha no login: Credenciais inválidas');
            }

            const { token } = await res.json();
            localStorage.setItem('token', token);

            const resUserData = await api.get({
                endpoint: '/auth/profile',
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            if (!resUserData.ok) {
                throw new Error('Falha ao buscar dados do usuário');
            }

            const { user } = await resUserData.json();

            setLogged(user);

            router.push('/dashboard');
        } catch (err) {
            throw new Error(err.message || 'Erro no processo de login');
        }
    };

    const logout = () => {
        router.push('/');
        localStorage.removeItem('token');
        setLogged(null);
    };

    const isAuthenticated = () => {
        return !!logged;
    };

    return (
        <AuthContext.Provider value={{ logged, login, logout, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
};
