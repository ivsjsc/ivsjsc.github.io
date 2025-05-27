window.initializeHeader = function() {
    const header = document.querySelector('.sticky-header');
    if (!header) return;

    // Initialize dropdowns
    const dropdowns = document.querySelectorAll('.dropdown-button');
    dropdowns.forEach(dropdown => {
        const menu = dropdown.nextElementSibling;
        if (!menu) return;

        dropdown.addEventListener('click', (e) => {
            e.preventDefault();
            const isExpanded = dropdown.getAttribute('aria-expanded') === 'true';
            dropdown.setAttribute('aria-expanded', !isExpanded);
            menu.classList.toggle('active');
        });
    });

    // Mobile menu
    const mobileBtn = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu-panel');
    
    if (mobileBtn && mobileMenu) {
        mobileBtn.addEventListener('click', () => {
            const isExpanded = mobileBtn.getAttribute('aria-expanded') === 'true';
            mobileBtn.setAttribute('aria-expanded', !isExpanded);
            mobileMenu.classList.toggle('active');
            document.body.classList.toggle('overflow-hidden');
        });
    }
};