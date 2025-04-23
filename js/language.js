// /js/language.js
// Version: Cleaned up Markdown syntax from revised translations

// Đối tượng lưu trữ các bản dịch
const translations = {
    vi: {
        // --- Giữ nguyên các key Meta Tags và Header ---
        about_page_title: "Về Chúng Tôi - IVS JSC",
        about_meta_description: "Tìm hiểu về IVS JSC - Công ty Cổ phần Dịch vụ Thương mại Integrate Vision Synergy, sứ mệnh, tầm nhìn, giá trị cốt lõi, đội ngũ lãnh đạo và các lĩnh vực hoạt động.",
        about_og_title: "Về Chúng Tôi - IVS JSC",
        about_og_description: "Khám phá IVS JSC: Kết nối giáo dục Việt Nam với công nghệ tiên tiến và chuẩn quốc tế.",
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
        page_title_establishment: "Dịch vụ Thành lập Trung tâm Ngoại ngữ - Tin học - Kỹ năng sống | IVS Education",
        meta_description_establishment: "IVS Education cung cấp dịch vụ tư vấn và hỗ trợ trọn gói thủ tục thành lập trung tâm ngoại ngữ, tin học, kỹ năng sống theo đúng quy định pháp luật.",
        og_title_establishment: "Dịch vụ Thành lập Trung tâm Ngoại ngữ - Tin học - Kỹ năng sống | IVS Education",
        og_description_establishment: "Hỗ trợ từ A-Z: Tư vấn điều kiện, chuẩn bị hồ sơ, soạn thảo đề án, làm việc với cơ quan chức năng.",
        og_image_establishment: "https://placehold.co/1200x630/3b82f6/ffffff?text=Thành+Lập+Trung+Tâm+IVS",
        page_title_webdesign: "Dịch vụ Thiết kế Website Chuyên nghiệp - IVS Tech Solutions",
        meta_description_webdesign: "IVS JSC (IVS Tech Solutions) cung cấp dịch vụ thiết kế website chuyên nghiệp, chuẩn SEO, responsive, tối ưu cho doanh nghiệp và giáo dục.",
        og_title_webdesign: "Dịch vụ Thiết kế Website Chuyên nghiệp - IVS Tech Solutions",
        og_description_webdesign: "IVS JSC cung cấp dịch vụ thiết kế website chuyên nghiệp, chuẩn SEO, responsive, tối ưu cho doanh nghiệp và giáo dục.",
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
        menu_hay_noi_club: "CLB Hãy Nói",
        menu_cooperation: "Hợp tác",
        menu_international_link: "Liên kết Quốc tế",
        menu_iivsa_alliance: "Liên minh IIVSA",
        menu_educational_link: "Liên kết giáo dục",
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

        // --- Giữ nguyên các key Index Page và About Page ---
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
        about_values_strong: "Chất lượng – Tận tâm – Sáng tạo – Bình đẳng.", // Giữ nguyên Markdown nếu muốn hàm applyTranslations xử lý
        about_values_desc: " Chúng tôi cam kết mang đến dịch vụ giáo dục tốt nhất với sự tận tụy, không ngừng đổi mới và đảm bảo cơ hội học tập công bằng cho mọi người.",
        about_leadership_heading: "Đội Ngũ Lãnh Đạo",
        about_leadership_img_alt: "Nguyễn Minh Triết - CEO",
        about_leadership_name: "Ông Nguyễn Minh Triết",
        about_leadership_title: "Tổng Giám đốc (CEO) kiêm Chủ tịch HĐQT",
        about_leadership_desc: "Với nền tảng vững chắc về Ngôn ngữ Anh, Quản trị Kinh doanh (MBA - ĐH FPT) và kinh nghiệm quản lý giáo dục, ông Triết dẫn dắt IVS JSC bằng tầm nhìn chiến lược và tâm huyết với sự nghiệp giáo dục. Ông có kinh nghiệm làm việc tại các tổ chức uy tín như VietJet Air, The Grand Ho Tram Strip và AMG Education.",
        about_leadership_link: "Xem thêm thông tin",
        about_areas_heading: "Lĩnh Vực Hoạt Động Chính",
        about_area1_strong: "IVS Academy:", // Giữ nguyên Markdown nếu muốn hàm applyTranslations xử lý
        about_area1_desc: " Trung tâm đào tạo ngôn ngữ (Anh, Nhật, Hàn, Trung) và kỹ năng mềm, kỹ năng sống.",
        about_area2_strong: "IVS Education:", // Giữ nguyên Markdown nếu muốn hàm applyTranslations xử lý
        about_area2_desc: " Phát triển chương trình STEAM, giải pháp học tập số, và tư vấn xây dựng trường học/trung tâm theo chuẩn quốc tế.",
        about_area3_strong: "Liên kết Quốc tế:", // Giữ nguyên Markdown nếu muốn hàm applyTranslations xử lý
        about_area3_desc: " Hợp tác với các đối tác giáo dục toàn cầu (ví dụ: The Power to Inspire - Mỹ, Dự án Kinderlink25) để mang chương trình và phương pháp tiên tiến về Việt Nam.",
        about_area4_strong: "Nghiên cứu & Phát triển (R&D):", // Giữ nguyên Markdown nếu muốn hàm applyTranslations xử lý
        about_area4_desc: " Không ngừng nghiên cứu và phát triển các chương trình giáo dục mới, phù hợp với xu thế và nhu cầu thực tiễn.",
        about_partners_heading: "Đối Tác và Liên Kết Tiêu Biểu",
        about_partner1: "Liên minh giáo dục toàn cầu IIVSA (Thành viên chính thức)",
        about_partner2: "The Power to Inspire (Hoa Kỳ) - Đối tác chiến lược",
        about_partner3: "Dự án Kinderlink25 - Hợp tác phát triển chương trình mầm non",
        about_partner4: "Các trường học, trung tâm đào tạo và tổ chức giáo dục trong và ngoài nước.",
        about_partners_p: "Chúng tôi tin rằng sự hợp tác chặt chẽ sẽ tạo nên sức mạnh tổng hợp, thúc đẩy sự phát triển của giáo dục.",

        // --- Giữ nguyên các key Footer ---
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
        footer_email_link: "ivsacademy.edu@gmail.com",
        footer_zalo_link: "Nguyễn Minh Triết (IVS)",
        footer_map_title: "Bản đồ",

        // --- Giữ nguyên các key trang R&D, Tài trợ, Celestech, Placement, Establishment ---
        rnd_hero_title: "Thiết kế Học liệu & Giải pháp EdTech theo Yêu cầu",
        // ... (các key khác của trang R&D) ...
        rnd_cta_button: "Liên hệ Tư vấn R&D",
        sponsorship_hero_title: "Tài trợ Cộng đồng - Đồng hành cùng IVS Kiến tạo Giá trị",
        // ... (các key khác của trang Tài trợ) ...
        sponsorship_cta_button: "Liên hệ Tài trợ Ngay",
        celestech_hero_title: "IVS Celestech - Giải pháp Công nghệ Giáo dục Toàn diện",
        // ... (các key khác của trang Celestech) ...
        celestech_cta_button: "Yêu cầu Tư vấn Giải pháp",
        placement_hero_title: "Kiểm tra Năng lực Tiếng Anh Trực tuyến",
        // ... (các key khác của trang Placement) ...
        sample_option_d: "Đáp án D",
        establishment_hero_title: "Thành lập Trung tâm Ngoại ngữ - Tin học - Kỹ năng sống",
        // ... (các key khác của trang Establishment) ...
        establishment_cta_button: "Yêu cầu Tư vấn Ngay",

        // --- Giữ nguyên các key trang Đăng ký tư vấn ---
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

        // --- Thêm key cho trang Hướng dẫn AI ---
        page_title_ai_guide: "Hướng dẫn Tư duy AI theo Ngành nghề - IVS Education",
        meta_description_ai_guide: "Khám phá cách áp dụng tư duy AI hiệu quả trong các ngành Giáo dục, Y tế, Tài chính, Bán lẻ, Sản xuất, Nông nghiệp, Du lịch cùng IVS Education.",
        og_title_ai_guide: "Hướng dẫn Tư duy AI theo Ngành nghề - IVS Education",
        og_description_ai_guide: "Định hình tư duy nền tảng để ứng dụng AI thành công, bất kể công cụ bạn sử dụng.",
        ai_guide_page_title: "Hướng dẫn Tư duy AI theo Ngành nghề",
        ai_guide_page_subtitle: "Định hình tư duy nền tảng để ứng dụng Trí tuệ Nhân tạo thành công trong công việc của bạn.",
        ai_guide_developed_by: "Phát triển bởi IVS Education (Một đơn vị của IVS JSC)",
        ai_guide_importance_title: "Tầm Quan Trọng Của Tư Duy Khi Sử Dụng AI",
        ai_guide_importance_subtitle: "The Importance of Mindset When Using AI",
        ai_guide_importance_p1_revised: "Thế giới Trí tuệ Nhân tạo (AI) ngày nay mang đến vô vàn công cụ với đủ loại tính năng, hiệu năng và chất lượng. Từ các mô hình ngôn ngữ lớn phức tạp đến những ứng dụng chuyên biệt cho từng ngành, sự lựa chọn vô cùng phong phú.", // Xóa **
        ai_guide_importance_p2_revised: "Tuy nhiên, điều cốt lõi cần ghi nhớ: Công cụ AI, dù tinh vi đến đâu, cũng chỉ là phương tiện. Chất lượng đầu ra không chỉ phụ thuộc vào công cụ, mà phần lớn được quyết định bởi chính tư duy của người dùng. Khả năng xác định đúng vấn đề, cách đặt câu hỏi sắc bén, sự rõ ràng trong yêu cầu, cùng năng lực đánh giá và tinh chỉnh kết quả do AI tạo ra – đó mới là những yếu tố then chốt để khai thác tối đa tiềm năng của AI, biến nó thành những thành quả thực sự hữu ích và vượt trội.", // Xóa **
        ai_guide_foreword_title: "Lời nói đầu",
        ai_guide_foreword_subtitle: "Foreword",
        ai_guide_foreword_p1_revised: "Việc ứng dụng Trí tuệ Nhân tạo (AI) hiệu quả không khởi nguồn từ công nghệ phức tạp, mà bắt đầu từ tư duy – khả năng nhìn nhận vấn đề và nắm bắt cơ hội qua lăng kính của AI. Ngày nay, chúng ta có quyền truy cập vào vô số công cụ AI mạnh mẽ và đa dạng.", // Xóa **
        ai_guide_foreword_p2_revised: "Tuy nhiên, tài liệu này không nhằm mục đích đánh giá hay hướng dẫn chi tiết từng công cụ. Thay vào đó, chúng tôi tập trung vào việc định hình tư duy nền tảng. Thay vì băn khoăn \"Nên dùng công cụ AI nào?\", hãy bắt đầu bằng câu hỏi: \"Vấn đề nào có thể được giải quyết hiệu quả hơn, hoặc cơ hội nào có thể được khai thác tốt hơn nhờ khả năng phân tích, dự đoán, và tự động hóa của AI?\". Khi hiểu đúng bản chất, đặt đúng câu hỏi và tiếp cận với một tư duy cởi mở, bạn sẽ nhận thấy việc ứng dụng AI trở nên dễ dàng hơn nhiều, bất kể công cụ bạn lựa chọn là gì.", // Xóa **
        ai_guide_tools_title: "Giới thiệu một số Công cụ AI Phổ biến (Tham khảo)",
        ai_guide_tools_subtitle: "Introduction to Some Popular AI Tools (Reference)",
        ai_guide_tools_intro_revised: "Bảng dưới đây liệt kê một số loại hình và công cụ AI tiêu biểu đang được sử dụng rộng rãi, nhằm minh họa sự đa dạng của các giải pháp hiện có. Đây không phải là danh sách đầy đủ hay một lời khuyên sử dụng công cụ cụ thể nào.",
        ai_tools_header_type: "Loại hình chính",
        ai_tools_header_example: "Ví dụ Công cụ",
        ai_tools_header_dev: "Nhà phát triển/Nguồn",
        ai_tools_header_desc: "Mô tả Ngắn gọn",
        ai_tools_header_link: "Liên kết",
        ai_tool_type_llm: "Tạo sinh Ngôn ngữ (LLMs)",
        ai_tool_desc_chatgpt: "Tạo văn bản, trả lời câu hỏi, dịch thuật, viết mã",
        ai_tool_desc_gemini: "Tương tự ChatGPT, tích hợp sâu với hệ sinh thái Google",
        ai_tool_desc_claude: "Tập trung vào an toàn và đạo đức AI, khả năng xử lý ngữ cảnh dài",
        ai_tool_desc_grok: "LLM tích hợp với X (Twitter), tập trung vào thông tin thời gian thực và hài hước",
        ai_tool_desc_deepseek: "LLM mạnh về viết mã (code generation) và song ngữ",
        ai_tool_desc_copilot: "Trợ lý AI tích hợp trong các ứng dụng Microsoft 365",
        ai_tool_link_access: "Truy cập",
        ai_tool_type_conv_search: "Công cụ Tìm kiếm/Trả lời Hỏi đáp",
        ai_tool_desc_perplexity: "Công cụ tìm kiếm đối thoại, cung cấp câu trả lời kèm nguồn trích dẫn",
        ai_tool_type_image_gen: "Tạo sinh Hình ảnh",
        ai_tool_desc_midjourney: "Tạo hình ảnh nghệ thuật từ mô tả văn bản",
        ai_tool_desc_stable_diffusion: "Tạo hình ảnh từ văn bản, mã nguồn mở",
        ai_tool_desc_dalle: "Tạo hình ảnh từ mô tả văn bản",
        ai_tool_link_stable_diffusion_webui: "Truy cập (Web UI)",
        ai_tool_type_data_analysis: "Phân tích Dữ liệu & Trực quan hóa",
        ai_tool_desc_tableau: "Phân tích, trực quan hóa dữ liệu kinh doanh, tích hợp AI",
        ai_tool_desc_powerbi: "Tương tự Tableau, tích hợp AI của Microsoft",
        ai_tool_type_speech: "Nhận dạng Giọng nói & Trợ lý ảo",
        ai_tool_desc_google_assistant: "Trợ lý ảo trên điện thoại, loa thông minh",
        ai_tool_desc_siri: "Trợ lý ảo trên thiết bị Apple",
        ai_tool_desc_alexa: "Trợ lý ảo trên thiết bị Amazon Echo",
        ai_tool_type_cv: "Thị giác Máy tính",
        ai_tool_desc_gcp_vision: "Phân tích hình ảnh, nhận dạng đối tượng, văn bản",
        ai_tool_desc_rekognition: "Phân tích hình ảnh và video",
        ai_tool_type_ml_platform: "Nền tảng Học máy",
        ai_tool_desc_tensorflow: "Thư viện mã nguồn mở cho Machine Learning",
        ai_tool_desc_pytorch: "Thư viện mã nguồn mở phổ biến cho Deep Learning",
        ai_guide_tools_note: "*Lưu ý: Bảng này chỉ mang tính tham khảo, giới thiệu một phần nhỏ các công cụ hiện có. Thị trường AI phát triển rất nhanh với nhiều công cụ mới và chuyên biệt liên tục ra đời.",
        ai_guide_section_edu_title: "1. Tư duy AI trong Giáo dục & Đào tạo",
        ai_guide_section_edu_subtitle: "1. AI Mindset in Education & Training",
        ai_guide_core_questions_title: "Câu hỏi cốt lõi:",
        ai_guide_core_questions_subtitle: "Core Questions:",
        ai_guide_edu_q_revised: "Làm thế nào cá nhân hóa lộ trình học tập để mỗi học viên phát huy tối đa tiềm năng? Làm sao tự động hóa các tác vụ lặp lại để giải phóng thời gian cho giáo viên tập trung vào chuyên môn? Làm sao phát hiện sớm và can thiệp kịp thời với những học viên cần hỗ trợ đặc biệt?",
        ai_guide_mindset_title: "Hướng tư duy chi tiết:",
        ai_guide_mindset_subtitle: "Detailed Mindset Approach:",
        ai_guide_human_mindset_title: "Tư duy con người cần có:",
        ai_guide_edu_mindset1_revised: "Khai thác Dữ liệu Học tập: Luôn đặt câu hỏi về ý nghĩa đằng sau dữ liệu (điểm số, thời gian tương tác, tiến độ) để thấu hiểu sâu sắc hơn về từng học viên.", // Xóa **
        ai_guide_edu_mindset2_revised: "Ưu tiên Cá nhân hóa: Nỗ lực tạo ra những trải nghiệm học tập độc đáo, phù hợp với năng lực và tốc độ riêng của mỗi người học, thay vì áp dụng một khuôn mẫu chung.", // Xóa **
        ai_guide_edu_mindset3_revised: "Tinh thần Thử nghiệm & Cải tiến: Sẵn sàng áp dụng thử nghiệm các công cụ AI mới (hệ thống gợi ý, chatbot hỗ trợ) ở quy mô nhỏ, đo lường và đánh giá hiệu quả để cải tiến liên tục.", // Xóa **
        ai_guide_edu_mindset4_revised: "Xem AI là Cộng sự: Coi AI như một trợ lý đắc lực, giúp giảm tải công việc hành chính, cho phép giáo viên dành nhiều thời gian hơn cho việc giảng dạy chuyên sâu và tương tác ý nghĩa với học viên.", // Xóa **
        ai_guide_core_ops_title: "Hiểu cốt lõi vận hành AI (Đơn giản hóa):",
        ai_guide_edu_ops1_revised: "Học từ Dữ liệu Lớn: Khi AI gợi ý bài tập phù hợp, nó dựa trên việc phân tích dữ liệu từ hàng ngàn lộ trình học tập khác nhau để nhận diện mẫu: \"Học viên gặp khó khăn ở khái niệm A thường tiến bộ nhanh hơn khi luyện tập dạng bài tập B\".", // Xóa **
        ai_guide_edu_ops2_revised: "Nhận diện Quy luật & Dự báo: Khi AI cảnh báo nguy cơ học tập, nó tìm kiếm các quy luật ẩn trong dữ liệu (ví dụ: tần suất đăng nhập giảm, tỷ lệ hoàn thành bài tập thấp) để dự đoán khả năng học viên cần hỗ trợ thêm.", // Xóa **
        ai_guide_getting_started_title: "Bắt đầu với AI không hề phức tạp - Gợi ý thực tế:",
        ai_guide_edu_start1_revised: "Tận dụng Tính năng Sẵn có: Khai thác các tính năng AI đã được tích hợp trong hệ thống quản lý học tập (LMS) hoặc các ứng dụng giáo dục bạn đang sử dụng.",
        ai_guide_edu_start2_revised: "Triển khai Chatbot Hỗ trợ: Sử dụng chatbot để tự động trả lời các câu hỏi thường gặp về lịch trình, thủ tục, hoặc cung cấp hướng dẫn cơ bản về tài liệu học tập.",
        ai_guide_edu_start3_revised: "Thí điểm Phân tích Kết quả: Bắt đầu bằng việc dùng AI để phân tích kết quả kiểm tra của một nhóm nhỏ, sau đó đo lường hiệu quả của việc gợi ý tài liệu ôn tập cá nhân hóa đối với kết quả bài kiểm tra tiếp theo.",
        ai_guide_section_health_title: "2. Tư duy AI trong Y tế & Chăm sóc sức khỏe",
        ai_guide_section_health_subtitle: "2. AI Mindset in Healthcare & Well-being",
        ai_guide_health_q_revised: "Làm sao nâng cao độ chính xác và tốc độ chẩn đoán bệnh? Làm thế nào để tối ưu hóa quy trình khám chữa bệnh, giảm thời gian chờ đợi? Làm sao giám sát sức khỏe bệnh nhân từ xa một cách chủ động và hiệu quả?",
        ai_guide_health_mindset1_revised: "Tiếp cận 'Tin tưởng, nhưng Xác minh': Tận dụng các gợi ý chẩn đoán từ AI (ví dụ: phân tích hình ảnh y tế) nhưng luôn đối chiếu và xác thực bằng kinh nghiệm lâm sàng và kiến thức chuyên môn.", // Xóa **
        ai_guide_health_mindset2_revised: "Tập trung vào Hiệu quả Vận hành: Tìm kiếm cơ hội ứng dụng AI để giảm thiểu thời gian chờ đợi, tự động hóa các tác vụ hành chính lặp lại (nhập liệu, lên lịch hẹn), giúp đội ngũ y tế tập trung vào chăm sóc bệnh nhân.", // Xóa **
        ai_guide_health_mindset3_revised: "Ưu tiên Bảo mật & Đạo đức: Luôn đặt việc bảo vệ dữ liệu nhạy cảm của bệnh nhân và đảm bảo tính công bằng, minh bạch của thuật toán AI lên hàng đầu trong mọi ứng dụng.", // Xóa **
        ai_guide_health_ops1_revised: "Nhận dạng Hình ảnh Y tế: Khi AI phân tích ảnh X-quang hay CT scan, nó đối chiếu các đặc điểm ảnh với hàng triệu ảnh đã được gán nhãn bởi chuyên gia (bình thường/có dấu hiệu bệnh lý) để phát hiện các dấu hiệu bất thường tiềm ẩn.", // Xóa **
        ai_guide_health_ops2_revised: "Phân tích Dữ liệu & Dự báo: Khi AI giám sát bệnh nhân từ xa, nó phân tích liên tục các luồng dữ liệu sinh tồn (nhịp tim, SpO2, huyết áp) và so sánh với các mẫu \"bình thường\" và \"nguy cơ\" đã học được để đưa ra cảnh báo sớm.", // Xóa **
        ai_guide_health_start1_revised: "Tối ưu Quản lý Hành chính: Sử dụng các phần mềm quản lý phòng khám/bệnh viện có tích hợp AI để tối ưu hóa việc đặt lịch hẹn, quản lý hồ sơ bệnh án điện tử (EMR).",
        ai_guide_health_start2_revised: "Công cụ Hỗ trợ Tra cứu Lâm sàng: Thử nghiệm các công cụ AI giúp bác sĩ nhanh chóng tra cứu thông tin y khoa, các nghiên cứu mới nhất, hoặc phác đồ điều trị cập nhật.",
        ai_guide_health_start3_revised: "Tham gia Dự án Thí điểm: Hợp tác với các đối tác công nghệ để thử nghiệm ứng dụng AI trong các lĩnh vực cụ thể (ví dụ: hỗ trợ phân tích hình ảnh, dự đoán nguy cơ tái nhập viện) trong phạm vi được kiểm soát chặt chẽ.",
        ai_guide_section_finance_title: "3. Tư duy AI trong Tài chính & Ngân hàng",
        ai_guide_section_finance_subtitle: "3. AI Mindset in Finance & Banking",
        ai_guide_finance_q_revised: "Làm thế nào nâng cao hiệu quả phát hiện và ngăn chặn gian lận? Làm sao đẩy nhanh quy trình đánh giá rủi ro tín dụng mà vẫn đảm bảo tính công bằng? Làm sao cung cấp dịch vụ hỗ trợ khách hàng tức thì, mọi lúc mọi nơi?",
        ai_guide_finance_mindset1_revised: "Tư duy Phân tích & Nghi ngờ: Luôn tìm kiếm các mẫu hình bất thường hoặc điểm không nhất quán trong dữ liệu giao dịch, coi AI là công cụ mạnh mẽ để khuếch đại khả năng phát hiện này.", // Xóa **
        ai_guide_finance_mindset2_revised: "Ra quyết định Dựa trên Dữ liệu: Đưa ra các quyết định nghiệp vụ (ví dụ: phê duyệt khoản vay, đánh giá rủi ro) dựa trên phân tích dữ liệu khách quan từ AI, kết hợp hài hòa với kinh nghiệm và phán đoán chuyên môn.", // Xóa **
        ai_guide_finance_mindset3_revised: "Nâng cao Trải nghiệm Khách hàng: Tìm cách ứng dụng AI (chatbot, trợ lý ảo, gợi ý cá nhân hóa) để mọi tương tác của khách hàng trở nên nhanh chóng, liền mạch, thuận tiện và phù hợp hơn với nhu cầu cá nhân.", // Xóa **
        ai_guide_finance_ops1_revised: "Phát hiện Bất thường (Anomaly Detection): Hệ thống chống gian lận AI liên tục \"học\" các mẫu giao dịch thông thường. Khi một giao dịch đi chệch khỏi các mẫu này (ví dụ: vị trí địa lý lạ, số tiền đột biến, tần suất bất thường), AI sẽ đưa ra cảnh báo để xem xét kỹ hơn.", // Xóa **
        ai_guide_finance_ops2_revised: "Phân loại & Dự đoán Rủi ro: Mô hình chấm điểm tín dụng AI phân loại khách hàng vào các nhóm rủi ro khác nhau bằng cách \"học\" mối tương quan giữa hàng loạt yếu tố (thu nhập, lịch sử tín dụng, tỷ lệ nợ,...) và khả năng trả nợ đã được ghi nhận trong quá khứ.", // Xóa **
        ai_guide_finance_start1_revised: "Triển khai Chatbot Hỗ trợ Cơ bản: Tự động hóa việc trả lời các câu hỏi thường gặp về sản phẩm, dịch vụ, lãi suất, phí... để giảm tải cho bộ phận hỗ trợ khách hàng.",
        ai_guide_finance_start2_revised: "Khai thác Báo cáo Phân tích: Sử dụng các công cụ phân tích dữ liệu tích hợp AI để trực quan hóa xu hướng, hiểu rõ hơn hành vi khách hàng và hiệu quả của các chiến dịch marketing.",
        ai_guide_finance_start3_revised: "Thử nghiệm Gợi ý Sản phẩm Đơn giản: Bắt đầu bằng việc gợi ý các sản phẩm tài chính cơ bản (ví dụ: tài khoản tiết kiệm phù hợp, thẻ tín dụng cơ bản) dựa trên phân tích hồ sơ và lịch sử giao dịch của khách hàng.",
        ai_guide_section_retail_title: "4. Tư duy AI trong Bán lẻ & Thương mại điện tử",
        ai_guide_section_retail_subtitle: "4. AI Mindset in Retail & E-commerce",
        ai_guide_retail_q_revised: "Làm sao tạo ra trải nghiệm mua sắm cá nhân hóa, khiến mỗi khách hàng cảm thấy được thấu hiểu? Làm sao dự báo chính xác nhu cầu thị trường để tối ưu hóa hàng tồn kho và giảm lãng phí? Làm sao nắm bắt nhanh chóng tâm lý và phản hồi của khách hàng trên mọi kênh?",
        ai_guide_retail_mindset1_revised: "Lấy Khách hàng làm Trung tâm: Chuyển dịch trọng tâm từ 'bán sản phẩm hiện có' sang 'đáp ứng và dự đoán nhu cầu khách hàng'. Luôn tự vấn: \"Làm thế nào AI giúp tôi phân tích dữ liệu để hiểu và phục vụ khách hàng này một cách tốt nhất?\".", // Xóa **
        ai_guide_retail_mindset2_revised: "Tối ưu hóa Liên tục: Nhìn nhận mọi quy trình (đặt hàng, quản lý kho, định giá, marketing) như một cơ hội cải tiến và đặt câu hỏi: \"AI có thể tự động hóa, tăng tốc, hoặc giảm chi phí cho bước này không?\".", // Xóa **
        ai_guide_retail_mindset3_revised: "Nhạy bén với Dữ liệu Khách hàng: Coi mọi điểm chạm của khách hàng (lượt xem trang, click, giỏ hàng bị bỏ quên, đánh giá sản phẩm) là nguồn dữ liệu vô giá để AI khai thác và đưa ra gợi ý hành động.", // Xóa **
        ai_guide_retail_mindset4_revised: "Sẵn sàng Tự động hóa Thông minh: Tin tưởng giao phó các tác vụ lặp lại và tốn thời gian (phản hồi chat cơ bản, cập nhật trạng thái đơn hàng, phân loại phản hồi) cho AI, để đội ngũ nhân viên tập trung vào các hoạt động giá trị cao hơn như tư vấn chuyên sâu, giải quyết khiếu nại phức tạp.", // Xóa **
        ai_guide_retail_ops1_revised: "Học Sở thích & Hành vi: Khi bạn thấy gợi ý \"Sản phẩm thường được mua cùng\" hoặc \"Gợi ý cho bạn\", đó là AI đã phân tích lịch sử mua hàng và hành vi duyệt web của hàng triệu người để tìm ra các mối liên kết và dự đoán sở thích của bạn.", // Xóa **
        ai_guide_retail_ops2_revised: "Dự báo Nhu cầu & Tối ưu Tồn kho: AI phân tích dữ liệu bán hàng lịch sử, kết hợp các yếu tố mùa vụ, xu hướng thị trường, chiến dịch khuyến mãi, thậm chí cả dữ liệu thời tiết, để dự báo nhu cầu cho từng sản phẩm và đề xuất mức tồn kho tối ưu.", // Xóa **
        ai_guide_retail_ops3_revised: "Phân tích Ngôn ngữ Tự nhiên (NLP): Khi AI phân tích đánh giá khách hàng, nó sử dụng NLP để \"hiểu\" nội dung, xác định các chủ đề chính được đề cập (giá, chất lượng, vận chuyển,...) và phân loại cảm xúc (tích cực, tiêu cực, trung tính) liên quan đến từng chủ đề.", // Xóa **
        ai_guide_retail_start1_revised: "Kích hoạt Gợi ý Sản phẩm: Tận dụng các tính năng gợi ý sản phẩm tích hợp sẵn trên nền tảng thương mại điện tử hoặc website của bạn và theo dõi tỷ lệ chuyển đổi.",
        ai_guide_retail_start2_revised: "Sử dụng Chatbot Cơ bản: Cài đặt chatbot để xử lý tự động các yêu cầu phổ biến như kiểm tra tình trạng đơn hàng, hỏi về chính sách đổi trả, hoặc cung cấp thông tin sản phẩm cơ bản.",
        ai_guide_retail_start3_revised: "Phân tích Báo cáo Thông minh: Tập trung vào các báo cáo và dashboard được tạo bởi AI (thường có trong các công cụ phân tích hoặc nền tảng TMĐT) để nắm bắt insight về sản phẩm bán chạy, phân khúc khách hàng tiềm năng.",
        ai_guide_retail_start4_revised: "Thử nghiệm Quảng cáo Tự động: Sử dụng các tính năng quảng cáo thông minh trên Google Ads, Facebook Ads,... cho phép AI tự động tối ưu hóa việc nhắm mục tiêu đối tượng và phân bổ ngân sách quảng cáo.",
        ai_guide_section_manu_title: "5. Tư duy AI trong Sản xuất & Công nghiệp",
        ai_guide_section_manu_subtitle: "5. AI Mindset in Manufacturing & Industry",
        ai_guide_manu_q_revised: "Làm sao phát hiện khuyết tật sản phẩm với độ chính xác cao và ngay trong dây chuyền? Làm thế nào dự đoán và ngăn chặn sự cố máy móc trước khi chúng xảy ra? Làm sao tối ưu hóa luồng công việc, logistics nội bộ và chuỗi cung ứng?",
        ai_guide_manu_mindset1_revised: "Tư duy Phòng ngừa & Dự đoán: Chuyển từ phản ứng (sửa chữa khi hỏng) sang chủ động phòng ngừa (bảo trì dự đoán, dự báo sự cố). Luôn hỏi: \"Làm sao biết trước và ngăn chặn vấn đề?\".", // Xóa **
        ai_guide_manu_mindset2_revised: "Cam kết Chất lượng Toàn diện: Tìm cách ứng dụng AI (đặc biệt là Computer Vision) để thực hiện kiểm tra chất lượng 100% sản phẩm tự động, giảm thiểu tối đa lỗi lọt qua.", // Xóa **
        ai_guide_manu_mindset3_revised: "Tối ưu hóa Từng Công đoạn: Liên tục tìm kiếm cơ hội cải thiện hiệu suất dây chuyền, giảm thời gian chết của máy móc, tối ưu hóa lộ trình di chuyển của nguyên vật liệu và thành phẩm, dù là những cải tiến nhỏ.", // Xóa **
        ai_guide_manu_mindset4_revised: "Đặt An toàn Lên hàng đầu: Xem xét cách AI có thể hỗ trợ giám sát môi trường làm việc, phát hiện các hành vi hoặc điều kiện không an toàn tiềm ẩn và đưa ra cảnh báo kịp thời.", // Xóa **
        ai_guide_manu_ops1_revised: "Thị giác Máy tính (Computer Vision): Hệ thống kiểm tra chất lượng sử dụng camera để chụp ảnh sản phẩm, sau đó AI so sánh các đặc điểm (kích thước, màu sắc, bề mặt) với mẫu chuẩn đã được \"dạy\" để phát hiện sai lệch, dù rất nhỏ.", // Xóa **
        ai_guide_manu_ops2_revised: "Phân tích Dữ liệu Cảm biến: Các cảm biến gắn trên máy móc liên tục ghi nhận dữ liệu (rung động, nhiệt độ, áp suất). AI phân tích các chuỗi dữ liệu theo thời gian này, tìm kiếm những mẫu hình bất thường (so với hoạt động bình thường) có thể báo hiệu sự cố sắp xảy ra.", // Xóa **
        ai_guide_manu_ops3_revised: "Tối ưu hóa Quy trình (Optimization): Khi tối ưu hóa logistics nội bộ, AI xem xét vô số biến số (bố trí nhà máy, vị trí kho, lịch trình sản xuất, tình trạng tắc nghẽn) để tính toán và đề xuất lộ trình di chuyển hiệu quả nhất cho robot tự hành (AGV) hoặc công nhân.", // Xóa **
        ai_guide_manu_start1_revised: "Kiểm tra Chất lượng bằng Hình ảnh: Bắt đầu với việc triển khai hệ thống camera và phần mềm AI cơ bản trên một công đoạn quan trọng để tự động phát hiện các lỗi bề mặt rõ ràng hoặc sai sót lắp ráp đơn giản.",
        ai_guide_manu_start2_revised: "Giám sát Tình trạng Máy móc Cơ bản: Sử dụng các phần mềm phân tích có sẵn để theo dõi dữ liệu từ các cảm biến hiện có (nhiệt độ, rung động), thiết lập cảnh báo khi vượt ngưỡng an toàn hoặc phát hiện xu hướng bất thường.",
        ai_guide_manu_start3_revised: "Thử nghiệm Robot Tự hành (AGV) Đơn giản: Áp dụng AGV cho các nhiệm vụ vận chuyển vật liệu lặp đi lặp lại, có lộ trình cố định và ít phức tạp trong nhà xưởng.",
        ai_guide_manu_start4_revised: "Phân tích Hiệu suất Dây chuyền: Sử dụng các công cụ Business Intelligence (BI) có khả năng tích hợp AI để phân tích dữ liệu sản xuất (OEE, thời gian chu kỳ, tỷ lệ lỗi), xác định các điểm nghẽn và cơ hội cải tiến.",
        ai_guide_section_agri_title: "6. Tư duy AI trong Nông nghiệp",
        ai_guide_section_agri_subtitle: "6. AI Mindset in Agriculture",
        ai_guide_agri_q_revised: "Làm sao cung cấp chính xác lượng nước và dinh dưỡng cần thiết cho từng khu vực cây trồng hoặc từng cá thể vật nuôi? Làm thế nào phát hiện sớm các dấu hiệu sâu bệnh, dịch bệnh để xử lý kịp thời? Làm sao dự báo năng suất và chất lượng nông sản một cách đáng tin cậy?",
        ai_guide_agri_mindset1_revised: "Quan sát Tinh tế & Kết hợp Dữ liệu: Chú ý đến những biểu hiện nhỏ nhất của cây trồng, vật nuôi và môi trường xung quanh; xem dữ liệu từ cảm biến, hình ảnh như một cách \"mở rộng giác quan\" để đưa ra nhận định chính xác hơn.", // Xóa **
        ai_guide_agri_mindset2_revised: "Tư duy Canh tác/Chăn nuôi Chính xác: Hướng tới việc cung cấp đúng yếu tố đầu vào (nước, phân bón, thuốc, thức ăn) cho đúng vị trí, đúng thời điểm và đúng liều lượng cần thiết, thay vì áp dụng đồng loạt trên diện rộng.", // Xóa **
        ai_guide_agri_mindset3_revised: "Thích ứng Chủ động với Môi trường: Sử dụng AI để phân tích và dự báo các yếu tố môi trường (thời tiết, chất lượng đất, độ ẩm) nhằm đưa ra các quyết định canh tác, chăn nuôi hoặc điều chỉnh kế hoạch một cách kịp thời và hiệu quả.", // Xóa **
        ai_guide_agri_mindset4_revised: "Tối ưu hóa Hiệu quả Tài nguyên: Luôn tìm cách giảm thiểu lãng phí và sử dụng các nguồn lực (nước, phân bón, năng lượng, thức ăn) một cách hiệu quả và bền vững nhất với sự hỗ trợ của phân tích và dự báo từ AI.", // Xóa **
        ai_guide_agri_ops1_revised: "Phân tích Hình ảnh Nông nghiệp: Khi AI phân tích ảnh chụp từ drone hoặc vệ tinh, nó so sánh các đặc điểm quang phổ (màu sắc, chỉ số thực vật NDVI) với cơ sở dữ liệu đã được \"huấn luyện\" để xác định tình trạng sức khỏe cây trồng, mức độ thiếu hụt dinh dưỡng, hoặc các vùng bị sâu bệnh.", // Xóa **
        ai_guide_agri_ops2_revised: "Mô hình hóa & Dự báo Năng suất: AI xây dựng các mô hình phức tạp bằng cách \"học\" mối liên hệ giữa vô số yếu tố đầu vào (dữ liệu thời tiết lịch sử và dự báo, loại đất, giống cây trồng, lịch sử canh tác, lượng phân bón) và năng suất thực tế đã thu hoạch trong quá khứ để đưa ra dự báo cho vụ mùa hiện tại.", // Xóa **
        ai_guide_agri_ops3_revised: "Ra quyết định Tối ưu: Khi đưa ra khuyến nghị tưới tiêu hoặc bón phân, AI tích hợp dữ liệu thời gian thực từ cảm biến (độ ẩm đất, độ dẫn điện EC), dự báo thời tiết ngắn hạn, và giai đoạn sinh trưởng của cây trồng để tính toán chính xác lượng nước hoặc dinh dưỡng cần thiết, tránh thừa hoặc thiếu.", // Xóa **
        ai_guide_agri_start1_revised: "Sử dụng Ứng dụng Nông nghiệp Thông minh: Cài đặt và sử dụng các ứng dụng di động cung cấp thông tin thời tiết nông nghiệp chi tiết, cảnh báo sâu bệnh dựa trên mô hình AI, hoặc nhật ký canh tác số.",
        ai_guide_agri_start2_revised: "Lắp đặt Cảm biến Môi trường Cơ bản: Bắt đầu bằng việc triển khai một số cảm biến đơn giản (đo độ ẩm đất, nhiệt độ, độ ẩm không khí) tại các vị trí chiến lược trong trang trại để thu thập dữ liệu và theo dõi biến động.",
        ai_guide_agri_start3_revised: "Chụp ảnh Drone Định kỳ: Sử dụng drone để chụp ảnh tổng quan đồng ruộng/trang trại theo lịch trình đều đặn. Phân tích các hình ảnh này (thủ công hoặc bằng phần mềm cơ bản) để phát hiện sớm các vùng cây trồng có dấu hiệu bất thường.",
        ai_guide_agri_start4_revised: "Tham khảo Dịch vụ Dự báo: Tìm kiếm và sử dụng các dịch vụ trực tuyến hoặc tư vấn cung cấp dự báo năng suất, cảnh báo dịch bệnh dựa trên mô hình AI cho khu vực và loại cây trồng/vật nuôi cụ thể của bạn.",
        ai_guide_section_hosp_title: "7. Tư duy AI trong Du lịch & Nhà hàng Khách sạn",
        ai_guide_section_hosp_subtitle: "7. AI Mindset in Tourism & Hospitality",
        ai_guide_hosp_q_revised: "Làm thế nào để mang đến những trải nghiệm độc đáo và cá nhân hóa sâu sắc cho từng du khách? Làm sao dự báo chính xác biến động nhu cầu để tối ưu hóa giá phòng/dịch vụ và công suất phục vụ? Làm sao quản lý hiệu quả danh tiếng trực tuyến và tương tác với phản hồi của khách hàng?",
        ai_guide_hosp_mindset1_revised: "Thấu hiểu Khách hàng Toàn diện: Không ngừng tìm hiểu sở thích, nhu cầu tiềm ẩn và hành vi của khách hàng thông qua mọi điểm chạm; xem AI là công cụ phân tích dữ liệu mạnh mẽ để đạt được sự thấu hiểu này.", // Xóa **
        ai_guide_hosp_mindset2_revised: "Linh hoạt trong Định giá & Vận hành: Sẵn sàng điều chỉnh giá cả, phân bổ nguồn lực (nhân sự, phòng ốc) một cách linh hoạt dựa trên các dự báo nhu cầu và công suất theo thời gian thực do AI cung cấp.", // Xóa **
        ai_guide_hosp_mindset3_revised: "Quản lý Danh tiếng Chủ động: Coi trọng mọi đánh giá và phản hồi trực tuyến; sử dụng AI để tự động theo dõi, phân tích cảm xúc, xác định các vấn đề cần ưu tiên và hỗ trợ phản hồi nhanh chóng, chuyên nghiệp.", // Xóa **
        ai_guide_hosp_mindset4_revised: "Tối ưu hóa Quy trình Dịch vụ: Tìm kiếm cơ hội ứng dụng AI để tự động hóa các quy trình lặp lại (check-in/out đơn giản, trả lời câu hỏi thường gặp qua chatbot, gợi ý dịch vụ) nhằm nâng cao hiệu quả và giải phóng nhân viên cho các tương tác cá nhân hóa hơn.", // Xóa **
        ai_guide_hosp_ops1_revised: "Hệ thống Gợi ý (Recommendation Engines): Dựa trên dữ liệu về lịch sử đặt phòng, tìm kiếm, thông tin hồ sơ và hành vi của khách hàng tương tự, AI \"học\" các mẫu sở thích và đề xuất các gói dịch vụ, nâng cấp phòng, hoạt động hoặc nhà hàng phù hợp nhất với từng cá nhân.", // Xóa **
        ai_guide_hosp_ops2_revised: "Định giá Động (Dynamic Pricing): AI phân tích đồng thời nhiều yếu tố (dữ liệu đặt phòng lịch sử, công suất phòng hiện tại, sự kiện địa phương, giá của đối thủ cạnh tranh, ngày trong tuần, thời gian đặt trước,...) để dự báo nhu cầu và tự động điều chỉnh giá phòng/dịch vụ nhằm tối ưu hóa doanh thu và tỷ lệ lấp đầy.", // Xóa **
        ai_guide_hosp_ops3_revised: "Phân tích Cảm xúc Khách hàng: Sử dụng NLP, AI \"đọc\" và phân tích hàng loạt đánh giá, bình luận trên các nền tảng đặt phòng, mạng xã hội để xác định các chủ đề được thảo luận nhiều nhất (ví dụ: sạch sẽ, thái độ nhân viên, chất lượng bữa sáng) và đánh giá cảm xúc chung (tích cực/tiêu cực) đối với từng chủ đề đó.", // Xóa **
        ai_guide_hosp_start1_revised: "Sử dụng Hệ thống Quản lý Doanh thu (RMS): Tận dụng các tính năng dự báo và đề xuất giá tự động có sẵn trong các hệ thống RMS hiện đại hoặc xem xét nâng cấp lên hệ thống có tích hợp AI.",
        ai_guide_hosp_start2_revised: "Triển khai Chatbot Hỗ trợ Khách hàng: Cài đặt chatbot trên website hoặc ứng dụng nhắn tin để trả lời tự động các câu hỏi phổ biến 24/7 về tiện nghi, giờ hoạt động, chính sách hủy phòng, hướng dẫn đường đi.",
        ai_guide_hosp_start3_revised: "Công cụ Quản lý Đánh giá Trực tuyến: Sử dụng các công cụ giúp tổng hợp đánh giá từ nhiều kênh (TripAdvisor, Google, Booking.com,...), có thể tích hợp AI để phân tích cảm xúc và tóm tắt các điểm chính cần chú ý.",
        ai_guide_hosp_start4_revised: "Phân tích Dữ liệu Đặt phòng Cơ bản: Sử dụng các công cụ báo cáo trong hệ thống quản lý khách sạn (PMS) hoặc công cụ BI để xác định các xu hướng đặt phòng, nguồn khách hàng chính, và các dịch vụ được ưa chuộng nhất.",
        ai_guide_emphasis_title: "Nhấn mạnh",
        ai_guide_emphasis_subtitle: "Emphasis",
        ai_guide_emphasis_p1_revised: "Chìa khóa để khai thác sức mạnh của AI không nằm ở việc bạn phải trở thành chuyên gia lập trình, mà ở khả năng đặt đúng câu hỏi chiến lược, nhìn nhận vấn đề kinh doanh qua lăng kính dữ liệu và cơ hội tự động hóa, cùng với tinh thần sẵn sàng thử nghiệm và học hỏi từ các giải pháp mới. AI là một công cụ đắc lực, giúp con người đưa ra quyết định sáng suốt hơn, tối ưu hóa quy trình làm việc và nâng cao hiệu suất tổng thể. Hãy bắt đầu từ những ứng dụng nhỏ, có thể đo lường được, và luôn tập trung vào giá trị thực tiễn mà AI mang lại cho tổ chức của bạn. Việc này hoàn toàn nằm trong khả năng của bạn và đội ngũ.", // Xóa **

    },
    en: {
         // --- Keep Meta Tags and Header keys as before ---
         about_page_title: "About Us - IVS JSC",
         about_meta_description: "Learn about IVS JSC - Integrate Vision Synergy Commercial Service Joint Stock Company, its mission, vision, core values, leadership team, and areas of operation.",
         about_og_title: "About Us - IVS JSC",
         about_og_description: "Discover IVS JSC: Connecting Vietnamese education with advanced technology and international standards.",
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
         page_title_establishment: "Center Establishment Service (Language - IT - Life Skills) | IVS Education",
         meta_description_establishment: "IVS Education provides comprehensive consulting and support services for establishing language, IT, and life skills centers in compliance with legal regulations.",
         og_title_establishment: "Center Establishment Service (Language - IT - Life Skills) | IVS Education",
         og_description_establishment: "A-Z Support: Condition consultation, document preparation, proposal drafting, working with authorities.",
         og_image_establishment: "https://placehold.co/1200x630/3b82f6/ffffff?text=Establish+Center+IVS",
         page_title_webdesign: "Professional Website Design Services - IVS Tech Solutions",
         meta_description_webdesign: "IVS JSC (IVS Tech Solutions) offers professional, SEO-friendly, responsive website design services optimized for businesses and education.",
         og_title_webdesign: "Professional Website Design Services - IVS Tech Solutions",
         og_description_webdesign: "IVS JSC offers professional, SEO-friendly, responsive website design services optimized for businesses and education.",
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
         menu_summer_camp: "Int'l Summer Camp",
         menu_scholarships: "Scholarships",
         menu_hay_noi_club: "Hay Noi Club",
         menu_cooperation: "Cooperation",
         menu_international_link: "International Linkage",
         menu_iivsa_alliance: "IIVSA Alliance",
         menu_educational_link: "Educational Linkage",
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

         // --- Keep Index Page and About Page keys as before ---
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
         about_values_strong: "Quality – Dedication – Creativity – Equality.", // Keep Markdown if handled by applyTranslations
         about_values_desc: " We are committed to delivering the best educational services with dedication, continuous innovation, and ensuring fair learning opportunities for everyone.",
         about_leadership_heading: "Leadership Team",
         about_leadership_img_alt: "Nguyen Minh Triet - CEO",
         about_leadership_name: "Mr. Nguyen Minh Triet",
         about_leadership_title: "CEO & Chairman of the Board",
         about_leadership_desc: "With a solid background in English Language, Business Administration (MBA - FPT University), and educational management experience, Mr. Triet leads IVS JSC with strategic vision and dedication to education. He has experience working at reputable organizations such as VietJet Air, The Grand Ho Tram Strip, and AMG Education.",
         about_leadership_link: "View more details",
         about_areas_heading: "Main Areas of Operation",
         about_area1_strong: "IVS Academy:", // Keep Markdown
         about_area1_desc: " Language training center (English, Japanese, Korean, Chinese) and soft skills, life skills.",
         about_area2_strong: "IVS Education:", // Keep Markdown
         about_area2_desc: " Development of STEAM programs, digital learning solutions, and consulting for building schools/centers according to international standards.",
         about_area3_strong: "International Affiliation:", // Keep Markdown
         about_area3_desc: " Collaborating with global education partners (e.g., The Power to Inspire - USA, Kinderlink25 Project) to bring advanced programs and methods to Vietnam.",
         about_area4_strong: "Research & Development (R&D):", // Keep Markdown
         about_area4_desc: " Continuously researching and developing new educational programs that align with trends and practical needs.",
         about_partners_heading: "Key Partners and Affiliates",
         about_partner1: "IIVSA Global Education Alliance (Official Member)",
         about_partner2: "The Power to Inspire (USA) - Strategic Partner",
         about_partner3: "Kinderlink25 Project - Early Childhood Program Development Collaboration",
         about_partner4: "Domestic and international schools, training centers, and educational organizations.",
         about_partners_p: "We believe that close collaboration creates synergy, driving the development of education.",

         // --- Keep Footer keys as before ---
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
         footer_email_link: "ivsacademy.edu@gmail.com",
         footer_zalo_link: "Nguyen Minh Triet (IVS)", // Or desired English text
         footer_map_title: "Map",

         // --- Keep R&D, Sponsorship, Celestech, Placement, Establishment keys as before ---
         rnd_hero_title: "Custom Curriculum & EdTech Solutions",
         // ... (other R&D keys) ...
         rnd_cta_button: "Contact R&D Consulting",
         sponsorship_hero_title: "Community Sponsorship - Partner with IVS to Create Value",
         // ... (other Sponsorship keys) ...
         sponsorship_cta_button: "Contact for Sponsorship Now",
         celestech_hero_title: "IVS Celestech - Comprehensive EdTech Solutions",
         // ... (other Celestech keys) ...
         celestech_cta_button: "Request Solution Consultation",
         placement_hero_title: "Online English Placement Test",
         // ... (other Placement keys) ...
         sample_option_d: "Answer D",
         establishment_hero_title: "Establishment of Language - IT - Life Skills Centers",
         // ... (other Establishment keys) ...
         establishment_cta_button: "Request Consultation Now",

         // --- Keep Consultation Request keys as before ---
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

         // --- Add/Update keys for AI Guide page ---
         page_title_ai_guide: "AI Mindset Guide by Industry - IVS Education",
         meta_description_ai_guide: "Discover how to effectively apply an AI mindset in Education, Healthcare, Finance, Retail, Manufacturing, Agriculture, and Tourism with IVS Education.",
         og_title_ai_guide: "AI Mindset Guide by Industry - IVS Education",
         og_description_ai_guide: "Shape the foundational mindset to successfully apply AI, regardless of the tools you use.",
         ai_guide_page_title: "AI Mindset Guide by Industry",
         ai_guide_page_subtitle: "Shape the foundational mindset to successfully apply Artificial Intelligence in your work.",
         ai_guide_developed_by: "Developed by IVS Education (A unit of IVS JSC)",
         ai_guide_importance_title: "The Importance of Mindset When Using AI",
         ai_guide_importance_subtitle: "The Importance of Mindset When Using AI", // Keep same for simplicity or provide alt text
         ai_guide_importance_p1_revised: "Today's world of Artificial Intelligence (AI) offers countless tools with diverse features, performance levels, and quality. From complex large language models to specialized applications for specific industries, the choices are abundant.", // Cleaned
         ai_guide_importance_p2_revised: "However, the core principle to remember is: AI tools, regardless of their sophistication, are merely instruments. The quality of the output depends not just on the tool, but significantly on the user's mindset. The ability to correctly identify the problem, ask insightful questions, provide clear requirements, and evaluate/refine AI-generated results – these are the crucial factors for fully harnessing AI's potential and transforming it into truly useful and outstanding outcomes.", // Cleaned
         ai_guide_foreword_title: "Foreword",
         ai_guide_foreword_subtitle: "Foreword", // Keep same
         ai_guide_foreword_p1_revised: "Effective Artificial Intelligence (AI) application doesn't originate from complex technology, but from mindset – the ability to perceive problems and seize opportunities through the lens of AI. Today, we have access to a vast array of powerful and diverse AI tools.", // Cleaned
         ai_guide_foreword_p2_revised: "However, this guide does not aim to evaluate or provide detailed instructions for specific tools. Instead, we focus on shaping the foundational mindset. Rather than pondering \"Which AI tool should I use?\", begin by asking: \"What problem can be solved more effectively, or what opportunity can be better capitalized on, thanks to AI's capabilities in analysis, prediction, and automation?\". By grasping the essence, asking the right questions, and approaching with an open mind, you will find that applying AI becomes much more accessible, regardless of the specific tools you choose.", // Cleaned
         ai_guide_tools_title: "Introduction to Some Popular AI Tools (Reference)",
         ai_guide_tools_subtitle: "Introduction to Some Popular AI Tools (Reference)", // Keep same
         ai_guide_tools_intro_revised: "The table below lists some typical types and examples of widely used AI tools, illustrating the diversity of available solutions. This is neither an exhaustive list nor a specific tool endorsement.",
         ai_tools_header_type: "Main Type",
         ai_tools_header_example: "Example Tool",
         ai_tools_header_dev: "Developer/Source",
         ai_tools_header_desc: "Brief Description",
         ai_tools_header_link: "Link",
         ai_tool_type_llm: "Language Generation (LLMs)",
         ai_tool_desc_chatgpt: "Generates text, answers questions, translates, writes code",
         ai_tool_desc_gemini: "Similar to ChatGPT, deeply integrated with Google ecosystem",
         ai_tool_desc_claude: "Focuses on AI safety and ethics, long context processing",
         ai_tool_desc_grok: "LLM integrated with X (Twitter), focuses on real-time info and humor",
         ai_tool_desc_deepseek: "Strong LLM for code generation and bilingual capabilities",
         ai_tool_desc_copilot: "AI assistant integrated into Microsoft 365 apps",
         ai_tool_link_access: "Access",
         ai_tool_type_conv_search: "Conversational Search/Answer Engine",
         ai_tool_desc_perplexity: "Conversational search engine, provides answers with citations",
         ai_tool_type_image_gen: "Image Generation",
         ai_tool_desc_midjourney: "Creates artistic images from text descriptions",
         ai_tool_desc_stable_diffusion: "Creates images from text, open-source",
         ai_tool_desc_dalle: "Creates images from text descriptions",
         ai_tool_link_stable_diffusion_webui: "Access (Web UI)",
         ai_tool_type_data_analysis: "Data Analysis & Visualization",
         ai_tool_desc_tableau: "Analyzes, visualizes business data, AI integration",
         ai_tool_desc_powerbi: "Similar to Tableau, Microsoft AI integration",
         ai_tool_type_speech: "Speech Recognition & Virtual Asst.",
         ai_tool_desc_google_assistant: "Virtual assistant on phones, smart speakers",
         ai_tool_desc_siri: "Virtual assistant on Apple devices",
         ai_tool_desc_alexa: "Virtual assistant on Amazon Echo devices",
         ai_tool_type_cv: "Computer Vision",
         ai_tool_desc_gcp_vision: "Analyzes images, recognizes objects, text",
         ai_tool_desc_rekognition: "Analyzes images and video",
         ai_tool_type_ml_platform: "Machine Learning Platforms",
         ai_tool_desc_tensorflow: "Open-source library for Machine Learning",
         ai_tool_desc_pytorch: "Popular open-source library for Deep Learning",
         ai_guide_tools_note: "*Note: This table is for reference only, showcasing a small fraction of available tools. The AI market evolves rapidly with new and specialized tools emerging constantly.",
         ai_guide_section_edu_title: "1. AI Mindset in Education & Training",
         ai_guide_section_edu_subtitle: "1. AI Mindset in Education & Training",
         ai_guide_core_questions_title: "Core Questions:",
         ai_guide_core_questions_subtitle: "Core Questions:",
         ai_guide_edu_q_revised: "How can learning paths be personalized for each student to maximize their potential? How can repetitive tasks be automated to free up teachers' time for specialized focus? How can students needing special support be identified and assisted promptly?",
         ai_guide_mindset_title: "Detailed Mindset Approach:",
         ai_guide_mindset_subtitle: "Detailed Mindset Approach:",
         ai_guide_human_mindset_title: "Required Human Mindset:",
         ai_guide_human_mindset_title_en: "Required Human Mindset:", // Keep same
         ai_guide_edu_mindset1_revised: "Leverage Learning Data: Constantly question the meaning behind data (scores, interaction time, progress) to gain deeper insights into each student.", // Cleaned
         ai_guide_edu_mindset2_revised: "Prioritize Personalization: Strive to create unique learning experiences tailored to the abilities and pace of each learner, moving beyond one-size-fits-all approaches.", // Cleaned
         ai_guide_edu_mindset3_revised: "Embrace Experimentation & Improvement: Be willing to pilot new AI tools (recommendation systems, support chatbots) on a small scale, measure effectiveness, and iterate continuously.", // Cleaned
         ai_guide_edu_mindset4_revised: "View AI as a Collaborator: Consider AI a valuable assistant that reduces administrative load, allowing educators more time for in-depth teaching and meaningful student interaction.", // Cleaned
         ai_guide_core_ops_title: "Understanding Core AI Operations (Simplified):",
         ai_guide_core_ops_title_en: "Understanding Core AI Operations (Simplified):", // Keep same
         ai_guide_edu_ops1_revised: "Learning from Big Data: When AI suggests suitable exercises, it analyzes data from thousands of learning paths to identify patterns: \"Students struggling with concept A often progress faster when practicing exercise type B\".", // Cleaned
         ai_guide_edu_ops2_revised: "Rule Identification & Prediction: When AI flags learning risks, it seeks hidden patterns in data (e.g., decreased login frequency, low assignment completion rates) to predict the likelihood a student needs additional support.", // Cleaned
         ai_guide_getting_started_title: "Getting Started with AI is Simpler Than You Think - Practical Ideas:",
         ai_guide_getting_started_title_en: "Getting Started with AI is Simpler Than You Think - Practical Ideas:", // Keep same
         ai_guide_edu_start1_revised: "Utilize Existing Features: Leverage AI capabilities already integrated into the Learning Management Systems (LMS) or educational applications you currently use.",
         ai_guide_edu_start2_revised: "Implement Support Chatbots: Use chatbots to automatically answer frequently asked questions about schedules, procedures, or provide basic guidance on learning materials.",
         ai_guide_edu_start3_revised: "Pilot Results Analysis: Start by using AI to analyze test results for a small group, then measure the impact of personalized review material suggestions on subsequent test outcomes.",
         ai_guide_section_health_title: "2. AI Mindset in Healthcare & Well-being",
         ai_guide_section_health_subtitle: "2. AI Mindset in Healthcare & Well-being",
         ai_guide_health_q_revised: "How can diagnostic accuracy and speed be enhanced? How can examination and treatment workflows be optimized to reduce waiting times? How can remote patient health be monitored proactively and effectively?",
         ai_guide_health_mindset1_revised: "Adopt a 'Trust, but Verify' Approach: Leverage AI diagnostic suggestions (e.g., medical image analysis) while always cross-referencing and validating with clinical experience and expertise.", // Cleaned
         ai_guide_health_mindset2_revised: "Focus on Operational Efficiency: Seek opportunities to apply AI to minimize waiting times, automate repetitive administrative tasks (data entry, scheduling), freeing up medical staff to focus on patient care.", // Cleaned
         ai_guide_health_mindset3_revised: "Prioritize Security & Ethics: Always place the protection of sensitive patient data and the fairness and transparency of AI algorithms at the forefront of all applications.", // Cleaned
         ai_guide_health_ops1_revised: "Medical Image Recognition: When AI analyzes X-rays or CT scans, it compares image features against millions of expert-labeled images (normal/pathological) to detect potential anomalies.", // Cleaned
         ai_guide_health_ops2_revised: "Data Analysis & Prediction: When AI monitors patients remotely, it continuously analyzes vital sign data streams (heart rate, SpO2, blood pressure) and compares them against learned \"normal\" and \"at-risk\" patterns to provide early warnings.", // Cleaned
         ai_guide_health_start1_revised: "Optimize Administrative Management: Utilize clinic/hospital management software with AI integration to streamline appointment scheduling and electronic medical record (EMR) management.",
         ai_guide_health_start2_revised: "Clinical Lookup Support Tools: Experiment with AI tools that assist physicians in quickly searching medical literature, latest studies, or updated treatment protocols.",
         ai_guide_health_start3_revised: "Participate in Pilot Projects: Collaborate with technology partners to test AI applications in specific areas (e.g., assisting image analysis, predicting readmission risk) within a controlled scope.",
         ai_guide_section_finance_title: "3. AI Mindset in Finance & Banking",
         ai_guide_section_finance_subtitle: "3. AI Mindset in Finance & Banking",
         ai_guide_finance_q_revised: "How can fraud detection and prevention effectiveness be enhanced? How can the credit risk assessment process be accelerated while ensuring fairness? How can instant, 24/7 customer support be provided?",
         ai_guide_finance_mindset1_revised: "Analytical & Skeptical Thinking: Actively seek anomalies or inconsistencies in transaction data, viewing AI as a powerful tool to amplify this detection capability.", // Cleaned
         ai_guide_finance_mindset2_revised: "Data-Driven Decision Making: Base business decisions (e.g., loan approval, risk assessment) on objective AI-driven data analysis, balanced with professional experience and judgment.", // Cleaned
         ai_guide_finance_mindset3_revised: "Enhance Customer Experience: Seek ways to apply AI (chatbots, virtual assistants, personalized recommendations) to make all customer interactions faster, seamless, more convenient, and better tailored to individual needs.", // Cleaned
         ai_guide_finance_ops1_revised: "Anomaly Detection: AI fraud detection systems continuously \"learn\" normal transaction patterns. When a transaction deviates significantly (e.g., unusual location, sudden large amount, abnormal frequency), AI flags it for closer review.", // Cleaned
         ai_guide_finance_ops2_revised: "Risk Classification & Prediction: AI credit scoring models classify applicants into different risk categories by \"learning\" the correlations between numerous factors (income, credit history, debt ratio, etc.) and historically observed repayment behavior.", // Cleaned
         ai_guide_finance_start1_revised: "Deploy Basic Support Chatbots: Automate responses to frequently asked questions about products, services, interest rates, fees, etc., to reduce the load on customer support teams.",
         ai_guide_finance_start2_revised: "Leverage Analytical Reports: Utilize AI-integrated data analysis tools to visualize trends, better understand customer behavior, and track marketing campaign effectiveness.",
         ai_guide_finance_start3_revised: "Experiment with Simple Product Recommendations: Start by suggesting basic financial products (e.g., suitable savings accounts, basic credit cards) based on AI analysis of customer profiles and transaction history.",
         ai_guide_section_retail_title: "4. AI Mindset in Retail & E-commerce",
         ai_guide_section_retail_subtitle: "4. AI Mindset in Retail & E-commerce",
         ai_guide_retail_q_revised: "How to create personalized shopping experiences that make each customer feel understood? How to accurately forecast market demand to optimize inventory and reduce waste? How to quickly capture customer sentiment and feedback across all channels?",
         ai_guide_retail_mindset1_revised: "Customer-Centricity: Shift focus from 'selling available products' to 'meeting and anticipating customer needs'. Constantly ask: \"How can AI help me analyze data to best understand and serve this customer?\".", // Cleaned
         ai_guide_retail_mindset2_revised: "Continuous Optimization: View every process (ordering, inventory management, pricing, marketing) as an opportunity for improvement and ask: \"Can AI automate, accelerate, or reduce costs for this step?\".", // Cleaned
         ai_guide_retail_mindset3_revised: "Customer Data Sensitivity: Treat every customer touchpoint (page views, clicks, abandoned carts, product reviews) as invaluable data for AI to mine and provide actionable insights.", // Cleaned
         ai_guide_retail_mindset4_revised: "Embrace Intelligent Automation: Confidently delegate repetitive and time-consuming tasks (basic chat responses, order status updates, feedback categorization) to AI, allowing human staff to focus on higher-value activities like expert consultation and complex issue resolution.", // Cleaned
         ai_guide_retail_ops1_revised: "Learning Preferences & Behavior: When you see \"Frequently bought together\" or \"Recommended for you,\" AI has analyzed the purchase history and browsing behavior of millions to find associations and predict your preferences.", // Cleaned
         ai_guide_retail_ops2_revised: "Demand Forecasting & Inventory Optimization: AI analyzes historical sales data, incorporating seasonality, market trends, promotional campaigns, and even weather data, to forecast demand for each product and recommend optimal inventory levels.", // Cleaned
         ai_guide_retail_ops3_revised: "Natural Language Processing (NLP): When AI analyzes customer reviews, it uses NLP to \"understand\" the content, identify key topics mentioned (price, quality, shipping, etc.), and classify the sentiment (positive, negative, neutral) associated with each topic.", // Cleaned
         ai_guide_retail_start1_revised: "Activate Product Recommendations: Utilize built-in recommendation features on your e-commerce platform or website and track conversion rates.",
         ai_guide_retail_start2_revised: "Use Basic Chatbots: Implement chatbots to automatically handle common inquiries like order status checks, return policy questions, or basic product information.",
         ai_guide_retail_start3_revised: "Analyze Smart Reports: Focus on AI-generated reports and dashboards (often available in analytics tools or e-commerce platforms) to gain insights into best-selling products and potential customer segments.",
         ai_guide_retail_start4_revised: "Experiment with Automated Advertising: Utilize smart advertising features on platforms like Google Ads or Facebook Ads that allow AI to automatically optimize audience targeting and ad spend allocation.",
         ai_guide_section_manu_title: "5. AI Mindset in Manufacturing & Industry",
         ai_guide_section_manu_subtitle: "5. AI Mindset in Manufacturing & Industry",
         ai_guide_manu_q_revised: "How can product defects be detected with high accuracy directly on the production line? How can machinery failures be predicted and prevented before they occur? How can workflows, internal logistics, and the supply chain be optimized?",
         ai_guide_manu_mindset1_revised: "Preventive & Predictive Thinking: Shift from reactive (fixing breakdowns) to proactive prevention (predictive maintenance, failure forecasting). Always ask: \"How can we anticipate and prevent problems?\".", // Cleaned
         ai_guide_manu_mindset2_revised: "Commitment to Total Quality: Seek ways to apply AI (especially Computer Vision) for automated 100% quality inspection, minimizing defect escapes.", // Cleaned
         ai_guide_manu_mindset3_revised: "Optimize Every Stage: Continuously look for opportunities to improve line efficiency, reduce machine downtime, and optimize material/product movement routes, even for minor gains.", // Cleaned
         ai_guide_manu_mindset4_revised: "Prioritize Safety: Consider how AI can assist in monitoring the work environment, detecting potentially unsafe behaviors or conditions, and providing timely alerts.", // Cleaned
         ai_guide_manu_ops1_revised: "Computer Vision: Quality inspection systems use cameras to capture product images; AI then compares features (dimensions, color, surface) against a \"taught\" standard model to detect even minor deviations.", // Cleaned
         ai_guide_manu_ops2_revised: "Sensor Data Analysis: Sensors on machinery continuously record data (vibration, temperature, pressure). AI analyzes these time-series data streams, searching for abnormal patterns (compared to normal operation) that might signal an impending failure.", // Cleaned
         ai_guide_manu_ops3_revised: "Process Optimization: When optimizing internal logistics, AI considers numerous variables (factory layout, inventory locations, production schedules, congestion status) to calculate and recommend the most efficient movement paths for AGVs or workers.", // Cleaned
         ai_guide_manu_start1_revised: "Visual Quality Inspection: Start by implementing a basic camera system and AI software on a critical process stage to automatically detect obvious surface defects or simple assembly errors.",
         ai_guide_manu_start2_revised: "Basic Machine Condition Monitoring: Utilize available analysis software to track data from existing sensors (temperature, vibration), setting up alerts for safety threshold breaches or identifying unusual trends.",
         ai_guide_manu_start3_revised: "Pilot Simple Automated Guided Vehicles (AGVs): Apply AGVs for repetitive material transport tasks along fixed, less complex routes within the facility.",
         ai_guide_manu_start4_revised: "Analyze Line Performance: Use Business Intelligence (BI) tools with AI capabilities to analyze production data (OEE, cycle times, defect rates), identifying bottlenecks and improvement opportunities.",
         ai_guide_section_agri_title: "6. AI Mindset in Agriculture",
         ai_guide_section_agri_subtitle: "6. AI Mindset in Agriculture",
         ai_guide_agri_q_revised: "How to provide the precise amount of water and nutrients needed for specific crop zones or individual livestock? How to detect early signs of pests and diseases for timely intervention? How to reliably forecast agricultural yield and quality?",
         ai_guide_agri_mindset1_revised: "Keen Observation & Data Integration: Pay attention to the subtlest signs in crops, livestock, and the environment; view sensor and image data as a way to \"extend the senses\" for more accurate assessments.", // Cleaned
         ai_guide_agri_mindset2_revised: "Precision Farming/Livestock Mindset: Aim to deliver the right inputs (water, fertilizer, medicine, feed) to the right location, at the right time, and in the precise amount needed, rather than applying uniformly across large areas.", // Cleaned
         ai_guide_agri_mindset3_revised: "Proactive Environmental Adaptation: Use AI to analyze and predict environmental factors (weather, soil quality, moisture) to make timely and effective farming/livestock decisions or plan adjustments.", // Cleaned
         ai_guide_agri_mindset4_revised: "Resource Efficiency Optimization: Constantly seek ways to minimize waste and utilize resources (water, fertilizer, energy, feed) most efficiently and sustainably with the help of AI-driven analysis and forecasting.", // Cleaned
         ai_guide_agri_ops1_revised: "Agricultural Image Analysis: When AI analyzes drone or satellite imagery, it compares spectral characteristics (color, NDVI vegetation index) against a \"trained\" database to identify crop health status, nutrient deficiencies, or pest-infested areas.", // Cleaned
         ai_guide_agri_ops2_revised: "Yield Modeling & Forecasting: AI builds complex models by \"learning\" the relationships between numerous input factors (historical and forecast weather data, soil type, crop variety, farming history, fertilizer inputs) and past harvested yields to generate forecasts for the current season.", // Cleaned
         ai_guide_agri_ops3_revised: "Optimized Decision Making: When recommending irrigation or fertilization, AI integrates real-time sensor data (soil moisture, EC), short-term weather forecasts, and crop growth stage to precisely calculate the required water or nutrient amounts, avoiding over or under-application.", // Cleaned
         ai_guide_agri_start1_revised: "Utilize Smart Farming Apps: Install and use mobile applications that provide detailed agricultural weather forecasts, AI-based pest/disease alerts, or digital farming logs.",
         ai_guide_agri_start2_revised: "Install Basic Environmental Sensors: Start by deploying a few simple sensors (soil moisture, temperature, air humidity) at strategic locations on the farm to collect data and monitor fluctuations.",
         ai_guide_agri_start3_revised: "Periodic Drone Photography: Use a drone to capture overview images of fields/farm areas on a regular schedule. Analyze these images (manually or with basic software) to spot areas with abnormal crop signs early.",
         ai_guide_agri_start4_revised: "Consult Forecasting Services: Seek out and utilize online services or consultancies that offer AI-based yield forecasts or disease alerts specific to your region and crop/livestock type.",
         ai_guide_section_hosp_title: "7. AI Mindset in Tourism & Hospitality",
         ai_guide_section_hosp_subtitle: "7. AI Mindset in Tourism & Hospitality",
         ai_guide_hosp_q_revised: "How to deliver unique and deeply personalized experiences for each guest? How to accurately forecast demand fluctuations to optimize pricing/service offerings and operational capacity? How to effectively manage online reputation and engage with customer feedback?",
         ai_guide_hosp_mindset1_revised: "Holistic Customer Understanding: Continuously seek to understand guest preferences, latent needs, and behaviors across all touchpoints; view AI as a powerful data analysis tool to achieve this understanding.", // Cleaned
         ai_guide_hosp_mindset2_revised: "Agility in Pricing & Operations: Be prepared to dynamically adjust pricing and allocate resources (staff, rooms) flexibly based on real-time demand and capacity forecasts provided by AI.", // Cleaned
         ai_guide_hosp_mindset3_revised: "Proactive Reputation Management: Value all online reviews and feedback; use AI to automatically monitor, analyze sentiment, identify priority issues, and facilitate prompt, professional responses.", // Cleaned
         ai_guide_hosp_mindset4_revised: "Service Process Optimization: Identify opportunities to apply AI for automating repetitive processes (simple check-in/out, FAQ chatbots, service recommendations) to enhance efficiency and free up staff for more personalized interactions.", // Cleaned
         ai_guide_hosp_ops1_revised: "Recommendation Engines: Based on booking history, search data, profile information, and the behavior of similar guests, AI \"learns\" preference patterns and suggests the most relevant service packages, room upgrades, activities, or restaurants for each individual.", // Cleaned
         ai_guide_hosp_ops2_revised: "Dynamic Pricing: AI simultaneously analyzes multiple factors (historical booking data, current occupancy, local events, competitor pricing, day of the week, booking lead time, etc.) to forecast demand and automatically adjust room/service rates to optimize revenue and occupancy.", // Cleaned
         ai_guide_hosp_ops3_revised: "Customer Sentiment Analysis: Using NLP, AI \"reads\" and analyzes numerous reviews and comments across booking platforms and social media to identify the most frequently discussed topics (e.g., cleanliness, staff attitude, breakfast quality) and assess the overall sentiment (positive/negative) for each topic.", // Cleaned
         ai_guide_hosp_start1_revised: "Utilize Revenue Management Systems (RMS): Leverage the automated forecasting and pricing recommendation features available in modern RMS platforms or consider upgrading to an AI-integrated system.",
         ai_guide_hosp_start2_revised: "Deploy Customer Support Chatbots: Implement chatbots on your website or messaging apps to provide 24/7 automated answers to common questions about amenities, operating hours, cancellation policies, or directions.",
         ai_guide_hosp_start3_revised: "Online Review Management Tools: Use tools that aggregate reviews from multiple channels (TripAdvisor, Google, Booking.com, etc.), potentially with AI integration for sentiment analysis and summarizing key feedback points.",
         ai_guide_hosp_start4_revised: "Analyze Basic Booking Data: Utilize reporting tools within your Property Management System (PMS) or BI tools to identify booking trends, key customer sources, and most popular ancillary services.",
         ai_guide_emphasis_title: "Emphasis",
         ai_guide_emphasis_subtitle: "Emphasis", // Keep same
         ai_guide_emphasis_p1_revised: "The key to harnessing AI's power lies not in becoming a programming expert, but in the ability to ask the right strategic questions, view business problems through the lens of data and automation opportunities, and possess a willingness to experiment and learn from new solutions. AI is a powerful tool that assists humans in making more informed decisions, optimizing workflows, and enhancing overall efficiency. Start with small, measurable applications, and always focus on the tangible value AI brings to your organization. This is entirely achievable for you and your team.", // Cleaned

    }
};


