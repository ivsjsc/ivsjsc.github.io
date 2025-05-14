/* ========================== */
/* Optimized JavaScript Logic */
/* Version: Added detailed logs for desktop menu click handling */
/* ========================== */

// --- Constants ---
// Corrected paths assuming script.js is in a subdirectory (e.g., js/)
// and header.html/footer.html are in the parent directory (root)
const HEADER_COMPONENT_URL = '../header.html'; // Corrected path
const FOOTER_COMPONENT_URL = '../footer.html'; // Corrected path
const POSTS_JSON_URL = 'posts.json'; // Assuming posts.json is relative to the main HTML file

const HEADER_PLACEHOLDER_ID = 'header-placeholder';
const FOOTER_PLACEHOLDER_ID = 'footer-placeholder';
const NEWS_CONTAINER_ID = 'news-container';
const FOOTER_YEAR_ID = 'current-year'; // ID for the element displaying the year in the footer
const SEARCH_HIGHLIGHT_CLASS = 'search-highlight';

// --- State Flags ---
let headerFooterLoadAttempted = false;
let menuInitialized = false;
let searchDebounceTimer = null;
// window.languageInitialized and window.translations are managed by language.js
// Assuming language.js is loaded separately and defines these

// --- Utility Functions ---

/**
 * Loads HTML content from a component file into a specified placeholder element.
 * Includes logging for debugging the loading process.
 * @param {string} placeholderId - The ID of the HTML element that will hold the loaded content.
 * @param {string} componentUrl - The URL (path) to the HTML component file.
 * @returns {Promise<HTMLElement | null>} A Promise that resolves with the updated placeholder element
 * if loading is successful, or null if an error occurs
 * or the placeholder is not found.
 */
function loadComponent(placeholderId, componentUrl) {
    console.log(`[Script] Attempting to load component: ${componentUrl} into #${placeholderId}`);
    const placeholder = document.getElementById(placeholderId);

    // Check if the placeholder element exists in the main HTML file
    if (!placeholder) {
        console.error(`[Script] Placeholder element "${placeholderId}" not found in the DOM. Cannot load component.`);
        // Return a resolved Promise with null to allow Promise.all to continue
        return Promise.resolve(null);
    }

    // Optional: Display a loading message in the placeholder
     // Giữ lại nội dung cũ nếu có để tránh nhấp nháy quá nhanh
    if (placeholder.innerHTML.trim() === '') {
         placeholder.innerHTML = `<p class="text-gray-500 text-center p-4">Đang tải ${componentUrl}...</p>`;
    }


    return fetch(componentUrl)
        .then(response => {
            // Check if the HTTP response was successful (status 200-299)
            if (!response.ok) {
                console.error(`[Script] HTTP error ${response.status} loading ${componentUrl}`);
                // Throw an error to be caught by the .catch block
                throw new Error(`HTTP error ${response.status} loading ${componentUrl}`);
            }
            console.log(`[Script] Successfully fetched ${componentUrl}.`);
            // Return the response body as text
            return response.text();
        })
        .then(html => {
            // Re-check if the placeholder still exists before inserting HTML
            const currentPlaceholder = document.getElementById(placeholderId);
            if (!currentPlaceholder) {
                console.error(`[Script] Placeholder "${placeholderId}" disappeared after fetch. Cannot insert HTML.`);
                return null; // Placeholder is gone, cannot insert
            }

            // Insert the fetched HTML into the placeholder element
            currentPlaceholder.innerHTML = html;
            console.log(`[Script] Successfully loaded and inserted ${componentUrl} into #${placeholderId}`);

            // Return the updated placeholder element
            return currentPlaceholder;
        })
        .catch(error => {
            // Handle any errors during the fetch or insertion process
            console.error(`[Script] Error loading ${componentUrl}:`, error);

            // Find the placeholder again to display an error message
            const currentPlaceholder = document.getElementById(placeholderId);
            if (currentPlaceholder) {
                // Display an informative error message on the page
                currentPlaceholder.innerHTML = `<p class="text-red-500 text-center p-4">Lỗi tải thành phần: ${error.message}. Vui lòng kiểm tra đường dẫn file (${componentUrl}).</p>`;
            }

            // Return null to indicate failure, allowing Promise.all to continue
            return null;
        });
}

// --- Initialization Functions ---

/**
 * Initializes header menu events, including search functionality,
 * after the header HTML component has been successfully loaded into the DOM.
 */
function initializeHeaderMenuLogic() {
    // Check if menu logic has already been initialized to prevent duplicates
    if (menuInitialized) {
        console.warn("[Script] Menu already initialized. Skipping.");
        return;
    }

    // Find the main header element (#navbar) within the loaded header component's content.
    // This assumes the loaded header.html contains an element with id="navbar".
    const headerPlaceholder = document.getElementById(HEADER_PLACEHOLDER_ID);
    const headerElement = headerPlaceholder?.querySelector('#navbar');

    // Check if the header element was successfully found inside the placeholder
    if (!headerElement) {
        console.error("[Script] Header element (#navbar) not found *inside* the placeholder after loading. Cannot initialize menu logic.");
        console.log("[Script] Please ensure the content of header.html contains an element with id='navbar'.");
        return; // Exit the function if the header element is not found
    }

    console.log("[Script] Initializing header menu logic (including search)... Header element found:", headerElement);

    // Cache DOM elements needed for header functionality, searching within headerElement
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

    // Select menu items - ensure selectors are correct based on your HTML structure
    const mobileMenuItems = headerElement.querySelectorAll('#mobile-menu-panel .mobile-menu-item'); // Items within the mobile panel
    const desktopMenuItems = headerElement.querySelectorAll('#menu-items > .main-menu-item'); // Top-level items in the desktop menu

    const desktopSearchButton = headerElement.querySelector('#desktop-search-button');
    const desktopSearchContainer = headerElement.querySelector('#desktop-search-container');
    const desktopSearchInput = headerElement.querySelector('#desktop-search-input');
    const desktopSearchClose = headerElement.querySelector('#desktop-search-close');
    const mobileSearchInput = headerElement.querySelector('#mobile-search-input'); // Assuming mobile search input has this ID


    // Log the presence of key elements to help debugging
    console.log(`[Script] Mobile menu button found: ${!!mobileMenuButton}`);
    console.log(`[Script] Mobile menu panel found: ${!!mobileMenuPanel}`);
    console.log(`[Script] Mobile menu overlay found: ${!!mobileMenuOverlay}`);
    console.log(`[Script] Found ${desktopMenuItems.length} desktop main menu items.`);
    console.log(`[Script] Found ${mobileMenuItems.length} mobile menu items.`);
    console.log(`[Script] Desktop search button found: ${!!desktopSearchButton}`);
    console.log(`[Script] Desktop search container found: ${!!desktopSearchContainer}`);
    console.log(`[Script] Mobile search input found: ${!!mobileSearchInput}`);


    // --- Mobile Menu Toggle Logic ---
    /**
     * Toggles the visibility of the mobile menu panel and overlay.
     * @param {boolean} [forceOpenState] - Optional. If provided, forces the menu to open (true) or close (false).
     */
    function toggleMobileMenu(forceOpenState) {
        // Check if all required elements for mobile menu are found
        if (!mobileMenuPanel || !mobileMenuOverlay || !iconMenu || !iconClose || !mobileMenuButton) {
             console.warn("[Script] toggleMobileMenu: Missing one or more required mobile menu elements. Functionality disabled.");
             return; // Exit if essential elements are missing
        }

        // Determine the desired open state
        const isCurrentlyExpanded = mobileMenuButton.getAttribute('aria-expanded') === 'true';
        const shouldBeOpen = typeof forceOpenState === 'boolean' ? forceState : !isCurrentlyExpanded;

        // Update aria-expanded attribute
        mobileMenuButton.setAttribute('aria-expanded', shouldBeOpen.toString());

        // Toggle hamburger/close icons
        iconMenu.classList.toggle('hidden', shouldBeOpen);
        iconClose.classList.toggle('hidden', !shouldBeOpen);

        // Apply classes for showing/hiding and triggering CSS transitions
        if (shouldBeOpen) {
            mobileMenuOverlay.classList.remove('hidden');
            mobileMenuPanel.classList.remove('hidden'); // Đảm bảo display is not 'none' before transition
            // Use requestAnimationFrame to ensure the display change is processed before applying transition classes
            requestAnimationFrame(() => {
                mobileMenuOverlay.classList.add('active');
                mobileMenuPanel.classList.add('active'); // 'active' class should trigger the transform transition
            });
            document.body.classList.add('overflow-hidden'); // Ngăn cuộn trang chính
            console.log("[Script] Mobile menu opened.");
        } else {
            mobileMenuOverlay.classList.remove('active');
            mobileMenuPanel.classList.remove('active'); // Remove 'active' to trigger the transform transition back
            document.body.classList.remove('overflow-hidden'); // Allow scrolling again

            // Add 'hidden' class after the transition completes to fully hide the element
             mobileMenuPanel.addEventListener('transitionend', function onTransitionEnd() {
                 // Chỉ thêm 'hidden' nếu panel thực sự đã đóng (không còn lớp 'active')
                 if (!mobileMenuPanel.classList.contains('active')) {
                     mobileMenuPanel.classList.add('hidden');
                     mobileMenuOverlay.classList.add('hidden');
                 }
                 // Xóa listener sau khi chạy xong
                 mobileMenuPanel.removeEventListener('transitionend', onTransitionEnd);
             }, { once: true }); // { once: true } đảm bảo listener chỉ chạy một lần
             // Thêm timeout phòng trường hợp transitionend không bắn (ví dụ: không có transition CSS)
             setTimeout(() => {
                  if (!mobileMenuPanel.classList.contains('active')) {
                      mobileMenuPanel.classList.add('hidden');
                      mobileMenuOverlay.classList.add('hidden');
                  }
             }, 350); // Thời gian này nên lớn hơn hoặc bằng thời gian transition CSS
             console.log("[Script] Mobile menu closed.");
        }
    }
    // Đảm bảo trạng thái ban đầu của overlay và panel là hidden (dù CSS cũng nên xử lý)
    mobileMenuOverlay?.classList.add('hidden');
    mobileMenuPanel?.classList.add('hidden');

    // Add event listeners for mobile menu buttons and overlay
    mobileMenuButton?.addEventListener('click', () => toggleMobileMenu());
    mobileCloseButton?.addEventListener('click', () => toggleMobileMenu(false));
    mobileMenuOverlay?.addEventListener('click', () => toggleMobileMenu(false));

    // Close mobile menu when a link inside is clicked (unless it's a submenu toggle)
    mobileMenuPanel?.querySelectorAll('a[href]').forEach(link => {
        // Kiểm tra xem link có phải là một phần của nút toggle submenu không
        if (!link.closest('.mobile-submenu-toggle')) {
            link.addEventListener('click', () => {
                // Thêm một độ trễ nhỏ để cho phép trình duyệt xử lý việc điều hướng trang trước khi đóng menu
                setTimeout(() => toggleMobileMenu(false), 100);
            });
        }
    });


    // --- Mobile Submenu Accordion Logic ---
    // This logic handles the expanding/collapsing of nested menus within the mobile panel.
    mobileMenuItems.forEach(item => {
        // Select the toggle button and the submenu directly within the current mobile menu item
        const button = item.querySelector(':scope > button.mobile-submenu-toggle');
        const submenu = item.querySelector(':scope > .mobile-submenu');
        const arrow = button?.querySelector('.submenu-arrow'); // Find the arrow element within the button

        if (!button || !submenu) {
             // console.warn("[Script] Mobile submenu item missing button or submenu:", item);
             return; // Bỏ qua nếu không đủ phần tử
        }

        // Thiết lập trạng thái ban đầu
        submenu.style.maxHeight = '0';
        submenu.style.overflow = 'hidden'; // Đảm bảo ẩn nội dung tràn
        item.classList.remove('open'); // Đảm bảo mục cha bắt đầu với trạng thái đóng
        button.setAttribute('aria-expanded', 'false'); // Set initial aria attribute
        if(arrow) arrow.classList.remove('rotate-90'); // Đảm bảo mũi tên ở trạng thái ban đầu

        button.addEventListener('click', function(e) {
            e.stopPropagation(); // Ngăn sự kiện click lan ra ngoài

            const parentItem = this.closest('.mobile-menu-item');
            if (!parentItem) {
                 console.error("[Script] Mobile submenu toggle found but parent .mobile-menu-item not found.");
                 return;
            }

            const isOpen = parentItem.classList.toggle('open'); // Chuyển đổi trạng thái 'open' trên mục cha
            this.setAttribute('aria-expanded', String(isOpen)); // Cập nhật thuộc tính aria-expanded

            if(arrow) arrow.classList.toggle('rotate-90', isOpen); // Xoay mũi tên

            if(isOpen) {
                // Mở submenu: đặt maxHeight bằng scrollHeight để kích hoạt transition
                submenu.style.maxHeight = submenu.scrollHeight + "px";
                // Không ẩn overflow ngay lập tức để transition maxHeight hoạt động
                // submenu.style.overflow = 'visible'; // Có thể cần hoặc không tùy CSS transition
                console.log(`[Script] Mobile submenu opening for ${submenuId}. scrollHeight: ${submenu.scrollHeight}`);

                // Đóng các submenu anh em cùng cấp độ
                const siblings = Array.from(parentItem.parentNode.children)
                                    .filter(child =>
                                        child !== parentItem && // Exclude the current item
                                        child.classList.contains('mobile-menu-item') && // Ensure it's a mobile menu item
                                        child.classList.contains('open') // Check if it's currently open
                                    );

                siblings.forEach(sibling => {
                    sibling.classList.remove('open'); // Xóa trạng thái 'open'
                    const siblingSubmenu = sibling.querySelector(':scope > .mobile-submenu'); // Find the sibling's submenu
                    const siblingButton = sibling.querySelector(':scope > button.mobile-submenu-toggle'); // Find the sibling's toggle button
                    const siblingArrow = sibling.querySelector(':scope > button.mobile-submenu-toggle .submenu-arrow'); // Find the sibling's arrow

                    if (siblingSubmenu) {
                        siblingSubmenu.style.maxHeight = '0'; // Thu gọn submenu anh em
                        // Add a transitionend listener to hide overflow after collapse transition
                        siblingSubmenu.addEventListener('transitionend', function onSiblingTransitionEnd() {
                             // Chỉ ẩn overflow nếu max-height đã về 0
                             if (siblingSubmenu.style.maxHeight === '0px') {
                                siblingSubmenu.style.overflow = 'hidden'; // Hide overflow
                             }
                             // Xóa listener
                             siblingSubmenu.removeEventListener('transitionend', onSiblingTransitionEnd);
                        }, { once: true }); // Run listener only once
                    }
                    if (siblingButton) siblingButton.setAttribute('aria-expanded', 'false'); // Update aria attribute
                    if (siblingArrow) siblingArrow.classList.remove('rotate-90'); // Reset arrow rotation
                });

            } else {
                // Đóng submenu: đặt maxHeight về 0
                submenu.style.maxHeight = '0';
                 // Thêm listener để ẩn overflow sau khi transition kết thúc
                 submenu.addEventListener('transitionend', function onTransitionEnd() {
                     // Chỉ ẩn overflow nếu max-height đã về 0
                     if (submenu.style.maxHeight === '0px') {
                        submenu.style.overflow = 'hidden'; // Hide overflow
                     }
                     // Xóa listener
                     submenu.removeEventListener('transitionend', onTransitionEnd);
                 }, { once: true }); // Run listener only once

                // Thu gọn tất cả submenu lồng bên trong submenu hiện tại
                parentItem.querySelectorAll('.mobile-menu-item.open').forEach(nestedOpenItem => {
                     nestedOpenItem.classList.remove('open'); // Remove 'open' state from nested item
                     const nestedSubmenu = nestedOpenItem.querySelector(':scope > .mobile-submenu'); // Find nested submenu
                     const nestedButton = nestedOpenItem.querySelector(':scope > button.mobile-submenu-toggle'); // Find nested toggle button
                     const nestedArrow = nestedOpenItem.querySelector(':scope > button.mobile-submenu-toggle .submenu-arrow'); // Find nested arrow
                     if(nestedSubmenu) {
                         nestedSubmenu.style.maxHeight = '0'; // Collapse nested submenu
                          nestedSubmenu.addEventListener('transitionend', function onNestedTransitionEnd() {
                              if (nestedSubmenu.style.maxHeight === '0px') {
                                 nestedSubmenu.style.overflow = 'hidden';
                              }
                              nestedSubmenu.removeEventListener('transitionend', onNestedTransitionEnd);
                          }, { once: true });
                     }
                     if(nestedButton) nestedButton.setAttribute('aria-expanded', 'false'); // Update aria attribute
                     if(nestedArrow) nestedArrow.classList.remove('rotate-90'); // Reset arrow rotation
                });
                console.log(`[Script] Mobile submenu closed for ${submenuId}.`);
            }
             console.log(`[Script] Mobile submenu toggled for ${submenuId}. Parent open: ${parentItem.classList.contains('open')}, Submenu max-height: ${submenu.style.maxHeight}`);
        });
    });


    // --- Language Dropdown Logic ---
    // The toggleDropdown function is defined above and used for both desktop and mobile language dropdowns.
    // desktopLangToggle, desktopLangOptions, mobileLangToggle, mobileLangOptions are cached at the beginning.

    // Add click listener for the desktop language toggle button
    if (desktopLangToggle && desktopLangDropdown && desktopLangOptions) {
        console.log("[Script] Desktop language dropdown found. Attaching click listener.");
        desktopLangToggle.addEventListener('click', e => {
             console.log("[Script] Desktop language toggle clicked.");
             e.stopPropagation(); // Prevent event from bubbling up to the document click listener
             toggleDropdown(desktopLangDropdown); // Toggle the desktop language dropdown
             // Close any open desktop main menus when the language dropdown is opened
             closeAllDesktopMenus(null); // Pass null to close all menus
        });
         // Add click listeners to the language selection buttons within the desktop dropdown
        desktopLangOptions.querySelectorAll('.lang-button').forEach(button => {
            button.addEventListener('click', handleLanguageChangeWrapper); // Use the wrapper function
        });
    } else { console.warn("[Script] Desktop language dropdown elements not fully found. Desktop language switching may not work."); }

    // Add click listener for the mobile language toggle button
    if (mobileLangToggle && mobileLanguageDropdown && mobileLangOptions) {
        console.log("[Script] Mobile language dropdown found. Attaching click listener.");
        mobileLangToggle.addEventListener('click', e => {
             console.log("[Script] Mobile language toggle clicked.");
             e.stopPropagation(); // Prevent event from bubbling up
             toggleDropdown(mobileLanguageDropdown); // Toggle the mobile language dropdown
        });
         // Add click listeners to the language selection buttons within the mobile dropdown
        mobileLangOptions.querySelectorAll('.lang-button').forEach(button => {
            button.addEventListener('click', handleLanguageChangeWrapper); // Use the wrapper function
        });
    } else { console.warn("[Script] Mobile language dropdown elements not fully found. Mobile language switching may not work."); }

    // The handleLanguageChangeWrapper function is defined above.
    // It assumes window.handleLanguageChange is defined in language.js.

     // This function is called after the header component is loaded (in Promise.all)
     // It finds all .lang-button elements within the loaded header and attaches listeners.
     window.attachLanguageButtonListeners = () => {
        console.log("[Script] Attaching language button listeners...");
        // Find all .lang-button elements within the loaded header component
        const langButtons = headerElement.querySelectorAll('.lang-button');
        if (langButtons.length > 0) {
            langButtons.forEach(button => {
                 // Remove existing listeners to prevent duplicates if this function is called multiple times
                 button.removeEventListener('click', handleLanguageChangeWrapper);
                 // Add the click listener using the wrapper function
                 button.addEventListener('click', handleLanguageChangeWrapper);
            });
            console.log(`[Script] Attached listeners to ${langButtons.length} language buttons.`);
        } else {
             console.warn("[Script] No language buttons (.lang-button) found in the loaded header component.");
        }
     };


    // --- Desktop Search Functionality ---
    // desktopSearchButton, desktopSearchContainer, desktopSearchInput, desktopSearchClose, mobileSearchInput are cached

    /**
     * Toggles the visibility and active state of the desktop search bar.
     * @param {boolean} [show] - Optional. If provided, forces the search bar to show (true) or hide (false).
     */
    function toggleDesktopSearch(show) {
        // Check if all required elements for desktop search are found
        if (!desktopSearchContainer || !desktopSearchButton || !desktopSearchInput || !desktopSearchClose) {
             console.warn("[Script] toggleDesktopSearch: Missing one or more required desktop search elements. Functionality disabled.");
             return; // Exit if essential elements are missing
        }

        const isActive = desktopSearchContainer.classList.contains('active'); // Check current active state
        const shouldShow = typeof show === 'boolean' ? show : !isActive; // Determine desired state

        if (shouldShow) {
            console.log("[Script] Opening desktop search.");
            desktopSearchContainer.classList.remove('hidden'); // Ensure display is not 'none'
            desktopSearchContainer.classList.add('flex'); // Set display to flex
            desktopSearchButton.classList.add('hidden'); // Ẩn nút search icon

            // Hide other elements in the header that should be hidden when search is active
            const consultationButton = headerElement.querySelector('.cta-button');
            const desktopLanguageDropdown = headerElement.querySelector('#desktop-language-dropdown');
            if(consultationButton) consultationButton.classList.add('hidden');
            if(desktopLanguageDropdown) desktopLanguageDropdown.classList.add('hidden');

            // Use requestAnimationFrame to ensure the display change is processed before applying transition classes
            requestAnimationFrame(() => {
                 desktopSearchContainer.classList.add('active'); // Add 'active' class to trigger width/opacity transition
            });

            desktopSearchInput.focus(); // Focus the search input field
            closeAllDesktopMenus(null); // Đóng any open desktop menu dropdowns
            if (desktopLangDropdown) toggleDropdown(desktopLangDropdown, false); // Ensure language dropdown is closed
        } else {
             console.log("[Script] Closing desktop search.");
            desktopSearchContainer.classList.remove('active'); // Kích hoạt transition width/opacity ngược lại

            // Add 'hidden' class and remove 'flex' after the transition completes to fully hide the element
            desktopSearchContainer.addEventListener('transitionend', function onTransitionEnd() {
                 // Check if the container has finished closing
                 if (!desktopSearchContainer.classList.contains('active')) {
                     desktopSearchContainer.classList.add('hidden');
                     desktopSearchContainer.classList.remove('flex'); // Xóa display: flex
                 }
                 // Remove the event listener
                 desktopSearchContainer.removeEventListener('transitionend', onTransitionEnd);
            }, { once: true }); // Run listener only once

             // Add a timeout as a fallback in case transitionend doesn't fire
             setTimeout(() => {
                 if (!desktopSearchContainer.classList.contains('active')) {
                      desktopSearchContainer.classList.add('hidden');
                      desktopSearchContainer.classList.remove('flex');
                 }
             }, 350); // Match or exceed CSS transition duration

            desktopSearchButton.classList.remove('hidden'); // Show the search icon button again
             // Show other elements that were hidden
            const consultationButton = headerElement.querySelector('.cta-button');
            const desktopLanguageDropdown = headerElement.querySelector('#desktop-language-dropdown');
            if(consultationButton) consultationButton.classList.remove('hidden');
            if(desktopLanguageDropdown) desktopLanguageDropdown.classList.remove('hidden');

            desktopSearchInput.value = ''; // Clear the search input value
            clearSearchHighlights(); // Remove any search highlighting from the page
        }
    }
    // Ensure the desktop search container is initially hidden and not using flex display
    desktopSearchContainer?.classList.add('hidden');
    desktopSearchContainer?.classList.remove('flex');


    // Add click listener for the desktop search icon button
    desktopSearchButton?.addEventListener('click', (e) => { e.stopPropagation(); toggleDesktopSearch(true); });
    // Add click listener for the close button inside the search bar
    desktopSearchClose?.addEventListener('click', (e) => { e.stopPropagation(); toggleDesktopSearch(false); }); // Ngăn event buble
    // Prevent clicks inside the search container from bubbling up and closing the search bar via the window listener
    desktopSearchContainer?.addEventListener('click', (e) => { e.stopPropagation(); });

    // Add a global click listener to close the desktop search bar if clicking outside
    window.addEventListener('click', (event) => {
         // Check if the desktop search container is active (open) AND
         // if the click target is outside the search container AND
         // if the click target is outside the search icon button
         if (desktopSearchContainer?.classList.contains('active') &&
             !desktopSearchContainer.contains(event.target) &&
             event.target !== desktopSearchButton && // Click không phải trên nút search
             !desktopSearchButton.contains(event.target) // Click không phải bên trong nút search
            )
         {
             console.log("[Script] Clicked outside desktop search area, closing search.");
             toggleDesktopSearch(false); // Close the search bar
         }
    });

    // Handle input in search fields with debounce
    let searchDebounceTimer = null; // Timer variable for debounce
    const handleSearchInput = (event) => {
        clearTimeout(searchDebounceTimer); // Clear any existing timer
        const query = event.target.value;

        // Only perform search if the query has at least 2 characters (or your desired minimum length)
        if (query.trim().length >= 2) {
             console.log(`[Script] Search input debounce: "${query}". Scheduling search.`);
            // Set a new timer to perform the search after a short delay (e.g., 300ms)
            searchDebounceTimer = setTimeout(() => {
                // Call the performSearch function with the current query
                // The performSearch function needs to be defined elsewhere (e.g., in this file or globally)
                if (typeof performSearch === 'function') {
                    performSearch(query);
                } else {
                    console.warn("[Script] performSearch function not found. Cannot perform client-side search.");
                }
            }, 300); // 300ms delay
        } else {
             // If the query is too short or empty, clear any existing highlights
             console.log("[Script] Search input cleared or too short, clearing highlights.");
             clearSearchHighlights(); // The clearSearchHighlights function needs to be defined
        }
    };
    // Add input event listeners to both desktop and mobile search inputs
    desktopSearchInput?.addEventListener('input', handleSearchInput);
    mobileSearchInput?.addEventListener('input', handleSearchInput);

    // Ngăn form submit mặc định khi nhấn Enter trong ô search
    desktopSearchInput?.closest('form')?.addEventListener('submit', e => {
        e.preventDefault(); // Prevent default form submission
        console.log("[Script] Desktop search form submitted (prevented default). Performing search.");
        // Perform the search immediately when Enter is pressed
        if (typeof performSearch === 'function') {
            performSearch(desktopSearchInput.value);
        } else {
             console.warn("[Script] performSearch function not found. Cannot perform client-side search on submit.");
        }
    });
    mobileSearchInput?.closest('form')?.addEventListener('submit', e => {
        e.preventDefault(); // Prevent default form submission
        console.log("[Script] Mobile search form submitted (prevented default). Performing search.");
         if (typeof performSearch === 'function') {
            performSearch(mobileSearchInput.value);
         } else {
             console.warn("[Script] performSearch function not found. Cannot perform client-side search on submit.");
         }
    });


    // --- Initialize Other Header Features ---
    // These functions are assumed to be defined elsewhere (e.g., in this script.js or main.js)
    // and handle behaviors like sticky header and highlighting the current page in the menu.

    // Check if the functions exist before calling them
     if (typeof initializeStickyNavbar === 'function') {
         console.log("[Script] initializeStickyNavbar function found. Initializing sticky navbar.");
         initializeStickyNavbar(headerElement); // Pass the loaded header element
     } else {
         console.warn("[Script] initializeStickyNavbar function not found. Sticky navbar disabled.");
     }

     if (typeof initializeActiveMenuHighlighting === 'function') {
         console.log("[Script] initializeActiveMenuHighlighting function found. Initializing active menu highlighting.");
         initializeActiveMenuHighlighting(headerElement); // Pass the loaded header element
     } else {
         console.warn("[Script] initializeActiveMenuHighlighting function not found. Active menu highlighting disabled.");
     }


    // Set the initialization flag to true
    menuInitialized = true;
    console.log("[Script] Header menu logic initialization process finished.");
}

// --- Functions Assumed to be Defined Elsewhere or Globally ---
// The following functions are called within initializeHeaderMenuLogic or the main execution flow.
// If they are defined in other JS files (like main.js or language.js) and those files
// are loaded correctly before this script, you do NOT need to uncomment and define them here.
// If they are NOT defined elsewhere or are not globally accessible, uncomment and implement them here.

// Example definitions (uncomment and implement if needed):

/**
 * Initializes sticky/shrinking navbar behavior based on scroll position.
 * @param {HTMLElement} navbarElement - The main header element.
 */
// function initializeStickyNavbar(navbarElement) {
//     console.log("[Script] (Global/Assumed) initializeStickyNavbar called.");
//     if (!navbarElement) return;
//     const shrinkThreshold = 50; // Pixels scrolled before shrinking
//     let lastScrollTop = 0; // To detect scroll direction

//     const handleScroll = () => {
//         const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

//         // Add/remove 'shrink' class based on scroll position
//         navbarElement.classList.toggle('shrink', scrollTop > shrinkThreshold);

//         // Optional: Hide/show navbar on scroll down/up
//         // This requires additional CSS for top positioning transition
//         // if (scrollTop > lastScrollTop && scrollTop > navbarElement.offsetHeight) {
//         //     // Scrolling down - hide navbar
//         //     navbarElement.style.top = `-${navbarElement.offsetHeight}px`;
//         // } else {
//         //     // Scrolling up or at the top
//         //     navbarElement.style.top = '0';
//         // }

//         lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
//     };

