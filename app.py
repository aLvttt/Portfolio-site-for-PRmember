from flask import Flask, render_template, request, jsonify, redirect, url_for, flash
from flask_mail import Mail, Message
import os
from datetime import datetime
import json
from config import config

app = Flask(__name__)

# Загружаем конфигурацию
config_name = os.environ.get('FLASK_ENV', 'development')
app.config.from_object(config[config_name])

mail = Mail(app)

# Данные для портфолио (в реальном проекте лучше использовать базу данных)
PORTFOLIO_DATA = {
    'cases': [
        {
            'id': 1,
            'title': 'Structo - IT-продукт',
            'description': 'Разработка маркетинговой стратегии для IT-стартапа',
            'image': 'images/structo/frame3.png',
            'category': 'Маркетинговая стратегия',
            'year': '2025',
            'client': 'Structo',
            'challenge': 'Увеличить узнаваемость российского веб-сайта для преобразования текста в 3D-модели среди целевой аудитории',
            'solution': 'Разработана комплексная маркетинговая стратегия с фокусом на образовательный контент, коллаборации с образовательными платформами и таргетированную рекламу',
            'results': ['Прогноз: охват 50 000+ за первый месяц', 'Прогноз: увеличение регистраций на 20%', 'Прогноз: обучение 500+ пользователей'],
            'technologies': ['Canva', 'Excel', 'PowerPoint', 'Конкурентный анализ', 'SWOT-анализ'],
            'images': ['images/structo/frame3.png'],
            'presentations': ['images/structo/presentation1.pdf', 'images/structo/presentation2.pdf'],
            'theme': {
                'primary': '#8B5CF6',
                'secondary': '#3B82F6', 
                'accent': '#EC4899',
                'gradient': 'linear-gradient(135deg, #000000 0%, #1E1B4B 25%, #8B5CF6 50%, #3B82F6 75%, #EC4899 100%)',
                'dark': '#000000',
                'light': '#0F0F23'
            }
        },
        {
            'id': 2,
            'title': 'CandleNur - Бренд свечей',
            'description': 'Разработка визуального стиля и коммуникационного образа для бренда',
            'image': 'images/candlenur/price/1.png',
            'category': 'Брендинг',
            'year': '2025',
            'client': 'CandleNur',
            'challenge': 'Сформировать визуальную айдентику бренда ручной работы и повысить узнаваемость',
            'solution': 'Создан полный визуальный стиль, разработан сайт на Tilda, подготовлена контент-стратегия с упором на атмосферность и сторителлинг',
            'results': ['Создан сайт candlenur.tilda.ws', 'Разработан полный визуальный стиль', 'Подготовлены материалы для продвижения'],
            'technologies': ['Tilda', 'Canva', 'Figma', 'Визуальный дизайн', 'SWOT-анализ'],
            'images': ['images/candlenur/price/1.png', 'images/candlenur/price/2.png', 'images/candlenur/price/3.png', 'images/candlenur/moodboard/moodboard.png', 'images/candlenur/memo/memo.png', 'images/candlenur/how-to-order/2.png'],
            'theme': {
                'primary': '#EA580C',
                'secondary': '#FB923C', 
                'accent': '#FED7AA',
                'gradient': 'linear-gradient(135deg, #7C2D12 0%, #EA580C 30%, #FB923C 70%, #FED7AA 100%)',
                'dark': '#431407',
                'light': '#FFF7ED'
            }
        },
        {
            'id': 3,
            'title': 'alttt. - Музыкальный проект',
            'description': 'Разработка стратегии продвижения для музыканта',
            'image': 'images/alttt/musician.jpg',
            'category': 'Digital-продвижение',
            'year': '2024',
            'client': 'alttt.',
            'challenge': 'Привлечь новую аудиторию и успешно запустить релиз нового трека',
            'solution': 'Разработана мультиканальная стратегия продвижения с фокусом на TikTok, Instagram и музыкальные платформы',
            'results': ['Прогноз: рост аудитории на 15% в TikTok', 'Стратегия для 5+ платформ', 'План контент-маркетинга'],
            'technologies': ['Canva', 'Контент-стратегия', 'KPI планирование', 'Аналитика аудитории'],
            'images': ['images/alttt/musician.jpg'],
            'theme': {
                'primary': '#E11D48',
                'secondary': '#F43F5E', 
                'accent': '#FDA4AF',
                'gradient': 'linear-gradient(135deg, #881337 0%, #E11D48 30%, #F43F5E 70%, #FDA4AF 100%)',
                'dark': '#4C0519',
                'light': '#FFF1F2'
            }
        }
    ],
    'other_projects': [
        {
            'id': 1,
            'title': 'PR-стратегия для Almond Crew',
            'description': 'Разработка PR и маркетинговой стратегии для eco-friendly бренда женской одежды',
            'category': 'PR-стратегия',
            'year': '2024',
            'highlights': ['SWOT и PEST-анализ', 'Медиапланирование', 'Event-маркетинг', 'Комплексный подход к продвижению'],
            'icon': 'leaf'
        },
        {
            'id': 2,
            'title': 'Анализ коммуникаций Сбербанка',
            'description': 'Университетский проект по анализу рекламной стратегии и ребрендинга ПАО «Сбербанк»',
            'category': 'Аналитика',
            'year': '2024',
            'highlights': ['Анализ ребрендинга 2020', 'Исследование каналов продвижения', 'Оценка корпоративных ценностей'],
            'icon': 'chart-line'
        },
        {
            'id': 3,
            'title': 'Работы в Excel',
            'description': 'Создание медиапланов и аналитических таблиц для различных проектов',
            'category': 'Аналитика',
            'year': '2024',
            'highlights': ['Медиапланы для радиостанций', 'Аналитические таблицы', 'Работа с большими данными'],
            'icon': 'file-excel'
        },
        {
            'id': 4,
            'title': 'Работы в Figma',
            'description': 'Создание дизайн-макетов и визуальных материалов',
            'category': 'Дизайн',
            'year': '2024',
            'highlights': ['UI/UX дизайн', 'Визуальное оформление', 'Прототипирование'],
            'icon': 'palette'
        }
    ],
    'about': {
        'name': 'Анастасия',
        'title': 'Начинающий специалист по рекламе и PR',
        'description': 'Учусь создавать эффективные рекламные кампании и PR-стратегии, которые помогают брендам достигать своих целей и выделяться на рынке.',
        'experience': 'Начинающий',
        'projects': '7+',
        'awards': 'В процессе',
        'skills': [
            'Маркетинговый анализ',
            'Визуальный дизайн',
            'Контент-стратегия',
            'SWOT-анализ',
            'Брендинг',
            'Работа в Canva, Figma',
            'Создание сайтов на Tilda',
            'Excel и аналитика'
        ]
    }
}

