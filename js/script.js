// /js/script.js - File chính điều phối tải component và khởi tạo

// Biến cờ để đảm bảo các phần chỉ được khởi tạo một lần
let headerFooterLoaded = false;
let menuInitialized = false;
// window.languageInitialized được quản lý trong language.js và kiểm tra ở đây

/**
 * Tải nội dung từ một tệp HTML vào một phần tử placeholder.
 * @param {string} placeholderId ID của phần tử placeholder.
 * @param {string} componentUrl Đường dẫn đến tệp HTML component.
 * @returns {Promise<void>} Promise hoàn thành khi component được tải hoặc báo lỗi.
 */
function loadComponent(placeholderId, componentUrl) {
    const placeholder = document.getElementById(placeholderId);
    if (!placeholder) {
        console.error(`[script.js] Placeholder element with ID "${placeholderId}" not found.`);
        return Promise.reject(`Placeholder not found: ${placeholderId}`);
    }
    // console.log(`[script.js] Starting load for ${componentUrl} into #${placeholderId}`);
    // placeholder.innerHTML = '<p class="text-center text-gray-500 p-4">Loading...</p>'; // Optional loading indicator

    return fetch(componentUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status} loading ${componentUrl}`);
            }
            return response.text();
        })
        .then(html => {
            if (placeholder) { // Check again in case element removed during fetch
                placeholder.innerHTML = html;
                console.log(`[script.js] Component ${componentUrl} loaded into #${placeholderId}`);
            } else {
                 console.error(`[script.js] Placeholder #${placeholderId} disappeared before loading ${componentUrl}.`);
                 // Reject the promise if placeholder is gone
                 return Promise.reject(`Placeholder #${placeholderId} disappeared.`);
            }
            // Resolve successfully
            return Promise.resolve();
        })
        .catch(error => {
            console.error(`[script.js] Error loading component ${componentUrl}:`, error);
            if (placeholder) { // Check again before writing error message
                placeholder.innerHTML = `<p class="text-red-500 text-center p-4">Error loading component: ${componentUrl}. ${error.message}</p>`;
            }
            // Reject the promise on error
            return Promise.reject(error);
        });
}

/**
 * Khởi tạo các sự kiện cho menu mobile và language dropdown.
 * Được gọi SAU KHI header đã được tải thành công.
 */
