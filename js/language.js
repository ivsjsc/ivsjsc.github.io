// /js/language.js
// Phiên bản: Tải bản dịch từ tệp JSON riêng biệt

// Object để lưu trữ nội dung dịch đã tải
let translations = {};

// Ngôn ngữ mặc định
const defaultLanguage = 'vi';

// Khóa lưu ngôn ngữ trong localStorage
const languageStorageKey = 'userLanguage';

// Hàm tải nội dung dịch từ tệp JSON
async function loadTranslations(lang) {
    try {
        // Xây dựng đường dẫn đến tệp JSON dựa trên ngôn ngữ
        const response = await fetch(`/languages/${lang}.json`);

        if (!response.ok) {
            // Nếu không tải được tệp JSON của ngôn ngữ yêu cầu, thử tải ngôn ngữ mặc định
             console.warn(`Could not load translations for ${lang}. Falling back to default language: ${defaultLanguage}`);
             if (lang !== defaultLanguage) {
                 // Tránh lặp vô hạn nếu cả ngôn ngữ mặc định cũng lỗi
                 const defaultResponse = await fetch(`/languages/${defaultLanguage}.json`);
                 if (!defaultResponse.ok) {
                      throw new Error(`Could not load translations for default language ${defaultLanguage}`);
                 }
                 translations = await defaultResponse.json();
                 applyTranslations();
                 return; // Dừng hàm sau khi tải ngôn ngữ mặc định
             } else {
                 // Nếu ngôn ngữ mặc định cũng lỗi, báo lỗi và dừng
                 throw new Error(`Could not load translations for default language ${defaultLanguage}`);
             }
        }

        // Parse JSON và lưu vào biến translations
        translations = await response.json();
        // Áp dụng bản dịch sau khi tải xong
        applyTranslations();
        console.log(`Translations loaded and applied for ${lang}`);

        // Cập nhật thuộc tính lang của thẻ html
        document.documentElement.lang = lang;

    } catch (error) {
        console.error("Error loading or applying translations:", error);
        // Có thể thêm logic hiển thị thông báo lỗi cho người dùng tại đây
    }
}

// Hàm áp dụng nội dung dịch lên các phần tử HTML
function applyTranslations() {
    // Lặp qua tất cả các phần tử có thuộc tính data-lang-key
    document.querySelectorAll('[data-lang-key]').forEach(element => {
        const key = element.getAttribute('data-lang-key');
        // Lấy ngôn ngữ hiện tại để truy cập đúng bản dịch
        const currentLang = getCurrentLanguage();

        // Kiểm tra xem key có tồn tại trong bản dịch của ngôn ngữ hiện tại không
        if (translations[key] !== undefined) {
            // Kiểm tra nếu giá trị là object (dùng cho các thuộc tính như alt, placeholder)
            if (typeof translations[key] === 'object' && translations[key] !== null) {
                 // Xử lý các thuộc tính đặc biệt dựa trên data-lang-key-*
                 if (element.hasAttribute('data-lang-key-placeholder')) {
                      element.placeholder = translations[key][currentLang] || '';
                 } else if (element.hasAttribute('data-lang-key-alt')) {
                      element.alt = translations[key][currentLang] || '';
                 }
                 // TODO: Thêm xử lý cho các thuộc tính khác nếu cần (ví dụ: data-lang-key-title, data-lang-key-value)
            } else {
                // Áp dụng nội dung văn bản cho các phần tử
                element.innerHTML = translations[key];
            }
        } else {
            // Cảnh báo nếu không tìm thấy key dịch
            console.warn(`Translation key "${key}" not found for language "${currentLang}"`);
             // Có thể để trống hoặc hiển thị key để dễ debug
             // element.innerHTML = `[${key}]`;
        }
    });

    // Cập nhật các thuộc tính đặc biệt sử dụng data-lang-key-*
    // Lặp riêng để đảm bảo xử lý các trường hợp chỉ có data-lang-key-* mà không có data-lang-key
     document.querySelectorAll('[data-lang-key-placeholder]').forEach(element => {
         const key = element.getAttribute('data-lang-key-placeholder');
         const currentLang = getCurrentLanguage();
          if (translations[key] && typeof translations[key] === 'object' && translations[key][currentLang] !== undefined) {
               element.placeholder = translations[key][currentLang];
          } else {
               console.warn(`Translation key for placeholder "${key}" not found for language "${currentLang}" or not an object.`);
          }
     });

      document.querySelectorAll('[data-lang-key-alt]').forEach(element => {
          const key = element.getAttribute('data-lang-key-alt');
          const currentLang = getCurrentLanguage();
           if (translations[key] && typeof translations[key] === 'object' && translations[key][currentLang] !== undefined) {
                element.alt = translations[key][currentLang];
           } else {
                console.warn(`Translation key for alt "${key}" not found for language "${currentLang}" or not an object.`);
           }
      });

    // Cập nhật năm hiện tại trong footer nếu có
    const currentYearElement = document.getElementById('current-year');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }

    // TODO: Cập nhật các meta tag nếu cần (title, description, og:title, og:description)
    // Điều này cần xử lý riêng vì chúng nằm trong <head>
    // Ví dụ:
    // document.title = translations['page_title_index'] || translations['page_title_default'];
    // document.querySelector('meta[name="description"]').setAttribute('content', translations['meta_description_index'] || translations['meta_description']);
    // ... tương tự cho các meta tag khác
}


