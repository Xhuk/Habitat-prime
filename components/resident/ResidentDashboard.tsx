
import React from 'react';
import { AuthenticatedUser, ResidentView } from '../../types';
import { QrCodeIcon, CreditCardIcon, CalendarIcon, BellIcon, MegaphoneIcon } from '../Icons';

interface ResidentDashboardProps {
    user: AuthenticatedUser;
    onViewChange: (view: ResidentView) => void;
}

const ResidentDashboard: React.FC<ResidentDashboardProps> = ({ user, onViewChange }) => {
    
    const quickActions = [
        { view: 'accesos' as ResidentView, label: 'Generar QR', icon: <QrCodeIcon className="h-8 w-8 text-primary" />, color: 'blue' },
        { view: 'finanzas' as ResidentView, label: 'Pagar Cuota', icon: <CreditCardIcon className="h-8 w-8 text-green-500" />, color: 'green' },
        { view: 'amenidades' as ResidentView, label: 'Reservar', icon: <CalendarIcon className="h-8 w-8 text-purple-500" />, color: 'purple' },
        { view: 'notificaciones' as ResidentView, label: 'Alertas', icon: <BellIcon className="h-8 w-8 text-yellow-500" />, color: 'yellow' },
    ];
    
    return (
        <div className="animate-fade-in space-y-6">
            <header className="flex items-center space-x-4">
                <img src={user.avatarUrl} alt="Avatar" className="w-16 h-16 rounded-full object-cover" />
                <div>
                    <p className="text-gray-500">Bienvenido de nuevo,</p>
                    <h2 className="text-2xl font-bold text-dark-gray">{user.name}</h2>
                </div>
            </header>

            <div className="bg-white shadow-lg rounded-2xl p-6 text-center">
                <h3 className="font-bold text-dark-gray">Saldo Pendiente</h3>
                <p className="text-4xl font-bold text-red-500 mt-2">$1,500.00</p>
                <button onClick={() => onViewChange('finanzas')} className="mt-4 w-full max-w-xs py-3 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-secondary shadow">
                    Ir a Pagar
                </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                {quickActions.map(action => (
                    <button 
                        key={action.view}
                        onClick={() => onViewChange(action.view)}
                        className="bg-white shadow-lg rounded-2xl p-4 flex flex-col items-center justify-center text-center space-y-2 hover:bg-gray-50 transition-colors"
                    >
                        {action.icon}
                        <span className="text-sm font-semibold text-dark-gray">{action.label}</span>
                    </button>
                ))}
            </div>

            <div className="bg-white shadow-lg rounded-2xl p-4">
                <h3 className="font-bold text-dark-gray mb-3 px-2">Últimos Comunicados</h3>
                <div className="space-y-2">
                    <div className="p-3 hover:bg-gray-50 rounded-lg flex items-start space-x-3">
                        <div className="p-2 bg-blue-100 rounded-full mt-1">
                           <MegaphoneIcon className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                           <p className="font-semibold text-sm">Mantenimiento de Alberca</p>
                           <p className="text-xs text-gray-500">Se realizará mantenimiento el próximo Lunes...</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResidentDashboard;
