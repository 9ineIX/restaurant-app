import React, { useState, useEffect } from 'react';
import { ingredientsApi } from '../services/api';

interface IngredientFormProps {
  onSubmit: (ingredientData: any) => void;
  onCancel: () => void;
}

interface Category {
  IDIngredients_categories: number;
  Name: string;
}

export const IngredientForm: React.FC<IngredientFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    Name: '',
    Price: '',
    IDIngredients_categories: 0, // Изменяем с '' на 0 (число)
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await ingredientsApi.getCategories();
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      Price: parseFloat(formData.Price)
    });
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6">Загрузка категорий...</div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">Добавить ингредиент</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Название
            </label>
            <input
              type="text"
              required
              value={formData.Name}
              onChange={(e) => setFormData({...formData, Name: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Цена (₽)
            </label>
            <input
              type="number"
              step="0.01"
              required
              value={formData.Price}
              onChange={(e) => setFormData({...formData, Price: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Категория
            </label>
            <select
              required
              value={formData.IDIngredients_categories}
              onChange={(e) => setFormData({...formData, IDIngredients_categories: parseInt(e.target.value) || 0})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Выберите категорию</option>
              {categories.map(category => (
                <option key={category.IDIngredients_categories} value={category.IDIngredients_categories}>
                  {category.Name}
                </option>
              ))}
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
