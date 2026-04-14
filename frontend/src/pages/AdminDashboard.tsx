import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi, dishesApi, ingredientsApi, ordersApi } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { UserForm } from '../components/UserForm';
import { IngredientForm } from '../components/IngredientForm';
import { DishForm } from '../components/DishForm';
import type { User, Dish, Ingredient, Order } from '../types';

type TabType = 'users' | 'dishes' | 'ingredients' | 'orders';

export const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('users');
  const [showUserForm, setShowUserForm] = useState(false);
  const [showIngredientForm, setShowIngredientForm] = useState(false);
  const [showDishForm, setShowDishForm] = useState(false);
  const queryClient = useQueryClient();

  // Запросы данных
  const { data: users } = useQuery<User[]>({
    queryKey: ['users'],
    queryFn: () => usersApi.getAll().then(res => res.data),
  });

  const { data: dishes } = useQuery<Dish[]>({
    queryKey: ['dishes'],
    queryFn: () => dishesApi.getAll().then(res => res.data),
  });

  const { data: ingredients } = useQuery<Ingredient[]>({
    queryKey: ['ingredients'],
    queryFn: () => ingredientsApi.getAll().then(res => res.data),
  });

  const { data: orders, isLoading, refetch } = useQuery<Order[]>({
    queryKey: ['all-orders'],
    queryFn: () => ordersApi.getAllOrders().then(res => res.data),
    refetchInterval: 3000, 
  });

  // Мутации для CRUD операций
  const createUserMutation = useMutation({
    mutationFn: (userData: any) => usersApi.create(userData),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });

  const updateUserMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => usersApi.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });

  const deleteUserMutation = useMutation({
    mutationFn: (id: number) => usersApi.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });

  const createDishMutation = useMutation({
    mutationFn: (dishData: any) => {
      console.log('Creating dish:', dishData);
      return dishesApi.create(dishData);
    },
    onSuccess: (data) => {
      console.log('Dish created successfully:', data);
      queryClient.invalidateQueries({ queryKey: ['dishes'] });
    },
    onError: (error) => {
      console.error('Error creating dish:', error);
    }
  });

  const updateDishMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => dishesApi.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['dishes'] }),
  });

  const deleteDishMutation = useMutation({
    mutationFn: (id: number) => dishesApi.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['dishes'] }),
  });

  const createIngredientMutation = useMutation({
    mutationFn: (ingredientData: any) => {
      console.log('Creating ingredient:', ingredientData);
      return ingredientsApi.create(ingredientData);
    },
    onSuccess: (data) => {
      console.log('Ingredient created successfully:', data);
      queryClient.invalidateQueries({ queryKey: ['ingredients'] });
    },
    onError: (error) => {
      console.error('Error creating ingredient:', error);
    }
  });

  const updateIngredientMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => ingredientsApi.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['ingredients'] }),
  });

  const deleteIngredientMutation = useMutation({
    mutationFn: (id: number) => ingredientsApi.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['ingredients'] }),
  });

  const updateOrderMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => ordersApi.updateStatus(id, data.statusId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['all-orders'] }),
  });

  const deleteOrderMutation = useMutation({
    mutationFn: (id: number) => ordersApi.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['all-orders'] }),
  });

  const renderUsersTab = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Пользователи</h2>
        <button
          onClick={() => setShowUserForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Добавить пользователя
        </button>
      </div>
      
      {showUserForm && (
        <UserForm
          onSubmit={(userData) => {
            createUserMutation.mutate(userData);
            setShowUserForm(false);
          }}
          onCancel={() => setShowUserForm(false)}
        />
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ФИО
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Роль
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Действия
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users?.map(user => (
              <tr key={user.IDUsers}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {user.IDUsers}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {user.FIO}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {user.Email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {user.Role?.Name || user.role?.Name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => {
                      const currentRole = user.Role?.Name || user.role?.Name || '';
                      const newRole = prompt('Новая роль:', currentRole);
                      if (newRole) {
                        updateUserMutation.mutate({ id: user.IDUsers, data: { role: newRole } });
                      }
                    }}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    Изменить
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Удалить пользователя?')) {
                        deleteUserMutation.mutate(user.IDUsers);
                      }
                    }}
                    className="text-red-600 hover:text-red-900"
                  >
                    Удалить
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderDishesTab = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Блюда</h2>
        <button
          onClick={() => setShowDishForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Добавить блюдо
        </button>
      </div>
      
      {showDishForm && (
        <DishForm
          onSubmit={(dishData) => {
            createDishMutation.mutate(dishData);
            setShowDishForm(false);
          }}
          onCancel={() => setShowDishForm(false)}
        />
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Название
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Цена
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Описание
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Действия
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {dishes?.map(dish => (
              <tr key={dish.IDDishes}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {dish.IDDishes}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {dish.Name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {dish.Price} ₽
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {dish.Description}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => {
                      const newPrice = prompt('Новая цена:', dish.Price.toString());
                      if (newPrice) {
                        updateDishMutation.mutate({ 
                          id: dish.IDDishes, 
                          data: { Price: parseFloat(newPrice) } 
                        });
                      }
                    }}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    Изменить
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Удалить блюдо?')) {
                        deleteDishMutation.mutate(dish.IDDishes);
                      }
                    }}
                    className="text-red-600 hover:text-red-900"
                  >
                    Удалить
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderIngredientsTab = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Ингредиенты</h2>
        <button
          onClick={() => setShowIngredientForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Добавить ингредиент
        </button>
      </div>
      
      {showIngredientForm && (
        <IngredientForm
          onSubmit={(ingredientData) => {
            createIngredientMutation.mutate(ingredientData);
            setShowIngredientForm(false);
          }}
          onCancel={() => setShowIngredientForm(false)}
        />
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Название
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Цена
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Категория
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Действия
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {ingredients?.map(ingredient => (
              <tr key={ingredient.IDIngredients}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {ingredient.IDIngredients}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {ingredient.Name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {ingredient.Price} ₽
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {ingredient.Category?.Name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => {
                      const newPrice = prompt('Новая цена:', ingredient.Price.toString());
                      if (newPrice) {
                        updateIngredientMutation.mutate({ 
                          id: ingredient.IDIngredients, 
                          data: { Price: parseFloat(newPrice) } 
                        });
                      }
                    }}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    Изменить
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Удалить ингредиент?')) {
                        deleteIngredientMutation.mutate(ingredient.IDIngredients);
                      }
                    }}
                    className="text-red-600 hover:text-red-900"
                  >
                    Удалить
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderOrdersTab = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Заказы</h2>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Обновить
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Клиент
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Блюда
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Сумма
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Статус
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Действия
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders?.map(order => (
              <tr key={order.IDOrders}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  #{order.IDOrders}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {order.User?.FIO}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {order.Dishes?.map(dish => dish.Name).join(', ')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {order.Price} ₽
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    order.Status?.Name === 'Готов' ? 'bg-green-100 text-green-800' :
                    order.Status?.Name === 'В обработке' ? 'bg-yellow-100 text-yellow-800' :
                    order.Status?.Name === 'Создан' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {order.Status?.Name}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => {
                      const newStatus = prompt('Новый статус:', order.Status?.Name);
                      if (newStatus) {
                        const statusMap: { [key: string]: number } = {
                          'Создан': 1,
                          'В обработке': 2,
                          'Готов': 3,
                          'Выдан': 4
                        };
                        const statusId = statusMap[newStatus] || 1;
                        updateOrderMutation.mutate({ id: order.IDOrders, data: { statusId } });
                      }
                    }}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    Изменить
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Удалить заказ?')) {
                        deleteOrderMutation.mutate(order.IDOrders);
                      }
                    }}
                    className="text-red-600 hover:text-red-900"
                  >
                    Удалить
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Панель администратора</h1>
              <p className="text-sm text-gray-600">Управление системой</p>
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
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'users', label: 'Пользователи' },
              { id: 'dishes', label: 'Блюда' },
              { id: 'ingredients', label: 'Ингредиенты' },
              { id: 'orders', label: 'Заказы' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'users' && renderUsersTab()}
        {activeTab === 'dishes' && renderDishesTab()}
        {activeTab === 'ingredients' && renderIngredientsTab()}
        {activeTab === 'orders' && renderOrdersTab()}
      </main>
    </div>
  );
};
