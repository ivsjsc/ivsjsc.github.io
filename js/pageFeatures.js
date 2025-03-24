// pageFeatures.js
document.addEventListener("DOMContentLoaded", function () {
  // Đồng hồ đếm ngược chuyển hướng
  let timeLeft = 120; // 120 giây
  const timerElement = document.getElementById('redirect-timer');
  const cancelButton = document.getElementById("cancel-redirect");

  if (timerElement && cancelButton) {
    const timer = setInterval(() => {
      timeLeft--;
      timerElement.textContent = `Website sẽ tự động chuyển đến Fanpage IVS Academy trong ${Math.floor(timeLeft / 60)} phút ${timeLeft % 60} giây...`;
      if (timeLeft <= 0) {
        clearInterval(timer);
        window.location.href = "https://facebook.com/hr.ivsacademy";
      }
    }, 1000);

    // Sự kiện hủy chuyển hướng
    cancelButton.addEventListener("click", function() {
      clearInterval(timer);
      this.textContent = "Đã hủy chuyển hướng";
      this.disabled = true;
      timerElement.textContent = "Chuyển hướng đã bị hủy.";
    });
  }

  // Lấy dữ liệu từ posts.json và tạo carousel/grid
  const postList = document.getElementById("post-list");
  if (postList) {
    fetch('posts.json')
      .then(response => {
        if (!response.ok) {
          throw new Error('Không thể tải file posts.json');
        }
        return response.json();
      })
      .then(posts => {
        posts.forEach(post => {
          const postDiv = document.createElement("div");
          postDiv.className = "post-preview";
          postDiv.innerHTML = `
            <div class="post-image">
              <img src="${post.image}" alt="${post.title}">
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

        // Khởi tạo carousel (chỉ trên PC)
        if (window.innerWidth > 600) {
          let currentSlide = 0;
          const slides = document.querySelectorAll('.post-preview');
          const totalSlides = slides.length;

          function showSlide(index) {
            if (index >= totalSlides) currentSlide = 0;
            if (index < 0) currentSlide = totalSlides - 1;
            slides.forEach((slide, i) => {
              slide.style.transform = `translateX(${(i - currentSlide) * 100}%)`;
            });
          }

          // Tự động chuyển slide
          setInterval(() => {
            currentSlide++;
            showSlide(currentSlide);
          }, 5000); // Chuyển slide mỗi 5 giây

          // Nút điều hướng
          const prevSlideBtn = document.getElementById('prev-slide');
          const nextSlideBtn = document.getElementById('next-slide');
          if (prevSlideBtn && nextSlideBtn) {
            prevSlideBtn.addEventListener('click', () => {
              currentSlide--;
              showSlide(currentSlide);
            });

            nextSlideBtn.addEventListener('click', () => {
              currentSlide++;
              showSlide(currentSlide);
            });
          }

          // Hiển thị slide đầu tiên
          showSlide(currentSlide);
        }
      })
      .catch(error => {
        console.error('Lỗi:', error);
        postList.innerHTML = "<p>Không thể tải danh sách bài viết.</p>";
      });
  }
});
