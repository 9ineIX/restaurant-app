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
  const [errors, setErrors] = useState<Record<string, string>>({});

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
    
    // Validation
    const newErrors: Record<string, string> = {};
    
    if (!formData.Name.trim()) {
      newErrors.Name = 'Название обязательно';
    }
    
    if (!formData.Price || parseFloat(formData.Price) <= 0) {
      newErrors.Price = 'Цена должна быть больше 0';
    }
    
    if (!formData.Description.trim()) {
      newErrors.Description = 'Описание обязательно';
    }
    
    if (formData.IDDish_types === 0) {
      newErrors.IDDish_types = 'Выберите тип блюда';
    }
    
    if (formData.selectedIngredients.length === 0) {
      newErrors.selectedIngredients = 'Выберите хотя бы один ингредиент';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
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
    // Clear error when user selects ingredients
    if (errors.selectedIngredients) {
      setErrors(prev => ({ ...prev, selectedIngredients: '' }));
    }
  };

  const getInputStyle = (fieldName?: string) => ({
    width: '100%',
    padding: '12px 16px',
    border: errors[fieldName || ''] ? '1px solid #dc2626' : '1px solid #e9ecef',
    borderRadius: '8px',
    fontSize: '16px',
    transition: 'all 0.2s ease',
    background: '#ffffff'
  });

  const labelStyle = {
    display: 'block',
    fontSize: '14px',
    fontWeight: '500',
    color: '#2c3e50',
    marginBottom: '8px'
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50" style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
        <div style={{ background: '#ffffff', borderRadius: '16px', padding: '24px' }}>
          Загрузка данных...
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '32px', maxWidth: '600px', width: '100%' }}>
      <h3 style={{
        fontSize: '24px',
        fontWeight: '700',
        color: '#2c3e50',
        marginBottom: '24px',
        textAlign: 'center'
      }}>Добавить блюдо</h3>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={labelStyle}>Название</label>
            <input
              type="text"
              required
              value={formData.Name}
              onChange={(e) => setFormData({...formData, Name: e.target.value})}
              style={getInputStyle('Name')}
              placeholder="Название блюда"
            />
            {errors.Name && <div style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>{errors.Name}</div>}
          </div>

          <div>
            <label style={labelStyle}>Цена (₽)</label>
            <input
              type="number"
              step="0.01"
              required
              value={formData.Price}
              onChange={(e) => setFormData({...formData, Price: e.target.value})}
              style={getInputStyle('Price')}
              placeholder="0.00"
            />
            {errors.Price && <div style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>{errors.Price}</div>}
          </div>

          <div>
            <label style={labelStyle}>Описание</label>
            <textarea
              required
              rows={3}
              value={formData.Description}
              onChange={(e) => setFormData({...formData, Description: e.target.value})}
              style={{ ...getInputStyle('Description'), resize: 'vertical' }}
              placeholder="Описание блюда"
            />
            {errors.Description && <div style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>{errors.Description}</div>}
          </div>

          <div>
            <label style={labelStyle}>Тип блюда</label>
            <select
              required
              value={formData.IDDish_types}
              onChange={(e) => setFormData({...formData, IDDish_types: parseInt(e.target.value) || 0})}
              style={getInputStyle('IDDish_types')}
            >
              <option value="">Выберите тип</option>
              {dishTypes.map(type => (
                <option key={type.IDDish_types} value={type.IDDish_types}>
                  {type.Name}
                </option>
              ))}
            </select>
            {errors.IDDish_types && <div style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>{errors.IDDish_types}</div>}
          </div>

          <div>
            <label style={labelStyle}>Ингредиенты</label>
            <div style={{
              maxHeight: '160px',
              overflowY: 'auto',
              border: errors.selectedIngredients ? '1px solid #dc2626' : '1px solid #e9ecef',
              borderRadius: '8px',
              padding: '12px'
            }}>
            {errors.selectedIngredients && <div style={{ color: '#dc2626', fontSize: '12px', marginBottom: '8px' }}>{errors.selectedIngredients}</div>}
              {ingredients.map(ingredient => (
                <label key={ingredient.IDIngredients} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px',
                  cursor: 'pointer',
                  borderRadius: '8px'
                }}>
                  <input
                    type="checkbox"
                    checked={formData.selectedIngredients.includes(ingredient.IDIngredients)}
                    onChange={() => handleIngredientToggle(ingredient.IDIngredients)}
                    style={{ width: '18px', height: '18px' }}
                  />
                  <span style={{ fontSize: '14px', color: '#2c3e50' }}>
                    {ingredient.Name} ({ingredient.Price} ₽)
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
            <button
              type="button"
              onClick={onCancel}
              style={{
                padding: '12px 24px',
                border: '1px solid #e9ecef',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '500',
                color: '#6c757d',
                background: 'transparent',
                cursor: 'pointer'
              }}
            >
              Отмена
            </button>
            <button
              type="submit"
              style={{
                padding: '12px 24px',
                background: '#ff6b35',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              Добавить
            </button>
          </div>
        </form>
    </div>
  );
};
