// Tải header
document.getElementById('header').innerHTML = '<p style="text-align: center; padding: 20px;">Đang tải header...</p>';
fetch('header.html')
  .then(response => response.text())
  .then(data => {
    document.getElementById('header').innerHTML = data;
    // Gắn sự kiện cho hamburger menu và close button
    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector(".nav-menu");
    const closeMenu = document.querySelector(".close-menu");
    const overlay = document.querySelector(".overlay");

    if (hamburger && navMenu && closeMenu && overlay) {
      // Chỉ cho phép mở menu trên mobile (dưới 600px)
      hamburger.addEventListener("click", function() {
        if (window.innerWidth <= 600) {
          navMenu.classList.add("active");
          overlay.classList.add("active");
        }
      });

      // Đóng menu khi nhấp vào nút đóng
      closeMenu.addEventListener("click", function() {
        navMenu.classList.remove("active");
        overlay.classList.remove("active");
      });

      // Đóng menu khi nhấp vào overlay
      overlay.addEventListener("click", function() {
        navMenu.classList.remove("active");
        overlay.classList.remove("active");
      });

      // Đóng menu khi thay đổi kích thước màn hình (nếu đang mở trên PC)
      window.addEventListener("resize", function() {
        if (window.innerWidth > 600) {
          navMenu.classList.remove("active");
          overlay.classList.remove("active");
        }
      });
    }
  })
  .catch(() => document.getElementById('header').innerHTML = '<p style="text-align: center; color: red;">Lỗi khi tải header!</p>');
