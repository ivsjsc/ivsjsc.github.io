/* ========================== */
/* Optimized JavaScript Logic */
/* Version: Consolidated with fixed mobile overlay and footer load */
/* ========================== */

// /js/script.js - File chính điều phối tải component và khởi tạo

// --- Constants ---
const HEADER_COMPONENT_URL = 'header.html';
const FOOTER_COMPONENT_URL = 'footer.html';
const POSTS_JSON_URL = 'posts.json';
const HEADER_PLACEHOLDER_ID = 'header-placeholder';
const FOOTER_PLACEHOLDER_ID = 'footer-placeholder';
const NEWS_CONTAINER_ID = 'news-container';
const FOOTER_YEAR_ID = 'current-year';

// --- State Flags ---
let headerFooterLoadAttempted = false;
let menuInitialized = false;
// window.languageInitialized is managed by language.js

// --- Utility Functions ---

/**
 * Tải nội dung từ một tệp HTML vào một phần tử placeholder.
 * @param {string} placeholderId ID của phần tử placeholder.
 * @param {string} componentUrl Đường dẫn đến tệp HTML component.
 * @returns {Promise<HTMLElement | null>} Promise trả về phần tử placeholder đã cập nhật hoặc null nếu lỗi.
 */
function loadComponent(placeholderId, componentUrl) {
    const placeholder = document.getElementById(placeholderId);
    if (!placeholder) {
        console.error(`[Script] Placeholder "${placeholderId}" not found.`);
        return Promise.resolve(null);
    }

    return fetch(componentUrl)
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error ${response.status} loading ${componentUrl}`);
            return response.text();
        })
        .then(html => {
            const currentPlaceholder = document.getElementById(placeholderId);
            if (!currentPlaceholder) {
                console.error(`[Script] Placeholder "${placeholderId}" disappeared during load.`);
                return null;
            }
            currentPlaceholder.innerHTML = html;
            console.log(`[Script] Loaded ${componentUrl} into #${placeholderId}`);
            return currentPlaceholder;
        })
        .catch(error => {
            console.error(`[Script] Error loading ${componentUrl}:`, error);
            const currentPlaceholder = document.getElementById(placeholderId);
            if (currentPlaceholder) {
                currentPlaceholder.innerHTML = `<p class="text-red-500 text-center p-4">Error loading component: ${error.message}</p>`;
            }
            return null;
        });
}

// --- Initialization Functions ---

/**
 * Khởi tạo sự kiện cho menu mobile, language dropdown, sticky header, và active links.
 */
