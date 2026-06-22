docker compose up -d postgres
cd backend
npm install
DATABASE_URL="postgresql://postgres:password@localhost:5433/restaurant_db"
npm run prisma:generate
npx prisma migrate dev --name init или npm run prisma:migrate ( второй лучше)
npm run prisma:seed
npx ts-node src/main.ts
cd frontend
npm install
npm run dev


Проверить  backend/package.json
"prisma": {
  "seed": "ts-node prisma/seed.ts"
}

Проверить backend/prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}