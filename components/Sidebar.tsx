// FIX: Created Sidebar component for admin navigation.
import React from 'react';
import { type View } from '../types';
import {
    CreditCardIcon, CalendarIcon, MegaphoneIcon, ShieldCheckIcon, UserIcon,
    HomeIcon, BuildingIcon, WrenchScrewdriverIcon, ArrowUpTrayIcon
} from './Icons';

interface SidebarProps {
  currentView: View;
  onViewChange: (view: View) => void;
  isSidebarOpen: boolean;
}

const navItems = [
  { view: 'dashboard' as View, label: 'Dashboard', icon: <HomeIcon className="h-5 w-5" /> },
  { view: 'pagos' as View, label: 'Pagos', icon: <CreditCardIcon className="h-5 w-5" /> },
  { view: 'conciliaciones' as View, label: 'Historial Pagos', icon: <ArrowUpTrayIcon className="h-5 w-5" /> },
  { view: 'reservas' as View, label: 'Reservas', icon: <CalendarIcon className="h-5 w-5" /> },
  { view: 'amenidades' as View, label: 'Amenidades', icon: <BuildingIcon className="h-5 w-5" /> },
  // FIX: Changed 'comunicados' to 'comunidad' to match the View type.
  { view: 'comunidad' as View, label: 'Comunicación', icon: <MegaphoneIcon className="h-5 w-5" /> },
  { view: 'proveedores' as View, label: 'Proveedores', icon: <WrenchScrewdriverIcon className="h-5 w-5" /> },
  { view: 'guardias' as View, label: 'Guardias', icon: <ShieldCheckIcon className="h-5 w-5" /> },
  { view: 'directorio' as View, label: 'Directorio', icon: <UserIcon className="h-5 w-5" /> },
];

const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange, isSidebarOpen }) => {
  return (
    <aside className={`bg-dark-gray text-white w-64 space-y-2 py-4 flex-shrink-0 lg:block ${isSidebarOpen ? 'block' : 'hidden'}`}>
      <div className="px-4 mb-4">
        <h1 className="text-2xl font-bold">Habitat.app</h1>
        <p className="text-sm text-gray-400">Admin Panel</p>
      </div>
      <nav>
        <ul>
          {navItems.map(item => (
            <li key={item.view} className="px-2">
              <button
                onClick={() => onViewChange(item.view)}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  currentView === item.view
                    ? 'bg-primary text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;