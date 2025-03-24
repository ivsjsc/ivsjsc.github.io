// loadComponents.js
document.addEventListener("DOMContentLoaded", function () {
  // Tải header
  const headerElement = document.getElementById("header");
  if (headerElement) {
    headerElement.innerHTML = '<p style="text-align: center; padding: 20px;">Đang tải header...</p>';
    fetch('header.html')
      .then(response => response.text())
      .then(data => {
        headerElement.innerHTML = data;

        // Gắn sự kiện cho hamburger menu
        const hamburger = document.querySelector(".hamburger");
        const navMenu = document.querySelector(".nav-menu");
        const closeMenu = document.querySelector(".close-menu");

        if (hamburger && navMenu && closeMenu) {
          hamburger.addEventListener("click", function () {
            navMenu.classList.toggle("active");
          });

          closeMenu.addEventListener("click", function () {
            navMenu.classList.remove("active");
          });

          // Đóng menu khi nhấp ra ngoài
          document.addEventListener("click", function (event) {
            if (!navMenu.contains(event.target) && !hamburger.contains(event.target)) {
              navMenu.classList.remove("active");
            }
          });
        }

        // Xử lý dropdown trên mobile (click để mở/đóng)
        const dropdowns = document.querySelectorAll(".nav-menu .dropdown");
        dropdowns.forEach(dropdown => {
          dropdown.addEventListener("click", function (e) {
            e.stopPropagation(); // Ngăn sự kiện click lan ra ngoài
            const isActive = dropdown.classList.contains("active");
            dropdowns.forEach(d => d.classList.remove("active")); // Đóng các dropdown khác
            if (!isActive) {
              dropdown.classList.add("active");
            }
          });
        });
      })
      .catch(() => {
        headerElement.innerHTML = '<p style="text-align: center; color: red;">Lỗi khi tải header!</p>';
      });
  }

  // Tải footer
  const footerElement = document.getElementById("footer");
  if (footerElement) {
    footerElement.innerHTML = '<p style="text-align: center; padding: 20px;">Đang tải footer...</p>';
    fetch('footer.html')
      .then(response => response.text())
      .then(data => {
        footerElement.innerHTML = data;
      })
      .catch(() => {
        footerElement.innerHTML = '<p style="text-align: center; color: red;">Lỗi khi tải footer!</p>';
      });
  }
});
