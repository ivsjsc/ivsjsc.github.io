// Hàm tải nội dung từ file HTML
const loadContent = async (elementId, url, errorMessage) => {
  const element = document.getElementById(elementId);
  if (!element) return; // Kiểm tra element có tồn tại không
  element.innerHTML = `<p style="text-align: center; padding: 20px;">Đang tải ${elementId}...</p>`;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Không thể tải ${url}`);
    const data = await response.text();
    element.innerHTML = data;
    if (elementId === 'header') initHeaderEvents(); // Khởi tạo sự kiện cho header
  } catch (error) {
    console.error(`Lỗi khi tải ${elementId}:`, error);
    element.innerHTML = `<p style="text-align: center; color: red;">${errorMessage}</p>`;
  }
};

// Khởi tạo sự kiện cho hamburger menu trong header
const initHeaderEvents = () => {
  const hamburger = document.querySelector(".hamburger");
  const navMenu = document.querySelector(".nav-menu");
  const closeMenu = document.querySelector(".close-menu");
  const overlay = document.createElement("div");
  overlay.className = "overlay";
  document.body.appendChild(overlay);

  if (!hamburger || !navMenu || !closeMenu) {
    console.warn("Không tìm thấy một số phần tử trong header!");
    return;
  }

  hamburger.addEventListener("click", () => {
    if (window.innerWidth <= 600) {
      navMenu.classList.toggle("active"); // Sử dụng toggle để linh hoạt hơn
      overlay.classList.toggle("active");
    }
  });

  closeMenu.addEventListener("click", () => {
    navMenu.classList.remove("active");
    overlay.classList.remove("active");
  });

  overlay.addEventListener("click", () => {
    navMenu.classList.remove("active");
    overlay.classList.remove("active");
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 600 && navMenu.classList.contains("active")) {
      navMenu.classList.remove("active");
      overlay.classList.remove("active");
    }
  });

  // Toggle dropdown trong sidebar
  const dropdowns = document.querySelectorAll(".nav-menu .dropdown > a");
  dropdowns.forEach(dropdown => {
    dropdown.addEventListener("click", function(e) {
      e.preventDefault();
      const parent = this.parentElement;
      parent.classList.toggle("active");
    });
  });
};

// Đồng hồ đếm ngược chuyển hướng
const startRedirectTimer = () => {
  let timeLeft = 120; // 120 giây
  const timerElement = document.getElementById('redirect-timer');
  const cancelButton = document.getElementById("cancel-redirect");

  if (!timerElement || !cancelButton) {
    console.warn("Không tìm thấy redirect-timer hoặc cancel-redirect!");
    return;
  }

  const updateTimerDisplay = () => {
    timerElement.textContent = `Website sẽ tự động chuyển đến Fanpage IVS Academy trong ${Math.floor(timeLeft / 60)} phút ${timeLeft % 60} giây...`;
  };

  const timer = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();
    if (timeLeft <= 0) {
      clearInterval(timer);
      window.location.href = "https://facebook.com/hr.ivsacademy";
    }
  }, 1000);

  cancelButton.addEventListener("click", () => {
    clearInterval(timer);
    cancelButton.textContent = "Đã hủy chuyển hướng";
    cancelButton.disabled = true;
    timerElement.textContent = "Chuyển hướng đã bị hủy.";
  });

  updateTimerDisplay(); // Hiển thị ngay lần đầu
};

// Tạo và quản lý carousel/grid từ posts.json
const loadPosts = async () => {
  const postList = document.getElementById("post-list");
  if (!postList) {
    console.warn("Không tìm thấy post-list!");
    return;
  }

  try {
    const response = await fetch('posts.json');
    if (!response.ok) throw new Error('Không thể tải file posts.json');
    const posts = await response.json();

    posts.forEach(post => {
      const postDiv = document.createElement("div");
      postDiv.className = "post-preview";
      postDiv.innerHTML = `
        <div class="post-image">
          <img src="${post.image}" alt="${post.title}" loading="lazy">
          <span class="hot-label">HOT</span>
        </div>
        <div class="content">
          <h3><a href="${post.url}" target="_blank">${post.title}</a></h3>
          <p>${post.excerpt}</p>
          <a href="${post.url}" class="view-more" target="_blank">Xem thêm</a>
        </div>
      `;
      postList.appendChild(postDiv);
    });

    if (window.innerWidth > 600) initCarousel();
    window.addEventListener("resize", () => {
      if (window.innerWidth > 600) initCarousel();
    });
  } catch (error) {
    console.error('Lỗi khi tải posts:', error);
    postList.innerHTML = "<p>Không thể tải danh sách bài viết.</p>";
  }
};

// Khởi tạo carousel cho PC
const initCarousel = () => {
  const slides = document.querySelectorAll('.post-preview');
  const totalSlides = slides.length;
  if (totalSlides === 0) return; // Không có slide thì thoát

  let currentSlide = 0;
  let intervalId = null;

  const showSlide = (index) => {
    currentSlide = (index >= totalSlides) ? 0 : (index < 0) ? totalSlides - 1 : index;
    slides.forEach((slide, i) => {
      slide.style.transform = `translateX(${(i - currentSlide) * 100}%)`;
    });
  };

  const startAutoSlide = () => {
    if (intervalId) clearInterval(intervalId); // Xóa interval cũ nếu có
    intervalId = setInterval(() => showSlide(++currentSlide), 5000);
  };

  const stopAutoSlide = () => clearInterval(intervalId);

  document.getElementById('prev-slide')?.addEventListener('click', () => {
    stopAutoSlide();
    showSlide(--currentSlide);
    startAutoSlide();
  });

  document.getElementById('next-slide')?.addEventListener('click', () => {
    stopAutoSlide();
    showSlide(++currentSlide);
    startAutoSlide();
  });

  slides.forEach(slide => {
    slide.addEventListener('mouseenter', stopAutoSlide);
    slide.addEventListener('mouseleave', startAutoSlide);
  });

  showSlide(currentSlide);
  startAutoSlide();
};

// Khởi chạy các chức năng khi trang tải xong
document.addEventListener("DOMContentLoaded", () => {
  loadContent('header', 'header.html', 'Lỗi khi tải header!');
  loadContent('footer', 'footer.html', 'Lỗi khi tải footer!');
  startRedirectTimer();
  loadPosts();
});