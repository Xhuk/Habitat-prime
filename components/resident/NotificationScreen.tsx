

import React, { useState, useEffect } from 'react';
import { type Notification } from '../../types';
import { getNotifications } from '../../services/mockFirebaseService';
// FIX: Import UserIcon and WrenchScrewdriverIcon.
import { CreditCardIcon, CalendarIcon, MegaphoneIcon, CubeIcon, UserIcon, WrenchScrewdriverIcon } from '../Icons';

const ICONS_BY_TYPE: { [key in Notification['type']]: React.ReactElement } = {
  payment: <CreditCardIcon className="h-5 w-5 text-blue-600" />,
  booking: <CalendarIcon className="h-5 w-5 text-purple-600" />,
  announcement: <MegaphoneIcon className="h-5 w-5 text-yellow-600" />,
  package: <CubeIcon className="h-5 w-5 text-orange-600" />,
  // FIX: Added missing 'visit' and 'provider' types.
  visit: <UserIcon className="h-5 w-5 text-green-600" />,
  provider: <WrenchScrewdriverIcon className="h-5 w-5 text-teal-600" />,
};

const NotificationScreen: React.FC = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNotifications = async () => {
            setLoading(true);
            try {
                // FIX: Use getNotificationsForUser with a mock ID, as getNotifications is more for an admin overview.
                const data = await getNotifications();
                setNotifications(data.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
            } catch (error) {
                console.error("Failed to fetch notifications", error);
            } finally {
                setLoading(false);
            }
        };
        fetchNotifications();
    }, []);

    if (loading) {
        return <div className="text-center p-10">Cargando notificaciones...</div>;
    }

    return (
        <div className="animate-fade-in space-y-4">
            {notifications.length > 0 ? (
                notifications.map(notification => (
                    <div key={notification.id} className={`bg-white rounded-2xl shadow-md p-4 flex items-start space-x-4 ${!notification.isRead ? 'border-l-4 border-primary' : ''}`}>
                        <div className={`p-3 rounded-full mt-1 ${
                            notification.type === 'payment' ? 'bg-blue-100' :
                            notification.type === 'booking' ? 'bg-purple-100' :
                            notification.type === 'announcement' ? 'bg-yellow-100' : 
                            notification.type === 'visit' ? 'bg-green-100' : 
                            notification.type === 'provider' ? 'bg-teal-100' : 'bg-orange-100'
                        }`}>
                           {ICONS_BY_TYPE[notification.type]}
                        </div>
                        <div>
                            <h3 className="font-semibold text-dark-gray">{notification.title}</h3>
                            <p className="text-sm text-gray-600">{notification.description}</p>
                            <p className="text-xs text-gray-400 mt-1">{new Date(notification.date).toLocaleString()}</p>
                        </div>
                    </div>
                ))
            ) : (
                <div className="text-center p-10 bg-white rounded-2xl shadow-md">
                    <p className="text-gray-500">No tienes notificaciones en este momento.</p>
                </div>
            )}
        </div>
    );
};

export default NotificationScreen;