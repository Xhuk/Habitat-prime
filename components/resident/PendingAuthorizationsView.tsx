

import React from 'react';
// FIX: Corrected import path for types.
import { type VisitorAuthorizationRequest } from '../../types';

interface PendingAuthorizationsViewProps {
    requests: VisitorAuthorizationRequest[];
    loading: boolean;
    onUpdateRequest: () => void;
}

const PendingAuthorizationsView: React.FC<PendingAuthorizationsViewProps> = ({ requests, loading, onUpdateRequest }) => {
    if (loading) {
        return <p className="text-center p-6">Cargando solicitudes...</p>;
    }

    if (requests.length === 0) {
        return (
            <div className="bg-white p-6 rounded-2xl shadow-lg text-center animate-fade-in">
                <h3 className="text-xl font-bold text-dark-gray">Autorizaciones Pendientes</h3>
                <p className="text-gray-500 mt-4">
                    Aquí aparecerán las solicitudes de acceso que requieran tu aprobación manual desde la caseta de vigilancia.
                </p>
                <div className="mt-8">
                    <p className="text-gray-400">(No tienes solicitudes pendientes)</p>
                </div>
            </div>
        );
    }
    
    // In a real app, these buttons would trigger API calls
    const handleApprove = (id: string) => {
        console.log(`Approving request ${id}`);
        // Mocking the update
        onUpdateRequest();
    };

    const handleReject = (id: string) => {
        console.log(`Rejecting request ${id}`);
        // Mocking the update
        onUpdateRequest();
    };

    return (
        <div className="space-y-4 animate-fade-in">
            {requests.map(req => (
                <div key={req.id} className="bg-white p-4 rounded-lg shadow">
                    <div className="flex justify-between items-start">
                        <h3 className="font-bold text-lg text-dark-gray">Solicitud de Acceso</h3>
                        <span className="px-2 py-1 text-xs font-semibold text-yellow-800 bg-yellow-100 rounded-full">Pendiente</span>
                    </div>
                    <div className="mt-2 text-sm text-gray-700">
                        <p><span className="font-semibold">Visitante:</span> {req.visitorName}</p>
                        <p className="mt-1"><span className="font-semibold">Fecha:</span> {new Date(req.visitDate).toLocaleString()}</p>
                    </div>
                    <div className="mt-4 pt-3 border-t flex space-x-2">
                        <button onClick={() => handleReject(req.id)} className="flex-1 text-center py-2 px-3 bg-red-100 text-red-700 rounded-md text-sm font-semibold hover:bg-red-200">Rechazar</button>
                        <button onClick={() => handleApprove(req.id)} className="flex-1 text-center py-2 px-3 bg-green-100 text-green-700 rounded-md text-sm font-semibold hover:bg-green-200">Aprobar</button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default PendingAuthorizationsView;
