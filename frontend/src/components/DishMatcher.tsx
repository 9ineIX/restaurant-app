import React from 'react';
import { useMutation } from '@tanstack/react-query';
import { dishesApi } from '../services/api';
import type { SelectedIngredient, MatchResult } from '../types';

interface DishMatcherProps {
  selectedIngredients: SelectedIngredient[];
  onMatchFound: (result: MatchResult) => void;
}

export const DishMatcher: React.FC<DishMatcherProps> = ({
  selectedIngredients,
  onMatchFound,
}) => {
  const matchMutation = useMutation({
    mutationFn: ({ ingredients, includeExtra }: { ingredients: { id: number; quantity: number }[], includeExtra: boolean }) =>
      dishesApi.match(ingredients, includeExtra).then(res => res.data),
    onSuccess: (result) => {
      onMatchFound(result);
    },
  });

  const handleMatch = (includeExtra = false) => {
    const ingredients = selectedIngredients.map(item => ({
      id: item.id,
      quantity: item.quantity,
    }));
    matchMutation.mutate({ ingredients, includeExtra });
  };

  const canMatch = selectedIngredients.length > 0 && !matchMutation.isPending;

  return (
    <div className="dish-matcher">
      <div className="matcher-header" style={{ marginBottom: '24px' }}>
        <div className="matcher-title" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '16px'
        }}>
          <div>
            <h3 style={{
              fontSize: '24px',
              fontWeight: '600',
              color: 'var(--text-primary)',
              margin: '0 0 4px 0'
            }}>
              🍳 Подбор блюда по ингредиентам
            </h3>
            <p style={{
              fontSize: '14px',
              color: 'var(--text-secondary)',
              margin: 0
            }}>
              Найдем идеальное блюдо на основе выбранных ингредиентов
            </p>
          </div>
          
          <div className="selected-count" style={{
            background: 'var(--primary-color)',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '20px',
            fontSize: '14px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            🥘 {selectedIngredients.length} ингредиентов
          </div>
        </div>
      </div>

      <div className="matcher-content">
        {selectedIngredients.length === 0 ? (
          <div className="empty-state" style={{
            textAlign: 'center',
            padding: '48px 24px',
            background: 'linear-gradient(135deg, #f8f9fa, #ffffff)',
            borderRadius: 'var(--radius-md)',
            border: '2px dashed var(--border-color)',
            marginBottom: '24px'
          }}>
            <div style={{
              fontSize: '48px',
              marginBottom: '16px',
              opacity: '0.6'
            }}>
              🍽️
            </div>
            <h4 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: 'var(--text-primary)',
              margin: '0 0 8px 0'
            }}>
              Выберите ингредиенты
            </h4>
            <p style={{
              fontSize: '14px',
              color: 'var(--text-secondary)',
              margin: 0
            }}>
              Добавьте хотя бы один ингредиент для подбора идеального блюда
            </p>
          </div>
        ) : (
          <div className="ingredients-preview" style={{
            background: 'linear-gradient(135deg, #fff5f2, #ffffff)',
            borderRadius: 'var(--radius-md)',
            padding: '20px',
            marginBottom: '24px',
            border: '1px solid var(--primary-color)',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{
              fontSize: '14px',
              fontWeight: '600',
              color: 'var(--primary-color)',
              marginBottom: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              ✨ Готовы к подбору блюда!
            </div>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px'
            }}>
              {selectedIngredients.slice(0, 5).map((item) => (
                <span key={item.id} style={{
                  background: 'var(--surface)',
                  padding: '6px 12px',
                  borderRadius: '16px',
                  fontSize: '12px',
                  fontWeight: '500',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-color)'
                }}>
                  {item.ingredient.Name}
                </span>
              ))}
              {selectedIngredients.length > 5 && (
                <span style={{
                  background: 'var(--background)',
                  padding: '6px 12px',
                  borderRadius: '16px',
                  fontSize: '12px',
                  fontWeight: '500',
                  color: 'var(--text-secondary)'
                }}>
                  +{selectedIngredients.length - 5} еще
                </span>
              )}
            </div>
          </div>
        )}

        <div className="matcher-action">
          <button
            onClick={() => handleMatch()}
            disabled={!canMatch}
            className="match-button"
            style={{
              width: '100%',
              padding: '20px 32px',
              fontSize: '18px',
              fontWeight: '600',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              cursor: canMatch ? 'pointer' : 'not-allowed',
              background: canMatch 
                ? 'linear-gradient(135deg, var(--primary-color), var(--primary-hover))' 
                : 'var(--background)',
              color: canMatch ? 'white' : 'var(--text-secondary)',
              boxShadow: canMatch ? 'var(--shadow-md)' : 'none',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              if (canMatch) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
              }
            }}
            onMouseLeave={(e) => {
              if (canMatch) {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
              }
            }}
          >
            {matchMutation.isPending ? (
              <>
                <div style={{
                  width: '20px',
                  height: '20px',
                  border: '3px solid rgba(255, 255, 255, 0.3)',
                  borderTop: '3px solid white',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
                Подбираем идеальное блюдо...
              </>
            ) : (
              <>
                🎯 Подобрать блюдо
                <span style={{
                  fontSize: '14px',
                  opacity: 0.8,
                  fontWeight: '400'
                }}>
                  ({selectedIngredients.length} ингредиентов)
                </span>
              </>
            )}
          </button>
        </div>

        {matchMutation.error && (
          <div className="error-message" style={{
            marginTop: '16px',
            padding: '16px',
            background: 'linear-gradient(135deg, #fee, #fff5f5)',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid #fcc',
            color: '#dc2626',
            fontSize: '14px',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            ⚠️ Ошибка при подборе блюда. Попробуйте еще раз.
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
