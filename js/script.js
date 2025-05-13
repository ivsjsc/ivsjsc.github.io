/* ========================== */
/* Optimized JavaScript Logic */
/* Version: Added detailed logs for debugging component loading */
/* ========================== */

// --- Constants ---
const HEADER_COMPONENT_URL = 'header.html';
const FOOTER_COMPONENT_URL = 'footer.html';
const POSTS_JSON_URL = 'posts.json'; // Expects title/excerpt as { vi: "...", en: "..." }
const HEADER_PLACEHOLDER_ID = 'header-placeholder';
const FOOTER_PLACEHOLDER_ID = 'footer-placeholder';
const NEWS_CONTAINER_ID = 'news-container';
const FOOTER_YEAR_ID = 'current-year';
const SEARCH_HIGHLIGHT_CLASS = 'search-highlight';

// --- State Flags ---
let headerFooterLoadAttempted = false;
let menuInitialized = false;
let searchDebounceTimer = null;
// window.languageInitialized and window.translations are managed by language.js

// --- Utility Functions ---

/**
 * Loads HTML content into a placeholder element.
 * @param {string} placeholderId - ID of the placeholder element.
 * @param {string} componentUrl - URL of the HTML component file.
 * @returns {Promise<HTMLElement | null>} Promise resolving with the updated placeholder element or null on error.
 */
function loadComponent(placeholderId, componentUrl) {
    console.log(`[Script] Attempting to load component: ${componentUrl} into #${placeholderId}`);
    const placeholder = document.getElementById(placeholderId);
    if (!placeholder) {
        console.error(`[Script] Placeholder element "${placeholderId}" not found in the DOM. Cannot load component.`);
        return Promise.resolve(null); // Trả về Promise.resolve(null) để Promise.all vẫn chạy tiếp
    }
     // Xóa nội dung cũ và hiển thị trạng thái tải
     placeholder.innerHTML = `<p class="text-gray-500 text-center p-4">Đang tải ${componentUrl}...</p>`;


    return fetch(componentUrl)
        .then(response => {
            if (!response.ok) {
                console.error(`[Script] HTTP error ${response.status} loading ${componentUrl}`);
                throw new Error(`HTTP error ${response.status} loading ${componentUrl}`);
            }
            console.log(`[Script] Successfully fetched ${componentUrl}.`);
            return response.text();
        })
        .then(html => {
            const currentPlaceholder = document.getElementById(placeholderId);
            if (!currentPlaceholder) {
                console.error(`[Script] Placeholder "${placeholderId}" disappeared after fetch. Cannot insert HTML.`);
                return null; // Placeholder biến mất, không làm gì nữa
            }
            currentPlaceholder.innerHTML = html;
            console.log(`[Script] Successfully loaded and inserted ${componentUrl} into #${placeholderId}`);
            return currentPlaceholder; // Trả về phần tử đã cập nhật
        })
        .catch(error => {
            console.error(`[Script] Error loading ${componentUrl}:`, error);
            const currentPlaceholder = document.getElementById(placeholderId);
            if (currentPlaceholder) {
                // Hiển thị thông báo lỗi trên trang
                currentPlaceholder.innerHTML = `<p class="text-red-500 text-center p-4">Lỗi tải thành phần: ${error.message}. Vui lòng kiểm tra đường dẫn file (${componentUrl}).</p>`;
            }
            return null; // Trả về null để Promise.all vẫn chạy tiếp
        });
}

// --- Initialization Functions ---

/**
 * Initializes header menu events, including search functionality.
 * This function is called after the header HTML component is loaded.
 */
