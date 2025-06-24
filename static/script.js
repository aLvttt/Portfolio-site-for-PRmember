// Мобильное меню
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Закрытие мобильного меню при клике на ссылку и плавная прокрутка
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', (e) => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
    
    // Плавная прокрутка для якорных ссылок
    const href = n.getAttribute('href');
    if (href && href.startsWith('#')) {
        e.preventDefault();
        const targetId = href.substring(1);
        scrollToSection(targetId);
    }
}));

// Закрытие меню при клике вне его области
document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// Плавная прокрутка
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        // Получаем высоту навигационной панели
        const navbar = document.querySelector('.navbar');
        const navbarHeight = navbar ? navbar.offsetHeight : 70;
        
        // Прокручиваем с учетом высоты навигации
        const elementPosition = element.offsetTop - navbarHeight;
        
        window.scrollTo({
            top: elementPosition,
            behavior: 'smooth'
        });
    }
}

// Активная навигация при скролле
window.addEventListener('scroll', () => {
    updateActiveNavigation();
});

// Анимация появления элементов при скролле
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Добавляем класс fade-in к элементам, которые должны анимироваться
document.addEventListener('DOMContentLoaded', () => {
    const elementsToAnimate = document.querySelectorAll('.case-card, .contact-item, .section-title, .section-subtitle, .project-card, .work-preview-card, .other-works-cta');
    elementsToAnimate.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
    
    // Устанавливаем правильную активную навигацию при загрузке
    updateActiveNavigation();
    
    // Форма контактов удалена, обработчик больше не нужен
    initOtherWorksCards();
});

// Функция для обновления активной навигации
function updateActiveNavigation() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbar = document.querySelector('.navbar');
    const navbarHeight = navbar ? navbar.offsetHeight : 70;
    
    let current = '';
    const scrollPos = window.pageYOffset + navbarHeight + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;
        
        if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
            current = section.getAttribute('id');
        }
        
        if (section.getAttribute('id') === 'contact' && 
            scrollPos >= sectionTop - 200) {
            current = 'contact';
        }
    });
    
    if (window.pageYOffset < 100) {
        current = 'home';
    }

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// Карточки кейсов теперь работают как обычные ссылки - обработчик не нужен

