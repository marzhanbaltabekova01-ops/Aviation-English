# 🛠️ Пошаговая инструкция по запуску

## Шаг 1 — Создай файл .env в папке backend

Скопируй файл `backend.env` → переименуй в `.env` и положи в папку `backend/`

```
backend/
  .env          ← сюда (не .env.example, а именно .env)
  src/
  prisma/
  ...
```

Открой `.env` и выбери ОДИН вариант для DATABASE_URL:

---

### 🐳 Вариант A — Docker (самый простой, без регистрации)

Установи Docker Desktop: https://www.docker.com/products/docker-desktop/

```bash
# Запусти PostgreSQL в Docker:
docker run --name aviation-db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=aviation_english_db \
  -p 5432:5432 \
  -d postgres:16

# В .env поставь:
DATABASE_URL="postgresql://postgres:password@localhost:5432/aviation_english_db"
```

---

### ☁️ Вариант B — Railway (бесплатно, в облаке)

1. Иди на https://railway.app → Sign up (можно через GitHub)
2. New Project → Add PostgreSQL
3. Кликни на PostgreSQL → вкладка **Connect**
4. Скопируй строку **DATABASE_URL**
5. Вставь в `.env`:
```
DATABASE_URL="postgresql://postgres:xxxx@xxx.railway.app:5432/railway"
```

---

### ☁️ Вариант C — Supabase (бесплатно, в облаке)

1. Иди на https://supabase.com → Sign up
2. New Project → придумай название и пароль БД (запомни пароль!)
3. Жди 2 минуты пока создаётся
4. Иди в **Project Settings → Database → Connection string → URI**
5. Скопируй строку, замени `[YOUR-PASSWORD]` на свой пароль
6. Вставь в `.env`

---

## Шаг 2 — Создай файл .env.local в папке frontend

Скопируй файл `frontend.env.local` → переименуй в `.env.local` и положи в папку `frontend/`

```
frontend/
  .env.local    ← сюда
  app/
  components/
  ...
```

Содержимое (оставь как есть для локальной разработки):
```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

## Шаг 3 — Установи зависимости и запусти

Открой **два терминала** в VS Code (Terminal → New Terminal)

### Терминал 1 — Backend:
```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
npm run start:dev
```

Ожидай сообщение:
```
🚀 Server running on: http://localhost:3001
📚 Swagger docs: http://localhost:3001/api/docs
```

### Терминал 2 — Frontend:
```bash
cd frontend
npm install
npm run dev
```

Ожидай сообщение:
```
✓ Ready in 2.3s
○ Local: http://localhost:3000
```

---

## Шаг 4 — Открой в браузере

| URL | Описание |
|-----|----------|
| http://localhost:3000 | Фронтенд (сайт) |
| http://localhost:3001/api/docs | Swagger API документация |

---

## Тестовые аккаунты (создаются через seed):

| Роль | Email | Пароль |
|------|-------|--------|
| USER | pilot@test.kz | user123456 |
| ADMIN | admin@aviationenglish.kz | admin123456 |
| INSTRUCTOR | instructor@aviationenglish.kz | admin123456 |

---

## ❗ Частые ошибки

### `PrismaClientInitializationError: DATABASE_URL not found`
→ Файл `.env` не создан или находится не в папке `backend/`

### `Error: connect ECONNREFUSED 127.0.0.1:5432`
→ PostgreSQL не запущен. Запусти Docker контейнер или проверь облачную БД

### `Cannot find module '@prisma/client'`
→ Выполни: `npx prisma generate`

### `Port 3001 already in use`
→ Измени PORT в `.env`: `PORT=3002`

### Frontend: `Network Error` при логине
→ Проверь что backend запущен на :3001 и CORS_ORIGIN в `.env` = `http://localhost:3000`
