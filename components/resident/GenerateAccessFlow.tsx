import React, { useState } from 'react';
import { type AuthenticatedUser } from '../../types';
import { UserIcon, QrCodeIcon, CheckCircleIcon, UserGroupIcon, CubeIcon, WrenchScrewdriverIcon } from '../Icons';

interface GenerateAccessFlowProps {
    user: AuthenticatedUser;
}

type AccessType = 'visitor' | 'delivery' | 'service';

const accessOptions: { id: AccessType; label: string; icon: React.ReactElement }[] = [
  { id: 'visitor', label: 'Visita Social', icon: <UserGroupIcon /> },
  { id: 'delivery', label: 'Entrega', icon: <CubeIcon /> },
  { id: 'service', label: 'Servicio', icon: <WrenchScrewdriverIcon /> },
];


const GenerateAccessFlow: React.FC<GenerateAccessFlowProps> = ({ user }) => {
    const [accessType, setAccessType] = useState<AccessType>('visitor');
    const [visitorName, setVisitorName] = useState('');
    const [isGenerated, setIsGenerated] = useState(false);
    const [qrCodeData, setQrCodeData] = useState('');

    const handleGenerate = (e: React.FormEvent) => {
        e.preventDefault();
        const data = `type:${accessType}|name:${visitorName}|resident:${user.name}|property:${user.property || 'N/A'}`;
        setQrCodeData(data);
        setIsGenerated(true);
    };
    
    const handleReset = () => {
        setIsGenerated(false);
        setVisitorName('');
        setQrCodeData('');
        setAccessType('visitor');
    };

    if (isGenerated) {
        return (
            <div className="bg-white p-6 rounded-2xl shadow-lg text-center animate-fade-in">
                <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-dark-gray">¡Acceso Generado!</h3>
                <p className="text-gray-600 mt-2">Muestra este código QR en la caseta de vigilancia para un acceso rápido.</p>
                <div className="mt-6 p-4 border rounded-lg inline-block bg-white">
                    {/* Placeholder for actual QR code library */}
                    <div className="w-48 h-48 bg-gray-200 flex items-center justify-center">
                        <QrCodeIcon className="h-24 w-24 text-gray-700" />
                    </div>
                </div>
                <p className="text-sm font-semibold mt-4">Para: {visitorName || accessType}</p>
                <button onClick={handleReset} className="mt-6 w-full max-w-xs py-3 bg-primary text-white rounded-lg font-semibold">
                    Generar Otro Acceso
                </button>
            </div>
        );
    }
    
    return (
        <div className="bg-white p-6 rounded-2xl shadow-lg animate-fade-in">
            <h3 className="text-xl font-bold text-dark-gray mb-4">Nuevo Acceso</h3>
            <form onSubmit={handleGenerate} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">1. Selecciona el tipo de acceso</label>
                     <div className="grid grid-cols-3 gap-3">
                        {accessOptions.map((option) => (
                          <button
                            key={option.id}
                            type="button"
                            onClick={() => setAccessType(option.id)}
                            className={`flex flex-col items-center justify-center p-3 border-2 rounded-xl transition-all duration-200 aspect-square ${
                              accessType === option.id
                                ? 'border-primary bg-blue-50 text-primary shadow-lg scale-105'
                                : 'border-gray-200 text-gray-500 hover:border-primary hover:text-primary'
                            }`}
                          >
                            {React.cloneElement(option.icon, { className: 'h-8 w-8 mb-2' })}
                            <span className="text-xs font-semibold text-center leading-tight">{option.label}</span>
                          </button>
                        ))}
                    </div>
                </div>
                
                {accessType !== 'delivery' && (
                    <div className="animate-fade-in">
                        <label htmlFor="visitorName" className="block text-sm font-medium text-gray-700">2. Nombre del Visitante / Servicio</label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <UserIcon className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                id="visitorName"
                                value={visitorName}
                                onChange={(e) => setVisitorName(e.target.value)}
                                className="w-full p-3 pl-10 border border-gray-300 rounded-md"
                                placeholder={accessType === 'visitor' ? 'Ej. Juan Pérez' : 'Ej. Plomero Mario'}
                                required
                            />
                        </div>
                    </div>
                )}
                
                <button type="submit" className="w-full py-3 bg-primary text-white rounded-lg font-semibold flex items-center justify-center shadow transition-transform transform hover:scale-105">
                    <QrCodeIcon className="h-6 w-6 mr-2" />
                    <span>Generar Código QR</span>
                </button>
            </form>
        </div>
    );
};
export default GenerateAccessFlow;