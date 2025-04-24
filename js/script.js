/* ========================== */
/* Optimized JavaScript Logic */
/* Version: Fixed mobile overlay issue */
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
let headerFooterLoadAttempted = false; // Track if loading was attempted
let menuInitialized = false;
// window.languageInitialized is managed by language.js

// --- Utility Functions ---

/**
 * Tải nội dung từ một tệp HTML vào một phần tử placeholder.
 * @param {string} placeholderId ID của phần tử placeholder.
 * @param {string} componentUrl Đường dẫn đến tệp HTML component.
 * @returns {Promise<string>} Promise hoàn thành với nội dung HTML hoặc báo lỗi.
 */
function loadComponent(placeholderId, componentUrl) {
    const placeholder = document.getElementById(placeholderId);
    if (!placeholder) {
        console.error(`[Script] Placeholder element with ID "${placeholderId}" not found.`);
        return Promise.reject(new Error(`Placeholder not found: ${placeholderId}`));
    }
    // console.log(`[Script] Starting load for ${componentUrl} into #${placeholderId}`);

    return fetch(componentUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status} loading ${componentUrl}`);
            }
            return response.text();
        })
        .then(html => {
            // Check again in case element removed during fetch
            const currentPlaceholder = document.getElementById(placeholderId);
            if (currentPlaceholder) {
                currentPlaceholder.innerHTML = html;
                console.log(`[Script] Component ${componentUrl} loaded into #${placeholderId}`);
                return html; // Resolve with the HTML content
            } else {
                 console.error(`[Script] Placeholder #${placeholderId} disappeared before loading ${componentUrl}.`);
                 return Promise.reject(new Error(`Placeholder #${placeholderId} disappeared.`));
            }
        })
        .catch(error => {
            console.error(`[Script] Error loading component ${componentUrl}:`, error);
            const currentPlaceholder = document.getElementById(placeholderId);
            if (currentPlaceholder) {
                currentPlaceholder.innerHTML = `<p class="text-red-500 text-center p-4">Error loading component. ${error.message}</p>`;
            }
            // Re-throw the error to be caught by Promise.allSettled
            throw error;
        });
}

// --- Initialization Functions ---

/**
 * Khởi tạo các sự kiện cho menu mobile, language dropdown, sticky header, active links.
 * Được gọi SAU KHI header đã được tải thành công.
 */
