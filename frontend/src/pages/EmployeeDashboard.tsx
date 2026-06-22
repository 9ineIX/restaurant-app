import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ordersApi } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import type { Order } from '../types';

export const EmployeeDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Стили
  const headerStyle = {
    background: '#ffffff',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    borderBottom: '1px solid #e9ecef'
  };

  const cardStyle = {
    background: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    padding: '24px',
    marginBottom: '16px'
  };

  const filterButtonStyle = (isActive: boolean) => ({
    padding: '10px 16px',
    fontSize: '14px',
    fontWeight: 500,
    border: isActive ? 'none' : '1px solid #e9ecef',
    borderRadius: '8px',
    background: isActive ? '#ff6b35' : '#ffffff',
    color: isActive ? '#ffffff' : '#6c757d',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: isActive ? '0 2px 4px rgba(255, 107, 53, 0.2)' : '0 1px 3px rgba(0, 0, 0, 0.1)'
  });

  const actionButtonStyle = {
    padding: '10px 20px',
    fontSize: '14px',
    fontWeight: 500,
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  };

  // Получаем все заказы
  const { data: orders, isLoading, refetch } = useQuery<Order[]>({
    queryKey: ['orders'],
    queryFn: () => ordersApi.getAllOrders().then(res => res.data),
    refetchInterval: 3000,
  });

  // Фильтруем заказы по статусу
  const filteredOrders = orders?.filter(order => {
    if (selectedStatus === 'all') return true;
    return order.Status?.Name === selectedStatus;
  }) || [];

  // Получаем уникальные статусы для фильтров
  const statuses = Array.from(new Set(orders?.map(order => order.Status?.Name).filter(Boolean) as string[]));

  const handleStatusChange = async (orderId: number, newStatusId: number) => {
    try {
      await ordersApi.updateOrderStatus(orderId, newStatusId);
      refetch();
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Ошибка при обновлении статуса заказа');
    }
  };

  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f8f9fa'
      }}>
        <div style={{ fontSize: '20px', color: '#6c757d' }}>Загрузка заказов...</div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f8f9fa',
      paddingBottom: '32px'
    }}>
      {/* Header */}
      <header style={headerStyle}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '64px' }}>
            <div>
              <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#2c3e50', margin: 0 }}>
                Панель сотрудника
              </h1>
              <p style={{ fontSize: '14px', color: '#6c757d', margin: '4px 0 0 0' }}>
                Управление заказами
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span style={{ fontSize: '14px', color: '#6c757d' }}>
                {user?.FIO} • {user?.Role?.Name || user?.role?.Name}
              </span>
              <button
                onClick={logout}
                style={{
                  padding: '8px 16px',
                  background: '#dc2626',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                Выйти
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 24px' }}>
        {/* Фильтры */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            <button
              onClick={() => setSelectedStatus('all')}
              style={filterButtonStyle(selectedStatus === 'all')}
            >
              Все заказы ({orders?.length || 0})
            </button>
            {statuses?.map(status => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                style={filterButtonStyle(selectedStatus === status)}
              >
                {status} ({filteredOrders.filter(o => o.Status?.Name === status).length})
              </button>
            ))}
          </div>
        </div>

        {/* Список заказов */}
        {filteredOrders.length === 0 ? (
          <div style={cardStyle}>
            <p style={{ textAlign: 'center', color: '#6c757d', fontSize: '16px' }}>
              Нет заказов для отображения
            </p>
          </div>
        ) : (
          filteredOrders.map(order => (
            <div key={order.IDOrders} style={cardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#2c3e50', marginBottom: '8px' }}>
                    Заказ #{order.IDOrders}
                  </h3>
                  <p style={{ fontSize: '14px', color: '#6c757d', marginBottom: '4px' }}>
                    Клиент: {order.User?.FIO}
                  </p>
                  <p style={{ fontSize: '14px', color: '#6c757d', marginBottom: '8px' }}>
                    Телефон: {order.User?.Phone || 'Не указан'}
                  </p>
                  <p style={{ fontSize: '18px', fontWeight: 500, color: '#2c3e50', marginTop: '8px' }}>
                    Сумма: {order.Price} ₽
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '999px',
                    fontSize: '12px',
                    fontWeight: 500,
                    ...(order.Status?.Name === 'Готов' ? { background: '#dcfce7', color: '#166534' } :
                        order.Status?.Name === 'В обработке' ? { background: '#fef9c3', color: '#854d0e' } :
                        order.Status?.Name === 'Создан' ? { background: '#dbeafe', color: '#1e40af' } :
                        order.Status?.Name === 'Отменен' ? { background: '#fee2e2', color: '#991b1b' } :
                        { background: '#f3f4f6', color: '#374151' })
                  }}>
                    {order.Status?.Name}
                  </span>
                </div>
              </div>

              {/* Блюда в заказе */}
              <div style={{ marginBottom: '16px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: 500, color: '#2c3e50', marginBottom: '8px' }}>
                  Блюда:
                </h4>
                <div>
                  {order.Dishes?.map(dish => (
                    <div key={dish.IDDishes} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '4px' }}>
                      <span style={{ color: '#6c757d' }}>{dish.Name}</span>
                      <span style={{ color: '#2c3e50', fontWeight: 500 }}>{dish.Price} ₽</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Кнопки управления статусом */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {order.Status?.Name === 'Создан' && (
                  <button
                    onClick={() => handleStatusChange(order.IDOrders, 2)}
                    style={{ ...actionButtonStyle, background: '#f59e0b', color: 'white' }}
                  >
                    Принять в работу
                  </button>
                )}
                {order.Status?.Name === 'В обработке' && (
                  <button
                    onClick={() => handleStatusChange(order.IDOrders, 3)}
                    style={{ ...actionButtonStyle, background: '#10b981', color: 'white' }}
                  >
                    Отметить готовым
                  </button>
                )}
                {order.Status?.Name === 'Готов' && (
                  <button
                    onClick={() => handleStatusChange(order.IDOrders, 4)}
                    style={{ ...actionButtonStyle, background: '#3b82f6', color: 'white' }}
                  >
                    Выдать клиенту
                  </button>
                )}
                {order.Status?.Name !== 'Отменен' && order.Status?.Name !== 'Выдан' && (
                  <button
                    onClick={() => handleStatusChange(order.IDOrders, 5)}
                    style={{ ...actionButtonStyle, background: '#dc2626', color: 'white' }}
                  >
                    Отменить
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </main>
    </div>
  );
};
