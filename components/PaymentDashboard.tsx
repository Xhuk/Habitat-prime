// FIX: This file was empty. Created PaymentDashboard component.
import React, { useState, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
// FIX: Corrected import paths for types and services.
import { type Payment, type BankTransaction } from '../types';
import { getPayments, approvePayment, rejectPayment, reconcilePayment, getBankTransactions, processImageWithGemini, processBankStatementWithGemini, addBankTransactions } from '../services/mockFirebaseService';
import PaymentRow from './PaymentRow';
import ReconciliationModal from './ReconciliationModal';
import BankSelectorModal from './BankSelectorModal';
import Modal from './Modal';
import { ArrowUpTrayIcon, XIcon } from './Icons';

interface StatementUploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    bankName: string;
    onSubmit: (fileContent: string) => Promise<void>;
}

const StatementUploadModal: React.FC<StatementUploadModalProps> = ({ isOpen, onClose, bankName, onSubmit }) => {
    const [file, setFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState('');

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            setFile(acceptedFiles[0]);
            setError('');
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'text/plain': ['.txt'], 'text/csv': ['.csv'] },
        multiple: false
    });

    const handleClose = () => {
        setFile(null);
        setError('');
        onClose();
    };

    const handleSubmit = async () => {
        if (!file) {
            setError('Por favor, selecciona un archivo.');
            return;
        }

        setIsProcessing(true);
        setError('');
        try {
            const fileContent = await file.text();
            await onSubmit(fileContent);
            handleClose();
        } catch (e: any) {
            setError(e.message || 'Ocurrió un error al procesar el archivo.');
        } finally {
            setIsProcessing(false);
        }
    };
    
    return (
        <Modal isOpen={isOpen} onClose={handleClose}>
            <div className="p-6">
                <h3 className="text-lg font-bold">Cargar Estado de Cuenta</h3>
                <p className="text-sm text-gray-500">Banco seleccionado: <strong>{bankName}</strong></p>

                <div
                    {...getRootProps()}
                    className={`mt-4 p-8 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${
                        isDragActive ? 'border-primary bg-blue-50' : 'border-gray-300 hover:border-primary'
                    }`}
                >
                    <input {...getInputProps()} />
                    <ArrowUpTrayIcon className="h-10 w-10 mx-auto text-gray-400" />
                    {isDragActive ? (
                        <p className="mt-2 text-primary">Suelta el archivo aquí...</p>
                    ) : (
                        <p className="mt-2 text-gray-500">Arrastra un archivo .txt o .csv aquí, o haz clic para seleccionar.</p>
                    )}
                </div>

                {file && (
                    <div className="mt-4 p-3 bg-gray-100 rounded-md flex justify-between items-center">
                        <span className="text-sm font-medium">{file.name}</span>
                        <button onClick={() => setFile(null)} className="p-1 rounded-full hover:bg-gray-200">
                            <XIcon className="h-4 w-4" />
                        </button>
                    </div>
                )}
                {error && <p className="mt-2 text-sm text-red-500 text-center">{error}</p>}
            </div>
            <div className="bg-gray-50 px-6 py-3 flex justify-end space-x-3">
                <button type="button" onClick={handleClose} className="px-4 py-2 bg-gray-200 text-sm font-semibold rounded-md hover:bg-gray-300">
                    Cancelar
                </button>
                <button
                    onClick={handleSubmit}
                    disabled={!file || isProcessing}
                    className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-md hover:bg-secondary disabled:bg-gray-400"
                >
                    {isProcessing ? 'Procesando con IA...' : 'Procesar'}
                </button>
            </div>
        </Modal>
    );
};


