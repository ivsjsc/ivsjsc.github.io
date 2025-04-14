/**
 * Tải nội dung từ một URL vào một phần tử HTML và thực thi callback (nếu có).
 * QUAN TRỌNG: Hàm này cần ID của placeholder trước, sau đó là URL.
 * @param {string} placeholderId - ID của phần tử placeholder (ví dụ: 'header-placeholder').
 * @param {string} url - Đường dẫn đến tệp HTML cần tải (ví dụ: 'header.html').
 * @param {function} [callback] - Hàm tùy chọn để gọi sau khi nội dung được tải thành công.
 */
function loadComponent(placeholderId, url, callback) { // Đúng thứ tự tham số
    fetch(url) // Fetch sử dụng URL
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status} loading ${url}`);
            }
            return response.text();
        })
        .then(data => {
            const element = document.getElementById(placeholderId); // Tìm element bằng ID
            if (element) {
                element.innerHTML = data;
                console.log(`Component ${url} loaded into #${placeholderId}`);
                // Gọi callback nếu có và là một hàm
                if (typeof callback === 'function') {
                    // Dùng setTimeout để đảm bảo DOM đã cập nhật hoàn toàn trước khi callback chạy
                    setTimeout(callback, 0);
                }
            } else {
                console.error(`Element with ID #${placeholderId} not found for component ${url}.`);
            }
        })
        .catch(error => console.error(`Error loading component ${url}:`, error));
}

/**
 * Hàm tải và hiển thị tin tức nội bộ từ posts.json
 */
