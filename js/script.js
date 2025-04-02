/**
 * Khởi tạo các sự kiện cho menu sử dụng event delegation.
 * Gắn listener vào #header sau khi header được tải.
 */
function initializeMenuEventsDelegation() {
    console.log("DEBUG: Initializing menu events using DELEGATION...");
    const headerElement = document.getElementById('header'); // Lấy thẻ header gốc
    const overlay = document.querySelector(".overlay"); // Overlay nằm ngoài header

    if (!headerElement) {
        console.error("DEBUG: Header element (header tag) not found for delegation.");
        return;
    }
    if (!overlay) {
        console.warn("DEBUG: Overlay element (.overlay) not found.");
    }

    // --- Mobile Menu Toggle (Delegated) ---
    headerElement.addEventListener('click', function(event) {
        const hamburger = event.target.closest('.hamburger');
        const closeMenu = event.target.closest('.close-menu');
        const mobileMenu = headerElement.querySelector(".mobile-menu"); // Tìm trong header

        if (hamburger && mobileMenu) {
            console.log("DEBUG: Hamburger clicked (delegated)!");
            mobileMenu.classList.add('active');
            if (overlay) overlay.classList.add('active');
            document.body.classList.add('mobile-menu-active'); // Thêm class vào body
        }

        if (closeMenu && mobileMenu) {
             console.log("DEBUG: Close button clicked (delegated)");
             closeMobileMenu(); // Gọi hàm đóng menu
        }

        // Đóng menu khi bấm link không phải dropdown trong mobile menu
        if (mobileMenu?.classList.contains('active')) {
            const link = event.target.closest('.mobile-nav-tabs a');
            // Kiểm tra link tồn tại và không phải là dropdown toggle
            if (link && !link.classList.contains('dropdown-toggle')) {
                console.log("DEBUG: Non-dropdown mobile link clicked (delegated)");
                closeMobileMenu();
            }
        }
    });

     // Đóng menu khi bấm overlay (Listener riêng cho overlay)
     if(overlay) {
         overlay.addEventListener('click', closeMobileMenu);
     }


    // --- Mobile Dropdown (Accordion - Delegated) ---
    headerElement.addEventListener('click', function(event) {
        const toggle = event.target.closest('.mobile-menu .mobile-nav-tabs li > a.dropdown-toggle');
        if (!toggle) return; // Không phải toggle mobile dropdown thì dừng

        // Ngăn hành vi mặc định CHỈ khi là link # hoặc không có href
        if (toggle.getAttribute('href') === '#' || !toggle.getAttribute('href')) {
            event.preventDefault();
        } else {
            // Nếu là link thật, không ngăn chặn, để nó điều hướng và đóng menu
             closeMobileMenu();
             return; // Thoát sớm để không chạy logic toggle
        }

        const parentLi = toggle.closest('li.dropdown, li.dropdown-submenu');
        if (!parentLi) return;
        const subMenu = parentLi.querySelector(':scope > .dropdown-menu');
        if (!subMenu) return;

        const isActive = parentLi.classList.contains('active');

        // Đóng siblings cùng cấp
        const parentUl = parentLi.parentElement;
        const siblingLis = parentUl.querySelectorAll(':scope > li.active');
        siblingLis.forEach(li => {
            if (li !== parentLi) {
                li.classList.remove('active');
                li.querySelector(':scope > .dropdown-menu')?.classList.remove('show');
                li.querySelector(':scope > a.dropdown-toggle')?.setAttribute('aria-expanded', 'false');
            }
        });

        // Toggle current
        parentLi.classList.toggle('active', !isActive);
        subMenu.classList.toggle('show', !isActive);
        toggle.setAttribute('aria-expanded', String(!isActive)); // Chuyển boolean thành string
        console.log(`DEBUG: Toggled mobile dropdown (delegated) for: ${toggle.textContent.trim()}. Active: ${!isActive}`);
    });


    // --- Desktop Dropdown (Hover/Focus - Delegated JS) ---
    let leaveTimeout = null; // Biến lưu timeout khi rời chuột

    headerElement.addEventListener('mouseover', function(event) {
        if (window.innerWidth <= 992) return; // Chỉ chạy trên desktop

        const dropdownLi = event.target.closest('.nav-tabs > li.dropdown'); // Chỉ bắt sự kiện trên li.dropdown cấp 1
        if (dropdownLi) {
            clearTimeout(leaveTimeout); // Xóa timeout ẩn nếu có
            // Đóng các dropdown khác đang mở
            closeOtherDesktopDropdowns(dropdownLi);
            // Mở dropdown hiện tại
            dropdownLi.classList.add('show-desktop-dropdown');
            dropdownLi.querySelector(':scope > a.dropdown-toggle')?.setAttribute('aria-expanded', 'true');
            // console.log("DEBUG: Mouse entered desktop dropdown (delegated)");
        }
    });

    headerElement.addEventListener('mouseout', function(event) {
        if (window.innerWidth <= 992) return;

        const dropdownLi = event.target.closest('.nav-tabs > li.dropdown');
        if (dropdownLi) {
            // Đặt timeout để ẩn sau một khoảng trễ ngắn
            leaveTimeout = setTimeout(() => {
                // Kiểm tra lại xem chuột có thực sự rời khỏi li và menu con không
                 const isHoveringLi = dropdownLi.matches(':hover');
                 const subMenu = dropdownLi.querySelector(':scope > .dropdown-menu');
                 const isHoveringSubMenu = subMenu ? subMenu.matches(':hover') : false;

                if (!isHoveringLi && !isHoveringSubMenu) {
                    dropdownLi.classList.remove('show-desktop-dropdown');
                     dropdownLi.querySelector(':scope > a.dropdown-toggle')?.setAttribute('aria-expanded', 'false');
                    // console.log("DEBUG: Mouse left desktop dropdown (delegated)");
                } else {
                     // console.log("DEBUG: Mouse potentially moved to submenu, keeping open.");
                }
            }, 150); // Trễ 150ms
        }
    });

    // Xử lý submenu desktop (tương tự, có thể gộp logic nếu muốn)
     headerElement.addEventListener('mouseover', function(event) {
        if (window.innerWidth <= 992) return;
        const submenuLi = event.target.closest('.dropdown-menu > li.dropdown-submenu');
        if (submenuLi) {
            submenuLi.classList.add('show-desktop-dropdown'); // Dùng cùng class để CSS xử lý
            submenuLi.querySelector(':scope > a.dropdown-toggle')?.setAttribute('aria-expanded', 'true');
        }
    });
    headerElement.addEventListener('mouseout', function(event) {
        if (window.innerWidth <= 992) return;
        const submenuLi = event.target.closest('.dropdown-menu > li.dropdown-submenu');
         if (submenuLi) {
             submenuLi.classList.remove('show-desktop-dropdown');
             submenuLi.querySelector(':scope > a.dropdown-toggle')?.setAttribute('aria-expanded', 'false');
         }
    });


    // Đóng tất cả dropdown desktop khi click ra ngoài header
    document.addEventListener('click', function(event) {
        if (window.innerWidth > 992 && !headerElement.contains(event.target)) {
            closeOtherDesktopDropdowns(null); // Đóng tất cả
        }
    });

    // Cập nhật link active khi tải trang
    setActiveNavLink();

    console.log("DEBUG: Delegated menu events initialized.");
}

