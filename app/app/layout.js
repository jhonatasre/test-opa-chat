import { AuthProvider } from './context/AuthContext';
import "bootstrap/dist/css/bootstrap.min.css";

export const metadata = {
  title: "Chat Opa Test",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
