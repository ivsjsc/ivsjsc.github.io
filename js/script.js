/* ========================== */
/* JavaScript Logic     */
/* ========================== */

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
                // Resolve successfully
                return Promise.resolve();
            } else {
                 console.error(`[script.js] Placeholder #${placeholderId} disappeared before loading ${componentUrl}.`);
                 // Reject the promise if placeholder is gone
                 return Promise.reject(`Placeholder #${placeholderId} disappeared.`);
            }
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
    console.log("[script.js] Initializing header menu logic (Mobile, Language, Sticky, Active)...");

    const headerPlaceholder = document.getElementById('header-placeholder');
    // Quan trọng: Query selector #navbar bên trong placeholder
    const headerElement = headerPlaceholder?.querySelector('#navbar');

    if (!headerElement) {
        console.error("[script.js] Header element (#navbar inside #header-placeholder) not found AFTER loading. Cannot initialize menu events.");
        return; // Exit if header isn't found after load attempt
    }

    // Find elements *within* the loaded header
    const mobileMenuButton = headerElement.querySelector('#mobile-menu-button');
    const mobileMenuPanel = headerElement.querySelector('#mobile-menu-panel');
    const mobileMenuOverlay = headerElement.querySelector('#mobile-menu-overlay'); // ID của overlay
    const iconMenu = headerElement.querySelector('#icon-menu'); // Icon hamburger
    const iconClose = headerElement.querySelector('#icon-close'); // Icon close (X)
    const mobileCloseButton = headerElement.querySelector('#mobile-close-button'); // Nút đóng trong panel
    const desktopLangDropdown = headerElement.querySelector('#desktop-language-dropdown'); // Container dropdown desktop
    const desktopLangToggle = headerElement.querySelector('#desktop-lang-toggle'); // Nút toggle dropdown desktop
    const mobileLangDropdown = headerElement.querySelector('#mobile-language-dropdown'); // Container dropdown mobile
    const mobileLangToggle = headerElement.querySelector('#mobile-lang-toggle'); // Nút toggle dropdown mobile

    // Find language buttons globally *after* header/footer load, as they might be in footer too
    // Cần đảm bảo footer đã load nếu nút ngôn ngữ cũng có trong footer
    // Ta sẽ gắn listener cho nút ngôn ngữ sau Promise.allSettled để chắc chắn
    // const langButtons = document.querySelectorAll('.lang-button'); // Tạm thời chưa dùng ở đây

    // --- Mobile Menu Toggle ---
    function toggleMobileMenu(forceOpenState) {
        if (!mobileMenuPanel || !mobileMenuOverlay || !iconMenu || !iconClose || !mobileMenuButton) {
             console.error("[script.js] Core mobile menu elements missing for toggle.");
             return;
        }
        // Xác định trạng thái mong muốn (mở/đóng)
        const shouldBeOpen = typeof forceOpenState === 'boolean' ? forceOpenState : mobileMenuButton.getAttribute('aria-expanded') === 'false';

        mobileMenuButton.setAttribute('aria-expanded', shouldBeOpen.toString());
        iconMenu.classList.toggle('hidden', shouldBeOpen);   // Ẩn icon menu khi mở
        iconClose.classList.toggle('hidden', !shouldBeOpen); // Hiện icon close khi mở

        if (shouldBeOpen) { // Opening
            mobileMenuOverlay.classList.remove('hidden'); // Hiện overlay trước
            mobileMenuPanel.classList.remove('hidden');   // Hiện panel trước
            // Dùng requestAnimationFrame để đảm bảo trình duyệt đã render display:block trước khi bắt đầu transition
            requestAnimationFrame(() => {
                 mobileMenuOverlay.classList.remove('opacity-0'); // Mờ dần overlay
                 mobileMenuPanel.classList.remove('translate-x-full'); // Trượt panel vào
                 document.body.style.overflow = 'hidden'; // Ngăn cuộn body
            });
        } else { // Closing
            mobileMenuOverlay.classList.add('opacity-0'); // Mờ dần overlay đi
            mobileMenuPanel.classList.add('translate-x-full'); // Trượt panel ra
            document.body.style.overflow = ''; // Cho phép cuộn body lại

            // Sử dụng transitionend để ẩn hẳn elements sau khi animation kết thúc
            // Chỉ lắng nghe trên panel vì nó có transition lâu hơn (transform)
             const transitionEndHandler = (event) => {
                 // Chỉ xử lý khi transition của panel kết thúc và panel ĐÃ trượt ra hẳn
                 if (event.target === mobileMenuPanel && mobileMenuPanel.classList.contains('translate-x-full')) {
                     mobileMenuPanel.classList.add('hidden');
                     mobileMenuOverlay.classList.add('hidden');
                     // console.log('[script.js] Mobile menu hidden after transition.');
                     // Không cần remove listener nếu dùng { once: true }
                 }
             };
             // Xóa listener cũ phòng trường hợp click đóng nhanh nhiều lần
            mobileMenuPanel.removeEventListener('transitionend', transitionEndHandler);
            mobileMenuPanel.addEventListener('transitionend', transitionEndHandler, { once: true }); // Tự động xóa listener sau khi chạy 1 lần

             // Fallback timeout phòng trường hợp sự kiện transitionend không kích hoạt (ít gặp)
             setTimeout(() => {
                 if (mobileMenuPanel.classList.contains('translate-x-full') && !mobileMenuPanel.classList.contains('hidden')) {
                     console.warn("[script.js] Closing mobile menu via fallback timeout.");
                     mobileMenuPanel.classList.add('hidden');
                     mobileMenuOverlay.classList.add('hidden');
                 }
             }, 350); // Thời gian hơi dài hơn transition duration (0.3s = 300ms)
        }
    }

    if (mobileMenuButton) mobileMenuButton.addEventListener('click', () => toggleMobileMenu());
    if (mobileCloseButton) mobileCloseButton.addEventListener('click', () => toggleMobileMenu(false)); // Luôn đóng
    if (mobileMenuOverlay) mobileMenuOverlay.addEventListener('click', () => toggleMobileMenu(false)); // Luôn đóng

    // Đóng mobile menu khi click vào một link bên trong (trừ link toggle submenu)
    if (mobileMenuPanel) {
        mobileMenuPanel.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', (e) => {
                 // Kiểm tra xem link có nằm trong một nút toggle submenu không
                 if (!link.closest('.mobile-submenu-toggle')) {
                      // Đóng menu sau một khoảng trễ nhỏ để người dùng thấy link được click
                      setTimeout(() => toggleMobileMenu(false), 50);
                 }
                 // Nếu là link toggle submenu, không làm gì cả (hành động toggle đã được xử lý riêng)
            });
        });
    }

    // --- Mobile Submenu Toggle ---
    const mobileSubmenuToggles = headerElement.querySelectorAll('#mobile-menu-panel .mobile-submenu-toggle');
    mobileSubmenuToggles.forEach(button => {
        // Khởi tạo trạng thái ban đầu (đảm bảo đóng)
        const parentItem = button.closest('.mobile-menu-item'); // Item chứa cả button và submenu
        const submenu = parentItem?.querySelector(':scope > .mobile-submenu'); // Submenu ngay cấp dưới
        if (submenu) {
            submenu.style.maxHeight = '0'; // Đảm bảo đóng khi tải trang
            submenu.style.overflow = 'hidden'; // Đảm bảo ẩn nội dung thừa
             // Thêm class cho mũi tên nếu cần (CSS đã style dựa trên class này)
             const arrowIcon = button.querySelector('svg');
             if (arrowIcon && !arrowIcon.classList.contains('submenu-arrow')) {
                 arrowIcon.classList.add('submenu-arrow');
             }
        }
         // Set aria-expanded ban đầu
         button.setAttribute('aria-expanded', 'false');


        button.addEventListener('click', function(e) {
            e.stopPropagation(); // Ngăn sự kiện click lan ra ngoài (ví dụ: đóng menu)
            if (!parentItem || !submenu) return;

            const isOpen = parentItem.classList.toggle('open'); // Toggle class 'open' trên li cha
            this.setAttribute('aria-expanded', isOpen.toString()); // Cập nhật aria-expanded

            if (isOpen) {
                // Mở submenu: đặt max-height bằng chiều cao thực của nó
                submenu.style.maxHeight = submenu.scrollHeight + "px";
            } else {
                // Đóng submenu: đặt max-height về 0
                submenu.style.maxHeight = '0';
                // Đóng tất cả các submenu con BÊN TRONG submenu này
                submenu.querySelectorAll('.mobile-menu-item.open').forEach(nestedOpenItem => {
                    nestedOpenItem.classList.remove('open');
                    const nestedSub = nestedOpenItem.querySelector(':scope > .mobile-submenu');
                    if (nestedSub) nestedSub.style.maxHeight = '0';
                    nestedOpenItem.querySelector('button.mobile-submenu-toggle')?.setAttribute('aria-expanded', 'false');
                });
            }

            // Đóng các submenu anh em khác cùng cấp độ
            const parentList = parentItem.parentNode; // ul hoặc div chứa các mobile-menu-item
             if (parentList) {
                 Array.from(parentList.children).forEach(sibling => {
                     // Nếu là sibling, không phải là chính nó, và đang mở
                     if (sibling !== parentItem && sibling.classList.contains('mobile-menu-item') && sibling.classList.contains('open')) {
                          sibling.classList.remove('open');
                          const siblingSubmenu = sibling.querySelector(':scope > .mobile-submenu');
                          if (siblingSubmenu) siblingSubmenu.style.maxHeight = '0';
                          sibling.querySelector('button.mobile-submenu-toggle')?.setAttribute('aria-expanded', 'false');
                     }
                 });
             }
        });
    });

    // --- Language Dropdown Logic (Chung cho Desktop & Mobile) ---
    function toggleDropdown(dropdownContainer, forceState) {
        if (!dropdownContainer) return;
        const content = dropdownContainer.querySelector('.language-dropdown-content');
        const toggleButton = dropdownContainer.querySelector('.dropdown-toggle');
        if (!content || !toggleButton) return;

        const currentlyOpen = dropdownContainer.classList.contains('open');
        const open = typeof forceState === 'boolean' ? forceState : !currentlyOpen;

        dropdownContainer.classList.toggle('open', open);
        toggleButton.setAttribute('aria-expanded', open.toString());

        // Xử lý ẩn/hiện content (ví dụ cho mobile dùng max-height)
        if (dropdownContainer.id === 'mobile-language-dropdown') {
            if (open) {
                content.style.maxHeight = content.scrollHeight + 'px';
            } else {
                content.style.maxHeight = '0';
            }
        }
        // Cho desktop, thường dùng CSS :hover hoặc class 'open' để hiện/ẩn content
         // Nếu dùng class 'open', có thể thêm/xóa class 'hidden' hoặc điều chỉnh opacity/visibility
         else if (dropdownContainer.id === 'desktop-language-dropdown') {
             content.classList.toggle('hidden', !open); // Ví dụ đơn giản dùng hidden
             // Hoặc phức tạp hơn với opacity/transform cho animation
         }
    }

    // Gắn sự kiện cho nút toggle Desktop
    if (desktopLangToggle && desktopLangDropdown) {
        desktopLangToggle.addEventListener('click', (e) => {
            e.stopPropagation(); // Ngăn click lan ra window
            toggleDropdown(desktopLangDropdown);
        });
    }
    // Gắn sự kiện cho nút toggle Mobile
    if (mobileLangToggle && mobileLangDropdown) {
        mobileLangToggle.addEventListener('click', (e) => {
            e.stopPropagation(); // Ngăn click lan ra window hoặc đóng mobile menu
            toggleDropdown(mobileLangDropdown);
        });
    }

    // Gắn listener cho các nút chọn ngôn ngữ (sẽ được gọi lại sau khi language.js chạy)
    function attachLanguageButtonListeners() {
        const langButtons = document.querySelectorAll('.lang-button');
        if (typeof handleLanguageChange === 'function' && langButtons.length > 0) {
            langButtons.forEach(button => {
                // Xóa listener cũ trước khi thêm mới để tránh trùng lặp nếu hàm này được gọi lại
                button.removeEventListener('click', handleLanguageChangeWrapper);
                button.addEventListener('click', handleLanguageChangeWrapper);
            });
            console.log(`[script.js] Language listeners attached to ${langButtons.length} buttons.`);
        } else if (typeof handleLanguageChange !== 'function') {
             console.warn("[script.js] handleLanguageChange function not found. Language switching might not work.");
        }
    }

    // Wrapper để đóng dropdown sau khi chọn ngôn ngữ
    function handleLanguageChangeWrapper(event) {
        handleLanguageChange(event); // Gọi hàm xử lý ngôn ngữ thực tế
        // Đóng dropdown chứa nút vừa click
        const desktopDropdown = event.target.closest('#desktop-language-dropdown');
        if (desktopDropdown) toggleDropdown(desktopDropdown, false);
        const mobileDropdown = event.target.closest('#mobile-language-dropdown');
        if (mobileDropdown) toggleDropdown(mobileDropdown, false);
    }

    // Expose hàm gắn listener để có thể gọi lại từ language.js hoặc sau khi load component xong
    window.attachLanguageButtonListeners = attachLanguageButtonListeners;

    // Đóng language dropdowns khi click ra ngoài
    window.addEventListener('click', function(event) {
         // Đóng dropdown desktop nếu click ra ngoài nó
         if (desktopLangDropdown && desktopLangDropdown.classList.contains('open') && !desktopLangDropdown.contains(event.target)) {
              toggleDropdown(desktopLangDropdown, false);
         }
         // Đóng dropdown mobile nếu click ra ngoài nó
         // Lưu ý: Không đóng nếu click vào nút toggle của nó (đã xử lý stopPropagation)
         if (mobileLangDropdown && mobileLangDropdown.classList.contains('open') && !mobileLangDropdown.contains(event.target)) {
              toggleDropdown(mobileLangDropdown, false);
         }
    });

    // --- Sticky Navbar Logic ---
    initializeStickyNavbar(headerElement); // Truyền phần tử header đã tìm thấy

    // --- Active Menu Item Highlighting ---
    initializeActiveMenuHighlighting(headerElement); // Truyền phần tử header đã tìm thấy

    menuInitialized = true; // Đánh dấu đã khởi tạo xong
    console.log("[script.js] Header menu logic initialized successfully.");
}


