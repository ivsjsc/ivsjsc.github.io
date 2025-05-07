// /js/language.js
// Mục tiêu: Đảm bảo dịch thuật nhất quán, đặc biệt với nội dung tải động.

// Biến toàn cục để lưu trữ các bản dịch đã tải
window.translations = {}; 

// Ngôn ngữ mặc định và khóa lưu trữ
const defaultLanguage = 'vi';
const languageStorageKey = 'userPreferredLanguage'; // Đổi tên key cho rõ ràng

// Cờ gỡ lỗi
const isDebugMode = false; // Đặt thành true khi cần gỡ lỗi chi tiết

function logDebug(message) {
    if (isDebugMode) {
        console.log(`[LangJS] ${message}`);
    }
}

function logWarning(message) {
    if (isDebugMode) {
        console.warn(`[LangJS] ${message}`);
    }
}

/**
 * Tải tệp JSON chứa bản dịch cho một ngôn ngữ cụ thể.
 * @param {string} lang - Mã ngôn ngữ (ví dụ: 'vi', 'en').
 * @returns {Promise<void>} Promise sẽ resolve khi bản dịch được tải hoặc fallback.
 */
async function fetchTranslations(lang) {
    logDebug(`Đang tải bản dịch cho: ${lang}`);
    if (window.translations[lang] && Object.keys(window.translations[lang]).length > 0) {
        logDebug(`Bản dịch cho ${lang} đã được tải trước đó.`);
        return Promise.resolve(); // Đã có, không cần tải lại
    }
    try {
        const response = await fetch(`/languages/${lang}.json`); // Đường dẫn từ gốc
        if (!response.ok) {
            logWarning(`Không thể tải bản dịch cho ${lang}. Status: ${response.status}.`);
            if (lang !== defaultLanguage) {
                logWarning(`Thử tải ngôn ngữ mặc định: ${defaultLanguage}`);
                // Chỉ fetch default language nếu nó chưa được fetch hoặc fetch thất bại
                if (!window.translations[defaultLanguage] || Object.keys(window.translations[defaultLanguage]).length === 0) {
                    return fetchTranslations(defaultLanguage);
                }
            }
            // Nếu là default language mà vẫn lỗi, hoặc fallback cũng lỗi, thì gán object rỗng
            window.translations[lang] = {}; 
            throw new Error(`Không thể tải tệp ngôn ngữ: ${lang}.json`);
        }
        window.translations[lang] = await response.json();
        logDebug(`Đã tải thành công bản dịch cho: ${lang}`);
    } catch (error) {
        console.error(`Lỗi khi tải bản dịch cho ${lang}:`, error);
        window.translations[lang] = window.translations[defaultLanguage] || {}; // Fallback an toàn
    }
}

/**
 * Áp dụng các bản dịch đã tải lên các phần tử DOM.
 * Hàm này sẽ được gọi sau khi tải component và khi đổi ngôn ngữ.
 */
