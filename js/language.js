// /js/language.js

// Đối tượng lưu trữ các bản dịch
// Đã cập nhật với keys từ header v2 và index v2
const translations = {
    vi: {
        // Meta Tags (Ví dụ cho index)
        page_title_index: "IVS JSC - Giáo dục, Công nghệ, Sức khỏe, Hợp tác Quốc tế",
        meta_description_index: "IVS JSC - Tổ chức tiên phong tại Việt Nam trong lĩnh vực giáo dục (IVS Academy, IVS Kindergarten), EdTech (IVS Celestech), sức khỏe cộng đồng và hợp tác quốc tế.",
        og_title_index: "IVS JSC - Giáo dục, Công nghệ, Sức khỏe, Hợp tác Quốc tế",
        og_description_index: "Khám phá các giải pháp toàn diện về đào tạo ngoại ngữ, STEAM, kỹ năng sống, EdTech, chăm sóc sức khỏe và cơ hội hợp tác cùng IVS JSC.",
        page_title_default: "IVS Education", // Title mặc định cho layout
        meta_description: "IVS Education - Tổ chức giáo dục, công nghệ giáo dục (EdTech), hợp tác đầu tư quốc tế.", // Description mặc định

        // Header v2
        logo_alt: "Logo IVS JSC",
        menu_home: "Trang chủ",
        menu_about: "Giới thiệu",
        menu_about_ivs: "Về IVS JSC",
        menu_mission_vision: "Sứ mệnh & Tầm nhìn",
        menu_ivs_meaning: "Ý nghĩa IVS",
        menu_team: "Đội ngũ",
        menu_partners: "Đối tác",
        menu_training: "Đào tạo",
        menu_placement_test: "Kiểm tra trình độ",
        menu_summer_camp: "Trại hè Quốc tế",
        menu_scholarships: "Học bổng",
        menu_hay_noi_club: "CLB Hãy Nói",
        menu_cooperation: "Hợp tác",
        menu_international_link: "Liên kết Quốc tế",
        menu_iivsa_alliance: "Liên minh IIVSA",
        menu_school_link: "Liên kết Trường học",
        menu_link_preschool: "Mầm non",
        menu_link_primary: "Tiểu học",
        menu_link_secondary: "THCS & THPT",
        menu_link_language_center: "Trung tâm Ngoại ngữ",
        menu_investment_cooperation: "Hợp tác Đầu tư",
        menu_center_establishment: "Thành lập Trung tâm",
        menu_non_profit: "Tổ chức Phi lợi nhuận",
        menu_sponsorship: "Tài trợ",
        menu_services: "Dịch vụ",
        menu_edu_consulting: "Tư vấn Giáo dục",
        menu_web_design: "Thiết kế Web",
        menu_health_care: "Chăm sóc Sức khỏe",
        menu_recruitment: "Tuyển dụng",
        menu_recruitment_vn: "Tuyển dụng nội địa", // Giữ nguyên phần tiếng Anh trong ngoặc
        menu_recruitment_intl: "Tuyển dụng quốc tế", // Giữ nguyên phần tiếng Anh trong ngoặc
        menu_contact: "Liên hệ",
        open_main_menu: "Mở menu chính",

        // Index Page v2
        index_hero_title: "Chào mừng đến với IVS JSC",
        index_hero_subtitle: "Kiến tạo tương lai giáo dục và sức khỏe Việt Nam",
        learn_more: "Tìm hiểu thêm", // Dùng chung
        index_news_title: "Tin Tức & Sự Kiện",
        loading_news: "Đang tải tin tức...",
        no_news: "Chưa có tin tức nào.",
        news_title_na: "Không có tiêu đề",
        read_more: "Đọc thêm →",
        news_image_alt: "Ảnh tin tức",
        news_load_error: "Không thể tải tin tức.",
        index_about_title: "Về Chúng Tôi",
        index_about_p1: "IVS JSC là tổ chức tiên phong trong lĩnh vực giáo dục, công nghệ giáo dục (EdTech), sức khỏe cộng đồng, hợp tác quốc tế, và phát triển kinh doanh tại Việt Nam.",
        index_about_p2: "Chúng tôi cung cấp giải pháp toàn diện từ giáo dục ngoại ngữ, kỹ năng sống, STEAM, đến các chương trình chăm sóc sức khỏe và ứng dụng công nghệ hiện đại.",
        view_details: "Xem chi tiết →", // Dùng chung
        index_about_img_alt: "Hình ảnh giới thiệu IVS JSC",
        index_activities_title: "Lĩnh Vực Hoạt Động Chính",
        activity_academy_title: "IVS Academy",
        activity_academy_desc: "Đào tạo ngoại ngữ (Anh, Trung, Nhật), STEAM, kỹ năng mềm. Chương trình cộng đồng \"Hãy Nói\".",
        activity_kindergarten_title: "IVS Kindergarten",
        activity_kindergarten_desc: "Mầm non tiên phong áp dụng mô hình STEAM+Intelligence. Cơ sở vật chất hiện đại.",
        activity_celestech_title: "IVS Celestech (EdTech)",
        activity_celestech_desc: "Phát triển giải pháp công nghệ giáo dục: E-learning, LMS, AI, VR/AR.",
        activity_health_title: "IVS Health & Wellness",
        activity_health_desc: "Hợp tác phát triển sản phẩm sức khỏe như yến sào Thanh Yến, giáo dục dinh dưỡng cộng đồng.",
        activity_cooperation_title: "Hợp Tác Quốc Tế",
        activity_cooperation_desc: "Kết nối giáo dục và sức khỏe Việt Nam với thế giới: Du học, trại hè, liên kết đào tạo.",
        activity_investment_title: "Đầu Tư & Phát Triển",
        activity_investment_desc: "Xây dựng hệ thống giáo dục liên cấp IVS Global School và dự án bền vững.",
        details_link: "Chi tiết...", // Dùng chung
        index_video_title: "Video Giới Thiệu",
        index_video_iframe_title: "Video giới thiệu IVS JSC",

        // Footer (Giữ nguyên từ v1 nếu không đổi)
        footer_desc: "IVS Education - Tiên phong giáo dục, công nghệ, đầu tư và thương mại dịch vụ tại Việt Nam.",
        quick_links: "Liên Kết Nhanh",
        // footer_about_ivs: "Về IVS", // Có thể dùng menu_about_ivs
        // footer_services: "Dịch Vụ", // Có thể dùng menu_services
        // footer_careers: "Tuyển Dụng", // Có thể dùng menu_recruitment
        // footer_contact: "Liên Hệ", // Có thể dùng menu_contact
        blog: "Tin tức",
        contact_us: "Liên Hệ",
        address: "Số 1104, Tổ 6, Ấp Đất Mới, Xã Long Phước, Huyện Long Thành, Tỉnh Đồng Nai, Việt Nam, 76213.",
        copyright: "© 2025 IVS JSC. Đã đăng ký Bản quyền.",

        // Thêm các key khác từ các trang khác nếu cần...
    },
    en: {
        // Meta Tags (Example for index)
        page_title_index: "IVS JSC - Education, Technology, Health, International Cooperation",
        meta_description_index: "IVS JSC - A pioneering organization in Vietnam in education (IVS Academy, IVS Kindergarten), EdTech (IVS Celestech), public health, and international cooperation.",
        og_title_index: "IVS JSC - Education, Technology, Health, International Cooperation",
        og_description_index: "Discover comprehensive solutions in language training, STEAM, life skills, EdTech, healthcare, and partnership opportunities with IVS JSC.",
        page_title_default: "IVS Education", // Default layout title
        meta_description: "IVS Education - Education organization, educational technology (EdTech), international investment cooperation.", // Default description

        // Header v2
        logo_alt: "IVS JSC Logo",
        menu_home: "Home",
        menu_about: "About Us",
        menu_about_ivs: "About IVS JSC",
        menu_mission_vision: "Mission & Vision",
        menu_ivs_meaning: "Meaning of IVS",
        menu_team: "Our Team",
        menu_partners: "Partners",
        menu_training: "Training",
        menu_placement_test: "Placement Test",
        menu_summer_camp: "International Summer Camp",
        menu_scholarships: "Scholarships",
        menu_hay_noi_club: "Hay Noi Club",
        menu_cooperation: "Cooperation",
        menu_international_link: "International Linkage",
        menu_iivsa_alliance: "IIVSA Alliance",
        menu_school_link: "School Linkage",
        menu_link_preschool: "Preschool",
        menu_link_primary: "Primary School",
        menu_link_secondary: "Secondary & High School",
        menu_link_language_center: "Language Center",
        menu_investment_cooperation: "Investment Cooperation",
        menu_center_establishment: "Center Establishment",
        menu_non_profit: "Non-profit Organization",
        menu_sponsorship: "Sponsorship",
        menu_services: "Services",
        menu_edu_consulting: "Education Consulting",
        menu_web_design: "Web Design",
        menu_health_care: "Health Care",
        menu_recruitment: "Recruitment",
        menu_recruitment_vn: "Domestic Recruitment (Vietnamese Applicants)",
        menu_recruitment_intl: "International Recruitment (International Applicants)",
        menu_contact: "Contact",
        open_main_menu: "Open main menu",

        // Index Page v2
        index_hero_title: "Welcome to IVS JSC",
        index_hero_subtitle: "Shaping the future of education and health in Vietnam",
        learn_more: "Learn more", // Common
        index_news_title: "News & Events",
        loading_news: "Loading news...",
        no_news: "No news yet.",
        news_title_na: "N/A",
        read_more: "Read more →", // Common
        news_image_alt: "News image",
        news_load_error: "Could not load news.",
        index_about_title: "About Us",
        index_about_p1: "IVS JSC is a pioneering organization in education, educational technology (EdTech), public health, international cooperation, and business development in Vietnam.",
        index_about_p2: "We provide comprehensive solutions from language education, life skills, STEAM, to healthcare programs and modern technology applications.",
        view_details: "View details →", // Common
        index_about_img_alt: "IVS JSC introduction image",
        index_activities_title: "Main Fields of Operation",
        activity_academy_title: "IVS Academy",
        activity_academy_desc: "Language training (English, Chinese, Japanese), STEAM, soft skills. Community program \"Hay Noi\".",
        activity_kindergarten_title: "IVS Kindergarten",
        activity_kindergarten_desc: "Pioneering preschool applying the STEAM+Intelligence model. Modern facilities.",
        activity_celestech_title: "IVS Celestech (EdTech)",
        activity_celestech_desc: "Developing educational technology solutions: E-learning, LMS, AI, VR/AR.",
        activity_health_title: "IVS Health & Wellness",
        activity_health_desc: "Cooperating in developing health products like Thanh Yen bird's nest, community nutrition education.",
        activity_cooperation_title: "International Cooperation",
        activity_cooperation_desc: "Connecting Vietnamese education and health with the world: Study abroad, summer camps, joint training.",
        activity_investment_title: "Investment & Development",
        activity_investment_desc: "Building the IVS Global School system and sustainable projects.",
        details_link: "Details...", // Common
        index_video_title: "Introductory Video",
        index_video_iframe_title: "IVS JSC Introductory Video",

        // Footer (Keep from v1 if unchanged)
        footer_desc: "IVS Education - Pioneering education, technology, investment, and service commerce in Vietnam.",
        quick_links: "Quick Links",
        // footer_about_ivs: "About IVS", // Can use menu_about_ivs
        // footer_services: "Services", // Can use menu_services
        // footer_careers: "Careers", // Can use menu_recruitment
        // footer_contact: "Contact", // Can use menu_contact
        blog: "Blog",
        contact_us: "Contact Us",
        address: "No. 1104, Group 6, Dat Moi Hamlet, Long Phuoc Commune, Long Thanh District, Dong Nai Province, Vietnam, 76213.",
        copyright: "© 2025 IVS JSC. All rights reserved.",

        // Add other keys from other pages if needed...
    }
};

