import React, { useState, useEffect } from 'react';

interface OrderStatus {
  id: number;
  name: string;
  icon: string;
  color: string;
}

const orderStatuses: OrderStatus[] = [
  { id: 1, name: 'Создан', icon: '📝', color: '#3b82f6' },
  { id: 2, name: 'В обработке', icon: '👨‍🍳', color: '#f59e0b' },
  { id: 3, name: 'Готов', icon: '✅', color: '#10b981' },
  { id: 4, name: 'Выдан', icon: '🎉', color: '#8b5cf6' }
];

interface OrderStatusBarSimpleProps {
  currentStatus?: string;
  dishName?: string;
}

export const OrderStatusBarSimple: React.FC<OrderStatusBarSimpleProps> = ({
  currentStatus: propCurrentStatus,
  dishName = 'Ваше блюдо'
}) => {
  const [currentStatusIndex, setCurrentStatusIndex] = useState(0);
  const [showCompletion, setShowCompletion] = useState(false);

  // Определяем текущий индекс статуса на основе реального статуса из БД
  useEffect(() => {
    if (propCurrentStatus) {
      const statusIndex = orderStatuses.findIndex(s => s.name === propCurrentStatus);
      if (statusIndex >= 0) {
        setCurrentStatusIndex(statusIndex);
        // Если статус "Выдан", показываем сообщение о завершении
        if (propCurrentStatus === 'Выдан') {
          setShowCompletion(true);
        } else {
          setShowCompletion(false);
        }
      }
    }
  }, [propCurrentStatus]);

  const currentStatus = orderStatuses[currentStatusIndex];

  return (
    <div className="order-status-bar" style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      background: 'var(--surface)',
      boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.15)',
      zIndex: 1500
    }}>
      {/* Основная панель */}
      <div style={{
        padding: '16px 20px',
        background: `linear-gradient(135deg, ${currentStatus.color}, ${currentStatus.color}dd)`,
        color: 'white'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            flex: 1
          }}>
            <div style={{
              fontSize: '24px',
              animation: 'bounce 2s infinite'
            }}>
              {currentStatus.icon}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: '16px',
                fontWeight: '600',
                marginBottom: '2px'
              }}>
                {currentStatus.name}
              </div>
              <div style={{
                fontSize: '12px',
                opacity: 0.9
              }}>
                🍽️ {dishName} • Статус {currentStatusIndex + 1}/4
              </div>
            </div>
          </div>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <button
              onClick={() => console.log('Expand clicked')}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              ⌃
            </button>
          </div>
        </div>
      </div>

      {/* Расширенная панель */}
      <div style={{
        padding: '20px',
        background: 'var(--surface)',
        borderTop: '1px solid var(--border-color)'
      }}>
        <div style={{
          marginBottom: '16px'
        }}>
          <h4 style={{
            fontSize: '14px',
            fontWeight: '600',
            color: 'var(--text-primary)',
            marginBottom: '12px'
          }}>
            Статусы заказа:
          </h4>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            position: 'relative'
          }}>
            {/* Линия прогресса */}
            <div style={{
              position: 'absolute',
              top: '16px',
              left: '20px',
              right: '20px',
              height: '2px',
              background: 'var(--background)',
              zIndex: 1
            }}>
              <div style={{
                width: `${(currentStatusIndex / (orderStatuses.length - 1)) * 100}%`,
                height: '100%',
                background: 'linear-gradient(90deg, var(--primary-color), var(--accent-color))',
                transition: 'width 0.5s ease'
              }} />
            </div>

            {/* Точки статусов */}
            {orderStatuses.map((status, index) => {
              const isActive = index <= currentStatusIndex;
              const isCurrent = index === currentStatusIndex;
              
              return (
                <div
                  key={status.id}
                  style={{
                    position: 'relative',
                    zIndex: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    flex: 1
                  }}
                >
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: isActive 
                      ? isCurrent 
                        ? `linear-gradient(135deg, ${status.color}, ${status.color}dd)`
                        : status.color
                      : 'var(--background)',
                    border: isActive ? `2px solid ${status.color}` : '2px solid var(--border-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    color: isActive ? 'white' : 'var(--text-secondary)',
                    transition: 'all 0.3s ease',
                    transform: isCurrent ? 'scale(1.1)' : 'scale(1)',
                    boxShadow: isCurrent ? `0 0 0 3px ${status.color}20` : 'none'
                  }}>
                    {status.icon}
                  </div>
                  <div style={{
                    marginTop: '6px',
                    fontSize: '10px',
                    fontWeight: '500',
                    color: isActive ? status.color : 'var(--text-secondary)',
                    textAlign: 'center',
                    maxWidth: '50px'
                  }}>
                    {status.name}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {showCompletion && (
          <div style={{
            textAlign: 'center',
            padding: '16px',
            background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid #bbf7d0',
            animation: 'pulse 2s infinite'
          }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>🎉</div>
            <div style={{
              fontSize: '16px',
              fontWeight: '700',
              color: '#166534',
              marginBottom: '4px'
            }}>
              Ваш заказ готов!
            </div>
            <div style={{
              fontSize: '14px',
              color: '#15803d'
            }}>
              Можете забирать {dishName}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-5px);
          }
          60% {
            transform: translateY(-3px);
          }
        }

        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.05);
            opacity: 0.9;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};
