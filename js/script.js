/* Reset and Base Styles */s and FAB button initialization
* {This file should NOT contain logic for loading header/footer components or language initialization
    margin: 0;handled by loadComponents.js and language.js respectively.
    padding: 0;
    box-sizing: border-box;
}* Debounces a function call, ensuring it's only executed after a specified delay.
 * Useful for events like window resizing or search input to limit execution frequency.
/* CSS Variables */} func The function to debounce.
:root {am {number} delay The delay in milliseconds.
    --primary-color: #007bff;bounced function.
    --primary-color-hover: #0056b3;
    --text-color: #333;ion(func, delay) {
    --bg-color: #f9f9f9;
    --header-bg: #333333;gs) {
    --white: #fff;ext = this;
    --font-family: 'Roboto', sans-serif;
    --shadow: 0 2px 5px rgba(0,0,0,0.2); func.apply(context, args), delay);
    --border-radius: 4px;
    
    /* Thêm các biến mới */
    --secondary-color: #6c757d;
    --success-color: #28a745;ction Buttons (FAB) for contact, share, and scroll-to-top.
    --danger-color: #dc3545;and manages their visibility and submenu toggling.
    --warning-color: #ffc107;
    --info-color: #17a2b8;s = function() {
    --dark-color: #343a40;
    --light-color: #f8f9fa;ument.getElementById('contact-main-btn'),
    --transition-speed: 0.3s;ent.getElementById('contact-options'),
}       shareMainBtn: document.getElementById('share-main-btn'),
        shareOptions: document.getElementById('share-options'),
body {  scrollToTopBtn: document.getElementById('scroll-to-top-btn')
    font-family: var(--font-family);
    line-height: 1.6;
    color: var(--text-color); FAB elements exist before proceeding
    background-color: var(--bg-color); !fabElements.contactOptions || !fabElements.shareMainBtn || !fabElements.shareOptions || !fabElements.scrollToTopBtn) {
    padding-top: 70px;[script.js] One or more FAB elements not found. FAB functionality will be limited.");
    overflow-x: hidden;
    min-height: 100vh; /* Đảm bảo chiều cao tối thiểu là 100% viewport */
}
    /**
.container {es the visibility of a submenu and updates aria-expanded attribute.
    max-width: 1200px;n submenus to ensure only one is active at a time.
    margin: 0 auto;Element} button The main button that triggers the submenu.
    padding: 20px;LElement} submenu The submenu element to toggle.
    width: 100%;
}   function toggleSubmenu(button, submenu) {
        const isHidden = submenu.classList.contains('fab-hidden');
/* Header Improvements */menus if they are open
header {[fabElements.contactOptions, fabElements.shareOptions].forEach(menu => {
    background-color: var(--header-bg);nu.classList.contains('fab-hidden')) {
    color: var(--white);ssList.add('fab-hidden');
    padding: 1rem 0;t associatedBtn = menu === fabElements.contactOptions ? fabElements.contactMainBtn : fabElements.shareMainBtn;
    position: fixed;ciatedBtn.setAttribute('aria-expanded', 'false');
    width: 100%;
    top: 0;
    z-index: 1000;the target submenu
    box-shadow: var(--shadow);le('fab-hidden');
    transition: all var(--transition-speed) ease;ng(submenu.classList.contains('fab-hidden') ? 'false' : 'true'));
}       // Focus on the first option if submenu is shown, or back on the button if hidden
        if (!submenu.classList.contains('fab-hidden')) {
/* Thêm class cho header khi scroll */u.querySelector('a');
header.scrolled {irstOption) firstOption.focus();
    padding: 0.5rem 0;
    background-color: rgba(51, 51, 51, 0.95);
    backdrop-filter: blur(5px);
}   }

