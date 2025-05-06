// /js/language.js
// Phiên bản: Tải bản dịch từ tệp JSON riêng biệt (có thêm log debug)

// Object để lưu trữ nội dung dịch đã tải
let translations = {};

// Ngôn ngữ mặc định
const defaultLanguage = 'vi';

// Khóa lưu ngôn ngữ trong localStorage
const languageStorageKey = 'userLanguage';

const isDebugMode = true; // Đặt thành false trong môi trường production

function logDebug(message) {
    if (isDebugMode) {
        console.log(message);
    }
}

function logWarning(message) {
    if (isDebugMode) {
        console.warn(message);
    }
}

function logError(message) {
    console.error(message);
}

// Hàm tải nội dung dịch từ tệp JSON
async function loadTranslations(lang) {
    logDebug(`[Language] Attempting to load translations for language: ${lang}`);
    try {
        const response = await fetch(`/languages/${lang}.json`);

        if (!response.ok) {
            logWarning(`[Language] Could not load translations for ${lang}. Status: ${response.status}. Falling back to default language: ${defaultLanguage}`);
            if (lang !== defaultLanguage) {
                const defaultResponse = await fetch(`/languages/${defaultLanguage}.json`);
                if (!defaultResponse.ok) {
                    throw new Error(`[Language] Could not load translations for default language ${defaultLanguage}. Status: ${defaultResponse.status}`);
                }
                translations = await defaultResponse.json(); // Gán vào biến toàn cục translations
                logDebug(`[Language] Successfully loaded default translations for: ${defaultLanguage}`);
                // Không gọi applyTranslations() ở đây nữa, để hàm gọi loadTranslations xử lý
                return; // Trả về để báo hiệu đã tải xong (hoặc fallback)
            } else {
                throw new Error(`[Language] Could not load translations for default language ${defaultLanguage}`);
            }
        }

        translations = await response.json(); // Gán vào biến toàn cục translations
        logDebug(`[Language] Successfully loaded translations for: ${lang}`);
        // Không gọi applyTranslations() ở đây nữa
        // Cập nhật thuộc tính lang của thẻ html để hỗ trợ SEO và accessibility
        document.documentElement.lang = lang;
        logDebug(`[Language] HTML lang attribute set to: ${lang}`);

    } catch (error) {
        console.error("[Language] Error loading translations:", error);
        // Không alert ở đây để tránh làm gián đoạn luồng nếu script khác đang xử lý
        // Có thể thêm logic hiển thị thông báo lỗi cho người dùng tại đây một cách tinh tế hơn
    }
}

