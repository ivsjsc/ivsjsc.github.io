// /js/language.js

// Đối tượng lưu trữ các bản dịch
// Đã cập nhật với keys từ header v5, rnd-curriculum, tai-tro
const translations = {
    vi: {
        // Meta Tags
        page_title_index: "IVS JSC - Giáo dục, Công nghệ, Sức khỏe, Hợp tác Quốc tế",
        meta_description_index: "IVS JSC - Tổ chức tiên phong tại Việt Nam trong lĩnh vực giáo dục (IVS Academy, IVS Kindergarten), EdTech (IVS Celestech), sức khỏe cộng đồng và hợp tác quốc tế.",
        og_title_index: "IVS JSC - Giáo dục, Công nghệ, Sức khỏe, Hợp tác Quốc tế",
        og_description_index: "Khám phá các giải pháp toàn diện về đào tạo ngoại ngữ, STEAM, kỹ năng sống, EdTech, chăm sóc sức khỏe và cơ hội hợp tác cùng IVS JSC.",
        page_title_default: "IVS Education",
        meta_description: "IVS Education - Tổ chức giáo dục, công nghệ giáo dục (EdTech), hợp tác đầu tư quốc tế.",
        page_title_rnd: "Thiết kế Học liệu theo yêu cầu - IVS Education",
        meta_description_rnd: "Dịch vụ thiết kế học liệu, giáo trình, chương trình đào tạo theo yêu cầu chuyên biệt từ IVS Education.",
        page_title_sponsorship: "Tài trợ Cộng đồng - IVS Education",
        meta_description_sponsorship: "Tìm hiểu về các chương trình tài trợ cộng đồng của IVS Education và cách bạn có thể đồng hành cùng chúng tôi kiến tạo giá trị bền vững.",

        // Header v5
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
        menu_center_establishment: "Thành lập Trung tâm", // Đã chuyển sang Dịch vụ trong HTML, nhưng key giữ lại nếu cần
        menu_non_profit: "Tổ chức Phi lợi nhuận",
        menu_sponsorship: "Tài trợ",
        menu_services: "Dịch vụ",
        menu_edu_consulting: "Tư vấn Giáo dục",
        menu_web_design: "Thiết kế Web",
        // menu_health_care: "Chăm sóc Sức khỏe", // Đã bị xóa khỏi menu Dịch vụ
        menu_design_edu: "Thiết kế Học liệu", // Đã đổi tên từ custom_curriculum
        menu_healths: "Sức khỏe", // Menu mới
        menu_health_yensao: "Yến sào Thanh Yến", // Mục con mới, key ĐÚNG
        menu_recruitment: "Tuyển dụng",
        menu_recruitment_vn: "Tuyển dụng nội địa",
        menu_recruitment_intl: "Tuyển dụng quốc tế",
        menu_contact: "Liên hệ",
        open_main_menu: "Mở menu chính",

        // Index Page v2 (Giữ nguyên)
        index_hero_title: "Chào mừng đến với IVS JSC",
        index_hero_subtitle: "Kiến tạo tương lai giáo dục và sức khỏe Việt Nam",
        learn_more: "Tìm hiểu thêm",
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
        view_details: "Xem chi tiết →",
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
        details_link: "Chi tiết...",
        index_video_title: "Video Giới Thiệu",
        index_video_iframe_title: "Video giới thiệu IVS JSC",

        // Footer
        footer_desc: "IVS Education - Tiên phong giáo dục, công nghệ, đầu tư và thương mại dịch vụ tại Việt Nam.",
        quick_links: "Liên Kết Nhanh",
        blog: "Tin tức",
        contact_us: "Liên Hệ",
        address: "Số 1104, Tổ 6, Ấp Đất Mới, Xã Long Phước, Huyện Long Thành, Tỉnh Đồng Nai, Việt Nam, 76213.",
        copyright: "© 2025 IVS JSC. Đã đăng ký Bản quyền.",
        footer_sponsorship: "Tài trợ Cộng đồng",

        // Trang rnd-curriculum.html (Giữ nguyên)
        rnd_heading: "Thiết kế Học liệu theo yêu cầu (R&D Curriculum)",
        rnd_intro_p1: "IVS Education cung cấp dịch vụ nghiên cứu và phát triển (R&D) chương trình, giáo trình, học liệu giảng dạy và học tập theo yêu cầu đặc thù của từng đối tác.",
        rnd_intro_p2: "Với đội ngũ chuyên gia giàu kinh nghiệm và quy trình làm việc chuyên nghiệp, chúng tôi cam kết mang đến những sản phẩm giáo dục chất lượng cao, đáp ứng mục tiêu đào tạo và phù hợp với đối tượng người học.",
        rnd_services_heading: "Các hạng mục chính:",
        rnd_service_item1: "Phân tích nhu cầu và mục tiêu đào tạo.",
        rnd_service_item2: "Thiết kế khung chương trình chi tiết.",
        rnd_service_item3: "Biên soạn nội dung giáo trình, bài giảng.",
        rnd_service_item4: "Phát triển học liệu bổ trợ (video, slide, bài tập tương tác...).",
        rnd_service_item5: "Thiết kế hệ thống kiểm tra, đánh giá.",
        rnd_service_item6: "Số hóa học liệu và tích hợp lên nền tảng LMS.",
        rnd_contact_cta: "Liên hệ với chúng tôi để được tư vấn chi tiết về dịch vụ thiết kế học liệu.",

        // Trang tai-tro.html (Giữ nguyên)
        sponsorship_heading: "Đồng hành cùng IVS vì Cộng đồng",
        sponsorship_intro_p1: "Tại IVS Education, chúng tôi tin rằng giáo dục và phát triển cộng đồng là nền tảng cho một tương lai bền vững. Chúng tôi cam kết thực hiện trách nhiệm xã hội thông qua các chương trình tài trợ và hoạt động phi lợi nhuận ý nghĩa.",
        sponsorship_intro_p2: "Chúng tôi trân trọng mời gọi các cá nhân, tổ chức, doanh nghiệp cùng chung tay, đồng hành và tài trợ cho các dự án cộng đồng của IVS, lan tỏa tri thức và tạo dựng những giá trị tích cực.",
        sponsorship_haynoi_heading: "Chương trình Nổi bật: CLB Hãy Nói",
        sponsorship_haynoi_desc1: "\"Hãy Nói\" là câu lạc bộ phi lợi nhuận do IVS Academy khởi xướng và vận hành, dành riêng cho thanh thiếu niên tại Long Thành, Đồng Nai.",
        sponsorship_haynoi_desc2: "Mục tiêu chính của CLB là tạo ra một môi trường an toàn, năng động để các em rèn luyện kỹ năng giao tiếp, thuyết trình trước đám đông, tư duy phản biện và kỹ năng làm việc nhóm - những hành trang thiết yếu cho thế kỷ 21.",
        sponsorship_haynoi_desc3: "Sự tài trợ của quý vị sẽ trực tiếp hỗ trợ kinh phí tổ chức các buổi sinh hoạt định kỳ, tài liệu học tập, mời diễn giả, tổ chức các cuộc thi và sự kiện, giúp CLB duy trì hoạt động và mang lại lợi ích thiết thực cho thế hệ trẻ địa phương.",
        sponsorship_haynoi_link: "Tìm hiểu thêm về CLB Hãy Nói →",
        sponsorship_haynoi_img_alt: "Hình ảnh CLB Hãy Nói",
        sponsorship_forms_heading: "Các Hình thức Tài trợ",
        sponsorship_form_financial: "Tài trợ Tài chính",
        sponsorship_form_financial_desc: "Đóng góp kinh phí trực tiếp cho các chương trình, dự án cụ thể hoặc quỹ hoạt động chung.",
        sponsorship_form_inkind: "Tài trợ Hiện vật",
        sponsorship_form_inkind_desc: "Hỗ trợ cơ sở vật chất, trang thiết bị, tài liệu học tập, quà tặng cho học viên...",
        sponsorship_form_expertise: "Tài trợ Chuyên môn",
        sponsorship_form_expertise_desc: "Chia sẻ kiến thức, kinh nghiệm thông qua các buổi nói chuyện, workshop; hỗ trợ cố vấn chuyên môn.",
        sponsorship_benefits_heading: "Quyền lợi Nhà Tài trợ",
        sponsorship_benefit1: "Lan tỏa hình ảnh thương hiệu nhân văn, có trách nhiệm với cộng đồng.",
        sponsorship_benefit2: "Tiếp cận mạng lưới đối tác, học viên và cộng đồng của IVS Education.",
        sponsorship_benefit3: "Quyền lợi truyền thông trên các kênh thông tin của IVS và chương trình.",
        sponsorship_benefit4: "Tham gia các sự kiện cộng đồng do IVS tổ chức.",
        sponsorship_benefit5: "Nhận báo cáo hoạt động và hiệu quả đóng góp định kỳ.",
        sponsorship_benefit6: "Các quyền lợi khác tùy theo mức độ và hình thức tài trợ (thỏa thuận cụ thể).",
        sponsorship_cta_heading: "Chung tay cùng IVS Kiến tạo Tương lai",
        sponsorship_cta_desc: "Mọi sự đóng góp, dù lớn hay nhỏ, đều vô cùng quý giá. Hãy liên hệ với chúng tôi để cùng thảo luận về cơ hội hợp tác và tài trợ cho các hoạt động vì cộng đồng.",
        sponsorship_contact_button: "Liên hệ Hợp tác Tài trợ",

        // Thêm các key khác từ các trang khác nếu cần...
    },
    en: {
        // Meta Tags
        page_title_index: "IVS JSC - Education, Technology, Health, International Cooperation",
        meta_description_index: "IVS JSC - A pioneering organization in Vietnam in education (IVS Academy, IVS Kindergarten), EdTech (IVS Celestech), public health, and international cooperation.",
        og_title_index: "IVS JSC - Education, Technology, Health, International Cooperation",
        og_description_index: "Discover comprehensive solutions in language training, STEAM, life skills, EdTech, healthcare, and partnership opportunities with IVS JSC.",
        page_title_default: "IVS Education",
        meta_description: "IVS Education - Education organization, educational technology (EdTech), international investment cooperation.",
        page_title_rnd: "Custom Learning Material Design - IVS Education",
        meta_description_rnd: "Customized design services for learning materials, curricula, and training programs from IVS Education.",
        page_title_sponsorship: "Community Sponsorship - IVS Education",
        meta_description_sponsorship: "Learn about IVS Education's community sponsorship programs and how you can partner with us to create sustainable value.",

        // Header v5
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
        menu_center_establishment: "Center Establishment", // Moved to Services in HTML
        menu_non_profit: "Non-profit Organization",
        menu_sponsorship: "Sponsorship",
        menu_services: "Services",
        menu_edu_consulting: "Education Consulting",
        menu_web_design: "Web Design",
        // menu_health_care: "Health Care", // Removed from Services menu
        menu_design_edu: "Curriculum Design", // Renamed from custom_curriculum
        menu_healths: "Health", // New menu
        menu_health_yensao: "Thanh Yen Bird's Nest", // New submenu item, CORRECT key
        menu_recruitment: "Recruitment",
        menu_recruitment_vn: "Domestic Recruitment",
        menu_recruitment_intl: "International Recruitment",
        menu_contact: "Contact",
        open_main_menu: "Open main menu",

        // Index Page v2 (Keep as is)
        index_hero_title: "Welcome to IVS JSC",
        index_hero_subtitle: "Shaping the future of education and health in Vietnam",
        learn_more: "Learn more",
        index_news_title: "News & Events",
        loading_news: "Loading news...",
        no_news: "No news yet.",
        news_title_na: "N/A",
        read_more: "Read more →",
        news_image_alt: "News image",
        news_load_error: "Could not load news.",
        index_about_title: "About Us",
        index_about_p1: "IVS JSC is a pioneering organization in education, educational technology (EdTech), public health, international cooperation, and business development in Vietnam.",
        index_about_p2: "We provide comprehensive solutions from language education, life skills, STEAM, to healthcare programs and modern technology applications.",
        view_details: "View details →",
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
        details_link: "Details...",
        index_video_title: "Introductory Video",
        index_video_iframe_title: "IVS JSC Introductory Video",

        // Footer
        footer_desc: "IVS Education - Pioneering education, technology, investment, and service commerce in Vietnam.",
        quick_links: "Quick Links",
        blog: "Blog",
        contact_us: "Contact Us",
        address: "No. 1104, Group 6, Dat Moi Hamlet, Long Phuoc Commune, Long Thanh District, Dong Nai Province, Vietnam, 76213.",
        copyright: "© 2025 IVS JSC. All rights reserved.",
        footer_sponsorship: "Community Sponsorship",

        // Trang rnd-curriculum.html (Keep as is)
        rnd_heading: "Custom Learning Material Design (R&D Curriculum)",
        rnd_intro_p1: "IVS Education provides research and development (R&D) services for programs, curricula, teaching and learning materials tailored to the specific requirements of each partner.",
        rnd_intro_p2: "With an experienced team of experts and a professional workflow, we are committed to delivering high-quality educational products that meet training objectives and suit the target learners.",
        rnd_services_heading: "Main categories:",
        rnd_service_item1: "Analysis of training needs and objectives.",
        rnd_service_item2: "Design of detailed program frameworks.",
        rnd_service_item3: "Compilation of textbook content and lectures.",
        rnd_service_item4: "Development of supplementary materials (videos, slides, interactive exercises...).",
        rnd_service_item5: "Design of testing and assessment systems.",
        rnd_service_item6: "Digitization of materials and integration into LMS platforms.",
        rnd_contact_cta: "Contact us for detailed consultation on curriculum design services.",

        // Trang tai-tro.html (Keep as is)
        sponsorship_heading: "Partner with IVS for the Community",
        sponsorship_intro_p1: "At IVS Education, we believe that education and community development are the foundation for a sustainable future. We are committed to social responsibility through meaningful sponsorship programs and non-profit activities.",
        sponsorship_intro_p2: "We cordially invite individuals, organizations, and businesses to join hands, partner, and sponsor IVS's community projects, spreading knowledge and creating positive values.",
        sponsorship_haynoi_heading: "Featured Program: Hay Noi Club",
        sponsorship_haynoi_desc1: "\"Hay Noi\" is a non-profit club initiated and operated by IVS Academy, exclusively for teenagers in Long Thanh, Dong Nai.",
        sponsorship_haynoi_desc2: "The club's main goal is to create a safe, dynamic environment for students to practice communication, public speaking, critical thinking, and teamwork skills – essential tools for the 21st century.",
        sponsorship_haynoi_desc3: "Your sponsorship will directly support the costs of organizing regular meetings, learning materials, inviting guest speakers, organizing competitions and events, helping the club sustain its activities and bring practical benefits to the local youth.",
        sponsorship_haynoi_link: "Learn more about Hay Noi Club →",
        sponsorship_haynoi_img_alt: "Hay Noi Club Image",
        sponsorship_forms_heading: "Forms of Sponsorship",
        sponsorship_form_financial: "Financial Sponsorship",
        sponsorship_form_financial_desc: "Direct financial contributions to specific programs, projects, or the general operating fund.",
        sponsorship_form_inkind: "In-Kind Sponsorship",
        sponsorship_form_inkind_desc: "Support with facilities, equipment, learning materials, gifts for participants...",
        sponsorship_form_expertise: "Expertise Sponsorship",
        sponsorship_form_expertise_desc: "Sharing knowledge and experience through talks, workshops; providing professional mentoring.",
        sponsorship_benefits_heading: "Sponsor Benefits",
        sponsorship_benefit1: "Enhance brand image as socially responsible and community-oriented.",
        sponsorship_benefit2: "Access IVS Education's network of partners, students, and the community.",
        sponsorship_benefit3: "Media exposure through IVS and program communication channels.",
        sponsorship_benefit4: "Participation in community events organized by IVS.",
        sponsorship_benefit5: "Receive regular reports on activities and contribution impact.",
        sponsorship_benefit6: "Other benefits depending on the level and form of sponsorship (specific agreement).",
        sponsorship_cta_heading: "Join IVS in Shaping the Future",
        sponsorship_cta_desc: "Every contribution, big or small, is invaluable. Please contact us to discuss partnership and sponsorship opportunities for community activities.",
        sponsorship_contact_button: "Contact for Sponsorship",

        // Add other keys from other pages if needed...
    }
};