function initializeHeaderMenuLogic() {
    // Kiểm tra cờ để tránh khởi tạo nhiều lần
    if (menuInitialized) {
        console.warn("[Script] Menu already initialized. Skipping.");
        return;
    }

    // Tìm phần tử header chính sau khi nó đã được load vào placeholder
    // Sử dụng querySelector để tìm #navbar bên trong #header-placeholder
    const headerPlaceholder = document.getElementById(HEADER_PLACEHOLDER_ID);
    const headerElement = headerPlaceholder?.querySelector('#navbar');

    // Kiểm tra xem header có được tìm thấy không
    if (!headerElement) {
        console.error("[Script] Header (#navbar) not found *inside* the placeholder after loading. Cannot initialize menu.");
        console.log("[Script] Check if the loaded header.html content contains an element with id='navbar'.");
        return; // Thoát nếu không tìm thấy header
    }

    console.log("[Script] Initializing header menu logic (including search)... Header element found:", headerElement);

    // Cache các phần tử DOM cần thiết BÊN TRONG headerElement
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

    const mobileMenuItems = headerElement.querySelectorAll('#mobile-menu-panel .mobile-menu-item'); // Chỉ tìm trong panel mobile
    const desktopMenuItems = headerElement.querySelectorAll('#menu-items > .main-menu-item'); // Chỉ tìm trong menu desktop

    const desktopSearchButton = headerElement.querySelector('#desktop-search-button');
    const desktopSearchContainer = headerElement.querySelector('#desktop-search-container');
    const desktopSearchInput = headerElement.querySelector('#desktop-search-input');
    const desktopSearchClose = headerElement.querySelector('#desktop-search-close');
    const mobileSearchInput = headerElement.querySelector('#mobile-search-input'); // Đảm bảo ID đúng

    // Log số lượng các phần tử menu tìm thấy
    console.log(`[Script] Mobile menu button found: ${!!mobileMenuButton}`);
    console.log(`[Script] Desktop language dropdown found: ${!!desktopLangDropdown}`);
    console.log(`[Script] Mobile language dropdown found: ${!!mobileLangDropdown}`);
    console.log(`[Script] Found ${desktopMenuItems.length} desktop main menu items.`);
    console.log(`[Script] Found ${mobileMenuItems.length} mobile menu items.`);
    console.log(`[Script] Desktop search button found: ${!!desktopSearchButton}`);


    // --- Mobile Menu Toggle Logic ---
    function toggleMobileMenu(forceOpenState) {
        if (!mobileMenuPanel || !mobileMenuOverlay || !iconMenu || !iconClose || !mobileMenuButton) {
             console.warn("[Script] toggleMobileMenu: Missing required elements.");
             return;
        }
        const shouldBeOpen = typeof forceOpenState === 'boolean' ? forceState : mobileMenuButton.getAttribute('aria-expanded') === 'false';
        mobileMenuButton.setAttribute('aria-expanded', shouldBeOpen.toString());
        iconMenu.classList.toggle('hidden', shouldBeOpen);
        iconClose.classList.toggle('hidden', !shouldBeOpen);

        if (shouldBeOpen) {
            mobileMenuOverlay.classList.remove('hidden');
            mobileMenuPanel.classList.remove('hidden'); // Đảm bảo display: block/flex trước transition
            requestAnimationFrame(() => { // Sử dụng requestAnimationFrame để đảm bảo trình duyệt đã cập nhật display trước khi áp dụng transition
                mobileMenuOverlay.classList.add('active');
                mobileMenuPanel.classList.add('active'); // Class 'active' nên kích hoạt transition transform
            });
            document.body.classList.add('overflow-hidden'); // Ngăn cuộn trang chính
        } else {
            mobileMenuOverlay.classList.remove('active');
            mobileMenuPanel.classList.remove('active'); // Class 'active' bị xóa để kích hoạt transition transform ngược lại
            document.body.classList.remove('overflow-hidden'); // Cho phép cuộn trang chính lại

            // Thêm lớp 'hidden' sau khi transition kết thúc để ẩn hoàn toàn
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
        }
    }
    // Đảm bảo trạng thái ban đầu của overlay và panel là hidden (dù CSS cũng nên xử lý)
    mobileMenuOverlay?.classList.add('hidden');
    mobileMenuPanel?.classList.add('hidden');

    mobileMenuButton?.addEventListener('click', () => toggleMobileMenu());
    mobileCloseButton?.addEventListener('click', () => toggleMobileMenu(false));
    mobileMenuOverlay?.addEventListener('click', () => toggleMobileMenu(false));

    // Đóng menu mobile khi click vào link bên trong (trừ các nút toggle submenu)
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
    mobileMenuItems.forEach(item => {
        const button = item.querySelector(':scope > button.mobile-submenu-toggle');
        const submenu = item.querySelector(':scope > .mobile-submenu');
        const arrow = button?.querySelector('.submenu-arrow'); // Tìm mũi tên bên trong nút

        if (!button || !submenu) {
             // console.warn("[Script] Mobile submenu item missing button or submenu:", item);
             return; // Bỏ qua nếu không đủ phần tử
        }

        // Thiết lập trạng thái ban đầu
        submenu.style.maxHeight = '0';
        submenu.style.overflow = 'hidden'; // Đảm bảo ẩn nội dung tràn
        item.classList.remove('open'); // Đảm bảo mục cha bắt đầu với trạng thái đóng
        button.setAttribute('aria-expanded', 'false');
        if(arrow) arrow.classList.remove('rotate-90'); // Đảm bảo mũi tên ở trạng thái ban đầu

        button.addEventListener('click', function(e) {
            e.stopPropagation(); // Ngăn sự kiện click lan ra ngoài

            const parentItem = this.closest('.mobile-menu-item');
            if (!parentItem) return; // Kiểm tra lại mục cha

            const isOpen = parentItem.classList.toggle('open'); // Chuyển đổi trạng thái 'open' trên mục cha
            this.setAttribute('aria-expanded', String(isOpen)); // Cập nhật thuộc tính aria-expanded

            if(arrow) arrow.classList.toggle('rotate-90', isOpen); // Xoay mũi tên

            if(isOpen) {
                // Mở submenu: đặt maxHeight bằng scrollHeight để kích hoạt transition
                submenu.style.maxHeight = submenu.scrollHeight + "px";
                // Không ẩn overflow ngay lập tức để transition maxHeight hoạt động
                // submenu.style.overflow = 'visible'; // Có thể cần hoặc không tùy CSS transition
                console.log(`[Script] Mobile submenu opened for ${submenuId}. scrollHeight: ${submenu.scrollHeight}`);

                // Đóng các submenu anh em cùng cấp độ
                const siblings = Array.from(parentItem.parentNode.children)
                                    .filter(child => child !== parentItem && child.classList.contains('mobile-menu-item') && child.classList.contains('open'));

                siblings.forEach(sibling => {
                    sibling.classList.remove('open'); // Xóa trạng thái 'open'
                    const siblingSubmenu = sibling.querySelector(':scope > .mobile-submenu');
                    const siblingButton = sibling.querySelector(':scope > button.mobile-submenu-toggle');
                    const siblingArrow = sibling.querySelector(':scope > button.mobile-submenu-toggle .submenu-arrow');

                    if (siblingSubmenu) {
                        siblingSubmenu.style.maxHeight = '0'; // Thu gọn submenu anh em
                        // Thêm listener để ẩn overflow sau khi transition kết thúc
                        siblingSubmenu.addEventListener('transitionend', function onSiblingTransitionEnd() {
                             if (siblingSubmenu.style.maxHeight === '0px') { // Kiểm tra xem đã thu gọn hoàn toàn chưa
                                siblingSubmenu.style.overflow = 'hidden';
                             }
                             siblingSubmenu.removeEventListener('transitionend', onSiblingTransitionEnd);
                        }, { once: true });
                    }
                    if (siblingButton) siblingButton.setAttribute('aria-expanded', 'false');
                    if (siblingArrow) siblingArrow.classList.remove('rotate-90');
                });

            } else {
                // Đóng submenu: đặt maxHeight về 0
                submenu.style.maxHeight = '0';
                 // Thêm listener để ẩn overflow sau khi transition kết thúc
                 submenu.addEventListener('transitionend', function onTransitionEnd() {
                     if (submenu.style.maxHeight === '0px') { // Kiểm tra xem đã thu gọn hoàn toàn chưa
                        submenu.style.overflow = 'hidden';
                     }
                     submenu.removeEventListener('transitionend', onTransitionEnd);
                 }, { once: true });

                // Thu gọn tất cả submenu lồng bên trong submenu hiện tại
                parentItem.querySelectorAll('.mobile-menu-item.open').forEach(nestedOpenItem => {
                     nestedOpenItem.classList.remove('open');
                     const nestedSubmenu = nestedOpenItem.querySelector(':scope > .mobile-submenu');
                     const nestedButton = nestedOpenItem.querySelector(':scope > button.mobile-submenu-toggle');
                     const nestedArrow = nestedOpenItem.querySelector(':scope > button.mobile-submenu-toggle .submenu-arrow');
                     if(nestedSubmenu) {
                         nestedSubmenu.style.maxHeight = '0';
                          nestedSubmenu.addEventListener('transitionend', function onNestedTransitionEnd() {
                              if (nestedSubmenu.style.maxHeight === '0px') {
                                 nestedSubmenu.style.overflow = 'hidden';
                              }
                              nestedSubmenu.removeEventListener('transitionend', onNestedTransitionEnd);
                          }, { once: true });
                     }
                     if(nestedButton) nestedButton.setAttribute('aria-expanded', 'false');
                     if(nestedArrow) nestedArrow.classList.remove('rotate-90');
                });
                console.log(`[Script] Mobile submenu closed for ${submenuId}.`);
            }
        });
    });


    // --- Language Dropdown Logic ---
    // Hàm toggleDropdown đã được định nghĩa ở trên và sử dụng cho cả desktop và mobile
    // desktopLangToggle, desktopLangOptions, mobileLangToggle, mobileLangOptions đã được cache

    if (desktopLangToggle && desktopLangOptions) {
        desktopLangToggle.addEventListener('click', e => {
             console.log("[Script] Desktop language toggle clicked.");
             e.stopPropagation();
             toggleDropdown(desktopLangDropdown);
             // Đóng các menu chính khác khi mở dropdown ngôn ngữ
             closeAllDesktopMenus(null);
        });
    } else { console.warn("[Script] Desktop language toggle or options not found."); }

    if (mobileLangToggle && mobileLangOptions) {
        mobileLangToggle.addEventListener('click', e => {
             console.log("[Script] Mobile language toggle clicked.");
             e.stopPropagation();
             toggleDropdown(mobileLangDropdown);
        });
    } else { console.warn("[Script] Mobile language toggle or options not found."); }

    // Gắn listeners cho các nút chọn ngôn ngữ
    // Hàm handleLanguageChangeWrapper gọi handleLanguageChange từ language.js và đóng dropdown
    function handleLanguageChangeWrapper(event) {
        console.log("[Script] Language button clicked.");
        const selectedButton = event.target.closest('.lang-button');
        if (!selectedButton) return;

        const lang = selectedButton.dataset.lang;
        console.log(`[Script] Selected language: ${lang}`);

        // Cập nhật hiển thị ngôn ngữ trên header
        const desktopFlag = document.getElementById('desktop-current-lang-flag');
        const desktopText = document.getElementById('desktop-current-lang-text');
        const mobileFlag = document.getElementById('mobile-current-lang-flag');
        const mobileText = document.getElementById('mobile-current-lang-text');

        if (desktopFlag && desktopText) {
             const desktopSelectedButton = document.querySelector(`#desktop-lang-options .lang-button[data-lang="${lang}"]`);
             if(desktopSelectedButton) {
                 desktopFlag.setAttribute('src', desktopSelectedButton.querySelector('img').getAttribute('src'));
                 desktopText.textContent = desktopSelectedButton.textContent.trim().split('\n')[0].trim();
             }
        }
         if (mobileFlag && mobileText) {
              const mobileSelectedButton = document.querySelector(`#mobile-lang-options .lang-button[data-lang="${lang}"]`);
              if(mobileSelectedButton) {
                 mobileFlag.setAttribute('src', mobileSelectedButton.querySelector('img').getAttribute('src'));
                 mobileText.textContent = mobileSelectedButton.textContent.trim().split('\n')[0].trim();
              }
         }


        // Gọi hàm xử lý ngôn ngữ từ language.js nếu tồn tại
        if (typeof window.handleLanguageChange === 'function') {
            console.log("[Script] Calling handleLanguageChange from language.js");
            window.handleLanguageChange({ target: selectedButton }); // Truyền event object giả
        } else {
            console.warn("[Script] handleLanguageChange function not found (from language.js). Language content will not update.");
        }

        // Đóng dropdown sau khi chọn
        const desktopDropdown = selectedButton.closest('#desktop-language-dropdown');
        if (desktopDropdown) toggleDropdown(desktopDropdown, false);

        const mobileDropdown = selectedButton.closest('#mobile-language-dropdown');
        if (mobileDropdown) toggleDropdown(mobileDropdown, false);
    }

     // Hàm này sẽ được gọi sau khi header component được load (trong Promise.all)
     window.attachLanguageButtonListeners = () => {
        console.log("[Script] Attaching language button listeners...");
        // Tìm tất cả các nút .lang-button bên trong header đã load
        const langButtons = headerElement.querySelectorAll('.lang-button');
        if (langButtons.length > 0) {
            langButtons.forEach(button => {
                 // Xóa listener cũ trước khi thêm mới để tránh trùng lặp nếu initialize chạy lại
                 button.removeEventListener('click', handleLanguageChangeWrapper);
                 button.addEventListener('click', handleLanguageChangeWrapper);
            });
            console.log(`[Script] Attached listeners to ${langButtons.length} language buttons.`);
        } else {
             console.warn("[Script] No language buttons (.lang-button) found in the loaded header.");
        }
     };


    // --- Search Functionality ---
    // desktopSearchButton, desktopSearchContainer, desktopSearchInput, desktopSearchClose, mobileSearchInput đã được cache

    function toggleDesktopSearch(show) {
        if (!desktopSearchContainer || !desktopSearchButton || !desktopSearchInput) {
             console.warn("[Script] toggleDesktopSearch: Missing required elements.");
             return;
        }
        const isActive = desktopSearchContainer.classList.contains('active');
        const shouldShow = typeof show === 'boolean' ? show : !isActive;

        if (shouldShow) {
            console.log("[Script] Opening desktop search.");
            desktopSearchContainer.classList.remove('hidden');
            desktopSearchContainer.classList.add('flex'); // Đảm bảo hiển thị dạng flex
            desktopSearchButton.classList.add('hidden'); // Ẩn nút search icon
            // Ẩn các nút khác nếu tồn tại
            const consultationButton = headerElement.querySelector('.cta-button');
            const desktopLanguageDropdown = headerElement.querySelector('#desktop-language-dropdown');
            if(consultationButton) consultationButton.classList.add('hidden');
            if(desktopLanguageDropdown) desktopLanguageDropdown.classList.add('hidden');

            // Sử dụng requestAnimationFrame để đảm bảo display được cập nhật trước khi transition
            requestAnimationFrame(() => {
                 desktopSearchContainer.classList.add('active'); // Kích hoạt transition width/opacity
            });

            desktopSearchInput.focus(); // Focus vào input
            closeAllDesktopMenus(null); // Đóng tất cả các menu dropdown khác
            if (desktopLangDropdown) toggleDropdown(desktopLangDropdown, false); // Đóng dropdown ngôn ngữ desktop
        } else {
             console.log("[Script] Closing desktop search.");
            desktopSearchContainer.classList.remove('active'); // Kích hoạt transition width/opacity ngược lại

            // Thêm lớp 'hidden' sau khi transition kết thúc
            desktopSearchContainer.addEventListener('transitionend', function onTransitionEnd() {
                 if (!desktopSearchContainer.classList.contains('active')) { // Kiểm tra xem đã đóng hoàn toàn chưa
                     desktopSearchContainer.classList.add('hidden');
                     desktopSearchContainer.classList.remove('flex'); // Xóa display: flex
                 }
                 desktopSearchContainer.removeEventListener('transitionend', onTransitionEnd);
            }, { once: true });
             // Thêm timeout phòng trường hợp transitionend không bắn
             setTimeout(() => {
                 if (!desktopSearchContainer.classList.contains('active')) {
                      desktopSearchContainer.classList.add('hidden');
                      desktopSearchContainer.classList.remove('flex');
                 }
             }, 350); // Thời gian này nên lớn hơn hoặc bằng thời gian transition CSS

            desktopSearchButton.classList.remove('hidden'); // Hiển thị lại nút search icon
             // Hiển thị lại các nút khác nếu tồn tại
            const consultationButton = headerElement.querySelector('.cta-button');
            const desktopLanguageDropdown = headerElement.querySelector('#desktop-language-dropdown');
            if(consultationButton) consultationButton.classList.remove('hidden');
            if(desktopLanguageDropdown) desktopLanguageDropdown.classList.remove('hidden');

            desktopSearchInput.value = ''; // Xóa nội dung input
            clearSearchHighlights(); // Xóa highlight tìm kiếm
        }
    }
    // Đảm bảo trạng thái ban đầu của search container là hidden và không flex
    desktopSearchContainer?.classList.add('hidden');
    desktopSearchContainer?.classList.remove('flex');


    desktopSearchButton?.addEventListener('click', (e) => { e.stopPropagation(); toggleDesktopSearch(true); });
    desktopSearchClose?.addEventListener('click', (e) => { e.stopPropagation(); toggleDesktopSearch(false); }); // Ngăn event buble
    desktopSearchContainer?.addEventListener('click', (e) => { e.stopPropagation(); }); // Ngăn click bên trong container đóng nó
    window.addEventListener('click', (event) => {
         // Nếu click bên ngoài nút search và search container, và search container đang active (đang mở)
         if (desktopSearchContainer?.classList.contains('active') &&
             !desktopSearchContainer.contains(event.target) &&
             event.target !== desktopSearchButton && // Click không phải trên nút search
             !desktopSearchButton.contains(event.target) // Click không phải bên trong nút search
            )
         {
             console.log("[Script] Clicked outside desktop search area, closing search.");
             toggleDesktopSearch(false);
         }
    });

    // Xử lý input search với debounce
    const handleSearchInput = (event) => {
        clearTimeout(searchDebounceTimer);
        const query = event.target.value;
        // Chỉ thực hiện tìm kiếm nếu query có ít nhất 2 ký tự
        if (query.trim().length >= 2) {
             console.log(`[Script] Search input debounce: "${query}". Scheduling search.`);
            searchDebounceTimer = setTimeout(() => {
                performSearch(query); // Hàm performSearch cần được định nghĩa ở đâu đó
            }, 300); // Chờ 300ms sau khi người dùng ngừng gõ
        } else {
             console.log("[Script] Search input cleared or too short, clearing highlights.");
             clearSearchHighlights(); // Xóa highlight nếu query rỗng hoặc quá ngắn
        }
    };
    desktopSearchInput?.addEventListener('input', handleSearchInput);
    mobileSearchInput?.addEventListener('input', handleSearchInput);

    // Ngăn form submit mặc định khi nhấn Enter trong ô search
    desktopSearchInput?.closest('form')?.addEventListener('submit', e => {
        e.preventDefault();
        console.log("[Script] Desktop search form submitted (prevented default). Performing search.");
        performSearch(desktopSearchInput.value); // Thực hiện tìm kiếm ngay khi nhấn Enter
    });
    mobileSearchInput?.closest('form')?.addEventListener('submit', e => {
        e.preventDefault();
        console.log("[Script] Mobile search form submitted (prevented default). Performing search.");
        performSearch(mobileSearchInput.value); // Thực hiện tìm kiếm ngay khi nhấn Enter
    });


    // --- Initialize Other Header Features ---
    // initializeStickyNavbar(headerElement); // Hàm này cần được định nghĩa ở đâu đó (ví dụ: trong script.js hoặc main.js)
    // initializeActiveMenuHighlighting(headerElement); // Hàm này cần được định nghĩa ở đâu đó (ví dụ: trong script.js hoặc main.js)

    // Kiểm tra xem các hàm này có tồn tại không trước khi gọi
     if (typeof initializeStickyNavbar === 'function') {
         initializeStickyNavbar(headerElement);
     } else {
         console.warn("[Script] initializeStickyNavbar function not found. Sticky navbar disabled.");
     }

     if (typeof initializeActiveMenuHighlighting === 'function') {
         initializeActiveMenuHighlighting(headerElement);
     } else {
         console.warn("[Script] initializeActiveMenuHighlighting function not found. Active menu highlighting disabled.");
     }


    menuInitialized = true;
    console.log("[Script] Header menu logic initialization process finished.");
}

