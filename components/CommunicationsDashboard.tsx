// FIX: Created placeholder component for CommunicationsDashboard.
import React from 'react';
import { MegaphoneIcon } from './Icons';
import FloatingActionButton from './FloatingActionButton';
import AddSurveyModal from './AddSurveyModal';

const CommunicationsDashboard: React.FC = () => {
    const [isSurveyModalOpen, setIsSurveyModalOpen] = React.useState(false);

    const announcements = [
        { id: 1, title: 'Mantenimiento de Alberca', date: 'Hace 2 días', content: 'Se realizará mantenimiento a la alberca el próximo Lunes. No estará disponible de 9am a 5pm.', author: 'Admin General' },
        { id: 2, title: 'Asamblea General Anual', date: 'Hace 1 semana', content: 'La asamblea general se llevará a cabo el 30 de este mes a las 7pm en el salón de usos múltiples. ¡No faltes!', author: 'Mesa Directiva' },
    ];

    return (
        <>
            <div className="bg-white shadow-lg rounded-xl">
                <div className="p-6 border-b flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-dark-gray">Comunicados y Encuestas</h2>
                        <p className="text-sm text-gray-500 mt-1">Envía anuncios importantes y crea encuestas para la comunidad.</p>
                    </div>
                     <button className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-md hover:bg-secondary">
                        Nuevo Comunicado
                    </button>
                </div>

                <div className="p-6">
                    <h3 className="text-lg font-bold text-dark-gray mb-4">Comunicados Recientes</h3>
                     <div className="space-y-4">
                        {announcements.map(ann => (
                            <div key={ann.id} className="bg-gray-50 p-4 rounded-lg border">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="font-bold">{ann.title}</h4>
                                        <p className="text-xs text-gray-500">Por {ann.author} - {ann.date}</p>
                                    </div>
                                    <button className="text-sm text-blue-600 hover:underline">Editar</button>
                                </div>
                                <p className="mt-2 text-sm text-gray-700">{ann.content}</p>
                            </div>
                        ))}
                    </div>
                </div>

                 <div className="p-6 border-t">
                    <h3 className="text-lg font-bold text-dark-gray mb-4">Encuestas Activas</h3>
                    <div className="text-center text-gray-400 p-8 border-2 border-dashed rounded-lg">
                        <p>No hay encuestas activas en este momento.</p>
                        <button onClick={() => setIsSurveyModalOpen(true)} className="mt-4 text-sm font-semibold text-primary hover:underline">
                            Crear una nueva encuesta
                        </button>
                    </div>
                </div>
            </div>
            <FloatingActionButton onClick={() => {}} tooltip="Nuevo Comunicado" />
            <AddSurveyModal isOpen={isSurveyModalOpen} onClose={() => setIsSurveyModalOpen(false)} />
        </>
    );
};

export default CommunicationsDashboard;
