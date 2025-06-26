# JobHunter Pro

Автоматизированная система поиска работы с интеграцией HeadHunter API.

## Возможности

- OAuth авторизация через HeadHunter
- Поиск и фильтрация вакансий
- Отслеживание откликов
- Аналитика рынка труда
- Система уведомлений
- Автоматизация откликов

## Технологии

- **Backend**: Python 3.11, FastAPI, PostgreSQL, Redis
- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Deployment**: Docker Compose, nginx

## Быстрый старт

### 1. Клонирование репозитория

```bash
git clone https://github.com/yourusername/jobhunter-pro.git
cd jobhunter-pro
```

### 2. Настройка окружения

Скопируйте `.env.example` в `.env` и заполните настройки:

```bash
cp .env.example .env
```

Необходимые настройки:
- `HH_CLIENT_ID` и `HH_CLIENT_SECRET` - получите на [dev.hh.ru](https://dev.hh.ru)
- `HH_REDIRECT_URI` - URL для OAuth callback (например: `https://yourdomain.com/auth/callback`)

### 3. Установка зависимостей

Backend:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Linux/Mac
# или
venv\Scripts\activate  # Windows
pip install -r requirements.txt
```

Frontend:
```bash
cd frontend
npm install
```

### 4. Запуск приложения

Backend:
```bash
cd backend
python main.py
```

Frontend:
```bash
cd frontend
npm start
```

### 5. Docker Compose (альтернативный способ)

```bash
docker-compose up -d
```

## Структура проекта

```
jobhunter-pro/
├── backend/
│   ├── main.py           # Основное API приложение
│   ├── services/         # Сервисы (HH API клиент)
│   ├── models/           # Модели данных
│   └── requirements.txt  # Python зависимости
├── frontend/
│   ├── src/
│   │   ├── pages/       # Страницы (Dashboard, Search, etc.)
│   │   ├── components/  # React компоненты
│   │   ├── services/    # API сервисы
│   │   └── types/       # TypeScript типы
│   └── package.json
├── docker-compose.yml
├── .env.example
└── README.md
```

## API документация

После запуска backend доступна документация API:
- Swagger UI: http://localhost:8001/docs
- ReDoc: http://localhost:8001/redoc

## Настройка HeadHunter API

1. Зарегистрируйте приложение на [dev.hh.ru](https://dev.hh.ru)
2. Укажите Redirect URI: `https://yourdomain.com/auth/callback`
3. Скопируйте Client ID и Client Secret в `.env`

## Возможные проблемы

### OAuth авторизация не работает
- Убедитесь, что redirect_uri в настройках приложения на hh.ru точно совпадает с указанным в `.env`
- HeadHunter не принимает IP адреса в redirect_uri, используйте доменное имя

### CORS ошибки
- Проверьте, что домен frontend добавлен в CORS настройки backend

## Лицензия

MIT

## Контакты

Алексей Соколов - a.sokolov@techinnovate.ru