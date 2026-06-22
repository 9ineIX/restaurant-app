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
  const [editRoleModal, setEditRoleModal] = useState<{ open: boolean; userId: number; currentRole: string; roleId: number; email: string; password: string; fio: string; phone: string; birthDate: string }>({ open: false, userId: 0, currentRole: '', roleId: 1, email: '', password: '', fio: '', phone: '', birthDate: '' });
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

  const { data: orders, refetch, isLoading: ordersLoading, error: ordersError } = useQuery<Order[]>({
    queryKey: ['all-orders'],
    queryFn: () => {
      console.log('Fetching all orders...');
      return ordersApi.getAllOrders().then(res => {
        console.log('Orders fetched:', res.data);
        return res.data;
      }).catch(err => {
        console.error('Error fetching orders:', err);
        throw err;
      });
    },
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

  // Состояния для модальных окон редактирования
  const [editDishModal, setEditDishModal] = useState<{ open: boolean; dish?: Dish; price: string; name: string; description: string }>({ open: false, price: '', name: '', description: '' });
  const [editIngredientModal, setEditIngredientModal] = useState<{ open: boolean; ingredient?: Ingredient; price: string; name: string }>({ open: false, price: '', name: '' });

  // Стили (должны быть ДО использования)
  const headerStyle = {
    background: '#ffffff',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    borderBottom: '1px solid #e9ecef'
  };

  const cardStyle = {
    background: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden'
  };

  const tabButtonStyle = (isActive: boolean) => ({
    padding: '12px 16px',
    fontSize: '14px',
    fontWeight: 500,
    border: 'none',
    borderBottom: `2px solid ${isActive ? '#ff6b35' : 'transparent'}`,
    color: isActive ? '#ff6b35' : '#6c757d',
    background: 'transparent',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  });

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse' as const,
    background: '#ffffff',
    borderRadius: '12px',
    overflow: 'hidden',
    borderSpacing: '0'
  };

  const tableHeaderStyle = {
    background: '#f8f9fa',
    padding: '14px 16px',
    textAlign: 'left' as const,
    fontSize: '13px',
    fontWeight: 600,
    color: '#495057',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
    borderBottom: '2px solid #dee2e6',
    borderRight: '1px solid #dee2e6'
  };

  const tableCellStyle = {
    padding: '14px 16px',
    fontSize: '14px',
    color: '#212529',
    borderBottom: '1px solid #dee2e6',
    borderRight: '1px solid #dee2e6',
    background: '#ffffff'
  };

  const actionButtonStyle = (color: string) => ({
    color: color,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 500,
    marginRight: '16px'
  });

  const addButtonStyle = {
    padding: '10px 20px',
    background: '#ff6b35',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  };

  const renderUsersTab = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#2c3e50' }}>Пользователи</h2>
        <button
          onClick={() => setShowUserForm(true)}
          style={addButtonStyle}
        >
          Добавить пользователя
        </button>
      </div>
      
      {showUserForm && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50,
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(4px)'
          }}
          onClick={() => setShowUserForm(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '480px',
              width: '100%',
              background: '#ffffff',
              borderRadius: '16px',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
              margin: '20px'
            }}
          >
            <UserForm
              onSubmit={(userData) => {
                createUserMutation.mutate(userData);
                setShowUserForm(false);
              }}
              onCancel={() => setShowUserForm(false)}
            />
          </div>
        </div>
      )}

      <div style={cardStyle}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={tableHeaderStyle}>ID</th>
              <th style={tableHeaderStyle}>ФИО</th>
              <th style={tableHeaderStyle}>Email</th>
              <th style={tableHeaderStyle}>Роль</th>
              <th style={tableHeaderStyle}>Действия</th>
            </tr>
          </thead>
          <tbody>
            {users?.map(user => (
              <tr key={user.IDUsers}>
                <td style={tableCellStyle}>{user.IDUsers}</td>
                <td style={tableCellStyle}>{user.FIO}</td>
                <td style={tableCellStyle}>{user.Email}</td>
                <td style={tableCellStyle}>{user.Role?.Name || user.role?.Name}</td>
                <td style={tableCellStyle}>
                  <button
                    onClick={() => {
                      const currentRole = user.Role?.Name || user.role?.Name || '';
                      const roleId = user.Role?.IDRoles || user.role?.IDRoles || 1;
                      setEditRoleModal({ 
                        open: true, 
                        userId: user.IDUsers, 
                        currentRole, 
                        roleId,
                        email: user.Email || '',
                        password: '',
                        fio: user.FIO || '',
                        phone: user.Phone || '',
                        birthDate: user.BirthDate || ''
                      });
                    }}
                    style={actionButtonStyle('#4f46e5')}
                  >
                    Изменить
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Удалить пользователя?')) {
                        deleteUserMutation.mutate(user.IDUsers);
                      }
                    }}
                    style={actionButtonStyle('#dc2626')}
                  >
                    Удалить
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editRoleModal.open && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50,
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(4px)'
          }}
          onClick={() => setEditRoleModal({ open: false, userId: 0, currentRole: '', roleId: 1, email: '', password: '', fio: '', phone: '', birthDate: '' })}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '400px',
              width: '100%',
              background: '#ffffff',
              borderRadius: '16px',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
              margin: '20px',
              padding: '32px'
            }}
          >
            <h3 style={{
              fontSize: '24px',
              fontWeight: 700,
              color: '#2c3e50',
              marginBottom: '24px',
              textAlign: 'center'
            }}>Изменить пользователя</h3>

            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: 500,
                color: '#2c3e50',
                marginBottom: '8px'
              }}>Email</label>
              <input
                type="email"
                value={editRoleModal.email}
                onChange={(e) => setEditRoleModal({ ...editRoleModal, email: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #e9ecef',
                  borderRadius: '8px',
                  fontSize: '16px',
                  background: '#ffffff'
                }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: 500,
                color: '#2c3e50',
                marginBottom: '8px'
              }}>Новый пароль (оставьте пустым, чтобы не менять)</label>
              <input
                type="password"
                value={editRoleModal.password}
                onChange={(e) => setEditRoleModal({ ...editRoleModal, password: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #e9ecef',
                  borderRadius: '8px',
                  fontSize: '16px',
                  background: '#ffffff'
                }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: 500,
                color: '#2c3e50',
                marginBottom: '8px'
              }}>ФИО</label>
              <input
                type="text"
                value={editRoleModal.fio}
                onChange={(e) => setEditRoleModal({ ...editRoleModal, fio: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #e9ecef',
                  borderRadius: '8px',
                  fontSize: '16px',
                  background: '#ffffff'
                }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: 500,
                color: '#2c3e50',
                marginBottom: '8px'
              }}>Телефон</label>
              <input
                type="text"
                value={editRoleModal.phone}
                onChange={(e) => setEditRoleModal({ ...editRoleModal, phone: e.target.value.replace(/[^+\d]/g, '') })}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #e9ecef',
                  borderRadius: '8px',
                  fontSize: '16px',
                  background: '#ffffff'
                }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: 500,
                color: '#2c3e50',
                marginBottom: '8px'
              }}>Дата рождения</label>
              <input
                type="date"
                value={editRoleModal.birthDate}
                onChange={(e) => setEditRoleModal({ ...editRoleModal, birthDate: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #e9ecef',
                  borderRadius: '8px',
                  fontSize: '16px',
                  background: '#ffffff'
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: 500,
                color: '#2c3e50',
                marginBottom: '8px'
              }}>Текущая роль: {editRoleModal.currentRole}</label>

              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: 500,
                color: '#2c3e50',
                marginBottom: '8px'
              }}>Новая роль:</label>

              <select
                value={editRoleModal.roleId}
                onChange={(e) => setEditRoleModal({ ...editRoleModal, roleId: parseInt(e.target.value) })}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #e9ecef',
                  borderRadius: '8px',
                  fontSize: '16px',
                  background: '#ffffff'
                }}
              >
                <option value={1}>Клиент</option>
                <option value={2}>Сотрудник</option>
                <option value={3}>Администратор</option>
              </select>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button
                onClick={() => setEditRoleModal({ open: false, userId: 0, currentRole: '', roleId: 1, email: '', password: '', fio: '', phone: '', birthDate: '' })}
                style={{
                  padding: '12px 24px',
                  border: '1px solid #e9ecef',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: 500,
                  color: '#6c757d',
                  background: 'transparent',
                  cursor: 'pointer'
                }}
              >
                Отмена
              </button>
              <button
                onClick={() => {
                  const updateData: any = { IDRoles: editRoleModal.roleId };
                  if (editRoleModal.email) updateData.Email = editRoleModal.email;
                  if (editRoleModal.password) updateData.Password = editRoleModal.password;
                  if (editRoleModal.fio) updateData.FIO = editRoleModal.fio;
                  if (editRoleModal.phone) updateData.Phone = editRoleModal.phone;
                  if (editRoleModal.birthDate) updateData.BirthDate = new Date(editRoleModal.birthDate);
                  
                  updateUserMutation.mutate({
                    id: editRoleModal.userId,
                    data: updateData
                  });
                  setEditRoleModal({ open: false, userId: 0, currentRole: '', roleId: 1, email: '', password: '', fio: '', phone: '', birthDate: '' });
                }}
                style={{
                  padding: '12px 24px',
                  background: '#ff6b35',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: 500,
                  cursor: 'pointer'
                }}
              >
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderDishesTab = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#2c3e50' }}>Блюда</h2>
        <button
          onClick={() => setShowDishForm(true)}
          style={addButtonStyle}
        >
          Добавить блюдо
        </button>
      </div>
      
      {showDishForm && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(4px)'
          }}
          onClick={() => setShowDishForm(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '480px',
              width: '100%',
              background: '#ffffff',
              borderRadius: '16px',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
              margin: '20px'
            }}
          >
            <DishForm
              onSubmit={(dishData) => {
                createDishMutation.mutate(dishData);
                setShowDishForm(false);
              }}
              onCancel={() => setShowDishForm(false)}
            />
          </div>
        </div>
      )}

      <div className="admin-table-container">
  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
    <thead>
      <tr>
        <th className="admin-table-header">ID</th>
        <th className="admin-table-header">Название</th>
        <th className="admin-table-header">Цена</th>
        <th className="admin-table-header">Описание</th>
        <th className="admin-table-header">Действия</th>
      </tr>
    </thead>
    <tbody>
      {dishes?.map(dish => (
        <tr key={dish.IDDishes}>
          <td className="admin-table-cell">{dish.IDDishes}</td>
          <td className="admin-table-cell">{dish.Name}</td>
          <td className="admin-table-cell">{dish.Price} ₽</td>
          <td className="admin-table-cell">{dish.Description}</td>
          <td className="admin-table-cell">
            <button
              onClick={() => setEditDishModal({ open: true, dish, price: dish.Price.toString(), name: dish.Name, description: dish.Description || '' })}
              style={actionButtonStyle('#4f46e5')}
            >
              Изменить
            </button>
            <button
              onClick={() => {
                if (confirm('Удалить блюдо?')) {
                  deleteDishMutation.mutate(dish.IDDishes);
                }
              }}
              style={actionButtonStyle('#dc2626')}
            >
              Удалить
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

      {/* Модальное окно редактирования цены блюда */}
      {editDishModal.open && editDishModal.dish && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50,
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(4px)'
          }}
        >
          <div style={{
            maxWidth: '400px',
            width: '100%',
            background: '#ffffff',
            borderRadius: '16px',
            padding: '32px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
            margin: '20px'
          }}>
            <h3 style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#2c3e50',
              marginBottom: '8px',
              textAlign: 'center'
            }}>Изменить блюдо</h3>

            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#2c3e50', marginBottom: '8px' }}>
              Название
            </label>
            <input
              type="text"
              value={editDishModal.name}
              onChange={(e) => setEditDishModal({ ...editDishModal, name: e.target.value })}
              style={{ width: '100%', padding: '12px 16px', border: '1px solid #e9ecef', borderRadius: '8px', fontSize: '16px', marginBottom: '20px' }}
              placeholder="Название блюда"
            />

            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#2c3e50', marginBottom: '8px' }}>
              Описание
            </label>
            <textarea
              value={editDishModal.description}
              onChange={(e) => setEditDishModal({ ...editDishModal, description: e.target.value })}
              style={{ width: '100%', padding: '12px 16px', border: '1px solid #e9ecef', borderRadius: '8px', fontSize: '16px', marginBottom: '20px', minHeight: '80px' }}
              placeholder="Описание блюда"
            />

            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#2c3e50', marginBottom: '8px' }}>
              Цена (₽)
            </label>
            <input
              type="number"
              step="0.01"
              value={editDishModal.price}
              onChange={(e) => setEditDishModal({ ...editDishModal, price: e.target.value })}
              style={{ width: '100%', padding: '12px 16px', border: '1px solid #e9ecef', borderRadius: '8px', fontSize: '16px', marginBottom: '20px' }}
              placeholder="0.00"
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button
                onClick={() => setEditDishModal({ open: false, price: '', name: '', description: '' })}
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
                onClick={() => {
                  if (editDishModal.price) {
                    updateDishMutation.mutate({
                      id: editDishModal.dish!.IDDishes,
                      data: { 
                        Price: parseFloat(editDishModal.price),
                        Name: editDishModal.name,
                        Description: editDishModal.description
                      }
                    });
                    setEditDishModal({ open: false, price: '', name: '', description: '' });
                  }
                }}
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
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderIngredientsTab = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#2c3e50' }}>Ингредиенты</h2>
        <button
          onClick={() => setShowIngredientForm(true)}
          style={addButtonStyle}
        >
          Добавить ингредиент
        </button>
      </div>
      
      {showIngredientForm && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(4px)'
          }}
          onClick={() => setShowIngredientForm(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '480px',
              width: '100%',
              background: '#ffffff',
              borderRadius: '16px',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
              margin: '20px'
            }}
          >
            <IngredientForm
              onSubmit={(ingredientData) => {
                createIngredientMutation.mutate(ingredientData);
                setShowIngredientForm(false);
              }}
              onCancel={() => setShowIngredientForm(false)}
            />
          </div>
        </div>
      )}

      <div style={cardStyle}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={tableHeaderStyle}>ID</th>
              <th style={tableHeaderStyle}>Название</th>
              <th style={tableHeaderStyle}>Цена</th>
              <th style={tableHeaderStyle}>Категория</th>
              <th style={tableHeaderStyle}>Действия</th>
            </tr>
          </thead>
          <tbody>
            {ingredients?.map(ingredient => (
              <tr key={ingredient.IDIngredients}>
                <td style={tableCellStyle}>{ingredient.IDIngredients}</td>
                <td style={tableCellStyle}>{ingredient.Name}</td>
                <td style={tableCellStyle}>{ingredient.Price} ₽</td>
                <td style={tableCellStyle}>{ingredient.Category?.Name}</td>
                <td style={tableCellStyle}>
                  <button
                    onClick={() => setEditIngredientModal({ open: true, ingredient, price: ingredient.Price.toString(), name: ingredient.Name })}
                    style={actionButtonStyle('#4f46e5')}
                  >
                    Изменить
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Удалить ингредиент?')) {
                        deleteIngredientMutation.mutate(ingredient.IDIngredients);
                      }
                    }}
                    style={actionButtonStyle('#dc2626')}
                  >
                    Удалить
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Модальное окно редактирования цены ингредиента */}
      {editIngredientModal.open && editIngredientModal.ingredient && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50,
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(4px)'
          }}
        >
          <div style={{
            maxWidth: '400px',
            width: '100%',
            background: '#ffffff',
            borderRadius: '16px',
            padding: '32px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
            margin: '20px'
          }}>
            <h3 style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#2c3e50',
              marginBottom: '8px',
              textAlign: 'center'
            }}>Изменить ингредиент</h3>

            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#2c3e50', marginBottom: '8px' }}>
              Название
            </label>
            <input
              type="text"
              value={editIngredientModal.name}
              onChange={(e) => setEditIngredientModal({ ...editIngredientModal, name: e.target.value })}
              style={{ width: '100%', padding: '12px 16px', border: '1px solid #e9ecef', borderRadius: '8px', fontSize: '16px', marginBottom: '20px' }}
              placeholder="Название ингредиента"
            />

            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#2c3e50', marginBottom: '8px' }}>
              Цена (₽)
            </label>
            <input
              type="number"
              step="0.01"
              value={editIngredientModal.price}
              onChange={(e) => setEditIngredientModal({ ...editIngredientModal, price: e.target.value })}
              style={{ width: '100%', padding: '12px 16px', border: '1px solid #e9ecef', borderRadius: '8px', fontSize: '16px', marginBottom: '20px' }}
              placeholder="0.00"
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button
                onClick={() => setEditIngredientModal({ open: false, price: '', name: '' })}
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
                onClick={() => {
                  if (editIngredientModal.price) {
                    updateIngredientMutation.mutate({
                      id: editIngredientModal.ingredient!.IDIngredients,
                      data: { 
                        Price: parseFloat(editIngredientModal.price),
                        Name: editIngredientModal.name
                      }
                    });
                    setEditIngredientModal({ open: false, price: '', name: '' });
                  }
                }}
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
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderOrdersTab = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#2c3e50' }}>Заказы</h2>
        <button
          onClick={() => refetch()}
          style={addButtonStyle}
        >
          Обновить
        </button>
      </div>
      
      {ordersError && (
        <div style={{
          background: '#fee2e2',
          color: '#991b1b',
          padding: '16px',
          borderRadius: '8px',
          marginBottom: '16px'
        }}>
          Ошибка загрузки заказов: {ordersError instanceof Error ? ordersError.message : 'Неизвестная ошибка'}
        </div>
      )}
      
      {ordersLoading ? (
        <div style={cardStyle}>
          <p style={{ padding: '24px', textAlign: 'center', color: '#6c757d' }}>
            Загрузка заказов...
          </p>
        </div>
      ) : !orders || orders.length === 0 ? (
        <div style={cardStyle}>
          <p style={{ padding: '24px', textAlign: 'center', color: '#6c757d' }}>
            Нет заказов для отображения
          </p>
        </div>
      ) : (
      <div style={cardStyle}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={tableHeaderStyle}>ID</th>
              <th style={tableHeaderStyle}>Клиент</th>
              <th style={tableHeaderStyle}>Блюда</th>
              <th style={tableHeaderStyle}>Сумма</th>
              <th style={tableHeaderStyle}>Статус</th>
              <th style={tableHeaderStyle}>Действия</th>
            </tr>
          </thead>
          <tbody>
            {orders?.map(order => (
              <tr key={order.IDOrders}>
                <td style={tableCellStyle}>#{order.IDOrders}</td>
                <td style={tableCellStyle}>{order.User?.FIO}</td>
                <td style={tableCellStyle}>{order.Dishes?.map(dish => dish.Name).join(', ')}</td>
                <td style={tableCellStyle}>{order.Price} ₽</td>
                <td style={tableCellStyle}>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '999px',
                    fontSize: '12px',
                    fontWeight: 500,
                    ...(order.Status?.Name === 'Готов' ? { background: '#dcfce7', color: '#166534' } :
                        order.Status?.Name === 'В обработке' ? { background: '#fef9c3', color: '#854d0e' } :
                        order.Status?.Name === 'Создан' ? { background: '#dbeafe', color: '#1e40af' } :
                        { background: '#f3f4f6', color: '#374151' })
                  }}>
                    {order.Status?.Name}
                  </span>
                </td>
                <td style={tableCellStyle}>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {order.Status?.Name === 'Создан' && (
                      <button
                        onClick={() => updateOrderMutation.mutate({ id: order.IDOrders, data: { statusId: 2 } })}
                        style={{ ...actionButtonStyle('#f59e0b'), color: 'white', background: '#f59e0b' }}
                      >
                        В работу
                      </button>
                    )}
                    {order.Status?.Name === 'В обработке' && (
                      <button
                        onClick={() => updateOrderMutation.mutate({ id: order.IDOrders, data: { statusId: 3 } })}
                        style={{ ...actionButtonStyle('#10b981'), color: 'white', background: '#10b981' }}
                      >
                        Готов
                      </button>
                    )}
                    {order.Status?.Name === 'Готов' && (
                      <button
                        onClick={() => updateOrderMutation.mutate({ id: order.IDOrders, data: { statusId: 4 } })}
                        style={{ ...actionButtonStyle('#3b82f6'), color: 'white', background: '#3b82f6' }}
                      >
                        Выдан
                      </button>
                    )}
                    <button
                      onClick={() => {
                        if (confirm('Удалить заказ?')) {
                          deleteOrderMutation.mutate(order.IDOrders);
                        }
                      }}
                      style={actionButtonStyle('#dc2626')}
                    >
                      Удалить
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      )}
    </div>
  );

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
                Панель администратора
              </h1>
              <p style={{ fontSize: '14px', color: '#6c757d', margin: '4px 0 0 0' }}>
                Управление системой
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
        {/* Tabs */}
        <div style={{ 
          background: '#ffffff', 
          borderRadius: '16px', 
          padding: '0 16px',
          marginBottom: '24px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <nav style={{ display: 'flex', gap: '8px' }}>
            {[
              { id: 'users', label: 'Пользователи' },
              { id: 'dishes', label: 'Блюда' },
              { id: 'ingredients', label: 'Ингредиенты' },
              { id: 'orders', label: 'Заказы' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                style={tabButtonStyle(activeTab === tab.id)}
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
