// ===== MAIN JAVASCRIPT FILE - KEBUN KITE =====

// DOM Elements
const loader = document.getElementById('loader');
const header = document.getElementById('header');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const backToTop = document.getElementById('backToTop');
const contactForm = document.getElementById('contactForm');

// ===== LOADING SCREEN =====
window.addEventListener('load', () => {
    setTimeout(() => {
        if (loader) {
            loader.classList.add('hidden');
            document.body.style.overflow = 'visible';
        }
    }, 1500);
});

// ===== HEADER SCROLL EFFECT =====
let lastScrollTop = 0;
window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Add scrolled class
    if (header) {
        if (scrollTop > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Hide/show header on scroll
        if (scrollTop > lastScrollTop && scrollTop > 200) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
    }
    
    lastScrollTop = scrollTop;
    
    // Back to top button
    if (backToTop) {
        if (scrollTop > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }
});

// ===== MOBILE MENU TOGGLE =====
if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    });

    // Close menu when clicking on nav links
    navMenu.addEventListener('click', (e) => {
        if (e.target.tagName === 'A') {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!header.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    });
}

// ===== SMOOTH SCROLLING =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerHeight = header ? header.offsetHeight : 80;
            const targetPosition = target.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===== BACK TO TOP BUTTON =====
if (backToTop) {
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ===== COUNTER ANIMATION =====
const counters = document.querySelectorAll('.counter');
if (counters.length > 0) {
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
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
                counterObserver.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

// ===== CONTACT FORM HANDLING =====
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const name = formData.get('name');
        const phone = formData.get('phone');
        const subject = formData.get('subject');
        const message = formData.get('message');
        
        // Validate form
        if (!name || !phone || !message) {
            showNotification('Mohon lengkapi semua field yang wajib diisi!', 'error');
            return;
        }
        
        // Create WhatsApp message
        let whatsappMessage = `Halo Kebun Kite! 🌱\n\n`;
        whatsappMessage += `Nama: ${name}\n`;
        whatsappMessage += `WhatsApp: ${phone}\n`;
        
        if (subject) {
            const subjectText = {
                'buah': 'Pesan Buah',
                'bibit': 'Beli Bibit',
                'konsultasi': 'Konsultasi Gratis',
                'kemitraan': 'Program Kemitraan',
                'lainnya': 'Lainnya'
            };
            whatsappMessage += `Keperluan: ${subjectText[subject] || subject}\n`;
        }
        
        whatsappMessage += `\nPesan:\n${message}\n\n`;
        whatsappMessage += `Terima kasih! 🙏`;
        
        // Encode message for URL
        const encodedMessage = encodeURIComponent(whatsappMessage);
        const whatsappURL = `https://wa.me/6282255565550?text=${encodedMessage}`;
        
        // Open WhatsApp
        window.open(whatsappURL, '_blank');
        
        // Show success message
        showNotification('Pesan berhasil disiapkan! Anda akan diarahkan ke WhatsApp.', 'success');
        
        // Reset form
        this.reset();
    });
}

// ===== PRODUCT CARD INTERACTIONS =====
document.querySelectorAll('.product-card').forEach(card => {
    const contactBtn = card.querySelector('.btn-contact');
    const actionBtns = card.querySelectorAll('.action-btn');
    
    // Contact button click
    if (contactBtn) {
        contactBtn.addEventListener('click', () => {
            const productName = card.querySelector('h3').textContent;
            const message = `Halo Kebun Kite! Saya tertarik dengan ${productName}. Mohon informasi lebih lanjut mengenai harga dan ketersediaan. Terima kasih! 🌱`;
            const encodedMessage = encodeURIComponent(message);
            const whatsappURL = `https://wa.me/6282255565550?text=${encodedMessage}`;
            window.open(whatsappURL, '_blank');
        });
    }
    
    // Action buttons
    actionBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const icon = btn.querySelector('i');
            
            if (icon.classList.contains('fa-eye')) {
                // View details
                showProductModal(card);
            } else if (icon.classList.contains('fa-whatsapp')) {
                // WhatsApp contact
                const productName = card.querySelector('h3').textContent;
                const message = `Halo Kebun Kite! Saya ingin bertanya tentang ${productName}. Mohon informasi detailnya. Terima kasih! 🌱`;
                const encodedMessage = encodeURIComponent(message);
                const whatsappURL = `https://wa.me/6282255565550?text=${encodedMessage}`;
                window.open(whatsappURL, '_blank');
            }
        });
    });
});

// ===== SERVICE CARD INTERACTIONS =====
document.querySelectorAll('.service-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const serviceCard = btn.closest('.service-card');
        const serviceName = serviceCard.querySelector('h3').textContent;
        
        let message = `Halo Kebun Kite! Saya tertarik dengan layanan "${serviceName}". `;
        
        switch(serviceName) {
            case 'Konsultasi & Pelatihan':
                message += 'Mohon informasi jadwal konsultasi gratis dan pelatihan budidaya.';
                break;
            case 'Jual Beli Bibit':
                message += 'Mohon informasi jenis bibit yang tersedia dan harganya.';
                break;
            case 'Jual Hasil Buah':
                message += 'Saya ingin menjual hasil panen buah. Mohon informasi prosedur dan harganya.';
                break;
            default:
                message += 'Mohon informasi lebih detail mengenai layanan ini.';
        }
        
        message += ' Terima kasih! 🌱';
        
        const encodedMessage = encodeURIComponent(message);
        const whatsappURL = `https://wa.me/6282255565550?text=${encodedMessage}`;
        window.open(whatsappURL, '_blank');
    });
});