function initializeHeaderMenuLogic() {
    if (menuInitialized) {
        console.warn("[Script] Menu events already initialized. Skipping.");
        return;
    }
    console.log("[Script] Initializing header menu logic...");

    const headerPlaceholder = document.getElementById(HEADER_PLACEHOLDER_ID);
    const headerElement = headerPlaceholder?.querySelector('#navbar'); // Query inside placeholder

    if (!headerElement) {
        console.error("[Script] Header element (#navbar) not found AFTER loading. Cannot initialize menu events.");
        return;
    }

    // Cache DOM elements within the header for efficiency
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
    const mobileMenuItems = headerElement.querySelectorAll('#mobile-menu-panel .mobile-menu-item'); // Cache all mobile items

    // --- Mobile Menu Toggle (FIXED OVERLAY ISSUE) ---
    function toggleMobileMenu(forceOpenState) {
        if (!mobileMenuPanel || !mobileMenuOverlay || !iconMenu || !iconClose || !mobileMenuButton) {
             console.error("[Script] Core mobile menu elements missing for toggle.");
             return;
        }
        const shouldBeOpen = typeof forceOpenState === 'boolean' ? forceOpenState : mobileMenuButton.getAttribute('aria-expanded') === 'false';

        mobileMenuButton.setAttribute('aria-expanded', shouldBeOpen.toString());
        iconMenu.classList.toggle('hidden', shouldBeOpen);
        iconClose.classList.toggle('hidden', !shouldBeOpen);

        // Use requestAnimationFrame to ensure class changes happen after potential DOM updates
        requestAnimationFrame(() => {
            if (shouldBeOpen) {
                // Show panel and overlay BEFORE starting transitions
                mobileMenuOverlay.classList.remove('hidden'); // Remove initial hidden if present
                mobileMenuPanel.classList.remove('hidden');   // Remove initial hidden if present

                // Add 'active' classes to trigger transitions
                mobileMenuOverlay.classList.add('active'); // For opacity
                mobileMenuPanel.classList.add('active');   // For transform
                document.body.classList.add('overflow-hidden'); // Prevent body scroll
            } else {
                // Remove 'active' classes to trigger closing transitions
                mobileMenuOverlay.classList.remove('active');
                mobileMenuPanel.classList.remove('active');
                document.body.classList.remove('overflow-hidden');

                // Add listener to hide elements *after* transition completes
                // Use transitionend on the panel as it's the main moving part
                const hideAfterTransition = (event) => {
                    // Ensure the event is from the panel itself and it's no longer active
                    if (event.target === mobileMenuPanel && !mobileMenuPanel.classList.contains('active')) {
                        mobileMenuPanel.classList.add('hidden');
                        mobileMenuOverlay.classList.add('hidden');
                        // Clean up listener
                        mobileMenuPanel.removeEventListener('transitionend', hideAfterTransition);
                    }
                };
                // Remove previous listener before adding a new one
                mobileMenuPanel.removeEventListener('transitionend', hideAfterTransition);
                mobileMenuPanel.addEventListener('transitionend', hideAfterTransition, { once: true });

                // Fallback timeout in case transitionend doesn't fire
                setTimeout(() => {
                    if (!mobileMenuPanel.classList.contains('active')) {
                         mobileMenuPanel.classList.add('hidden');
                         mobileMenuOverlay.classList.add('hidden');
                    }
                }, 350); // Slightly longer than transition duration
            }
        });
    }

    // Ensure overlay and panel are hidden initially on desktop load
    // (lg:hidden class in HTML handles the display none, JS manages active/hidden for transitions)
    if (mobileMenuOverlay && mobileMenuPanel) {
        // No need to explicitly add 'hidden' here if it's in the HTML,
        // but ensure 'active' is not present initially.
        mobileMenuOverlay.classList.remove('active');
        mobileMenuPanel.classList.remove('active');
    }


    if (mobileMenuButton) mobileMenuButton.addEventListener('click', () => toggleMobileMenu());
    if (mobileCloseButton) mobileCloseButton.addEventListener('click', () => toggleMobileMenu(false));
    if (mobileMenuOverlay) mobileMenuOverlay.addEventListener('click', () => toggleMobileMenu(false));

    // Close mobile menu on link click (excluding submenu toggles)
    if (mobileMenuPanel) {
        mobileMenuPanel.querySelectorAll('a[href]').forEach(link => {
            // Check if the link is NOT inside a submenu toggle button
            if (!link.closest('.mobile-submenu-toggle')) {
                link.addEventListener('click', () => {
                    // Close menu after a short delay to allow navigation
                    setTimeout(() => toggleMobileMenu(false), 50);
                });
            }
        });
    }


    // --- Mobile Submenu Accordion ---
    mobileMenuItems.forEach(item => {
        const button = item.querySelector(':scope > button.mobile-submenu-toggle');
        const submenu = item.querySelector(':scope > .mobile-submenu');

        if (button && submenu) {
            // Initialize state
            submenu.style.maxHeight = '0';
            submenu.style.overflow = 'hidden'; // Ensure content is clipped
            button.setAttribute('aria-expanded', 'false');
            item.classList.remove('open'); // Ensure closed initially

            button.addEventListener('click', function(e) {
                e.stopPropagation(); // Prevent closing the main menu if clicking inside
                const parentItem = this.closest('.mobile-menu-item');
                if (!parentItem) return;

                const isOpen = parentItem.classList.toggle('open');
                this.setAttribute('aria-expanded', isOpen.toString());

                if (isOpen) {
                    // Open this submenu
                    submenu.style.maxHeight = submenu.scrollHeight + "px";
                    submenu.style.overflow = 'visible'; // Allow content to be seen

                    // Close sibling submenus at the same level
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
                        if (siblingButton) siblingButton.setAttribute('aria-expanded', 'false');
                    });
                } else {
                    // Close this submenu
                    submenu.style.maxHeight = '0';
                    submenu.style.overflow = 'hidden';
                    // Close all nested submenus within this one when closing
                    parentItem.querySelectorAll('.mobile-menu-item.open').forEach(nestedOpenItem => {
                        nestedOpenItem.classList.remove('open');
                        const nestedSub = nestedOpenItem.querySelector(':scope > .mobile-submenu');
                        const nestedButton = nestedOpenItem.querySelector(':scope > button.mobile-submenu-toggle');
                        if (nestedSub) {
                            nestedSub.style.maxHeight = '0';
                            nestedSub.style.overflow = 'hidden';
                        }
                        if (nestedButton) nestedButton.setAttribute('aria-expanded', 'false');
                    });
                }
            });
        }
    });

    // --- Language Dropdown Logic ---
    function toggleDropdown(dropdownContainer, forceState) {
        if (!dropdownContainer) return;
        const content = dropdownContainer.querySelector('.language-dropdown-content');
        const toggleButton = dropdownContainer.querySelector('.dropdown-toggle');
        if (!content || !toggleButton) return;

        const currentlyOpen = dropdownContainer.classList.contains('open');
        const open = typeof forceState === 'boolean' ? forceState : !currentlyOpen;

        dropdownContainer.classList.toggle('open', open);
        toggleButton.setAttribute('aria-expanded', open.toString());

        // Handle content visibility
        content.classList.toggle('hidden', !open); // Use hidden class for desktop/mobile consistency
        // For mobile specifically, transition max-height if needed (can be done with CSS open state)
        if (dropdownContainer.id === 'mobile-language-dropdown') {
             // Example: Add a class for CSS transition or handle directly
             // content.style.maxHeight = open ? content.scrollHeight + 'px' : '0';
        }
    }

    // Attach listeners to toggles
    if (desktopLangToggle && desktopLangDropdown) {
        desktopLangToggle.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent window click listener from closing immediately
            toggleDropdown(desktopLangDropdown);
        });
    }
    if (mobileLangToggle && mobileLangDropdown) {
        mobileLangToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleDropdown(mobileLangDropdown);
        });
    }

    // Close dropdowns on outside click
    window.addEventListener('click', function(event) {
        if (desktopLangDropdown && desktopLangDropdown.classList.contains('open') && !desktopLangDropdown.contains(event.target)) {
            toggleDropdown(desktopLangDropdown, false);
        }
        // Mobile dropdown might need different closing logic if it's inside the panel
        if (mobileLangDropdown && mobileLangDropdown.classList.contains('open') && !mobileLangDropdown.contains(event.target)) {
             // Check if the click is outside the entire mobile panel
             const mobilePanel = document.getElementById('mobile-menu-panel');
             if (mobilePanel && !mobilePanel.contains(event.target)) {
                 toggleDropdown(mobileLangDropdown, false);
             }
        }
    });

    // --- Language Button Click Handling (Wrapper) ---
    function handleLanguageChangeWrapper(event) {
        if (typeof handleLanguageChange === 'function') {
            handleLanguageChange(event); // Call the function from language.js
        } else {
            console.error("[Script] handleLanguageChange function is not defined (expected in language.js).");
            return; // Stop if the core function is missing
        }
        // Close the dropdown containing the clicked button
        const dropdown = event.target.closest('.language-dropdown');
        if (dropdown) {
            toggleDropdown(dropdown, false);
        }
    }

    // Expose function to attach listeners globally
    window.attachLanguageButtonListeners = () => {
        const langButtons = document.querySelectorAll('.lang-button'); // Query globally
        if (langButtons.length > 0) {
            langButtons.forEach(button => {
                button.removeEventListener('click', handleLanguageChangeWrapper); // Prevent duplicates
                button.addEventListener('click', handleLanguageChangeWrapper);
            });
            console.log(`[Script] Language listeners attached/re-attached to ${langButtons.length} buttons.`);
        }
    };

    // --- Initialize Other Header Features ---
    initializeStickyNavbar(headerElement);
    initializeActiveMenuHighlighting(headerElement);

    menuInitialized = true;
    console.log("[Script] Header menu logic initialized successfully.");
}