// --- Phần còn lại của file language.js giữ nguyên như v4 ---

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
            let hasChildWithLangKey = false;
            if (element.children.length > 0) {
                 for(let child of element.children) {
                     // Kiểm tra xem phần tử con có phải là SVG không (không nên ghi đè SVG)
                     if (child.hasAttribute('data-lang-key') && child.tagName !== 'SVG') {
                         hasChildWithLangKey = true;
                         break;
                     }
                 }
            }

            // Chỉ cập nhật textContent nếu phần tử không phải là container cho các phần tử con có key riêng (trừ SVG)
            // Hoặc nếu nó là thẻ SPAN (thường dùng để chứa text đơn lẻ trong button/link)
            if (!hasChildWithLangKey || element.tagName === 'SPAN') {
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
            // Cập nhật title cho thẻ a và button (và các thẻ khác nếu cần)
            if ((element.tagName === 'A' || element.tagName === 'BUTTON') && element.hasAttribute('title')) {
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
             // Cập nhật thẻ meta description và title
             if (element.tagName === 'META' && element.getAttribute('name') === 'description') {
                  element.content = translation;
             }
             if (element.tagName === 'TITLE') {
                  element.textContent = translation;
             }
             // Cập nhật thẻ meta og:title, og:description
              if (element.tagName === 'META' && element.getAttribute('property') === 'og:title') {
                  element.content = translation;
              }
              if (element.tagName === 'META' && element.getAttribute('property') === 'og:description') {
                  element.content = translation;
              }
        }
    });

    // Cập nhật trạng thái active/disabled cho nút ngôn ngữ
    document.querySelectorAll('[id^="lang-vi-"], [id^="lang-en-"]').forEach(button => {
        if (!button) return; // Kiểm tra xem nút có tồn tại không
        if (button.getAttribute('data-lang') === lang) {
            button.classList.add('text-blue-700', 'font-bold');
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

// Hàm khởi tạo ngôn ngữ - SẼ ĐƯỢC GỌI BỞI script.js
function initializeLanguage() {
    // Kiểm tra cờ toàn cục để tránh chạy nhiều lần nếu script.js gọi lại
    if (window.languageInitialized) {
        console.warn("Language already initialized.");
        return;
    }
    console.log("Initializing language...");
    const preferredLanguage = localStorage.getItem('preferredLanguage') || 'vi';
    setLanguage(preferredLanguage); // Áp dụng ngôn ngữ ban đầu
    attachLanguageButtonListeners(); // Gắn listener cho nút chuyển đổi
    window.languageInitialized = true; // Đặt cờ báo đã khởi tạo
}

// Hàm riêng để gắn listeners
function attachLanguageButtonListeners() {
    console.log("Attaching language button listeners...");
    document.querySelectorAll('[id^="lang-vi-"], [id^="lang-en-"]').forEach(button => {
        if (!button) return;
        // Gỡ listener cũ trước khi thêm mới để tránh trùng lặp
        button.removeEventListener('click', handleLanguageChange);
        button.addEventListener('click', handleLanguageChange);
    });
    console.log("Language button listeners attached.");
}

// Hàm xử lý sự kiện click chung
function handleLanguageChange(event) {
    const button = event.currentTarget; // Lấy phần tử button được click
    if (button.disabled) return; // Không làm gì nếu nút đang bị vô hiệu hóa

    const lang = button.getAttribute('data-lang');
    console.log(`Language change requested to: ${lang}`);
    if (lang) {
        setLanguage(lang); // Áp dụng ngôn ngữ mới
        // Tùy chọn: Tải lại nội dung động nếu cần
        if (typeof loadNews === 'function' && document.getElementById('news-container')) {
             console.log("Reloading news for new language...");
             loadNews();
        }
    }
}

// Xóa bỏ việc tự khởi tạo trong DOMContentLoaded của language.js
// document.addEventListener('DOMContentLoaded', () => { ... });
