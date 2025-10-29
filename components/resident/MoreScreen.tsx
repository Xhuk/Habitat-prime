
import React from 'react';
// FIX: Corrected import path for types.
import { type AuthenticatedUser, type ResidentView } from '../../types';
import { CubeIcon, BuildingIcon, QuestionMarkCircleIcon, UserIcon, LogOutIcon, WrenchScrewdriverIcon } from '../Icons';

interface MoreScreenProps {
    user: AuthenticatedUser;
    onNavigate: (view: ResidentView) => void;
    onLogout: () => void;
}

const MoreScreen: React.FC<MoreScreenProps> = ({ user, onNavigate, onLogout }) => {
    
    const menuItems: { view: ResidentView, label: string, icon: React.ReactElement }[] = [
        { view: 'paqueteria', label: 'Paquetería', icon: <CubeIcon className="h-6 w-6 text-yellow-500" /> },
        { view: 'amenidades', label: 'Amenidades', icon: <BuildingIcon className="h-6 w-6 text-purple-500" /> },
        { view: 'marketplace', label: 'Proveedores', icon: <WrenchScrewdriverIcon className="h-6 w-6 text-teal-500" /> },
        { view: 'soporte', label: 'Soporte', icon: <QuestionMarkCircleIcon className="h-6 w-6 text-blue-500" /> },
        { view: 'perfil', label: 'Mi Perfil', icon: <UserIcon className="h-6 w-6 text-gray-500" /> },
    ];

    return (
        <div className="animate-fade-in space-y-6">
            <div className="flex items-center p-4 bg-white rounded-2xl shadow-md">
                <img src={user.avatarUrl} alt="Avatar" className="w-16 h-16 rounded-full object-cover" />
                <div className="ml-4">
                    <h1 className="text-xl font-bold text-dark-gray">{user.name}</h1>
                    <p className="text-sm text-gray-500">{user.email}</p>
                </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                <ul className="divide-y divide-gray-200">
                    {menuItems.map(item => (
                        <li key={item.view}>
                            <button onClick={() => onNavigate(item.view)} className="w-full flex items-center p-4 text-left hover:bg-gray-50 transition-colors">
                                {item.icon}
                                <span className="ml-4 font-semibold text-dark-gray">{item.label}</span>
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            <div>
                <button 
                    onClick={onLogout}
                    className="w-full flex items-center justify-center p-4 bg-white text-red-600 rounded-2xl shadow-md font-semibold hover:bg-red-50 transition-colors"
                >
                    <LogOutIcon className="h-5 w-5 mr-3" />
                    Cerrar Sesión
                </button>
            </div>
        </div>
    );
};

export default MoreScreen;