// Các hàm initializeStickyNavbar, initializeActiveMenuHighlighting, clearSearchHighlights, performSearch, updateFooterYear
// cần được định nghĩa ở phạm vi có thể truy cập được bởi initializeHeaderMenuLogic.
// Dựa trên cấu trúc file bạn cung cấp, chúng có vẻ nằm trong script.js hoặc main.js.
// Đảm bảo các hàm này được định nghĩa TRƯỚC khi initializeHeaderMenuLogic được gọi.
// Nếu chúng nằm trong main.js, bạn có thể cần đảm bảo main.js được load trước script.js
// hoặc định nghĩa chúng trực tiếp trong script.js.

// --- Hàm performSearch và clearSearchHighlights (định nghĩa lại ở đây nếu chúng không ở phạm vi global) ---
// Nếu các hàm này đã được định nghĩa ở nơi khác (ví dụ: main.js) và có thể truy cập global, bạn không cần định nghĩa lại.
// Nếu không, hãy thêm chúng vào đây hoặc đảm bảo file chứa chúng được load trước.

/**
 * Clears previously highlighted search results.
 * (Assuming this function is needed and not defined elsewhere globally)
 */
// function clearSearchHighlights() {
//     console.log("[Script] clearSearchHighlights called.");
//     const mainContent = document.querySelector('main');
//     if (!mainContent) return;
//     const highlights = mainContent.querySelectorAll(`mark.${SEARCH_HIGHLIGHT_CLASS}`);
//     highlights.forEach(mark => {
//         const parent = mark.parentNode;
//         if (parent) {
//             while (mark.firstChild) { parent.insertBefore(mark.firstChild, mark); }
//             parent.removeChild(mark);
//             parent.normalize(); // Gộp các text node liền kề lại
//         }
//     });
// }