// Hàm để đặt ngôn ngữ
function setLanguage(lang) {
    // Lưu ngôn ngữ được chọn vào localStorage
    localStorage.setItem('preferredLanguage', lang);

    // Lặp qua tất cả các phần tử có thuộc tính data-lang-key
    document.querySelectorAll('[data-lang-key]').forEach(element => {
        const key = element.getAttribute('data-lang-key');
        const translation = translations[lang]?.[key]; // Sử dụng optional chaining

        if (translation !== undefined) { // Chỉ cập nhật nếu có bản dịch (kể cả chuỗi rỗng)
            // Cập nhật nội dung text
            // Tránh cập nhật nếu phần tử con cũng có data-lang-key (để không ghi đè menu cha)
            let hasChildWithLangKey = false;
            if (element.children.length > 0) {
                 for(let child of element.children) {
                     if (child.hasAttribute('data-lang-key')) {
                         hasChildWithLangKey = true;
                         break;
                     }
                 }
            }

            // Chỉ cập nhật textContent nếu phần tử không phải là container cho các phần tử con có key riêng
            // Hoặc nếu nó là thẻ SPAN (thường dùng để chứa text đơn lẻ trong button/link)
            if (!hasChildWithLangKey || element.tagName === 'SPAN') {
                 // Kiểm tra xem có nên dùng innerHTML hay textContent không
                 // Ví dụ: nếu key chứa HTML như <br>, dùng innerHTML
                 // Tạm thời vẫn dùng textContent cho an toàn, trừ khi bạn cần HTML
                 element.textContent = translation;
            }


            // Cập nhật các thuộc tính khác nếu có key tương ứng
            const placeholderKey = key + '_placeholder';
            const titleKey = key + '_title';
            const altKey = key + '_alt';

            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                 const placeholderTranslation = translations[lang]?.[placeholderKey];
                 if (placeholderTranslation !== undefined) {
                     element.placeholder = placeholderTranslation;
                 }
            }
            if (element.hasAttribute('title')) {
                 const titleTranslation = translations[lang]?.[titleKey];
                 if (titleTranslation !== undefined) {
                     element.title = titleTranslation;
                 }
            }
             if (element.tagName === 'IMG' && element.hasAttribute('alt')) {
                 const altTranslation = translations[lang]?.[altKey];
                 if (altTranslation !== undefined) {
                     element.alt = altTranslation;
                 }
             }
             // Cập nhật thẻ meta description và title (nếu tồn tại)
             if (element.tagName === 'META' && element.getAttribute('name') === 'description') {
                  element.content = translation;
             }
             if (element.tagName === 'TITLE') {
                  element.textContent = translation;
             }
             // Cập nhật thẻ meta og:title, og:description (nếu tồn tại)
              if (element.tagName === 'META' && element.getAttribute('property') === 'og:title') {
                  element.content = translation;
              }
              if (element.tagName === 'META' && element.getAttribute('property') === 'og:description') {
                  element.content = translation;
              }
        }
    });

    // Cập nhật trạng thái active/disabled cho nút ngôn ngữ (sử dụng ID mới)
    // Sử dụng querySelectorAll để bao gồm cả desktop và mobile
    document.querySelectorAll('[id^="lang-vi-"], [id^="lang-en-"]').forEach(button => {
        if (button.getAttribute('data-lang') === lang) {
            button.classList.add('text-blue-700', 'font-bold'); // Kiểu active
            button.classList.remove('text-gray-600');
            button.disabled = true;
        } else {
            button.classList.remove('text-blue-700', 'font-bold');
            button.classList.add('text-gray-600');
            button.disabled = false;
        }
    });

    // Cập nhật thuộc tính lang của thẻ html
    document.documentElement.lang = lang;
}

