/* ========================== */
/* Optimized JavaScript Logic */
/* Version: Refactored 2.0    */
/* ========================== */

// --- Constants ---
const HEADER_COMPONENT_URL = '../header.html';
const FOOTER_COMPONENT_URL = '../footer.html';
const POSTS_JSON_URL = 'posts.json';

const HEADER_PLACEHOLDER_ID = 'header-placeholder';
const FOOTER_PLACEHOLDER_ID = 'footer-placeholder';
const NEWS_CONTAINER_ID = 'news-container';
const FOOTER_YEAR_ID = 'current-year';
const SEARCH_HIGHLIGHT_CLASS = 'search-highlight';
const THEME_TOGGLE_ID = 'theme-toggle'; // Main theme toggle (e.g., in index.html)
// IDs for theme toggles inside header are assumed to be 'theme-toggle' (desktop)
// and 'theme-toggle-mobile' as per previous header.html fixes.

// --- State ---
let isMenuInitialized = false;
let isLanguageSystemReady = false;
let isPerformingSearch = false; // Flag to prevent search recursion

// --- DOM Cache (for static elements on the main page) ---
const domCache = {};

function cacheStaticElements() {
    domCache.headerPlaceholder = document.getElementById(HEADER_PLACEHOLDER_ID);
    domCache.footerPlaceholder = document.getElementById(FOOTER_PLACEHOLDER_ID);
    domCache.newsContainer = document.getElementById(NEWS_CONTAINER_ID);
    domCache.mainThemeToggleButton = document.getElementById(THEME_TOGGLE_ID); // If a global one exists
}

// --- Utility Functions ---

/**
 * Debounce function.
 * @param {Function} func - Function to debounce.
 * @param {number} delay - Delay in milliseconds.
 * @returns {Function} Debounced function.
 */
function debounce(func, delay) {
    let debounceTimer;
    return function(...args) {
        const context = this;
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => func.apply(context, args), delay);
    };
}

/**
 * Loads HTML component into a placeholder.
 * @param {string} placeholderId - ID of the placeholder element.
 * @param {string} componentUrl - URL of the component HTML file.
 * @returns {Promise<HTMLElement | null>} The loaded placeholder element or null.
 */
async function loadComponent(placeholderId, componentUrl) {
    console.log(`[Script] Loading component: ${componentUrl} into #${placeholderId}`);
    const placeholder = document.getElementById(placeholderId);

    if (!placeholder) {
        console.error(`[Script] Placeholder "#${placeholderId}" not found.`);
        return null;
    }

    const componentName = componentUrl.split('/').pop();
    if (placeholder.innerHTML.trim() === '') {
        placeholder.innerHTML = `<p class="text-gray-500 text-center p-4" data-lang-key="loading_component" data-component-name="${componentName}">Đang tải ${componentName}...</p>`;
    }

    try {
        const response = await fetch(componentUrl);
        if (!response.ok) {
            throw new Error(`HTTP error ${response.status}`);
        }
        const html = await response.text();
        const currentPlaceholder = document.getElementById(placeholderId); // Re-fetch in case it was removed
        if (!currentPlaceholder) {
            console.error(`[Script] Placeholder "#${placeholderId}" disappeared after fetch.`);
            return null;
        }
        currentPlaceholder.innerHTML = html;
        console.log(`[Script] Successfully loaded ${componentUrl} into #${placeholderId}`);
        return currentPlaceholder;
    } catch (error) {
        console.error(`[Script] Error loading ${componentUrl}:`, error);
        const currentPlaceholder = document.getElementById(placeholderId);
        if (currentPlaceholder) {
            currentPlaceholder.innerHTML = `<p class="text-red-500 text-center p-4" data-lang-key="error_loading_component" data-error-message="${error.message}">Lỗi tải ${componentName}: ${error.message}.</p>`;
        }
        return null;
    }
}

// --- Initialization Functions for Loaded Components ---