/**
 * Initializes sticky/shrinking navbar behavior.
 * @param {HTMLElement} navbarElement The main navbar element.
 */
function initializeStickyNavbar(navbarElement) {
    if (!navbarElement) return;
    console.log("[Script] Initializing sticky/shrink navbar...");

    let lastScrollTop = 0;
    const shrinkThreshold = 50; // Pixels to scroll before shrinking

    const handleScroll = () => {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // Shrink logic
        if (scrollTop > shrinkThreshold) {
            navbarElement.classList.add('shrink');
        } else {
            navbarElement.classList.remove('shrink');
        }

        // Hide/show logic (optional, can be combined with shrink)
        // Hide only if scrolling down significantly past the initial header height
        const initialHeight = parseInt(getComputedStyle(navbarElement).getPropertyValue('--header-height-initial') || '64', 10);
        if (scrollTop > lastScrollTop && scrollTop > initialHeight) {
            // Hide only if not currently showing mobile menu
            const mobilePanel = document.getElementById('mobile-menu-panel');
            if (!mobilePanel || !mobilePanel.classList.contains('active')) {
                 navbarElement.style.top = `-${navbarElement.offsetHeight}px`; // Hide
            }
        } else {
            navbarElement.style.top = "0"; // Show
        }

        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    };

    // Add passive listener for performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initial check in case the page loads already scrolled
    handleScroll();
}


