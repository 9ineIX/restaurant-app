# 🚀 Запуск проекта Restaurant App

## 📋 Требования
- Docker и Docker Compose
- Node.js 18+ (для локальной разработки)

## 🐳 Запуск через Docker (рекомендуется)

1. **Клонируйте проект и перейдите в папку:**
   ```bash
   cd restaurant-app
   ```

2. **Запустите все сервисы:**
   ```bash
   docker-compose up -d
   ```

3. **Дождитесь запуска всех контейнеров (около 1-2 минут)**

4. **Инициализация базы данных:**
   ```bash
   # Заходим в контейнер бэкенда
   docker-compose exec backend sh
   
   # Выполняем миграции
   npx prisma migrate dev --name init
   
   # Заполняем базу данными
   npm run prisma:seed
   
   # Выходим из контейнера
   exit
   ```

## 🌐 Доступ к приложению

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3001
- **API Документация:** http://localhost:3001/api
- **PostgreSQL:** localhost:5433

## 👤 Пользователи для входа

| Роль | Email | Пароль |
|------|-------|--------|
| Клиент | client@example.com | password123 |
| Сотрудник | employee@example.com | password123 |
| Администратор | admin@example.com | password123 |

## 💻 Локальная разработка

### Backend
```bash
cd /home/nine/CascadeProjects/restaurant-app/backend
export DATABASE_URL="postgresql://postgres:password@localhost:5433/restaurant_db"
PORT=3002 node -r ts-node/register src/main.ts^C
```

### Frontend
```bash
cd/home/nine/CascadeProjects/restaurant-app/frontend && npm run build
```

## 📁 Структура проекта

```
restaurant-app/
├── backend/                 # NestJS + Prisma
│   ├── src/
│   │   ├── auth/           # Аутентификация
│   │   ├── users/          # Пользователи
│   │   ├── ingredients/    # Ингредиенты
│   │   ├── dishes/         # Блюда
│   │   ├── orders/         # Заказы
│   │   ├── guards/         # Guards
│   │   └── common/         # Общие модули
│   ├── prisma/
│   │   ├── schema.prisma   # Схема БД
│   │   └── seed.ts         # Наполнение БД
│   └── Dockerfile
├── frontend/               # React + Vite + Tailwind
│   ├── src/
│   │   ├── components/     # Компоненты
│   │   ├── pages/         # Страницы
│   │   ├── hooks/         # Хуки
│   │   ├── services/      # API сервисы
│   │   └── types/         # Типы
│   └── Dockerfile
└── docker-compose.yml      # Docker конфигурация
```

## 🔧 Основные функции

### ✨ Конструктор ингредиентов
- Выбор ингредиентов с указанием количества
- Визуальное отображение выбранных позиций
- Категоризация ингредиентов

### 🍽️ Подбор блюд
- Умный алгоритм подбора по выбранным ингредиентам
- Процент совпадения
- Показ недостающих и лишних ингредиентов
- Возможность запросить альтернативный вариант

### 📦 Управление заказами
- Создание заказов на основе подобранных блюд
- Отслеживание статусов заказов
- Разграничение прав доступа

### 🔐 Авторизация и роли
- JWT токены (access + refresh)
- Роли: CLIENT, EMPLOYEE, ADMIN
- Guards для защиты эндпоинтов

## 🛠️ Технологии

### Backend
- **NestJS** - фреймворк
- **Prisma** - ORM
- **PostgreSQL** - база данных
- **JWT** - авторизация
- **bcrypt** - хеширование паролей
- **Swagger** - документация API

### Frontend
- **React 18** - UI библиотека
- **Vite** - сборщик
- **Tailwind CSS** - стили
- **React Query** - управление состоянием сервера
- **React Router** - маршрутизация
- **Axios** - HTTP клиент

## 🔄 Основные эндпоинты API

### Аутентификация
- `POST /auth/register` - регистрация
- `POST /auth/login` - вход
- `GET /auth/profile` - профиль

### Ингредиенты
- `GET /ingredients` - все ингредиенты
- `GET /ingredients/categories` - категории

### Блюда
- `GET /dishes` - все блюда
- `POST /dishes/match` - подбор по ингредиентам

### Заказы
- `GET /orders` - заказы пользователя
- `POST /orders` - создание заказа
- `PATCH /orders/:id/status` - обновление статуса

## 🐛 Полезные команды

```bash
# Остановка всех сервисов
docker-compose down

# Перезапуск с пересборкой
docker-compose up --build

# Просмотр логов
docker-compose logs -f backend
docker-compose logs -f frontend

# Заход в контейнер
docker-compose exec backend sh
docker-compose exec frontend sh
```

## 📝 Примечания

- База данных автоматически заполняется тестовыми данными при первом запуске
- Frontend автоматически перезагружается при изменениях в коде
- Backend работает в режиме разработки с hot reload
- Swagger документация доступна по адресу http://localhost:3000/api

Приятного использования! 🎉
