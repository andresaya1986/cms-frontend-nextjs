'use client';

import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import { ProfileAvatarUpload } from '@/components/profile/ProfileAvatarUpload';
import profileService from '@/services/profileService';

export default function ProfilePage() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await profileService.updateProfile({
        displayName: formData.firstName + (formData.lastName ? ' ' + formData.lastName : ''),
        bio: '',
      });
      setIsEditing(false);
    } catch (err) {
      console.error('Error actualizando perfil:', err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-4xl font-bold mb-8 text-neutral-900 dark:text-neutral-100">Mi Perfil</h1>

      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md p-8 border border-neutral-200 dark:border-neutral-700 space-y-8">
        {/* Avatar Upload */}
        <div className="pb-8 border-b border-neutral-200 dark:border-neutral-700">
          <ProfileAvatarUpload
            currentAvatar={user?.avatarUrl || user?.avatar}
            onUploadSuccess={(avatarUrl) => {
              console.log('Avatar actualizado:', avatarUrl);
            }}
          />
        </div>

        {/* Información */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-900 dark:text-neutral-100 mb-2">
              Email
            </label>
            <input
              type="email"
              value={user?.email}
              disabled
              className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-900 dark:text-neutral-100 mb-2">
              Usuario
            </label>
            <input
              type="text"
              value={user?.username}
              disabled
              className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 cursor-not-allowed"
            />
          </div>

          {isEditing ? (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-900 dark:text-neutral-100 mb-2">
                    Nombre
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-900 dark:text-neutral-100 mb-2">
                    Apellido
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={handleSubmit}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-medium transition-colors"
                >
                  Guardar Cambios
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex-1 bg-neutral-400 dark:bg-neutral-600 text-white py-2 rounded-lg hover:bg-neutral-500 dark:hover:bg-neutral-700 font-medium transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-900 dark:text-neutral-100 mb-2">
                    Nombre
                  </label>
                  <p className="px-4 py-2 text-neutral-700 dark:text-neutral-300">
                    {formData.firstName || 'No especificado'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-900 dark:text-neutral-100 mb-2">
                    Apellido
                  </label>
                  <p className="px-4 py-2 text-neutral-700 dark:text-neutral-300">
                    {formData.lastName || 'No especificado'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsEditing(true)}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-medium transition-colors"
              >
                Editar Perfil
              </button>
            </>
          )}
        </div>

        {/* Stats */}
        <div className="border-t border-neutral-300 dark:border-neutral-600 pt-8">
          <h2 className="text-xl font-bold mb-4 text-neutral-900 dark:text-neutral-100">Estadísticas</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">0</div>
              <div className="text-sm text-neutral-600 dark:text-neutral-400">Posts</div>
            </div>
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/30 rounded-lg border border-green-200 dark:border-green-800">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">0</div>
              <div className="text-sm text-neutral-600 dark:text-neutral-400">Seguidores</div>
            </div>
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/30 rounded-lg border border-purple-200 dark:border-purple-800">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">0</div>
              <div className="text-sm text-neutral-600 dark:text-neutral-400">Siguiendo</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