// Функция открытия модального окна кейса
function openCaseModal(caseNumber) {
    // Создаем модальное окно
    const modal = document.createElement('div');
    modal.className = 'case-modal';
    modal.innerHTML = `
        <div class="modal-overlay" onclick="closeCaseModal()"></div>
        <div class="modal-content">
            <button class="modal-close" onclick="closeCaseModal()">
                <i class="fas fa-times"></i>
            </button>
            <div class="modal-header">
                <h2>Кейс ${caseNumber}</h2>
                <p>Подробная информация о проекте</p>
            </div>
            <div class="modal-body">
                <div class="case-details">
                    <div class="case-image-large">
                        <div class="case-placeholder-large">
                            <i class="fas fa-${getCaseIcon(caseNumber)}"></i>
                        </div>
                    </div>
                    <div class="case-info">
                        <h3>Описание проекта</h3>
                        <p>Здесь будет подробное описание кейса ${caseNumber}. Вы сможете добавить информацию о целях, задачах, решениях и результатах проекта.</p>
                        
                        <h3>Задачи</h3>
                        <ul>
                            <li>Задача 1 для кейса ${caseNumber}</li>
                            <li>Задача 2 для кейса ${caseNumber}</li>
                            <li>Задача 3 для кейса ${caseNumber}</li>
                        </ul>
                        
                        <h3>Результаты</h3>
                        <p>Описание достигнутых результатов и метрик успеха проекта.</p>
                        
                        <div class="case-tags-large">
                            ${getCaseTags(caseNumber)}
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary" onclick="closeCaseModal()">
                    <i class="fas fa-arrow-left"></i>
                    Вернуться к кейсам
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // Анимация появления
    setTimeout(() => {
        modal.classList.add('active');
    }, 10);
}

// Функция закрытия модального окна
function closeCaseModal() {
    const modal = document.querySelector('.case-modal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            document.body.removeChild(modal);
            document.body.style.overflow = 'auto';
        }, 300);
    }
}

// Вспомогательные функции для кейсов
function getCaseIcon(caseNumber) {
    const icons = {
        '1': 'ad',
        '2': 'bullhorn',
        '3': 'chart-bar'
    };
    return icons[caseNumber] || 'briefcase';
}

function getCaseTags(caseNumber) {
    const tags = {
        '1': ['Реклама', 'SMM', 'Креатив'],
        '2': ['PR', 'Event', 'Коммуникации'],
        '3': ['Стратегия', 'Аналитика', 'Исследования']
    };
    
    return tags[caseNumber].map(tag => `<span class="tag">${tag}</span>`).join('');
}

// Параллакс эффект для главной секции
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.floating-elements .element');
    
    parallaxElements.forEach((element, index) => {
        const speed = 0.5 + (index * 0.1);
        const yPos = -(scrolled * speed);
        element.style.transform = `translateY(${yPos}px)`;
    });
});

// Эффект печатающегося текста для заголовка
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Инициализация эффектов при загрузке страницы
window.addEventListener('load', () => {
    // Добавляем эффект печатающегося текста (опционально)
    // const nameElement = document.querySelector('.title-name');
    // if (nameElement) {
    //     typeWriter(nameElement, nameElement.textContent, 150);
    // }
    
    // Анимация счетчиков (если будут добавлены)
    animateCounters();
});

// Функция анимации счетчиков
function animateCounters() {
    const counters = document.querySelectorAll('.counter');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const increment = target / 100;
        let current = 0;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                counter.textContent = Math.ceil(current);
                setTimeout(updateCounter, 20);
            } else {
                counter.textContent = target;
            }
        };
        
        updateCounter();
    });
}

// Обработка формы контактов удалена - теперь только контактная информация

// Функция показа уведомлений
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check' : 'info'}-circle"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Обработка клавиатурных сокращений
document.addEventListener('keydown', (e) => {
    // ESC для закрытия модального окна
    if (e.key === 'Escape') {
        closeCaseModal();
    }
    
    // Навигация по кейсам стрелками
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        const modal = document.querySelector('.case-modal.active');
        if (modal) {
            // Логика переключения между кейсами
            // Можно добавить позже
        }
    }
});

// Добавляем стили для модального окна и уведомлений
const additionalStyles = `
<style>
.case-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 2000;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
}

.case-modal.active {
    opacity: 1;
    visibility: visible;
}

.modal-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(5px);
}

.modal-content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(0.8);
    width: 90%;
    max-width: 800px;
    max-height: 90vh;
    background: white;
    border-radius: 20px;
    overflow: hidden;
    transition: all 0.3s ease;
    box-shadow: var(--shadow-xl);
}

.case-modal.active .modal-content {
    transform: translate(-50%, -50%) scale(1);
}

.modal-close {
    position: absolute;
    top: 1rem;
    right: 1rem;
    width: 40px;
    height: 40px;
    border: none;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 50%;
    cursor: pointer;
    z-index: 10;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
}

.modal-close:hover {
    background: white;
    transform: scale(1.1);
}

.modal-header {
    padding: 2rem;
    background: var(--gradient-1);
    color: white;
    text-align: center;
}

.modal-header h2 {
    font-size: 2rem;
    margin-bottom: 0.5rem;
}

.modal-body {
    padding: 2rem;
    max-height: 60vh;
    overflow-y: auto;
}

.case-details {
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 2rem;
    align-items: start;
}

.case-image-large {
    height: 200px;
    background: var(--background-light);
    border-radius: 15px;
    overflow: hidden;
}

.case-placeholder-large {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 3rem;
    color: var(--primary-color);
}

.case-info h3 {
    color: var(--text-primary);
    margin: 1.5rem 0 0.5rem 0;
    font-size: 1.25rem;
}