function setupMobileMenu(headerElement) {
    const mobileMenuButton = headerElement.querySelector('#mobile-menu-button');
    const mobileMenuPanel = headerElement.querySelector('#mobile-menu-panel');
    const mobileMenuOverlay = headerElement.querySelector('#mobile-menu-overlay');
    const iconMenu = headerElement.querySelector('#icon-menu');
    const iconClose = headerElement.querySelector('#icon-close');
    const mobileCloseButton = headerElement.querySelector('#mobile-close-button');

    if (!mobileMenuButton || !mobileMenuPanel || !mobileMenuOverlay || !iconMenu || !iconClose || !mobileCloseButton) {
        console.warn("[Script] Mobile menu core elements not all found in header. Mobile menu might not work.");
        return;
    }

    const toggleMobileMenu = (forceOpenState) => {
        const isCurrentlyExpanded = mobileMenuButton.getAttribute('aria-expanded') === 'true';
        const shouldBeOpen = typeof forceOpenState === 'boolean' ? forceOpenState : !isCurrentlyExpanded;

        mobileMenuButton.setAttribute('aria-expanded', String(shouldBeOpen));
        iconMenu.classList.toggle('hidden', shouldBeOpen);
        iconClose.classList.toggle('hidden', !shouldBeOpen);

        if (shouldBeOpen) {
            mobileMenuOverlay.classList.remove('hidden');
            mobileMenuPanel.classList.remove('hidden');
            requestAnimationFrame(() => {
                mobileMenuOverlay.classList.add('active');
                mobileMenuPanel.classList.add('active');
            });
            document.body.classList.add('overflow-hidden');
        } else {
            mobileMenuOverlay.classList.remove('active');
            mobileMenuPanel.classList.remove('active');
            const transitionEndHandler = () => {
                if (!mobileMenuPanel.classList.contains('active')) {
                    mobileMenuPanel.classList.add('hidden');
                    mobileMenuOverlay.classList.add('hidden');
                }
                mobileMenuPanel.removeEventListener('transitionend', transitionEndHandler);
            };
            mobileMenuPanel.addEventListener('transitionend', transitionEndHandler);
            setTimeout(() => { // Fallback
                if (!mobileMenuPanel.classList.contains('active')) {
                    mobileMenuPanel.classList.add('hidden');
                    mobileMenuOverlay.classList.add('hidden');
                }
            }, 350);
            document.body.classList.remove('overflow-hidden');
        }
    };

    mobileMenuButton.addEventListener('click', () => toggleMobileMenu());
    mobileCloseButton.addEventListener('click', () => toggleMobileMenu(false));
    mobileMenuOverlay.addEventListener('click', () => toggleMobileMenu(false));

    mobileMenuPanel.querySelectorAll('a[href]:not(.mobile-submenu-toggle)').forEach(link => {
        link.addEventListener('click', () => setTimeout(() => toggleMobileMenu(false), 100));
    });

    // Mobile Submenu Accordion
    headerElement.querySelectorAll('#mobile-menu-panel .mobile-menu-item').forEach(item => {
        const button = item.querySelector(':scope > button.mobile-submenu-toggle');
        const submenu = item.querySelector(':scope > .mobile-submenu');
        const arrow = button?.querySelector('.submenu-arrow');

        if (!button || !submenu) return;

        submenu.style.maxHeight = '0';
        submenu.style.overflow = 'hidden';
        item.classList.remove('open');
        button.setAttribute('aria-expanded', 'false');
        if(arrow) arrow.classList.remove('rotate-90');

        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const parentItem = this.closest('.mobile-menu-item');
            if (!parentItem) return;

            const isOpen = parentItem.classList.toggle('open');
            this.setAttribute('aria-expanded', String(isOpen));
            if(arrow) arrow.classList.toggle('rotate-90', isOpen);

            submenu.style.maxHeight = isOpen ? `${submenu.scrollHeight}px` : '0';
            // Handle overflow after transition for opening
            if(isOpen) {
                submenu.addEventListener('transitionend', function onOpenTransitionEnd() {
                    if (submenu.style.maxHeight !== '0px') submenu.style.overflow = 'visible';
                    submenu.removeEventListener('transitionend', onOpenTransitionEnd);
                }, { once: true });
            } else {
                 submenu.style.overflow = 'hidden'; // Hide overflow immediately on close start
            }


            if (isOpen) { // Close siblings
                Array.from(parentItem.parentNode.children)
                    .filter(child => child !== parentItem && child.classList.contains('mobile-menu-item') && child.classList.contains('open'))
                    .forEach(sibling => {
                        sibling.classList.remove('open');
                        const siblingSubmenu = sibling.querySelector(':scope > .mobile-submenu');
                        const siblingButton = sibling.querySelector(':scope > button.mobile-submenu-toggle');
                        const siblingArrow = siblingButton?.querySelector('.submenu-arrow');
                        if (siblingSubmenu) {
                            siblingSubmenu.style.maxHeight = '0';
                            siblingSubmenu.style.overflow = 'hidden';
                        }
                        if (siblingButton) siblingButton.setAttribute('aria-expanded', 'false');
                        if (siblingArrow) siblingArrow.classList.remove('rotate-90');
                    });
            } else { // Collapse nested open submenus
                 parentItem.querySelectorAll('.mobile-menu-item.open').forEach(nestedOpenItem => {
                     nestedOpenItem.classList.remove('open');
                     const nestedSubmenu = nestedOpenItem.querySelector(':scope > .mobile-submenu');
                     const nestedButton = nestedOpenItem.querySelector(':scope > button.mobile-submenu-toggle');
                     const nestedArrow = nestedButton?.querySelector('.submenu-arrow');
                     if(nestedSubmenu) {
                         nestedSubmenu.style.maxHeight = '0';
                         nestedSubmenu.style.overflow = 'hidden';
                     }
                     if(nestedButton) nestedButton.setAttribute('aria-expanded', 'false');
                     if(nestedArrow) nestedArrow.classList.remove('rotate-90');
                });
            }
        });
    });
    console.log("[Script] Mobile menu logic initialized.");
}

