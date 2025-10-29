
import React, { useState } from 'react';
import Modal from './Modal';
import { XIcon, CalendarIcon, UserIcon } from './Icons';

interface ScheduleVisitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSchedule: (visitDetails: { name: string; date: string; time: string; notes: string }) => void;
}

const ScheduleVisitModal: React.FC<ScheduleVisitModalProps> = ({ isOpen, onClose, onSchedule }) => {
    const [name, setName] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [notes, setNotes] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSchedule({ name, date, time, notes });
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <form onSubmit={handleSubmit}>
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold">Agendar Visita</h3>
                        <button type="button" onClick={onClose} className="p-1 rounded-full hover:bg-gray-200"><XIcon className="h-5 w-5" /></button>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="visitor-name" className="text-sm font-medium">Nombre del Visitante</label>
                            <div className="relative mt-1">
                                <UserIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                <input id="visitor-name" type="text" value={name} onChange={e => setName(e.target.value)} className="w-full p-2 pl-10 border rounded-md" required />
                            </div>
                        </div>
                        <div className="flex space-x-4">
                            <div className="flex-1">
                                <label htmlFor="visit-date" className="text-sm font-medium">Fecha</label>
                                <input id="visit-date" type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full p-2 border rounded-md mt-1" required />
                            </div>
                             <div className="flex-1">
                                <label htmlFor="visit-time" className="text-sm font-medium">Hora</label>
                                <input id="visit-time" type="time" value={time} onChange={e => setTime(e.target.value)} className="w-full p-2 border rounded-md mt-1" required />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="visit-notes" className="text-sm font-medium">Notas (Opcional)</label>
                            <textarea id="visit-notes" value={notes} onChange={e => setNotes(e.target.value)} rows={3} className="w-full p-2 border rounded-md mt-1" placeholder="Ej. Placas del vehículo, motivo de la visita..."></textarea>
                        </div>
                    </div>
                </div>
                <div className="bg-gray-50 px-6 py-3 flex justify-end">
                    <button type="submit" className="px-4 py-2 bg-primary text-white font-semibold rounded-md hover:bg-secondary">Agendar</button>
                </div>
            </form>
        </Modal>
    );
};

export default ScheduleVisitModal;
