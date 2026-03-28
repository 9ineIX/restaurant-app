# Restaurant App - Fullstack приложение для ресторана

## Структура проекта
```
restaurant-app/
├── backend/     # NestJS + Prisma
├── frontend/    # React + Vite + Tailwind
└── docker-compose.yml
```

## Запуск проекта
1. Запустить Docker: `docker-compose up -d`
2. Настроить backend: `cd backend && npm install && npm run dev`
3. Настроить frontend: `cd frontend && npm install && npm run dev`

## Технологии
- **Backend**: NestJS, Prisma, PostgreSQL, JWT
- **Frontend**: React, Vite, Tailwind CSS, React Query
- **Database**: PostgreSQL в Docker
