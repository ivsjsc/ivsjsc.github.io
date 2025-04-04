// /js/script.js

// Biến cờ để đảm bảo menu events chỉ được khởi tạo một lần
let menuInitialized = false;

/**
 * Tải nội dung từ một tệp HTML vào một phần tử placeholder.
 * @param {string} placeholderId ID của phần tử placeholder.
 * @param {string} componentUrl Đường dẫn đến tệp HTML component.
 * @returns {Promise<void>} Promise hoàn thành khi component được tải.
 */
function loadComponent(placeholderId, componentUrl) {
    const placeholder = document.getElementById(placeholderId);
    if (!placeholder) {
        console.error(`Placeholder element with ID "${placeholderId}" not found.`);
        return Promise.reject(`Placeholder not found: ${placeholderId}`);
    }

    return fetch(componentUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch ${componentUrl}: ${response.statusText}`);
            }
            return response.text();
        })
        .then(html => {
            placeholder.innerHTML = html;
            console.log(`Component ${componentUrl} loaded into #${placeholderId}`);
        })
        .catch(error => {
            console.error(`Error loading component ${componentUrl}:`, error);
            placeholder.innerHTML = `<p class="text-red-500 text-center">Error loading component: ${componentUrl}</p>`;
            return Promise.reject(error);
        });
}

/**
 * Khởi tạo các sự kiện cho menu (Phiên bản kết hợp: Slide cho main menu, MaxHeight cho submenu).
 * Được gọi SAU KHI header đã được tải thành công.
 */