const PaymentDashboard: React.FC = () => {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
    const [bankTransactions, setBankTransactions] = useState<BankTransaction[]>([]);
    const [isBankSelectorOpen, setIsBankSelectorOpen] = useState(false);
    const [isStatementUploadOpen, setIsStatementUploadOpen] = useState(false);
    const [selectedBank, setSelectedBank] = useState('');
    const [processingStatement, setProcessingStatement] = useState(false);

    const fetchPayments = async () => {
        setLoading(true);
        try {
            const data = await getPayments();
            const paymentsWithIA = await Promise.all(data.map(async (p) => {
                if (p.amountIA === null) {
                    try {
                        const amount = await processImageWithGemini(p.receiptUrl);
                        return { ...p, amountIA: amount };
                    } catch (e) {
                        console.error("Gemini AI failed for payment " + p.id, e);
                        return p;
                    }
                }
                return p;
            }));
            setPayments(paymentsWithIA);
        } catch (error) {
            console.error("Failed to fetch payments", error);
        } finally {
            setLoading(false);
        }
    };
    
    const fetchBankTransactions = async () => {
        try {
            const transactions = await getBankTransactions();
            setBankTransactions(transactions);
        } catch (error) {
            console.error("Failed to fetch bank transactions", error);
        }
    };

    useEffect(() => {
        fetchPayments();
        fetchBankTransactions();
    }, []);

    const handleApprove = async (id: string) => {
        await approvePayment(id);
        fetchPayments();
    };

    const handleReject = async (id: string) => {
        await rejectPayment(id);
        fetchPayments();
    };

    const handleReconcileClick = async (payment: Payment) => {
        setSelectedPayment(payment);
        setIsModalOpen(true);
    };

    const handleReconciliationSubmit = async (paymentId: string, transactionId: string) => {
        await reconcilePayment(paymentId, transactionId, 'Admin User');
        setIsModalOpen(false);
        setSelectedPayment(null);
        fetchPayments();
    };

    const handleBankSelected = (bank: string) => {
        setSelectedBank(bank);
        setIsBankSelectorOpen(false);
        setIsStatementUploadOpen(true);
    };

    const handleStatementSubmit = async (fileContent: string) => {
        setProcessingStatement(true);
        try {
            const newTransactions = await processBankStatementWithGemini(fileContent);
            await addBankTransactions(newTransactions);
            await fetchBankTransactions();
        } finally {
            setProcessingStatement(false);
        }
    };
    
    if (loading) {
        return <p className="text-center p-6">Cargando y procesando pagos con IA...</p>;
    }

    return (
        <>
            <div className="bg-white shadow-lg rounded-xl">
                <div className="p-6 border-b flex justify-between items-center flex-wrap gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-dark-gray">Pagos Pendientes de Conciliación</h2>
                        <p className="text-sm text-gray-500 mt-1">Revisa los pagos enviados por los residentes y compáralos con los movimientos bancarios.</p>
                    </div>
                    <button 
                        onClick={() => setIsBankSelectorOpen(true)}
                        className="flex items-center space-x-2 px-4 py-2 bg-primary text-white text-sm font-semibold rounded-md hover:bg-secondary"
                    >
                        <ArrowUpTrayIcon className="h-5 w-5" />
                        <span>Cargar Estado de Cuenta</span>
                    </button>
                </div>
                {payments.length > 0 ? (
                    <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {payments.map(p => (
                            <PaymentRow 
                                key={p.id}
                                payment={p}
                                onApprove={handleApprove}
                                onReject={handleReject}
                                onReconcile={handleReconcileClick}
                            />
                        ))}
                    </div>
                ) : (
                    <p className="p-10 text-center text-gray-500">No hay pagos pendientes de conciliación.</p>
                )}
            </div>

            <BankSelectorModal 
                isOpen={isBankSelectorOpen}
                onClose={() => setIsBankSelectorOpen(false)}
                onSelect={handleBankSelected}
            />

            <StatementUploadModal 
                isOpen={isStatementUploadOpen}
                onClose={() => setIsStatementUploadOpen(false)}
                bankName={selectedBank}
                onSubmit={handleStatementSubmit}
            />

            {selectedPayment && (
                <ReconciliationModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    payment={selectedPayment}
                    transactions={bankTransactions}
                    onSubmit={handleReconciliationSubmit}
                />
            )}
        </>
    );
};

export default PaymentDashboard;
