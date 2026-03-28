import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ordersApi } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { OrderStatusBarSimple } from '../components/OrderStatusBarSimple';
import type { Order } from '../types';

export const EmployeeDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Получаем все заказы
  const { data: orders, isLoading, refetch } = useQuery<Order[]>({
    queryKey: ['orders'],
    queryFn: () => ordersApi.getAllOrders().then(res => res.data),
    refetchInterval: 3000, // Обновляем каждые 3 секунды для реального времени
  });

  // Фильтруем заказы по статусу
  const filteredOrders = orders?.filter(order => {
    if (selectedStatus === 'all') return true;
    return order.Status?.Name === selectedStatus;
  }) || [];

  // Получаем уникальные статусы для фильтров
  const statuses = orders?.map(order => order.Status?.Name).filter(Boolean) as string[];

  const handleStatusChange = async (orderId: number, newStatusId: number) => {
    try {
      await ordersApi.updateOrderStatus(orderId, newStatusId);
      refetch();
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Загрузка заказов...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Панель сотрудника</h1>
              <p className="text-sm text-gray-600">Управление заказами</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {user?.FIO} • {user?.Role?.Name || user?.role?.Name}
              </span>
              <button
                onClick={logout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Выйти
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Фильтры */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedStatus('all')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedStatus === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Все заказы ({orders?.length || 0})
            </button>
            {statuses?.map(status => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedStatus === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {status} ({filteredOrders.filter(o => o.Status?.Name === status).length})
              </button>
            ))}
          </div>
        </div>

        {/* Список заказов */}
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <p className="text-gray-500">Нет заказов для отображения</p>
            </div>
          ) : (
            filteredOrders.map(order => (
              <div key={order.IDOrders} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Заказ #{order.IDOrders}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Клиент: {order.User?.FIO}
                      </p>
                      <p className="text-sm text-gray-600">
                        Телефон: {order.User?.Phone || 'Не указан'}
                      </p>
                      <p className="text-lg font-medium text-gray-900 mt-2">
                        Сумма: {order.Price} ₽
                      </p>
                    </div>
                    <div className="text-right">
                      <OrderStatusBarSimple currentStatus={order.Status?.Name || ''} />
                    </div>
                  </div>

                  {/* Блюда в заказе */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Блюда:</h4>
                    <div className="space-y-1">
                      {order.Dishes?.map(dish => (
                        <div key={dish.IDDishes} className="flex justify-between text-sm">
                          <span className="text-gray-600">{dish.Name}</span>
                          <span className="text-gray-900">{dish.Price} ₽</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Кнопки управления статусом */}
                  <div className="flex gap-2">
                    {order.Status?.Name === 'Создан' && (
                      <button
                        onClick={() => handleStatusChange(order.IDOrders, 2)} // В обработку
                        className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                      >
                        Принять в работу
                      </button>
                    )}
                    {order.Status?.Name === 'В обработке' && (
                      <button
                        onClick={() => handleStatusChange(order.IDOrders, 3)} // Готов
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Отметить готовым
                      </button>
                    )}
                    {order.Status?.Name === 'Готов' && (
                      <button
                        onClick={() => handleStatusChange(order.IDOrders, 4)} // Выдан
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Выдать клиенту
                      </button>
                    )}
                    <button
                      onClick={() => handleStatusChange(order.IDOrders, 5)} // Отменен
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Отменить
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};
