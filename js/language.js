// /js/language.js

// Đối tượng lưu trữ các bản dịch
const translations = {
    vi: {
        // Meta Tags (About Page - Thêm mới)
        about_page_title: "Về Chúng Tôi - IVS JSC",
        about_meta_description: "Tìm hiểu về IVS JSC - Công ty Cổ phần Dịch vụ Thương mại Integrate Vision Synergy, sứ mệnh, tầm nhìn, giá trị cốt lõi, đội ngũ lãnh đạo và các lĩnh vực hoạt động.",
        about_og_title: "Về Chúng Tôi - IVS JSC",
        about_og_description: "Khám phá IVS JSC: Kết nối giáo dục Việt Nam với công nghệ tiên tiến và chuẩn quốc tế.",

        // Meta Tags (Các trang khác - giữ nguyên từ file gốc)
        page_title_index: "IVS JSC - Giáo dục, Công nghệ, Sức khỏe, Hợp tác Quốc tế",
        meta_description_index: "IVS JSC - Tổ chức tiên phong tại Việt Nam trong lĩnh vực giáo dục (IVS Academy, IVS Kindergarten), EdTech (IVS Celestech), sức khỏe cộng đồng và hợp tác quốc tế.",
        og_title_index: "IVS JSC - Giáo dục, Công nghệ, Sức khỏe, Hợp tác Quốc tế",
        og_description_index: "Khám phá các giải pháp toàn diện về đào tạo ngoại ngữ, STEAM, kỹ năng sống, EdTech, chăm sóc sức khỏe và cơ hội hợp tác cùng IVS JSC.",
        page_title_default: "IVS Education",
        meta_description: "IVS Education - Tổ chức giáo dục, công nghệ giáo dục (EdTech), hợp tác đầu tư quốc tế.",
        page_title_rnd: "Thiết kế Học liệu & Giải pháp EdTech - IVS Education",
        meta_description_rnd_v2: "Dịch vụ R&D, thiết kế chương trình, học liệu, LMS và ứng dụng giáo dục theo yêu cầu chuyên biệt từ IVS Education & IVS Celestech.",
        page_title_sponsorship: "Tài trợ Cộng đồng - IVS Education",
        meta_description_sponsorship: "Tìm hiểu về các chương trình tài trợ cộng đồng của IVS Education và cách bạn có thể đồng hành cùng chúng tôi kiến tạo giá trị bền vững.",
        page_title_celestech: "IVS Celestech - Giải pháp Công nghệ Giáo dục Toàn diện",
        meta_description_celestech: "IVS Celestech cung cấp giải pháp EdTech từ tư vấn, thi công nội thất giáo dục, thiết bị thông minh (màn hình tương tác, VR, AI) đến hệ thống quản lý LMS.",
        page_title_placement: "Kiểm tra Năng lực Tiếng Anh - IVS Education",
        meta_description_placement: "Thực hiện bài kiểm tra năng lực tiếng Anh trực tuyến theo chuẩn Cambridge (6 bậc CEFR) để xác định trình độ và lựa chọn khóa học phù hợp tại IVS Education.",
        og_title_placement: "Kiểm tra Năng lực Tiếng Anh - IVS Education",
        og_description_placement: "Đánh giá chính xác trình độ tiếng Anh của bạn với bài test online miễn phí từ IVS Education.",
        og_image_placement: "https://placehold.co/1200x630/3b82f6/ffffff?text=English+Placement+Test",
        page_title_establishment: "Dịch vụ Thành lập Trung tâm Ngoại ngữ - Tin học - Kỹ năng sống | IVS Education", // Title trang Thành lập TT
        meta_description_establishment: "IVS Education cung cấp dịch vụ tư vấn và hỗ trợ trọn gói thủ tục thành lập trung tâm ngoại ngữ, tin học, kỹ năng sống theo đúng quy định pháp luật.", // Description trang Thành lập TT
        og_title_establishment: "Dịch vụ Thành lập Trung tâm Ngoại ngữ - Tin học - Kỹ năng sống | IVS Education",
        og_description_establishment: "Hỗ trợ từ A-Z: Tư vấn điều kiện, chuẩn bị hồ sơ, soạn thảo đề án, làm việc với cơ quan chức năng.",
        og_image_establishment: "https://placehold.co/1200x630/3b82f6/ffffff?text=Thành+Lập+Trung+Tâm+IVS",
        page_title_webdesign: "Dịch vụ Thiết kế Website Chuyên nghiệp - IVS Tech Solutions",
        meta_description_webdesign: "IVS JSC (IVS Tech Solutions) cung cấp dịch vụ thiết kế website chuyên nghiệp, chuẩn SEO, responsive, tối ưu cho doanh nghiệp và giáo dục.",
        og_title_webdesign: "Dịch vụ Thiết kế Website Chuyên nghiệp - IVS Tech Solutions",
        og_description_webdesign: "IVS JSC cung cấp dịch vụ thiết kế website chuyên nghiệp, chuẩn SEO, responsive, tối ưu cho doanh nghiệp và giáo dục.",

        // Header v6 (Giữ nguyên)
        logo_alt: "Logo IVS JSC",
        menu_home: "Trang chủ",
        menu_about: "Giới thiệu",
        menu_about_ivs: "Về IVS JSC",
        menu_mission_vision: "Sứ mệnh & Tầm nhìn",
        menu_ivs_meaning: "Ý nghĩa IVS",
        menu_celestech: "IVS Celestech (EdTech)",
        menu_team: "Đội ngũ",
        menu_partners: "Đối tác",
        menu_training: "Đào tạo",
        menu_placement_test: "Kiểm tra trình độ",
        menu_summer_camp: "Trại hè Quốc tế",
        menu_scholarships: "Học bổng",
        menu_hay_noi_club: "CLB Hãy Nói", // Sửa lại key cho phù hợp
        menu_cooperation: "Hợp tác",
        menu_international_link: "Liên kết Quốc tế",
        menu_iivsa_alliance: "Liên minh IIVSA",
        menu_educational_link: "Liên kết giáo dục", // Key mới
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
        menu_health_luvyoga: "LuvYoga Lộc Hòa - Trảng Bom",
        menu_recruitment: "Tuyển dụng",
        menu_recruitment_vn: "Tuyển dụng nội địa",
        menu_recruitment_intl: "Tuyển dụng quốc tế",
        menu_contact: "Liên hệ",
        open_main_menu: "Mở menu chính",
        menu_training_center: "Tại trung tâm",
        menu_training_language: "Đào tạo ngoại ngữ",
        menu_training_lifeskills: "Đào tạo kỹ năng sống",
        menu_training_teacher: "Đào tạo giáo viên",
        menu_training_teacher_vn: "Giáo viên VN",
        menu_training_teacher_foreign: "Giáo viên nước ngoài",
        menu_training_teacher_cert: "Bổ sung chứng chỉ NVSP",
        menu_library: "Thư viện",
        menu_library_docs: "Tài liệu giáo dục",
        menu_library_media: "IVSMedia",

        // Index Page v2 (Giữ nguyên)
        index_hero_title: "Chào mừng đến với IVS JSC",
        index_hero_subtitle: "Kiến tạo tương lai giáo dục và sức khỏe Việt Nam",
        learn_more: "Tìm hiểu thêm",
        index_news_title: "Tin Tức & Sự Kiện",
        loading_news: "Đang tải tin tức...",
        no_news: "Chưa có tin tức nào.",
        news_load_error: "Không thể tải tin tức.",
        news_title_na: "Tiêu đề không có sẵn",
        news_image_alt: "Hình ảnh tin tức",
        read_more: "Đọc thêm →",
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

        // About Page Content (Thêm mới)
        about_heading: "Về Chúng Tôi",
        about_intro_heading: "Giới thiệu IVS JSC",
        about_intro_p1_strong: "Công ty Cổ phần Dịch vụ Thương mại Integrate Vision Synergy (IVS JSC)",
        about_intro_p1_text: " được thành lập với sứ mệnh kết nối và nâng tầm giáo dục Việt Nam thông qua việc tích hợp các giải pháp công nghệ tiên tiến và chương trình đào tạo chuẩn quốc tế. Chúng tôi tự hào là thành viên chính thức của ",
        about_intro_p1_link: "Liên minh giáo dục toàn cầu IIVSA",
        about_intro_p1_end: ", khẳng định cam kết về chất lượng và hợp tác quốc tế.",
        about_intro_p2: "Với trụ sở chính tại Đồng Nai và mạng lưới hoạt động rộng khắp, IVS JSC tập trung vào các lĩnh vực cốt lõi bao gồm đào tạo STEAM, ngoại ngữ, kỹ năng mềm và tư vấn giáo dục toàn diện, hướng đến sự phát triển bền vững cho thế hệ tương lai.",
        about_vision_title: "Tầm Nhìn",
        about_vision_desc: "Trở thành tổ chức giáo dục hàng đầu, tiên phong trong việc ứng dụng công nghệ và đổi mới sáng tạo để kiến tạo tương lai giáo dục Việt Nam hội nhập quốc tế.",
        about_mission_title: "Sứ Mệnh",
        about_mission_desc: "Cung cấp các giải pháp giáo dục toàn diện, chất lượng cao, giúp người học phát huy tối đa tiềm năng, tự tin hội nhập và đóng góp cho cộng đồng.",
        about_values_title: "Giá Trị Cốt Lõi",
        about_values_strong: "Chất lượng – Tận tâm – Sáng tạo – Bình đẳng.",
        about_values_desc: " Chúng tôi cam kết mang đến dịch vụ giáo dục tốt nhất với sự tận tụy, không ngừng đổi mới và đảm bảo cơ hội học tập công bằng cho mọi người.",
        about_leadership_heading: "Đội Ngũ Lãnh Đạo",
        about_leadership_img_alt: "Nguyễn Minh Triết - CEO",
        about_leadership_name: "Ông Nguyễn Minh Triết",
        about_leadership_title: "Tổng Giám đốc (CEO) kiêm Chủ tịch HĐQT",
        about_leadership_desc: "Với nền tảng vững chắc về Ngôn ngữ Anh, Quản trị Kinh doanh (MBA - ĐH FPT) và kinh nghiệm quản lý giáo dục, ông Triết dẫn dắt IVS JSC bằng tầm nhìn chiến lược và tâm huyết với sự nghiệp giáo dục. Ông có kinh nghiệm làm việc tại các tổ chức uy tín như VietJet Air, The Grand Ho Tram Strip và AMG Education.",
        about_leadership_link: "Xem thêm thông tin",
        about_areas_heading: "Lĩnh Vực Hoạt Động Chính",
        about_area1_strong: "IVS Academy:",
        about_area1_desc: " Trung tâm đào tạo ngôn ngữ (Anh, Nhật, Hàn, Trung) và kỹ năng mềm, kỹ năng sống.",
        about_area2_strong: "IVS Education:",
        about_area2_desc: " Phát triển chương trình STEAM, giải pháp học tập số, và tư vấn xây dựng trường học/trung tâm theo chuẩn quốc tế.",
        about_area3_strong: "Liên kết Quốc tế:",
        about_area3_desc: " Hợp tác với các đối tác giáo dục toàn cầu (ví dụ: The Power to Inspire - Mỹ, Dự án Kinderlink25) để mang chương trình và phương pháp tiên tiến về Việt Nam.",
        about_area4_strong: "Nghiên cứu & Phát triển (R&D):",
        about_area4_desc: " Không ngừng nghiên cứu và phát triển các chương trình giáo dục mới, phù hợp với xu thế và nhu cầu thực tiễn.",
        about_partners_heading: "Đối Tác và Liên Kết Tiêu Biểu",
        about_partner1: "Liên minh giáo dục toàn cầu IIVSA (Thành viên chính thức)",
        about_partner2: "The Power to Inspire (Hoa Kỳ) - Đối tác chiến lược",
        about_partner3: "Dự án Kinderlink25 - Hợp tác phát triển chương trình mầm non",
        about_partner4: "Các trường học, trung tâm đào tạo và tổ chức giáo dục trong và ngoài nước.",
        about_partners_p: "Chúng tôi tin rằng sự hợp tác chặt chẽ sẽ tạo nên sức mạnh tổng hợp, thúc đẩy sự phát triển của giáo dục.",

        // Footer (Cập nhật với Zalo và Email)
        footer_company_name: "IVS JSC",
        footer_rights: "Bản quyền thuộc về IVS JSC.",
        footer_contact_us: "Liên hệ chúng tôi",
        footer_address: "Số 1104, Tổ 6, Ấp Đất Mới, Xã Long Phước, Huyện Long Thành, Tỉnh Đồng Nai, Việt Nam, 76213.",
        footer_quick_links: "Liên kết nhanh",
        footer_follow_us: "Theo dõi chúng tôi",
        footer_desc: "IVS JSC - CÔNG TY CP DỊCH VỤ THƯƠNG MẠI INTEGRATE VISION SYNERGY - MST: 3603960189",
        quick_links: "Liên Kết Nhanh",
        about_ivs: "Về IVS",
        services: "Dịch Vụ",
        careers: "Tuyển Dụng",
        contact: "Liên Hệ",
        blog: "Tin tức",
        contact_us: "Liên Hệ",
        address: "Số 1104, Tổ 6, Ấp Đất Mới, Xã Long Phước, Huyện Long Thành, Tỉnh Đồng Nai, Việt Nam, 76213.",
        copyright: "© 2025 IVS JSC. Đã đăng ký Bản quyền số: 6207/2024/QTG.",
        footer_ivs_academy_title: "IVS Academy",
        footer_ivs_mastery_title: "IVS Mastery",
        footer_enable_js: "Vui lòng bật JavaScript để xem nội dung Facebook.",
        footer_visit_page_academy: "Truy cập Fanpage IVS Academy",
        footer_visit_page_mastery: "Truy cập Fanpage IVS Mastery",
        footer_message_academy_sr: "Nhắn tin Facebook cho IVS Academy",
        footer_message_mastery_sr: "Nhắn tin Facebook cho IVS Mastery",
        footer_email_link: "ivsacademy.edu@gmail.com", // Key mới cho email link text
        footer_zalo_link: "Nguyễn Minh Triết (IVS)", // Key mới cho Zalo link text
        footer_map_title: "Bản đồ", // Key mới cho tiêu đề bản đồ

        // Trang rnd-curriculum.html v2 (Giữ nguyên)
        rnd_hero_title: "Thiết kế Học liệu & Giải pháp EdTech theo Yêu cầu",
        rnd_hero_subtitle: "Từ IVS Education & IVS Celestech - Biến ý tưởng giáo dục thành hiện thực",
        rnd_intro_heading: "Bạn cần giải pháp giáo dục độc đáo và hiệu quả?",
        rnd_intro_p1: "Trong bối cảnh giáo dục không ngừng thay đổi, việc sở hữu chương trình đào tạo, học liệu và công cụ công nghệ phù hợp là yếu tố then chốt để tạo nên sự khác biệt và nâng cao chất lượng dạy học. IVS Education và IVS Celestech cung cấp dịch vụ Nghiên cứu & Phát triển (R&D) toàn diện, đáp ứng mọi nhu cầu chuyên biệt của bạn.",
        rnd_intro_p2: "Chúng tôi kết hợp chuyên môn sư phạm sâu sắc với năng lực công nghệ tiên tiến để tạo ra các sản phẩm giáo dục chất lượng cao, từ nội dung học thuật đến nền tảng kỹ thuật số.",
        rnd_intro_img_alt: "Quy trình thiết kế học liệu và giải pháp EdTech",
        rnd_services_heading: "Dịch vụ R&D Giáo dục của chúng tôi",
        rnd_service1_title: "Thiết kế Chương trình & Khung năng lực",
        rnd_service1_desc: "Xây dựng chương trình đào tạo (Ngoại ngữ, Tin học, Kỹ năng sống, STEAM...) theo chuẩn đầu ra, phù hợp với mục tiêu và đối tượng cụ thể. Thiết kế khung năng lực chi tiết.",
        rnd_service2_title: "Phát triển Học liệu Đa dạng",
        rnd_service2_desc: "Biên soạn sách giáo trình, sách bài tập, giáo án điện tử, bài giảng tương tác, video bài học, ngân hàng câu hỏi, trò chơi học tập... đảm bảo tính sư phạm và hấp dẫn.",
        rnd_service3_title: "Xây dựng Hệ thống E-learning & LMS",
        rnd_service3_desc: "Tư vấn và triển khai Hệ thống Quản lý Học tập (LMS) tùy chỉnh hoặc dựa trên nền tảng mã nguồn mở. Phát triển các khóa học trực tuyến (E-learning) hoàn chỉnh.",
        rnd_service4_title: "Phát triển Ứng dụng Giáo dục",
        rnd_service4_desc: "Thiết kế và lập trình ứng dụng di động (mobile app), ứng dụng web hỗ trợ học tập, kiểm tra, đánh giá, quản lý lớp học...",
        rnd_service5_title: "Tích hợp Công nghệ AI, VR/AR",
        rnd_service5_desc: "Nghiên cứu và ứng dụng Trí tuệ Nhân tạo (AI), Thực tế ảo (VR), Thực tế tăng cường (AR) vào học liệu và hoạt động giảng dạy để tăng cường trải nghiệm và hiệu quả.",
        rnd_service6_title: "Tư vấn Giải pháp EdTech Tổng thể",
        rnd_service6_desc: "Đánh giá nhu cầu, tư vấn lựa chọn và triển khai các giải pháp công nghệ giáo dục phù hợp với chiến lược và ngân sách của tổ chức.",
        rnd_process_heading: "Quy trình Hợp tác R&D Chuyên nghiệp",
        rnd_step1_title: "Tiếp nhận Yêu cầu & Phân tích",
        rnd_step1_desc: "Thảo luận chi tiết về mục tiêu, đối tượng, phạm vi, yêu cầu kỹ thuật và ngân sách dự kiến.",
        rnd_step2_title: "Đề xuất Giải pháp & Kế hoạch",
        rnd_step2_desc: "Trình bày giải pháp R&D, kế hoạch thực hiện chi tiết, báo giá và các điều khoản hợp tác.",
        rnd_step3_title: "Thiết kế & Phát triển (Prototype)",
        rnd_step3_desc: "Tiến hành nghiên cứu, thiết kế khung chương trình/học liệu/tính năng. Phát triển bản mẫu (prototype) để lấy phản hồi.",
        rnd_step4_title: "Hoàn thiện & Tinh chỉnh",
        rnd_step4_desc: "Dựa trên phản hồi, tiến hành hoàn thiện sản phẩm, đảm bảo chất lượng và đáp ứng đúng yêu cầu.",
        rnd_step5_title: "Kiểm thử & Đánh giá",
        rnd_step5_desc: "Thực hiện kiểm thử nội bộ và/hoặc với người dùng cuối để đảm bảo tính ổn định, hiệu quả và dễ sử dụng.",
        rnd_step6_title: "Bàn giao & Hỗ trợ",
        rnd_step6_desc: "Bàn giao sản phẩm hoàn chỉnh, tài liệu hướng dẫn. Cung cấp dịch vụ hỗ trợ kỹ thuật, đào tạo (nếu cần) và bảo trì.",
        rnd_why_heading: "Tại sao chọn IVS cho Dự án R&D Giáo dục?",
        rnd_why_item1: "**Đội ngũ chuyên gia:** Kết hợp chuyên gia sư phạm, nhà thiết kế đồ họa, lập trình viên và chuyên gia công nghệ giàu kinh nghiệm.",
        rnd_why_item2: "**Quy trình bài bản:** Áp dụng quy trình R&D chặt chẽ, đảm bảo tiến độ và chất lượng dự án.",
        rnd_why_item3: "**Công nghệ cập nhật:** Luôn tìm tòi và ứng dụng các phương pháp, công nghệ giáo dục mới nhất.",
        rnd_why_item4: "**Giải pháp tùy chỉnh:** Thiết kế giải pháp độc đáo, phù hợp chính xác với nhu cầu và thương hiệu của bạn.",
        rnd_why_item5: "**Bảo mật thông tin:** Cam kết bảo mật tuyệt đối các ý tưởng và thông tin dự án của khách hàng.",
        rnd_why_item6: "**Chi phí hợp lý:** Cung cấp giải pháp chất lượng cao với mức chi phí cạnh tranh.",
        rnd_cta_heading: "Sẵn sàng Đổi mới Giáo dục cùng IVS?",
        rnd_cta_desc: "Hãy chia sẻ ý tưởng hoặc yêu cầu của bạn với chúng tôi. Đội ngũ IVS Education & IVS Celestech luôn sẵn sàng lắng nghe và đồng hành cùng bạn kiến tạo những giải pháp giáo dục đột phá.",
        rnd_cta_button: "Liên hệ Tư vấn R&D",

        // Trang tai-tro.html (Giữ nguyên)
        sponsorship_hero_title: "Tài trợ Cộng đồng - Đồng hành cùng IVS Kiến tạo Giá trị",
        sponsorship_hero_subtitle: "Chung tay vì một thế hệ tương lai được trang bị đầy đủ tri thức và kỹ năng",
        sponsorship_intro_heading: "Tại sao nên Đồng hành Tài trợ cùng IVS Education?",
        sponsorship_intro_p1: "Tại IVS Education, chúng tôi tin rằng giáo dục là nền tảng cho sự phát triển bền vững của mỗi cá nhân và toàn xã hội. Bên cạnh các hoạt động kinh doanh cốt lõi, chúng tôi luôn nỗ lực triển khai các dự án cộng đồng ý nghĩa, đặc biệt là trong lĩnh vực giáo dục và phát triển kỹ năng cho thế hệ trẻ.",
        sponsorship_intro_p2: "Sự đồng hành và tài trợ từ các cá nhân, tổ chức, doanh nghiệp là nguồn động lực quý báu giúp IVS mở rộng quy mô và nâng cao hiệu quả của các chương trình này, mang lại lợi ích thiết thực cho cộng đồng.",
        sponsorship_intro_img_alt: "Hoạt động cộng đồng của IVS Education",
        sponsorship_programs_heading: "Các Chương trình Ưu tiên Nhận Tài trợ",
        sponsorship_program1_title: "Câu lạc bộ \"Hãy Nói\" (Dự án Phi lợi nhuận)",
        sponsorship_program1_desc: "Tạo sân chơi miễn phí cho thanh thiếu niên Long Thành, Đồng Nai rèn luyện kỹ năng giao tiếp, thuyết trình, tư duy phản biện bằng Tiếng Anh. Tài trợ giúp duy trì hoạt động, tổ chức sự kiện, mời chuyên gia, phần thưởng...",
        sponsorship_program1_link: "Tìm hiểu về CLB Hãy Nói",
        sponsorship_program2_title: "Học bổng IVS Future Leaders",
        sponsorship_program2_desc: "Trao cơ hội học tập ngoại ngữ, kỹ năng, STEAM cho các học sinh, sinh viên có hoàn cảnh khó khăn nhưng giàu nghị lực và có thành tích tốt. Tài trợ trực tiếp vào quỹ học bổng.",
        sponsorship_program2_link: "Xem thông tin Học bổng",
        sponsorship_program3_title: "Dự án Thư viện Cộng đồng & Sách hóa Nông thôn",
        sponsorship_program3_desc: "Xây dựng các tủ sách, thư viện nhỏ tại các khu vực còn hạn chế điều kiện tiếp cận sách báo, tri thức. Tài trợ sách, trang thiết bị, chi phí vận hành.",
        sponsorship_program4_title: "Các Sự kiện Giáo dục Cộng đồng Khác",
        sponsorship_program4_desc: "Tổ chức các buổi workshop, seminar, ngày hội STEAM, cuộc thi học thuật... miễn phí hoặc chi phí thấp cho cộng đồng. Tài trợ địa điểm, chuyên gia, quà tặng, truyền thông...",
        sponsorship_benefits_heading: "Quyền lợi của Nhà Tài trợ",
        sponsorship_benefit1: "**Lan tỏa giá trị:** Góp phần trực tiếp vào sự phát triển giáo dục và cộng đồng.",
        sponsorship_benefit2: "**Nâng cao hình ảnh:** Khẳng định trách nhiệm xã hội (CSR) của doanh nghiệp/tổ chức.",
        sponsorship_benefit3: "**Quyền lợi truyền thông:** Logo, tên nhà tài trợ xuất hiện trên các ấn phẩm, sự kiện, website của chương trình (tùy theo mức tài trợ).",
        sponsorship_benefit4: "**Kết nối mạng lưới:** Cơ hội giao lưu, kết nối với các đối tác, thành viên khác trong hệ sinh thái của IVS.",
        sponsorship_benefit5: "**Minh bạch tài chính:** Cam kết sử dụng nguồn tài trợ đúng mục đích, báo cáo rõ ràng, minh bạch.",
        sponsorship_how_to_heading: "Cách thức Tài trợ",
        sponsorship_how_to_p1: "IVS Education hoan nghênh mọi hình thức đóng góp và tài trợ:",
        sponsorship_how_to_item1: "**Tài trợ tài chính:** Chuyển khoản trực tiếp vào quỹ dự án.",
        sponsorship_how_to_item2: "**Tài trợ hiện vật:** Sách vở, trang thiết bị học tập, văn phòng phẩm, quà tặng...",
        sponsorship_how_to_item3: "**Tài trợ dịch vụ:** Địa điểm tổ chức sự kiện, in ấn, thiết kế, truyền thông...",
        sponsorship_how_to_item4: "**Tài trợ chuyên môn:** Chia sẻ kiến thức, kỹ năng từ các chuyên gia.",
        sponsorship_how_to_p2: "Vui lòng liên hệ trực tiếp với chúng tôi qua email hoặc điện thoại để trao đổi chi tiết về nhu cầu tài trợ và các phương án hợp tác phù hợp.",
        sponsorship_cta_heading: "Hãy cùng IVS Chắp cánh Ước mơ Giáo dục!",
        sponsorship_cta_desc: "Mỗi đóng góp, dù lớn hay nhỏ, đều mang ý nghĩa to lớn trong việc kiến tạo một tương lai tươi sáng hơn cho thế hệ trẻ Việt Nam. IVS Education trân trọng mọi sự quan tâm và đồng hành của quý vị.",
        sponsorship_cta_button: "Liên hệ Tài trợ Ngay",

        // Trang ivscelestech.html (Giữ nguyên)
        celestech_hero_title: "IVS Celestech - Giải pháp Công nghệ Giáo dục Toàn diện",
        celestech_hero_subtitle: "Kiến tạo môi trường học tập Thông minh - Sáng tạo - Hiệu quả",
        celestech_intro_heading: "IVS Celestech: Tiên phong Ứng dụng Công nghệ vào Giáo dục",
        celestech_intro_p1: "Là bộ phận công nghệ giáo dục (EdTech) chiến lược của IVS JSC, IVS Celestech tập trung nghiên cứu, phát triển và cung cấp các giải pháp công nghệ tiên tiến, giúp tối ưu hóa quy trình quản lý, nâng cao chất lượng giảng dạy và tạo ra trải nghiệm học tập hấp dẫn, hiệu quả cho người học mọi lứa tuổi.",
        celestech_intro_p2: "Chúng tôi không chỉ cung cấp sản phẩm, mà còn mang đến giải pháp tổng thể, từ tư vấn, thiết kế, thi công đến triển khai và hỗ trợ vận hành.",
        celestech_intro_img_alt: "Công nghệ giáo dục IVS Celestech",
        celestech_solutions_heading: "Giải pháp và Dịch vụ Nổi bật",
        celestech_solution1_title: "Tư vấn & Thiết kế Không gian Học tập Thông minh",
        celestech_solution1_desc: "Khảo sát nhu cầu, tư vấn mô hình lớp học/trung tâm hiện đại. Thiết kế không gian học tập tối ưu, tích hợp công nghệ (ánh sáng, âm thanh, thiết bị tương tác). Thi công nội thất giáo dục chuyên nghiệp.",
        celestech_solution2_title: "Cung cấp Thiết bị Giáo dục Hiện đại",
        celestech_solution2_desc: "Màn hình tương tác thông minh (Interactive Flat Panels), máy chiếu, hệ thống âm thanh lớp học, thiết bị thực tế ảo (VR), thực tế tăng cường (AR), robot giáo dục, thiết bị STEAM...",
        celestech_solution3_title: "Hệ thống Quản lý Học tập (LMS)",
        celestech_solution3_desc: "Triển khai và tùy chỉnh các nền tảng LMS hàng đầu (Moodle, Canvas...) hoặc xây dựng LMS theo yêu cầu riêng. Tích hợp các công cụ quản lý khóa học, học viên, học liệu, đánh giá.",
        celestech_solution4_title: "Phát triển Nội dung Số & E-learning",
        celestech_solution4_desc: "Số hóa học liệu, xây dựng các khóa học E-learning tương tác cao, sản xuất video bài giảng, mô phỏng 3D, ứng dụng học tập (web/mobile app).",
        celestech_solution5_title: "Giải pháp AI trong Giáo dục",
        celestech_solution5_desc: "Nghiên cứu và ứng dụng AI để cá nhân hóa lộ trình học tập, trợ lý ảo hỗ trợ học viên, phân tích dữ liệu học tập, tự động hóa chấm điểm và phản hồi.",
        celestech_solution6_title: "Đào tạo & Chuyển giao Công nghệ",
        celestech_solution6_desc: "Tổ chức các khóa tập huấn, workshop về ứng dụng công nghệ trong giảng dạy cho giáo viên và nhà quản lý giáo dục. Hỗ trợ kỹ thuật và chuyển giao công nghệ hiệu quả.",
        celestech_why_heading: "Lợi ích khi Hợp tác cùng IVS Celestech",
        celestech_why_item1: "**Giải pháp toàn diện:** Từ phần cứng, phần mềm đến nội dung và đào tạo.",
        celestech_why_item2: "**Công nghệ tiên tiến:** Luôn cập nhật và ứng dụng các xu hướng EdTech mới nhất.",
        celestech_why_item3: "**Kinh nghiệm thực tiễn:** Thấu hiểu nhu cầu và thách thức của môi trường giáo dục Việt Nam.",
        celestech_why_item4: "**Đội ngũ chuyên gia:** Kỹ sư công nghệ, chuyên gia giáo dục, nhà thiết kế tâm huyết.",
        celestech_why_item5: "**Hỗ trợ chuyên nghiệp:** Dịch vụ tư vấn, triển khai và hậu mãi tận tâm.",
        celestech_cta_heading: "Nâng tầm Giáo dục với Công nghệ?",
        celestech_cta_desc: "Hãy để IVS Celestech đồng hành cùng bạn trên hành trình chuyển đổi số giáo dục. Liên hệ với chúng tôi ngay hôm nay để khám phá các giải pháp phù hợp nhất!",
        celestech_cta_button: "Yêu cầu Tư vấn Giải pháp",

        // Trang english-placement.html (Giữ nguyên)
        placement_hero_title: "Kiểm tra Năng lực Tiếng Anh Trực tuyến",
        placement_hero_subtitle: "Đánh giá trình độ nhanh chóng theo chuẩn CEFR - Miễn phí!",
        placement_intro_heading: "Xác định trình độ - Chọn đúng lộ trình",
        placement_intro_p1: "Bạn muốn biết trình độ tiếng Anh hiện tại của mình đang ở đâu? Bài kiểm tra năng lực Tiếng Anh (English Placement Test) của IVS Education được thiết kế khoa học, bám sát Khung tham chiếu trình độ ngôn ngữ chung Châu Âu (CEFR), giúp bạn đánh giá chính xác khả năng Nghe - Đọc - Ngữ pháp.",
        placement_intro_p2: "Kết quả bài kiểm tra sẽ là cơ sở quan trọng để bạn lựa chọn khóa học phù hợp nhất với mục tiêu và năng lực của bản thân tại IVS Academy.",
        placement_intro_img_alt: "Bài kiểm tra năng lực tiếng Anh online",
        placement_how_it_works_heading: "Bài kiểm tra hoạt động như thế nào?",
        placement_step1_title: "Đăng ký (Tùy chọn)",
        placement_step1_desc: "Bạn có thể làm bài kiểm tra ngay lập tức hoặc đăng ký tài khoản để lưu kết quả và nhận tư vấn chi tiết.",
        placement_step2_title: "Làm bài kiểm tra",
        placement_step2_desc: "Bài thi gồm các phần trắc nghiệm về Nghe, Đọc hiểu và Ngữ pháp. Thời gian làm bài dự kiến khoảng 45-60 phút. Hãy chuẩn bị tai nghe (cho phần Nghe) và đảm bảo kết nối internet ổn định.",
        placement_step3_title: "Nhận kết quả",
        placement_step3_desc: "Kết quả ước tính trình độ theo khung CEFR (A1, A2, B1, B2, C1, C2) sẽ được hiển thị ngay sau khi bạn hoàn thành bài thi.",
        placement_step4_title: "Tư vấn lộ trình",
        placement_step4_desc: "Dựa trên kết quả, hệ thống sẽ gợi ý các khóa học phù hợp. Bạn có thể để lại thông tin để nhận tư vấn chi tiết hơn từ đội ngũ IVS Academy.",
        placement_benefits_heading: "Lợi ích khi làm Bài kiểm tra",
        placement_benefit1: "**Miễn phí & Nhanh chóng:** Thực hiện online mọi lúc mọi nơi.",
        placement_benefit2: "**Kết quả tin cậy:** Đánh giá dựa trên chuẩn CEFR quốc tế.",
        placement_benefit3: "**Xác định đúng điểm mạnh/yếu:** Hiểu rõ hơn về khả năng ngôn ngữ của bản thân.",
        placement_benefit4: "**Gợi ý khóa học phù hợp:** Tiết kiệm thời gian và chi phí, chọn đúng lộ trình học tập.",
        placement_benefit5: "**Nền tảng cho sự tiến bộ:** Đặt mục tiêu học tập rõ ràng và hiệu quả hơn.",
        placement_cta_heading: "Sẵn sàng khám phá trình độ Tiếng Anh của bạn?",
        placement_cta_button: "Bắt đầu Làm bài Ngay!",
        placement_test_area_title: "Bài kiểm tra Năng lực",
        placement_start_button: "Bắt đầu",
        placement_next_button: "Câu tiếp theo",
        placement_submit_button: "Nộp bài",
        placement_loading_test: "Đang tải bài kiểm tra...",
        placement_test_completed: "Bạn đã hoàn thành bài kiểm tra!",
        placement_result_title: "Kết quả Ước tính",
        placement_estimated_level_label: "Trình độ ước tính (CEFR):",
        placement_level_description_label: "Mô tả trình độ:",
        placement_suggested_courses_label: "Khóa học gợi ý:",
        placement_retake_button: "Làm lại bài kiểm tra",
        placement_contact_button: "Nhận tư vấn chi tiết",
        placement_error_loading: "Lỗi khi tải bài kiểm tra. Vui lòng thử lại.",
        sample_question_text: "Chọn đáp án đúng nhất:",
        sample_option_a: "Đáp án A",
        sample_option_b: "Đáp án B",
        sample_option_c: "Đáp án C",
        sample_option_d: "Đáp án D",

        // Trang thanhlaptrungtam.html (Keys mới) (Giữ nguyên)
        establishment_hero_title: "Thành lập Trung tâm Ngoại ngữ - Tin học - Kỹ năng sống",
        establishment_hero_subtitle: "Dịch vụ Tư vấn & Hỗ trợ Thủ tục Toàn diện từ IVS Education",
        establishment_intro_heading: "Biến ý tưởng thành Hiện thực - Mở Trung tâm của riêng bạn!",
        establishment_intro_p1: "Bạn đam mê giáo dục và mong muốn thành lập một trung tâm ngoại ngữ, tin học hoặc kỹ năng sống uy tín, chất lượng? Tuy nhiên, quy trình thủ tục phức tạp, yêu cầu về hồ sơ, đề án, cơ sở vật chất... khiến bạn băn khoăn?",
        establishment_intro_p2: "Với kinh nghiệm thực tế từ việc xây dựng và vận hành thành công IVS Academy, cùng sự am hiểu sâu sắc về các quy định pháp luật, IVS Education cung cấp dịch vụ tư vấn và hỗ trợ trọn gói, giúp bạn hiện thực hóa ý tưởng một cách chuyên nghiệp, nhanh chóng và hiệu quả.",
        establishment_intro_img_alt: "Minh họa thành lập trung tâm giáo dục",
        establishment_reqs_heading: "Các Quy định Bắt buộc để Thành lập Trung tâm",
        establishment_reqs_note: "Để được cấp phép hoạt động, trung tâm của bạn cần đáp ứng các điều kiện cơ bản theo quy định hiện hành (tham khảo Nghị định 46/2017/NĐ-CP, Nghị định 135/2018/NĐ-CP và các Thông tư hướng dẫn của Bộ GD&ĐT):",
        establishment_reqs_item1: "**Địa điểm & Pháp lý sử dụng đất:** Phải có quyền sử dụng đất hợp pháp (Giấy chứng nhận quyền sử dụng đất) hoặc hợp đồng thuê địa điểm ổn định, được công chứng/chứng thực, thời hạn thuê tối thiểu thường là 01 năm trở lên (một số địa phương có thể yêu cầu dài hơn). Địa điểm phải đảm bảo an ninh, trật tự.",
        establishment_reqs_item2: "**Cơ sở vật chất & PCCC:** Diện tích sử dụng tối thiểu phải đảm bảo tỷ lệ theo quy định (thường là ≥ 1.5m²/học viên tại thời điểm đông nhất). Phòng học đủ ánh sáng, thoáng mát, bàn ghế phù hợp, có khu vực hành chính, phòng chờ (nếu cần). Đặc biệt, phải có Giấy chứng nhận đủ điều kiện về phòng cháy chữa cháy (PCCC) do cơ quan công an có thẩm quyền cấp hoặc biên bản kiểm tra PCCC đáp ứng yêu cầu.",
        establishment_reqs_item3: "**Nhân sự (Giám đốc & Giáo viên):**",
        establishment_reqs_item3_director: "**Giám đốc:** Phải có bằng tốt nghiệp đại học, kinh nghiệm hoạt động trong ngành giáo dục (thường là 3 năm trở lên), đủ sức khỏe, năng lực quản lý và lý lịch rõ ràng.",
        establishment_reqs_item3_teachers: "**Giáo viên:** Phải có bằng cấp chuyên môn phù hợp với lĩnh vực giảng dạy (ví dụ: bằng đại học sư phạm ngoại ngữ/ngôn ngữ, chứng chỉ nghiệp vụ sư phạm đối với người có bằng đại học chuyên ngành phù hợp; bằng đại học/cao đẳng tin học hoặc chứng chỉ nghiệp vụ sư phạm...). Giáo viên nước ngoài cần có giấy phép lao động và bằng cấp tương đương.",
        establishment_reqs_item4: "**Đề án & Chương trình:** Phải xây dựng Đề án thành lập và hoạt động chi tiết, bao gồm tên gọi, loại hình, địa điểm, cơ sở vật chất, chương trình giảng dạy (phù hợp quy định hoặc được phê duyệt), đội ngũ nhân sự, quy mô dự kiến, nguồn tài chính...",
        establishment_reqs_disclaimer: "*Lưu ý: Các quy định chi tiết có thể thay đổi theo thời gian và có sự khác biệt nhỏ giữa các địa phương. IVS Education sẽ tư vấn cụ thể dựa trên trường hợp của bạn.*",
        establishment_process_heading: "Quy trình Hỗ trợ Thành lập Trung tâm tại IVS",
        establishment_step1_title: "Tiếp nhận & Tư vấn sơ bộ",
        establishment_step1_desc: "Lắng nghe ý tưởng, nhu cầu của bạn. Tư vấn về điều kiện, quy mô, loại hình trung tâm (Ngoại ngữ, Tin học, Kỹ năng sống) phù hợp. Giải đáp các thắc mắc ban đầu.",
        establishment_step2_title: "Khảo sát & Đánh giá",
        establishment_step2_desc: "Khảo sát địa điểm dự kiến (nếu có). Đánh giá tính khả thi, phân tích thị trường và đối thủ cạnh tranh.",
        establishment_step3_title: "Tư vấn Pháp lý & Chuẩn bị Hồ sơ",
        establishment_step3_desc: "Hướng dẫn chi tiết các quy định pháp luật hiện hành. Lập danh mục hồ sơ cần thiết. Tư vấn chuẩn bị các giấy tờ theo yêu cầu của Sở Giáo dục & Đào tạo.",
        establishment_step4_title: "Xây dựng Đề án Thành lập",
        establishment_step4_desc: "Hỗ trợ soạn thảo Đề án hoạt động chi tiết, bao gồm mục tiêu, đối tượng, chương trình đào tạo, đội ngũ giáo viên, cán bộ quản lý, cơ sở vật chất, trang thiết bị, tài chính...",
        establishment_step5_title: "Nộp hồ sơ & Làm việc với Cơ quan chức năng",
        establishment_step5_desc: "Đại diện hoặc hỗ trợ bạn nộp hồ sơ tại Sở Giáo dục & Đào tạo. Theo dõi tiến độ, giải trình và làm việc với cơ quan chức năng để hoàn thiện thủ tục cấp phép.",
        establishment_step6_title: "Hỗ trợ Sau cấp phép",
        establishment_step6_desc: "Tư vấn về tuyển dụng nhân sự, xây dựng chương trình chi tiết, chiến lược marketing, quản lý vận hành ban đầu để trung tâm nhanh chóng đi vào hoạt động ổn định và hiệu quả.",
        establishment_why_heading: "Tại sao nên chọn Dịch vụ của IVS Education?",
        establishment_why_item1: "**Kinh nghiệm thực tế:** Chúng tôi đã trải qua quy trình thành lập và vận hành IVS Academy thành công, hiểu rõ những khó khăn và giải pháp.",
        establishment_why_item2: "**Am hiểu pháp lý:** Luôn cập nhật các quy định, thông tư mới nhất về thành lập và hoạt động của trung tâm ngoại ngữ, tin học, kỹ năng sống.",
        establishment_why_item3: "**Hỗ trợ toàn diện:** Đồng hành cùng bạn từ khâu lên ý tưởng, chuẩn bị hồ sơ, làm việc với cơ quan chức năng đến khi trung tâm chính thức hoạt động.",
        establishment_why_item4: "**Đội ngũ chuyên nghiệp:** Các chuyên gia tư vấn tận tâm, giàu kinh nghiệm trong lĩnh vực giáo dục và pháp lý.",
        establishment_why_item5: "**Mạng lưới đối tác:** Hỗ trợ kết nối với các đối tác cung cấp thiết bị dạy học, giáo trình, phần mềm quản lý, nhân sự chất lượng...",
        establishment_why_item6: "**Cam kết hiệu quả:** Tối ưu hóa quy trình, tiết kiệm thời gian và chi phí cho khách hàng, đảm bảo tuân thủ đúng pháp luật.",
        establishment_cta_heading: "Bắt đầu Hành trình Xây dựng Trung tâm của bạn!",
        establishment_cta_desc: "Đừng để thủ tục pháp lý phức tạp cản trở ước mơ đóng góp cho sự nghiệp giáo dục của bạn. Hãy liên hệ với IVS Education ngay hôm nay để được tư vấn chi tiết và nhận hỗ trợ chuyên nghiệp!",
        establishment_cta_button: "Yêu cầu Tư vấn Ngay",

        // Thêm key cho trang dangkytuvan.html
        page_title_consultation: "Đăng ký Tư vấn - IVS JSC",
        meta_description_consultation: "Đăng ký nhận tư vấn miễn phí từ IVS JSC về các lĩnh vực giáo dục, công nghệ, hợp tác quốc tế và các dịch vụ khác.",
        og_title_consultation: "Đăng ký Tư vấn - IVS JSC",
        og_description_consultation: "Liên hệ với IVS JSC để được tư vấn chi tiết về nhu cầu của bạn.",
        consultation_form_title: "Đăng ký Tư vấn",
        consultation_form_subtitle: "Vui lòng điền thông tin bên dưới, IVS JSC sẽ liên hệ lại với bạn sớm nhất.",
        form_label_fullname: "Họ và Tên",
        form_placeholder_fullname: "Ví dụ: Nguyễn Văn A",
        form_label_phone: "Số điện thoại",
        form_placeholder_phone: "Ví dụ: 0912345678",
        form_label_email: "Địa chỉ Email",
        form_placeholder_email: "Ví dụ: email@example.com",
        form_label_interest: "Lĩnh vực cần tư vấn",
        form_select_placeholder: "-- Chọn lĩnh vực quan tâm --",
        interest_option_language: "Đào tạo Ngoại ngữ (IVS Academy)",
        interest_option_steam: "Đào tạo STEAM / Kỹ năng sống",
        interest_option_edtech: "Giải pháp EdTech (IVS Celestech)",
        interest_option_international: "Hợp tác Quốc tế (Du học, Trại hè, Liên kết)",
        interest_option_establishment: "Tư vấn Thành lập Trung tâm/Trường học",
        interest_option_investment: "Hợp tác Đầu tư Giáo dục",
        interest_option_webdesign: "Thiết kế Website / Hệ thống",
        interest_option_rnd: "Thiết kế Học liệu / Chương trình",
        interest_option_health: "Sản phẩm Sức khỏe (Yến sào, Yoga)",
        interest_option_other: "Yêu cầu Khác",
        form_label_message: "Nội dung yêu cầu",
        form_placeholder_message: "Vui lòng mô tả chi tiết yêu cầu hoặc câu hỏi của bạn...",
        form_button_submit: "Gửi yêu cầu Tư vấn",
        consultation_alt_contact_prefix: "Hoặc liên hệ trực tiếp với chúng tôi qua:",


    },
    en: {
        // Meta Tags (About Page - Added)
        about_page_title: "About Us - IVS JSC",
        about_meta_description: "Learn about IVS JSC - Integrate Vision Synergy Commercial Service Joint Stock Company, its mission, vision, core values, leadership team, and areas of operation.",
        about_og_title: "About Us - IVS JSC",
        about_og_description: "Discover IVS JSC: Connecting Vietnamese education with advanced technology and international standards.",

        // Meta Tags (Other pages - kept from original file)
        page_title_index: "IVS JSC - Education, Technology, Health, International Cooperation",
        meta_description_index: "IVS JSC - A pioneering organization in Vietnam in education (IVS Academy, IVS Kindergarten), EdTech (IVS Celestech), public health, and international cooperation.",
        og_title_index: "IVS JSC - Education, Technology, Health, International Cooperation",
        og_description_index: "Discover comprehensive solutions in language training, STEAM, life skills, EdTech, healthcare, and partnership opportunities with IVS JSC.",
        page_title_default: "IVS Education",
        meta_description: "IVS Education - Education organization, educational technology (EdTech), international investment cooperation.",
        page_title_rnd: "Custom Curriculum & EdTech Solutions - IVS Education",
        meta_description_rnd_v2: "R&D services, design of programs, learning materials, LMS, and educational applications tailored to specific needs by IVS Education & IVS Celestech.",
        page_title_sponsorship: "Community Sponsorship - IVS Education",
        meta_description_sponsorship: "Learn about IVS Education's community sponsorship programs and how you can partner with us to create sustainable value.",
        page_title_celestech: "IVS Celestech - Comprehensive EdTech Solutions",
        meta_description_celestech: "IVS Celestech offers EdTech solutions from consulting, educational interior construction, smart equipment (interactive screens, VR, AI) to LMS systems.",
        page_title_placement: "English Placement Test - IVS Education",
        meta_description_placement: "Take the online English placement test based on the Cambridge standard (6 CEFR levels) to determine your level and choose the right course at IVS Education.",
        og_title_placement: "English Placement Test - IVS Education",
        og_description_placement: "Accurately assess your English level with a free online test from IVS Education.",
        og_image_placement: "https://placehold.co/1200x630/3b82f6/ffffff?text=English+Placement+Test",
        page_title_establishment: "Center Establishment Service (Language - IT - Life Skills) | IVS Education", // Title Establishment page
        meta_description_establishment: "IVS Education provides comprehensive consulting and support services for establishing language, IT, and life skills centers in compliance with legal regulations.", // Description Establishment page
        og_title_establishment: "Center Establishment Service (Language - IT - Life Skills) | IVS Education",
        og_description_establishment: "A-Z Support: Condition consultation, document preparation, proposal drafting, working with authorities.",
        og_image_establishment: "https://placehold.co/1200x630/3b82f6/ffffff?text=Establish+Center+IVS",
        page_title_webdesign: "Professional Website Design Services - IVS Tech Solutions",
        meta_description_webdesign: "IVS JSC (IVS Tech Solutions) offers professional, SEO-friendly, responsive website design services optimized for businesses and education.",
        og_title_webdesign: "Professional Website Design Services - IVS Tech Solutions",
        og_description_webdesign: "IVS JSC offers professional, SEO-friendly, responsive website design services optimized for businesses and education.",

        // Header v6 (Kept)
        logo_alt: "IVS JSC Logo",
        menu_home: "Home",
        menu_about: "About Us",
        menu_about_ivs: "About IVS JSC",
        menu_mission_vision: "Mission & Vision",
        menu_ivs_meaning: "Meaning of IVS",
        menu_celestech: "IVS Celestech (EdTech)",
        menu_team: "Our Team",
        menu_partners: "Partners",
        menu_training: "Training",
        menu_placement_test: "Placement Test",
        menu_summer_camp: "Int'l Summer Camp", // Shortened
        menu_scholarships: "Scholarships",
        menu_hay_noi_club: "Hay Noi Club",
        menu_cooperation: "Cooperation",
        menu_international_link: "International Linkage",
        menu_iivsa_alliance: "IIVSA Alliance",
        menu_educational_link: "Educational Linkage", // New key
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
        menu_health_luvyoga: "LuvYoga Loc Hoa - Trang Bom",
        menu_recruitment: "Recruitment",
        menu_recruitment_vn: "Domestic Recruitment",
        menu_recruitment_intl: "International Recruitment",
        menu_contact: "Contact",
        open_main_menu: "Open main menu",
        menu_training_center: "At Center",
        menu_training_language: "Language Training",
        menu_training_lifeskills: "Life Skills Training",
        menu_training_teacher: "Teacher Training",
        menu_training_teacher_vn: "VN Teachers",
        menu_training_teacher_foreign: "Foreign Teachers",
        menu_training_teacher_cert: "Add Pedagogical Certificate",
        menu_library: "Library",
        menu_library_docs: "Educational Documents",
        menu_library_media: "IVSMedia",

        // Index Page v2 (Kept)
        index_hero_title: "Welcome to IVS JSC",
        index_hero_subtitle: "Shaping the future of education and health in Vietnam",
        learn_more: "Learn more",
        index_news_title: "News & Events",
        loading_news: "Loading news...",
        no_news: "No news yet.",
        news_load_error: "Could not load news.",
        news_title_na: "Title Not Available",
        news_image_alt: "News image",
        read_more: "Read more →",
        index_about_title: "About Us",
        index_about_p1: "IVS JSC is a pioneering organization in education, educational technology (EdTech), public health, international cooperation, and business development in Vietnam.",
        index_about_p2: "We provide comprehensive solutions from language education, life skills, STEAM, to healthcare programs and modern technology applications.",
        view_details: "View details →",
        index_about_img_alt: "IVS JSC introduction image",
        index_activities_title: "Main Areas of Operation",
        activity_academy_title: "IVS Academy",
        activity_academy_desc: "Language training (English, Chinese, Japanese), STEAM, soft skills. Community program \"Hay Noi\".",
        activity_kindergarten_title: "IVS Kindergarten",
        activity_kindergarten_desc: "Pioneering kindergarten applying the STEAM+Intelligence model. Modern facilities.",
        activity_celestech_title: "IVS Celestech (EdTech)",
        activity_celestech_desc: "Developing educational technology solutions: E-learning, LMS, AI, VR/AR.",
        activity_health_title: "IVS Health & Wellness",
        activity_health_desc: "Collaborating on health product development like Thanh Yen bird's nest, community nutrition education.",
        activity_cooperation_title: "International Cooperation",
        activity_cooperation_desc: "Connecting Vietnamese education and health with the world: Study abroad, summer camps, joint training.",
        activity_investment_title: "Investment & Development",
        activity_investment_desc: "Building the IVS Global School system and sustainable projects.",
        details_link: "Details...",
        index_video_title: "Introductory Video",
        index_video_iframe_title: "IVS JSC introduction video",

        // About Page Content (Added)
        about_heading: "About Us",
        about_intro_heading: "Introduction to IVS JSC",
        about_intro_p1_strong: "Integrate Vision Synergy Commercial Service Joint Stock Company (IVS JSC)",
        about_intro_p1_text: " was established with the mission of connecting and elevating Vietnamese education by integrating advanced technology solutions and international standard training programs. We are proud to be an official member of the ",
        about_intro_p1_link: "IIVSA Global Education Alliance",
        about_intro_p1_end: ", affirming our commitment to quality and international cooperation.",
        about_intro_p2: "With its headquarters in Dong Nai and a wide network of operations, IVS JSC focuses on core areas including STEAM training, foreign languages, soft skills, and comprehensive educational consulting, aiming for the sustainable development of future generations.",
        about_vision_title: "Vision",
        about_vision_desc: "To become a leading educational organization, pioneering the application of technology and innovation to shape the future of Vietnamese education integrated internationally.",
        about_mission_title: "Mission",
        about_mission_desc: "To provide comprehensive, high-quality educational solutions, helping learners maximize their potential, confidently integrate, and contribute to the community.",
        about_values_title: "Core Values",
        about_values_strong: "Quality – Dedication – Creativity – Equality.",
        about_values_desc: " We are committed to delivering the best educational services with dedication, continuous innovation, and ensuring fair learning opportunities for everyone.",
        about_leadership_heading: "Leadership Team",
        about_leadership_img_alt: "Nguyen Minh Triet - CEO",
        about_leadership_name: "Mr. Nguyen Minh Triet",
        about_leadership_title: "CEO & Chairman of the Board",
        about_leadership_desc: "With a solid background in English Language, Business Administration (MBA - FPT University), and educational management experience, Mr. Triet leads IVS JSC with strategic vision and dedication to education. He has experience working at reputable organizations such as VietJet Air, The Grand Ho Tram Strip, and AMG Education.",
        about_leadership_link: "View more details",
        about_areas_heading: "Main Areas of Operation",
        about_area1_strong: "IVS Academy:",
        about_area1_desc: " Language training center (English, Japanese, Korean, Chinese) and soft skills, life skills.",
        about_area2_strong: "IVS Education:",
        about_area2_desc: " Development of STEAM programs, digital learning solutions, and consulting for building schools/centers according to international standards.",
        about_area3_strong: "International Affiliation:",
        about_area3_desc: " Collaborating with global education partners (e.g., The Power to Inspire - USA, Kinderlink25 Project) to bring advanced programs and methods to Vietnam.",
        about_area4_strong: "Research & Development (R&D):",
        about_area4_desc: " Continuously researching and developing new educational programs that align with trends and practical needs.",
        about_partners_heading: "Key Partners and Affiliates",
        about_partner1: "IIVSA Global Education Alliance (Official Member)",
        about_partner2: "The Power to Inspire (USA) - Strategic Partner",
        about_partner3: "Kinderlink25 Project - Early Childhood Program Development Collaboration",
        about_partner4: "Domestic and international schools, training centers, and educational organizations.",
        about_partners_p: "We believe that close collaboration creates synergy, driving the development of education.",

        // Footer (Kept and updated)
        footer_company_name: "IVS JSC",
        footer_rights: "All rights reserved.",
        footer_contact_us: "Contact us",
        footer_address: "1104, Group 6, Dat Moi Hamlet, Long Phuoc Commune, Long Thanh District, Dong Nai Province, Vietnam, 76213.",
        footer_quick_links: "Quick links",
        footer_follow_us: "Follow us",
        footer_desc: "IVS JSC - INTEGRATE VISION SYNERGY TRADING SERVICE JOINT STOCK COMPANY - TIN: 3603960189",
        quick_links: "Quick Links",
        about_ivs: "About IVS",
        services: "Services",
        careers: "Careers",
        contact: "Contact",
        blog: "News",
        contact_us: "Contact Us",
        address: "No. 1104, Group 6, Dat Moi Hamlet, Long Phuoc Commune, Long Thanh District, Dong Nai Province, Vietnam, 76213.",
        copyright: "© 2025 IVS JSC. Copyright Registration No: 6207/2024/QTG.",
        footer_ivs_academy_title: "IVS Academy",
        footer_ivs_mastery_title: "IVS Mastery",
        footer_enable_js: "Please enable JavaScript to view Facebook content.",
        footer_visit_page_academy: "Visit IVS Academy Fanpage",
        footer_visit_page_mastery: "Visit IVS Mastery Fanpage",
        footer_message_academy_sr: "Message IVS Academy on Facebook",
        footer_message_mastery_sr: "Message IVS Mastery on Facebook",
        footer_email_link: "ivsacademy.edu@gmail.com", // New key
        footer_zalo_link: "Nguyen Minh Triet (IVS)", // New key
        footer_map_title: "Map", // New key

        // Trang rnd-curriculum.html v2 (Kept)
        rnd_hero_title: "Custom Curriculum & EdTech Solutions",
        rnd_hero_subtitle: "From IVS Education & IVS Celestech - Turning Educational Ideas into Reality",
        rnd_intro_heading: "Need Unique and Effective Educational Solutions?",
        rnd_intro_p1: "In the ever-changing educational landscape, having the right training programs, learning materials, and technological tools is key to differentiation and improving teaching quality. IVS Education and IVS Celestech offer comprehensive Research & Development (R&D) services to meet all your specific needs.",
        rnd_intro_p2: "We combine deep pedagogical expertise with advanced technological capabilities to create high-quality educational products, from academic content to digital platforms.",
        rnd_intro_img_alt: "Curriculum design and EdTech solution process",
        rnd_services_heading: "Our Educational R&D Services",
        rnd_service1_title: "Program Design & Competency Frameworks",
        rnd_service1_desc: "Develop training programs (Language, IT, Life Skills, STEAM...) based on learning outcomes, tailored to specific goals and audiences. Design detailed competency frameworks.",
        rnd_service2_title: "Diverse Learning Material Development",
        rnd_service2_desc: "Compile textbooks, workbooks, digital lesson plans, interactive lectures, video lessons, question banks, learning games... ensuring pedagogical soundness and engagement.",
        rnd_service3_title: "E-learning & LMS System Building",
        rnd_service3_desc: "Consult and implement customized Learning Management Systems (LMS) or based on open-source platforms. Develop complete interactive E-learning courses.",
        rnd_service4_title: "Educational Application Development",
        rnd_service4_desc: "Design and program mobile apps, web applications supporting learning, testing, assessment, classroom management...",
        rnd_service5_title: "AI, VR/AR Technology Integration",
        rnd_service5_desc: "Research and apply Artificial Intelligence (AI), Virtual Reality (VR), Augmented Reality (AR) into learning materials and teaching activities to enhance experience and effectiveness.",
        rnd_service6_title: "Overall EdTech Solution Consulting",
        rnd_service6_desc: "Assess needs, consult on selection and implementation of educational technology solutions aligned with the organization's strategy and budget.",
        rnd_process_heading: "Professional R&D Collaboration Process",
        rnd_step1_title: "Requirement Reception & Analysis",
        rnd_step1_desc: "Detailed discussion on goals, target audience, scope, technical requirements, and budget.",
        rnd_step2_title: "Solution Proposal & Planning",
        rnd_step2_desc: "Present R&D solutions, detailed implementation plans, quotations, and collaboration terms.",
        rnd_step3_title: "Design & Development (Prototype)",
        rnd_step3_desc: "Conduct research, design program/material/feature frameworks. Develop prototypes for feedback.",
        rnd_step4_title: "Refinement & Finalization",
        rnd_step4_desc: "Based on feedback, finalize the product, ensuring quality and meeting requirements.",
        rnd_step5_title: "Testing & Evaluation",
        rnd_step5_desc: "Perform internal and/or end-user testing to ensure stability, effectiveness, and usability.",
        rnd_step6_title: "Handover & Support",
        rnd_step6_desc: "Deliver the final product and documentation. Provide technical support, training (if needed), and maintenance.",
        rnd_why_heading: "Why Choose IVS for Educational R&D Projects?",
        rnd_why_item1: "**Expert Team:** Combination of pedagogical experts, graphic designers, programmers, and experienced technology specialists.",
        rnd_why_item2: "**Systematic Process:** Apply a rigorous R&D process, ensuring project progress and quality.",
        rnd_why_item3: "**Updated Technology:** Always exploring and applying the latest educational methods and technologies.",
        rnd_why_item4: "**Customized Solutions:** Design unique solutions tailored precisely to your needs and brand.",
        rnd_why_item5: "**Confidentiality:** Commit to absolute confidentiality of client ideas and project information.",
        rnd_why_item6: "**Reasonable Cost:** Provide high-quality solutions at competitive prices.",
        rnd_cta_heading: "Ready to Innovate Education with IVS?",
        rnd_cta_desc: "Share your ideas or requirements with us. The IVS Education & IVS Celestech team is always ready to listen and partner with you to create groundbreaking educational solutions.",
        rnd_cta_button: "Contact R&D Consulting",

        // Trang tai-tro.html (Kept)
        sponsorship_hero_title: "Community Sponsorship - Partner with IVS to Create Value",
        sponsorship_hero_subtitle: "Joining hands for a future generation fully equipped with knowledge and skills",
        sponsorship_intro_heading: "Why Partner in Sponsorship with IVS Education?",
        sponsorship_intro_p1: "At IVS Education, we believe education is the foundation for the sustainable development of individuals and society. Alongside our core business activities, we always strive to implement meaningful community projects, especially in education and skills development for the youth.",
        sponsorship_intro_p2: "The partnership and sponsorship from individuals, organizations, and businesses are invaluable motivations helping IVS expand the scale and enhance the effectiveness of these programs, bringing practical benefits to the community.",
        sponsorship_intro_img_alt: "Community activities of IVS Education",
        sponsorship_programs_heading: "Priority Programs for Sponsorship",
        sponsorship_program1_title: "\"Hay Noi\" Club (Non-profit Project)",
        sponsorship_program1_desc: "Creating a free playground for youth in Long Thanh, Dong Nai to practice communication, presentation, and critical thinking skills in English. Sponsorship helps maintain activities, organize events, invite experts, provide rewards...",
        sponsorship_program1_link: "Learn about Hay Noi Club",
        sponsorship_program2_title: "IVS Future Leaders Scholarship",
        sponsorship_program2_desc: "Providing opportunities to study languages, skills, STEAM for students from disadvantaged backgrounds with strong determination and good academic records. Sponsorship directly contributes to the scholarship fund.",
        sponsorship_program2_link: "View Scholarship Information",
        sponsorship_program3_title: "Community Library & Rural Book Project",
        sponsorship_program3_desc: "Building small bookshelves and libraries in areas with limited access to books and knowledge. Sponsoring books, equipment, operational costs.",
        sponsorship_program4_title: "Other Community Education Events",
        sponsorship_program4_desc: "Organizing free or low-cost workshops, seminars, STEAM festivals, academic competitions... for the community. Sponsoring venues, experts, gifts, communication...",
        sponsorship_benefits_heading: "Sponsor Benefits",
        sponsorship_benefit1: "**Spread Value:** Directly contribute to educational and community development.",
        sponsorship_benefit2: "**Enhance Image:** Affirm the corporate social responsibility (CSR) of the business/organization.",
        sponsorship_benefit3: "**Communication Rights:** Logo, sponsor name appear on publications, events, program websites (depending on sponsorship level).",
        sponsorship_benefit4: "**Network Connection:** Opportunity to network with partners and other members within the IVS ecosystem.",
        sponsorship_benefit5: "**Financial Transparency:** Commitment to using sponsorship funds for the intended purpose, with clear and transparent reporting.",
        sponsorship_how_to_heading: "How to Sponsor",
        sponsorship_how_to_p1: "IVS Education welcomes all forms of contribution and sponsorship:",
        sponsorship_how_to_item1: "**Financial Sponsorship:** Direct transfer to the project fund.",
        sponsorship_how_to_item2: "**In-kind Sponsorship:** Books, learning equipment, stationery, gifts...",
        sponsorship_how_to_item3: "**Service Sponsorship:** Event venues, printing, design, communication...",
        sponsorship_how_to_item4: "**Expertise Sponsorship:** Sharing knowledge and skills from experts.",
        sponsorship_how_to_p2: "Please contact us directly via email or phone to discuss detailed sponsorship needs and suitable cooperation plans.",
        sponsorship_cta_heading: "Let's Wing Educational Dreams with IVS!",
        sponsorship_cta_desc: "Every contribution, big or small, holds great significance in building a brighter future for the young generation of Vietnam. IVS Education appreciates all your interest and partnership.",
        sponsorship_cta_button: "Contact for Sponsorship Now",

        // Trang ivscelestech.html (Kept)
        celestech_hero_title: "IVS Celestech - Comprehensive EdTech Solutions",
        celestech_hero_subtitle: "Creating Smart - Creative - Effective Learning Environments",
        celestech_intro_heading: "IVS Celestech: Pioneering Technology Application in Education",
        celestech_intro_p1: "As the strategic educational technology (EdTech) division of IVS JSC, IVS Celestech focuses on researching, developing, and providing advanced technology solutions to optimize management processes, enhance teaching quality, and create engaging, effective learning experiences for learners of all ages.",
        celestech_intro_p2: "We offer not just products, but holistic solutions, from consulting, design, construction to implementation and operational support.",
        celestech_intro_img_alt: "IVS Celestech educational technology",
        celestech_solutions_heading: "Featured Solutions and Services",
        celestech_solution1_title: "Smart Learning Space Consulting & Design",
        celestech_solution1_desc: "Needs assessment, consulting on modern classroom/center models. Design optimal learning spaces integrating technology (lighting, sound, interactive devices). Professional educational interior construction.",
        celestech_solution2_title: "Provision of Modern Educational Equipment",
        celestech_solution2_desc: "Interactive Flat Panels, projectors, classroom audio systems, Virtual Reality (VR), Augmented Reality (AR) devices, educational robots, STEAM equipment...",
        celestech_solution3_title: "Learning Management System (LMS)",
        celestech_solution3_desc: "Implement and customize leading LMS platforms (Moodle, Canvas...) or build custom LMS. Integrate tools for course, student, material, and assessment management.",
        celestech_solution4_title: "Digital Content & E-learning Development",
        celestech_solution4_desc: "Digitize learning materials, build highly interactive E-learning courses, produce video lectures, 3D simulations, learning applications (web/mobile app).",
        celestech_solution5_title: "AI Solutions in Education",
        celestech_solution5_desc: "Research and apply AI to personalize learning paths, virtual assistants for student support, learning data analysis, automated grading and feedback.",
        celestech_solution6_title: "Technology Training & Transfer",
        celestech_solution6_desc: "Organize training courses, workshops on technology application in teaching for teachers and educational managers. Provide effective technical support and technology transfer.",
        celestech_why_heading: "Benefits of Partnering with IVS Celestech",
        celestech_why_item1: "**Comprehensive Solutions:** From hardware, software to content and training.",
        celestech_why_item2: "**Advanced Technology:** Always updating and applying the latest EdTech trends.",
        celestech_why_item3: "**Practical Experience:** Understanding the needs and challenges of the Vietnamese educational environment.",
        celestech_why_item4: "**Expert Team:** Dedicated technology engineers, education specialists, designers.",
        celestech_why_item5: "**Professional Support:** Dedicated consulting, implementation, and after-sales services.",
        celestech_cta_heading: "Elevate Education with Technology?",
        celestech_cta_desc: "Let IVS Celestech accompany you on the journey of digital transformation in education. Contact us today to explore the most suitable solutions!",
        celestech_cta_button: "Request Solution Consultation",

        // Trang english-placement.html (Kept)
        placement_hero_title: "Online English Placement Test",
        placement_hero_subtitle: "Quickly assess your level according to the CEFR standard - Free!",
        placement_intro_heading: "Determine your level - Choose the right path",
        placement_intro_p1: "Want to know your current English level? IVS Education's English Placement Test is scientifically designed, closely following the Common European Framework of Reference for Languages (CEFR), helping you accurately assess your Listening - Reading - Grammar skills.",
        placement_intro_p2: "The test results will be a crucial basis for you to choose the most suitable course for your goals and abilities at IVS Academy.",
        placement_intro_img_alt: "Online English placement test",
        placement_how_it_works_heading: "How does the test work?",
        placement_step1_title: "Register (Optional)",
        placement_step1_desc: "You can take the test immediately or register an account to save your results and receive detailed consultation.",
        placement_step2_title: "Take the Test",
        placement_step2_desc: "The test includes multiple-choice sections on Listening, Reading Comprehension, and Grammar. The estimated time is 45-60 minutes. Please prepare headphones (for the Listening section) and ensure a stable internet connection.",
        placement_step3_title: "Get Results",
        placement_step3_desc: "Your estimated CEFR level (A1, A2, B1, B2, C1, C2) will be displayed immediately after you complete the test.",
        placement_step4_title: "Course Consultation",
        placement_step4_desc: "Based on the results, the system will suggest suitable courses. You can leave your information to receive more detailed advice from the IVS Academy team.",
        placement_benefits_heading: "Benefits of Taking the Test",
        placement_benefit1: "**Free & Quick:** Take it online anytime, anywhere.",
        placement_benefit2: "**Reliable Results:** Assessment based on the international CEFR standard.",
        placement_benefit3: "**Identify Strengths/Weaknesses:** Better understand your language abilities.",
        placement_benefit4: "**Suitable Course Suggestions:** Save time and money, choose the right learning path.",
        placement_benefit5: "**Foundation for Progress:** Set clearer and more effective learning goals.",
        placement_cta_heading: "Ready to discover your English level?",
        placement_cta_button: "Start the Test Now!",
        placement_test_area_title: "Placement Test",
        placement_start_button: "Start",
        placement_next_button: "Next Question",
        placement_submit_button: "Submit",
        placement_loading_test: "Loading test...",
        placement_test_completed: "You have completed the test!",
        placement_result_title: "Estimated Result",
        placement_estimated_level_label: "Estimated Level (CEFR):",
        placement_level_description_label: "Level Description:",
        placement_suggested_courses_label: "Suggested Courses:",
        placement_retake_button: "Retake Test",
        placement_contact_button: "Get Detailed Consultation",
        placement_error_loading: "Error loading test. Please try again.",
        sample_question_text: "Choose the best answer:",
        sample_option_a: "Answer A",
        sample_option_b: "Answer B",
        sample_option_c: "Answer C",
        sample_option_d: "Answer D",

        // thanhlaptrungtam.html Page (New Keys) (Kept)
        establishment_hero_title: "Establishment of Language - IT - Life Skills Centers",
        establishment_hero_subtitle: "Comprehensive Consulting & Procedural Support Service from IVS Education",
        establishment_intro_heading: "Turn Ideas into Reality - Open Your Own Center!",
        establishment_intro_p1: "Are you passionate about education and wish to establish a reputable, high-quality language, IT, or life skills center? However, are complex procedures, requirements for documents, proposals, facilities... making you hesitate?",
        establishment_intro_p2: "With practical experience from successfully building and operating IVS Academy, coupled with a deep understanding of legal regulations, IVS Education offers comprehensive consulting and support services, helping you realize your ideas professionally, quickly, and effectively.",
        establishment_intro_img_alt: "Illustration of establishing an education center",
        establishment_reqs_heading: "Mandatory Regulations for Center Establishment",
        establishment_reqs_note: "To be licensed for operation, your center needs to meet the basic conditions according to current regulations (referencing Decree 46/2017/ND-CP, Decree 135/2018/ND-CP, and guiding Circulars from the Ministry of Education & Training):",
        establishment_reqs_item1: "**Location & Land Use Rights:** Must have legal land use rights (Land Use Right Certificate) or a stable lease agreement, notarized/authenticated, with a minimum lease term typically of 01 year or more (some localities may require longer). The location must ensure security and order.",
        establishment_reqs_item2: "**Facilities & Fire Safety:** The minimum usable area must meet the specified ratio (usually ≥ 1.5m²/student at peak time). Classrooms must have adequate lighting, ventilation, suitable furniture, administrative areas, waiting rooms (if needed). Crucially, a Certificate of Eligibility for Fire Prevention and Fighting (PCCC) issued by the competent police authority or a fire safety inspection report meeting requirements is mandatory.",
        establishment_reqs_item3: "**Personnel (Director & Teachers):**",
        establishment_reqs_item3_director: "**Director:** Must hold a university degree, have experience in the education sector (usually 3 years or more), be in good health, possess management capabilities, and have a clear background.",
        establishment_reqs_item3_teachers: "**Teachers:** Must have professional qualifications relevant to the teaching field (e.g., university degree in foreign language pedagogy/linguistics, pedagogical certificate for those with relevant bachelor's degrees; university/college degree in IT or pedagogical certificate...). Foreign teachers require work permits and equivalent qualifications.",
        establishment_reqs_item4: "**Proposal & Program:** Must develop a detailed establishment and operation proposal, including name, type, location, facilities, teaching curriculum (compliant with regulations or approved), personnel, projected scale, financial resources...",
        establishment_reqs_disclaimer: "*Note: Detailed regulations may change over time and might have slight variations between localities. IVS Education will provide specific advice based on your case.*",
        establishment_process_heading: "IVS Center Establishment Support Process",
        establishment_step1_title: "Reception & Preliminary Consultation",
        establishment_step1_desc: "Listen to your ideas and needs. Advise on conditions, scale, type of center (Language, IT, Life Skills). Answer initial questions.",
        establishment_step2_title: "Survey & Assessment",
        establishment_step2_desc: "Survey the proposed location (if any). Assess feasibility, analyze the market and competitors.",
        establishment_step3_title: "Legal Consultation & Document Preparation",
        establishment_step3_desc: "Provide detailed guidance on current legal regulations. List necessary documents. Advise on preparing paperwork as required by the Department of Education & Training.",
        establishment_step4_title: "Establishment Proposal Development",
        establishment_step4_desc: "Assist in drafting a detailed operation proposal, including objectives, target audience, curriculum, teaching staff, management personnel, facilities, equipment, finances...",
        establishment_step5_title: "Submission & Authority Liaison",
        establishment_step5_desc: "Represent or assist you in submitting the application to the Department of Education & Training. Monitor progress, provide explanations, and work with authorities to complete the licensing procedures.",
        establishment_step6_title: "Post-Licensing Support",
        establishment_step6_desc: "Provide advice on personnel recruitment, detailed program development, marketing strategies, and initial operational management to help the center quickly achieve stable and effective operation.",
        establishment_why_heading: "Why Choose IVS Education's Service?",
        establishment_why_item1: "**Practical Experience:** We have successfully gone through the process of establishing and operating IVS Academy, understanding the challenges and solutions.",
        establishment_why_item2: "**Legal Expertise:** Always updated on the latest regulations and circulars regarding the establishment and operation of language, IT, and life skills centers.",
        establishment_why_item3: "**Comprehensive Support:** We accompany you from ideation, document preparation, liaising with authorities, until the center is officially operational.",
        establishment_why_item4: "**Professional Team:** Dedicated consultants with extensive experience in education and legal fields.",
        establishment_why_item5: "**Partner Network:** Support in connecting with partners providing teaching equipment, textbooks, management software, quality personnel...",
        establishment_why_item6: "**Efficiency Commitment:** Optimize processes, save time and costs for clients, ensuring full legal compliance.",
        establishment_cta_heading: "Start Your Center Building Journey!",
        establishment_cta_desc: "Don't let complex legal procedures hinder your dream of contributing to education. Contact IVS Education today for detailed consultation and professional support!",
        establishment_cta_button: "Request Consultation Now",

         // Add keys for dangkytuvan.html
         page_title_consultation: "Consultation Request - IVS JSC",
         meta_description_consultation: "Request a free consultation from IVS JSC regarding education, technology, international cooperation, and other services.",
         og_title_consultation: "Consultation Request - IVS JSC",
         og_description_consultation: "Contact IVS JSC for detailed consultation on your needs.",
         consultation_form_title: "Consultation Request",
         consultation_form_subtitle: "Please fill out the information below, and IVS JSC will contact you shortly.",
         form_label_fullname: "Full Name",
         form_placeholder_fullname: "Example: John Doe",
         form_label_phone: "Phone Number",
         form_placeholder_phone: "Example: 0912345678",
         form_label_email: "Email Address",
         form_placeholder_email: "Example: email@example.com",
         form_label_interest: "Area of Interest",
         form_select_placeholder: "-- Select area --",
         interest_option_language: "Language Training (IVS Academy)",
         interest_option_steam: "STEAM / Life Skills Training",
         interest_option_edtech: "EdTech Solutions (IVS Celestech)",
         interest_option_international: "International Cooperation (Study Abroad, Camps, Linkage)",
         interest_option_establishment: "Center/School Establishment Consulting",
         interest_option_investment: "Educational Investment Partnership",
         interest_option_webdesign: "Website / System Design",
         interest_option_rnd: "Curriculum / Material Design",
         interest_option_health: "Health Products (Bird's Nest, Yoga)",
         interest_option_other: "Other Request",
         form_label_message: "Your Message",
         form_placeholder_message: "Please describe your request or question in detail...",
         form_button_submit: "Send Consultation Request",
         consultation_alt_contact_prefix: "Or contact us directly via:",
    }
};