//     // Add the scroll event listener
//     window.addEventListener('scroll', handleScroll, { passive: true });
//     // Run the handler once on load to set the initial state
//     handleScroll();
// }

/**
 * Highlights the active menu item in the header based on the current page URL.
 * @param {HTMLElement} headerElement - The main header element.
 */
// function initializeActiveMenuHighlighting(headerElement) {
//     console.log("[Script] (Global/Assumed) initializeActiveMenuHighlighting called.");
//     if (!headerElement) return;

//     // Get the current page's path, removing hash and query parameters
//     const currentHref = window.location.href.split('#')[0].split('?')[0];

//     // Select all navigation links within the header (desktop and mobile)
//     const menuLinks = headerElement.querySelectorAll('.nav-link[href], .submenu a[href], .sub-submenu a[href], #mobile-menu-panel a[href]');

//     // Helper function to normalize URLs for comparison (remove .html, trailing slash, etc.)
//     const normalizeUrl = url => {
//         try {
//             const urlObj = new URL(url, window.location.origin);
//             let path = urlObj.pathname;
//             // Remove trailing slash unless it's the root path "/"
//             if (path !== '/' && path.endsWith('/')) {
//                 path = path.slice(0, -1);
//             }
//             // Remove .html extension
//             if (path.endsWith('.html')) {
//                 path = path.slice(0, -'.html'.length);
//             }
//             // Treat "/index" the same as "/"
//             if (path === '/index' || path === '') {
//                 return '/';
//             }
//             return path;
//         } catch (e) {
//             console.warn(`[Script] Invalid URL during normalization: ${url}`, e);
//             return null; // Return null for invalid URLs
//         }
//     };

//     const normalizedCurrentPath = normalizeUrl(currentHref);

//     if (!normalizedCurrentPath) {
//          console.warn("[Script] Could not normalize current page URL. Active menu highlighting skipped.");
//          return; // Cannot proceed if current URL is invalid
//     }
//      console.log(`[Script] Normalized current path: ${normalizedCurrentPath}`);


//     // Remove any existing active classes first
//     menuLinks.forEach(link => {
//         link.classList.remove('active-menu-item');
//         // Also remove active classes from parent toggles
//         const parentToggle = link.closest('.mobile-menu-item, .sub-submenu-container, .main-menu-item')?.querySelector(':scope > button.mobile-submenu-toggle, :scope > button.nav-link');
//         parentToggle?.classList.remove('active-parent-item');
//     });

//      // Collapse all mobile submenus initially
//      headerElement.querySelectorAll('#mobile-menu-panel .mobile-menu-item.open').forEach(item => {
//          item.classList.remove('open');
//          const submenu = item.querySelector(':scope > .mobile-submenu');
//          if (submenu) {
//              submenu.style.maxHeight = '0';
//              submenu.style.overflow = 'hidden';
//          }
//          const toggleButton = item.querySelector(':scope > button.mobile-submenu-toggle');
//          if(toggleButton) toggleButton.setAttribute('aria-expanded', 'false');
//      });


//     let bestMatch = { link: null, specificity: -1 }; // Track the best matching link and its specificity

//     // Find the best matching link
//     menuLinks.forEach(link => {
//         const linkHref = link.getAttribute('href');
//         // Skip invalid or internal-only links
//         if (!linkHref || linkHref === '#' || linkHref.startsWith('javascript:')) {
//             return;
//         }

//         const normalizedLinkPath = normalizeUrl(linkHref);
//         if (!normalizedLinkPath) {
//             return; // Skip if link URL is invalid
//         }

//         let currentSpecificity = -1;

//         try {
//              // Check for exact match of full absolute URL (highest specificity)
//              const absoluteLinkHref = new URL(linkHref, window.location.origin).href.split('#')[0].split('?')[0];
//              if (absoluteLinkHref === currentHref) {
//                  currentSpecificity = 2;
//              }
//         } catch (e) {
//              // Ignore error if URL construction fails
//         }


//         // If not an exact absolute URL match, check for normalized path match
//         if (currentSpecificity < 2 && normalizedLinkPath === normalizedCurrentPath) {
//             // Assign specificity: 1 for root, 0 for others
//             currentSpecificity = normalizedCurrentPath === '/' ? 1 : 0;
//         }

//         // Update best match if current link is a better match
//         if (currentSpecificity > bestMatch.specificity) {
//             bestMatch = { link, specificity: currentSpecificity };
//         } else if (currentSpecificity === bestMatch.specificity && currentSpecificity >= 0) {
//             // If specificity is the same, prefer longer paths (more specific links)
//             const currentBestPath = normalizeUrl(bestMatch.link.getAttribute('href'));
//             if (currentBestPath && normalizedLinkPath.length > currentBestPath.length) {
//                 bestMatch = { link, specificity: currentSpecificity };
//             }
//         }
//     });

//     // Apply active classes if a best match was found
//     if (bestMatch.link) {
//         const activeLink = bestMatch.link;
//         console.log(`[Script] Active menu item found:`, activeLink);
//         activeLink.classList.add('active-menu-item');

//         // Traverse up the DOM tree to add active classes to parent toggles and open mobile submenus
//         let element = activeLink;
//         while (element && element !== headerElement) {
//             // Find the closest parent menu item container (li, div)
//             const parentMenuItem = element.closest('.mobile-menu-item, .sub-submenu-container, .main-menu-item');

//             if (!parentMenuItem) break; // Stop if no more parent menu items found

//             // Find the toggle button directly within this parent menu item
//             const parentToggle = parentMenuItem.querySelector(':scope > button.mobile-submenu-toggle, :scope > button.nav-link');

//             // Add active class to the parent toggle button
//             if (parentToggle) {
//                  parentToggle.classList.add('active-parent-item');
//                  console.log("[Script] Added active-parent-item to:", parentToggle);
//             }


//             // If it's a mobile menu item and not already open, open its submenu
//             if (parentMenuItem.classList.contains('mobile-menu-item') && !parentMenuItem.classList.contains('open')) {
//                 parentMenuItem.classList.add('open'); // Add 'open' class
//                 const submenu = parentMenuItem.querySelector(':scope > .mobile-submenu'); // Find the submenu
//                 if (submenu) {
//                     // Expand the submenu
//                     submenu.style.maxHeight = `${submenu.scrollHeight}px`;
//                     submenu.style.overflow = 'visible'; // Make content visible
//                     console.log(`[Script] Opened mobile submenu for active item:`, submenu);
//                 }
//                 // Update aria-expanded for the mobile toggle button
//                 const mobileToggle = parentMenuItem.querySelector(':scope > button.mobile-submenu-toggle');
//                 if(mobileToggle) mobileToggle.setAttribute('aria-expanded', 'true');
//             }

//             // Move up to the next parent menu item container
//             element = parentMenuItem.parentElement;
//         }
//     } else {
//         console.log("[Script] No active menu item found for the current URL.");
//     }
// }


// /**
//  * Clears previously highlighted search results (if client-side search is implemented).
//  * (Assuming this function is needed and not defined elsewhere globally)
//  */
// function clearSearchHighlights() {
//      console.log("[Script] (Global/Assumed) clearSearchHighlights called.");
//      const mainContent = document.querySelector('main');
//      if (!mainContent) return;

//      // Find all <mark> elements with the specific highlight class
//      const highlights = mainContent.querySelectorAll(`mark.${SEARCH_HIGHLIGHT_CLASS}`);

//      highlights.forEach(mark => {
//          const parent = mark.parentNode;
//          if (parent) {
//              // Move all children of the <mark> element back to its parent
//              while (mark.firstChild) {
//                  parent.insertBefore(mark.firstChild, mark);
//              }
//              // Remove the empty <mark> element
//              parent.removeChild(mark);
//              // Normalize the parent node to merge adjacent text nodes that were split
//              parent.normalize();
//          }
//      });
//      console.log(`[Script] Removed ${highlights.length} search highlights.`);
// }


// /**
//  * Performs a simple client-side search within the <main> element and highlights matches.
//  * (Assuming this function is needed and not defined elsewhere globally)
//  * @param {string} query - The search query string.
//  */
// function performSearch(query) {
//     console.log(`[Script] (Global/Assumed) performSearch called with query: "${query}"`);
//     // Clear previous highlights before performing a new search
//     clearSearchHighlights();

//     // Get the main content area to search within
//     const mainContent = document.querySelector('main');

//     // Validate the query and the search area
//     if (!mainContent || !query || query.trim().length < 2) {
//          console.log("[Script] Search query too short or no main content to search.");
//          return; // Exit if query is invalid or no content area
//     }

//     const queryLower = query.trim().toLowerCase(); // Normalize query
//     let matchCount = 0; // Counter for found matches
//     let firstMatchElement = null; // To store the first found match element for scrolling

//     // Recursive function to traverse the DOM tree and search within text nodes
//     function searchNodes(node) {
//         // Check if the current node is a text node
//         if (node.nodeType === Node.TEXT_NODE) {
//             const text = node.textContent;
//             const textLower = text.toLowerCase();
//             let lastIndex = 0; // Start search from this index in the current text node

//             // Loop to find all occurrences of the query within this text node
//             while (true) {
//                 const matchIndex = textLower.indexOf(queryLower, lastIndex);

//                 // If no more matches are found in this text node, break the loop
//                 if (matchIndex === -1) break;

//                 // Extract the matching text from the original text node
//                 const matchText = text.substring(matchIndex, matchIndex + query.length);

//                 // Create a <mark> element to wrap the matching text
//                 const mark = document.createElement('mark');
//                 mark.className = SEARCH_HIGHLIGHT_CLASS; // Add the highlight class
//                 mark.textContent = matchText; // Set the matching text as the content of <mark>

//                 // Split the current text node into two parts at the match index:
//                 // 1. The part before the match (remains the original 'node')
//                 // 2. The part from the match onwards (returned by splitText, let's call it 'after')
//                 const after = node.splitText(matchIndex);

//                 // Split the 'after' part again to separate the matched text from the text after the match
//                 // The 'after' node now contains the matched text followed by the text after the match.
//                 // We take the substring starting from the query length to get just the text after the match.
//                 after.textContent = after.textContent.substring(query.length);

//                 // Insert the created <mark> element between the part before the match ('node') and the part after the match ('after')
//                 node.parentNode.insertBefore(mark, after);

//                 // Increment the match count
//                 matchCount++;

//                 // If this is the first match found, store the <mark> element
//                 if (!firstMatchElement) {
//                     firstMatchElement = mark;
//                 }

//                 // Continue the search from the beginning of the new 'after' node
//                 // This is important because splitText modifies the node in place and returns the subsequent node.
//                 node = after;
//                 lastIndex = 0; // Always start from the beginning of the new node
//                 // Cần reset walker hoặc tạo walker mới nếu cấu trúc DOM thay đổi đáng kể
//                 // Cách đơn giản hơn là duyệt thủ công như vòng lặp while(true) ở trên
//                 // hoặc sử dụng một kỹ thuật khác nếu DOM thay đổi nhiều.
//                 // Với việc chèn <mark>, cấu trúc DOM thay đổi, nên TreeWalker ban đầu có thể không còn chính xác.
//                 // Vòng lặp while(true) với splitText và insertBefore là cách phổ biến trong trường hợp này.
//                 // Quay lại cách duyệt thủ công đơn giản hơn:
//                 // (Đoạn code này đã được triển khai trong hàm performSearch ở trên)
//             }
//         }
//         // If the node is an element node (and not a script, style, or mark tag),
//         // recursively call searchNodes for its child nodes.
//         else if (node.nodeType === Node.ELEMENT_NODE &&
//                  node.nodeName !== 'SCRIPT' &&
//                  node.nodeName !== 'STYLE' &&
//                  node.nodeName !== 'MARK') // Avoid searching inside scripts, styles, or already highlighted marks
//         {
//             // Iterate over a static copy of childNodes because searchNodes might modify the child list
//             Array.from(node.childNodes).forEach(searchNodes);
//         }
//     }

//     // Start the recursive search from the main content element
//     searchNodes(mainContent);

//     console.log(`[Script] Search completed. Found ${matchCount} matches.`);

//     // Cuộn the first found match into view if any matches were found
//     if (firstMatchElement) {
//         console.log("[Script] Scrolling to the first search result.");
//         firstMatchElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
//     } else {
//          console.log("[Script] No search results found.");
//          // Optional: Display a message to the user indicating no results
//     }
// }

// /**
//  * Updates the current year displayed in the footer element.
//  * (Assuming this function is needed and not defined elsewhere globally)
//  */
// function updateFooterYear() {
//     console.log("[Script] (Global/Assumed) updateFooterYear called.");
//     // Find the element intended to display the current year in the footer
//     const yearElement = document.getElementById(FOOTER_YEAR_ID);

//     // If the element is found, update its text content to the current year
//     if (yearElement) {
//         yearElement.textContent = new Date().getFullYear();
//         console.log("[Script] Footer year updated successfully.");
//     } else {
//         console.warn(`[Script] Footer year element (#${FOOTER_YEAR_ID}) not found.`);
//     }
// }

// /**
//  * Initializes the language switching functionality.
//  * This function is expected to be defined in language.js.
//  * (Assuming this function exists and is attached to the window or called globally)
//  */
// // window.initializeLanguage = function() {
// //     console.log("[Script] (Global/Assumed) initializeLanguage called.");
// //     // Implementation details from your language.js file
// //     // This function should typically:
// //     // 1. Load translation data.
// //     // 2. Detect user's preferred language (e.g., from localStorage or browser settings).
// //     // 3. Apply translations to the page content.
// //     // 4. Set window.languageInitialized = true;
// //     // 5. Potentially call loadInternalNews() if news is language-dependent.
// //     // 6. Potentially attach event listeners to language switcher buttons (though script.js also tries this).
// // };

// /**
//  * Handles the event when a language button is clicked.
//  * This function is expected to be defined in language.js.
//  * (Assuming this function exists and is attached to the window or called globally)
//  * @param {Event} event - The click event object.
//  */
// // window.handleLanguageChange = function(event) {
// //     console.log("[Script] (Global/Assumed) handleLanguageChange called.");
// //     // Implementation details from your language.js file
// //     // This function should typically:
// //     // 1. Get the selected language from the button's data attribute (e.g., event.target.dataset.lang).
// //     // 2. Save the preferred language to localStorage.
// //     // 3. Apply translations for the new language to the page content.
// //     // 4. Update the displayed language/flag in the header.
// //     // 5. Potentially reload language-dependent content like news.
// // };

// /**
//  * Attaches event listeners to language switcher buttons.
//  * This function might be defined in language.js or script.js.
//  * (Assuming this function exists and is attached to the window or called globally)
//  */
// // window.attachLanguageSwitcherEvents = function() {
// //      console.log("[Script] (Global/Assumed) attachLanguageSwitcherEvents called.");
// //      // Implementation details...
// //      // This function should find the language buttons and add click listeners
// //      // that call handleLanguageChange.
// // };


// --- Main Execution Flow ---
// This block runs automatically when the script is loaded and the DOM is ready.
document.addEventListener('DOMContentLoaded', () => {
    console.log("[Script] DOMContentLoaded fired. Starting main execution flow...");

    // Start loading header and footer components asynchronously
    // Use loadComponent function to fetch and insert HTML
    const headerPromise = loadComponent(HEADER_PLACEHOLDER_ID, HEADER_COMPONENT_URL);
    const footerPromise = loadComponent(FOOTER_PLACEHOLDER_ID, FOOTER_COMPONENT_URL);

    // Use Promise.all to wait for both component loading Promises to settle
    // The .then() block will execute once both promises are done, regardless of success or failure
    Promise.all([headerPromise, footerPromise]).then(([headerPlaceholder, footerPlaceholder]) => {
        headerFooterLoadAttempted = true; // Mark that we have attempted to load components

        // Check if the components were successfully loaded (placeholder is not null, meaning element was found and fetch succeeded)
        const headerLoaded = !!headerPlaceholder;
        const footerLoaded = !!footerPlaceholder;
        console.log(`[Script] Promise.all finished component loading. Header loaded: ${headerLoaded}, Footer loaded: ${footerLoaded}.`);

        // If header was loaded successfully, initialize its specific logic (menu, search, etc.)
        if (headerLoaded) {
             console.log("[Script] Header component successfully loaded. Initializing header menu logic...");
             // Call the function to initialize header interactions.
             // This function is defined within this script.js file.
             initializeHeaderMenuLogic();
        } else {
             console.error("[Script] Header component failed to load. Header menu logic skipped.");
        }

        // If footer was loaded successfully, update the copyright year
        if (footerLoaded) {
             console.log("[Script] Footer component successfully loaded. Updating footer year...");
             // Check if the updateFooterYear function exists before calling it.
             // This function is assumed to be defined elsewhere (e.g., in this script.js or main.js).
             if (typeof updateFooterYear === 'function') {
                 updateFooterYear();
             } else {
                 console.warn("[Script] updateFooterYear function not found. Footer year update skipped.");
             }
        } else {
             console.error("[Script] Footer component failed to load. Footer year update skipped.");
        }


        // Initialize the language system AFTER components are loaded.
        // Use a small delay to give language.js time to execute and define its functions.
        setTimeout(() => {
            console.log("[Script] Checking for language initialization functions after component load delay...");
            // Check if the main language initialization function exists (assumed from language.js)
            if (typeof window.initializeLanguage === 'function') {
                console.log("[Script] initializeLanguage function found (from language.js).");
                // Check if the language system has already been initialized (to avoid re-initializing)
                // The window.languageInitialized flag is assumed to be set by language.js
                if (!window.languageInitialized) {
                     console.log("[Script] Language system not yet initialized. Calling initializeLanguage...");
                     window.initializeLanguage(); // Call the main language initialization function
                     // After initializeLanguage runs, it should handle applying translations and potentially loading news.
                     // Also, re-attach listeners for language buttons in the loaded header.
                     window.attachLanguageButtonListeners?.(); // Use optional chaining in case the function is not defined
                } else {
                     console.log("[Script] Language already initialized. Re-applying translations and listeners.");
                     // If already initialized, get the current language and re-apply translations.
                     const currentLang = localStorage.getItem('preferredLanguage') || 'vi';
                     // Re-apply translations if the function exists
                     if (typeof window.applyTranslations === 'function') {
                         console.log(`[Script] Re-applying translations for language: ${currentLang}`);
                         window.applyTranslations(currentLang);
                     } else {
                         console.warn("[Script] applyTranslations function not found. Cannot re-apply translations.");
                     }
                     // Reload language-dependent content like news if the container exists
                     if (document.getElementById(NEWS_CONTAINER_ID)) {
                         console.log("[Script] News container found, reloading news after language check.");
                         // The loadInternalNews function needs to be defined elsewhere (e.g., in this script.js or main.js)
                         loadInternalNews();
                     } else {
                         console.log("[Script] News container not found.");
                     }
                     // Gắn lại listeners cho các nút ngôn ngữ trong header đã load
                     window.attachLanguageButtonListeners?.();
                }
            } else {
                console.error("[Script] initializeLanguage function not found after timeout. Language features disabled.");
                // Fallback: If language.js failed to load, try to load news with default language if the container exists.
                if (document.getElementById(NEWS_CONTAINER_ID)) {
                    console.warn("[Script] Language system failed, attempting to load news with default language (VI).");
                     // Define a temporary translations object if the global one doesn't exist
                     if (typeof window.translations === 'undefined') {
                         window.translations = { vi: { read_more: 'Đọc thêm →', news_title_na: 'Tiêu đề không có sẵn', news_image_alt: 'Hình ảnh tin tức', no_news: 'Chưa có tin tức nào.', news_load_error: 'Không thể tải tin tức.', loading_news: 'Đang tải tin tức...' } };
                         console.log("[Script] Using temporary default translations for news.");
                     } else {
                         console.log("[Script] Existing translations object found, using it for news.");
                     }
                    loadInternalNews(); // Call the function to load news
                } else {
                    console.log("[Script] News container not found, skipping news load.");
                }
            }

            // Attach language switcher events (if the function exists in language.js)
            if (typeof window.attachLanguageSwitcherEvents === 'function') {
                console.log("[Script] Attaching language switcher events from language.js...");
                window.attachLanguageSwitcherEvents();
            } else {
                console.warn("[Script] window.attachLanguageSwitcherEvents function not found from language.js.");
            }
        }, 200); // Delay in milliseconds


    }).catch(error => {
        // Catch any uncaught errors from the Promises in Promise.all
        console.error("[Script] Uncaught error in Promise.all during component loading:", error);
         headerFooterLoadAttempted = true; // Mark that we have attempted to load
         // Display generic error messages in placeholders if they are still empty
         const headerPlaceholder = document.getElementById(HEADER_PLACEHOLDER_ID);
         if (headerPlaceholder && headerPlaceholder.innerHTML.trim() === '') { // Check if innerHTML is empty or just whitespace
             headerPlaceholder.innerHTML = `<p class="text-red-500 text-center p-4">Không thể tải Header do lỗi không xác định.</p>`;
         }
         const footerPlaceholder = document.getElementById(FOOTER_PLACEHOLDER_ID);
         if (footerPlaceholder && footerPlaceholder.innerHTML.trim() === '') { // Check if innerHTML is empty or just whitespace
              footerPlaceholder.innerHTML = `<p class="text-red-500 text-center p-4">Không thể tải Footer do lỗi không xác định.</p>`;
         }
    });

    // --- Page-Specific Initializations ---
    // These initializations should run after DOMContentLoaded but may not depend on header/footer being fully loaded.
    const bodyId = document.body.id; // Get the ID of the body element

    // Initialize RSS feed loading if the container element exists
    if (document.getElementById('vnexpress-rss-feed')) {
        console.log("[Script] RSS container found. Assuming rss-loader.js handles this initialization.");
        // The rss-loader.js script is expected to either run automatically or have its own initialization function.
    }

    // Initialize the Placement Test logic if the body ID matches and the function exists
    if (bodyId === 'page-placement' && typeof initializePlacementTest === 'function') {
        console.log("[Script] Initializing placement test for page-placement.");
        // The initializePlacementTest function is expected to be defined in a separate JS file for this specific page.
        initializePlacementTest();
    }

    console.log("[Script] Initial DOMContentLoaded execution flow finished.");
});

// --- Definition of Global Functions (if they are not defined elsewhere) ---
// The following functions are called within the script.
// If they are defined in other JS files (like main.js or language.js) and those files
// are loaded correctly before this script, you do NOT need to uncomment and define them here.
// If they are NOT defined elsewhere or are not globally accessible, uncomment and implement them here.

// Example definitions (uncomment and implement if needed):

/**
 * Initializes sticky/shrinking navbar behavior based on scroll position.
 * @param {HTMLElement} navbarElement - The main header element.
 */
// function initializeStickyNavbar(navbarElement) {
//     console.log("[Script] (Global/Assumed) initializeStickyNavbar called.");
//     if (!navbarElement) return;
//     const shrinkThreshold = 50; // Pixels scrolled before shrinking
//     let lastScrollTop = 0; // To detect scroll direction

//     const handleScroll = () => {
//         const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

//         // Add/remove 'shrink' class based on scroll position
//         navbarElement.classList.toggle('shrink', scrollTop > shrinkThreshold);

//         // Optional: Hide/show navbar on scroll down/up
//         // This requires additional CSS for top positioning transition
//         // if (scrollTop > lastScrollTop && scrollTop > navbarElement.offsetHeight) {
//         //     // Scrolling down - hide navbar
//         //     navbarElement.style.top = `-${navbarElement.offsetHeight}px`;
//         // } else {
//         //     // Scrolling up or at the top
//         //     navbarElement.style.top = '0';
//         // }

//         lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
//     };

//     // Add the scroll event listener
//     window.addEventListener('scroll', handleScroll, { passive: true });
//     // Run the handler once on load to set the initial state
//     handleScroll();
// }

/**
 * Highlights the active menu item in the header based on the current page URL.
 * @param {HTMLElement} headerElement - The main header element.
 */
// function initializeActiveMenuHighlighting(headerElement) {
//     console.log("[Script] (Global/Assumed) initializeActiveMenuHighlighting called.");
//     if (!headerElement) return;

//     // Get the current page's path, removing hash and query parameters
//     const currentHref = window.location.href.split('#')[0].split('?')[0];

//     // Select all navigation links within the header (desktop and mobile)
//     const menuLinks = headerElement.querySelectorAll('.nav-link[href], .submenu a[href], .sub-submenu a[href], #mobile-menu-panel a[href]');

//     // Helper function to normalize URLs for comparison (remove .html, trailing slash, etc.)
//     const normalizeUrl = url => {
//         try {
//             const urlObj = new URL(url, window.location.origin);
//             let path = urlObj.pathname;
//             // Remove trailing slash unless it's the root path "/"
//             if (path !== '/' && path.endsWith('/')) {
//                 path = path.slice(0, -1);
//             }
//             // Remove .html extension
//             if (path.endsWith('.html')) {
//                 path = path.slice(0, -'.html'.length);
//             }
//             // Treat "/index" the same as "/"
//             if (path === '/index' || path === '') {
//                 return '/';
//             }
//             return path;
//         } catch (e) {
//             console.warn(`[Script] Invalid URL during normalization: ${url}`, e);
//             return null; // Return null for invalid URLs
//         }
//     };

//     const normalizedCurrentPath = normalizeUrl(currentHref);

//     if (!normalizedCurrentPath) {
//          console.warn("[Script] Could not normalize current page URL. Active menu highlighting skipped.");
//          return; // Cannot proceed if current URL is invalid
//     }
//      console.log(`[Script] Normalized current path: ${normalizedCurrentPath}`);


//     // Remove any existing active classes first
//     menuLinks.forEach(link => {
//         link.classList.remove('active-menu-item');
//         // Also remove active classes from parent toggles
//         const parentToggle = link.closest('.mobile-menu-item, .sub-submenu-container, .main-menu-item')?.querySelector(':scope > button.mobile-submenu-toggle, :scope > button.nav-link');
//         parentToggle?.classList.remove('active-parent-item');
//     });

//      // Collapse all mobile submenus initially
//      headerElement.querySelectorAll('#mobile-menu-panel .mobile-menu-item.open').forEach(item => {
//          item.classList.remove('open');
//          const submenu = item.querySelector(':scope > .mobile-submenu');
//          if (submenu) {
//              submenu.style.maxHeight = '0';
//              submenu.style.overflow = 'hidden';
//          }
//          const toggleButton = item.querySelector(':scope > button.mobile-submenu-toggle');
//          if(toggleButton) toggleButton.setAttribute('aria-expanded', 'false');
//      });


//     let bestMatch = { link: null, specificity: -1 }; // Track the best matching link and its specificity

//     // Find the best matching link
//     menuLinks.forEach(link => {
//         const linkHref = link.getAttribute('href');
//         // Skip invalid or internal-only links
//         if (!linkHref || linkHref === '#' || linkHref.startsWith('javascript:')) {
//             return;
//         }

//         const normalizedLinkPath = normalizeUrl(linkHref);
//         if (!normalizedLinkPath) {
//             return; // Skip if link URL is invalid
//         }

//         let currentSpecificity = -1;

//         try {
//              // Check for exact match of full absolute URL (highest specificity)
//              const absoluteLinkHref = new URL(linkHref, window.location.origin).href.split('#')[0].split('?')[0];
//              if (absoluteLinkHref === currentHref) {
//                  currentSpecificity = 2;
//              }
//         } catch (e) {
//              // Ignore error if URL construction fails
//         }


//         // If not an exact absolute URL match, check for normalized path match
//         if (currentSpecificity < 2 && normalizedLinkPath === normalizedCurrentPath) {
//             // Assign specificity: 1 for root, 0 for others
//             currentSpecificity = normalizedCurrentPath === '/' ? 1 : 0;
//         }

//         // Update best match if current link is a better match
//         if (currentSpecificity > bestMatch.specificity) {
//             bestMatch = { link, specificity: currentSpecificity };
//         } else if (currentSpecificity === bestMatch.specificity && currentSpecificity >= 0) {
//             // If specificity is the same, prefer longer paths (more specific links)
//             const currentBestPath = normalizeUrl(bestMatch.link.getAttribute('href'));
//             if (currentBestPath && normalizedLinkPath.length > currentBestPath.length) {
//                 bestMatch = { link, specificity: currentSpecificity };
//             }
//         }
//     });

//     // Apply active classes if a best match was found
//     if (bestMatch.link) {
//         const activeLink = bestMatch.link;
//         console.log(`[Script] Active menu item found:`, activeLink);
//         activeLink.classList.add('active-menu-item');

//         // Traverse up the DOM tree to add active classes to parent toggles and open mobile submenus
//         let element = activeLink;
//         while (element && element !== headerElement) {
//             // Find the closest parent menu item container (li, div)
//             const parentMenuItem = element.closest('.mobile-menu-item, .sub-submenu-container, .main-menu-item');

//             if (!parentMenuItem) break; // Stop if no more parent menu items found

//             // Find the toggle button directly within this parent menu item
//             const parentToggle = parentMenuItem.querySelector(':scope > button.mobile-submenu-toggle, :scope > button.nav-link');

//             // Add active class to the parent toggle button
//             if (parentToggle) {
//                  parentToggle.classList.add('active-parent-item');
//                  console.log("[Script] Added active-parent-item to:", parentToggle);
//             }