// Global flag to ensure language is initialized only once
window.languageInitialized = false;

/**
 * Applies translations to DOM elements based on data-lang-key attribute.
 * Handles different element types and basic Markdown (**bold**, *italic*).
 * @param {string} lang - The target language code ('vi' or 'en').
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
                document.title = translation;
            } else if (tagName === 'INPUT' || tagName === 'TEXTAREA') {
                const placeholderKey = key + '_placeholder';
                const placeholderTranslation = translations[lang]?.[placeholderKey];
                if (placeholderTranslation !== undefined) {
                    element.placeholder = placeholderTranslation;
                } else if (element.hasAttribute('placeholder')) {
                     console.warn(`[Language] Placeholder key ${placeholderKey} not found for element with key ${key}.`);
                }
                if ((element.type === 'button' || element.type === 'submit') && element.hasAttribute('value')) {
                     element.value = translation; // Update button value if key matches
                 }
            } else if (tagName === 'IMG') {
                const altKey = key + '_alt';
                const altTranslation = translations[lang]?.[altKey];
                element.alt = altTranslation !== undefined ? altTranslation : translation; // Use main key as fallback alt
            } else if (tagName === 'BUTTON' && element.querySelector('.sr-only')) {
                 const srOnlySpan = element.querySelector('.sr-only');
                 if (srOnlySpan) srOnlySpan.textContent = translation;
            } else {
                 // Apply to other elements (P, SPAN, H*, LI, A, BUTTON text content etc.)
                 // Handle basic Markdown: **bold** and *italic*
                 let finalTranslation = translation;
                 const hasMarkdown = /\*\*|\*/.test(finalTranslation); // Check if markdown exists

                 if (hasMarkdown) {
                     finalTranslation = finalTranslation.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                     finalTranslation = finalTranslation.replace(/\*(.*?)\*/g, '<em>$1</em>');
                     element.innerHTML = finalTranslation; // Use innerHTML ONLY if markdown was processed
                 } else {
                     // Check if the element already contains HTML (like strong tags from the template)
                     // If it does, and the translation is plain text, avoid overwriting the HTML structure.
                     // This is a basic check; more robust parsing might be needed for complex cases.
                     const containsHtmlTags = /<[a-z][\s\S]*>/i.test(element.innerHTML);
                     if (!containsHtmlTags || element.children.length === 0) {
                          element.textContent = finalTranslation; // Prefer textContent for safety
                     } else {
                          // If element has children (like <strong>) and translation is plain,
                          // try to update the main text node without destroying children.
                          // This is complex; a simpler approach might be to ensure translations
                          // *never* contain markdown if the HTML already has formatting.
                          // For now, we'll log a warning and potentially just set textContent.
                          console.warn(`[Language] Element for key "${key}" contains HTML tags, but translation is plain text. Overwriting with textContent.`);
                          element.textContent = finalTranslation;
                     }
                 }
            }

            // Handle 'title' attribute (tooltip)
            const titleKey = key + '_title';
            const titleTranslation = translations[lang]?.[titleKey];
            if (titleTranslation !== undefined) {
                element.title = titleTranslation;
            }

        } else if (key) {
             // Warn only if key exists in *some* language but not the current one
            if (translations['vi']?.[key] || translations['en']?.[key]) {
                 console.warn(`[Language] Translation missing for key: "${key}" in language: "${lang}"`);
            } else {
                 console.warn(`[Language] Key not found in any language: "${key}"`);
            }
        }
    });
}