function initializeHeaderMenuLogic() {
    if (menuInitialized) {
        console.warn("[Script] Menu already initialized. Skipping.");
        return;
    }

    const headerPlaceholder = document.getElementById(HEADER_PLACEHOLDER_ID);
    const headerElement = headerPlaceholder?.querySelector('#navbar');
    if (!headerElement) {
        console.error("[Script] Header (#navbar) not found. Cannot initialize menu.");
        return;
    }

    console.log("[Script] Initializing header menu logic...");

    // Cache DOM elements
    const mobileMenuButton = headerElement.querySelector('#mobile-menu-button');
    const mobileMenuPanel = headerElement.querySelector('#mobile-menu-panel');
    const mobileMenuOverlay = headerElement.querySelector('#mobile-menu-overlay');
    const iconMenu = headerElement.querySelector('#icon-menu');
    const iconClose = headerElement.querySelector('#icon-close');
    const mobileCloseButton = headerElement.querySelector('#mobile-close-button');
    const desktopLangDropdown = headerElement.querySelector('#desktop-language-dropdown');
    const desktopLangToggle = headerElement.querySelector('#desktop-lang-toggle');
    const mobileLangDropdown = headerElement.querySelector('#mobile-language-dropdown');
    const mobileLangToggle = headerElement.querySelector('#mobile-lang-toggle');
    const mobileMenuItems = headerElement.querySelectorAll('#mobile-menu-panel .mobile-menu-item');

    // --- Mobile Menu Toggle ---
    function toggleMobileMenu(forceOpenState) {
        if (!mobileMenuPanel || !mobileMenuOverlay || !iconMenu || !iconClose || !mobileMenuButton) {
            console.error("[Script] Missing mobile menu elements.");
            return;
        }

        const shouldBeOpen = typeof forceOpenState === 'boolean' ? forceOpenState : mobileMenuButton.getAttribute('aria-expanded') === 'false';
        mobileMenuButton.setAttribute('aria-expanded', shouldBeOpen);
        iconMenu.classList.toggle('hidden', shouldBeOpen);
        iconClose.classList.toggle('hidden', !shouldBeOpen);

        requestAnimationFrame(() => {
            if (shouldBeOpen) {
                mobileMenuOverlay.classList.remove('hidden');
                mobileMenuPanel.classList.remove('hidden');
                mobileMenuOverlay.classList.add('active');
                mobileMenuPanel.classList.add('active');
                document.body.classList.add('overflow-hidden');
            } else {
                mobileMenuOverlay.classList.remove('active');
                mobileMenuPanel.classList.remove('active');
                document.body.classList.remove('overflow-hidden');

                const hideAfterTransition = (event) => {
                    if (event.target === mobileMenuPanel && !mobileMenuPanel.classList.contains('active')) {
                        mobileMenuPanel.classList.add('hidden');
                        mobileMenuOverlay.classList.add('hidden');
                    }
                };
                mobileMenuPanel.addEventListener('transitionend', hideAfterTransition, { once: true });
                setTimeout(() => {
                    if (!mobileMenuPanel.classList.contains('active')) {
                        mobileMenuPanel.classList.add('hidden');
                        mobileMenuOverlay.classList.add('hidden');
                    }
                }, 350);
            }
        });
    }

    if (mobileMenuOverlay && mobileMenuPanel) {
        mobileMenuOverlay.classList.remove('active');
        mobileMenuPanel.classList.remove('active');
    }

    mobileMenuButton?.addEventListener('click', () => toggleMobileMenu());
    mobileCloseButton?.addEventListener('click', () => toggleMobileMenu(false));
    mobileMenuOverlay?.addEventListener('click', () => toggleMobileMenu(false));

    mobileMenuPanel?.querySelectorAll('a[href]').forEach(link => {
        if (!link.closest('.mobile-submenu-toggle')) {
            link.addEventListener('click', () => setTimeout(() => toggleMobileMenu(false), 50));
        }
    });

    // --- Mobile Submenu Accordion ---
    mobileMenuItems.forEach(item => {
        const button = item.querySelector(':scope > button.mobile-submenu-toggle');
        const submenu = item.querySelector(':scope > .mobile-submenu');
        if (!button || !submenu) return;

        submenu.style.maxHeight = '0';
        submenu.style.overflow = 'hidden';
        button.setAttribute('aria-expanded', 'false');

        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const parentItem = this.closest('.mobile-menu-item');
            if (!parentItem) return;

            const isOpen = parentItem.classList.toggle('open');
            this.setAttribute('aria-expanded', isOpen);

            if (isOpen) {
                submenu.style.maxHeight = `${submenu.scrollHeight}px`;
                submenu.style.overflow = 'visible';

                const siblings = Array.from(parentItem.parentNode.children).filter(
                    child => child !== parentItem && child.classList.contains('mobile-menu-item') && child.classList.contains('open')
                );
                siblings.forEach(sibling => {
                    sibling.classList.remove('open');
                    const siblingSubmenu = sibling.querySelector(':scope > .mobile-submenu');
                    const siblingButton = sibling.querySelector(':scope > button.mobile-submenu-toggle');
                    if (siblingSubmenu) {
                        siblingSubmenu.style.maxHeight = '0';
                        siblingSubmenu.style.overflow = 'hidden';
                    }
                    siblingButton?.setAttribute('aria-expanded', 'false');
                });
            } else {
                submenu.style.maxHeight = '0';
                submenu.style.overflow = 'hidden';
                parentItem.querySelectorAll('.mobile-menu-item.open').forEach(nested => {
                    nested.classList.remove('open');
                    const nestedSub = nested.querySelector(':scope > .mobile-submenu');
                    const nestedButton = nested.querySelector(':scope > button.mobile-submenu-toggle');
                    if (nestedSub) {
                        nestedSub.style.maxHeight = '0';
                        nestedSub.style.overflow = 'hidden';
                    }
                    nestedButton?.setAttribute('aria-expanded', 'false');
                });
            }
        });
    });

    // --- Language Dropdown Logic ---
    function toggleDropdown(dropdownContainer, forceState) {
        if (!dropdownContainer) return;
        const content = dropdownContainer.querySelector('.language-dropdown-content');
        const toggleButton = dropdownContainer.querySelector('.dropdown-toggle');
        if (!content || !toggleButton) return;

        const open = typeof forceState === 'boolean' ? forceState : !dropdownContainer.classList.contains('open');
        dropdownContainer.classList.toggle('open', open);
        toggleButton.setAttribute('aria-expanded', open);
        content.classList.toggle('hidden', !open);
    }

    desktopLangToggle?.addEventListener('click', e => {
        e.stopPropagation();
        toggleDropdown(desktopLangDropdown);
    });
    mobileLangToggle?.addEventListener('click', e => {
        e.stopPropagation();
        toggleDropdown(mobileLangDropdown);
    });

    window.addEventListener('click', event => {
        if (desktopLangDropdown?.classList.contains('open') && !desktopLangDropdown.contains(event.target)) {
            toggleDropdown(desktopLangDropdown, false);
        }
        if (mobileLangDropdown?.classList.contains('open') && !mobileLangDropdown.contains(event.target)) {
            const mobilePanel = document.getElementById('mobile-menu-panel');
            if (mobilePanel && !mobilePanel.contains(event.target)) {
                toggleDropdown(mobileLangDropdown, false);
            }
        }
    });

    // --- Language Button Click Handling ---
    function handleLanguageChangeWrapper(event) {
        if (typeof handleLanguageChange === 'function') {
            handleLanguageChange(event);
            const dropdown = event.target.closest('.language-dropdown');
            if (dropdown) toggleDropdown(dropdown, false);
        } else {
            console.error("[Script] handleLanguageChange not defined.");
        }
    }

    window.attachLanguageButtonListeners = () => {
        const langButtons = document.querySelectorAll('.lang-button');
        langButtons.forEach(button => {
            button.removeEventListener('click', handleLanguageChangeWrapper);
            button.addEventListener('click', handleLanguageChangeWrapper);
        });
        console.log(`[Script] Attached listeners to ${langButtons.length} language buttons.`);
    };

    // --- Initialize Other Features ---
    initializeStickyNavbar(headerElement);
    initializeActiveMenuHighlighting(headerElement);

    menuInitialized = true;
    console.log("[Script] Header menu logic initialized.");
}