function setupDesktopMenus(headerElement) {
    const desktopMenuItems = headerElement.querySelectorAll('#menu-items > .main-menu-item');
    if (desktopMenuItems.length === 0) {
        // console.warn("[Script] No desktop menu items found.");
        return;
    }

    const closeAllDesktopMenus = (exceptThisMenu) => {
        desktopMenuItems.forEach(item => {
            const toggleButton = item.querySelector('.desktop-menu-toggle');
            const submenu = item.querySelector('.submenu');
            if (submenu && submenu !== exceptThisMenu && submenu.classList.contains('open')) {
                submenu.classList.remove('open');
                submenu.classList.add('hidden'); // Ensure hidden for display:none
                if (toggleButton) {
                    toggleButton.setAttribute('aria-expanded', 'false');
                    toggleButton.classList.remove('active');
                }
                // Close sub-submenus
                submenu.querySelectorAll('.sub-submenu-container.open').forEach(container => {
                    container.classList.remove('open');
                    container.querySelector('.sub-submenu')?.classList.add('hidden');
                    container.querySelector('.desktop-submenu-toggle')?.setAttribute('aria-expanded', 'false');
                });
            }
        });
    };

    desktopMenuItems.forEach(item => {
        const toggleButton = item.querySelector('.desktop-menu-toggle');
        const submenu = item.querySelector('.submenu');

        if (toggleButton && submenu) {
            toggleButton.addEventListener('click', function (event) {
                event.stopPropagation();
                const isExpanded = this.getAttribute('aria-expanded') === 'true';
                if (!isExpanded) closeAllDesktopMenus(submenu); // Close others before opening

                submenu.classList.toggle('hidden', isExpanded);
                requestAnimationFrame(() => submenu.classList.toggle('open', !isExpanded));
                this.setAttribute('aria-expanded', String(!isExpanded));
                this.classList.toggle('active', !isExpanded);

                if (isExpanded) { // If closing this menu, close its sub-submenus
                    submenu.querySelectorAll('.sub-submenu-container.open').forEach(container => {
                        container.classList.remove('open');
                        container.querySelector('.sub-submenu')?.classList.add('hidden');
                        container.querySelector('.desktop-submenu-toggle')?.setAttribute('aria-expanded', 'false');
                    });
                }
            });

            submenu.querySelectorAll('.sub-submenu-container').forEach(container => {
                const subToggleButton = container.querySelector('.desktop-submenu-toggle');
                const subSubmenu = container.querySelector('.sub-submenu');
                if (subToggleButton && subSubmenu) {
                    subToggleButton.addEventListener('click', function(event) {
                        event.stopPropagation();
                        const isSubExpanded = this.getAttribute('aria-expanded') === 'true';
                        // Close other sub-submenus in the same parent
                        if (!isSubExpanded) {
                            submenu.querySelectorAll('.sub-submenu-container.open').forEach(openContainer => {
                                if (openContainer !== container) {
                                    openContainer.classList.remove('open');
                                    openContainer.querySelector('.sub-submenu')?.classList.add('hidden');
                                    openContainer.querySelector('.desktop-submenu-toggle')?.setAttribute('aria-expanded', 'false');
                                }
                            });
                        }
                        subSubmenu.classList.toggle('hidden', isSubExpanded);
                        requestAnimationFrame(() => subSubmenu.classList.toggle('open', !isSubExpanded));
                        this.setAttribute('aria-expanded', String(!isSubExpanded));
                        this.classList.toggle('active', !isSubExpanded);
                    });
                }
            });
        }
    });
    // Global click to close desktop menus
    document.addEventListener('click', (event) => {
        let clickedInsideMenu = false;
        desktopMenuItems.forEach(item => {
            if (item.contains(event.target)) clickedInsideMenu = true;
        });
        if (!clickedInsideMenu) closeAllDesktopMenus(null);
    });
    console.log("[Script] Desktop menu logic initialized.");
}

