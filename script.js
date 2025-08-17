// Portfolio Website JavaScript
// Author: akuthedev
// Description: Interactive functionality for the 3D portfolio website

class PortfolioWebsite {
    constructor() {
        this.isLoading = true;
        this.currentSection = 'home';
        this.scrollTimeout = null;
        this.observers = new Map();
        this.animatedElements = new Set();
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeTheme();
        this.setupIntersectionObservers();
        this.initializeAnimations();
        this.setupFormValidation();
        this.hideLoadingScreen();
        this.setupMobileOptimizations();
        this.initializeGame();
        this.setupCarAnimation();
    }

    // Event Listeners Setup
    setupEventListeners() {
        // Window events
        window.addEventListener('load', () => this.hideLoadingScreen());
        window.addEventListener('resize', () => this.debounce(this.handleResize.bind(this), 250));
        window.addEventListener('scroll', () => this.handleScroll());

        // Navigation events
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-scroll]')) {
                e.preventDefault();
                this.scrollToSection(e.target.getAttribute('data-scroll'));
            }
        });

        // Theme toggle
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }

        // Mobile menu toggle
        const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
        const navMenu = document.getElementById('nav-menu');
        
        if (mobileMenuToggle && navMenu) {
            mobileMenuToggle.addEventListener('click', () => {
                mobileMenuToggle.classList.toggle('active');
                navMenu.classList.toggle('active');
            });

            // Close mobile menu when clicking on a link
            navMenu.addEventListener('click', (e) => {
                if (e.target.matches('.nav-link')) {
                    mobileMenuToggle.classList.remove('active');
                    navMenu.classList.remove('active');
                }
            });
        }

        // Navigation links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.getAttribute('data-section');
                this.scrollToSection(section);
                this.setActiveNavLink(link);
            });
        });

        // Hero buttons
        document.querySelectorAll('[data-scroll]').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const section = button.getAttribute('data-scroll');
                this.scrollToSection(section);
            });
        });

        // Form submission
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => this.handleFormSubmit(e));
        }

        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyboardNavigation(e));

        // Touch events for mobile
        this.setupTouchEvents();
    }

    // Loading Screen Management
    hideLoadingScreen() {
        setTimeout(() => {
            const loadingScreen = document.getElementById('loading-screen');
            if (loadingScreen) {
                loadingScreen.classList.add('hidden');
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, 500);
            }
            this.isLoading = false;
            this.triggerInitialAnimations();
        }, 2000);
    }

    // Theme Management
    initializeTheme() {
        const savedTheme = localStorage.getItem('portfolio-theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const theme = savedTheme || (prefersDark ? 'dark' : 'light');
        
        document.documentElement.setAttribute('data-theme', theme);
        this.updateThemeToggle(theme);
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('portfolio-theme', newTheme);
        this.updateThemeToggle(newTheme);
        
        // Add a smooth transition effect
        document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 300);
    }

    updateThemeToggle(theme) {
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            const sunIcon = themeToggle.querySelector('.sun-icon');
            const moonIcon = themeToggle.querySelector('.moon-icon');
            
            if (theme === 'dark') {
                sunIcon.style.display = 'none';
                moonIcon.style.display = 'inline';
            } else {
                sunIcon.style.display = 'inline';
                moonIcon.style.display = 'none';
            }
        }
    }

    // Scroll Management
    handleScroll() {
        if (this.scrollTimeout) {
            clearTimeout(this.scrollTimeout);
        }

        this.scrollTimeout = setTimeout(() => {
            this.updateActiveSection();
            this.updateNavbarOpacity();
        }, 10);
    }

    updateActiveSection() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + window.innerHeight / 2;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                if (this.currentSection !== sectionId) {
                    this.currentSection = sectionId;
                    this.updateActiveNavLink();
                }
            }
        });
    }

    updateActiveNavLink(clickedLink = null) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });

        if (clickedLink) {
            clickedLink.classList.add('active');
        } else {
            const activeLink = document.querySelector(`[data-section="${this.currentSection}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }
    }

    updateNavbarOpacity() {
        const navbar = document.getElementById('navbar');
        const scrolled = window.scrollY > 50;
        
        if (navbar) {
            navbar.style.background = scrolled ? 
                'rgba(255, 255, 255, 0.95)' : 
                'rgba(255, 255, 255, 0.8)';
            
            if (document.documentElement.getAttribute('data-theme') === 'dark') {
                navbar.style.background = scrolled ? 
                    'rgba(15, 23, 42, 0.95)' : 
                    'rgba(15, 23, 42, 0.8)';
            }
        }
    }

    scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            const navbarHeight = document.getElementById('navbar').offsetHeight;
            const sectionTop = section.offsetTop - navbarHeight;
            
            window.scrollTo({
                top: sectionTop,
                behavior: 'smooth'
            });
            
            // Trigger car animation when navigating to new section
            this.triggerCarAnimation();
        }
    }

    setActiveNavLink(clickedLink) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        clickedLink.classList.add('active');
    }

    // Intersection Observer for Animations
    setupIntersectionObservers() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.animatedElements.has(entry.target)) {
                    this.animateElement(entry.target);
                    this.animatedElements.add(entry.target);
                }
            });
        }, observerOptions);

        // Observe elements for animation
        document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in').forEach(el => {
            animationObserver.observe(el);
        });

        // Observe skill bars
        const skillsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateSkillBars();
                }
            });
        }, { threshold: 0.5 });

        const skillsSection = document.getElementById('skills');
        if (skillsSection) {
            skillsObserver.observe(skillsSection);
        }

        // Observe stats counter
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateStatsCounters();
                }
            });
        }, { threshold: 0.5 });

        const aboutSection = document.getElementById('about');
        if (aboutSection) {
            statsObserver.observe(aboutSection);
        }

        this.observers.set('animation', animationObserver);
        this.observers.set('skills', skillsObserver);
        this.observers.set('stats', statsObserver);
    }

    animateElement(element) {
        element.classList.add('visible');
    }

    // Skill Bars Animation
    animateSkillBars() {
        const skillProgresses = document.querySelectorAll('.skill-progress');
        
        skillProgresses.forEach((progress, index) => {
            const width = progress.getAttribute('data-width');
            setTimeout(() => {
                progress.style.width = width + '%';
            }, index * 200);
        });
    }

    // Stats Counter Animation
    animateStatsCounters() {
        const statNumbers = document.querySelectorAll('.stat-number');
        
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'));
            const duration = 2000; // 2 seconds
            const step = target / (duration / 16); // 60fps
            let current = 0;
            
            const counter = setInterval(() => {
                current += step;
                if (current >= target) {
                    current = target;
                    clearInterval(counter);
                }
                stat.textContent = Math.floor(current);
            }, 16);
        });
    }

    // Initial Animations
    initializeAnimations() {
        // Add animation classes to elements
        const elementsToAnimate = [
            { selector: '.hero-text', class: 'fade-in' },
            { selector: '.about-card', class: 'slide-in-left' },
            { selector: '.about-visual', class: 'slide-in-right' },
            { selector: '.skill-category', class: 'scale-in' },
            { selector: '.project-card', class: 'fade-in' },
            { selector: '.contact-item', class: 'slide-in-left' },
            { selector: '.contact-form', class: 'slide-in-right' }
        ];

        elementsToAnimate.forEach(({ selector, class: className }) => {
            document.querySelectorAll(selector).forEach((el, index) => {
                el.classList.add(className);
                el.style.animationDelay = `${index * 0.1}s`;
            });
        });
    }

    triggerInitialAnimations() {
        // Trigger hero section animations
        const heroElements = document.querySelectorAll('.hero-section .fade-in');
        heroElements.forEach((el, index) => {
            setTimeout(() => {
                el.classList.add('visible');
            }, index * 200);
        });
    }

    // Form Validation and Submission
    setupFormValidation() {
        const form = document.getElementById('contact-form');
        if (!form) return;

        const inputs = form.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
    }

    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        let isValid = true;
        let errorMessage = '';

        // Clear previous error
        this.clearFieldError(field);

        // Validation rules
        switch (fieldName) {
            case 'name':
                if (!value) {
                    errorMessage = 'Name is required';
                    isValid = false;
                } else if (value.length < 2) {
                    errorMessage = 'Name must be at least 2 characters';
                    isValid = false;
                }
                break;

            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!value) {
                    errorMessage = 'Email is required';
                    isValid = false;
                } else if (!emailRegex.test(value)) {
                    errorMessage = 'Please enter a valid email address';
                    isValid = false;
                }
                break;

            case 'subject':
                if (!value) {
                    errorMessage = 'Subject is required';
                    isValid = false;
                } else if (value.length < 5) {
                    errorMessage = 'Subject must be at least 5 characters';
                    isValid = false;
                }
                break;

            case 'message':
                if (!value) {
                    errorMessage = 'Message is required';
                    isValid = false;
                } else if (value.length < 10) {
                    errorMessage = 'Message must be at least 10 characters';
                    isValid = false;
                }
                break;
        }

        if (!isValid) {
            this.showFieldError(field, errorMessage);
        }

        return isValid;
    }

    showFieldError(field, message) {
        field.classList.add('error');
        const errorElement = document.getElementById(`${field.name}-error`);
        if (errorElement) {
            errorElement.textContent = message;
        }
    }

    clearFieldError(field) {
        field.classList.remove('error');
        const errorElement = document.getElementById(`${field.name}-error`);
        if (errorElement) {
            errorElement.textContent = '';
        }
    }

    async handleFormSubmit(e) {
        e.preventDefault();
        
        const form = e.target;
        const submitButton = form.querySelector('.form-submit');
        const successMessage = document.getElementById('form-success');
        
        // Validate all fields
        const inputs = form.querySelectorAll('input, textarea');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        if (!isValid) {
            return;
        }

        // Show loading state
        submitButton.classList.add('loading');
        submitButton.disabled = true;

        try {
            // Simulate form submission (replace with actual API call)
            await this.simulateFormSubmission(new FormData(form));
            
            // Show success message
            successMessage.classList.add('show');
            form.reset();
            
            // Hide success message after 5 seconds
            setTimeout(() => {
                successMessage.classList.remove('show');
            }, 5000);
            
        } catch (error) {
            console.error('Form submission error:', error);
            alert('There was an error sending your message. Please try again.');
        } finally {
            // Reset button state
            submitButton.classList.remove('loading');
            submitButton.disabled = false;
        }
    }

    simulateFormSubmission(formData) {
        // Simulate API call
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('Form submitted with data:', Object.fromEntries(formData));
                resolve();
            }, 2000);
        });
    }

    // Touch Events for Mobile
    setupTouchEvents() {
        let touchStartY = 0;
        let touchEndY = 0;

        document.addEventListener('touchstart', (e) => {
            touchStartY = e.changedTouches[0].screenY;
        });

        document.addEventListener('touchend', (e) => {
            touchEndY = e.changedTouches[0].screenY;
            this.handleSwipeGesture();
        });
    }

    handleSwipeGesture() {
        const swipeThreshold = 50;
        const diff = touchStartY - touchEndY;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe up - next section
                this.navigateToNextSection();
            } else {
                // Swipe down - previous section
                this.navigateToPreviousSection();
            }
        }
    }

    navigateToNextSection() {
        const sections = ['home', 'about', 'skills', 'projects', 'game', 'contact'];
        const currentIndex = sections.indexOf(this.currentSection);
        const nextIndex = (currentIndex + 1) % sections.length;
        this.scrollToSection(sections[nextIndex]);
        this.triggerCarAnimation();
    }

    navigateToPreviousSection() {
        const sections = ['home', 'about', 'skills', 'projects', 'game', 'contact'];
        const currentIndex = sections.indexOf(this.currentSection);
        const prevIndex = (currentIndex - 1 + sections.length) % sections.length;
        this.scrollToSection(sections[prevIndex]);
        this.triggerCarAnimation();
    }

    // Mobile Optimizations
    setupMobileOptimizations() {
        // Optimize images for mobile
        this.optimizeImagesForMobile();
        
        // Add touch-friendly hover effects
        this.setupTouchHoverEffects();
        
        // Optimize 3D animations for mobile
        this.optimizeAnimationsForMobile();
    }

    optimizeImagesForMobile() {
        if (window.innerWidth <= 768) {
            const images = document.querySelectorAll('img');
            images.forEach(img => {
                img.loading = 'lazy';
            });
        }
    }

    setupTouchHoverEffects() {
        if ('ontouchstart' in window) {
            const hoverElements = document.querySelectorAll('.project-card, .skill-item, .contact-item');
            
            hoverElements.forEach(element => {
                element.addEventListener('touchstart', () => {
                    element.classList.add('touch-hover');
                });
                
                element.addEventListener('touchend', () => {
                    setTimeout(() => {
                        element.classList.remove('touch-hover');
                    }, 300);
                });
            });
        }
    }

    optimizeAnimationsForMobile() {
        const isMobile = window.innerWidth <= 768;
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        if (isMobile || reducedMotion) {
            const animatedElements = document.querySelectorAll('.hero-cube, .profile-ring, .floating-shapes .shape');
            animatedElements.forEach(element => {
                element.style.animationDuration = '10s';
            });
        }
    }

    // Keyboard Navigation
    handleKeyboardNavigation(e) {
        switch (e.key) {
            case 'Home':
                e.preventDefault();
                this.scrollToSection('home');
                break;
            case 'End':
                e.preventDefault();
                this.scrollToSection('contact');
                break;
            case 'ArrowUp':
                if (e.ctrlKey) {
                    e.preventDefault();
                    this.navigateToPreviousSection();
                }
                break;
            case 'ArrowDown':
                if (e.ctrlKey) {
                    e.preventDefault();
                    this.navigateToNextSection();
                }
                break;
        }
    }

    // Utility Functions
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    handleResize() {
        // Update mobile optimizations
        this.setupMobileOptimizations();
        
        // Recalculate section positions
        this.updateActiveSection();
    }

    // Car Animation
    setupCarAnimation() {
        this.carElement = document.getElementById('car-animation');
        this.carAnimationTimeout = null;
    }

    triggerCarAnimation() {
        if (this.carAnimationTimeout) {
            clearTimeout(this.carAnimationTimeout);
        }
        
        this.carElement.classList.remove('driving');
        
        setTimeout(() => {
            this.carElement.classList.add('driving');
        }, 100);
        
        this.carAnimationTimeout = setTimeout(() => {
            this.carElement.classList.remove('driving');
        }, 3000);
    }

    // Game Logic
    initializeGame() {
        this.game = {
            canvas: document.getElementById('game-canvas'),
            ctx: null,
            isRunning: false,
            isPaused: false,
            score: 0,
            lives: 3,
            level: 1,
            player: { x: 400, y: 450, width: 60, height: 40, speed: 5 },
            coins: [],
            enemies: [],
            powerups: [],
            particles: []
        };
        
        if (this.game.canvas) {
            this.game.ctx = this.game.canvas.getContext('2d');
            this.setupGameControls();
            this.setupGameEvents();
        }
    }

    setupGameControls() {
        const startBtn = document.getElementById('start-game');
        const pauseBtn = document.getElementById('pause-game');
        
        if (startBtn) {
            startBtn.addEventListener('click', () => this.startGame());
        }
        
        if (pauseBtn) {
            pauseBtn.addEventListener('click', () => this.pauseGame());
        }
    }

    setupGameEvents() {
        document.addEventListener('keydown', (e) => {
            if (!this.game.isRunning) return;
            
            switch(e.key) {
                case 'ArrowLeft':
                    this.game.player.x = Math.max(0, this.game.player.x - this.game.player.speed);
                    break;
                case 'ArrowRight':
                    this.game.player.x = Math.min(this.game.canvas.width - this.game.player.width, this.game.player.x + this.game.player.speed);
                    break;
                case 'ArrowUp':
                    this.game.player.y = Math.max(0, this.game.player.y - this.game.player.speed);
                    break;
                case 'ArrowDown':
                    this.game.player.y = Math.min(this.game.canvas.height - this.game.player.height, this.game.player.y + this.game.player.speed);
                    break;
            }
        });
        
        // Touch controls for mobile
        let touchStartX = 0;
        let touchStartY = 0;
        
        this.game.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        });
        
        this.game.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            if (!this.game.isRunning) return;
            
            const touchX = e.touches[0].clientX;
            const touchY = e.touches[0].clientY;
            const deltaX = touchX - touchStartX;
            const deltaY = touchY - touchStartY;
            
            this.game.player.x = Math.max(0, Math.min(this.game.canvas.width - this.game.player.width, this.game.player.x + deltaX * 0.5));
            this.game.player.y = Math.max(0, Math.min(this.game.canvas.height - this.game.player.height, this.game.player.y + deltaY * 0.5));
            
            touchStartX = touchX;
            touchStartY = touchY;
        });
    }

    startGame() {
        this.game.isRunning = true;
        this.game.isPaused = false;
        this.game.score = 0;
        this.game.lives = 3;
        this.game.level = 1;
        this.game.coins = [];
        this.game.enemies = [];
        this.game.powerups = [];
        this.game.particles = [];
        
        this.updateGameUI();
        this.gameLoop();
    }

    pauseGame() {
        this.game.isPaused = !this.game.isPaused;
        const pauseBtn = document.getElementById('pause-game');
        if (pauseBtn) {
            pauseBtn.textContent = this.game.isPaused ? '▶️ Resume' : '⏸️ Pause';
        }
    }

    gameLoop() {
        if (!this.game.isRunning) return;
        
        if (!this.game.isPaused) {
            this.updateGame();
            this.renderGame();
        }
        
        requestAnimationFrame(() => this.gameLoop());
    }

    updateGame() {
        // Spawn coins
        if (Math.random() < 0.02 + this.game.level * 0.005) {
            this.game.coins.push({
                x: Math.random() * (this.game.canvas.width - 30),
                y: -30,
                width: 30,
                height: 30,
                speed: 2 + this.game.level * 0.5,
                type: Math.random() < 0.8 ? 'coin' : 'diamond'
            });
        }
        
        // Spawn enemies
        if (Math.random() < 0.015 + this.game.level * 0.003) {
            this.game.enemies.push({
                x: Math.random() * (this.game.canvas.width - 40),
                y: -40,
                width: 40,
                height: 40,
                speed: 1.5 + this.game.level * 0.3
            });
        }
        
        // Update coins
        this.game.coins = this.game.coins.filter(coin => {
            coin.y += coin.speed;
            
            // Check collision with player
            if (this.checkCollision(this.game.player, coin)) {
                this.game.score += coin.type === 'diamond' ? 50 : 10;
                this.createParticles(coin.x, coin.y, coin.type === 'diamond' ? '💎' : '🪙');
                this.updateGameUI();
                return false;
            }
            
            return coin.y < this.game.canvas.height;
        });
        
        // Update enemies
        this.game.enemies = this.game.enemies.filter(enemy => {
            enemy.y += enemy.speed;
            
            // Check collision with player
            if (this.checkCollision(this.game.player, enemy)) {
                this.game.lives--;
                this.createParticles(enemy.x, enemy.y, '💥');
                this.updateGameUI();
                
                if (this.game.lives <= 0) {
                    this.endGame();
                }
                return false;
            }
            
            return enemy.y < this.game.canvas.height;
        });
        
        // Update particles
        this.game.particles = this.game.particles.filter(particle => {
            particle.y -= particle.speed;
            particle.life--;
            return particle.life > 0;
        });
        
        // Level progression
        if (this.game.score > this.game.level * 100) {
            this.game.level++;
            this.updateGameUI();
        }
    }

    renderGame() {
        const ctx = this.game.ctx;
        
        // Clear canvas
        ctx.clearRect(0, 0, this.game.canvas.width, this.game.canvas.height);
        
        // Draw stars background
        ctx.fillStyle = '#ffffff';
        for (let i = 0; i < 50; i++) {
            ctx.fillRect(
                Math.random() * this.game.canvas.width,
                Math.random() * this.game.canvas.height,
                1, 1
            );
        }
        
        // Draw player
        ctx.fillStyle = '#ff4757';
        ctx.fillRect(this.game.player.x, this.game.player.y, this.game.player.width, this.game.player.height);
        ctx.fillStyle = '#ffffff';
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('🚀', this.game.player.x + this.game.player.width/2, this.game.player.y + this.game.player.height/2 + 7);
        
        // Draw coins
        this.game.coins.forEach(coin => {
            ctx.fillStyle = coin.type === 'diamond' ? '#a55eea' : '#ffa502';
            ctx.fillRect(coin.x, coin.y, coin.width, coin.height);
            ctx.fillStyle = '#ffffff';
            ctx.font = '16px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(coin.type === 'diamond' ? '💎' : '🪙', coin.x + coin.width/2, coin.y + coin.height/2 + 5);
        });
        
        // Draw enemies
        this.game.enemies.forEach(enemy => {
            ctx.fillStyle = '#ff3742';
            ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
            ctx.fillStyle = '#ffffff';
            ctx.font = '16px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('🔥', enemy.x + enemy.width/2, enemy.y + enemy.height/2 + 5);
        });
        
        // Draw particles
        this.game.particles.forEach(particle => {
            ctx.fillStyle = '#ffffff';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.globalAlpha = particle.life / 30;
            ctx.fillText(particle.emoji, particle.x, particle.y);
            ctx.globalAlpha = 1;
        });
    }

    checkCollision(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    }

    createParticles(x, y, emoji) {
        for (let i = 0; i < 5; i++) {
            this.game.particles.push({
                x: x + Math.random() * 20,
                y: y + Math.random() * 20,
                speed: Math.random() * 3 + 1,
                life: 30,
                emoji: emoji
            });
        }
    }

    updateGameUI() {
        const scoreEl = document.getElementById('game-score');
        const livesEl = document.getElementById('game-lives');
        const levelEl = document.getElementById('game-level');
        
        if (scoreEl) scoreEl.textContent = this.game.score;
        if (livesEl) livesEl.textContent = this.game.lives;
        if (levelEl) levelEl.textContent = this.game.level;
    }

    endGame() {
        this.game.isRunning = false;
        alert(`Game Over! 🎮\n\nFinal Score: ${this.game.score}\nLevel Reached: ${this.game.level}\n\nNice try, crypto warrior! 🚀`);
        
        const startBtn = document.getElementById('start-game');
        const pauseBtn = document.getElementById('pause-game');
        
        if (startBtn) startBtn.textContent = '🚀 Start Game';
        if (pauseBtn) pauseBtn.textContent = '⏸️ Pause';
    }

    // Cleanup
    destroy() {
        // Remove event listeners
        window.removeEventListener('scroll', this.handleScroll);
        window.removeEventListener('resize', this.handleResize);
        
        // Stop game
        if (this.game) {
            this.game.isRunning = false;
        }
        
        // Clear car animation timeout
        if (this.carAnimationTimeout) {
            clearTimeout(this.carAnimationTimeout);
        }
        
        // Disconnect observers
        this.observers.forEach(observer => observer.disconnect());
        this.observers.clear();
    }
}

// Performance Monitoring
class PerformanceMonitor {
    constructor() {
        this.metrics = {};
        this.init();
    }

    init() {
        if ('performance' in window) {
            this.measureLoadTime();
            this.measureFCP();
            this.measureLCP();
        }
    }

    measureLoadTime() {
        window.addEventListener('load', () => {
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            this.metrics.loadTime = loadTime;
            console.log(`Page load time: ${loadTime}ms`);
        });
    }

    measureFCP() {
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (entry.name === 'first-contentful-paint') {
                        this.metrics.fcp = entry.startTime;
                        console.log(`First Contentful Paint: ${entry.startTime}ms`);
                    }
                }
            });
            observer.observe({ entryTypes: ['paint'] });
        }
    }

    measureLCP() {
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                this.metrics.lcp = lastEntry.startTime;
                console.log(`Largest Contentful Paint: ${lastEntry.startTime}ms`);
            });
            observer.observe({ entryTypes: ['largest-contentful-paint'] });
        }
    }

    getMetrics() {
        return this.metrics;
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    // Initialize portfolio website
    const portfolio = new PortfolioWebsite();
    
    // Initialize performance monitoring
    const performanceMonitor = new PerformanceMonitor();
    
    // Make portfolio instance globally accessible for debugging
    window.portfolio = portfolio;
    window.performanceMonitor = performanceMonitor;
    
    // Log initialization
    console.log('🚀 Portfolio website initialized successfully!');
    console.log('👨‍💻 Built by akuthedev with ❤️');
});

// Service Worker Registration (for PWA capabilities)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Note: Uncomment when you add a service worker file
        // navigator.serviceWorker.register('/sw.js')
        //     .then((registration) => {
        //         console.log('SW registered: ', registration);
        //     })
        //     .catch((registrationError) => {
        //         console.log('SW registration failed: ', registrationError);
        //     });
    });
}

// Error Handling
window.addEventListener('error', (e) => {
    console.error('JavaScript Error:', e.error);
    // You could send this to an error tracking service
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled Promise Rejection:', e.reason);
    // You could send this to an error tracking service
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PortfolioWebsite, PerformanceMonitor };
}