function loadInternalNews() {
    console.log("Attempting to load internal news...");
    const newsContainer = document.getElementById('news-container');
    if (!newsContainer) {
        console.error("News container (#news-container) not found.");
        return;
    }

    // Hiển thị trạng thái đang tải (nếu chưa có)
    const currentLangLoading = localStorage.getItem('preferredLanguage') || 'vi';
    const loadingText = translations?.[currentLangLoading]?.loading_news || 'Đang tải tin tức...';
    if (!newsContainer.querySelector('.loading-message')) { // Chỉ thêm nếu chưa có
        newsContainer.innerHTML = `<p class="text-gray-500 w-full text-center loading-message" data-lang-key="loading_news">${loadingText}</p>`;
        newsContainer.className = 'text-center'; // Reset class khi đang tải
    }


    fetch('posts.json') // Đảm bảo file posts.json tồn tại cùng cấp hoặc đúng đường dẫn
        .then(response => {
            if (!response.ok) throw new Error(`Network response was not ok loading posts.json: ${response.statusText}`);
            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) throw new TypeError("Oops, posts.json is not JSON!");
            return response.json();
        })
        .then(posts => {
             if (!newsContainer) return; // Kiểm tra lạiเผื่อ trường hợp DOM thay đổi
            newsContainer.innerHTML = ''; // Xóa "Đang tải..."

            const sortedPosts = Array.isArray(posts) ? posts.sort((a, b) => {
                try {
                    // Ưu tiên 'date', sau đó đến 'id' nếu date giống nhau hoặc không có
                    const dateA = a && a.date ? new Date(a.date) : null;
                    const dateB = b && b.date ? new Date(b.date) : null;
                    const idA = a && a.id ? parseInt(a.id, 10) : 0;
                    const idB = b && b.id ? parseInt(b.id, 10) : 0;

                    if (dateA instanceof Date && !isNaN(dateA) && dateB instanceof Date && !isNaN(dateB)) {
                        if (dateB !== dateA) return dateB - dateA; // Sort by date desc
                    } else if (dateA instanceof Date && !isNaN(dateA)) return -1; // A has date, B doesn't
                    else if (dateB instanceof Date && !isNaN(dateB)) return 1;  // B has date, A doesn't

                    // Fallback to sorting by ID desc if dates are same or invalid
                    return idB - idA;

                } catch(e) { return 0; }
            }) : [];

            // Lấy tối đa 10 bài mới nhất
            const latestPosts = sortedPosts.slice(0, 10);
            const currentLang = localStorage.getItem('preferredLanguage') || 'vi'; // Lấy ngôn ngữ hiện tại

            if (latestPosts.length === 0) {
                const noNewsText = translations?.[currentLang]?.no_news || (currentLang === 'en' ? 'No news yet.' : 'Chưa có tin tức nào.');
                newsContainer.innerHTML = `<p class="text-gray-500 w-full text-center" data-lang-key="no_news">${noNewsText}</p>`;
                newsContainer.className = 'text-center'; // Reset class
                return;
            }

            // Cập nhật lại class cho container để có thể cuộn ngang
            newsContainer.className = 'flex overflow-x-auto space-x-6 pb-4';

            latestPosts.forEach(post => {
                const postElement = document.createElement('div');
                postElement.className = 'bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col w-72 flex-shrink-0'; // w-72 có thể điều chỉnh

                const fallbackImage = 'https://placehold.co/400x250/E2E8F0/A0AEC0?text=News';
                const imageUrl = post.image ? ((post.image.startsWith('/') || post.image.startsWith('http')) ? post.image : '/' + post.image) : fallbackImage;
                const postLink = post.link || '#';
                const title = post.title || (translations?.[currentLang]?.news_title_na || 'N/A');
                const excerpt = post.excerpt || '';
                const dateString = post.date ? new Date(post.date).toLocaleDateString(currentLang === 'en' ? 'en-US' : 'vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '';
                const readMoreText = translations?.[currentLang]?.read_more || 'Xem thêm →';
                const altText = post.title || (translations?.[currentLang]?.news_image_alt || 'News image');

                postElement.innerHTML = `
                    <a href="${postLink}" class="block mb-3 group">
                        <img src="${imageUrl}" alt="${altText}" class="rounded-md w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" onerror="this.onerror=null;this.src='${fallbackImage}';">
                    </a>
                    <div class="flex-grow flex flex-col">
                        <h3 class="text-lg font-semibold text-gray-800 mb-1 group-hover:text-blue-600 transition duration-300 leading-tight">
                            <a href="${postLink}">${title}</a>
                        </h3>
                        <p class="text-gray-500 text-xs mb-2">${dateString}</p>
                        <p class="text-gray-600 text-sm mb-3 flex-grow">${excerpt.substring(0, 80)}${excerpt.length > 80 ? '...' : ''}</p>
                        <div class="mt-auto">
                            <a href="${postLink}" class="text-blue-600 hover:underline font-medium text-sm" data-lang-key="read_more">${readMoreText}</a>
                        </div>
                    </div>
                `;
                newsContainer.appendChild(postElement);
            });
             // Sau khi thêm tin tức, áp dụng lại bản dịch cho nút "Xem thêm" nếu cần
             applyTranslations(currentLang);
        })
        .catch(error => {
            console.error('Lỗi khi tải tin tức nội bộ:', error);
            if(newsContainer) {
                const currentLang = localStorage.getItem('preferredLanguage') || 'vi';
                const errorText = translations?.[currentLang]?.news_load_error || (currentLang === 'en' ? 'Could not load news.' : 'Không thể tải tin tức.');
                newsContainer.innerHTML = `<p class="text-red-500 w-full text-center" data-lang-key="news_load_error">${errorText} ${error.message}.</p>`;
                newsContainer.className = 'text-center'; // Reset class nếu lỗi
            }
        });
}


