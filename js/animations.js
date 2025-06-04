// ===== ANIMATIONS & EFFECTS - KEBUN KITE =====

// ===== PARALLAX EFFECTS =====
class ParallaxController {
    constructor() {
        this.elements = [];
        this.init();
    }
    
    init() {
        // Find all parallax elements
        document.querySelectorAll('[data-parallax]').forEach(element => {
            const speed = parseFloat(element.dataset.parallax) || 0.5;
            this.elements.push({ element, speed });
        });
        
        // Bind scroll event with throttle
        window.addEventListener('scroll', this.throttle(this.handleScroll.bind(this), 16));
        
        // Initial call
        this.handleScroll();
    }
    
    handleScroll() {
        const scrollTop = window.pageYOffset;
        
        this.elements.forEach(({ element, speed }) => {
            const yPos = -(scrollTop * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
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
}

// ===== TYPING ANIMATION =====
class TypeWriter {
    constructor(element, words, wait = 3000) {
        this.element = element;
        this.words = words;
        this.wait = parseInt(wait, 10);
        this.wordIndex = 0;
        this.txt = '';
        this.isDeleting = false;
        this.type();
    }
    
    type() {
        const current = this.wordIndex % this.words.length;
        const fullTxt = this.words[current];
        
        if (this.isDeleting) {
            this.txt = fullTxt.substring(0, this.txt.length - 1);
        } else {
            this.txt = fullTxt.substring(0, this.txt.length + 1);
        }
        
        this.element.innerHTML = `<span class="txt">${this.txt}</span>`;
        
        let typeSpeed = 100;
        
        if (this.isDeleting) {
            typeSpeed /= 2;
        }
        
        if (!this.isDeleting && this.txt === fullTxt) {
            typeSpeed = this.wait;
            this.isDeleting = true;
        } else if (this.isDeleting && this.txt === '') {
            this.isDeleting = false;
            this.wordIndex++;
            typeSpeed = 500;
        }
        
        setTimeout(() => this.type(), typeSpeed);
    }
}

// ===== FLOATING ANIMATION =====
function createFloatingElements() {
    const container = document.querySelector('.hero');
    if (!container || window.innerWidth <= 768) return;
    
    const fruits = ['🍎', '🍊', '🍌', '🥭', '🥑'];
    
    for (let i = 0; i < 8; i++) {
        const fruit = document.createElement('div');
        fruit.className = 'floating-fruit';
        fruit.textContent = fruits[Math.floor(Math.random() * fruits.length)];
        fruit.style.cssText = `
            position: absolute;
            font-size: ${Math.random() * 15 + 15}px;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            opacity: 0.2;
            pointer-events: none;
            animation: float ${Math.random() * 8 + 8}s infinite linear;
            z-index: 1;
        `;
        container.appendChild(fruit);
    }
}

// ===== SCROLL REVEAL ANIMATIONS =====
class ScrollReveal {
    constructor() {
        this.elements = [];
        this.init();
    }
    
    init() {
        // Find all elements with reveal animation
        document.querySelectorAll('[data-reveal]').forEach(element => {
            this.elements.push(element);
        });
        
        // Create intersection observer
        this.observer = new IntersectionObserver(
            this.handleIntersection.bind(this),
            {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            }
        );
        
        // Observe all elements
        this.elements.forEach(element => {
            this.observer.observe(element);
        });
    }
    
    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const animation = element.dataset.reveal || 'fadeInUp';
                const delay = element.dataset.delay || 0;
                
                setTimeout(() => {
                    element.classList.add('revealed', animation);
                }, delay);
                
                this.observer.unobserve(element);
            }
        });
    }
}

// ===== MOUSE TRAIL EFFECT =====
class MouseTrail {
    constructor() {
        this.trail = [];
        this.maxTrail = 15;
        this.init();
    }
    
    init() {
        if (window.innerWidth <= 768) return; // Skip on mobile
        
        // Create trail elements
        for (let i = 0; i < this.maxTrail; i++) {
            const dot = document.createElement('div');
            dot.className = 'trail-dot';
            dot.style.cssText = `
                position: fixed;
                width: 3px;
                height: 3px;
                background: var(--secondary-color);
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
                opacity: 0;
                transition: opacity 0.3s ease;
            `;
            document.body.appendChild(dot);
            this.trail.push(dot);
        }
        
        // Mouse move event
        document.addEventListener('mousemove', this.handleMouseMove.bind(this));
    }
    