function setupDesktopSearch(headerElement) {
    const searchButton = headerElement.querySelector('#desktop-search-button');
    const searchContainer = headerElement.querySelector('#desktop-search-container');
    const searchInput = headerElement.querySelector('#desktop-search-input');
    const searchClose = headerElement.querySelector('#desktop-search-close');
    const consultationButton = headerElement.querySelector('.cta-button'); // cta-button might be generic
    const langDropdown = headerElement.querySelector('#desktop-language-dropdown');
    const themeToggle = headerElement.querySelector(`#${THEME_TOGGLE_ID}`); // Desktop theme toggle within header

    if (!searchButton || !searchContainer || !searchInput || !searchClose) {
        // console.warn("[Script] Desktop search elements not all found.");
        return;
    }

    const debouncedSearch = debounce(query => {
        if (typeof performSearch === 'function') performSearch(query);
        else console.warn("[Script] performSearch function not found.");
    }, 300);

    const toggleSearch = (show) => {
        const isActive = searchContainer.classList.contains('active');
        const shouldShow = typeof show === 'boolean' ? show : !isActive;

        searchButton.classList.toggle('hidden', shouldShow);
        if(consultationButton) consultationButton.classList.toggle('hidden', shouldShow);
        if(langDropdown) langDropdown.classList.toggle('hidden', shouldShow);
        if(themeToggle) themeToggle.classList.toggle('hidden', shouldShow);


        if (shouldShow) {
            searchContainer.classList.remove('hidden');
            searchContainer.classList.add('flex'); // Use flex for layout
            requestAnimationFrame(() => searchContainer.classList.add('active')); // For transition
            searchInput.focus();
        } else {
            searchContainer.classList.remove('active');
            searchInput.value = '';
            if (typeof clearSearchHighlights === 'function') clearSearchHighlights();
            // Hide after transition
            searchContainer.addEventListener('transitionend', () => {
                if(!searchContainer.classList.contains('active')) {
                    searchContainer.classList.add('hidden');
                    searchContainer.classList.remove('flex');
                }
            }, {once: true});
             setTimeout(() => { // Fallback
                if(!searchContainer.classList.contains('active')) {
                    searchContainer.classList.add('hidden');
                    searchContainer.classList.remove('flex');
                }
            }, 350);
        }
    };

    searchButton.addEventListener('click', (e) => { e.stopPropagation(); toggleSearch(true); });
    searchClose.addEventListener('click', (e) => { e.stopPropagation(); toggleSearch(false); });
    searchContainer.addEventListener('click', (e) => e.stopPropagation()); // Prevent closing when clicking inside
    searchInput.addEventListener('input', () => {
        if (searchInput.value.trim().length >= 2) debouncedSearch(searchInput.value);
        else if (typeof clearSearchHighlights === 'function') clearSearchHighlights();
    });
    searchInput.closest('form')?.addEventListener('submit', e => {
        e.preventDefault();
        if (typeof performSearch === 'function') performSearch(searchInput.value);
    });
    // Close on escape key
    searchInput.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') toggleSearch(false);
    });
     // Global click to close search
    document.addEventListener('click', (event) => {
        if (searchContainer.classList.contains('active') && !searchContainer.contains(event.target) && event.target !== searchButton) {
            toggleSearch(false);
        }
    });
    console.log("[Script] Desktop search logic initialized.");
}

