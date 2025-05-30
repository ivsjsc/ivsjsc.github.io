function initializeHeader() {
    const header = document.querySelector('.sticky-header');
    let lastScroll = 0;
    
    // Handle scroll effects
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // Add/remove scrolled class
        header.classList.toggle('scrolled', currentScroll > 0);
        
        // Hide/show header on scroll
        if (currentScroll > lastScroll && currentScroll > 100) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScroll = currentScroll;
    }, { passive: true });

    // Handle mobile menu
    const mobileMenuBtn = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu-panel');
    const iconMenuOpen = document.getElementById('icon-menu-open');
    const iconMenuClose = document.getElementById('icon-menu-close');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
            mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
            mobileMenu.classList.toggle('active');
            iconMenuOpen?.classList.toggle('hidden');
            iconMenuClose?.classList.toggle('hidden');
            document.body.classList.toggle('overflow-hidden');
        });
    }

    // Handle dropdowns
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

    // Close dropdowns on outside click
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.dropdown-button')) {
            dropdowns.forEach(dropdown => {
                const menu = dropdown.nextElementSibling;
                if (!menu) return;
                dropdown.setAttribute('aria-expanded', 'false');
                menu.classList.remove('active');
            });
        }
    });
}

document.addEventListener('DOMContentLoaded', initializeHeader);
        document.addEventListener('DOMContentLoaded', function() {
            const mobileMenuButton = document.getElementById('mobile-menu-button');
            const mobileMenuPanel = document.getElementById('mobile-menu-panel');

            function toggleMenu() {
                const isExpanded = mobileMenuButton.getAttribute('aria-expanded') === 'true';
                mobileMenuButton.setAttribute('aria-expanded', !isExpanded);
                mobileMenuPanel.classList.toggle('active');
                document.body.style.overflow = isExpanded ? '' : 'hidden';
            }

            mobileMenuButton.addEventListener('click', toggleMenu);

            mobileMenuPanel.addEventListener('click', function(e) {
                if (e.target === mobileMenuPanel) {
                    toggleMenu();
                }
            });

            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && mobileMenuPanel.classList.contains('active')) {
                    toggleMenu();
                }
            });
        });