function initializeHeaderMenuLogic() {
    if (menuInitialized) {
        console.warn("[script.js] Menu events already initialized. Skipping.");
        return;
    }
    console.log("[script.js] Initializing header menu logic (Mobile & Language)...");

    const headerPlaceholder = document.getElementById('header-placeholder');
    const headerElement = headerPlaceholder?.querySelector('header#navbar'); // Query inside placeholder

    if (!headerElement) {
        console.error("[script.js] Header element (#navbar inside #header-placeholder) not found AFTER loading. Cannot initialize menu events.");
        return; // Exit if header isn't found after load attempt
    }

    // Find elements *within* the loaded header
    const mobileMenuButton = headerElement.querySelector('#mobile-menu-button');
    const mobileMenuPanel = headerElement.querySelector('#mobile-menu-panel'); // Use the correct ID from your HTML
    const mobileMenuOverlay = headerElement.querySelector('#mobile-menu-overlay');
    const iconMenu = headerElement.querySelector('#icon-menu');
    const iconClose = headerElement.querySelector('#icon-close');
    const mobileCloseButton = headerElement.querySelector('#mobile-close-button');
    const desktopLangDropdown = headerElement.querySelector('#desktop-language-dropdown');
    const desktopLangToggle = headerElement.querySelector('#desktop-lang-toggle');
    const mobileLangDropdown = headerElement.querySelector('#mobile-language-dropdown');
    const mobileLangToggle = headerElement.querySelector('#mobile-lang-toggle');
    // Find language buttons globally *after* header/footer load, as they might be in footer too
    const langButtons = document.querySelectorAll('.lang-button');

    // --- Mobile Menu Toggle ---
    function toggleMobileMenu(open) {
        if (!mobileMenuPanel || !mobileMenuOverlay || !iconMenu || !closeIcon || !mobileMenuButton) {
            console.error("[script.js] Core mobile menu elements missing for toggle.");
            return;
        }
        const isOpen = typeof open === 'boolean' ? open : mobileMenuButton.getAttribute('aria-expanded') === 'false';

        mobileMenuButton.setAttribute('aria-expanded', isOpen.toString());
        iconMenu.classList.toggle('hidden', isOpen);
        iconClose.classList.toggle('hidden', !isOpen);

        if (isOpen) { // Opening
            mobileMenuOverlay.classList.remove('hidden');
            mobileMenuPanel.classList.remove('hidden');
            requestAnimationFrame(() => {
                mobileMenuOverlay.classList.remove('opacity-0');
                mobileMenuPanel.classList.remove('translate-x-full');
                document.body.style.overflow = 'hidden'; // Prevent body scroll when menu is open
            });
        } else { // Closing
            mobileMenuOverlay.classList.add('opacity-0');
            mobileMenuPanel.classList.add('translate-x-full');
            document.body.style.overflow = ''; // Restore body scroll

            // Use transitionend to hide elements after animation
            const transitionEndHandler = (event) => {
                 // Ensure the event is for the panel itself and it's fully closed
                 if (event.target === mobileMenuPanel && mobileMenuPanel.classList.contains('translate-x-full')) {
                    mobileMenuPanel.classList.add('hidden');
                    mobileMenuOverlay.classList.add('hidden');
                    mobileMenuPanel.removeEventListener('transitionend', transitionEndHandler); // Clean up listener
                 }
            };
            mobileMenuPanel.removeEventListener('transitionend', transitionEndHandler); // Remove previous listener if any
            mobileMenuPanel.addEventListener('transitionend', transitionEndHandler, { once: true });

             // Fallback timeout in case transitionend doesn't fire reliably
             setTimeout(() => {
                 if (mobileMenuPanel.classList.contains('translate-x-full') && !mobileMenuPanel.classList.contains('hidden')) {
                     console.warn("[script.js] Closing mobile menu via fallback timeout.");
                     mobileMenuPanel.classList.add('hidden');
                     mobileMenuOverlay.classList.add('hidden');
                     mobileMenuPanel.removeEventListener('transitionend', transitionEndHandler); // Clean up listener
                 }
             }, 350); // Slightly longer than transition duration
        }
    }

    if (mobileMenuButton) mobileMenuButton.addEventListener('click', () => toggleMobileMenu());
    if (mobileCloseButton) mobileCloseButton.addEventListener('click', () => toggleMobileMenu(false));
    if (mobileMenuOverlay) mobileMenuOverlay.addEventListener('click', () => toggleMobileMenu(false));

    // Close mobile menu when a link inside it is clicked (if it's not a submenu toggle)
    if (mobileMenuPanel) {
        mobileMenuPanel.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', (e) => {
                if (!link.closest('.mobile-submenu-toggle')) {
                    setTimeout(() => toggleMobileMenu(false), 50);
                }
            });
        });
    }

    // --- Mobile Submenu Toggle ---
    const mobileSubmenuToggles = headerElement.querySelectorAll('#mobile-menu-panel .mobile-submenu-toggle');
    mobileSubmenuToggles.forEach(button => {
        // Initialize state
        const parentItem = button.closest('.mobile-menu-item');
        const submenu = parentItem?.querySelector(':scope > .mobile-submenu');
        if(submenu) {
            submenu.style.maxHeight = '0'; // Ensure closed initially
            // Add arrow class if missing
            const arrowIcon = button.querySelector('svg');
            if (arrowIcon && !arrowIcon.classList.contains('submenu-arrow')) {
                arrowIcon.classList.add('submenu-arrow');
            }
        }

        button.addEventListener('click', function(e) {
            e.stopPropagation();
            if (!parentItem || !submenu) return;

            const isOpen = parentItem.classList.toggle('open');
            this.setAttribute('aria-expanded', isOpen.toString());

            if (isOpen) {
                submenu.style.maxHeight = submenu.scrollHeight + "px";
            } else {
                submenu.style.maxHeight = '0';
                // Close nested submenus
                submenu.querySelectorAll('.mobile-menu-item.open').forEach(nestedOpenItem => {
                    nestedOpenItem.classList.remove('open');
                    const nestedSub = nestedOpenItem.querySelector(':scope > .mobile-submenu');
                    if(nestedSub) nestedSub.style.maxHeight = '0';
                    nestedOpenItem.querySelector('button')?.setAttribute('aria-expanded', 'false');
                });
            }

            // Close sibling submenus
            const parentList = parentItem.parentNode;
             if (parentList) {
                Array.from(parentList.children).forEach(sibling => {
                     if (sibling !== parentItem && sibling.classList.contains('mobile-menu-item') && sibling.classList.contains('open')) {
                          sibling.classList.remove('open');
                          const siblingSubmenu = sibling.querySelector(':scope > .mobile-submenu');
                          if(siblingSubmenu) siblingSubmenu.style.maxHeight = '0';
                          sibling.querySelector('button')?.setAttribute('aria-expanded', 'false');
                     }
                });
            }
        });
    });

    // --- Language Dropdown Logic ---
    function toggleDropdown(dropdownElement, forceState) {
        if (!dropdownElement) return;
        const content = dropdownElement.querySelector('.language-dropdown-content');
        if (!content) return;
        const currentlyOpen = dropdownElement.classList.contains('open');
        const open = typeof forceState === 'boolean' ? forceState : !currentlyOpen;
        const toggleButton = dropdownElement.querySelector('.dropdown-toggle');

        dropdownElement.classList.toggle('open', open);
         if (toggleButton) {
            toggleButton.setAttribute('aria-expanded', open.toString());
        }
    }

    if(desktopLangToggle) {
        desktopLangToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleDropdown(desktopLangDropdown);
        });
    }
    if(mobileLangToggle) {
        mobileLangToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleDropdown(mobileLangDropdown);
        });
    }

    // Attach listener to language buttons *after* header/footer load
    if (typeof handleLanguageChange === 'function' && langButtons.length > 0) {
        langButtons.forEach(button => {
            button.removeEventListener('click', handleLanguageChange); // Prevent duplicates
            button.addEventListener('click', handleLanguageChange);
        });
        console.log(`[script.js] Language listeners attached to ${langButtons.length} buttons.`);
    } else if (typeof handleLanguageChange !== 'function') {
         console.warn("[script.js] handleLanguageChange function not found. Language switching might not work.");
    }

    // Close language dropdowns on outside click
    window.addEventListener('click', function(event) {
         if (desktopLangDropdown && desktopLangDropdown.classList.contains('open') && !desktopLangDropdown.contains(event.target)) {
             toggleDropdown(desktopLangDropdown, false);
         }
         if (mobileLangDropdown && mobileLangDropdown.classList.contains('open') && mobileMenuPanel && !mobileMenuPanel.contains(event.target)) {
              toggleDropdown(mobileLangDropdown, false);
         } else if (mobileLangDropdown && mobileLangDropdown.classList.contains('open') && !mobileLangDropdown.contains(event.target)) {
              toggleDropdown(mobileLangDropdown, false);
         }
    });

    // --- Sticky Navbar Logic ---
    initializeStickyNavbar(headerElement);

    // --- Active Menu Item Highlighting ---
    initializeActiveMenuHighlighting(headerElement);

    menuInitialized = true;
    console.log("[script.js] Header menu logic initialized successfully.");
}