// Hàm đóng tất cả các dropdown desktop khác (ngoại trừ cái đang hover nếu cần)
function closeOtherDesktopDropdowns(exceptElement) {
    const headerElement = document.getElementById('header'); // Lấy thẻ header gốc
    if (!headerElement) return;
    const openDropdowns = headerElement.querySelectorAll('.nav-tabs li.show-desktop-dropdown');
    openDropdowns.forEach(item => {
        if (item !== exceptElement) {
            item.classList.remove('show-desktop-dropdown');
             item.querySelector(':scope > a.dropdown-toggle')?.setAttribute('aria-expanded', 'false');
             // Đóng cả submenu bên trong nếu có
             item.querySelectorAll('.dropdown-submenu.show-desktop-dropdown').forEach(subItem => {
                 subItem.classList.remove('show-desktop-dropdown');
                 subItem.querySelector(':scope > a.dropdown-toggle')?.setAttribute('aria-expanded', 'false');
             });
        }
    });
}

// Hàm đóng menu mobile (dùng chung)
function closeMobileMenu() {
    const mobileMenu = document.querySelector(".mobile-menu");
    const overlay = document.querySelector(".overlay");
    if(mobileMenu) mobileMenu.classList.remove('active');
    if(overlay) overlay.classList.remove('active');
    document.body.classList.remove('mobile-menu-active'); // Xóa class khỏi body
     // Đóng tất cả submenu mobile khi đóng menu chính
     mobileMenu?.querySelectorAll('.mobile-nav-tabs li.active').forEach(li => {
        li.classList.remove('active');
        li.querySelector(':scope > .dropdown-menu')?.classList.remove('show');
        li.querySelector(':scope > a.dropdown-toggle')?.setAttribute('aria-expanded', 'false');
    });
}


