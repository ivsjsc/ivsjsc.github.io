Tôi đã so sánh file language.js mà bạn cung cấp với phiên bản trước đó và nhận thấy một số thay đổi quan trọng. Dưới đây là phiên bản mới nhất, bao gồm các chỉnh sửa và bổ sung:// /js/language.js
// Phiên bản: Đã thêm các key bị thiếu và sửa lỗi xử lý bản quyền

// Đối tượng lưu trữ các bản dịch
const translations = {
        vi: {
            // --- Meta Tags ---
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
            page_title_ai_guide: "Hướng dẫn Tư duy AI theo Ngành nghề - IVS Education", // Key đã thêm
            meta_description_ai_guide: "Khám phá cách áp dụng tư duy AI hiệu quả trong các ngành Giáo dục, Y tế, Tài chính, Bán lẻ, Sản xuất, Nông nghiệp, Du lịch cùng IVS Education.", // Key đã thêm
            og_title_ai_guide: "Hướng dẫn Tư duy AI theo Ngành nghề - IVS Education", // Key đã thêm
            og_description_ai_guide: "Định hình tư duy nền tảng để ứng dụng AI thành công, bất kể công cụ bạn sử dụng.", // Key đã thêm
            page_title_consultation: "Đăng ký Tư vấn - IVS JSC", // Key đã thêm
            meta_description_consultation: "Đăng ký nhận tư vấn miễn phí từ IVS JSC về các lĩnh vực giáo dục, công nghệ, hợp tác quốc tế và các dịch vụ khác.", // Key đã thêm
            og_title_consultation: "Đăng ký Tư vấn - IVS JSC", // Key đã thêm
            og_description_consultation: "Liên hệ với IVS JSC để được tư vấn chi tiết về nhu cầu của bạn.", // Key đã thêm
    
            // --- Header ---
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
            search: "Tìm kiếm", // Key mới
            search_placeholder: "Tìm kiếm...", // Key mới
            search_button_label: "Mở tìm kiếm", // Key mới
    
            // --- Index Page ---
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
            index_section_title_trusted_edu: "IVS - Nền tảng giáo dục đáng tin cậy", // Key đã thêm
            large_button_ai_guide: "Áp dụng AI với mọi ngành cùng IVS", // Key đã thêm
            large_button_ai_subtext: "Đây không phải chương trình đào tạo", // Key đã thêm
            large_button_about: "Read Magical Novels in the Library of Magic", // Key đã thêm
            large_button_scholarship: "Học bổng & Trại hè", // Key đã thêm
            large_button_scholarship_subtext: "Cơ hội vươn ra thế giới", // Key đã thêm
            large_button_placement: "English Placement Test", // Key đã thêm
            large_button_placement_subtext: "Kiểm tra trình độ tiếng Anh", // Key đã thêm
            small_button_preschool: "Mầm non", // Key đã thêm
            small_button_primary: "Tiểu học", // Key đã thêm
            small_button_secondary: "THCS/THPT", // Key đã thêm
            small_button_language_center: "TT Anh Ngữ", // Key đã thêm
            small_button_lifeskills: "Kỹ năng sống", // Key đã thêm
            small_button_steam: "STEAM", // Key đã thêm
            small_button_international: "Hợp tác QT", // Key đã thêm
            small_button_consulting: "Hãy Nói - Tiếng Nói Tuổi Trẻ", // Key đã thêm
            index_vnexpress_title: "Tin tức Giáo dục mới nhất từ VnExpress", // Key đã thêm
    
            // --- About Page ---
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
            // Thêm các key khác của trang about nếu cần
    
            // --- Footer ---
            footer_company_name: "IVS JSC",
            footer_rights: "Bản quyền thuộc về IVS JSC.",
            footer_contact_us: "Liên hệ chúng tôi",
            footer_address: "Số 1104, Tổ 6, Ấp Đất Mới, Xã Long Phước, Huyện Long Thành, Tỉnh Đồng Nai, Việt Nam, 76213.",
            footer_quick_links: "Liên kết nhanh",
            footer_follow_us: "Theo dõi chúng tôi",
            footer_desc: "IVS JSC - CÔNG TY CP DỊCH VỤ THƯƠNG MẠI INTEGRATE VISION SYNERGY - MST: 3603960189",
            quick_links: "Liên Kết Nhanh",
            about_ivs: "Về IVS",
            services: "Dịch Vụ", // Key này dùng trong footer, cần định nghĩa lại
            footer_service_languages: "IVS Languages", // Key mới
            footer_service_lifeminds: "IVS LifeMinds", // Key mới
            footer_service_media: "IVS Media", // Key mới
            footer_service_celestech: "IVS Celestech", // Key mới
            footer_service_rnd: "R&D Chương trình", // Key mới
            careers: "Tuyển Dụng",
            contact: "Liên Hệ",
            blog: "Tin tức",
            contact_us: "Liên Hệ",
            address: "Số 1104, Tổ 6, Ấp Đất Mới, Xã Long Phước, Huyện Long Thành, Tỉnh Đồng Nai, Việt Nam, 76213.",
            // Sử dụng placeholder {year} để JS thay thế, không cần thẻ span trong bản dịch
            copyright: "© {year} IVS JSC. Đã đăng ký Bản quyền số: 6207/2024/QTG.",
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
            footer_connect: "Kết nối với chúng tôi", // Key mới
            footer_facebook: "Facebook", // Key mới (cho aria-label)
            footer_youtube: "YouTube", // Key mới (cho aria-label)
            footer_linkedin: "LinkedIn", // Key mới (cho aria-label)
            footer_tiktok: "TikTok", // Key mới (cho aria-label)
            footer_instagram: "Instagram", // Key mới (cho aria-label)
            footer_zalo: "Zalo", // Key mới (cho aria-label)
    
            // --- Trang R&D, Tài trợ, Celestech, Placement, Establishment ---
            // (Giữ nguyên các key đã có)
            rnd_hero_title: "Thiết kế Học liệu & Giải pháp EdTech theo Yêu cầu",
            rnd_cta_button: "Liên hệ Tư vấn R&D",
            sponsorship_hero_title: "Tài trợ Cộng đồng - Đồng hành cùng IVS Kiến tạo Giá trị",
            sponsorship_cta_button: "Liên hệ Tài trợ Ngay",
            celestech_hero_title: "IVS Celestech - Giải pháp Công nghệ Giáo dục Toàn diện",
            celestech_cta_button: "Yêu cầu Tư vấn Giải pháp",
            placement_hero_title: "Kiểm tra Năng lực Tiếng Anh Trực tuyến",
            sample_option_d: "Đáp án D",
            establishment_hero_title: "Thành lập Trung tâm Ngoại ngữ - Tin học - Kỹ năng sống",
            establishment_cta_button: "Yêu cầu Tư vấn Ngay",
    
            // --- Trang Đăng ký tư vấn ---
            page_title_consultation: "Đăng ký Tư vấn - IVS JSC",
            meta_description_consultation: "Đăng ký nhận tư vấn miễn phí từ IVS JSC về các lĩnh vực giáo dục, công nghệ, hợp tác quốc tế và các dịch vụ khác.",
            og_title_consultation: "Đăng ký Tư vấn - IVS JSC",
            og_description_consultation: "Liên hệ với IVS JSC để được tư vấn chi tiết về nhu cầu của bạn.",
            consultation_form_title: "Đăng ký Tư vấn",
            consultation_form_subtitle: "Vui lòng điền thông tin bên dưới, IVS JSC sẽ liên hệ lại với bạn sớm nhất.",
            form_label_fullname: "Họ và Tên",
            form_placeholder_fullname: "Ví dụ: Nguyễn Văn A",        form_label_phone: "Số điện thoại", // Key đã có nhưng bị báo lỗi? Kiểm tra lại HTML
            form_placeholder_phone: "Ví dụ: 0912345678",
            form_label_email: "Địa chỉ Email", // Key đã có nhưng bị báo lỗi? Kiểm tra lại HTML
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
            phone_number: "Số điện thoại", // Key mới (nếu dùng riêng)
            email_address: "Địa chỉ Email: ivscorp.vn@gmail.com", // Key mới (nếu dùng riêng)
    
            // --- Trang Hướng dẫn AI ---
            ai_guide_page_title: "Hướng dẫn Tư duy AI theo Ngành nghề - IVS Education",
            ai_guide_page_subtitle: "Định hình tư duy nền tảng để ứng dụng Trí tuệ Nhân tạo thành công trong công việc của bạn.",
            ai_guide_developed_by: "Phát triển bởi IVS Education (Một đơn vị của IVS JSC)",
            ai_guide_importance_title: "Tầm Quan Trọng Của Tư Duy Khi Sử Dụng AI",
            ai_guide_importance_subtitle: "The Importance of Mindset When Using AI",
            ai_guide_importance_p1_revised: "Thế giới Trí tuệ Nhân tạo (AI) ngày nay mang đến vô vàn công cụ với đủ loại tính năng, hiệu năng và chất lượng. Từ các mô hình ngôn ngữ lớn phức tạp đến những ứng dụng chuyên biệt cho từng ngành, sự lựa chọn vô cùng phong phú.",
            ai_guide_importance_p2_revised: "Tuy nhiên, điều cốt lõi cần ghi nhớ: Công cụ AI, dù tinh vi đến đâu, cũng chỉ là phương tiện. Chất lượng đầu ra không chỉ phụ thuộc vào công cụ, mà phần lớn được quyết định bởi chính tư duy của người dùng. Khả năng xác định đúng vấn đề, cách đặt câu hỏi sắc bén, sự rõ ràng trong yêu cầu, cùng năng lực đánh giá và tinh chỉnh kết quả do AI tạo ra – đó mới là những yếu tố then chốt để khai thác tối đa tiềm năng của AI, biến nó thành những thành quả thực sự hữu ích và vượt trội.",
            ai_guide_foreword_title: "Lời nói đầu",
            ai_guide_foreword_subtitle: "Foreword",
            ai_guide_foreword_p1_revised: "Việc ứng dụng Trí tuệ Nhân tạo (AI) hiệu quả không khởi nguồn từ công nghệ phức tạp, mà bắt đầu từ tư duy – khả năng nhìn nhận vấn đề và nắm bắt cơ hội qua lăng kính của AI. Ngày nay, chúng ta có quyền truy cập vào vô số công cụ AI mạnh mẽ và đa dạng.",
            ai_guide_foreword_p2_revised: "Tuy nhiên, tài liệu này không nhằm mục đích đánh giá hay hướng dẫn chi tiết từng công cụ. Thay vào đó, chúng tôi tập trung vào việc định hình tư duy nền tảng. Thay vì băn khoăn \"Nên dùng công cụ AI nào?\", hãy bắt đầu bằng câu hỏi: \"Vấn đề nào có thể được giải quyết hiệu quả hơn, hoặc cơ hội nào có thể được khai thác tốt hơn nhờ khả năng phân tích, dự đoán, và tự động hóa của AI?\". Khi hiểu đúng bản chất, đặt đúng câu hỏi và tiếp cận với một tư duy cởi mở, bạn sẽ nhận thấy việc ứng dụng AI trở nên dễ dàng hơn nhiều, bất kể công cụ bạn lựa chọn là gì.",
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
            ai_guide_edu_mindset1_revised: "Khai thác Dữ liệu Học tập: Luôn đặt câu hỏi về ý nghĩa đằng sau dữ liệu (điểm số, thời gian tương tác, tiến độ) để thấu hiểu sâu sắc hơn về từng học viên.",
            ai_guide_edu_mindset2_revised: "Ưu tiên Cá nhân hóa: Nỗ lực tạo ra những trải nghiệm học tập độc đáo, phù hợp với năng lực và tốc độ riêng của mỗi người học, thay vì áp dụng một khuôn mẫu chung.",
            ai_guide_edu_mindset3_revised: "Tinh thần Thử nghiệm & Cải tiến: Sẵn sàng áp dụng thử nghiệm các công cụ AI mới (hệ thống gợi ý, chatbot hỗ trợ) ở quy mô nhỏ, đo lường và đánh giá hiệu quả để cải tiến liên tục.",
            ai_guide_edu_mindset4_revised: "Xem AI là Cộng sự: Coi AI như một trợ lý đắc lực, giúp giảm tải công việc hành chính, cho phép giáo viên dành nhiều thời gian hơn cho việc giảng dạy chuyên sâu và tương tác ý nghĩa với học viên.",
            ai_guide_core_ops_title: "Hiểu cốt lõi vận hành AI (Đơn giản hóa):",
            ai_guide_edu_ops1_revised: "Học từ Dữ liệu Lớn: Khi AI gợi ý bài tập phù hợp, nó dựa trên việc phân tích dữ liệu từ hàng ngàn lộ trình học tập khác nhau để nhận diện mẫu: 'Học viên gặp khó khăn ở khái niệm A thường tiến bộ nhanh hơn khi luyện tập dạng bài tập B'.",
            ai_guide_edu_ops2_revised: "Nhận diện Quy luật & Dự báo: Khi AI cảnh báo nguy cơ học tập, nó tìm kiếm các quy luật ẩn trong dữ liệu (ví dụ: tần suất đăng nhập giảm, tỷ lệ hoàn thành bài tập thấp) để dự đoán khả năng học viên cần hỗ trợ thêm.",
            ai_guide_getting_started_title: "Bắt đầu với AI không hề phức tạp - Gợi ý thực tế:",
            ai_guide_edu_start1_revised: "Utilize Existing Features: Leverage AI features already integrated into your Learning Management System (LMS) or educational apps.",
            ai_guide_edu_start2_revised: "Implement Support Chatbots: Use chatbots to automatically answer frequently asked questions about schedules, procedures, or provide basic guidance on learning materials.",
            ai_guide_edu_start3_revised: "Pilot Results Analysis: Start by using AI to analyze test results for a small group, then measure the effectiveness of personalized review material suggestions on subsequent test scores.",
            ai_guide_section_health_title: "2. AI Mindset in Healthcare & Well-being",
            ai_guide_section_health_subtitle: "2. AI Mindset in Healthcare & Well-being",
            ai_guide_health_q_revised: "Làm sao nâng cao độ chính xác và tốc độ chẩn đoán bệnh? Làm thế nào để tối ưu hóa quy trình khám chữa bệnh, giảm thời gian chờ đợi? Làm sao giám sát sức khỏe bệnh nhân từ xa một cách chủ động và hiệu quả?",
            ai_guide_health_mindset1_revised: "Tiếp cận 'Tin tưởng, nhưng Xác minh': Tận dụng các gợi ý chẩn đoán từ AI (ví dụ: phân tích hình ảnh y tế) nhưng luôn đối chiếu và xác thực bằng kinh nghiệm lâm sàng và kiến thức chuyên môn.",
            ai_guide_health_mindset2_revised: "Tập trung vào Hiệu quả Vận hành: Tìm kiếm cơ hội ứng dụng AI để giảm thiểu thời gian chờ đợi, tự động hóa các tác vụ hành chính lặp lại (nhập liệu, lên lịch hẹn), giúp đội ngũ y tế tập trung vào chăm sóc bệnh nhân.",
            ai_guide_health_mindset3_revised: "Ưu tiên Bảo mật & Đạo đức: Luôn đặt việc bảo vệ dữ liệu nhạy cảm của bệnh nhân và đảm bảo tính công bằng, minh bạch của thuật toán AI lên hàng đầu trong mọi ứng dụng.",
            ai_guide_health_ops1_revised: "Nhận dạng Hình ảnh Y tế: Khi AI phân tích ảnh X-quang hay CT scan, nó đối chiếu các đặc điểm ảnh với hàng triệu ảnh đã được gán nhãn bởi chuyên gia (bình thường/pathological) để phát hiện các dấu hiệu bất thường tiềm ẩn.",
            ai_guide_health_ops2_revised: "Phân tích Dữ liệu & Dự báo: Khi AI giám sát bệnh nhân từ xa, nó phân tích liên tục các luồng dữ liệu sinh tồn (nhịp tim, SpO2, huyết áp) và so sánh với các mẫu \"bình thường\" và \"nguy cơ\" đã học được để đưa ra cảnh báo sớm.",
            ai_guide_health_start1_revised: "Tối ưu Quản lý Hành chính: Sử dụng các phần mềm quản lý phòng khám/bệnh viện có tích hợp AI để tối ưu hóa việc đặt lịch hẹn, quản lý hồ sơ bệnh án điện tử (EMR).",
            ai_guide_health_start2_revised: "Công cụ Hỗ trợ Tra cứu Lâm sàng: Thử nghiệm các công cụ AI giúp bác sĩ nhanh chóng tra cứu thông tin y khoa, các nghiên cứu mới nhất, hoặc phác đồ điều trị cập nhật.",
            ai_guide_health_start3_revised: "Tham gia Dự án Thí điểm: Hợp tác với các đối tác công nghệ để thử nghiệm ứng dụng AI trong các lĩnh vực cụ thể (ví dụ: hỗ trợ phân tích hình ảnh, dự đoán nguy cơ tái nhập viện) trong phạm vi được kiểm soát chặt chẽ.",
            ai_guide_section_finance_title: "3. Tư duy AI trong Tài chính & Ngân hàng",
            ai_guide_section_finance_subtitle: "3. AI Mindset in Finance & Banking",
            ai_guide_finance_q_revised: "Làm thế nào nâng cao hiệu quả phát hiện và ngăn chặn gian lận? Làm sao đẩy nhanh quy trình đánh giá rủi ro tín dụng mà vẫn đảm bảo tính công bằng? Làm sao cung cấp dịch vụ hỗ trợ khách hàng tức thì, mọi lúc mọi nơi?",
            ai_guide_finance_mindset1_revised: "Tư duy Phân tích & Nghi ngờ: Luôn tìm kiếm các mẫu hình bất thường hoặc điểm không nhất quán trong dữ liệu giao dịch, coi AI là công cụ mạnh mẽ để khuếch đại khả năng phát hiện này.",
            ai_guide_finance_mindset2_revised: "Ra quyết định Dựa trên Dữ liệu: Đưa ra các quyết định nghiệp vụ (ví dụ: phê duyệt khoản vay, đánh giá rủi ro) dựa trên phân tích dữ liệu khách quan từ AI, kết hợp hài hòa với kinh nghiệm và phán đoán chuyên môn.",
            ai_guide_finance_mindset3_revised: "Nâng cao Trải nghiệm Khách hàng: Tìm cách ứng dụng AI (chatbot, trợ lý ảo, gợi ý cá nhân hóa) để mọi tương tác của khách hàng trở nên nhanh chóng, liền mạch, thuận tiện và phù hợp hơn với nhu cầu cá nhân.",
            ai_guide_finance_ops1_revised: "Phát hiện Bất thường (Anomaly Detection): AI anti-fraud systems continuously 'learn' normal transaction patterns. When a transaction deviates from these patterns (e.g., unusual location, sudden large amount, abnormal frequency), AI flags it for closer review.",
            ai_guide_finance_ops2_revised: "Phân loại & Dự đoán Rủi ro: AI credit scoring models classify customers into different risk groups by 'learning' the correlation between numerous factors (income, credit history, debt ratio,...) and historically recorded repayment ability.",
            ai_guide_finance_start1_revised: "Triển khai Chatbot Hỗ trợ Cơ bản: Tự động hóa việc trả lời các câu hỏi thường gặp về sản phẩm, dịch vụ, lãi suất, phí... để giảm tải cho bộ phận hỗ trợ khách hàng.",
            ai_guide_finance_start2_revised: "Khai thác Báo cáo Phân tích: Sử dụng các công cụ phân tích dữ liệu tích hợp AI để trực quan hóa xu hướng, hiểu rõ hơn hành vi khách hàng và hiệu quả của các chiến dịch marketing.",
            ai_guide_finance_start3_revised: "Thử nghiệm Gợi ý Sản phẩm Đơn giản: Bắt đầu bằng việc gợi ý các sản phẩm tài chính cơ bản (ví dụ: tài khoản tiết kiệm phù hợp, thẻ tín dụng cơ bản) dựa trên phân tích hồ sơ và lịch sử giao dịch của khách hàng.",
            ai_guide_section_retail_title: "4. Tư duy AI trong Bán lẻ & Thương mại điện tử",
            ai_guide_section_retail_subtitle: "4. AI Mindset in Retail & E-commerce",
            ai_guide_retail_q_revised: "How to create personalized shopping experiences that make each customer feel understood? How to accurately forecast market demand to optimize inventory and reduce waste? How to quickly grasp customer sentiment and feedback across all channels?",
            ai_guide_retail_mindset1_revised: "Customer-Centricity: Shift focus from 'selling existing products' to 'meeting and anticipating customer needs'. Always ask: 'How can AI help me analyze data to understand and serve this customer best?'.",
            ai_guide_retail_mindset2_revised: "Continuous Optimization: View every process (ordering, inventory management, pricing, marketing) as an opportunity for improvement and ask: 'Can AI automate, accelerate, or reduce costs for this step?'.",
            ai_guide_retail_mindset3_revised: "Sensitivity to Customer Data: Treat every customer touchpoint (page views, clicks, abandoned carts, product reviews) as invaluable data for AI to mine and suggest actions.",
            ai_guide_retail_mindset4_revised: "Readiness for Smart Automation: Confidently delegate repetitive and time-consuming tasks (basic chat responses, order status updates, feedback classification) to AI, allowing staff to focus on higher-value activities like expert consultation and complex complaint resolution.",
            ai_guide_retail_ops1_revised: "Learning Preferences & Behavior: When you see 'Frequently bought together' or 'Recommended for you' suggestions, AI has analyzed purchase history and Browse behavior of millions to find associations and predict your preferences.",
            ai_guide_retail_ops2_revised: "Demand Forecasting & Inventory Optimization: AI analyzes historical sales data, combined with seasonal factors, market trends, promotional campaigns, even weather data, to forecast demand for each product and recommend optimal inventory levels.",
            ai_guide_retail_ops3_revised: "Phân tích Ngôn ngữ Tự nhiên (NLP): Khi AI phân tích đánh giá khách hàng, nó sử dụng NLP để \"hiểu\" nội dung, xác định các chủ đề chính được đề cập (giá, chất lượng, vận chuyển,...) và phân loại cảm xúc (tích cực, tiêu cực, trung tính) liên quan đến từng chủ đề.",
            ai_guide_retail_start1_revised: "Kích hoạt Gợi ý Sản phẩm: Tận dụng các tính năng gợi ý sản phẩm tích hợp sẵn trên nền tảng thương mại điện tử hoặc website của bạn và theo dõi tỷ lệ chuyển đổi.",
            ai_guide_retail_start2_revised: "Sử dụng Chatbot Cơ bản: Cài đặt chatbot để xử lý tự động các yêu cầu phổ biến như kiểm tra tình trạng đơn hàng, hỏi về chính sách đổi trả, hoặc cung cấp thông tin sản phẩm cơ bản.",
            ai_guide_retail_start3_revised: "Phân tích Báo cáo Thông minh: Tập trung vào các báo cáo và dashboard được tạo bởi AI (thường có trong các công cụ phân tích hoặc nền tảng TMĐT) để nắm bắt insight về sản phẩm bán chạy, phân khúc khách hàng tiềm năng.",
            ai_guide_retail_start4_revised: "Thử nghiệm Quảng cáo Tự động: Sử dụng các tính năng quảng cáo thông minh trên Google Ads, Facebook Ads,... cho phép AI tự động tối ưu hóa việc nhắm mục tiêu đối tượng và phân bổ ngân sách quảng cáo.",
            ai_guide_section_manu_title: "5. Tư duy AI trong Sản xuất & Công nghiệp",
            ai_guide_section_manu_subtitle: "5. AI Mindset in Manufacturing & Industry",
            ai_guide_manu_q_revised: "Làm sao phát hiện khuyết tật sản phẩm với độ chính xác cao và ngay trong dây chuyền? Làm thế nào dự đoán và ngăn chặn sự cố máy móc trước khi chúng xảy ra? Làm sao tối ưu hóa luồng công việc, logistics nội bộ và chuỗi cung ứng?",
            ai_guide_manu_mindset1_revised: "Tư duy Phòng ngừa & Dự đoán: Chuyển từ phản ứng (sửa chữa khi hỏng) sang chủ động phòng ngừa (bảo trì dự đoán, dự báo sự cố). Luôn hỏi: 'Làm sao biết trước và ngăn chặn vấn đề?'.",
            ai_guide_manu_mindset2_revised: "Cam kết Chất lượng Toàn diện: Tìm cách ứng dụng AI (đặc biệt là Computer Vision) để thực hiện kiểm tra chất lượng 100% sản phẩm tự động, giảm thiểu tối đa lỗi lọt qua.",
            ai_guide_manu_mindset3_revised: "Tối ưu hóa Từng Công đoạn: Liên tục tìm kiếm cơ hội cải thiện hiệu suất dây chuyền, giảm thời gian chết của máy móc, tối ưu hóa lộ trình di chuyển của nguyên vật liệu và thành phẩm, dù là những cải tiến nhỏ.",
            ai_guide_manu_mindset4_revised: "Đặt An toàn Lên hàng đầu: Xem xét cách AI có thể hỗ trợ giám sát môi trường làm việc, phát hiện các hành vi hoặc điều kiện không an toàn tiềm ẩn và đưa ra cảnh báo kịp thời.",
            ai_guide_manu_ops1_revised: "Thị giác Máy tính (Computer Vision): Hệ thống kiểm tra chất lượng sử dụng camera để chụp ảnh sản phẩm, sau đó AI so sánh các đặc điểm (kích thước, màu sắc, bề mặt) với mẫu chuẩn đã được \"dạy\" để phát hiện sai lệch, dù rất nhỏ.",
            ai_guide_manu_ops2_revised: "Phân tích Dữ liệu Cảm biến: Các cảm biến gắn trên máy móc liên tục ghi nhận dữ liệu (rung động, nhiệt độ, áp suất). AI phân tích các chuỗi dữ liệu theo thời gian này, tìm kiếm những mẫu hình bất thường (so với hoạt động bình thường) có thể báo hiệu sự cố sắp xảy ra.",
            ai_guide_manu_ops3_revised: "Tối ưu hóa Quy trình (Optimization): Khi tối ưu hóa logistics nội bộ, AI xem xét vô số biến số (bố trí nhà máy, vị trí kho, lịch trình sản xuất, tình trạng tắc nghẽn) để tính toán và đề xuất lộ trình di chuyển hiệu quả nhất cho robot tự hành (AGV) hoặc công nhân.",
            ai_guide_manu_start1_revised: "Kiểm tra Chất lượng bằng Hình ảnh: Bắt đầu với việc triển khai hệ thống camera và phần mềm AI cơ bản trên một công đoạn quan trọng để tự động phát hiện các lỗi bề mặt rõ ràng hoặc sai sót lắp ráp đơn giản.",
            ai_guide_manu_start2_revised: "Giám sát Tình trạng Máy móc Cơ bản: Sử dụng các phần mềm phân tích có sẵn để theo dõi dữ liệu từ các cảm biến hiện có (nhiệt độ, rung động), thiết lập cảnh báo khi vượt ngưỡng an toàn hoặc phát hiện xu hướng bất thường.",
            ai_guide_manu_start3_revised: "Thử nghiệm Robot Tự hành (AGV) Đơn giản: Áp dụng AGV cho các nhiệm vụ vận chuyển vật liệu lặp đi lặp lại, có lộ trình cố định và ít phức tạp trong nhà xưởng.",
            ai_guide_manu_start4_revised: "Phân tích Hiệu suất Dây chuyền: Sử dụng các công cụ Business Intelligence (BI) có khả năng tích hợp AI để phân tích dữ liệu sản xuất (OEE, thời gian chu kỳ, tỷ lệ lỗi), xác định các điểm nghẽn và cơ hội cải tiến.",
            ai_guide_section_agri_title: "6. Tư duy AI trong Nông nghiệp",
            ai_guide_section_agri_subtitle: "6. AI Mindset in Agriculture",
            ai_guide_agri_q_revised: "Làm sao cung cấp chính xác lượng nước và dinh dưỡng cần thiết cho từng khu vực cây trồng hoặc từng cá thể vật nuôi? Làm thế nào phát hiện sớm các dấu hiệu sâu bệnh, dịch bệnh để xử lý kịp thời? Làm sao dự báo năng suất và chất lượng nông sản một cách đáng tin cậy?",
            ai_guide_agri_mindset1_revised: "Quan sát Tinh tế & Kết hợp Dữ liệu: Chú ý đến những biểu hiện nhỏ nhất của cây trồng, vật nuôi và môi trường xung quanh; xem dữ liệu từ cảm biến, hình ảnh như một cách \"mở rộng giác quan\" để đưa ra nhận định chính xác hơn.",
            ai_guide_agri_mindset2_revised: "Tư duy Canh tác/Chăn nuôi Chính xác: Hướng tới việc cung cấp đúng yếu tố đầu vào (nước, phân bón, thuốc, thức ăn) cho đúng vị trí, đúng thời điểm và đúng liều lượng cần thiết, thay vì áp dụng đồng loạt trên diện rộng.",
            ai_guide_agri_mindset3_revised: "Thích ứng Chủ động với Môi trường: Sử dụng AI để phân tích và dự báo các yếu tố môi trường (thời tiết, chất lượng đất, độ ẩm) nhằm đưa ra các quyết định canh tác, chăn nuôi hoặc điều chỉnh kế hoạch một cách kịp thời và hiệu quả.",
            ai_guide_agri_mindset4_revised: "Tối ưu hóa Hiệu quả Tài nguyên: Luôn tìm cách giảm thiểu lãng phí và sử dụng các nguồn lực (nước, phân bón, năng lượng, thức ăn) một cách hiệu quả và bền vững nhất với sự hỗ trợ của phân tích và dự báo từ AI.",
            ai_guide_agri_ops1_revised: "Phân tích Hình ảnh Nông nghiệp: Khi AI phân tích ảnh chụp từ drone hoặc vệ tinh, nó so sánh các đặc điểm quang phổ (màu sắc, chỉ số thực vật NDVI) với cơ sở dữ liệu đã được \"huấn luyện\" để xác định tình trạng sức khỏe cây trồng, mức độ thiếu hụt dinh dưỡng, hoặccác vùng bị sâu bệnh.",
            ai_guide_agri_ops2_revised: "Mô hình hóa & Dự báo Năng suất: AI xây dựng các mô hình phức tạp bằng cách \"học\" mối liên hệ giữa vô số yếu tố đầu vào (dữ liệu thời tiết lịch sử và dự báo, loại đất, giống cây trồng, lịch sử canh tác, lượng phân bón) và năng suất thực tế đã thu hoạch trong quá khứ để đưa ra dự báo cho vụ mùa hiện tại.",
            ai_guide_agri_ops3_revised: "Ra quyết định Tối ưu: Khi đưa ra khuyến nghị tưới tiêu hoặc bón phân, AI tích hợp dữ liệu thời gian thực từ cảm biến (độ ẩm đất,độ dẫn điện EC), dự báo thời tiết ngắn hạn, và giai đoạn sinh trưởng của cây trồng để tính toán chính xác lượng nước hoặc dinh dưỡng cần thiết, tránh thừa hoặc thiếu.",
            ai_guide_agri_start1_revised: "Sử dụng Ứng dụng Nông nghiệp Thông minh: Cài đặt và sử dụng các ứng dụng di động cung cấp thông tin thời tiết nông nghiệp chi tiết, cảnh báo sâu bệnh dựa trên mô hình AI, hoặc nhật ký canh tác số.",
            ai_guide_agri_start2_revised: "Lắp đặt Cảm biến Môi trường Cơ bản: Bắt đầu bằng việc triển khai một số cảm biến đơn giản (đo độ ẩm đất, nhiệt độ, độ ẩm không khí) tại các vị trí chiến lược trong trang trại để thu thập dữ liệu và theo dõi biến động.",
            ai_guide_agri_start3_revised: "Chụp ảnh Drone Định kỳ: Sử dụng drone để chụp ảnh tổng quan đồng ruộng/trang trại theo lịch trình đều đặn. Phân tích các hình ảnh này (thủ công hoặc bằng phần mềm cơ bản) để phát hiện sớm các vùng cây trồng có dấu hiệu bất thường.",
            ai_guide_agri_start4_revised: "Tham khảo Dịch vụ Dự báo: Tìm kiếm và sử dụng các dịch vụ trực tuyến hoặc tư vấn cung cấp dự báo năng suất, cảnh báo dịch bệnh dựa trên mô hình AI cho khu vực và loại cây trồng/vật nuôi cụ thể của bạn.",
            ai_guide_section_hosp_title: "7. Tư duy AI trong Du lịch & Nhà hàng Khách sạn",
            ai_guide_section_hosp_subtitle: "7. AI Mindset in Tourism & Hospitality",
            ai_guide_hosp_q_revised: "Làm thế nào để mang đến những trải nghiệm độc đáo và cá nhân hóa sâu sắc cho từng du khách? Làm sao dự báo chính xác biến động nhu cầu để tối ưu hóa giá phòng/dịch vụ và công suất phục vụ? Làm sao quản lý hiệu quả danh tiếng trực tuyến và tương tác với phản hồi của khách hàng?",
            ai_guide_hosp_mindset1_revised: "Thấu hiểu Khách hàng Toàn diện: Không ngừng tìm hiểu sở thích, nhu cầu tiềm ẩn và hành vi của khách hàng thông qua mọi điểm chạm; xem AI là công cụ phân tích dữ liệu mạnh mẽ để đạt được sự thấu hiểu này.",
            ai_guide_hosp_mindset2_revised: "Linh hoạt trong Định giá & Vận hành: Sẵn sàng điều chỉnh giá cả, phân bổ nguồn lực (nhân sự, phòng ốc) một cách linh hoạt dựa trên các dự báo nhu cầu và công suất theo thời gian thực do AI cung cấp.",
            ai_guide_hosp_mindset3_revised: "Quản lý Danh tiếng Chủ động: Coi trọng mọi đánh giá và phản hồi trực tuyến; sử dụng AI để tự động theo dõi, phân tích cảm xúc, xác định các vấn đề cần ưu tiên và hỗ trợ phản hồi nhanh chóng, chuyên nghiệp.",
            ai_guide_hosp_mindset4_revised: "Tối ưu hóa Quy trình Dịch vụ: Tìm kiếm cơ hội ứng dụng AI để tự động hóa các quy trình lặp lại (check-in/out đơn giản, trả lời câu hỏi thường gặp qua chatbot, gợi ý dịch vụ) nhằm nâng cao hiệu quả và giải phóng nhân viên cho các tương tác cá nhân hóa hơn.",
            ai_guide_hosp_ops1_revised: "Hệ thống Gợi ý (Recommendation Engines): Dựa trên dữ liệu về lịch sử đặt phòng, tìm kiếm, thông tin hồ sơ và hành vi của khách hàng tương tự, AI \"học\" các mẫu sở thích và đề xuất các gói dịch vụ, nâng cấp phòng, hoạt động hoặc nhà hàng phù hợp nhất với từng cá nhân.",
            ai_guide_hosp_ops2_revised: "Định giá Động (Dynamic Pricing): AI phân tích đồng thời nhiều yếu tố (dữ liệu đặt phòng lịch sử, công suất phòng hiện tại, sự kiện địa phương, giá của đối thủ cạnh tranh, ngày trong tuần, thời gian đặt trước,...) để dự báo nhu cầu và tự động điều chỉnh giá phòng/dịch vụ nhằm tối ưu hóa doanh thu và tỷ lệ lấp đầy.",
            ai_guide_hosp_ops3_revised: "Phân tích Cảm xúc Khách hàng: Sử dụng NLP, AI \"đọc\" và phân tích hàng loạt đánh giá, bình luận trên các nền tảng đặt phòng, mạng xã hội để xác định các chủ đề được thảo luận nhiều nhất (ví dụ: sạch sẽ, thái độ nhân viên, chất lượng bữa sáng) và đánh giá cảm xúc chung (tích cực/tiêu cực) đối với từng chủ đề đó.",
            ai_guide_hosp_start1_revised: "Sử dụng Hệ thống Quản lý Doanh thu (RMS): Tận dụng các tính năng dự báo và đề xuất giá tự động có sẵn trong các hệ thống RMS hiện đại hoặc xem xét nâng cấp lên hệ thống có tích hợp AI.",
            ai_guide_hosp_start2_revised: "Triển khai Chatbot Hỗ trợ Khách hàng: Cài đặt chatbot trên website hoặc ứng dụng nhắn tin để trả lời tự động các câu hỏi phổ biến 24/7 về tiện nghi, giờ hoạt động, chính sách hủy phòng, hướng dẫn đường đi.",
            ai_guide_hosp_start3_revised: "Công cụ Quản lý Đánh giá Trực tuyến: Sử dụng các công cụ giúp tổng hợp đánh giá từ nhiều kênh (TripAdvisor, Google, Booking.com,...), có thể tích hợp AI để phân tích cảm xúc và tóm tắt các điểm chính cần chú ý.",
            ai_guide_hosp_start4_revised: "Phân tích Dữ liệu Đặt phòng Cơ bản: Sử dụng các công cụ báo cáo trong hệ thống quản lý khách sạn (PMS) hoặc công cụ BI để xác định các xu hướng đặt phòng, nguồn khách hàng chính, và các dịch vụ được ưa chuộng nhất." ,
            ai_guide_emphasis_title: "Emphasis",
            ai_guide_emphasis_subtitle: "Emphasis",
            ai_guide_emphasis_p1_revised: "The key to harnessing AI's power lies not in becoming a programming expert, but in the ability to ask the right strategic questions, view business problems through the lens of data and automation opportunities, and possess a willingness to experiment and learn from new solutions. AI is a powerful tool that assists humans in making more informed decisions, optimizing workflows, and enhancing overall efficiency. Start with small, measurable applications, and always focus on the tangible value AI brings to your organization. This is entirely achievable for you and your team."
        }
    };
    
    
    // Global flag to ensure language is initialized only once
    window.languageInitialized = false;
    
    /**
     * Applies translations to DOM elements based on data-lang-key attribute.
     * Handles different element types and basic Markdown (**bold**, *italic*).
     * Also handles dynamic year replacement for {year} placeholder.
     * @param {string} lang - The target language code ('vi' or 'en').
     */
    function applyTranslations(lang) {
        console.log(`[Language] Applying translations for: ${lang}`);
        const currentYear = new Date().getFullYear(); // Get current year
    
        document.querySelectorAll('[data-lang-key]').forEach(element => {
            const key = element.getAttribute('data-lang-key');
            let translation = translations[lang]?.[key]; // Safe access
    
            if (translation !== undefined) {
                // Replace {year} placeholder if it exists in the translation string
                if (typeof translation === 'string') {
                    translation = translation.replace('{year}', currentYear);
                }
    
                const tagName = element.tagName;
                const nameAttr = element.getAttribute('name');
                const propertyAttr = element.getAttribute('property');
    
                if (tagName === 'META' && nameAttr === 'description') {
                    element.content = translation;
                } else if (tagName === 'META' && propertyAttr === 'og:title') {
                    element.content = translation;
                } else if (tagName === 'META' && propertyAttr === 'og:description') {
                    element.content = translation;
              } else if (tagName === 'META' && propertyAttr === 'og:image') {
                element.content = translation; // Handle OG image URL
                } else if (tagName === 'TITLE') {
                    document.title = translation; // Use document.title for cross-browser compatibility
                } else if (tagName === 'INPUT' || tagName === 'TEXTAREA') {
                    // Check for specific placeholder key first (e.g., key_placeholder)
                    const placeholderKey = key + '_placeholder';
                    let placeholderTranslation = translations[lang]?.[placeholderKey];
                  if (placeholderTranslation !== undefined) {
                      if (typeof placeholderTranslation === 'string') {
                          placeholderTranslation = placeholderTranslation.replace('{year}', currentYear);
                      }
                      element.placeholder = placeholderTranslation;
                  } else if (element.hasAttribute('placeholder') && translations[lang]?.[key + '_label'] === undefined) {
                       // Fallback to main key for placeholder only if element HAS placeholder and no specific label key exists
                       // This prevents overwriting placeholder with a label accidentally
                       // element.placeholder = translation; // Avoid setting placeholder if not intended
                       console.warn(`[Language] Placeholder key ${placeholderKey} not found for element with key ${key}. No specific label key found either.`);
                  }
    
                  // Handle input labels (if using <label for="input-id" data-lang-key="input_label_key">)
                  const labelKey = key + '_label';
                  let labelTranslation = translations[lang]?.[labelKey];
                  if (labelTranslation !== undefined) {
                      // Find associated label and update it (assuming label has its own data-lang-key or related structure)
                      const labelElement = document.querySelector(`label[data-lang-key="${labelKey}"]`);
                      if (labelElement) {
                          if (typeof labelTranslation === 'string') {
                              labelTranslation = labelTranslation.replace('{year}', currentYear);
                          }
                          // Apply markdown or text content as needed
                          const hasMarkdown = /\*\*|\*/.test(labelTranslation);
                          if (hasMarkdown) {
                              labelTranslation = labelTranslation.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>');
                              labelElement.innerHTML = labelTranslation;
                          } else {
                              labelElement.textContent = labelTranslation;
                          }
                      }
                  }
    
                    // Check for value attribute (e.g., submit button)
                    if ((element.type === 'button' || element.type === 'submit') && element.hasAttribute('value')) {
                         element.value = translation; // Update button value if key matches
                     }
                } else if (tagName === 'IMG') {
                    // Check for specific alt key first (e.g., key_alt)
                    const altKey = key + '_alt';
                    let altTranslation = translations[lang]?.[altKey];
                    // Use main key as fallback alt text only if specific alt key is missing AND main key is a string
                    element.alt = altTranslation !== undefined ? altTranslation : (typeof translation === 'string' ? translation : `Image: ${key}`);
                    if (altTranslation !== undefined && typeof altTranslation === 'string') {
                        element.alt = altTranslation.replace('{year}', currentYear);
                    } else if (typeof translation === 'string') {
                        element.alt = translation.replace('{year}', currentYear);
                    } else {
                         element.alt = `Image: ${key}`; // Default alt if no translation found
                    }
    
                } else if (tagName === 'BUTTON' && element.querySelector('.sr-only')) {
                     // Update screen-reader text within buttons
                     const srOnlySpan = element.querySelector('.sr-only');
                     if (srOnlySpan) {
                         srOnlySpan.textContent = translation;
                     }
                } else if (tagName === 'SELECT') {
                  // Handle options within a select dropdown
                  const options = element.querySelectorAll('option');
                  options.forEach(option => {
                      const optionKey = option.getAttribute('data-lang-key');
                      if (optionKey) {
                          let optionTranslation = translations[lang]?.[optionKey];
                          if (optionTranslation !== undefined) {
                               if (typeof optionTranslation === 'string') {
                                  optionTranslation = optionTranslation.replace('{year}', currentYear);
                               }
                              option.textContent = optionTranslation;
                          } else {
                              console.warn(`[Language] Translation missing for option key: "<span class="math-inline">\{optionKey\}" in language\: "</span>{lang}"`);
                          }
                      }
                  });
                  // Also handle the placeholder option if it uses the main select's key + _placeholder
                  const placeholderOptionKey = key + '_select_placeholder'; // e.g., form_label_interest_select_placeholder
                  let placeholderOptionTranslation = translations[lang]?.[placeholderOptionKey];
                  if (placeholderOptionTranslation !== undefined) {
                      const placeholderOption = element.querySelector('option[value=""]'); // Assuming placeholder has empty value
                      if (placeholderOption) {
                          if (typeof placeholderOptionTranslation === 'string') {
                            placeholderOptionTranslation = placeholderOptionTranslation.replace('{year}', currentYear);
                          }
                          placeholderOption.textContent = placeholderOptionTranslation;
                          // Ensure it's selected and disabled if needed (might need CSS/JS logic elsewhere)
                          // placeholderOption.disabled = true;
                          // placeholderOption.selected = true;
                      }
                  } else {
                      // Check for a specific placeholder defined differently (e.g., directly on option)
                      const explicitPlaceholderOption = element.querySelector('option[data-lang-key$="_placeholder"]');
                      if (explicitPlaceholderOption) {
                          const explicitPlaceholderKey = explicitPlaceholderOption.getAttribute('data-lang-key');
                          let explicitTranslation = translations[lang]?.[explicitPlaceholderKey];
                           if (explicitTranslation !== undefined) {
                               if (typeof explicitTranslation === 'string') {
                                  explicitTranslation = explicitTranslation.replace('{year}', currentYear);
                               }
                              explicitPlaceholderOption.textContent = explicitTranslation;
                           } else {
                                console.warn(`[Language] Translation missing for explicit placeholder option key: "<span class="math-inline">\{explicitPlaceholderKey\}" in language\: "</span>{lang}"`);
                           }
                      }
                  }
    
                } else {
                    // Apply to other elements (P, SPAN, H*, LI, A, BUTTON text content etc.)
                    // Handle basic Markdown: **bold** and *italic*
                    let finalTranslation = translation;
                  // Ensure it's a string before regex test
                  if (typeof finalTranslation !== 'string') {
                    console.warn(`[Language] Translation for key "${key}" is not a string, skipping markdown/text update.`);
                    return; // Skip non-string translations for text content
                  }
    
                    const hasMarkdown = /\*\*|\*/.test(finalTranslation); // Check if markdown exists
    
                    if (hasMarkdown) {
                        // Convert Markdown to HTML
                        finalTranslation = finalTranslation.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                        finalTranslation = finalTranslation.replace(/\*(.*?)\*/