function setupMobileSearch(headerElement){
    const mobileSearchInput = headerElement.querySelector('#mobile-search-input');
    if (!mobileSearchInput) return;

    const debouncedSearch = debounce(query => {
        if (typeof performSearch === 'function') performSearch(query);
        else console.warn("[Script] performSearch function not found.");
    }, 300);

    mobileSearchInput.addEventListener('input', () => {
        if (mobileSearchInput.value.trim().length >= 2) debouncedSearch(mobileSearchInput.value);
        else if (typeof clearSearchHighlights === 'function') clearSearchHighlights();
    });
    mobileSearchInput.closest('form')?.addEventListener('submit', e => {
        e.preventDefault();
        if (typeof performSearch === 'function') performSearch(mobileSearchInput.value);
    });
    console.log("[Script] Mobile search logic initialized.");
}


function setupLanguageDropdowns(headerElement) {
    const setupDropdown = (toggleId, optionsId) => {
        const toggle = headerElement.querySelector(`#${toggleId}`);
        const options = headerElement.querySelector(`#${optionsId}`);
        if (!toggle || !options) {
            // console.warn(`[Script] Language dropdown elements for ${toggleId}/${optionsId} not found.`);
            return;
        }

        toggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
            options.classList.toggle('hidden', isExpanded);
            options.classList.toggle('show', !isExpanded); // For CSS transitions
            toggle.setAttribute('aria-expanded', String(!isExpanded));
            toggle.classList.toggle('active', !isExpanded);
            // Close desktop menus when lang dropdown opens
            if (toggleId === 'desktop-lang-toggle' && !isExpanded && typeof closeAllDesktopMenus === 'function') {
                 // closeAllDesktopMenus is not defined here, it's inside setupDesktopMenus.
                 // This suggests a need for better structure or passing functions around.
                 // For now, this specific call might not work as intended unless closeAllDesktopMenus is global.
            }
        });

        options.querySelectorAll('.lang-button').forEach(button => {
            button.addEventListener('click', handleLanguageChangeWrapper); // Defined globally
        });
         // Close on outside click for this specific dropdown
        document.addEventListener('click', (event) => {
            if (!options.classList.contains('hidden') && !toggle.contains(event.target) && !options.contains(event.target)) {
                options.classList.add('hidden');
                options.classList.remove('show');
                toggle.setAttribute('aria-expanded', 'false');
                toggle.classList.remove('active');
            }
        });
    };

    setupDropdown('desktop-lang-toggle', 'desktop-lang-options');
    setupDropdown('mobile-lang-toggle', 'mobile-lang-options');
    console.log("[Script] Language dropdowns logic initialized.");
}


/**
 * Initializes header specific logic after it's loaded.
 * @param {HTMLElement} headerEl - The loaded header DOM element.
 */
function initializeLoadedHeader(headerEl) {
    if (!headerEl || isMenuInitialized) {
        if(isMenuInitialized) console.warn("[Script] Header logic already initialized.");
        return;
    }
    console.log("[Script] Initializing specific logic for loaded header.");

    setupMobileMenu(headerEl);
    setupDesktopMenus(headerEl);
    setupDesktopSearch(headerEl);
    setupMobileSearch(headerEl); // For mobile search input handling
    setupLanguageDropdowns(headerEl); // Sets up language dropdowns within the header

    // Theme toggles within header
    if (typeof setupThemeToggle === 'function') {
        setupThemeToggle(THEME_TOGGLE_ID, headerEl); // For desktop header's #theme-toggle
        setupThemeToggle(THEME_TOGGLE_MOBILE_ID, headerEl); // For mobile header's #theme-toggle-mobile
    }


    if (typeof initializeStickyNavbar === 'function') {
        const navbar = headerEl.querySelector('#navbar');
        if (navbar) initializeStickyNavbar(navbar);
    }
    if (typeof initializeActiveMenuHighlighting === 'function') {
        initializeActiveMenuHighlighting(headerEl);
    }

    // Attach language button listeners if language system is ready
    // This might be slightly redundant if setupLanguageDropdowns also calls handleLanguageChangeWrapper
    // which in turn calls window.setLanguage. The key is that setLanguage is the endpoint.
    if (isLanguageSystemReady && typeof window.attachLanguageSwitcherEvents === 'function') {
        window.attachLanguageSwitcherEvents(headerEl);
    }

    isMenuInitialized = true;
    console.log("[Script] Loaded header initialization complete.");
}

/**
 * Initializes footer specific logic after it's loaded.
 * @param {HTMLElement} footerEl - The loaded footer DOM element.
 */