//             // If it's a mobile menu item and not already open, open its submenu
//             if (parentMenuItem.classList.contains('mobile-menu-item') && !parentMenuItem.classList.contains('open')) {
//                 parentMenuItem.classList.add('open'); // Add 'open' class
//                 const submenu = parentMenuItem.querySelector(':scope > .mobile-submenu'); // Find the submenu
//                 if (submenu) {
//                     // Expand the submenu
//                     submenu.style.maxHeight = `${submenu.scrollHeight}px`;
//                     submenu.style.overflow = 'visible'; // Make content visible
//                     console.log(`[Script] Opened mobile submenu for active item:`, submenu);
//                 }
//                 // Update aria-expanded for the mobile toggle button
//                 const mobileToggle = parentMenuItem.querySelector(':scope > button.mobile-submenu-toggle');
//                 if(mobileToggle) mobileToggle.setAttribute('aria-expanded', 'true');
//             }

//             // Move up to the next parent menu item container
//             element = parentMenuItem.parentElement;
//         }
//     } else {
//         console.log("[Script] No active menu item found for the current URL.");
//     }
// }


// /**
//  * Clears previously highlighted search results (if client-side search is implemented).
//  * (Assuming this function is needed and not defined elsewhere globally)
//  */
// function clearSearchHighlights() {
//      console.log("[Script] (Global/Assumed) clearSearchHighlights called.");
//      const mainContent = document.querySelector('main');
//      if (!mainContent) return;

//      // Find all <mark> elements with the specific highlight class
//      const highlights = mainContent.querySelectorAll(`mark.${SEARCH_HIGHLIGHT_CLASS}`);

//      highlights.forEach(mark => {
//          const parent = mark.parentNode;
//          if (parent) {
//              // Move all children of the <mark> element back to its parent
//              while (mark.firstChild) {
//                  parent.insertBefore(mark.firstChild, mark);
//              }
//              // Remove the empty <mark> element
//              parent.removeChild(mark);
//              // Normalize the parent node to merge adjacent text nodes that were split
//              parent.normalize();
//          }
//      });
//      console.log(`[Script] Removed ${highlights.length} search highlights.`);
// }


// /**
//  * Performs a simple client-side search within the <main> element and highlights matches.
//  * (Assuming this function is needed and not defined elsewhere globally)
//  * @param {string} query - The search query string.
//  */
// function performSearch(query) {
//     console.log(`[Script] (Global/Assumed) performSearch called with query: "${query}"`);
//     // Clear previous highlights before performing a new search
//     clearSearchHighlights();

//     // Get the main content area to search within
//     const mainContent = document.querySelector('main');

//     // Validate the query and the search area
//     if (!mainContent || !query || query.trim().length < 2) {
//          console.log("[Script] Search query too short or no main content to search.");
//          return; // Exit if query is invalid or no content area
//     }

//     const queryLower = query.trim().toLowerCase(); // Normalize query
//     let matchCount = 0; // Counter for found matches
//     let firstMatchElement = null; // To store the first found match element for scrolling

//     // Recursive function to traverse the DOM tree and search within text nodes
//     function searchNodes(node) {
//         // Check if the current node is a text node
//         if (node.nodeType === Node.TEXT_NODE) {
//             const text = node.textContent;
//             const textLower = text.toLowerCase();
//             let lastIndex = 0; // Start search from this index in the current text node

//             // Loop to find all occurrences of the query within this text node
//             while (true) {
//                 const matchIndex = textLower.indexOf(queryLower, lastIndex);

//                 // If no more matches are found in this text node, break the loop
//                 if (matchIndex === -1) break;

//                 // Extract the matching text from the original text node
//                 const matchText = text.substring(matchIndex, matchIndex + query.length);

//                 // Create a <mark> element to wrap the matching text
//                 const mark = document.createElement('mark');
//                 mark.className = SEARCH_HIGHLIGHT_CLASS; // Add the highlight class
//                 mark.textContent = matchText; // Set the matching text as the content of <mark>

//                 // Split the current text node into two parts at the match index:
//                 // 1. The part before the match (remains the original 'node')
//                 // 2. The part from the match onwards (returned by splitText, let's call it 'after')
//                 const after = node.splitText(matchIndex);

//                 // Split the 'after' part again to separate the matched text from the text after the match
//                 // The 'after' node now contains the matched text followed by the text after the match.
//                 // We take the substring starting from the query length to get just the text after the match.
//                 after.textContent = after.textContent.substring(query.length);

//                 // Insert the created <mark> element between the part before the match ('node') and the part after the match ('after')
//                 node.parentNode.insertBefore(mark, after);

//                 // Increment the match count
//                 matchCount++;

//                 // If this is the first match found, store the <mark> element
//                 if (!firstMatchElement) {
//                     firstMatchElement = mark;
//                 }

//                 // Continue the search from the beginning of the new 'after' node
//                 // This is important because splitText modifies the node in place and returns the subsequent node.
//                 node = after;
//                 lastIndex = 0; // Always start from the beginning of the new node
//                 // Cần reset walker hoặc tạo walker mới nếu cấu trúc DOM thay đổi đáng kể
//                 // Cách đơn giản hơn là duyệt thủ công như vòng lặp while(true) ở trên
//                 // hoặc sử dụng một kỹ thuật khác nếu DOM thay đổi nhiều.
//                 // Với việc chèn <mark>, cấu trúc DOM thay đổi, nên TreeWalker ban đầu có thể không còn chính xác.
//                 // Vòng lặp while(true) với splitText và insertBefore là cách phổ biến trong trường hợp này.
//                 // Quay lại cách duyệt thủ công đơn giản hơn:
//                 // (Đoạn code này đã được triển khai trong hàm performSearch ở trên)
//             }
//         }
//         // If the node is an element node (and not a script, style, or mark tag),
//         // recursively call searchNodes for its child nodes.
//         else if (node.nodeType === Node.ELEMENT_NODE &&
//                  node.nodeName !== 'SCRIPT' &&
//                  node.nodeName !== 'STYLE' &&
//                  node.nodeName !== 'MARK') // Avoid searching inside scripts, styles, or already highlighted marks
//         {
//             // Iterate over a static copy of childNodes because searchNodes might modify the child list
//             Array.from(node.childNodes).forEach(searchNodes);
//         }
//     }

//     // Start the recursive search from the main content element
//     searchNodes(mainContent);

//     console.log(`[Script] Search completed. Found ${matchCount} matches.`);

//     // Cuộn the first found match into view if any matches were found
//     if (firstMatchElement) {
//         console.log("[Script] Scrolling to the first search result.");
//         firstMatchElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
//     } else {
//          console.log("[Script] No search results found.");
//          // Optional: Display a message to the user indicating no results
//     }
// }

// /**
//  * Updates the current year displayed in the footer element.
//  * (Assuming this function is needed and not defined elsewhere globally)
//  */
// function updateFooterYear() {
//     console.log("[Script] (Global/Assumed) updateFooterYear called.");
//     // Find the element intended to display the current year in the footer
//     const yearElement = document.getElementById(FOOTER_YEAR_ID);

//     // If the element is found, update its text content to the current year
//     if (yearElement) {
//         yearElement.textContent = new Date().getFullYear();
//         console.log("[Script] Footer year updated successfully.");
//     } else {
//         console.warn(`[Script] Footer year element (#${FOOTER_YEAR_ID}) not found.`);
//     }
// }

// /**
//  * Initializes the language switching functionality.
//  * This function is expected to be defined in language.js.
//  * (Assuming this function exists and is attached to the window or called globally)
//  */
// // window.initializeLanguage = function() {
// //     console.log("[Script] (Global/Assumed) initializeLanguage called.");
// //     // Implementation details from your language.js file
// //     // This function should typically:
// //     // 1. Load translation data.
// //     // 2. Detect user's preferred language (e.g., from localStorage or browser settings).
// //     // 3. Apply translations to the page content.
// //     // 4. Set window.languageInitialized = true;
// //     // 5. Potentially call loadInternalNews() if news is language-dependent.
// //     // 6. Potentially attach event listeners to language switcher buttons (though script.js also tries this).
// // };

// /**
//  * Handles the event when a language button is clicked.
//  * This function is expected to be defined in language.js.
//  * (Assuming this function exists and is attached to the window or called globally)
//  * @param {Event} event - The click event object.
//  */
// // window.handleLanguageChange = function(event) {
// //     console.log("[Script] (Global/Assumed) handleLanguageChange called.");
// //     // Implementation details from your language.js file
// //     // This function should typically:
// //     // 1. Get the selected language from the button's data attribute (e.g., event.target.dataset.lang).
// //     // 2. Save the preferred language to localStorage.
// //     // 3. Apply translations for the new language to the page content.
// //     // 4. Update the displayed language/flag in the header.
// //     // 5. Potentially reload language-dependent content like news.
// // };

// /**
//  * Attaches event listeners to language switcher buttons.
//  * This function might be defined in language.js or script.js.
//  * (Assuming this function exists and is attached to the window or called globally)
//  */
// // window.attachLanguageSwitcherEvents = function() {
// //      console.log("[Script] (Global/Assumed) attachLanguageSwitcherEvents called.");
// //      // Implementation details...
// //      // This function should find the language buttons and add click listeners
// //      // that call handleLanguageChange.
// // };


// --- Main Execution Flow ---
// This block runs automatically when the script is loaded and the DOM is ready.
document.addEventListener('DOMContentLoaded', () => {
    console.log("[Script] DOMContentLoaded fired. Starting main execution flow...");

    // Start loading header and footer components asynchronously
    // Use loadComponent function to fetch and insert HTML
    const headerPromise = loadComponent(HEADER_PLACEHOLDER_ID, HEADER_COMPONENT_URL);
    const footerPromise = loadComponent(FOOTER_PLACEHOLDER_ID, FOOTER_COMPONENT_URL);

    // Use Promise.all to wait for both component loading Promises to settle
    // The .then() block will execute once both are done, regardless of success or failure
    Promise.all([headerPromise, footerPromise]).then(([headerPlaceholder, footerPlaceholder]) => {
        headerFooterLoadAttempted = true; // Mark that we have attempted to load components

        // Check if the components were successfully loaded (placeholder is not null, meaning element was found and fetch succeeded)
        const headerLoaded = !!headerPlaceholder;
        const footerLoaded = !!footerPlaceholder;
        console.log(`[Script] Promise.all finished component loading. Header loaded: ${headerLoaded}, Footer loaded: ${footerLoaded}.`);

        // If header was loaded successfully, initialize its specific logic (menu, search, etc.)
        if (headerLoaded) {
             console.log("[Script] Header component successfully loaded. Initializing header menu logic...");
             // Call the function to initialize header interactions.
             // This function is defined within this script.js file.
             initializeHeaderMenuLogic();
        } else {
             console.error("[Script] Header component failed to load. Header menu logic skipped.");
        }

        // If footer was loaded successfully, update the copyright year
        if (footerLoaded) {
             console.log("[Script] Footer component successfully loaded. Updating footer year...");
             // Check if the updateFooterYear function exists before calling it.
             // This function is assumed to be defined elsewhere (e.g., in this script.js or main.js).
             if (typeof updateFooterYear === 'function') {
                 updateFooterYear();
             } else {
                 console.warn("[Script] updateFooterYear function not found. Footer year update skipped.");
             }
        } else {
             console.error("[Script] Footer component failed to load. Footer year update skipped.");
        }


        // Initialize the language system AFTER components are loaded.
        // Use a small delay to give language.js time to execute and define its functions.
        setTimeout(() => {
            console.log("[Script] Checking for language initialization functions after component load delay...");
            // Check if the main language initialization function exists (assumed from language.js)
            if (typeof window.initializeLanguage === 'function') {
                console.log("[Script] initializeLanguage function found (from language.js).");
                // Check if the language system has already been initialized (to avoid re-initializing)
                // The window.languageInitialized flag is assumed to be set by language.js
                if (!window.languageInitialized) {
                     console.log("[Script] Language system not yet initialized. Calling initializeLanguage...");
                     window.initializeLanguage(); // Call the main language initialization function
                     // After initializeLanguage runs, it should handle applying translations and potentially loading news.
                     // Also, re-attach listeners for language buttons in the loaded header.
                     window.attachLanguageButtonListeners?.(); // Use optional chaining in case the function is not defined
                } else {
                     console.log("[Script] Language already initialized. Re-applying translations and listeners.");
                     // If already initialized, get the current language and re-apply translations.
                     const currentLang = localStorage.getItem('preferredLanguage') || 'vi';
                     // Re-apply translations if the function exists
                     if (typeof window.applyTranslations === 'function') {
                         console.log(`[Script] Re-applying translations for language: ${currentLang}`);
                         window.applyTranslations(currentLang);
                     } else {
                         console.warn("[Script] applyTranslations function not found. Cannot re-apply translations.");
                     }
                     // Reload language-dependent content like news if the container exists
                     if (document.getElementById(NEWS_CONTAINER_ID)) {
                         console.log("[Script] News container found, reloading news after language check.");
                         // The loadInternalNews function needs to be defined elsewhere (e.g., in this script.js or main.js)
                         loadInternalNews();
                     } else {
                         console.log("[Script] News container not found.");
                     }
                     // Gắn lại listeners cho các nút ngôn ngữ trong header đã load
                     window.attachLanguageButtonListeners?.();
                }
            } else {
                console.error("[Script] initializeLanguage function not found after timeout. Language features disabled.");
                // Fallback: If language.js failed to load, try to load news with default language if the container exists.
                if (document.getElementById(NEWS_CONTAINER_ID)) {
                    console.warn("[Script] Language system failed, attempting to load news with default language (VI).");
                     // Define a temporary translations object if the global one doesn't exist
                     if (typeof window.translations === 'undefined') {
                         window.translations = { vi: { read_more: 'Đọc thêm →', news_title_na: 'Tiêu đề không có sẵn', news_image_alt: 'Hình ảnh tin tức', no_news: 'Chưa có tin tức nào.', news_load_error: 'Không thể tải tin tức.', loading_news: 'Đang tải tin tức...' } };
                         console.log("[Script] Using temporary default translations for news.");
                     } else {
                         console.log("[Script] Existing translations object found, using it for news.");
                     }
                    loadInternalNews(); // Call the function to load news
                } else {
                    console.log("[Script] News container not found, skipping news load.");
                }
            }

            // Attach language switcher events (if the function exists in language.js)
            if (typeof window.attachLanguageSwitcherEvents === 'function') {
                console.log("[Script] Attaching language switcher events from language.js...");
                window.attachLanguageSwitcherEvents();
            } else {
                console.warn("[Script] window.attachLanguageSwitcherEvents function not found from language.js.");
            }
        }, 200); // Delay in milliseconds


    }).catch(error => {
        // Catch any uncaught errors from the Promises in Promise.all
        console.error("[Script] Uncaught error in Promise.all during component loading:", error);
         headerFooterLoadAttempted = true; // Mark that we have attempted to load
         // Display generic error messages in placeholders if they are still empty
         const headerPlaceholder = document.getElementById(HEADER_PLACEHOLDER_ID);
         if (headerPlaceholder && headerPlaceholder.innerHTML.trim() === '') { // Check if innerHTML is empty or just whitespace
             headerPlaceholder.innerHTML = `<p class="text-red-500 text-center p-4">Không thể tải Header do lỗi không xác định.</p>`;
         }
         const footerPlaceholder = document.getElementById(FOOTER_PLACEHOLDER_ID);
         if (footerPlaceholder && footerPlaceholder.innerHTML.trim() === '') { // Check if innerHTML is empty or just whitespace
              footerPlaceholder.innerHTML = `<p class="text-red-500 text-center p-4">Không thể tải Footer do lỗi không xác định.</p>`;
         }
    });

    // --- Page-Specific Initializations ---
    // These initializations should run after DOMContentLoaded but may not depend on header/footer being fully loaded.
    const bodyId = document.body.id; // Get the ID of the body element

    // Initialize RSS feed loading if the container element exists
    if (document.getElementById('vnexpress-rss-feed')) {
        console.log("[Script] RSS container found. Assuming rss-loader.js handles this initialization.");
        // The rss-loader.js script is expected to either run automatically or have its own initialization function.
    }

    // Initialize the Placement Test logic if the body ID matches and the function exists
    if (bodyId === 'page-placement' && typeof initializePlacementTest === 'function') {
        console.log("[Script] Initializing placement test for page-placement.");
        // The initializePlacementTest function is expected to be defined in a separate JS file for this specific page.
        initializePlacementTest();
    }

    console.log("[Script] Initial DOMContentLoaded execution flow finished.");
});

// --- Definition of Global Functions (if they are not defined elsewhere) ---
// The following functions are called within the script.
// If they are defined in other JS files (like main.js or language.js) and those files
// are loaded correctly before this script, you do NOT need to uncomment and define them here.
// If they are NOT defined elsewhere or are not globally accessible, uncomment and implement them here.

// Example definitions (uncomment and implement if needed):

/**
 * Initializes sticky/shrinking navbar behavior based on scroll position.
 * @param {HTMLElement} navbarElement - The main header element.
 */
// function initializeStickyNavbar(navbarElement) {
//     console.log("[Script] (Global/Assumed) initializeStickyNavbar called.");
//     if (!navbarElement) return;
//     const shrinkThreshold = 50; // Pixels scrolled before shrinking
//     let lastScrollTop = 0; // To detect scroll direction

//     const handleScroll = () => {
//         const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

//         // Add/remove 'shrink' class based on scroll position
//         navbarElement.classList.toggle('shrink', scrollTop > shrinkThreshold);

//         // Optional: Hide/show navbar on scroll down/up
//         // This requires additional CSS for top positioning transition
//         // if (scrollTop > lastScrollTop && scrollTop > navbarElement.offsetHeight) {
//         //     // Scrolling down - hide navbar
//         //     navbarElement.style.top = `-${navbarElement.offsetHeight}px`;
//         // } else {
//         //     // Scrolling up or at the top
//         //     navbarElement.style.top = '0';
//         // }

//         lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
//     };

//     // Add the scroll event listener
//     window.addEventListener('scroll', handleScroll, { passive: true });
//     // Run the handler once on load to set the initial state
//     handleScroll();
// }

/**
 * Highlights the active menu item in the header based on the current page URL.
 * @param {HTMLElement} headerElement - The main header element.
 */
// function initializeActiveMenuHighlighting(headerElement) {
//     console.log("[Script] (Global/Assumed) initializeActiveMenuHighlighting called.");
//     if (!headerElement) return;

//     // Get the current page's path, removing hash and query parameters
//     const currentHref = window.location.href.split('#')[0].split('?')[0];

//     // Select all navigation links within the header (desktop and mobile)
//     const menuLinks = headerElement.querySelectorAll('.nav-link[href], .submenu a[href], .sub-submenu a[href], #mobile-menu-panel a[href]');

//     // Helper function to normalize URLs for comparison (remove .html, trailing slash, etc.)
//     const normalizeUrl = url => {
//         try {
//             const urlObj = new URL(url, window.location.origin);
//             let path = urlObj.pathname;
//             // Remove trailing slash unless it's the root path "/"
//             if (path !== '/' && path.endsWith('/')) {
//                 path = path.slice(0, -1);
//             }
//             // Remove .html extension
//             if (path.endsWith('.html')) {
//                 path = path.slice(0, -'.html'.length);
//             }
//             // Treat "/index" the same as "/"
//             if (path === '/index' || path === '') {
//                 return '/';
//             }
//             return path;
//         } catch (e) {
//             console.warn(`[Script] Invalid URL during normalization: ${url}`, e);
//             return null; // Return null for invalid URLs
//         }
//     };

//     const normalizedCurrentPath = normalizeUrl(currentHref);

//     if (!normalizedCurrentPath) {
//          console.warn("[Script] Could not normalize current page URL. Active menu highlighting skipped.");
//          return; // Cannot proceed if current URL is invalid
//     }
//      console.log(`[Script] Normalized current path: ${normalizedCurrentPath}`);


//     // Remove any existing active classes first
//     menuLinks.forEach(link => {
//         link.classList.remove('active-menu-item');
//         // Also remove active classes from parent toggles
//         const parentToggle = link.closest('.mobile-menu-item, .sub-submenu-container, .main-menu-item')?.querySelector(':scope > button.mobile-submenu-toggle, :scope > button.nav-link');
//         parentToggle?.classList.remove('active-parent-item');
//     });

//      // Collapse all mobile submenus initially
//      headerElement.querySelectorAll('#mobile-menu-panel .mobile-menu-item.open').forEach(item => {
//          item.classList.remove('open');
//          const submenu = item.querySelector(':scope > .mobile-submenu');
//          if (submenu) {
//              submenu.style.maxHeight = '0';
//              submenu.style.overflow = 'hidden';
//          }
//          const toggleButton = item.querySelector(':scope > button.mobile-submenu-toggle');
//          if(toggleButton) toggleButton.setAttribute('aria-expanded', 'false');
//      });


//     let bestMatch = { link: null, specificity: -1 }; // Track the best matching link and its specificity

//     // Find the best matching link
//     menuLinks.forEach(link => {
//         const linkHref = link.getAttribute('href');
//         // Skip invalid or internal-only links
//         if (!linkHref || linkHref === '#' || linkHref.startsWith('javascript:')) {
//             return;
//         }

//         const normalizedLinkPath = normalizeUrl(linkHref);
//         if (!normalizedLinkPath) {
//             return; // Skip if link URL is invalid
//         }

//         let currentSpecificity = -1;

//         try {
//              // Check for exact match of full absolute URL (highest specificity)
//              const absoluteLinkHref = new URL(linkHref, window.location.origin).href.split('#')[0].split('?')[0];
//              if (absoluteLinkHref === currentHref) {
//                  currentSpecificity = 2;
//              }
//         } catch (e) {
//              // Ignore error if URL construction fails
//         }


//         // If not an exact absolute URL match, check for normalized path match
//         if (currentSpecificity < 2 && normalizedLinkPath === normalizedCurrentPath) {
//             // Assign specificity: 1 for root, 0 for others
//             currentSpecificity = normalizedCurrentPath === '/' ? 1 : 0;
//         }

//         // Update best match if current link is a better match
//         if (currentSpecificity > bestMatch.specificity) {
//             bestMatch = { link, specificity: currentSpecificity };
//         } else if (currentSpecificity === bestMatch.specificity && currentSpecificity >= 0) {
//             // If specificity is the same, prefer longer paths (more specific links)
//             const currentBestPath = normalizeUrl(bestMatch.link.getAttribute('href'));
//             if (currentBestPath && normalizedLinkPath.length > currentBestPath.length) {
//                 bestMatch = { link, specificity: currentSpecificity };
//             }
//         }
//     });

//     // Apply active classes if a best match was found
//     if (bestMatch.link) {
//         const activeLink = bestMatch.link;
//         console.log(`[Script] Active menu item found:`, activeLink);
//         activeLink.classList.add('active-menu-item');

//         // Traverse up the DOM tree to add active classes to parent toggles and open mobile submenus
//         let element = activeLink;
//         while (element && element !== headerElement) {
//             // Find the closest parent menu item container (li, div)
//             const parentMenuItem = element.closest('.mobile-menu-item, .sub-submenu-container, .main-menu-item');

//             if (!parentMenuItem) break; // Stop if no more parent menu items found

//             // Find the toggle button directly within this parent menu item
//             const parentToggle = parentMenuItem.querySelector(':scope > button.mobile-submenu-toggle, :scope > button.nav-link');

//             // Add active class to the parent toggle button
//             if (parentToggle) {
//                  parentToggle.classList.add('active-parent-item');
//                  console.log("[Script] Added active-parent-item to:", parentToggle);
//             }


//             // If it's a mobile menu item and not already open, open its submenu
//             if (parentMenuItem.classList.contains('mobile-menu-item') && !parentMenuItem.classList.contains('open')) {
//                 parentMenuItem.classList.add('open'); // Add 'open' class
//                 const submenu = parentMenuItem.querySelector(':scope > .mobile-submenu'); // Find the submenu
//                 if (submenu) {
//                     // Expand the submenu
//                     submenu.style.maxHeight = `${submenu.scrollHeight}px`;
//                     submenu.style.overflow = 'visible'; // Make content visible
//                     console.log(`[Script] Opened mobile submenu for active item:`, submenu);
//                 }
//                 // Update aria-expanded for the mobile toggle button
//                 const mobileToggle = parentMenuItem.querySelector(':scope > button.mobile-submenu-toggle');
//                 if(mobileToggle) mobileToggle.setAttribute('aria-expanded', 'true');
//             }

//             // Move up to the next parent menu item container
//             element = parentMenuItem.parentElement;
//         }
//     } else {
//         console.log("[Script] No active menu item found for the current URL.");
//     }
// }


// /**
//  * Clears previously highlighted search results (if client-side search is implemented).
//  * (Assuming this function is needed and not defined elsewhere globally)
//  */
// function clearSearchHighlights() {
//      console.log("[Script] (Global/Assumed) clearSearchHighlights called.");
//      const mainContent = document.querySelector('main');
//      if (!mainContent) return;

//      // Find all <mark> elements with the specific highlight class
//      const highlights = mainContent.querySelectorAll(`mark.${SEARCH_HIGHLIGHT_CLASS}`);

//      highlights.forEach(mark => {
//          const parent = mark.parentNode;
//          if (parent) {
//              // Move all children of the <mark> element back to its parent
//              while (mark.firstChild) {
//                  parent.insertBefore(mark.firstChild, mark);
//              }
//              // Remove the empty <mark> element
//              parent.removeChild(mark);
//              // Normalize the parent node to merge adjacent text nodes that were split
//              parent.normalize();
//          }
//      });
//      console.log(`[Script] Removed ${highlights.length} search highlights.`);
// }


// /**
//  * Performs a simple client-side search within the <main> element and highlights matches.
//  * (Assuming this function is needed and not defined elsewhere globally)
//  * @param {string} query - The search query string.
//  */
// function performSearch(query) {
//     console.log(`[Script] (Global/Assumed) performSearch called with query: "${query}"`);
//     // Clear previous highlights before performing a new search
//     clearSearchHighlights();

//     // Get the main content area to search within
//     const mainContent = document.querySelector('main');

//     // Validate the query and the search area
//     if (!mainContent || !query || query.trim().length < 2) {
//          console.log("[Script] Search query too short or no main content to search.");
//          return; // Exit if query is invalid or no content area
//     }

//     const queryLower = query.trim().toLowerCase(); // Normalize query
//     let matchCount = 0; // Counter for found matches
//     let firstMatchElement = null; // To store the first found match element for scrolling

//     // Recursive function to traverse the DOM tree and search within text nodes
//     function searchNodes(node) {
//         // Check if the current node is a text node
//         if (node.nodeType === Node.TEXT_NODE) {
//             const text = node.textContent;
//             const textLower = text.toLowerCase();
//             let lastIndex = 0; // Start search from this index in the current text node

//             // Loop to find all occurrences of the query within this text node
//             while (true) {
//                 const matchIndex = textLower.indexOf(queryLower, lastIndex);

//                 // If no more matches are found in this text node, break the loop
//                 if (matchIndex === -1) break;

//                 // Extract the matching text from the original text node
//                 const matchText = text.substring(matchIndex, matchIndex + query.length);

//                 // Create a <mark> element to wrap the matching text
//                 const mark = document.createElement('mark');
//                 mark.className = SEARCH_HIGHLIGHT_CLASS; // Add the highlight class
//                 mark.textContent = matchText; // Set the matching text as the content of <mark>

//                 // Split the current text node into two parts at the match index:
//                 // 1. The part before the match (remains the original 'node')
//                 // 2. The part from the match onwards (returned by splitText, let's call it 'after')
//                 const after = node.splitText(matchIndex);

//                 // Split the 'after' part again to separate the matched text from the text after the match
//                 // The 'after' node now contains the matched text followed by the text after the match.
//                 // We take the substring starting from the query length to get just the text after the match.
//                 after.textContent = after.textContent.substring(query.length);

//                 // Insert the created <mark> element between the part before the match ('node') and the part after the match ('after')
//                 node.parentNode.insertBefore(mark, after);

//                 // Increment the match count
//                 matchCount++;

//                 // If this is the first match found, store the <mark> element
//                 if (!firstMatchElement) {
//                     firstMatchElement = mark;
//                 }

//                 // Continue the search from the beginning of the new 'after' node
//                 // This is important because splitText modifies the node in place and returns the subsequent node.
//                 node = after;
//                 lastIndex = 0; // Always start from the beginning of the new node
//                 // Cần reset walker hoặc tạo walker mới nếu cấu trúc DOM thay đổi đáng kể
//                 // Cách đơn giản hơn là duyệt thủ công như vòng lặp while(true) ở trên
//                 // hoặc sử dụng một kỹ thuật khác nếu DOM thay đổi nhiều.
//                 // Với việc chèn <mark>, cấu trúc DOM thay đổi, nên TreeWalker ban đầu có thể không còn chính xác.
//                 // Vòng lặp while(true) với splitText và insertBefore là cách phổ biến trong trường hợp này.
//                 // Quay lại cách duyệt thủ công đơn giản hơn:
//                 // (Đoạn code này đã được triển khai trong hàm performSearch ở trên)
//             }
//         }
//         // If the node is an element node (and not a script, style, or mark tag),
//         // recursively call searchNodes for its child nodes.
//         else if (node.nodeType === Node.ELEMENT_NODE &&
//                  node.nodeName !== 'SCRIPT' &&
//                  node.nodeName !== 'STYLE' &&
//                  node.nodeName !== 'MARK') // Avoid searching inside scripts, styles, or already highlighted marks
//         {
//             // Iterate over a static copy of childNodes because searchNodes might modify the child list
//             Array.from(node.childNodes).forEach(searchNodes);
//         }
//     }

//     // Start the recursive search from the main content element
//     searchNodes(mainContent);

//     console.log(`[Script] Search completed. Found ${matchCount} matches.`);

//     // Cuộn the first found match into view if any matches were found
//     if (firstMatchElement) {
//         console.log("[Script] Scrolling to the first search result.");
//         firstMatchElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
//     } else {
//          console.log("[Script] No search results found.");
//          // Optional: Display a message to the user indicating no results
//     }
// }