/**
 * Performs a simple client-side search within the <main> element.
 * Highlights matching text using <mark> tags.
 * (Assuming this function is needed and not defined elsewhere globally)
 * @param {string} query - The search query.
 */
// function performSearch(query) {
//     console.log(`[Script] performSearch called with query: "${query}"`);
//     clearSearchHighlights(); // Xóa highlight cũ trước

//     const mainContent = document.querySelector('main');
//     if (!mainContent || !query || query.trim().length < 2) {
//          console.log("[Script] Search query too short or no main content.");
//          return;
//     }

//     const queryLower = query.trim().toLowerCase();
//     let matchCount = 0;
//     let firstMatchElement = null;

//     // Sử dụng TreeWalker để duyệt qua các text node một cách hiệu quả hơn
//     const walker = document.createTreeWalker(
//         mainContent,
//         NodeFilter.SHOW_TEXT,
//         null, // Sử dụng bộ lọc mặc định (accept all)
//         false // Không mở rộng entity references
//     );

//     let node;
//     while ((node = walker.nextNode())) {
//         const text = node.textContent;
//         const textLower = text.toLowerCase();
//         let lastIndex = 0;

//         while (true) {
//             const matchIndex = textLower.indexOf(queryLower, lastIndex);
//             if (matchIndex === -1) break;

