

import React, { useState, useEffect } from 'react';
import { AuthenticatedUser, TodoItem, Notification, View } from '../types';
import { BellIcon, Bars3Icon, ClipboardListIcon } from './Icons';
import TodoList from './TodoList';
import NotificationPanel from './NotificationPanel';
import { getTodos, getNotifications } from '../services/mockFirebaseService';

interface HeaderProps {
    user: AuthenticatedUser;
    onLogout: () => void;
    onToggleSidebar: () => void;
    currentView: View;
    onViewChange: (view: View) => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout, onToggleSidebar, currentView, onViewChange }) => {
    const [isTodoOpen, setIsTodoOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [todos, setTodos] = useState<TodoItem[]>([]);
    const [notifications, setNotifications] = useState<Notification[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [todosData, notificationsData] = await Promise.all([getTodos(), getNotifications()]);
                setTodos(todosData);
                setNotifications(notificationsData);
            } catch (error) {
                console.error("Failed to fetch header data", error);
            }
        };
        fetchData();
    }, []);
    
    const unreadCount = notifications.filter(n => !n.isRead).length;

    const viewTitles: Record<View, string> = {
        dashboard: 'Dashboard',
        pagos: 'Pagos',
        conciliaciones: 'Historial de Pagos',
        reservas: 'Reservas',
        amenidades: 'Amenidades',
        // FIX: Changed 'comunicados' to 'comunidad' to match the View type.
        comunidad: 'Comunicación',
        proveedores: 'Proveedores',
        guardias: 'Guardias',
        directorio: 'Directorio',
        chat: 'Chat',
        configuracion: 'Configuración',
        financiero: 'Reportes Financieros'
    };

    return (
        <header className="bg-white shadow-sm p-4 flex justify-between items-center flex-shrink-0 z-10">
            <div className="flex items-center">
                 <button onClick={onToggleSidebar} className="lg:hidden mr-4 text-gray-600 hover:text-primary">
                    <Bars3Icon className="h-6 w-6" />
                </button>
                <h1 className="text-xl font-bold text-dark-gray capitalize hidden sm:block">
                    {viewTitles[currentView] || 'Dashboard'}
                </h1>
            </div>
            <div className="flex items-center space-x-4">
                <button onClick={() => setIsTodoOpen(true)} className="relative text-gray-500 hover:text-primary transition-colors">
                    <ClipboardListIcon className="h-6 w-6" />
                    {todos.length > 0 && <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white animate-pulse">{todos.length}</span>}
                </button>
                <button onClick={() => setIsNotificationsOpen(true)} className="relative text-gray-500 hover:text-primary transition-colors">
                    <BellIcon className="h-6 w-6" />
                     {unreadCount > 0 && <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">{unreadCount}</span>}
                </button>
                <div className="flex items-center space-x-2">
                    <img src={user.avatarUrl} alt="Avatar" className="h-9 w-9 rounded-full object-cover" />
                    <div className="hidden md:block">
                        <p className="text-sm font-semibold text-dark-gray">{user.name}</p>
                        <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                    </div>
                </div>
                 <button onClick={onLogout} className="text-sm font-semibold text-gray-600 hover:text-primary hidden sm:block">
                    Salir
                </button>
            </div>

            <TodoList isOpen={isTodoOpen} onClose={() => setIsTodoOpen(false)} todos={todos} onTodoClick={(view) => { onViewChange(view); setIsTodoOpen(false); }} />
            <NotificationPanel isOpen={isNotificationsOpen} onClose={() => setIsNotificationsOpen(false)} notifications={notifications} />
        </header>
    );
};

export default Header;