// Biến cờ toàn cục để đảm bảo ngôn ngữ chỉ được khởi tạo một lần
window.languageInitialized = false; // Global flag

/**
 * Áp dụng bản dịch cho các phần tử trên trang.
 * @param {string} lang - Mã ngôn ngữ ('vi' hoặc 'en').
 */
function applyTranslations(lang) {
    console.log(`[Language] Applying translations for: ${lang}`);
    document.querySelectorAll('[data-lang-key]').forEach(element => {
        const key = element.getAttribute('data-lang-key');
        const translation = translations[lang]?.[key]; // Safe access

        if (translation !== undefined) {
            const tagName = element.tagName;
            const nameAttr = element.getAttribute('name');
            const propertyAttr = element.getAttribute('property');

            if (tagName === 'META' && nameAttr === 'description') {
                element.content = translation;
            } else if (tagName === 'META' && propertyAttr === 'og:title') {
                element.content = translation;
            } else if (tagName === 'META' && propertyAttr === 'og:description') {
                element.content = translation;
            } else if (tagName === 'TITLE') {
                document.title = translation; // Use document.title for cross-browser compatibility
            } else if (tagName === 'INPUT' || tagName === 'TEXTAREA') {
                // Check for specific placeholder key first
                const placeholderKey = key + '_placeholder';
                const placeholderTranslation = translations[lang]?.[placeholderKey];
                if (placeholderTranslation !== undefined) {
                    element.placeholder = placeholderTranslation;
                } else if (element.hasAttribute('placeholder')) {
                    // Fallback to main key only if placeholder attribute exists
                    // element.placeholder = translation; // Avoid setting placeholder if not intended
                    console.warn(`[Language] Placeholder key ${placeholderKey} not found for element with key ${key}. Main key used as fallback (if applicable).`);
                }
                // Check for value attribute (e.g., submit button)
                if (element.type === 'button' || element.type === 'submit') {
                    element.value = translation;
                }
            } else if (tagName === 'IMG') {
                // Check for specific alt key first
                const altKey = key + '_alt';
                const altTranslation = translations[lang]?.[altKey];
                if (altTranslation !== undefined) {
                    element.alt = altTranslation;
                } else {
                    // Fallback to main key for alt text
                    element.alt = translation;
                }
            } else if (tagName === 'A' && element.classList.contains('sr-only')) {
                 // Handle screen-reader only links if necessary (rare)
                 element.textContent = translation;
            } else if (tagName === 'BUTTON' && element.querySelector('.sr-only')) {
                 // Update screen-reader text within buttons
                 const srOnlySpan = element.querySelector('.sr-only');
                 if (srOnlySpan) {
                     srOnlySpan.textContent = translation;
                 } else {
                      // If button has direct text content besides sr-only
                      // This part needs careful handling based on button structure
                      // Example: If button is just <button data-lang-key="key">Icon</button>
                      // We might not want to set textContent here.
                      // If button is <button data-lang-key="key"><span>Text</span> Icon</button>
                      const textSpan = element.querySelector('span:not(.sr-only)');
                      if(textSpan) textSpan.textContent = translation;
                      // else element.textContent = translation; // Be cautious with this
                 }
            } else {
                // Apply to other elements (P, SPAN, H*, LI, etc.)
                // Handle basic Markdown: **bold** and *italic*
                let finalTranslation = translation;
                finalTranslation = finalTranslation.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                finalTranslation = finalTranslation.replace(/\*(.*?)\*/g, '<em>$1</em>');

                // Use innerHTML only if Markdown was found, otherwise use textContent for safety
                if (finalTranslation !== translation) {
                    element.innerHTML = finalTranslation;
                } else {
                    element.textContent = translation;
                }
            }

            // Handle 'title' attribute (tooltip) if a specific key exists
            const titleKey = key + '_title';
            const titleTranslation = translations[lang]?.[titleKey];
            if (titleTranslation !== undefined) {
                element.title = titleTranslation;
            }

        } else if (key) {
            // Only warn if the key exists but translation is missing for the current language
            if (translations['vi']?.[key] || translations['en']?.[key]) { // Check if key exists in any lang
                 console.warn(`[Language] Translation missing for key: "${key}" in language: "${lang}"`);
            } else {
                 console.warn(`[Language] Key not found in any language: "${key}"`);
            }
        }
    });
}

