import React, { useState, useEffect } from 'react';
// FIX: Corrected import path for types.
import { type Provider } from '../types';
import Modal from './Modal';

interface ProviderEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (providerData: Omit<Provider, 'id' | 'ratings' | 'averageRating'>) => void;
}

const ProviderEditModal: React.FC<ProviderEditModalProps> = ({ isOpen, onClose, onSave }) => {
    const [name, setName] = useState('');
    const [serviceCategory, setServiceCategory] = useState('');
    const [contactName, setContactName] = useState('');
    const [phone, setPhone] = useState('');
    const [isWhitelisted, setIsWhitelisted] = useState(true);
    const [servesCommunity, setServesCommunity] = useState(false);
    const [servesResidents, setServesResidents] = useState(true);

    // Reset whitelist status if provider doesn't serve residents
    useEffect(() => {
        if (!servesResidents) {
            setIsWhitelisted(false);
        }
    }, [servesResidents]);

    const resetForm = () => {
        setName('');
        setServiceCategory('');
        setContactName('');
        setPhone('');
        setIsWhitelisted(true);
        setServesCommunity(false);
        setServesResidents(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!servesCommunity && !servesResidents) {
            alert("Debe seleccionar al menos un ámbito de servicio.");
            return;
        }
        onSave({ name, serviceCategory, contactName, phone, isWhitelisted, servesCommunity, servesResidents });
        resetForm();
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };


    return (
        <Modal isOpen={isOpen} onClose={handleClose}>
            <form onSubmit={handleSubmit}>
                <div className="p-6">
                    <h3 className="text-lg font-bold">Agregar Nuevo Proveedor</h3>
                    <div className="mt-4 space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                        <div>
                            <label className="text-sm font-medium">Ámbito de Servicio</label>
                            <div className="space-y-2 mt-1">
                                <label className="flex items-center">
                                    <input type="checkbox" checked={servesCommunity} onChange={e => setServesCommunity(e.target.checked)} className="h-4 w-4 text-primary rounded" />
                                    <span className="ml-2 text-sm">Servicio para la Comunidad (Interno)</span>
                                </label>
                                <label className="flex items-center">
                                    <input type="checkbox" checked={servesResidents} onChange={e => setServesResidents(e.target.checked)} className="h-4 w-4 text-primary rounded" />
                                    <span className="ml-2 text-sm">Servicio para Residentes (Marketplace)</span>
                                </label>
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-medium">Nombre del Negocio</label>
                            <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full p-2 border rounded-md" />
                        </div>
                        <div>
                            <label className="text-sm font-medium">Categoría de Servicio</label>
                            <input type="text" value={serviceCategory} onChange={e => setServiceCategory(e.target.value)} required className="w-full p-2 border rounded-md" placeholder="Ej. Plomería, Mantenimiento" />
                        </div>
                         <div>
                            <label className="text-sm font-medium">Nombre de Contacto</label>
                            <input type="text" value={contactName} onChange={e => setContactName(e.target.value)} required className="w-full p-2 border rounded-md" />
                        </div>
                         <div>
                            <label className="text-sm font-medium">Teléfono</label>
                            <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} required className="w-full p-2 border rounded-md" />
                        </div>
                         <div className={!servesResidents ? 'opacity-50' : ''}>
                            <label className="flex items-center">
                                <input type="checkbox" checked={isWhitelisted} onChange={e => setIsWhitelisted(e.target.checked)} disabled={!servesResidents} className="h-4 w-4 text-primary rounded" />
                                <span className="ml-2 text-sm">Autorizado para ser visible a residentes</span>
                            </label>
                            {!servesResidents && <p className="text-xs text-gray-400 ml-6">Debe servir a residentes para ser visible en el marketplace.</p>}
                        </div>
                    </div>
                </div>
                <div className="bg-gray-50 px-6 py-3 flex justify-end space-x-3">
                    <button type="button" onClick={handleClose} className="px-4 py-2 bg-gray-200 text-sm font-semibold rounded-md hover:bg-gray-300">Cancelar</button>
                    <button type="submit" className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-md hover:bg-secondary">Guardar Proveedor</button>
                </div>
            </form>
        </Modal>
    );
};

export default ProviderEditModal;
