document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        themeToggle.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
    });
});