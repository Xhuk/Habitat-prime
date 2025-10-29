import React, { useState, useEffect } from 'react';
// FIX: Corrected import paths for types and services.
import { getTodos } from '../services/mockFirebaseService';
import { type TodoItem, type View } from '../types';
import { CreditCardIcon, CalendarIcon, MegaphoneIcon, ShieldCheckIcon } from './Icons';

interface DashboardProps {
    onViewChange: (view: View) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onViewChange }) => {
    const [summary, setSummary] = useState({ payments: 0, bookings: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSummary = async () => {
            setLoading(true);
            try {
                const todos: TodoItem[] = await getTodos();
                const paymentTodo = todos.find(t => t.type === 'payment');
                const bookingTodo = todos.find(t => t.type === 'booking');

                // Extracting count from title "X pagos por conciliar"
                const paymentCount = paymentTodo ? parseInt(paymentTodo.title.split(' ')[0], 10) : 0;
                const bookingCount = bookingTodo ? parseInt(bookingTodo.title.split(' ')[0], 10) : 0;

                setSummary({
                    payments: isNaN(paymentCount) ? 0 : paymentCount,
                    bookings: isNaN(bookingCount) ? 0 : bookingCount,
                });
            } catch (error) {
                console.error("Failed to fetch summary data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSummary();
    }, []);

    const statCards = [
        {
            title: 'Pagos Pendientes',
            value: summary.payments,
            icon: <CreditCardIcon className="h-8 w-8 text-blue-500" />,
            view: 'pagos' as View,
            color: 'blue'
        },
        {
            title: 'Reservas Pendientes',
            value: summary.bookings,
            icon: <CalendarIcon className="h-8 w-8 text-purple-500" />,
            view: 'reservas' as View,
            color: 'purple'
        },
    ];

    return (
        <div>
            <h1 className="text-3xl font-bold text-dark-gray">Dashboard</h1>
            <p className="text-gray-500 mt-1">Resumen del estado de la comunidad.</p>

            {loading ? <p className="mt-6">Cargando resumen...</p> : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                    {statCards.map(card => (
                        <button
                            key={card.view}
                            onClick={() => onViewChange(card.view)}
                            className={`bg-white shadow-lg rounded-xl p-6 flex items-center justify-between transition-transform transform hover:-translate-y-1 border-l-4 ${card.color === 'blue' ? 'border-blue-500' : 'border-purple-500'}`}
                        >
                            <div>
                                <p className="text-sm font-medium text-gray-500">{card.title}</p>
                                <p className="text-3xl font-bold text-dark-gray">{card.value}</p>
                            </div>
                            <div className={`p-3 rounded-full ${card.color === 'blue' ? 'bg-blue-100' : 'bg-purple-100'}`}>
                                {card.icon}
                            </div>
                        </button>
                    ))}
                </div>
            )}
            
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white shadow-lg rounded-xl p-6">
                    <h2 className="text-xl font-bold text-dark-gray mb-4">Accesos Rápidos</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <button onClick={() => onViewChange('comunicados')} className="flex items-center space-x-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-lg">
                            <MegaphoneIcon className="h-6 w-6 text-yellow-500" />
                            <span className="font-semibold">Enviar Comunicado</span>
                        </button>
                        <button onClick={() => onViewChange('pagos')} className="flex items-center space-x-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-lg">
                            <CreditCardIcon className="h-6 w-6 text-blue-500" />
                            <span className="font-semibold">Conciliar Pagos</span>
                        </button>
                        <button onClick={() => onViewChange('reservas')} className="flex items-center space-x-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-lg">
                            <CalendarIcon className="h-6 w-6 text-purple-500" />
                            <span className="font-semibold">Aprobar Reservas</span>
                        </button>
                         <button onClick={() => onViewChange('guardias')} className="flex items-center space-x-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-lg">
                            <ShieldCheckIcon className="h-6 w-6 text-green-500" />
                            <span className="font-semibold">Gestión Guardias</span>
                        </button>
                    </div>
                </div>

                <div className="hidden lg:block bg-white shadow-lg rounded-xl p-6">
                    <h2 className="text-xl font-bold text-dark-gray mb-4">Actividad Reciente</h2>
                    <p className="text-gray-400 text-center mt-10">(Feed de actividad en construcción)</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
