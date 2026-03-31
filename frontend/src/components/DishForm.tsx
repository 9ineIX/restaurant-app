import React, { useState, useEffect } from 'react';
import { dishesApi, ingredientsApi } from '../services/api';

interface DishFormProps {
  onSubmit: (dishData: any) => void;
  onCancel: () => void;
}

interface DishType {
  IDDish_types: number;
  Name: string;
}

interface Ingredient {
  IDIngredients: number;
  Name: string;
  Price: number;
}

export const DishForm: React.FC<DishFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    Name: '',
    Price: '',
    Description: '',
    IDDish_types: 0, // Изменяем с '' на 0 (число)
    selectedIngredients: [] as number[]
  });
  const [dishTypes, setDishTypes] = useState<DishType[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [typesResponse, ingredientsResponse] = await Promise.all([
          dishesApi.getTypes(),
          ingredientsApi.getAll()
        ]);
        setDishTypes(typesResponse.data);
        setIngredients(ingredientsResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      Price: parseFloat(formData.Price),
      Ingredients: formData.selectedIngredients.map(id => ({ IDIngredients: id }))
    });
  };

  const handleIngredientToggle = (ingredientId: number) => {
    setFormData(prev => ({
      ...prev,
      selectedIngredients: prev.selectedIngredients.includes(ingredientId)
        ? prev.selectedIngredients.filter(id => id !== ingredientId)
        : [...prev.selectedIngredients, ingredientId]
    }));
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6">Загрузка данных...</div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4">Добавить блюдо</h3>
        
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
              Описание
            </label>
            <textarea
              required
              rows={3}
              value={formData.Description}
              onChange={(e) => setFormData({...formData, Description: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Тип блюда
            </label>
            <select
              required
              value={formData.IDDish_types}
              onChange={(e) => setFormData({...formData, IDDish_types: parseInt(e.target.value) || 0})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Выберите тип</option>
              {dishTypes.map(type => (
                <option key={type.IDDish_types} value={type.IDDish_types}>
                  {type.Name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ингредиенты
            </label>
            <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-md p-2">
              {ingredients.map(ingredient => (
                <label key={ingredient.IDIngredients} className="flex items-center space-x-2 p-1 hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={formData.selectedIngredients.includes(ingredient.IDIngredients)}
                    onChange={() => handleIngredientToggle(ingredient.IDIngredients)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm">{ingredient.Name} ({ingredient.Price} ₽)</span>
                </label>
              ))}
            </div>
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