function initializeCombinedMenuEvents() {
    if (menuInitialized) {
        console.warn("DEBUG: Menu events already initialized. Skipping.");
        return;
    }
    console.log("DEBUG: Initializing COMBINED menu events...");
    // Tìm header bên trong placeholder SAU KHI nó đã được load
    const headerElement = document.getElementById('header-placeholder')?.querySelector('header#navbar');

    if (!headerElement) {
        console.error("DEBUG: Header element (#navbar inside #header-placeholder) not found. Cannot initialize menu events.");
        return; // Thoát nếu không tìm thấy header đã load
    }

    const mobileMenuButton = headerElement.querySelector('#mobile-menu-button');
    const mobileMenu = headerElement.querySelector('#mobile-menu');
    const mobileMenuOverlay = headerElement.querySelector('#mobile-menu-overlay');
    const iconMenu = headerElement.querySelector('#icon-menu');
    const iconClose = headerElement.querySelector('#icon-close');

    // --- Logic Toggle Menu Mobile Chính (Slide Animation) ---
    function toggleMobileMenuPanel() {
        if (!mobileMenu || !mobileMenuButton || !mobileMenuOverlay || !iconMenu || !iconClose) {
            console.error("DEBUG: Core mobile menu elements missing for toggle.");
            return;
        }
        // Sử dụng class 'hidden' để kiểm tra trạng thái đóng/mở ban đầu
        const isOpening = mobileMenu.classList.contains('hidden');
        console.log(`DEBUG: Toggling mobile menu panel. Currently hidden: ${isOpening}`);

        mobileMenuButton.setAttribute('aria-expanded', String(isOpening)); // Chuyển sang chuỗi 'true'/'false'
        iconMenu.classList.toggle('hidden', isOpening);
        iconClose.classList.toggle('hidden', !isOpening);

        if (isOpening) {
            // Mở menu
            mobileMenuOverlay.classList.remove('hidden'); // Hiện overlay trước
            mobileMenu.classList.remove('hidden'); // Hiện panel trước
            document.body.style.overflow = 'hidden'; // Chặn scroll body

            // Buộc trình duyệt tính toán lại layout trước khi thêm class animation
            requestAnimationFrame(() => {
                mobileMenuOverlay.classList.remove('opacity-0'); // Bắt đầu mờ dần overlay
                mobileMenu.classList.remove('translate-x-full'); // Bắt đầu trượt panel vào
                console.log("DEBUG: Mobile menu panel opening animation started.");
            });
        } else {
            // Đóng menu
            mobileMenuOverlay.classList.add('opacity-0'); // Bắt đầu mờ dần overlay
            mobileMenu.classList.add('translate-x-full'); // Bắt đầu trượt panel ra
            document.body.style.overflow = ''; // Cho phép scroll lại body

            // Sử dụng sự kiện transitionend để ẩn hoàn toàn sau khi animation kết thúc
            const handler = (event) => {
                // Chỉ xử lý khi transition kết thúc trên chính mobileMenu (không phải các element con)
                // và khi nó thực sự đã bị đẩy ra (translate-x-full)
                if (event.target === mobileMenu && mobileMenu.classList.contains('translate-x-full')) {
                    mobileMenuOverlay.classList.add('hidden');
                    mobileMenu.classList.add('hidden');
                    closeAllMobileSubmenus(mobileMenu); // Đóng tất cả submenu con khi panel chính đóng
                    console.log("DEBUG: Mobile menu panel closing animation finished and elements hidden.");
                    // Gỡ bỏ event listener sau khi đã chạy
                    mobileMenu.removeEventListener('transitionend', handler);
                }
            };
            // Gắn listener (sẽ tự gỡ bỏ nếu chạy)
            mobileMenu.removeEventListener('transitionend', handler); // Đảm bảo không gắn trùng lặp
            mobileMenu.addEventListener('transitionend', handler);

            // Fallback bằng setTimeout nếu transitionend không kích hoạt (hiếm khi xảy ra)
            setTimeout(() => {
                if (mobileMenu.classList.contains('translate-x-full') && !mobileMenu.classList.contains('hidden')) {
                    console.warn("DEBUG: Closing mobile menu via fallback timeout.");
                    mobileMenuOverlay.classList.add('hidden');
                    mobileMenu.classList.add('hidden');
                    closeAllMobileSubmenus(mobileMenu);
                    mobileMenu.removeEventListener('transitionend', handler); // Gỡ fallback listener nếu đã chạy
                }
            }, 350); // Thời gian lớn hơn transition duration một chút (300ms)
        }
    }

    if (mobileMenuButton) {
        mobileMenuButton.addEventListener('click', toggleMobileMenuPanel);
    } else {
        console.warn("DEBUG: Mobile menu button (#mobile-menu-button) not found.");
    }
    if (mobileMenuOverlay) {
         mobileMenuOverlay.addEventListener('click', toggleMobileMenuPanel); // Đóng khi click overlay
    }

    // --- Logic Toggle Submenu Mobile (MaxHeight Animation - REFINED v2) ---
    const mobileMenuItems = mobileMenu?.querySelectorAll('.mobile-menu-item');

    if (mobileMenuItems && mobileMenuItems.length > 0) {
        mobileMenuItems.forEach(item => {
            const button = item.querySelector(':scope > button.mobile-submenu-toggle');
            const submenu = item.querySelector(':scope > .mobile-submenu');

            if (button && submenu) {
                // Khởi tạo trạng thái và style cho animation nếu chưa có
                if (!submenu.classList.contains('submenu-initialized')) {
                    submenu.style.overflow = 'hidden';
                    submenu.style.transition = 'max-height 0.3s ease-in-out';
                    submenu.style.maxHeight = '0'; // Đảm bảo trạng thái ban đầu là đóng
                    if (!submenu.classList.contains('hidden')) { // Đồng bộ class hidden nếu cần
                         submenu.classList.add('hidden');
                    }
                    submenu.classList.add('submenu-initialized');
                }

                // Gỡ bỏ listener cũ trước khi thêm mới để tránh lỗi
                button.removeEventListener('click', handleSubmenuToggle);
                button.addEventListener('click', handleSubmenuToggle);
            }
        });
    } else {
        console.warn("DEBUG: No mobile menu items (.mobile-menu-item) found for submenu toggling.");
    }

    // Hàm xử lý toggle submenu (tách ra để tránh tạo hàm ẩn danh trong vòng lặp)
    function handleSubmenuToggle(event) {
        event.stopPropagation(); // Ngăn sự kiện click lan ra ngoài
        const button = event.currentTarget;
        const item = button.closest('.mobile-menu-item');
        const submenu = item.querySelector(':scope > .mobile-submenu');

        if (!submenu) return;

        const isCurrentlyHidden = submenu.classList.contains('hidden');

        // Đóng các submenu anh em cùng cấp trước khi mở submenu mới
        const parentContainer = item.parentElement;
        if (parentContainer) {
            const siblingItems = parentContainer.querySelectorAll(':scope > .mobile-menu-item');
            siblingItems.forEach(sibling => {
                if (sibling !== item) {
                    const otherSubmenu = sibling.querySelector(':scope > .mobile-submenu');
                    if (otherSubmenu && !otherSubmenu.classList.contains('hidden')) {
                        closeSingleMobileSubmenu(sibling, otherSubmenu);
                    }
                }
            });
        }

        // Toggle submenu hiện tại
        if (isCurrentlyHidden) {
            // Mở submenu
            submenu.classList.remove('hidden');
            // Đặt maxHeight = scrollHeight để bắt đầu animation
            // Cần tính scrollHeight *sau khi* đã bỏ hidden
            requestAnimationFrame(() => {
                submenu.style.maxHeight = submenu.scrollHeight + "px";
                item.classList.add('open'); // Thêm class open để xoay icon nếu cần
                console.log(`DEBUG: Opening mobile submenu, set max-height: ${submenu.scrollHeight}px`);
                // Không cần xóa maxHeight sau khi mở nữa, để nó tự nhiên
            });
        } else {
            // Đóng submenu
            closeSingleMobileSubmenu(item, submenu);
        }
    }


    // --- Đóng Menu Mobile Khi Click Bên Ngoài hoặc Nhấn Esc ---
     function closeMenuFromOutside(event) {
         if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
             // Kiểm tra xem click có nằm trong header hoặc nút toggle không
             const isClickInsideHeader = headerElement && headerElement.contains(event.target);
             // const isClickOnToggleButton = mobileMenuButton && mobileMenuButton.contains(event.target); // Không cần check nút vì nó nằm trong header

             if (!isClickInsideHeader) {
                 console.log("DEBUG: Clicked outside header, closing mobile menu.");
                 toggleMobileMenuPanel(); // Gọi hàm đóng menu
             }
         }
     }
     function closeMenuOnEscape(event) {
         if (event.key === 'Escape' && mobileMenu && !mobileMenu.classList.contains('hidden')) {
             console.log("DEBUG: Escape pressed, closing mobile menu.");
             toggleMobileMenuPanel(); // Gọi hàm đóng menu
         }
     }
     // Gắn listener vào document, chỉ gắn 1 lần
     document.removeEventListener('click', closeMenuFromOutside); // Gỡ listener cũ nếu có
     document.addEventListener('click', closeMenuFromOutside);
     document.removeEventListener('keydown', closeMenuOnEscape); // Gỡ listener cũ nếu có
     document.addEventListener('keydown', closeMenuOnEscape);


    // --- Active Menu Item Highlighting ---
    initializeActiveMenuHighlighting(headerElement);

    // --- Sticky Navbar Logic (Optional) ---
    initializeStickyNavbar(headerElement);

    // --- Đặt cờ báo đã khởi tạo thành công ---
    menuInitialized = true;
    console.log("DEBUG: COMBINED menu events initialized successfully.");
}