/**
 * Highlights the active menu item based on the current URL.
 * @param {HTMLElement} headerElement The header element containing the menus.
 */
function initializeActiveMenuHighlighting(headerElement) {
    if (!headerElement) return;
    console.log("[Script] Initializing active menu highlighting...");

    const currentHref = window.location.href.split('#')[0].split('?')[0]; // URL without hash or query params
    const menuLinks = headerElement.querySelectorAll('.nav-link[href], .submenu a[href], #mobile-menu-panel a[href]');

    // --- Helper Function ---
    const normalizeUrl = (url) => {
        try {
            const urlObj = new URL(url, window.location.origin);
            let path = urlObj.pathname;
            // Remove trailing slash unless it's the root path
            if (path !== '/' && path.endsWith('/')) {
                path = path.slice(0, -1);
            }
            // Optional: Remove .html extension
            if (path.endsWith('.html')) {
                 path = path.slice(0, -'.html'.length);
            }
             // Ensure root path is just '/' or '/index' maps to '/'
             return (path === '/index' || path === '') ? '/' : path;
        } catch (e) {
            console.warn(`[Script] Invalid URL for normalization: ${url}`, e);
            return null; // Return null for invalid URLs
        }
    };

    const normalizedCurrentPath = normalizeUrl(currentHref);
    if (normalizedCurrentPath === null) {
        console.error("[Script] Could not normalize current URL.");
        return;
    }
     console.log(`[Script] Normalized current path: ${normalizedCurrentPath}`);

    // --- Reset Active States ---
    menuLinks.forEach(link => {
        link.classList.remove('active-menu-item');
        // Remove parent active classes as well
        const parentToggle = link.closest('.mobile-menu-item')?.querySelector(':scope > button.mobile-submenu-toggle') ||
                             link.closest('.sub-submenu-container')?.querySelector(':scope > button') ||
                             link.closest('.main-menu-item')?.querySelector(':scope > button.nav-link');
        parentToggle?.classList.remove('active-parent-item');
    });
    // Ensure mobile submenus are closed initially if JS is resetting active state
    headerElement.querySelectorAll('#mobile-menu-panel .mobile-menu-item.open').forEach(item => {
        item.classList.remove('open');
        const submenu = item.querySelector(':scope > .mobile-submenu');
        if (submenu) {
            submenu.style.maxHeight = '0';
            submenu.style.overflow = 'hidden';
        }
        item.querySelector(':scope > button.mobile-submenu-toggle')?.setAttribute('aria-expanded', 'false');
    });


    // --- Find Best Match ---
    let bestMatch = { link: null, specificity: -1 }; // specificity: 2=exact href, 1=root path, 0=other path

    menuLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (!linkHref || linkHref === '#' || linkHref.startsWith('javascript:')) return;

        const normalizedLinkPath = normalizeUrl(linkHref);
        if (normalizedLinkPath === null) return; // Skip invalid links

        let currentSpecificity = -1;

        // 1. Exact Href Match (Highest priority) - Compare full URLs
        try {
            const absoluteLinkHref = new URL(linkHref, window.location.origin).href.split('#')[0].split('?')[0];
            if (absoluteLinkHref === currentHref) {
                currentSpecificity = 2;
            }
        } catch (e) { /* Ignore errors creating absolute URL */ }

        // 2. Normalized Path Match (if not exact href match)
        if (currentSpecificity < 2 && normalizedLinkPath === normalizedCurrentPath) {
             // Give root path slightly higher specificity than other matching paths
            currentSpecificity = (normalizedCurrentPath === '/') ? 1 : 0;
        }

        // 3. Update best match based on specificity or path length for ties
        if (currentSpecificity > bestMatch.specificity) {
            bestMatch = { link: link, specificity: currentSpecificity };
        } else if (currentSpecificity === bestMatch.specificity && currentSpecificity >= 0) {
            // If specificity is the same, prefer the longer (more specific) normalized path
            const currentBestPath = normalizeUrl(bestMatch.link.getAttribute('href'));
            if (currentBestPath && normalizedLinkPath.length > currentBestPath.length) {
                bestMatch = { link: link, specificity: currentSpecificity };
            }
        }
    });

    // --- Apply Active State ---
    if (bestMatch.link) {
        const activeLink = bestMatch.link;
        activeLink.classList.add('active-menu-item');
        console.log(`[Script] Active link set: ${activeLink.getAttribute('href')} (Specificity: ${bestMatch.specificity}) Path: ${normalizeUrl(activeLink.getAttribute('href'))}`);

        // Apply parent highlighting and open mobile submenus
        let element = activeLink;
        while (element && element !== headerElement) {
            // Find the closest parent list item or container that holds a toggle button
            const parentMenuItem = element.closest('.mobile-menu-item, .sub-submenu-container, .main-menu-item');
            if (!parentMenuItem) break; // Stop if no more relevant parents

            // Find the direct toggle button child of that parent item
            const parentToggle = parentMenuItem.querySelector(':scope > button.mobile-submenu-toggle, :scope > button.nav-link');
            if (parentToggle) {
                parentToggle.classList.add('active-parent-item');
            }

            // Open mobile submenu if it's a mobile item and not already open
            if (parentMenuItem.classList.contains('mobile-menu-item') && !parentMenuItem.classList.contains('open')) {
                parentMenuItem.classList.add('open');
                const submenu = parentMenuItem.querySelector(':scope > .mobile-submenu');
                if (submenu) {
                    submenu.style.maxHeight = submenu.scrollHeight + "px";
                    submenu.style.overflow = 'visible';
                }
                parentToggle?.setAttribute('aria-expanded', 'true');
            }

            element = parentMenuItem.parentElement; // Move up the DOM tree
        }
    } else {
        console.log("[Script] No active menu item found for current page.");
    }
}


