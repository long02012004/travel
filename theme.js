/**
 * theme.js - Universal Theme Management for AI Travel Planner
 * Handles Dark/Light mode transitions and persistence across all pages.
 */

document.addEventListener('DOMContentLoaded', () => {
    const themeBtn = document.getElementById('themeToggle');
    const themeIcon = themeBtn ? themeBtn.querySelector('i') : null;

    // 1. Initialize Theme from LocalStorage
    const initTheme = () => {
        const savedTheme = localStorage.getItem('theme') || 'sunrise';
        applyTheme(savedTheme);
    };

    const applyTheme = (theme) => {
        // Remove all theme classes first
        document.body.classList.remove('sunset-orange-theme', 'sunset-purple-theme');
        
        let iconClass = 'ph-bold ph-sun';
        let tooltip = 'Chế độ Bình minh';

        if (theme === 'sunset-orange') {
            document.body.classList.add('sunset-orange-theme');
            iconClass = 'ph-bold ph-sun-horizon';
            tooltip = 'Chế độ Hoàng hôn Cam';
        } else if (theme === 'sunset-purple') {
            document.body.classList.add('sunset-purple-theme');
            iconClass = 'ph-bold ph-moon-stars';
            tooltip = 'Chế độ Hoàng hôn Tím';
        }

        if (themeIcon) themeIcon.className = iconClass;
        if (themeBtn) themeBtn.title = tooltip;
        
        localStorage.setItem('theme', theme);
        window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme } }));
    };

    // 2. Toggle Theme Function (Cycles: Sunrise -> Orange -> Purple)
    const toggleTheme = () => {
        const currentTheme = localStorage.getItem('theme') || 'sunrise';
        let nextTheme = 'sunset-orange';

        if (currentTheme === 'sunset-orange') nextTheme = 'sunset-purple';
        else if (currentTheme === 'sunset-purple') nextTheme = 'sunrise';

        applyTheme(nextTheme);
    };

    // 3. Attach Listener
    if (themeBtn) {
        themeBtn.addEventListener('click', toggleTheme);
    }

    // Run Init
    initTheme();
});
