// Hàm tải nội dung header và footer một cách an toàn
function loadComponent(url, elementId) {
    const element = document.getElementById(elementId);
    if (!element) {
        console.error(`Element with ID "${elementId}" not found.`);
        return Promise.reject(`Element with ID "${elementId}" not found.`);
    }
    // Hiển thị thông báo đang tải
    element.innerHTML = `<p style="text-align: center; padding: 20px; color: #888;">Đang tải ${elementId}...</p>`;

    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Không thể tải ${url}. Status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            element.innerHTML = data;
            console.log(`${elementId} loaded successfully.`);
            // Nếu là header, khởi tạo sự kiện menu sau khi tải xong
            if (elementId === 'header') {
                initializeMenuEvents();
            }
        })
        .catch(error => {
            console.error(`Lỗi khi tải ${elementId}:`, error);
            // Hiển thị thông báo lỗi rõ ràng hơn
            element.innerHTML = `<div style="text-align: center; padding: 20px; color: red; border: 1px solid red; border-radius: 5px;">Lỗi khi tải ${elementId}. Vui lòng kiểm tra đường dẫn hoặc kết nối mạng.</div>`;
        });
}

// Khởi tạo các sự kiện cho menu (cả desktop và mobile)
function initializeMenuEvents() {
    console.log("Initializing menu events...");
    const hamburger = document.querySelector(".hamburger");
    // SỬA LỖI: Sử dụng đúng class '.mobile-menu' thay vì '.nav-menu'
    const mobileMenu = document.querySelector(".mobile-menu");
    const closeMenu = document.querySelector(".close-menu");
    const overlay = document.querySelector(".overlay");
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle'); // Bao gồm cả desktop và mobile
    const submenuToggles = document.querySelectorAll('.dropdown-submenu > a'); // Selector cho submenu

    // Kiểm tra xem các phần tử có tồn tại không
    if (!hamburger) console.error("Hamburger button not found.");
    if (!mobileMenu) console.error("Mobile menu element (.mobile-menu) not found.");
    if (!closeMenu) console.error("Close menu button not found.");
    if (!overlay) console.error("Overlay element not found.");

    if (hamburger && mobileMenu && closeMenu && overlay) {
        // Mở menu mobile khi nhấn hamburger
        hamburger.addEventListener('click', () => {
            console.log("Hamburger clicked");
            mobileMenu.classList.add('active');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden'; // Ngăn cuộn trang khi menu mở
        });

        // Đóng menu mobile khi nhấn nút đóng
        closeMenu.addEventListener('click', () => {
            console.log("Close button clicked");
            mobileMenu.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = ''; // Cho phép cuộn trang lại
        });

        // Đóng menu mobile khi nhấn vào overlay
        overlay.addEventListener('click', () => {
            console.log("Overlay clicked");
            mobileMenu.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    } else {
        console.warn("Could not initialize mobile menu interactions because some elements are missing.");
    }

    // Xử lý dropdown cho cả desktop và mobile
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            // Chỉ ngăn chặn hành vi mặc định nếu là link '#' hoặc javascript:void(0)
            if (this.getAttribute('href') === '#' || this.getAttribute('href') === 'javascript:void(0)') {
                e.preventDefault();
            }

            const parentLi = this.closest('li.dropdown, li.dropdown-submenu'); // Tìm li cha gần nhất là dropdown hoặc submenu
            if (!parentLi) return;

            const dropdownMenu = parentLi.querySelector('.dropdown-menu, .dropdown-submenu > .dropdown-submenu'); // Tìm menu con trực tiếp

            if (dropdownMenu) {
                // Đóng tất cả các menu khác cùng cấp hoặc menu cha khác
                const siblingMenus = parentLi.parentElement.querySelectorAll('.dropdown-menu, .dropdown-submenu > .dropdown-submenu');
                siblingMenus.forEach(menu => {
                    if (menu !== dropdownMenu && !menu.contains(dropdownMenu)) {
                         menu.classList.remove('show');
                         menu.closest('li.dropdown, li.dropdown-submenu')?.classList.remove('active');
                    }
                });

                // Toggle menu hiện tại
                const isCurrentlyActive = parentLi.classList.contains('active');
                parentLi.classList.toggle('active', !isCurrentlyActive);
                dropdownMenu.classList.toggle('show', !isCurrentlyActive);

                // Cập nhật aria-expanded
                this.setAttribute('aria-expanded', !isCurrentlyActive);
            }
        });
    });


    // Đóng dropdown khi click ra ngoài (cho desktop)
    document.addEventListener('click', function(event) {
        if (window.innerWidth > 992) { // Chỉ áp dụng cho desktop
            const openDropdown = document.querySelector('.nav-tabs .dropdown.active');
            if (openDropdown && !openDropdown.contains(event.target)) {
                openDropdown.classList.remove('active');
                openDropdown.querySelector('.dropdown-menu')?.classList.remove('show');
                openDropdown.querySelector('.dropdown-toggle')?.setAttribute('aria-expanded', 'false');
            }
        }
    });

    console.log("Menu events initialized.");
}