@app.route('/')
def index():
    """Главная страница"""
    return render_template('index.html', 
                         cases=PORTFOLIO_DATA['cases'], 
                         about=PORTFOLIO_DATA['about'])

@app.route('/case/<int:case_id>')
def case_detail(case_id):
    """Детальная страница кейса"""
    case = next((c for c in PORTFOLIO_DATA['cases'] if c['id'] == case_id), None)
    if not case:
        return redirect(url_for('index'))
    return render_template('case_detail.html', case=case)

@app.route('/api/cases')
def api_cases():
    """API для получения всех кейсов"""
    return jsonify(PORTFOLIO_DATA['cases'])

@app.route('/api/case/<int:case_id>')
def api_case(case_id):
    """API для получения конкретного кейса"""
    case = next((c for c in PORTFOLIO_DATA['cases'] if c['id'] == case_id), None)
    if not case:
        return jsonify({'error': 'Case not found'}), 404
    return jsonify(case)

@app.route('/contact', methods=['POST'])
def contact():
    """Обработка формы обратной связи"""
    try:
        name = request.form.get('name')
        email = request.form.get('email')
        subject = 'Новое сообщение с портфолио'
        message = request.form.get('message')
        
        if not all([name, email, message]):
            return jsonify({'success': False, 'error': 'Все поля обязательны для заполнения'}), 400
        
        # Сохранение сообщения в файл (в реальном проекте - в базу данных)
        contact_data = {
            'name': name,
            'email': email,
            'subject': subject,
            'message': message,
            'timestamp': datetime.now().isoformat()
        }
        
        # Создаем папку для сообщений если её нет
        os.makedirs('messages', exist_ok=True)
        
        # Сохраняем сообщение
        filename = f"messages/message_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(contact_data, f, ensure_ascii=False, indent=2)
        
        # Отправка email (если настроен)
        try:
            if app.config['MAIL_USERNAME']:
                msg = Message(
                    subject=f"Портфолио: {subject}",
                    recipients=[app.config['MAIL_USERNAME']],
                    body=f"""
Новое сообщение с портфолио:

Имя: {name}
Email: {email}
Тема: {subject}

Сообщение:
{message}

Время отправки: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
                    """
                )
                mail.send(msg)
        except Exception as e:
            print(f"Ошибка отправки email: {e}")
        
        return jsonify({'success': True, 'message': 'Сообщение успешно отправлено!'})
        
    except Exception as e:
        return jsonify({'success': False, 'error': f'Произошла ошибка: {str(e)}'}), 500

