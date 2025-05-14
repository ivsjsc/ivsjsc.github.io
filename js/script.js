/* ========================== */
/* Optimized JavaScript Logic */
/* Version: Complete code with corrected paths and detailed logs */
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
//  * @param {HTMLElement} footerElement - The main footer element.
//  */
// function updateFooterYear(footerElement) {
//     console.log("[Script] (Global/Assumed) updateFooterYear called.");
//     if (!footerElement) return;
//     // Find the element intended to display the current year in the footer
//     const yearElement = footerElement.querySelector('#current-year');

//     // If the element is found, update its text content to the current year
//     if (yearElement) {
//         yearElement.textContent = new Date().getFullYear();
//         console.log("[Script] Footer year updated successfully.");
//     } else {
//         console.warn(`[Script] Footer year element (#${FOOTER_YEAR_ID}) not found within the footer element.`);
//     }
// }


// /**
//  * Loads and displays internal news from JSON, supporting multi-language structure.
//  * Assumes posts.json has title/excerpt structured as { vi: "...", en: "..." }.
//  * (Assuming this function is needed and not defined elsewhere globally)
//  */
// function loadInternalNews() {
//     console.log("[Script] (Global/Assumed) loadInternalNews called.");
//     const newsContainer = document.getElementById(NEWS_CONTAINER_ID);
//     if (!newsContainer) {
//          console.log("[Script] News container not found, skipping news load.");
//          return;
//     }

//     // Check if translations object is available (assuming language.js provides it)
//     if (typeof window.translations === 'undefined') {
//         console.error("[Script] Translations object not found when loadInternalNews called. Cannot translate news.");
//         // Display a generic loading message or error message
//         newsContainer.innerHTML = `<p class="text-gray-500 w-full text-center">Đang chuẩn bị dữ liệu (lỗi dịch thuật)...</p>`;
//         // Still attempt to load news with default language if possible
//     }

//     const currentLang = localStorage.getItem('preferredLanguage') || 'vi';
//     // Get translated texts, falling back to default or English if translation is missing
//     const readMoreText = window.translations?.[currentLang]?.read_more || window.translations?.[currentLang]?.read_more || window.translations?.['en']?.read_more || 'Read more →';
//     const newsTitleNaText = window.translations?.[currentLang]?.news_title_na || window.translations?.[currentLang]?.news_title_na || window.translations?.['en']?.news_title_na || 'Title Not Available';
//     const newsImageAltText = window.translations?.[currentLang]?.news_image_alt || window.translations?.[currentLang]?.news_image_alt || window.translations?.['en']?.news_image_alt || 'News image';
//     const noNewsText = window.translations?.[currentLang]?.no_news || window.translations?.[currentLang]?.no_news || window.translations?.['en']?.no_news || 'No news yet.';
//     const newsLoadErrorText = window.translations?.[currentLang]?.news_load_error || window.translations?.[currentLang]?.news_load_error || window.translations?.['en']?.news_load_error || 'Could not load news.';
//     const loadingNewsText = window.translations?.[currentLang]?.loading_news || window.translations?.[currentLang]?.loading_news || window.translations?.['en']?.loading_news || 'Loading news...';


//     // Display a loading message
//     newsContainer.innerHTML = `<p class="text-gray-500 w-full text-center">${loadingNewsText}</p>`;

//     fetch(POSTS_JSON_URL)
//         .then(response => {
//             if (!response.ok) {
//                 console.error(`[Script] HTTP error ${response.status} loading ${POSTS_JSON_URL}`);
//                 throw new Error(`HTTP error ${response.status}`);
//             }
//             console.log(`[Script] Successfully fetched ${POSTS_JSON_URL}.`);
//             return response.json();
//         })
//         .then(posts => {
//             newsContainer.innerHTML = ''; // Clear loading message
//             // Check if posts is an array and has items
//             if (!Array.isArray(posts) || posts.length === 0) {
//                 newsContainer.innerHTML = `<p class="text-gray-500 w-full text-center">${noNewsText}</p>`;
//                 console.log("[Script] No news posts found in posts.json.");
//                 return;
//             }

//             // Display the first 6 posts
//             posts.slice(0, 6).forEach(post => {
//                 const postElement = document.createElement('div');
//                 // Add Tailwind classes for styling and responsiveness
//                 postElement.className = 'news-card flex-shrink-0 w-72 bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105 scroll-snap-align-start';

//                 // Get translated title and excerpt, falling back to 'vi' or default text
//                 const postTitle = post.title?.[currentLang] || post.title?.['vi'] || newsTitleNaText;
//                 const postExcerpt = post.excerpt?.[currentLang] || post.excerpt?.['vi'] || '';
//                 // Use translated title or fallback for image alt text
//                 const imageAlt = postTitle || newsImageAltText;
//                 // Add a 'HOT' badge if the post is marked as hot
//                 const hotBadge = post.hot ? `<span class="absolute top-2 right-2 bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full z-10">HOT</span>` : '';
//                 // Use post image URL or a placeholder
//                 const imageSrc = post.image || 'https://placehold.co/300x200/e2e8f0/cbd5e1?text=Image';