// Redirect timer logic (chỉ chạy nếu các phần tử tồn tại)
function startRedirectCountdown() {
    const redirectUrl = "https://facebook.com/hr.ivsacademy";
    const countdownDuration = 120; // 120 giây
    const redirectTimerElement = document.getElementById('redirect-timer');
    const cancelButton = document.getElementById("cancel-redirect");

    if (redirectTimerElement && cancelButton) {
        let timeLeft = countdownDuration;
        let redirectTimeoutId = null; // Lưu ID của interval

        const updateTimer = () => {
            if (timeLeft <= 0) {
                clearInterval(redirectTimeoutId);
                // Chỉ chuyển hướng nếu người dùng chưa hủy
                if (!cancelButton.disabled) {
                    window.location.href = redirectUrl;
                }
            } else {
                // Cập nhật nội dung của phần tử chứa timer, không phải cả redirect-notice
                 const timerDisplay = redirectTimerElement.querySelector('p') || redirectTimerElement; // Tìm p hoặc dùng chính redirectTimerElement
                 timerDisplay.textContent = `Website sẽ tự động chuyển đến Fanpage IVS Academy trong ${Math.floor(timeLeft / 60)} phút ${timeLeft % 60} giây...`;
                timeLeft--;
            }
        };

        // Gọi lần đầu để hiển thị ngay lập tức
        updateTimer();
        // Bắt đầu đếm ngược
        redirectTimeoutId = setInterval(updateTimer, 1000);

        // Xử lý nút hủy
        cancelButton.addEventListener("click", () => {
            clearInterval(redirectTimeoutId); // Dừng đếm ngược
            cancelButton.textContent = "Đã hủy chuyển hướng";
            cancelButton.disabled = true; // Vô hiệu hóa nút
             const timerDisplay = redirectTimerElement.querySelector('p') || redirectTimerElement;
             timerDisplay.textContent = "Chuyển hướng đã bị hủy.";
            console.log("Redirect cancelled by user.");
        });
    } else {
        // console.log("Redirect timer elements not found, skipping countdown initialization.");
    }
}