/* Thêm animations cho các elements */t and share buttons
.fade-in {ments.contactMainBtn.addEventListener('click', (e) => { e.stopPropagation(); toggleSubmenu(fabElements.contactMainBtn, fabElements.contactOptions); });
    animation: fadeIn 0.5s ease-in;ntListener('click', (e) => { e.stopPropagation(); toggleSubmenu(fabElements.shareMainBtn, fabElements.shareOptions); });
}   
    // Set up share links for Facebook and Zalo
.slide-in {ageUrl = window.location.href;
    animation: slideIn 0.5s ease-out;
}   const shareFacebook = document.getElementById('share-facebook');
    if(shareFacebook) { 
@keyframes fadeIn {ok.href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`; 
    from { opacity: 0; }rget = '_blank';
    to { opacity: 1; }
}   const shareZalo = document.getElementById('share-zalo');
    if(shareZalo) { 
@keyframes slideIn {ef = `https://zalo.me/share?text=${encodeURIComponent(pageTitle + " - " + pageUrl)}`; 
    from { transform: translateY(-20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
}
    // Close submenus when clicking outside
/* Utility Classes */Listener('click', (e) => {
.text-center { text-align: center; }ons.classList.contains('fab-hidden') && !fabElements.contactMainBtn.contains(e.target) && !fabElements.contactOptions.contains(e.target)) {
.text-left { text-align: left; }ptions.classList.add('fab-hidden'); 
.text-right { text-align: right; }nBtn.setAttribute('aria-expanded', 'false');
        }
.mt-1 { margin-top: 0.25rem; }Options.classList.contains('fab-hidden') && !fabElements.shareMainBtn.contains(e.target) && !fabElements.shareOptions.contains(e.target)) {
.mt-2 { margin-top: 0.5rem; }Options.classList.add('fab-hidden'); 
.mt-3 { margin-top: 1rem; }reMainBtn.setAttribute('aria-expanded', 'false');
.mt-4 { margin-top: 1.5rem; }
.mt-5 { margin-top: 2rem; }

.mb-1 { margin-bottom: 0.25rem; } key is pressed
.mb-2 { margin-bottom: 0.5rem; }eydown', (e) => {
.mb-3 { margin-bottom: 1rem; }) {
.mb-4 { margin-bottom: 1.5rem; }Options, fabElements.shareOptions].forEach(menu => {
.mb-5 { margin-bottom: 2rem; }sList.contains('fab-hidden')) {
                    menu.classList.add('fab-hidden');
/* Responsive Typography */ssociatedBtn = menu === fabElements.contactOptions ? fabElements.contactMainBtn : fabElements.shareMainBtn;
html {              associatedBtn.setAttribute('aria-expanded', 'false'); 
    font-size: 16px;associatedBtn.focus(); // Return focus to the main button
}               }
            });
@media (max-width: 768px) {
    html {
        font-size: 14px;
    }/ Toggle scroll-to-top button visibility based on scroll position
}   window.addEventListener('scroll', () => {
        fabElements.scrollToTopBtn.classList.toggle('fab-hidden', window.pageYOffset <= 100);
@media (max-width: 480px) {oTopBtn.classList.toggle('flex', window.pageYOffset > 100);
    html {assive: true });
        font-size: 12px;
    }/ Scroll to top when the button is clicked
}   fabElements.scrollToTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
};
/* Header and Navigation */
header { initializeMobileMenu() {
    background-color: var(--header-bg);ElementById('mobile-menu-button');
    color: var(--white);= document.getElementById('mobile-menu-panel');
    padding: 1rem 0; = document.getElementById('icon-menu-open');
    position: fixed;e = document.getElementById('icon-menu-close');
    width: 100%;
    top: 0;leMenuButton || !mobileMenuPanel) {
    z-index: 1000; /* Ensures header is on top */');
    box-shadow: var(--shadow); /* Adds a subtle shadow */
} }

.navbar {toggle behavior
    display: flex;.addEventListener('click', () => {
    justify-content: space-between;tton.getAttribute('aria-expanded') === 'true';
    align-items: center;sList.toggle('active');
    max-width: 1200px;etAttribute('aria-expanded', !isExpanded);
    margin: 0 auto;assList.toggle('hidden');
    padding: 0 20px; /* Horizontal padding */
}   document.body.classList.toggle('overflow-hidden');
  });
.logo {
    font-size: 1.8rem; to close
    font-weight: bold;tener('click', (e) => {
    color: var(--white); /* White logo text */tive') && 
    text-decoration: none;ontains(e.target) && }.nav-links {    list-style: none;    display: flex;    align-items: center; /* Vertically align items if header height allows */}.nav-links li {    margin-left: 25px;}.nav-links a {    color: var(--white); /* White link text */    text-decoration: none;    font-size: 1rem;    padding: 8px 12px; /* Padding for tap targets */    border-radius: var(--border-radius);    transition: background-color 0.3s ease, color 0.3s ease;}.nav-links a:hover,.nav-links a.active-page-link { /* Style for active page link */    background-color: var(--primary-color); /* Blue background on hover/active */    color: var(--white);}/* Hamburger Menu for Mobile */.menu-toggle {    display: none; /* Hidden by default, shown in media query */    flex-direction: column;    cursor: pointer;    padding: 10px; /* Easier to tap */    background: none;    border: none;}.menu-toggle .bar {    width: 25px;    height: 3px;    background-color: var(--white); /* White bars */    margin: 4px 0;    transition: 0.4s;}/* Animation for hamburger to X */.menu-toggle.active .bar:nth-child(1) {    transform: rotate(-45deg) translate(-5px, 6px);}.menu-toggle.active .bar:nth-child(2) {    opacity: 0;}.menu-toggle.active .bar:nth-child(3) {    transform: rotate(45deg) translate(-5px, -6px);}/* Language Switcher */.language-switcher {    margin-left: 20px; /* Spacing from nav links or menu toggle */    display: flex; /* Align buttons nicely */    align-items: center;}.language-switcher button {    background-color: var(--primary-color);    color: var(--white);    border: none;    padding: 8px 12px;    margin-left: 5px;    border-radius: var(--border-radius);    cursor: pointer;    font-size: 0.9rem;    transition: background-color 0.3s ease;}.language-switcher button:hover,.language-switcher button.active-lang { /* Added active-lang styling */    background-color: var(--primary-color-hover);}/* Hero Section */.hero {    /* Desktop: Use webbanner.png, ensure full image is visible (contain) */    background: url('../images/webbanner.png') no-repeat center center;    background-size: contain; /* Ensures the whole image is visible */    color: var(--white);    padding: 100px 20px;    text-align: center;    position: relative; /* For pseudo-element overlay if needed */    min-height: 60vh; /* Ensure it takes up significant viewport height */    display: flex;    flex-direction: column;    justify-content: center;    align-items: center;}.hero h1 {    font-size: 3rem;    margin-bottom: 20px;    text-shadow: 2px 2px 4px rgba(0,0,0,0.5); /* Text shadow for readability */}.hero p {    font-size: 1.2rem;    margin-bottom: 30px;    max-width: 600px; /* Limit width for readability */    text-shadow: 1px 1px 3px rgba(0,0,0,0.5); /* Text shadow for readability */}.hero .btn {    background-color: var(--primary-color);    color: var(--white);    padding: 12px 25px;    text-decoration: none;    border-radius: 5px;    font-size: 1.1rem;    transition: background-color 0.3s ease;    border: none; /* Ensure button styles are consistent */}.hero .btn:hover {    background-color: var(--primary-color-hover);}/* Sections */.section {    padding: 60px 20px;    text-align: center;}.section-light {    background-color: var(--white);}.section-dark {    background-color: #f4f4f4; /* Or a darker color if preferred */}.section h2 {    font-size: 2.5rem;    margin-bottom: 40px;    color: var(--text-color);}/* Cards for Services/Projects */.card-container {    display: flex;    flex-wrap: wrap;    justify-content: center;    gap: 20px; /* Space between cards */}.card {    background-color: var(--white);    border: 1px solid #ddd;    border-radius: 8px;    box-shadow: 0 4px 8px rgba(0,0,0,0.1);    overflow: hidden;    width: 300px; /* Fixed width for cards */    text-align: left;    transition: transform 0.3s ease, box-shadow 0.3s ease;}.card:hover {    transform: translateY(-5px);    box-shadow: 0 6px 12px rgba(0,0,0,0.15);}.card img {    width: 100%;    height: 200px; /* Fixed height for images */    object-fit: cover; /* Ensures image covers the area well */}.card-content {    padding: 20px;}.card-content h3 {    font-size: 1.5rem;    margin-bottom: 10px;    color: var(--primary-color);}.card-content p {    font-size: 1rem;    margin-bottom: 15px;}.card-content .btn {    display: inline-block;    background-color: var(--primary-color);    color: var(--white);    padding: 10px 15px;    text-decoration: none;    border-radius: var(--border-radius);    transition: background-color 0.3s ease;}.card-content .btn:hover {    background-color: var(--primary-color-hover);}/* Footer */footer {    background-color: var(--header-bg);    color: var(--white);    text-align: center;    padding: 20px 0;    margin-top: 40px; /* Space above footer */}footer p {    margin: 0;    font-size: 0.9rem;}/* Form Styles (Contact Page) */.contact-form {    max-width: 600px;    margin: 0 auto;    background-color: var(--white);    padding: 30px;    border-radius: 8px;    box-shadow: 0 4px 8px rgba(0,0,0,0.1);}.form-group {    margin-bottom: 20px;}.form-group label {    display: block;    margin-bottom: 5px;    font-weight: bold;    text-align: left;}.form-group input,.form-group textarea {    width: 100%;    padding: 12px;
        !mobileMenuButton.contains(e.target)) {    border: 1px solid #ccc;    border-radius: var(--border-radius);    font-size: 1rem;}.form-group textarea {    resize: vertical; /* Allow vertical resizing */    min-height: 120px;}.form-group button.btn {    background-color: var(--primary-color);    color: var(--white);    padding: 12px 20px;    border: none;    border-radius: var(--border-radius);    cursor: pointer;    font-size: 1.1rem;    transition: background-color 0.3s ease;    width: 100%; /* Full width button */}.form-group button.btn:hover {    background-color: var(--primary-color-hover);}/* About Us Page Specifics */.about-content {    display: flex;    flex-direction: column;    align-items: center;    gap: 30px;}.about-text {    max-width: 800px;    text-align: left; /* Or center if preferred */    line-height: 1.8;}.about-text h2 {    text-align: center; /* Center the heading */    margin-bottom: 20px;}.team-members {    display: flex;    flex-wrap: wrap;
      mobileMenuPanel.classList.remove('active');    justify-content: center;    gap: 30px;    margin-top: 40px;}.team-member {    background-color: var(--white);    padding: 20px;    border-radius: 8px;    box-shadow: 0 2px 4px rgba(0,0,0,0.1);    width: 250px;    text-align: center;}.team-member img {    width: 120px;    height: 120px;    border-radius: 50%;    object-fit: cover;    margin-bottom: 15px;}.team-member h4 {    font-size: 1.2rem;    margin-bottom: 5px;}.team-member p {    font-size: 0.9rem;    color: #666;}/* Responsive Design */@media (max-width: 768px) {    body {        padding-top: 60px; /* Adjust if header height changes on mobile */    }    .navbar {        padding: 0 15px; /* Slightly less padding on mobile */    }    .logo {        font-size: 1.5rem; /* Smaller logo on mobile */    }    .nav-links {        display: none; /* Links hidden by default on mobile */
      mobileMenuButton.setAttribute('aria-expanded', 'false');        flex-direction: column;        width: 100%;        position: absolute;        top: 60px; /* Position below the header; adjust if header padding changes */        left: 0;        background-color: var(--header-bg); /* UPDATED: Solid dark background for dropdown */        padding: 1rem 0;        box-shadow: var(--shadow);        z-index: 999; /* Below header but above content */    }    .nav-links.active { /* This class will be toggled by JavaScript */        display: flex; /* Show when active */    }    .nav-links li {        margin: 10px 0;        text-align: center;        width: 100%; /* Make list items full width */    }    .nav-links a {        padding: 12px 0; /* Full width tap target for links */        display: block; /* Make links block elements for full-width tap */        width: 100%;    }    .menu-toggle {        display: flex; /* Show hamburger icon on mobile */    }    .language-switcher {        margin-left: 10px; /* Adjust spacing for mobile */    }    .language-switcher button {        padding: 6px 10px;        font-size: 0.8rem;    }
      iconMenuOpen.classList.remove('hidden');    .hero {        /* Mobile: Use webbannermo.png, ensure it covers the area */        background-image: url('../images/webbannermo.png'); /* Ensure this path is correct */        background-size: cover; /* Use cover for mobile to ensure no gaps */        background-position: center;        background-repeat: no-repeat;        min-height: 40vh; /* Adjusted min-height for mobile hero */        padding: 60px 20px;    }    .hero h1 {        font-size: 2.2rem; /* Adjust hero heading for mobile */    }    .hero p {        font-size: 1rem; /* Adjust hero paragraph for mobile */    }    .section h2 {        font-size: 2rem; /* Adjust section headings for mobile */    }    .card {        width: 90%; /* Cards take more width on mobile */        max-width: 320px; /* But not too wide */    }    .contact-form {        padding: 20px;    }}@media (max-width: 480px) {    .logo {        font-size: 1.3rem;    }    /* Further adjustments for very small screens if needed */}/* Tailwind Base, Components, Utilities (if you plan to mix) *//* These might conflict if not managed carefully with the custom CSS above.   If this styles.css is meant to be standalone, you might not need these.   If you are using Tailwind CLI for other parts, this is where its output would go,   or you'd import the Tailwind output file.*//* @tailwind base; *//* @tailwind components; */
      iconMenuClose.classList.add('hidden');/* @tailwind utilities; */





}  });    }      document.body.classList.remove('overflow-hidden');/* Fix mobile menu visibility */
#mobile-menu-panel {
  display: none;
  background-color: rgba(0, 0, 0, 0.5);
}