//                 let postDate = '';
//                 // Format the date if available
//                 if (post.date) {
//                     try {
//                         // Assuming date is in a format like "YYYY-MM-DD HH:MM:SS"
//                         const dateObj = new Date(post.date.split(' ')[0]);
//                         if (!isNaN(dateObj)) {
//                             // Format date as DD/MM/YYYY
//                             postDate = dateObj.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
//                         }
//                     } catch (e) {
//                          console.warn(`[Script] Invalid date format for post: ${post.date}`, e);
//                     }
//                 }

//                 // Construct the HTML for the news card
//                 postElement.innerHTML = `
//                         <a href="${post.link || '#'}" class="block group focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg h-full flex flex-col">
//                             <div class="relative">
//                                 <img src="${imageSrc}" alt="${imageAlt}" class="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-110 group-focus:scale-110" loading="lazy" onerror="this.src='https://placehold.co/300x200/e2e8f0/cbd5e1?text=Load+Error';">
//                                 ${hotBadge}
//                             </div>
//                             <div class="p-4 flex flex-col flex-grow">
//                                 <h3 class="text-lg font-semibold text-gray-800 mb-2 group-hover:text-blue-600 group-focus:text-blue-600 transition-colors duration-200 line-clamp-2" title="${postTitle}">
//                                     ${postTitle}
//                                 </h3>
//                                 <p class="text-sm text-gray-600 mb-3 line-clamp-3 flex-grow">${postExcerpt}</p>
//                                 <div class="flex justify-between items-center text-xs text-gray-500 mt-auto pt-2 border-t border-gray-100">
//                                     <span>${postDate}</span>
//                                     <span class="text-blue-500 font-medium group-hover:underline group-focus:underline">${readMoreText}</span>
//                                 </div>
//                             </div>
//                         </a>`;
//                 // Append the created news card element to the container
//                 newsContainer.appendChild(postElement);
//             });
//              console.log(`[Script] Successfully loaded and displayed ${posts.slice(0, 6).length} news posts.`);
//         })
//         .catch(error => {
//             // Handle errors during fetching or processing the JSON
//             console.error("[Script] Error loading news:", error);
//             newsContainer.innerHTML = `<p class="text-red-500 w-full text-center">${newsLoadErrorText}</p>`;
//         });
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
// //     // 1. Load translation data (e.g., from a JSON file).
// //     // 2. Store translation data in window.translations.
// //     // 3. Detect user's preferred language (e.g., from localStorage or browser settings).
// //     // 4. Call setLanguage(preferredLanguage) or applyTranslations(preferredLanguage).
// //     // 5. Set window.languageInitialized = true;
// //     // 6. Potentially call loadInternalNews() if news is language-dependent.
// //     // 7. Potentially attach event listeners to language switcher buttons (though script.js also tries this).
// // };

// /**
//  * Applies translations to elements on the page based on the current language.
//  * This function is expected to be defined in language.js.
//  * (Assuming this function exists and is attached to the window or called globally)
//  * @param {string} lang - The language code (e.g., 'vi', 'en').
//  */
// // window.applyTranslations = function(lang) {
// //     console.log(`[Script] (Global/Assumed) applyTranslations called for language: ${lang}`);
// //     // Implementation details from your language.js file
// //     // This function should typically:
// //     // 1. Get the translation data for the specified language from window.translations.
// //     // 2. Find all elements with `data-lang-key` attributes.
// //     // 3. Update the text content (or other attributes like placeholder, alt) of these elements
// //     //    using the corresponding translation key.
// //     // 4. Update language indicators in the UI (flags, text).
// //     // 5. Potentially trigger reload of language-dependent content like news.
// // };


// /**
//  * Handles the event when a language button is clicked.
//  * This function is expected to be defined in language.js.
//  * (Assuming this function exists and is attached to the window or called globally)
//  * @param {Event} event - The click event object.
//  */
// // window.handleLanguageChange = function(event) {
// //     console.log("[Script] (Global/Assumed) handleLanguageChange called.");
// //     const selectedButton = event.target.closest('.lang-button');
// //     if (!selectedButton) return;
// //     const lang = selectedButton.dataset.lang;
// //     console.log(`[Script] Language button clicked, selected language: ${lang}`);

// //     // Save the preferred language to localStorage
// //     localStorage.setItem('preferredLanguage', lang);

// //     // Call the function to apply translations
// //     if (typeof window.applyTranslations === 'function') {
// //         window.applyTranslations(lang);
// //     } else {
// //         console.warn("[Script] applyTranslations function not found. Cannot apply translations.");
// //     }