/**
 * Đánh dấu link điều hướng đang hoạt động dựa trên URL hiện tại.
 * Cần được gọi sau khi header đã được load và có cấu trúc DOM ổn định.
 * @param {HTMLElement} headerElement Phần tử header chứa menu (ví dụ: #navbar).
 */
function initializeActiveMenuHighlighting(headerElement) {
     if (!headerElement) {
         console.error("[script.js] Cannot initialize active menu highlighting: Header element not provided.");
         return;
     }
     console.log("[script.js] Initializing active menu highlighting...");
     const currentPagePath = window.location.pathname;
     const currentHref = window.location.href.split('#')[0]; // URL không có hash

     // Query links bên trong headerElement để đảm bảo chỉ xử lý menu của header
     const menuLinks = headerElement.querySelectorAll('.nav-link[href], .submenu a[href], #mobile-menu-panel a[href]');

     // Hàm chuẩn hóa path (xóa / cuối, xóa index.html)
     const normalizePath = (path) => {
         let p = path.endsWith('/') && path.length > 1 ? path.slice(0, -1) : path;
         // Tùy chọn: Xóa index.html nếu có
         if (p.endsWith('/index.html')) {
             p = p.substring(0, p.length - '/index.html'.length) || '/'; // Nếu chỉ còn lại '' thì thành '/'
         }
         return p === '' ? '/' : p; // Đảm bảo trang gốc là '/'
     };

     const normalizedCurrentPath = normalizePath(currentPagePath);

     // Reset tất cả trạng thái active trước khi áp dụng cái mới
     menuLinks.forEach(link => {
         link.classList.remove('active-menu-item', 'font-bold', 'text-blue-600', 'bg-blue-100', 'bg-blue-800'); // Xóa các class active tiềm năng
         const mobileItem = link.closest('.mobile-menu-item');
         if (mobileItem) {
              mobileItem.classList.remove('open'); // Đóng submenu mobile
              mobileItem.querySelector('button.mobile-submenu-toggle')?.classList.remove('active-parent-item'); // Xóa class active của nút toggle cha
              const submenu = mobileItem.querySelector(':scope > .mobile-submenu');
              if (submenu) submenu.style.maxHeight = '0'; // Đảm bảo đóng
         }
         const desktopParentItem = link.closest('.main-menu-item'); // Có thể cần class này cho desktop
         if (desktopParentItem) {
             // Xóa các class active của item cha desktop nếu có
             // desktopParentItem.classList.remove('some-desktop-parent-active-class');
         }
     });

     let bestMatchLink = null;
     let highestSpecificity = -1; // Độ ưu tiên: -1=ko khớp, 0=khớp path thường, 1=khớp path gốc '/', 2=khớp href tuyệt đối

     menuLinks.forEach(link => {
         const linkHref = link.getAttribute('href');
         // Bỏ qua link rỗng, link chỉ có #, hoặc link javascript:;
         if (!linkHref || linkHref === '#' || linkHref.startsWith('javascript:')) return;

         let linkUrl;
         try {
              // Tạo URL tuyệt đối từ linkHref và origin của trang hiện tại
              linkUrl = new URL(linkHref, window.location.origin);
         } catch (e) {
              console.warn(`[script.js] Invalid URL in menu link: ${linkHref}`);
              return; // Bỏ qua link có href không hợp lệ
         }

         const linkPath = linkUrl.pathname;
         const linkFullHref = linkUrl.href.split('#')[0]; // URL tuyệt đối không có hash
         const normalizedLinkPath = normalizePath(linkPath);
         let currentSpecificity = -1;

         // Ưu tiên 1: Khớp href tuyệt đối (không hash)
         if (linkFullHref === currentHref) {
             currentSpecificity = 2;
         }
         // Ưu tiên 2: Khớp path đã chuẩn hóa
         else if (normalizedLinkPath === normalizedCurrentPath) {
             // Phân biệt trang chủ ('/') với các trang khác để tránh lỗi
             currentSpecificity = (normalizedCurrentPath === '/') ? 1 : 0;
         }
         // (Có thể thêm logic khớp một phần path nếu cần, ví dụ: /blog/post-1 khớp với /blog/)

         // So sánh độ ưu tiên và chọn link khớp nhất
         if (currentSpecificity > highestSpecificity) {
             highestSpecificity = currentSpecificity;
             bestMatchLink = link;
         }
         // Nếu độ ưu tiên bằng nhau, chọn link có path dài hơn (khớp cụ thể hơn)
         // Ví dụ: Nếu current là /a/b, cả link /a và /a/b đều khớp (specificity = 0), chọn /a/b
         else if (currentSpecificity === highestSpecificity && currentSpecificity >= 0) {
              if (bestMatchLink) {
                   try {
                        const bestMatchPath = (new URL(bestMatchLink.href, window.location.origin)).pathname;
                        if (linkPath.length > bestMatchPath.length) {
                            bestMatchLink = link;
                        }
                   } catch (e) { /* Bỏ qua nếu URL cũ không hợp lệ */ }
              }
         }
     });

     // Áp dụng class active cho link khớp nhất và mở các submenu cha (mobile)
     if (bestMatchLink) {
         bestMatchLink.classList.add('active-menu-item', 'font-bold'); // Class chung
         console.log(`[script.js] Active link set: ${bestMatchLink.getAttribute('href')} (Specificity: ${highestSpecificity})`);

         // Thêm class theo ngữ cảnh (mobile vs desktop)
         const mobilePanel = bestMatchLink.closest('#mobile-menu-panel');
         const desktopMenu = bestMatchLink.closest('.lg\\:flex'); // Selector cho container menu desktop

         if (mobilePanel) {
              bestMatchLink.classList.add('text-blue-600', 'bg-blue-100'); // Style active mobile (Tailwind)

              // Mở các submenu cha chứa link này trong mobile menu
              let currentElement = bestMatchLink;
              while (currentElement && currentElement !== mobilePanel) {
                   const parentMenuItem = currentElement.closest('.mobile-menu-item');
                   if (parentMenuItem) {
                        const parentToggle = parentMenuItem.querySelector(':scope > button.mobile-submenu-toggle');
                        const parentSubmenu = parentMenuItem.querySelector(':scope > .mobile-submenu');

                        if (parentToggle && parentSubmenu && !parentMenuItem.classList.contains('open')) {
                             // Chỉ mở nếu chưa mở
                             parentMenuItem.classList.add('open');
                             parentToggle.setAttribute('aria-expanded', 'true');
                             parentToggle.classList.add('active-parent-item'); // Highlight nút toggle cha
                             parentSubmenu.style.maxHeight = parentSubmenu.scrollHeight + "px";
                        } else if (parentToggle) {
                            // Nếu đã mở rồi thì chỉ cần highlight nút toggle
                             parentToggle.classList.add('active-parent-item');
                        }
                        currentElement = parentMenuItem.parentElement; // Đi lên cấp tiếp theo
                   } else {
                        // Nếu không tìm thấy .mobile-menu-item, thoát vòng lặp
                        break;
                   }
              }
         } else if (desktopMenu) {
              // Có thể là link cấp 1 hoặc trong submenu desktop
              const parentMainMenuItem = bestMatchLink.closest('.main-menu-item'); // Item cấp 1 chứa link này
              if (parentMainMenuItem) {
                    const topLevelLink = parentMainMenuItem.querySelector(':scope > .nav-link');
                    if (topLevelLink) {
                        topLevelLink.classList.add('active-menu-item', 'font-bold', 'bg-blue-800'); // Style active link cấp 1 desktop
                    }
              }
              // Nếu link nằm trong submenu desktop, chỉ cần style chính nó là đủ (CSS selector .submenu a.active-menu-item)
              if (bestMatchLink.closest('.submenu')) {
                 bestMatchLink.classList.add('text-blue-600'); // Hoặc style active riêng cho submenu item
                 // bestMatchLink.classList.add('bg-blue-100'); // Ví dụ
              }
         }
     } else {
         console.log("[script.js] No active menu item found for current page.");
     }
}