/**
 * Đánh dấu link điều hướng đang hoạt động dựa trên trang hiện tại.
 * Cần được gọi sau khi header đã được tải và DOM sẵn sàng.
 */
function setActiveNavLink() {
    const header = document.querySelector('header');
    if (!header) {
        console.warn("DEBUG: Header not found for setActiveNavLink.");
        return;
    }
    // Đợi một chút để đảm bảo DOM hoàn chỉnh sau khi nhúng header
    // setTimeout(() => {
        const navLinks = header.querySelectorAll('.nav-tabs a:not(.dropdown-toggle)'); // Chỉ lấy link không phải dropdown toggle
        const currentPath = window.location.pathname.split('/').pop() || 'index.html';
        let isSubmenuActive = false;

        navLinks.forEach(link => {
            const linkPath = (link.getAttribute('href') || '').split('/').pop();
            link.classList.remove('active'); // Xóa active cũ
            if (linkPath === currentPath) {
                link.classList.add('active');
                console.log(`DEBUG: Active link set for: ${currentPath}`);

                // Đánh dấu active cho menu cha (dropdown) nếu là link con
                const parentDropdownLi = link.closest('li.dropdown');
                parentDropdownLi?.querySelector(':scope > a.dropdown-toggle')?.classList.add('active');

                 // Đánh dấu active cho submenu cha (nếu có)
                 const parentSubmenuLi = link.closest('li.dropdown-submenu');
                 parentSubmenuLi?.querySelector(':scope > a.dropdown-toggle')?.classList.add('active');
                 // Và cả dropdown cấp 1 chứa submenu đó
                 parentSubmenuLi?.closest('li.dropdown')?.querySelector(':scope > a.dropdown-toggle')?.classList.add('active');

                 isSubmenuActive = true; // Đánh dấu đã tìm thấy link active
            }
        });

        // Nếu không có link con nào active, kiểm tra xem có trang nào mà menu cấp 1 trỏ đến không
        if (!isSubmenuActive) {
             const topLevelLinks = header.querySelectorAll('.nav-tabs > li > a:not(.dropdown-toggle)');
             topLevelLinks.forEach(link => {
                 const linkPath = (link.getAttribute('href') || '').split('/').pop();
                 if (linkPath === currentPath) {
                     link.classList.add('active');
                     console.log(`DEBUG: Active top-level link set for: ${currentPath}`);
                 }
             });
        }
    // }, 100); // Chờ 100ms
}


/**
 * Khởi tạo đồng hồ đếm ngược và chuyển hướng (nếu có các phần tử).
 */
