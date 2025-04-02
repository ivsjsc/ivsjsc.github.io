// Chạy script sau khi DOM đã tải hoàn toàn
document.addEventListener('DOMContentLoaded', () => {

    // --- Khởi tạo Menu Mobile ---
    initMobileMenu();
  
    // --- Khởi tạo Dropdown Menus ---
    initDropdowns();
  
    // --- Tải và hiển thị bài viết nổi bật (nếu có) ---
    // Kiểm tra xem có phần tử #post-list không trước khi gọi hàm
    if (document.getElementById('post-list')) {
      loadPosts();
    }
  
    // --- Khởi tạo Đồng hồ đếm ngược chuyển hướng (nếu có) ---
    // Kiểm tra xem có phần tử #redirect-timer không trước khi gọi hàm
    if (document.getElementById('redirect-timer')) {
      initRedirectTimer();
    }
  
  });
  
  // --- Chức năng Menu Mobile ---
  function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMobile = document.querySelector('.nav-mobile');
    const closeMenu = document.querySelector('.close-menu');
    const overlay = document.querySelector('.overlay');
  
    if (hamburger && navMobile && closeMenu && overlay) {
      // Mở menu khi nhấn hamburger
      hamburger.addEventListener('click', () => {
        navMobile.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Ngăn cuộn body
      });
  
      // Đóng menu khi nhấn nút đóng
      closeMenu.addEventListener('click', closeMobileMenu);
  
      // Đóng menu khi nhấn vào overlay
      overlay.addEventListener('click', closeMobileMenu);
    }
  
    function closeMobileMenu() {
      if (navMobile && overlay) {
          navMobile.classList.remove('active');
          overlay.classList.remove('active');
          document.body.style.overflow = ''; // Cho phép cuộn body lại
          // Đóng tất cả dropdown đang mở trong menu mobile khi đóng menu chính
          navMobile.querySelectorAll('.dropdown.active').forEach(openDropdown => {
              openDropdown.classList.remove('active');
              const menu = openDropdown.querySelector('.dropdown-menu');
              if (menu) {
                  menu.classList.remove('show');
                  menu.style.maxHeight = null; // Reset maxHeight nếu dùng hiệu ứng slide
              }
              const toggle = openDropdown.querySelector('.dropdown-toggle');
               if (toggle) {
                  toggle.setAttribute('aria-expanded', 'false');
              }
          });
      }
    }
  }
  
  // --- Chức năng Dropdown Menus (Desktop & Mobile) ---
  function initDropdowns() {
    const dropdowns = document.querySelectorAll('.dropdown');
  
    dropdowns.forEach(dropdown => {
      const toggle = dropdown.querySelector('.dropdown-toggle');
      const menu = dropdown.querySelector('.dropdown-menu');
  
      if (toggle && menu) {
        // Thêm thuộc tính ARIA ban đầu
        toggle.setAttribute('aria-haspopup', 'true');
        toggle.setAttribute('aria-expanded', 'false');
  
        toggle.addEventListener('click', (e) => {
          // Ngăn hành vi mặc định của thẻ a
          e.preventDefault();
          // Ngăn sự kiện click lan tỏa lên document listener bên dưới
          e.stopPropagation();
  
          const isActive = dropdown.classList.contains('active');
  
          // Đóng tất cả các dropdown khác cùng cấp trước khi mở cái mới
          // Chỉ thực hiện trên desktop hoặc khi không phải là submenu
          if (!isMobile() || !dropdown.closest('.dropdown-menu')) {
               closeAllDropdowns(dropdown);
          }
  
          // Toggle trạng thái active và show của dropdown hiện tại
          dropdown.classList.toggle('active', !isActive);
          menu.classList.toggle('show', !isActive);
          toggle.setAttribute('aria-expanded', !isActive);
  
           // Thêm hiệu ứng slide down/up cho mobile (tùy chọn)
           if (isMobile() && menu.classList.contains('show')) {
              menu.style.maxHeight = menu.scrollHeight + "px";
           } else if (isMobile()) {
              menu.style.maxHeight = null;
           }
        });
      }
  
      // Xử lý submenu hover trên desktop (nếu muốn giữ lại)
      // Lưu ý: Đã chuyển sang click hoàn toàn ở trên, phần này có thể bỏ
      // if (!isMobile()) {
      //     const submenus = dropdown.querySelectorAll('.dropdown-submenu');
      //     submenus.forEach(submenu => {
      //         submenu.addEventListener('mouseenter', () => {
      //             submenu.classList.add('active');
      //             const subMenuContent = submenu.querySelector('.dropdown-menu');
      //             if (subMenuContent) subMenuContent.classList.add('show');
      //         });
      //         submenu.addEventListener('mouseleave', () => {
      //             submenu.classList.remove('active');
      //              const subMenuContent = submenu.querySelector('.dropdown-menu');
      //             if (subMenuContent) subMenuContent.classList.remove('show');
      //         });
      //     });
      // }
    });
  
    // Đóng tất cả dropdown khi click ra ngoài
    document.addEventListener('click', () => {
      closeAllDropdowns();
    });
  }
  
  // Hàm đóng tất cả dropdown (ngoại trừ dropdown được chỉ định)
  function closeAllDropdowns(exceptDropdown = null) {
    document.querySelectorAll('.dropdown').forEach(d => {
      // Chỉ đóng nếu nó không phải là dropdown được trừ ra VÀ không phải là cha của dropdown được trừ ra
      if (d !== exceptDropdown && !d.contains(exceptDropdown)) {
        d.classList.remove('active');
        const menu = d.querySelector('.dropdown-menu');
        if (menu) {
            menu.classList.remove('show');
            if (isMobile()) { // Reset maxHeight cho mobile
                menu.style.maxHeight = null;
            }
        }
        const toggle = d.querySelector('.dropdown-toggle');
        if (toggle) {
            toggle.setAttribute('aria-expanded', 'false');
        }
      }
    });
  }
  
  // Hàm kiểm tra có phải màn hình mobile không (dựa trên CSS breakpoint)
  function isMobile() {
    // Giả sử breakpoint là 992px như trong CSS
    return window.innerWidth <= 991;
  }
  
  
  // --- Tải và hiển thị bài viết nổi bật ---
  async function loadPosts() {
    const postListContainer = document.getElementById('post-list'); // Container cho carousel
    const carouselInner = postListContainer?.querySelector('.carousel-inner');
    const carouselControls = postListContainer?.querySelector('.carousel-controls');
  
    if (!postListContainer || !carouselInner || !carouselControls) {
      console.warn("Carousel elements not found.");
      return; // Thoát nếu không tìm thấy các element cần thiết
    }
  
    try {
      const response = await fetch('posts.json'); // Lấy dữ liệu từ posts.json
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const posts = await response.json();
  
      if (!posts || posts.length === 0) {
        carouselInner.innerHTML = '<p style="padding: 20px; text-align: center;">Không có bài viết nổi bật.</p>';
        carouselControls.style.display = 'none'; // Ẩn nút điều khiển nếu không có bài
        return;
      }
  
      // Xóa nội dung cũ (nếu có)
      carouselInner.innerHTML = '';
      carouselControls.innerHTML = ''; // Xóa nút điều khiển cũ
  
      // Tạo các slide và nút điều khiển
      posts.forEach((post, index) => {
        // Tạo slide
        const postElement = document.createElement('div');
        postElement.className = 'post-preview';
        postElement.innerHTML = `
          <div class="post-image">
            <img src="${post.image}" alt="${post.title || 'Hình ảnh bài viết'}" loading="lazy" onerror="this.onerror=null; this.src='https://placehold.co/600x400/eee/ccc?text=Image+Not+Found';">
            ${post.hot ? '<span class="hot-label">HOT</span>' : ''}
          </div>
          <div class="post-content">
            <h3><a href="${post.url}">${post.title || 'Tiêu đề bài viết'}</a></h3>
            <p>${post.excerpt || 'Nội dung tóm tắt...'}</p>
            <a href="${post.url}" class="view-more">Xem thêm <i class="fas fa-arrow-right"></i></a>
          </div>
        `;
        carouselInner.appendChild(postElement);
  
        // Tạo nút điều khiển (indicator)
        const controlButton = document.createElement('button');
        controlButton.className = 'carousel-btn';
        controlButton.setAttribute('data-slide-to', index);
        controlButton.setAttribute('aria-label', `Go to slide ${index + 1}`);
        if (index === 0) {
          controlButton.classList.add('active'); // Active nút đầu tiên
        }
        carouselControls.appendChild(controlButton);
      });
  
      // Khởi tạo carousel
      initCarousel(carouselInner, carouselControls, posts.length);
  
    } catch (error) {
      console.error('Lỗi khi tải bài viết:', error);
      carouselInner.innerHTML = '<p style="padding: 20px; text-align: center; color: red;">Lỗi khi tải bài viết nổi bật.</p>';
      if(carouselControls) carouselControls.style.display = 'none';
    }
  }
  
  // --- Chức năng Carousel ---
  function initCarousel(carouselInner, carouselControls, totalSlides) {
    if (!carouselInner || !carouselControls || totalSlides <= 1) return; // Không cần carousel nếu ít hơn 2 slide
  
    const controlButtons = carouselControls.querySelectorAll('.carousel-btn');
    let currentIndex = 0;
    let slideInterval;
  
    // Hàm hiển thị slide theo index
    function showSlide(index) {
      if (index >= totalSlides) {
          currentIndex = 0;
      } else if (index < 0) {
          currentIndex = totalSlides - 1;
      } else {
          currentIndex = index;
      }
      // Di chuyển carousel-inner
      carouselInner.style.transform = `translateX(-${currentIndex * 100}%)`;
  
      // Cập nhật trạng thái active cho nút điều khiển
      controlButtons.forEach((btn, i) => {
        btn.classList.toggle('active', i === currentIndex);
      });
    }
  
    // Gắn sự kiện cho các nút điều khiển
    controlButtons.forEach(button => {
      button.addEventListener('click', () => {
        const slideIndex = parseInt(button.getAttribute('data-slide-to'));
        showSlide(slideIndex);
        resetInterval(); // Reset tự động chuyển slide khi nhấn nút
      });
    });
  
    // Tự động chuyển slide
    function startInterval() {
        clearInterval(slideInterval); // Xóa interval cũ trước khi tạo mới
        slideInterval = setInterval(() => {
          showSlide(currentIndex + 1);
        }, 5000); // Chuyển slide mỗi 5 giây
    }
  
    // Reset interval (ví dụ khi người dùng tương tác)
    function resetInterval() {
        startInterval();
    }
  
    // Khởi động tự động chuyển slide
    startInterval();
  
    // Tạm dừng khi hover chuột vào carousel (tùy chọn)
    const carouselContainer = carouselInner.closest('.carousel');
    if (carouselContainer) {
        carouselContainer.addEventListener('mouseenter', () => clearInterval(slideInterval));
        carouselContainer.addEventListener('mouseleave', startInterval);
    }
  
    // Hiển thị slide đầu tiên
    showSlide(0);
  }
  
  
  // --- Chức năng Đồng hồ đếm ngược chuyển hướng ---
  function initRedirectTimer() {
    const timerElement = document.getElementById('redirect-timer');
    const cancelBtn = document.getElementById('cancel-redirect');
    const redirectUrl = "https://facebook.com/hr.ivsacademy"; // URL đích
    let timeLeft = 120; // 120 giây = 2 phút
    let redirectTimerInterval;
  
    if (!timerElement || !cancelBtn) return; // Thoát nếu không tìm thấy element
  
    function updateTimer() {
      const minutes = Math.floor(timeLeft / 60);
      const seconds = timeLeft % 60;
  
      // Hiển thị thời gian còn lại
      timerElement.textContent = `Website sẽ tự động chuyển đến Fanpage IVS Academy trong ${minutes} phút ${String(seconds).padStart(2, '0')} giây...`;
  
      if (timeLeft <= 0) {
        clearInterval(redirectTimerInterval); // Dừng đếm ngược
        window.location.href = redirectUrl; // Chuyển hướng
      }
  
      timeLeft--; // Giảm thời gian
    }
  
    // Bắt đầu đếm ngược
    redirectTimerInterval = setInterval(updateTimer, 1000);
  
    // Xử lý khi nhấn nút Hủy
    cancelBtn.addEventListener('click', () => {
      clearInterval(redirectTimerInterval); // Dừng đếm ngược
      timerElement.textContent = "Chuyển hướng đã bị hủy.";
      cancelBtn.textContent = "Đã hủy";
      cancelBtn.disabled = true; // Vô hiệu hóa nút sau khi hủy
    });
  
    // Cập nhật lần đầu ngay lập tức
    updateTimer();
  }
  