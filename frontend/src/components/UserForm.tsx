import React, { useState } from 'react';

interface UserFormProps {
  onSubmit: (userData: any) => void;
  onCancel: () => void;
}

export const UserForm: React.FC<UserFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    FIO: '',
    Email: '',
    Password: '',
    IDRoles: 1 // CLIENT по умолчанию
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">Добавить пользователя</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ФИО
            </label>
            <input
              type="text"
              required
              value={formData.FIO}
              onChange={(e) => setFormData({...formData, FIO: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              required
              value={formData.Email}
              onChange={(e) => setFormData({...formData, Email: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Пароль
            </label>
            <input
              type="password"
              required
              value={formData.Password}
              onChange={(e) => setFormData({...formData, Password: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Роль
            </label>
            <select
              value={formData.IDRoles}
              onChange={(e) => setFormData({...formData, IDRoles: parseInt(e.target.value)})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={1}>Клиент</option>
              <option value={2}>Сотрудник</option>
              <option value={3}>Администратор</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Добавить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