/**
 * Đánh dấu link điều hướng đang hoạt động.
 * @param {HTMLElement} headerElement Phần tử header chứa menu.
 */
function initializeActiveMenuHighlighting(headerElement) {
     if (!headerElement) return;
     console.log("[script.js] Initializing active menu highlighting...");
     const currentPagePath = window.location.pathname;
     const currentHref = window.location.href.split('#')[0];
     // Query links within the loaded header element
     const menuLinks = headerElement.querySelectorAll('.lg\\:flex a[href], #mobile-menu-panel a[href]');

     // Reset previous active states
     menuLinks.forEach(link => {
         link.classList.remove('active-menu-item', 'font-bold', 'text-blue-600', 'bg-blue-100', 'bg-blue-800'); // Reset all possible active classes
         const mobileItem = link.closest('.mobile-menu-item');
         if (mobileItem) {
             mobileItem.classList.remove('open');
             mobileItem.querySelector('button.mobile-submenu-toggle')?.classList.remove('active-parent-item');
             const submenu = mobileItem.querySelector(':scope > .mobile-submenu');
             if (submenu) submenu.style.maxHeight = '0'; // Ensure closed
         }
     });

     let bestMatchLink = null;
     let highestSpecificity = -1;

     menuLinks.forEach(link => {
         const linkHref = link.getAttribute('href');
         if (!linkHref || linkHref === '#') return;
         let linkUrl;
         try { linkUrl = new URL(linkHref, window.location.origin); } catch (e) { return; }
         const linkPath = linkUrl.pathname;
         const linkFullHref = linkUrl.href.split('#')[0];
         let currentSpecificity = -1;

         const normalizePath = (path) => {
             let p = path.endsWith('/') && path.length > 1 ? path.slice(0, -1) : path;
             if (p.endsWith('/index.html')) p = p.substring(0, p.length - '/index.html'.length);
             return p === '' ? '/' : p;
         };
         const normalizedLinkPath = normalizePath(linkPath);
         const normalizedCurrentPath = normalizePath(currentPagePath);

         if (linkFullHref === currentHref) currentSpecificity = 2;
         else if (normalizedLinkPath === normalizedCurrentPath) currentSpecificity = (normalizedCurrentPath === '/') ? 1 : 0;

         if (currentSpecificity > highestSpecificity) {
             highestSpecificity = currentSpecificity;
             bestMatchLink = link;
         } else if (currentSpecificity === highestSpecificity && currentSpecificity >= 0) {
             if (bestMatchLink) {
                 try {
                     const bestMatchPath = (new URL(bestMatchLink.href, window.location.origin)).pathname;
                     if (linkPath.length > bestMatchPath.length) bestMatchLink = link;
                 } catch (e) {}
             }
         }
     });

     if (bestMatchLink) {
         bestMatchLink.classList.add('active-menu-item', 'font-bold');
         if (bestMatchLink.closest('#mobile-menu-panel')) {
             bestMatchLink.classList.add('text-blue-600', 'bg-blue-100'); // Mobile active style
         } else if (bestMatchLink.closest('.main-menu-item')) {
              bestMatchLink.classList.add('bg-blue-800'); // Desktop active style (adjust color if needed)
         }
         console.log(`[script.js] Active link set: ${bestMatchLink.getAttribute('href')}`);

         // Open parent mobile submenus
         let currentElement = bestMatchLink;
         while (currentElement && currentElement !== headerElement) {
             const parentMenuItem = currentElement.closest('.mobile-menu-item');
             if (parentMenuItem) {
                 const parentToggle = parentMenuItem.querySelector(':scope > button.mobile-submenu-toggle');
                 if (parentToggle) parentToggle.classList.add('active-parent-item');
                 if (!parentMenuItem.classList.contains('open')) {
                     parentMenuItem.classList.add('open');
                     const parentSubmenu = parentMenuItem.querySelector(':scope > .mobile-submenu');
                     if (parentSubmenu) parentSubmenu.style.maxHeight = parentSubmenu.scrollHeight + "px";
                 }
                 currentElement = parentMenuItem.parentElement;
             } else {
                 currentElement = currentElement.parentElement;
             }
         }
     }
}

