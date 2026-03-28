import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

export const Login: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    FIO: '',
    Phone: '',
    BirthDate: '',
    IDRoles: 1,
    IDJob_title: 1,
  });
  
  const { login, register, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', { isLogin, email: formData.email });
    
    try {
      if (isLogin) {
        console.log('Attempting login...');
        await login({ email: formData.email, password: formData.password });
        console.log('Login successful!');
      } else {
        console.log('Attempting register...');
        await register(formData);
        console.log('Register successful!');
      }
    } catch (error) {
      console.error('Auth error:', error);
      alert(`Ошибка авторизации: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="login-container" style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <div className="login-card" style={{
        maxWidth: '480px',
        width: '100%',
        background: 'var(--surface)',
        borderRadius: 'var(--radius-lg)',
        padding: '48px',
        boxShadow: 'var(--shadow-lg)',
        backdropFilter: 'blur(10px)'
      }}>
        <div className="login-header" style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div className="logo" style={{
            width: '80px',
            height: '80px',
            background: 'var(--primary-color)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
            fontSize: '36px',
            color: 'white',
            fontWeight: 'bold'
          }}>
            🍽️
          </div>
          <h2 style={{
            fontSize: '32px',
            fontWeight: '700',
            color: 'var(--text-primary)',
            marginBottom: '8px',
            margin: '0'
          }}>
            {isLogin ? 'Добро пожаловать!' : 'Создать аккаунт'}
          </h2>
          <p style={{
            fontSize: '16px',
            color: 'var(--text-secondary)',
            margin: '8px 0 0 0'
          }}>
            {isLogin ? 'Войдите в систему для продолжения' : 'Заполните данные для регистрации'}
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="form-group">
            <label htmlFor="email" style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: 'var(--text-primary)',
              marginBottom: '8px'
            }}>
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '16px',
                transition: 'all 0.2s ease',
                background: 'var(--surface)'
              }}
              placeholder="email@example.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: 'var(--text-primary)',
              marginBottom: '8px'
            }}>
              Пароль
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '16px',
                transition: 'all 0.2s ease',
                background: 'var(--surface)'
              }}
              placeholder="Пароль"
            />
          </div>

          {!isLogin && (
            <>
              <div className="form-group">
                <label htmlFor="FIO" style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: 'var(--text-primary)',
                  marginBottom: '8px'
                }}>
                  ФИО
                </label>
                <input
                  id="FIO"
                  name="FIO"
                  type="text"
                  required
                  value={formData.FIO}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '16px',
                    transition: 'all 0.2s ease',
                    background: 'var(--surface)'
                  }}
                  placeholder="Иванов Иван Иванович"
                />
              </div>

              <div className="form-group">
                <label htmlFor="Phone" style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: 'var(--text-primary)',
                  marginBottom: '8px'
                }}>
                  Телефон
                </label>
                <input
                  id="Phone"
                  name="Phone"
                  type="text"
                  required
                  value={formData.Phone}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '16px',
                    transition: 'all 0.2s ease',
                    background: 'var(--surface)'
                  }}
                  placeholder="+7 (999) 123-45-67"
                />
              </div>

              <div className="form-group">
                <label htmlFor="BirthDate" style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: 'var(--text-primary)',
                  marginBottom: '8px'
                }}>
                  Дата рождения
                </label>
                <input
                  id="BirthDate"
                  name="BirthDate"
                  type="date"
                  required
                  value={formData.BirthDate}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '16px',
                    transition: 'all 0.2s ease',
                    background: 'var(--surface)'
                  }}
                />
              </div>

              <div className="form-group">
                <label htmlFor="IDRoles" style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: 'var(--text-primary)',
                  marginBottom: '8px'
                }}>
                  Роль
                </label>
                <select
                  id="IDRoles"
                  name="IDRoles"
                  value={formData.IDRoles}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '16px',
                    transition: 'all 0.2s ease',
                    background: 'var(--surface)'
                  }}
                >
                  <option value={1}>CLIENT</option>
                  <option value={2}>EMPLOYEE</option>
                  <option value={3}>ADMIN</option>
                </select>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary"
            style={{
              width: '100%',
              padding: '16px 24px',
              fontSize: '16px',
              fontWeight: '600',
              marginTop: '8px'
            }}
          >
            {isLoading ? 'Загрузка...' : (isLogin ? 'Войти' : 'Зарегистрироваться')}
          </button>

          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--primary-color)',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                textDecoration: 'underline'
              }}
            >
              {isLogin ? 'Нет аккаунта? Зарегистрируйтесь' : 'Уже есть аккаунт? Войдите'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