.case-info h3:first-child {
    margin-top: 0;
}

.case-info ul {
    padding-left: 1.5rem;
    margin-bottom: 1rem;
}

.case-info li {
    margin-bottom: 0.5rem;
    color: var(--text-secondary);
}

.case-tags-large {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
    margin-top: 1rem;
}

.modal-footer {
    padding: 1.5rem 2rem;
    background: var(--background-light);
    text-align: center;
}

.notification {
    position: fixed;
    top: 2rem;
    right: 2rem;
    background: white;
    padding: 1rem 1.5rem;
    border-radius: 10px;
    box-shadow: var(--shadow-lg);
    z-index: 3000;
    transform: translateX(100%);
    transition: all 0.3s ease;
}

.notification.show {
    transform: translateX(0);
}

.notification-content {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.notification-success {
    border-left: 4px solid #10b981;
}

.notification-success i {
    color: #10b981;
}

@media (max-width: 768px) {
    .modal-content {
        width: 95%;
        max-height: 95vh;
    }
    
    .case-details {
        grid-template-columns: 1fr;
        gap: 1rem;
    }
    
    .modal-header,
    .modal-body,
    .modal-footer {
        padding: 1rem;
    }
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', additionalStyles);

// Дополнительные интерактивные эффекты
document.addEventListener('DOMContentLoaded', () => {
    // Анимация печатающегося текста для заголовка
    const titleName = document.querySelector('.title-name');
    if (titleName && titleName.textContent !== '[Ваше имя]') {
        const text = titleName.textContent;
        titleName.textContent = '';
        titleName.style.borderRight = '2px solid var(--primary-color)';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                titleName.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            } else {
                setTimeout(() => {
                    titleName.style.borderRight = 'none';
                }, 1000);
            }
        };
        
        setTimeout(typeWriter, 1000);
    }
    
    // Добавляем преследователь курсора только на десктопе
    if (!isMobileDevice()) {
        initCursorFollower();
    }
    
    // Анимация при наведении на карточки кейсов
    addCardHoverEffects();
});

// Функция для определения мобильных устройств
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
           window.innerWidth <= 768 ||
           ('ontouchstart' in window);
}

// Элемент-преследователь курсора
function initCursorFollower() {
    const follower = document.createElement('div');
    follower.className = 'cursor-follower';
    document.body.appendChild(follower);
    
    const trail = document.createElement('div');
    trail.className = 'cursor-trail';
    document.body.appendChild(trail);
    
    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;
    let trailX = 0, trailY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    function animateFollower() {
        // Основной преследователь (быстрый)
        followerX += (mouseX - followerX) * 0.15;
        followerY += (mouseY - followerY) * 0.15;
        
        // След (медленный)
        trailX += (mouseX - trailX) * 0.05;
        trailY += (mouseY - trailY) * 0.05;
        
        follower.style.left = followerX + 'px';
        follower.style.top = followerY + 'px';
        
        trail.style.left = trailX + 'px';
        trail.style.top = trailY + 'px';
        
        requestAnimationFrame(animateFollower);
    }
    
    animateFollower();
    
    // Эффекты при наведении на интерактивные элементы
    const interactiveElements = document.querySelectorAll('a, button, .case-card, .contact-item');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            follower.classList.add('hover');
            trail.classList.add('hover');
        });
        
        element.addEventListener('mouseleave', () => {
            follower.classList.remove('hover');
            trail.classList.remove('hover');
        });
    });
}