/**
 * Initializes sticky/shrinking navbar behavior.
 * @param {HTMLElement} navbarElement The navbar element.
 */
function initializeStickyNavbar(navbarElement) {
    if (!navbarElement) return;
    console.log("[Script] Initializing sticky navbar...");

    let lastScrollTop = 0;
    const shrinkThreshold = 50;

    const handleScroll = () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        navbarElement.classList.toggle('shrink', scrollTop > shrinkThreshold);

        const initialHeight = parseInt(getComputedStyle(navbarElement).getPropertyValue('--header-height-initial') || '64', 10);
        const mobilePanel = document.getElementById('mobile-menu-panel');
        if (scrollTop > lastScrollTop && scrollTop > initialHeight && (!mobilePanel || !mobilePanel.classList.contains('active'))) {
            navbarElement.style.top = `-${navbarElement.offsetHeight}px`;
        } else {
            navbarElement.style.top = '0';
        }
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
}

/**
 * Highlights the active menu item based on the current URL.
 * @param {HTMLElement} headerElement The header element.
 */
function initializeActiveMenuHighlighting(headerElement) {
    if (!headerElement) return;
    console.log("[Script] Initializing active menu highlighting...");

    const currentHref = window.location.href.split('#')[0].split('?')[0];
    const menuLinks = headerElement.querySelectorAll('.nav-link[href], .submenu a[href], #mobile-menu-panel a[href]');

    const normalizeUrl = url => {
        try {
            const urlObj = new URL(url, window.location.origin);
            let path = urlObj.pathname;
            if (path !== '/' && path.endsWith('/')) path = path.slice(0, -1);
            if (path.endsWith('.html')) path = path.slice(0, -'.html'.length);
            return path === '/index' || path === '' ? '/' : path;
        } catch (e) {
            console.warn(`[Script] Invalid URL: ${url}`);
            return null;
        }
    };

    const normalizedCurrentPath = normalizeUrl(currentHref);
    if (!normalizedCurrentPath) return;

    menuLinks.forEach(link => {
        link.classList.remove('active-menu-item');
        const parentToggle = link.closest('.mobile-menu-item')?.querySelector(':scope > button.mobile-submenu-toggle') ||
                            link.closest('.sub-submenu-container')?.querySelector(':scope > button') ||
                            link.closest('.main-menu-item')?.querySelector(':scope > button.nav-link');
        parentToggle?.classList.remove('active-parent-item');
    });

    headerElement.querySelectorAll('#mobile-menu-panel .mobile-menu-item.open').forEach(item => {
        item.classList.remove('open');
        const submenu = item.querySelector(':scope > .mobile-submenu');
        if (submenu) {
            submenu.style.maxHeight = '0';
            submenu.style.overflow = 'hidden';
        }
        item.querySelector(':scope > button.mobile-submenu-toggle')?.setAttribute('aria-expanded', 'false');
    });

    let bestMatch = { link: null, specificity: -1 };
    menuLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (!linkHref || linkHref === '#' || linkHref.startsWith('javascript:')) return;

        const normalizedLinkPath = normalizeUrl(linkHref);
        if (!normalizedLinkPath) return;

        let currentSpecificity = -1;
        try {
            const absoluteLinkHref = new URL(linkHref, window.location.origin).href.split('#')[0].split('?')[0];
            if (absoluteLinkHref === currentHref) currentSpecificity = 2;
        } catch (e) {}

        if (currentSpecificity < 2 && normalizedLinkPath === normalizedCurrentPath) {
            currentSpecificity = normalizedCurrentPath === '/' ? 1 : 0;
        }

        if (currentSpecificity > bestMatch.specificity) {
            bestMatch = { link, specificity: currentSpecificity };
        } else if (currentSpecificity === bestMatch.specificity && currentSpecificity >= 0) {
            const currentBestPath = normalizeUrl(bestMatch.link.getAttribute('href'));
            if (currentBestPath && normalizedLinkPath.length > currentBestPath.length) {
                bestMatch = { link, specificity: currentSpecificity };
            }
        }
    });

    if (bestMatch.link) {
        const activeLink = bestMatch.link;
        activeLink.classList.add('active-menu-item');

        let element = activeLink;
        while (element && element !== headerElement) {
            const parentMenuItem = element.closest('.mobile-menu-item, .sub-submenu-container, .main-menu-item');
            if (!parentMenuItem) break;

            const parentToggle = parentMenuItem.querySelector(':scope > button.mobile-submenu-toggle, :scope > button.nav-link');
            parentToggle?.classList.add('active-parent-item');

            if (parentMenuItem.classList.contains('mobile-menu-item') && !parentMenuItem.classList.contains('open')) {
                parentMenuItem.classList.add('open');
                const submenu = parentMenuItem.querySelector(':scope > .mobile-submenu');
                if (submenu) {
                    submenu.style.maxHeight = `${submenu.scrollHeight}px`;
                    submenu.style.overflow = 'visible';
                }
                parentToggle?.setAttribute('aria-expanded', 'true');
            }
            element = parentMenuItem.parentElement;
        }
    }
}

