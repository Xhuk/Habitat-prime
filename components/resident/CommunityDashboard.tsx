
import React from 'react';
import { MegaphoneIcon, CalendarIcon } from '../Icons';

const CommunityDashboard: React.FC = () => {
    const announcements = [
        { id: 1, title: 'Mantenimiento de Alberca', content: 'Se realizará mantenimiento a la alberca el próximo Lunes. No estará disponible de 9am a 5pm.', type: 'info' },
        { id: 2, title: 'Asamblea General Anual', content: 'La asamblea general se llevará a cabo el 30 de este mes a las 7pm en el salón de usos múltiples. ¡No faltes!', type: 'event' },
        { id: 3, title: 'Recordatorio de Cuota', content: 'Recuerden que la fecha límite para el pago de la cuota de mantenimiento es el día 20.', type: 'info' },
    ];
    return (
        <div className="animate-fade-in space-y-6">
            <h1 className="text-2xl font-bold text-dark-gray">Comunidad</h1>
            <p className="text-gray-500 mt-1 mb-6">Mantente al día con los últimos anuncios y eventos.</p>

            <div className="space-y-4">
                {announcements.map(ann => (
                    <div key={ann.id} className="bg-white rounded-2xl shadow-md p-4 flex items-start">
                        <div className={`p-3 rounded-full mr-4 mt-1 ${ann.type === 'event' ? 'bg-purple-100' : 'bg-blue-100'}`}>
                            {ann.type === 'event' 
                                ? <CalendarIcon className="h-5 w-5 text-purple-600" /> 
                                : <MegaphoneIcon className="h-5 w-5 text-blue-600" />
                            }
                        </div>
                        <div>
                            <h3 className="font-semibold text-dark-gray">{ann.title}</h3>
                            <p className="text-sm text-gray-600">{ann.content}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CommunityDashboard;
