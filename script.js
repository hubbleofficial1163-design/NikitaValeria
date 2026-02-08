// script.js
class WeddingFormSender {
    constructor() {
        // Замените URL на ваш URL из Google Apps Script
        this.SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwDjrqyxAbt11fXsU0Ey_aee74L_BDKf4EqLMhnX6cxp4QfLA1o2h_Ih9ZXxKOT6JPg/exec';
    }

    showNotification(message, type = 'success') {
        const notification = document.getElementById('notification');
        notification.textContent = message;
        notification.className = `notification ${type} show`;
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 5000);
    }

    async sendFormData(formData) {
        try {
            const response = await fetch(this.SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors', // Важно для Google Apps Script
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            // Поскольку mode: 'no-cors', мы не можем проверить ответ
            // Но обычно если нет ошибки, запрос прошел успешно
            return true;
            
        } catch (error) {
            console.error('Ошибка:', error);
            return false;
        }
    }

    formatMessage(data) {
        // Эта функция больше не нужна для отправки,
        // но оставлю её для возможного использования
        const attendanceText = {
            'yes': 'С радостью приду!',
            'no': 'К сожалению, не смогу'
        }[data.attendance] || data.attendance;

        return `Имя: ${data.name}\nТелефон: ${data.phone}\nГостей: ${data.guests}\nПрисутствие: ${attendanceText}\nПожелания: ${data.message || 'нет'}`;
    }
}

// Музыкальный плеер
class MusicPlayer {
    constructor() {
        this.audio = document.getElementById('weddingMusic');
        this.toggleBtn = document.getElementById('musicToggle');
        this.isPlaying = false;
        this.init();
    }

    init() {
        this.audio.volume = 0.5;
        this.toggleBtn.addEventListener('click', () => this.toggleMusic());
        
        this.audio.addEventListener('error', (e) => {
            console.error('Ошибка загрузки музыки:', e);
            this.toggleBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i>';
            this.toggleBtn.title = 'Ошибка загрузки музыки';
        });
    }

    toggleMusic() {
        if (this.isPlaying) {
            this.pauseMusic();
        } else {
            this.playMusic();
        }
    }

    playMusic() {
        this.audio.play()
            .then(() => {
                this.isPlaying = true;
                this.toggleBtn.classList.add('playing');
                this.toggleBtn.innerHTML = '<i class="fas fa-volume-up"></i><span class="music-text">Музыка</span>';
            })
            .catch(error => {
                console.error('Ошибка воспроизведения:', error);
                if (error.name === 'NotAllowedError') {
                    alert('Пожалуйста, нажмите на кнопку "Музыка" для запуска фоновой музыки');
                }
            });
    }

    pauseMusic() {
        this.audio.pause();
        this.isPlaying = false;
        this.toggleBtn.classList.remove('playing');
        this.toggleBtn.innerHTML = '<i class="fas fa-music"></i><span class="music-text">Музыка</span>';
    }
}

// Календарь
class WeddingCalendar {
    constructor() {
        this.currentDate = new Date(2026, 6, 4);
        this.weddingDate = new Date(2026, 6, 4);
        this.init();
    }

    init() {
        this.renderCalendar();
        document.getElementById('prevMonth').addEventListener('click', () => this.changeMonth(-1));
        document.getElementById('nextMonth').addEventListener('click', () => this.changeMonth(1));
    }

    changeMonth(direction) {
        this.currentDate.setMonth(this.currentDate.getMonth() + direction);
        this.renderCalendar();
    }

    renderCalendar() {
        const monthYear = document.getElementById('currentMonthYear');
        const calendarDays = document.getElementById('calendarDays');
        
        const monthNames = [
            'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
            'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
        ];

        monthYear.textContent = `${monthNames[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}`;
        calendarDays.innerHTML = '';

        const firstDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
        const lastDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0);
        const daysInMonth = lastDay.getDate();
        
        let firstDayOfWeek = firstDay.getDay();
        if (firstDayOfWeek === 0) firstDayOfWeek = 6;
        else firstDayOfWeek--;

