function initializeHeader() {
    const header = document.querySelector('.sticky-header');
    let lastScroll = 0;
    
    // Scroll handler
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
    
    // Active link handler
    const navLinks = document.querySelectorAll('.nav-link');
    const currentPath = window.location.pathname;
    
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initializeHeader);