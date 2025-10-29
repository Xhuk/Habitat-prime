import React from 'react';
import Modal from './Modal';
import { ArrowTopRightOnSquareIcon } from './Icons';

interface StripeHelpModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const StripeHelpModal: React.FC<StripeHelpModalProps> = ({ isOpen, onClose }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div>
                <div className="p-6">
                    <h3 className="text-lg font-bold text-dark-gray">¿Dónde encontrar tu Stripe Account ID?</h3>
                    <div className="mt-4 space-y-4 text-sm text-gray-600">
                        <p>Tu "Account ID" es un identificador único para tu cuenta de Stripe. Sigue estos pasos para encontrarlo:</p>
                        <ol className="list-decimal list-inside space-y-2 pl-2">
                            <li>Inicia sesión en tu <a href="https://dashboard.stripe.com/" target="_blank" rel="noopener noreferrer" className="text-primary font-semibold hover:underline">Dashboard de Stripe</a>.</li>
                            <li>Haz clic en el ícono de <strong>Configuración</strong> (engranaje) en la esquina superior derecha.</li>
                            <li>En la sección "Desarrolladores", haz clic en <strong>"Claves de API"</strong>.</li>
                            <li>Tu Account ID (comienza con <code>acct_...</code>) estará visible en esta página.</li>
                        </ol>
                        <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                            <p className="font-semibold">Ejemplo Visual:</p>
                            <div className="mt-2 text-center text-gray-400 border border-dashed rounded-md p-4">
                                <img src="https://placehold.co/400x150/E2E8F0/4A5568?text=Ejemplo+Visual+de+Stripe" alt="Ejemplo de Stripe Dashboard" className="mt-2 rounded-md w-full" />
                            </div>
                        </div>
                        <p>Para obtener información más detallada sobre cómo gestionar tu cuenta y tus claves, consulta la documentación oficial de Stripe.</p>
                    </div>
                </div>
                <div className="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-3">
                    <a 
                        href="https://stripe.com/docs/connect/standard-accounts" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary bg-blue-100 hover:bg-blue-200"
                    >
                        Ver Documentación Oficial
                        <ArrowTopRightOnSquareIcon className="ml-2 h-4 w-4" />
                    </a>
                    <button 
                        type="button" 
                        onClick={onClose} 
                        className="w-full sm:w-auto px-4 py-2 bg-gray-200 text-sm font-semibold rounded-md hover:bg-gray-300"
                    >
                        Entendido
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default StripeHelpModal;