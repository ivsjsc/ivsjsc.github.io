// script.js

document.addEventListener('DOMContentLoaded', function() {
  // Hàm xử lý dropdown menu (dùng JavaScript thuần, bỏ jQuery để giảm phụ thuộc)
  function initDropdowns() {
    const dropdowns = document.querySelectorAll('.dropdown');

    dropdowns.forEach(dropdown => {
      const toggle = dropdown.querySelector('.dropdown-toggle');
      const menu = dropdown.querySelector('.dropdown-menu');

      toggle.addEventListener('click', function(e) {
        e.preventDefault();
        // Đóng các dropdown khác
        document.querySelectorAll('.dropdown-menu').forEach(otherMenu => {
          if (otherMenu !== menu) {
            otherMenu.style.display = 'none';
          }
        });
        // Toggle dropdown hiện tại
        menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
      });
    });

    // Đóng dropdown khi click ra ngoài
    document.addEventListener('click', function(e) {
      if (!e.target.closest('.dropdown')) {
        document.querySelectorAll('.dropdown-menu').forEach(menu => {
          menu.style.display = 'none';
        });
      }
    });
  }

  // Hàm xử lý hamburger menu
  function initHamburgerMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const closeMenu = document.querySelector('.close-menu');
    const overlay = document.querySelector('.overlay'); // Giả sử có overlay

    if (hamburger && navMenu && closeMenu) {
      // Mở menu trên mobile (dưới 769px)
      hamburger.addEventListener('click', function() {
        if (window.innerWidth <= 768) {
          navMenu.classList.add('active');
          if (overlay) overlay.classList.add('active');
        }
      });

      // Đóng menu khi bấm nút close
      closeMenu.addEventListener('click', function() {
        navMenu.classList.remove('active');
        if (overlay) overlay.classList.remove('active');
      });

      // Đóng menu khi bấm overlay (nếu có)
      if (overlay) {
        overlay.addEventListener('click', function() {
          navMenu.classList.remove('active');
          overlay.classList.remove('active');
        });
      }

      // Đóng menu khi thay đổi kích thước màn hình
      window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
          navMenu.classList.remove('active');
          if (overlay) overlay.classList.remove('active');
        }
      });
    }
  }

  // Hàm tải header/footer
  function loadSection(elementId, filePath) {
    const element = document.getElementById(elementId);
    if (!element) return;

    element.innerHTML = `<p style="text-align: center; padding: 20px;">Đang tải ${elementId}...</p>`;
    fetch(filePath)
      .then(response => response.text())
      .then(data => {
        element.innerHTML = data;
        // Sau khi tải header, khởi tạo dropdown và hamburger menu
        if (elementId === 'header') {
          initDropdowns();
          initHamburgerMenu();
        }
      })
      .catch(() => {
        element.innerHTML = `<p style="text-align: center; color: red;">Lỗi khi tải ${elementId}!</p>`;
      });
  }

  // Hàm xử lý đồng hồ đếm ngược
  function initRedirectTimer() {
    const redirectTimer = document.getElementById('redirect-timer');
    const cancelButton = document.getElementById('cancel-redirect');
    if (!redirectTimer || !cancelButton) return;

    let timeLeft = 120; // 120 giây
    let timer = setInterval(() => {
      timeLeft--;
      redirectTimer.textContent = `Website sẽ tự động chuyển đến Fanpage IVS Academy trong ${Math.floor(timeLeft / 60)} phút ${timeLeft % 60} giây...`;
      if (timeLeft <= 0) {
        clearInterval(timer);
        window.location.href = 'https://facebook.com/hr.ivsacademy';
      }
    }, 1000);

    // Hủy chuyển hướng
    cancelButton.addEventListener('click', function() {
      clearInterval(timer);
      this.textContent = 'Đã hủy chuyển hướng';
      this.disabled = true;
      redirectTimer.textContent = 'Chuyển hướng đã bị hủy.';
    });
  }

  // Hàm xử lý carousel/grid bài viết
  function initPostCarousel() {
    const postList = document.getElementById('post-list');
    if (!postList) return;

    fetch('posts.json')
      .then(response => {
        if (!response.ok) throw new Error('Không thể tải file posts.json');
        return response.json();
      })
      .then(posts => {
        // Tạo grid bài viết
        posts.forEach(post => {
          const postDiv = document.createElement('div');
          postDiv.className = 'post-preview';
          postDiv.innerHTML = `
            <div class="post-image">
              <img src="${post.image}" alt="${post.title}" loading="lazy">
              <span class="hot-label">HOT</span>
            </div>
            <div class="content">
              <h3><a href="${post.url}">${post.title}</a></h3>
              <p>${post.excerpt}</p>
              <a href="${post.url}" class="view-more">Xem thêm</a>
            </div>
          `;
          postList.appendChild(postDiv);
        });

        // Khởi tạo carousel (chỉ trên PC, trên 769px)
        if (window.innerWidth > 768) {
          const slides = document.querySelectorAll('.post-preview');
          const totalSlides = slides.length;
          let currentSlide = 0;
          let isPaused = false;
          let interval;

          function showSlide(index) {
            if (index >= totalSlides) currentSlide = 0;
            if (index < 0) currentSlide = totalSlides - 1;
            slides.forEach((slide, i) => {
              slide.style.transform = `translateX(${(i - currentSlide) * 100}%)`;
            });
          }

          // Tự động chuyển slide
          function startCarousel() {
            interval = setInterval(() => {
              if (!isPaused) {
                currentSlide++;
                showSlide(currentSlide);
              }
            }, 5000);
          }

          // Dừng carousel khi tương tác
          postList.addEventListener('mouseenter', () => {
            isPaused = true;
          });

          postList.addEventListener('mouseleave', () => {
            isPaused = false;
          });

          // Nút điều hướng
          const prevButton = document.getElementById('prev-slide');
          const nextButton = document.getElementById('next-slide');

          if (prevButton && nextButton) {
            prevButton.addEventListener('click', () => {
              currentSlide--;
              showSlide(currentSlide);
            });

            nextButton.addEventListener('click', () => {
              currentSlide++;
              showSlide(currentSlide);
            });
          }

          // Hiển thị slide đầu tiên và bắt đầu carousel
          showSlide(currentSlide);
          startCarousel();
        }
      })
      .catch(error => {
        console.error('Lỗi:', error);
        postList.innerHTML = '<p>Không thể tải danh sách bài viết.</p>';
      });
  }

  // Khởi chạy các chức năng
  loadSection('header', 'header.html');
  loadSection('footer', 'footer.html');
  initRedirectTimer();
  initPostCarousel();
});