// Дополнительные эффекты для карточек кейсов
function addCardHoverEffects() {
    const cards = document.querySelectorAll('.case-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', (e) => {
            // Создаем светящийся эффект
            const glow = document.createElement('div');
            glow.className = 'card-glow';
            card.appendChild(glow);
            
            // Эффект частиц при наведении
            createParticleEffect(e.currentTarget);
        });
        
        card.addEventListener('mouseleave', (e) => {
            const glow = e.currentTarget.querySelector('.card-glow');
            if (glow) {
                glow.remove();
            }
        });
        
        // 3D эффект при движении мыши (исправлен для устранения дёрганья в центре)
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Вычисляем смещение от центра
            const deltaX = x - centerX;
            const deltaY = y - centerY;
            
            // Создаём мёртвую зону в центре (20px радиус)
            const deadZone = 20;
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            
            if (distance > deadZone) {
                // Применяем эффект только вне мёртвой зоны
                const rotateX = Math.max(-15, Math.min(15, deltaY / 8));
                const rotateY = Math.max(-15, Math.min(15, -deltaX / 8));
                
                card.style.transform = `translateY(-10px) scale(1.01) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            } else {
                // В мёртвой зоне - только базовый hover эффект
                card.style.transform = `translateY(-10px) scale(1.01)`;
            }
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
}

// Создание эффекта частиц при наведении
function createParticleEffect(element) {
    for (let i = 0; i < 6; i++) {
        const particle = document.createElement('div');
        particle.className = 'hover-particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 0.5 + 's';
        
        element.appendChild(particle);
        
        setTimeout(() => {
            particle.remove();
        }, 1000);
    }
}

// Добавляем стили для новых интерактивных элементов
const interactiveStyles = `
<style>
.cursor-follower {
    position: fixed;
    width: 20px;
    height: 20px;
    background: var(--gradient-1);
    border-radius: 50%;
    pointer-events: none;
    z-index: 9999;
    transform: translate(-50%, -50%);
    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    box-shadow: 0 0 20px rgba(248, 187, 217, 0.4);
    animation: cursorPulse 2s ease-in-out infinite;
}

.cursor-trail {
    position: fixed;
    width: 8px;
    height: 8px;
    background: var(--gradient-accent);
    border-radius: 50%;
    pointer-events: none;
    z-index: 9998;
    transform: translate(-50%, -50%);
    opacity: 0.6;
    box-shadow: 0 0 15px rgba(78, 205, 196, 0.3);
}

.cursor-follower.hover {
    width: 40px;
    height: 40px;
    background: var(--gradient-accent);
    box-shadow: 0 0 30px rgba(78, 205, 196, 0.6);
}

.cursor-trail.hover {
    width: 15px;
    height: 15px;
    background: var(--gradient-1);
    opacity: 0.8;
    box-shadow: 0 0 25px rgba(248, 187, 217, 0.5);
}

@keyframes cursorPulse {
    0%, 100% {
        transform: translate(-50%, -50%) scale(1);
        opacity: 0.6;
    }
    50% {
        transform: translate(-50%, -50%) scale(1.2);
        opacity: 0.8;
    }
}

@media (max-width: 768px), (hover: none) {
    .cursor-follower,
    .cursor-trail {
        display: none !important;
    }
}

.card-glow {
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: var(--gradient-accent);
    border-radius: 22px;
    z-index: -1;
    opacity: 0.25;
    filter: blur(10px);
    animation: glowPulse 3s ease-in-out infinite;
}

@keyframes glowPulse {
    0%, 100% { 
        opacity: 0.2; 
        transform: scale(1);
    }
    50% { 
        opacity: 0.4; 
        transform: scale(1.02);
    }
}

.hover-particle {
    position: absolute;
    width: 4px;
    height: 4px;
    background: var(--primary-color);
    border-radius: 50%;
    pointer-events: none;
    animation: particleRise 1s ease-out forwards;
}

@keyframes particleRise {
    0% {
        transform: translateY(0) scale(1);
        opacity: 1;
    }
    100% {
        transform: translateY(-50px) scale(0);
        opacity: 0;
    }
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', interactiveStyles);

// Магнитный эффект для кнопок и карточек (с улучшенной стабильностью)
function initMagneticEffect() {
    const magneticElements = document.querySelectorAll('.btn, .contact-item');
    
    magneticElements.forEach(element => {
        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            const distance = Math.sqrt(x * x + y * y);
            const maxDistance = 100;
            const deadZone = 15; // Мёртвая зона для стабильности
            
            if (distance < maxDistance && distance > deadZone) {
                const strength = (maxDistance - distance) / maxDistance;
                const moveX = x * strength * 0.15; // Ещё меньше силы эффекта
                const moveY = y * strength * 0.15;
                
                element.style.transform = `translate(${moveX}px, ${moveY}px)`;
            } else if (distance <= deadZone) {
                // В мёртвой зоне - никаких трансформаций
                element.style.transform = `translate(0px, 0px)`;
            }
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.transform = '';
        });
    });
}

// Пульсирующие акценты на кнопках
function initPulsingAccents() {
    const buttons = document.querySelectorAll('.btn-primary');
    
    buttons.forEach(button => {
        // Создаем пульсирующий элемент
        const pulse = document.createElement('div');
        pulse.className = 'btn-pulse';
        button.style.position = 'relative';
        button.appendChild(pulse);
        
        // Случайная задержка для каждой кнопки
        pulse.style.animationDelay = Math.random() * 3 + 's';
    });
}

// Элегантный прогресс скролла
function initScrollProgress() {
    // Создаем прогресс бар
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        progressBar.style.width = scrollPercent + '%';
    });
}