/**
 * Cập nhật trạng thái UI cho các nút/dropdown chọn ngôn ngữ.
 * @param {string} lang - Mã ngôn ngữ hiện tại ('vi' hoặc 'en').
 */
function updateLanguageUI(lang) {
    console.log(`[Language] Updating UI for lang: ${lang}`);

    // --- Update Dropdown Toggles (Desktop & Mobile) ---
    const langDetails = {
        vi: { name: 'Tiếng Việt', short: 'VN' }, // Use VN for display
        en: { name: 'English', short: 'EN' }
    };
    const currentLangShort = langDetails[lang]?.short || lang.toUpperCase();

    const desktopLangText = document.getElementById('desktop-current-lang');
    const mobileLangText = document.getElementById('mobile-current-lang');

    if (desktopLangText) desktopLangText.textContent = currentLangShort;
    if (mobileLangText) mobileLangText.textContent = currentLangShort;

    // --- Update Language Button States (Options within dropdowns) ---
    const buttons = document.querySelectorAll('.lang-button'); // General class for options
    buttons.forEach(button => {
        if (!button) return;
        const buttonLang = button.getAttribute('data-lang');

        if (buttonLang === lang) {
            button.disabled = true; // Disable the currently selected language
            button.setAttribute('aria-current', 'page'); // Mark as current
            // Add active styling (Tailwind example, adjust based on your CSS)
             // button.classList.add('bg-blue-100', 'text-blue-700', 'font-semibold');
             // button.classList.remove('text-gray-700');
        } else {
            button.disabled = false; // Enable other languages
            button.removeAttribute('aria-current');
            // Remove active styling
             // button.classList.remove('bg-blue-100', 'text-blue-700', 'font-semibold');
             // button.classList.add('text-gray-700');
        }

         // Specific styling based on location (Desktop vs Mobile) if needed
         const isInDesktopDropdown = button.closest('#desktop-language-dropdown');
         const isInMobileDropdown = button.closest('#mobile-language-dropdown');

         if (isInDesktopDropdown) {
             if (button.disabled) {
                 button.classList.add('active-lang-desktop'); // Add specific class if needed
             } else {
                  button.classList.remove('active-lang-desktop');
             }
         } else if (isInMobileDropdown) {
              if (button.disabled) {
                  button.classList.add('active-lang-mobile'); // Add specific class if needed
              } else {
                  button.classList.remove('active-lang-mobile');
              }
         }
    });
}


