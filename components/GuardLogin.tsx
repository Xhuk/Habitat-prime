

import React, { useState, useRef } from 'react';
// FIX: Corrected import paths for types and services.
import { loginWithAccessCode } from '../services/mockFirebaseService';
import { type AuthenticatedUser } from '../types';
import { ArrowLeftIcon, ShieldCheckIcon } from './Icons';

interface GuardLoginProps {
  onLoginSuccess: (user: AuthenticatedUser) => void;
  onResetConfig: () => void;
}

const GuardLogin: React.FC<GuardLoginProps> = ({ onLoginSuccess, onResetConfig }) => {
    const [pin, setPin] = useState<string[]>(Array(6).fill(''));
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const { value } = e.target;
        if (/[^0-9]/.test(value)) return; // Only allow numbers

        const newPin = [...pin];
        newPin[index] = value;
        setPin(newPin);

        // Move to next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };
    
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === 'Backspace' && !pin[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const paste = e.clipboardData.getData('text').replace(/[^0-9]/g, '');
        if (paste.length === 6) {
            setPin(paste.split(''));
            inputRefs.current[5]?.focus();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const accessCode = pin.join('');
        if (accessCode.length !== 6) {
            setError('El código debe tener 6 dígitos.');
            return;
        }
        setLoading(true);
        setError('');
        try {
            const user = await loginWithAccessCode(accessCode);
            onLoginSuccess(user);
        } catch (err: any) {
            setError(err.message || 'Error al iniciar sesión.');
            setPin(Array(6).fill('')); // Clear pin on error
            inputRefs.current[0]?.focus();
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col justify-center items-center p-4 relative">
            <button onClick={onResetConfig} className="absolute top-4 left-4 flex items-center text-sm font-medium text-gray-400 hover:text-white">
                <ArrowLeftIcon className="h-4 w-4 mr-1" />
                Cambiar Rol
            </button>
            <div className="w-full max-w-sm">
                <ShieldCheckIcon className="w-16 h-16 mx-auto text-primary" />
                <h2 className="text-3xl font-bold text-center mt-4">Acceso de Guardia</h2>
                <p className="text-center text-gray-400 mt-2 mb-8">Introduce tu código de 6 dígitos.</p>
                
                <form onSubmit={handleSubmit}>
                    <div className="flex justify-center gap-2 mb-6" onPaste={handlePaste}>
                        {pin.map((digit, index) => (
                            <input
                                key={index}
                                ref={el => inputRefs.current[index] = el}
                                type="tel"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleChange(e, index)}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                className="w-12 h-14 bg-gray-800 border-2 border-gray-700 rounded-md text-white text-center text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                                required
                                disabled={loading}
                            />
                        ))}
                    </div>
                    
                    {error && <p className="text-sm text-center text-red-400 mb-4">{error}</p>}

                    <button
                        type="submit"
                        disabled={loading || pin.join('').length !== 6}
                        className="w-full py-3 px-4 bg-primary rounded-md font-semibold hover:bg-secondary disabled:bg-gray-700 disabled:cursor-not-allowed transition-colors"
                    >
                        {loading ? 'Verificando...' : 'Ingresar'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default GuardLogin;