/**
 * Tải và hiển thị tin tức nội bộ từ file JSON.
 */
function loadInternalNews() {
    const newsContainer = document.getElementById(NEWS_CONTAINER_ID);
    if (!newsContainer) return;

    const currentLang = localStorage.getItem('preferredLanguage') || 'vi';
    const translations = window.translations?.[currentLang] || {};
    const readMoreText = translations.read_more || 'Read more →';
    const newsTitleNaText = translations.news_title_na || 'Title Not Available';
    const newsImageAltText = translations.news_image_alt || 'News image';
    const noNewsText = translations.no_news || 'No news yet.';
    const newsLoadErrorText = translations.news_load_error || 'Could not load news.';
    const loadingNewsText = translations.loading_news || 'Loading news...';

    newsContainer.innerHTML = `<p class="text-gray-500 w-full text-center">${loadingNewsText}</p>`;

    fetch(POSTS_JSON_URL)
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error ${response.status}`);
            return response.json();
        })
        .then(posts => {
            newsContainer.innerHTML = '';
            if (!Array.isArray(posts) || !posts.length) {
                newsContainer.innerHTML = `<p class="text-gray-500 w-full text-center">${noNewsText}</p>`;
                return;
            }

            posts.slice(0, 6).forEach(post => {
                const postElement = document.createElement('div');
                postElement.className = 'news-card flex-shrink-0 w-72 bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105 scroll-snap-align-start';

                const hotBadge = post.hot ? `<span class="absolute top-2 right-2 bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full z-10">HOT</span>` : '';
                const imageSrc = post.image || 'https://placehold.co/300x200/e2e8f0/cbd5e1?text=Image';
                const imageAlt = post.title?.[currentLang] || post.title?.vi || newsImageAltText;
                const postTitle = post.title?.[currentLang] || post.title?.vi || newsTitleNaText;
                const postExcerpt = post.excerpt?.[currentLang] || post.excerpt?.vi || '';
                let postDate = '';
                if (post.date) {
                    try {
                        const dateObj = new Date(post.date.replace(/(\d{4}-\d{2}-\d{2})\d+/, '$1'));
                        if (!isNaN(dateObj)) {
                            postDate = dateObj.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
                        }
                    } catch (e) {
                        console.warn(`[Script] Invalid date: ${post.date}`);
                    }
                }

                postElement.innerHTML = `
                    <a href="${post.link || '#'}" class="block group focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg">
                        <div class="relative">
                            <img src="${imageSrc}" alt="${imageAlt}" class="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-110 group-focus:scale-110" loading="lazy" onerror="this.src='https://placehold.co/300x200/e2e8f0/cbd5e1?text=Load+Error';">
                            ${hotBadge}
                        </div>
                        <div class="p-4 flex flex-col h-[calc(100%-10rem)]">
                            <h3 class="text-lg font-semibold text-gray-800 mb-2 group-hover:text-blue-600 group-focus:text-blue-600 transition-colors duration-200 line-clamp-2" title="${postTitle}">
                                ${postTitle}
                            </h3>
                            <p class="text-sm text-gray-600 mb-3 line-clamp-3 flex-grow">${postExcerpt}</p>
                            <div class="flex justify-between items-center text-xs text-gray-500 mt-auto pt-2 border-t border-gray-100">
                                <span>${postDate}</span>
                                <span class="text-blue-500 font-medium group-hover:underline group-focus:underline">${readMoreText}</span>
                            </div>
                        </div>
                    </a>`;
                newsContainer.appendChild(postElement);
            });
        })
        .catch(error => {
            console.error("[Script] Error loading news:", error);
            newsContainer.innerHTML = `<p class="text-red-500 w-full text-center">${newsLoadErrorText}</p>`;
        });
}

/**
 * Cập nhật năm hiện tại trong footer.
 */
function updateFooterYear() {
    const yearElement = document.getElementById(FOOTER_YEAR_ID);
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
        console.log("[Script] Footer year updated.");
    } else {
        console.warn(`[Script] Footer year element (#${FOOTER_YEAR_ID}) not found.`);
    }
}