// Hàm lấy ngôn ngữ hiện tại (từ localStorage hoặc ngôn ngữ trình duyệt, sau đó fallback về mặc định)
function getCurrentLanguage() {
    // Ưu tiên ngôn ngữ đã lưu trong localStorage
    const storedLang = localStorage.getItem(languageStorageKey);
    if (storedLang) {
        return storedLang;
    }

    // Nếu chưa lưu, thử phát hiện ngôn ngữ từ trình duyệt
    // Lưu ý: navigator.language có thể trả về "en-US", cần xử lý để lấy phần đầu "en"
    const browserLang = navigator.language.split('-')[0];
    // Kiểm tra xem ngôn ngữ trình duyệt có trong danh sách hỗ trợ không (cần định nghĩa danh sách này)
    // Tạm thời chỉ hỗ trợ 'vi' và 'en' dựa trên các tệp JSON đã có
    const supportedLanguages = ['vi', 'en']; // Cần cập nhật nếu có thêm ngôn ngữ

    if (supportedLanguages.includes(browserLang)) {
        return browserLang;
    }
        large_button_placement: "English Placement Test",
        large_button_placement_subtext: "Kiểm tra trình độ tiếng Anh",
        small_button_preschool: "Mầm non",
        small_button_primary: "Tiểu học",
        small_button_secondary: "THCS/THPT",
        small_button_language_center: "TT Anh Ngữ",
        small_button_lifeskills: "Kỹ năng sống",
        small_button_steam: "STEAM",
        small_button_international: "Hợp tác QT",
        small_button_consulting: "Hãy Nói - Tiếng Nói Tuổi Trẻ",
        index_vnexpress_title: "Tin tức Giáo dục mới nhất từ VnExpress",

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
        about_values_strong: "Chất lượng – Tận tâm – Sáng tạo – Bình đẳng.",
        about_values_desc: " Chúng tôi cam kết mang đến dịch vụ giáo dục tốt nhất với sự tận tụy, không ngừng đổi mới và đảm bảo cơ hội học tập công bằng cho mọi người.",
        about_leadership_heading: "Đội Ngũ Lãnh Đạo",
        about_leadership_img_alt: "Nguyễn Minh Triết - CEO",
        about_leadership_name: "Ông Nguyễn Minh Triết",
        about_leadership_title: "Tổng Giám đốc (CEO) kiêm Chủ tịch HĐQT",
        about_leadership_desc: "Với nền tảng vững chắc về Ngôn ngữ Anh, Quản trị Kinh doanh (MBA - ĐH FPT) và kinh nghiệm quản lý giáo dục, ông Triết dẫn dắt IVS JSC bằng tầm nhìn chiến lược và tâm huyết với sự nghiệp giáo dục. Ông có kinh nghiệm làm việc tại các tổ chức uy tín như VietJet Air, The Grand Ho Tram Strip, và AMG Education.",
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
        services: "Dịch Vụ",
        footer_service_languages: "IVS Languages",
        footer_service_lifeminds: "IVS LifeMinds",
        footer_service_media: "IVS Media",
        footer_service_celestech: "IVS Celestech",
        footer_service_rnd: "R&D Chương trình",
        careers: "Tuyển Dụng",
        contact: "Liên Hệ",
        blog: "Tin tức",
        contact_us: "Liên Hệ",
        address: "Số 1104, Tổ 6, Ấp Đất Mới, Xã Long Phước, Huyện Long Thành, Tỉnh Đồng Nai, Việt Nam, 76213.",
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
        footer_connect: "Kết nối với chúng tôi",
        footer_facebook: "Facebook",
        footer_youtube: "YouTube",
        footer_linkedin: "LinkedIn",
        footer_tiktok: "TikTok",
        footer_instagram: "Instagram",
        footer_zalo: "Zalo",

        // --- Trang R&D, Tài trợ, Celestech, Placement, Establishment ---
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
        phone_number: "Số điện thoại",
        email_address: "Địa chỉ Email: ivscorp.vn@gmail.com",

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
        ai_tool_desc_chatgpt: "Text generation, question answering, translation, code writing",
        ai_tool_desc_gemini: "Tương tự ChatGPT, tích hợp sâu với hệ sinh thái Google",
        ai_tool_desc_claude: "Tập trung vào an toàn và đạo đức AI, khả năng xử lý ngữ cảnh dài",
        ai_tool_desc_grok: "LLM tích hợp với X (Twitter), tập trung vào thông tin thời gian thực và hài hước",
        ai_tool_desc_deepseek: "LLM mạnh về viết mã (code generation) và song ngữ",
        ai_tool_desc_copilot: "AI assistant integrated into Microsoft 365 applications",
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
        ai_guide_health_mindset1_revised: "Tiếp cận 'Tin tưởng, nhưng Xác minh': Tận dụng các gợi ý chẩn đoán từ AI (ví dụ: phân tích hình ảnh y tế) nhưng luôn đối chiếu và xác thực bằng kinh nghiệm lâm sàng và kiến thứcchuyên môn.",
        ai_guide_health_mindset2_revised: "Tập trung vào Hiệu quả Vận hành: Tìm kiếm cơ hội ứng dụng AI để giảm thiểu thời gian chờ đợi, tự động hóa các tác vụ hành chính lặp lại (data entry, scheduling), giúp đội ngũ y tế tập trung vào chăm sóc bệnh nhân.",
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
        ai_guide_finance_mindset3_revised: "Nâng cao Trải nghiệm Khách hàng: Tìm cách ứng dụng AI (chatbots, virtual assistants, personalized recommendations) để mọi tương tác của khách hàng trở nên nhanh chóng, liền mạch, thuận tiện và phù hợp hơn với nhu cầu cá nhân.",
        ai_guide_finance_ops1_revised: "Phát hiện Bất thường (Anomaly Detection): AI anti-fraud systems continuously 'learn' normal transaction patterns. When a transaction deviates from these patterns (e.g., unusual location, sudden large amount, abnormal frequency), AI flags it for closer review.",
        ai_guide_finance_ops2_revised: "Phân loại & Dự đoán Rủi ro: AI credit scoring models classify customers into different risk groups by 'learning' the correlation between numerous factors (income, credit history, debt ratio,...) and historically recorded repayment ability.",
        ai_guide_finance_start1_revised: "Triển khai Chatbot Hỗ trợ Cơ bản: Tự động hóa việc trả lời các câu hỏi thường gặp về sản phẩm, dịch vụ, lãi suất, phí... để giảm tải cho bộ phận hỗ trợ khách hàng.",
        ai_guide_finance_start2_revised: "Khai thác Báo cáo Phân tích: Sử dụng các công cụ phân tích dữ liệu tích hợp AI để trực quan hóa xu hướng, hiểu rõ hơn hành vi khách hàng và hiệu quả của các chiến dịch marketing.",
        ai_guide_finance_start3_revised: "Thử nghiệm Gợi ý Sản phẩm Đơn giản: Bắt đầu bằng việc gợi ý các sản phẩm tài chính cơ bản (ví dụ: tài khoản tiết kiệm phù hợp, thẻ tín dụng cơ bản) dựa trên phân tích hồ sơ và lịch sử giao dịch của khách hàng.",
        ai_guide_section_retail_title: "4. Tư duy AI trong Bán lẻ & Thương mại điện tử",
        ai_guide_section_retail_subtitle: "4. AI Mindset in Retail & E-commerce",
        ai_guide_retail_q_revised: "Làm sao tạo ra trải nghiệm mua sắm cá nhân hóa, khiến mỗi khách hàng cảm thấy được thấu hiểu? Làm sao dự báo chính xác nhu cầu thị trường để tối ưu hóa hàng tồn kho và giảm lãng phí? Làm sao nắm bắt nhanh chóng tâm lý và phản hồi của khách hàng trên mọi kênh?",
        ai_guide_retail_mindset1_revised: "Lấy Khách hàng làm Trung tâm: Chuyển dịch trọng tâm từ 'bán sản phẩm hiện có' sang 'đáp ứng và dự đoán nhu cầu khách hàng'. Luôn tự vấn: 'Làm thế nào AI giúp tôi phân tích dữ liệu để hiểu và phục vụ khách hàng này một cách tốt nhất?'.",
        ai_guide_retail_mindset2_revised: "Tối ưu hóa Liên tục: Nhìn nhận mọi quy trình (đặt hàng, quản lý kho, định giá, marketing) như một cơ hội cải tiến và đặt câu hỏi: 'AI có thể tự động hóa, tăng tốc, hoặc giảm chi phí cho bước này không?'.",
        ai_guide_retail_mindset3_revised: "Nhạy bén với Dữ liệu Khách hàng: Coi mọi điểm chạm của khách hàng (page views, clicks, abandoned carts, product reviews) là nguồn dữ liệu vô giá để AI khai thác và đưa ra gợi ý hành động.",
        ai_guide_retail_mindset4_revised: "Sẵn sàng Tự động hóa Thông minh: Tin tưởng giao phó các tác vụ lặp lại và tốn thời gian (phản hồi chat cơ bản, cập nhật trạng thái đơn hàng, phân loại phản hồi) cho AI, để đội ngũ nhân viên tập trung vào các hoạt động giá trị cao hơn như tư vấn chuyên sâu, giải quyết khiếu nại phức tạp.",
        ai_guide_retail_ops1_revised: "Học Sở thích & Hành vi: Khi bạn thấy gợi ý 'Sản phẩm thường được mua cùng' hoặc 'Gợi ý cho bạn', đó là AI đã phân tích lịch sử mua hàng và hành vi duyệt web của hàng triệu người để tìm ra các mối liên kết và dự đoán sở thích của bạn.",
        ai_guide_retail_ops2_revised: "Dự báo Nhu cầu & Tối ưu Tồn kho: AI phân tích dữ liệu bán hàng lịch sử, kết hợp các yếu tố mùa vụ, xu hướng thị trường, chiến dịch khuyến mãi, thậm chí cả dữ liệu thời tiết, để dự báo nhu cầu cho từng sản phẩm và đề xuất mức tồn kho tối ưu.",
        ai_guide_retail_ops3_revised: "Phân tích Ngôn ngữ Tự nhiên (NLP): Khi AI phân tích đánh giá khách hàng, nó sử dụng NLP để 'hiểu' nội dung, xác định các chủ đề chính được đề cập (giá, chất lượng, vận chuyển,...) và phân loại cảm xúc (tích cực, tiêu cực, trung tính) liên quan đến từng chủ đề.",
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
        ai_guide_agri_ops3_revised: "Ra quyết định Tối ưu: Khi đưa ra khuyến nghị tưới tiêu hoặc bón phân, AI tích hợp dữ liệu thời gian thực từ cảm biến (độ ẩm đất, độ dẫn điện EC), dự báo thời tiết ngắn hạn, và giai đoạn sinh trưởng của cây trồng để tính toán chính xác lượng nước hoặc dinh dưỡng cần thiết, tránh thừa hoặc thiếu.",
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
        ai_guide_hosp_ops1_revised: "Hệ thống Gợi ý (Recommendation Engines): Dựa trên dữ liệu về lịch sử đặt phòng, tìm kiếm, thông tin hồ sơ và hành vi của khách hàng tương tự, AI 'học' các mẫu sở thích và đề xuất các gói dịch vụ, nâng cấp phòng, hoạt động hoặc nhà hàng phù hợp nhất với từng cá nhân.",
        ai_guide_hosp_ops2_revised: "Định giá Động (Dynamic Pricing): AI phân tích đồng thời nhiều yếu tố (dữ liệu đặt phòng lịch sử, công suất phòng hiện tại, sự kiện địa phương, giá của đối thủ cạnh tranh, ngày trong tuần, thời gian đặt trước,...) để dự báo nhu cầu và tự động điều chỉnh giá phòng/dịch vụ nhằm tối ưu hóa doanh thu và tỷ lệ lấp đầy.",
        ai_guide_hosp_ops3_revised: "Phân tích Cảm xúc Khách hàng: Sử dụng NLP, AI 'đọc' và phân tích hàng loạt đánh giá, bình luận trên các nền tảng đặt phòng, mạng xã hội để xác định các chủ đề được thảo luận nhiều nhất (ví dụ: sạch sẽ, thái độ nhân viên, chất lượng bữa sáng) và đánh giá cảm xúc chung (tích cực/tiêu cực) đối với từng chủ đề đó.",
        ai_guide_hosp_start1_revised: "Sử dụng Hệ thống Quản lý Doanh thu (RMS): Tận dụng các tính năng dự báo và đề xuất giá tự động có sẵn trong các hệ thống RMS hiện đại hoặc xem xét nâng cấp lên hệ thống có tích hợp AI.",
        ai_guide_hosp_start2_revised: "Triển khai Chatbot Hỗ trợ Khách hàng: Cài đặt chatbot trên website hoặc ứng dụng nhắn tin để trả lời tự động các câu hỏi phổ biến 24/7 về tiện nghi, giờ hoạt động, chính sách hủy phòng, hướng dẫn đường đi.",
        ai_guide_hosp_start3_revised: "Công cụ Quản lý Đánh giá Trực tuyến: Sử dụng các công cụ giúp tổng hợp đánh giá từ nhiều kênh (TripAdvisor, Google, Booking.com,...), có thể tích hợp AI để phân tích cảm xúc và tóm tắt các điểm chính cần chú ý.",
        ai_guide_hosp_start4_revised: "Phân tích Dữ liệu Đặt phòng Cơ bản: Sử dụng các công cụ báo cáo trong hệ thống quản lý khách sạn (PMS) hoặc công cụ BI để xác định các xu hướng đặt phòng, nguồn khách hàng chính, và các dịch vụ được ưa chuộng nhất.",
        ai_guide_emphasis_title: "Emphasis",
        ai_guide_emphasis_subtitle: "Emphasis",
        ai_guide_emphasis_p1_revised: "The key to harnessing AI's power lies not in becoming a programming expert, but in the ability to ask the right strategic questions, view business problems through the lens of data and automation opportunities, and possess a willingness to experiment and learn from new solutions. AI is a powerful tool that assists humans in making more informed decisions, optimizing workflows, and enhancing overall efficiency. Start with small, measurable applications, and always focus on the tangible value AI brings to your organization. This is entirely achievable for you and your team."
    },
    en: {
        // Các định nghĩa tiếng Anh (tương tự như trên)
        about_page_title: "About Us - IVS JSC",
        about_meta_description: "Learn about IVS JSC - Integrate Vision Synergy Trading Services Joint Stock Company, its mission, vision, core values, leadership team, and areas of operation.",
        about_og_title: "About Us - IVS JSC",
        about_og_description: "Discover IVS JSC: Connecting Vietnamese education with advanced technology and international standards.",
        page_title_index: "IVS JSC - Education, Technology, Health, International Cooperation",
        meta_description_index: "IVS JSC - A pioneering organization in Vietnam in education (IVS Academy, IVS Kindergarten), EdTech (IVS Celestech), community health, and international cooperation.",
        og_title_index: "IVS JSC - Education, Technology, Health, International Cooperation",
        og_description_index: "Explore comprehensive solutions for language training, STEAM, life skills, EdTech, healthcare, and partnership opportunities with IVS JSC.",
        page_title_default: "IVS Education",
        meta_description: "IVS Education - Education organization, educational technology (EdTech), international investment cooperation.",
        page_title_rnd: "Learning Material Design & EdTech Solutions - IVS Education",
        meta_description_rnd_v2: "R&D services, program design, learning materials, LMS, and custom educational applications from IVS Education & IVS Celestech.",
        page_title_sponsorship: "Community Sponsorship - IVS Education",
        meta_description_sponsorship: "Learn about IVS Education's community sponsorship programs and how you can join us in creating sustainable value.",
        page_title_celestech: "IVS Celestech - Comprehensive Educational Technology Solutions",
        meta_description_celestech: "IVS Celestech provides EdTech solutions from consulting, educational interior construction, smart devices (interactive screens, VR, AI) to LMS management systems.",
        page_title_placement: "English Placement Test - IVS Education",
        meta_description_placement: "Take the online English proficiency test based on Cambridge standards (6 CEFR levels) to determine your level and choose the right course at IVS Education.",
        og_title_placement: "English Placement Test - IVS Education",
        og_description_placement: "Accurately assess your English level with the free online test from IVS Education.",
        og_image_placement: "https://placehold.co/1200x630/eab308/ffffff?text=English+Placement+Test",
        page_title_establishment: "Establishment Services for Language - IT - Life Skills Centers | IVS Education",
        meta_description_establishment: "IVS Education offers comprehensive consulting and support services for establishing language, IT, and life skills centers in compliance with legal regulations.",
        og_title_establishment: "Establishment Services for Language - IT - Life Skills Centers | IVS Education",
        og_description_establishment: "A-Z support: Condition consulting, profile preparation, project drafting, working with authorities.",
        og_image_establishment: "https://placehold.co/1200x630/eab308/ffffff?text=Center+Establishment+IVS",
        page_title_webdesign: "Professional Website Design Services - IVS Tech Solutions",
        meta_description_webdesign: "IVS JSC (IVS Tech Solutions) provides professional, SEO-friendly, responsive website design services optimized for businesses and education.",
        og_title_webdesign: "Professional Website Design Services - IVS Tech Solutions",
        og_description_webdesign: "IVS JSC offers professional, SEO-standard, responsive website design services, optimized for business and education.",
        page_title_ai_guide: "AI Thinking Guide by Industry - IVS Education",
        meta_description_ai_guide: "Discover how to effectively apply AI thinking in Education, Healthcare, Finance, Retail, Manufacturing, Agriculture, Tourism with IVS Education.",
        og_title_ai_guide: "AI Thinking Guide by Industry - IVS Education",
        og_description_ai_guide: "Shape the foundational mindset to successfully apply AI, regardless of the tools you use.",
        page_title_consultation: "Consultation Request - IVS JSC",
        meta_description_consultation: "Register for a free consultation from IVS JSC on education, technology, international cooperation, and other services.",
        og_title_consultation: "Consultation Request - IVS JSC",
        og_description_consultation: "Contact IVS JSC for detailed advice on your needs.",

        // --- Header ---
        logo_alt: "IVS JSC Logo",
        menu_home: "Home",
        menu_about: "About",
        menu_about_ivs: "About IVS JSC",
        menu_mission_vision: "Mission & Vision",
        menu_ivs_meaning: "Meaning of IVS",
        menu_celestech: "IVS Celestech (EdTech)",
        menu_team: "Team",
        menu_partners: "Partners",
        menu_training: "Training",
        menu_placement_test: "Placement Test",
        menu_summer_camp: "International Camp",
        menu_scholarships: "Scholarships",
        menu_hay_noi_club: "Hay Noi Club",
        menu_cooperation: "Cooperation",
        menu_international_link: "International Link",
        menu_iivsa_alliance: "IIVSA Alliance",
        menu_educational_link: "Educational Link",
        menu_link_preschool: "Preschool",
        menu_link_primary: "Primary",
        menu_link_secondary: "Secondary",
        menu_link_language_center: "Language Center",
        menu_investment_cooperation: "Investment Cooperation",
        menu_center_establishment: "Center Establishment",
        menu_non_profit: "Non-profit",
        menu_sponsorship: "Sponsorship",
        menu_services: "Services",
        menu_edu_consulting: "Educational Consulting",
        menu_web_design: "Web Design",
        menu_design_edu: "Learning Material Design",
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
        menu_training_teacher_cert: "Add Teaching Cert.",
        menu_library: "Library",
        menu_library_docs: "Educational Docs",
        menu_library_media: "IVSMedia",
        search: "Search",
        search_placeholder: "Search...",
        search_button_label: "Open search",

        // --- Index Page ---
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
        index_about_p1: "IVS JSC is a pioneer in education, educational technology (EdTech), community health, international cooperation, and business development in Vietnam.",
        index_about_p2: "We provide comprehensive solutions from language education, life skills, STEAM, to healthcare programs and modern technology applications.",
        view_details: "View details →",
        index_about_img_alt: "IVS JSC introduction image",
        index_activities_title: "Main Areas of Activity",
        activity_academy_title: "IVS Academy",
        activity_academy_desc: "Language training (Eng, Chi, Jap), STEAM, soft skills. 'Hay Noi' community program.",
        activity_kindergarten_title: "IVS Kindergarten",
        activity_kindergarten_desc: "Pioneering preschool applying STEAM+Intelligence model. Modern facilities.",
        activity_celestech_title: "IVS Celestech (EdTech)",
        activity_celestech_desc: "Developing educational technology solutions: E-learning, LMS, AI, VR/AR.",
        activity_health_title: "IVS Health & Wellness",
        activity_health_desc: "Collaborating on health products like Thanh Yen bird's nest, community nutrition education.",
        activity_cooperation_title: "International Cooperation",
        activity_cooperation_desc: "Connecting Vietnamese education and health with the world: Study abroad, summer camps, training links.",
        activity_investment_title: "Investment & Development",
        activity_investment_desc: "Building the IVS Global School inter-level education system and sustainable projects.",
        details_link: "Details...",
        index_video_title: "Introduction Video",
        index_video_iframe_title: "IVS JSC introduction video",
        index_section_title_trusted_edu: "IVS - A Trusted Educational Foundation",
        large_button_ai_guide: "Apply AI Across Industries with IVS",
        large_button_ai_subtext: "This is not a training program",
        large_button_about: "Read Magical Novels in the Library of Magic",
        large_button_scholarship: "Scholarships & Camps",
        large_button_scholarship_subtext: "Opportunities to reach the world",
        large_button_placement: "English Placement Test",
        large_button_placement_subtext: "Check your English level",
        small_button_preschool: "Preschool",
        small_button_primary: "Primary",
        small_button_secondary: "Secondary",
        small_button_language_center: "Eng. Center",
        small_button_lifeskills: "Life Skills",
        small_button_steam: "STEAM",
        small_button_international: "Intl. Coop.",
        small_button_consulting: "Hay Noi - Voice of Youth",
        index_vnexpress_title: "Latest Education News from VnExpress",

        // --- About Page ---
        about_heading: "About Us",
        about_intro_heading: "Introducing IVS JSC",
        about_intro_p1_strong: "Integrate Vision Synergy Trading Services Joint Stock Company (IVS JSC)",
        about_intro_p1_text: " was established with the mission to connect and elevate Vietnamese education by integrating advanced technological solutions and international standard training programs. We are proud to be an official core member of the ",
        about_intro_p1_link: "IIVSA Global Education Alliance",
        about_intro_p1_end: ", affirming our commitment to quality and international cooperation.",
        about_intro_p2: "With headquarters in Dong Nai and a wide operational network, IVS JSC focuses on core areas including STEAM training, languages, soft skills, and comprehensive educational consulting, aiming for sustainable development for future generations.",
        about_vision_title: "Vision",
        about_vision_desc: "To become a leading educational organization, pioneering the application of technology and innovation to shape the future of Vietnamese education integrated internationally.",
        about_mission_title: "Mission",
        about_mission_desc: "To provide comprehensive, high-quality educational solutions that help learners maximize their potential, confidently integrate, and contribute to the community.",
        about_values_title: "Core Values",
        about_values_strong: "Quality – Dedication – Innovation – Equality.",
        about_values_desc: " We are committed to delivering the best educational services with dedication, continuous innovation, and ensuring equal learning opportunities for everyone.",
        about_leadership_heading: "Leadership Team",
        about_leadership_img_alt: "Nguyen Minh Triet - CEO",
        about_leadership_name: "Mr. Nguyen Minh Triet",
        about_leadership_title: "CEO & Chairman of the Board",
        about_leadership_desc: "With a strong background in English Language, Business Administration (MBA - FPT University), and educational management experience, Mr. Triet leads IVS JSC with strategic vision and dedication to education. He has experience working at reputable organizations such as VietJet Air, The Grand Ho Tram Strip, and AMG Education.",
        about_leadership_link: "More info",
        about_areas_heading: "Main Areas of Operation",
        about_area1_strong: "IVS Academy:",
        about_area1_desc: " Language training center (English,Japanese, Korean, Chinese) and soft skills, life skills.",
        about_area2_strong: "IVS Education:",
        about_area2_desc: " Developing STEAM programs, digital learning solutions, and consulting on building schools/centers to international standards.",
        about_area3_strong: "International Links:",
        about_area3_desc: " Cooperating with global education partners (e.g., The Power to Inspire - USA, Kinderlink25 Project) to bring advanced programs and methods to Vietnam.",
        about_area4_strong: "Research & Development (R&D):",
        about_area4_desc: " Continuously researching and developing new educational programs that align with trends and practical needs.",
        about_partners_heading: "Key Partners and Affiliations",
        about_partner1: "IIVSA Global Education Alliance (Official Core Member)",
        about_partner2: "The Power to Inspire (USA) - Strategic Partner",
        about_partner3: "Kinderlink25 Project - Preschool program development cooperation",
        about_partner4: "Các trường học, trung tâm đào tạo và tổ chức giáo dục trong và ngoài nước.",
        about_partners_p: "We believe that close cooperation creates synergy, driving the development of education.",
        // Add other about page keys if needed

        // --- Footer ---
        footer_company_name: "IVS JSC",
        footer_rights: "All rights reserved by IVS JSC.",
        footer_contact_us: "Contact Us",
        footer_address: "1104, Group 6, Dat Moi Hamlet, Long Phuoc Commune, Long Thanh District, Dong Nai Province, Vietnam, 76213.",
        footer_quick_links: "Quick Links",
        footer_follow_us: "Follow Us",
        footer_desc: "IVS JSC - INTEGRATE VISION SYNERGY TRADING SERVICES JSC - Tax Code: 3603960189",
        quick_links: "Quick Links",
        about_ivs: "About IVS",
        services: "Services",
        footer_service_languages: "IVS Languages",
        footer_service_lifeminds: "IVS LifeMinds",
        footer_service_media: "IVS Media",
        footer_service_celestech: "IVS Celestech",
        footer_service_rnd: "Program R&D",
        careers: "Careers",
        contact: "Contact",
        blog: "News",
        contact_us: "Contact",
        address: "1104, Group 6, Dat Moi Hamlet, Long Phuoc Commune, Long Thanh District, Dong Nai Province, Vietnam, 76213.",
        copyright: "© {year} IVS JSC. Copyright Registered No: 6207/2024/QTG.",
        footer_ivs_academy_title: "IVS Academy",
        footer_ivs_mastery_title: "IVS Mastery",
        footer_enable_js: "Please enable JavaScript to view Facebook content.",
        footer_visit_page_academy: "Visit IVS Academy Fanpage",
        footer_visit_page_mastery: "Visit IVS Mastery Fanpage",
        footer_message_academy_sr: "Send Facebook message to IVS Academy",
        footer_message_mastery_sr: "Send Facebook message to IVS Mastery",
        footer_email_link: "ivsacademy.edu@gmail.com",
        footer_zalo_link: "Nguyen Minh Triet (IVS)",
        footer_map_title: "Map",
        footer_connect: "Kết nối với chúng tôi",
        footer_facebook: "Facebook",
        footer_youtube: "YouTube",
        footer_linkedin: "LinkedIn",
        footer_tiktok: "TikTok",
        footer_instagram: "Instagram",
        footer_zalo: "Zalo",

        // --- R&D, Sponsorship, Celestech, Placement, Establishment Pages ---
        rnd_hero_title: "Custom Learning Material Design & EdTech Solutions",
        rnd_cta_button: "Contact for R&D Consultation",
        sponsorship_hero_title: "Community Sponsorship - Partner with IVS to Create Value",
        sponsorship_cta_button: "Contact for Sponsorship Now",
        celestech_hero_title: "IVS Celestech - Comprehensive Educational Technology Solutions",
        celestech_cta_button: "Request Solution Consultation",
        placement_hero_title: "Online English Placement Test",
        sample_option_d: "Answer D",
        establishment_hero_title: "Establish Language - IT - Life Skills Centers",
        establishment_cta_button: "Request Consultation Now",

        // --- Consultation Request Page ---
        page_title_consultation: "Đăng ký Tư vấn - IVS JSC",
        meta_description_consultation: "Register for a free consultation from IVS JSC on education, technology, international cooperation, and other services.",
        og_title_consultation: "Đăng ký Tư vấn - IVS JSC",
        og_description_consultation: "Contact IVS JSC for detailed advice on your needs.",
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
        phone_number: "Số điện thoại",
        email_address: "Địa chỉ Email: ivscorp.vn@gmail.com",

        // --- AI Guide Page ---
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
        ai_tool_desc_chatgpt: "Text generation, question answering, translation, code writing",
        ai_tool_desc_gemini: "Tương tự ChatGPT, tích hợp sâu với hệ sinh thái Google",
        ai_tool_desc_claude: "Tập trung vào an toàn và đạo đức AI, khả năng xử lý ngữ cảnh dài",
        ai_tool_desc_grok: "LLM tích hợp với X (Twitter), tập trung vào thông tin thời gian thực và hài hước",
        ai_tool_desc_deepseek: "LLM mạnh về viết mã (code generation) và song ngữ",
        ai_tool_desc_copilot: "AI assistant integrated into Microsoft 365 applications",
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
        ai_guide_edu_q_revised: "How can learning paths be personalized so each student reaches their full potential? How can repetitive tasks be automated to free up teachers' time for professional focus? How can students needing special support be identified early and intervened with promptly?",
        ai_guide_mindset_title: "Hướng tư duy chi tiết:",
        ai_guide_mindset_subtitle: "Detailed Mindset Approach:",
        ai_guide_human_mindset_title: "Required Human Mindset:",
        ai_guide_edu_mindset1_revised: "Leverage Learning Data: Always question the meaning behind data (scores, interaction time, progress) to gain deeper insights into each student.",
        ai_guide_edu_mindset2_revised: "Prioritize Personalization: Strive to create unique learning experiences tailored to the abilities and pace of each learner, rather than applying a one-size-fits-all model.",
        ai_guide_edu_mindset3_revised: "Embrace Experimentation & Improvement: Be willing to pilot new AI tools (recommendation systems, support chatbots) on a small scale, measure and evaluate effectiveness for continuous improvement.",
        ai_guide_edu_mindset4_revised: "View AI as a Partner: Consider AI a powerful assistant, helping reduce administrative workload, allowing teachers more time for in-depth teaching and meaningful student interaction.",
        ai_guide_core_ops_title: "Understanding AI Core Operations (Simplified):",
        ai_guide_edu_ops1_revised: "Learning from Big Data: When AI suggests suitable exercises, it analyzes data from thousands of different learning paths to identify patterns: 'Students struggling with concept A often progress faster when practicing exercise type B'.",
        ai_guide_edu_ops2_revised: "Pattern Recognition & Prediction: When AI warns of learning risks, it searches for hidden patterns in data (e.g., decreased login frequency, low assignment completion rate) to predict the likelihood a student needs extra support.",
        ai_guide_getting_started_title: "Getting Started with AI Isn't Complicated - Practical Suggestions:",
        ai_guide_edu_start1_revised: "Utilize Existing Features: Leverage AI features already integrated into your Learning Management System (LMS) or educational apps.",
        ai_guide_edu_start2_revised: "Implement Support Chatbots: Use chatbots to automatically answer frequently asked questions about schedules, procedures, or provide basic guidance on learning materials.",
        ai_guide_edu_start3_revised: "Pilot Results Analysis: Start by using AI to analyze test results for a small group, then measure the effectiveness of personalized review material suggestions on subsequent test scores.",
        ai_guide_section_health_title: "2. AI Mindset in Healthcare & Well-being",
        ai_guide_section_health_subtitle: "2. AI Mindset in Healthcare & Well-being",
        ai_guide_health_q_revised: "How can the accuracy and speed of disease diagnosis be improved? How can the healthcare process be optimized to reduce waiting times? How can patient health be monitored remotely proactively and effectively?",
        ai_guide_health_mindset1_revised: "Adopt 'Trust, but Verify': Utilize AI diagnostic suggestions (e.g., medical image analysis) but always cross-reference and validate with clinical experience and expertise.",
        ai_guide_health_mindset2_revised: "Focus on Operational Efficiency: Seek opportunities to apply AI to minimize waiting times, automate repetitive administrative tasks (data entry, scheduling), allowing healthcare teams to focus on patient care.",
        ai_guide_health_mindset3_revised: "Prioritize Security & Ethics: Always prioritize protecting sensitive patient data and ensuring the fairness and transparency of AI algorithms in all applications.",
        ai_guide_health_ops1_revised: "Medical Image Recognition: When AI analyzes X-rays or CT scans, it compares image features against millions of expert-labeled images (normal/pathological) to detect potential anomalies.",
        ai_guide_health_ops2_revised: "Phân tích Dữ liệu & Dự báo: When AI monitors patients remotely, it continuously analyzes vital sign data streams (heart rate, SpO2, blood pressure) and compares them against learned 'normal' and 'risk' patterns to provide early warnings.",
        ai_guide_health_start1_revised: "Optimize Administrative Management: Use clinic/hospital management software with integrated AI to optimize appointment scheduling and electronic medical record (EMR).",
        ai_guide_health_start2_revised: "Clinical Decision Support Tools: Experiment with AI tools that help doctors quickly look up medical information, latest research, or updated treatment protocols.",
        ai_guide_health_start3_revised: "Participate in Pilot Projects: Collaborate with technology partners to pilot AI applications in specific areas (e.g., image analysis support, readmission risk prediction) within a tightly controlled scope.",
        ai_guide_section_finance_title: "3. AI Mindset in Finance & Banking",
        ai_guide_section_finance_subtitle: "3. AI Mindset in Finance & Banking",
        ai_guide_finance_q_revised: "How can fraud detection and prevention be made more effective? How can credit risk assessment processes be accelerated while ensuring fairness? How can instant customer support be provided, anytime, anywhere?",
        ai_guide_finance_mindset1_revised: "Analytical & Skeptical Thinking: Always look for unusual patterns or inconsistencies in transaction data, viewing AI as a powerful tool to amplify this detection capability.",
        ai_guide_finance_mindset2_revised: "Data-Driven Decision Making: Make business decisions (e.g., loan approval, risk assessment) based on objective AI data analysis, harmoniously combined with professional experience and judgment.",
        ai_guide_finance_mindset3_revised: "Enhance Customer Experience: Find ways to apply AI (chatbots, virtual assistants, personalized recommendations) to make every customer interaction faster, seamless, convenient, and more relevant to individual needs.",
        ai_guide_finance_ops1_revised: "Anomaly Detection: AI anti-fraud systems continuously 'learn' normal transaction patterns. When a transaction deviates from these patterns (e.g., unusual location, sudden large amount, abnormal frequency), AI flags it for closer review.",
        ai_guide_finance_ops2_revised: "Risk Classification & Prediction: AI credit scoring models classify customers into different risk groups by 'learning' the correlation between numerous factors (income, credit history, debt ratio,...) and historically recorded repayment ability.",
        ai_guide_finance_start1_revised: "Deploy Basic Support Chatbots: Automate responses to common questions about products, services, interest rates, fees... to reduce the load on customer support.",
        ai_guide_finance_start2_revised: "Khai thác Báo cáo Phân tích: Use AI-integrated data analysis tools to visualize trends, better understand customer behavior, and the effectiveness of marketing campaigns.",
        ai_guide_finance_start3_revised: "Experiment with Simple Product Recommendations: Start by suggesting basic financial products (e.g., suitable savings accounts, basic credit cards) based on customer profile and transaction history analysis.",
        ai_guide_section_retail_title: "4. Tư duy AI trong Bán lẻ & Thương mại điện tử",
        ai_guide_section_retail_subtitle: "4. AI Mindset in Retail & E-commerce",
        ai_guide_retail_q_revised: "How to create personalized shopping experiences that make each customer feel understood? How to accurately forecast market demand to optimize inventory and reduce waste? How to quickly grasp customer sentiment and feedback across all channels?",
        ai_guide_retail_mindset1_revised: "Lấy Khách hàng làm Trung tâm: Chuyển dịch trọng tâm từ 'bán sản phẩm hiện có' sang 'đáp ứng và dự đoán nhu cầu khách hàng'. Luôn tự vấn: \"Làm thế nào AI giúp tôi phân tích dữ liệu để hiểu và phục vụ khách hàng này một cách tốt nhất?\".",
        ai_guide_retail_mindset2_revised: "Tối ưu hóa Liên tục: Nhìn nhận mọi quy trình (đặt hàng, quản lý kho, định giá, marketing) như một cơ hội cải tiến và đặt câu hỏi: \"AI có thể tự động hóa, tăng tốc, hoặc giảm chi phí cho bước này không?\".",
        ai_guide_retail_mindset3_revised: "Nhạy bén với Dữ liệu Khách hàng: Coi mọi điểm chạm của khách hàng (page views, clicks, abandoned carts, product reviews) là nguồn dữ liệu vô giá để AI khai thác và đưa ra gợi ý hành động.",
        ai_guide_retail_mindset4_revised: "Sẵn sàng Tự động hóa Thông minh: Tin tưởng giao phó các tác vụ lặp lại và tốn thời gian (phản hồi chat cơ bản, cập nhật trạng thái đơn hàng, phân loại phản hồi) cho AI, để đội ngũ nhân viên tập trung vào các hoạt động giá trị cao hơn như tư vấn chuyên sâu, giải quyết khiếu nại phức tạp.",
        ai_guide_retail_ops1_revised: "Học Sở thích & Hành vi: Khi bạn thấy gợi ý \"Sản phẩm thường được mua cùng\" hoặc \"Gợi ý cho bạn\", đó là AI đã phân tích lịch sử mua hàng và hành vi duyệt web của hàng triệu người để tìm ra các mối liên kết và dự đoán sở thích của bạn.",
        ai_guide_retail_ops2_revised: "Dự báo Nhu cầu & Tối ưu Tồn kho: AI phân tích dữ liệu bán hàng lịch sử, kết hợp các yếu tố mùa vụ, xu hướng thị trường, chiến dịch khuyến mãi, thậm chí cả dữ liệu thời tiết, để dự báo nhu cầu cho từng sản phẩm và đề xuất mức tồn kho tối ưu.",
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
        ai_guide_agri_ops3_revised: "Ra quyết định Tối ưu: Khi đưa ra khuyến nghị tưới tiêu hoặc bón phân, AI tích hợp dữ liệu thời gian thực từ cảm biến (độ ẩm đất, độ dẫn điện EC), dự báo thời tiết ngắn hạn, và giai đoạn sinh trưởng của cây trồng để tính toán chính xác lượng nước hoặc dinh dưỡng cần thiết, tránh thừa hoặc thiếu.",
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
        ai_guide_hosp_ops1_revised: "Hệ thống Gợi ý (Recommendation Engi

        // /js/language.js
// Phiên bản: Tải bản dịch từ tệp JSON riêng biệt

// Object để lưu trữ nội dung dịch đã tải
let translations = {};

// Ngôn ngữ mặc định
const defaultLanguage = 'vi';

// Khóa lưu ngôn ngữ trong localStorage
const languageStorageKey = 'userLanguage';

// Hàm tải nội dung dịch từ tệp JSON
async function loadTranslations(lang) {
    try {
        // Xây dựng đường dẫn đến tệp JSON dựa trên ngôn ngữ
        const response = await fetch(`/languages/${lang}.json`);

        if (!response.ok) {
            // Nếu không tải được tệp JSON của ngôn ngữ yêu cầu, thử tải ngôn ngữ mặc định
             console.warn(`Could not load translations for ${lang}. Falling back to default language: ${defaultLanguage}`);
             if (lang !== defaultLanguage) {
                 // Tránh lặp vô hạn nếu cả ngôn ngữ mặc định cũng lỗi
                 const defaultResponse = await fetch(`/languages/${defaultLanguage}.json`);
                 if (!defaultResponse.ok) {
                      throw new Error(`Could not load translations for default language ${defaultLanguage}`);
                 }
                 translations = await defaultResponse.json();
                 applyTranslations();
                 return; // Dừng hàm sau khi tải ngôn ngữ mặc định
             } else {
                 // Nếu ngôn ngữ mặc định cũng lỗi, báo lỗi và dừng
                 throw new Error(`Could not load translations for default language ${defaultLanguage}`);
             }
        }

        // Parse JSON và lưu vào biến translations
        translations = await response.json();
        // Áp dụng bản dịch sau khi tải xong
        applyTranslations();
        console.log(`Translations loaded and applied for ${lang}`);

        // Cập nhật thuộc tính lang của thẻ html
        document.documentElement.lang = lang;

    } catch (error) {
        console.error("Error loading or applying translations:", error);
        // Có thể thêm logic hiển thị thông báo lỗi cho người dùng tại đây
    }
}

// Hàm áp dụng nội dung dịch lên các phần tử HTML
function applyTranslations() {
    // Lặp qua tất cả các phần tử có thuộc tính data-lang-key
    document.querySelectorAll('[data-lang-key]').forEach(element => {
        const key = element.getAttribute('data-lang-key');
        // Lấy ngôn ngữ hiện tại để truy cập đúng bản dịch
        const currentLang = getCurrentLanguage();

        // Kiểm tra xem key có tồn tại trong bản dịch của ngôn ngữ hiện tại không
        if (translations[key] !== undefined) {
            // Kiểm tra nếu giá trị là object (dùng cho các thuộc tính như alt, placeholder)
            if (typeof translations[key] === 'object' && translations[key] !== null) {
                 // Xử lý các thuộc tính đặc biệt dựa trên data-lang-key-*
                 if (element.hasAttribute('data-lang-key-placeholder')) {
                      element.placeholder = translations[key][currentLang] || '';
                 } else if (element.hasAttribute('data-lang-key-alt')) {
                      element.alt = translations[key][currentLang] || '';
                 }
                 // TODO: Thêm xử lý cho các thuộc tính khác nếu cần (ví dụ: data-lang-key-title, data-lang-key-value)
            } else {
                // Áp dụng nội dung văn bản cho các phần tử
                element.innerHTML = translations[key];
            }
        } else {
            // Cảnh báo nếu không tìm thấy key dịch
            console.warn(`Translation key "${key}" not found for language "${currentLang}"`);
             // Có thể để trống hoặc hiển thị key để dễ debug
             // element.innerHTML = `[${key}]`;
        }
    });

    // Cập nhật các thuộc tính đặc biệt sử dụng data-lang-key-*
    // Lặp riêng để đảm bảo xử lý các trường hợp chỉ có data-lang-key-* mà không có data-lang-key
     document.querySelectorAll('[data-lang-key-placeholder]').forEach(element => {
         const key = element.getAttribute('data-lang-key-placeholder');
         const currentLang = getCurrentLanguage();
          if (translations[key] && typeof translations[key] === 'object' && translations[key][currentLang] !== undefined) {
               element.placeholder = translations[key][currentLang];
          } else {
               console.warn(`Translation key for placeholder "${key}" not found for language "${currentLang}" or not an object.`);
          }
     });

      document.querySelectorAll('[data-lang-key-alt]').forEach(element => {
          const key = element.getAttribute('data-lang-key-alt');
          const currentLang = getCurrentLanguage();
           if (translations[key] && typeof translations[key] === 'object' && translations[key][currentLang] !== undefined) {
                element.alt = translations[key][currentLang];
           } else {
                console.warn(`Translation key for alt "${key}" not found for language "${currentLang}" or not an object.`);
           }
      });

    // Cập nhật năm hiện tại trong footer nếu có
    const currentYearElement = document.getElementById('current-year');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }

    // TODO: Cập nhật các meta tag nếu cần (title, description, og:title, og:description)
    // Điều này cần xử lý riêng vì chúng nằm trong <head>
    // Ví dụ:
    // document.title = translations['page_title_index'] || translations['page_title_default'];
    // document.querySelector('meta[name="description"]').setAttribute('content', translations['meta_description_index'] || translations['meta_description']);
    // ... tương tự cho các meta tag khác
}


