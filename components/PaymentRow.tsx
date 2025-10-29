import React from 'react';
// FIX: Corrected import path for types.
import { type Payment } from '../types';
import { StripeIcon, BanknotesIcon } from './Icons';

interface PaymentCardProps {
  payment: Payment;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onReconcile: (payment: Payment) => void;
}

const PaymentRow: React.FC<PaymentCardProps> = ({ payment, onApprove, onReject, onReconcile }) => {
  const amountDifference = payment.amountIA !== null ? Math.abs(payment.amountReported - payment.amountIA) : null;
  const hasDiscrepancy = amountDifference !== null && amountDifference >= 1;

  const PaymentMethodIcon = () => {
    if (payment.paymentMethod === 'stripe') {
        return <StripeIcon className="h-5 w-5 text-purple-600" title="Pagado con Stripe" />;
    }
    return <BanknotesIcon className="h-5 w-5 text-green-600" title="Pagado por Transferencia" />;
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-4 border border-gray-200">
      <div className="flex justify-between items-start">
        <div>
          <p className="font-bold text-lg text-dark-gray">{payment.residentName}</p>
          <p className="text-sm text-gray-500">{payment.property}</p>
          <p className="text-xs text-gray-400 mt-1">{new Date(payment.date).toLocaleDateString()}</p>
        </div>
        <div className="text-right">
          <p className="font-bold text-xl text-dark-gray">${payment.amountReported.toFixed(2)}</p>
          {payment.amountIA !== null && (
            <p className={`text-xs font-semibold ${hasDiscrepancy ? 'text-red-500' : 'text-green-600'}`}>
              (IA: ${payment.amountIA.toFixed(2)})
            </p>
          )}
        </div>
      </div>
      <div className="mt-4 pt-3 border-t border-gray-200 flex items-center justify-between">
         <div className="flex items-center space-x-2">
            <PaymentMethodIcon />
            <a 
                href={payment.receiptUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className={`text-sm font-semibold text-primary hover:underline ${payment.paymentMethod === 'stripe' ? 'hidden' : ''}`}
            >
                Ver Comprobante
            </a>
         </div>
        <div className="flex space-x-2">
            <button onClick={() => onReject(payment.id)} className="px-3 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full hover:bg-red-200">
                Rechazar
            </button>
             <button onClick={() => onReconcile(payment)} className="px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full hover:bg-blue-700">
                Conciliar
            </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentRow;