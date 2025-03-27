document.addEventListener('DOMContentLoaded', function() {
  // Hamburger Menu
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  const closeMenu = document.querySelector('.close-menu');
  const overlay = document.querySelector('.overlay');

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.dropdown-toggle').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const parent = item.parentElement;
            const dropdownMenu = parent.querySelector('.dropdown-menu');
            document.querySelectorAll('.dropdown-menu').forEach(menu => {
                if (menu !== dropdownMenu) {
                    menu.classList.remove('show');
                }
            });
            dropdownMenu.classList.toggle('show');
        });
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.dropdown')) {
            document.querySelectorAll('.dropdown-menu').forEach(menu => {
                menu.classList.remove('show');
            });
        }
    });
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