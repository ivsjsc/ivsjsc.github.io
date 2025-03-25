const loadPosts = async () => {
  const postList = document.getElementById("post-list");
  if (!postList) {
    console.warn("Không tìm thấy post-list!");
    return;
  }

  try {
    const response = await fetch("../posts.json"); // Đường dẫn đúng từ js/
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

    initCarousel(); // Khởi tạo carousel ngay sau khi tải bài viết
  } catch (error) {
    console.error("Lỗi khi tải posts:", error);
    postList.innerHTML = "<p>Không thể tải danh sách bài viết.</p>";
  }
};

const initCarousel = () => {
  const slides = document.querySelectorAll(".post-preview");
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
    }
  };

  const startAutoSlide = () => {
    if (intervalId) clearInterval(intervalId);
    if (window.innerWidth > 600) {
      intervalId = setInterval(() => showSlide(++currentSlide), 5000);
    }
  };

  const stopAutoSlide = () => clearInterval(intervalId);

  // Nút điều hướng
  const prevBtn = document.getElementById("prev-post");
  const nextBtn = document.getElementById("next-post");

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      stopAutoSlide();
      showSlide(--currentSlide);
      startAutoSlide();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      stopAutoSlide();
      showSlide(++currentSlide);
      startAutoSlide();
    });
  }

  // Swipe cho mobile
  let touchStartX = 0;
  let touchEndX = 0;

  postList.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
  });

  postList.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX;
    if (touchStartX - touchEndX > 50) showSlide(++currentSlide); // Swipe trái
    if (touchEndX - touchStartX > 50) showSlide(--currentSlide); // Swipe phải
  });

  // Responsive
  window.addEventListener("resize", () => {
    if (window.innerWidth > 600) {
      showSlide(currentSlide);
      startAutoSlide();
    } else {
      slides.forEach(slide => (slide.style.transform = "none")); // Tắt transform trên mobile
      stopAutoSlide();
    }
  });

  // Khởi động
  if (window.innerWidth > 600) {
    showSlide(currentSlide);
    startAutoSlide();
  }

  slides.forEach(slide => {
    slide.addEventListener("mouseenter", stopAutoSlide);
    slide.addEventListener("mouseleave", startAutoSlide);
  });
};

document.addEventListener("DOMContentLoaded", loadPosts);