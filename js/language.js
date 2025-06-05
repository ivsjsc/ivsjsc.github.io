// Khởi tạo không gian tên toàn cục cho hệ thống ngôn ngữ
window.langSystem = window.langSystem || {
    translations: {},
    defaultLanguage: 'vi', // Ngôn ngữ mặc định
    languageStorageKey: 'userPreferredLanguage', // Key để lưu ngôn ngữ trong localStorage
    isDebugMode: true, // Bật/tắt log debug
    currentLanguage: null,
    initialized: false
};

// Hàm ghi log debug
function logDebug(message) {
    if (window.langSystem.isDebugMode) {
        console.log(`[LangJS] ${message}`);
    }
}

// Hàm ghi log cảnh báo
function logWarning(message) {
    if (window.langSystem.isDebugMode) {
        console.warn(`[LangJS] ${message}`);
    }
}

// Tải các bản dịch từ tệp JSON
async function fetchTranslations(lang) {
    logDebug(`Fetching translations for: ${lang}`);
    // Kiểm tra xem bản dịch đã được tải chưa
    if (window.langSystem.translations[lang] && Object.keys(window.langSystem.translations[lang]).length > 0) {
        logDebug(`Translations for ${lang} already loaded.`);
        return;
    }
    try {
        // Lấy đường dẫn tuyệt đối đến thư mục lang
        const langDir = `${window.location.origin}/lang/`;
        const response = await fetch(`${langDir}${lang}.json`);
        if (!response.ok) {
            throw new Error(`Failed to load translations for ${lang}: ${response.statusText} at ${response.url}`);
        }
        window.langSystem.translations[lang] = await response.json();
        logDebug(`Successfully loaded translations for ${lang}.`);
    } catch (error) {
        console.error(`[LangJS] Error loading translations for ${lang}:`, error);
        // Nếu không tải được ngôn ngữ yêu cầu và đó không phải là ngôn ngữ mặc định, thử tải ngôn ngữ mặc định
        if (lang !== window.langSystem.defaultLanguage) {
            logWarning(`Falling back to default language: ${window.langSystem.defaultLanguage}`);
            await fetchTranslations(window.langSystem.defaultLanguage);
        } else {
            // Nếu lỗi ngay cả với ngôn ngữ mặc định, đây là vấn đề nghiêm trọng
            console.error("[LangJS] Failed to load default translations! Language functionality will be impaired.");
        }
    }
}

// Áp dụng bản dịch cho các phần tử trên trang
window.applyTranslations = () => {
    logDebug("Applying translations...");
    const elementsToTranslate = document.querySelectorAll('[data-lang-key]');
    const currentLang = window.getCurrentLanguage(); // Lấy ngôn ngữ hiện tại
    const currentTranslations = window.langSystem.translations[currentLang];
    const defaultTranslations = window.langSystem.translations[window.langSystem.defaultLanguage];

    elementsToTranslate.forEach(element => {
        const key = element.getAttribute('data-lang-key');
        let translationFound = false;
        if (currentTranslations && typeof currentTranslations[key] === 'string') {
            element.textContent = currentTranslations[key];
            translationFound = true;
        } else if (defaultTranslations && typeof defaultTranslations[key] === 'string') {
            // Nếu không tìm thấy key trong ngôn ngữ hiện tại, sử dụng ngôn ngữ mặc định
            element.textContent = defaultTranslations[key];
            translationFound = true;
            logWarning(`Translation for key '${key}' not found in current language (${currentLang}). Using default translation.`);
        } else {
            // Nếu không tìm thấy key trong bất kỳ ngôn ngữ nào
            logWarning(`Translation for key '${key}' not found in any language. Element content will not be changed.`);
        }
    });
    logDebug("Translations applied.");
};

// Lấy ngôn ngữ hiện tại (từ localStorage hoặc trình duyệt)
window.getCurrentLanguage = () => {
    let preferredLanguage = localStorage.getItem(window.langSystem.languageStorageKey);
    if (preferredLanguage && window.langSystem.translations[preferredLanguage]) {
        logDebug(`Retrieved language from localStorage: ${preferredLanguage}`);
        return preferredLanguage;
    }

    const browserLanguage = navigator.language || navigator.userLanguage;
    const languageCode = browserLanguage ? browserLanguage.split('-')[0] : window.langSystem.defaultLanguage;

    // Kiểm tra xem ngôn ngữ trình duyệt có được hỗ trợ không (tức là có tệp .json tương ứng không)
    // Điều này cần một danh sách các ngôn ngữ được hỗ trợ hoặc một cách khác để kiểm tra.
    // Hiện tại, chúng ta mặc định là 'vi' hoặc 'en'.
    const supportedLanguages = ['vi', 'en']; // Danh sách các ngôn ngữ được hỗ trợ
    if (supportedLanguages.includes(languageCode)) {
        logDebug(`Using browser language: ${languageCode}`);
        return languageCode;
    }

    logDebug(`Browser language ${languageCode} not directly supported or no preference stored. Falling back to default: ${window.langSystem.defaultLanguage}`);
    return window.langSystem.defaultLanguage;
};