    handleMouseMove(e) {
        // Update trail positions
        for (let i = this.trail.length - 1; i > 0; i--) {
            this.trail[i].style.left = this.trail[i - 1].style.left;
            this.trail[i].style.top = this.trail[i - 1].style.top;
            this.trail[i].style.opacity = (this.maxTrail - i) / this.maxTrail * 0.4;
        }
        
        // Update first dot position
        this.trail[0].style.left = e.clientX + 'px';
        this.trail[0].style.top = e.clientY + 'px';
        this.trail[0].style.opacity = '0.6';
    }
}

// ===== PARTICLE SYSTEM =====
class ParticleSystem {
    constructor(container) {
        this.container = container;
        this.particles = [];
        this.maxParticles = 30;
        this.init();
    }
    
    init() {
        if (window.innerWidth <= 768) return; // Skip on mobile
        
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
        `;
        
        this.container.appendChild(this.canvas);
        this.resize();
        
        // Create particles
        for (let i = 0; i < this.maxParticles; i++) {
            this.particles.push(this.createParticle());
        }
        
        // Start animation
        this.animate();
        
        // Handle resize
        window.addEventListener('resize', this.resize.bind(this));
    }
    
    createParticle() {
        return {
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height,
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3,
            size: Math.random() * 1.5 + 0.5,
            opacity: Math.random() * 0.3 + 0.1
        };
    }
    
    resize() {
        this.canvas.width = this.container.offsetWidth;
        this.canvas.height = this.container.offsetHeight;
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(particle => {
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Wrap around edges
            if (particle.x < 0) particle.x = this.canvas.width;
            if (particle.x > this.canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.canvas.height;
            if (particle.y > this.canvas.height) particle.y = 0;
            
            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(76, 175, 80, ${particle.opacity})`;
            this.ctx.fill();
        });
        
        requestAnimationFrame(this.animate.bind(this));
    }
}

// ===== LOADING ANIMATIONS =====
function createLoadingAnimation() {
    const loader = document.querySelector('.fruit-loader');
    if (!loader) return;
    
    const fruits = ['🍎', '🍊', '🍌', '🥭', '🥑'];
    let currentFruit = 0;
    
    const interval = setInterval(() => {
        if (!document.querySelector('.loader')) {
            clearInterval(interval);
            return;
        }
        loader.textContent = fruits[currentFruit];
        currentFruit = (currentFruit + 1) % fruits.length;
    }, 400);
}

// ===== CARD HOVER EFFECTS =====
function initCardEffects() {
    if (window.innerWidth <= 768) return; // Skip on mobile
    
    document.querySelectorAll('.product-card, .service-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) rotateX(3deg)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) rotateX(0)';
        });
        
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 15;
            const rotateY = (centerX - x) / 15;
            
            this.style.transform = `translateY(-8px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
    });
}

// ===== TEXT ANIMATIONS =====
function animateText() {
    const textElements = document.querySelectorAll('[data-text-animation]');
    
    textElements.forEach(element => {
        const text = element.textContent;
        const animation = element.dataset.textAnimation;
        
        if (animation === 'typewriter') {
            element.textContent = '';
            let i = 0;
            const typeInterval = setInterval(() => {
                element.textContent += text[i];
                i++;
                if (i >= text.length) {
                    clearInterval(typeInterval);
                }
            }, 80);
        }
    });
}

// ===== SMOOTH ANIMATIONS =====
function initSmoothAnimations() {
    // Add smooth transitions to all interactive elements
    const elements = document.querySelectorAll('button, a, .card, .btn');
    elements.forEach(element => {
        if (!element.style.transition) {
            element.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        }
    });
}

// ===== INITIALIZE ALL ANIMATIONS =====
document.addEventListener('DOMContentLoaded', () => {
    // Initialize loading animation first
    createLoadingAnimation();
    
    // Wait for page to load before initializing other animations
    window.addEventListener('load', () => {
        setTimeout(() => {
            // Initialize parallax
            new ParallaxController();
            
            // Initialize scroll reveal
            new ScrollReveal();
            
            // Initialize mouse trail (only on desktop)
            if (window.innerWidth > 768) {
                new MouseTrail();
            }
            
            // Initialize particle system for hero
            const heroSection = document.querySelector('.hero');
            if (heroSection && window.innerWidth > 768) {
                new ParticleSystem(heroSection);
            }
            
            // Initialize floating elements
            createFloatingElements();
            
            // Initialize card effects
            initCardEffects();
            
            // Initialize text animations
            animateText();
            
            // Initialize smooth animations
            initSmoothAnimations();
            
            // Initialize typewriter for hero subtitle if exists
            const typewriterElement = document.querySelector('[data-typewriter]');
            if (typewriterElement && typewriterElement.dataset.words) {
                const words = typewriterElement.dataset.words.split(',');
                new TypeWriter(typewriterElement, words);
            }
        }, 500);
    });
});

// ===== CSS ANIMATIONS (Added via JavaScript) =====
const animationStyles = document.createElement('style');
animationStyles.textContent = `
/* Floating Animation */
@keyframes float {
    0%, 100% { 
        transform: translateY(0px) rotate(0deg); 
        opacity: 0.2;
    }
    25% { 
        transform: translateY(-15px) rotate(90deg); 
        opacity: 0.4;
    }
    50% { 
        transform: translateY(-8px) rotate(180deg); 
        opacity: 0.3;
    }
    75% { 
        transform: translateY(-20px) rotate(270deg); 
        opacity: 0.5;
    }
}