// ===== GALLERY INTERACTIONS =====
document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
        const img = item.querySelector('img');
        const title = item.querySelector('h4').textContent;
        const description = item.querySelector('p').textContent;
        
        showImageModal(img.src, title, description);
    });
});

// ===== NOTIFICATION SYSTEM =====
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${getNotificationIcon(type)}"></i>
            <span>${message}</span>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 400px;
    `;
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

function getNotificationIcon(type) {
    const icons = {
        'success': 'fa-check-circle',
        'error': 'fa-exclamation-circle',
        'warning': 'fa-exclamation-triangle',
        'info': 'fa-info-circle'
    };
    return icons[type] || icons.info;
}

function getNotificationColor(type) {
    const colors = {
        'success': '#4CAF50',
        'error': '#f44336',
        'warning': '#ff9800',
        'info': '#2196F3'
    };
    return colors[type] || colors.info;
}

// ===== MODAL FUNCTIONS =====
function showProductModal(productCard) {
    const productName = productCard.querySelector('h3').textContent;
    const productDescription = productCard.querySelector('p').textContent;
    const productImage = productCard.querySelector('img').src;
    const productFeatures = Array.from(productCard.querySelectorAll('.product-features span')).map(span => span.textContent);
    
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>${productName}</h3>
                <button class="modal-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <img src="${productImage}" alt="${productName}" class="modal-image">
                <div class="modal-info">
                    <p>${productDescription}</p>
                    <div class="modal-features">
                        <h4>Keunggulan:</h4>
                        <ul>
                            ${productFeatures.map(feature => `<li>${feature}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="modal-actions">
                        <button class="btn btn-primary modal-contact">
                            <i class="fab fa-whatsapp"></i>
                            Hubungi Kami
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Add modal styles
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // Animate in
    setTimeout(() => {
        modal.style.opacity = '1';
    }, 100);
    
    // Close modal functionality
    const closeModal = () => {
        modal.style.opacity = '0';
        setTimeout(() => {
            modal.remove();
            document.body.style.overflow = 'visible';
        }, 300);
    };
    
    modal.querySelector('.modal-close').addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    
    // Contact button
    modal.querySelector('.modal-contact').addEventListener('click', () => {
        const message = `Halo Kebun Kite! Saya tertarik dengan ${productName}. Mohon informasi lebih lanjut mengenai harga, ketersediaan, dan cara pemesanan. Terima kasih! 🌱`;
        const encodedMessage = encodeURIComponent(message);
        const whatsappURL = `https://wa.me/6282255565550?text=${encodedMessage}`;
        window.open(whatsappURL, '_blank');
        closeModal();
    });
}

function showImageModal(imageSrc, title, description) {
    const modal = document.createElement('div');
    modal.className = 'image-modal-overlay';
    modal.innerHTML = `
        <div class="image-modal-content">
            <div class="image-modal-header">
                <h3>${title}</h3>
                <button class="modal-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="image-modal-body">
                <img src="${imageSrc}" alt="${title}" class="modal-full-image">
                <p>${description}</p>
            </div>
        </div>
    `;
    
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    setTimeout(() => {
        modal.style.opacity = '1';
    }, 100);
    
    const closeModal = () => {
        modal.style.opacity = '0';
        setTimeout(() => {
            modal.remove();
            document.body.style.overflow = 'visible';
        }, 300);
    };
    
    modal.querySelector('.modal-close').addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    
    // ESC key to close
    const handleEsc = (e) => {
        if (e.key === 'Escape') {
            closeModal();
            document.removeEventListener('keydown', handleEsc);
        }
    };
    document.addEventListener('keydown', handleEsc);
}

// ===== LAZY LOADING IMAGES =====
const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
                img.src = img.dataset.src;
            }
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
        }
    });
});

document.querySelectorAll('img[loading="lazy"]').forEach(img => {
    imageObserver.observe(img);
});

// ===== PERFORMANCE OPTIMIZATIONS =====
// Debounce function for scroll events
function debounce(func, wait) {
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

// Throttle function for resize events
function throttle(func, limit) {
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

// ===== ACCESSIBILITY IMPROVEMENTS =====
// Focus management for modals
document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        const modal = document.querySelector('.modal-overlay, .image-modal-overlay');
        if (modal) {
            const focusableElements = modal.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];
            
            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    lastElement.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastElement) {
                    firstElement.focus();
                    e.preventDefault();
                }
            }
        }
    }
});

// ===== INITIALIZE AOS (Animate On Scroll) =====
document.addEventListener('DOMContentLoaded', () => {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            offset: 100
        });
    }
});

// ===== ERROR HANDLING =====
window.addEventListener('error', (e) => {
    console.error('JavaScript Error:', e.error);
});

// ===== CONSOLE WELCOME MESSAGE =====
console.log(`
🌱 Kebun Kite - Website Perkebunan Buah Berkualitas
📍 Rasau Jaya, Kalimantan Barat
📞 WhatsApp: +62 822-5556-5550

Developed with ❤️ by Muhammad Arif 
© 2024 All Rights Reserved
`);