// Hàm áp dụng nội dung dịch lên các phần tử HTML
// Đảm bảo hàm này được export ra window để script.js có thể gọi
window.applyTranslations = function() {
    const currentLang = getCurrentLanguage(); // Lấy ngôn ngữ hiện tại bên trong hàm
    logDebug(`[Language] Applying translations for: ${currentLang}`);

    if (!translations || Object.keys(translations).length === 0) {
        logWarning("[Language] Translations object is empty or not loaded. Cannot apply translations.");
        return;
    }

    let elementsTranslated = 0;
    let attributesTranslated = 0;

    document.querySelectorAll('[data-lang-key]').forEach(element => {
        const key = element.getAttribute('data-lang-key');
        if (translations[key] !== undefined) {
            // Kiểm tra nếu là thẻ title thì dùng textContent
            if (element.tagName === 'TITLE') {
                element.textContent = translations[key];
            } else {
                element.innerHTML = translations[key]; // Cho phép HTML trong bản dịch
            }
            elementsTranslated++;
        } else {
            logWarning(`[Language] Translation key "${key}" not found for language "${currentLang}". Element content: "${element.textContent.trim().substring(0,30)}..."`);
        }
    });

    // Cập nhật các thuộc tính đặc biệt sử dụng data-lang-key-*
    const attributeMappings = {
        'placeholder': 'placeholder',
        'alt': 'alt',
        'title': 'title',
        'aria-label': 'aria-label', // Thêm aria-label
        'value': 'value' // Thêm value
    };

    for (const attrKey in attributeMappings) {
        const htmlAttr = attributeMappings[attrKey];
        document.querySelectorAll(`[data-lang-key-${attrKey}]`).forEach(element => {
            const key = element.getAttribute(`data-lang-key-${attrKey}`);
            if (translations[key] !== undefined) {
                // Nếu giá trị dịch là một object (cho các thuộc tính đa ngôn ngữ), lấy giá trị theo currentLang
                if (typeof translations[key] === 'object' && translations[key] !== null && translations[key][currentLang] !== undefined) {
                    element.setAttribute(htmlAttr, translations[key][currentLang]);
                } else if (typeof translations[key] === 'string') { // Nếu là string, dùng trực tiếp
                    element.setAttribute(htmlAttr, translations[key]);
                } else {
                     logWarning(`[Language] Translation for attribute ${attrKey} key "${key}" is not a string or object with currentLang for language "${currentLang}".`);
                }
                attributesTranslated++;
            } else {
                logWarning(`[Language] Translation key for ${attrKey} "${key}" not found for language "${currentLang}".`);
            }
        });
    }
    
    // Cập nhật meta tags
    const pageTitleKey = document.body.getAttribute('data-page-title-key') || 'page_title_default';
    if (translations[pageTitleKey]) {
        document.title = translations[pageTitleKey];
    }

    const metaDescriptionElement = document.querySelector('meta[name="description"]');
    if (metaDescriptionElement) {
        const metaDescKey = metaDescriptionElement.getAttribute('data-lang-key') || document.body.getAttribute('data-meta-description-key') || 'meta_description_default';
        if (translations[metaDescKey]) {
            metaDescriptionElement.setAttribute('content', translations[metaDescKey]);
        }
    }

    const ogTitleElement = document.querySelector('meta[property="og:title"]');
    if (ogTitleElement) {
        const ogTitleKey = ogTitleElement.getAttribute('data-lang-key') || document.body.getAttribute('data-og-title-key') || 'og_title_default';
        if (translations[ogTitleKey]) {
            ogTitleElement.setAttribute('content', translations[ogTitleKey]);
        }
    }

    const ogDescriptionElement = document.querySelector('meta[property="og:description"]');
    if (ogDescriptionElement) {
        const ogDescKey = ogDescriptionElement.getAttribute('data-lang-key') || document.body.getAttribute('data-og-description-key') || 'og_description_default';
        if (translations[ogDescKey]) {
            ogDescriptionElement.setAttribute('content', translations[ogDescKey]);
        }
    }

    logDebug(`[Language] Finished applying translations. Elements updated: ${elementsTranslated}, Attributes updated: ${attributesTranslated}`);
    
    // Cập nhật UI của language switcher sau khi áp dụng bản dịch
    if (typeof window.updateLanguageSwitcherUI === 'function') {
        window.updateLanguageSwitcherUI(currentLang);
    }
}

// Hàm lấy ngôn ngữ hiện tại
window.getCurrentLanguage = function() { // Export ra window
    const storedLang = localStorage.getItem(languageStorageKey);
    if (storedLang) {
        logDebug(`[Language] Found language in localStorage: ${storedLang}`);
        return storedLang;
    }
    const browserLang = navigator.language.split('-')[0];
    const supportedLanguages = ['vi', 'en'];
    if (supportedLanguages.includes(browserLang)) {
        logDebug(`[Language] Detected supported browser language: ${browserLang}`);
        return browserLang;
    }
    logDebug(`[Language] No stored or supported browser language found. Using default: ${defaultLanguage}`);
    return defaultLanguage;
}

// Hàm thiết lập ngôn ngữ mới
window.setLanguage = async function(lang) { // Export ra window và làm async
    console.log(`[Language] Attempting to set language to: ${lang}`);
    const supportedLanguages = ['vi', 'en'];
    if (supportedLanguages.includes(lang)) {
        localStorage.setItem(languageStorageKey, lang);
        console.log(`[Language] Language "${lang}" saved to localStorage.`);
        await loadTranslations(lang); // Chờ load xong
        applyTranslations(); // Sau đó mới áp dụng
        document.documentElement.lang = lang; // Đảm bảo cập nhật lang cho HTML tag
    } else {
        console.warn(`[Language] Language "${lang}" is not supported. Falling back to default language.`);
        await setLanguage(defaultLanguage); // Gọi lại chính nó với ngôn ngữ mặc định
    }
}

