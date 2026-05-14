// ========================================
// ECHOES OF THE FORGOTTEN KINGDOM
// Interactive JavaScript
// ========================================

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    applyAccessibilityFeatures();
    updateActiveNav();
});

// ========================================
// EVENT LISTENERS
// ========================================

function initializeEventListeners() {
    // Navigation active state
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Scroll spy for navigation
    window.addEventListener('scroll', updateActiveNav);

    // Smooth scroll behavior
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const element = document.querySelector(href);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });
}

// ========================================
// NAVIGATION FUNCTIONS
// ========================================

function updateActiveNav() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= sectionTop - 100) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
}

// ========================================
// STORY INTERACTIONS
// ========================================

const royalAmbienceState = {
    context: null,
    masterGain: null,
    oscillators: [],
    lfoOscillator: null,
    lfoGain: null,
    chimeInterval: null,
    playing: false
};

function scrollToStory() {
    const storySection = document.getElementById('stories');
    if (storySection) {
        storySection.scrollIntoView({ behavior: 'smooth' });
        // Add a subtle highlight effect
        storySection.style.animation = 'highlight 2s ease-in-out';
    }
}

function playAudio() {
    if (royalAmbienceState.playing) {
        stopRoyalAmbience();
        return;
    }

    startRoyalAmbience();
}

function startRoyalAmbience() {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;

    if (!AudioContextClass) {
        showNotification('⚠️ Your browser cannot play the royal ambience.', 'error');
        return;
    }

    if (!royalAmbienceState.context || royalAmbienceState.context.state === 'closed') {
        royalAmbienceState.context = new AudioContextClass();
    }

    const context = royalAmbienceState.context;
    const masterGain = context.createGain();
    const royalFilter = context.createBiquadFilter();
    const lfoOscillator = context.createOscillator();
    const lfoGain = context.createGain();

    masterGain.gain.value = 0.0001;
    royalFilter.type = 'lowpass';
    royalFilter.frequency.value = 900;
    royalFilter.Q.value = 0.7;

    royalFilter.connect(masterGain);
    masterGain.connect(context.destination);

    const droneFrequencies = [55, 110, 165];
    const oscillators = droneFrequencies.map((frequency, index) => {
        const oscillator = context.createOscillator();
        const oscillatorGain = context.createGain();

        oscillator.type = index === 0 ? 'sine' : 'triangle';
        oscillator.frequency.value = frequency;
        oscillatorGain.gain.value = index === 0 ? 0.07 : 0.035;

        oscillator.connect(oscillatorGain);
        oscillatorGain.connect(royalFilter);
        oscillator.start();

        return oscillator;
    });

    lfoOscillator.type = 'sine';
    lfoOscillator.frequency.value = 0.08;
    lfoGain.gain.value = 0.018;
    lfoOscillator.connect(lfoGain);
    lfoGain.connect(masterGain.gain);
    lfoOscillator.start();

    royalAmbienceState.context = context;
    royalAmbienceState.masterGain = masterGain;
    royalAmbienceState.oscillators = oscillators;
    royalAmbienceState.lfoOscillator = lfoOscillator;
    royalAmbienceState.lfoGain = lfoGain;

    context.resume().then(() => {
        fadeInRoyalAmbience(masterGain);
        playRoyalChime(context, royalFilter);
        royalAmbienceState.chimeInterval = window.setInterval(() => {
            playRoyalChime(context, royalFilter);
        }, 8000);

        royalAmbienceState.playing = true;
        updateRoyalAmbienceButton(true);
        showNotification('✨ Royal ambience is now playing.', 'success');
    }).catch(() => {
        stopRoyalAmbience();
        showNotification('⚠️ Unable to start the royal ambience.', 'error');
    });
}

