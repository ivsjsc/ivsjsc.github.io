// General utility functions and FAB button initialization
// This file should NOT contain logic for loading header/footer components or language initialization
// as that is handled by loadComponents.js and language.js respectively.

/**
 * Debounces a function call, ensuring it's only executed after a specified delay.
 * Useful for events like window resizing or search input to limit execution frequency.
 * @param {Function} func The function to debounce.
 * @param {number} delay The delay in milliseconds.
 * @returns {Function} The debounced function.
 */
window.debounce = function(func, delay) {
    let debounceTimer;
    return function(...args) {
        const context = this;
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => func.apply(context, args), delay);
    };
};

/**
 * Initializes the Floating Action Buttons (FAB) for contact, share, and scroll-to-top.
 * Attaches event listeners and manages their visibility and submenu toggling.
 */
window.initializeFabButtons = function() {
    const fabElements = {
        contactMainBtn: document.getElementById('contact-main-btn'),
        contactOptions: document.getElementById('contact-options'),
        shareMainBtn: document.getElementById('share-main-btn'),
        shareOptions: document.getElementById('share-options'),
        scrollToTopBtn: document.getElementById('scroll-to-top-btn')
    };

    // Check if all necessary FAB elements exist before proceeding
    if (!fabElements.contactMainBtn || !fabElements.contactOptions || !fabElements.shareMainBtn || !fabElements.shareOptions || !fabElements.scrollToTopBtn) {
        console.warn("[script.js] One or more FAB elements not found. FAB functionality will be limited.");
        return;
    }

    /**
     * Toggles the visibility of a submenu and updates aria-expanded attribute.
     * Hides other open submenus to ensure only one is active at a time.
     * @param {HTMLElement} button The main button that triggers the submenu.
     * @param {HTMLElement} submenu The submenu element to toggle.
     */
    function toggleSubmenu(button, submenu) {
        const isHidden = submenu.classList.contains('fab-hidden');
        // Hide other submenus if they are open
        [fabElements.contactOptions, fabElements.shareOptions].forEach(menu => {
            if (menu !== submenu && !menu.classList.contains('fab-hidden')) {
                menu.classList.add('fab-hidden');
                const associatedBtn = menu === fabElements.contactOptions ? fabElements.contactMainBtn : fabElements.shareMainBtn;
                associatedBtn.setAttribute('aria-expanded', 'false');
            }
        });
        // Toggle the target submenu
        submenu.classList.toggle('fab-hidden');
        button.setAttribute('aria-expanded', String(submenu.classList.contains('fab-hidden') ? 'false' : 'true'));
        // Focus on the first option if submenu is shown, or back on the button if hidden
        if (!submenu.classList.contains('fab-hidden')) {
            const firstOption = submenu.querySelector('a');
            if (firstOption) firstOption.focus();
        } else {
            button.focus();
        }
    }

    // Event listeners for main contact and share buttons
    fabElements.contactMainBtn.addEventListener('click', (e) => { e.stopPropagation(); toggleSubmenu(fabElements.contactMainBtn, fabElements.contactOptions); });
    fabElements.shareMainBtn.addEventListener('click', (e) => { e.stopPropagation(); toggleSubmenu(fabElements.shareMainBtn, fabElements.shareOptions); });
    
    // Set up share links for Facebook and Zalo
    const pageUrl = window.location.href;
    const pageTitle = document.title;
    const shareFacebook = document.getElementById('share-facebook');
    if(shareFacebook) { 
        shareFacebook.href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`; 
        shareFacebook.target = '_blank';
    }
    const shareZalo = document.getElementById('share-zalo');
    if(shareZalo) { 
        shareZalo.href = `https://zalo.me/share?text=${encodeURIComponent(pageTitle + " - " + pageUrl)}`; 
        shareZalo.target = '_blank';
    }

    // Close submenus when clicking outside
    document.addEventListener('click', (e) => {
        if (!fabElements.contactOptions.classList.contains('fab-hidden') && !fabElements.contactMainBtn.contains(e.target) && !fabElements.contactOptions.contains(e.target)) {
            fabElements.contactOptions.classList.add('fab-hidden'); 
            fabElements.contactMainBtn.setAttribute('aria-expanded', 'false');
        }
        if (!fabElements.shareOptions.classList.contains('fab-hidden') && !fabElements.shareMainBtn.contains(e.target) && !fabElements.shareOptions.contains(e.target)) {
            fabElements.shareOptions.classList.add('fab-hidden'); 
            fabElements.shareMainBtn.setAttribute('aria-expanded', 'false');
        }
    });

    // Close submenus when Escape key is pressed
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            [fabElements.contactOptions, fabElements.shareOptions].forEach(menu => {
                if (!menu.classList.contains('fab-hidden')) {
                    menu.classList.add('fab-hidden');
                    const associatedBtn = menu === fabElements.contactOptions ? fabElements.contactMainBtn : fabElements.shareMainBtn;
                    associatedBtn.setAttribute('aria-expanded', 'false'); 
                    associatedBtn.focus(); // Return focus to the main button
                }
            });
        }
    });

    // Toggle scroll-to-top button visibility based on scroll position
    window.addEventListener('scroll', () => {
        fabElements.scrollToTopBtn.classList.toggle('fab-hidden', window.pageYOffset <= 100);
        fabElements.scrollToTopBtn.classList.toggle('flex', window.pageYOffset > 100);
    }, { passive: true });

    // Scroll to top when the button is clicked
    fabElements.scrollToTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
};