/**
 * Tải và hiển thị tin tức nội bộ từ file JSON.
 */
function loadInternalNews() {
    const newsContainer = document.getElementById(NEWS_CONTAINER_ID);
    if (!newsContainer) {
        // console.warn("[Script] News container (#news-container) not found on this page.");
        return; // Silently exit if container not present
    }

    // Get current language for translations (ensure translations object is available)
    const currentLang = localStorage.getItem('preferredLanguage') || 'vi';
    const readMoreText = window.translations?.[currentLang]?.read_more || 'Read more →';
    const newsTitleNaText = window.translations?.[currentLang]?.news_title_na || 'Title Not Available';
    const newsImageAltText = window.translations?.[currentLang]?.news_image_alt || 'News image';
    const noNewsText = window.translations?.[currentLang]?.no_news || 'No news yet.';
    const newsLoadErrorText = window.translations?.[currentLang]?.news_load_error || 'Could not load news.';
    const loadingNewsText = window.translations?.[currentLang]?.loading_news || 'Loading news...';

    newsContainer.innerHTML = `<p class="text-gray-500 w-full text-center">${loadingNewsText}</p>`; // Show loading message

    fetch(POSTS_JSON_URL)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status} fetching ${POSTS_JSON_URL}`);
            }
            return response.json();
        })
        .then(posts => {
            newsContainer.innerHTML = ''; // Clear loading/previous content

            if (!Array.isArray(posts) || posts.length === 0) {
                newsContainer.innerHTML = `<p class="text-gray-500 w-full text-center">${noNewsText}</p>`;
                return;
            }

            const limitedPosts = posts.slice(0, 6); // Limit to 6 posts

            limitedPosts.forEach(post => {
                const postElement = document.createElement('div');
                // Added scroll-snap-align-start for better snapping if container uses it
                postElement.className = 'news-card flex-shrink-0 w-72 bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105 scroll-snap-align-start';

                const hotBadge = post.hot ? `<span class="absolute top-2 right-2 bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full z-10">HOT</span>` : '';
                const imageSrc = post.image || 'https://placehold.co/300x200/e2e8f0/cbd5e1?text=Image';
                const imageAlt = post.title?.[currentLang] || post.title?.['vi'] || newsImageAltText; // Use translated title for alt
                const postTitle = post.title?.[currentLang] || post.title?.['vi'] || newsTitleNaText; // Get translated title
                const postExcerpt = post.excerpt?.[currentLang] || post.excerpt?.['vi'] || ''; // Get translated excerpt
                // Basic date formatting, consider a library for more complex needs
                let postDate = '';
                if (post.date) {
                    try {
                        // Attempt to parse potentially invalid dates gracefully
                        const dateObj = new Date(post.date.replace(/(\d{4}-\d{2}-\d{2})\d+/, '$1')); // Try to fix YYYY-MM-DDextra
                        if (!isNaN(dateObj)) {
                           postDate = dateObj.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
                        } else {
                           console.warn(`[Script] Invalid date format in posts.json: ${post.date}`);
                        }
                    } catch (e) {
                         console.warn(`[Script] Error parsing date: ${post.date}`, e);
                    }
                }

                postElement.innerHTML = `
                    <a href="${post.link || '#'}" class="block group focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg">
                        <div class="relative">
                            <img src="${imageSrc}"
                                 alt="${imageAlt}"
                                 class="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-110 group-focus:scale-110"
                                 loading="lazy"
                                 onerror="this.onerror=null; this.src='https://placehold.co/300x200/e2e8f0/cbd5e1?text=Load+Error';">
                            ${hotBadge}
                        </div>
                        <div class="p-4">
                            <h3 class="text-lg font-semibold text-gray-800 mb-2 group-hover:text-blue-600 group-focus:text-blue-600 transition-colors duration-200 line-clamp-2" title="${postTitle}">
                                ${postTitle}
                            </h3>
                            <p class="text-sm text-gray-600 mb-3 line-clamp-3">
                                ${postExcerpt}
                            </p>
                            <div class="flex justify-between items-center text-xs text-gray-500 mt-auto">
                                <span>${postDate}</span>
                                <span class="text-blue-500 font-medium group-hover:underline group-focus:underline">${readMoreText}</span>
                            </div>
                        </div>
                    </a>
                `;
                newsContainer.appendChild(postElement);
            });
        })
        .catch(error => {
            console.error("[Script] Error loading internal news:", error);
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
        // Retry mechanism in case the footer DOM isn't ready immediately
        setTimeout(() => {
            const yearElementRetry = document.getElementById(FOOTER_YEAR_ID);
            if (yearElementRetry) {
                yearElementRetry.textContent = new Date().getFullYear();
                console.log("[Script] Footer year updated (on retry).");
            } else {
                console.warn(`[Script] Footer year element (#${FOOTER_YEAR_ID}) not found even after delay.`);
            }
        }, 150); // Slightly longer delay
    }
}


