// Khởi tạo không gian tên toàn cục cho hệ thống ngôn ngữ
window.langSystem = window.langSystem || {
    translations: {},
    defaultLanguage: 'en', // THAY ĐỔI NGÔN NGỮ MẶC ĐỊNH THÀNH 'en'
    languageStorageKey: 'userPreferredLanguage', 
    isDebugMode: true, 
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
    if (window.langSystem.translations[lang] && Object.keys(window.langSystem.translations[lang]).length > 0) {
        logDebug(`Translations for ${lang} already loaded.`);
        return;
    }
    try {
        const langDir = `${window.location.origin}/lang/`; // Đường dẫn đến thư mục lang của bạn
        const response = await fetch(`${langDir}${lang}.json`);
        if (!response.ok) {
            throw new Error(`Failed to load translations for ${lang}: ${response.statusText} at ${response.url}`);
        }
        window.langSystem.translations[lang] = await response.json();
        logDebug(`Successfully loaded translations for ${lang}.`);
    } catch (error) {
        console.error(`[LangJS] Error loading translations for ${lang}:`, error);
        if (lang !== window.langSystem.defaultLanguage) {
            logWarning(`Falling back to default language: ${window.langSystem.defaultLanguage}`);
            await fetchTranslations(window.langSystem.defaultLanguage);
        } else {
            console.error("[LangJS] Failed to load default translations! Language functionality will be impaired.");
        }
    }
}

// Áp dụng bản dịch cho các phần tử trên trang
window.applyTranslations = () => {
    logDebug("Applying translations...");
    const elementsToTranslate = document.querySelectorAll('[data-lang-key]');
    const currentLang = window.getCurrentLanguage(); 
    const currentTranslations = window.langSystem.translations[currentLang];
    const defaultTranslations = window.langSystem.translations[window.langSystem.defaultLanguage];

    elementsToTranslate.forEach(element => {
        const key = element.getAttribute('data-lang-key');
        let translationFound = false;
        if (currentTranslations && typeof currentTranslations[key] === 'string') {
            element.textContent = currentTranslations[key];
            translationFound = true;
        } else if (defaultTranslations && typeof defaultTranslations[key] === 'string') {
            element.textContent = defaultTranslations[key];
            translationFound = true;
            logWarning(`Translation for key '${key}' not found in current language (${currentLang}). Using default translation.`);
        } else {
            logWarning(`Translation for key '${key}' not found in any language. Element content will not be changed.`);
        }
    });
    logDebug("Translations applied.");
};

// Lấy ngôn ngữ hiện tại
window.getCurrentLanguage = () => {
    let preferredLanguage = localStorage.getItem(window.langSystem.languageStorageKey);
    if (preferredLanguage && window.langSystem.translations[preferredLanguage]) {
        logDebug(`Retrieved language from localStorage: ${preferredLanguage}`);
        return preferredLanguage;
    }

    const browserLanguage = navigator.language || navigator.userLanguage;
    const languageCode = browserLanguage ? browserLanguage.split('-')[0] : window.langSystem.defaultLanguage;

    const supportedLanguages = ['vi', 'en']; 
    if (supportedLanguages.includes(languageCode)) {
        logDebug(`Using browser language: ${languageCode}`);
        return languageCode;
    }

    logDebug(`Browser language ${languageCode} not directly supported or no preference stored. Falling back to default: ${window.langSystem.defaultLanguage}`);
    return window.langSystem.defaultLanguage;
};


// Hàm xử lý khi nhấp vào nút chọn ngôn ngữ
const handleLanguageButtonClick = async (event) => {
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
    const langButtonsDesktop = document.querySelectorAll('#language-dropdown-menu .lang-option');
    const langButtonsMobile = document.querySelectorAll('#mobile-language-submenu-items .lang-option-mobile');
    
    const allLangButtons = [...langButtonsDesktop, ...langButtonsMobile];
    const currentActiveLang = window.getCurrentLanguage();

    if (allLangButtons.length === 0) {
        logWarning("No language buttons (.lang-option or .lang-option-mobile) found.");
        return;
    }

    allLangButtons.forEach(button => {
        button.removeEventListener('click', handleLanguageButtonClick);
        button.addEventListener('click', handleLanguageButtonClick);

        if (button.dataset.lang === currentActiveLang) {
            button.classList.add('active-language-option'); 
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
    
    // Lấy ngôn ngữ đã lưu hoặc ngôn ngữ mặc định (đã được cập nhật thành 'en')
    const userPreferredLanguage = window.getCurrentLanguage();
    window.langSystem.currentLanguage = userPreferredLanguage; 
    
    // Tải bản dịch cho ngôn ngữ hiện tại (sẽ là 'en' nếu không có gì trong localStorage)
    await fetchTranslations(userPreferredLanguage); 

    // Đảm bảo ngôn ngữ mặc định (bây giờ là 'en') cũng được tải nếu nó khác với userPreferredLanguage và chưa được tải
    if (userPreferredLanguage !== window.langSystem.defaultLanguage && 
        (!window.langSystem.translations[window.langSystem.defaultLanguage] || Object.keys(window.langSystem.translations[window.langSystem.defaultLanguage]).length === 0)) {
        await fetchTranslations(window.langSystem.defaultLanguage);
    }
    // Nếu ngôn ngữ ưu tiên là 'vi' nhưng mặc định là 'en', và 'vi' chưa được tải, hãy tải nó
    if (userPreferredLanguage === 'vi' && window.langSystem.defaultLanguage === 'en' &&
        (!window.langSystem.translations['vi'] || Object.keys(window.langSystem.translations['vi']).length === 0)) {
        await fetchTranslations('vi');
    }
    
    window.applyTranslations(); 
    window.initializeLanguageButtons(); 
    
    window.langSystem.initialized = true;
    logDebug(`Language system initialized with language: ${userPreferredLanguage}. Default is now: ${window.langSystem.defaultLanguage}`);
};

// Hàm thiết lập ngôn ngữ mới
window.setLanguage = async (lang) => {
    logDebug(`Setting language to: ${lang}`);
    localStorage.setItem(window.langSystem.languageStorageKey, lang);
    window.langSystem.currentLanguage = lang; 
    
    await fetchTranslations(lang); 
    window.applyTranslations();    
    
    if (typeof window.initializeLanguageButtons === 'function') {
        window.initializeLanguageButtons(); 
    } else {
        logWarning("initializeLanguageButtons function is not available to update button states.");
    }
};

window.updateLanguage = window.setLanguage;

// **QUAN TRỌNG:** Để hệ thống này hoạt động, `loadComponents.js` (hoặc script chính của bạn)
// cần gọi `window.initializeLanguageSystem()` SAU KHI các thành phần DOM (như header, nơi chứa nút ngôn ngữ)
// đã được tải xong.
// Ví dụ, trong `loadComponents.js`, sau khi tải header và footer:
// if (typeof window.initializeLanguageSystem === 'function') {
//     window.initializeLanguageSystem();
// } else {
//     console.error("LỖI: initializeLanguageSystem không tồn tại!");
// }
