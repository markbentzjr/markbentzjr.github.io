document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

const themeToggle = document.getElementById('theme-toggle');
themeToggle.textContent = document.body.classList.contains('dark') ? 'Light Mode' : 'Dark Mode';
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    themeToggle.textContent = document.body.classList.contains('dark') ? 'Light Mode' : 'Dark Mode';
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

    // If valid, allow mailto, but show a message
    alert('Form submitted! Your email client will open with the message.');
});

// Physics Demo
const launchBtn = document.getElementById('launch-btn');
const canvas = document.getElementById('physics-canvas');
const ctx = canvas.getContext('2d');
const g = 9.8; // gravity m/s^2
const scale = 10; // pixels per meter
let animationId;

launchBtn.addEventListener('click', () => {
    const angle = parseFloat(document.getElementById('angle').value);
    const velocity = parseFloat(document.getElementById('velocity').value);
    
    if (isNaN(angle) || angle < 0 || angle > 90) {
        alert('Please enter a valid angle between 0 and 90 degrees.');
        return;
    }
    if (isNaN(velocity) || velocity <= 0) {
        alert('Please enter a valid positive velocity.');
        return;
    }
    
    // Stop any ongoing animation
    if (animationId) cancelAnimationFrame(animationId);
    
    // Start animation
    animateProjectile(angle, velocity);
});

function animateProjectile(angle, velocity) {
    const theta = angle * Math.PI / 180; // to radians
    const vx = velocity * Math.cos(theta);
    const vy0 = velocity * Math.sin(theta);
    let t = 0;
    const dt = 0.05; // time step
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw ground
        ctx.strokeStyle = document.body.classList.contains('dark') ? '#e5e7eb' : '#374151';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, canvas.height - 20);
        ctx.lineTo(canvas.width, canvas.height - 20);
        ctx.stroke();
        
        // Calculate position
        const x = vx * t * scale;
        const y = canvas.height - 20 - (vy0 * t - 0.5 * g * t * t) * scale;
        
        if (y >= canvas.height - 20 || x > canvas.width) {
            // Stop animation
            ctx.fillStyle = document.body.classList.contains('dark') ? '#f97316' : '#f97316';
            ctx.beginPath();
            ctx.arc(x, canvas.height - 20, 5, 0, 2 * Math.PI);
            ctx.fill();
            return;
        }
        
        // Draw projectile
        ctx.fillStyle = document.body.classList.contains('dark') ? '#f97316' : '#f97316';
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, 2 * Math.PI);
        ctx.fill();
        
        t += dt;
        animationId = requestAnimationFrame(draw);
    }
    
    draw();
}

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
const navLinks = document.querySelectorAll('nav a');

function setActiveLink() {
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - sectionHeight / 3) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', () => {
    setActiveLink();
    document.documentElement.style.setProperty('--scroll', window.scrollY);
});

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
