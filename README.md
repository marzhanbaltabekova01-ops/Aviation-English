# AviationEnglish.kz — Fullstack Project

Платформа для изучения авиационного английского языка. Подготовка пилотов и авиадиспетчеров к языковому тесту ICAO.

## Структура монорепо

```
aviation-english-kz/
  frontend/    — Next.js 14 (App Router)
  backend/     — NestJS 10 + Prisma + PostgreSQL
```

---

## Запуск проекта

### 1. Клонируй репозиторий и установи зависимости

```bash
# Backend
cd backend
npm install
cp .env.example .env
# Заполни DATABASE_URL и JWT_SECRET в .env

# Frontend
cd ../frontend
npm install
cp .env.local.example .env.local
# Заполни NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 2. Подними базу данных

Используй Railway / Supabase / Render, или локально:
```bash
docker run -e POSTGRES_PASSWORD=password -p 5432:5432 postgres
# DATABASE_URL=postgresql://postgres:password@localhost:5432/aviation_english_db
```

### 3. Выполни миграции и seed

```bash
cd backend
npx prisma migrate dev --name init
npx prisma db seed
```

### 4. Запусти серверы

```bash
# Backend (терминал 1)
cd backend && npm run start:dev
# → http://localhost:3001
# → Swagger: http://localhost:3001/api/docs

# Frontend (терминал 2)
cd frontend && npm run dev
# → http://localhost:3000
```

---

## Тестовые аккаунты

| Роль | Email | Пароль |
|------|-------|--------|
| ADMIN | admin@aviationenglish.kz | admin123456 |
| INSTRUCTOR | instructor@aviationenglish.kz | admin123456 |
| USER | pilot@test.kz | user123456 |

---

## Технологический стек

### Frontend
- Next.js 14 (App Router)
- TypeScript (strict)
- Tailwind CSS
- React Hook Form + Zod
- Axios

### Backend
- NestJS 10
- TypeScript
- Prisma ORM
- PostgreSQL
- Passport.js + JWT
- Swagger / OpenAPI

### Деплой
- Frontend → Vercel
- Backend → Render / Railway
- БД → Railway / Supabase

---

## API Документация

После запуска backend доступна по адресу:
`http://localhost:3001/api/docs`
