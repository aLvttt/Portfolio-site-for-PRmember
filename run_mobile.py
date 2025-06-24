#!/usr/bin/env python3
"""
Файл запуска Flask приложения для тестирования на мобильных устройствах
Запускает сервер с доступом по локальной сети
"""

import os
import socket
from app import app

def get_local_ip():
    """Получаем локальный IP адрес"""
    try:
        # Создаем временное соединение для определения IP
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        local_ip = s.getsockname()[0]
        s.close()
        return local_ip
    except Exception:
        return "127.0.0.1"

if __name__ == '__main__':
    # Настройки для мобильного тестирования
    host = '0.0.0.0'  # Доступ со всех интерфейсов
    port = int(os.environ.get('FLASK_PORT', 5000))
    debug = True
    
    local_ip = get_local_ip()
    
    print("📱 ЗАПУСК СЕРВЕРА ДЛЯ МОБИЛЬНОГО ТЕСТИРОВАНИЯ")
    print("=" * 50)
    print(f"🖥️  Локальный адрес: http://127.0.0.1:{port}")
    print(f"📱 Мобильный адрес: http://{local_ip}:{port}")
    print("=" * 50)
    print("💡 Инструкция для тестирования:")
    print("   1. Убедитесь, что компьютер и телефон в одной Wi-Fi сети")
    print(f"   2. Откройте на телефоне: http://{local_ip}:{port}")
    print("   3. Или отсканируйте QR-код (если есть приложение)")
    print("=" * 50)
    print("🔧 Инструменты разработчика в браузере:")
    print("   • Chrome: F12 → иконка телефона 📱")
    print("   • Firefox: F12 → адаптивный дизайн")
    print("   • Safari: Develop → Responsive Design Mode")
    print("=" * 50)
    
    app.run(
        host=host,
        port=port,
        debug=debug
    ) 