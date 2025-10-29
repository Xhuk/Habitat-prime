

import React, { useState } from 'react';
// FIX: Corrected import paths for types and services.
import { type AuthenticatedUser, type Role } from '../types';
import { login } from '../services/mockFirebaseService';
import { ArrowLeftIcon } from './Icons';


interface LoginProps {
  role: 'resident' | 'admin';
  onLoginSuccess: (user: AuthenticatedUser) => void;
  onResetConfig: () => void;
}

const Login: React.FC<LoginProps> = ({ role, onLoginSuccess, onResetConfig }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      // FIX: Removed the third 'rememberMe' argument as the login function only accepts two.
      const user = await login(email, password);
      if(user.role !== role) {
          throw new Error(`Credenciales correctas, pero no para el rol de ${role}.`);
      }
      onLoginSuccess(user);
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión.');
    } finally {
      setLoading(false);
    }
  };

  const roleName = role === 'resident' ? 'Residente' : 'Administrador';

  return (
    <div className="min-h-screen bg-light-gray flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative">
      <button onClick={onResetConfig} className="absolute top-4 left-4 flex items-center text-sm font-medium text-gray-600 hover:text-primary">
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Cambiar Rol
      </button>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-dark-gray">
          Habitat.app
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Inicia sesión como <span className="font-bold capitalize">{roleName}</span>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-md sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Dirección de Email
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Recordarme
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-primary hover:text-primary-dark">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
            </div>
            
            {error && <p className="text-sm text-center text-red-600">{error}</p>}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:bg-gray-400"
              >
                {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;