/**
 * Hàm đóng một submenu mobile cụ thể với animation maxHeight (REFINED v2).
 * @param {HTMLElement} item - Phần tử .mobile-menu-item cha.
 * @param {HTMLElement} submenu - Phần tử .mobile-submenu cần đóng.
 */
function closeSingleMobileSubmenu(item, submenu) {
    if (!item || !submenu || submenu.classList.contains('hidden')) return;

    const button = item.querySelector(':scope > button.mobile-submenu-toggle');
    const buttonText = button ? button.textContent.trim() : 'unknown';
    console.log(`DEBUG: Closing single mobile submenu for "${buttonText}"`);

    // 1. Đặt lại maxHeight về giá trị hiện tại (scrollHeight) nếu nó đang là ''
    // Điều này quan trọng để transition từ giá trị cụ thể về 0
    if (submenu.style.maxHeight === '' || submenu.style.maxHeight === 'none') {
        submenu.style.maxHeight = submenu.scrollHeight + "px";
    }

    // 2. Xóa class 'open' để xoay icon lại (nếu có)
    item.classList.remove('open');

    // 3. Buộc reflow nhỏ và bắt đầu transition về maxHeight = 0
    requestAnimationFrame(() => {
        submenu.style.maxHeight = '0';
        console.log(`DEBUG: Closing animation started for "${buttonText}", set max-height: 0`);
    });

    // 4. Lắng nghe transition kết thúc để thêm lại class 'hidden'
    const closeTransitionHandler = (event) => {
        // Chỉ xử lý khi transition kết thúc trên chính submenu và maxHeight đã về 0 (hoặc gần 0)
        if (event.target === submenu && parseFloat(submenu.style.maxHeight) < 1) {
             if (!submenu.classList.contains('hidden')) { // Kiểm tra lần nữa trước khi thêm hidden
                submenu.classList.add('hidden');
                closeAllMobileSubmenus(submenu); // Đệ quy đóng con cháu nếu có
                console.log(`DEBUG: Finished closing mobile submenu for "${buttonText}", added 'hidden'.`);
             }
             submenu.removeEventListener('transitionend', closeTransitionHandler); // Gỡ bỏ listener
        }
    };
    submenu.removeEventListener('transitionend', closeTransitionHandler); // Gỡ listener cũ nếu có
    submenu.addEventListener('transitionend', closeTransitionHandler);

    // 5. Fallback nếu transitionend không kích hoạt
     setTimeout(() => {
         if (!submenu.classList.contains('hidden') && !item.classList.contains('open')) {
             console.warn(`DEBUG: Closing mobile submenu for "${buttonText}" via fallback timeout.`);
             submenu.classList.add('hidden');
             closeAllMobileSubmenus(submenu);
             submenu.removeEventListener('transitionend', closeTransitionHandler); // Gỡ listener nếu fallback chạy
         }
     }, 350); // Thời gian > transition duration
}