function stopRoyalAmbience() {
    if (royalAmbienceState.chimeInterval) {
        clearInterval(royalAmbienceState.chimeInterval);
        royalAmbienceState.chimeInterval = null;
    }

    if (royalAmbienceState.oscillators.length) {
        royalAmbienceState.oscillators.forEach(oscillator => {
            try {
                oscillator.stop();
            } catch (error) {
                console.warn('Royal ambience oscillator already stopped', error);
            }
            try {
                oscillator.disconnect();
            } catch (error) {
                console.warn('Royal ambience oscillator already disconnected', error);
            }
        });
    }

    if (royalAmbienceState.lfoOscillator) {
        try {
            royalAmbienceState.lfoOscillator.stop();
        } catch (error) {
            console.warn('Royal ambience LFO already stopped', error);
        }
        try {
            royalAmbienceState.lfoOscillator.disconnect();
        } catch (error) {
            console.warn('Royal ambience LFO already disconnected', error);
        }
    }

    if (royalAmbienceState.masterGain) {
        try {
            royalAmbienceState.masterGain.disconnect();
        } catch (error) {
            console.warn('Royal ambience master gain already disconnected', error);
        }
    }

    if (royalAmbienceState.context && royalAmbienceState.context.state !== 'closed') {
        royalAmbienceState.context.close().catch(() => {});
    }

    royalAmbienceState.context = null;
    royalAmbienceState.masterGain = null;
    royalAmbienceState.oscillators = [];
    royalAmbienceState.lfoOscillator = null;
    royalAmbienceState.lfoGain = null;
    royalAmbienceState.playing = false;

    updateRoyalAmbienceButton(false);
    showNotification('🎻 Royal ambience stopped.', 'info');
}

function fadeInRoyalAmbience(masterGain) {
    const currentTime = royalAmbienceState.context.currentTime;
    masterGain.gain.cancelScheduledValues(currentTime);
    masterGain.gain.setValueAtTime(0.0001, currentTime);
    masterGain.gain.exponentialRampToValueAtTime(0.22, currentTime + 3);
}

function playRoyalChime(context, destination) {
    const now = context.currentTime;
    const chimeFrequencies = [523.25, 659.25, 783.99];

    chimeFrequencies.forEach((frequency, index) => {
        const oscillator = context.createOscillator();
        const gain = context.createGain();

        oscillator.type = 'triangle';
        oscillator.frequency.value = frequency;
        gain.gain.setValueAtTime(0.0001, now + index * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.07, now + index * 0.07 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.07 + 2.8);

        oscillator.connect(gain);
        gain.connect(destination);
        oscillator.start(now + index * 0.07);
        oscillator.stop(now + index * 0.07 + 3);
    });
}