// Hàm khởi tạo ngôn ngữ
// Sẽ được gọi bởi script.js sau khi components được tải, hoặc chạy ngay nếu script.js không tồn tại/không gọi nó
function initializeLanguage() {
    console.log("Initializing language..."); // Thêm log để debug
    // Lấy ngôn ngữ ưa thích từ localStorage hoặc mặc định là 'vi'
    const preferredLanguage = localStorage.getItem('preferredLanguage') || 'vi';
    setLanguage(preferredLanguage);

    // Thêm event listener cho các nút chuyển đổi ngôn ngữ
    // Đảm bảo chúng được thêm sau khi header được tải (nếu tải động)
    attachLanguageButtonListeners();
}

// Hàm riêng để gắn listeners, có thể gọi lại nếu cần
function attachLanguageButtonListeners() {
    // Sử dụng querySelectorAll để lấy cả nút desktop và mobile
    document.querySelectorAll('[id^="lang-vi-"]').forEach(button => {
        // Xóa listener cũ trước khi thêm mới (đề phòng gọi nhiều lần)
        button.removeEventListener('click', handleLanguageChange);
        button.addEventListener('click', handleLanguageChange);
    });
    document.querySelectorAll('[id^="lang-en-"]').forEach(button => {
        button.removeEventListener('click', handleLanguageChange);
        button.addEventListener('click', handleLanguageChange);
    });
}

