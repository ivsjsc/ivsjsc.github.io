const loadContent = async (elementId, url, errorMessage) => {
  const element = document.getElementById(elementId);
  if (!element) return;
  element.innerHTML = `<p style="text-align: center; padding: 20px;">Đang tải ${elementId}...</p>`;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Không thể tải ${url}`);
    const data = await response.text();
    element.innerHTML = data;
    if (elementId === "header") initHeaderEvents();
  } catch (error) {
    console.error(`Lỗi khi tải ${elementId}:`, error);
    element.innerHTML = `<p style="text-align: center; color: red;">${errorMessage}</p>`;
  }
};

const initHeaderEvents = () => {
  const hamburger = document.querySelector(".hamburger");
  const navMenu = document.querySelector(".nav-menu");
  const closeMenu = document.querySelector(".close-menu");
  let overlay = document.querySelector(".overlay");

  // Tạo overlay nếu chưa tồn tại
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.className = "overlay";
    document.body.appendChild(overlay);
  }

  if (!hamburger || !navMenu || !closeMenu) {
    console.warn("Không tìm thấy một số phần tử trong header!");
    return;
  }

  // Mở/đóng menu mobile
  hamburger.addEventListener("click", () => {
    navMenu.classList.toggle("active");
    overlay.classList.toggle("active");
  });

  closeMenu.addEventListener("click", () => {
    navMenu.classList.remove("active");
    overlay.classList.remove("active");
  });

  overlay.addEventListener("click", () => {
    navMenu.classList.remove("active");
    overlay.classList.remove("active");
  });

  // Đóng menu khi resize qua breakpoint
  window.addEventListener("resize", () => {
    if (window.innerWidth > 600 && navMenu.classList.contains("active")) {
      navMenu.classList.remove("active");
      overlay.classList.remove("active");
    }
  });

  // Toggle dropdown trong nav-menu
  const dropdowns = document.querySelectorAll(".nav-menu .dropdown");
  dropdowns.forEach(dropdown => {
    const toggle = dropdown.querySelector("a");
    if (toggle) {
      toggle.addEventListener("click", (e) => {
        e.preventDefault();
        dropdown.classList.toggle("active");
      });
    }
  });
};

const startRedirectTimer = () => {
  let timeLeft = 120;
  const timerElement = document.getElementById("redirect-timer");
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

  updateTimerDisplay();
};

const loadPosts = async () => {
  const postList = document.getElementById("post-list");
  if (!postList) {
    console.warn("Không tìm thấy post-list!");
    return;
  }

  try {
    const response = await fetch("../posts.json");
    if (!response.ok) throw new Error("Không thể tải file posts.json");
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

    initCarousel(postList);
  } catch (error) {
    console.error("Lỗi khi tải posts:", error);
    postList.innerHTML = "<p>Không thể tải danh sách bài viết.</p>";
  }
};

const initCarousel = (postList) => {
  const slides = postList.querySelectorAll(".post-preview");
  const totalSlides = slides.length;
  if (totalSlides === 0) return;

  let currentSlide = 0;
  let intervalId = null;

  const showSlide = (index) => {
    currentSlide = index >= totalSlides ? 0 : index < 0 ? totalSlides - 1 : index;
    if (window.innerWidth > 600) {
      slides.forEach((slide, i) => {
        slide.style.transform = `translateX(${(i - currentSlide) * 100}%)`;
      });
    } else {
      slides.forEach(slide => slide.style.transform = "none");
    }
  };

  const startAutoSlide = () => {
    if (intervalId) clearInterval(intervalId);
    if (window.innerWidth > 600) {
      intervalId = setInterval(() => showSlide(++currentSlide), 5000);
    }
  };

  const stopAutoSlide = () => clearInterval(intervalId);

  const prevBtn = document.getElementById("prev-post");
  const nextBtn = document.getElementById("next-post");

  if (prevBtn) prevBtn.addEventListener("click", () => {
    stopAutoSlide();
    showSlide(--currentSlide);
    startAutoSlide();
  });

  if (nextBtn) nextBtn.addEventListener("click", () => {
    stopAutoSlide();
    showSlide(++currentSlide);
    startAutoSlide();
  });

  postList.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
  });

  postList.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX;
    if (touchStartX - touchEndX > 50) showSlide(++currentSlide);
    if (touchEndX - touchStartX > 50) showSlide(--currentSlide);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 600) {
      showSlide(currentSlide);
      startAutoSlide();
    } else {
      stopAutoSlide();
    }
  });

  if (window.innerWidth > 600) {
    showSlide(currentSlide);
    startAutoSlide();
  }

  slides.forEach(slide => {
    slide.addEventListener("mouseenter", stopAutoSlide);
    slide.addEventListener("mouseleave", startAutoSlide);
  });
};

// Khởi động khi trang tải
document.addEventListener("DOMContentLoaded", () => {
  // Gọi các hàm khởi tạo nếu cần
  loadContent("header", "../header.html", "Không thể tải header.");
  loadContent("footer", "../footer.html", "Không thể tải footer.");
  loadPosts();
  startRedirectTimer();
});