/**
 * Khởi tạo logic cho sticky navbar.
 * @param {HTMLElement} navbarElement Phần tử header (navbar).
 */
function initializeStickyNavbar(navbarElement) {
    if (!navbarElement) return;
    console.log("[script.js] Initializing sticky navbar...");
    let lastScrollTop = 0;
    window.addEventListener('scroll', function() {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        if (scrollTop > lastScrollTop && scrollTop > navbarElement.offsetHeight){
             navbarElement.style.top = `-${navbarElement.offsetHeight}px`;
        } else {
             navbarElement.style.top = "0";
        }
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    }, { passive: true });
}

// --- MAIN EXECUTION ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("[script.js] DOM fully loaded. Starting component loading...");

    // Tải Header và Footer đồng thời
    const headerPromise = loadComponent('header-placeholder', 'header.html');
    const footerPromise = loadComponent('footer-placeholder', 'footer.html');

    // Xử lý SAU KHI cả header và footer đã được tải XONG
    Promise.allSettled([headerPromise, footerPromise]) // Use allSettled to proceed even if one fails
        .then((results) => {
            const headerLoaded = results[0].status === 'fulfilled';
            const footerLoaded = results[1].status === 'fulfilled';
            console.log(`[script.js] Header loaded: ${headerLoaded}, Footer loaded: ${footerLoaded}`);
            headerFooterLoaded = true; // Mark as loaded (or attempted)

            if (headerLoaded) {
                // 1. Khởi tạo Logic Header (chỉ khi header load thành công)
                initializeHeaderMenuLogic();
            }

            // 2. Khởi tạo Ngôn ngữ (chạy nếu language.js tồn tại, bất kể footer load thành công hay không)
            if (typeof initializeLanguage === 'function') {
                if (!window.languageInitialized) {
                    console.log("[script.js] Calling initializeLanguage() AFTER components attempt...");
                    initializeLanguage(); // Gọi hàm từ language.js
                } else {
                     console.log("[script.js] Language already initialized, applying translations again...");
                     const currentLang = localStorage.getItem('preferredLanguage') || 'vi';
                     if(typeof applyTranslations === 'function') applyTranslations(currentLang);
                }
            } else {
                console.error("[script.js] initializeLanguage function not found. Language features won't work.");
            }

             // 3. Cập nhật năm ở footer (chỉ khi footer load thành công)
             if (footerLoaded && typeof updateFooterYear === 'function') {
                 updateFooterYear();
             } else if (footerLoaded) {
                 console.warn("[script.js] updateFooterYear function not found, but footer loaded.");
             }

        })
        .catch(error => {
             // Catch should ideally not be reached with allSettled unless loadComponent itself throws uncaught error
             console.error("[script.js] Unexpected error during Promise.allSettled:", error);
        });

    // --- Các khởi tạo khác cho từng trang cụ thể ---
    const bodyId = document.body.id;
    if (bodyId === 'page-index') {
        if (typeof loadInternalNews === 'function') {
             console.log("[script.js] Index page: Loading internal news...");
             loadInternalNews();
        } else { console.warn("[script.js] loadInternalNews function not found."); }
        if (typeof loadVnExpressFeed === 'function') {
             console.log("[script.js] Index page: Loading VnExpress feed...");
             loadVnExpressFeed();
        } else { console.warn("[script.js] loadVnExpressFeed function not found."); }
    }
    if (bodyId === 'page-placement' && typeof initializePlacementTest === 'function') {
        console.log("[script.js] Placement test page: Initializing test...");
        initializePlacementTest();
    }
    // ... các trang khác ...

    console.log("[script.js] Initial script execution finished (component loading might be pending).");
});

// Hàm cập nhật năm ở footer (có thể đặt ở đây hoặc trong footer.html)
function updateFooterYear() {
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
        console.log("[script.js] Footer year updated.");
    } else {
        console.warn("[script.js] Footer year element (#current-year) not found.");
    }
}