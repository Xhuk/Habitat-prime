// FIX: Created placeholder component for DirectoryContactModal.
import React from 'react';
import Modal from './Modal';

interface DirectoryContactModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const DirectoryContactModal: React.FC<DirectoryContactModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
        <div className="p-6">
            <h3 className="text-lg font-bold">Contacto de Directorio</h3>
            <div className="mt-4 text-center text-gray-400">
                (Detalles de contacto en construcción)
            </div>
        </div>
         <div className="bg-gray-50 px-6 py-3 flex justify-end">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-sm font-semibold rounded-md hover:bg-gray-300">
                Cerrar
            </button>
        </div>
    </Modal>
  );
};

export default DirectoryContactModal;
