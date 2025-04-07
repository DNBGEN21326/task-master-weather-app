
import React, { useState } from 'react';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';

const AuthPage: React.FC = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);

  const toggleAuthMode = () => {
    setIsLoginMode(!isLoginMode);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-gradient-to-br from-sky-50 to-indigo-100">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">TaskMaster</h1>
        <p className="text-gray-600">Organize your tasks with weather integration</p>
      </div>

      <div className="w-full max-w-md">
        {isLoginMode ? (
          <LoginForm onSwitchToSignup={toggleAuthMode} />
        ) : (
          <SignupForm onSwitchToLogin={toggleAuthMode} />
        )}
      </div>
    </div>
  );
};

export default AuthPage;
