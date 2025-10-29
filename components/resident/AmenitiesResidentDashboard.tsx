
import React, { useState, useEffect } from 'react';
// FIX: Corrected import paths for types and services.
import { type Amenity, type AuthenticatedUser } from '../../types';
import { getAmenities } from '../../services/mockFirebaseService';
import AmenityBookingModal from './AmenityBookingModal';

interface AmenitiesResidentDashboardProps {
    user: AuthenticatedUser;
}

const AmenitiesResidentDashboard: React.FC<AmenitiesResidentDashboardProps> = ({ user }) => {
    const [amenities, setAmenities] = useState<Amenity[]>([]);
    const [loading, setLoading] = useState(true);
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const [selectedAmenity, setSelectedAmenity] = useState<Amenity | null>(null);

    const fetchAmenities = async () => {
        setLoading(true);
        try {
            const data = await getAmenities();
            setAmenities(data);
        } catch (error) {
            console.error("Failed to fetch amenities", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAmenities();
    }, []);

    const handleBookingClick = (amenity: Amenity) => {
        setSelectedAmenity(amenity);
        setIsBookingModalOpen(true);
    };

    const handleBookingComplete = () => {
        setIsBookingModalOpen(false);
        setSelectedAmenity(null);
    };

    if (loading) {
        return <div className="text-center p-10">Cargando amenidades...</div>;
    }

    return (
        <div className="animate-fade-in">
            <h1 className="text-2xl font-bold text-dark-gray">Amenidades</h1>
            <p className="text-gray-500 mt-1 mb-6">Consulta la disponibilidad y reserva las áreas comunes.</p>

            <div className="space-y-6">
                {amenities.map(amenity => (
                    <div key={amenity.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                        <img src={amenity.imageUrl} alt={amenity.name} className="w-full h-40 object-cover" />
                        <div className="p-4">
                            <h3 className="text-xl font-bold text-dark-gray">{amenity.name}</h3>
                            <p className="text-sm text-gray-600 mt-1">{amenity.description}</p>
                            <div className="mt-2 text-xs text-gray-700">
                                <span>Capacidad: {amenity.capacity} personas</span>
                                <span className="mx-2">|</span>
                                <span className="font-semibold text-primary">{amenity.cost > 0 ? `$${amenity.cost.toFixed(2)}` : 'Gratis'}</span>
                            </div>
                            <button 
                                onClick={() => handleBookingClick(amenity)}
                                className="mt-4 w-full py-2 px-4 bg-primary text-white font-semibold rounded-lg hover:bg-secondary transition-colors"
                            >
                                Reservar
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {selectedAmenity && (
                <AmenityBookingModal
                    isOpen={isBookingModalOpen}
                    onClose={() => setIsBookingModalOpen(false)}
                    amenity={selectedAmenity}
                    onBookingComplete={handleBookingComplete}
                    userId={user.id}
                />
            )}
        </div>
    );
};

export default AmenitiesResidentDashboard;
