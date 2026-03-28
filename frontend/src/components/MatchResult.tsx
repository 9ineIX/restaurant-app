import React, { useState } from 'react';
import type { MatchResult } from '../types';

interface MatchResultProps {
  result: MatchResult | null;
  onAccept: (dish: any) => void;
  onRequestAnother: () => void;
  onEditIngredients: () => void;
  onConfirmExtraIngredients: (includeExtra: boolean) => void;
}

export const MatchResultComponent: React.FC<MatchResultProps> = ({
  result,
  onAccept,
  onRequestAnother,
  onEditIngredients,
  onConfirmExtraIngredients,
}) => {
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);

  if (!result || !result.bestMatch) {
    return null;
  }

  const { bestMatch } = result;

  const handleAccept = () => {
    if (bestMatch.extra > 0) {
      setShowConfirmationDialog(true);
    } else {
      onAccept(bestMatch.dish);
    }
  };

  const handleConfirmExtra = (includeExtra: boolean) => {
    setShowConfirmationDialog(false);
    if (includeExtra) {
      onConfirmExtraIngredients(true);
      // Повторный запрос с подтверждением лишних ингредиентов
      setTimeout(() => onAccept(bestMatch.dish), 100);
    } else {
      onAccept(bestMatch.dish);
    }
  };

  // Функция для получения стилизованного фона для блюда
  const getDishStyle = (dishName: string) => {
    const styleMap: { [key: string]: { emoji: string; gradient: string } } = {
      'Цезарь': { 
        emoji: '🥗', 
        gradient: 'linear-gradient(135deg, #e8f5e8, #c8e6c9)' 
      },
      'Салат': { 
        emoji: '🥗', 
        gradient: 'linear-gradient(135deg, #ffe8f4, #ffccd9)' 
      },
      'Паста': { 
        emoji: '🍝', 
        gradient: 'linear-gradient(135deg, #fff8e8, #ffe8cc)' 
      },
      'Пицца': { 
        emoji: '🍕', 
        gradient: 'linear-gradient(135deg, #ffe8e8, #ffcccc)' 
      },
      'Суп': { 
        emoji: '🍲', 
        gradient: 'linear-gradient(135deg, #f5e8ff, #e6ccff)' 
      },
      'Ризотто': { 
        emoji: '🍛', 
        gradient: 'linear-gradient(135deg, #fff8e8, #ffecb3)' 
      },
      'Картошка': { 
        emoji: '🥔', 
        gradient: 'linear-gradient(135deg, #ffe8cc, #ffd4a3)' 
      },
      'Курица': { 
        emoji: '🍗', 
        gradient: 'linear-gradient(135deg, #ffe8e8, #ffcccc)' 
      },
      'Рыба': { 
        emoji: '🐟', 
        gradient: 'linear-gradient(135deg, #e8f4ff, #cce7ff)' 
      },
      'Мясо': { 
        emoji: '🥩', 
        gradient: 'linear-gradient(135deg, #ffe8e8, #ffcccc)' 
      },
    };
    
    // Ищем совпадение по названию
    for (const [key, style] of Object.entries(styleMap)) {
      if (dishName.toLowerCase().includes(key.toLowerCase())) {
        return style;
      }
    }
    
    // По умолчанию
    return { 
      emoji: '🍽️', 
      gradient: 'linear-gradient(135deg, #f8f9fa, #e9ecef)' 
    };
  };

  const getIngredientStatus = (ingredientId: number) => {
    const isSelected = bestMatch.extraIngredients.includes(ingredientId);
    const isMissing = bestMatch.missingIngredients.some(
      (mi: any) => mi.IDIngredients === ingredientId
    );
    
    if (isSelected) return 'extra';
    if (isMissing) return 'missing';
    return 'matched';
  };

  const getIngredientColor = (status: string) => {
    switch (status) {
      case 'extra':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'missing':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-green-100 text-green-800 border-green-300';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">
          Рекомендуемое блюдо
        </h3>
        
        {/* Изображение блюда */}
        <div style={{
          marginBottom: '24px',
          borderRadius: 'var(--radius-md)',
          overflow: 'hidden',
          position: 'relative',
          height: '200px'
        }}>
          <div style={{
            width: '100%',
            height: '100%',
            background: getDishStyle(bestMatch.dish.Name).gradient,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
          }}>
            <span style={{
              fontSize: '80px',
              lineHeight: '1',
              fontFamily: 'Apple Color Emoji, "Segoe UI Emoji", NotoColorEmoji, "EmojiOne Color", "Android Emoji", sans-serif',
              filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.15))',
              animation: 'pulse 2s ease-in-out infinite',
              display: 'inline-block'
            }}>
              {getDishStyle(bestMatch.dish.Name).emoji}
            </span>
            <div style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              background: 'var(--primary-color)',
              color: 'white',
              padding: '8px 12px',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: '600',
              boxShadow: 'var(--shadow-sm)'
            }}>
              🎯 {bestMatch.matchPercentage.toFixed(1)}% совпадение
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <h4 className="text-xl font-semibold text-blue-600 mb-2">
            {bestMatch.dish.Name}
          </h4>
          <p className="text-gray-600 mb-2">{bestMatch.dish.Description}</p>
          <p className="text-2xl font-bold text-green-600">
            {bestMatch.dish.Price} ₽
          </p>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-500">
              Совпадение ингредиентов
            </span>
            <span className="text-lg font-bold text-blue-600">
              {bestMatch.matchPercentage.toFixed(1)}%
            </span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${bestMatch.matchPercentage}%` }}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h5 className="font-semibold text-gray-800">Состав блюда:</h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {bestMatch.dish.Ingredients.map((dishIngredient: any) => {
              const status = getIngredientStatus(dishIngredient.IDIngredients);
              const colorClass = getIngredientColor(status);
              
              return (
                <div
                  key={dishIngredient.IDDish_ingredients}
                  className={`p-3 rounded-lg border ${colorClass}`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">
                      {dishIngredient.Ingredient.Name}
                    </span>
                    <span className="text-sm">
                      ×{dishIngredient.Quantity}
                    </span>
                  </div>
                  {status === 'extra' && (
                    <span className="text-xs mt-1 block">
                      (лишний ингредиент)
                    </span>
                  )}
                  {status === 'missing' && (
                    <span className="text-xs mt-1 block">
                      (отсутствует)
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {bestMatch.extra > 0 && (
          <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
            <p className="text-sm text-yellow-800">
              ⚠️ У вас есть {bestMatch.extra} лишних ингредиентов, которые не используются в этом блюде
            </p>
          </div>
        )}

        {bestMatch.missing > 0 && (
          <div className="mt-4 p-3 bg-red-50 rounded-lg">
            <p className="text-sm text-red-800">
              ⚠️ Для этого блюда не хватает {bestMatch.missing} ингредиентов
            </p>
          </div>
        )}
      </div>

      <div className="result-actions" style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        <button
          onClick={handleAccept}
          className="btn btn-primary"
          style={{
            width: '100%',
            padding: '16px 24px',
            fontSize: '16px',
            fontWeight: '600',
            background: 'linear-gradient(135deg, var(--primary-color), var(--primary-hover))',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            color: 'white',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: 'var(--shadow-sm)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = 'var(--shadow-md)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
          }}
        >
          🛒 Принять и заказать
        </button>
        
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={onRequestAnother}
            className="btn btn-secondary"
            style={{
              flex: 1,
              padding: '14px 20px',
              fontSize: '14px',
              fontWeight: '500',
              background: 'var(--surface)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--primary-color)';
              e.currentTarget.style.color = 'var(--primary-color)';
              e.currentTarget.style.background = '#fff5f2';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-color)';
              e.currentTarget.style.color = 'var(--text-primary)';
              e.currentTarget.style.background = 'var(--surface)';
            }}
          >
            🔄 Предложить другой вариант
          </button>
          
          <button
            onClick={onEditIngredients}
            className="btn btn-secondary"
            style={{
              flex: 1,
              padding: '14px 20px',
              fontSize: '14px',
              fontWeight: '500',
              background: 'var(--surface)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--primary-color)';
              e.currentTarget.style.color = 'var(--primary-color)';
              e.currentTarget.style.background = '#fff5f2';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-color)';
              e.currentTarget.style.color = 'var(--text-primary)';
              e.currentTarget.style.background = 'var(--surface)';
            }}
          >
            ✏️ Изменить ингредиенты
          </button>
        </div>
      </div>

      {/* Pop-up окно подтверждения лишних ингредиентов */}
      {showConfirmationDialog && (
        <div className="popup-overlay">
          <div className="popup-content">
            <div className="popup-header" style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{
                width: '64px',
                height: '64px',
                background: 'linear-gradient(135deg, #fff5f2, #ffe0d0)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                fontSize: '32px'
              }}>
                ⚠️
              </div>
              <h3 style={{
                fontSize: '20px',
                fontWeight: '600',
                color: 'var(--text-primary)',
                margin: '0 0 8px 0'
              }}>
                Подтверждение ингредиентов
              </h3>
              <p style={{
                fontSize: '14px',
                color: 'var(--text-secondary)',
                margin: 0
              }}>
                Обнаружены дополнительные ингредиенты
              </p>
            </div>
            
            <div className="popup-body" style={{ marginBottom: '24px' }}>
              <p style={{
                fontSize: '16px',
                lineHeight: '1.6',
                color: 'var(--text-primary)',
                textAlign: 'center',
                margin: '0'
              }}>
                У вас есть <span style={{ fontWeight: '600', color: 'var(--primary-color)' }}>
                  {bestMatch.extra} лишних ингредиентов
                </span>, которые не входят в классический рецепт 
                <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
                  "{bestMatch.dish.Name}"
                </span>.
                <br /><br />
                Вы точно хотите добавить их в блюдо?
              </p>
            </div>
            
            <div className="popup-actions" style={{
              display: 'flex',
              gap: '12px',
              flexDirection: 'column'
            }}>
              <button
                onClick={() => handleConfirmExtra(true)}
                className="btn btn-primary"
                style={{
                  width: '100%',
                  padding: '16px 24px',
                  fontSize: '16px',
                  fontWeight: '600',
                  background: 'linear-gradient(135deg, var(--accent-color), #059669)',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  color: 'white',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: 'var(--shadow-sm)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                }}
              >
                ✅ Да, добавить все ингредиенты
              </button>
              <button
                onClick={() => handleConfirmExtra(false)}
                className="btn btn-secondary"
                style={{
                  width: '100%',
                  padding: '16px 24px',
                  fontSize: '16px',
                  fontWeight: '500',
                  background: 'var(--surface)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--primary-color)';
                  e.currentTarget.style.color = 'var(--primary-color)';
                  e.currentTarget.style.background = '#fff5f2';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-color)';
                  e.currentTarget.style.color = 'var(--text-primary)';
                  e.currentTarget.style.background = 'var(--surface)';
                }}
              >
                📝 Нет, использовать только рецепт
              </button>
              <button
                onClick={() => setShowConfirmationDialog(false)}
                style={{
                  width: '100%',
                  padding: '12px 24px',
                  fontSize: '14px',
                  fontWeight: '500',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Добавляем глобальные стили для анимации
const style = document.createElement('style');
style.textContent = `
  @keyframes pulse {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.05); opacity: 0.9; }
  }
`;
document.head.appendChild(style);
