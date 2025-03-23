document.addEventListener('DOMContentLoaded', function () {
  // Tải nội dung của header.html và chèn vào placeholder
  fetch('header.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('header-placeholder').innerHTML = data;
    })
    .catch(error => console.error('Lỗi khi tải header:', error));

  // Xử lý sự kiện cho nút hamburger
  const hamburger = document.querySelector('.hamburger');
  const navContent = document.querySelector('.nav-content');
  const navMenu = document.querySelector('.nav-menu');
  const overlay = document.querySelector('.overlay');
  const closeMenu = document.querySelector('.close-menu');

  if (hamburger && navContent) {
    hamburger.addEventListener('click', function () {
      navContent.classList.toggle('active');
      navMenu.classList.add("active");
      overlay.classList.add("active");
    });

    closeMenu.addEventListener("click", function() {
      navMenu.classList.remove("active");
      overlay.classList.remove("active");
    });
    
    overlay.addEventListener("click", function() {
      navMenu.classList.remove("active");
      overlay.classList.remove("active");
    });
  }
});