function updateRoyalAmbienceButton(isPlaying) {
    const toggleButton = document.getElementById('royal-ambience-toggle');

    if (!toggleButton) {
        return;
    }

    toggleButton.setAttribute('aria-pressed', String(isPlaying));
    toggleButton.innerHTML = isPlaying
        ? '<span class="btn-icon">⏹</span> Stop Royal Ambience'
        : '<span class="btn-icon">🎧</span> Play Royal Ambience';

// ========================================
// FORM HANDLING
// ========================================

function handleSubscribe(event) {
    event.preventDefault();
    
    const form = event.target;
    const email = form.querySelector('.input-email').value;
    
    // Validate email
    if (validateEmail(email)) {
        // Simulate subscription (in real app, this would be sent to server)
        console.log('Subscribed with email:', email);
        
        // Show success message
        showNotification('✨ Welcome to the tale! Check your email for a gift.', 'success');
        
        // Reset form
        form.reset();
        
        // You could send this to a Python backend:
        // sendSubscriptionToBackend(email);
    } else {
        showNotification('⚠️ Please enter a valid email address', 'error');
    }
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// ========================================
// NOTIFICATIONS
// ========================================

function showNotification(message, type = 'info') {
    // Remove existing notification
    const existing = document.querySelector('.notification');
    if (existing) {
        existing.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? 'linear-gradient(135deg, #1f4b78, #d8b15a)' : type === 'error' ? 'linear-gradient(135deg, #5a2030, #9d5c5c)' : 'linear-gradient(135deg, #17366e, #2f5fbf)'};
        color: #fdf8ee;
        border-radius: 12px;
        font-family: 'Lora', serif;
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
        border: 1px solid ${type === 'success' ? 'rgba(216, 177, 90, 0.7)' : type === 'error' ? 'rgba(201, 108, 108, 0.65)' : 'rgba(133, 164, 255, 0.55)'};
        box-shadow: 0 12px 30px rgba(0, 0, 0, 0.28);
    `;

    document.body.appendChild(notification);

    // Auto-remove after 4 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// ========================================
// ANIMATIONS
// ========================================

function addAnimationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }

        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }

        @keyframes highlight {
            0% {
                background-color: transparent;
            }
            50% {
                background-color: rgba(47, 95, 191, 0.12);
            }
            100% {
                background-color: transparent;
            }
        }

        .nav-link.active {
            color: var(--accent-gold);
        }

        .nav-link.active::after {
            width: 100%;
        }
    `;
    document.head.appendChild(style);
}

// Call animation setup
addAnimationStyles();

// ========================================
// ACCESSIBILITY FEATURES
// ========================================

function applyAccessibilityFeatures() {
    // Add keyboard navigation
    document.addEventListener('keydown', function(e) {
        // Skip to main content (Ctrl + /)
        if (e.ctrlKey && e.key === '/') {
            e.preventDefault();
            document.querySelector('.container').focus();
        }
        
        // Close notifications (Escape)
        if (e.key === 'Escape') {
            const notification = document.querySelector('.notification');
            if (notification) {
                notification.remove();
            }
        }
    });

    // Enhance form accessibility
    const emailInput = document.querySelector('.input-email');
    if (emailInput) {
        emailInput.addEventListener('invalid', function(e) {
            e.preventDefault();
            showNotification('⚠️ Please enter a valid email address', 'error');
        });
    }
}

// ========================================
// INTERACTIVE ENHANCEMENTS
// ========================================

// Fade in elements as they come into view
function observeElements() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });

    // Apply to character cards and world items
    document.querySelectorAll('.character-card, .world-item').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
}

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', observeElements);
} else {
    observeElements();
}

// ========================================
// PYTHON BACKEND INTEGRATION
// ========================================

// Function to send subscription data to Python backend
async function sendSubscriptionToBackend(email) {
    try {
        const response = await fetch('http://localhost:5000/subscribe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                timestamp: new Date().toISOString()
            })
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Subscription successful:', data);
            return true;
        } else {
            console.error('Subscription failed:', response.statusText);
            return false;
        }
    } catch (error) {
        console.error('Error sending subscription:', error);
        return false;
    }
}

// ========================================
// READING TIME CALCULATION
// ========================================

function calculateReadingTime() {
    const storyContent = document.querySelector('.story-content');
    if (!storyContent) return;

    const text = storyContent.innerText;
    const wordsPerMinute = 200;
    const wordCount = text.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);

    // Update reading time if element exists
    const readingTimeElement = document.querySelector('.reading-time');
    if (readingTimeElement) {
        readingTimeElement.textContent = `${readingTime} min read`;
    }

    return readingTime;
}

// Calculate on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', calculateReadingTime);
} else {
    calculateReadingTime();
}

// ========================================
// THEME TOGGLE (Optional Enhancement)
// ========================================

function initializeThemeToggle() {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
    }
}

// ========================================
// PAGE VISIBILITY HANDLER
// ========================================

document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        console.log('User left the page');
    } else {
        console.log('User returned to the page');
    }
});

// ========================================
// SCROLL PERFORMANCE
// ========================================

let ticking = false;

window.addEventListener('scroll', function() {
    if (!ticking) {
        window.requestAnimationFrame(function() {
            // Update active navigation
            updateActiveNav();
            ticking = false;
        });
        ticking = true;
    }
});

// ========================================
// LOG INITIALIZATION
// ========================================

console.log('✦ Echoes of the Forgotten Kingdom - Initialized ✦');
console.log('Welcome to the tale. May your reading be peaceful.');
