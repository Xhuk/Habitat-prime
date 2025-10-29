// FIX: This file was empty. Created ReconciliationModal component.
import React, { useState, useEffect } from 'react';
// FIX: Corrected import path for types.
import { type Payment, type BankTransaction } from '../types';
import Modal from './Modal';

interface ReconciliationModalProps {
  isOpen: boolean;
  onClose: () => void;
  payment: Payment;
  transactions: BankTransaction[];
  onSubmit: (paymentId: string, transactionId: string) => void;
}

const ReconciliationModal: React.FC<ReconciliationModalProps> = ({ isOpen, onClose, payment, transactions, onSubmit }) => {
  const [selectedTransactionId, setSelectedTransactionId] = useState<string | null>(null);

  useEffect(() => {
    // Reset selection when modal is opened for a new payment
    setSelectedTransactionId(null);
  }, [isOpen, payment]);

  const handleSubmit = () => {
    if (selectedTransactionId) {
      onSubmit(payment.id, selectedTransactionId);
    }
  };

  const potentialMatches = transactions.filter(t => Math.abs(t.amount - (payment.amountIA || payment.amountReported)) < 1.0);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
        <div className="p-6">
          <h3 className="text-lg font-bold">Conciliar Pago</h3>
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p><strong>Residente:</strong> {payment.residentName} ({payment.property})</p>
              <p><strong>Monto Reportado:</strong> ${payment.amountReported.toFixed(2)}</p>
              {payment.amountIA !== null && <p><strong>Monto (IA):</strong> ${payment.amountIA.toFixed(2)}</p>}
          </div>

          <h4 className="font-semibold mt-4 mb-2">Seleccionar Transacción Bancaria</h4>
          <div className="max-h-60 overflow-y-auto border rounded-lg bg-white">
              {potentialMatches.length > 0 ? (
                  potentialMatches.map(t => (
                      <div 
                          key={t.id} 
                          onClick={() => setSelectedTransactionId(t.id)}
                          className={`p-3 border-b cursor-pointer transition-colors ${selectedTransactionId === t.id ? 'bg-blue-100 ring-2 ring-blue-400' : 'hover:bg-gray-50'}`}
                      >
                          <p className="font-semibold">${t.amount.toFixed(2)} - {t.description}</p>
                          <p className="text-xs text-gray-500">{new Date(t.date).toLocaleDateString()} - Ref: {t.reference}</p>
                      </div>
                  ))
              ) : <p className="p-4 text-center text-gray-500">No se encontraron transacciones con un monto similar.</p>}
          </div>
        </div>
        <div className="bg-gray-50 px-6 py-3 flex justify-end space-x-3">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-sm font-semibold rounded-md hover:bg-gray-300">Cancelar</button>
          <button 
              type="submit"
              disabled={!selectedTransactionId}
              className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-md hover:bg-secondary disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
              Confirmar Conciliación
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ReconciliationModal;
