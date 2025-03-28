document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.main-navigation');
    const closeMenu = document.querySelector('.close-menu');
    const overlay = document.querySelector('.overlay');
    const dropdownToggles = document.querySelectorAll('.main-navigation .nav-tabs .dropdown-toggle');
    const dropdownMenus = document.querySelectorAll('.main-navigation .nav-tabs .dropdown-menu');

    // Toggle menu mobile
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.add('active');
            overlay.classList.add('active');
        });
    }

    if (closeMenu) {
        closeMenu.addEventListener('click', () => {
            navMenu.classList.remove('active');
            overlay.classList.remove('active');
        });
    }

    if (overlay) {
        overlay.addEventListener('click', () => {
            navMenu.classList.remove('active');
            overlay.classList.remove('active');
        });
    }

    // Mobile menu toggle
    function initMobileMenu() {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        const closeMenu = document.querySelector('.close-menu');
        
        if (hamburger && navMenu && closeMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
        
        closeMenu.addEventListener('click', () => {
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
        }
    }
        // Thêm vào hàm xử lý dropdown
    const submenuToggles = document.querySelectorAll('.dropdown-submenu > a');

    submenuToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            if (window.innerWidth <= 992) { // Chỉ áp dụng cho mobile
                e.preventDefault();
                const parent = this.parentElement;
                const submenu = parent.querySelector('.dropdown-submenu');
                
                parent.classList.toggle('active');
                submenu.classList.toggle('show');
            }
        });
    });
    // Gọi hàm khi trang load
    document.addEventListener('DOMContentLoaded', initMobileMenu);
  // Gọi hàm này khi DOM loaded
  document.addEventListener('DOMContentLoaded', initMobileMenu);
    // Hiển thị/ẩn dropdown menu với hiệu ứng fade in/out và đóng khi click ra ngoài
    dropdownToggles.forEach((toggle, index) => {
        toggle.addEventListener('click', (e) => {
            e.preventDefault();
            const currentMenu = dropdownMenus[index];
            if (currentMenu) {
                currentMenu.classList.toggle('show');
                // Thêm hiệu ứng fade in/out cho dropdown
                currentMenu.style.transition = 'opacity 0.3s ease';
                if (currentMenu.classList.contains('show')) {
                    currentMenu.style.opacity = '1';
                } else {
                    currentMenu.style.opacity = '0';
                    setTimeout(() => {
                        currentMenu.style.transition = ''; // reset transition sau khi ẩn
                    }, 300);
                }
            }
        });
    });

    document.addEventListener('click', (e) => {
        dropdownMenus.forEach(menu => {
            if (menu.classList.contains('show') && !menu.contains(e.target) && e.target.className !== 'dropdown-toggle') {
                menu.classList.remove('show');
                // Thêm hiệu ứng fade in/out cho dropdown
                menu.style.transition = 'opacity 0.3s ease';
                menu.style.opacity = '0';
                setTimeout(() => {
                    menu.style.transition = ''; // reset transition sau khi ẩn
                }, 300);
            }
        });
    });

    // Chuyển hướng tự động
    let redirectTimeout;
    const redirectUrl = "https://facebook.com/hr.ivsacademy";
    const countdownDuration = 120000;
    const redirectTimer = document.getElementById('redirect-timer'); // Lấy element hiển thị thời gian
    const cancelButton = document.getElementById("cancel-redirect"); // Lấy nút hủy

    function startRedirectCountdown() {
        if (redirectTimer && cancelButton) {
            let timeLeft = countdownDuration / 1000;
            redirectTimeout = setInterval(() => {
                if (timeLeft <= 0) {
                    clearInterval(redirectTimeout);
                    window.location.href = redirectUrl;
                } else {
                    redirectTimer.textContent = `Website sẽ tự động chuyển đến Fanpage IVS Academy trong ${Math.floor(timeLeft / 60)} phút ${timeLeft % 60} giây...`;
                    timeLeft--;
                }
            }, 1000);

            // Sự kiện hủy chuyển hướng
            cancelButton.addEventListener("click", cancelRedirect);
        }
    }

    function cancelRedirect() {
        clearTimeout(redirectTimeout);
        if (cancelButton && redirectTimer) {
            cancelButton.textContent = "Đã hủy chuyển hướng";
            cancelButton.disabled = true;
            redirectTimer.textContent = "Chuyển hướng đã bị hủy.";
        }
    }

    startRedirectCountdown();
});