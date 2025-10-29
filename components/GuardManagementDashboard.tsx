
import React, { useState, useEffect } from 'react';
// FIX: Corrected import paths for types and services.
import { type Guard } from '../types';
import { getGuards } from '../services/mockFirebaseService';

const GuardManagementDashboard: React.FC = () => {
    const [guards, setGuards] = useState<Guard[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGuards = async () => {
            setLoading(true);
            try {
                const data = await getGuards();
                setGuards(data);
            } catch (error) {
                console.error("Failed to fetch guards", error);
            } finally {
                setLoading(false);
            }
        };
        fetchGuards();
    }, []);

    const getStatusBadge = (status: Guard['status']) => {
        switch (status) {
            case 'active': return <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">Activo</span>;
            case 'inactive': return <span className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-200 rounded-full">Inactivo</span>;
            case 'on-break': return <span className="px-2 py-1 text-xs font-semibold text-yellow-800 bg-yellow-100 rounded-full">En Descanso</span>;
        }
    };

    if (loading) {
        return <div className="text-center p-10">Cargando información de guardias...</div>;
    }

    return (
        <div className="bg-white shadow-lg rounded-xl overflow-hidden">
            <div className="p-6 border-b flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-dark-gray">Gestión de Guardias</h2>
                <p className="text-sm text-gray-500 mt-1">Supervisa al personal de seguridad y sus turnos.</p>
              </div>
              <button className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-md hover:bg-secondary">
                Agregar Guardia
              </button>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guardia</th>
                            <th scope="col" className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Turno</th>
                            <th scope="col" className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Último Check-in</th>
                            <th scope="col" className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                            <th scope="col" className="relative p-4"><span className="sr-only">Acciones</span></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {guards.map(guard => (
                            <tr key={guard.id}>
                                <td className="p-4 whitespace-nowrap font-medium text-gray-900">{guard.name}</td>
                                <td className="p-4 whitespace-nowrap text-sm text-gray-500 capitalize">{guard.shift}</td>
                                <td className="p-4 whitespace-nowrap text-sm text-gray-500">{new Date(guard.lastCheckIn).toLocaleString()}</td>
                                <td className="p-4 whitespace-nowrap">{getStatusBadge(guard.status)}</td>
                                <td className="p-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button className="text-blue-600 hover:text-blue-900">Editar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default GuardManagementDashboard;