/**
 * Thiết lập ngôn ngữ cho trang, lưu vào localStorage và cập nhật giao diện.
 * @param {string} lang - Mã ngôn ngữ ('vi' hoặc 'en').
 */
function setLanguage(lang) {
    // Validate language code
    if (!translations[lang]) {
        console.error(`[Language] Invalid language code: ${lang}. Defaulting to 'vi'.`);
        lang = 'vi';
    }

    // 1. Save preference to localStorage
    localStorage.setItem('preferredLanguage', lang);

    // 2. Apply translations to DOM elements
    applyTranslations(lang);

    // 3. Update language switcher UI (buttons/dropdowns)
    updateLanguageUI(lang);

    // 4. Update HTML lang attribute
    document.documentElement.lang = lang;

    console.log(`[Language] Language set to: ${lang}`);

    // 5. Trigger dynamic content updates if necessary
    // Example: Reload news if the news container exists
    if (typeof loadInternalNews === 'function' && document.getElementById('news-container')) {
        console.log("[Language] Reloading internal news after language change...");
        loadInternalNews();
    }
     // Example: Reload RSS feed if the container exists
     if (typeof loadVnExpressFeed === 'function' && document.getElementById('vnexpress-rss-feed')) {
         console.log("[Language] Reloading VnExpress feed after language change...");
         loadVnExpressFeed();
     }
    // Example: Update placement test results text if visible
    if (typeof updatePlacementResultText === 'function') {
        const resultArea = document.getElementById('test-result-area');
        if (resultArea && !resultArea.classList.contains('hidden')) {
            console.log("[Language] Updating placement test results text after language change...");
            updatePlacementResultText(lang); // Assumes this function gets score/level elsewhere
        }
    }
     // Example: Re-highlight active menu item as text might have changed
     if (typeof initializeActiveMenuHighlighting === 'function') {
          const headerElement = document.querySelector('#header-placeholder #navbar');
          if (headerElement) {
               console.log("[Language] Re-highlighting active menu item...");
               initializeActiveMenuHighlighting(headerElement);
          }
     }
}


