import React, { useState, useEffect } from 'react';
import { getHabitatConfig, updateHabitatConfig } from '../services/mockFirebaseService';
import { type HabitatConfig } from '../types';
import { StripeIcon, QuestionMarkCircleIcon } from './Icons';
import StripeHelpModal from './StripeHelpModal';

const ConfigurationDashboard: React.FC = () => {
    const [config, setConfig] = useState<HabitatConfig | null>(null);
    const [loading, setLoading] = useState(true);
    const [successMessage, setSuccessMessage] = useState('');
    const [isStripeHelpModalOpen, setIsStripeHelpModalOpen] = useState(false);

    useEffect(() => {
        const fetchConfig = async () => {
            setLoading(true);
            try {
                const data = await getHabitatConfig();
                setConfig(data);
            } catch (error) {
                console.error("Failed to fetch configuration", error);
            } finally {
                setLoading(false);
            }
        };
        fetchConfig();
    }, []);
    
    const handlePackageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { value } = e.target;
        setConfig(prev => prev ? { ...prev, packageManagement: value as 'gate' | 'direct' } : null);
    };

    const handleAccessChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setConfig(prev => {
            if (!prev) return null;
            return {
                ...prev,
                accessControl: {
                    ...prev.accessControl,
                    [name]: parseInt(value, 10) || 0
                }
            };
        });
    };
    
    const handleStripeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, checked, type } = e.target;
        setConfig(prev => {
            if (!prev) return null;
            return {
                ...prev,
                stripe: {
                    ...prev.stripe,
                    [name]: type === 'checkbox' ? checked : value,
                }
            };
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!config) return;
        try {
            await updateHabitatConfig(config);
            setSuccessMessage('Configuración guardada exitosamente.');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error) {
            console.error("Failed to save configuration", error);
        }
    };

    if (loading) {
        return <div className="text-center p-10">Cargando configuración...</div>;
    }

    if (!config) {
        return <div className="text-center p-10 text-red-500">No se pudo cargar la configuración.</div>;
    }

    return (
        <>
            <div className="bg-white shadow-lg rounded-xl">
                <div className="p-6 border-b">
                    <h2 className="text-2xl font-bold text-dark-gray">Configuración del Hábitat</h2>
                    <p className="text-sm text-gray-500 mt-1">Ajusta las reglas y políticas de la comunidad.</p>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-6">
                        <div>
                            <h3 className="text-xl font-bold text-dark-gray">Gestión de Paquetería</h3>
                            <p className="text-sm text-gray-500 mt-1">Define cómo se manejan los paquetes en la comunidad.</p>
                            <select
                                name="packageManagement"
                                value={config.packageManagement}
                                onChange={handlePackageChange}
                                className="mt-2 w-full max-w-xs p-2 border border-gray-300 rounded-md shadow-sm bg-white"
                            >
                                <option value="gate">Paquetes se retienen en caseta</option>
                                <option value="direct">Entrega directa a domicilio</option>
                            </select>
                        </div>

                        <div className="pt-6 border-t">
                            <h3 className="text-xl font-bold text-dark-gray">Pagos en Línea (Stripe)</h3>
                            <p className="text-sm text-gray-500 mt-1">Conecta tu cuenta de Stripe para recibir pagos de residentes por cuotas y amenidades directamente en la app.</p>
                            
                            <div className="mt-4">
                                <label className="flex items-center justify-between cursor-pointer">
                                    <span className="font-medium text-gray-700">Habilitar pagos con tarjeta</span>
                                    <div className="relative">
                                        <input type="checkbox" name="isEnabled" checked={config.stripe.isEnabled} onChange={handleStripeChange} className="sr-only" />
                                        <div className={`block w-14 h-8 rounded-full ${config.stripe.isEnabled ? 'bg-primary' : 'bg-gray-300'}`}></div>
                                        <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${config.stripe.isEnabled ? 'translate-x-6' : ''}`}></div>
                                    </div>
                                </label>
                            </div>
                            
                            {config.stripe.isEnabled && (
                                <div className="mt-4 space-y-4 animate-fade-in">
                                    <div>
                                        <label htmlFor="stripeAccountId" className="flex items-center text-sm font-medium text-gray-700">
                                            Stripe Account ID
                                            <button 
                                                type="button" 
                                                onClick={() => setIsStripeHelpModalOpen(true)}
                                                className="ml-2 text-gray-400 hover:text-primary"
                                                aria-label="Ayuda para encontrar el Account ID"
                                            >
                                                <QuestionMarkCircleIcon className="h-5 w-5" />
                                            </button>
                                        </label>
                                        <input 
                                            type="text" 
                                            id="stripeAccountId" 
                                            name="accountId" 
                                            value={config.stripe.accountId || ''} 
                                            onChange={handleStripeChange}
                                            className="mt-1 w-full max-w-xs p-2 border border-gray-300 rounded-md"
                                            placeholder="acct_xxxxxxxxxxxxxx"
                                        />
                                    </div>
                                    <button type="button" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#635bff] hover:bg-[#5851e8]">
                                        <StripeIcon className="w-5 h-5 mr-2" />
                                        Conectar con Stripe
                                    </button>
                                    <p className="text-xs text-gray-500">Si aún no tienes una cuenta, este botón te guiará para crearla (simulado).</p>
                                </div>
                            )}

                            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                <h4 className="font-semibold text-sm text-yellow-800">Transparencia de Comisiones</h4>
                                <p className="text-xs text-yellow-700 mt-1">
                                    Las transacciones con tarjeta están sujetas a las comisiones estándar de Stripe (ej. ~3.6% + $3.00 MXN por transacción exitosa). Habitat.app no añade costos adicionales. La comisión es descontada por Stripe antes de depositar los fondos en tu cuenta.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-50 px-6 py-4 flex justify-end items-center">
                        {successMessage && <p className="text-sm text-green-600 mr-4">{successMessage}</p>}
                        <button type="submit" className="px-5 py-2 bg-primary text-white text-sm font-semibold rounded-md hover:bg-secondary">
                            Guardar Configuración
                        </button>
                    </div>
                </form>
            </div>
            <StripeHelpModal 
                isOpen={isStripeHelpModalOpen}
                onClose={() => setIsStripeHelpModalOpen(false)}
            />
        </>
    );
};

export default ConfigurationDashboard;