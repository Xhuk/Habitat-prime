
import React, { useState, useEffect } from 'react';
// FIX: Corrected import paths for types and services.
import { type Amenity } from '../types';
import { getAmenities, updateAmenity } from '../services/mockFirebaseService';
import AmenityEditModal from './AmenityEditModal';
import { PencilSquareIcon } from './Icons';

const AmenitiesDashboard: React.FC = () => {
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingAmenity, setEditingAmenity] = useState<Amenity | null>(null);

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

  const handleEditClick = (amenity: Amenity) => {
    setEditingAmenity(amenity);
  };

  const handleUpdateAmenity = async (updatedData: Amenity) => {
    try {
      await updateAmenity(updatedData);
      setEditingAmenity(null);
      fetchAmenities(); // Re-fetch to show updated data
    } catch (error) {
      console.error("Failed to update amenity", error);
    }
  };

  const getCleaningOptionText = (amenity: Amenity) => {
    switch (amenity.cleaningOptions.type) {
      case 'included':
        return 'Limpieza incluida';
      case 'extra_cost':
        return `Costo extra: $${amenity.cleaningOptions.extraCost?.toFixed(2) || '0.00'}`;
      case 'self_clean':
        return 'Auto-limpieza requerida';
      default:
        return 'No especificado';
    }
  };

  if (loading) {
    return <div className="text-center p-10">Cargando amenidades...</div>;
  }

  return (
    <>
      <div className="bg-white shadow-lg rounded-xl overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold text-dark-gray">Gestión de Amenidades</h2>
          <p className="text-sm text-gray-500 mt-1">Administra las áreas comunes disponibles para los residentes.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
          {amenities.map(amenity => (
            <div key={amenity.id} className="bg-white rounded-lg shadow-md overflow-hidden border flex flex-col">
              <img src={amenity.imageUrl} alt={amenity.name} className="w-full h-48 object-cover" />
              <div className="p-4 flex-grow">
                <h3 className="text-lg font-bold text-dark-gray">{amenity.name}</h3>
                <p className="text-sm text-gray-600 mt-1 flex-grow">{amenity.description}</p>
                
                <div className="mt-4 pt-3 border-t text-xs text-gray-700 space-y-2">
                    <p><strong>Costo:</strong> <span className="font-semibold text-primary">{amenity.cost > 0 ? `$${amenity.cost.toFixed(2)}` : 'Gratis'}</span></p>
                    <p><strong>Bloque de Renta:</strong> {amenity.bookingBlockHours} horas</p>
                    <p><strong>Max. Rentas/Día:</strong> {amenity.maxRentalsPerDay}</p>
                    <p><strong>Limpieza:</strong> {getCleaningOptionText(amenity)}</p>
                </div>
              </div>
              <div className="px-4 py-3 bg-gray-50 border-t">
                   <button 
                      onClick={() => handleEditClick(amenity)}
                      className="w-full flex items-center justify-center text-center py-2 px-3 bg-blue-100 text-blue-700 rounded-md text-sm font-semibold hover:bg-blue-200"
                   >
                      <PencilSquareIcon className="h-4 w-4 mr-2" />
                      Editar
                   </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {editingAmenity && (
        <AmenityEditModal
            isOpen={!!editingAmenity}
            onClose={() => setEditingAmenity(null)}
            amenity={editingAmenity}
            onSave={handleUpdateAmenity}
        />
      )}
    </>
  );
};

export default AmenitiesDashboard;
