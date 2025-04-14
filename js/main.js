/**
 * Tải nội dung từ một URL vào một phần tử HTML và thực thi callback (nếu có).
 * @param {string} elementId - ID của phần tử placeholder.
 * @param {string} url - Đường dẫn đến tệp HTML cần tải (ví dụ: 'header.html').
 * @param {function} [callback] - Hàm tùy chọn để gọi sau khi nội dung được tải thành công.
 */
function loadComponent(elementId, url, callback) {
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status} loading ${url}`);
            }
            return response.text();
        })
        .then(data => {
            const element = document.getElementById(elementId);
            if (element) {
                element.innerHTML = data;
                console.log(`Component ${url} loaded into #${elementId}`);
                // Gọi callback nếu có và là một hàm
                if (typeof callback === 'function') {
                    callback();
                }
            } else {
                console.error(`Element with ID #${elementId} not found for component ${url}.`);
            }
        })
        .catch(error => console.error(`Error loading component ${url}:`, error));
}


// --- Chờ DOM tải xong để thực thi ---
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM fully loaded and parsed");

    // --- Tải Header và Footer ---
    // Tải Header TRƯỚC, và gọi initializeLanguage TRONG callback
    loadComponent('header-placeholder', 'header.html', () => {
        console.log("Header loaded. Initializing language system...");
        // Header đã tải xong, bây giờ mới gọi initializeLanguage()
        // Đảm bảo language.js đã được tải và hàm tồn tại
        if (typeof initializeLanguage === 'function') {
            initializeLanguage(); // Gọi hàm từ language.js
        } else {
            console.error("initializeLanguage function not found. Make sure language.js is loaded BEFORE main.js.");
        }

        // --- Khởi tạo các yếu tố trong Header SAU KHI TẢI XONG ---
        // (Di chuyển logic menu vào đây để đảm bảo các nút tồn tại)
        initializeHeaderMenuLogic();

    });

    // Tải Footer (không cần callback đặc biệt ở đây)
    loadComponent('footer-placeholder', 'footer.html');


    // --- Logic Menu Header (Di chuyển vào hàm riêng để gọi sau khi header tải) ---
    function initializeHeaderMenuLogic() {
        console.log("Initializing header menu logic...");
        const navbar = document.getElementById('navbar'); // Có thể nằm trong header.html
        const mobileMenuButton = document.getElementById('mobile-menu-button'); // Nằm trong header.html
        const mobileMenu = document.getElementById('mobile-menu'); // Nằm trong header.html
        const mobileMenuOverlay = document.getElementById('mobile-menu-overlay'); // Nằm trong header.html
        const iconMenu = document.getElementById('icon-menu'); // Nằm trong header.html
        const iconClose = document.getElementById('icon-close'); // Nằm trong header.html
        const submenuToggles = document.querySelectorAll('.mobile-submenu-toggle'); // Nằm trong header.html

        if (!navbar || !mobileMenuButton || !mobileMenu || !mobileMenuOverlay || !iconMenu || !iconClose) {
             console.error("One or more header elements not found after loading header. Check IDs in header.html.");
             // Không nên tiếp tục nếu thiếu các thành phần cơ bản của menu
             // return;
        }

        // Sticky Navbar Logic (optional)
        let lastScrollTop = 0;
        window.addEventListener('scroll', function() {
            if (!navbar) return; // Kiểm tra navbar tồn tại
            let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            if (scrollTop > lastScrollTop && scrollTop > 100) {
                // Scroll Down
                navbar.style.top = `-${navbar.offsetHeight}px`;
            } else {
                // Scroll Up or near top
                navbar.style.top = '0';
            }
            lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
        });

        // --- Mobile Menu Toggle ---
        function toggleMobileMenu() {
            // Kiểm tra lại các element phòng trường hợp lỗi tải header
             if (!mobileMenuButton || !mobileMenu || !mobileMenuOverlay || !iconMenu || !iconClose) {
                 console.error("Cannot toggle mobile menu: elements missing.");
                 return;
             }

            const isExpanded = mobileMenuButton.getAttribute('aria-expanded') === 'true';

            mobileMenuButton.setAttribute('aria-expanded', !isExpanded);
            iconMenu.classList.toggle('hidden', !isExpanded);
            iconClose.classList.toggle('hidden', isExpanded);

            if (!isExpanded) {
                // Mở menu
                mobileMenuOverlay.classList.remove('hidden');
                mobileMenu.classList.remove('hidden');
                requestAnimationFrame(() => {
                    mobileMenuOverlay.classList.remove('opacity-0');
                    mobileMenu.classList.remove('translate-x-full');
                    document.body.style.overflow = 'hidden';
                });
            } else {
                // Đóng menu
                mobileMenuOverlay.classList.add('opacity-0');
                mobileMenu.classList.add('translate-x-full');
                document.body.style.overflow = '';
                setTimeout(() => {
                    mobileMenuOverlay.classList.add('hidden');
                    mobileMenu.classList.add('hidden');
                    closeAllSubmenus(); // Đóng submenu khi đóng menu chính
                }, 300); // Match CSS transition duration
            }
        }

        // Event listener cho nút hamburger (chỉ gắn nếu các element tồn tại)
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
            submenuToggles.forEach(otherToggle => {
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

        submenuToggles.forEach(toggle => {
            toggle.addEventListener('click', function(e) {
                e.preventDefault();
                const submenu = this.nextElementSibling;
                const icon = this.querySelector('svg');

                if (submenu && submenu.classList.contains('mobile-submenu')) {
                    // Tìm các toggle cùng cấp để đóng trước khi mở cái này
                    const parentLi = this.closest('li'); // Giả sử mỗi item menu là một <li>
                    if (parentLi && parentLi.parentElement) {
                        const siblingToggles = Array.from(parentLi.parentElement.children)
                                                 .map(li => li.querySelector('.mobile-submenu-toggle'))
                                                 .filter(t => t && t !== this); // Lấy các toggle khác cùng cấp

                        siblingToggles.forEach(siblingToggle => {
                            const siblingSubmenu = siblingToggle.nextElementSibling;
                            const siblingIcon = siblingToggle.querySelector('svg');
                            if (siblingSubmenu && !siblingSubmenu.classList.contains('hidden')) {
                                siblingSubmenu.classList.add('hidden');
                                siblingIcon?.classList.remove('rotate-90');
                                // Đóng luôn các submenu con của sibling đang đóng
                                const nestedSubmenus = siblingSubmenu.querySelectorAll('.mobile-submenu');
                                nestedSubmenus.forEach(nested => {
                                    nested.classList.add('hidden');
                                    const nestedIcon = nested.previousElementSibling?.querySelector('svg');
                                    nestedIcon?.classList.remove('rotate-90');
                                });
                            }
                        });
                    }

                    // Toggle submenu hiện tại
                    const isHidden = submenu.classList.toggle('hidden');
                    icon?.classList.toggle('rotate-90', !isHidden);

                    // Đóng các submenu con nếu đang đóng submenu cha
                    if (isHidden) {
                        const nestedSubmenus = submenu.querySelectorAll('.mobile-submenu');
                        nestedSubmenus.forEach(nested => {
                            nested.classList.add('hidden');
                             const nestedToggle = nested.previousElementSibling; // Lấy nút toggle của submenu con
                             const nestedIcon = nestedToggle?.querySelector('svg'); // Tìm icon trong nút toggle đó
                            nestedIcon?.classList.remove('rotate-90');
                        });
                    }
                } else {
                    console.warn("Submenu element not found for toggle:", this);
                }
            });
        });

         console.log("Header menu logic initialized.");
    } // Kết thúc hàm initializeHeaderMenuLogic


    // --- Optional: Close dropdowns on outside click (Desktop) ---
    // Logic này có thể cần điều chỉnh tùy thuộc vào cách bạn xây dựng dropdown desktop
    document.addEventListener('click', function(event) {
        // Giả sử dropdown desktop mở bằng class 'group-hover:block' hoặc tương tự
        // Logic này phức tạp hơn nếu dùng hover thuần túy, dễ hơn nếu dùng JS để toggle class 'open'
        const openDesktopDropdowns = document.querySelectorAll('.desktop-dropdown.open'); // Ví dụ nếu dùng class 'open'
        let isClickInsideDesktopDropdown = false;

        openDesktopDropdowns.forEach(dropdown => {
            if (dropdown.contains(event.target) || dropdown.previousElementSibling?.contains(event.target)) {
                isClickInsideDesktopDropdown = true;
            }
        });

        // Đóng dropdown desktop nếu click ra ngoài
        if (!isClickInsideDesktopDropdown) {
            openDesktopDropdowns.forEach(d => d.classList.remove('open')); // Đóng các dropdown desktop
        }

        // Đóng menu mobile nếu click ra ngoài menu VÀ không phải nút toggle
         const mobileMenuButton = document.getElementById('mobile-menu-button');
         const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenu && !mobileMenu.classList.contains('hidden')) { // Chỉ kiểm tra khi menu mobile đang mở
            if (!mobileMenu.contains(event.target) && !mobileMenuButton?.contains(event.target)) {
                 console.log("Click outside mobile menu, closing...");
                 toggleMobileMenu(); // Gọi hàm đóng menu
            }
        }
    });


    // --- Các khởi tạo khác cho từng trang cụ thể ---
    // Ví dụ: Tải tin tức nếu đây là trang chủ (index.html)
    // Bạn cần một cách để xác định trang hiện tại, ví dụ qua ID của body
    const bodyId = document.body.id;
    if (bodyId === 'page-index' && typeof loadNews === 'function') {
         console.log("Index page detected, loading news...");
        loadNews(); // Gọi hàm loadNews (cần được định nghĩa, có thể trong rss-loader.js)
    }

    // Ví dụ: Khởi tạo logic cho trang placement test nếu có
    if (bodyId === 'page-placement' && typeof initializePlacementTest === 'function') {
        console.log("Placement test page detected, initializing test...");
        initializePlacementTest(); // Hàm này cần được định nghĩa trong file JS riêng cho placement test
    }

     // Ví dụ: Khởi tạo logic cho trang R&D nếu có
     if (bodyId === 'page-rnd' && typeof initializeRndPage === 'function') {
         console.log("R&D page detected, initializing...");
         initializeRndPage();
     }

     // Thêm các kiểm tra và gọi hàm khởi tạo cho các trang khác nếu cần...


}); // Kết thúc DOMContentLoaded