/**
 * Hàm đóng tất cả các submenu mobile đang mở bên trong một phần tử cha (kể cả con cháu).
 * @param {HTMLElement} parentElement Phần tử cha (ví dụ: #mobile-menu hoặc một .mobile-submenu).
 */
function closeAllMobileSubmenus(parentElement) {
    if (!parentElement) return;
    // Tìm tất cả các item đang mở trực tiếp bên trong parentElement
    const openItems = parentElement.querySelectorAll(':scope > .mobile-menu-item.open');
    openItems.forEach(item => {
        const submenu = item.querySelector(':scope > .mobile-submenu');
        if (submenu && !submenu.classList.contains('hidden')) {
            closeSingleMobileSubmenu(item, submenu); // Gọi hàm đóng chuẩn
        } else if (item.classList.contains('open')) {
             // Nếu không có submenu hoặc submenu đã ẩn nhưng item vẫn có class 'open'
             item.classList.remove('open');
        }
    });
}

/**
 * Đánh dấu link điều hướng đang hoạt động.
 * @param {HTMLElement} headerElement Phần tử header chứa menu.
 */
function initializeActiveMenuHighlighting(headerElement) {
     if (!headerElement) {
         console.warn("DEBUG: Header element not provided for active link highlighting.");
         return;
     }
     console.log("DEBUG: Initializing active menu highlighting...");

     const currentPagePath = window.location.pathname;
     const currentHref = window.location.href.split('#')[0]; // So sánh không bao gồm hash

     // Lấy tất cả link trong cả menu desktop và mobile
     const menuLinks = headerElement.querySelectorAll('.hidden.md\\:flex a[href], #mobile-menu a[href]');

     // --- Xóa trạng thái active cũ ---
     menuLinks.forEach(link => {
         link.classList.remove('active-menu-item', 'font-semibold', 'text-blue-600');
         const mobileItem = link.closest('.mobile-menu-item');
         if (mobileItem) {
             mobileItem.classList.remove('open'); // Đảm bảo đóng submenu khi reset
             mobileItem.querySelector(':scope > button')?.classList.remove('active-parent-item', 'font-semibold', 'text-blue-600', 'bg-gray-100');
             const submenu = mobileItem.querySelector(':scope > .mobile-submenu');
             // Reset style của submenu mobile nếu nó đã được khởi tạo
             if (submenu && submenu.classList.contains('submenu-initialized')) {
                  submenu.style.maxHeight = '0';
                  if (!submenu.classList.contains('hidden')) {
                       submenu.classList.add('hidden');
                  }
             }
         }
         // Reset cả parent items của desktop menu
         link.closest('.main-menu-item')?.querySelector(':scope > button')?.classList.remove('active-parent-item', 'font-semibold', 'text-blue-600');
         link.closest('.sub-submenu-container')?.querySelector(':scope > button')?.classList.remove('active-parent-item', 'font-semibold', 'text-blue-600');
     });


     // --- Tìm link khớp nhất ---
     let bestMatchLink = null;
     let highestSpecificity = -1; // Độ ưu tiên: -1 (ko khớp), 0 (khớp path thường), 1 (khớp path gốc '/'), 2 (khớp href đầy đủ)

     menuLinks.forEach(link => {
         const linkHref = link.getAttribute('href');
         if (!linkHref || linkHref === '#') return; // Bỏ qua link trống hoặc chỉ là hash

         let linkUrl;
         try {
             // Tạo URL đầy đủ để so sánh path dễ dàng
             linkUrl = new URL(linkHref, window.location.origin);
         } catch (e) {
             console.warn(`DEBUG: Invalid URL in menu: ${linkHref}`);
             return; // Bỏ qua link không hợp lệ
         }

         const linkPath = linkUrl.pathname;
         const linkFullHref = linkUrl.href.split('#')[0]; // So sánh không hash
         let currentSpecificity = -1;

         // Ưu tiên 1: Khớp hoàn toàn href (không hash)
         if (linkFullHref === currentHref) {
             currentSpecificity = 2;
         } else {
             // Ưu tiên 2: Khớp path sau khi chuẩn hóa
             const normalizePath = (path) => {
                 let p = path.endsWith('/') && path.length > 1 ? path.slice(0, -1) : path; // Bỏ dấu / cuối (trừ khi là /)
                 // Chuẩn hóa index.html thành /
                 if (p.endsWith('/index.html')) {
                     p = p.substring(0, p.length - '/index.html'.length);
                 }
                 return p === '' ? '/' : p; // Trả về / nếu path rỗng
             };
             const normalizedLinkPath = normalizePath(linkPath);
             const normalizedCurrentPath = normalizePath(currentPagePath);

             if (normalizedLinkPath === normalizedCurrentPath) {
                 // Ưu tiên trang chủ ('/') hơn các trang khác
                 currentSpecificity = (normalizedCurrentPath === '/') ? 1 : 0;
             }
             // (Có thể thêm logic khớp cha nếu cần, ví dụ /about khớp với /about/team)
         }

         // Cập nhật link khớp nhất dựa trên độ ưu tiên
         if (currentSpecificity > highestSpecificity) {
             highestSpecificity = currentSpecificity;
             bestMatchLink = link;
         }
         // Nếu độ ưu tiên bằng nhau, chọn link có path dài hơn (khớp cụ thể hơn)
         else if (currentSpecificity === highestSpecificity && currentSpecificity >= 0) {
             if (bestMatchLink) {
                 try {
                     const bestMatchPath = (new URL(bestMatchLink.href, window.location.origin)).pathname;
                     if (linkPath.length > bestMatchPath.length) {
                         bestMatchLink = link;
                     }
                 } catch (e) { /* Bỏ qua lỗi URL của bestMatchLink cũ */ }
             }
         }
     });

     // --- Áp dụng class active ---
     if (bestMatchLink) {
         bestMatchLink.classList.add('active-menu-item', 'font-semibold', 'text-blue-600');
         console.log(`DEBUG: Final active link set for: ${bestMatchLink.getAttribute('href')}`);

         // Đánh dấu và mở các menu cha (cả desktop và mobile)
         let currentElement = bestMatchLink;
         while (currentElement && currentElement !== headerElement) {
             const parentMenuItem = currentElement.closest('.main-menu-item, .mobile-menu-item, .sub-submenu-container');
             if (parentMenuItem) {
                 const parentToggle = parentMenuItem.querySelector(':scope > button.nav-link, :scope > a.nav-link'); // Lấy cả button và link (cho mobile)
                 if (parentToggle) {
                     parentToggle.classList.add('active-parent-item', 'font-semibold', 'text-blue-600');
                      // Thêm background cho parent mobile item nếu là button toggle
                      if (parentMenuItem.classList.contains('mobile-menu-item') && parentToggle.tagName === 'BUTTON') {
                           parentToggle.classList.add('bg-gray-100');
                      }
                 }

                 // Tự động mở submenu cha trên mobile nếu link active nằm trong đó
                 if (parentMenuItem.classList.contains('mobile-menu-item')) {
                     const parentSubmenu = parentMenuItem.querySelector(':scope > .mobile-submenu');
                     if (parentSubmenu && parentSubmenu.classList.contains('submenu-initialized') && parentSubmenu.classList.contains('hidden')) {
                         parentMenuItem.classList.add('open');
                         parentSubmenu.classList.remove('hidden');
                         // Đặt maxHeight về '' để nó tự tính toán chiều cao đầy đủ khi hiển thị
                         parentSubmenu.style.maxHeight = '';
                         console.log(`DEBUG: Auto-opening active mobile submenu for: ${parentToggle?.textContent.trim()}`);
                     }
                 }
                 currentElement = parentMenuItem.parentElement; // Đi lên cây DOM
             } else {
                 currentElement = currentElement.parentElement; // Đi lên tiếp nếu không phải menu item
             }
         }
     } else {
         console.log("DEBUG: No suitable active link found.");
     }
}