// /**
//  * Updates the current year displayed in the footer element.
//  * (Assuming this function is needed and not defined elsewhere globally)
//  */
// function updateFooterYear() {
//     console.log("[Script] (Global/Assumed) updateFooterYear called.");
//     // Find the element intended to display the current year in the footer
//     const yearElement = document.getElementById(FOOTER_YEAR_ID);

//     // If the element is found, update its text content to the current year
//     if (yearElement) {
//         yearElement.textContent = new Date().getFullYear();
//         console.log("[Script] Footer year updated successfully.");
//     } else {
//         console.warn(`[Script] Footer year element (#${FOOTER_YEAR_ID}) not found.`);
//     }
// }

// /**
//  * Initializes the language switching functionality.
//  * This function is expected to be defined in language.js.
//  * (Assuming this function exists and is attached to the window or called globally)
//  */
// // window.initializeLanguage = function() {
// //     console.log("[Script] (Global/Assumed) initializeLanguage called.");
// //     // Implementation details from your language.js file
// //     // This function should typically:
// //     // 1. Load translation data.
// //     // 2. Detect user's preferred language (e.g., from localStorage or browser settings).
// //     // 3. Apply translations to the page content.
// //     // 4. Set window.languageInitialized = true;
// //     // 5. Potentially call loadInternalNews() if news is language-dependent.
// //     // 6. Potentially attach event listeners to language switcher buttons (though script.js also tries this).
// // };

// /**
//  * Handles the event when a language button is clicked.
//  * This function is expected to be defined in language.js.
//  * (Assuming this function exists and is attached to the window or called globally)
//  * @param {Event} event - The click event object.
//  */
// // window.handleLanguageChange = function(event) {
// //     console.log("[Script] (Global/Assumed) handleLanguageChange called.");
// //     // Implementation details from your language.js file
// //     // This function should typically:
// //     // 1. Get the selected language from the button's data attribute (e.g., event.target.dataset.lang).
// //     // 2. Save the preferred language to localStorage.
// //     // 3. Apply translations for the new language to the page content.
// //     // 4. Update the displayed language/flag in the header.
// //     // 5. Potentially reload language-dependent content like news.
// // };

// /**
//  * Attaches event listeners to language switcher buttons.
//  * This function might be defined in language.js or script.js.
//  * (Assuming this function exists and is attached to the window or called globally)
//  */
// // window.attachLanguageSwitcherEvents = function() {
// //      console.log("[Script] (Global/Assumed) attachLanguageSwitcherEvents called.");
// //      // Implementation details...
// //      // This function should find the language buttons and add click listeners
// //      // that call handleLanguageChange.
// // };


// --- Main Execution Flow ---
// This block runs automatically when the script is loaded and the DOM is ready.
document.addEventListener('DOMContentLoaded', () => {
    console.log("[Script] DOMContentLoaded fired. Starting main execution flow...");

    // Start loading header and footer components asynchronously
    // Use loadComponent function to fetch and insert HTML
    const headerPromise = loadComponent(HEADER_PLACEHOLDER_ID, HEADER_COMPONENT_URL);
    const footerPromise = loadComponent(FOOTER_PLACEHOLDER_ID, FOOTER_COMPONENT_URL);

    // Use Promise.all to wait for both component loading Promises to settle
    // The .then() block will execute once both are done, regardless of success or failure
    Promise.all([headerPromise, footerPromise]).then(([headerPlaceholder, footerPlaceholder]) => {
        headerFooterLoadAttempted = true; // Mark that we have attempted to load components

        // Check if the components were successfully loaded (placeholder is not null, meaning element was found and fetch succeeded)
        const headerLoaded = !!headerPlaceholder;
        const footerLoaded = !!footerPlaceholder;
        console.log(`[Script] Promise.all finished component loading. Header loaded: ${headerLoaded}, Footer loaded: ${footerLoaded}.`);

        // If header was loaded successfully, initialize its specific logic (menu, search, etc.)
        if (headerLoaded) {
             console.log("[Script] Header component successfully loaded. Initializing header menu logic...");
             // Call the function to initialize header interactions.
             // This function is defined within this script.js file.
             initializeHeaderMenuLogic();
        } else {
             console.error("[Script] Header component failed to load. Header menu logic skipped.");
        }

        // If footer was loaded successfully, update the copyright year
        if (footerLoaded) {
             console.log("[Script] Footer component successfully loaded. Updating footer year...");
             // Check if the updateFooterYear function exists before calling it.
             // This function is assumed to be defined elsewhere (e.g., in this script.js or main.js).
             if (typeof updateFooterYear === 'function') {
                 updateFooterYear();
             } else {
                 console.warn("[Script] updateFooterYear function not found. Footer year update skipped.");
             }
        } else {
             console.error("[Script] Footer component failed to load. Footer year update skipped.");
        }


        // Initialize the language system AFTER components are loaded.
        // Use a small delay to give language.js time to execute and define its functions.
        setTimeout(() => {
            console.log("[Script] Checking for language initialization functions after component load delay...");
            // Check if the main language initialization function exists (assumed from language.js)
            if (typeof window.initializeLanguage === 'function') {
                console.log("[Script] initializeLanguage function found (from language.js).");
                // Check if the language system has already been initialized (to avoid re-initializing)
                // The window.languageInitialized flag is assumed to be set by language.js
                if (!window.languageInitialized) {
                     console.log("[Script] Language system not yet initialized. Calling initializeLanguage...");
                     window.initializeLanguage(); // Call the main language initialization function
                     // After initializeLanguage runs, it should handle applying translations and potentially loading news.
                     // Also, re-attach listeners for language buttons in the loaded header.
                     window.attachLanguageButtonListeners?.(); // Use optional chaining in case the function is not defined
                } else {
                     console.log("[Script] Language already initialized. Re-applying translations and listeners.");
                     // If already initialized, get the current language and re-apply translations.
                     const currentLang = localStorage.getItem('preferredLanguage') || 'vi';
                     // Re-apply translations if the function exists
                     if (typeof window.applyTranslations === 'function') {
                         console.log(`[Script] Re-applying translations for language: ${currentLang}`);
                         window.applyTranslations(currentLang);
                     } else {
                         console.warn("[Script] applyTranslations function not found. Cannot re-apply translations.");
                     }
                     // Reload language-dependent content like news if the container exists
                     if (document.getElementById(NEWS_CONTAINER_ID)) {
                         console.log("[Script] News container found, reloading news after language check.");
                         // The loadInternalNews function needs to be defined elsewhere (e.g., in this script.js or main.js)
                         loadInternalNews();
                     } else {
                         console.log("[Script] News container not found.");
                     }
                     // Gắn lại listeners cho các nút ngôn ngữ trong header đã load
                     window.attachLanguageButtonListeners?.();
                }
            } else {
                console.error("[Script] initializeLanguage function not found after timeout. Language features disabled.");
                // Fallback: If language.js failed to load, try to load news with default language if the container exists.
                if (document.getElementById(NEWS_CONTAINER_ID)) {
                    console.warn("[Script] Language system failed, attempting to load news with default language (VI).");
                     // Define a temporary translations object if the global one doesn't exist
                     if (typeof window.translations === 'undefined') {
                         window.translations = { vi: { read_more: 'Đọc thêm →', news_title_na: 'Tiêu đề không có sẵn', news_image_alt: 'Hình ảnh tin tức', no_news: 'Chưa có tin tức nào.', news_load_error: 'Không thể tải tin tức.', loading_news: 'Đang tải tin tức...' } };
                         console.log("[Script] Using temporary default translations for news.");
                     } else {
                         console.log("[Script] Existing translations object found, using it for news.");
                     }
                    loadInternalNews(); // Call the function to load news
                } else {
                    console.log("[Script] News container not found, skipping news load.");
                }
            }

            // Attach language switcher events (if the function exists in language.js)
            if (typeof window.attachLanguageSwitcherEvents === 'function') {
                console.log("[Script] Attaching language switcher events from language.js...");
                window.attachLanguageSwitcherEvents();
            } else {
                console.warn("[Script] window.attachLanguageSwitcherEvents function not found from language.js.");
            }
        }, 200); // Delay in milliseconds


    }).catch(error => {
        // Catch any uncaught errors from the Promises in Promise.all
        console.error("[Script] Uncaught error in Promise.all during component loading:", error);
         headerFooterLoadAttempted = true; // Mark that we have attempted to load
         // Display generic error messages in placeholders if they are still empty
         const headerPlaceholder = document.getElementById(HEADER_PLACEHOLDER_ID);
         if (headerPlaceholder && headerPlaceholder.innerHTML.trim() === '') { // Check if innerHTML is empty or just whitespace
             headerPlaceholder.innerHTML = `<p class="text-red-500 text-center p-4">Không thể tải Header do lỗi không xác định.</p>`;
         }
         const footerPlaceholder = document.getElementById(FOOTER_PLACEHOLDER_ID);
         if (footerPlaceholder && footerPlaceholder.innerHTML.trim() === '') { // Check if innerHTML is empty or just whitespace
              footerPlaceholder.innerHTML = `<p class="text-red-500 text-center p-4">Không thể tải Footer do lỗi không xác định.</p>`;
         }
    });

    // --- Page-Specific Initializations ---
    // These initializations should run after DOMContentLoaded but may not depend on header/footer being fully loaded.
    const bodyId = document.body.id; // Get the ID of the body element

    // Initialize RSS feed loading if the container element exists
    if (document.getElementById('vnexpress-rss-feed')) {
        console.log("[Script] RSS container found. Assuming rss-loader.js handles this initialization.");
        // The rss-loader.js script is expected to either run automatically or have its own initialization function.
    }

    // Initialize the Placement Test logic if the body ID matches and the function exists
    if (bodyId === 'page-placement' && typeof initializePlacementTest === 'function') {
        console.log("[Script] Initializing placement test for page-placement.");
        // The initializePlacementTest function is expected to be defined in a separate JS file for this specific page.
        initializePlacementTest();
    }

    console.log("[Script] Initial DOMContentLoaded execution flow finished.");
});

// --- Definition of Global Functions (if they are not defined elsewhere) ---
// The following functions are called within the script.
// If they are defined in other JS files (like main.js or language.js) and those files
// are loaded correctly before this script, you do NOT need to uncomment and define them here.
// If they are NOT defined elsewhere or are not globally accessible, uncomment and implement them here.

// Example definitions (uncomment and implement if needed):

/**
 * Initializes sticky/shrinking navbar behavior based on scroll position.
 * @param {HTMLElement} navbarElement - The main header element.
 */
// function initializeStickyNavbar(navbarElement) {
//     console.log("[Script] (Global/Assumed) initializeStickyNavbar called.");
//     if (!navbarElement) return;
//     const shrinkThreshold = 50; // Pixels scrolled before shrinking
//     let lastScrollTop = 0; // To detect scroll direction

//     const handleScroll = () => {
//         const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

//         // Add/remove 'shrink' class based on scroll position
//         navbarElement.classList.toggle('shrink', scrollTop > shrinkThreshold);

//         // Optional: Hide/show navbar on scroll down/up
//         // This requires additional CSS for top positioning transition
//         // if (scrollTop > lastScrollTop && scrollTop > navbarElement.offsetHeight) {
//         //     // Scrolling down - hide navbar
//         //     navbarElement.style.top = `-${navbarElement.offsetHeight}px`;
//         // } else {
//         //     // Scrolling up or at the top
//         //     navbarElement.style.top = '0';
//         // }

//         lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
//     };

//     // Add the scroll event listener
//     window.addEventListener('scroll', handleScroll, { passive: true });
//     // Run the handler once on load to set the initial state
//     handleScroll();
// }

/**
 * Highlights the active menu item in the header based on the current page URL.
 * @param {HTMLElement} headerElement - The main header element.
 */
// function initializeActiveMenuHighlighting(headerElement) {
//     console.log("[Script] (Global/Assumed) initializeActiveMenuHighlighting called.");
//     if (!headerElement) return;

//     // Get the current page's path, removing hash and query parameters
//     const currentHref = window.location.href.split('#')[0].split('?')[0];

//     // Select all navigation links within the header (desktop and mobile)
//     const menuLinks = headerElement.querySelectorAll('.nav-link[href], .submenu a[href], .sub-submenu a[href], #mobile-menu-panel a[href]');

//     // Helper function to normalize URLs for comparison (remove .html, trailing slash, etc.)
//     const normalizeUrl = url => {
//         try {
//             const urlObj = new URL(url, window.location.origin);
//             let path = urlObj.pathname;
//             // Remove trailing slash unless it's the root path "/"
//             if (path !== '/' && path.endsWith('/')) {
//                 path = path.slice(0, -1);
//             }
//             // Remove .html extension
//             if (path.endsWith('.html')) {
//                 path = path.slice(0, -'.html'.length);
//             }
//             // Treat "/index" the same as "/"
//             if (path === '/index' || path === '') {
//                 return '/';
//             }
//             return path;
//         } catch (e) {
//             console.warn(`[Script] Invalid URL during normalization: ${url}`, e);
//             return null; // Return null for invalid URLs
//         }
//     };

//     const normalizedCurrentPath = normalizeUrl(currentHref);

//     if (!normalizedCurrentPath) {
//          console.warn("[Script] Could not normalize current page URL. Active menu highlighting skipped.");
//          return; // Cannot proceed if current URL is invalid
//     }
//      console.log(`[Script] Normalized current path: ${normalizedCurrentPath}`);


//     // Remove any existing active classes first
//     menuLinks.forEach(link => {
//         link.classList.remove('active-menu-item');
//         // Also remove active classes from parent toggles
//         const parentToggle = link.closest('.mobile-menu-item, .sub-submenu-container, .main-menu-item')?.querySelector(':scope > button.mobile-submenu-toggle, :scope > button.nav-link');
//         parentToggle?.classList.remove('active-parent-item');
//     });

//      // Collapse all mobile submenus initially
//      headerElement.querySelectorAll('#mobile-menu-panel .mobile-menu-item.open').forEach(item => {
//          item.classList.remove('open');
//          const submenu = item.querySelector(':scope > .mobile-submenu');
//          if (submenu) {
//              submenu.style.maxHeight = '0';
//              submenu.style.overflow = 'hidden';
//          }
//          const toggleButton = item.querySelector(':scope > button.mobile-submenu-toggle');
//          if(toggleButton) toggleButton.setAttribute('aria-expanded', 'false');
//      });


//     let bestMatch = { link: null, specificity: -1 }; // Track the best matching link and its specificity

//     // Find the best matching link
//     menuLinks.forEach(link => {
//         const linkHref = link.getAttribute('href');
//         // Skip invalid or internal-only links
//         if (!linkHref || linkHref === '#' || linkHref.startsWith('javascript:')) {
//             return;
//         }

//         const normalizedLinkPath = normalizeUrl(linkHref);
//         if (!normalizedLinkPath) {
//             return; // Skip if link URL is invalid
//         }

//         let currentSpecificity = -1;

//         try {
//              // Check for exact match of full absolute URL (highest specificity)
//              const absoluteLinkHref = new URL(linkHref, window.location.origin).href.split('#')[0].split('?')[0];
//              if (absoluteLinkHref === currentHref) {
//                  currentSpecificity = 2;
//              }
//         } catch (e) {
//              // Ignore error if URL construction fails
//         }


//         // If not an exact absolute URL match, check for normalized path match
//         if (currentSpecificity < 2 && normalizedLinkPath === normalizedCurrentPath) {
//             // Assign specificity: 1 for root, 0 for others
//             currentSpecificity = normalizedCurrentPath === '/' ? 1 : 0;
//         }

//         // Update best match if current link is a better match
//         if (currentSpecificity > bestMatch.specificity) {
//             bestMatch = { link, specificity: currentSpecificity };
//         } else if (currentSpecificity === bestMatch.specificity && currentSpecificity >= 0) {
//             // If specificity is the same, prefer longer paths (more specific links)
//             const currentBestPath = normalizeUrl(bestMatch.link.getAttribute('href'));
//             if (currentBestPath && normalizedLinkPath.length > currentBestPath.length) {
//                 bestMatch = { link, specificity: currentSpecificity };
//             }
//         }
//     });

//     // Apply active classes if a best match was found
//     if (bestMatch.link) {
//         const activeLink = bestMatch.link;
//         console.log(`[Script] Active menu item found:`, activeLink);
//         activeLink.classList.add('active-menu-item');

//         // Traverse up the DOM tree to add active classes to parent toggles and open mobile submenus
//         let element = activeLink;
//         while (element && element !== headerElement) {
//             // Find the closest parent menu item container (li, div)
//             const parentMenuItem = element.closest('.mobile-menu-item, .sub-submenu-container, .main-menu-item');

//             if (!parentMenuItem) break; // Stop if no more parent menu items found

//             // Find the toggle button directly within this parent menu item
//             const parentToggle = parentMenuItem.querySelector(':scope > button.mobile-submenu-toggle, :scope > button.nav-link');

//             // Add active class to the parent toggle button
//             if (parentToggle) {
//                  parentToggle.classList.add('active-parent-item');
//                  console.log("[Script] Added active-parent-item to:", parentToggle);
//             }


//             // If it's a mobile menu item and not already open, open its submenu
//             if (parentMenuItem.classList.contains('mobile-menu-item') && !parentMenuItem.classList.contains('open')) {
//                 parentMenuItem.classList.add('open'); // Add 'open' class
//                 const submenu = parentMenuItem.querySelector(':scope > .mobile-submenu'); // Find the submenu
//                 if (submenu) {
//                     // Expand the submenu
//                     submenu.style.maxHeight = `${submenu.scrollHeight}px`;
//                     submenu.style.overflow = 'visible'; // Make content visible
//                     console.log(`[Script] Opened mobile submenu for active item:`, submenu);
//                 }
//                 // Update aria-expanded for the mobile toggle button
//                 const mobileToggle = parentMenuItem.querySelector(':scope > button.mobile-submenu-toggle');
//                 if(mobileToggle) mobileToggle.setAttribute('aria-expanded', 'true');
//             }

//             // Move up to the next parent menu item container
//             element = parentMenuItem.parentElement;
//         }
//     } else {
//         console.log("[Script] No active menu item found for the current URL.");
//     }
// }


// /**
//  * Clears previously highlighted search results (if client-side search is implemented).
//  * (Assuming this function is needed and not defined elsewhere globally)
//  */
// function clearSearchHighlights() {
//      console.log("[Script] (Global/Assumed) clearSearchHighlights called.");
//      const mainContent = document.querySelector('main');
//      if (!mainContent) return;

//      // Find all <mark> elements with the specific highlight class
//      const highlights = mainContent.querySelectorAll(`mark.${SEARCH_HIGHLIGHT_CLASS}`);

//      highlights.forEach(mark => {
//          const parent = mark.parentNode;
//          if (parent) {
//              // Move all children of the <mark> element back to its parent
//              while (mark.firstChild) {
//                  parent.insertBefore(mark.firstChild, mark);
//              }
//              // Remove the empty <mark> element
//              parent.removeChild(mark);
//              // Normalize the parent node to merge adjacent text nodes that were split
//              parent.normalize();
//          }
//      });
//      console.log(`[Script] Removed ${highlights.length} search highlights.`);
// }


// /**
//  * Performs a simple client-side search within the <main> element and highlights matches.
//  * (Assuming this function is needed and not defined elsewhere globally)
//  * @param {string} query - The search query string.
//  */
// function performSearch(query) {
//     console.log(`[Script] (Global/Assumed) performSearch called with query: "${query}"`);
//     // Clear previous highlights before performing a new search
//     clearSearchHighlights();

//     // Get the main content area to search within
//     const mainContent = document.querySelector('main');

//     // Validate the query and the search area
//     if (!mainContent || !query || query.trim().length < 2) {
//          console.log("[Script] Search query too short or no main content to search.");
//          return; // Exit if query is invalid or no content area
//     }

//     const queryLower = query.trim().toLowerCase(); // Normalize query
//     let matchCount = 0; // Counter for found matches
//     let firstMatchElement = null; // To store the first found match element for scrolling

//     // Recursive function to traverse the DOM tree and search within text nodes
//     function searchNodes(node) {
//         // Check if the current node is a text node
//         if (node.nodeType === Node.TEXT_NODE) {
//             const text = node.textContent;
//             const textLower = text.toLowerCase();
//             let lastIndex = 0; // Start search from this index in the current text node

//             // Loop to find all occurrences of the query within this text node
//             while (true) {
//                 const matchIndex = textLower.indexOf(queryLower, lastIndex);

//                 // If no more matches are found in this text node, break the loop
//                 if (matchIndex === -1) break;

//                 // Extract the matching text from the original text node
//                 const matchText = text.substring(matchIndex, matchIndex + query.length);

//                 // Create a <mark> element to wrap the matching text
//                 const mark = document.createElement('mark');
//                 mark.className = SEARCH_HIGHLIGHT_CLASS; // Add the highlight class
//                 mark.textContent = matchText; // Set the matching text as the content of <mark>

//                 // Split the current text node into two parts at the match index:
//                 // 1. The part before the match (remains the original 'node')
//                 // 2. The part from the match onwards (returned by splitText, let's call it 'after')
//                 const after = node.splitText(matchIndex);

//                 // Split the 'after' part again to separate the matched text from the text after the match
//                 // The 'after' node now contains the matched text followed by the text after the match.
//                 // We take the substring starting from the query length to get just the text after the match.
//                 after.textContent = after.textContent.substring(query.length);

//                 // Insert the created <mark> element between the part before the match ('node') and the part after the match ('after')
//                 node.parentNode.insertBefore(mark, after);

//                 // Increment the match count
//                 matchCount++;

//                 // If this is the first match found, store the <mark> element
//                 if (!firstMatchElement) {
//                     firstMatchElement = mark;
//                 }

//                 // Continue the search from the beginning of the new 'after' node
//                 // This is important because splitText modifies the node in place and returns the subsequent node.
//                 node = after;
//                 lastIndex = 0; // Always start from the beginning of the new node
//                 // Cần reset walker hoặc tạo walker mới nếu cấu trúc DOM thay đổi đáng kể
//                 // Cách đơn giản hơn là duyệt thủ công như vòng lặp while(true) ở trên
//                 // hoặc sử dụng một kỹ thuật khác nếu DOM thay đổi nhiều.
//                 // Với việc chèn <mark>, cấu trúc DOM thay đổi, nên TreeWalker ban đầu có thể không còn chính xác.
//                 // Vòng lặp while(true) với splitText và insertBefore là cách phổ biến trong trường hợp này.
//                 // Quay lại cách duyệt thủ công đơn giản hơn:
//                 // (Đoạn code này đã được triển khai trong hàm performSearch ở trên)
//             }
//         }
//         // If the node is an element node (and not a script, style, or mark tag),
//         // recursively call searchNodes for its child nodes.
//         else if (node.nodeType === Node.ELEMENT_NODE &&
//                  node.nodeName !== 'SCRIPT' &&
//                  node.nodeName !== 'STYLE' &&
//                  node.nodeName !== 'MARK') // Avoid searching inside scripts, styles, or already highlighted marks
//         {
//             // Iterate over a static copy of childNodes because searchNodes might modify the child list
//             Array.from(node.childNodes).forEach(searchNodes);
//         }
//     }

//     // Start the recursive search from the main content element
//     searchNodes(mainContent);

//     console.log(`[Script] Search completed. Found ${matchCount} matches.`);

//     // Cuộn the first found match into view if any matches were found
//     if (firstMatchElement) {
//         console.log("[Script] Scrolling to the first search result.");
//         firstMatchElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
//     } else {
//          console.log("[Script] No search results found.");
//          // Optional: Display a message to the user indicating no results
//     }
// }

// /**
//  * Updates the current year displayed in the footer element.
//  * (Assuming this function is needed and not defined elsewhere globally)
//  */
// function updateFooterYear() {
//     console.log("[Script] (Global/Assumed) updateFooterYear called.");
//     // Find the element intended to display the current year in the footer
//     const yearElement = document.getElementById(FOOTER_YEAR_ID);

//     // If the element is found, update its text content to the current year
//     if (yearElement) {
//         yearElement.textContent = new Date().getFullYear();
//         console.log("[Script] Footer year updated successfully.");
//     } else {
//         console.warn(`[Script] Footer year element (#${FOOTER_YEAR_ID}) not found.`);
//     }
// }

// /**
//  * Initializes the language switching functionality.
//  * This function is expected to be defined in language.js.
//  * (Assuming this function exists and is attached to the window or called globally)
//  */
// // window.initializeLanguage = function() {
// //     console.log("[Script] (Global/Assumed) initializeLanguage called.");
// //     // Implementation details from your language.js file
// //     // This function should typically:
// //     // 1. Load translation data.
// //     // 2. Detect user's preferred language (e.g., from localStorage or browser settings).
// //     // 3. Apply translations to the page content.
// //     // 4. Set window.languageInitialized = true;
// //     // 5. Potentially call loadInternalNews() if news is language-dependent.
// //     // 6. Potentially attach event listeners to language switcher buttons (though script.js also tries this).
// // };

// /**
//  * Handles the event when a language button is clicked.
//  * This function is expected to be defined in language.js.
//  * (Assuming this function exists and is attached to the window or called globally)
//  * @param {Event} event - The click event object.
//  */
// // window.handleLanguageChange = function(event) {
// //     console.log("[Script] (Global/Assumed) handleLanguageChange called.");
// //     // Implementation details from your language.js file
// //     // This function should typically:
// //     // 1. Get the selected language from the button's data attribute (e.g., event.target.dataset.lang).
// //     // 2. Save the preferred language to localStorage.
// //     // 3. Apply translations for the new language to the page content.
// //     // 4. Update the displayed language/flag in the header.
// //     // 5. Potentially reload language-dependent content like news.
// // };

// /**
//  * Attaches event listeners to language switcher buttons.
//  * This function might be defined in language.js or script.js.
//  * (Assuming this function exists and is attached to the window or called globally)
//  */
// // window.attachLanguageSwitcherEvents = function() {
// //      console.log("[Script] (Global/Assumed) attachLanguageSwitcherEvents called.");
// //      // Implementation details...
// //      // This function should find the language buttons and add click listeners
// //      // that call handleLanguageChange.
// // };


