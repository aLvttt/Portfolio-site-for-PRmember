#!/usr/bin/env python3
"""
Файл запуска Flask приложения портфолио
"""

import os
from app import app

if __name__ == '__main__':
    # Получаем настройки из переменных окружения
    host = os.environ.get('FLASK_HOST', '127.0.0.1')
    port = int(os.environ.get('FLASK_PORT', 5000))
    debug = os.environ.get('FLASK_ENV', 'development') == 'development'
    
    print(f"🚀 Запуск портфолио сервера...")
    print(f"📍 Адрес: http://{host}:{port}")
    print(f"🔧 Режим: {'разработка' if debug else 'продакшен'}")
    
    app.run(
        host=host,
        port=port,
        debug=debug
    ) 