//             // Tạo phần tử <mark> để highlight
//             const mark = document.createElement('mark');
//             mark.className = SEARCH_HIGHLIGHT_CLASS;
//             mark.textContent = text.substring(matchIndex, matchIndex + query.length);

//             // Tách text node thành 3 phần: trước match, match, sau match
//             // node.splitText(matchIndex) sẽ tách node tại matchIndex và trả về phần sau
//             const after = node.splitText(matchIndex);
//             after.textContent = after.textContent.substring(query.length); // Cập nhật phần sau match

//             // Chèn phần tử <mark> vào giữa phần trước và phần sau
//             node.parentNode.insertBefore(mark, after);

//             matchCount++;
//             if (!firstMatchElement) {
//                 firstMatchElement = mark; // Lưu phần tử match đầu tiên để cuộn tới
//             }

//             // Tiếp tục tìm kiếm trong phần còn lại của text node gốc (giờ là 'after')
//             node = after;
//             lastIndex = 0; // Bắt đầu tìm từ đầu của text node mới (phần 'after')
//             // Cần reset walker hoặc tạo walker mới nếu cấu trúc DOM thay đổi đáng kể
//             // Cách đơn giản hơn là duyệt thủ công như vòng lặp while(true) ở trên
//             // hoặc sử dụng một kỹ thuật khác nếu DOM thay đổi nhiều.
//             // Với việc chèn <mark>, cấu trúc DOM thay đổi, nên TreeWalker ban đầu có thể không còn chính xác.
//             // Vòng lặp while(true) với splitText và insertBefore là cách phổ biến trong trường hợp này.
//             // Quay lại cách duyệt thủ công đơn giản hơn:
//             // (Đoạn code này đã được triển khai trong hàm performSearch ở trên)
//         }
//     }