// Hàm xử lý sự kiện click chung
function handleLanguageChange(event) {
    const lang = event.target.getAttribute('data-lang');
    if (lang) {
        setLanguage(lang);
        // Nếu đang dùng loadNews, có thể cần tải lại tin tức đã dịch
        if (typeof loadNews === 'function') {
             console.log("Reloading news for new language...");
             // loadNews(); // Tải lại tin tức với ngôn ngữ mới
             // Hoặc chỉ cần gọi lại setLanguage là đủ nếu HTML đã được tạo đúng
        }
    }
}


// Tự khởi tạo nếu language.js được tải cuối cùng và không được gọi từ script.js
// Nếu script.js sẽ gọi initializeLanguage(), dòng này có thể bị comment đi
// document.addEventListener('DOMContentLoaded', initializeLanguage);

// Xuất hàm để script.js có thể gọi nếu cần
// (Không cần thiết nếu dùng cách tải script tuần tự)
// window.initializeLanguage = initializeLanguage;

// --- Logic cũ từ header v1 (giữ lại nếu cần cho mobile menu mới) ---
document.addEventListener('DOMContentLoaded', () => {
    // Khởi tạo ngôn ngữ NGAY LẬP TỨC nếu script.js không gọi
    // Nếu script.js CÓ gọi initializeLanguage(), dòng này sẽ bị thừa nhưng không sao
    // Hoặc bạn có thể xóa dòng này và chỉ dựa vào script.js gọi
     if (!window.languageInitialized) { // Cờ để tránh khởi tạo 2 lần
         initializeLanguage();
         window.languageInitialized = true; // Đánh dấu đã khởi tạo
     }


    // --- Mobile Menu Logic (từ header v2) ---
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
    const iconMenu = document.getElementById('icon-menu');
    const iconClose = document.getElementById('icon-close');

    function toggleMobileMenu() {
        const isOpen = mobileMenu.classList.contains('translate-x-0');
        if (isOpen) {
            // Close menu
            mobileMenu.classList.remove('translate-x-0');
            mobileMenu.classList.add('translate-x-full');
            mobileMenuOverlay.classList.add('opacity-0');
            mobileMenuOverlay.classList.remove('opacity-100');
            setTimeout(() => mobileMenuOverlay.classList.add('hidden'), 300); // Hide after transition
            iconMenu.classList.remove('hidden');
            iconClose.classList.add('hidden');
            mobileMenuButton.setAttribute('aria-expanded', 'false');
        } else {
            // Open menu
            mobileMenu.classList.remove('translate-x-full');
            mobileMenu.classList.add('translate-x-0');
            mobileMenuOverlay.classList.remove('hidden');
            setTimeout(() => { // Allow display block before starting opacity transition
                 mobileMenuOverlay.classList.remove('opacity-0');
                 mobileMenuOverlay.classList.add('opacity-100');
            }, 10);
            iconMenu.classList.add('hidden');
            iconClose.classList.remove('hidden');
            mobileMenuButton.setAttribute('aria-expanded', 'true');
        }
    }

    if (mobileMenuButton && mobileMenu && mobileMenuOverlay && iconMenu && iconClose) {
        mobileMenuButton.addEventListener('click', toggleMobileMenu);
        mobileMenuOverlay.addEventListener('click', toggleMobileMenu); // Close on overlay click
    }

    // Mobile Submenu Toggle Logic
    const submenuToggles = document.querySelectorAll('.mobile-submenu-toggle');
    submenuToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            const parentItem = toggle.closest('.mobile-menu-item');
            const submenu = parentItem.querySelector('.mobile-submenu');
            const arrowIcon = toggle.querySelector('svg');

            if (submenu) {
                const isSubmenuOpen = !submenu.classList.contains('hidden');
                if (isSubmenuOpen) {
                    submenu.classList.add('hidden');
                    parentItem.classList.remove('open'); // Optional class for styling parent
                    if(arrowIcon) arrowIcon.classList.remove('rotate-90');
                } else {
                    // Optional: Close other open submenus at the same level
                    // const siblingSubmenus = parentItem.parentElement.querySelectorAll('.mobile-menu-item.open .mobile-submenu');
                    // siblingSubmenus.forEach(sib => sib.classList.add('hidden'));
                    // parentItem.parentElement.querySelectorAll('.mobile-menu-item.open').forEach(sibP => sibP.classList.remove('open'));
                    // parentItem.parentElement.querySelectorAll('.mobile-submenu-toggle svg.rotate-90').forEach(sibSvg => sibSvg.classList.remove('rotate-90'));

                    submenu.classList.remove('hidden');
                    parentItem.classList.add('open');
                    if(arrowIcon) arrowIcon.classList.add('rotate-90');
                }
            }
        });
    });

     // Navbar scroll effect (từ header v2) - Giữ lại nếu cần
     let lastScrollTop = 0;
     const navbar = document.getElementById('navbar');
     window.addEventListener("scroll", function() {
         let currentScroll = window.pageYOffset || document.documentElement.scrollTop;
         if (navbar) {
             if (currentScroll > lastScrollTop && currentScroll > 80) { // Scroll Down and past header height
                 navbar.style.top = `-${navbar.offsetHeight}px`;
             } else { // Scroll Up or near top
                 navbar.style.top = "0";
             }
         }
         lastScrollTop = currentScroll <= 0 ? 0 : currentScroll; // For Mobile or negative scrolling
     }, false);

});
