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
                translations = await defaultResponse.json();
                logDebug(`[Language] Successfully loaded default translations for: ${defaultLanguage}`);
                applyTranslations();
                return;
            } else {
                throw new Error(`[Language] Could not load translations for default language ${defaultLanguage}`);
            }
        }

        translations = await response.json();
        logDebug(`[Language] Successfully loaded translations for: ${lang}`);
        applyTranslations();
        logDebug(`[Language] Translations applied for: ${lang}`);

        // Cập nhật thuộc tính lang của thẻ html để hỗ trợ SEO và accessibility
        document.documentElement.lang = lang;
        logDebug(`[Language] HTML lang attribute set to: ${lang}`);

    } catch (error) {
        console.error("[Language] Error loading or applying translations:", error);
        alert("Không thể tải bản dịch. Vui lòng thử lại sau.");
        // Có thể thêm logic hiển thị thông báo lỗi cho người dùng tại đây
    }
}

// Hàm áp dụng nội dung dịch lên các phần tử HTML
function applyTranslations() {
    logDebug("[Language] Applying translations...");
    const currentLang = getCurrentLanguage();
    let elementsTranslated = 0;
    let attributesTranslated = 0;

    document.querySelectorAll('[data-lang-key]').forEach(element => {
        const key = element.getAttribute('data-lang-key');
        if (translations[key] !== undefined) {
            if (typeof translations[key] === 'object' && translations[key] !== null) {
                // Xử lý các thuộc tính đặc biệt dựa trên data-lang-key-*
                // elementsTranslated++; // Count as translated if base key exists, attributes handled separately
            } else {
                element.innerHTML = translations[key];
                elementsTranslated++;
            }
        } else {
            logWarning(`[Language] Translation key "${key}" not found for language "${currentLang}"`);
            // element.innerHTML = `[${key}]`; // Tùy chọn: hiển thị key để dễ debug
        }
    });

    // Cập nhật các thuộc tính đặc biệt sử dụng data-lang-key-*
    document.querySelectorAll('[data-lang-key-placeholder]').forEach(element => {
        const key = element.getAttribute('data-lang-key-placeholder');
        if (translations[key] && typeof translations[key] === 'object' && translations[key][currentLang] !== undefined) {
            element.placeholder = translations[key][currentLang];
            attributesTranslated++;
        } else {
            logWarning(`[Language] Translation key for placeholder "${key}" not found for language "${currentLang}" or not an object.`);
        }
    });

    document.querySelectorAll('[data-lang-key-alt]').forEach(element => {
        const key = element.getAttribute('data-lang-key-alt');
        if (translations[key] && typeof translations[key] === 'object' && translations[key][currentLang] !== undefined) {
            element.alt = translations[key][currentLang];
            attributesTranslated++;
        } else {
            logWarning(`[Language] Translation key for alt "${key}" not found for language "${currentLang}" or not an object.`);
        }
    });

    // Xử lý các thuộc tính khác như title, value
    document.querySelectorAll('[data-lang-key-title]').forEach(element => {
        const key = element.getAttribute('data-lang-key-title');
        if (translations[key] && typeof translations[key] === 'object' && translations[key][currentLang] !== undefined) {
            element.title = translations[key][currentLang];
        } else {
            logWarning(`[Language] Translation key for title "${key}" not found for language "${currentLang}" or not an object.`);
        }
    });

    document.querySelectorAll('[data-lang-key-value]').forEach(element => {
        const key = element.getAttribute('data-lang-key-value');
        if (translations[key] && typeof translations[key] === 'object' && translations[key][currentLang] !== undefined) {
            element.value = translations[key][currentLang];
        } else {
            logWarning(`[Language] Translation key for value "${key}" not found for language "${currentLang}" or not an object.`);
        }
    });

    // Cập nhật meta tags
    const pageTitleKey = document.body.getAttribute('data-page-title-key') || 'page_title_default';
    document.title = translations[pageTitleKey] || translations['page_title_default'];

    const metaDescriptionElement = document.querySelector('meta[name="description"]');
    if (metaDescriptionElement) {
        const metaDescKey = document.body.getAttribute('data-meta-description-key') || 'meta_description';
        metaDescriptionElement.setAttribute('content', translations[metaDescKey] || translations['meta_description']);
    }

    // Cập nhật Open Graph tags
    const ogTitleElement = document.querySelector('meta[property="og:title"]');
    if (ogTitleElement) {
        const ogTitleKey = document.body.getAttribute('data-og-title-key') || 'og_title_default';
        ogTitleElement.setAttribute('content', translations[ogTitleKey] || translations['og_title_default']);
    }

    const ogDescriptionElement = document.querySelector('meta[property="og:description"]');
    if (ogDescriptionElement) {
        const ogDescKey = document.body.getAttribute('data-og-description-key') || 'og_description';
        ogDescriptionElement.setAttribute('content', translations[ogDescKey] || translations['og_description']);
    }

    logDebug(`[Language] Finished applying translations. Elements updated: ${elementsTranslated}, Attributes updated: ${attributesTranslated}`);
}

// Hàm lấy ngôn ngữ hiện tại (từ localStorage hoặc ngôn ngữ trình duyệt, sau đó fallback về mặc định)
function getCurrentLanguage() {
    const storedLang = localStorage.getItem(languageStorageKey);
    if (storedLang) {
        logDebug(`[Language] Found language in localStorage: ${storedLang}`);
        return storedLang;
    }
    const browserLang = navigator.language.split('-')[0];
    const supportedLanguages = ['vi', 'en']; // Cần cập nhật nếu có thêm ngôn ngữ
    if (supportedLanguages.includes(browserLang)) {
        logDebug(`[Language] Detected supported browser language: ${browserLang}`);
        return browserLang;
    }
    logDebug(`[Language] No stored or supported browser language found. Using default: ${defaultLanguage}`);
    return defaultLanguage;
}

// Hàm thiết lập ngôn ngữ mới và lưu vào localStorage
function setLanguage(lang) {
    console.log(`[Language] Attempting to set language to: ${lang}`);
    const supportedLanguages = ['vi', 'en']; // Cần cập nhật nếu có thêm ngôn ngữ
    if (supportedLanguages.includes(lang)) {
        localStorage.setItem(languageStorageKey, lang);
        console.log(`[Language] Language "${lang}" saved to localStorage.`);
        loadTranslations(lang);
    } else {
        console.warn(`[Language] Language "${lang}" is not supported. Falling back to default language.`);
        setLanguage(defaultLanguage);
    }
}

// Hàm khởi tạo: tải ngôn ngữ khi trang được tải hoàn toàn
document.addEventListener('DOMContentLoaded', () => {
    logDebug("[Language] DOMContentLoaded event fired. Initializing language...");
    const userPreferredLanguage = getCurrentLanguage();
    loadTranslations(userPreferredLanguage);

    // Thêm event listener cho bộ chuyển đổi ngôn ngữ gọi từ UI bên ngoài (nếu cần)
    const switchers = document.querySelectorAll('.lang-switcher');
    logDebug(`[Language] Found ${switchers.length} language switcher elements.`);
    switchers.forEach(button => {
        button.addEventListener('click', (event) => {
            const lang = event.target.getAttribute('data-lang');
            if (lang) {
                logDebug(`[Language] Language switcher clicked. data-lang attribute: ${lang}`);
                setLanguage(lang);
            } else {
                logWarning("[Language] Language switcher clicked but no 'data-lang' attribute found.");
            }
        });
    });
});

window.setLanguage = setLanguage; // Xuất hàm setLanguage để có thể gọi từ UI bên ngoài (nếu cần)