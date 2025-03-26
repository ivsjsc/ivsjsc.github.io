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

const closeMenu = (navMenu, overlay) => {
  navMenu.classList.remove("active");
  overlay.classList.remove("active");
};

const initHeaderEvents = () => {
  const hamburger = document.querySelector(".hamburger");
  const navMenu = document.querySelector(".nav-menu");
  const closeMenuBtn = document.querySelector(".close-menu");
  let overlay = document.querySelector(".overlay");

  if (!overlay) {
    overlay = document.createElement("div");
    overlay.className = "overlay";
    document.body.appendChild(overlay);
  }

  if (!hamburger || !navMenu || !closeMenuBtn) {
    console.warn("Không tìm thấy một số phần tử trong header!");
    return;
  }

  hamburger.addEventListener("click", () => {
    if (window.innerWidth <= 600) {
      navMenu.classList.toggle("active");
      overlay.classList.toggle("active");
    } else {
      navMenu.classList.add("active");
    }
  });

  closeMenuBtn.addEventListener("click", () => closeMenu(navMenu, overlay));
  overlay.addEventListener("click", () => closeMenu(navMenu, overlay));

  const dropdowns = document.querySelectorAll(".nav-menu .dropdown > a");
  dropdowns.forEach(dropdown => {
    dropdown.addEventListener("click", (e) => {
      e.preventDefault();
      dropdown.parentElement.classList.toggle("active");
    });
  });

  document.querySelectorAll(".dropdown-toggle").forEach(item => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      const submenu = item.nextElementSibling;
      document.querySelectorAll(".dropdown-menu").forEach(sub => {
        if (sub !== submenu) sub.classList.remove("active");
      });
      submenu.classList.toggle("active");
    });
  });

  document.querySelectorAll(".dropdown-menu a").forEach(link => {
    let touchStartTime;
    link.addEventListener("touchstart", (e) => {
      touchStartTime = new Date().getTime();
    });
    link.addEventListener("touchend", (e) => {
      const touchDuration = new Date().getTime() - touchStartTime;
      if (touchDuration < 200) e.preventDefault();
    });
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
  let touchStartX = 0;
  let touchEndX = 0;

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

  slides.forEach(slide => {
    slide.addEventListener("mouseenter", stopAutoSlide);
    slide.addEventListener("mouseleave", startAutoSlide);
  });

  if (window.innerWidth > 600) {
    showSlide(currentSlide);
    startAutoSlide();
  }
};

document.addEventListener("DOMContentLoaded", () => {
  loadContent("header", "../header.html", "Không thể tải header.");
  loadContent("footer", "../footer.html", "Không thể tải footer.");
  loadPosts();
  startRedirectTimer();

  const navMenu = document.querySelector(".nav-menu");
  const overlay = document.querySelector(".overlay") || document.querySelector(".overlay");
  if (navMenu && overlay) {
    window.addEventListener("resize", () => {
      if (window.innerWidth > 600 && navMenu.classList.contains("active")) {
        closeMenu(navMenu, overlay);
      }
    });
  }
});