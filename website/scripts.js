// Tải header
document.getElementById('header').innerHTML = '<p style="text-align: center; padding: 20px;">Đang tải header...</p>';
fetch('header.html')
  .then(response => response.text())
  .then(data => {
    document.getElementById('header').innerHTML = data;

    // Gắn sự kiện cho hamburger menu
    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector(".nav-menu");

    if (hamburger && navMenu) {
      hamburger.addEventListener("click", function() {
        navMenu.classList.add("active");
      });

      // Đóng menu khi nhấp ra ngoài
      document.addEventListener("click", function(event) {
        if (!navMenu.contains(event.target) && !hamburger.contains(event.target)) {
          navMenu.classList.remove("active");
        }
      });
    }

    // Xử lý dropdown trên mobile (click để mở/đóng)
    const dropdowns = document.querySelectorAll(".nav-menu ul li");
    dropdowns.forEach(dropdown => {
      const dropdownMenu = dropdown.querySelector("ul");
      if (dropdownMenu) {
        dropdown.addEventListener("click", function(e) {
          e.stopPropagation(); // Ngăn sự kiện click lan ra ngoài
          const isActive = dropdownMenu.style.display === "block";
          dropdownMenu.style.display = isActive ? "none" : "block";
        });
      }
    });
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