//     console.log(`[Script] Search completed. Found ${matchCount} matches.`);

//     // Cuộn đến kết quả đầu tiên nếu có
//     if (firstMatchElement) {
//         console.log("[Script] Scrolling to the first search result.");
//         firstMatchElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
//     }
// }


// /**
//  * Updates the current year in the footer.
//  * (Assuming this function is needed and not defined elsewhere globally)
//  */
// function updateFooterYear() {
//     console.log("[Script] updateFooterYear called.");
//     const yearElement = document.getElementById(FOOTER_YEAR_ID);
//     if (yearElement) {
//         yearElement.textContent = new Date().getFullYear();
//         console.log("[Script] Footer year updated successfully.");
//     } else {
//         console.warn(`[Script] Footer year element (#${FOOTER_YEAR_ID}) not found.`);
//     }
// }


// --- Main Execution Flow ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("[Script] DOMContentLoaded fired. Starting main execution flow...");

    // Tải header và footer một cách bất đồng bộ
    const headerPromise = loadComponent(HEADER_PLACEHOLDER_ID, HEADER_COMPONENT_URL);
    const footerPromise = loadComponent(FOOTER_PLACEHOLDER_ID, FOOTER_COMPONENT_URL);

    // Chờ cả hai Promise hoàn thành (dù thành công hay thất bại)
    Promise.all([headerPromise, footerPromise]).then(([headerPlaceholder, footerPlaceholder]) => {
        headerFooterLoadAttempted = true; // Đánh dấu đã thử tải
        const headerLoaded = !!headerPlaceholder; // Kiểm tra xem headerPlaceholder có tồn tại và không null không
        const footerLoaded = !!footerPlaceholder; // Kiểm tra xem footerPlaceholder có tồn tại và không null không
        console.log(`[Script] Promise.all finished. Header loaded: ${headerLoaded}, Footer loaded: ${footerLoaded}.`);

        // Nếu header tải thành công, khởi tạo logic menu
        if (headerLoaded) {
             console.log("[Script] Header component successfully loaded. Initializing header menu logic...");
             initializeHeaderMenuLogic(); // Gọi hàm khởi tạo logic menu
        } else {
             console.error("[Script] Header component failed to load. Header menu logic skipped.");
        }

        // Nếu footer tải thành công, cập nhật năm
        if (footerLoaded) {
             console.log("[Script] Footer component successfully loaded. Updating footer year...");
             // Kiểm tra xem hàm updateFooterYear có tồn tại không trước khi gọi
             if (typeof updateFooterYear === 'function') {
                 updateFooterYear(); // Gọi hàm cập nhật năm
             } else {
                 console.warn("[Script] updateFooterYear function not found. Footer year update skipped.");
             }
        } else {
             console.error("[Script] Footer component failed to load. Footer year update skipped.");
        }


        // Khởi tạo hệ thống ngôn ngữ SAU KHI các component đã tải
        // Sử dụng một độ trễ nhỏ để tăng khả năng language.js đã thực thi và định nghĩa initializeLanguage
        setTimeout(() => {
            console.log("[Script] Checking for language initialization functions...");
            if (typeof window.initializeLanguage === 'function') {
                console.log("[Script] initializeLanguage function found (from language.js).");
                // Kiểm tra nếu language chưa được initialize (để tránh chạy lại nếu script.js được include nhiều lần hoặc language.js tự chạy)
                if (!window.languageInitialized) {
                     console.log("[Script] Language system not yet initialized. Calling initializeLanguage...");
                     window.initializeLanguage(); // Hàm này sẽ gọi setLanguage, applyTranslations, và loadInternalNews
                     // Sau khi initializeLanguage chạy, gắn lại listeners cho các nút ngôn ngữ trong header đã load
                     window.attachLanguageButtonListeners?.();
                } else {
                     console.log("[Script] Language already initialized. Re-applying translations and listeners.");
                     const currentLang = localStorage.getItem('preferredLanguage') || 'vi';
                     // Re-apply translations if applyTranslations function exists
                     if (typeof window.applyTranslations === 'function') {
                         console.log(`[Script] Re-applying translations for language: ${currentLang}`);
                         window.applyTranslations(currentLang);
                     } else {
                         console.warn("[Script] applyTranslations function not found. Cannot re-apply translations.");
                     }
                     // Load lại tin tức nếu có container (vì tin tức phụ thuộc ngôn ngữ)
                     if (document.getElementById(NEWS_CONTAINER_ID)) {
                         console.log("[Script] News container found, reloading news after language check.");
                         loadInternalNews(); // Hàm loadInternalNews cần được định nghĩa ở đâu đó
                     } else {
                         console.log("[Script] News container not found.");
                     }
                     // Gắn lại listeners cho các nút ngôn ngữ trong header đã load
                     window.attachLanguageButtonListeners?.();
                }
            } else {
                console.error("[Script] initializeLanguage function not found after timeout. Language features disabled.");
                // Nếu language.js không tải được, vẫn cố gắng tải tin tức với ngôn ngữ mặc định
                if (document.getElementById(NEWS_CONTAINER_ID)) {
                    console.warn("[Script] Language system failed, attempting to load news with default language (VI).");
                     // Định nghĩa tạm translations object nếu không có language.js
                     if (typeof window.translations === 'undefined') {
                         window.translations = { vi: { read_more: 'Đọc thêm →', news_title_na: 'Tiêu đề không có sẵn', news_image_alt: 'Hình ảnh tin tức', no_news: 'Chưa có tin tức nào.', news_load_error: 'Không thể tải tin tức.', loading_news: 'Đang tải tin tức...' } };
                         console.log("[Script] Using temporary default translations.");
                     } else {
                         console.log("[Script] translations object found, using existing.");
                     }
                    loadInternalNews(); // Gọi hàm loadInternalNews
                } else {
                    console.log("[Script] News container not found, skipping news load.");
                }
            }

            // Gắn các sự kiện chuyển đổi ngôn ngữ (nếu hàm tồn tại trong language.js)
            if (typeof window.attachLanguageSwitcherEvents === 'function') {
                console.log("[Script] Attaching language switcher events from language.js...");
                window.attachLanguageSwitcherEvents();
            } else {
                console.warn("[Script] window.attachLanguageSwitcherEvents function not found from language.js.");
            }
        }, 200); // Tăng độ trễ một chút nữa để language.js có thời gian chạy


    }).catch(error => {
        // Catch lỗi nếu Promise.all thất bại hoàn toàn (ví dụ: một trong các Promise reject mà không được catch bên trong)
        console.error("[Script] Uncaught error in Promise.all during component loading:", error);
         headerFooterLoadAttempted = true; // Đánh dấu đã thử load
         // Hiển thị thông báo lỗi nếu load component thất bại hoàn toàn
         const headerPlaceholder = document.getElementById(HEADER_PLACEHOLDER_ID);
         if (headerPlaceholder && headerPlaceholder.innerHTML === '') {
             headerPlaceholder.innerHTML = `<p class="text-red-500 text-center p-4">Không thể tải Header do lỗi không xác định.</p>`;
         }
         const footerPlaceholder = document.getElementById(FOOTER_PLACEHOLDER_ID);
         if (footerPlaceholder && footerPlaceholder.innerHTML === '') {
              footerPlaceholder.innerHTML = `<p class="text-red-500 text-center p-4">Không thể tải Footer do lỗi không xác định.</p>`;
         }
    });

    // --- Page-Specific Initializations (Chạy sau DOMContentLoaded, có thể trước khi header/footer tải xong) ---
    // Các khởi tạo này không phụ thuộc vào header/footer và có thể chạy sớm hơn
    const bodyId = document.body.id;

    // Xử lý RSS feed nếu có container
    if (document.getElementById('vnexpress-rss-feed')) {
        console.log("[Script] RSS container found. Assuming rss-loader.js handles this.");
        // rss-loader.js nên tự chạy hoặc có hàm khởi tạo riêng
    }

    // Xử lý Placement Test nếu đang ở trang đó
    if (bodyId === 'page-placement' && typeof initializePlacementTest === 'function') {
        console.log("[Script] Initializing placement test for page-placement.");
        initializePlacementTest(); // Hàm này cần được định nghĩa trong file js riêng cho trang này
    }

    console.log("[Script] Initial DOMContentLoaded execution flow finished.");
});