#mobile-menu-panel.active {
  display: block;
}

.mobile-menu-container {
  position: fixed;
  top: 0;
  right: 0;
  width: 80%;
  max-width: 300px;
  height: 100%;
  background-color: var(--header-bg);
  transform: translateX(100%);
  transition: transform 0.3s ease-in-out;
}

#mobile-menu-panel.active .mobile-menu-container {
  transform: translateX(0);
}

/* Fix submenu transitions */
.mobile-submenu-content {
  transition: max-height 0.3s ease-out;
  max-height: 0;
  overflow: hidden;
}

.mobile-submenu-content.active {
  max-height: 500px;
}

/* Header Scroll Effect */
function initializeHeaderScroll() {
  const header = document.getElementById('main-header');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
      header.classList.remove('scrolled');
      return;
    }
    
    if (currentScroll > lastScroll && currentScroll > 100) {
      // Scrolling down & past threshold
      header.classList.add('scrolled');
    } else {
      // Scrolling up
      header.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
  }, { passive: true });
}

document.addEventListener('DOMContentLoaded', () => {
  initializeMobileMenu();
  initializeLanguageToggle();
  initializeHeaderScroll();
  
  // Additional initialization for submenus
  const submenuToggles = document.querySelectorAll('.mobile-submenu-toggle');
  submenuToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const submenu = document.getElementById(toggle.getAttribute('aria-controls'));
      if (submenu) {
        submenu.classList.toggle('active');
        toggle.setAttribute('aria-expanded', 
          submenu.classList.contains('active'));
      }
    });
  });
});
