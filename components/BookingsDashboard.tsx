import React, { useState, useEffect } from 'react';
// FIX: Corrected import paths for types and services.
import { type Booking } from '../types';
import { getBookings } from '../services/mockFirebaseService';

const BookingsDashboard: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        const data = await getBookings();
        setBookings(data);
      } catch (error) {
        console.error("Failed to fetch bookings", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const getStatusBadge = (status: Booking['status']) => {
    switch (status) {
      case 'confirmed':
        return <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">Confirmada</span>;
      case 'pending':
        return <span className="px-2 py-1 text-xs font-semibold text-yellow-800 bg-yellow-100 rounded-full">Pendiente</span>;
      case 'cancelled':
        return <span className="px-2 py-1 text-xs font-semibold text-red-800 bg-red-100 rounded-full">Cancelada</span>;
    }
  };

  if (loading) {
    return <div className="text-center p-10">Cargando reservas...</div>;
  }

  return (
    <div className="bg-white shadow-lg rounded-xl overflow-hidden">
      <div className="p-6 border-b">
        <h2 className="text-2xl font-bold text-dark-gray">Reservas de Amenidades</h2>
        <p className="text-sm text-gray-500 mt-1">Aprueba y gestiona las reservas de las áreas comunes.</p>
      </div>
      
      {/* Desktop Table View */}
      <div className="overflow-x-auto hidden md:block">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amenidad</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Residente</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha y Hora</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              <th scope="col" className="relative px-6 py-3"><span className="sr-only">Acciones</span></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {bookings.length > 0 ? (
              bookings.map(booking => (
                <tr key={booking.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{booking.amenityName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{booking.residentName}</div>
                    <div className="text-sm text-gray-500">{booking.property}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{new Date(booking.date).toLocaleDateString()}</div>
                    <div className="text-sm text-gray-500">{booking.startTime} - {booking.endTime}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(booking.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {booking.status === 'pending' && (
                       <div className="flex space-x-2 justify-end">
                            <button className="text-red-600 hover:text-red-900">Rechazar</button>
                            <button className="text-green-600 hover:text-green-900">Aprobar</button>
                       </div>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-10 text-gray-500">No hay reservas pendientes.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

       {/* Mobile Card View */}
      <div className="md:hidden">
        {bookings.length > 0 ? (
          <div className="p-4 space-y-4 bg-gray-50">
            {bookings.map(booking => (
              <div key={booking.id} className="bg-white p-4 rounded-lg shadow">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-lg text-dark-gray">{booking.amenityName}</h3>
                  {getStatusBadge(booking.status)}
                </div>
                <div className="mt-2 text-sm text-gray-700">
                  <p><span className="font-semibold">Residente:</span> {booking.residentName} ({booking.property})</p>
                  <p className="mt-1"><span className="font-semibold">Fecha:</span> {new Date(booking.date).toLocaleDateString()}</p>
                  <p><span className="font-semibold">Horario:</span> {booking.startTime} - {booking.endTime}</p>
                </div>
                {booking.status === 'pending' && (
                  <div className="mt-4 pt-3 border-t flex space-x-2">
                    <button className="flex-1 text-center py-2 px-3 bg-red-100 text-red-700 rounded-md text-sm font-semibold hover:bg-red-200">Rechazar</button>
                    <button className="flex-1 text-center py-2 px-3 bg-green-100 text-green-700 rounded-md text-sm font-semibold hover:bg-green-200">Aprobar</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center py-10 text-gray-500">No hay reservas pendientes.</p>
        )}
      </div>

    </div>
  );
};

export default BookingsDashboard;