function initializeLoadedFooter(footerEl) {
    if (!footerEl) return;
    console.log("[Script] Initializing specific logic for loaded footer.");
    if (typeof updateFooterYear === 'function') {
        updateFooterYear(footerEl);
    }
    // Any other footer-specific JS that footer.html's own script doesn't handle
}

// --- Feature Implementations (can be moved to separate files if they grow) ---

function updateFooterYear(scope = document) {
    const yearElement = scope.querySelector(`#${FOOTER_YEAR_ID}`);
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    } else {
        // console.warn(`[Script] Footer year element (#${FOOTER_YEAR_ID}) not found in scope.`);
    }
}

async function loadInternalNews() {
    if (!domCache.newsContainer) return;

    const defaultTexts = {
        loading: "Đang tải tin tức...",
        error: "Không thể tải tin tức.",
        noNews: "Chưa có tin tức nào.",
        readMore: "Đọc thêm →",
        titleNA: "Tiêu đề không có sẵn",
        imageAlt: "Hình ảnh tin tức"
    };

    const getText = (key) => (isLanguageSystemReady && typeof window.getTranslation === 'function')
        ? window.getTranslation(key, defaultTexts[key.replace(/_([a-z])/g, (g) => g[1].toUpperCase())]) // Convert snake_case to camelCase for lookup if needed
        : defaultTexts[key];

    domCache.newsContainer.innerHTML = `<p class="text-gray-500 col-span-full text-center">${getText('loading')}</p>`;

    try {
        const response = await fetch(POSTS_JSON_URL);
        if (!response.ok) throw new Error(`HTTP error ${response.status}`);
        const posts = await response.json();
        domCache.newsContainer.innerHTML = '';

        if (!posts || posts.length === 0) {
            domCache.newsContainer.innerHTML = `<p class="text-gray-500 w-full text-center">${getText('noNews')}</p>`;
            return;
        }

        const currentLang = (isLanguageSystemReady && typeof window.getCurrentLanguage === 'function') ? window.getCurrentLanguage() : 'vi';

        posts.slice(0, 6).forEach(post => {
            const card = document.createElement('div');
            card.className = 'news-card bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 ease-out hover:shadow-xl hover:-translate-y-1 flex flex-col';

            const title = post.title?.[currentLang] || post.title?.vi || getText('titleNA');
            const excerpt = post.excerpt?.[currentLang] || post.excerpt?.vi || '';
            const imageAlt = post.image_alt?.[currentLang] || post.image_alt?.vi || title || getText('imageAlt');
            const link = post.link || '#';
            const imageSrc = post.image || `https://placehold.co/300x200/e2e8f0/cbd5e1?text=${encodeURIComponent(title.substring(0,10))}`;
            const hotBadge = post.hot ? `<span class="absolute top-2 right-2 bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full z-10">HOT</span>` : '';
            let dateDisplay = '';
            if (post.date) {
                try {
                    dateDisplay = new Date(post.date.split(' ')[0]).toLocaleDateString(currentLang === 'vi' ? 'vi-VN' : 'en-US', { day: '2-digit', month: '2-digit', year: 'numeric' });
                } catch (e) { /* ignore date parsing error */ }
            }

            card.innerHTML = `
                <a href="${link}" class="block group focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg h-full flex flex-col">
                    <div class="relative">
                        <img src="${imageSrc}" alt="${imageAlt}" class="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" onerror="this.onerror=null;this.src='https://placehold.co/300x200/e2e8f0/cbd5e1?text=Error';">
                        ${hotBadge}
                    </div>
                    <div class="p-4 flex flex-col flex-grow">
                        <h3 class="text-lg font-semibold text-gray-800 mb-2 group-hover:text-blue-600 line-clamp-2" title="${title}">${title}</h3>
                        <p class="text-sm text-gray-600 mb-3 line-clamp-3 flex-grow">${excerpt}</p>
                        <div class="flex justify-between items-center text-xs text-gray-500 mt-auto pt-2 border-t border-gray-100">
                            <span>${dateDisplay}</span>
                            <span class="text-blue-500 font-medium group-hover:underline">${getText('readMore')}</span>
                        </div>
                    </div>
                </a>`;
            domCache.newsContainer.appendChild(card);
        });
    } catch (error) {
        console.error("[Script] Error loading internal news:", error);
        if(domCache.newsContainer) domCache.newsContainer.innerHTML = `<p class="text-red-500 w-full text-center">${getText('error')}</p>`;
    }
}