// --- Main Execution Flow ---
// This block runs automatically when the script is loaded and the DOM is ready.
document.addEventListener('DOMContentLoaded', () => {
    console.log("[Script] DOMContentLoaded fired. Starting main execution flow...");

    // Start loading header and footer components asynchronously
    // Use loadComponent function to fetch and insert HTML
    const headerPromise = loadComponent(HEADER_PLACEHOLDER_ID, HEADER_COMPONENT_URL);
    const footerPromise = loadComponent(FOOTER_PLACEHOLDER_ID, FOOTER_COMPONENT_URL);

    // Use Promise.all to wait for both component loading Promises to settle
    // The .then() block will execute once both are done, regardless of success or failure
    Promise.all([headerPromise, footerPromise]).then(([headerPlaceholder, footerPlaceholder]) => {
        headerFooterLoadAttempted = true; // Mark that we have attempted to load components

        // Check if the components were successfully loaded (placeholder is not null, meaning element was found and fetch succeeded)
        const headerLoaded = !!headerPlaceholder;
        const footerLoaded = !!footerPlaceholder;
        console.log(`[Script] Promise.all finished component loading. Header loaded: ${headerLoaded}, Footer loaded: ${footerLoaded}.`);

        // If header was loaded successfully, initialize its specific logic (menu, search, etc.)
        if (headerLoaded) {
             console.log("[Script] Header component successfully loaded. Initializing header menu logic...");
             // Call the function to initialize header interactions.
             // This function is defined within this script.js file.
             initializeHeaderMenuLogic();
        } else {
             console.error("[Script] Header component failed to load. Header menu logic skipped.");
        }

        // If footer was loaded successfully, update the copyright year
        if (footerLoaded) {
             console.log("[Script] Footer component successfully loaded. Updating footer year...");
             // Check if the updateFooterYear function exists before calling it.
             // This function is assumed to be defined elsewhere (e.g., in this script.js or main.js).
             if (typeof updateFooterYear === 'function') {
                 updateFooterYear();
             } else {
                 console.warn("[Script] updateFooterYear function not found. Footer year update skipped.");
             }
        } else {
             console.error("[Script] Footer component failed to load. Footer year update skipped.");
        }


        // Initialize the language system AFTER components are loaded.
        // Use a small delay to give language.js time to execute and define its functions.
        setTimeout(() => {
            console.log("[Script] Checking for language initialization functions after component load delay...");
            // Check if the main language initialization function exists (assumed from language.js)
            if (typeof window.initializeLanguage === 'function') {
                console.log("[Script] initializeLanguage function found (from language.js).");
                // Check if the language system has already been initialized (to avoid re-initializing)
                // The window.languageInitialized flag is assumed to be set by language.js
                if (!window.languageInitialized) {
                     console.log("[Script] Language system not yet initialized. Calling initializeLanguage...");
                     window.initializeLanguage(); // Call the main language initialization function
                     // After initializeLanguage runs, it should handle applying translations and potentially loading news.
                     // Also, re-attach listeners for language buttons in the loaded header.
                     window.attachLanguageButtonListeners?.(); // Use optional chaining in case the function is not defined
                } else {
                     console.log("[Script] Language already initialized. Re-applying translations and listeners.");
                     // If already initialized, get the current language and re-apply translations.
                     const currentLang = localStorage.getItem('preferredLanguage') || 'vi';
                     // Re-apply translations if the function exists
                     if (typeof window.applyTranslations === 'function') {
                         console.log(`[Script] Re-applying translations for language: ${currentLang}`);
                         window.applyTranslations(currentLang);
                     } else {
                         console.warn("[Script] applyTranslations function not found. Cannot re-apply translations.");
                     }
                     // Reload language-dependent content like news if the container exists
                     if (document.getElementById(NEWS_CONTAINER_ID)) {
                         console.log("[Script] News container found, reloading news after language check.");
                         // The loadInternalNews function needs to be defined elsewhere (e.g., in this script.js or main.js)
                         loadInternalNews();
                     } else {
                         console.log("[Script] News container not found.");
                     }
                     // Gắn lại listeners cho các nút ngôn ngữ trong header đã load
                     window.attachLanguageButtonListeners?.();
                }
            } else {
                console.error("[Script] initializeLanguage function not found after timeout. Language features disabled.");
                // Fallback: If language.js failed to load, try to load news with default language if the container exists.
                if (document.getElementById(NEWS_CONTAINER_ID)) {
                    console.warn("[Script] Language system failed, attempting to load news with default language (VI).");
                     // Define a temporary translations object if the global one doesn't exist
                     if (typeof window.translations === 'undefined') {
                         window.translations = { vi: { read_more: 'Đọc thêm →', news_title_na: 'Tiêu đề không có sẵn', news_image_alt: 'Hình ảnh tin tức', no_news: 'Chưa có tin tức nào.', news_load_error: 'Không thể tải tin tức.', loading_news: 'Đang tải tin tức...' } };
                         console.log("[Script] Using temporary default translations for news.");
                     } else {
                         console.log("[Script] Existing translations object found, using it for news.");
                     }
                    loadInternalNews(); // Call the function to load news
                } else {
                    console.log("[Script] News container not found, skipping news load.");
                }
            }

            // Attach language switcher events (if the function exists in language.js)
            if (typeof window.attachLanguageSwitcherEvents === 'function') {
                console.log("[Script] Attaching language switcher events from language.js...");
                window.attachLanguageSwitcherEvents();
            } else {
                console.warn("[Script] window.attachLanguageSwitcherEvents function not found from language.js.");
            }
        }, 200); // Delay in milliseconds


    }).catch(error => {
        // Catch any uncaught errors from the Promises in Promise.all
        console.error("[Script] Uncaught error in Promise.all during component loading:", error);
         headerFooterLoadAttempted = true; // Mark that we have attempted to load
         // Display generic error messages in placeholders if they are still empty
         const headerPlaceholder = document.getElementById(HEADER_PLACEHOLDER_ID);
         if (headerPlaceholder && headerPlaceholder.innerHTML.trim() === '') { // Check if innerHTML is empty or just whitespace
             headerPlaceholder.innerHTML = `<p class="text-red-500 text-center p-4">Không thể tải Header do lỗi không xác định.</p>`;
         }
         const footerPlaceholder = document.getElementById(FOOTER_PLACEHOLDER_ID);
         if (footerPlaceholder && footerPlaceholder.innerHTML.trim() === '') { // Check if innerHTML is empty or just whitespace
              footerPlaceholder.innerHTML = `<p class="text-red-500 text-center p-4">Không thể tải Footer do lỗi không xác định.</p>`;
         }
    });

    // --- Page-Specific Initializations ---
    // These initializations should run after DOMContentLoaded but may not depend on header/footer being fully loaded.
    const bodyId = document.body.id; // Get the ID of the body element

    // Initialize RSS feed loading if the container element exists
    if (document.getElementById('vnexpress-rss-feed')) {
        console.log("[Script] RSS container found. Assuming rss-loader.js handles this initialization.");
        // The rss-loader.js script is expected to either run automatically or have its own initialization function.
    }

    // Initialize the Placement Test logic if the body ID matches and the function exists
    if (bodyId === 'page-placement' && typeof initializePlacementTest === 'function') {
        console.log("[Script] Initializing placement test for page-placement.");
        // The initializePlacementTest function is expected to be defined in a separate JS file for this specific page.
        initializePlacementTest();
    }

    console.log("[Script] Initial DOMContentLoaded execution flow finished.");
});

// --- Definition of Global Functions (if they are not defined elsewhere) ---
// The following functions are called within the script.
// If they are defined in other JS files (like main.js or language.js) and those files
// are loaded correctly before this script, you do NOT need to uncomment and define them here.
// If they are NOT defined elsewhere or are not globally accessible, uncomment and implement them here.

// Example definitions (uncomment and implement if needed):

/**
 * Initializes sticky/shrinking navbar behavior based on scroll position.
 * @param {HTMLElement} navbarElement - The main header element.
 */
// function initializeStickyNavbar(navbarElement) {
//     console.log("[Script] (Global/Assumed) initializeStickyNavbar called.");
//     if (!navbarElement) return;
//     const shrinkThreshold = 50; // Pixels scrolled before shrinking
//     let lastScrollTop = 0; // To detect scroll direction

//     const handleScroll = () => {
//         const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

//         // Add/remove 'shrink' class based on scroll position
//         navbarElement.classList.toggle('shrink', scrollTop > shrinkThreshold);

//         // Optional: Hide/show navbar on scroll down/up
//         // This requires additional CSS for top positioning transition
//         // if (scrollTop > lastScrollTop && scrollTop > navbarElement.offsetHeight) {
//         //     // Scrolling down - hide navbar
//         //     navbarElement.style.top = `-${navbarElement.offsetHeight}px`;
//         // } else {
//         //     // Scrolling up or at the top
//         //     navbarElement.style.top = '0';
//         // }

//         lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
//     };

//     // Add the scroll event listener
//     window.addEventListener('scroll', handleScroll, { passive: true });
//     // Run the handler once on load to set the initial state
//     handleScroll();
// }

/**
 * Highlights the active menu item in the header based on the current page URL.
 * @param {HTMLElement} headerElement - The main header element.
 */
// function initializeActiveMenuHighlighting(headerElement) {
//     console.log("[Script] (Global/Assumed) initializeActiveMenuHighlighting called.");
//     if (!headerElement) return;

//     // Get the current page's path, removing hash and query parameters
//     const currentHref = window.location.href.split('#')[0].split('?')[0];

//     // Select all navigation links within the header (desktop and mobile)
//     const menuLinks = headerElement.querySelectorAll('.nav-link[href], .submenu a[href], .sub-submenu a[href], #mobile-menu-panel a[href]');

//     // Helper function to normalize URLs for comparison (remove .html, trailing slash, etc.)
//     const normalizeUrl = url => {
//         try {
//             const urlObj = new URL(url, window.location.origin);
//             let path = urlObj.pathname;
//             // Remove trailing slash unless it's the root path "/"
//             if (path !== '/' && path.endsWith('/')) {
//                 path = path.slice(0, -1);
//             }
//             // Remove .html extension
//             if (path.endsWith('.html')) {
//                 path = path.slice(0, -'.html'.length);
//             }
//             // Treat "/index" the same as "/"
//             if (path === '/index' || path === '') {
//                 return '/';
//             }
//             return path;
//         } catch (e) {
//             console.warn(`[Script] Invalid URL during normalization: ${url}`, e);
//             return null; // Return null for invalid URLs
//         }
//     };

//     const normalizedCurrentPath = normalizeUrl(currentHref);

//     if (!normalizedCurrentPath) {
//          console.warn("[Script] Could not normalize current page URL. Active menu highlighting skipped.");
//          return; // Cannot proceed if current URL is invalid
//     }
//      console.log(`[Script] Normalized current path: ${normalizedCurrentPath}`);


//     // Remove any existing active classes first
//     menuLinks.forEach(link => {
//         link.classList.remove('active-menu-item');
//         // Also remove active classes from parent toggles
//         const parentToggle = link.closest('.mobile-menu-item, .sub-submenu-container, .main-menu-item')?.querySelector(':scope > button.mobile-submenu-toggle, :scope > button.nav-link');
//         parentToggle?.classList.remove('active-parent-item');
//     });

//      // Collapse all mobile submenus initially
//      headerElement.querySelectorAll('#mobile-menu-panel .mobile-menu-item.open').forEach(item => {
//          item.classList.remove('open');
//          const submenu = item.querySelector(':scope > .mobile-submenu');
//          if (submenu) {
//              submenu.style.maxHeight = '0';
//              submenu.style.overflow = 'hidden';
//          }
//          const toggleButton = item.querySelector(':scope > button.mobile-submenu-toggle');
//          if(toggleButton) toggleButton.setAttribute('aria-expanded', 'false');
//      });


//     let bestMatch = { link: null, specificity: -1 }; // Track the best matching link and its specificity

//     // Find the best matching link
//     menuLinks.forEach(link => {
//         const linkHref = link.getAttribute('href');
//         // Skip invalid or internal-only links
//         if (!linkHref || linkHref === '#' || linkHref.startsWith('javascript:')) {
//             return;
//         }

//         const normalizedLinkPath = normalizeUrl(linkHref);
//         if (!normalizedLinkPath) {
//             return; // Skip if link URL is invalid
//         }

//         let currentSpecificity = -1;

//         try {
//              // Check for exact match of full absolute URL (highest specificity)
//              const absoluteLinkHref = new URL(linkHref, window.location.origin).href.split('#')[0].split('?')[0];
//              if (absoluteLinkHref === currentHref) {
//                  currentSpecificity = 2;
//              }
//         } catch (e) {
//              // Ignore error if URL construction fails
//         }


//         // If not an exact absolute URL match, check for normalized path match
//         if (currentSpecificity < 2 && normalizedLinkPath === normalizedCurrentPath) {
//             // Assign specificity: 1 for root, 0 for others
//             currentSpecificity = normalizedCurrentPath === '/' ? 1 : 0;
//         }

//         // Update best match if current link is a better match
//         if (currentSpecificity > bestMatch.specificity) {
//             bestMatch = { link, specificity: currentSpecificity };
//         } else if (currentSpecificity === bestMatch.specificity && currentSpecificity >= 0) {
//             // If specificity is the same, prefer longer paths (more specific links)
//             const currentBestPath = normalizeUrl(bestMatch.link.getAttribute('href'));
//             if (currentBestPath && normalizedLinkPath.length > currentBestPath.length) {
//                 bestMatch = { link, specificity: currentSpecificity };
//             }
//         }
//     });

//     // Apply active classes if a best match was found
//     if (bestMatch.link) {
//         const activeLink = bestMatch.link;
//         console.log(`[Script] Active menu item found:`, activeLink);
//         activeLink.classList.add('active-menu-item');

//         // Traverse up the DOM tree to add active classes to parent toggles and open mobile submenus
//         let element = activeLink;
//         while (element && element !== headerElement) {
//             // Find the closest parent menu item container (li, div)
//             const parentMenuItem = element.closest('.mobile-menu-item, .sub-submenu-container, .main-menu-item');

//             if (!parentMenuItem) break; // Stop if no more parent menu items found

//             // Find the toggle button directly within this parent menu item
//             const parentToggle = parentMenuItem.querySelector(':scope > button.mobile-submenu-toggle, :scope > button.nav-link');

//             // Add active class to the parent toggle button
//             if (parentToggle) {
//                  parentToggle.classList.add('active-parent-item');
//                  console.log("[Script] Added active-parent-item to:", parentToggle);
//             }


//             // If it's a mobile menu item and not already open, open its submenu
//             if (parentMenuItem.classList.contains('mobile-menu-item') && !parentMenuItem.classList.contains('open')) {
//                 parentMenuItem.classList.add('open'); // Add 'open' class
//                 const submenu = parentMenuItem.querySelector(':scope > .mobile-submenu'); // Find the submenu
//                 if (submenu) {
//                     // Expand the submenu
//                     submenu.style.maxHeight = `${submenu.scrollHeight}px`;
//                     submenu.style.overflow = 'visible'; // Make content visible
//                     console.log(`[Script] Opened mobile submenu for active item:`, submenu);
//                 }
//                 // Update aria-expanded for the mobile toggle button
//                 const mobileToggle = parentMenuItem.querySelector(':scope > button.mobile-submenu-toggle');
//                 if(mobileToggle) mobileToggle.setAttribute('aria-expanded', 'true');
//             }

//             // Move up to the next parent menu item container
//             element = parentMenuItem.parentElement;
//         }
//     } else {
//         console.log("[Script] No active menu item found for the current URL.");
//     }
// }


// /**
//  * Clears previously highlighted search results (if client-side search is implemented).
//  * (Assuming this function is needed and not defined elsewhere globally)
//  */
// function clearSearchHighlights() {
//      console.log("[Script] (Global/Assumed) clearSearchHighlights called.");
//      const mainContent = document.querySelector('main');
//      if (!mainContent) return;

//      // Find all <mark> elements with the specific highlight class
//      const highlights = mainContent.querySelectorAll(`mark.${SEARCH_HIGHLIGHT_CLASS}`);

//      highlights.forEach(mark => {
//          const parent = mark.parentNode;
//          if (parent) {
//              // Move all children of the <mark> element back to its parent
//              while (mark.firstChild) {
//                  parent.insertBefore(mark.firstChild, mark);
//              }
//              // Remove the empty <mark> element
//              parent.removeChild(mark);
//              // Normalize the parent node to merge adjacent text nodes that were split
//              parent.normalize();
//          }
//      });
//      console.log(`[Script] Removed ${highlights.length} search highlights.`);
// }


// /**
//  * Performs a simple client-side search within the <main> element and highlights matches.
//  * (Assuming this function is needed and not defined elsewhere globally)
//  * @param {string} query - The search query string.
//  */
// function performSearch(query) {
//     console.log(`[Script] (Global/Assumed) performSearch called with query: "${query}"`);
//     // Clear previous highlights before performing a new search
//     clearSearchHighlights();

//     // Get the main content area to search within
//     const mainContent = document.querySelector('main');

//     // Validate the query and the search area
//     if (!mainContent || !query || query.trim().length < 2) {
//          console.log("[Script] Search query too short or no main content to search.");
//          return; // Exit if query is invalid or no content area
//     }

//     const queryLower = query.trim().toLowerCase(); // Normalize query
//     let matchCount = 0; // Counter for found matches
//     let firstMatchElement = null; // To store the first found match element for scrolling

//     // Recursive function to traverse the DOM tree and search within text nodes
//     function searchNodes(node) {
//         // Check if the current node is a text node
//         if (node.nodeType === Node.TEXT_NODE) {
//             const text = node.textContent;
//             const textLower = text.toLowerCase();
//             let lastIndex = 0; // Start search from this index in the current text node

//             // Loop to find all occurrences of the query within this text node
//             while (true) {
//                 const matchIndex = textLower.indexOf(queryLower, lastIndex);

//                 // If no more matches are found in this text node, break the loop
//                 if (matchIndex === -1) break;

//                 // Extract the matching text from the original text node
//                 const matchText = text.substring(matchIndex, matchIndex + query.length);

//                 // Create a <mark> element to wrap the matching text
//                 const mark = document.createElement('mark');
//                 mark.className = SEARCH_HIGHLIGHT_CLASS; // Add the highlight class
//                 mark.textContent = matchText; // Set the matching text as the content of <mark>

//                 // Split the current text node into two parts at the match index:
//                 // 1. The part before the match (remains the original 'node')
//                 // 2. The part from the match onwards (returned by splitText, let's call it 'after')
//                 const after = node.splitText(matchIndex);

//                 // Split the 'after' part again to separate the matched text from the text after the match
//                 // The 'after' node now contains the matched text followed by the text after the match.
//                 // We take the substring starting from the query length to get just the text after the match.
//                 after.textContent = after.textContent.substring(query.length);

//                 // Insert the created <mark> element between the part before the match ('node') and the part after the match ('after')
//                 node.parentNode.insertBefore(mark, after);

//                 // Increment the match count
//                 matchCount++;

//                 // If this is the first match found, store the <mark> element
//                 if (!firstMatchElement) {
//                     firstMatchElement = mark;
//                 }

//                 // Continue the search from the beginning of the new 'after' node
//                 // This is important because splitText modifies the node in place and returns the subsequent node.
//                 node = after;
//                 lastIndex = 0; // Always start from the beginning of the new node
//                 // Cần reset walker hoặc tạo walker mới nếu cấu trúc DOM thay đổi đáng kể
//                 // Cách đơn giản hơn là duyệt thủ công như vòng lặp while(true) ở trên
//                 // hoặc sử dụng một kỹ thuật khác nếu DOM thay đổi nhiều.
//                 // Với việc chèn <mark>, cấu trúc DOM thay đổi, nên TreeWalker ban đầu có thể không còn chính xác.
//                 // Vòng lặp while(true) với splitText và insertBefore là cách phổ biến trong trường hợp này.
//                 // Quay lại cách duyệt thủ công đơn giản hơn:
//                 // (Đoạn code này đã được triển khai trong hàm performSearch ở trên)
//             }
//         }
//         // If the node is an element node (and not a script, style, or mark tag),
//         // recursively call searchNodes for its child nodes.
//         else if (node.nodeType === Node.ELEMENT_NODE &&
//                  node.nodeName !== 'SCRIPT' &&
//                  node.nodeName !== 'STYLE' &&
//                  node.nodeName !== 'MARK') // Avoid searching inside scripts, styles, or already highlighted marks
//         {
//             // Iterate over a static copy of childNodes because searchNodes might modify the child list
//             Array.from(node.childNodes).forEach(searchNodes);
//         }
//     }

//     // Start the recursive search from the main content element
//     searchNodes(mainContent);

//     console.log(`[Script] Search completed. Found ${matchCount} matches.`);

//     // Cuộn the first found match into view if any matches were found
//     if (firstMatchElement) {
//         console.log("[Script] Scrolling to the first search result.");
//         firstMatchElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
//     } else {
//          console.log("[Script] No search results found.");
//          // Optional: Display a message to the user indicating no results
//     }
// }

// /**
//  * Updates the current year displayed in the footer element.
//  * (Assuming this function is needed and not defined elsewhere globally)
//  */
// function updateFooterYear() {
//     console.log("[Script] (Global/Assumed) updateFooterYear called.");
//     // Find the element intended to display the current year in the footer
//     const yearElement = document.getElementById(FOOTER_YEAR_ID);

//     // If the element is found, update its text content to the current year
//     if (yearElement) {
//         yearElement.textContent = new Date().getFullYear();
//         console.log("[Script] Footer year updated successfully.");
//     } else {
//         console.warn(`[Script] Footer year element (#${FOOTER_YEAR_ID}) not found.`);
//     }
// }

// /**
//  * Initializes the language switching functionality.
//  * This function is expected to be defined in language.js.
//  * (Assuming this function exists and is attached to the window or called globally)
//  */
// // window.initializeLanguage = function() {
// //     console.log("[Script] (Global/Assumed) initializeLanguage called.");
// //     // Implementation details from your language.js file
// //     // This function should typically:
// //     // 1. Load translation data.
// //     // 2. Detect user's preferred language (e.g., from localStorage or browser settings).
// //     // 3. Apply translations to the page content.
// //     // 4. Set window.languageInitialized = true;
// //     // 5. Potentially call loadInternalNews() if news is language-dependent.
// //     // 6. Potentially attach event listeners to language switcher buttons (though script.js also tries this).
// // };

// /**
//  * Handles the event when a language button is clicked.
//  * This function is expected to be defined in language.js.
//  * (Assuming this function exists and is attached to the window or called globally)
//  * @param {Event} event - The click event object.
//  */
// // window.handleLanguageChange = function(event) {
// //     console.log("[Script] (Global/Assumed) handleLanguageChange called.");
// //     // Implementation details from your language.js file
// //     // This function should typically:
// //     // 1. Get the selected language from the button's data attribute (e.g., event.target.dataset.lang).
// //     // 2. Save the preferred language to localStorage.
// //     // 3. Apply translations for the new language to the page content.
// //     // 4. Update the displayed language/flag in the header.
// //     // 5. Potentially reload language-dependent content like news.
// // };

// /**
//  * Attaches event listeners to language switcher buttons.
//  * This function might be defined in language.js or script.js.
//  * (Assuming this function exists and is attached to the window or called globally)
//  */
// // window.attachLanguageSwitcherEvents = function() {
// //      console.log("[Script] (Global/Assumed) attachLanguageSwitcherEvents called.");
// //      // Implementation details...
// //      // This function should find the language buttons and add click listeners
// //      // that call handleLanguageChange.
// // };


// --- Main Execution Flow ---
// This block runs automatically when the script is loaded and the DOM is ready.
document.addEventListener('DOMContentLoaded', () => {
    console.log("[Script] DOMContentLoaded fired. Starting main execution flow...");

    // Start loading header and footer components asynchronously
    // Use loadComponent function to fetch and insert HTML
    const headerPromise = loadComponent(HEADER_PLACEHOLDER_ID, HEADER_COMPONENT_URL);
    const footerPromise = loadComponent(FOOTER_PLACEHOLDER_ID, FOOTER_COMPONENT_URL);

    // Use Promise.all to wait for both component loading Promises to settle
    // The .then() block will execute once both are done, regardless of success or failure
    Promise.all([headerPromise, footerPromise]).then(([headerPlaceholder, footerPlaceholder]) => {
        headerFooterLoadAttempted = true; // Mark that we have attempted to load components

        // Check if the components were successfully loaded (placeholder is not null, meaning element was found and fetch succeeded)
        const headerLoaded = !!headerPlaceholder;
        const footerLoaded = !!footerPlaceholder;
        console.log(`[Script] Promise.all finished component loading. Header loaded: ${headerLoaded}, Footer loaded: ${footerLoaded}.`);

        // If header was loaded successfully, initialize its specific logic (menu, search, etc.)
        if (headerLoaded) {
             console.log("[Script] Header component successfully loaded. Initializing header menu logic...");
             // Call the function to initialize header interactions.
             // This function is defined within this script.js file.
             initializeHeaderMenuLogic();
        } else {
             console.error("[Script] Header component failed to load. Header menu logic skipped.");
        }

        // If footer was loaded successfully, update the copyright year
        if (footerLoaded) {
             console.log("[Script] Footer component successfully loaded. Updating footer year...");
             // Check if the updateFooterYear function exists before calling it.
             // This function is assumed to be defined elsewhere (e.g., in this script.js or main.js).
             if (typeof updateFooterYear === 'function') {
                 updateFooterYear();
             } else {
                 console.warn("[Script] updateFooterYear function not found. Footer year update skipped.");
             }
        } else {
             console.error("[Script] Footer component failed to load. Footer year update skipped.");
        }


        // Initialize the language system AFTER components are loaded.
        // Use a small delay to give language.js time to execute and define its functions.
        setTimeout(() => {
            console.log("[Script] Checking for language initialization functions after component load delay...");
            // Check if the main language initialization function exists (assumed from language.js)
            if (typeof window.initializeLanguage === 'function') {
                console.log("[Script] initializeLanguage function found (from language.js).");
                // Check if the language system has already been initialized (to avoid re-initializing)
                // The window.languageInitialized flag is assumed to be set by language.js
                if (!window.languageInitialized) {
                     console.log("[Script] Language system not yet initialized. Calling initializeLanguage...");
                     window.initializeLanguage(); // Call the main language initialization function
                     // After initializeLanguage runs, it should handle applying translations and potentially loading news.
                     // Also, re-attach listeners for language buttons in the loaded header.
                     window.attachLanguageButtonListeners?.(); // Use optional chaining in case the function is not defined
                } else {
                     console.log("[Script] Language already initialized. Re-applying translations and listeners.");
                     // If already initialized, get the current language and re-apply translations.
                     const currentLang = localStorage.getItem('preferredLanguage') || 'vi';
                     // Re-apply translations if the function exists
                     if (typeof window.applyTranslations === 'function') {
                         console.log(`[Script] Re-applying translations for language: ${currentLang}`);
                         window.applyTranslations(currentLang);
                     } else {
                         console.warn("[Script] applyTranslations function not found. Cannot re-apply translations.");
                     }
                     // Reload language-dependent content like news if the container exists
                     if (document.getElementById(NEWS_CONTAINER_ID)) {
                         console.log("[Script] News container found, reloading news after language check.");
                         // The loadInternalNews function needs to be defined elsewhere (e.g., in this script.js or main.js)
                         loadInternalNews();
                     } else {
                         console.log("[Script] News container not found.");
                     }
                     // Gắn lại listeners cho các nút ngôn ngữ trong header đã load
                     window.attachLanguageButtonListeners?.();
                }
            } else {
                console.error("[Script] initializeLanguage function not found after timeout. Language features disabled.");
                // Fallback: If language.js failed to load, try to load news with default language if the container exists.
                if (document.getElementById(NEWS_CONTAINER_ID)) {
                    console.warn("[Script] Language system failed, attempting to load news with default language (VI).");
                     // Define a temporary translations object if the global one doesn't exist
                     if (typeof window.translations === 'undefined') {
                         window.translations = { vi: { read_more: 'Đọc thêm →', news_title_na: 'Tiêu đề không có sẵn', news_image_alt: 'Hình ảnh tin tức', no_news: 'Chưa có tin tức nào.', news_load_error: 'Không thể tải tin tức.', loading_news: 'Đang tải tin tức...' } };
                         console.log("[Script] Using temporary default translations for news.");
                     } else {
                         console.log("[Script] Existing translations object found, using it for news.");
                     }
                    loadInternalNews(); // Call the function to load news
                } else {
                    console.log("[Script] News container not found, skipping news load.");
                }
            }

            // Attach language switcher events (if the function exists in language.js)
            if (typeof window.attachLanguageSwitcherEvents === 'function') {
                console.log("[Script] Attaching language switcher events from language.js...");
                window.attachLanguageSwitcherEvents();
            } else {
                console.warn("[Script] window.attachLanguageSwitcherEvents function not found from language.js.");
            }
        }, 200); // Delay in milliseconds


    }).catch(error => {
        // Catch any uncaught errors from the Promises in Promise.all
        console.error("[Script] Uncaught error in Promise.all during component loading:", error);
         headerFooterLoadAttempted = true; // Mark that we have attempted to load
         // Display generic error messages in placeholders if they are still empty
         const headerPlaceholder = document.getElementById(HEADER_PLACEHOLDER_ID);
         if (headerPlaceholder && headerPlaceholder.innerHTML.trim() === '') { // Check if innerHTML is empty or just whitespace
             headerPlaceholder.innerHTML = `<p class="text-red-500 text-center p-4">Không thể tải Header do lỗi không xác định.</p>`;
         }
         const footerPlaceholder = document.getElementById(FOOTER_PLACEHOLDER_ID);
         if (footerPlaceholder && footerPlaceholder.innerHTML.trim() === '') { // Check if innerHTML is empty or just whitespace
              footerPlaceholder.innerHTML = `<p class="text-red-500 text-center p-4">Không thể tải Footer do lỗi không xác định.</p>`;
         }
    });

    // --- Page-Specific Initializations ---
    // These initializations should run after DOMContentLoaded but may not depend on header/footer being fully loaded.
    const bodyId = document.body.id; // Get the ID of the body element

    // Initialize RSS feed loading if the container element exists
    if (document.getElementById('vnexpress-rss-feed')) {
        console.log("[Script] RSS container found. Assuming rss-loader.js handles this initialization.");
        // The rss-loader.js script is expected to either run automatically or have its own initialization function.
    }

    // Initialize the Placement Test logic if the body ID matches and the function exists
    if (bodyId === 'page-placement' && typeof initializePlacementTest === 'function') {
        console.log("[Script] Initializing placement test for page-placement.");
        // The initializePlacementTest function is expected to be defined in a separate JS file for this specific page.
        initializePlacementTest();
    }

    console.log("[Script] Initial DOMContentLoaded execution flow finished.");
});

// --- Definition of Global Functions (if they are not defined elsewhere) ---
// The following functions are called within the script.
// If they are defined in other JS files (like main.js or language.js) and those files
// are loaded correctly before this script, you do NOT need to uncomment and define them here.
// If they are NOT defined elsewhere or are not globally accessible, uncomment and implement them here.

// Example definitions (uncomment and implement if needed):

/**
 * Initializes sticky/shrinking navbar behavior based on scroll position.
 * @param {HTMLElement} navbarElement - The main header element.
 */
// function initializeStickyNavbar(navbarElement) {
//     console.log("[Script] (Global/Assumed) initializeStickyNavbar called.");
//     if (!navbarElement) return;
//     const shrinkThreshold = 50; // Pixels scrolled before shrinking
//     let lastScrollTop = 0; // To detect scroll direction

//     const handleScroll = () => {
//         const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

//         // Add/remove 'shrink' class based on scroll position
//         navbarElement.classList.toggle('shrink', scrollTop > shrinkThreshold);

//         // Optional: Hide/show navbar on scroll down/up
//         // This requires additional CSS for top positioning transition
//         // if (scrollTop > lastScrollTop && scrollTop > navbarElement.offsetHeight) {
//         //     // Scrolling down - hide navbar
//         //     navbarElement.style.top = `-${navbarElement.offsetHeight}px`;
//         // } else {
//         //     // Scrolling up or at the top
//         //     navbarElement.style.top = '0';
//         // }

//         lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
//     };

//     // Add the scroll event listener
//     window.addEventListener('scroll', handleScroll, { passive: true });
//     // Run the handler once on load to set the initial state
//     handleScroll();
// }

/**
 * Highlights the active menu item in the header based on the current page URL.
 * @param {HTMLElement} headerElement - The main header element.
 */
// function initializeActiveMenuHighlighting(headerElement) {
//     console.log("[Script] (Global/Assumed) initializeActiveMenuHighlighting called.");
//     if (!headerElement) return;

//     // Get the current page's path, removing hash and query parameters
//     const currentHref = window.location.href.split('#')[0].split('?')[0];