window.applyTranslations = function() {
    const currentLang = window.getCurrentLanguage();
    logDebug(`Đang áp dụng bản dịch cho: ${currentLang}`);

    const currentTranslations = window.translations[currentLang] || window.translations[defaultLanguage] || {};

    if (Object.keys(currentTranslations).length === 0) {
        logWarning(`Không có bản dịch nào được tải cho "${currentLang}" (kể cả fallback). Việc áp dụng bản dịch có thể không hoàn chỉnh.`);
    }

    let elementsTranslated = 0;
    let attributesTranslated = 0;

    // Dịch nội dung text của các phần tử
    document.querySelectorAll('[data-lang-key]').forEach(element => {
        const key = element.getAttribute('data-lang-key');
        if (currentTranslations[key] !== undefined) {
            if (element.tagName === 'TITLE') {
                element.textContent = currentTranslations[key];
            } else {
                element.innerHTML = currentTranslations[key]; // Cho phép HTML trong bản dịch
            }
            elementsTranslated++;
        } else if (isDebugMode) {
            logWarning(`Key dịch "${key}" không tìm thấy cho ngôn ngữ "${currentLang}". Nội dung gốc: "${element.textContent.trim().substring(0,30)}..."`);
        }
    });

    // Dịch các thuộc tính (placeholder, alt, title, aria-label, value)
    const attributeMappings = {
        'placeholder': 'placeholder', 'alt': 'alt', 'title': 'title', 
        'aria-label': 'aria-label', 'value': 'value'
    };
    for (const attrKey in attributeMappings) {
        const htmlAttr = attributeMappings[attrKey];
        document.querySelectorAll(`[data-lang-key-${attrKey}]`).forEach(element => {
            const key = element.getAttribute(`data-lang-key-${attrKey}`);
            if (currentTranslations[key] !== undefined) {
                element.setAttribute(htmlAttr, currentTranslations[key]);
                attributesTranslated++;
            } else if (isDebugMode) {
                logWarning(`Key dịch cho thuộc tính ${attrKey}="${key}" không tìm thấy cho ngôn ngữ "${currentLang}".`);
            }
        });
    }
    
    // Cập nhật các thẻ Meta
    const metaMapping = {
        'meta_description': 'meta[name="description"]',
        'og_title': 'meta[property="og:title"]',
        'og_description': 'meta[property="og:description"]'
    };

    for (const keySuffix in metaMapping) {
        const selector = metaMapping[keySuffix];
        const element = document.querySelector(selector);
        if (element) {
            // Ưu tiên key từ body, sau đó từ chính thẻ meta, cuối cùng là key mặc định
            const specificKey = document.body.getAttribute(`data-${keySuffix}-key`) || element.getAttribute('data-lang-key') || `${keySuffix}_default`;
            if (currentTranslations[specificKey]) {
                element.setAttribute('content', currentTranslations[specificKey]);
            } else if (isDebugMode) {
                logWarning(`Key dịch cho ${selector} ("${specificKey}") không tìm thấy.`);
            }
        }
    }
    
    // Cập nhật tiêu đề trang
    const pageTitleKey = document.body.getAttribute('data-page-title-key') || 
                         (document.querySelector('title') ? document.querySelector('title').getAttribute('data-lang-key') : null) || 
                         'page_title_default';
    if (currentTranslations[pageTitleKey]) {
        document.title = currentTranslations[pageTitleKey];
    }


    document.documentElement.lang = currentLang;
    logDebug(`Hoàn tất áp dụng bản dịch. Phần tử: ${elementsTranslated}, Thuộc tính: ${attributesTranslated}. HTML lang: ${currentLang}`);

    if (typeof window.updateLanguageSwitcherUI === 'function') {
        window.updateLanguageSwitcherUI(currentLang);
    }

    if (document.getElementById('news-container') && typeof window.loadInternalNews === 'function') {
        logDebug("Tìm thấy news-container, đang tải lại tin tức nội bộ.");
        window.loadInternalNews(); // loadInternalNews cần lấy currentLang từ localStorage hoặc getCurrentLanguage()
    }
};

/**
 * Lấy ngôn ngữ hiện tại được ưu tiên.
 * @returns {string} Mã ngôn ngữ ('vi' hoặc 'en').
 */
window.getCurrentLanguage = function() {
    const storedLang = localStorage.getItem(languageStorageKey);
    const supportedLanguages = ['vi', 'en'];
    if (storedLang && supportedLanguages.includes(storedLang)) {
        return storedLang;
    }
    const browserLang = navigator.language.split('-')[0];
    if (supportedLanguages.includes(browserLang)) {
        return browserLang;
    }
    return defaultLanguage;
};

/**
 * Thiết lập ngôn ngữ mới cho trang web.
 * @param {string} lang - Mã ngôn ngữ mới ('vi' hoặc 'en').
 */
window.setLanguage = async function(lang) {
    logDebug(`Đang thiết lập ngôn ngữ thành: ${lang}`);
    const supportedLanguages = ['vi', 'en'];
    if (!supportedLanguages.includes(lang)) {
        logWarning(`Ngôn ngữ "${lang}" không được hỗ trợ. Sử dụng ngôn ngữ mặc định "${defaultLanguage}".`);
        lang = defaultLanguage;
    }

    localStorage.setItem(languageStorageKey, lang);
    logDebug(`Đã lưu ngôn ngữ "${lang}" vào localStorage.`);

    await fetchTranslations(lang); // Đảm bảo bản dịch cho ngôn ngữ mới đã được tải
    window.applyTranslations(); // Áp dụng bản dịch cho toàn bộ trang
};

/**
 * Cập nhật giao diện của bộ chọn ngôn ngữ (cờ, text).
 * @param {string} currentLang - Mã ngôn ngữ hiện tại.
 */
