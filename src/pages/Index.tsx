
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import AuthPage from '@/components/auth/AuthPage';
import Dashboard from '@/components/dashboard/Dashboard';

const Index: React.FC = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  return (
    <div className="min-h-screen">
      {isAuthenticated ? <Dashboard /> : <AuthPage />}
    </div>
  );
};

export default Index;