//     // Select all navigation links within the header (desktop and mobile)
//     const menuLinks = headerElement.querySelectorAll('.nav-link[href], .submenu a[href], .sub-submenu a[href], #mobile-menu-panel a[href]');

//     // Helper function to normalize URLs for comparison (remove .html, trailing slash, etc.)
//     const normalizeUrl = url => {
//         try {
//             const urlObj = new URL(url, window.location.origin);
//             let path = urlObj.pathname;
//             // Remove trailing slash unless it's the root path "/"
//             if (path !== '/' && path.endsWith('/')) {
//                 path = path.slice(0, -1);
//             }
//             // Remove .html extension
//             if (path.endsWith('.html')) {
//                 path = path.slice(0, -'.html'.length);
//             }
//             // Treat "/index" the same as "/"
//             if (path === '/index' || path === '') {
//                 return '/';
//             }
//             return path;
//         } catch (e) {
//             console.warn(`[Script] Invalid URL during normalization: ${url}`, e);
//             return null; // Return null for invalid URLs
//         }
//     };

//     const normalizedCurrentPath = normalizeUrl(currentHref);

//     if (!normalizedCurrentPath) {
//          console.warn("[Script] Could not normalize current page URL. Active menu highlighting skipped.");
//          return; // Cannot proceed if current URL is invalid
//     }
//      console.log(`[Script] Normalized current path: ${normalizedCurrentPath}`);


//     // Remove any existing active classes first
//     menuLinks.forEach(link => {
//         link.classList.remove('active-menu-item');
//         // Also remove active classes from parent toggles
//         const parentToggle = link.closest('.mobile-menu-item, .sub-submenu-container, .main-menu-item')?.querySelector(':scope > button.mobile-submenu-toggle, :scope > button.nav-link');
//         parentToggle?.classList.remove('active-parent-item');
//     });

//      // Collapse all mobile submenus initially
//      headerElement.querySelectorAll('#mobile-menu-panel .mobile-menu-item.open').forEach(item => {
//          item.classList.remove('open');
//          const submenu = item.querySelector(':scope > .mobile-submenu');
//          if (submenu) {
//              submenu.style.maxHeight = '0';
//              submenu.style.overflow = 'hidden';
//          }
//          const toggleButton = item.querySelector(':scope > button.mobile-submenu-toggle');
//          if(toggleButton) toggleButton.setAttribute('aria-expanded', 'false');
//      });


//     let bestMatch = { link: null, specificity: -1 }; // Track the best matching link and its specificity

//     // Find the best matching link
//     menuLinks.forEach(link => {
//         const linkHref = link.getAttribute('href');
//         // Skip invalid or internal-only links
//         if (!linkHref || linkHref === '#' || linkHref.startsWith('javascript:')) {
//             return;
//         }

//         const normalizedLinkPath = normalizeUrl(linkHref);
//         if (!normalizedLinkPath) {
//             return; // Skip if link URL is invalid
//         }

//         let currentSpecificity = -1;

//         try {
//              // Check for exact match of full absolute URL (highest specificity)
//              const absoluteLinkHref = new URL(linkHref, window.location.origin).href.split('#')[0].split('?')[0];
//              if (absoluteLinkHref === currentHref) {
//                  currentSpecificity = 2;
//              }
//         } catch (e) {
//              // Ignore error if URL construction fails
//         }


//         // If not an exact absolute URL match, check for normalized path match
//         if (currentSpecificity < 2 && normalizedLinkPath === normalizedCurrentPath) {
//             // Assign specificity: 1 for root, 0 for others
//             currentSpecificity = normalizedCurrentPath === '/' ? 1 : 0;
//         }

//         // Update best match if current link is a better match
//         if (currentSpecificity > bestMatch.specificity) {
//             bestMatch = { link, specificity: currentSpecificity };
//         } else if (currentSpecificity === bestMatch.specificity && currentSpecificity >= 0) {
//             // If specificity is the same, prefer longer paths (more specific links)
//             const currentBestPath = normalizeUrl(bestMatch.link.getAttribute('href'));
//             if (currentBestPath && normalizedLinkPath.length > currentBestPath.length) {
//                 bestMatch = { link, specificity: currentSpecificity };
//             }
//         }
//     });

//     // Apply active classes if a best match was found
//     if (bestMatch.link) {
//         const activeLink = bestMatch.link;
//         console.log(`[Script] Active menu item found:`, activeLink);
//         activeLink.classList.add('active-menu-item');

//         // Traverse up the DOM tree to add active classes to parent toggles and open mobile submenus
//         let element = activeLink;
//         while (element && element !== headerElement) {
//             // Find the closest parent menu item container (li, div)
//             const parentMenuItem = element.closest('.mobile-menu-item, .sub-submenu-container, .main-menu-item');

//             if (!parentMenuItem) break; // Stop if no more parent menu items found

//             // Find the toggle button directly within this parent menu item
//             const parentToggle = parentMenuItem.querySelector(':scope > button.mobile-submenu-toggle, :scope > button.nav-link');

//             // Add active class to the parent toggle button
//             if (parentToggle) {
//                  parentToggle.classList.add('active-parent-item');
//                  console.log("[Script] Added active-parent-item to:", parentToggle);
//             }


//             // If it's a mobile menu item and not already open, open its submenu
//             if (parentMenuItem.classList.contains('mobile-menu-item') && !parentMenuItem.classList.contains('open')) {
//                 parentMenuItem.classList.add('open'); // Add 'open' class
//                 const submenu = parentMenuItem.querySelector(':scope > .mobile-submenu'); // Find the submenu
//                 if (submenu) {
//                     // Expand the submenu
//                     submenu.style.maxHeight = `${submenu.scrollHeight}px`;
//                     submenu.style.overflow = 'visible'; // Make content visible
//                     console.log(`[Script] Opened mobile submenu for active item:`, submenu);
//                 }
//                 // Update aria-expanded for the mobile toggle button
//                 const mobileToggle = parentMenuItem.querySelector(':scope > button.mobile-submenu-toggle');
//                 if(mobileToggle) mobileToggle.setAttribute('aria-expanded', 'true');
//             }

//             // Move up to the next parent menu item container
//             element = parentMenuItem.parentElement;
//         }
//     } else {
//         console.log("[Script] No active menu item found for the current URL.");
//     }
// }


// /**
//  * Clears previously highlighted search results (if client-side search is implemented).
//  * (Assuming this function is needed and not defined elsewhere globally)
//  */
// function clearSearchHighlights() {
//      console.log("[Script] (Global/Assumed) clearSearchHighlights called.");
//      const mainContent = document.querySelector('main');
//      if (!mainContent) return;

//      // Find all <mark> elements with the specific highlight class
//      const highlights = mainContent.querySelectorAll(`mark.${SEARCH_HIGHLIGHT_CLASS}`);

//      highlights.forEach(mark => {
//          const parent = mark.parentNode;
//          if (parent) {
//              // Move all children of the <mark> element back to its parent
//              while (mark.firstChild) {
//                  parent.insertBefore(mark.firstChild, mark);
//              }
//              // Remove the empty <mark> element
//              parent.removeChild(mark);
//              // Normalize the parent node to merge adjacent text nodes that were split
//              parent.normalize();
//          }
//      });
//      console.log(`[Script] Removed ${highlights.length} search highlights.`);
// }


// /**
//  * Performs a simple client-side search within the <main> element and highlights matches.
//  * (Assuming this function is needed and not defined elsewhere globally)
//  * @param {string} query - The search query string.
//  */
// function performSearch(query) {
//     console.log(`[Script] (Global/Assumed) performSearch called with query: "${query}"`);
//     // Clear previous highlights before performing a new search
//     clearSearchHighlights();

//     // Get the main content area to search within
//     const mainContent = document.querySelector('main');

//     // Validate the query and the search area
//     if (!mainContent || !query || query.trim().length < 2) {
//          console.log("[Script] Search query too short or no main content to search.");
//          return; // Exit if query is invalid or no content area
//     }

//     const queryLower = query.trim().toLowerCase(); // Normalize query
//     let matchCount = 0; // Counter for found matches
//     let firstMatchElement = null; // To store the first found match element for scrolling

//     // Recursive function to traverse the DOM tree and search within text nodes
//     function searchNodes(node) {
//         // Check if the current node is a text node
//         if (node.nodeType === Node.TEXT_NODE) {
//             const text = node.textContent;
//             const textLower = text.toLowerCase();
//             let lastIndex = 0; // Start search from this index in the current text node

//             // Loop to find all occurrences of the query within this text node
//             while (true) {
//                 const matchIndex = textLower.indexOf(queryLower, lastIndex);

//                 // If no more matches are found in this text node, break the loop
//                 if (matchIndex === -1) break;

//                 // Extract the matching text from the original text node
//                 const matchText = text.substring(matchIndex, matchIndex + query.length);

//                 // Create a <mark> element to wrap the matching text
//                 const mark = document.createElement('mark');
//                 mark.className = SEARCH_HIGHLIGHT_CLASS; // Add the highlight class
//                 mark.textContent = matchText; // Set the matching text as the content of <mark>

//                 // Split the current text node into two parts at the match index:
//                 // 1. The part before the match (remains the original 'node')
//                 // 2. The part from the match onwards (returned by splitText, let's call it 'after')
//                 const after = node.splitText(matchIndex);

//                 // Split the 'after' part again to separate the matched text from the text after the match
//                 // The 'after' node now contains the matched text followed by the text after the match.
//                 // We take the substring starting from the query length to get just the text after the match.
//                 after.textContent = after.textContent.substring(query.length);

//                 // Insert the created <mark> element between the part before the match ('node') and the part after the match ('after')
//                 node.parentNode.insertBefore(mark, after);

//                 // Increment the match count
//                 matchCount++;

//                 // If this is the first match found, store the <mark> element
//                 if (!firstMatchElement) {
//                     firstMatchElement = mark;
//                 }

//                 // Continue the search from the beginning of the new 'after' node
//                 // This is important because splitText modifies the node in place and returns the subsequent node.
//                 node = after;
//                 lastIndex = 0; // Always start from the beginning of the new node
//                 // Cần reset walker hoặc tạo walker mới nếu cấu trúc DOM thay đổi đáng kể
//                 // Cách đơn giản hơn là duyệt thủ công như vòng lặp while(true) ở trên
//                 // hoặc sử dụng một kỹ thuật khác nếu DOM thay đổi nhiều.
//                 // Với việc chèn <mark>, cấu trúc DOM thay đổi, nên TreeWalker ban đầu có thể không còn chính xác.
//                 // Vòng lặp while(true) với splitText và insertBefore là cách phổ biến trong trường hợp này.
//                 // Quay lại cách duyệt thủ công đơn giản hơn:
//                 // (Đoạn code này đã được triển khai trong hàm performSearch ở trên)
//             }
//         }
//         // If the node is an element node (and not a script, style, or mark tag),
//         // recursively call searchNodes for its child nodes.
//         else if (node.nodeType === Node.ELEMENT_NODE &&
//                  node.nodeName !== 'SCRIPT' &&
//                  node.nodeName !== 'STYLE' &&
//                  node.nodeName !== 'MARK') // Avoid searching inside scripts, styles, or already highlighted marks
//         {
//             // Iterate over a static copy of childNodes because searchNodes might modify the child list
//             Array.from(node.childNodes).forEach(searchNodes);
//         }
//     }

//     // Start the recursive search from the main content element
//     searchNodes(mainContent);

//     console.log(`[Script] Search completed. Found ${matchCount} matches.`);

//     // Cuộn the first found match into view if any matches were found
//     if (firstMatchElement) {
//         console.log("[Script] Scrolling to the first search result.");
//         firstMatchElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
//     } else {
//          console.log("[Script] No search results found.");
//          // Optional: Display a message to the user indicating no results
//     }
// }

// /**
//  * Updates the current year displayed in the footer element.
//  * (Assuming this function is needed and not defined elsewhere globally)
//  */
// function updateFooterYear() {
//     console.log("[Script] (Global/Assumed) updateFooterYear called.");
//     // Find the element intended to display the current year in the footer
//     const yearElement = document.getElementById(FOOTER_YEAR_ID);

//     // If the element is found, update its text content to the current year
//     if (yearElement) {
//         yearElement.textContent = new Date().getFullYear();
//         console.log("[Script] Footer year updated successfully.");
//     } else {
//         console.warn(`[Script] Footer year element (#${FOOTER_YEAR_ID}) not found.`);
//     }
// }

// /**
//  * Initializes the language switching functionality.
//  * This function is expected to be defined in language.js.
//  * (Assuming this function exists and is attached to the window or called globally)
//  */
// // window.initializeLanguage = function() {
// //     console.log("[Script] (Global/Assumed) initializeLanguage called.");
// //     // Implementation details from your language.js file
// //     // This function should typically:
// //     // 1. Load translation data.
// //     // 2. Detect user's preferred language (e.g., from localStorage or browser settings).
// //     // 3. Apply translations to the page content.
// //     // 4. Set window.languageInitialized = true;
// //     // 5. Potentially call loadInternalNews() if news is language-dependent.
// //     // 6. Potentially attach event listeners to language switcher buttons (though script.js also tries this).
// // };

// /**
//  * Handles the event when a language button is clicked.
//  * This function is expected to be defined in language.js.
//  * (Assuming this function exists and is attached to the window or called globally)
//  * @param {Event} event - The click event object.
//  */
// // window.handleLanguageChange = function(event) {
// //     console.log("[Script] (Global/Assumed) handleLanguageChange called.");
// //     // Implementation details from your language.js file
// //     // This function should typically:
// //     // 1. Get the selected language from the button's data attribute (e.g., event.target.dataset.lang).
// //     // 2. Save the preferred language to localStorage.
// //     // 3. Apply translations for the new language to the page content.
// //     // 4. Update the displayed language/flag in the header.
// //     // 5. Potentially reload language-dependent content like news.
// // };

// /**
//  * Attaches event listeners to language switcher buttons.
//  * This function might be defined in language.js or script.js.
//  * (Assuming this function exists and is attached to the window or called globally)
//  */
// // window.attachLanguageSwitcherEvents = function() {
// //      console.log("[Script] (Global/Assumed) attachLanguageSwitcherEvents called.");
// //      // Implementation details...
// //      // This function should find the language buttons and add click listeners
// //      // that call handleLanguageChange.
// // };


// --- Main Execution Flow ---
// This block runs automatically when the script is loaded and the DOM is ready.
document.addEventListener('DOMContentLoaded', () => {
    console.log("[Script] DOMContentLoaded fired. Starting main execution flow...");

    // Start loading header and footer components asynchronously
    // Use loadComponent function to fetch and insert HTML
    const headerPromise = loadComponent(HEADER_PLACEHOLDER_ID, HEADER_COMPONENT_URL);
    const footerPromise = loadComponent(FOOTER_PLACEHOLDER_ID, FOOTER_COMPONENT_URL);

    // Use Promise.all to wait for both component loading Promises to settle
    // The .then() block will execute once both are done, regardless of success or failure
    Promise.all([headerPromise, footerPromise]).then(([headerPlaceholder, footerPlaceholder]) => {
        headerFooterLoadAttempted = true; // Mark that we have attempted to load components

        // Check if the components were successfully loaded (placeholder is not null, meaning element was found and fetch succeeded)
        const headerLoaded = !!headerPlaceholder;
        const footerLoaded = !!footerPlaceholder;
        console.log(`[Script] Promise.all finished component loading. Header loaded: ${headerLoaded}, Footer loaded: ${footerLoaded}.`);

        // If header was loaded successfully, initialize its specific logic (menu, search, etc.)
        if (headerLoaded) {
             console.log("[Script] Header component successfully loaded. Initializing header menu logic...");
             // Call the function to initialize header interactions.
             // This function is defined within this script.js file.
             initializeHeaderMenuLogic();
        } else {
             console.error("[Script] Header component failed to load. Header menu logic skipped.");
        }

        // If footer was loaded successfully, update the copyright year
        if (footerLoaded) {
             console.log("[Script] Footer component successfully loaded. Updating footer year...");
             // Check if the updateFooterYear function exists before calling it.
             // This function is assumed to be defined elsewhere (e.g., in this script.js or main.js).
             if (typeof updateFooterYear === 'function') {
                 updateFooterYear();
             } else {
                 console.warn("[Script] updateFooterYear function not found. Footer year update skipped.");
             }
        } else {
             console.error("[Script] Footer component failed to load. Footer year update skipped.");
        }


        // Initialize the language system AFTER components are loaded.
        // Use a small delay to give language.js time to execute and define its functions.
        setTimeout(() => {
            console.log("[Script] Checking for language initialization functions after component load delay...");
            // Check if the main language initialization function exists (assumed from language.js)
            if (typeof window.initializeLanguage === 'function') {
                console.log("[Script] initializeLanguage function found (from language.js).");
                // Check if the language system has already been initialized (to avoid re-initializing)
                // The window.languageInitialized flag is assumed to be set by language.js
                if (!window.languageInitialized) {
                     console.log("[Script] Language system not yet initialized. Calling initializeLanguage...");
                     window.initializeLanguage(); // Call the main language initialization function
                     // After initializeLanguage runs, it should handle applying translations and potentially loading news.
                     // Also, re-attach listeners for language buttons in the loaded header.
                     window.attachLanguageButtonListeners?.(); // Use optional chaining in case the function is not defined
                } else {
                     console.log("[Script] Language already initialized. Re-applying translations and listeners.");
                     // If already initialized, get the current language and re-apply translations.
                     const currentLang = localStorage.getItem('preferredLanguage') || 'vi';
                     // Re-apply translations if the function exists
                     if (typeof window.applyTranslations === 'function') {
                         console.log(`[Script] Re-applying translations for language: ${currentLang}`);
                         window.applyTranslations(currentLang);
                     } else {
                         console.warn("[Script] applyTranslations function not found. Cannot re-apply translations.");
                     }
                     // Reload language-dependent content like news if the container exists
                     if (document.getElementById(NEWS_CONTAINER_ID)) {
                         console.log("[Script] News container found, reloading news after language check.");
                         // The loadInternalNews function needs to be defined elsewhere (e.g., in this script.js or main.js)
                         loadInternalNews();
                     } else {
                         console.log("[Script] News container not found.");
                     }
                     // Gắn lại listeners cho các nút ngôn ngữ trong header đã load
                     window.attachLanguageButtonListeners?.();
                }
            } else {
                console.error("[Script] initializeLanguage function not found after timeout. Language features disabled.");
                // Fallback: If language.js failed to load, try to load news with default language if the container exists.
                if (document.getElementById(NEWS_CONTAINER_ID)) {
                    console.warn("[Script] Language system failed, attempting to load news with default language (VI).");
                     // Define a temporary translations object if the global one doesn't exist
                     if (typeof window.translations === 'undefined') {
                         window.translations = { vi: { read_more: 'Đọc thêm →', news_title_na: 'Tiêu đề không có sẵn', news_image_alt: 'Hình ảnh tin tức', no_news: 'Chưa có tin tức nào.', news_load_error: 'Không thể tải tin tức.', loading_news: 'Đang tải tin tức...' } };
                         console.log("[Script] Using temporary default translations for news.");
                     } else {
                         console.log("[Script] Existing translations object found, using it for news.");
                     }
                    loadInternalNews(); // Call the function to load news
                } else {
                    console.log("[Script] News container not found, skipping news load.");
                }
            }

            // Attach language switcher events (if the function exists in language.js)
            if (typeof window.attachLanguageSwitcherEvents === 'function') {
                console.log("[Script] Attaching language switcher events from language.js...");
                window.attachLanguageSwitcherEvents();
            } else {
                console.warn("[Script] window.attachLanguageSwitcherEvents function not found from language.js.");
            }
        }, 200); // Delay in milliseconds


    }).catch(error => {
        // Catch any uncaught errors from the Promises in Promise.all
        console.error("[Script] Uncaught error in Promise.all during component loading:", error);
         headerFooterLoadAttempted = true; // Mark that we have attempted to load
         // Display generic error messages in placeholders if they are still empty
         const headerPlaceholder = document.getElementById(HEADER_PLACEHOLDER_ID);
         if (headerPlaceholder && headerPlaceholder.innerHTML.trim() === '') { // Check if innerHTML is empty or just whitespace
             headerPlaceholder.innerHTML = `<p class="text-red-500 text-center p-4">Không thể tải Header do lỗi không xác định.</p>`;
         }
         const footerPlaceholder = document.getElementById(FOOTER_PLACEHOLDER_ID);
         if (footerPlaceholder && footerPlaceholder.innerHTML.trim() === '') { // Check if innerHTML is empty or just whitespace
              footerPlaceholder.innerHTML = `<p class="text-red-500 text-center p-4">Không thể tải Footer do lỗi không xác định.</p>`;
         }
    });

    // --- Page-Specific Initializations ---
    // These initializations should run after DOMContentLoaded but may not depend on header/footer being fully loaded.
    const bodyId = document.body.id; // Get the ID of the body element

    // Initialize RSS feed loading if the container element exists
    if (document.getElementById('vnexpress-rss-feed')) {
        console.log("[Script] RSS container found. Assuming rss-loader.js handles this initialization.");
        // The rss-loader.js script is expected to either run automatically or have its own initialization function.
    }

    // Initialize the Placement Test logic if the body ID matches and the function exists
    if (bodyId === 'page-placement' && typeof initializePlacementTest === 'function') {
        console.log("[Script] Initializing placement test for page-placement.");
        // The initializePlacementTest function is expected to be defined in a separate JS file for this specific page.
        initializePlacementTest();
    }

    console.log("[Script] Initial DOMContentLoaded execution flow finished.");
});

// --- Definition of Global Functions (if they are not defined elsewhere) ---
// The following functions are called within the script.
// If they are defined in other JS files (like main.js or language.js) and those files
// are loaded correctly before this script, you do NOT need to uncomment and define them here.
// If they are NOT defined elsewhere or are not globally accessible, uncomment and implement them here.

// Example definitions (uncomment and implement if needed):

/**
 * Initializes sticky/shrinking navbar behavior based on scroll position.
 * @param {HTMLElement} navbarElement - The main header element.
 */
// function initializeStickyNavbar(navbarElement) {
//     console.log("[Script] (Global/Assumed) initializeStickyNavbar called.");
//     if (!navbarElement) return;
//     const shrinkThreshold = 50; // Pixels scrolled before shrinking
//     let lastScrollTop = 0; // To detect scroll direction

//     const handleScroll = () => {
//         const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

//         // Add/remove 'shrink' class based on scroll position
//         navbarElement.classList.toggle('shrink', scrollTop > shrinkThreshold);

//         // Optional: Hide/show navbar on scroll down/up
//         // This requires additional CSS for top positioning transition
//         // if (scrollTop > lastScrollTop && scrollTop > navbarElement.offsetHeight) {
//         //     // Scrolling down - hide navbar
//         //     navbarElement.style.top = `-${navbarElement.offsetHeight}px`;
//         // } else {
//         //     // Scrolling up or at the top
//         //     navbarElement.style.top = '0';
//         // }

//         lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
//     };

//     // Add the scroll event listener
//     window.addEventListener('scroll', handleScroll, { passive: true });
//     // Run the handler once on load to set the initial state
//     handleScroll();
// }

/**
 * Highlights the active menu item in the header based on the current page URL.
 * @param {HTMLElement} headerElement - The main header element.
 */
// function initializeActiveMenuHighlighting(headerElement) {
//     console.log("[Script] (Global/Assumed) initializeActiveMenuHighlighting called.");
//     if (!headerElement) return;

//     // Get the current page's path, removing hash and query parameters
//     const currentHref = window.location.href.split('#')[0].split('?')[0];

//     // Select all navigation links within the header (desktop and mobile)
//     const menuLinks = headerElement.querySelectorAll('.nav-link[href], .submenu a[href], .sub-submenu a[href], #mobile-menu-panel a[href]');

//     // Helper function to normalize URLs for comparison (remove .html, trailing slash, etc.)
//     const normalizeUrl = url => {
//         try {
//             const urlObj = new URL(url, window.location.origin);
//             let path = urlObj.pathname;
//             // Remove trailing slash unless it's the root path "/"
//             if (path !== '/' && path.endsWith('/')) {
//                 path = path.slice(0, -1);
//             }
//             // Remove .html extension
//             if (path.endsWith('.html')) {
//                 path = path.slice(0, -'.html'.length);
//             }
//             // Treat "/index" the same as "/"
//             if (path === '/index' || path === '') {
//                 return '/';
//             }
//             return path;
//         } catch (e) {
//             console.warn(`[Script] Invalid URL during normalization: ${url}`, e);
//             return null; // Return null for invalid URLs
//         }
//     };

//     const normalizedCurrentPath = normalizeUrl(currentHref);

//     if (!normalizedCurrentPath) {
//          console.warn("[Script] Could not normalize current page URL. Active menu highlighting skipped.");
//          return; // Cannot proceed if current URL is invalid
//     }
//      console.log(`[Script] Normalized current path: ${normalizedCurrentPath}`);


//     // Remove any existing active classes first
//     menuLinks.forEach(link => {
//         link.classList.remove('active-menu-item');
//         // Also remove active classes from parent toggles
//         const parentToggle = link.closest('.mobile-menu-item, .sub-submenu-container, .main-menu-item')?.querySelector(':scope > button.mobile-submenu-toggle, :scope > button.nav-link');
//         parentToggle?.classList.remove('active-parent-item');
//     });

//      // Collapse all mobile submenus initially
//      headerElement.querySelectorAll('#mobile-menu-panel .mobile-menu-item.open').forEach(item => {
//          item.classList.remove('open');
//          const submenu = item.querySelector(':scope > .mobile-submenu');
//          if (submenu) {
//              submenu.style.maxHeight = '0';
//              submenu.style.overflow = 'hidden';
//          }
//          const toggleButton = item.querySelector(':scope > button.mobile-submenu-toggle');
//          if(toggleButton) toggleButton.setAttribute('aria-expanded', 'false');
//      });


//     let bestMatch = { link: null, specificity: -1 }; // Track the best matching link and its specificity

//     // Find the best matching link
//     menuLinks.forEach(link => {
//         const linkHref = link.getAttribute('href');
//         // Skip invalid or internal-only links
//         if (!linkHref || linkHref === '#' || linkHref.startsWith('javascript:')) {
//             return;
//         }

//         const normalizedLinkPath = normalizeUrl(linkHref);
//         if (!normalizedLinkPath) {
//             return; // Skip if link URL is invalid
//         }

//         let currentSpecificity = -1;

//         try {
//              // Check for exact match of full absolute URL (highest specificity)
//              const absoluteLinkHref = new URL(linkHref, window.location.origin).href.split('#')[0].split('?')[0];
//              if (absoluteLinkHref === currentHref) {
//                  currentSpecificity = 2;
//              }
//         } catch (e) {
//              // Ignore error if URL construction fails
//         }


//         // If not an exact absolute URL match, check for normalized path match
//         if (currentSpecificity < 2 && normalizedLinkPath === normalizedCurrentPath) {
//             // Assign specificity: 1 for root, 0 for others
//             currentSpecificity = normalizedCurrentPath === '/' ? 1 : 0;
//         }

//         // Update best match if current link is a better match
//         if (currentSpecificity > bestMatch.specificity) {
//             bestMatch = { link, specificity: currentSpecificity };
//         } else if (currentSpecificity === bestMatch.specificity && currentSpecificity >= 0) {
//             // If specificity is the same, prefer longer paths (more specific links)
//             const currentBestPath = normalizeUrl(bestMatch.link.getAttribute('href'));
//             if (currentBestPath && normalizedLinkPath.length > currentBestPath.length) {
//                 bestMatch = { link, specificity: currentSpecificity };
//             }
//         }
//     });

//     // Apply active classes if a best match was found
//     if (bestMatch.link) {
//         const activeLink = bestMatch.link;
//         console.log(`[Script] Active menu item found:`, activeLink);
//         activeLink.classList.add('active-menu-item');

//         // Traverse up the DOM tree to add active classes to parent toggles and open mobile submenus
//         let element = activeLink;
//         while (element && element !== headerElement) {
//             // Find the closest parent menu item container (li, div)
//             const parentMenuItem = element.closest('.mobile-menu-item, .sub-submenu-container, .main-menu-item');

//             if (!parentMenuItem) break; // Stop if no more parent menu items found

//             // Find the toggle button directly within this parent menu item
//             const parentToggle = parentMenuItem.querySelector(':scope > button.mobile-submenu-toggle, :scope > button.nav-link');

//             // Add active class to the parent toggle button
//             if (parentToggle) {
//                  parentToggle.classList.add('active-parent-item');
//                  console.log("[Script] Added active-parent-item to:", parentToggle);
//             }


//             // If it's a mobile menu item and not already open, open its submenu
//             if (parentMenuItem.classList.contains('mobile-menu-item') && !parentMenuItem.classList.contains('open')) {
//                 parentMenuItem.classList.add('open'); // Add 'open' class
//                 const submenu = parentMenuItem.querySelector(':scope > .mobile-submenu'); // Find the submenu
//                 if (submenu) {
//                     // Expand the submenu
//                     submenu.style.maxHeight = `${submenu.scrollHeight}px`;
//                     submenu.style.overflow = 'visible'; // Make content visible
//                     console.log(`[Script] Opened mobile submenu for active item:`, submenu);
//                 }
//                 // Update aria-expanded for the mobile toggle button
//                 const mobileToggle = parentMenuItem.querySelector(':scope > button.mobile-submenu-toggle');
//                 if(mobileToggle) mobileToggle.setAttribute('aria-expanded', 'true');
//             }

//             // Move up to the next parent menu item container
//             element = parentMenuItem.parentElement;
//         }
//     } else {
//         console.log("[Script] No active menu item found for the current URL.");
//     }
// }