/**
 * Updates the UI state of language switchers (dropdowns/buttons).
 * @param {string} lang - The current language code ('vi' or 'en').
 */
function updateLanguageUI(lang) {
    console.log(`[Language] Updating UI for lang: ${lang}`);

    const langDetails = {
        vi: { name: 'Tiếng Việt', short: 'VN' },
        en: { name: 'English', short: 'EN' }
    };
    const currentLangShort = langDetails[lang]?.short || lang.toUpperCase();

    // Update dropdown toggle text
    const desktopLangText = document.getElementById('desktop-current-lang');
    const mobileLangText = document.getElementById('mobile-current-lang');
    if (desktopLangText) desktopLangText.textContent = currentLangShort;
    if (mobileLangText) mobileLangText.textContent = currentLangShort;

    // Update state of language option buttons
    const buttons = document.querySelectorAll('.lang-button');
    buttons.forEach(button => {
        if (!button) return;
        const buttonLang = button.getAttribute('data-lang');
        const isActive = (buttonLang === lang);

        button.disabled = isActive;
        if (isActive) {
            button.setAttribute('aria-current', 'page');
            // Add specific active classes (defined in styles.css or Tailwind)
            button.classList.add('active-lang'); // General active class
            if (button.closest('#desktop-language-dropdown')) button.classList.add('active-lang-desktop');
            if (button.closest('#mobile-language-dropdown')) button.classList.add('active-lang-mobile');
        } else {
            button.removeAttribute('aria-current');
            // Remove active classes
            button.classList.remove('active-lang', 'active-lang-desktop', 'active-lang-mobile');
        }
    });
}