// --- Chờ DOM tải xong để thực thi ---
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM fully loaded and parsed");

    // --- Tải Header và Footer ---
    loadComponent('header-placeholder', 'header.html', () => {
        console.log("Header loaded. Initializing language and menu...");
        if (typeof initializeLanguage === 'function') {
            initializeLanguage();
        } else {
            console.error("initializeLanguage function not found. Make sure language.js is loaded BEFORE main.js.");
        }
        if (typeof initializeHeaderMenuLogic === 'function') {
            initializeHeaderMenuLogic();
        } else {
             console.error("initializeHeaderMenuLogic function not found.");
        }
    });

    loadComponent('footer-placeholder', 'footer.html', () => {
        console.log("Footer loaded. Applying language to footer...");
         if (typeof applyTranslations === 'function') {
             const currentLang = localStorage.getItem('preferredLanguage') || 'vi';
             applyTranslations(currentLang);
         }
    });


    // --- Logic Menu Header (Di chuyển vào hàm riêng để gọi sau khi header tải) ---
    function initializeHeaderMenuLogic() {
        console.log("Initializing header menu logic...");
        const navbar = document.getElementById('navbar');
        const mobileMenuButton = document.getElementById('mobile-menu-button');
        const mobileMenu = document.getElementById('mobile-menu');
        const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
        const iconMenu = document.getElementById('icon-menu');
        const iconClose = document.getElementById('icon-close');

        if (!mobileMenuButton || !mobileMenu || !mobileMenuOverlay || !iconMenu || !iconClose) {
             console.error("One or more critical mobile menu elements not found after loading header. Check IDs in header.html. Menu functionality might be broken.");
        }

        // Sticky Navbar Logic (optional)
        let lastScrollTop = 0;
        window.addEventListener('scroll', function() {
            if (!navbar) return;
            let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            if (scrollTop > lastScrollTop && scrollTop > 100) {
                navbar.style.top = `-${navbar.offsetHeight}px`;
            } else {
                navbar.style.top = '0';
            }
            lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
        });

        // --- Mobile Menu Toggle ---
        function toggleMobileMenu() {
             if (!mobileMenuButton || !mobileMenu || !mobileMenuOverlay || !iconMenu || !iconClose) {
                 console.error("Cannot toggle mobile menu: elements missing.");
                 return;
             }

            const isExpanded = mobileMenuButton.getAttribute('aria-expanded') === 'true';

            mobileMenuButton.setAttribute('aria-expanded', !isExpanded);
            iconMenu.classList.toggle('hidden', !isExpanded);
            iconClose.classList.toggle('hidden', isExpanded);

            if (!isExpanded) {
                mobileMenuOverlay.classList.remove('hidden');
                mobileMenu.classList.remove('hidden');
                requestAnimationFrame(() => {
                    mobileMenuOverlay.classList.remove('opacity-0');
                    mobileMenu.classList.remove('-translate-x-full');
                    document.body.style.overflow = 'hidden';
                });
            } else {
                mobileMenuOverlay.classList.add('opacity-0');
                mobileMenu.classList.add('-translate-x-full');
                document.body.style.overflow = '';
                setTimeout(() => {
                    mobileMenuOverlay.classList.add('hidden');
                    mobileMenu.classList.add('hidden');
                    closeAllSubmenus();
                }, 300);
            }
        }

        if (mobileMenuButton && mobileMenu && mobileMenuOverlay && iconMenu && iconClose) {
            mobileMenuButton.addEventListener('click', toggleMobileMenu);
            mobileMenuOverlay.addEventListener('click', toggleMobileMenu);
            document.addEventListener('keydown', (event) => {
                if (event.key === 'Escape' && mobileMenuButton.getAttribute('aria-expanded') === 'true') {
                    toggleMobileMenu();
                }
            });
        } else {
             console.error("Could not attach mobile menu toggle listeners: elements missing.");
        }


        // --- Mobile Submenu Toggle ---
        function closeAllSubmenus(exceptThisToggle = null) {
             const allToggles = document.querySelectorAll('#mobile-menu .mobile-submenu-toggle');
             allToggles.forEach(otherToggle => {
                if (otherToggle !== exceptThisToggle) {
                    const otherSubmenu = otherToggle.nextElementSibling;
                    const otherIcon = otherToggle.querySelector('svg');
                    if (otherSubmenu && otherSubmenu.classList.contains('mobile-submenu') && !otherSubmenu.classList.contains('hidden')) {
                        otherSubmenu.classList.add('hidden');
                        otherIcon?.classList.remove('rotate-90');
                    }
                }
            });
        }

        const headerPlaceholder = document.getElementById('header-placeholder');
        if (headerPlaceholder) {
            const currentSubmenuToggles = headerPlaceholder.querySelectorAll('.mobile-submenu-toggle');
            currentSubmenuToggles.forEach(toggle => {
                toggle.addEventListener('click', function(e) {
                    e.preventDefault();
                    const submenu = this.nextElementSibling;
                    const icon = this.querySelector('svg');

                    if (submenu && submenu.classList.contains('mobile-submenu')) {
                        const parentLi = this.closest('li');
                        if (parentLi && parentLi.parentElement) {
                            const siblingToggles = Array.from(parentLi.parentElement.children)
                                                     .map(li => li.querySelector('.mobile-submenu-toggle'))
                                                     .filter(t => t && t !== this);

                            siblingToggles.forEach(siblingToggle => {
                                const siblingSubmenu = siblingToggle.nextElementSibling;
                                const siblingIcon = siblingToggle.querySelector('svg');
                                if (siblingSubmenu && !siblingSubmenu.classList.contains('hidden')) {
                                    siblingSubmenu.classList.add('hidden');
                                    siblingIcon?.classList.remove('rotate-90');
                                    const nestedSubmenus = siblingSubmenu.querySelectorAll('.mobile-submenu');
                                    nestedSubmenus.forEach(nested => {
                                        nested.classList.add('hidden');
                                        const nestedIcon = nested.previousElementSibling?.querySelector('svg');
                                        nestedIcon?.classList.remove('rotate-90');
                                    });
                                }
                            });
                        }

                        const isHidden = submenu.classList.toggle('hidden');
                        icon?.classList.toggle('rotate-90', !isHidden);

                        if (isHidden) {
                            const nestedSubmenus = submenu.querySelectorAll('.mobile-submenu');
                            nestedSubmenus.forEach(nested => {
                                nested.classList.add('hidden');
                                 const nestedToggle = nested.previousElementSibling;
                                 const nestedIcon = nestedToggle?.querySelector('svg');
                                nestedIcon?.classList.remove('rotate-90');
                            });
                        }
                    } else {
                        console.warn("Submenu element not found for toggle:", this);
                    }
                });
            });
        } else {
            console.error("Header placeholder not found for attaching submenu listeners.");
        }

         console.log("Header menu logic initialized.");
    } // Kết thúc hàm initializeHeaderMenuLogic


    // --- Optional: Close dropdowns on outside click (Desktop) ---
    document.addEventListener('click', function(event) {
        const openDesktopDropdowns = document.querySelectorAll('.desktop-dropdown.open');
        let isClickInsideDesktopDropdown = false;
        openDesktopDropdowns.forEach(dropdown => {
            if (dropdown.contains(event.target) || dropdown.previousElementSibling?.contains(event.target)) {
                isClickInsideDesktopDropdown = true;
            }
        });
        if (!isClickInsideDesktopDropdown) {
            openDesktopDropdowns.forEach(d => d.classList.remove('open'));
        }

        // Đóng menu mobile nếu click ra ngoài
         const mobileMenuButton = document.getElementById('mobile-menu-button');
         const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
            const isClickInsideMobileMenu = mobileMenu.contains(event.target);
            const isClickOnToggleButton = mobileMenuButton?.contains(event.target);

            if (!isClickInsideMobileMenu && !isClickOnToggleButton) {
                 console.log("Click outside mobile menu, closing...");
                 if (mobileMenuButton?.getAttribute('aria-expanded') === 'true' && typeof toggleMobileMenu === 'function') {
                     toggleMobileMenu(); // Gọi hàm đóng menu đã định nghĩa trong initializeHeaderMenuLogic
                 }
            }
        }
    });


    // --- Các khởi tạo khác cho từng trang cụ thể ---
    const bodyId = document.body.id;
    if (bodyId === 'page-index') {
        // Gọi loadInternalNews ở đây sau khi DOM sẵn sàng
        if (typeof loadInternalNews === 'function') {
             console.log("Index page detected, loading internal news...");
             loadInternalNews();
        } else {
             console.error("loadInternalNews function not found.");
        }
         if (typeof loadVnExpressFeed === 'function') {
             console.log("Index page detected, loading VnExpress feed...");
             loadVnExpressFeed();
         } else {
              console.error("loadVnExpressFeed function not found. Make sure rss-loader.js is loaded.");
         }
    }

    if (bodyId === 'page-placement' && typeof initializePlacementTest === 'function') {
        console.log("Placement test page detected, initializing test...");
        initializePlacementTest();
    }

     if (bodyId === 'page-rnd' && typeof initializeRndPage === 'function') {
         console.log("R&D page detected, initializing...");
         initializeRndPage();
     }

     // Thêm các kiểm tra và gọi hàm khởi tạo cho các trang khác nếu cần...


}); // Kết thúc DOMContentLoaded

