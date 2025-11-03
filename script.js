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