/**
 * Sets the application language, saves preference, and updates the UI.
 * @param {string} lang - The target language code ('vi' or 'en').
 */
function setLanguage(lang) {
    if (!translations[lang]) {
        console.error(`[Language] Invalid language code: ${lang}. Defaulting to 'vi'.`);
        lang = 'vi';
    }

    localStorage.setItem('preferredLanguage', lang);
    applyTranslations(lang);
    updateLanguageUI(lang);
    document.documentElement.lang = lang;
    console.log(`[Language] Language set to: ${lang}`);

    // Trigger dynamic content updates
    if (typeof loadInternalNews === 'function' && document.getElementById('news-container')) {
        console.log("[Language] Reloading internal news...");
        loadInternalNews();
    }
    if (typeof loadVnExpressFeed === 'function' && document.getElementById('vnexpress-rss-feed')) {
        console.log("[Language] Reloading VnExpress feed...");
        loadVnExpressFeed();
    }
    if (typeof updatePlacementResultText === 'function') {
        const resultArea = document.getElementById('test-result-area');
        if (resultArea && !resultArea.classList.contains('hidden')) {
            console.log("[Language] Updating placement results text...");
            updatePlacementResultText(lang);
        }
    }
    if (typeof initializeActiveMenuHighlighting === 'function') {
         const headerElement = document.querySelector('#header-placeholder #navbar');
         if (headerElement) {
              console.log("[Language] Re-highlighting active menu...");
              initializeActiveMenuHighlighting(headerElement);
         }
    }
}


