import React, { useState, useEffect, useRef } from 'react';
// FIX: Corrected import path for types.
import { type AuthenticatedUser } from '../types';
import Modal from './Modal';
import { UserIcon } from './Icons';
import { processImageForAvatar } from '../utils/imageProcessor';

interface ProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: AuthenticatedUser;
    onUpdate: (user: AuthenticatedUser) => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, user, onUpdate }) => {
    const [formData, setFormData] = useState<AuthenticatedUser>(user);
    const [newAvatar, setNewAvatar] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setFormData(user);
        setNewAvatar(null); // Reset preview on user change or reopen
    }, [user, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            contactPreferences: {
                ...formData.contactPreferences,
                [e.target.name]: e.target.checked,
            }
        });
    };
    
    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if(e.target.files && e.target.files[0]) {
            setIsProcessing(true);
            try {
                const optimizedAvatar = await processImageForAvatar(e.target.files[0]);
                setNewAvatar(optimizedAvatar);
            } catch (error) {
                console.error("Error processing avatar:", error);
            } finally {
                setIsProcessing(false);
            }
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const finalData = newAvatar ? { ...formData, avatarUrl: newAvatar } : formData;
        onUpdate(finalData);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <form onSubmit={handleSubmit}>
                <div className="p-6">
                    <h3 className="text-lg font-bold mb-4">Mi Perfil</h3>
                    <div className="space-y-4">
                        <div className="flex items-center space-x-4">
                            <img src={newAvatar || formData.avatarUrl} alt="Avatar" className="w-16 h-16 rounded-full object-cover bg-gray-200" />
                            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleAvatarChange} className="hidden" />
                            <button type="button" onClick={() => fileInputRef.current?.click()} disabled={isProcessing} className="px-4 py-2 bg-gray-100 text-sm font-semibold rounded-md hover:bg-gray-200 disabled:opacity-50">
                                {isProcessing ? 'Procesando...' : 'Cambiar Foto'}
                            </button>
                        </div>
                        <div>
                            <label className="text-sm font-medium">Nombre</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-2 border rounded-md" />
                        </div>
                        <div>
                            <label className="text-sm font-medium">Email</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full p-2 border rounded-md" />
                        </div>
                        <div>
                            <label className="text-sm font-medium">Teléfono</label>
                            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full p-2 border rounded-md" />
                        </div>
                        <div>
                            <label className="text-sm font-medium">Preferencias de Contacto</label>
                            <div className="mt-2 space-y-2">
                               <label className="flex items-center">
                                    <input type="checkbox" name="email" checked={formData.contactPreferences.email} onChange={handleCheckboxChange} className="h-4 w-4 text-primary rounded" />
                                    <span className="ml-2 text-sm">Notificarme por Email</span>
                               </label>
                               <label className="flex items-center">
                                    <input type="checkbox" name="phone" checked={formData.contactPreferences.phone} onChange={handleCheckboxChange} className="h-4 w-4 text-primary rounded" />
                                    <span className="ml-2 text-sm">Notificarme por Whatsapp a ese telefono</span>
                               </label>
                            </div>
                        </div>
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

export default ProfileModal;