// Hàm xử lý khi nhấp vào nút chọn ngôn ngữ
const handleLanguageButtonClick = async (event) => {
    // event.target có thể là icon hoặc span bên trong button, nên dùng currentTarget
    const button = event.currentTarget; 
    const selectedLanguage = button.dataset.lang;

    if (!selectedLanguage) {
        logWarning("Clicked language button has no data-lang attribute.");
        return;
    }
    logDebug(`User selected language: ${selectedLanguage}`);
    await window.setLanguage(selectedLanguage);
};

// Khởi tạo các nút chọn ngôn ngữ
window.initializeLanguageButtons = () => {
    logDebug("Initializing language buttons (desktop and mobile)...");
    // Sử dụng selector mới cho các nút ngôn ngữ trong dropdown và menu mobile
    const langButtonsDesktop = document.querySelectorAll('#language-dropdown-menu .lang-option');
    const langButtonsMobile = document.querySelectorAll('#mobile-language-submenu-items .lang-option-mobile');
    
    const allLangButtons = [...langButtonsDesktop, ...langButtonsMobile];
    const currentActiveLang = window.getCurrentLanguage();

    if (allLangButtons.length === 0) {
        logWarning("No language buttons (.lang-option or .lang-option-mobile) found.");
        return;
    }

    allLangButtons.forEach(button => {
        // Xóa trình xử lý sự kiện cũ để tránh gắn nhiều lần nếu hàm này được gọi lại
        button.removeEventListener('click', handleLanguageButtonClick);
        button.addEventListener('click', handleLanguageButtonClick);

        // Cập nhật trạng thái active (ví dụ: thêm class CSS)
        // Điều này có thể cần tùy chỉnh dựa trên cách bạn muốn hiển thị ngôn ngữ đang active
        if (button.dataset.lang === currentActiveLang) {
            button.classList.add('active-language-option'); // Thêm class để đánh dấu ngôn ngữ đang được chọn
            button.setAttribute('aria-pressed', 'true');
        } else {
            button.classList.remove('active-language-option');
            button.setAttribute('aria-pressed', 'false');
        }
    });
    logDebug(`Click events attached and active state set for ${allLangButtons.length} language buttons.`);
};

// Hàm khởi tạo chính của hệ thống ngôn ngữ
window.initializeLanguageSystem = async function() {
    if (window.langSystem.initialized) {
        logDebug("Language system already initialized.");
        return;
    }
    logDebug("Initializing language system...");
    
    const userPreferredLanguage = window.getCurrentLanguage();
    window.langSystem.currentLanguage = userPreferredLanguage; // Thiết lập ngôn ngữ hiện tại sớm
    
    await fetchTranslations(userPreferredLanguage); // Tải bản dịch cho ngôn ngữ ưu tiên

    // Đảm bảo ngôn ngữ mặc định cũng được tải nếu chưa có
    if (userPreferredLanguage !== window.langSystem.defaultLanguage && !window.langSystem.translations[window.langSystem.defaultLanguage]) {
        await fetchTranslations(window.langSystem.defaultLanguage);
    }
    
    window.applyTranslations(); // Áp dụng bản dịch
    
    // Việc khởi tạo nút ngôn ngữ nên được thực hiện SAU KHI header đã được tải xong hoàn toàn
    // Trong loadComponents.js, initializeLanguageSystem được gọi sau khi header được load
    // nên initializeLanguageButtons sẽ được gọi ở đây.
    window.initializeLanguageButtons(); 
    
    window.langSystem.initialized = true;
    logDebug(`Language system initialized with language: ${userPreferredLanguage}.`);
};

// Hàm thiết lập ngôn ngữ mới
window.setLanguage = async (lang) => {
    logDebug(`Setting language to: ${lang}`);
    localStorage.setItem(window.langSystem.languageStorageKey, lang);
    window.langSystem.currentLanguage = lang; 
    
    await fetchTranslations(lang); // Tải bản dịch cho ngôn ngữ mới
    window.applyTranslations();    // Áp dụng lại bản dịch
    
    // Cập nhật lại trạng thái của các nút ngôn ngữ
    // Hàm này nên được gọi ở đây để đảm bảo các nút được cập nhật đúng sau khi ngôn ngữ thay đổi
    if (typeof window.initializeLanguageButtons === 'function') {
        window.initializeLanguageButtons(); 
    } else {
        logWarning("initializeLanguageButtons function is not available to update button states.");
    }
};

// Tạo alias cho window.updateLanguage để tương thích ngược nếu có
window.updateLanguage = window.setLanguage;

// Gắn hàm khởi tạo vào window để loadComponents.js có thể gọi
// window.initializeLanguageSystem đã được gán ở trên.

// Có thể thêm một cơ chế lắng nghe sự kiện DOMContentLoaded để tự khởi tạo nếu language.js được tải độc lập
// Tuy nhiên, trong cấu trúc hiện tại, loadComponents.js sẽ quản lý việc này.
// document.addEventListener('DOMContentLoaded', () => {
//     if (!window.langSystem.initialized && typeof window.loadComponentsAndInitialize === 'undefined') {
//         // Chỉ tự khởi tạo nếu không có loadComponents.js quản lý
//         console.log("[LangJS] DOMContentLoaded: Initializing language system independently.");
//         window.initializeLanguageSystem();
//     }
// });

