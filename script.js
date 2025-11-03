// Register service worker for PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => console.log('SW registered'))
            .catch(error => console.log('SW registration failed'));
    });
}

// Import Supabase
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Initialize Supabase
const supabaseUrl = 'https://hbtgrmjjkgkaiovjaivp.supabase.co';
const supabaseAnonKey = 'sb_publishable_f2am10dPyycWepX-0-M93Q_TnSdJLRW';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Track page visits
let visitorId = localStorage.getItem('visitor_id');
if (!visitorId) {
    visitorId = crypto.randomUUID();
    localStorage.setItem('visitor_id', visitorId);
}

// Function to generate a random name
function generateRandomName() {
    const adjectives = ['Swift', 'Bold', 'Clever', 'Brave', 'Silent', 'Mighty', 'Wise', 'Quick', 'Fierce', 'Gentle'];
    const nouns = ['Eagle', 'Wolf', 'Tiger', 'Bear', 'Hawk', 'Lion', 'Fox', 'Owl', 'Shark', 'Panther'];
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    return `${adj} ${noun}`;
}

// Track visit in Supabase
async function trackVisit() {
    try {
        // Check if visitor exists
        const { data: existing, error: selectError } = await supabase
            .from('leaderboard')
            .select('visit_count, random_name')
            .eq('visitor_id', visitorId)
            .single();

        if (selectError && selectError.code !== 'PGRST116') { // PGRST116 is no rows
            throw selectError;
        }

        if (existing) {
            // Update visit count
            const { error: updateError } = await supabase
                .from('leaderboard')
                .update({ visit_count: existing.visit_count + 1 })
                .eq('visitor_id', visitorId);

            if (updateError) throw updateError;
        } else {
            // Insert new entry
            const randomName = generateRandomName();
            const { error: insertError } = await supabase
                .from('leaderboard')
                .insert({ visitor_id: visitorId, random_name: randomName, visit_count: 1 });

            if (insertError) throw insertError;
        }
    } catch (error) {
        console.error('Error tracking visit:', error);
    }
}

trackVisit();

// Display leaderboard
async function displayLeaderboard() {
    try {
        const { data, error } = await supabase
            .from('leaderboard')
            .select('random_name, visit_count')
            .order('visit_count', { ascending: false })
            .limit(10);

        if (error) throw error;

        const leaderboardContent = document.getElementById('leaderboard-content');
        if (data && data.length > 0) {
            let html = '<ol>';
            data.forEach((entry, index) => {
                html += `<li><strong>${entry.random_name}</strong> - ${entry.visit_count} visits</li>`;
            });
            html += '</ol>';
            leaderboardContent.innerHTML = html;
        } else {
            leaderboardContent.innerHTML = '<p>No visitors yet.</p>';
        }
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        document.getElementById('leaderboard-content').innerHTML = '<p>Unable to load leaderboard.</p>';
    }
}

displayLeaderboard();

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