// Load và hiển thị bài viết nổi bật (chỉ chạy nếu các phần tử tồn tại)
async function loadPosts() {
    const postListElement = document.getElementById('post-list');
    if (!postListElement) {
        // console.log("Post list element not found, skipping post loading.");
        return; // Không làm gì nếu không có phần tử #post-list
    }

    try {
        const response = await fetch('posts.json');
        if (!response.ok) throw new Error('Không thể tải file posts.json');
        const posts = await response.json();

        if (posts.length === 0) {
            postListElement.innerHTML = '<p class="no-posts" style="text-align: center; color: #888;">Hiện chưa có bài viết nổi bật nào.</p>';
            return;
        }

        // Xóa nội dung cũ
        postListElement.innerHTML = '';

        // Tạo và thêm các phần tử bài viết
        posts.forEach(post => {
            const postElement = createPostElement(post);
            postListElement.appendChild(postElement);
        });

        // Khởi tạo carousel nếu là màn hình desktop
        if (window.innerWidth > 768) {
            initCarousel();
        } else {
            // Đảm bảo hiển thị dạng grid/flex trên mobile
             postListElement.style.display = 'grid'; // Hoặc 'flex' tùy theo CSS mong muốn
             postListElement.style.gridTemplateColumns = 'repeat(auto-fit, minmax(250px, 1fr))'; // Ví dụ grid
             postListElement.style.gap = '15px';
        }

    } catch (error) {
        console.error('Lỗi khi tải bài viết:', error);
        postListElement.innerHTML = '<p class="error" style="text-align: center; color: red;">Không thể tải danh sách bài viết.</p>';
    }
}


// Hàm tạo phần tử HTML cho một bài viết
function createPostElement(post) {
    const postDiv = document.createElement('div');
    postDiv.className = 'post-preview'; // Class này có thể dùng cho cả carousel và grid

    // Sử dụng ảnh fallback nếu ảnh gốc lỗi
    const fallbackImage = 'images/fallback.jpg'; // Đường dẫn đến ảnh fallback của bạn

    postDiv.innerHTML = `
        <div class="post-image">
            <img src="${post.image}"
                 alt="${post.title || 'Hình ảnh bài viết'}"
                 loading="lazy"
                 onerror="this.onerror=null; this.src='${fallbackImage}'; console.warn('Image failed to load: ${post.image}')">
            ${post.hot ? '<span class="hot-label">HOT</span>' : ''}
        </div>
        <div class="post-content">
            <h3><a href="${post.url || '#'}">${post.title || 'Tiêu đề bài viết'}</a></h3>
            <p>${post.excerpt || 'Nội dung tóm tắt...'}</p>
            <a href="${post.url || '#'}" class="view-more">Xem thêm</a>
        </div>
    `;

    return postDiv;
}


// Khởi tạo carousel (chỉ cho desktop)
function initCarousel() {
    const postList = document.getElementById('post-list');
    // Lấy lại danh sách posts sau khi đã được loadPosts() tạo ra
    const posts = postList.querySelectorAll('.post-preview');
    const prevBtn = document.getElementById('prev-slide');
    const nextBtn = document.getElementById('next-slide');

    // Chỉ khởi tạo nếu có đủ các phần tử và nhiều hơn 1 bài viết
    if (!postList || posts.length <= 1 || !prevBtn || !nextBtn) {
        // Nếu chỉ có 1 bài, ẩn nút điều khiển
        if (prevBtn) prevBtn.style.display = 'none';
        if (nextBtn) nextBtn.style.display = 'none';
        // Đảm bảo bài viết duy nhất được hiển thị đúng
        if (posts.length === 1) {
             posts[0].style.transform = 'translateX(0%)';
             posts[0].style.position = 'relative'; // Hoặc 'static' tùy CSS
             postList.style.height = 'auto'; // Điều chỉnh chiều cao nếu cần
        }
        console.log("Carousel initialization skipped (not enough posts or elements missing).");
        return;
    }

     // Hiển thị lại nút nếu trước đó bị ẩn
     prevBtn.style.display = 'block';
     nextBtn.style.display = 'block';

    let currentIndex = 0;
    const totalPosts = posts.length;
    let slideInterval = null; // Biến lưu interval

     // Reset styles có thể bị ảnh hưởng bởi mobile view
     postList.style.display = 'block'; // Đảm bảo là block để position absolute hoạt động
     postList.style.gridTemplateColumns = '';
     postList.style.gap = '';
     posts.forEach(p => {
         p.style.position = 'absolute'; // Cần thiết cho carousel
         p.style.width = '100%';
         p.style.height = '100%';
     });


    // Định vị các bài viết ban đầu
    posts.forEach((post, index) => {
        post.style.transform = `translateX(${index * 100}%)`;
    });

    // Hàm hiển thị slide
    function showSlide(index) {
        // Xử lý vòng lặp index
        if (index >= totalPosts) {
            currentIndex = 0;
        } else if (index < 0) {
            currentIndex = totalPosts - 1;
        } else {
            currentIndex = index;
        }

        // Di chuyển các slide
        posts.forEach((post, i) => {
            post.style.transform = `translateX(${(i - currentIndex) * 100}%)`;
        });
    }

    // Xử lý nút Previous
    prevBtn.onclick = () => { // Sử dụng onclick để tránh gắn nhiều listener nếu resize
        showSlide(currentIndex - 1);
        resetInterval(); // Reset interval khi người dùng tương tác
    };

    // Xử lý nút Next
    nextBtn.onclick = () => {
        showSlide(currentIndex + 1);
        resetInterval();
    };

    // Hàm reset và bắt đầu lại auto slide
    function resetInterval() {
        clearInterval(slideInterval); // Xóa interval cũ
        slideInterval = setInterval(() => {
            showSlide(currentIndex + 1);
        }, 5000); // Bắt đầu interval mới
    }

    // Bắt đầu auto slide lần đầu
    resetInterval();

    // Tạm dừng khi hover chuột vào carousel
    postList.addEventListener('mouseenter', () => {
        clearInterval(slideInterval);
    });

    // Tiếp tục khi rời chuột khỏi carousel
    postList.addEventListener('mouseleave', () => {
        resetInterval();
    });

    console.log("Carousel initialized.");
}


