'use client';

import PrivateRoute from '../components/PrivateRoute';

export default function Chat() {
    return (
        <PrivateRoute>
            <div>
                <h1>Chat</h1>
                <p>Bem-vindo ao chat!</p>
            </div>
        </PrivateRoute>
    );
}