function handleHeaderScroll() {
    const header = document.getElementById('main-header');
    if (!header) {
        console.warn('[script.js] Header element not found');
        return;
    }

    let lastScroll = 0;
    
    const handleScroll = () => {
        const currentScroll = window.pageYOffset;
        
        // Add/remove background opacity based on scroll
        header.style.backgroundColor = currentScroll > 50 ? 
            'rgba(0, 0, 0, 0.9)' : 'rgba(0, 0, 0, 0.7)';
        
        // Optional: Hide/show header on scroll up/down
        header.style.transform = (currentScroll > lastScroll && currentScroll > 200) ?
            'translateY(-100%)' : 'translateY(0)';
        
        lastScroll = currentScroll;
    };

    // Initial call to set initial state
    handleScroll();
    
    // Add scroll listener
    window.addEventListener('scroll', handleScroll, { passive: true });
}

/**
 * Initializes all UI components in the correct order
 */
window.initializeUI = async function() {
    try {
        // Initialize language system first
        if (window.initializeLanguageSystem) {
            await window.initializeLanguageSystem();
        }
        
        // Initialize header after language system
        if (window.initializeHeader) {
            await window.initializeHeader();
        }
        
        // Initialize FAB buttons
        if (window.initializeFabButtons) {
            window.initializeFabButtons();
        }
        
        console.log('[script.js] All UI components initialized successfully');
    } catch (error) {
        console.error('[script.js] Error during UI initialization:', error);
    }
};

async function fetchPosts() {
    const newsContainer = document.getElementById('news-container');
    if (!newsContainer) {
        console.error("News container element not found.");
        return;
    }
    
    try {
        const response = await fetch(window.location.origin + '/posts.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const posts = await response.json();
        
        newsContainer.innerHTML = ''; 

        if (posts && posts.length > 0) {
            const latestPosts = posts.slice(0, 3); 
            latestPosts.forEach(post => {
                const currentLang = window.currentLang || 'vi';

                // Handle multilingual title
                let displayTitle = post.title;
                if (typeof post.title === 'object' && post.title !== null) {
                    displayTitle = post.title[currentLang] || post.title['vi'] || '';
                }

                // Handle multilingual excerpt
                let displayExcerpt = post.excerpt;
                if (typeof post.excerpt === 'object' && post.excerpt !== null) {
                    displayExcerpt = post.excerpt[currentLang] || post.excerpt['vi'] || '';
                }

                // Format date
                const displayDate = new Date(post.date).toLocaleDateString('vi-VN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });

                const postElement = document.createElement('div');
                postElement.className = 'bg-white dark:bg-slate-800 dark:border-slate-700 p-6 rounded-lg shadow-md flex flex-col transition-transform duration-300 ease-in-out hover:scale-105';
                postElement.setAttribute('data-aos', 'fade-up');
                postElement.innerHTML = `
                    <img src="${post.image || 'https://placehold.co/400x250/cccccc/333333?text=Tin+tức'}" 
                         alt="${post.image_alt?.[currentLang] || post.image_alt?.['vi'] || displayTitle}" 
                         class="rounded-md mb-4 object-cover w-full h-48">
                    <h3 class="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">${displayTitle}</h3>
                    <p class="text-gray-600 dark:text-gray-400 text-sm mb-3">${displayDate}</p>
                    <p class="text-gray-700 dark:text-gray-300 mb-4 flex-grow line-clamp-3">${displayExcerpt}</p>
                    <a href="${post.link}" 
                       class="mt-auto text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-500 font-medium inline-flex items-center">
                        ${currentLang === 'vi' ? 'Đọc thêm' : 'Read more'}
                        <i class="fas fa-arrow-right ml-1"></i>
                    </a>
                `;
                newsContainer.appendChild(postElement);
            });
        } else {
            newsContainer.innerHTML = `
                <p class="text-gray-500 dark:text-gray-400 col-span-full text-center" data-lang-key="no_news_available">
                    ${window.currentLang === 'vi' ? 'Không có tin tức nào để hiển thị.' : 'No news available.'}
                </p>`;
        }
    } catch (error) {
        console.error('Error fetching or processing posts.json:', error);
        newsContainer.innerHTML = `
            <p class="text-red-500 dark:text-red-400 col-span-full text-center" data-lang-key="news_load_error">
                ${window.currentLang === 'vi' ? 
                  `Lỗi tải tin tức: ${error.message}. Vui lòng thử lại sau.` : 
                  `Error loading news: ${error.message}. Please try again later.`}
            </p>`;
    }
}