// --- Main Execution Flow ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("[Script] DOM loaded. Starting initializations...");

    const headerPromise = loadComponent(HEADER_PLACEHOLDER_ID, HEADER_COMPONENT_URL);
    const footerPromise = loadComponent(FOOTER_PLACEHOLDER_ID, FOOTER_COMPONENT_URL);

    Promise.all([headerPromise, footerPromise]).then(([headerPlaceholder, footerPlaceholder]) => {
        headerFooterLoadAttempted = true;
        const headerLoaded = !!headerPlaceholder;
        const footerLoaded = !!footerPlaceholder;
        console.log(`[Script] Header: ${headerLoaded}, Footer: ${footerLoaded}`);

        if (headerLoaded) initializeHeaderMenuLogic();
        if (footerLoaded) updateFooterYear();

        if (typeof initializeLanguage === 'function') {
            if (!window.languageInitialized) {
                console.log("[Script] Initializing language...");
                initializeLanguage();
                window.attachLanguageButtonListeners?.();
            } else {
                console.log("[Script] Re-applying translations/listeners...");
                const currentLang = localStorage.getItem('preferredLanguage') || 'vi';
                applyTranslations?.(currentLang);
                window.attachLanguageButtonListeners?.();
            }
        } else {
            console.error("[Script] initializeLanguage not found.");
        }
    });

    const bodyId = document.body.id;
    if (bodyId === 'page-index' || document.getElementById(NEWS_CONTAINER_ID)) {
        console.log("[Script] Loading news...");
        loadInternalNews();
    }

    if (document.getElementById('vnexpress-rss-feed')) {
        console.log("[Script] RSS container found.");
    }

    if (bodyId === 'page-placement' && typeof initializePlacementTest === 'function') {
        console.log("[Script] Initializing placement test...");
        initializePlacementTest();
    }

    console.log("[Script] Initial execution completed.");
});