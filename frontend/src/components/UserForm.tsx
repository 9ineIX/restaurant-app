import React, { useState } from 'react';

interface UserFormProps {
  onSubmit: (userData: any) => void;
  onCancel: () => void;
}

export const UserForm: React.FC<UserFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    FIO: '',
    Email: '',
    Password: '',
    Phone: '',
    BirthDate: '',
    IDRoles: 1 // CLIENT по умолчанию
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const newErrors: Record<string, string> = {};
    
    if (!formData.FIO.trim()) {
      newErrors.FIO = 'ФИО обязательно';
    }
    
    if (!formData.Email.trim()) {
      newErrors.Email = 'Email обязателен';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.Email)) {
      newErrors.Email = 'Некорректный email';
    }
    
    if (!formData.Password) {
      newErrors.Password = 'Пароль обязателен';
    } else if (formData.Password.length < 6) {
      newErrors.Password = 'Пароль должен быть минимум 6 символов';
    }
    
    if (!formData.Phone.trim()) {
      newErrors.Phone = 'Телефон обязателен';
    }
    
    if (!formData.BirthDate) {
      newErrors.BirthDate = 'Дата рождения обязательна';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    onSubmit(formData);
  };

  const getInputStyle = (fieldName?: string) => ({
    width: '100%',
    padding: '12px 16px',
    border: errors[fieldName || ''] ? '1px solid #dc2626' : '1px solid #e9ecef',
    borderRadius: '8px',
    fontSize: '16px',
    transition: 'all 0.2s ease',
    background: '#ffffff'
  });

  const labelStyle = {
    display: 'block',
    fontSize: '14px',
    fontWeight: '500',
    color: '#2c3e50',
    marginBottom: '8px'
  };

  return (
    <div style={{ padding: '32px', maxWidth: '600px', width: '100%' }}>
      <h3 style={{
        fontSize: '24px',
        fontWeight: '700',
        color: '#2c3e50',
        marginBottom: '24px',
        textAlign: 'center'
      }}>Добавить пользователя</h3>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={labelStyle}>ФИО</label>
            <input
              type="text"
              required
              value={formData.FIO}
              onChange={(e) => setFormData({...formData, FIO: e.target.value})}
              style={getInputStyle('FIO')}
              placeholder="Иванов Иван Иванович"
            />
            {errors.FIO && <div style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>{errors.FIO}</div>}
          </div>

          <div>
            <label style={labelStyle}>Email</label>
            <input
              type="email"
              required
              value={formData.Email}
              onChange={(e) => setFormData({...formData, Email: e.target.value})}
              style={getInputStyle('Email')}
              placeholder="email@example.com"
            />
            {errors.Email && <div style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>{errors.Email}</div>}
          </div>

          <div>
            <label style={labelStyle}>Пароль</label>
            <input
              type="password"
              required
              value={formData.Password}
              onChange={(e) => setFormData({...formData, Password: e.target.value})}
              style={getInputStyle('Password')}
              placeholder="Пароль"
            />
            {errors.Password && <div style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>{errors.Password}</div>}
          </div>

          <div>
            <label style={labelStyle}>Телефон</label>
            <input
              type="tel"
              value={formData.Phone}
              onChange={(e) => setFormData({...formData, Phone: e.target.value})}
              style={getInputStyle('Phone')}
              placeholder="+7 (999) 123-45-67"
            />
            {errors.Phone && <div style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>{errors.Phone}</div>}
          </div>

          <div>
            <label style={labelStyle}>Дата рождения</label>
            <input
              type="date"
              value={formData.BirthDate}
              onChange={(e) => setFormData({...formData, BirthDate: e.target.value})}
              style={getInputStyle('BirthDate')}
            />
            {errors.BirthDate && <div style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>{errors.BirthDate}</div>}
          </div>

          <div>
            <label style={labelStyle}>Роль</label>
            <select
              value={formData.IDRoles}
              onChange={(e) => setFormData({...formData, IDRoles: parseInt(e.target.value)})}
              style={getInputStyle()}
            >
              <option value={1}>Клиент</option>
              <option value={2}>Сотрудник</option>
              <option value={3}>Администратор</option>
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
            <button
              type="button"
              onClick={onCancel}
              style={{
                padding: '12px 24px',
                border: '1px solid #e9ecef',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '500',
                color: '#6c757d',
                background: 'transparent',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              Отмена
            </button>
            <button
              type="submit"
              style={{
                padding: '12px 24px',
                background: '#ff6b35',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              Добавить
            </button>
          </div>
        </form>
    </div>
  );
};
