class Slideshow {
    constructor() {
        this.currentSlide = 1;
        this.totalSlides = 44; // 4 photos + 1 final message
        this.isPlaying = false;
        this.autoPlayInterval = null;
        this.autoPlayDelay = 4500; // 4.5 seconds

        this.init();
    }

    init() {
        this.bindEvents();
        this.updateProgressIndicator();
    }

    bindEvents() {
        // Navigation buttons
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const playPauseBtn = document.getElementById('playPauseBtn');

        prevBtn.addEventListener('click', () => this.previousSlide());
        nextBtn.addEventListener('click', () => this.nextSlide());
        playPauseBtn.addEventListener('click', () => this.togglePlayPause());

        // Progress dots - more specific binding
        const progressDots = document.querySelectorAll('.progress-dot');
        progressDots.forEach((dot) => {
            dot.addEventListener('click', () => {
                const slideNumber = parseInt(dot.getAttribute('data-slide'));
                this.goToSlide(slideNumber);
            });
        });

        // Click on slide to pause/resume
        const slides = document.querySelectorAll('.slide');
        slides.forEach(slide => {
            slide.addEventListener('click', () => this.togglePlayPause());
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'ArrowLeft':
                    this.previousSlide();
                    break;
                case 'ArrowRight':
                case ' ':
                    e.preventDefault();
                    this.nextSlide();
                    break;
                case 'Escape':
                    this.stopAutoPlay();
                    break;
            }
        });
    }

    goToSlide(slideNumber) {
        if (slideNumber < 1 || slideNumber > this.totalSlides) return;

        // Remove active class from current slide and progress dot
        const currentSlideElement = document.querySelector('.slide.active');
        const currentDot = document.querySelector('.progress-dot.active');
        
        if (currentSlideElement) {
            currentSlideElement.classList.remove('active');
        }
        if (currentDot) {
            currentDot.classList.remove('active');
        }

        // Add active class to new slide and progress dot using more specific selectors
        const newSlideElement = document.querySelector(`.slide[data-slide="${slideNumber}"]`);
        const newDot = document.querySelector(`.progress-dot[data-slide="${slideNumber}"]`);
        
        if (newSlideElement) {
            newSlideElement.classList.add('active');
        }
        if (newDot) {
            newDot.classList.add('active');
        }

        this.currentSlide = slideNumber;
        this.updateProgressIndicator();
    }

    nextSlide() {
        const nextSlideNumber = this.currentSlide >= this.totalSlides ? 1 : this.currentSlide + 1;
        this.goToSlide(nextSlideNumber);
    }

    previousSlide() {
        const prevSlideNumber = this.currentSlide <= 1 ? this.totalSlides : this.currentSlide - 1;
        this.goToSlide(prevSlideNumber);
    }

    startAutoPlay() {
        this.isPlaying = true;
        this.updatePlayPauseButton();
        
        this.autoPlayInterval = setInterval(() => {
            this.nextSlide();
        }, this.autoPlayDelay);
    }

    stopAutoPlay() {
        this.isPlaying = false;
        this.updatePlayPauseButton();
        
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }

    togglePlayPause() {
        if (this.isPlaying) {
            this.stopAutoPlay();
        } else {
            this.startAutoPlay();
        }
    }

    updatePlayPauseButton() {
        const playPauseBtn = document.getElementById('playPauseBtn');
        
        if (this.isPlaying) {
            playPauseBtn.textContent = '⏸ Pause';
            playPauseBtn.classList.add('playing');
        } else {
            playPauseBtn.textContent = '▶ Play';
            playPauseBtn.classList.remove('playing');
        }
    }

    updateProgressIndicator() {
        const progressDots = document.querySelectorAll('.progress-dot');
        
        progressDots.forEach((dot) => {
            const dotSlideNumber = parseInt(dot.getAttribute('data-slide'));
            if (dotSlideNumber === this.currentSlide) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    // Method to handle visibility change (pause when tab is not active)
    handleVisibilityChange() {
        if (document.hidden && this.isPlaying) {
            this.stopAutoPlay();
        }
    }
}

// Initialize slideshow when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const slideshow = new Slideshow();
    
    // Pause slideshow when tab becomes hidden
    document.addEventListener('visibilitychange', () => {
        slideshow.handleVisibilityChange();
    });

    // Add some interactive enhancements
    addInteractiveEnhancements();
});

function addInteractiveEnhancements() {
    // Add hover effects to slides
    const slides = document.querySelectorAll('.slide');
    slides.forEach(slide => {
        slide.addEventListener('mouseenter', () => {
            slide.style.transform = 'scale(1.02)';
            slide.style.transition = 'transform 0.3s ease';
        });
        
        slide.addEventListener('mouseleave', () => {
            slide.style.transform = 'scale(1)';
        });
    });

    // Add sparkle effect on title hover
    const title = document.querySelector('.slideshow-title');
    if (title) {
        title.addEventListener('mouseenter', () => {
            title.style.textShadow = '0 0 20px rgba(255, 215, 0, 0.8)';
        });
        
        title.addEventListener('mouseleave', () => {
            title.style.textShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
        });
    }

    // Add celebratory animation when reaching final slide
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                const target = mutation.target;
                if (target.classList.contains('final-message') && target.classList.contains('active')) {
                    celebrateFinish();
                }
            }
        });
    });

    const finalSlide = document.querySelector('.final-message');
    if (finalSlide) {
        observer.observe(finalSlide, { attributes: true });
    }
}

function celebrateFinish() {
    // Add extra sparkle to the final message
    const finalHearts = document.querySelector('.final-hearts');
    if (finalHearts) {
        finalHearts.style.animation = 'heartbeat 0.8s ease-in-out infinite, sparkle 1s ease-in-out infinite alternate';
        
        // Reset animation after 5 seconds
        setTimeout(() => {
            finalHearts.style.animation = 'heartbeat 1.5s ease-in-out infinite';
        }, 5000);
    }
}

// Utility function to create confetti effect (lightweight version)
function createConfetti() {
    const colors = ['#FFD700', '#FF69B4', '#87CEEB', '#98FB98'];
    
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.left = Math.random() * window.innerWidth + 'px';
            confetti.style.top = '-10px';
            confetti.style.width = '10px';
            confetti.style.height = '10px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.borderRadius = '50%';
            confetti.style.pointerEvents = 'none';
            confetti.style.zIndex = '9999';
            confetti.style.animation = 'fall 3s linear forwards';
            
            document.body.appendChild(confetti);
            
            setTimeout(() => {
                if (confetti.parentNode) {
                    confetti.parentNode.removeChild(confetti);
                }
            }, 3000);
        }, i * 100);
    }
}

// Add CSS for confetti animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fall {
        0% {
            transform: translateY(-100vh) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);