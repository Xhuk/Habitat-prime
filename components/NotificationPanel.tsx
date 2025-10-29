

import React, { Fragment } from 'react';
import { type Notification } from '../types';
// FIX: Import UserIcon and WrenchScrewdriverIcon.
import { XIcon, CreditCardIcon, CalendarIcon, MegaphoneIcon, CubeIcon, UserIcon, WrenchScrewdriverIcon } from './Icons';

interface NotificationPanelProps {
    isOpen: boolean;
    onClose: () => void;
    notifications: Notification[];
}

const ICONS_BY_TYPE: { [key in Notification['type']]: React.ReactElement } = {
  payment: <CreditCardIcon className="h-5 w-5 text-blue-500" />,
  booking: <CalendarIcon className="h-5 w-5 text-purple-500" />,
  announcement: <MegaphoneIcon className="h-5 w-5 text-yellow-500" />,
  package: <CubeIcon className="h-5 w-5 text-orange-500" />,
  // FIX: Added missing 'visit' and 'provider' types.
  visit: <UserIcon className="h-5 w-5 text-green-500" />,
  provider: <WrenchScrewdriverIcon className="h-5 w-5 text-teal-500" />,
};

const NotificationPanel: React.FC<NotificationPanelProps> = ({ isOpen, onClose, notifications }) => {
  return (
    <Fragment>
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      ></div>

      <aside
        className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-xl z-40 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <header className="flex items-center justify-between p-4 border-b">
            <h3 className="text-lg font-bold text-dark-gray">Notificaciones ({notifications.length})</h3>
            <button onClick={onClose} className="p-1 rounded-full text-gray-500 hover:bg-gray-100">
              <XIcon className="h-6 w-6" />
            </button>
          </header>

          <div className="flex-1 overflow-y-auto">
            {notifications.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {notifications.map((notification) => (
                  <li key={notification.id} className={`p-4 flex items-start space-x-3 transition-colors hover:bg-gray-50 ${!notification.isRead ? 'bg-blue-50' : ''}`}>
                    <div className="flex-shrink-0 mt-1">
                      {ICONS_BY_TYPE[notification.type]}
                    </div>
                    <div>
                        <p className="font-semibold text-sm text-gray-800">{notification.title}</p>
                        <p className="text-sm text-gray-600">{notification.description}</p>
                        <p className="text-xs text-gray-400 mt-1">{new Date(notification.date).toLocaleString()}</p>
                    </div>
                    {!notification.isRead && <div className="mt-2 w-2 h-2 rounded-full bg-primary flex-shrink-0"></div>}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-center mt-10 p-4">No tienes notificaciones nuevas.</p>
            )}
          </div>
           <footer className="p-4 border-t">
              <button className="w-full text-center text-sm font-semibold text-primary hover:underline">
                  Marcar todas como leídas
              </button>
           </footer>
        </div>
      </aside>
    </Fragment>
  );
};

export default NotificationPanel;