import React, { useState, useEffect } from 'react';

interface OrderStatus {
  id: number;
  name: string;
  icon: string;
  color: string;
}

const orderStatuses: OrderStatus[] = [
  { id: 1, name: 'Заказ принят', icon: '📝', color: '#3b82f6' },
  { id: 2, name: 'Готовится', icon: '👨‍🍳', color: '#f59e0b' },
  { id: 3, name: 'Приготовлен', icon: '✅', color: '#10b981' },
  { id: 4, name: 'Можете забирать', icon: '🎉', color: '#8b5cf6' }
];

interface OrderStatusBarSimpleProps {
  isVisible?: boolean;
  onClose?: () => void;
  dishName?: string;
  currentStatus?: string;
}

export const OrderStatusBarSimple: React.FC<OrderStatusBarSimpleProps> = ({
  isVisible = false,
  onClose = () => {},
  dishName = 'Ваше блюдо',
  currentStatus: propCurrentStatus
}) => {
  const [currentStatusIndex, setCurrentStatusIndex] = useState(0);
  const [showCompletion, setShowCompletion] = useState(false);

  // Если передан currentStatus, показываем статический статус
  if (propCurrentStatus !== undefined) {
    const statusIndex = orderStatuses.findIndex(s => s.name === propCurrentStatus);
    const displayStatus = statusIndex >= 0 ? orderStatuses[statusIndex] : orderStatuses[0];
    
    return (
      <div className="order-status-bar" style={{
        padding: '8px 16px',
        background: `linear-gradient(135deg, ${displayStatus.color}, ${displayStatus.color}dd)`,
        color: 'white',
        borderRadius: 'var(--radius-sm)',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '14px',
        fontWeight: '600'
      }}>
        <span style={{ fontSize: '18px' }}>{displayStatus.icon}</span>
        {displayStatus.name}
      </div>
    );
  }

  const currentStatus = orderStatuses[currentStatusIndex];

  useEffect(() => {
    if (!isVisible) {
      setCurrentStatusIndex(0);
      setShowCompletion(false);
      return;
    }

    console.log('=== Starting simple status sequence ===');
    console.log('Status 1:', orderStatuses[0].name);

    // Статус 1: Заказ принят
    const timer1 = setTimeout(() => {
      console.log('Status 2:', orderStatuses[1].name);
      setCurrentStatusIndex(1);
    }, 3000);

    // Статус 2: Готовится
    const timer2 = setTimeout(() => {
      console.log('Status 3:', orderStatuses[2].name);
      setCurrentStatusIndex(2);
    }, 6000);

    // Статус 3: Приготовлен
    const timer3 = setTimeout(() => {
      console.log('Status 4:', orderStatuses[3].name);
      setCurrentStatusIndex(3);
    }, 9000);

    // Статус 4: Можете забирать
    const timer4 = setTimeout(() => {
      console.log('Showing completion message');
      setShowCompletion(true);
    }, 12000);

    // Автоматическое закрытие
    const timer5 = setTimeout(() => {
      console.log('Auto-closing');
      onClose();
    }, 17000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
    };
  }, [isVisible, onClose]);

  if (!isVisible) return null;

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
            <button
              onClick={onClose}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: '18px'
              }}
            >
              ×
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
            <div style={{
              fontSize: '12px',
              color: '#15803d',
              marginTop: '8px',
              opacity: '0.8'
            }}>
              Окно автоматически закроется через 5 секунд
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
