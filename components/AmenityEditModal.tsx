
import React, { useState, useEffect } from 'react';
// FIX: Corrected import path for types.
import { type Amenity, type CleaningOptions } from '../types';
import Modal from './Modal';

interface AmenityEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    amenity: Amenity;
    onSave: (amenity: Amenity) => void;
}

const AmenityEditModal: React.FC<AmenityEditModalProps> = ({ isOpen, onClose, amenity, onSave }) => {
    const [formData, setFormData] = useState<Amenity>(amenity);

    useEffect(() => {
        setFormData(amenity);
    }, [amenity]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: parseInt(value, 10) || 0 }));
    };

    const handleCleaningChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        
        if (name === 'type') {
            const newCleaningOptions: CleaningOptions = {
                ...formData.cleaningOptions,
                type: value as CleaningOptions['type'],
            };
             // Reset other fields when type changes
            if (value !== 'extra_cost') newCleaningOptions.extraCost = 0;
            if (value !== 'self_clean') newCleaningOptions.selfCleanInstructions = '';
            setFormData(prev => ({ ...prev, cleaningOptions: newCleaningOptions }));
        } else {
             setFormData(prev => ({
                ...prev,
                cleaningOptions: { ...prev.cleaningOptions, [name]: value }
            }));
        }
    };
     const handleNumberCleaningChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
         setFormData(prev => ({
                ...prev,
                cleaningOptions: { ...prev.cleaningOptions, [name]: parseInt(value, 10) || 0 }
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <form onSubmit={handleSubmit}>
                <div className="p-6">
                    <h3 className="text-lg font-bold">Editar Amenidad: {amenity.name}</h3>
                    <div className="mt-4 space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                        <div>
                            <label className="text-sm font-medium">Costo de Renta ($)</label>
                            <input type="number" name="cost" value={formData.cost} onChange={handleNumberChange} className="w-full p-2 border rounded-md" />
                        </div>
                        <div>
                            <label className="text-sm font-medium">Bloque de Horas por Renta</label>
                            <input type="number" name="bookingBlockHours" value={formData.bookingBlockHours} onChange={handleNumberChange} min="1" max="24" className="w-full p-2 border rounded-md" />
                        </div>
                         <div>
                            <label className="text-sm font-medium">Máximo de Rentas por Día</label>
                            <input type="number" name="maxRentalsPerDay" value={formData.maxRentalsPerDay} onChange={handleNumberChange} min="1" className="w-full p-2 border rounded-md" />
                        </div>

                        <div className="pt-3 border-t">
                            <label className="text-sm font-medium">Opciones de Limpieza</label>
                            <div className="mt-2 space-y-2">
                                <label className="flex items-center">
                                    <input type="radio" name="type" value="included" checked={formData.cleaningOptions.type === 'included'} onChange={handleCleaningChange} className="h-4 w-4 text-primary" />
                                    <span className="ml-2 text-sm">Limpieza incluida en el costo</span>
                                </label>
                                <label className="flex items-center">
                                    <input type="radio" name="type" value="extra_cost" checked={formData.cleaningOptions.type === 'extra_cost'} onChange={handleCleaningChange} className="h-4 w-4 text-primary" />
                                    <span className="ml-2 text-sm">Ofrecer limpieza con costo extra</span>
                                </label>
                                <label className="flex items-center">
                                    <input type="radio" name="type" value="self_clean" checked={formData.cleaningOptions.type === 'self_clean'} onChange={handleCleaningChange} className="h-4 w-4 text-primary" />
                                    <span className="ml-2 text-sm">El residente debe limpiar</span>
                                </label>
                            </div>
                        </div>

                        {formData.cleaningOptions.type === 'extra_cost' && (
                            <div className="pl-6 animate-fade-in">
                                <label className="text-sm font-medium">Costo Extra de Limpieza ($)</label>
                                <input type="number" name="extraCost" value={formData.cleaningOptions.extraCost || ''} onChange={handleNumberCleaningChange} className="w-full p-2 border rounded-md" />
                            </div>
                        )}

                        {formData.cleaningOptions.type === 'self_clean' && (
                            <div className="pl-6 animate-fade-in">
                                <label className="text-sm font-medium">Instrucciones de Auto-Limpieza</label>
                                <textarea name="selfCleanInstructions" value={formData.cleaningOptions.selfCleanInstructions || ''} onChange={handleCleaningChange} rows={3} className="w-full p-2 border rounded-md" placeholder="Ej. Sacar la basura, limpiar superficies..."></textarea>
                            </div>
                        )}
                    </div>
                </div>
                <div className="bg-gray-50 px-6 py-3 flex justify-end space-x-3">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-sm font-semibold rounded-md hover:bg-gray-300">Cancelar</button>
                    <button type="submit" className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-md hover:bg-secondary">Guardar Cambios</button>
                </div>
            </form>
        </Modal>
    );
};

export default AmenityEditModal;