function startRedirectCountdown() {
    console.log("DEBUG: Attempting to start redirect countdown...");
    const redirectUrl = "https://facebook.com/hr.ivsacademy";
    const countdownDuration = 120; // 120 giây = 2 phút
    const redirectTimerContainer = document.getElementById('redirect-timer'); // Container chứa cả p và button
    const cancelButton = document.getElementById("cancel-redirect");

    // Chỉ chạy nếu cả container và button tồn tại
    if (redirectTimerContainer && cancelButton) {
        console.log("DEBUG: Redirect timer elements found.");
        const timerDisplayElement = redirectTimerContainer.querySelector('p'); // Tìm thẻ p bên trong

        if (!timerDisplayElement) {
            console.error("DEBUG: Timer display element (<p>) inside #redirect-timer not found.");
            // Không hiển thị lỗi ra giao diện, chỉ log console
            return; // Không chạy nếu thiếu thẻ p
        }

        // Hiển thị phần tử đếm ngược (nếu nó bị ẩn ban đầu)
        redirectTimerContainer.style.display = 'block'; // Hoặc 'flex', 'grid' tùy layout

        let timeLeft = countdownDuration;
        let redirectIntervalId = null;

        const updateTimer = () => {
            if (timeLeft <= 0) {
                clearInterval(redirectIntervalId);
                console.log("DEBUG: Timer finished.");
                // Chỉ chuyển hướng nếu nút Hủy chưa được nhấn
                if (!cancelButton.disabled) {
                    console.log(`DEBUG: Redirecting to ${redirectUrl}`);
                    try {
                        window.location.href = redirectUrl;
                    } catch (e) {
                        console.error("DEBUG: Redirect failed.", e);
                        timerDisplayElement.textContent = "Lỗi khi chuyển hướng.";
                    }
                } else {
                    console.log("DEBUG: Redirect cancelled, not redirecting.");
                }
            } else {
                const minutes = Math.floor(timeLeft / 60);
                const seconds = timeLeft % 60;
                // Cập nhật nội dung thẻ p
                timerDisplayElement.textContent = `Website sẽ tự động chuyển đến Fanpage IVS Academy trong ${minutes} phút ${seconds < 10 ? '0' : ''}${seconds} giây...`;
                timeLeft--;
            }
        };

        // Bắt đầu đếm ngược
        updateTimer(); // Cập nhật lần đầu
        redirectIntervalId = setInterval(updateTimer, 1000);
        console.log("DEBUG: Redirect timer started with interval ID:", redirectIntervalId);

        // Gắn sự kiện cho nút Hủy (chỉ một lần)
        cancelButton.addEventListener("click", () => {
            clearInterval(redirectIntervalId);
            cancelButton.textContent = "Đã hủy chuyển hướng";
            cancelButton.disabled = true; // Vô hiệu hóa nút
            timerDisplayElement.textContent = "Chuyển hướng đã bị hủy.";
            console.log("DEBUG: Redirect cancelled by user.");
        }, { once: true }); // Đảm bảo chỉ chạy 1 lần

    } else {
        // Log nếu không tìm thấy phần tử
        if (!redirectTimerContainer) console.log("DEBUG: Redirect timer container (#redirect-timer) not found.");
        if (!cancelButton) console.log("DEBUG: Cancel redirect button (#cancel-redirect) not found.");
        console.log("DEBUG: Redirect countdown initialization skipped.");
    }
}


// --- Chạy các hàm khởi tạo khi DOM sẵn sàng ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("DEBUG: DOM fully loaded. Starting initial setup.");

    // Đảm bảo có phần tử overlay
    if (!document.querySelector('.overlay')) {
        const overlayDiv = document.createElement('div');
        overlayDiv.className = 'overlay';
        document.body.appendChild(overlayDiv);
        console.log("DEBUG: Overlay created.");
    }

    // Khởi tạo menu ngay lập tức vì header đã được nhúng trực tiếp
    initializeMenuEventsDelegation();

    // Khởi tạo các chức năng khác
    startRedirectCountdown(); // Chạy hàm đếm ngược (nếu có phần tử)

    // Các hàm khác dành riêng cho từng trang (ví dụ: loadPosts, initCarousel)
    // sẽ được gọi trong script của trang đó (như trong index.html đã sửa)

    console.log("DEBUG: Initial setup sequence finished.");
});