/**
 * Xử lý sự kiện khi người dùng bấm nút chuyển ngôn ngữ.
 * This is the function called by the event listener wrapper in script.js
 * @param {Event} event - Đối tượng sự kiện click.
 */
function handleLanguageChange(event) {
    const button = event.currentTarget;
    // Ignore if button is disabled (already selected language)
    if (button.disabled) {
        return;
    }
    const lang = button.getAttribute('data-lang');
    console.log(`[Language] Language change requested via button to: ${lang}`);
    if (lang) {
        setLanguage(lang);
    }
}

/**
 * Khởi tạo chức năng ngôn ngữ.
 * Called by script.js AFTER header/footer components are loaded/attempted.
 */
function initializeLanguage() {
    // Check the global flag to prevent multiple initializations
    if (window.languageInitialized) {
        console.warn("[Language] Initialization skipped: Already initialized.");
        return;
    }
    console.log("[Language] Initializing language system...");

    // Get preferred language from localStorage or default to 'vi'
    const preferredLanguage = localStorage.getItem('preferredLanguage') || 'vi';

    // Set the initial language (applies translations, updates UI)
    // Note: Event listeners are attached by script.js *after* this runs,
    // ensuring buttons exist before listeners are added.
    setLanguage(preferredLanguage);

    // Set the global flag
    window.languageInitialized = true;
    console.log("[Language] Initialization complete.");
}

