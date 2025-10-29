


import React, { useState, useEffect } from 'react';
import { type AuthenticatedUser, type Role } from './types';
import { getCurrentUser, logout } from './services/mockFirebaseService';
import Login from './components/Login';
import GuardLogin from './components/GuardLogin';
import AdminLayout from './components/layouts/AdminLayout';
import GuardDashboard from './components/GuardDashboard';
import ResidentLayout from './components/layouts/ResidentLayout';
import RoleSelector from './components/RoleSelector';

const App: React.FC = () => {
  const [appConfig, setAppConfig] = useState<{ role: Role; habitatCode: string } | null>(null);
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkConfigAndSession = async () => {
      setLoading(true);
      try {
        const savedConfig = localStorage.getItem('habitatAppConfig');
        if (savedConfig) {
          const parsedConfig = JSON.parse(savedConfig);
          setAppConfig(parsedConfig);
          // If config exists, check for a logged-in user
          const currentUser = await getCurrentUser();
          setUser(currentUser);
        } else {
          // Default to resident experience on first load
          const defaultConfig = { role: 'resident' as Role, habitatCode: 'CUMBRES2024' };
          localStorage.setItem('habitatAppConfig', JSON.stringify(defaultConfig));
          setAppConfig(defaultConfig);
        }
      } catch (error) {
        console.error("Initialization error", error);
        // Clear corrupted config
        localStorage.removeItem('habitatAppConfig');
      } finally {
        setLoading(false);
      }
    };
    checkConfigAndSession();
  }, []);

  const handleConfigSelect = (role: Role, habitatCode: string) => {
    const config = { role, habitatCode };
    localStorage.setItem('habitatAppConfig', JSON.stringify(config));
    setAppConfig(config);
  };
  
  const handleResetConfig = () => {
      localStorage.removeItem('habitatAppConfig');
      setAppConfig(null);
      handleLogout();
  };

  const handleLoginSuccess = (loggedInUser: AuthenticatedUser) => {
    setUser(loggedInUser);
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
  };

  if (loading) {
    return <div className="h-screen flex items-center justify-center bg-light-gray">Cargando...</div>;
  }
  
  if (!appConfig) {
      return <RoleSelector onConfigSelect={handleConfigSelect} />;
  }

  if (!user) {
    switch (appConfig.role) {
        case 'admin':
        case 'resident':
            return <Login role={appConfig.role} onLoginSuccess={handleLoginSuccess} onResetConfig={handleResetConfig} />;
        case 'guardia':
            return <GuardLogin onLoginSuccess={handleLoginSuccess} onResetConfig={handleResetConfig} />;
        default:
             handleResetConfig();
             return <p>Rol no válido. Por favor, seleccione un rol.</p>;
    }
  }

  // Render dashboard based on role
  switch (user.role) {
    case 'admin':
      return <AdminLayout user={user} onLogout={handleLogout} />;
    case 'guardia':
      return <GuardDashboard user={user} onLogout={handleLogout} />;
    case 'resident':
      return <ResidentLayout user={user} onLogout={handleLogout} />;
    default:
        handleLogout();
        return <p>Rol de usuario no reconocido. Cerrando sesión.</p>;
  }
};

export default App;