/**
 * Khởi tạo logic cho sticky navbar (ẩn khi cuộn xuống, hiện khi cuộn lên).
 * @param {HTMLElement} navbarElement Phần tử header (navbar) cần làm sticky.
 */
function initializeStickyNavbar(navbarElement) {
     if (!navbarElement) {
         console.error("[script.js] Cannot initialize sticky navbar: Navbar element not provided.");
         return;
     }
     console.log("[script.js] Initializing sticky navbar...");
     let lastScrollTop = 0;
     const navbarHeight = navbarElement.offsetHeight; // Lấy chiều cao ban đầu

     window.addEventListener('scroll', function() {
         let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

         // Thêm điều kiện chỉ ẩn khi cuộn xuống VÀ đã cuộn qua chiều cao của navbar
         if (scrollTop > lastScrollTop && scrollTop > navbarHeight) {
             // Cuộn xuống -> Ẩn navbar
             navbarElement.style.top = `-${navbarHeight}px`;
         } else {
             // Cuộn lên hoặc ở trên cùng -> Hiện navbar
             navbarElement.style.top = "0";
         }

         lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // Cập nhật vị trí cuộn cuối cùng
     }, { passive: true }); // Sử dụng passive listener để tối ưu hiệu năng cuộn
}


// --- MAIN EXECUTION ---
document.addEventListener('DOMContentLoaded', () => {
     console.log("[script.js] DOM fully loaded. Starting component loading...");

     // Tải Header và Footer đồng thời
     const headerPlaceholder = document.getElementById('header-placeholder');
     const footerPlaceholder = document.getElementById('footer-placeholder');
     const componentPromises = [];

     if (headerPlaceholder) {
         componentPromises.push(loadComponent('header-placeholder', 'header.html'));
     } else {
         console.warn("[script.js] Header placeholder not found. Header won't be loaded.");
         componentPromises.push(Promise.resolve()); // Thêm promise đã resolve để không lỗi Promise.allSettled
     }

     if (footerPlaceholder) {
         componentPromises.push(loadComponent('footer-placeholder', 'footer.html'));
     } else {
         console.warn("[script.js] Footer placeholder not found. Footer won't be loaded.");
         componentPromises.push(Promise.resolve()); // Thêm promise đã resolve
     }


     // Xử lý SAU KHI cả header và footer đã được TẢI XONG (hoặc thất bại)
     Promise.allSettled(componentPromises) // Use allSettled để luôn chạy dù 1 cái lỗi
         .then((results) => {
             const headerLoaded = headerPlaceholder && results[0]?.status === 'fulfilled';
             const footerLoaded = footerPlaceholder && results[componentPromises.length - 1]?.status === 'fulfilled'; // Index có thể thay đổi nếu chỉ có 1 placeholder
             console.log(`[script.js] Header loaded: ${headerLoaded}, Footer loaded: ${footerLoaded}`);
             headerFooterLoaded = true; // Đánh dấu đã (cố gắng) tải xong

             // 1. Khởi tạo Logic Header (chỉ khi header load thành công)
             if (headerLoaded) {
                  initializeHeaderMenuLogic(); // Khởi tạo menu, sticky, active link...
             }

             // 2. Khởi tạo Ngôn ngữ (chạy nếu language.js tồn tại, bất kể component nào load xong)
             // Đảm bảo chạy SAU initializeHeaderMenuLogic nếu cần DOM header/footer cho nút ngôn ngữ
             if (typeof initializeLanguage === 'function') {
                  if (!window.languageInitialized) { // Kiểm tra cờ từ language.js
                       console.log("[script.js] Calling initializeLanguage() AFTER components attempt...");
                       initializeLanguage(); // Gọi hàm từ language.js (sẽ load translations, set lang,...)
                       // Sau khi initializeLanguage chạy xong, các nút ngôn ngữ mới có thể tồn tại
                       if (headerLoaded && typeof window.attachLanguageButtonListeners === 'function') {
                           // Gọi lại việc gắn listener sau khi ngôn ngữ đã khởi tạo và header đã load
                           window.attachLanguageButtonListeners();
                       }
                  } else {
                       console.log("[script.js] Language already initialized, applying translations again...");
                       // Nếu ngôn ngữ đã init rồi (ví dụ SPA), chỉ cần áp dụng lại bản dịch
                       const currentLang = localStorage.getItem('preferredLanguage') || 'vi';
                       if(typeof applyTranslations === 'function') applyTranslations(currentLang);
                       // Và có thể cần gắn lại listener nếu DOM thay đổi nhiều
                       if (headerLoaded && typeof window.attachLanguageButtonListeners === 'function') {
                           window.attachLanguageButtonListeners();
                       }
                  }
             } else {
                  console.error("[script.js] initializeLanguage function not found. Language features won't work.");
             }

             // 3. Cập nhật năm ở footer (chỉ khi footer load thành công)
             if (footerLoaded) {
                  updateFooterYear(); // Gọi hàm cập nhật năm
             }

         })
         .catch(error => {
              // Lỗi này không nên xảy ra với allSettled, trừ khi có lỗi nghiêm trọng trong logic trước đó
              console.error("[script.js] Unexpected error during Promise.allSettled:", error);
         });

     // --- Các khởi tạo khác cho từng trang cụ thể (dựa vào body id hoặc class) ---
     // Nên đặt các hàm này trong file riêng và import nếu phức tạp
     const bodyId = document.body.id;
     if (bodyId === 'page-index') { // Ví dụ trang chủ có id="page-index"
          if (typeof loadInternalNews === 'function') {
               console.log("[script.js] Index page: Loading internal news...");
               loadInternalNews();
          } else { console.warn("[script.js] loadInternalNews function not found."); }
          if (typeof loadVnExpressFeed === 'function') {
               console.log("[script.js] Index page: Loading VnExpress feed...");
               loadVnExpressFeed();
          } else { console.warn("[script.js] loadVnExpressFeed function not found."); }
     } else if (bodyId === 'page-placement' && typeof initializePlacementTest === 'function') { // Trang placement test
          console.log("[script.js] Placement test page: Initializing test...");
          initializePlacementTest();
     }
     // ... thêm các else if cho các trang khác ...

     console.log("[script.js] Initial script execution finished (component loading and async initializations might be pending).");
});

// Hàm cập nhật năm ở footer
// Có thể đặt ở đây hoặc trong file footer.js nếu có
function updateFooterYear() {
     const yearElement = document.getElementById('current-year'); // Cần ID này trong footer.html
     if (yearElement) {
         yearElement.textContent = new Date().getFullYear();
         console.log("[script.js] Footer year updated.");
     } else {
         // Chờ một chút phòng trường hợp footer chưa render hoàn toàn (mặc dù promise đã resolve)
         setTimeout(() => {
             const yearElementRetry = document.getElementById('current-year');
             if (yearElementRetry) {
                 yearElementRetry.textContent = new Date().getFullYear();
                 console.log("[script.js] Footer year updated (on retry).");
             } else {
                console.warn("[script.js] Footer year element (#current-year) not found even after delay.");
             }
         }, 100); // Chờ 100ms rồi thử lại
     }
}