@app.route('/api/stats')
def api_stats():
    """API для получения статистики портфолио"""
    stats = {
        'total_cases': len(PORTFOLIO_DATA['cases']),
        'categories': list(set([case['category'] for case in PORTFOLIO_DATA['cases']])),
        'years': list(set([case['year'] for case in PORTFOLIO_DATA['cases']])),
        'experience': PORTFOLIO_DATA['about']['experience'],
        'projects': PORTFOLIO_DATA['about']['projects'],
        'awards': PORTFOLIO_DATA['about']['awards']
    }
    return jsonify(stats)

@app.route('/admin/messages')
def admin_messages():
    """Просмотр сообщений (простая админ-панель)"""
    messages = []
    messages_dir = 'messages'
    
    if os.path.exists(messages_dir):
        for filename in sorted(os.listdir(messages_dir), reverse=True):
            if filename.endswith('.json'):
                try:
                    with open(os.path.join(messages_dir, filename), 'r', encoding='utf-8') as f:
                        message = json.load(f)
                        messages.append(message)
                except Exception as e:
                    print(f"Ошибка чтения файла {filename}: {e}")
    
    return jsonify(messages)

@app.route('/other-projects')
def other_projects():
    """Страница с другими проектами"""
    return render_template('other_projects.html', 
                         projects=PORTFOLIO_DATA['other_projects'],
                         about=PORTFOLIO_DATA['about'])

@app.route('/test-images')
def test_images():
    """Тестовая страница для проверки изображений"""
    import os
    images_path = os.path.join(app.static_folder, 'images')
    images = []
    
    # Проверяем существование папки
    if os.path.exists(images_path):
        for root, dirs, files in os.walk(images_path):
            for file in files:
                if file.lower().endswith(('.png', '.jpg', '.jpeg', '.gif')):
                    rel_path = os.path.relpath(os.path.join(root, file), app.static_folder)
                    images.append(rel_path.replace('\\', '/'))
    
    html = f"""
    <html>
    <head><title>Test Images</title></head>
    <body>
        <h1>Static folder: {app.static_folder}</h1>
        <h2>Images path: {images_path}</h2>
        <h2>Found {len(images)} images:</h2>
        <ul>
    """
    
    for img in images:
        url = url_for('static', filename=img)
        html += f'<li>{img} - <a href="{url}">{url}</a><br><img src="{url}" style="max-width: 200px; margin: 10px;"></li>'
    
    html += "</ul></body></html>"
    return html

@app.route('/test-static')
def test_static():
    """Тестовая страница для проверки статических файлов"""
    with open('test_image.html', 'r', encoding='utf-8') as f:
        return f.read()

@app.errorhandler(404)
def not_found(error):
    """Обработка 404 ошибки"""
    return render_template('index.html', 
                         cases=PORTFOLIO_DATA['cases'], 
                         about=PORTFOLIO_DATA['about']), 404

@app.errorhandler(500)
def server_error(error):
    """Обработка 500 ошибки"""
    return jsonify({'error': 'Внутренняя ошибка сервера'}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000) 