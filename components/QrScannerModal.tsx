import React, { useState } from 'react';
import Modal from './Modal';
import { CameraIcon, XIcon } from './Icons';

interface QrScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess: (data: string) => void;
}

const QrScannerModal: React.FC<QrScannerModalProps> = ({ isOpen, onClose, onScanSuccess }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [manualCode, setManualCode] = useState('');

    const handleSimulateScan = () => {
        if (isLoading) return;
        setIsLoading(true);
        setTimeout(() => {
            const mockData = manualCode 
                ? `Manual: ${manualCode}`
                : `Visitante: Juan Pérez, Destino: Casa 42`;
            onScanSuccess(mockData);
            setIsLoading(false);
            setManualCode('');
        }, 1500);
    };
    
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div>
                 <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold">Escanear Código QR</h3>
                        <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200"><XIcon className="h-5 w-5" /></button>
                    </div>
                    <div className="aspect-square bg-gray-900 rounded-lg flex flex-col items-center justify-center text-white relative overflow-hidden">
                        <CameraIcon className="h-16 w-16 text-gray-600" />
                        <p className="mt-2 text-gray-400 text-sm">(Simulación de cámara)</p>
                         <div className="absolute top-1/2 left-0 w-full h-1 bg-red-500 animate-ping"></div>
                    </div>
                    <div className="mt-4">
                        <label htmlFor="manual-code" className="text-sm font-medium">O ingresa el código manual:</label>
                        <input 
                            id="manual-code"
                            type="text" 
                            value={manualCode}
                            onChange={(e) => setManualCode(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md mt-1 shadow-sm"
                            placeholder="Código de 8 dígitos"
                        />
                    </div>
                 </div>
                 <div className="bg-gray-50 px-6 py-3">
                     <button
                        onClick={handleSimulateScan}
                        disabled={isLoading}
                        className="w-full py-2 bg-primary text-white font-semibold rounded-md hover:bg-secondary disabled:bg-gray-400 transition-colors"
                    >
                        {isLoading ? 'Procesando...' : 'Confirmar Acceso'}
                    </button>
                 </div>
            </div>
        </Modal>
    );
};

export default QrScannerModal;
