
import React from 'react';
import { QrCodeIcon, ArrowLeftIcon } from '../Icons';

interface GenerateQrViewProps {
  qrCodeData: string;
  visitorName: string;
  onBack: () => void;
}

const GenerateQrView: React.FC<GenerateQrViewProps> = ({ qrCodeData, visitorName, onBack }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg text-center animate-fade-in relative">
      <button onClick={onBack} className="absolute top-4 left-4 text-gray-500 hover:text-primary">
        <ArrowLeftIcon className="h-6 w-6" />
      </button>
      <h3 className="text-xl font-bold text-dark-gray">Acceso para {visitorName}</h3>
      <p className="text-gray-600 mt-2">Muestra este código QR en la caseta de vigilancia.</p>
      <div className="mt-6 p-4 border rounded-lg inline-block bg-white">
        {/* Placeholder for actual QR code library */}
        <div className="w-48 h-48 bg-gray-200 flex items-center justify-center">
            <QrCodeIcon className="h-24 w-24 text-gray-700" />
        </div>
        <p className="text-xs text-gray-400 mt-2">Código: {qrCodeData.substring(0, 20)}...</p>
      </div>
    </div>
  );
};

export default GenerateQrView;