/* Reveal Animations */
@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes fadeInLeft {
    from {
        opacity: 0;
        transform: translateX(-30px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

@keyframes fadeInRight {
    from {
        opacity: 0;
        transform: translateX(30px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

@keyframes zoomIn {
    from {
        opacity: 0;
        transform: scale(0.8);
    }
    to {
        opacity: 1;
        transform: scale(1);
    }
}

/* Revealed class */
.revealed {
    animation-duration: 0.8s;
    animation-fill-mode: both;
}

.fadeInUp { animation-name: fadeInUp; }
.fadeInLeft { animation-name: fadeInLeft; }
.fadeInRight { animation-name: fadeInRight; }
.zoomIn { animation-name: zoomIn; }

/* Modal Styles */
.modal-content {
    background: white;
    border-radius: 20px;
    max-width: 600px;
    width: 90%;
    max-height: 80vh;
    overflow-y: auto;
    transform: scale(0.8);
    transition: transform 0.3s ease;
}

.modal-overlay[style*="opacity: 1"] .modal-content {
    transform: scale(1);
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 30px;
    border-bottom: 1px solid #eee;
}

.modal-header h3 {
    margin: 0;
    color: var(--primary-color);
    font-size: 1.3rem;
}

.modal-close {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #999;
    transition: color 0.3s ease;
    padding: 5px;
}

.modal-close:hover {
    color: var(--primary-color);
}

.modal-body {
    padding: 30px;
}

.modal-image {
    width: 100%;
    height: 200px;
    object-fit: cover;
    border-radius: 10px;
    margin-bottom: 20px;
}

.modal-features h4 {
    color: var(--primary-color);
    margin: 20px 0 10px 0;
    font-size: 1.1rem;
}

.modal-features ul {
    list-style: none;
    padding: 0;
}

.modal-features li {
    padding: 5px 0;
    color: var(--text-light);
    position: relative;
    padding-left: 20px;
}

.modal-features li:before {
    content: "✓";
    position: absolute;
    left: 0;
    color: var(--secondary-color);
    font-weight: bold;
}

.modal-actions {
    margin-top: 30px;
    text-align: center;
}

/* Image Modal Styles */
.image-modal-content {
    background: white;
    border-radius: 20px;
    max-width: 800px;
    width: 90%;
    max-height: 90vh;
    overflow-y: auto;
}

.image-modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 30px;
    border-bottom: 1px solid #eee;
}

.image-modal-body {
    padding: 30px;
    text-align: center;
}

.modal-full-image {
    width: 100%;
    max-height: 400px;
    object-fit: cover;
    border-radius: 10px;
    margin-bottom: 20px;
}

/* Notification Styles */
.notification-content {
    display: flex;
    align-items: center;
    gap: 15px;
}

.notification-close {
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    opacity: 0.7;
    transition: opacity 0.3s ease;
    padding: 5px;
}

.notification-close:hover {
    opacity: 1;
}

/* Responsive Modal */
@media (max-width: 768px) {
    .modal-content,
    .image-modal-content {
        width: 95%;
        margin: 20px;
    }
    
    .modal-header,
    .image-modal-header {
        padding: 15px 20px;
    }
    
    .modal-body,
    .image-modal-body {
        padding: 20px;
    }
    
    .modal-header h3 {
        font-size: 1.1rem;
    }
}

/* Performance optimizations */
.floating-fruit,
.trail-dot {
    will-change: transform;
}

.product-card,
.service-card {
    will-change: transform;
}
`;

document.head.appendChild(animationStyles);

// ===== PERFORMANCE MONITORING =====
if (typeof performance !== 'undefined') {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log('🚀 Page Load Performance:', {
                'DOM Content Loaded': Math.round(perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart) + 'ms',
                'Page Load Complete': Math.round(perfData.loadEventEnd - perfData.loadEventStart) + 'ms',
                'Total Load Time': Math.round(perfData.loadEventEnd - perfData.fetchStart) + 'ms'
            });
        }, 1000);
    });
}

// ===== EXPORT FOR TESTING =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ParallaxController,
        TypeWriter,
        ScrollReveal,
        MouseTrail,
        ParticleSystem
    };
}
