# Flask Backend для Портфолио

Этот проект содержит Flask backend для портфолио сайта специалиста по рекламе и PR.

## 🚀 Быстрый старт

### 1. Установка зависимостей

```bash
pip install -r requirements.txt
```

### 2. Настройка переменных окружения

Создайте файл `.env` в корне проекта:

```env
# Email Configuration
MAIL_USERNAME=your.email@gmail.com
MAIL_PASSWORD=your_app_password

# Flask Configuration
SECRET_KEY=your-secret-key-here
FLASK_ENV=development
FLASK_HOST=127.0.0.1
FLASK_PORT=5000
```

### 3. Запуск приложения

```bash
python run.py
```

Или напрямую через app.py:

```bash
python app.py
```

Сайт будет доступен по адресу: http://127.0.0.1:5000

## 📁 Структура проекта

```
portfolio/
├── app.py              # Основное Flask приложение
├── config.py           # Конфигурация приложения
├── run.py              # Файл запуска
├── requirements.txt    # Зависимости Python
├── templates/          # HTML шаблоны
│   ├── index.html      # Главная страница
│   └── case_detail.html # Шаблон для кейсов
├── static/             # Статические файлы
│   ├── styles.css      # CSS стили
│   └── script.js       # JavaScript
└── messages/           # Папка для сохранения сообщений
```

## 🔧 Функциональность

### Основные маршруты

- `GET /` - Главная страница
- `GET /case/<int:case_id>` - Детальная страница кейса
- `POST /contact` - Обработка формы обратной связи

### API маршруты

- `GET /api/cases` - Получение всех кейсов (JSON)
- `GET /api/case/<int:case_id>` - Получение конкретного кейса (JSON)
- `GET /api/stats` - Статистика портфолио (JSON)
- `GET /admin/messages` - Просмотр сообщений (JSON)

## 📧 Настройка Email

Для работы формы обратной связи нужно настроить email:

### Gmail

1. Включите двухфакторную аутентификацию
2. Создайте пароль приложения:
   - Перейдите в настройки аккаунта Google
   - Безопасность → Пароли приложений
   - Создайте новый пароль для приложения
3. Используйте этот пароль в `MAIL_PASSWORD`

### Другие провайдеры

Измените настройки в `config.py`:

```python
MAIL_SERVER = 'smtp.your-provider.com'
MAIL_PORT = 587  # или 465 для SSL
MAIL_USE_TLS = True  # или False для SSL
```

## 💾 Данные

### Кейсы

Данные кейсов хранятся в переменной `PORTFOLIO_DATA` в файле `app.py`. 
В реальном проекте рекомендуется использовать базу данных.

### Сообщения

Сообщения из формы обратной связи сохраняются в папке `messages/` в формате JSON.
Каждое сообщение содержит:

- Имя отправителя
- Email
- Тему
- Текст сообщения
- Время отправки

## 🎨 Кастомизация

### Изменение данных портфолио

Отредактируйте словарь `PORTFOLIO_DATA` в `app.py`:

```python
PORTFOLIO_DATA = {
    'cases': [
        {
            'id': 1,
            'title': 'Ваш кейс',
            'description': 'Описание кейса',
            # ... другие поля
        }
    ],
    'about': {
        'name': 'Ваше имя',
        'title': 'Ваша должность',
        # ... другие поля
    }
}
```

### Изменение дизайна

Стили находятся в `static/styles.css`. Основные цвета задаются в CSS переменных:

```css
:root {
    --primary-color: #F8BBD9;
    --secondary-color: #f5f5dc;
    --accent-color: #4ECDC4;
    /* ... другие переменные */
}
```

## 🔒 Безопасность

### Для продакшена

1. Измените `SECRET_KEY` на случайную строку
2. Установите `FLASK_ENV=production`
3. Используйте HTTPS
4. Настройте CORS если нужно
5. Добавьте rate limiting для формы

### Пример для продакшена

```python
# В config.py добавьте:
class ProductionConfig(Config):
    DEBUG = False
    TESTING = False
    # Добавьте другие настройки для продакшена
```

## 🚀 Деплой

### Heroku

1. Создайте `Procfile`:
```
web: python run.py
```

2. Установите переменные окружения в Heroku
3. Деплойте приложение

### VPS/Dedicated Server

1. Используйте Gunicorn:
```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

2. Настройте Nginx как reverse proxy
3. Используйте systemd для автозапуска

## 🛠️ Разработка

### Добавление новых кейсов

1. Добавьте данные в `PORTFOLIO_DATA`
2. При необходимости создайте новые шаблоны
3. Обновите навигацию

### Добавление новых страниц

1. Создайте новый маршрут в `app.py`
2. Создайте HTML шаблон в `templates/`
3. Добавьте стили в `static/styles.css`

## 📝 API Документация

### GET /api/cases

Возвращает список всех кейсов:

```json
[
    {
        "id": 1,
        "title": "Название кейса",
        "description": "Описание",
        "category": "Категория",
        "year": "2023",
        "client": "Клиент",
        "challenge": "Вызов",
        "solution": "Решение",
        "results": ["Результат 1", "Результат 2"],
        "technologies": ["Tech 1", "Tech 2"]
    }
]
```

### POST /contact

Отправка сообщения:

```json
{
    "name": "Имя",
    "email": "email@example.com",
    "subject": "Тема",
    "message": "Сообщение"
}
```

Ответ:
```json
{
    "success": true,
    "message": "Сообщение успешно отправлено!"
}
```

## 🆘 Помощь

При возникновении проблем:

1. Проверьте правильность переменных окружения
2. Убедитесь что все зависимости установлены
3. Проверьте логи приложения
4. Убедитесь что порт не занят другим приложением

## 📄 Лицензия

Этот проект создан для образовательных целей и может быть свободно использован и модифицирован. 