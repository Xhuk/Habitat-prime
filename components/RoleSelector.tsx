
import React, { useState } from 'react';
// FIX: Corrected import path for types.
import { type Role } from '../types';
import { UserIcon, ShieldCheckIcon, BuildingIcon } from './Icons';

interface RoleSelectorProps {
  onConfigSelect: (role: Role, habitatCode: string) => void;
}

type SelectableRole = 'resident' | 'admin' | 'guardia';

const RoleSelector: React.FC<RoleSelectorProps> = ({ onConfigSelect }) => {
  const [selectedRole, setSelectedRole] = useState<SelectableRole | null>(null);
  const [habitatCode, setHabitatCode] = useState('');
  const [error, setError] = useState('');

  const handleSelectRole = (role: SelectableRole) => {
    setSelectedRole(role);
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) {
      setError('Por favor, selecciona un rol para continuar.');
      return;
    }
    if (!habitatCode.trim()) {
      setError('Por favor, ingresa tu Código de Habitat.');
      return;
    }
    onConfigSelect(selectedRole, habitatCode);
  };

  const roleOptions: { id: SelectableRole; name: string; icon: React.ReactElement }[] = [
    { id: 'resident', name: 'Residente', icon: <UserIcon className="h-10 w-10" /> },
    { id: 'admin', name: 'Administrador', icon: <BuildingIcon className="h-10 w-10" /> },
    { id: 'guardia', name: 'Guardia', icon: <ShieldCheckIcon className="h-10 w-10" /> },
  ];

  return (
    <div className="min-h-screen bg-light-gray flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md text-center">
        <h1 className="text-3xl font-extrabold text-dark-gray">Bienvenido a Habitat.app</h1>
        <p className="mt-2 text-gray-600">¿Cómo quieres ingresar?</p>
      </div>

      <div className="mt-8 w-full max-w-md">
        <div className="bg-white p-6 shadow-md rounded-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Selecciona tu rol</label>
              <div className="grid grid-cols-3 gap-3">
                {roleOptions.map((role) => (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => handleSelectRole(role.id)}
                    className={`flex flex-col items-center justify-center p-4 border-2 rounded-lg transition-all duration-200 ${
                      selectedRole === role.id
                        ? 'border-primary bg-blue-50 text-primary shadow-inner'
                        : 'border-gray-300 text-gray-500 hover:border-primary hover:text-primary'
                    }`}
                  >
                    {role.icon}
                    <span className="mt-2 text-sm font-semibold">{role.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="habitatCode" className="block text-sm font-medium text-gray-700">
                Código de Habitat
              </label>
              <input
                id="habitatCode"
                type="text"
                value={habitatCode}
                onChange={(e) => {
                  setHabitatCode(e.target.value);
                  setError('');
                }}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                placeholder="Ej. CUMBRES2024"
                required
              />
            </div>

            {error && <p className="text-sm text-center text-red-600">{error}</p>}

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:bg-gray-400"
              >
                Continuar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RoleSelector;
