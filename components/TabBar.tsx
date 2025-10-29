import React from 'react';
// FIX: Corrected import path for types.
import { type ResidentView } from '../types';
import { HomeIcon, QrCodeIcon, CreditCardIcon, MegaphoneIcon, EllipsisHorizontalIcon } from './Icons';

interface TabBarProps {
  currentView: ResidentView;
  onViewChange: (view: ResidentView) => void;
}

const navItems: { view: ResidentView; label: string; icon: React.ReactElement }[] = [
  { view: 'inicio', label: 'Inicio', icon: <HomeIcon /> },
  { view: 'accesos', label: 'Accesos', icon: <QrCodeIcon /> },
  { view: 'finanzas', label: 'Finanzas', icon: <CreditCardIcon /> },
  { view: 'comunidad', label: 'Comunidad', icon: <MegaphoneIcon /> },
  { view: 'más', label: 'Más', icon: <EllipsisHorizontalIcon /> },
];

const TabBar: React.FC<TabBarProps> = ({ currentView, onViewChange }) => {
  const isMoreSectionActive = ['paqueteria', 'amenidades', 'soporte', 'perfil'].includes(currentView);

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.1)] flex justify-around z-20">
      {navItems.map(item => {
        const isActive = currentView === item.view || (item.view === 'más' && isMoreSectionActive);
        return (
            <button
              key={item.view}
              onClick={() => onViewChange(item.view)}
              className={`flex flex-col items-center justify-center w-full pt-3 pb-2 text-xs transition-colors duration-200 ${
                isActive ? 'text-primary' : 'text-gray-500 hover:text-primary'
              }`}
            >
              <div className="h-7 w-7 mb-1">
                {React.cloneElement(item.icon, { className: 'h-7 w-7' })}
              </div>
              <span className="truncate text-xs font-medium">{item.label}</span>
            </button>
        );
      })}
    </nav>
  );
};
export default TabBar;
