'use client';

import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';

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
    // Aquí iría la lógica para actualizar el perfil
    setIsEditing(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">Mi Perfil</h1>

      <div className="bg-white rounded-lg shadow-md p-8">
        {/* Avatar */}
        <div className="flex justify-center mb-8">
          <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
            <span className="text-5xl font-bold text-white">
              {user?.username.charAt(0).toUpperCase()}
            </span>
          </div>
        </div>

        {/* Información */}
        <div className="space-y-4 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={user?.email}
              disabled
              className="w-full px-4 py-2 border rounded-lg bg-gray-100 text-gray-700 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Usuario
            </label>
            <input
              type="text"
              value={user?.username}
              disabled
              className="w-full px-4 py-2 border rounded-lg bg-gray-100 text-gray-700 cursor-not-allowed"
            />
          </div>

          {isEditing ? (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Apellido
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleSubmit}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                >
                  Guardar Cambios
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex-1 bg-gray-400 text-white py-2 rounded-lg hover:bg-gray-500"
                >
                  Cancelar
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre
                  </label>
                  <p className="px-4 py-2 text-gray-700">
                    {formData.firstName || 'No especificado'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Apellido
                  </label>
                  <p className="px-4 py-2 text-gray-700">
                    {formData.lastName || 'No especificado'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsEditing(true)}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
              >
                Editar Perfil
              </button>
            </>
          )}
        </div>

        {/* Stats */}
        <div className="border-t pt-8">
          <h2 className="text-xl font-bold mb-4">Estadísticas</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">0</div>
              <div className="text-sm text-gray-600">Posts</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">0</div>
              <div className="text-sm text-gray-600">Seguidores</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">0</div>
              <div className="text-sm text-gray-600">Siguiendo</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
