import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm'

const supabaseUrl = 'https://hbtgrmjjkgkaiovjaivp.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhidGdybWpqa2drYWlvdmphaXZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxNDExOTgsImV4cCI6MjA3NzcxNzE5OH0.NFD50GZ9R2KiVOcktaQbqDTyYM2-6WtxyHozxMXANLI'  // Supabase anon key
const supabase = createClient(supabaseUrl, supabaseKey)

// Track page visits
let visitorId = localStorage.getItem('visitor_id');
if (!visitorId) {
    visitorId = crypto.randomUUID();
    localStorage.setItem('visitor_id', visitorId);
}

window.addEventListener('load', async () => {
  const { error } = await supabase
    .from('visits')
    .insert([
      { 
        page: window.location.pathname, 
        timestamp: new Date().toISOString(),
        user_agent: navigator.userAgent,
        visitor_id: visitorId,
        referrer: document.referrer
      }
    ])
  if (error) console.error('Error saving visit:', error)
})

const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');

hamburger.addEventListener('click', () => {
  navbar.classList.toggle('nav-open');
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
        // Close mobile nav after clicking
        navbar.classList.remove('nav-open');
    });
});

const themeToggle = document.getElementById('theme-toggle');
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
});

// Keyboard navigation for nav
const navLinks = document.querySelectorAll('nav a, #theme-toggle');
navbar.addEventListener('keydown', (e) => {
    const currentIndex = Array.from(navLinks).indexOf(document.activeElement);
    if (e.key === 'ArrowRight') {
        e.preventDefault();
        const nextIndex = (currentIndex + 1) % navLinks.length;
        navLinks[nextIndex].focus();
    } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        const prevIndex = (currentIndex - 1 + navLinks.length) % navLinks.length;
        navLinks[prevIndex].focus();
    }
});

const form = document.querySelector('.contact-form');
form.addEventListener('submit', (e) => {
    // Clear previous errors
    document.getElementById('name-error').textContent = '';
    document.getElementById('email-error').textContent = '';
    document.getElementById('message-error').textContent = '';

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    let isValid = true;

    if (!name) {
        document.getElementById('name-error').textContent = 'Name is required.';
        isValid = false;
    }
    if (!email) {
        document.getElementById('email-error').textContent = 'Email is required.';
        isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
        document.getElementById('email-error').textContent = 'Please enter a valid email address.';
        isValid = false;
    }
    if (!message) {
        document.getElementById('message-error').textContent = 'Message is required.';
        isValid = false;
    }

    if (!isValid) {
        e.preventDefault();
        return;
    }

    // If valid, allow form submission to Formspree
    // No alert needed, Formspree will handle the submission
});

// Scroll-triggered animations
const sections = document.querySelectorAll('section');

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
        }
    });
}, observerOptions);

sections.forEach(section => {
    sectionObserver.observe(section);
});

// Scrollspy for nav
const scrollNavLinks = document.querySelectorAll('nav a');

function setActiveLink() {
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - sectionHeight / 3) {
            current = section.getAttribute('id');
        }
    });

    scrollNavLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// Hide/show nav on scroll
let lastScrollY = window.scrollY;
const backToTop = document.getElementById('back-to-top');

backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

function handleScroll() {
    const currentScrollY = window.scrollY;
    lastScrollY = currentScrollY;
    setActiveLink();
    document.documentElement.style.setProperty('--scroll', window.scrollY);

    // Show/hide back-to-top
    if (currentScrollY > 300) {
        backToTop.classList.add('show');
    } else {
        backToTop.classList.remove('show');
    }
}

window.addEventListener('scroll', handleScroll);

// Staggered skills animation
const skillsSection = document.getElementById('skills');

const skillsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const skillsItems = entry.target.querySelectorAll('.skills-category li');
            skillsItems.forEach((item, index) => {
                setTimeout(() => {
                    item.classList.add('animate-in');
                }, index * 100);
            });
            skillsObserver.unobserve(entry.target); // Animate only once
        }
    });
}, { threshold: 0.5 });

skillsObserver.observe(skillsSection);
