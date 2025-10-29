// FIX: This file was a placeholder. Implemented the MarketplaceDashboard component for residents to view and select service providers.
import React, { useState, useEffect } from 'react';
import { type Provider, type AuthenticatedUser } from '../../types';
import { getProviders } from '../../services/mockFirebaseService';
import ProviderDetailModal from './ProviderDetailModal';
import { WrenchScrewdriverIcon } from '../Icons';

interface MarketplaceDashboardProps {
    user: AuthenticatedUser;
}

const MarketplaceDashboard: React.FC<MarketplaceDashboardProps> = ({ user }) => {
    const [providers, setProviders] = useState<Provider[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);

    useEffect(() => {
        const fetchProviders = async () => {
            setLoading(true);
            try {
                const allProviders = await getProviders();
                const whitelistedProviders = allProviders.filter(p => p.isWhitelisted && p.servesResidents);
                setProviders(whitelistedProviders);
            } catch (error) {
                console.error("Failed to fetch providers", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProviders();
    }, []);

    if (loading) {
        return <div className="text-center p-10">Cargando proveedores...</div>;
    }

    return (
        <div className="animate-fade-in">
            <h1 className="text-2xl font-bold text-dark-gray">Proveedores</h1>
            <p className="text-gray-500 mt-1 mb-6">Encuentra servicios recomendados por la comunidad.</p>

            {providers.length > 0 ? (
                <div className="space-y-4">
                    {providers.map(provider => (
                        <button 
                            key={provider.id}
                            onClick={() => setSelectedProvider(provider)}
                            className="w-full flex items-center p-4 bg-white rounded-xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all text-left"
                        >
                            <div className="p-3 bg-gray-100 rounded-lg mr-4">
                               <WrenchScrewdriverIcon className="h-6 w-6 text-gray-600" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-dark-gray">{provider.name}</h3>
                                <p className="text-sm text-gray-500">{provider.serviceCategory}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-bold text-yellow-500">
                                    ★ {provider.averageRating.toFixed(1)}
                                </p>
                                <p className="text-xs text-gray-400">({provider.ratings.length} ratings)</p>
                            </div>
                        </button>
                    ))}
                </div>
            ) : (
                <div className="text-center p-10 bg-white rounded-xl shadow-md">
                    <p className="text-gray-500">No hay proveedores recomendados en este momento.</p>
                </div>
            )}

            {selectedProvider && (
                <ProviderDetailModal
                    isOpen={!!selectedProvider}
                    onClose={() => setSelectedProvider(null)}
                    provider={selectedProvider}
                />
            )}
        </div>
    );
};

export default MarketplaceDashboard;
