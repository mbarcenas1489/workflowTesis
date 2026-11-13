import { Suspense } from 'react';
import './globals.css';
import MuiProvider from '@/components/providers/MuiProvider';
import { AuthProvider } from '@/context/AuthContext';
import MainLayout from '@/components/layout/MainLayout';

export const metadata = {
  title: 'Workflow Tesis & Monografías | Unidad de Culminación de Estudios',
  description: 'Plataforma integral de gestión de entregas, revisiones APA y autorización de defensas de grado',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <MuiProvider>
          <AuthProvider>
            <Suspense fallback={null}>
              <MainLayout>{children}</MainLayout>
            </Suspense>
          </AuthProvider>
        </MuiProvider>
      </body>
    </html>
  );
}
