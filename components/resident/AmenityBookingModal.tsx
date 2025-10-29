
import React, { useState, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
// FIX: Corrected import paths for types and services.
import { type Amenity, type Booking } from '../../types';
import { getAvailableSlots, createBooking, addAmenityPaymentReceipt } from '../../services/mockFirebaseService';
import Modal from '../Modal';
import { ChevronLeftIcon, ChevronRightIcon, PhotoIcon, CheckCircleIcon } from '../Icons';

interface AmenityBookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    amenity: Amenity;
    onBookingComplete: () => void;
    // Mocked user id
    userId: string;
}

const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        resolve((reader.result as string).split(',')[1]);
      };
      reader.onerror = reject;
    });
};

const AmenityBookingModal: React.FC<AmenityBookingModalProps> = ({ isOpen, onClose, amenity, onBookingComplete, userId }) => {
    type Step = 'select_date' | 'confirm' | 'upload_receipt' | 'success';
    
    const [step, setStep] = useState<Step>('select_date');
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
    const [availableSlots, setAvailableSlots] = useState<string[]>([]);
    const [isLoadingSlots, setIsLoadingSlots] = useState(false);
    const [newBooking, setNewBooking] = useState<Booking | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Reset state when modal opens
    useEffect(() => {
        if (isOpen) {
            setStep('select_date');
            setCurrentDate(new Date());
            setSelectedDate(null);
            setSelectedTimeSlot(null);
            setAvailableSlots([]);
            setNewBooking(null);
            setIsSubmitting(false);
        }
    }, [isOpen]);

    const fetchSlots = async (date: Date) => {
        setIsLoadingSlots(true);
        setSelectedTimeSlot(null);
        try {
            // FIX: Pass the amenity object and date object directly as required by the function signature.
            const slots = await getAvailableSlots(amenity, date);
            setAvailableSlots(slots);
        } catch (error) {
            console.error("Failed to fetch slots", error);
            setAvailableSlots([]);
        } finally {
            setIsLoadingSlots(false);
        }
    };

    const handleDateSelect = (day: number) => {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        date.setHours(12); // avoid timezone issues
        setSelectedDate(date);
        fetchSlots(date);
    };

    const handleCreateBooking = async () => {
        if (!selectedDate || !selectedTimeSlot) return;
        setIsSubmitting(true);
        try {
            const booking = await createBooking(amenity, selectedDate.toISOString().split('T')[0], selectedTimeSlot, userId);
            setNewBooking(booking);
            if (booking.status === 'pending_payment') {
                setStep('upload_receipt');
            } else {
                setStep('success');
            }
        } catch (error) {
            console.error("Failed to create booking", error);
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0 && newBooking) {
            setIsSubmitting(true);
            try {
                const base64Image = await blobToBase64(acceptedFiles[0]);
                // In a real app, you would upload this to a storage service and get a URL.
                // For this mock, we'll just pretend the base64 string is the URL.
                await addAmenityPaymentReceipt(newBooking.id, `data:image/jpeg;base64,${base64Image}`);
                setStep('success');
            } catch(e) {
                console.error("Failed to upload receipt", e);
            } finally {
                setIsSubmitting(false);
            }
        }
    }, [newBooking]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'image/*': [] }, multiple: false });

    const cleaningCost = amenity.cleaningOptions.type === 'extra_cost' ? amenity.cleaningOptions.extraCost || 0 : 0;
    const totalCost = amenity.cost + cleaningCost;
    
    // Calendar rendering logic
    const renderCalendar = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        const blanks = Array(firstDay).fill(null);
        const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

        return (
            <div>
                <div className="flex justify-between items-center mb-2">
                    <button type="button" onClick={() => setCurrentDate(new Date(year, month - 1, 1))} className="p-1 rounded-full hover:bg-gray-100"><ChevronLeftIcon className="h-5 w-5" /></button>
                    <span className="font-semibold">{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
                    <button type="button" onClick={() => setCurrentDate(new Date(year, month + 1, 1))} className="p-1 rounded-full hover:bg-gray-100"><ChevronRightIcon className="h-5 w-5" /></button>
                </div>
                <div className="grid grid-cols-7 text-center text-xs text-gray-500 mb-2">
                    <span>Dom</span><span>Lun</span><span>Mar</span><span>Mié</span><span>Jue</span><span>Vie</span><span>Sáb</span>
                </div>
                <div className="grid grid-cols-7 gap-1">
                    {blanks.map((_, i) => <div key={`blank-${i}`}></div>)}
                    {days.map(day => (
                        <button
                            type="button"
                            key={day}
                            onClick={() => handleDateSelect(day)}
                            className={`h-8 w-8 rounded-full text-sm transition-colors ${
                                selectedDate?.getDate() === day && selectedDate?.getMonth() === month ? 'bg-primary text-white' : 'hover:bg-gray-100'
                            }`}
                        >
                            {day}
                        </button>
                    ))}
                </div>
            </div>
        );
    };

    const renderContent = () => {
        switch (step) {
            case 'select_date': return (
                <>
                    {renderCalendar()}
                    {selectedDate && (
                        <div className="mt-4 pt-4 border-t">
                            <h4 className="font-semibold text-sm mb-2">Horarios Disponibles para {selectedDate.toLocaleDateString()}</h4>
                            {isLoadingSlots ? <p className="text-center text-sm">Buscando horarios...</p> : (
                                <div className="grid grid-cols-2 gap-2">
                                    {availableSlots.length > 0 ? availableSlots.map(slot => (
                                        <button 
                                            key={slot} type="button" 
                                            onClick={() => { setSelectedTimeSlot(slot); setStep('confirm'); }}
                                            className="p-2 border rounded-lg text-sm hover:bg-primary hover:text-white transition-colors"
                                        >
                                            {slot}
                                        </button>
                                    )) : <p className="col-span-2 text-center text-sm text-gray-500">No hay horarios disponibles para este día.</p>}
                                </div>
                            )}
                        </div>
                    )}
                </>
            );
            case 'confirm': return (
                <div>
                    <h4 className="font-bold text-lg mb-4">Confirmar Reserva</h4>
                    <div className="space-y-3 text-sm p-4 bg-gray-50 rounded-lg">
                        <p><strong>Amenidad:</strong> {amenity.name}</p>
                        <p><strong>Fecha:</strong> {selectedDate?.toLocaleDateString()}</p>
                        <p><strong>Horario:</strong> {selectedTimeSlot}</p>
                        <div className="pt-3 border-t">
                            <div className="flex justify-between"><span>Costo de Renta:</span> <span>${amenity.cost.toFixed(2)}</span></div>
                            <div className="flex justify-between"><span>Costo de Limpieza:</span> <span>${cleaningCost.toFixed(2)}</span></div>
                            <div className="flex justify-between font-bold text-base mt-1"><span>TOTAL:</span> <span>${totalCost.toFixed(2)}</span></div>
                        </div>
                    </div>
                     <div className="mt-4 text-xs text-gray-600 bg-yellow-50 p-3 rounded-lg">
                         <p className="font-semibold">Limpieza: {amenity.cleaningOptions.selfCleanInstructions || "No se requieren acciones adicionales."}</p>
                    </div>
                </div>
            );
            case 'upload_receipt': return (
                <div>
                    <h4 className="font-bold text-lg mb-2">Realizar Pago</h4>
                    <p className="text-sm text-gray-500 mb-4">Para confirmar tu reserva de ${totalCost.toFixed(2)}, por favor realiza una transferencia a la siguiente cuenta y sube tu comprobante.</p>
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm mb-4">
                        <p><strong>Banco:</strong> BBVA</p>
                        <p><strong>CLABE:</strong> 1234 5678 9012 3456 78</p>
                        <p><strong>Beneficiario:</strong> Condominio Habitat A.C.</p>
                    </div>
                    <div {...getRootProps()} className={`p-6 border-2 border-dashed rounded-lg text-center cursor-pointer ${isDragActive ? 'border-primary bg-blue-50' : 'border-gray-300 hover:border-primary'}`}>
                        <input {...getInputProps()} />
                        <PhotoIcon className="h-8 w-8 mx-auto text-gray-400" />
                        <p className="mt-2 text-sm text-gray-500">Arrastra tu comprobante o haz clic para seleccionarlo.</p>
                    </div>
                </div>
            );
            case 'success': return (
                <div className="text-center py-6">
                    <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <h4 className="font-bold text-lg">¡Listo!</h4>
                    <p className="text-sm text-gray-600 mt-2">
                        {totalCost > 0 
                            ? "Hemos recibido tu comprobante. Tu reserva será confirmada una vez que el administrador lo apruebe."
                            : "Tu solicitud de reserva ha sido enviada al administrador para su aprobación."
                        }
                    </p>
                </div>
            );
        }
    };

    const renderFooter = () => {
        if (step === 'select_date') {
            return <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-sm font-semibold rounded-md hover:bg-gray-300">Cerrar</button>;
        }
        if (step === 'confirm') {
            return (
                <>
                    <button type="button" onClick={() => setStep('select_date')} className="px-4 py-2 bg-gray-200 text-sm font-semibold rounded-md hover:bg-gray-300">Atrás</button>
                    <button onClick={handleCreateBooking} disabled={isSubmitting} className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-md hover:bg-secondary disabled:bg-gray-400">
                        {isSubmitting ? 'Procesando...' : (totalCost > 0 ? 'Proceder al Pago' : 'Confirmar Reserva')}
                    </button>
                </>
            )
        }
        if (step === 'upload_receipt') {
            return <p className="text-xs text-gray-400 w-full text-center">Esperando comprobante...</p>
        }
        if (step === 'success') {
            return <button type="button" onClick={() => { onClose(); onBookingComplete(); }} className="w-full px-4 py-2 bg-primary text-white text-sm font-semibold rounded-md hover:bg-secondary">Entendido</button>;
        }
        return null;
    }


    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div>
                <div className="p-6">
                    <h3 className="text-xl font-bold text-dark-gray">Reservar {amenity.name}</h3>
                    <div className="mt-4">{renderContent()}</div>
                </div>
                <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
                   {renderFooter()}
                </div>
            </div>
        </Modal>
    );
};

export default AmenityBookingModal;
