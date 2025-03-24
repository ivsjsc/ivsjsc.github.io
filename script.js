// Hàm tải nội dung từ file HTML
const loadContent = (elementId, url, errorMessage) => {
  const element = document.getElementById(elementId);
  element.innerHTML = `<p style="text-align: center; padding: 20px;">Đang tải ${elementId}...</p>`;
  fetch(url)
    .then(response => response.text())
    .then(data => {
      element.innerHTML = data;
      if (elementId === 'header') initHeaderEvents(); // Khởi tạo sự kiện cho header sau khi tải
    })
    .catch(() => {
      element.innerHTML = `<p style="text-align: center; color: red;">${errorMessage}</p>`;
    });
};

// Khởi tạo sự kiện cho hamburger menu trong header
const initHeaderEvents = () => {
  const hamburger = document.querySelector(".hamburger");
  const navMenu = document.querySelector(".nav-menu");
  const closeMenu = document.querySelector(".close-menu");
  const overlay = document.querySelector(".overlay");

  if (hamburger && navMenu && closeMenu && overlay) {
    hamburger.addEventListener("click", () => {
      if (window.innerWidth <= 600) {
        navMenu.classList.add("active");
        overlay.classList.add("active");
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
      if (window.innerWidth > 600) {
        navMenu.classList.remove("active");
        overlay.classList.remove("active");
      }
    });
  }
};

// Đồng hồ đếm ngược chuyển hướng
const startRedirectTimer = () => {
  let timeLeft = 120; // 120 giây
  const timerElement = document.getElementById('redirect-timer');
  const cancelButton = document.getElementById("cancel-redirect");

  const timer = setInterval(() => {
    timeLeft--;
    timerElement.textContent = `Website sẽ tự động chuyển đến Fanpage IVS Academy trong ${Math.floor(timeLeft / 60)} phút ${timeLeft % 60} giây...`;
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
};

// Tạo và quản lý carousel/grid từ posts.json
const loadPosts = () => {
  const postList = document.getElementById("post-list");
  fetch('posts.json')
    .then(response => {
      if (!response.ok) throw new Error('Không thể tải file posts.json');
      return response.json();
    })
    .then(posts => {
      posts.forEach(post => {
        const postDiv = document.createElement("div");
        postDiv.className = "post-preview";
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

      if (window.innerWidth > 600) initCarousel();
    })
    .catch(error => {
      console.error('Lỗi:', error);
      postList.innerHTML = "<p>Không thể tải danh sách bài viết.</p>";
    });
};

// Khởi tạo carousel cho PC
const initCarousel = () => {
  const slides = document.querySelectorAll('.post-preview');
  const totalSlides = slides.length;
  let currentSlide = 0;

  const showSlide = (index) => {
    currentSlide = (index >= totalSlides) ? 0 : (index < 0) ? totalSlides - 1 : index;
    slides.forEach((slide, i) => {
      slide.style.transform = `translateX(${(i - currentSlide) * 100}%)`;
    });
  };

  setInterval(() => showSlide(++currentSlide), 5000); // Tự động chuyển slide

  document.getElementById('prev-slide')?.addEventListener('click', () => showSlide(--currentSlide));
  document.getElementById('next-slide')?.addEventListener('click', () => showSlide(++currentSlide));

  showSlide(currentSlide); // Hiển thị slide đầu tiên
};

// Khởi chạy các chức năng khi trang tải xong
document.addEventListener("DOMContentLoaded", () => {
  loadContent('header', 'header.html', 'Lỗi khi tải header!');
  loadContent('footer', 'footer.html', 'Lỗi khi tải footer!');
  startRedirectTimer();
  loadPosts();
});