import React, { useState, useEffect } from 'react';
// FIX: Corrected import paths for types and services.
import { type ReconciliationHistory } from '../types';
import { getReconciliationHistory } from '../services/mockFirebaseService';

const ReconciliationHistoryDashboard: React.FC = () => {
  const [history, setHistory] = useState<ReconciliationHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const data = await getReconciliationHistory();
        setHistory(data);
      } catch (error) {
        console.error("Failed to fetch reconciliation history", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);
  
  if (loading) {
    return <div className="text-center p-10">Cargando historial...</div>;
  }

  return (
    <div className="bg-white shadow-lg rounded-xl overflow-hidden">
      <div className="p-6 border-b">
        <h2 className="text-2xl font-bold text-dark-gray">Historial de Conciliaciones</h2>
        <p className="text-sm text-gray-500 mt-1">Registro de todos los pagos que han sido conciliados con transacciones bancarias.</p>
      </div>
      
      {/* Desktop Table View */}
      <div className="overflow-x-auto hidden md:block">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Conciliación</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Residente</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Monto</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Conciliado Por</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IDs Referencia</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {history.length > 0 ? (
              history.map(item => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(item.reconciledDate).toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{item.residentName}</div>
                    <div className="text-sm text-gray-500">{item.property}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-green-600">${item.amount.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.reconciledBy}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                    <div>Pago: {item.paymentId}</div>
                    <div>Trans.: {item.transactionId}</div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-10 text-gray-500">No hay pagos conciliados todavía.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden">
        {history.length > 0 ? (
           <div className="p-4 space-y-4 bg-gray-50">
            {history.map(item => (
              <div key={item.id} className="bg-white p-4 rounded-lg shadow-md">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-dark-gray">{item.residentName}</p>
                    <p className="text-sm text-gray-500">{item.property}</p>
                  </div>
                  <p className="font-bold text-lg text-green-600">${item.amount.toFixed(2)}</p>
                </div>
                <div className="mt-3 border-t pt-3 text-xs text-gray-600 space-y-1">
                  <p><span className="font-semibold">Conciliado por:</span> {item.reconciledBy}</p>
                  <p><span className="font-semibold">Fecha:</span> {new Date(item.reconciledDate).toLocaleString()}</p>
                  <div className="text-gray-400 mt-2">
                    <p>ID Pago: {item.paymentId}</p>
                    <p>ID Trans.: {item.transactionId}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center py-10 text-gray-500">No hay pagos conciliados todavía.</p>
        )}
      </div>
    </div>
  );
};

export default ReconciliationHistoryDashboard;
