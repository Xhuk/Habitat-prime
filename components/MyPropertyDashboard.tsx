
import React, { useState, useEffect } from 'react';
// FIX: Corrected import paths for types and services.
import { type PropertyInfo, type AuthenticatedUser } from '../types';
import { getPropertyInfo } from '../services/mockFirebaseService';

// In a real app, this would probably take the user from context.
const MyPropertyDashboard: React.FC = () => {
  const [propertyInfo, setPropertyInfo] = useState<PropertyInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInfo = async () => {
      setLoading(true);
      try {
        // We pass a mock user ID, as this is an admin dashboard.
        // In a resident app, you'd use the logged-in user's ID.
        const data = await getPropertyInfo('user-resident1');
        setPropertyInfo(data);
      } catch (error) {
        console.error("Failed to fetch property info", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInfo();
  }, []);

  if (loading) {
    return <div className="text-center p-10">Cargando información de la propiedad...</div>;
  }
  
  if (!propertyInfo) {
    return <div className="text-center p-10 text-red-500">No se pudo cargar la información.</div>;
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-dark-gray">Mi Propiedad</h1>
        <p className="text-gray-500 mt-1">Información detallada de tu unidad y estado de cuenta.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white shadow-lg rounded-xl p-6">
            <h3 className="font-bold text-lg">Detalles</h3>
            <div className="mt-4 space-y-2 text-sm">
              <p><span className="font-semibold text-gray-600">Dirección:</span> {propertyInfo.address}</p>
              <p><span className="font-semibold text-gray-600">Propietario:</span> {propertyInfo.owner}</p>
              <p><span className="font-semibold text-gray-600">Residentes:</span> {propertyInfo.residents.join(', ')}</p>
            </div>
          </div>
          <div className="bg-white shadow-lg rounded-xl p-6 text-center">
            <h3 className="font-bold text-lg">Saldo Pendiente</h3>
            <p className={`text-4xl font-bold mt-2 ${propertyInfo.outstandingBalance > 0 ? 'text-red-500' : 'text-green-600'}`}>
                ${propertyInfo.outstandingBalance.toFixed(2)}
            </p>
            <button className="mt-4 w-full px-4 py-2 bg-primary text-white text-sm font-semibold rounded-md hover:bg-secondary">
                Realizar Pago
            </button>
          </div>
        </div>
        <div className="lg:col-span-2 bg-white shadow-lg rounded-xl">
           <div className="p-6 border-b">
                <h3 className="font-bold text-lg">Historial de Pagos</h3>
           </div>
           <div className="overflow-x-auto">
               <table className="min-w-full text-sm">
                   <thead className="bg-gray-50">
                       <tr>
                           <th className="p-3 text-left font-medium text-gray-500">Fecha</th>
                           <th className="p-3 text-right font-medium text-gray-500">Monto</th>
                           <th className="p-3 text-center font-medium text-gray-500">Estado</th>
                       </tr>
                   </thead>
                   <tbody>
                       {propertyInfo.paymentHistory.map(p => (
                           <tr key={p.id} className="border-t">
                               <td className="p-3">{new Date(p.date).toLocaleDateString()}</td>
                               <td className="p-3 text-right font-semibold">${p.amountReported.toFixed(2)}</td>
                               <td className="p-3 text-center">
                                   <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
                                       {p.status}
                                   </span>
                               </td>
                           </tr>
                       ))}
                   </tbody>
               </table>
           </div>
        </div>
      </div>
    </div>
  );
};

export default MyPropertyDashboard;