// Điều chỉnh responsive cho carousel
function handleResize() {
    const postList = document.getElementById('post-list');
    if (!postList) return;

    if (window.innerWidth <= 768) {
        // Mobile view: Dọn dẹp carousel, chuyển sang grid/flex
        clearInterval(window.slideInterval); // Dừng auto slide nếu có
         postList.style.display = 'grid';
         postList.style.gridTemplateColumns = 'repeat(auto-fit, minmax(250px, 1fr))';
         postList.style.gap = '15px';
         postList.style.height = 'auto'; // Reset chiều cao
        const posts = postList.querySelectorAll('.post-preview');
        posts.forEach(post => {
            post.style.position = 'relative'; // Hoặc 'static'
            post.style.transform = 'none';
            post.style.width = 'auto';
            post.style.height = 'auto';
        });
        // Ẩn nút điều khiển carousel
        const prevBtn = document.getElementById('prev-slide');
        const nextBtn = document.getElementById('next-slide');
        if(prevBtn) prevBtn.style.display = 'none';
        if(nextBtn) nextBtn.style.display = 'none';

    } else {
        // Desktop view: Khởi tạo lại carousel nếu chưa có hoặc đã bị dọn dẹp
        // Kiểm tra trạng thái để tránh khởi tạo lại không cần thiết
        if (postList.style.display !== 'block') {
             initCarousel();
        }
    }
}

// Lắng nghe sự kiện resize
window.addEventListener('resize', handleResize);


// --- Chạy các hàm khởi tạo khi DOM sẵn sàng ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM fully loaded.");
    // Load header trước, sau đó khởi tạo menu trong callback của loadComponent
    Promise.all([
        loadComponent('header.html', 'header'),
        loadComponent('footer.html', 'footer')
    ]).then(() => {
        console.log("Header and Footer loaded.");
        // Các hàm khởi tạo khác sẽ chạy sau khi header/footer load xong
        // hoặc được gọi trong callback của loadComponent('header.html', 'header')
        startRedirectCountdown(); // Khởi tạo đếm ngược (nếu có)
        loadPosts().then(() => { // Load bài viết
             handleResize(); // Gọi handleResize sau khi load post để áp dụng đúng layout ban đầu
        });
    }).catch(error => {
        console.error("Error loading initial components:", error);
    });
});
