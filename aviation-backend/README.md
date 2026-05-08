# AviationEnglish.kz — Backend (NestJS)

REST API для платформы изучения авиационного английского языка.

## Стек
- **NestJS 10** + TypeScript
- **PostgreSQL** + **Prisma ORM**
- **JWT** аутентификация (bcryptjs + passport-jwt)
- **Swagger UI** — `/docs`

## Быстрый старт

### 1. Установи зависимости
```bash
npm install
```

### 2. Настрой .env
```bash
cp .env.example .env
# Заполни DATABASE_URL своей строкой подключения к PostgreSQL
```

Для Railway: скопируй DATABASE_URL из вкладки Variables.

### 3. Инициализируй БД
```bash
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
```

### 4. Запусти
```bash
npm run start:dev
```

Сервер запустится на `http://localhost:3000`
Swagger UI: `http://localhost:3000/docs`

---

## Тестовые аккаунты

| Роль  | Email                        | Пароль       |
|-------|------------------------------|--------------|
| USER  | pilot@test.kz                | user123456   |
| ADMIN | admin@aviationenglish.kz     | admin123456  |

---

## API эндпоинты

| Метод  | Путь                          | Доступ  | Описание                        |
|--------|-------------------------------|---------|---------------------------------|
| POST   | /api/auth/login               | Public  | Вход → JWT токен                |
| POST   | /api/auth/register            | Public  | Регистрация → JWT токен         |
| GET    | /api/auth/profile             | JWT     | Профиль текущего пользователя   |
| GET    | /api/courses                  | Public  | Список курсов (?level= ?search=)|
| GET    | /api/courses/:id              | Public  | Курс с уроками                  |
| GET    | /api/lessons/:id              | Public* | Урок с контентом                |
| POST   | /api/lessons/:id/complete     | JWT     | Завершить урок → { xp, message }|
| GET    | /api/enrollments/my           | JWT     | Мои курсы                       |
| GET    | /api/enrollments/stats        | JWT     | Статистика дашборда             |
| POST   | /api/enrollments/:courseId    | JWT     | Записаться на курс              |

*При наличии токена — возвращает статус прохождения урока

---

## Структура проекта

```
src/
  main.ts              — точка входа, Swagger, CORS
  app.module.ts        — корневой модуль
  prisma/              — Prisma сервис и модуль
  auth/                — JWT аутентификация
  courses/             — CRUD курсов
  lessons/             — уроки + завершение + XP
  enrollments/         — записи на курсы + статистика
  common/
    decorators/        — @CurrentUser()
    guards/            — JwtAuthGuard
prisma/
  schema.prisma        — схема БД
  seed.ts              — тестовые данные
```
