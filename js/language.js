// /js/language.js

// Đối tượng lưu trữ các bản dịch
// Đã cập nhật với keys từ trang rnd-curriculum.html v2
const translations = {
    vi: {
        // Meta Tags
        page_title_index: "IVS JSC - Giáo dục, Công nghệ, Sức khỏe, Hợp tác Quốc tế",
        meta_description_index: "IVS JSC - Tổ chức tiên phong tại Việt Nam trong lĩnh vực giáo dục (IVS Academy, IVS Kindergarten), EdTech (IVS Celestech), sức khỏe cộng đồng và hợp tác quốc tế.",
        og_title_index: "IVS JSC - Giáo dục, Công nghệ, Sức khỏe, Hợp tác Quốc tế",
        og_description_index: "Khám phá các giải pháp toàn diện về đào tạo ngoại ngữ, STEAM, kỹ năng sống, EdTech, chăm sóc sức khỏe và cơ hội hợp tác cùng IVS JSC.",
        page_title_default: "IVS Education",
        meta_description: "IVS Education - Tổ chức giáo dục, công nghệ giáo dục (EdTech), hợp tác đầu tư quốc tế.",
        // page_title_rnd: "Thiết kế Học liệu theo yêu cầu - IVS Education", // Key cũ
        // meta_description_rnd: "Dịch vụ thiết kế học liệu, giáo trình, chương trình đào tạo theo yêu cầu chuyên biệt từ IVS Education.", // Key cũ
        page_title_rnd: "Thiết kế Học liệu & Giải pháp EdTech - IVS Education", // Key mới
        meta_description_rnd_v2: "Dịch vụ R&D, thiết kế chương trình, học liệu, LMS và ứng dụng giáo dục theo yêu cầu chuyên biệt từ IVS Education & IVS Celestech.", // Key mới
        page_title_sponsorship: "Tài trợ Cộng đồng - IVS Education",
        meta_description_sponsorship: "Tìm hiểu về các chương trình tài trợ cộng đồng của IVS Education và cách bạn có thể đồng hành cùng chúng tôi kiến tạo giá trị bền vững.",

        // Header v5 (Giữ nguyên)
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
        menu_design_edu: "Thiết kế Học liệu",
        menu_healths: "Sức khỏe",
        menu_health_yensao: "Yến sào Thanh Yến",
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

        // Footer (Giữ nguyên)
        footer_desc: "IVS Education - Tiên phong giáo dục, công nghệ, đầu tư và thương mại dịch vụ tại Việt Nam.",
        quick_links: "Liên Kết Nhanh",
        blog: "Tin tức",
        contact_us: "Liên Hệ",
        address: "Số 1104, Tổ 6, Ấp Đất Mới, Xã Long Phước, Huyện Long Thành, Tỉnh Đồng Nai, Việt Nam, 76213.",
        copyright: "© 2025 IVS JSC. Đã đăng ký Bản quyền.",
        footer_sponsorship: "Tài trợ Cộng đồng",

        // Trang rnd-curriculum.html v2 (Keys mới)
        rnd_heading_v2: "Thiết kế Học liệu & Giải pháp EdTech theo yêu cầu",
        rnd_intro_p1_v2: "IVS Education, cùng với bộ phận công nghệ giáo dục IVS Celestech, cung cấp dịch vụ Nghiên cứu & Phát triển (R&D) toàn diện, từ việc xây dựng chương trình đào tạo, biên soạn học liệu đến thiết kế ứng dụng và Hệ thống quản lý học tập (LMS) chuyên biệt.",
        rnd_intro_p2_v2: "Với đội ngũ chuyên gia R&D Giáo trình do Ms. Salma Mahzoum dẫn dắt và các kỹ sư công nghệ tại IVS Celestech, chúng tôi kết hợp phương pháp sư phạm tiên tiến và công nghệ hiện đại để tạo ra các giải pháp giáo dục tối ưu, đáp ứng chính xác mục tiêu và phù hợp với đặc thù của từng đối tác, từ trường học, trung tâm đào tạo đến doanh nghiệp.",
        rnd_specific_services_heading_v2: "Các Dịch vụ Cụ thể",
        rnd_curriculum_design_subheading: "Thiết kế Học liệu & Chương trình Đào tạo",
        rnd_cd_desc: "Xây dựng lộ trình học tập và tài liệu giảng dạy chất lượng cao, bám sát mục tiêu và đối tượng người học.",
        rnd_cd_item1: "Phân tích chuyên sâu nhu cầu và mục tiêu đào tạo của đối tác.",
        rnd_cd_item2: "Thiết kế khung chương trình chi tiết, chuẩn đầu ra rõ ràng.",
        rnd_cd_item3: "Biên soạn nội dung giáo trình, bài giảng, kịch bản video/audio.",
        rnd_cd_item4: "Phát triển học liệu đa phương tiện: slide, infographic, video, bài tập tương tác.",
        rnd_cd_item5: "Xây dựng hệ thống kiểm tra, đánh giá năng lực người học đa dạng.",
        rnd_edtech_dev_subheading: "Phát triển Giải pháp Công nghệ Giáo dục (EdTech)",
        rnd_ed_desc: "Cung cấp các nền tảng và ứng dụng công nghệ hỗ trợ hiệu quả cho việc dạy và học, quản lý đào tạo.",
        rnd_ed_item1: "Thiết kế và phát triển Hệ thống Quản lý Học tập (LMS) tùy chỉnh.",
        rnd_ed_item2: "Xây dựng ứng dụng học tập di động (Mobile Learning Apps) đa nền tảng.",
        rnd_ed_item3: "Số hóa học liệu và tích hợp nội dung lên các nền tảng E-learning, LMS.",
        rnd_ed_item4: "Tư vấn và triển khai ứng dụng AI, VR/AR trong giáo dục (thông qua IVS Celestech).",
        rnd_ed_item5: "Giải pháp website chuyên biệt cho cơ sở giáo dục (trường học, trung tâm).",
        rnd_process_heading: "Quy trình Hợp tác Chuyên nghiệp",
        rnd_process_p1: "Chúng tôi làm việc chặt chẽ với đối tác qua các bước: Khảo sát & Phân tích -> Đề xuất Giải pháp -> Thiết kế & Phát triển -> Thử nghiệm & Phản hồi -> Triển khai & Đào tạo -> Bảo trì & Nâng cấp, đảm bảo sản phẩm cuối cùng đáp ứng đúng kỳ vọng.",
        rnd_benefits_heading: "Lợi ích cho Đối tác",
        rnd_benefit_item1: "Sản phẩm được \"may đo\" theo đúng nhu cầu đặc thù.",
        rnd_benefit_item2: "Chất lượng chuyên môn cao, cập nhật xu hướng mới nhất.",
        rnd_benefit_item3: "Tích hợp công nghệ hiện đại, nâng cao trải nghiệm học tập.",
        rnd_benefit_item4: "Tiết kiệm thời gian và nguồn lực tự phát triển.",
        rnd_benefit_item5: "Hỗ trợ kỹ thuật và đào tạo sử dụng hiệu quả.",
        rnd_cta_heading_v2: "Sẵn sàng Nâng tầm Chương trình Đào tạo của Bạn?",
        rnd_contact_cta_v2: "Hãy để đội ngũ chuyên gia của IVS Education và IVS Celestech giúp bạn xây dựng những học liệu và giải pháp công nghệ giáo dục đột phá. Liên hệ với chúng tôi ngay hôm nay!",

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
        // page_title_rnd: "Custom Learning Material Design - IVS Education", // Old key
        // meta_description_rnd: "Customized design services for learning materials, curricula, and training programs from IVS Education.", // Old key
        page_title_rnd: "Custom Curriculum & EdTech Solutions - IVS Education", // New key
        meta_description_rnd_v2: "R&D services, design of programs, learning materials, LMS, and educational applications tailored to specific needs by IVS Education & IVS Celestech.", // New key
        page_title_sponsorship: "Community Sponsorship - IVS Education",
        meta_description_sponsorship: "Learn about IVS Education's community sponsorship programs and how you can partner with us to create sustainable value.",

        // Header v5 (Keep as is)
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
        menu_design_edu: "Curriculum Design",
        menu_healths: "Health",
        menu_health_yensao: "Thanh Yen Bird's Nest",
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

        // Footer (Keep as is)
        footer_desc: "IVS Education - Pioneering education, technology, investment, and service commerce in Vietnam.",
        quick_links: "Quick Links",
        blog: "Blog",
        contact_us: "Contact Us",
        address: "No. 1104, Group 6, Dat Moi Hamlet, Long Phuoc Commune, Long Thanh District, Dong Nai Province, Vietnam, 76213.",
        copyright: "© 2025 IVS JSC. All rights reserved.",
        footer_sponsorship: "Community Sponsorship",

        // Trang rnd-curriculum.html v2 (New Keys)
        rnd_heading_v2: "Custom Curriculum & EdTech Solution Design",
        rnd_intro_p1_v2: "IVS Education, along with its EdTech division IVS Celestech, provides comprehensive Research & Development (R&D) services, from building training programs and compiling learning materials to designing specialized applications and Learning Management Systems (LMS).",
        rnd_intro_p2_v2: "With a team of curriculum R&D experts led by Ms. Salma Mahzoum and technology engineers at IVS Celestech, we combine advanced pedagogical methods and modern technology to create optimal educational solutions that precisely meet objectives and suit the specific characteristics of each partner, from schools and training centers to businesses.",
        rnd_specific_services_heading_v2: "Specific Services",
        rnd_curriculum_design_subheading: "Learning Material & Curriculum Design",
        rnd_cd_desc: "Building high-quality learning paths and teaching materials closely aligned with objectives and target learners.",
        rnd_cd_item1: "In-depth analysis of partner's training needs and goals.",
        rnd_cd_item2: "Design of detailed program frameworks with clear learning outcomes.",
        rnd_cd_item3: "Compilation of textbook content, lectures, video/audio scripts.",
        rnd_cd_item4: "Development of multimedia learning materials: slides, infographics, videos, interactive exercises.",
        rnd_cd_item5: "Construction of diverse learner competency assessment systems.",
        rnd_edtech_dev_subheading: "Educational Technology (EdTech) Solution Development",
        rnd_ed_desc: "Providing technology platforms and applications that effectively support teaching, learning, and training management.",
        rnd_ed_item1: "Design and development of customized Learning Management Systems (LMS).",
        rnd_ed_item2: "Building cross-platform Mobile Learning Apps.",
        rnd_ed_item3: "Digitization of learning materials and content integration into E-learning/LMS platforms.",
        rnd_ed_item4: "Consulting and implementation of AI, VR/AR applications in education (via IVS Celestech).",
        rnd_ed_item5: "Specialized website solutions for educational institutions (schools, centers).",
        rnd_process_heading: "Professional Collaboration Process",
        rnd_process_p1: "We work closely with partners through these steps: Survey & Analysis -> Solution Proposal -> Design & Development -> Testing & Feedback -> Deployment & Training -> Maintenance & Upgrade, ensuring the final product meets expectations.",
        rnd_benefits_heading: "Benefits for Partners",
        rnd_benefit_item1: "Product tailored precisely to specific needs.",
        rnd_benefit_item2: "High professional quality, updated with the latest trends.",
        rnd_benefit_item3: "Integration of modern technology, enhancing the learning experience.",
        rnd_benefit_item4: "Saves time and resources compared to in-house development.",
        rnd_benefit_item5: "Technical support and effective usage training provided.",
        rnd_cta_heading_v2: "Ready to Elevate Your Training Program?",
        rnd_contact_cta_v2: "Let the expert teams at IVS Education and IVS Celestech help you build groundbreaking learning materials and educational technology solutions. Contact us today!",


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

// --- Phần còn lại của file language.js giữ nguyên như v5 ---

// Hàm để đặt ngôn ngữ
function setLanguage(lang) {
    localStorage.setItem('preferredLanguage', lang);
    document.querySelectorAll('[data-lang-key]').forEach(element => {
        const key = element.getAttribute('data-lang-key');
        const translation = translations[lang]?.[key];
        if (translation !== undefined) {
            let hasChildWithLangKey = false;
            if (element.children.length > 0) {
                 for(let child of element.children) {
                     if (child.hasAttribute('data-lang-key') && child.tagName !== 'SVG') {
                         hasChildWithLangKey = true;
                         break;
                     }
                 }
            }
            if (!hasChildWithLangKey || element.tagName === 'SPAN') {
                 element.textContent = translation;
            }
            const placeholderKey = key + '_placeholder';
            const titleKey = key + '_title';
            const altKey = key + '_alt';
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                 const placeholderTranslation = translations[lang]?.[placeholderKey];
                 if (placeholderTranslation !== undefined) element.placeholder = placeholderTranslation;
            }
            if ((element.tagName === 'A' || element.tagName === 'BUTTON') && element.hasAttribute('title')) {
                 const titleTranslation = translations[lang]?.[titleKey];
                 if (titleTranslation !== undefined) element.title = titleTranslation;
            }
             if (element.tagName === 'IMG' && element.hasAttribute('alt')) {
                 const altTranslation = translations[lang]?.[altKey];
                 if (altTranslation !== undefined) element.alt = altTranslation;
             }
             if (element.tagName === 'META' && element.getAttribute('name') === 'description') {
                  element.content = translation;
             }
             if (element.tagName === 'TITLE') {
                  element.textContent = translation;
             }
              if (element.tagName === 'META' && element.getAttribute('property') === 'og:title') {
                  element.content = translation;
              }
              if (element.tagName === 'META' && element.getAttribute('property') === 'og:description') {
                  element.content = translation;
              }
        }
    });
    document.querySelectorAll('[id^="lang-vi-"], [id^="lang-en-"]').forEach(button => {
        if (!button) return;
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
    document.documentElement.lang = lang;
}

// Hàm khởi tạo ngôn ngữ - SẼ ĐƯỢC GỌI BỞI script.js
function initializeLanguage() {
    if (window.languageInitialized) {
        console.warn("Language already initialized.");
        return;
    }
    console.log("Initializing language...");
    const preferredLanguage = localStorage.getItem('preferredLanguage') || 'vi';
    setLanguage(preferredLanguage);
    attachLanguageButtonListeners();
    window.languageInitialized = true;
}

// Hàm riêng để gắn listeners
function attachLanguageButtonListeners() {
    console.log("Attaching language button listeners...");
    document.querySelectorAll('[id^="lang-vi-"], [id^="lang-en-"]').forEach(button => {
        if (!button) return;
        button.removeEventListener('click', handleLanguageChange);
        button.addEventListener('click', handleLanguageChange);
    });
    console.log("Language button listeners attached.");
}

// Hàm xử lý sự kiện click chung
function handleLanguageChange(event) {
    const button = event.currentTarget;
    if (button.disabled) return;
    const lang = button.getAttribute('data-lang');
    console.log(`Language change requested to: ${lang}`);
    if (lang) {
        setLanguage(lang);
        if (typeof loadNews === 'function' && document.getElementById('news-container')) {
             console.log("Reloading news for new language...");
             loadNews();
        }
    }
}

// Xóa bỏ việc tự khởi tạo trong DOMContentLoaded của language.js
