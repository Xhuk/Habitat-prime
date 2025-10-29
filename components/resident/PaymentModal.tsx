import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { type AuthenticatedUser } from '../../types';
import { createPayment } from '../../services/mockFirebaseService';
import Modal from '../Modal';
import { CreditCardIcon, BanknotesIcon, ArrowUpTrayIcon, CheckCircleIcon, XIcon } from '../Icons';

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: AuthenticatedUser;
    amountDue: number;
    stripeEnabled: boolean;
    onPaymentSuccess: () => void;
}

const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
    });
};

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, user, amountDue, stripeEnabled, onPaymentSuccess }) => {
    type Step = 'select' | 'stripe' | 'transfer' | 'success';
    const [step, setStep] = useState<Step>('select');
    const [isProcessing, setIsProcessing] = useState(false);
    const [file, setFile] = useState<File | null>(null);

    const handleClose = () => {
        setStep('select');
        setFile(null);
        setIsProcessing(false);
        onClose();
    };

    const handleStripeSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);
        try {
            await createPayment({
                residentId: user.id,
                amount: amountDue,
                paymentMethod: 'stripe'
            });
            setStep('success');
        } catch (error) {
            console.error("Stripe payment failed", error);
        } finally {
            setIsProcessing(false);
        }
    };
    
    const handleTransferSubmit = async () => {
        if (!file) return;
        setIsProcessing(true);
        try {
            const receiptUrl = await blobToBase64(file);
             await createPayment({
                residentId: user.id,
                amount: amountDue,
                paymentMethod: 'transfer',
                receiptUrl
            });
            setStep('success');
        } catch (error) {
            console.error("Transfer payment failed", error);
        } finally {
            setIsProcessing(false);
        }
    };
    
    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) setFile(acceptedFiles[0]);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'image/*': [] }, multiple: false });

    const renderContent = () => {
        switch(step) {
            case 'select':
                return (
                    <div>
                        <h3 className="text-xl font-bold text-dark-gray">Realizar Pago</h3>
                        <p className="mt-2 text-gray-500">Monto a pagar: <span className="font-bold text-dark-gray">${amountDue.toFixed(2)}</span></p>
                        <div className="mt-6 space-y-4">
                            {stripeEnabled && (
                                <button onClick={() => setStep('stripe')} className="w-full flex items-center p-4 border rounded-lg hover:bg-gray-50">
                                    <CreditCardIcon className="h-6 w-6 text-primary mr-4" />
                                    <span className="font-semibold">Pagar con Tarjeta</span>
                                </button>
                            )}
                            <button onClick={() => setStep('transfer')} className="w-full flex items-center p-4 border rounded-lg hover:bg-gray-50">
                                <BanknotesIcon className="h-6 w-6 text-green-600 mr-4" />
                                <span className="font-semibold">Ya realicé transferencia (Subir comprobante)</span>
                            </button>
                        </div>
                    </div>
                );
            case 'stripe':
                return (
                    <form onSubmit={handleStripeSubmit}>
                        <h3 className="text-xl font-bold text-dark-gray">Pago con Tarjeta</h3>
                        <p className="mt-2 text-gray-500">Total: ${amountDue.toFixed(2)}</p>
                        <div className="mt-4 space-y-4">
                            <div>
                                <label className="text-sm font-medium">Número de Tarjeta</label>
                                <input type="text" placeholder="**** **** **** 1234" required className="w-full p-2 border rounded-md" />
                            </div>
                            <div className="flex space-x-4">
                                <div className="flex-1">
                                    <label className="text-sm font-medium">Expira (MM/AA)</label>
                                    <input type="text" placeholder="MM/AA" required className="w-full p-2 border rounded-md" />
                                </div>
                                <div className="flex-1">
                                    <label className="text-sm font-medium">CVC</label>
                                    <input type="text" placeholder="123" required className="w-full p-2 border rounded-md" />
                                </div>
                            </div>
                        </div>
                        <p className="text-xs text-gray-400 mt-4 text-center">Esto es una simulación. No se realizará ningún cargo real.</p>
                        <button type="submit" disabled={isProcessing} className="mt-4 w-full py-2 bg-primary text-white font-semibold rounded-md hover:bg-secondary disabled:bg-gray-400">
                           {isProcessing ? 'Procesando...' : `Pagar $${amountDue.toFixed(2)}`}
                        </button>
                    </form>
                );
            case 'transfer':
                return (
                    <div>
                         <h3 className="text-xl font-bold text-dark-gray">Subir Comprobante</h3>
                         <p className="text-sm text-gray-500 mt-1">Sube una imagen de tu comprobante de transferencia por ${amountDue.toFixed(2)}.</p>
                         <div {...getRootProps()} className={`mt-4 p-8 border-2 border-dashed rounded-lg text-center cursor-pointer ${isDragActive ? 'border-primary bg-blue-50' : 'border-gray-300 hover:border-primary'}`}>
                            <input {...getInputProps()} />
                            <ArrowUpTrayIcon className="h-8 w-8 mx-auto text-gray-400" />
                            <p className="mt-2 text-sm text-gray-500">{file ? file.name : 'Arrastra una imagen o haz clic'}</p>
                         </div>
                         <button onClick={handleTransferSubmit} disabled={!file || isProcessing} className="mt-4 w-full py-2 bg-primary text-white font-semibold rounded-md hover:bg-secondary disabled:bg-gray-400">
                           {isProcessing ? 'Enviando...' : 'Enviar Comprobante'}
                        </button>
                    </div>
                );
            case 'success':
                 return (
                    <div className="text-center py-6">
                        <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
                        <h4 className="font-bold text-lg">¡Gracias!</h4>
                        <p className="text-sm text-gray-600 mt-2">
                           Tu pago ha sido procesado. Verás el estado actualizado en tu historial.
                        </p>
                        <button onClick={() => { onPaymentSuccess(); handleClose(); }} className="mt-6 w-full max-w-xs py-2 bg-primary text-white text-sm font-semibold rounded-md hover:bg-secondary">Entendido</button>
                    </div>
                 );
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose}>
            <div className="p-6 relative">
                 <button onClick={handleClose} className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100">
                    <XIcon className="h-5 w-5 text-gray-500" />
                 </button>
                 {renderContent()}
            </div>
        </Modal>
    );
};
export default PaymentModal;