// Hàm cập nhật UI cho bộ chọn ngôn ngữ (cờ, text)
window.updateLanguageSwitcherUI = function(currentLang) { // Export ra window
    logDebug(`[Language] Updating language switcher UI for lang: ${currentLang}`);
    const flagBaseUrl = '/images/flags/'; // Đường dẫn tới thư mục cờ từ gốc

    // Desktop switcher
    const desktopFlag = document.getElementById('desktop-current-lang-flag');
    const desktopText = document.getElementById('desktop-current-lang-text');
    if (desktopFlag) desktopFlag.src = `${flagBaseUrl}${currentLang}.svg`; // Giả sử file cờ là svg
    if (desktopText) desktopText.textContent = currentLang.toUpperCase();
    document.querySelectorAll('#desktop-lang-options .lang-button').forEach(btn => {
        btn.classList.toggle('bg-gray-200', btn.getAttribute('data-lang') === currentLang);
        btn.classList.toggle('font-semibold', btn.getAttribute('data-lang') === currentLang);
    });

    // Mobile switcher
    const mobileFlag = document.getElementById('mobile-current-lang-flag');
    const mobileText = document.getElementById('mobile-current-lang-text');
    if (mobileFlag) mobileFlag.src = `${flagBaseUrl}${currentLang}.svg`;
    if (mobileText) mobileText.textContent = currentLang.toUpperCase();
    document.querySelectorAll('#mobile-lang-options .lang-button').forEach(btn => {
        btn.classList.toggle('bg-gray-200', btn.getAttribute('data-lang') === currentLang);
        btn.classList.toggle('font-semibold', btn.getAttribute('data-lang') === currentLang);
    });
}


// Hàm gắn sự kiện cho các nút chuyển ngôn ngữ
// Hàm này cần được gọi từ script.js sau khi header được tải và chèn vào DOM
window.attachLanguageSwitcherEvents = function() { // Export ra window
    logDebug("[Language] Attaching language switcher event listeners...");
    const langButtons = document.querySelectorAll('.lang-button'); // Class chung cho các nút ngôn ngữ

    langButtons.forEach(button => {
        // Gỡ bỏ listener cũ để tránh gắn nhiều lần nếu hàm này được gọi lại
        button.removeEventListener('click', handleLanguageButtonClick);
        button.addEventListener('click', handleLanguageButtonClick);
    });
    logDebug(`[Language] Attached/Re-attached listeners to ${langButtons.length} language buttons.`);
}

function handleLanguageButtonClick(event) {
    const lang = event.currentTarget.getAttribute('data-lang');
    if (lang) {
        logDebug(`[Language] Language button clicked. Setting language to: ${lang}`);
        window.setLanguage(lang); // Gọi hàm setLanguage đã được export

        // Đóng dropdown sau khi chọn (logic này có thể cần điều chỉnh tùy theo cách bạn làm dropdown)
        const desktopDropdown = document.getElementById('desktop-language-dropdown');
        if (desktopDropdown && desktopDropdown.classList.contains('open')) { // Giả sử có class 'open'
            desktopDropdown.querySelector('#desktop-lang-toggle')?.click(); // Simulate click để đóng
        }
        const mobileDropdown = document.getElementById('mobile-language-dropdown');
        if (mobileDropdown && mobileDropdown.classList.contains('open')) {
             mobileDropdown.querySelector('#mobile-lang-toggle')?.click();
        }
    }
}

// Hàm khởi tạo chính của hệ thống ngôn ngữ
async function initializeLanguage() {
    logDebug("[Language] Initializing language system...");
    window.languageInitialized = true; // Đặt cờ báo đã khởi tạo
    const userPreferredLanguage = getCurrentLanguage();
    await loadTranslations(userPreferredLanguage); // Tải bản dịch
    applyTranslations(); // Áp dụng bản dịch ban đầu

    // Gắn sự kiện cho các nút chuyển ngôn ngữ tĩnh (nếu có trên trang ban đầu)
    // Tuy nhiên, việc này nên được xử lý bởi script.js sau khi header load xong là tốt nhất
    // window.attachLanguageSwitcherEvents(); // Gọi ở đây nếu có nút tĩnh, nhưng ưu tiên gọi từ script.js sau khi header load
}


// Khởi tạo ngôn ngữ khi DOM đã sẵn sàng
// Đảm bảo nó chỉ chạy một lần
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        if (!window.languageInitialized) {
            initializeLanguage();
        }
    });
} else {
    if (!window.languageInitialized) {
        initializeLanguage();
    }
}
