// Force page to start at the top on all scenarios
function ensureTopPosition() {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
}

// Apply on multiple events to be safe
window.addEventListener('load', function() {
    ensureTopPosition();
    setTimeout(ensureTopPosition, 50);
    setTimeout(ensureTopPosition, 200);
});

document.addEventListener('DOMContentLoaded', function() {
    ensureTopPosition();
    
    // Clean URL - remove any fragments that might cause scrolling
    if (window.location.hash) {
        history.replaceState(null, null, window.location.pathname + window.location.search);
    }
});

window.addEventListener('pageshow', function(event) {
    if (event.persisted) {
        ensureTopPosition();
    }
});

// Also fix for browser restoration
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

// Your existing loading screen script
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    const body = document.body;

    // Add a small delay for a smoother transition
    setTimeout(() => {
        if (preloader) {
            preloader.classList.add('preloader-hidden');
        }
        body.classList.remove('loading');
        ensureTopPosition(); // One more time after preloader
    }, 900);
});

// Your existing mobile menu toggle code
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    menuToggle.querySelector('i').classList.toggle('fa-bars');
    menuToggle.querySelector('i').classles.toggle('fa-times');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        if (navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            menuToggle.querySelector('i').classList.remove('fa-times');
            menuToggle.querySelector('i').classList.add('fa-bars');
        }
    });
});

// Your existing navbar scroll behavior
let lastScrollTop = 0;
const header = document.getElementById('header');
const navbarHeight = header.offsetHeight;

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Add scrolled class for styling
    if (scrollTop > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    // Hide/show navbar based on scroll direction
    if (scrollTop > lastScrollTop && scrollTop > navbarHeight) {
        // Scrolling down
        header.classList.remove('visible');
        header.classList.add('hidden');
    } else {
        // Scrolling up
        header.classList.remove('hidden');
        header.classList.add('visible');
    }
    
    lastScrollTop = scrollTop;
});

// Your existing scroll animation code
const animateElements = document.querySelectorAll('.animate-on-scroll');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animated');
        }
    });
}, {
    threshold: 0.15
});

animateElements.forEach(el => {
    observer.observe(el);
});

// Your existing form submission code
document.addEventListener('DOMContentLoaded', function () {
    const contactForm = document.getElementById('contactForm');
    const successNotification = document.getElementById('successNotification');
    const errorNotification = document.getElementById('errorNotification');
    const overlay = document.getElementById('overlay');
    const closeSuccessNotification = document.getElementById('closeSuccessNotification');
    const closeErrorNotification = document.getElementById('closeErrorNotification');
    const errorMessage = document.getElementById('errorMessage');

    // Your Google Apps Script URL
    const scriptURL = 'https://script.google.com/macros/s/AKfycbxs_jLC-vGKlKt3E-81yV972rMfl7_tFszRPboeYv93b36ucpJQ6KfjiGyxUyLGAA4f/exec';

    // Form submission handler
    contactForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        // Show loading state on button
        const submitBtn = document.getElementById('submit');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        try {
            // Create FormData object
            const formData = new FormData(contactForm);

            // Send data to Google Apps Script
            const response = await fetch(scriptURL, {
                method: 'POST',
                body: formData,
                mode: 'no-cors' // Important for Google Apps Script
            });

            // Since we're using no-cors, we can't read the response
            // But if the request completes, we assume it was successful

            // Show success notification
            showNotification(successNotification);

            // Reset form
            contactForm.reset();

        } catch (error) {
            console.error('Error:', error);
            errorMessage.textContent = 'There was an error sending your message. Please try again later.';
            showNotification(errorNotification);
        } finally {
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });

    // Close notification handlers
    closeSuccessNotification.addEventListener('click', function () {
        hideNotification(successNotification);
    });

    closeErrorNotification.addEventListener('click', function () {
        hideNotification(errorNotification);
    });

    // Close notification when clicking on overlay
    overlay.addEventListener('click', function () {
        hideNotification(successNotification);
        hideNotification(errorNotification);
    });

    // Show notification
    function showNotification(notification) {
        overlay.classList.add('active');
        notification.classList.add('active');
    }

    // Hide notification
    function hideNotification(notification) {
        overlay.classList.remove('active');
        notification.classList.remove('active');
    }
});

// Your existing parallax scrolling effect
const parallaxBackgrounds = document.querySelectorAll('.parallax-bg');
const floatingElements = document.querySelectorAll('.floating-element');
const heroImage = document.querySelector('.hero-image');

let latestKnownScrollY = 0;
let ticking = false;

function updateParallax(scrollPosition) {
    // Your existing parallax code
    parallaxBackgrounds.forEach(bg => {
        const yPos = -(scrollPosition * 0.5);
        bg.style.backgroundPositionY = `${yPos}px`;
    });

    floatingElements.forEach((el, index) => {
        const speedY = (index % 2 === 0 ? 0.08 : -0.12);
        const speedX = (index % 3 === 0 ? 0.05 : -0.07);

        const yTransform = scrollPosition * speedY;
        const xTransform = scrollPosition * speedX;

        el.style.transform = `translate(${xTransform}px, ${yTransform}px)`;
    });

    if (heroImage) {
        const imageTransformY = scrollPosition * 0.25;
        heroImage.style.transform = `translateY(calc(-50% + ${imageTransformY}px))`;
    }
}

function onScroll() {
    latestKnownScrollY = window.scrollY;

    if (!ticking) {
        window.requestAnimationFrame(() => {
            updateParallax(latestKnownScrollY);
            ticking = false;
        });

        ticking = true;
    }
}

window.addEventListener('scroll', onScroll, { passive: true });
updateParallax(window.scrollY);