// --- Định nghĩa các hàm global nếu chúng chưa được định nghĩa ở nơi khác ---
// Các hàm này được gọi trong initializeHeaderMenuLogic và main execution flow.
// Nếu chúng đã được định nghĩa trong main.js hoặc language.js
// và được gắn vào window object, bạn không cần định nghĩa lại ở đây.
// Nếu không, hãy thêm chúng vào đây.

// Ví dụ (bỏ comment nếu cần):
// function initializeStickyNavbar(navbarElement) { /* ... */ }
// function initializeActiveMenuHighlighting(headerElement) { /* ... */ }
// function clearSearchHighlights() { /* ... */ }
// function performSearch(query) { /* ... */ }
// function updateFooterYear() { /* ... */ }
// window.initializeLanguage = function() { /* ... */ }; // Nếu language.js không tự gắn vào window
// window.handleLanguageChange = function(event) { /* ... */ }; // Nếu language.js không tự gắn vào window
// window.attachLanguageSwitcherEvents = function() { /* ... */ }; // Nếu language.js không tự gắn vào window


// Thêm listener cho theme toggle nếu nó tồn tại trong trang chính
// Listener này có thể chạy ngay sau DOMContentLoaded nếu nút theme toggle có trong HTML chính
 document.addEventListener("DOMContentLoaded", function () {
     const themeToggleBtn = document.getElementById("theme-toggle");
     if (themeToggleBtn) {
         console.log("[Script] Theme toggle button found. Initializing theme logic.");
         const currentTheme = localStorage.getItem("theme") || "light";

         // Apply current theme
         document.body.classList.add(currentTheme + "-mode");
         themeToggleBtn.textContent = currentTheme === "light" ? "Chế độ tối" : "Chế độ sáng";

         // Handle button click
         themeToggleBtn.addEventListener("click", function () {
             const isLightMode = document.body.classList.contains("light-mode");

             // Toggle themes
             document.body.classList.toggle("light-mode", !isLightMode);
             document.body.classList.toggle("dark-mode", isLightMode);

             // Update button text and save theme
             const newTheme = isLightMode ? "dark" : "light";
             themeToggleBtn.textContent = newTheme === "light" ? "Chế độ tối" : "Chế độ sáng";
             localStorage.setItem("theme", newTheme);
             console.log(`[Script] Theme toggled to: ${newTheme}`);
         });
     } else {
         console.log("[Script] Theme toggle button not found.");
     }
 });