/**
 * Event handler for language change button clicks.
 * Called by the wrapper in script.js.
 * @param {Event} event - The click event object.
 */
function handleLanguageChange(event) {
    const button = event.currentTarget;
    if (button.disabled) return; // Ignore click on already active language
    const lang = button.getAttribute('data-lang');
    console.log(`[Language] Language change requested via button to: ${lang}`);
    if (lang) {
        setLanguage(lang);
        // Optional: Close dropdown containing the button (handled in script.js listener)
    }
}

/**
 * Initializes the language system on page load.
 * Called by script.js after components are loaded/attempted.
 */
function initializeLanguage() {
    if (window.languageInitialized) {
        console.warn("[Language] Initialization skipped: Already initialized.");
        return;
    }
    console.log("[Language] Initializing language system...");

    const preferredLanguage = localStorage.getItem('preferredLanguage') || 'vi';
    // Set initial language (applies translations, updates UI)
    // Listeners are attached later by script.js
    setLanguage(preferredLanguage);

    window.languageInitialized = true;
    console.log("[Language] Initialization complete.");
}

// --- Example Placeholder Function ---
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
        // console.warn("[Language] Placement result elements not found, cannot update text.");
        return; // Silently return if elements aren't on the current page
    }

    const testResult = JSON.parse(sessionStorage.getItem('placementTestResult') || '{}');
    const determinedLevel = testResult.level || 'B1';

    // Keep the resultData object structure here
    const resultData = {
        vi: {
            A1: { level: 'A1 (Sơ cấp 1)', description: 'Có thể hiểu và sử dụng các cấu trúc quen thuộc hàng ngày và các cụm từ rất cơ bản nhằm đáp ứng nhu cầu cụ thể.', courses: [{ name: 'Khóa Tiếng Anh A1', link: '#' }] },
            A2: { level: 'A2 (Sơ cấp 2)', description: 'Có thể hiểu các câu và cách diễn đạt thường dùng liên quan đến các lĩnh vực liên quan trực tiếp nhất (ví dụ: thông tin cá nhân và gia đình rất cơ bản, mua sắm, địa lý địa phương, việc làm).', courses: [{ name: 'Khóa Tiếng Anh A2', link: '#' }] },
            B1: { level: 'B1 (Trung cấp)', description: 'Có thể hiểu các ý chính của thông tin rõ ràng, chuẩn mực về các vấn đề quen thuộc thường gặp trong công việc, trường học, giải trí, v.v.', courses: [{ name: 'Khóa Tiếng Anh Giao tiếp B1+', link: '#' }, { name: 'Luyện thi IELTS Mục tiêu 5.0-6.0', link: '#' }] },
            B2: { level: 'B2 (Trung-Cao cấp)', description: 'Có thể hiểu ý chính của văn bản phức tạp về cả chủ đề cụ thể và trừu tượng, bao gồm cả các thảo luận kỹ thuật trong lĩnh vực chuyên môn của mình.', courses: [{ name: 'Khóa Tiếng Anh B2', link: '#' }, { name: 'Luyện thi IELTS Mục tiêu 6.5+', link: '#' }] },
            C1: { level: 'C1 (Cao cấp)', description: 'Có thể hiểu nhiều loại văn bản dài và đòi hỏi cao, và nhận ra ý nghĩa tiềm ẩn. Có thể diễn đạt bản thân một cách trôi chảy và tự nhiên mà không cần tìm kiếm biểu thức rõ ràng.', courses: [{ name: 'Khóa Tiếng Anh C1', link: '#' }] },
            C2: { level: 'C2 (Thành thạo)', description: 'Có thể hiểu dễ dàng hầu hết mọi thứ nghe hoặc đọc. Có thể tóm tắt thông tin từ các nguồn nói và viết khác nhau, tái cấu trúc các lập luận và trình bày một cách mạch lạc.', courses: [{ name: 'Khóa Tiếng Anh C2', link: '#' }] },
        },
        en: {
            A1: { level: 'A1 (Beginner)', description: 'Can understand and use familiar everyday expressions and very basic phrases aimed at the satisfaction of needs of a concrete type.', courses: [{ name: 'A1 English Course', link: '#' }] },
            A2: { level: 'A2 (Elementary)', description: 'Can understand sentences and frequently used expressions related to areas of most immediate relevance (e.g. very basic personal and family information, shopping, local geography, employment).', courses: [{ name: 'A2 English Course', link: '#' }] },
            B1: { level: 'B1 (Intermediate)', description: 'Can understand the main points of clear standard input on familiar matters regularly encountered in work, school, leisure, etc.', courses: [{ name: 'B1+ Communicative English Course', link: '#' }, { name: 'IELTS Preparation (Target 5.0-6.0)', link: '#' }] },
            B2: { level: 'B2 (Upper-Intermediate)', description: 'Can understand the main ideas of complex text on both concrete and abstract topics, including technical discussions in his/her field of specialisation.', courses: [{ name: 'B2 English Course', link: '#' }, { name: 'IELTS Preparation (Target 6.5+)', link: '#' }] },
            C1: { level: 'C1 (Advanced)', description: 'Can understand a wide range of demanding, longer texts, and recognise implicit meaning. Can express him/herself fluently and spontaneously without much obvious searching for expressions.', courses: [{ name: 'C1 English Course', link: '#' }] },
            C2: { level: 'C2 (Proficient)', description: 'Can understand with ease virtually everything heard or read. Can summarise information from different spoken and written sources, reconstructing arguments and accounts in a coherent presentation.', courses: [{ name: 'C2 English Course', link: '#' }] },
        }
    };

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
