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

    if (hamburger && navMenu && closeMenu) {
      hamburger.addEventListener("click", function() {
        navMenu.classList.add("active");
      });
      closeMenu.addEventListener("click", function() {
        navMenu.classList.remove("active");
      });
      document.addEventListener("click", function(event) {
        if (!navMenu.contains(event.target) && !hamburger.contains(event.target)) {
          navMenu.classList.remove("active");
        }
      });
    }
  })
  .catch(() => document.getElementById('header').innerHTML = '<p style="text-align: center; color: red;">Lỗi khi tải header!</p>');

// Tải footer
document.getElementById('footer').innerHTML = '<p style="text-align: center; padding: 20px;">Đang tải footer...</p>';
fetch('footer.html')
  .then(response => response.text())
  .then(data => {
    document.getElementById('footer').innerHTML = data;
  })
  .catch(() => document.getElementById('footer').innerHTML = '<p style="text-align: center; color: red;">Lỗi khi tải footer!</p>');
