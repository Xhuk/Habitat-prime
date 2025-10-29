

import React, { useState, useEffect } from 'react';
import { type AuthenticatedUser, type VisitorAuthorizationRequest } from '../../types';
import GenerateAccessFlow from './GenerateAccessFlow';
import PendingAuthorizationsView from './PendingAuthorizationsView';

// A mock service function, in a real app this would be in mockFirebaseService
const getPendingAuthorizations = async (userId: string): Promise<VisitorAuthorizationRequest[]> => {
    // In a real app, filter from a central list.
    // Here we'll just return a mock value for demo purposes if it's the main resident user.
    if (userId === 'user-resident1') {
        return [
            // FIX: Added missing properties to match VisitorAuthorizationRequest type.
            { id: 'auth-req-1', visitorName: 'Paquete de Amazon', idPhotoUrl: 'https://placehold.co/400x300/png', visitDate: new Date().toISOString(), residentId: 'user-resident1', residentName: 'Residente Demo', property: 'Casa 42', status: 'pending' },
        ];
    }
    return [];
};

interface AccessDashboardProps {
    user: AuthenticatedUser;
}

const AccessDashboard: React.FC<AccessDashboardProps> = ({ user }) => {
    type AccessView = 'generate' | 'pending';
    const [view, setView] = useState<AccessView>('generate');
    const [requests, setRequests] = useState<VisitorAuthorizationRequest[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const data = await getPendingAuthorizations(user.id);
            setRequests(data);
        } catch (error) {
            console.error("Failed to fetch pending requests", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (view === 'pending') {
            fetchRequests();
        }
    }, [view, user.id]);

    // This function is for the child component to trigger a refresh of data.
    const handleUpdateRequest = () => {
        fetchRequests();
    };

    return (
        <div className="animate-fade-in space-y-6">
            <header>
                <h1 className="text-3xl font-bold text-dark-gray">Control de Accesos</h1>
                <p className="text-gray-500 mt-1">Genera pases de acceso y autoriza visitas.</p>
            </header>
            
            <div className="flex bg-gray-200 rounded-lg p-1">
                <button 
                    onClick={() => setView('generate')}
                    className={`flex-1 py-2 text-sm font-semibold rounded-md transition-colors ${view === 'generate' ? 'bg-white shadow' : 'text-gray-600'}`}
                >
                    Generar Acceso
                </button>
                <button 
                    onClick={() => setView('pending')}
                    className={`flex-1 py-2 text-sm font-semibold rounded-md transition-colors ${view === 'pending' ? 'bg-white shadow' : 'text-gray-600'}`}
                >
                    Pendientes <span className="bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full px-2 py-0.5">{requests.length}</span>
                </button>
            </div>

            <div>
                {view === 'generate' && <GenerateAccessFlow user={user} />}
                {view === 'pending' && <PendingAuthorizationsView requests={requests} loading={loading} onUpdateRequest={handleUpdateRequest} />}
            </div>
        </div>
    );
};

export default AccessDashboard;