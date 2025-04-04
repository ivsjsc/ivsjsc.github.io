// /js/language.js

// Đối tượng lưu trữ các bản dịch
// Đã cập nhật với keys từ trang thanhlaptrungtam.html
const translations = {
    vi: {
        // Meta Tags
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

        // Header v6 (Giữ nguyên)
        // ... (keys menu giữ nguyên) ...
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
        menu_school_link: "Liên kết Trường học",
        menu_link_preschool: "Mầm non",
        menu_link_primary: "Tiểu học",
        menu_link_secondary: "THCS & THPT",
        menu_link_language_center: "Trung tâm Ngoại ngữ",
        menu_investment_cooperation: "Hợp tác Đầu tư",
        menu_center_establishment: "Thành lập Trung tâm", // Key này đã có trong menu Dịch vụ
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
        // ...

        // Footer (Giữ nguyên)
        // ...

        // Trang rnd-curriculum.html v2 (Giữ nguyên)
        // ...

        // Trang tai-tro.html (Giữ nguyên)
        // ...

        // Trang ivscelestech.html (Giữ nguyên)
        // ...

        // Trang english-placement.html (Giữ nguyên)
        // ...

        // Trang thanhlaptrungtam.html (Keys mới)
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

        // Header v6 (Keep as is)
        // ... (menu keys remain) ...
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
        // ...

        // Footer (Keep as is)
        // ...

        // Trang rnd-curriculum.html v2 (Keep as is)
        // ...

        // Trang tai-tro.html (Keep as is)
        // ...

        // Trang ivscelestech.html (Keep as is)
        // ...

        // Trang english-placement.html (Keep as is)
        // ...

        // thanhlaptrungtam.html Page (New Keys)
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

        // Add other keys from other pages if needed...
    }
};

// --- Phần còn lại của file language.js giữ nguyên như v8 ---
// (Hàm setLanguage, initializeLanguage, attachLanguageButtonListeners, handleLanguageChange, updatePlacementResultText)
function setLanguage(lang) {
    localStorage.setItem('preferredLanguage', lang);
    document.querySelectorAll('[data-lang-key]').forEach(element => {
        const key = element.getAttribute('data-lang-key');
        const translation = translations[lang]?.[key];
        if (translation !== undefined) {
            let hasChildWithLangKey = false;
            if (element.children.length > 0) {
                 for(let child of element.children) {
                     if (child.hasAttribute('data-lang-key') && child.tagName !== 'SVG' && child.tagName !== 'I') {
                         hasChildWithLangKey = true;
                         break;
                     }
                 }
            }
            if (!hasChildWithLangKey || element.tagName === 'SPAN' || element.tagName === 'STRONG' || element.tagName === 'EM' ) {
                 let finalTranslation = translation;
                 finalTranslation = finalTranslation.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                 finalTranslation = finalTranslation.replace(/\*(.*?)\*/g, '<em>$1</em>');
                 if (finalTranslation !== translation) {
                     element.innerHTML = finalTranslation;
                 } else {
                     element.textContent = translation;
                 }
            }
            const placeholderKey = key + '_placeholder';
            const titleKey = key + '_title';
            const altKey = key + '_alt';
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                 const placeholderTranslation = translations[lang]?.[placeholderKey];
                 if (placeholderTranslation !== undefined) element.placeholder = placeholderTranslation;
            }
            if (element.hasAttribute('title')) {
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
function attachLanguageButtonListeners() {
    console.log("Attaching language button listeners...");
    document.querySelectorAll('[id^="lang-vi-"], [id^="lang-en-"]').forEach(button => {
        if (!button) return;
        button.removeEventListener('click', handleLanguageChange);
        button.addEventListener('click', handleLanguageChange);
    });
    console.log("Language button listeners attached.");
}
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
        if (typeof updatePlacementResultText === 'function' && document.getElementById('test-result-area') && !document.getElementById('test-result-area').classList.contains('hidden')) {
             updatePlacementResultText(lang);
        }
        // Cập nhật text của redirect timer nếu nó đang hiển thị và chưa bị hủy
        const timerElement = document.getElementById('redirect-timer-text');
        const cancelButton = document.getElementById('cancel-redirect');
        if (timerElement && cancelButton && !cancelButton.disabled && typeof updateTimerText === 'function'){
            updateTimerText(); // Gọi hàm cập nhật text (hàm này cần được định nghĩa trong scope global hoặc trong script của trang)
        } else if (timerElement && cancelButton && cancelButton.disabled && typeof updateCancelledRedirectText === 'function') {
             updateCancelledRedirectText(); // Cập nhật text khi đã hủy
        }
    }
}
// Hàm này cần được định nghĩa trong script inline của trang thanhlaptrungtam.html
// function updateTimerText() { ... }
// function updateCancelledRedirectText() { ... }

// Hàm updatePlacementResultText (giữ nguyên từ v8)
function updatePlacementResultText(lang) {
    console.log(`Updating placement result text for lang: ${lang}`);
    const estimatedLevelEl = document.getElementById('estimated-level');
    const levelDescEl = document.getElementById('level-description');
    const coursesListEl = document.getElementById('suggested-courses');

    if (!estimatedLevelEl || !levelDescEl || !coursesListEl) return;

     const resultData = {
         vi: {
             level: 'B1 (Trung cấp)',
             description: 'Bạn có thể hiểu các ý chính của các chủ đề quen thuộc trong công việc, học tập, giải trí. Có thể xử lý hầu hết các tình huống có thể xảy ra khi đi đến nơi sử dụng ngôn ngữ đó. Có thể viết văn bản đơn giản, mạch lạc về các chủ đề quen thuộc hoặc cá nhân quan tâm. Có thể mô tả kinh nghiệm, sự kiện, ước mơ, hy vọng và hoài bão.',
             courses: [
                 { name: 'Khóa Tiếng Anh Giao tiếp B1+', link: '#' },
                 { name: 'Luyện thi IELTS Mục tiêu 5.0-6.0', link: '#' },
                 { name: 'Tiếng Anh Thương mại Trung cấp', link: '#' }
             ]
         },
         en: {
             level: 'B1 (Intermediate)',
             description: 'You can understand the main points of clear standard input on familiar matters regularly encountered in work, school, leisure, etc. Can deal with most situations likely to arise whilst travelling in an area where the language is spoken. Can produce simple connected text on topics which are familiar or of personal interest. Can describe experiences and events, dreams, hopes & ambitions.',
             courses: [
                 { name: 'B1+ Communicative English Course', link: '#' },
                 { name: 'IELTS Preparation (Target 5.0-6.0)', link: '#' },
                 { name: 'Intermediate Business English', link: '#' }
             ]
         }
     };

     const currentResult = resultData[lang] || resultData['vi'];

     estimatedLevelEl.textContent = currentResult.level;
     levelDescEl.textContent = currentResult.description;
     coursesListEl.innerHTML = '';
     currentResult.courses.forEach(course => {
         const li = document.createElement('li');
         const a = document.createElement('a');
         a.href = course.link;
         a.textContent = course.name;
         a.className = 'text-primary hover:underline';
         li.appendChild(a);
         coursesListEl.appendChild(li);
     });
}
