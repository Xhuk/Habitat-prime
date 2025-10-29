
import React, { useState, useEffect } from 'react';
import { type Provider } from '../types';
import { getProviders, addProvider } from '../services/mockFirebaseService';
import ProviderEditModal from './ProviderEditModal';
import { PlusIcon } from './Icons';

const ProvidersDashboard: React.FC = () => {
    const [providers, setProviders] = useState<Provider[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchProviders = async () => {
        setLoading(true);
        try {
            const data = await getProviders();
            setProviders(data);
        } catch (error) {
            console.error("Failed to fetch providers", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProviders();
    }, []);

    const handleSaveProvider = async (providerData: Omit<Provider, 'id' | 'ratings' | 'averageRating'>) => {
        try {
            await addProvider(providerData);
            setIsModalOpen(false);
            fetchProviders(); // Refresh list
        } catch (error) {
            console.error("Failed to save provider", error);
        }
    };
    
    if (loading) {
        return <p className="p-6 text-center">Cargando proveedores...</p>;
    }

    return (
        <>
            <div className="bg-white shadow-lg rounded-xl">
                <div className="p-6 border-b flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-dark-gray">Proveedores</h2>
                        <p className="text-sm text-gray-500 mt-1">Gestiona los proveedores de servicios para la comunidad y residentes.</p>
                    </div>
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center space-x-2 px-4 py-2 bg-primary text-white text-sm font-semibold rounded-md hover:bg-secondary"
                    >
                        <PlusIcon className="h-5 w-5" />
                        <span>Nuevo Proveedor</span>
                    </button>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Proveedor</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ámbito</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Marketplace</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {providers.map(p => (
                                <tr key={p.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="font-semibold">{p.name}</div>
                                        <div className="text-sm text-gray-500">{p.serviceCategory}</div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {p.servesCommunity && <span className="px-2 py-1 text-xs font-semibold bg-indigo-100 text-indigo-800 rounded-full">Comunidad</span>}
                                        {p.servesResidents && <span className="px-2 py-1 text-xs font-semibold bg-teal-100 text-teal-800 rounded-full ml-1">Residentes</span>}
                                    </td>
                                    <td className="px-6 py-4">
                                        {p.isWhitelisted 
                                            ? <span className="px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full">Visible</span>
                                            : <span className="px-2 py-1 text-xs font-semibold bg-gray-200 text-gray-800 rounded-full">Oculto</span>
                                        }
                                    </td>
                                    <td className="px-6 py-4 text-sm font-semibold text-yellow-500">★ {p.averageRating.toFixed(1)}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-primary hover:underline text-sm font-semibold">Editar</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <ProviderEditModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveProvider}
            />
        </>
    );
};

export default ProvidersDashboard;
