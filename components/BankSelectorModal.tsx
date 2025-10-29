// FIX: This file was empty. Created a placeholder BankSelectorModal.
import React from 'react';
import Modal from './Modal';

interface BankSelectorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (bank: string) => void;
}

const BankIcon: React.FC<{ initial: string }> = ({ initial }) => (
    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600 mr-4">
        {initial}
    </div>
);


const BankSelectorModal: React.FC<BankSelectorModalProps> = ({ isOpen, onClose, onSelect }) => {
    const banks = ['BBVA', 'Santander', 'Banorte', 'Citibanamex', 'Scotiabank'];
    
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="p-6">
                <h3 className="text-lg font-bold mb-4">Seleccionar Banco</h3>
                <p className="text-sm text-gray-500 mb-4">Elige el banco de donde proviene el estado de cuenta que deseas cargar.</p>
                <ul className="space-y-2">
                    {banks.map(bank => (
                        <li key={bank}>
                            <button 
                                onClick={() => onSelect(bank)} 
                                className="w-full text-left p-3 hover:bg-gray-100 rounded-lg flex items-center transition-colors"
                            >
                                <BankIcon initial={bank.substring(0,2).toUpperCase()} />
                                <span className="font-semibold">{bank}</span>
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="bg-gray-50 px-6 py-3 flex justify-end">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-sm font-semibold rounded-md hover:bg-gray-300">
                    Cerrar
                </button>
            </div>
        </Modal>
    );
};

export default BankSelectorModal;