// --- Main Execution Flow ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("[Script] DOM fully loaded. Starting initializations...");

    // --- Load Header & Footer ---
    const headerPromise = loadComponent(HEADER_PLACEHOLDER_ID, HEADER_COMPONENT_URL).catch(err => console.error("Header load failed:", err));
    const footerPromise = loadComponent(FOOTER_PLACEHOLDER_ID, FOOTER_COMPONENT_URL).catch(err => console.error("Footer load failed:", err));

    // --- Initialize Core Logic After Header/Footer Attempt ---
    Promise.allSettled([headerPromise, footerPromise])
        .then((results) => {
            headerFooterLoadAttempted = true;
            const headerLoaded = results[0]?.status === 'fulfilled';
            const footerLoaded = results[1]?.status === 'fulfilled';
            console.log(`[Script] Header loaded: ${headerLoaded}, Footer loaded: ${footerLoaded}`);

            // Initialize header logic ONLY if header loaded successfully
            if (headerLoaded) {
                 initializeHeaderMenuLogic();
            }

            // Initialize language system (requires language.js to be loaded)
            // This needs access to buttons potentially in header AND footer
            if (typeof initializeLanguage === 'function') {
                 if (!window.languageInitialized) {
                      console.log("[Script] Calling initializeLanguage() AFTER components attempt...");
                      initializeLanguage(); // From language.js
                      // Re-attach listeners after language init potentially adds/modifies buttons
                      if (typeof window.attachLanguageButtonListeners === 'function') {
                          window.attachLanguageButtonListeners();
                      }
                 } else {
                      // If language was already initialized (e.g., SPA navigation),
                      // re-apply translations and listeners
                      console.log("[Script] Language already initialized, re-applying translations/listeners...");
                      const currentLang = localStorage.getItem('preferredLanguage') || 'vi';
                      if(typeof applyTranslations === 'function') applyTranslations(currentLang);
                      if (typeof window.attachLanguageButtonListeners === 'function') {
                          window.attachLanguageButtonListeners();
                      }
                 }
            } else {
                 console.error("[Script] initializeLanguage function not found. Language features disabled.");
            }

            // Update footer year ONLY if footer loaded successfully
            if (footerLoaded) {
                 updateFooterYear();
            }
        });

    // --- Page-Specific Initializations ---
    // Use body ID or specific element checks to run page-specific code
    const bodyId = document.body.id;

    if (bodyId === 'page-index' || document.getElementById(NEWS_CONTAINER_ID)) {
        console.log("[Script] Index page or news container found: Loading internal news...");
        loadInternalNews(); // Load news if it's the index or the container exists
    }

    // Check for RSS Feed container and load if function exists
    const rssFeedContainer = document.getElementById('vnexpress-rss-feed');
    if (rssFeedContainer) {
        // Check if the RSS loader script/function is available (assuming it's loaded via <script> tag)
        // Note: rss-loader.js uses DOMContentLoaded, so it might run independently.
        // This check is more for confirming if the container exists.
        console.log("[Script] VnExpress RSS container found.");
        // rss-loader.js should handle the loading itself via its DOMContentLoaded listener.
    }


    if (bodyId === 'page-placement') {
        // Check if the placement test script/function is available
        if (typeof initializePlacementTest === 'function') {
             console.log("[Script] Placement test page: Initializing test...");
             initializePlacementTest();
        } else {
             console.warn("[Script] Placement test page detected, but initializePlacementTest function is missing.");
             // Optionally display an error message on the page
        }
    }

    // Add more 'else if (bodyId === '...')' blocks for other pages as needed

    console.log("[Script] Initial script execution finished (async operations may still be running).");
});
