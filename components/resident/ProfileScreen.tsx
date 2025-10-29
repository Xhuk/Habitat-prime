
import React, { useState } from 'react';
import { AuthenticatedUser } from '../../types';
import ProfileModal from '../ProfileModal';
import { PencilSquareIcon } from '../Icons';

interface ProfileScreenProps {
  user: AuthenticatedUser;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ user: initialUser }) => {
  const [user, setUser] = useState<AuthenticatedUser>(initialUser);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleUpdate = (updatedUser: AuthenticatedUser) => {
    setUser(updatedUser);
    setIsModalOpen(false);
    // In a real app, you would also call a service to save the user data.
    console.log("User updated (mock):", updatedUser);
  };

  return (
    <>
      <div className="bg-white p-6 rounded-2xl shadow-lg animate-fade-in space-y-4">
        <div className="flex justify-between items-start">
            <div className="flex items-center space-x-4">
                <img src={user.avatarUrl} alt="Avatar" className="w-20 h-20 rounded-full object-cover" />
                <div>
                    <h2 className="text-2xl font-bold text-dark-gray">{user.name}</h2>
                    <p className="text-gray-500">{user.property}</p>
                </div>
            </div>
            <button onClick={() => setIsModalOpen(true)} className="text-primary hover:text-secondary">
                <PencilSquareIcon className="h-6 w-6" />
            </button>
        </div>

        <div className="pt-4 border-t space-y-3 text-sm">
            <div>
                <p className="font-semibold text-gray-500">Email</p>
                <p className="text-dark-gray">{user.email}</p>
            </div>
             <div>
                <p className="font-semibold text-gray-500">Teléfono</p>
                <p className="text-dark-gray">{user.phone}</p>
            </div>
        </div>
      </div>
      <ProfileModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={user}
        onUpdate={handleUpdate}
      />
    </>
  );
};

export default ProfileScreen;
