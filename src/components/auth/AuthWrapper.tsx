import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import LoadingSpinner from '../ui/LoadingSpinner';

interface AuthWrapperProps {
  children: React.ReactNode;
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const [isLoginMode, setIsLoginMode] = useState(true);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return isLoginMode ? (
      <LoginPage onToggleMode={() => setIsLoginMode(false)} />
    ) : (
      <RegisterPage onToggleMode={() => setIsLoginMode(true)} />
    );
  }

  return <>{children}</>;
};

export default AuthWrapper;