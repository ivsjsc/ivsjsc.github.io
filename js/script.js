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
        const headerPlaceholder = document.getElementById(HEADER_PLACEHOLDER_ID);
        const headerElement = headerPlaceholder?.querySelector('#navbar');

        // Kiểm tra xem header có được tìm thấy không
        if (!headerElement) {
            console.error("[Script] Header (#navbar) not found after loading. Cannot initialize menu.");
            return; // Thoát nếu không tìm thấy header
        }

        console.log("[Script] Initializing header menu logic (including search)... Header element found:", headerElement);

        // Cache các phần tử DOM cần thiết
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
        const desktopSearchButton = headerElement.querySelector('#desktop-search-button');
        const desktopSearchContainer = headerElement.querySelector('#desktop-search-container');
        const desktopSearchInput = headerElement.querySelector('#desktop-search-input');
        const desktopSearchClose = headerElement.querySelector('#desktop-search-close');
        const mobileSearchInput = headerElement.querySelector('#mobile-search');

        // Tìm tất cả các mục menu chính trên desktop có submenu
        const desktopMenuItemsWithSubmenu = headerElement.querySelectorAll('#menu-items > .main-menu-item');
        console.log(`[Script] Found ${desktopMenuItemsWithSubmenu.length} potential desktop main menu items with submenu.`);


        // --- Mobile Menu Toggle Logic (Giữ nguyên, có thể thêm log nếu cần debug mobile) ---
        function toggleMobileMenu(forceOpenState) {
            if (!mobileMenuPanel || !mobileMenuOverlay || !iconMenu || !iconClose || !mobileMenuButton) return;
            const shouldBeOpen = typeof forceOpenState === 'boolean' ? forceOpenState : mobileMenuButton.getAttribute('aria-expanded') === 'false';
            mobileMenuButton.setAttribute('aria-expanded', shouldBeOpen.toString());
            iconMenu.classList.toggle('hidden', shouldBeOpen);
            iconClose.classList.toggle('hidden', !shouldBeOpen);
            requestAnimationFrame(() => {
                if (shouldBeOpen) {
                    mobileMenuOverlay.classList.remove('hidden'); mobileMenuPanel.classList.remove('hidden');
                    mobileMenuOverlay.classList.add('active'); mobileMenuPanel.classList.add('active');
                    document.body.classList.add('overflow-hidden');
                } else {
                    mobileMenuOverlay.classList.remove('active'); mobileMenuPanel.classList.remove('active');
                    document.body.classList.remove('overflow-hidden');
                    const hideAfterTransition = (event) => { if (event.target === mobileMenuPanel && !mobileMenuPanel.classList.contains('active')) { mobileMenuPanel.classList.add('hidden'); mobileMenuOverlay.classList.add('hidden'); } };
                    mobileMenuPanel.addEventListener('transitionend', hideAfterTransition, { once: true });
                    setTimeout(() => { if (!mobileMenuPanel.classList.contains('active')) { mobileMenuPanel.classList.add('hidden'); mobileMenuOverlay.classList.add('hidden'); } }, 350);
                }
            });
        }
        // Đảm bảo trạng thái ban đầu của overlay và panel là hidden (dù CSS cũng nên xử lý)
        if (mobileMenuOverlay && mobileMenuPanel) { mobileMenuOverlay.classList.add('hidden'); mobileMenuPanel.classList.add('hidden'); }
        mobileMenuButton?.addEventListener('click', () => toggleMobileMenu());
        mobileCloseButton?.addEventListener('click', () => toggleMobileMenu(false));
        mobileMenuOverlay?.addEventListener('click', () => toggleMobileMenu(false));
        // Đóng menu mobile khi click vào link bên trong (trừ các nút toggle submenu)
        mobileMenuPanel?.querySelectorAll('a[href]').forEach(link => {
            // Kiểm tra xem link có phải là một phần của nút toggle submenu không
            if (!link.closest('.mobile-submenu-toggle')) {
                link.addEventListener('click', () => {
                    // Thêm một độ trễ nhỏ để cho phép trình duyệt xử lý việc điều hướng trang trước khi đóng menu
                    setTimeout(() => toggleMobileMenu(false), 50);
                });
            }
        });


        // --- Mobile Submenu Accordion Logic (Giữ nguyên, có thể thêm log nếu cần debug mobile) ---
        mobileMenuItems.forEach(item => {
            const button = item.querySelector(':scope > button.mobile-submenu-toggle');
            const submenu = item.querySelector(':scope > .mobile-submenu');
            if (!button || !submenu) return;
            submenu.style.maxHeight = '0'; submenu.style.overflow = 'hidden'; button.setAttribute('aria-expanded', 'false');
            button.addEventListener('click', function(e) {
                e.stopPropagation(); const parentItem = this.closest('.mobile-menu-item'); if (!parentItem) return;
                const isOpen = parentItem.classList.toggle('open'); this.setAttribute('aria-expanded', isOpen);
                if (isOpen) {
                    submenu.style.maxHeight = `${submenu.scrollHeight}px`; submenu.style.overflow = 'visible';
                    const siblings = Array.from(parentItem.parentNode.children).filter(child => child !== parentItem && child.classList.contains('mobile-menu-item') && child.classList.contains('open'));
                    siblings.forEach(sibling => {
                        sibling.classList.remove('open'); const siblingSubmenu = sibling.querySelector(':scope > .mobile-submenu'); const siblingButton = sibling.querySelector(':scope > button.mobile-submenu-toggle');
                        if (siblingSubmenu) { siblingSubmenu.style.maxHeight = '0'; siblingSubmenu.style.overflow = 'hidden'; } siblingButton?.setAttribute('aria-expanded', 'false');
                    });
                } else {
                    submenu.style.maxHeight = '0'; submenu.style.overflow = 'hidden';
                    parentItem.querySelectorAll('.mobile-menu-item.open').forEach(nested => {
                        nested.classList.remove('open'); const nestedSub = nested.querySelector(':scope > .mobile-submenu'); const nestedButton = nested.querySelector(':scope > button.mobile-submenu-toggle');
                        if (nestedSub) { nestedSub.style.maxHeight = '0'; nestedSub.style.overflow = 'hidden'; } nestedButton?.setAttribute('aria-expanded', 'false');
                    });
                }
            });
        });

        // --- Language Dropdown Logic (Giữ nguyên, có thể thêm log nếu cần debug) ---
        function toggleDropdown(dropdownContainer, forceState) {
            if (!dropdownContainer) return; const content = dropdownContainer.querySelector('.language-dropdown-content'); const toggleButton = dropdownContainer.querySelector('.dropdown-toggle'); if (!content || !toggleButton) return;
            const open = typeof forceState === 'boolean' ? forceState : !dropdownContainer.classList.contains('open');
            dropdownContainer.classList.toggle('open', open); toggleButton.setAttribute('aria-expanded', open); content.classList.toggle('hidden', !open);
        }
        desktopLangToggle?.addEventListener('click', e => { e.stopPropagation(); toggleDropdown(desktopLangDropdown); });
        mobileLangToggle?.addEventListener('click', e => { e.stopPropagation(); toggleDropdown(mobileLangDropdown); });
        window.addEventListener('click', event => {
            if (desktopLangDropdown?.classList.contains('open') && !desktopLangDropdown.contains(event.target)) { toggleDropdown(desktopLangDropdown, false); }
            if (mobileLangDropdown?.classList.contains('open') && !mobileLangDropdown.contains(event.target)) { const mobilePanel = document.getElementById('mobile-menu-panel'); if (mobilePanel && !mobilePanel.contains(event.target)) { toggleDropdown(mobileLangDropdown, false); } }
        });
        // Wrapper để gọi handleLanguageChange (từ language.js) và đóng dropdown
        function handleLanguageChangeWrapper(event) {
            // Kiểm tra xem handleLanguageChange có tồn tại không trước khi gọi
            if (typeof window.handleLanguageChange === 'function') {
                console.log("[Script] Calling handleLanguageChange from language.js");
                window.handleLanguageChange(event); // Gọi hàm từ language.js
                const dropdown = event.target.closest('.language-dropdown');
                if (dropdown) toggleDropdown(dropdown, false); // Đóng dropdown sau khi chọn ngôn ngữ
            }
            else {
                console.error("[Script] handleLanguageChange function not found (from language.js). Language content will not update.");
                const dropdown = event.target.closest('.language-dropdown');
                 if (dropdown) toggleDropdown(dropdown, false); // Vẫn đóng dropdown
            }
        }
         // Gắn lại listeners cho các nút chọn ngôn ngữ sau khi header được load
        window.attachLanguageButtonListeners = () => {
            console.log("[Script] Attaching language button listeners...");
            const langButtons = headerElement.querySelectorAll('.lang-button'); // Chỉ tìm trong header đã load
            langButtons.forEach(button => {
                 // Xóa listener cũ trước khi thêm mới để tránh trùng lặp
                 button.removeEventListener('click', handleLanguageChangeWrapper);
                 button.addEventListener('click', handleLanguageChangeWrapper);
            });
            console.log(`[Script] Attached listeners to ${langButtons.length} language buttons.`);
        };


        // --- Search Functionality (Giữ nguyên, có thể thêm log nếu cần debug) ---
        function toggleDesktopSearch(show) {
            if (!desktopSearchContainer || !desktopSearchButton || !desktopSearchInput) return;
            const isActive = desktopSearchContainer.classList.contains('active');
            const shouldShow = typeof show === 'boolean' ? show : !isActive;
            desktopSearchContainer.classList.toggle('active', shouldShow);
            desktopSearchContainer.classList.toggle('hidden', !shouldShow);
            desktopSearchButton.classList.toggle('hidden', shouldShow);
            if (shouldShow) { desktopSearchInput.focus(); }
            else { desktopSearchInput.value = ''; clearSearchHighlights(); }
        }
        // Thêm kiểm tra null trước khi addEventListener
        desktopSearchButton?.addEventListener('click', (e) => { e.stopPropagation(); toggleDesktopSearch(true); });
        desktopSearchClose?.addEventListener('click', () => { toggleDesktopSearch(false); });
        window.addEventListener('click', (event) => { if (desktopSearchContainer?.classList.contains('active') && !desktopSearchContainer.contains(event.target) && event.target !== desktopSearchButton) { toggleDesktopSearch(false); } });
        const handleSearchInput = (event) => { clearTimeout(searchDebounceTimer); const query = event.target.value; searchDebounceTimer = setTimeout(() => { performSearch(query); }, 300); };
         // Thêm kiểm tra null trước khi addEventListener
        desktopSearchInput?.addEventListener('input', handleSearchInput);
        mobileSearchInput?.addEventListener('input', handleSearchInput);
         // Ngăn form submit mặc định
        desktopSearchInput?.closest('form')?.addEventListener('submit', e => e.preventDefault());
        mobileSearchInput?.closest('form')?.addEventListener('submit', e => e.preventDefault());


        // --- Initialize Other Header Features ---
        initializeStickyNavbar(headerElement); // Hàm này cần được định nghĩa ở đâu đó (ví dụ: trong script.js hoặc main.js)
        initializeActiveMenuHighlighting(headerElement); // Hàm này cần được định nghĩa ở đâu đó (ví dụ: trong script.js hoặc main.js)

        menuInitialized = true;
        console.log("[Script] Header menu logic initialized successfully.");
    }

    // Các hàm initializeStickyNavbar, initializeActiveMenuHighlighting, clearSearchHighlights, performSearch, updateFooterYear
    // cần được định nghĩa ở phạm vi có thể truy cập được (ví dụ: trong script.js hoặc main.js)
    // hoặc được nhúng trực tiếp trong file HTML chính nếu không dùng loadComponent.
    // Dựa trên cấu trúc file bạn cung cấp, chúng có vẻ nằm trong script.js hoặc main.js.

    // --- Main Execution Flow (Giữ nguyên) ---
    document.addEventListener('DOMContentLoaded', () => {
        console.log("[Script] DOM loaded. Starting initializations...");

        // Tải header và footer
        const headerPromise = loadComponent(HEADER_PLACEHOLDER_ID, HEADER_COMPONENT_URL);
        const footerPromise = loadComponent(FOOTER_PLACEHOLDER_ID, FOOTER_COMPONENT_URL);

        // Chờ cả hai component tải xong
        Promise.all([headerPromise, footerPromise]).then(([headerPlaceholder, footerPlaceholder]) => {
            headerFooterLoadAttempted = true;
            const headerLoaded = !!headerPlaceholder;
            const footerLoaded = !!footerPlaceholder;
            console.log(`[Script] Component loading finished. Header loaded: ${headerLoaded}, Footer loaded: ${footerLoaded}`);

            // Nếu header tải thành công, khởi tạo logic menu
            if (headerLoaded) {
                 console.log("[Script] Header component loaded. Initializing header menu logic...");
                 initializeHeaderMenuLogic(); // Gọi hàm khởi tạo logic menu từ script.js
            } else {
                 console.error("[Script] Header component failed to load. Header menu logic skipped.");
            }

            // Nếu footer tải thành công, cập nhật năm
            if (footerLoaded) {
                 console.log("[Script] Footer component loaded. Updating footer year...");
                 updateFooterYear(); // Gọi hàm cập nhật năm từ script.js
            } else {
                 console.error("[Script] Footer component failed to load. Footer year update skipped.");
            }


            // Khởi tạo hệ thống ngôn ngữ SAU KHI các component đã tải
            // Sử dụng một độ trễ nhỏ để tăng khả năng language.js đã thực thi và định nghĩa initializeLanguage
            setTimeout(() => {
                if (typeof window.initializeLanguage === 'function') {
                    console.log("[Script] initializeLanguage function found. Proceeding with language initialization.");
                    // Kiểm tra nếu language chưa được initialize (để tránh chạy lại nếu script.js được include nhiều lần)
                    if (!window.languageInitialized) {
                         console.log("[Script] Language system not yet initialized. Calling initializeLanguage...");
                         window.initializeLanguage(); // Hàm này sẽ gọi setLanguage, applyTranslations, và loadInternalNews
                         // Attach listeners sau khi language.js đã định nghĩa handleLanguageChange
                         window.attachLanguageButtonListeners?.();
                    } else {
                         console.log("[Script] Language already initialized. Re-applying translations and listeners.");
                         const currentLang = localStorage.getItem('preferredLanguage') || 'vi';
                         if (typeof window.applyTranslations === 'function') window.applyTranslations(currentLang);
                         // Load lại tin tức nếu có container (vì tin tức phụ thuộc ngôn ngữ)
                         if (document.getElementById(NEWS_CONTAINER_ID)) loadInternalNews();
                         window.attachLanguageButtonListeners?.(); // Gắn lại listeners
                    }
                } else {
                    console.error("[Script] initializeLanguage function not found after timeout. Language features disabled.");
                    // Nếu language.js không tải được, vẫn cố gắng tải tin tức với ngôn ngữ mặc định
                    if (document.getElementById(NEWS_CONTAINER_ID)) {
                        console.warn("[Script] Language system failed, attempting to load news with default language (VI).");
                         // Định nghĩa tạm translations object nếu không có language.js
                         if (typeof window.translations === 'undefined') {
                             window.translations = { vi: { read_more: 'Đọc thêm →', news_title_na: 'Tiêu đề không có sẵn', news_image_alt: 'Hình ảnh tin tức', no_news: 'Chưa có tin tức nào.', news_load_error: 'Không thể tải tin tức.', loading_news: 'Đang tải tin tức...' } };
                         }
                        loadInternalNews();
                    }
                }

                // Gắn các sự kiện chuyển đổi ngôn ngữ (nếu hàm tồn tại trong language.js)
                if (typeof window.attachLanguageSwitcherEvents === 'function') {
                    console.log("[Script] Attaching language switcher events from language.js...");
                    window.attachLanguageSwitcherEvents();
                } else {
                    console.warn("[Script] window.attachLanguageSwitcherEvents function not found from language.js.");
                }
            }, 200); // Tăng độ trễ một chút nữa

        }).catch(error => {
            console.error("[Script] Error in Promise.all during component loading:", error);
             headerFooterLoadAttempted = true; // Đánh dấu đã thử load
             // Hiển thị thông báo lỗi nếu load component thất bại hoàn toàn
             const headerPlaceholder = document.getElementById(HEADER_PLACEHOLDER_ID);
             if (headerPlaceholder && headerPlaceholder.innerHTML === '') {
                 headerPlaceholder.innerHTML = `<p class="text-red-500 text-center p-4">Không thể tải Header.</p>`;
             }
             const footerPlaceholder = document.getElementById(FOOTER_PLACEHOLDER_ID);
             if (footerPlaceholder && footerPlaceholder.innerHTML === '') {
                  footerPlaceholder.innerHTML = `<p class="text-red-500 text-center p-4">Không thể tải Footer.</p>`;
             }
        });

        // --- Page-Specific Initializations (Chạy sau DOMContentLoaded, có thể trước khi header/footer tải xong) ---
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

    // Thêm listener cho theme toggle nếu nó tồn tại trong trang chính
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