// //     // Update the displayed language/flag in the header (if not handled by applyTranslations)
// //     const desktopFlag = document.getElementById('desktop-current-lang-flag');
// //     const desktopText = document.getElementById('desktop-current-lang-text');
// //     const mobileFlag = document.getElementById('mobile-current-lang-flag');
// //     const mobileText = document.getElementById('mobile-current-lang-text');

// //     // Find the corresponding flag image source and text content from the clicked button
// //     const flagSrc = selectedButton.querySelector('img')?.getAttribute('src');
// //     const langText = selectedButton.textContent.trim().split('\n')[0].trim(); // Extract text content

// //     if (desktopFlag && desktopText && flagSrc && langText) {
// //          desktopFlag.setAttribute('src', flagSrc);
// //          desktopText.textContent = langText;
// //     }
// //      if (mobileFlag && mobileText && flagSrc && langText) {
// //          mobileFlag.setAttribute('src', flagSrc);
// //          mobileText.textContent = langText;
// //      }


// //     // Reload language-dependent content like news (if not handled by applyTranslations)
// //     if (document.getElementById(NEWS_CONTAINER_ID)) {
// //          console.log("[Script] News container found, reloading news after language change.");
// //          loadInternalNews(); // The loadInternalNews function needs to be defined
// //     }

// //     // Close the language dropdowns (if not handled by script.js toggleDropdown)
// //     const desktopDropdown = selectedButton.closest('#desktop-language-dropdown');
// //     if (desktopDropdown) {
// //          const toggleButton = desktopDropdown.querySelector('.dropdown-toggle');
// //          const content = desktopDropdown.querySelector('.language-dropdown-content');
// //          if(toggleButton && content) {
// //              desktopDropdown.classList.remove('open');
// //              toggleButton.setAttribute('aria-expanded', 'false');
// //              content.classList.add('hidden');
// //          }
// //     }
// //      const mobileDropdown = selectedButton.closest('#mobile-language-dropdown');
// //      if (mobileDropdown) {
// //          const toggleButton = mobileDropdown.querySelector('.dropdown-toggle');
// //          const content = mobileDropdown.querySelector('.language-dropdown-content');
// //          if(toggleButton && content) {
// //              mobileDropdown.classList.remove('open');
// //              toggleButton.setAttribute('aria-expanded', 'false');
// //              content.classList.add('hidden');
// //          }
// //      }
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
// //      // that call window.handleLanguageChange.
// //      const langButtons = document.querySelectorAll('.lang-button');
// //      langButtons.forEach(button => {
// //          // Remove existing listeners to prevent duplicates
// //          button.removeEventListener('click', window.handleLanguageChange);
// //          // Add the listener
// //          button.addEventListener('click', window.handleLanguageChange);
// //      });
// //      console.log(`[Script] Attached listeners to ${langButtons.length} language buttons.`);
// // };


// /**
//  * Initializes the placement test logic for the specific page.
//  * This function is expected to be defined in a page-specific JS file.
//  * (Assuming this function exists and is attached to the window or called globally)
//  */
// // window.initializePlacementTest = function() {
// //     console.log("[Script] (Global/Assumed) initializePlacementTest called.");
// //     // Implementation details for the placement test page
// // };


// --- Theme Toggle Listener ---
// This listener is attached to the theme toggle button if it exists in the main HTML file.
// It can run as soon as the DOM is ready, potentially before components are loaded.
 document.addEventListener("DOMContentLoaded", function () {
     const themeToggleBtn = document.getElementById("theme-toggle"); // Find the theme toggle button
     if (themeToggleBtn) {
         console.log("[Script] Theme toggle button found. Initializing theme logic.");
         // Get the current theme preference from localStorage, default to 'light'
         const currentTheme = localStorage.getItem("theme") || "light";

         // Apply the current theme class to the body
         document.body.classList.add(currentTheme + "-mode");
         // Set the initial text of the theme toggle button
         themeToggleBtn.textContent = currentTheme === "light" ? "Chế độ tối" : "Chế độ sáng";

         // Add a click event listener to the theme toggle button
         themeToggleBtn.addEventListener("click", function () {
             // Check if the body currently has the 'light-mode' class
             const isLightMode = document.body.classList.contains("light-mode");

             // Toggle between 'light-mode' and 'dark-mode' classes on the body
             document.body.classList.toggle("light-mode", !isLightMode);
             document.body.classList.toggle("dark-mode", isLightMode);

             // Determine the new theme based on the toggle
             const newTheme = isLightMode ? "dark" : "light";
             // Update the text content of the button
             themeToggleBtn.textContent = newTheme === "light" ? "Chế độ tối" : "Chế độ sáng";
             // Save the new theme preference to localStorage
             localStorage.setItem("theme", newTheme);
             console.log(`[Script] Theme toggled to: ${newTheme}`);
         });
     } else {
         console.log("[Script] Theme toggle button (#theme-toggle) not found.");
     }
 });

