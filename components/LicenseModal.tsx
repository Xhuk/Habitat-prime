
import React, { useState } from 'react';
import { type LicenseInfo } from '../types';
import { validateAndApplyLicenseKey } from '../services/mockFirebaseService';
import { KeyIcon } from './Icons';

interface LicenseModalProps {
  status: 'UNLICENSED' | 'EXPIRED' | 'RENEWING';
  onSuccess: () => void;
}

const LicenseModal: React.FC<LicenseModalProps> = ({ status, onSuccess }) => {
  const [licenseKey, setLicenseKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!licenseKey.trim()) {
      setError('Por favor, ingresa una clave de licencia.');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      const { expiresAt } = await validateAndApplyLicenseKey(licenseKey);
      const licenseInfo: LicenseInfo = { key: licenseKey, expiresAt };
      localStorage.setItem('habitatLicense', JSON.stringify(licenseInfo));
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error al validar la licencia.');
    } finally {
      setIsLoading(false);
    }
  };

  const titles = {
    UNLICENSED: 'Activa tu Cuenta de Habitat.app',
    EXPIRED: 'Tu Licencia ha Expirado',
    RENEWING: 'Renovar Licencia',
  };

  const descriptions = {
    UNLICENSED: 'Para comenzar a usar el panel de administración, por favor ingresa la clave de licencia que recibiste en tu correo.',
    EXPIRED: 'Tu acceso al panel de administración ha sido suspendido. Por favor, ingresa una nueva clave de licencia para continuar.',
    RENEWING: 'Ingresa tu nueva clave de licencia para extender el acceso a tu panel de administración.',
  };
  
  return (
    <div className="fixed inset-0 bg-light-gray z-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-2xl p-8 text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-4">
                <KeyIcon className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-dark-gray">{titles[status]}</h2>
            <p className="text-gray-600 mt-2">{descriptions[status]}</p>
            
            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                <div>
                    <input
                      type="text"
                      value={licenseKey}
                      onChange={(e) => setLicenseKey(e.target.value.toUpperCase())}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm text-center tracking-widest font-mono focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="XXXX-XXXX-XXXX-XXXX"
                      disabled={isLoading}
                    />
                </div>

                {error && <p className="text-sm text-red-600">{error}</p>}

                <div>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3 px-4 bg-primary text-white rounded-md font-semibold hover:bg-secondary disabled:bg-gray-400 transition-colors"
                    >
                      {isLoading ? 'Validando...' : 'Activar Licencia'}
                    </button>
                </div>
            </form>
             <p className="text-xs text-gray-400 mt-6">
                Si tienes problemas con tu licencia, contacta a soporte.
            </p>
        </div>
      </div>
    </div>
  );
};

export default LicenseModal;
