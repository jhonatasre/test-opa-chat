"use client";

import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect } from 'react';

// export const metadata = {
//   title: "Chat Opa Test",
// };

export default function RootLayout({ children }) {
  useEffect(() => {
    require('bootstrap/dist/js/bootstrap.bundle.min.js');
  }, []);

  return (
    <html lang="pt-br">
      <body>
        <ToastProvider>
          <AuthProvider>{children}</AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
