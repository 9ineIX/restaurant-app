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
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  
  const { login, register, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    // Отправляем поля с правильными именами для backend
    const submitData = {
      FIO: formData.FIO,
      Email: formData.email, // Отправляем Email с большой буквы
      Password: formData.password, // Отправляем Password с большой буквы
      Phone: formData.Phone,
      BirthDate: formData.BirthDate,
    };
    
    console.log('Form submitted:', { isLogin, email: formData.email, submitData });
    
    try {
      if (isLogin) {
        console.log('Attempting login...');
        await login({ email: formData.email, password: formData.password });
        console.log('Login successful!');
      } else {
        console.log('Attempting register...', submitData);
        await register(submitData);
        console.log('Register successful!');
        setSuccessMessage('Регистрация прошла успешно! Теперь вы можете войти.');
        setErrorMessage('');
        // Переключаемся на форму входа после успешной регистрации
        setTimeout(() => {
          setIsLogin(true);
          // Очищаем поля формы
          setFormData({
            email: submitData.Email,
            password: '',
            FIO: '',
            Phone: '',
            BirthDate: '',
          });
          setErrors({});
        }, 2000);
      }
    } catch (error) {
      console.error('Auth error:', error);
      setErrorMessage(`Ошибка авторизации: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`);
      setSuccessMessage('');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log('Field changed:', { name, value });
    
    // Phone validation: only allow + and digits
    if (name === 'Phone') {
      const phoneValue = value.replace(/[^+\d]/g, '');
      setFormData(prev => ({
        ...prev,
        [name]: phoneValue,
      }));
      
      // Clear error when user starts typing
      if (errors.Phone) {
        setErrors(prev => ({ ...prev, Phone: '' }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!isLogin) {
      if (!formData.FIO.trim()) {
        newErrors.FIO = 'ФИО обязательно';
      }
      if (!formData.Phone.trim()) {
        newErrors.Phone = 'Телефон обязателен';
      } else if (!/^\+\d{10,15}$/.test(formData.Phone)) {
        newErrors.Phone = 'Телефон должен начинаться с + и содержать 10-15 цифр';
      }
      if (!formData.BirthDate) {
        newErrors.BirthDate = 'Дата рождения обязательна';
      }
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email обязателен';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Некорректный email';
    }
    
    if (!formData.password) {
      newErrors.password = 'Пароль обязателен';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Пароль должен содержать минимум 6 символов';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <>
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

        {/* Success notification */}
        {successMessage && (
          <div style={{
            background: 'linear-gradient(135deg, #10b981, #059669)',
            color: 'white',
            padding: '16px',
            borderRadius: '8px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            animation: 'slideIn 0.3s ease'
          }}>
            <span style={{ fontSize: '20px' }}>✓</span>
            <span style={{ fontSize: '14px', fontWeight: '500' }}>{successMessage}</span>
          </div>
        )}

        {/* Error notification */}
        {errorMessage && (
          <div style={{
            background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
            color: 'white',
            padding: '16px',
            borderRadius: '8px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            animation: 'slideIn 0.3s ease'
          }}>
            <span style={{ fontSize: '20px' }}>✕</span>
            <span style={{ fontSize: '14px', fontWeight: '500' }}>{errorMessage}</span>
          </div>
        )}

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
                border: errors.email ? '1px solid #dc2626' : '1px solid var(--border-color)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '16px',
                transition: 'all 0.2s ease',
                background: 'var(--surface)'
              }}
              placeholder="email@example.com"
            />
            {errors.email && <div style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>{errors.email}</div>}
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
                border: errors.password ? '1px solid #dc2626' : '1px solid var(--border-color)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '16px',
                transition: 'all 0.2s ease',
                background: 'var(--surface)'
              }}
              placeholder="Пароль"
            />
            {errors.password && <div style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>{errors.password}</div>}
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
                    border: errors.FIO ? '1px solid #dc2626' : '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '16px',
                    transition: 'all 0.2s ease',
                    background: 'var(--surface)'
                  }}
                  placeholder="Иванов Иван Иванович"
                />
                {errors.FIO && <div style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>{errors.FIO}</div>}
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
                    border: errors.Phone ? '1px solid #dc2626' : '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '16px',
                    transition: 'all 0.2s ease',
                    background: 'var(--surface)'
                  }}
                  placeholder="+79991234567"
                />
                {errors.Phone && <div style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>{errors.Phone}</div>}
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
                    border: errors.BirthDate ? '1px solid #dc2626' : '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '16px',
                    transition: 'all 0.2s ease',
                    background: 'var(--surface)'
                  }}
                />
                {errors.BirthDate && <div style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>{errors.BirthDate}</div>}
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
    
    <style>{`
      @keyframes slideIn {
        from {
          opacity: 0;
          transform: translateY(-10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `}</style>
    </>
  );
};