/**
 * Khởi tạo logic cho sticky navbar.
 * @param {HTMLElement} navbarElement Phần tử header (navbar).
 */
function initializeStickyNavbar(navbarElement) {
    if (!navbarElement) {
        console.warn("DEBUG: Navbar element not provided for sticky behavior.");
        return;
    }
    console.log("DEBUG: Initializing sticky navbar behavior...");
    let lastScrollTop = 0;
    // Sử dụng { passive: true } để cải thiện hiệu suất scroll
    window.addEventListener('scroll', function() {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        // Chỉ ẩn khi scroll xuống và đã qua khỏi chiều cao của navbar
        if (scrollTop > lastScrollTop && scrollTop > navbarElement.offsetHeight){
            // Scroll Down
            navbarElement.style.top = `-${navbarElement.offsetHeight}px`;
        } else {
            // Scroll Up hoặc ở gần top
            navbarElement.style.top = "0";
        }
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // For Mobile or negative scrolling
    }, { passive: true });
}


// --- Chạy các hàm khởi tạo chính khi DOM sẵn sàng ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM fully loaded and parsed.");

    // Biến cờ toàn cục để kiểm tra ngôn ngữ đã được khởi tạo chưa
    window.languageInitialized = false;

    // Tải Header và Footer đồng thời
    const headerPromise = loadComponent('header-placeholder', 'header.html');
    const footerPromise = loadComponent('footer-placeholder', 'footer.html');

    // Xử lý SAU KHI cả header và footer đã được tải XONG
    Promise.all([headerPromise, footerPromise])
        .then(() => {
            console.log("Header and Footer loaded successfully.");

            // 1. Khởi tạo các sự kiện cho Menu (cần header đã load)
            initializeCombinedMenuEvents(); // Gọi hàm khởi tạo menu events mới

            // 2. Khởi tạo Ngôn ngữ (cần header và footer đã load để dịch)
            if (typeof initializeLanguage === 'function') {
                console.log("Calling initializeLanguage() from script.js AFTER components load...");
                initializeLanguage(); // Gọi hàm khởi tạo ngôn ngữ từ language.js
                window.languageInitialized = true; // Đánh dấu đã khởi tạo
            } else {
                console.warn("initializeLanguage function not found. Ensure language.js is loaded correctly AFTER script.js.");
            }
        })
        .catch(errors => {
            console.error("Error loading one or more components (header/footer). Menu and Language initialization might be affected.", errors);
        });

    console.log("script.js initial setup finished (async operations pending).");
});

// Lưu ý: Cần đảm bảo language.js được tải SAU script.js trong HTML
// và language.js KHÔNG tự gọi initializeLanguage() trong sự kiện DOMContentLoaded của nó nữa.
