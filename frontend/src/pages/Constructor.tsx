import React, { useState } from 'react';
import { IngredientSelector } from '../components/IngredientSelector';
import { DishMatcher } from '../components/DishMatcher';
import { MatchResultComponent } from '../components/MatchResult';
import { OrderStatusBarSimple } from '../components/OrderStatusBarSimple';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ordersApi } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import type { SelectedIngredient, MatchResult, Order } from '../types';

export const Constructor: React.FC = () => {
  const { user, logout } = useAuth();
  const queryClient = useQueryClient();
  const [selectedIngredients, setSelectedIngredients] = useState<SelectedIngredient[]>([]);
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null);
  const [showAlternative, setShowAlternative] = useState(false);
  const [showOrderStatus, setShowOrderStatus] = useState(false);
  const [currentDishName, setCurrentDishName] = useState<string>('');

  // Получаем заказы пользователя
  const { data: userOrders, refetch: refetchOrders } = useQuery<Order[]>({
    queryKey: ['user-orders'],
    queryFn: () => ordersApi.getAll().then(res => res.data),
    enabled: !!user,
    refetchInterval: 5000, // Обновляем каждые 5 секунд
  });

  const createOrderMutation = useMutation({
    mutationFn: (dishId: number) =>
      ordersApi.create([dishId]).then(res => res.data),
    onSuccess: (data) => {
      console.log('Order created:', data);
      // Показываем визуализацию статусов заказа
      setShowOrderStatus(true);
      setSelectedIngredients([]);
      setMatchResult(null);
      setCurrentDishName(data.Dishes[0]?.Name || 'Блюдо');
      
      // Обновляем список заказов
      refetchOrders();
    },
    onError: (error) => {
      console.error('Error creating order:', error);
      alert('Ошибка при создании заказа. Попробуйте еще раз.');
    },
  });

  const handleMatchFound = (result: MatchResult) => {
    if (showAlternative && result.allMatches.length > 1) {
      const alternativeIndex = 1;
      setMatchResult({
        bestMatch: result.allMatches[alternativeIndex],
        allMatches: result.allMatches,
      });
    } else {
      setMatchResult(result);
    }
    setShowAlternative(false);
    
    // Автопрокрутка к результатам
    setTimeout(() => {
      const resultElement = document.getElementById('match-result');
      if (resultElement) {
        resultElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }
    }, 100);
  };

  const handleAcceptDish = (dish: any) => {
    createOrderMutation.mutate(dish.IDDishes);
  };

  const handleRequestAnother = () => {
    if (matchResult && matchResult.allMatches.length > 1) {
      const currentIndex = matchResult.allMatches.findIndex(
        m => m.dish.IDDishes === matchResult.bestMatch?.dish.IDDishes
      );
      const nextIndex = (currentIndex + 1) % matchResult.allMatches.length;
      
      setMatchResult({
        bestMatch: matchResult.allMatches[nextIndex],
        allMatches: matchResult.allMatches,
      });
    } else {
      setShowAlternative(true);
    }
  };

  const handleEditIngredients = () => {
    setMatchResult(null);
    setShowAlternative(false);
  };

  const handleConfirmExtraIngredients = (includeExtra: boolean) => {
    console.log('Extra ingredients confirmed:', includeExtra);
  };

  const handleOrderStatusClose = () => {
    setShowOrderStatus(false);
  };

  const handleLogout = () => {
    logout();
    queryClient.clear();
  };

  return (
    <div className="constructor-container" style={{
      minHeight: '100vh',
      background: 'var(--background)',
      padding: '24px 0'
    }}>
      <div className="container">
        {/* Header с информацией о пользователе и выходом */}
        <div className="constructor-header" style={{
          background: 'var(--surface)',
          borderRadius: 'var(--radius-lg)',
          padding: '16px 24px',
          marginBottom: '24px',
          boxShadow: 'var(--shadow-sm)',
          border: '1px solid var(--border-color)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <h2 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: 'var(--text-primary)',
                margin: '0 0 4px 0'
              }}>
                Конструктор блюд
              </h2>
              <p style={{
                fontSize: '14px',
                color: 'var(--text-secondary)',
                margin: 0
              }}>
                {user?.FIO} • {user?.Role?.Name || user?.role?.Name}
              </p>
            </div>
            <button
              onClick={handleLogout}
              style={{
                padding: '8px 16px',
                background: 'var(--primary-color)',
                color: 'white',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = 'var(--primary-hover)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'var(--primary-color)';
              }}
            >
              Выйти
            </button>
          </div>
        </div>

        {/* История заказов */}
        {userOrders && userOrders.length > 0 && (
          <div style={{
            background: 'var(--surface)',
            borderRadius: 'var(--radius-lg)',
            padding: '24px',
            marginBottom: '24px',
            boxShadow: 'var(--shadow-sm)',
            border: '1px solid var(--border-color)'
          }}>
            <h3 style={{
              fontSize: '16px',
              fontWeight: '600',
                color: 'var(--text-primary)',
                margin: '0 0 16px 0'
              }}>
              📋 Мои заказы
            </h3>
            <div style={{
              display: 'grid',
              gap: '12px'
            }}>
              {userOrders.slice(0, 3).map(order => (
                <div key={order.IDOrders} style={{
                  padding: '12px',
                  background: '#f8f9fa',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-color)',
                  fontSize: '14px'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '8px'
                  }}>
                    <span style={{ fontWeight: '600' }}>
                      Заказ #{order.IDOrders}
                    </span>
                    <span style={{
                      padding: '4px 8px',
                      background: getStatusColor(order.Status?.Name),
                      color: 'white',
                      borderRadius: '12px',
                      fontSize: '12px'
                    }}>
                      {order.Status?.Name}
                    </span>
                  </div>
                  <div style={{ color: 'var(--text-secondary)' }}>
                    {order.Dishes?.map(dish => dish.Name).join(', ')}
                  </div>
                  <div style={{ fontWeight: '600', marginTop: '4px' }}>
                    {order.Price} ₽
                  </div>
                </div>
              ))}
              {userOrders.length > 3 && (
                <div style={{
                  textAlign: 'center',
                  color: 'var(--text-secondary)',
                  fontSize: '12px'
                }}>
                  ... еще {userOrders.length - 3} заказов
                </div>
              )}
            </div>
          </div>
        )}

        <div className="constructor-content" style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '32px'
        }}>
          <div className="ingredients-section">
            <div className="section-card" style={{
              background: 'var(--surface)',
              borderRadius: 'var(--radius-lg)',
              padding: '32px',
              boxShadow: 'var(--shadow-sm)',
              border: '1px solid var(--border-color)'
            }}>
              <IngredientSelector
                selectedIngredients={selectedIngredients}
                onIngredientChange={setSelectedIngredients}
              />
            </div>
          </div>

          <div className="matching-section">
            <div className="section-card" style={{
              background: 'var(--surface)',
              borderRadius: 'var(--radius-lg)',
              padding: '32px',
              boxShadow: 'var(--shadow-sm)',
              border: '1px solid var(--border-color)'
            }}>
              <DishMatcher
                selectedIngredients={selectedIngredients}
                onMatchFound={handleMatchFound}
              />
            </div>
          </div>

          {matchResult && (
            <div className="result-section" id="match-result">
              <div className="section-card" style={{
                background: 'var(--surface)',
                borderRadius: 'var(--radius-lg)',
                padding: '32px',
                boxShadow: 'var(--shadow-md)',
                border: '1px solid var(--border-color)',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: 'linear-gradient(90deg, var(--primary-color), var(--accent-color))'
                }} />
                <MatchResultComponent
                  result={matchResult}
                  onAccept={handleAcceptDish}
                  onRequestAnother={handleRequestAnother}
                  onEditIngredients={handleEditIngredients}
                  onConfirmExtraIngredients={handleConfirmExtraIngredients}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Визуализация статусов заказа */}
      <OrderStatusBarSimple
        isVisible={showOrderStatus}
        onClose={handleOrderStatusClose}
        dishName={currentDishName}
      />
    </div>
  );
};

// Вспомогательная функция для цвета статуса
const getStatusColor = (statusName?: string) => {
  switch (statusName) {
    case 'Создан': return '#3b82f6';
    case 'В обработке': return '#f59e0b';
    case 'Готов': return '#10b981';
    case 'Выдан': return '#8b5cf6';
    default: return '#6c757d';
  }
};
