# Инструкция по развертыванию проекта на чистом ПК

## Требования

- Node.js (версия 18 или выше)
- PostgreSQL (версия 14 или выше)
- npm или yarn
- Git

## Шаг 1: Клонирование репозитория

```bash
git clone <your-github-repo-url>
cd restaurant-app
```

## Шаг 2: Настройка Backend

### 2.1 Установка зависимостей

```bash
cd backend
npm install
```

### 2.2 Настройка переменных окружения

Создайте файл `.env` в папке `backend`:

```bash
cp .env.example .env
```

Отредактируйте `.env` с вашими настройками:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/restaurant_db"

# JWT
JWT_SECRET="your-secret-key-here"
JWT_EXPIRES_IN="7d"

# Port
PORT=3000
```

### 2.3 Настройка базы данных PostgreSQL

1. Установите PostgreSQL на ваш ПК
2. Создайте базу данных:

```sql
CREATE DATABASE restaurant_db;
```

3. Обновите `DATABASE_URL` в `.env` с вашими учетными данными PostgreSQL

### 2.4 Запуск миграций Prisma

```bash
npx prisma migrate dev
npx prisma generate
```

### 2.5 Запуск Backend

```bash
npm run start:dev
```

Backend будет доступен по адресу: `http://localhost:3000`

## Шаг 3: Настройка Frontend

### 3.1 Установка зависимостей

Откройте новый терминал:

```bash
cd frontend
npm install
```

### 3.2 Запуск Frontend

```bash
npm run dev
```

Frontend будет доступен по адресу: `http://localhost:5173` (или другой порт, указанный в консоли)

## Шаг 4: Создание начальных данных (опционально)

Для создания тестовых данных (пользователи, блюда, ингредиенты):

```bash
cd backend
npm run seed
```

Или вручную через админ-панель после запуска приложения.

## Проверка работоспособности

1. Откройте браузер и перейдите на `http://localhost:5173`
2. Зарегистрируйте нового пользователя
3. Войдите в систему
4. Создайте заказ через конструктор блюд
5. Войдите как сотрудник или администратор для управления заказами

## Структура проекта

```
restaurant-app/
├── backend/          # NestJS Backend
│   ├── src/
│   │   ├── auth/    # Аутентификация
│   │   ├── users/   # Управление пользователями
│   │   ├── dishes/  # Управление блюдами
│   │   ├── ingredients/ # Управление ингредиентами
│   │   └── orders/  # Управление заказами
│   ├── prisma/      # Prisma ORM
│   └── .env         # Переменные окружения
└── frontend/        # React Frontend
    ├── src/
    │   ├── components/ # React компоненты
    │   ├── pages/      # Страницы приложения
    │   ├── services/   # API сервисы
    │   └── hooks/      # React hooks
    └── package.json
```

## Учетные данные по умолчанию (если есть seed)

После запуска seed скрипта:

- **Админ:** admin@restaurant.com / admin123
- **Сотрудник:** employee@restaurant.com / employee123
- **Клиент:** client@restaurant.com / client123

## Решение проблем

### Ошибка подключения к базе данных

Убедитесь, что:
- PostgreSQL запущен
- База данных создана
- Данные в `.env` корректны

### Ошибка CORS

Проверьте, что backend и frontend запущены на правильных портах и CORS настроен корректно в `backend/src/main.ts`.

### Проблемы с миграциями Prisma

```bash
# Сброс базы данных (внимание: удалит все данные)
npx prisma migrate reset

# Пересоздание клиента Prisma
npx prisma generate
```

## Дополнительная информация

- Backend API документация: `http://localhost:3000/api` (если установлен Swagger)
- Frontend порт может отличаться в зависимости от конфигурации Vite
