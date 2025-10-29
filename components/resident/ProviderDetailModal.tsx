// FIX: This file was a placeholder. Implemented the ProviderDetailModal component to show service provider details to residents.
import React from 'react';
import { type Provider } from '../../types';
import Modal from '../Modal';

interface ProviderDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    provider: Provider;
}

const ProviderDetailModal: React.FC<ProviderDetailModalProps> = ({ isOpen, onClose, provider }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div>
                <div className="p-6">
                    <h3 className="text-xl font-bold text-dark-gray">{provider.name}</h3>
                    <p className="text-sm text-gray-500">{provider.serviceCategory}</p>
                    
                    <div className="mt-4 text-center text-lg font-bold text-yellow-500">
                        ★ {provider.averageRating.toFixed(1)}
                        <span className="text-sm text-gray-400 font-normal ml-2">({provider.ratings.length} ratings)</span>
                    </div>

                    <div className="mt-4 pt-4 border-t space-y-2 text-sm">
                        <p><span className="font-semibold">Contacto:</span> {provider.contactName}</p>
                        <p><span className="font-semibold">Teléfono:</span> <a href={`tel:${provider.phone}`} className="text-primary hover:underline">{provider.phone}</a></p>
                        {provider.description && <p className="mt-2 text-gray-600">{provider.description}</p>}
                    </div>

                    <div className="mt-4">
                        <h4 className="font-semibold text-sm mb-2">Dejar una Calificación</h4>
                        <div className="flex justify-center text-3xl text-gray-300">
                            {[1, 2, 3, 4, 5].map(star => (
                                <button key={star} className="hover:text-yellow-400 transition-colors">★</button>
                            ))}
                        </div>
                    </div>

                </div>
                <div className="bg-gray-50 px-6 py-4 flex justify-end">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-sm font-semibold rounded-md hover:bg-gray-300">Cerrar</button>
                </div>
            </div>
        </Modal>
    );
};

export default ProviderDetailModal;