function initializeStickyNavbar(navbarElement) {
    if (!navbarElement) return;
    const shrinkThreshold = 50;
    const handleScroll = () => {
        navbarElement.classList.toggle('shrinked', window.scrollY > shrinkThreshold);
    };
    window.addEventListener('scroll', debounce(handleScroll, 10), { passive: true });
    handleScroll(); // Initial check
    console.log("[Script] Sticky navbar initialized.");
}

function initializeActiveMenuHighlighting(scope = document) {
    const currentFullHref = window.location.href.split('#')[0].split('?')[0];
    const currentPathname = window.location.pathname.replace(/\/$/, "") || "/"; // /page.html or /folder/ or /
    const isIndexPage = currentPathname === "/" || currentPathname.endsWith("/index");

    const links = scope.querySelectorAll('a[href]');
    let bestMatch = null;

    links.forEach(link => {
        link.classList.remove('active-menu-item');
        link.closest('.main-menu-item, .mobile-menu-item')?.classList.remove('active-parent-item');

        const linkHref = link.getAttribute('href');
        if (!linkHref || linkHref.startsWith('#') || linkHref.startsWith('javascript:')) return;

        try {
            const linkUrl = new URL(linkHref, document.baseURI);
            const linkFullHref = linkUrl.href.split('#')[0].split('?')[0];
            const linkPathname = linkUrl.pathname.replace(/\/$/, "") || "/";

            if (linkFullHref === currentFullHref) { // Exact full URL match is best
                bestMatch = link;
                return; // Found exact match, no need to check others for this link
            }
            // More robust path matching for relative links on index page
            if (isIndexPage && (linkPathname === currentPathname || (linkPathname === "/index" && currentPathname === "/"))) {
                 if (!bestMatch) bestMatch = link; // Prefer exact match if already found
            } else if (linkPathname === currentPathname) {
                 if (!bestMatch || (bestMatch.getAttribute('href').length < linkHref.length)) {
                    bestMatch = link; // Prefer more specific paths
                 }
            }
        } catch (e) { /* Ignore invalid URLs */ }
    });

    if (bestMatch) {
        bestMatch.classList.add('active-menu-item');
        let parentItem = bestMatch.closest('.main-menu-item, .mobile-menu-item');
        while(parentItem) {
            parentItem.classList.add('active-parent-item');
            // If mobile, ensure parent submenus are open
            if (parentItem.classList.contains('mobile-menu-item') && !parentItem.classList.contains('open')) {
                const toggle = parentItem.querySelector(':scope > button.mobile-submenu-toggle');
                const submenu = parentItem.querySelector(':scope > .mobile-submenu');
                if (toggle && submenu) {
                    parentItem.classList.add('open');
                    toggle.setAttribute('aria-expanded', 'true');
                    submenu.style.maxHeight = submenu.scrollHeight + 'px';
                    submenu.style.overflow = 'visible';
                    const arrow = toggle.querySelector('.submenu-arrow');
                    if(arrow) arrow.classList.add('rotate-90');
                }
            }
            parentItem = parentItem.parentElement?.closest('.main-menu-item, .mobile-menu-item');
        }
        console.log("[Script] Active menu item highlighted:", bestMatch);
    }
}


function clearSearchHighlights() {
    if (isPerformingSearch) return;
    const highlights = document.querySelectorAll(`mark.${SEARCH_HIGHLIGHT_CLASS}`);
    highlights.forEach(mark => {
        const parent = mark.parentNode;
        if (parent) {
            parent.replaceChild(document.createTextNode(mark.textContent), mark);
            parent.normalize(); // Merges adjacent text nodes
        }
    });
}