// /**
//  * Clears previously highlighted search results (if client-side search is implemented).
//  * (Assuming this function is needed and not defined elsewhere globally)
//  */
// function clearSearchHighlights() {
//      console.log("[Script] (Global/Assumed) clearSearchHighlights called.");
//      const mainContent = document.querySelector('main');
//      if (!mainContent) return;

//      // Find all <mark> elements with the specific highlight class
//      const highlights = mainContent.querySelectorAll(`mark.${SEARCH_HIGHLIGHT_CLASS}`);

//      highlights.forEach(mark => {
//          const parent = mark.parentNode;
//          if (parent) {
//              // Move all children of the <mark> element back to its parent
//              while (mark.firstChild) {
//                  parent.insertBefore(mark.firstChild, mark);
//              }
//              // Remove the empty <mark> element
//              parent.removeChild(mark);
//              // Normalize the parent node to merge adjacent text nodes that were split
//              parent.normalize();
//          }
//      });
//      console.log(`[Script] Removed ${highlights.length} search highlights.`);
// }


// /**
//  * Performs a simple client-side search within the <main> element and highlights matches.
//  * (Assuming this function is needed and not defined elsewhere globally)
//  * @param {string} query - The search query string.
//  */
// function performSearch(query) {
//     console.log(`[Script] (Global/Assumed) performSearch called with query: "${query}"`);
//     // Clear previous highlights before performing a new search
//     clearSearchHighlights();

//     // Get the main content area to search within
//     const mainContent = document.querySelector('main');

//     // Validate the query and the search area
//     if (!mainContent || !query || query.trim().length < 2) {
//          console.log("[Script] Search query too short or no main content to search.");
//          return; // Exit if query is invalid or no content area
//     }

//     const queryLower = query.trim().toLowerCase(); // Normalize query
//     let matchCount = 0; // Counter for found matches
//     let firstMatchElement = null; // To store the first found match element for scrolling

//     // Recursive function to traverse the DOM tree and search within text nodes
//     function searchNodes(node) {
//         // Check if the current node is a text node
//         if (node.nodeType === Node.TEXT_NODE) {
//             const text = node.textContent;
//             const textLower = text.toLowerCase();
//             let lastIndex = 0; // Start search from this index in the current text node

//             // Loop to find all occurrences of the query within this text node
//             while (true) {
//                 const matchIndex = textLower.indexOf(queryLower, lastIndex);

//                 // If no more matches are found in this text node, break the loop
//                 if (matchIndex === -1) break;

//                 // Extract the matching text from the original text node
//                 const matchText = text.substring(matchIndex, matchIndex + query.length);

//                 // Create a <mark> element to wrap the matching text
//                 const mark = document.createElement('mark');
//                 mark.className = SEARCH_HIGHLIGHT_CLASS; // Add the highlight class
//                 mark.textContent = matchText; // Set the matching text as the content of <mark>

//                 // Split the current text node into two parts at the match index:
//                 // 1. The part before the match (remains the original 'node')
//                 // 2. The part from the match onwards (returned by splitText, let's call it 'after')
//                 const after = node.splitText(matchIndex);

//                 // Split the 'after' part again to separate the matched text from the text after the match
//                 // The 'after' node now contains the matched text followed by the text after the match.
//                 // We take the substring starting from the query length to get just the text after the match.
//                 after.textContent = after.textContent.substring(query.length);

//                 // Insert the created <mark> element between the part before the match ('node') and the part after the match ('after')
//                 node.parentNode.insertBefore(mark, after);

//                 // Increment the match count
//                 matchCount++;

//                 // If this is the first match found, store the <mark> element
//                 if (!firstMatchElement) {
//                     firstMatchElement = mark;
//                 }

//                 // Continue the search from the beginning of the new 'after' node
//                 // This is important because splitText modifies the node in place and returns the subsequent node.
//                 node = after;
//                 lastIndex = 0; // Always start from the beginning of the new node
//                 // Cần reset walker hoặc tạo walker mới nếu cấu trúc DOM thay đổi đáng kể
//                 // Cách đơn giản hơn là duyệt thủ công như vòng lặp while(true) ở trên
//                 // hoặc sử dụng một kỹ thuật khác nếu DOM thay đổi nhiều.
//                 // Với việc chèn <mark>, cấu trúc DOM thay đổi, nên TreeWalker ban đầu có thể không còn chính xác.
//                 // Vòng lặp while(true) với splitText và insertBefore là cách phổ biến trong trường hợp này.
//                 // Quay lại cách duyệt thủ công đơn giản hơn:
//                 // (Đoạn code này đã được triển khai trong hàm performSearch ở trên)
//             }
//         }
//         // If the node is an element node (and not a script, style, or mark tag),
//         // recursively call searchNodes for its child nodes.
//         else if (node.nodeType === Node.ELEMENT_NODE &&
//                  node.nodeName !== 'SCRIPT' &&
//                  node.nodeName !== 'STYLE' &&
//                  node.nodeName !== 'MARK') // Avoid searching inside scripts, styles, or already highlighted marks
//         {
//             // Iterate over a static copy of childNodes because searchNodes might modify the child list
//             Array.from(node.childNodes).forEach(searchNodes);
//         }
//     }

//     // Start the recursive search from the main content element
//     searchNodes(mainContent);

//     console.log(`[Script] Search completed. Found ${matchCount} matches.`);

//     // Cuộn the first found match into view if any matches were found
//     if (firstMatchElement) {
//         console.log("[Script] Scrolling to the first search result.");
//         firstMatchElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
//     } else {
//          console.log("[Script] No search results found.");
//          // Optional: Display a message to the user indicating no results
//     }
// }

// /**
//  * Updates the current year displayed in the footer element.
//  * (Assuming this function is needed and not defined elsewhere globally)
//  */
// function updateFooterYear() {
//     console.log("[Script] (Global/Assumed) updateFooterYear called.");
//     // Find the element intended to display the current year in the footer
//     const yearElement = document.getElementById(FOOTER_YEAR_ID);

//     // If the element is found, update its text content to the current year
//     if (yearElement) {
//         yearElement.textContent = new Date().getFullYear();
//         console.log("[Script] Footer year updated successfully.");
//     } else {
//         console.warn(`[Script] Footer year element (#${FOOTER_YEAR_ID}) not found.`);
//     }
// }

// /**
//  * Initializes the language switching functionality.
//  * This function is expected to be defined in language.js.
//  * (Assuming this function exists and is attached to the window or called globally)
//  */
// // window.initializeLanguage = function() {
// //     console.log("[Script] (Global/Assumed) initializeLanguage called.");
// //     // Implementation details from your language.js file
// //     // This function should typically:
// //     // 1. Load translation data.
// //     // 2. Detect user's preferred language (e.g., from localStorage or browser settings).
// //     // 3. Apply translations to the page content.
// //     // 4. Set window.languageInitialized = true;
// //     // 5. Potentially call loadInternalNews() if news is language-dependent.
// //     // 6. Potentially attach event listeners to language switcher buttons (though script.js also tries this).
// // };

// /**
//  * Handles the event when a language button is clicked.
//  * This function is expected to be defined in language.js.
//  * (Assuming this function exists and is attached to the window or called globally)
//  * @param {Event} event - The click event object.
//  */
// // window.handleLanguageChange = function(event) {
// //     console.log("[Script] (Global/Assumed) handleLanguageChange called.");
// //     // Implementation details from your language.js file
// //     // This function should typically:
// //     // 1. Get the selected language from the button's data attribute (e.g., event.target.dataset.lang).
// //     // 2. Save the preferred language to localStorage.
// //     // 3. Apply translations for the new language to the page content.
// //     // 4. Update the displayed language/flag in the header.
// //     // 5. Potentially reload language-dependent content like news.
// // };

// /**
//  * Attaches event listeners to language switcher buttons.
//  * This function might be defined in language.js or script.js.
//  * (Assuming this function exists and is attached to the window or called globally)
//  */
// // window.attachLanguageSwitcherEvents = function() {
// //      console.log("[Script] (Global/Assumed) attachLanguageSwitcherEvents called.");
// //      // Implementation details...
// //      // This function should find the language buttons and add click listeners
// //      // that call handleLanguageChange.
// // };


// --- Main Execution Flow ---
// This block runs automatically when the script is loaded and the DOM is ready.
document.addEventListener('DOMContentLoaded', () => {
    console.log("[Script] DOMContentLoaded fired. Starting main execution flow...");

    // Start loading header and footer components asynchronously
    // Use loadComponent function to fetch and insert HTML
    const headerPromise = loadComponent(HEADER_PLACEHOLDER_ID, HEADER_COMPONENT_URL);
    const footerPromise = loadComponent(FOOTER_PLACEHOLDER_ID, FOOTER_COMPONENT_URL);

    // Use Promise.all to wait for both component loading Promises to settle
    // The .then() block will execute once both are done, regardless of success or failure
    Promise.all([headerPromise, footerPromise]).then(([headerPlaceholder, footerPlaceholder]) => {
        headerFooterLoadAttempted = true; // Mark that we have attempted to load components

        // Check if the components were successfully loaded (placeholder is not null, meaning element was found and fetch succeeded)
        const headerLoaded = !!headerPlaceholder;
        const footerLoaded = !!footerPlaceholder;
        console.log(`[Script] Promise.all finished component loading. Header loaded: ${headerLoaded}, Footer loaded: ${footerLoaded}.`);

        // If header was loaded successfully, initialize its specific logic (menu, search, etc.)
        if (headerLoaded) {
             console.log("[Script] Header component successfully loaded. Initializing header menu logic...");
             // Call the function to initialize header interactions.
             // This function is defined within this script.js file.
             initializeHeaderMenuLogic();
        } else {
             console.error("[Script] Header component failed to load. Header menu logic skipped.");
        }

        // If footer was loaded successfully, update the copyright year
        if (footerLoaded) {
             console.log("[Script] Footer component successfully loaded. Updating footer year...");
             // Check if the updateFooterYear function exists before calling it.
             // This function is assumed to be defined elsewhere (e.g., in this script.js or main.js).
             if (typeof updateFooterYear === 'function') {
                 updateFooterYear();
             } else {
                 console.warn("[Script] updateFooterYear function not found. Footer year update skipped.");
             }
        } else {
             console.error("[Script] Footer component failed to load. Footer year update skipped.");
        }


        // Initialize the language system AFTER components are loaded.
        // Use a small delay to give language.js time to execute and define its functions.
        setTimeout(() => {
            console.log("[Script] Checking for language initialization functions after component load delay...");
            // Check if the main language initialization function exists (assumed from language.js)
            if (typeof window.initializeLanguage === 'function') {
                console.log("[Script] initializeLanguage function found (from language.js).");
                // Check if the language system has already been initialized (to avoid re-initializing)
                // The window.languageInitialized flag is assumed to be set by language.js
                if (!window.languageInitialized) {
                     console.log("[Script] Language system not yet initialized. Calling initializeLanguage...");
                     window.initializeLanguage(); // Call the main language initialization function
                     // After initializeLanguage runs, it should handle applying translations and potentially loading news.
                     // Also, re-attach listeners for language buttons in the loaded header.
                     window.attachLanguageButtonListeners?.(); // Use optional chaining in case the function is not defined
                } else {
                     console.log("[Script] Language already initialized. Re-applying translations and listeners.");
                     // If already initialized, get the current language and re-apply translations.
                     const currentLang = localStorage.getItem('preferredLanguage') || 'vi';
                     // Re-apply translations if the function exists
                     if (typeof window.applyTranslations === 'function') {
                         console.log(`[Script] Re-applying translations for language: ${currentLang}`);
                         window.applyTranslations(currentLang);
                     } else {
                         console.warn("[Script] applyTranslations function not found. Cannot re-apply translations.");
                     }
                     // Reload language-dependent content like news if the container exists
                     if (document.getElementById(NEWS_CONTAINER_ID)) {
                         console.log("[Script] News container found, reloading news after language check.");
                         // The loadInternalNews function needs to be defined elsewhere (e.g., in this script.js or main.js)
                         loadInternalNews();
                     } else {
                         console.log("[Script] News container not found.");
                     }
                     // Gắn lại listeners cho các nút ngôn ngữ trong header đã load
                     window.attachLanguageButtonListeners?.();
                }
            } else {
                console.error("[Script] initializeLanguage function not found after timeout. Language features disabled.");
                // Fallback: If language.js failed to load, try to load news with default language if the container exists.
                if (document.getElementById(NEWS_CONTAINER_ID)) {
                    console.warn("[Script] Language system failed, attempting to load news with default language (VI).");
                     // Define a temporary translations object if the global one doesn't exist
                     if (typeof window.translations === 'undefined') {
                         window.translations = { vi: { read_more: 'Đọc thêm →', news_title_na: 'Tiêu đề không có sẵn', news_image_alt: 'Hình ảnh tin tức', no_news: 'Chưa có tin tức nào.', news_load_error: 'Không thể tải tin tức.', loading_news: 'Đang tải tin tức...' } };
                         console.log("[Script] Using temporary default translations for news.");
                     } else {
                         console.log("[Script] Existing translations object found, using it for news.");
                     }
                    loadInternalNews(); // Call the function to load news
                } else {
                    console.log("[Script] News container not found, skipping news load.");
                }
            }

            // Attach language switcher events (if the function exists in language.js)
            if (typeof window.attachLanguageSwitcherEvents === 'function') {
                console.log("[Script] Attaching language switcher events from language.js...");
                window.attachLanguageSwitcherEvents();
            } else {
                console.warn("[Script] window.attachLanguageSwitcherEvents function not found from language.js.");
            }
        }, 200); // Delay in milliseconds


    }).catch(error => {
        // Catch any uncaught errors from the Promises in Promise.all
        console.error("[Script] Uncaught error in Promise.all during component loading:", error);
         headerFooterLoadAttempted = true; // Mark that we have attempted to load
         // Display generic error messages in placeholders if they are still empty
         const headerPlaceholder = document.getElementById(HEADER_PLACEHOLDER_ID);
         if (headerPlaceholder && headerPlaceholder.innerHTML.trim() === '') { // Check if innerHTML is empty or just whitespace
             headerPlaceholder.innerHTML = `<p class="text-red-500 text-center p-4">Không thể tải Header do lỗi không xác định.</p>`;
         }
         const footerPlaceholder = document.getElementById(FOOTER_PLACEHOLDER_ID);
         if (footerPlaceholder && footerPlaceholder.innerHTML.trim() === '') { // Check if innerHTML is empty or just whitespace
              footerPlaceholder.innerHTML = `<p class="text-red-500 text-center p-4">Không thể tải Footer do lỗi không xác định.</p>`;
         }
    });

    // --- Page-Specific Initializations ---
    // These initializations should run after DOMContentLoaded but may not depend on header/footer being fully loaded.
    const bodyId = document.body.id; // Get the ID of the body element

    // Initialize RSS feed loading if the container element exists
    if (document.getElementById('vnexpress-rss-feed')) {
        console.log("[Script] RSS container found. Assuming rss-loader.js handles this initialization.");
        // The rss-loader.js script is expected to either run automatically or have its own initialization function.
    }

    // Initialize the Placement Test logic if the body ID matches and the function exists
    if (bodyId === 'page-placement' && typeof initializePlacementTest === 'function') {
        console.log("[Script] Initializing placement test for page-placement.");
        // The initializePlacementTest function is expected to be defined in a separate JS file for this specific page.
        initializePlacementTest();
    }

    console.log("[Script] Initial DOMContentLoaded execution flow finished.");
});

// --- Definition of Global Functions (if they are not defined elsewhere) ---
// The following functions are called within the script.
// If they are defined in other JS files (like main.js or language.js) and those files
// are loaded correctly before this script, you do NOT need to uncomment and define them here.
// If they are NOT defined elsewhere or are not globally accessible, uncomment and implement them here.

// Example definitions (uncomment and implement if needed):

/**
 * Initializes sticky/shrinking navbar behavior based on scroll position.
 * @param {HTMLElement} navbarElement - The main header element.
 */
// function initializeStickyNavbar(navbarElement) {
//     console.log("[Script] (Global/Assumed) initializeStickyNavbar called.");
//     if (!navbarElement) return;
//     const shrinkThreshold = 50; // Pixels scrolled before shrinking
//     let lastScrollTop = 0; // To detect scroll direction

//     const handleScroll = () => {
//         const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

//         // Add/remove 'shrink' class based on scroll position
//         navbarElement.classList.toggle('shrink', scrollTop > shrinkThreshold);

//         // Optional: Hide/show navbar on scroll down/up
//         // This requires additional CSS for top positioning transition
//         // if (scrollTop > lastScrollTop && scrollTop > navbarElement.offsetHeight) {
//         //     // Scrolling down - hide navbar
//         //     navbarElement.style.top = `-${navbarElement.offsetHeight}px`;
//         // } else {
//         //     // Scrolling up or at the top
//         //     navbarElement.style.top = '0';
//         // }

//         lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
//     };

//     // Add the scroll event listener
//     window.addEventListener('scroll', handleScroll, { passive: true });
//     // Run the handler once on load to set the initial state
//     handleScroll();
// }

/**
 * Highlights the active menu item in the header based on the current page URL.
 * @param {HTMLElement} headerElement - The main header element.
 */
// function initializeActiveMenuHighlighting(headerElement) {
//     console.log("[Script] (Global/Assumed) initializeActiveMenuHighlighting called.");
//     if (!headerElement) return;

//     // Get the current page's path, removing hash and query parameters
//     const currentHref = window.location.href.split('#')[0].split('?')[0];

//     // Select all navigation links within the header (desktop and mobile)
//     const menuLinks = headerElement.querySelectorAll('.nav-link[href], .submenu a[href], .sub-submenu a[href], #mobile-menu-panel a[href]');

//     // Helper function to normalize URLs for comparison (remove .html, trailing slash, etc.)
//     const normalizeUrl = url => {
//         try {
//             const urlObj = new URL(url, window.location.origin);
//             let path = urlObj.pathname;
//             // Remove trailing slash unless it's the root path "/"
//             if (path !== '/' && path.endsWith('/')) {
//                 path = path.slice(0, -1);
//             }
//             // Remove .html extension
//             if (path.endsWith('.html')) {
//                 path = path.slice(0, -'.html'.length);
//             }
//             // Treat "/index" the same as "/"
//             if (path === '/index' || path === '') {
//                 return '/';
//             }
//             return path;
//         } catch (e) {
//             console.warn(`[Script] Invalid URL during normalization: ${url}`, e);
//             return null; // Return null for invalid URLs
//         }
//     };

//     const normalizedCurrentPath = normalizeUrl(currentHref);

//     if (!normalizedCurrentPath) {
//          console.warn("[Script] Could not normalize current page URL. Active menu highlighting skipped.");
//          return; // Cannot proceed if current URL is invalid
//     }
//      console.log(`[Script] Normalized current path: ${normalizedCurrentPath}`);


//     // Remove any existing active classes first
//     menuLinks.forEach(link => {
//         link.classList.remove('active-menu-item');
//         // Also remove active classes from parent toggles
//         const parentToggle = link.closest('.mobile-menu-item, .sub-submenu-container, .main-menu-item')?.querySelector(':scope > button.mobile-submenu-toggle, :scope > button.nav-link');
//         parentToggle?.classList.remove('active-parent-item');
//     });

//      // Collapse all mobile submenus initially
//      headerElement.querySelectorAll('#mobile-menu-panel .mobile-menu-item.open').forEach(item => {
//          item.classList.remove('open');
//          const submenu = item.querySelector(':scope > .mobile-submenu');
//          if (submenu) {
//              submenu.style.maxHeight = '0';
//              submenu.style.overflow = 'hidden';
//          }
//          const toggleButton = item.querySelector(':scope > button.mobile-submenu-toggle');
//          if(toggleButton) toggleButton.setAttribute('aria-expanded', 'false');
//      });


//     let bestMatch = { link: null, specificity: -1 }; // Track the best matching link and its specificity

//     // Find the best matching link
//     menuLinks.forEach(link => {
//         const linkHref = link.getAttribute('href');
//         // Skip invalid or internal-only links
//         if (!linkHref || linkHref === '#' || linkHref.startsWith('javascript:')) {
//             return;
//         }

//         const normalizedLinkPath = normalizeUrl(linkHref);
//         if (!normalizedLinkPath) {
//             return; // Skip if link URL is invalid
//         }

//         let currentSpecificity = -1;

//         try {
//              // Check for exact match of full absolute URL (highest specificity)
//              const absoluteLinkHref = new URL(linkHref, window.location.origin).href.split('#')[0].split('?')[0];
//              if (absoluteLinkHref === currentHref) {
//                  currentSpecificity = 2;
//              }
//         } catch (e) {
//              // Ignore error if URL construction fails
//         }


//         // If not an exact absolute URL match, check for normalized path match
//         if (currentSpecificity < 2 && normalizedLinkPath === normalizedCurrentPath) {
//             // Assign specificity: 1 for root, 0 for others
//             currentSpecificity = normalizedCurrentPath === '/' ? 1 : 0;
//         }

//         // Update best match if current link is a better match
//         if (currentSpecificity > bestMatch.specificity) {
//             bestMatch = { link, specificity: currentSpecificity };
//         } else if (currentSpecificity === bestMatch.specificity && currentSpecificity >= 0) {
//             // If specificity is the same, prefer longer paths (more specific links)
//             const currentBestPath = normalizeUrl(bestMatch.link.getAttribute('href'));
//             if (currentBestPath && normalizedLinkPath.length > currentBestPath.length) {
//                 bestMatch = { link, specificity: currentSpecificity };
//             }
//         }
//     });

//     // Apply active classes if a best match was found
//     if (bestMatch.link) {
//         const activeLink = bestMatch.link;
//         console.log(`[Script] Active menu item found:`, activeLink);
//         activeLink.classList.add('active-menu-item');

//         // Traverse up the DOM tree to add active classes to parent toggles and open mobile submenus
//         let element = activeLink;
//         while (element && element !== headerElement) {
//             // Find the closest parent menu item container (li, div)
//             const parentMenuItem = element.closest('.mobile-menu-item, .sub-submenu-container, .main-menu-item');

//             if (!parentMenuItem) break; // Stop if no more parent menu items found

//             // Find the toggle button directly within this parent menu item
//             const parentToggle = parentMenuItem.querySelector(':scope > button.mobile-submenu-toggle, :scope > button.nav-link');

//             // Add active class to the parent toggle button
//             if (parentToggle) {
//                  parentToggle.classList.add('active-parent-item');
//                  console.log("[Script] Added active-parent-item to:", parentToggle);
//             }


//             // If it's a mobile menu item and not already open, open its submenu
//             if (parentMenuItem.classList.contains('mobile-menu-item') && !parentMenuItem.classList.contains('open')) {
//                 parentMenuItem.classList.add('open'); // Add 'open' class
//                 const submenu = parentMenuItem.querySelector(':scope > .mobile-submenu'); // Find the submenu
//                 if (submenu) {
//                     // Expand the submenu
//                     submenu.style.maxHeight = `${submenu.scrollHeight}px`;
//                     submenu.style.overflow = 'visible'; // Make content visible
//                     console.log(`[Script] Opened mobile submenu for active item:`, submenu);
//                 }
//                 // Update aria-expanded for the mobile toggle button
//                 const mobileToggle = parentMenuItem.querySelector(':scope > button.mobile-submenu-toggle');
//                 if(mobileToggle) mobileToggle.setAttribute('aria-expanded', 'true');
//             }

//             // Move up to the next parent menu item container
//             element = parentMenuItem.parentElement;
//         }
//     } else {
//         console.log("[Script] No active menu item found for the current URL.");
//     }
// }


// /**
//  * Clears previously highlighted search results (if client-side search is implemented).
//  * (Assuming this function is needed and not defined elsewhere globally)
//  */
// function clearSearchHighlights() {
//      console.log("[Script] (Global/Assumed) clearSearchHighlights called.");
//      const mainContent = document.querySelector('main');
//      if (!mainContent) return;

//      // Find all <mark> elements with the specific highlight class
//      const highlights = mainContent.querySelectorAll(`mark.${SEARCH_HIGHLIGHT_CLASS}`);

//      highlights.forEach(mark => {
//          const parent = mark.parentNode;
//          if (parent) {
//              // Move all children of the <mark> element back to its parent
//              while (mark.firstChild) {
//                  parent.insertBefore(mark.firstChild, mark);
//              }
//              // Remove the empty <mark> element
//              parent.removeChild(mark);
//              // Normalize the parent node to merge adjacent text nodes that were split
//              parent.normalize();
//          }
//      });
//      console.log(`[Script] Removed ${highlights.length} search highlights.`);
// }


// /**
//  * Performs a simple client-side search within the <main> element and highlights matches.
//  * (Assuming this function is needed and not defined elsewhere globally)
//  * @param {string} query - The search query string.
//  */
// function performSearch(query) {
//     console.log(`[Script] (Global/Assumed) performSearch called with query: "${query}"`);
//     // Clear previous highlights before performing a new search
//     clearSearchHighlights();

//     // Get the main content area to search within
//     const mainContent = document.querySelector('main');

//     // Validate the query and the search area
//     if (!mainContent || !query || query.trim().length < 2) {
//          console.log("[Script] Search query too short or no main content to search.");
//          return; // Exit if query is invalid or no content area
//     }

//     const queryLower = query.trim().toLowerCase(); // Normalize query
//     let matchCount = 0; // Counter for found matches
//     let firstMatchElement = null; // To store the first found match element for scrolling

//     // Recursive function to traverse the DOM tree and search within text nodes
//     function searchNodes(node) {
//         // Check if the current node is a text node
//         if (node.nodeType === Node.TEXT_NODE) {
//             const text = node.textContent;
//             const textLower = text.toLowerCase();
//             let lastIndex = 0; // Start search from this index in the current text node

//             // Loop to find all occurrences of the query within this text node
//             while (true) {
//                 const matchIndex = textLower.indexOf(queryLower, lastIndex);

//                 // If no more matches are found in this text node, break the loop
//                 if (matchIndex === -1) break;

//                 // Extract the matching text from the original text node
//                 const matchText = text.substring(matchIndex, matchIndex + query.length);

//                 // Create a <mark> element to wrap the matching text
//                 const mark = document.createElement('mark');
//                 mark.className = SEARCH_HIGHLIGHT_CLASS; // Add the highlight class
//                 mark.textContent = matchText; // Set the matching text as the content of <mark>

//                 // Split the current text node into two parts at the match index:
//                 // 1. The part before the match (remains the original 'node')
//                 // 2. The part from the match onwards (returned by splitText, let's call it 'after')
//                 const after = node.splitText(matchIndex);

//                 // Split the 'after' part again to separate the matched text from the text after the match
//                 // The 'after' node now contains the matched text followed by the text after the match.
//                 // We take the substring starting from the query length to get just the text after the match.
//                 after.textContent = after.textContent.substring(query.length);

//                 // Insert the created <mark> element between the part before the match ('node') and the part after the match ('after')
//                 node.parentNode.insertBefore(mark, after);

//                 // Increment the match count
//                 matchCount++;

//                 // If this is the first match found, store the <mark> element
//                 if (!firstMatchElement) {
//                     firstMatchElement = mark;
//                 }

//                 // Continue the search from the beginning of the new 'after' node
//                 // This is important because splitText modifies the node in place and returns the subsequent node.
//                 node = after;
//                 lastIndex = 0; // Always start from the beginning of the new node
//                 // Cần reset walker hoặc tạo walker mới nếu cấu trúc DOM thay đổi đáng kể
//                 // Cách đơn giản hơn là duyệt thủ công như vòng lặp while(true) ở trên
//                 // hoặc sử dụng một kỹ thuật khác nếu DOM thay đổi nhiều.
//                 // Với việc chèn <mark>, cấu trúc DOM thay đổi, nên TreeWalker ban đầu có thể không còn chính xác.
//                 // Vòng lặp while(true) với splitText và insertBefore là cách phổ biến trong trường hợp này.
//                 // Quay lại cách duyệt thủ công đơn giản hơn:
//                 // (Đoạn code này đã được triển khai trong hàm performSearch ở trên)
//             }
//         }
//         // If the node is an element node (and not a script, style, or mark tag),
//         // recursively call searchNodes for its child nodes.
//         else if (node.nodeType === Node.ELEMENT_NODE &&
//                  node.nodeName !== 'SCRIPT' &&
//                  node.nodeName !== 'STYLE' &&
//                  node.nodeName !== 'MARK') // Avoid searching inside scripts, styles, or already highlighted marks
//         {
//             // Iterate over a static copy of childNodes because searchNodes might modify the child list
//             Array.from(node.childNodes).forEach(searchNodes);
//         }
//     }

//     // Start the recursive search from the main content element
//     searchNodes(mainContent);

//     console.log(`[Script] Search completed. Found ${matchCount} matches.`);

//     // Cuộn the first found match into view if any matches were found
//     if (firstMatchElement) {
//         console.log("[Script] Scrolling to the first search result.");
//         firstMatchElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
//     } else {
//          console.log("[Script] No search results found.");
//          // Optional: Display a message to the user indicating no results
//     }
// }

// /**
//  * Updates the current year displayed in the footer element.
//  * (Assuming this function is needed and not defined elsewhere globally)
//  */
// function updateFooterYear() {
//     console.log("[Script] (Global/Assumed) updateFooterYear called.");
//     // Find the element intended to display the current year in the footer
//     const yearElement = document.getElementById(FOOTER_YEAR_ID);

