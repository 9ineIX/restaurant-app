import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useAuth } from './hooks/useAuth';
import { Login } from './pages/Login';
import { Constructor } from './pages/Constructor';
import { EmployeeDashboard } from './pages/EmployeeDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const AppContent: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#f8f9fa' }}>
        <div className="text-xl">Загрузка...</div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  // Определяем интерфейс по роли пользователя
  const userRole = user.Role?.Name || user.role?.Name;
  
  console.log('Current user:', user);
  console.log('User role:', userRole);
  
  switch (userRole) {
    case 'CLIENT':
      return <Constructor />;
    case 'EMPLOYEE':
      return <EmployeeDashboard />;
    case 'ADMIN':
      return <AdminDashboard />;
    default:
      return <Constructor /> // fallback на клиентский интерфейс
  }
};

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <div style={{
        minHeight: '100vh',
        background: '#f8f9fa',
        margin: 0,
        padding: 0
      }}>
        <AppContent />
        <ReactQueryDevtools initialIsOpen={false} />
      </div>
    </QueryClientProvider>
  );
};

export default App;
