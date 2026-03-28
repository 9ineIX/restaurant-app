import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { ingredientsApi } from '../services/api';
import type { SelectedIngredient } from '../types';

interface IngredientSelectorProps {
  selectedIngredients: SelectedIngredient[];
  onIngredientChange: (ingredients: SelectedIngredient[]) => void;
}

export const IngredientSelector: React.FC<IngredientSelectorProps> = ({
  selectedIngredients,
  onIngredientChange,
}) => {
  const { data: ingredients, isLoading } = useQuery({
    queryKey: ['ingredients'],
    queryFn: () => ingredientsApi.getAll().then(res => res.data),
  });

  const getSelectedQuantity = (ingredientId: number) => {
    const selected = selectedIngredients.find(item => item.id === ingredientId);
    return selected?.quantity || 0;
  };

  const updateQuantity = (ingredientId: number, delta: number) => {
    const currentQuantity = getSelectedQuantity(ingredientId);
    const newQuantity = Math.max(0, currentQuantity + delta);
    
    if (newQuantity === 0) {
      onIngredientChange(selectedIngredients.filter(item => item.id !== ingredientId));
    } else {
      const ingredient = ingredients?.find((i: any) => i.IDIngredients === ingredientId);
      if (ingredient) {
        const updatedIngredients = selectedIngredients.filter(item => item.id !== ingredientId);
        updatedIngredients.push({
          id: ingredientId,
          quantity: newQuantity,
          ingredient,
        });
        onIngredientChange(updatedIngredients);
      }
    }
  };

  // Функция для получения стилизованного фона с эмодзи по категории ингредиента
  const getIngredientStyle = (categoryName: string) => {
    const styleMap: { [key: string]: { emoji: string; gradient: string } } = {
      'Овощи': { 
        emoji: '🥬', 
        gradient: 'linear-gradient(135deg, #e8f5e8, #c8e6c9)' 
      },
      'Мясо': { 
        emoji: '🥩', 
        gradient: 'linear-gradient(135deg, #ffe8e8, #ffcccc)' 
      },
      'Рыба': { 
        emoji: '🐟', 
        gradient: 'linear-gradient(135deg, #e8f4ff, #cce7ff)' 
      },
      'Молочные продукты': { 
        emoji: '🧀', 
        gradient: 'linear-gradient(135deg, #fff8e8, #ffe8cc)' 
      },
      'Фрукты': { 
        emoji: '🍎', 
        gradient: 'linear-gradient(135deg, #ffe8f4, #ffccd9)' 
      },
      'Соусы': { 
        emoji: '🥫', 
        gradient: 'linear-gradient(135deg, #f5e8ff, #e6ccff)' 
      },
      'Специи': { 
        emoji: '🌿', 
        gradient: 'linear-gradient(135deg, #e8ffe8, #ccffcc)' 
      },
      'Гарниры': { 
        emoji: '🍚', 
        gradient: 'linear-gradient(135deg, #fff8e8, #ffecb3)' 
      },
      'Напитки': { 
        emoji: '🥤', 
        gradient: 'linear-gradient(135deg, #e8f8ff, #cceeff)' 
      },
    };
    return styleMap[categoryName] || { 
      emoji: '🍽️', 
      gradient: 'linear-gradient(135deg, #f8f9fa, #e9ecef)' 
    };
  };

  
  if (isLoading) {
    return (
      <div className="loading-container" style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '48px',
        background: 'var(--surface)',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
          <div style={{ fontSize: '18px', color: 'var(--text-secondary)' }}>Загрузка ингредиентов...</div>
        </div>
      </div>
    );
  }

  if (!ingredients?.length) {
    return (
      <div className="empty-state" style={{
        textAlign: 'center',
        padding: '48px',
        background: 'var(--surface)',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🥄</div>
        <div style={{ fontSize: '18px', color: 'var(--text-secondary)' }}>Ингредиенты не найдены</div>
      </div>
    );
  }

  return (
    <div className="ingredient-selector">
      <div className="selector-header" style={{ marginBottom: '32px' }}>
        <h2 style={{
          fontSize: '32px',
          fontWeight: '700',
          color: 'var(--text-primary)',
          marginBottom: '8px'
        }}>
          Выберите ингредиенты
        </h2>
        <p style={{
          fontSize: '16px',
          color: 'var(--text-secondary)',
          margin: 0
        }}>
          Добавьте ингредиенты для создания идеального блюда
        </p>
      </div>
      
      <div className="ingredients-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '20px'
      }}>
        {ingredients.map((ingredient: any) => {
          const quantity = getSelectedQuantity(ingredient.IDIngredients);
          const isSelected = quantity > 0;
          
          return (
            <div
              key={ingredient.IDIngredients}
              className={`ingredient-card ${isSelected ? 'selected' : ''}`}
              style={{
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                transition: 'all 0.2s ease',
                cursor: 'pointer',
                border: isSelected ? '2px solid var(--primary-color)' : '1px solid var(--border-color)',
                background: isSelected ? 'linear-gradient(45deg, #fff5f2, #ffffff)' : 'var(--surface)',
                boxShadow: isSelected ? 'var(--shadow-md)' : 'var(--shadow-sm)',
                transform: isSelected ? 'translateY(-2px)' : 'translateY(0)'
              }}
            >
              <div className="ingredient-image" style={{
                height: '120px',
                background: getIngredientStyle(ingredient.Category?.Name || 'Другое').gradient,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '48px',
                position: 'relative',
                overflow: 'hidden',
                borderRadius: 'var(--radius-sm) var(--radius-sm) 0 0'
              }}>
                <span style={{
                  fontSize: '56px',
                  lineHeight: '1',
                  fontFamily: 'Apple Color Emoji, "Segoe UI Emoji", NotoColorEmoji, "EmojiOne Color", "Android Emoji", sans-serif',
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
                  animation: 'float 3s ease-in-out infinite',
                  display: 'inline-block'
                }}>
                  {getIngredientStyle(ingredient.Category?.Name || 'Другое').emoji}
                </span>
                {isSelected && (
                  <div style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    width: '24px',
                    height: '24px',
                    background: 'var(--primary-color)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    zIndex: 10,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                  }}>
                    ✓
                  </div>
                )}
              </div>
              
              <div className="ingredient-info" style={{ padding: '16px' }}>
                <div className="ingredient-header" style={{ marginBottom: '12px' }}>
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: 'var(--text-primary)',
                    margin: '0 0 4px 0'
                  }}>
                    {ingredient.Name}
                  </h3>
                  <p style={{
                    fontSize: '14px',
                    color: 'var(--text-secondary)',
                    margin: '0'
                  }}>
                    {ingredient.Category?.Name}
                  </p>
                </div>
                
                <div className="ingredient-footer" style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div className="price" style={{
                    fontSize: '18px',
                    fontWeight: '700',
                    color: 'var(--accent-color)'
                  }}>
                    {ingredient.Price} ₽
                  </div>
                  
                  <div className="quantity-controls" style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <button
                      onClick={() => updateQuantity(ingredient.IDIngredients, -1)}
                      disabled={quantity === 0}
                      className="quantity-btn decrease"
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '18px',
                        fontWeight: '600',
                        cursor: quantity === 0 ? 'not-allowed' : 'pointer',
                        background: quantity === 0 ? 'var(--background)' : 'var(--primary-color)',
                        color: quantity === 0 ? 'var(--text-secondary)' : 'white',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      −
                    </button>
                    
                    <span className="quantity" style={{
                      minWidth: '24px',
                      textAlign: 'center',
                      fontSize: '16px',
                      fontWeight: '600',
                      color: 'var(--text-primary)'
                    }}>
                      {quantity}
                    </span>
                    
                    <button
                      onClick={() => updateQuantity(ingredient.IDIngredients, 1)}
                      className="quantity-btn increase"
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '18px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        background: 'var(--primary-color)',
                        color: 'white',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {selectedIngredients.length > 0 && (
        <div className="selected-summary" style={{
          marginTop: '32px',
          padding: '24px',
          background: 'linear-gradient(135deg, #f8f9fa, #ffffff)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: 'var(--text-primary)',
            marginBottom: '16px'
          }}>
            🛒 Выбранные ингредиенты ({selectedIngredients.length}):
          </h3>
          <div className="selected-list" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '12px'
          }}>
            {selectedIngredients.map((item) => (
              <div key={item.id} className="selected-item" style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '8px 12px',
                background: 'var(--surface)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-color)'
              }}>
                <span style={{
                  fontSize: '14px',
                  color: 'var(--text-primary)'
                }}>
                  {item.ingredient.Name}
                </span>
                <span style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: 'var(--primary-color)',
                  background: '#fff5f2',
                  padding: '2px 8px',
                  borderRadius: '12px'
                }}>
                  ×{item.quantity}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Добавляем глобальные стили для анимации
const style = document.createElement('style');
style.textContent = `
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-5px); }
  }
`;
document.head.appendChild(style);
