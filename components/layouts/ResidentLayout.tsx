
import React, { useState } from 'react';
import { AuthenticatedUser, ResidentView } from '../../types';
import TabBar from '../TabBar';
import ResidentDashboard from '../resident/ResidentDashboard';
import AccessDashboard from '../resident/AccessDashboard';
import FinanceDashboard from '../resident/FinanceDashboard';
import CommunityDashboard from '../resident/CommunityDashboard';
import MoreScreen from '../resident/MoreScreen';
import ProfileScreen from '../resident/ProfileScreen';
import AmenitiesResidentDashboard from '../resident/AmenitiesResidentDashboard';
import PackagesDashboard from '../resident/PackagesDashboard';
import SupportDashboard from '../resident/SupportDashboard';
import NotificationScreen from '../resident/NotificationScreen';
import MarketplaceDashboard from '../resident/MarketplaceDashboard';

interface ResidentLayoutProps {
  user: AuthenticatedUser;
  onLogout: () => void;
}

const ResidentLayout: React.FC<ResidentLayoutProps> = ({ user, onLogout }) => {
  const [currentView, setCurrentView] = useState<ResidentView>('inicio');

  const renderView = () => {
    switch (currentView) {
      case 'inicio': return <ResidentDashboard user={user} onViewChange={setCurrentView} />;
      case 'accesos': return <AccessDashboard user={user} />;
      case 'finanzas': return <FinanceDashboard user={user} />;
      case 'comunidad': return <CommunityDashboard />;
      case 'más': return <MoreScreen user={user} onNavigate={setCurrentView} onLogout={onLogout} />;
      case 'perfil': return <ProfileScreen user={user} />;
      case 'amenidades': return <AmenitiesResidentDashboard user={user} />;
      case 'paqueteria': return <PackagesDashboard />;
      case 'soporte': return <SupportDashboard />;
      case 'notificaciones': return <NotificationScreen />;
      case 'marketplace': return <MarketplaceDashboard user={user}/>;
      default: return <ResidentDashboard user={user} onViewChange={setCurrentView} />;
    }
  };
  
  const viewTitles: Record<ResidentView, string> = {
    inicio: `Hola, ${user.name.split(' ')[0]}`,
    accesos: 'Accesos',
    finanzas: 'Mis Finanzas',
    comunidad: 'Comunidad',
    más: 'Más Opciones',
    perfil: 'Mi Perfil',
    amenidades: 'Amenidades',
    paqueteria: 'Paquetería',
    soporte: 'Soporte',
    notificaciones: 'Notificaciones',
    marketplace: 'Proveedores'
  };

  return (
    <div className="bg-light-gray min-h-screen font-sans">
        <main className="p-4 pb-24">
             <h1 className="text-3xl font-bold text-dark-gray mb-6">{viewTitles[currentView]}</h1>
             {renderView()}
        </main>
      <TabBar currentView={currentView} onViewChange={setCurrentView} />
    </div>
  );
};

export default ResidentLayout;