//     // If the element is found, update its text content to the current year
//     if (yearElement) {
//         yearElement.textContent = new Date().getFullYear();
//         console.log("[Script] Footer year updated successfully.");
//     } else {
//         console.warn(`[Script] Footer year element (#${FOOTER_YEAR_ID}) not found.`);
//     }
// }

// /**
//  * Initializes the language switching functionality.
//  * This function is expected to be defined in language.js.
//  * (Assuming this function exists and is attached to the window or called globally)
//  */
// // window.initializeLanguage = function() {
// //     console.log("[Script] (Global/Assumed) initializeLanguage called.");
// //     // Implementation details from your language.js file
// //     // This function should typically:
// //     // 1. Load translation data.
// //     // 2. Detect user's preferred language (e.g., from localStorage or browser settings).
// //     // 3. Apply translations to the page content.
// //     // 4. Set window.languageInitialized = true;
// //     // 5. Potentially call loadInternalNews() if news is language-dependent.
// //     // 6. Potentially attach event listeners to language switcher buttons (though script.js also tries this).
// // };

// /**
//  * Handles the event when a language button is clicked.
//  * This function is expected to be defined in language.js.
//  * (Assuming this function exists and is attached to the window or called globally)
//  * @param {Event} event - The click event object.
//  */
// // window.handleLanguageChange = function(event) {
// //     console.log("[Script] (Global/Assumed) handleLanguageChange called.");
// //     // Implementation details from your language.js file
// //     // This function should typically:
// //     // 1. Get the selected language from the button's data attribute (e.g., event.target.dataset.lang).
// //     // 2. Save the preferred language to localStorage.
// //     // 3. Apply translations for the new language to the page content.
// //     // 4. Update the displayed language/flag in the header.
// //     // 5. Potentially reload language-dependent content like news.
// // };

// /**
//  * Attaches event listeners to language switcher buttons.
//  * This function might be defined in language.js or script.js.
//  * (Assuming this function exists and is attached to the window or called globally)
//  */
// // window.attachLanguageSwitcherEvents = function() {
// //      console.log("[Script] (Global/Assumed) attachLanguageSwitcherEvents called.");
// //      // Implementation details...
// //      // This function should find the language buttons and add click listeners
// //      // that call handleLanguageChange.
// // };


// --- Main Execution Flow ---
// This block runs automatically when the script is loaded and the DOM is ready.
document.addEventListener('DOMContentLoaded', () => {
    console.log("[Script] DOMContentLoaded fired. Starting main execution flow...");

    // Start loading header and footer components asynchronously
    // Use loadComponent function to fetch and insert HTML
    const headerPromise = loadComponent(HEADER_PLACEHOLDER_ID, HEADER_COMPONENT_URL);
    const footerPromise = loadComponent(FOOTER_PLACEHOLDER_ID, FOOTER_COMPONENT_URL);

    // Use Promise.all to wait for both component loading Promises to settle
    // The .then() block will execute once both are done, regardless of success or failure
    Promise.all([headerPromise, footerPromise]).then(([headerPlaceholder, footerPlaceholder]) => {
        headerFooterLoadAttempted = true; // Mark that we have attempted to load components

        // Check if the components were successfully loaded (placeholder is not null, meaning element was found and fetch succeeded)
        const headerLoaded = !!headerPlaceholder;
        const footerLoaded = !!footerPlaceholder;
        console.log(`[Script] Promise.all finished component loading. Header loaded: ${headerLoaded}, Footer loaded: ${footerLoaded}.`);

        // If header was loaded successfully, initialize its specific logic (menu, search, etc.)
        if (headerLoaded) {
             console.log("[Script] Header component successfully loaded. Initializing header menu logic...");
             // Call the function to initialize header interactions.
             // This function is defined within this script.js file.
             initializeHeaderMenuLogic();
        } else {
             console.error("[Script] Header component failed to load. Header menu logic skipped.");
        }

        // If footer was loaded successfully, update the copyright year
        if (footerLoaded) {
             console.log("[Script] Footer component successfully loaded. Updating footer year...");
             // Check if the updateFooterYear function exists before calling it.
             // This function is assumed to be defined elsewhere (e.g., in this script.js or main.js).
             if (typeof updateFooterYear === 'function') {
                 updateFooterYear();
             } else {
                 console.warn("[Script] updateFooterYear function not found. Footer year update skipped.");
             }
        } else {
             console.error("[Script] Footer component failed to load. Footer year update skipped.");
        }


        // Initialize the language system AFTER components are loaded.
        // Use a small delay to give language.js time to execute and define its functions.
        setTimeout(() => {
            console.log("[Script] Checking for language initialization functions after component load delay...");
            // Check if the main language initialization function exists (assumed from language.js)
            if (typeof window.initializeLanguage === 'function') {
                console.log("[Script] initializeLanguage function found (from language.js).");
                // Check if the language system has already been initialized (to avoid re-initializing)
                // The window.languageInitialized flag is assumed to be set by language.js
                if (!window.languageInitialized) {
                     console.log("[Script] Language system not yet initialized. Calling initializeLanguage...");
                     window.initializeLanguage(); // Call the main language initialization function
                     // After initializeLanguage runs, it should handle applying translations and potentially loading news.
                     // Also, re-attach listeners for language buttons in the loaded header.
                     window.attachLanguageButtonListeners?.(); // Use optional chaining in case the function is not defined
                } else {
                     console.log("[Script] Language already initialized. Re-applying translations and listeners.");
                     // If already initialized, get the current language and re-apply translations.
                     const currentLang = localStorage.getItem('preferredLanguage') || 'vi';
                     // Re-apply translations if the function exists
                     if (typeof window.applyTranslations === 'function') {
                         console.log(`[Script] Re-applying translations for language: ${currentLang}`);
                         window.applyTranslations(currentLang);
                     } else {
                         console.warn("[Script] applyTranslations function not found. Cannot re-apply translations.");
                     }
                     // Reload language-dependent content like news if the container exists
                     if (document.getElementById(NEWS_CONTAINER_ID)) {
                         console.log("[Script] News container found, reloading news after language check.");
                         // The loadInternalNews function needs to be defined elsewhere (e.g., in this script.js or main.js)
                         loadInternalNews();
                     } else {
                         console.log("[Script] News container not found.");
                     }
                     // Gắn lại listeners cho các nút ngôn ngữ trong header đã load
                     window.attachLanguageButtonListeners?.();
                }
            } else {
                console.error("[Script] initializeLanguage function not found after timeout. Language features disabled.");
                // Fallback: If language.js failed to load, try to load news with default language if the container exists.
                if (document.getElementById(NEWS_CONTAINER_ID)) {
                    console.warn("[Script] Language system failed, attempting to load news with default language (VI).");
                     // Define a temporary translations object if the global one doesn't exist
                     if (typeof window.translations === 'undefined') {
                         window.translations = { vi: { read_more: 'Đọc thêm →', news_title_na: 'Tiêu đề không có sẵn', news_image_alt: 'Hình ảnh tin tức', no_news: 'Chưa có tin tức nào.', news_load_error: 'Không thể tải tin tức.', loading_news: 'Đang tải tin tức...' } };
                         console.log("[Script] Using temporary default translations for news.");
                     } else {
                         console.log("[Script] Existing translations object found, using it for news.");
                     }
                    loadInternalNews(); // Call the function to load news
                } else {
                    console.log("[Script] News container not found, skipping news load.");
                }
            }

            // Attach language switcher events (if the function exists in language.js)
            if (typeof window.attachLanguageSwitcherEvents === 'function') {
                console.log("[Script] Attaching language switcher events from language.js...");
                window.attachLanguageSwitcherEvents();
            } else {
                console.warn("[Script] window.attachLanguageSwitcherEvents function not found from language.js.");
            }
        }, 200); // Delay in milliseconds


    }).catch(error => {
        // Catch any uncaught errors from the Promises in Promise.all
        console.error("[Script] Uncaught error in Promise.all during component loading:", error);
         headerFooterLoadAttempted = true; // Mark that we have attempted to load
         // Display generic error messages in placeholders if they are still empty
         const headerPlaceholder = document.getElementById(HEADER_PLACEHOLDER_ID);
         if (headerPlaceholder && headerPlaceholder.innerHTML.trim() === '') { // Check if innerHTML is empty or just whitespace
             headerPlaceholder.innerHTML = `<p class="text-red-500 text-center p-4">Không thể tải Header do lỗi không xác định.</p>`;
         }
         const footerPlaceholder = document.getElementById(FOOTER_PLACEHOLDER_ID);
         if (footerPlaceholder && footerPlaceholder.innerHTML.trim() === '') { // Check if innerHTML is empty or just whitespace
              footerPlaceholder.innerHTML = `<p class="text-red-500 text-center p-4">Không thể tải Footer do lỗi không xác định.</p>`;
         }
    });

    // --- Page-Specific Initializations ---
    // These initializations should run after DOMContentLoaded but may not depend on header/footer being fully loaded.
    const bodyId = document.body.id; // Get the ID of the body element

    // Initialize RSS feed loading if the container element exists
    if (document.getElementById('vnexpress-rss-feed')) {
        console.log("[Script] RSS container found. Assuming rss-loader.js handles this initialization.");
        // The rss-loader.js script is expected to either run automatically or have its own initialization function.
    }

    // Initialize the Placement Test logic if the body ID matches and the function exists
    if (bodyId === 'page-placement' && typeof initializePlacementTest === 'function') {
        console.log("[Script] Initializing placement test for page-placement.");
        // The initializePlacementTest function is expected to be defined in a separate JS file for this specific page.
        initializePlacementTest();
    }

    console.log("[Script] Initial DOMContentLoaded execution flow finished.");
});

// --- Definition of Global Functions (if they are not defined elsewhere) ---
// The following functions are called within the script.
// If they are defined in other JS files (like main.js or language.js) and those files
// are loaded correctly before this script, you do NOT need to uncomment and define them here.
// If they are NOT defined elsewhere or are not globally accessible, uncomment and implement them here.

// Example definitions (uncomment and implement if needed):

/**
 * Initializes sticky/shrinking navbar behavior based on scroll position.
 * @param {HTMLElement} navbarElement - The main header element.
 */
// function initializeStickyNavbar(navbarElement) {
//     console.log("[Script] (Global/Assumed) initializeStickyNavbar called.");
//     if (!navbarElement) return;
//     const shrinkThreshold = 50; // Pixels scrolled before shrinking
//     let lastScrollTop = 0; // To detect scroll direction

//     const handleScroll = () => {
//         const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

//         // Add/remove 'shrink' class based on scroll position
//         navbarElement.classList.toggle('shrink', scrollTop > shrinkThreshold);

//         // Optional: Hide/show navbar on scroll down/up
//         // This requires additional CSS for top positioning transition
//         // if (scrollTop > lastScrollTop && scrollTop > navbarElement.offsetHeight) {
//         //     // Scrolling down - hide navbar
//         //     navbarElement.style.top = `-${navbarElement.offsetHeight}px`;
//         // } else {
//         //     // Scrolling up or at the top
//         //     navbarElement.style.top = '0';
//         // }

//         lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
//     };

//     // Add the scroll event listener
//     window.addEventListener('scroll', handleScroll, { passive: true });
//     // Run the handler once on load to set the initial state
//     handleScroll();
// }

/**
 * Highlights the active menu item in the header based on the current page URL.
 * @param {HTMLElement} headerElement - The main header element.
 */
// function initializeActiveMenuHighlighting(headerElement) {
//     console.log("[Script] (Global/Assumed) initializeActiveMenuHighlighting called.");
//     if (!headerElement) return;

//     // Get the current page's path, removing hash and query parameters
//     const currentHref = window.location.href.split('#')[0].split('?')[0];

//     // Select all navigation links within the header (desktop and mobile)
//     const menuLinks = headerElement.querySelectorAll('.nav-link[href], .submenu a[href], .sub-submenu a[href], #mobile-menu-panel a[href]');

//     // Helper function to normalize URLs for comparison (remove .html, trailing slash, etc.)
//     const normalizeUrl = url => {
//         try {
//             const urlObj = new URL(url, window.location.origin);
//             let path = urlObj.pathname;
//             // Remove trailing slash unless it's the root path "/"
//             if (path !== '/' && path.endsWith('/')) {
//                 path = path.slice(0, -1);
//             }
//             // Remove .html extension
//             if (path.endsWith('.html')) {
//                 path = path.slice(0, -'.html'.length);
//             }
//             // Treat "/index" the same as "/"
//             if (path === '/index' || path === '') {
//                 return '/';
//             }
//             return path;
//         } catch (e) {
//             console.warn(`[Script] Invalid URL during normalization: ${url}`, e);
//             return null; // Return null for invalid URLs
//         }
//     };

//     const normalizedCurrentPath = normalizeUrl(currentHref);

//     if (!normalizedCurrentPath) {
//          console.warn("[Script] Could not normalize current page URL. Active menu highlighting skipped.");
//          return; // Cannot proceed if current URL is invalid
//     }
//      console.log(`[Script] Normalized current path: ${normalizedCurrentPath}`);


//     // Remove any existing active classes first
//     menuLinks.forEach(link => {
//         link.classList.remove('active-menu-item');
//         // Also remove active classes from parent toggles
//         const parentToggle = link.closest('.mobile-menu-item, .sub-submenu-container, .main-menu-item')?.querySelector(':scope > button.mobile-submenu-toggle, :scope > button.nav-link');
//         parentToggle?.classList.remove('active-parent-item');
//     });

//      // Collapse all mobile submenus initially
//      headerElement.querySelectorAll('#mobile-menu-panel .mobile-menu-item.open').forEach(item => {
//          item.classList.remove('open');
//          const submenu = item.querySelector(':scope > .mobile-submenu');
//          if (submenu) {
//              submenu.style.maxHeight = '0';
//              submenu.style.overflow = 'hidden';
//          }
//          const toggleButton = item.querySelector(':scope > button.mobile-submenu-toggle');
//          if(toggleButton) toggleButton.setAttribute('aria-expanded', 'false');
//      });


//     let bestMatch = { link: null, specificity: -1 }; // Track the best matching link and its specificity

//     // Find the best matching link
//     menuLinks.forEach(link => {
//         const linkHref = link.getAttribute('href');
//         // Skip invalid or internal-only links
//         if (!linkHref || linkHref === '#' || linkHref.startsWith('javascript:')) {
//             return;
//         }

//         const normalizedLinkPath = normalizeUrl(linkHref);
//         if (!normalizedLinkPath) {
//             return; // Skip if link URL is invalid
//         }

//         let currentSpecificity = -1;

//         try {
//              // Check for exact match of full absolute URL (highest specificity)
//              const absoluteLinkHref = new URL(linkHref, window.location.origin).href.split('#')[0].split('?')[0];
//              if (absoluteLinkHref === currentHref) {
//                  currentSpecificity = 2;
//              }
//         } catch (e) {
//              // Ignore error if URL construction fails
//         }


//         // If not an exact absolute URL match, check for normalized path match
//         if (currentSpecificity < 2 && normalizedLinkPath === normalizedCurrentPath) {
//             // Assign specificity: 1 for root, 0 for others
//             currentSpecificity = normalizedCurrentPath === '/' ? 1 : 0;
//         }

//         // Update best match if current link is a better match
//         if (currentSpecificity > bestMatch.specificity) {
//             bestMatch = { link, specificity: currentSpecificity };
//         } else if (currentSpecificity === bestMatch.specificity && currentSpecificity >= 0) {
//             // If specificity is the same, prefer longer paths (more specific links)
//             const currentBestPath = normalizeUrl(bestMatch.link.getAttribute('href'));
//             if (currentBestPath && normalizedLinkPath.length > currentBestPath.length) {
//                 bestMatch = { link, specificity: currentSpecificity };
//             }
//         }
//     });

//     // Apply active classes if a best match was found
//     if (bestMatch.link) {
//         const activeLink = bestMatch.link;
//         console.log(`[Script] Active menu item found:`, activeLink);
//         activeLink.classList.add('active-menu-item');

//         // Traverse up the DOM tree to add active classes to parent toggles and open mobile submenus
//         let element = activeLink;
//         while (element && element !== headerElement) {
//             // Find the closest parent menu item container (li, div)
//             const parentMenuItem = element.closest('.mobile-menu-item, .sub-submenu-container, .main-menu-item');

//             if (!parentMenuItem) break; // Stop if no more parent menu items found

//             // Find the toggle button directly within this parent menu item
//             const parentToggle = parentMenuItem.querySelector(':scope > button.mobile-submenu-toggle, :scope > button.nav-link');

//             // Add active class to the parent toggle button
//             if (parentToggle) {
//                  parentToggle.classList.add('active-parent-item');
//                  console.log("[Script] Added active-parent-item to:", parentToggle);
//             }


//             // If it's a mobile menu item and not already open, open its submenu
//             if (parentMenuItem.classList.contains('mobile-menu-item') && !parentMenuItem.classList.contains('open')) {
//                 parentMenuItem.classList.add('open'); // Add 'open' class
//                 const submenu = parentMenuItem.querySelector(':scope > .mobile-submenu'); // Find the submenu
//                 if (submenu) {
//                     // Expand the submenu
//                     submenu.style.maxHeight = `${submenu.scrollHeight}px`;
//                     submenu.style.overflow = 'visible'; // Make content visible
//                     console.log(`[Script] Opened mobile submenu for active item:`, submenu);
//                 }
//                 // Update aria-expanded for the mobile toggle button
//                 const mobileToggle = parentMenuItem.querySelector(':scope > button.mobile-submenu-toggle');
//                 if(mobileToggle) mobileToggle.setAttribute('aria-expanded', 'true');
//             }

//             // Move up to the next parent menu item container
//             element = parentMenuItem.parentElement;
//         }
//     } else {
//         console.log("[Script] No active menu item found for the current URL.");
//     }
// }


// /**
//  * Clears previously highlighted search results (if client-side search is implemented).
//  * (Assuming this function is needed and not defined elsewhere globally)
//  */
// function clearSearchHighlights() {
//      console.log("[Script] (Global/Assumed) clearSearchHighlights called.");
//      const mainContent = document.querySelector('main');
//      if (!mainContent) return;

//      // Find all <mark> elements with the specific highlight class
//      const highlights = mainContent.querySelectorAll(`mark.${SEARCH_HIGHLIGHT_CLASS}`);

//      highlights.forEach(mark => {
//          const parent = mark.parentNode;
//          if (parent) {
//              // Move all children of the <mark> element back to its parent
//              while (mark.firstChild) {
//                  parent.insertBefore(mark.firstChild, mark);
//              }
//              // Remove the empty <mark> element
//              parent.removeChild(mark);
//              // Normalize the parent node to merge adjacent text nodes that were split
//              parent.normalize();
//          }
//      });
//      console.log(`[Script] Removed ${highlights.length} search highlights.`);
// }


// /**
//  * Performs a simple client-side search within the <main> element and highlights matches.
//  * (Assuming this function is needed and not defined elsewhere globally)
//  * @param {string} query - The search query string.
//  */
// function performSearch(query) {
//     console.log(`[Script] (Global/Assumed) performSearch called with query: "${query}"`);
//     // Clear previous highlights before performing a new search
//     clearSearchHighlights();

//     // Get the main content area to search within
//     const mainContent = document.querySelector('main');

//     // Validate the query and the search area
//     if (!mainContent || !query || query.trim().length < 2) {
//          console.log("[Script] Search query too short or no main content to search.");
//          return; // Exit if query is invalid or no content area
//     }

//     const queryLower = query.trim().toLowerCase(); // Normalize query
//     let matchCount = 0; // Counter for found matches
//     let firstMatchElement = null; // To store the first found match element for scrolling

//     // Recursive function to traverse the DOM tree and search within text nodes
//     function searchNodes(node) {
//         // Check if the current node is a text node
//         if (node.nodeType === Node.TEXT_NODE) {
//             const text = node.textContent;
//             const textLower = text.toLowerCase();
//             let lastIndex = 0; // Start search from this index in the current text node

//             // Loop to find all occurrences of the query within this text node
//             while (true) {
//                 const matchIndex = textLower.indexOf(queryLower, lastIndex);

//                 // If no more matches are found in this text node, break the loop
//                 if (matchIndex === -1) break;

//                 // Extract the matching text from the original text node
//                 const matchText = text.substring(matchIndex, matchIndex + query.length);

//                 // Create a <mark> element to wrap the matching text
//                 const mark = document.createElement('mark');
//                 mark.className = SEARCH_HIGHLIGHT_CLASS; // Add the highlight class
//                 mark.textContent = matchText; // Set the matching text as the content of <mark>

//                 // Split the current text node into two parts at the match index:
//                 // 1. The part before the match (remains the original 'node')
//                 // 2. The part from the match onwards (returned by splitText, let's call it 'after')
//                 const after = node.splitText(matchIndex);

//                 // Split the 'after' part again to separate the matched text from the text after the match
//                 // The 'after' node now contains the matched text followed by the text after the match.
//                 // We take the substring starting from the query length to get just the text after the match.
//                 after.textContent = after.textContent.substring(query.length);

//                 // Insert the created <mark> element between the part before the match ('node') and the part after the match ('after')
//                 node.parentNode.insertBefore(mark, after);

//                 // Increment the match count
//                 matchCount++;

//                 // If this is the first match found, store the <mark> element
//                 if (!firstMatchElement) {
//                     firstMatchElement = mark;
//                 }

//                 // Continue the search from the beginning of the new 'after' node
//                 // This is important because splitText modifies the node in place and returns the subsequent node.
//                 node = after;
//                 lastIndex = 0; // Always start from the beginning of the new node
//                 // Cần reset walker hoặc tạo walker mới nếu cấu trúc DOM thay đổi đáng kể
//                 // Cách đơn giản hơn là duyệt thủ công như vòng lặp while(true) ở trên
//                 // hoặc sử dụng một kỹ thuật khác nếu DOM thay đổi nhiều.
//                 // Với việc chèn <mark>, cấu trúc DOM thay đổi, nên TreeWalker ban đầu có thể không còn chính xác.
//                 // Vòng lặp while(true) với splitText và insertBefore là cách phổ biến trong trường hợp này.
//                 // Quay lại cách duyệt thủ công đơn giản hơn:
//                 // (Đoạn code này đã được triển khai trong hàm performSearch ở trên)
//             }
//         }
//         // If the node is an element node (and not a script, style, or mark tag),
//         // recursively call searchNodes for its child nodes.
//         else if (node.nodeType === Node.ELEMENT_NODE &&
//                  node.nodeName !== 'SCRIPT' &&
//                  node.nodeName !== 'STYLE' &&
//                  node.nodeName !== 'MARK') // Avoid searching inside scripts, styles, or already highlighted marks
//         {
//             // Iterate over a static copy of childNodes because searchNodes might modify the child list
//             Array.from(node.childNodes).forEach(searchNodes);
//         }
//     }

//     // Start the recursive search from the main content element
//     searchNodes(mainContent);

//     console.log(`[Script] Search completed. Found ${matchCount} matches.`);

//     // Cuộn the first found match into view if any matches were found
//     if (firstMatchElement) {
//         console.log("[Script] Scrolling to the first search result.");
//         firstMatchElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
//     } else {
//          console.log("[Script] No search results found.");
//          // Optional: Display a message to the user indicating no results
//     }
// }

// /**
//  * Updates the current year displayed in the footer element.
//  * (Assuming this function is needed and not defined elsewhere globally)
//  */
// function updateFooterYear() {
//     console.log("[Script] (Global/Assumed) updateFooterYear called.");
//     // Find the element intended to display the current year in the footer
//     const yearElement = document.getElementById(FOOTER_YEAR_ID);

//     // If the element is found, update its text content to the current year
//     if (yearElement) {
//         yearElement.textContent = new Date().getFullYear();
//         console.log("[Script] Footer year updated successfully.");
//     } else {
//         console.warn(`[Script] Footer year element (#${FOOTER_YEAR_ID}) not found.`);
//     }
// }

// /**
//  * Initializes the language switching functionality.
//  * This function is expected to be defined in language.js.
//  * (Assuming this function exists and is attached to the window or called globally)
//  */
// // window.initializeLanguage = function() {
// //     console.log("[Script] (Global/Assumed) initializeLanguage called.");
// //     // Implementation details from your language.js file
// //     // This function should typically:
// //     // 1. Load translation data.
// //     // 2. Detect user's preferred language (e.g., from localStorage or browser settings).
// //     // 3. Apply translations to the page content.
// //     // 4. Set window.languageInitialized = true;
// //     // 5. Potentially call loadInternalNews() if news is language-dependent.
// //     // 6. Potentially attach event listeners to language switcher buttons (though script.js also tries this).
// // };

// /**
//  * Handles the event when a language button is clicked.
//  * This function is expected to be defined in language.js.
//  * (Assuming this function exists and is attached to the window or called globally)
//  * @param {Event} event - The click event object.
//  */
// // window.handleLanguageChange = function(event) {
// //     console.log("[Script] (Global/Assumed) handleLanguageChange called.");
// //     // Implementation details from your language.js file
// //     // This function should typically:
// //     // 1. Get the selected language from the button's data attribute (e.g., event.target.dataset.lang).
// //     // 2. Save the preferred language to localStorage.
// //     // 3. Apply translations for the new language to the page content.
// //     // 4. Update the displayed language/flag in the header.
// //     // 5. Potentially reload language-dependent content like news.
// // };

// /**
//  * Attaches event listeners to language switcher buttons.
//  * This function might be defined in language.js or script.js.
//  * (Assuming this function exists and is attached to the window or called globally)
//  */
// // window.attachLanguageSwitcherEvents = function() {
// //      console.log("[Script] (Global/Assumed) attachLanguageSwitcherEvents called.");
// //      // Implementation details...
// //      // This function should find the language buttons and add click listeners
// //      // that call handleLanguageChange.
// // };


// --- Main Execution Flow ---
// This block runs automatically when the script is loaded and the DOM is ready.
document.addEventListener('DOMContentLoaded', () => {
    console.log("[Script] DOMContentLoaded fired. Starting main execution flow...");

    // Start loading header and footer components asynchronously
    // Use loadComponent function to fetch and insert HTML
    const headerPromise = loadComponent(HEADER_PLACEHOLDER_ID, HEADER_COMPONENT_URL);
    const footerPromise = loadComponent(FOOTER_PLACEHOLDER_ID, FOOTER_COMPONENT_URL);

    // Use Promise.all to wait for both component loading Promises to settle
    // The .then() block will execute once both are done, regardless of success or failure
    Promise.all([headerPromise, footerPromise]).then(([headerPlaceholder, footerPlaceholder]) => {
        headerFooterLoadAttempted = true; // Mark that we have attempted to load components

        // Check if the components were successfully loaded (placeholder is not null, meaning element was found and fetch succeeded)
        const headerLoaded = !!headerPlaceholder;
        const footerLoaded = !!footerPlaceholder;
        console.log(`[Script] Promise.all finished component loading. Header loaded: ${headerLoaded}, Footer loaded: ${footerLoaded}.`);

        // If header was loaded successfully, initialize its specific logic (menu, search, etc.)
        if (headerLoaded) {
             console.log("[Script] Header component successfully loaded. Initializing header menu logic...");
             // Call the function to initialize header interactions.
             // This function is defined within this script.js file.
             initializeHeaderMenuLogic();
        } else {
             console.error("[Script] Header component failed to load. Header menu logic skipped.");
        }

        // If footer was loaded successfully, update the copyright year
        if (footerLoaded) {
             console.log("[Script] Footer component successfully loaded. Updating footer year...");
             // Check if the updateFooterYear function exists before calling it.
             // This function is assumed to be defined elsewhere (e.g., in this script.js or main.js).
             if (typeof updateFooterYear === 'function') {
                 updateFooterYear();
             } else {
                 console.warn("[Script] updateFooterYear function not found. Footer year update skipped.");
             }
        } else {
             console.error("[Script] Footer component failed to load. Footer year update skipped.");
        }


        // Initialize the language system AFTER components are loaded.
        // Use a small delay to give language.js time to execute and define its functions.
        setTimeout(() => {
            console.log("[Script] Checking for language initialization functions after component load delay...");
            // Check if the main language initialization function exists (assumed from language.js)
            if (typeof window.initializeLanguage === 'function') {
                console.log("[Script] initializeLanguage function found (from language.js).");
                // Check if the language system has already been initialized (to avoid re-initializing)
                // The window.languageInitialized flag is assumed to be set by language.js
                if (!window.languageInitialized) {
                     console.log("[Script] Language system not yet initialized. Calling initializeLanguage...");
                     window.initializeLanguage(); // Call the main language initialization function
                     // After initializeLanguage runs, it should handle applying translations and potentially loading news.
                     // Also, re-attach listeners for language buttons in the loaded header.
                     window.attachLanguageButtonListeners?.(); // Use optional chaining in case the function is not defined
                } else {
                     console.log("[Script] Language already initialized. Re-applying translations and listeners.");
                     // If already initialized, get the current language and re-apply translations.
                     const currentLang = localStorage.getItem('preferredLanguage') || 'vi';
                     // Re-apply translations if the function exists
                     if (typeof window.applyTranslations === 'function') {
                         console.log(`[Script] Re-applying translations for language: ${currentLang}`);
                         window.applyTranslations(currentLang);
                     } else {
                         console.warn("[Script] applyTranslations function not found. Cannot re-apply translations.");
                     }
                     // Reload language-dependent content like news if the container exists
                     if (document.getElementById(NEWS_CONTAINER_ID)) {
                         console.log("[Script] News container found, reloading news after language check.");
                         // The loadInternalNews function needs to be defined elsewhere (e.g., in this script.js or main.js)
                         loadInternalNews();
                     } else {
                         console.log("[Script] News container not found.");
                     }
                     // Gắn lại listeners cho 