// Hàm lấy ngôn ngữ hiện tại (từ localStorage hoặc ngôn ngữ trình duyệt, sau đó fallback về mặc định)
function getCurrentLanguage() {
    // Ưu tiên ngôn ngữ đã lưu trong localStorage
    const storedLang = localStorage.getItem(languageStorageKey);
    if (storedLang) {
        return storedLang;
    }

    // Nếu chưa lưu, thử phát hiện ngôn ngữ từ trình duyệt
    // Lưu ý: navigator.language có thể trả về "en-US", cần xử lý để lấy phần đầu "en"
    const browserLang = navigator.language.split('-')[0];
    // Kiểm tra xem ngôn ngữ trình duyệt có trong danh sách hỗ trợ không (cần định nghĩa danh sách này)
    // Tạm thời chỉ hỗ trợ 'vi' và 'en' dựa trên các tệp JSON đã có
    const supportedLanguages = ['vi', 'en']; // Cần cập nhật nếu có thêm ngôn ngữ

    if (supportedLanguages.includes(browserLang)) {
        return browserLang;
    }

    // Nếu không có trong localStorage và trình duyệt không hỗ trợ, dùng mặc định
    return defaultLanguage;
}

// Hàm thiết lập ngôn ngữ mới và lưu vào localStorage
function setLanguage(lang) {
    // Kiểm tra xem ngôn ngữ có được hỗ trợ không trước khi thiết lập
    const supportedLanguages = ['vi', 'en']; // Cần cập nhật nếu có thêm ngôn ngữ
    if (supportedLanguages.includes(lang)) {
        localStorage.setItem(languageStorageKey, lang);
        loadTranslations(lang);
        // Tùy chọn: Cập nhật URL để phản ánh ngôn ngữ (ví dụ: /en/page.html hoặc ?lang=en)
        // Điều này phức tạp hơn và cần xử lý server-side hoặc rewrite rule
        // window.history.pushState({}, '', `?lang=${lang}`); // Ví dụ đơn giản
    } else {
        console.warn(`Language "${lang}" is not supported.`);
    }
}

// Hàm khởi tạo: tải ngôn ngữ khi trang được tải hoàn toàn
document.addEventListener('DOMContentLoaded', () => {
    const userPreferredLanguage = getCurrentLanguage();
    loadTranslations(userPreferredLanguage);

    // Thêm event listener cho bộ chuyển đổi ngôn ngữ
    // Tìm tất cả các phần tử có class 'lang-switcher' (ví dụ: các nút)
    document.querySelectorAll('.lang-switcher').forEach(button => {
        button.addEventListener('click', (event) => {
            // Lấy ngôn ngữ từ thuộc tính data-lang của nút
            const lang = event.target.getAttribute('data-lang');
            if (lang) {
                setLanguage(lang);
            }
        });
    });
});

// Xuất hàm setLanguage để có thể gọi từ UI bên ngoài (nếu cần)
window.setLanguage = setLanguage;

// TODO: Thêm UI chuyển đổi ngôn ngữ vào Header hoặc Footer trong các tệp HTML
// Ví dụ: <button class="lang-switcher" data-lang="vi">VI</button>
// <button class="lang-switcher" data-lang="en">EN</button>