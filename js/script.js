document.addEventListener('DOMContentLoaded', () => {
    // Lấy các phần tử DOM
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const closeMenu = document.querySelector('.close-menu');
    const overlay = document.querySelector('.overlay');
    const dropdowns = document.querySelectorAll('.dropdown-toggle');

    // Kiểm tra xem các phần tử có tồn tại không
    if (!hamburger || !navMenu || !closeMenu || !overlay) {
        console.error('Một hoặc nhiều phần tử không tồn tại: .hamburger, .nav-menu, .close-menu, .overlay');
        return;
    }

    // Xử lý hamburger menu
    hamburger.addEventListener('click', () => {
        navMenu.classList.add('active');
        overlay.classList.add('active');
    });

    // Đóng menu khi nhấp vào nút đóng
    closeMenu.addEventListener('click', () => {
        navMenu.classList.remove('active');
        overlay.classList.remove('active');
    });

    // Đóng menu khi nhấp vào overlay
    overlay.addEventListener('click', () => {
        navMenu.classList.remove('active');
        overlay.classList.remove('active');
    });

    // Xử lý dropdown menu (cho cả máy tính và di động)
    dropdowns.forEach(dropdown => {
        dropdown.addEventListener('click', (e) => {
            e.preventDefault();
            const parent = dropdown.parentElement;
            const dropdownMenu = parent.querySelector('.dropdown-menu');

            // Đóng các menu dropdown khác
            document.querySelectorAll('.dropdown-menu').forEach(menu => {
                if (menu !== dropdownMenu) {
                    menu.classList.remove('show');
                }
            });

            // Toggle menu hiện tại
            dropdownMenu.classList.toggle('show');
        });
    });

    // Đóng dropdown menu khi nhấp ra ngoài
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.dropdown')) {
            document.querySelectorAll('.dropdown-menu').forEach(menu => {
                menu.classList.remove('show');
            });
        }
    });

    // Đóng menu khi resize màn hình (trên 768px)
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            navMenu.classList.remove('active');
            overlay.classList.remove('active');
            // Đóng tất cả dropdown menu khi resize
            document.querySelectorAll('.dropdown-menu').forEach(menu => {
                menu.classList.remove('show');
            });
        }
    });
});