function performSearch(query) {
    if (isPerformingSearch) return; // Prevent recursion
    isPerformingSearch = true;

    clearSearchHighlights();
    const mainContent = document.querySelector('main');
    if (!mainContent || !query || query.trim().length < 2) {
        isPerformingSearch = false;
        return;
    }

    const queryLower = query.trim().toLowerCase();
    const walker = document.createTreeWalker(mainContent, NodeFilter.SHOW_TEXT, null);
    let node;
    const nodesToProcess = [];
    while (node = walker.nextNode()) {
        if (node.parentElement && !['SCRIPT', 'STYLE', 'MARK'].includes(node.parentElement.tagName)) {
            nodesToProcess.push(node);
        }
    }

    let firstMatchElement = null;
    nodesToProcess.forEach(textNode => {
        const textContent = textNode.nodeValue;
        const textLower = textContent.toLowerCase();
        let matchIndex = textLower.indexOf(queryLower);
        let lastNode = textNode;

        while (matchIndex !== -1) {
            const matchText = textContent.substring(matchIndex, matchIndex + query.length);
            const mark = document.createElement('mark');
            mark.className = SEARCH_HIGHLIGHT_CLASS;
            mark.textContent = matchText;

            const textAfterMatch = lastNode.splitText(matchIndex);
            textAfterMatch.nodeValue = textAfterMatch.nodeValue.substring(query.length);
            lastNode.parentNode.insertBefore(mark, textAfterMatch);

            if (!firstMatchElement) firstMatchElement = mark;

            lastNode = textAfterMatch; // Continue searching in the remaining part of the text node
            matchIndex = lastNode.nodeValue.toLowerCase().indexOf(queryLower);
        }
    });

    if (firstMatchElement) {
        firstMatchElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    isPerformingSearch = false;
}

function setupGlobalThemeToggle() {
    if (domCache.mainThemeToggleButton && typeof setupThemeToggle === 'function') {
        setupThemeToggle(THEME_TOGGLE_ID); // For a global button
        console.log("[Script] Global theme toggle initialized.");
    }
}

/**
 * Main function to initialize the application.
 */
async function initializeApp() {
    console.log("[Script] Initializing application...");
    cacheStaticElements(); // Cache static DOM elements from index.html

    // Setup theme toggle for any button directly in index.html
    // Theme toggles inside header/footer will be handled after those components load
    setupGlobalThemeToggle();

    // Load header and footer components
    const [headerLoadedElement, footerLoadedElement] = await Promise.all([
        loadComponent(HEADER_PLACEHOLDER_ID, HEADER_COMPONENT_URL),
        loadComponent(FOOTER_PLACEHOLDER_ID, FOOTER_COMPONENT_URL)
    ]);

    // Initialize logic specific to loaded header and footer
    if (headerLoadedElement) initializeLoadedHeader(headerLoadedElement);
    if (footerLoadedElement) initializeLoadedFooter(footerLoadedElement);


    // Initialize language system (from language.js)
    if (typeof window.initializeLanguageSystem === 'function') {
        try {
            await window.initializeLanguageSystem(); // Should set window.translations & apply initial lang
            isLanguageSystemReady = true;
            console.log("[Script] Language system reported ready by language.js.");

            // Re-apply translations if needed, especially after components are loaded
            if (typeof window.applyTranslations === 'function') {
                window.applyTranslations(); // Apply to whole page
            }
            // Re-attach language switcher events if they are in dynamically loaded components
            if (headerLoadedElement && typeof window.attachLanguageSwitcherEvents === 'function') {
                window.attachLanguageSwitcherEvents(headerLoadedElement);
            }

        } catch (error) {
            console.error("[Script] Error during language system initialization:", error);
        }
    } else {
        console.warn("[Script] window.initializeLanguageSystem function not found.");
    }

    // Load news (can now use translations if language system is ready)
    if (domCache.newsContainer) {
        await loadInternalNews(); // Make it await if it becomes async
    }

    console.log("[Script] Application initialization complete.");
}

// --- Global Event Listeners & Initial Call ---
document.addEventListener('DOMContentLoaded', initializeApp);

// Example of a more generic global click listener for closing dropdowns (if needed)
// Specific dropdown closing logic is often better handled within the component's script.
document.addEventListener('click', (event) => {
    // Example: Close active desktop language dropdown if click is outside
    const activeDesktopLangDropdown = document.querySelector('#desktop-language-dropdown.open');
    if (activeDesktopLangDropdown && !activeDesktopLangDropdown.contains(event.target)) {
        const toggle = activeDesktopLangDropdown.querySelector('#desktop-lang-toggle');
        const options = activeDesktopLangDropdown.querySelector('#desktop-lang-options');
        if (toggle && options) {
            options.classList.add('hidden');
            options.classList.remove('show');
            toggle.setAttribute('aria-expanded', 'false');
            toggle.classList.remove('active');
            activeDesktopLangDropdown.classList.remove('open');
        }
    }
});