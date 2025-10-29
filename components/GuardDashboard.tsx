
import React, { useState } from 'react';
import { AuthenticatedUser } from '../types';
import { QrCodeIcon, CalendarIcon, ShieldCheckIcon } from './Icons';
import QrScannerModal from './QrScannerModal';
import ScheduleVisitModal from './ScheduleVisitModal';
import ToastNotification from './ToastNotification';

interface GuardDashboardProps {
    user: AuthenticatedUser;
    onLogout: () => void;
}

const GuardDashboard: React.FC<GuardDashboardProps> = ({ user, onLogout }) => {
    const [isScannerOpen, setIsScannerOpen] = useState(false);
    const [isSchedulerOpen, setIsSchedulerOpen] = useState(false);
    const [lastScan, setLastScan] = useState<{data: string, timestamp: Date} | null>(null);
    const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);

    const handleScanSuccess = (data: string) => {
        setIsScannerOpen(false);
        setLastScan({ data, timestamp: new Date() });
        setToast({ message: 'Acceso registrado correctamente.', type: 'success' });
    };
    
    const handleScheduleSuccess = (details: any) => {
        setIsSchedulerOpen(false);
        setToast({ message: `Visita para ${details.name} agendada.`, type: 'success'});
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col p-4 md:p-6">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold">Punto de Control</h1>
                    <p className="text-gray-400">Guardia: {user.name}</p>
                </div>
                <button onClick={onLogout} className="text-sm font-semibold text-gray-400 hover:text-white">Salir</button>
            </header>

            <main className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Actions Panel */}
                <div className="bg-gray-800 rounded-xl p-6 flex flex-col justify-center items-center space-y-6">
                    <button 
                        onClick={() => setIsScannerOpen(true)}
                        className="w-full max-w-xs flex flex-col items-center justify-center p-8 bg-primary rounded-lg text-white font-bold hover:bg-secondary transition-transform transform hover:scale-105"
                    >
                        <QrCodeIcon className="h-16 w-16 mb-4" />
                        <span className="text-xl">Escanear QR</span>
                    </button>
                     <button 
                        onClick={() => setIsSchedulerOpen(true)}
                        className="w-full max-w-xs flex items-center justify-center p-4 bg-gray-700 rounded-lg text-white font-semibold hover:bg-gray-600 transition-colors"
                    >
                        <CalendarIcon className="h-6 w-6 mr-3" />
                        <span>Agendar Visita</span>
                    </button>
                </div>

                {/* Activity Feed */}
                <div className="bg-gray-800 rounded-xl p-6">
                    <h2 className="text-xl font-bold mb-4">Actividad Reciente</h2>
                    <div className="space-y-4">
                        {lastScan ? (
                             <div className="bg-gray-700/50 p-4 rounded-lg flex items-center space-x-4">
                                <div className="p-2 bg-green-500/20 rounded-full">
                                    <ShieldCheckIcon className="h-6 w-6 text-green-400" />
                                </div>
                                <div>
                                    <p className="font-semibold">{lastScan.data}</p>
                                    <p className="text-xs text-gray-400">{lastScan.timestamp.toLocaleTimeString()}</p>
                                </div>
                             </div>
                        ) : (
                            <p className="text-gray-500 text-center pt-8">No hay actividad reciente.</p>
                        )}
                    </div>
                </div>
            </main>

            <QrScannerModal 
                isOpen={isScannerOpen} 
                onClose={() => setIsScannerOpen(false)}
                onScanSuccess={handleScanSuccess}
            />
            <ScheduleVisitModal
                isOpen={isSchedulerOpen}
                onClose={() => setIsSchedulerOpen(false)}
                onSchedule={handleScheduleSuccess}
            />
            {toast && <ToastNotification message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    );
};

export default GuardDashboard;
