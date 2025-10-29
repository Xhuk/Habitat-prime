// FIX: Created placeholder component for AddSurveyModal.
import React from 'react';
import Modal from './Modal';

interface AddSurveyModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AddSurveyModal: React.FC<AddSurveyModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
        <div className="p-6">
            <h3 className="text-lg font-bold">Crear Encuesta</h3>
            <div className="mt-4 text-center text-gray-400">
                (Formulario de creación de encuesta en construcción)
            </div>
        </div>
         <div className="bg-gray-50 px-6 py-3 flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-sm font-semibold rounded-md hover:bg-gray-300">
                Cancelar
            </button>
            <button type="button" className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-md hover:bg-secondary">
                Publicar Encuesta
            </button>
        </div>
    </Modal>
  );
};

export default AddSurveyModal;
