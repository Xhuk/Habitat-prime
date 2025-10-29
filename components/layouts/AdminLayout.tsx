

import React, { useState, useEffect } from 'react';
import { AuthenticatedUser, View, LicenseInfo } from '../../types';
import Sidebar from '../Sidebar';
import Header from '../Header';
import Dashboard from '../Dashboard';
import PaymentDashboard from '../PaymentDashboard';
import ReconciliationHistoryDashboard from '../ReconciliationHistoryDashboard';
import BookingsDashboard from '../BookingsDashboard';
import AmenitiesDashboard from '../AmenitiesDashboard';
import CommunicationsDashboard from '../CommunicationsDashboard';
import ProvidersDashboard from '../ProvidersDashboard';
import GuardManagementDashboard from '../GuardManagementDashboard';
import ChatDashboard from '../ChatDashboard';
import ConfigurationDashboard from '../ConfigurationDashboard';
import FinancialsDashboard from '../FinancialsDashboard';
import LicenseModal from '../LicenseModal';

interface AdminLayoutProps {
  user: AuthenticatedUser;
  onLogout: () => void;
}

type LicenseStatus = 'VALID' | 'EXPIRING_SOON' | 'EXPIRED' | 'UNLICENSED' | 'CHECKING';

const AdminLayout: React.FC<AdminLayoutProps> = ({ user, onLogout }) => {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [licenseStatus, setLicenseStatus] = useState<LicenseStatus>('CHECKING');
  const [licenseInfo, setLicenseInfo] = useState<LicenseInfo | null>(null);
  const [daysRemaining, setDaysRemaining] = useState<number | null>(null);

  const checkLicense = () => {
    const savedLicense = localStorage.getItem('habitatLicense');
    if (!savedLicense) {
      setLicenseStatus('UNLICENSED');
      return;
    }

    const parsedLicense: LicenseInfo = JSON.parse(savedLicense);
    setLicenseInfo(parsedLicense);
    const now = new Date();
    const expiryDate = new Date(parsedLicense.expiresAt);
    const timeDiff = expiryDate.getTime() - now.getTime();
    const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));
    setDaysRemaining(daysLeft);

    if (daysLeft <= 0) {
      setLicenseStatus('EXPIRED');
    } else if (daysLeft <= 10) {
      setLicenseStatus('EXPIRING_SOON');
    } else {
      setLicenseStatus('VALID');
    }
  };

  useEffect(() => {
    checkLicense();
  }, []);
  
  const handleLicenseSuccess = () => {
      checkLicense(); // Re-check the license status after a new key is applied
  };


  const renderView = () => {
    switch (currentView) {
      case 'dashboard': return <Dashboard onViewChange={setCurrentView} />;
      case 'pagos': return <PaymentDashboard />;
      case 'conciliaciones': return <ReconciliationHistoryDashboard />;
      case 'reservas': return <BookingsDashboard />;
      case 'amenidades': return <AmenitiesDashboard />;
      // FIX: Changed 'comunicados' to 'comunidad' to match the View type.
      case 'comunidad': return <CommunicationsDashboard />;
      case 'proveedores': return <ProvidersDashboard />;
      case 'guardias': return <GuardManagementDashboard />;
      case 'chat': return <ChatDashboard user={user} />;
      case 'configuracion': return <ConfigurationDashboard />;
      case 'financiero': return <FinancialsDashboard />;
      default: return <Dashboard onViewChange={setCurrentView} />;
    }
  };

  if (licenseStatus === 'CHECKING') {
      return <div className="h-screen w-screen flex items-center justify-center">Verificando licencia...</div>
  }

  if (licenseStatus === 'UNLICENSED' || licenseStatus === 'EXPIRED') {
      return <LicenseModal status={licenseStatus} onSuccess={handleLicenseSuccess} />;
  }

  return (
    <div className="flex h-screen bg-light-gray font-sans">
      <Sidebar 
        currentView={currentView} 
        onViewChange={setCurrentView} 
        isSidebarOpen={isSidebarOpen}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        {licenseStatus === 'EXPIRING_SOON' && (
            <div className="bg-yellow-400 text-center p-2 text-sm font-semibold text-yellow-900">
                Tu licencia expira en {daysRemaining} días. 
                <button onClick={() => setLicenseStatus('EXPIRED')} className="underline hover:text-yellow-700 ml-2">Renovar Ahora</button>
            </div>
        )}
        <Header 
            user={user} 
            onLogout={onLogout} 
            onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            currentView={currentView}
            onViewChange={setCurrentView}
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          {renderView()}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;