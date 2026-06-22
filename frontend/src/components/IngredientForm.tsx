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
  const [errors, setErrors] = useState<Record<string, string>>({});

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
    
    // Validation
    const newErrors: Record<string, string> = {};
    
    if (!formData.Name.trim()) {
      newErrors.Name = 'Название обязательно';
    }
    
    if (!formData.Price || parseFloat(formData.Price) <= 0) {
      newErrors.Price = 'Цена должна быть больше 0';
    }
    
    if (formData.IDIngredients_categories === 0) {
      newErrors.IDIngredients_categories = 'Выберите категорию';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    onSubmit({
      ...formData,
      Price: parseFloat(formData.Price)
    });
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
          Загрузка категорий...
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
      }}>Добавить ингредиент</h3>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={labelStyle}>Название</label>
            <input
              type="text"
              required
              value={formData.Name}
              onChange={(e) => setFormData({...formData, Name: e.target.value})}
              style={getInputStyle('Name')}
              placeholder="Название ингредиента"
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
            <label style={labelStyle}>Категория</label>
            <select
              required
              value={formData.IDIngredients_categories}
              onChange={(e) => setFormData({...formData, IDIngredients_categories: parseInt(e.target.value) || 0})}
              style={getInputStyle('IDIngredients_categories')}
            >
              <option value="">Выберите категорию</option>
              {categories.map(category => (
                <option key={category.IDIngredients_categories} value={category.IDIngredients_categories}>
                  {category.Name}
                </option>
              ))}
            </select>
            {errors.IDIngredients_categories && <div style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>{errors.IDIngredients_categories}</div>}
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