        for (let i = 0; i < firstDayOfWeek; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'calendar-day other-month';
            calendarDays.appendChild(emptyDay);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            dayElement.textContent = day;

            if (this.currentDate.getMonth() === this.weddingDate.getMonth() &&
                this.currentDate.getFullYear() === this.weddingDate.getFullYear() &&
                day === this.weddingDate.getDate()) {
                dayElement.classList.add('wedding-day');
            }

            calendarDays.appendChild(dayElement);
        }

        const totalCells = firstDayOfWeek + daysInMonth;
        const remainingCells = 7 - (totalCells % 7);
        
        if (remainingCells < 7) {
            for (let i = 0; i < remainingCells; i++) {
                const emptyDay = document.createElement('div');
                emptyDay.className = 'calendar-day other-month';
                calendarDays.appendChild(emptyDay);
            }
        }
    }
}

// Мини-уведомление о музыке
class MiniMusicNotification {
    constructor() {
        this.notification = document.getElementById('musicNotification');
        this.closeBtn = document.getElementById('closeMusicNotification');
        this.musicBtn = document.getElementById('musicToggle');
        this.shownKey = 'miniMusicNotificationShown';
        this.init();
    }

    init() {
        setTimeout(() => this.showNotification(), 1000);
        this.closeBtn.addEventListener('click', () => this.hideNotification());
        this.musicBtn.addEventListener('click', () => {
            setTimeout(() => this.hideNotification(), 500);
        });
        setTimeout(() => this.hideNotification(), 10000);
    }

    showNotification() {
        if (!localStorage.getItem(this.shownKey)) {
            this.notification.classList.remove('hidden');
        }
    }

    hideNotification() {
        this.notification.classList.add('hidden');
        localStorage.setItem(this.shownKey, 'true');
    }
}

// Инициализация приложения
document.addEventListener('DOMContentLoaded', () => {
    const miniMusicNotification = new MiniMusicNotification();
    const musicPlayer = new MusicPlayer();
    const weddingCalendar = new WeddingCalendar();
    const formSender = new WeddingFormSender();
    
    // Анимации при скролле
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    const formGroups = document.querySelectorAll('.form-group');
    formGroups.forEach(group => observer.observe(group));
    
    // Плавная прокрутка
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Обработка отправки формы
    document.getElementById('weddingForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = document.querySelector('.submit-button');
        const originalText = submitBtn.textContent;
        
        submitBtn.disabled = true;
        submitBtn.textContent = 'Отправка...';
        formSender.showNotification('Отправляем ваш ответ...', 'loading');
        
        try {
            const attendanceRadio = document.querySelector('input[name="attendance"]:checked');
            
            if (!attendanceRadio) {
                throw new Error('Пожалуйста, выберите вариант присутствия');
            }
            
            const formData = {
                name: document.getElementById('name').value.trim(),
                phone: document.getElementById('phone').value.trim(),
                guests: document.getElementById('guests').value,
                attendance: attendanceRadio.value,
                message: document.getElementById('message').value.trim()
            };
            
            // Валидация
            if (!formData.name || !formData.phone) {
                throw new Error('Пожалуйста, заполните обязательные поля');
            }
            
            // Валидация телефона
            const phoneRegex = /^[+]?[78]?[\s(]?[0-9]{3}[)\s]?[0-9]{3}[\s-]?[0-9]{2}[\s-]?[0-9]{2}$/;
            if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
                throw new Error('Пожалуйста, введите корректный номер телефона');
            }
            
            const success = await formSender.sendFormData(formData);
            
            if (success) {
                formSender.showNotification('✅ Спасибо! Ваш ответ сохранен.', 'success');
                e.target.reset();
            } else {
                formSender.showNotification('❌ Ошибка отправки. Пожалуйста, попробуйте еще раз.', 'error');
            }
        } catch (error) {
            formSender.showNotification(`❌ ${error.message}`, 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    });

    // Предзагрузка изображений
    window.addEventListener('load', function() {
        const images = ['1.jpg', '4.jpg', '5.jpg', '7.jpg'];
        images.forEach(img => {
            const image = new Image();
            image.src = img;
        });
        
        // Предзагрузка музыки
        const audio = document.getElementById('weddingMusic');
        audio.load();
    });
});

