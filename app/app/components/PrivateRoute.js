'use client';

import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const PrivateRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated()) {
            router.push('/');
        }
    }, [isAuthenticated, router]);

    if (!isAuthenticated()) {
        return router.push('/');
    }

    return children;
};

export default PrivateRoute;