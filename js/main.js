document.addEventListener('DOMContentLoaded', function() {
  const navbar = document.getElementById('navbar');
  const mobileMenuButton = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
  const iconMenu = document.getElementById('icon-menu');
  const iconClose = document.getElementById('icon-close');
  // const mobileCloseButton = document.getElementById('mobile-close-button'); // Nếu có nút đóng riêng trong menu
  const submenuToggles = document.querySelectorAll('.mobile-submenu-toggle');

  let lastScrollTop = 0;

  // Sticky Navbar Logic (optional - giữ lại nếu bạn cần)
  window.addEventListener('scroll', function() {
      let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      if (scrollTop > lastScrollTop && scrollTop > 100) {
          // Scroll Down
          navbar.style.top = `-${navbar.offsetHeight}px`; // Ẩn navbar khi cuộn xuống
      } else {
          // Scroll Up or near top
          navbar.style.top = '0';
      }
      lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // For Mobile or negative scrolling
  });

  // --- Mobile Menu Toggle ---
  function toggleMobileMenu() {
      const isExpanded = mobileMenuButton.getAttribute('aria-expanded') === 'true';

      mobileMenuButton.setAttribute('aria-expanded', !isExpanded);
      iconMenu.classList.toggle('hidden', !isExpanded); // Ẩn icon menu khi mở
      iconClose.classList.toggle('hidden', isExpanded); // Hiện icon đóng khi mở

      if (!isExpanded) {
          // Mở menu
          mobileMenuOverlay.classList.remove('hidden');
          mobileMenu.classList.remove('hidden');
          // Thêm độ trễ nhỏ để transition hoạt động
          requestAnimationFrame(() => {
              mobileMenuOverlay.classList.remove('opacity-0');
              mobileMenu.classList.remove('translate-x-full');
              document.body.style.overflow = 'hidden'; // Ngăn cuộn trang nền
          });
      } else {
          // Đóng menu
          mobileMenuOverlay.classList.add('opacity-0');
          mobileMenu.classList.add('translate-x-full');
          document.body.style.overflow = ''; // Cho phép cuộn lại

          // Đợi transition hoàn thành trước khi ẩn hẳn
          setTimeout(() => {
              mobileMenuOverlay.classList.add('hidden');
              mobileMenu.classList.add('hidden');
              // Đóng tất cả submenu khi đóng menu chính
              closeAllSubmenus();
          }, 300); // Phải khớp với duration của transition CSS
      }
  }

  // Event listener cho nút hamburger
  if (mobileMenuButton && mobileMenu && mobileMenuOverlay && iconMenu && iconClose) {
      mobileMenuButton.addEventListener('click', toggleMobileMenu);

      // Đóng menu khi click vào overlay
      mobileMenuOverlay.addEventListener('click', toggleMobileMenu);

      // Đóng menu khi nhấn phím Escape
      document.addEventListener('keydown', (event) => {
          if (event.key === 'Escape' && mobileMenuButton.getAttribute('aria-expanded') === 'true') {
              toggleMobileMenu();
          }
      });
  } else {
      console.error("Mobile menu elements not found!");
  }

  // --- Mobile Submenu Toggle ---
  function closeAllSubmenus(exceptThisToggle = null) {
      submenuToggles.forEach(otherToggle => {
          if (otherToggle !== exceptThisToggle) {
              const otherSubmenu = otherToggle.nextElementSibling;
              const otherIcon = otherToggle.querySelector('svg');
              if (otherSubmenu && otherSubmenu.classList.contains('mobile-submenu') && !otherSubmenu.classList.contains('hidden')) {
                  otherSubmenu.classList.add('hidden'); // Hoặc dùng slideUp/slideDown nếu có animation
                  otherIcon?.classList.remove('rotate-90');
              }
          }
      });
  }

  submenuToggles.forEach(toggle => {
      toggle.addEventListener('click', function(e) {
          e.preventDefault(); // Ngăn hành vi mặc định nếu là link
          const submenu = this.nextElementSibling; // Lấy phần tử kế tiếp (là div submenu)
          const icon = this.querySelector('svg');

          if (submenu && submenu.classList.contains('mobile-submenu')) {
              // Đóng các submenu khác cùng cấp trước khi mở submenu này
              // Tìm cha chung gần nhất để chỉ đóng các submenu cùng cấp
              const parentContainer = this.closest('div'); // Tìm div cha chứa button và submenu
              if (parentContainer) {
                  const siblingToggles = parentContainer.parentElement.querySelectorAll(':scope > div > .mobile-submenu-toggle');
                  siblingToggles.forEach(siblingToggle => {
                       if (siblingToggle !== this) {
                           const siblingSubmenu = siblingToggle.nextElementSibling;
                           const siblingIcon = siblingToggle.querySelector('svg');
                           if (siblingSubmenu && !siblingSubmenu.classList.contains('hidden')) {
                               siblingSubmenu.classList.add('hidden');
                               siblingIcon?.classList.remove('rotate-90');
                           }
                       }
                  });
              }


              // Toggle submenu hiện tại
              const isHidden = submenu.classList.toggle('hidden');
              icon?.classList.toggle('rotate-90', !isHidden); // Xoay icon nếu mở

              // Đóng các submenu con nếu đang đóng submenu cha
              if (isHidden) {
                  const nestedSubmenus = submenu.querySelectorAll('.mobile-submenu');
                  nestedSubmenus.forEach(nested => {
                      nested.classList.add('hidden');
                      const nestedIcon = nested.previousElementSibling.querySelector('svg');
                      nestedIcon?.classList.remove('rotate-90');
                  });
              }
          } else {
              console.warn("Submenu element not found for toggle:", this);
          }
      });
  });

  // --- Optional: Close dropdowns on outside click (Desktop) ---
  // Thêm logic này nếu bạn muốn dropdown desktop đóng khi click ra ngoài
  document.addEventListener('click', function(event) {
      const openDropdowns = document.querySelectorAll('.group:hover .absolute'); // Tìm các dropdown đang mở bằng hover
      let isClickInside = false;

      // Kiểm tra xem click có nằm trong bất kỳ dropdown nào đang mở hoặc nút cha của nó không
      openDropdowns.forEach(dropdown => {
          const parentGroup = dropdown.closest('.group');
          if (parentGroup?.contains(event.target)) {
              isClickInside = true;
          }
      });

      // Nếu click ra ngoài và không phải là nút toggle menu mobile
      if (!isClickInside && !mobileMenuButton.contains(event.target) && !mobileMenu.contains(event.target)) {
          // Logic đóng dropdown desktop (có thể không cần nếu chỉ dùng hover)
          // Nếu bạn dùng JS để toggle dropdown desktop thì thêm logic đóng ở đây.
          // Ví dụ: document.querySelectorAll('.desktop-dropdown.open').forEach(d => d.classList.remove('open'));
      }
  });

});
