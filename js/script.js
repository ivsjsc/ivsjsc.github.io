document.addEventListener('DOMContentLoaded', function() {
  // Hamburger Menu
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  const closeMenu = document.querySelector('.close-menu');
  const overlay = document.querySelector('.overlay');

  hamburger.addEventListener('click', () => {
      navMenu.classList.add('active');
      overlay.classList.add('active');
  });

  closeMenu.addEventListener('click', () => {
      navMenu.classList.remove('active');
      overlay.classList.remove('active');
  });

  overlay.addEventListener('click', () => {
      navMenu.classList.remove('active');
      overlay.classList.remove('active');
  });

  // Dropdown Menu
  const dropdowns = document.querySelectorAll('.dropdown-toggle');
  dropdowns.forEach(dropdown => {
      dropdown.addEventListener('click', (e) => {
          e.preventDefault();
          const parent = dropdown.parentElement;
          const isMobile = window.innerWidth <= 768;
          if (isMobile) {
              parent.classList.toggle('active');
          }
      });
  });

  // Đóng menu khi resize
  window.addEventListener('resize', () => {
      if (window.innerWidth > 768) {
          navMenu.classList.remove('active');
          overlay.classList.remove('active');
      }
  });
});