window.updateLanguageSwitcherUI = function(currentLang) {
    logDebug(`Đang cập nhật UI bộ chọn ngôn ngữ cho: ${currentLang}`);
    const flagBaseUrl = '/images/flags/'; // Đường dẫn từ gốc

    // Desktop switcher
    const desktopFlag = document.getElementById('desktop-current-lang-flag');
    const desktopText = document.getElementById('desktop-current-lang-text');
    if (desktopFlag) desktopFlag.src = `${flagBaseUrl}${currentLang === 'vi' ? 'vn' : 'us'}.png`;
    if (desktopText) desktopText.textContent = currentLang.toUpperCase();
    document.querySelectorAll('#desktop-lang-options .lang-button').forEach(btn => {
        const isActive = btn.getAttribute('data-lang') === currentLang;
        btn.classList.toggle('bg-gray-200', isActive); // Lớp cho trạng thái active
        btn.classList.toggle('font-semibold', isActive);
    });

    // Mobile switcher
    const mobileFlag = document.getElementById('mobile-current-lang-flag');
    const mobileText = document.getElementById('mobile-current-lang-text');
    if (mobileFlag) mobileFlag.src = `${flagBaseUrl}${currentLang === 'vi' ? 'vn' : 'us'}.png`;
    if (mobileText) mobileText.textContent = currentLang.toUpperCase();
    document.querySelectorAll('#mobile-lang-options .lang-button').forEach(btn => {
        const isActive = btn.getAttribute('data-lang') === currentLang;
        btn.classList.toggle('bg-gray-200', isActive);
        btn.classList.toggle('font-semibold', isActive);
    });
};

/**
 * Xử lý sự kiện click cho các nút chuyển ngôn ngữ.
 * @param {Event} event - Sự kiện click.
 */
function handleLanguageButtonClick(event) {
    const lang = event.currentTarget.getAttribute('data-lang');
    if (lang) {
        logDebug(`Nút ngôn ngữ được click. Chọn: ${lang}`);
        window.setLanguage(lang);

        // Đóng dropdown (nếu có)
        const desktopDropdownToggle = document.getElementById('desktop-lang-toggle');
        if (desktopDropdownToggle && desktopDropdownToggle.getAttribute('aria-expanded') === 'true') {
            desktopDropdownToggle.click(); 
        }
        const mobileDropdownToggle = document.getElementById('mobile-lang-toggle');
        if (mobileDropdownToggle && mobileDropdownToggle.getAttribute('aria-expanded') === 'true') {
            mobileDropdownToggle.click();
        }
    } else {
        logWarning("Nút ngôn ngữ được click nhưng thiếu thuộc tính 'data-lang'.");
    }
}

/**
 * Gắn (hoặc gắn lại) sự kiện cho các nút chuyển đổi ngôn ngữ.
 * Hàm này nên được gọi bởi script.js sau khi header (chứa các nút) đã được tải vào DOM.
 */
window.attachLanguageSwitcherEvents = function() {
    logDebug("Đang gắn sự kiện cho các nút chuyển ngôn ngữ...");
    const langButtons = document.querySelectorAll('.lang-button'); 

    if (langButtons.length === 0) {
        logWarning("Không tìm thấy nút ngôn ngữ nào (.lang-button).");
        return;
    }
    langButtons.forEach(button => {
        button.removeEventListener('click', handleLanguageButtonClick); // Gỡ bỏ listener cũ (nếu có)
        button.addEventListener('click', handleLanguageButtonClick); // Gắn listener mới
    });
    logDebug(`Đã gắn sự kiện click cho ${langButtons.length} nút ngôn ngữ.`);
};

/**
 * Khởi tạo hệ thống ngôn ngữ.
 * Được gọi một lần khi DOM đã sẵn sàng.
 */
async function initializeLanguageSystem() {
    if (window.languageInitialized) {
        logDebug("Hệ thống ngôn ngữ đã được khởi tạo trước đó.");
        return;
    }
    logDebug("Đang khởi tạo hệ thống ngôn ngữ...");
    window.languageInitialized = true; 
    
    const userPreferredLanguage = window.getCurrentLanguage();
    await fetchTranslations(userPreferredLanguage); // Tải bản dịch ban đầu
    window.applyTranslations(); // Áp dụng bản dịch cho nội dung tĩnh ban đầu
    
    logDebug(`Hệ thống ngôn ngữ đã khởi tạo với ngôn ngữ: ${userPreferredLanguage}.`);
    // Việc gắn sự kiện cho nút ngôn ngữ trong header sẽ do script.js đảm nhiệm sau khi header được tải.
}

// Khởi tạo khi DOM đã sẵn sàng
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeLanguageSystem);
} else {
    initializeLanguageSystem(); // Gọi nếu DOM đã load xong
}
