// /js/language.js
// Phiên bản: Tải bản dịch từ tệp JSON riêng biệt (có thêm log debug)

// Object để lưu trữ nội dung dịch đã tải
let translations = {};

// Ngôn ngữ mặc định
const defaultLanguage = 'vi';

// Khóa lưu ngôn ngữ trong localStorage
const languageStorageKey = 'userLanguage';

// Hàm tải nội dung dịch từ tệp JSON
async function loadTranslations(lang) {
    console.log(`[Language] Attempting to load translations for language: ${lang}`);
    try {
        const response = await fetch(`/languages/${lang}.json`);

        if (!response.ok) {
            console.warn(`[Language] Could not load translations for ${lang}. Status: ${response.status}. Falling back to default language: ${defaultLanguage}`);
             if (lang !== defaultLanguage) {
                 const defaultResponse = await fetch(`/languages/${defaultLanguage}.json`);
                 if (!defaultResponse.ok) {
                      throw new Error(`[Language] Could not load translations for default language ${defaultLanguage}. Status: ${defaultResponse.status}`);
                 }
                 translations = await defaultResponse.json();
                 console.log(`[Language] Successfully loaded default translations for: ${defaultLanguage}`);
                 applyTranslations();
                 return;
             } else {
                 throw new Error(`[Language] Could not load translations for default language ${defaultLanguage}`);
             }
        }

        translations = await response.json();
        console.log(`[Language] Successfully loaded translations for: ${lang}`);
        applyTranslations();
        console.log(`[Language] Translations applied for: ${lang}`);

        // Cập nhật thuộc tính lang của thẻ html để hỗ trợ SEO và accessibility
        document.documentElement.lang = lang;
        console.log(`[Language] HTML lang attribute set to: ${lang}`);

    } catch (error) {
        console.error("[Language] Error loading or applying translations:", error);
        // Có thể thêm logic hiển thị thông báo lỗi cho người dùng tại đây
    }
}

// Hàm áp dụng nội dung dịch lên các phần tử HTML
function applyTranslations() {
    console.log("[Language] Applying translations...");
    const currentLang = getCurrentLanguage();
    let elementsTranslated = 0;
    let attributesTranslated = 0;

    // Lặp qua tất cả các phần tử có thuộc tính data-lang-key
    document.querySelectorAll('[data-lang-key]').forEach(element => {
        const key = element.getAttribute('data-lang-key');

        if (translations[key] !== undefined) {
            if (typeof translations[key] === 'object' && translations[key] !== null) {
                 // Xử lý các thuộc tính đặc biệt dựa trên data-lang-key-*
                 // Logic này đã được tách ra bên dưới để xử lý riêng
                 // elementsTranslated++; // Count as translated if base key exists, attributes handled separately
            } else {
                element.innerHTML = translations[key];
                elementsTranslated++;
            }
        } else {
            console.warn(`[Language] Translation key "${key}" not found for language "${currentLang}"`);
             // element.innerHTML = `[${key}]`; // Tùy chọn: hiển thị key để dễ debug
        }
    });

    // Cập nhật các thuộc tính đặc biệt sử dụng data-lang-key-*
     document.querySelectorAll('[data-lang-key-placeholder]').forEach(element => {
         const key = element.getAttribute('data-lang-key-placeholder');
         const currentLang = getCurrentLanguage();
          if (translations[key] && typeof translations[key] === 'object' && translations[key][currentLang] !== undefined) {
               element.placeholder = translations[key][currentLang];
               attributesTranslated++;
          } else {
               console.warn(`[Language] Translation key for placeholder "${key}" not found for language "${currentLang}" or not an object.`);
          }
     });

      document.querySelectorAll('[data-lang-key-alt]').forEach(element => {
          const key = element.getAttribute('data-lang-key-alt');
          const currentLang = getCurrentLanguage();
           if (translations[key] && typeof translations[key] === 'object' && translations[key][currentLang] !== undefined) {
                element.alt = translations[key][currentLang];
                attributesTranslated++;
           } else {
                console.warn(`[Language] Translation key for alt "${key}" not found for language "${currentLang}" or not an object.`);
           }
      });

    console.log(`[Language] Finished applying translations. Elements updated: ${elementsTranslated}, Attributes updated: ${attributesTranslated}`);
}

// Hàm lấy ngôn ngữ hiện tại (từ localStorage hoặc ngôn ngữ trình duyệt, sau đó fallback về mặc định)
function getCurrentLanguage() {
    const storedLang = localStorage.getItem(languageStorageKey);
    if (storedLang) {
        console.log(`[Language] Found language in localStorage: ${storedLang}`);
        return storedLang;
    }

    const browserLang = navigator.language.split('-')[0];
    const supportedLanguages = ['vi', 'en']; // Cần cập nhật nếu có thêm ngôn ngữ

    if (supportedLanguages.includes(browserLang)) {
        console.log(`[Language] Detected supported browser language: ${browserLang}`);
        return browserLang;
    }

    console.log(`[Language] No stored or supported browser language found. Using default: ${defaultLanguage}`);
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
        console.warn(`[Language] Language "${lang}" is not supported.`);
    }
}

// Hàm khởi tạo: tải ngôn ngữ khi trang được tải hoàn toàn
document.addEventListener('DOMContentLoaded', () => {
    console.log("[Language] DOMContentLoaded event fired. Initializing language...");
    const userPreferredLanguage = getCurrentLanguage();
    loadTranslations(userPreferredLanguage);

    // Thêm event listener cho bộ chuyển đổi ngôn ngữ
    const switchers = document.querySelectorAll('.lang-switcher');
    console.log(`[Language] Found ${switchers.length} language switcher elements.`);
    switchers.forEach(button => {
        button.addEventListener('click', (event) => {
            const lang = event.target.getAttribute('data-lang');
            console.log(`[Language] Language switcher clicked. data-lang attribute: ${lang}`);
            if (lang) {
                setLanguage(lang);
            } else {
                 console.warn("[Language] Language switcher clicked but no 'data-lang' attribute found.");
            }
        });
    });
});

// Xuất hàm setLanguage để có thể gọi từ UI bên ngoài (nếu cần)
window.setLanguage = setLanguage;