// --- Placement Test Result Text Update (Example Function) ---
/**
 * Updates the text content of the English placement test result area.
 * (Placeholder - needs actual score/level logic)
 * @param {string} lang - The target language ('vi' or 'en').
 */
function updatePlacementResultText(lang) {
    console.log(`[Language] Updating placement result text for lang: ${lang}`);
    const estimatedLevelEl = document.getElementById('estimated-level');
    const levelDescEl = document.getElementById('level-description');
    const coursesListEl = document.getElementById('suggested-courses');

    if (!estimatedLevelEl || !levelDescEl || !coursesListEl) {
        console.warn("[Language] Placement result elements not found, cannot update text.");
        return;
    }

    // --- Placeholder Result Logic ---
    const testResult = JSON.parse(sessionStorage.getItem('placementTestResult') || '{}');
    const determinedLevel = testResult.level || 'B1'; // Default if no result
    // --- End Placeholder ---

    const resultData = { /* ... (result data object as before) ... */ }; // Keep the resultData object
     const currentResult = resultData[lang]?.[determinedLevel] || resultData['vi']?.[determinedLevel] || { level: 'N/A', description: '...', courses: [] };

     estimatedLevelEl.textContent = currentResult.level;
     levelDescEl.textContent = currentResult.description;

     coursesListEl.innerHTML = '';
     if (currentResult.courses && currentResult.courses.length > 0) {
         currentResult.courses.forEach(course => {
             const li = document.createElement('li');
             const a = document.createElement('a');
             a.href = course.link || '#';
             a.textContent = course.name;
             a.className = 'text-blue-600 hover:underline';
             li.appendChild(a);
             coursesListEl.appendChild(li);
         });
     } else {
         const li = document.createElement('li');
         li.textContent = lang === 'vi' ? 'Không có khóa học gợi ý.' : 'No suggested courses.';
         li.className = 'text-gray-500 italic';
         coursesListEl.appendChild(li);
     }
}

// Note: The specific dropdown UI logic (toggleDropdown, setLanguageUI, changeLanguage)
// and the related DOMContentLoaded listener have been removed as they were conflicting
// with the primary language system (handleLanguageChange, updateLanguageButtonStates)
// and the initialization flow managed by script.js.
// The core functions applyTranslations, updateLanguageUI (renamed from updateLanguageButtonStates),
// setLanguage, handleLanguageChange, and initializeLanguage are kept and refined.