// Инициализация новых эффектов
document.addEventListener('DOMContentLoaded', () => {
    initMagneticEffect();
    initPulsingAccents();
    initScrollProgress();
});

// Дополнительные стили для новых эффектов
const magneticStyles = `
<style>
.btn-pulse {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100%;
    height: 100%;
    border-radius: inherit;
    background: var(--gradient-accent);
    opacity: 0;
    transform: translate(-50%, -50%);
    animation: btnPulse 4s ease-in-out infinite;
    z-index: -1;
}

@keyframes btnPulse {
    0%, 90%, 100% {
        opacity: 0;
        transform: translate(-50%, -50%) scale(1);
    }
    45% {
        opacity: 0.3;
        transform: translate(-50%, -50%) scale(1.1);
    }
}

/* Улучшенные переходы для магнитного эффекта */
.btn, .case-card, .contact-item {
    transition: transform 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
}

/* Дополнительный световой эффект при наведении */
.case-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: var(--gradient-1);
    opacity: 0;
    border-radius: inherit;
    transition: opacity 0.3s ease;
    z-index: -1;
}

.case-card:hover::before {
    opacity: 0.05;
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', magneticStyles);

// Стили для прогресс-бара скролла
const scrollProgressStyles = `
<style>
.scroll-progress {
    position: fixed;
    top: 0;
    left: 0;
    width: 0%;
    height: 3px;
    background: linear-gradient(90deg, var(--primary-color), var(--accent-color));
    z-index: 1000;
    transition: width 0.1s ease-out;
    box-shadow: 0 0 10px rgba(59, 130, 246, 0.3);
}

.scroll-progress::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 20px;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4));
    border-radius: 0 2px 2px 0;
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', scrollProgressStyles);

// Интерактивность для карточек других работ
function initOtherWorksCards() {
    const workCards = document.querySelectorAll('.work-preview-link');
    
    workCards.forEach(card => {
        // Добавляем эффект ripple при клике
        card.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = card.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple-effect');
            
            const cardElement = card.querySelector('.work-preview-card');
            cardElement.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
        
        // Добавляем магнитный эффект
        card.addEventListener('mousemove', function(e) {
            const cardElement = card.querySelector('.work-preview-card');
            const rect = cardElement.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const deltaX = (e.clientX - centerX) * 0.1;
            const deltaY = (e.clientY - centerY) * 0.1;
            
            cardElement.style.transform = `translateY(-8px) scale(1.02) translate(${deltaX}px, ${deltaY}px)`;
        });
        
        card.addEventListener('mouseleave', function() {
            const cardElement = card.querySelector('.work-preview-card');
            cardElement.style.transform = 'translateY(0) scale(1) translate(0, 0)';
        });
    });
}

 