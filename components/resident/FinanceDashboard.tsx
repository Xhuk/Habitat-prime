import React, { useState, useEffect } from 'react';
import { type PropertyInfo, type AuthenticatedUser, type HabitatConfig } from '../../types';
import { getPropertyInfo, getHabitatConfig } from '../../services/mockFirebaseService';
import PaymentModal from './PaymentModal';

interface FinanceDashboardProps {
    user: AuthenticatedUser;
}

const FinanceDashboard: React.FC<FinanceDashboardProps> = ({ user }) => {
    const [propertyInfo, setPropertyInfo] = useState<PropertyInfo | null>(null);
    const [config, setConfig] = useState<HabitatConfig | null>(null);
    const [loading, setLoading] = useState(true);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

    const fetchInfo = async () => {
        setLoading(true);
        try {
            const [infoData, configData] = await Promise.all([
                getPropertyInfo(user.id),
                getHabitatConfig()
            ]);
            setPropertyInfo(infoData);
            setConfig(configData);
        } catch (error) {
            console.error("Failed to fetch financial info", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInfo();
    }, [user.id]);

    if (loading) {
        return <div className="text-center p-10">Cargando información financiera...</div>;
    }
    
    if (!propertyInfo) {
        return <div className="text-center p-10 text-red-500">No se pudo cargar la información.</div>;
    }

    const hasBalance = propertyInfo.outstandingBalance > 0;

    return (
        <>
            <div className="animate-fade-in space-y-6">
                 <div className="bg-white shadow-lg rounded-2xl p-6 text-center">
                    <h3 className="font-bold text-lg text-dark-gray">Saldo Pendiente</h3>
                    <p className={`text-5xl font-bold mt-2 ${hasBalance ? 'text-red-500' : 'text-green-600'}`}>
                        ${propertyInfo.outstandingBalance.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">MXN</p>
                    <button 
                        onClick={() => setIsPaymentModalOpen(true)}
                        disabled={!hasBalance}
                        className="mt-4 w-full max-w-xs py-3 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-secondary shadow disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        Realizar Pago
                    </button>
                </div>
                
                <div className="bg-white shadow-lg rounded-2xl">
                    <div className="p-4 border-b">
                        <h3 className="font-bold text-lg text-dark-gray">Historial de Pagos</h3>
                    </div>
                    <div className="divide-y">
                        {propertyInfo.paymentHistory.length > 0 ? propertyInfo.paymentHistory.map(p => (
                            <div key={p.id} className="p-4 flex justify-between items-center">
                                <div>
                                    <p className="font-semibold">{new Date(p.date).toLocaleDateString()}</p>
                                    <p className={`text-xs capitalize font-medium ${p.status === 'reconciled' ? 'text-green-600' : 'text-yellow-600'}`}>{p.status === 'reconciled' ? 'Conciliado' : 'Pendiente'}</p>
                                </div>
                                <div className="font-bold text-dark-gray">${p.amountReported.toFixed(2)}</div>
                            </div>
                        )) : <p className="p-4 text-center text-sm text-gray-500">No hay pagos registrados.</p>}
                    </div>
                </div>
            </div>

            {hasBalance && config && (
                <PaymentModal
                    isOpen={isPaymentModalOpen}
                    onClose={() => setIsPaymentModalOpen(false)}
                    user={user}
                    amountDue={propertyInfo.outstandingBalance}
                    stripeEnabled={config.stripe.isEnabled}
                    onPaymentSuccess={fetchInfo} // Re-fetch data on success
                />
            )}
        </>
    );
};

export default FinanceDashboard;