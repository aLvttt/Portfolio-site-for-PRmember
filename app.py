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
            'title': 'Кампания "Новый взгляд"',
            'description': 'Комплексная рекламная кампания для модного бренда',
            'image': 'case1.jpg',
            'category': 'Брендинг',
            'year': '2023',
            'client': 'Fashion Brand X',
            'challenge': 'Необходимо было создать узнаваемый образ бренда и увеличить продажи на 30%',
            'solution': 'Разработана комплексная стратегия включающая ребрендинг, digital-кампанию и PR-активности',
            'results': ['Рост продаж на 45%', 'Увеличение узнаваемости бренда на 60%', 'Охват аудитории 2М+'],
            'technologies': ['Photoshop', 'Illustrator', 'Google Ads', 'Facebook Ads'],
            'images': ['case1-1.jpg', 'case1-2.jpg', 'case1-3.jpg']
        },
        {
            'id': 2,
            'title': 'Digital-стратегия "Эко-будущее"',
            'description': 'Цифровая кампания для экологической организации',
            'image': 'case2.jpg',
            'category': 'Digital',
            'year': '2023',
            'client': 'EcoFuture NGO',
            'challenge': 'Повысить осведомленность о экологических проблемах среди молодежи',
            'solution': 'Создана viral-кампания в социальных сетях с интерактивными элементами',
            'results': ['Вирусный охват 5М+', 'Рост подписчиков на 200%', '50К новых волонтеров'],
            'technologies': ['After Effects', 'TikTok Ads', 'Instagram', 'YouTube'],
            'images': ['case2-1.jpg', 'case2-2.jpg', 'case2-3.jpg']
        },
        {
            'id': 3,
            'title': 'PR-кампания "Инновации года"',
            'description': 'Запуск нового технологического продукта',
            'image': 'case3.jpg',
            'category': 'PR',
            'year': '2024',
            'client': 'TechStart Inc.',
            'challenge': 'Представить инновационный продукт на конкурентном рынке',
            'solution': 'Интегрированная PR-стратегия с медиа-турами и influencer-маркетингом',
            'results': ['100+ публикаций в СМИ', 'Рост инвестиций на 300%', 'Награда "Продукт года"'],
            'technologies': ['PR-tools', 'Media monitoring', 'Influencer platforms'],
            'images': ['case3-1.jpg', 'case3-2.jpg', 'case3-3.jpg']
        }
    ],
    'other_projects': [
        {
            'id': 1,
            'title': 'SMM для ресторана "Вкусный мир"',
            'description': 'Ведение социальных сетей и создание контента для семейного ресторана',
            'category': 'SMM',
            'year': '2023',
            'highlights': ['Рост подписчиков на 150%', 'Увеличение бронирований через соцсети на 80%', 'Создано 200+ постов'],
            'icon': 'utensils'
        },
        {
            'id': 2,
            'title': 'Event "Ночь искусств 2023"',
            'description': 'Организация и продвижение городского культурного мероприятия',
            'category': 'Event',
            'year': '2023',
            'highlights': ['5000+ посетителей', '20 площадок', 'Охват в СМИ 500К+'],
            'icon': 'palette'
        },
        {
            'id': 3,
            'title': 'Контент-стратегия для IT-стартапа',
            'description': 'Разработка и реализация контент-плана для B2B сегмента',
            'category': 'Content',
            'year': '2024',
            'highlights': ['50 лид-магнитов', 'Рост органического трафика на 200%', '30+ публикаций в индустриальных СМИ'],
            'icon': 'laptop-code'
        },
        {
            'id': 4,
            'title': 'Ребрендинг сети фитнес-клубов',
            'description': 'Полное обновление визуальной идентичности и коммуникационной стратегии',
            'category': 'Брендинг',
            'year': '2024',
            'highlights': ['Новый логотип и айдентика', 'Рост узнаваемости на 70%', 'Увеличение продаж абонементов на 40%'],
            'icon': 'dumbbell'
        }
    ],
    'about': {
        'name': 'Ваше Имя',
        'title': 'Специалист по рекламе и PR',
        'description': 'Создаю эффективные рекламные кампании и PR-стратегии, которые помогают брендам достигать своих целей и выделяться на рынке.',
        'experience': '5+ лет',
        'projects': '50+',
        'awards': '10+',
        'skills': [
            'Стратегическое планирование',
            'Креативные концепции',
            'Digital-маркетинг',
            'PR и медиа-отношения',
            'Брендинг',
            'Контент-маркетинг',
            'Аналитика и метрики',
            'Управление проектами'
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