// Global namespace for the language system
window.langSystem = window.langSystem || {
    translations: {},
    defaultLanguage: 'en', // Ngôn ngữ mặc định đã được đổi thành 'en'
    languageStorageKey: 'userPreferredLanguage_v2', 
    isDebugMode: true, 
    currentLanguage: null,
    initialized: false,
    languageFilesPath: '/lang/' 
};

// Hàm ghi log debug
function langLog(message, type = 'log') {
    if (window.langSystem.isDebugMode || type === 'error' || type === 'warn') {
        console[type](`[LangJS] ${message}`);
    }
}

// Hàm ghi log cảnh báo
function logWarning(message) { // Đã có sẵn, giữ nguyên
    if (window.langSystem.isDebugMode) {
        console.warn(`[LangJS] ${message}`);
    }
}

// Tải các bản dịch từ tệp JSON
async function fetchTranslations(langCode) {
    langLog(`Đang tải bản dịch cho: ${langCode}`);
    if (window.langSystem.translations[langCode] && Object.keys(window.langSystem.translations[langCode]).length > 0) {
        langLog(`Bản dịch cho ${langCode} đã có trong bộ nhớ.`);
        return;
    }
    try {
        const response = await fetch(`${window.langSystem.languageFilesPath}${langCode}.json?v=${new Date().getTime()}`); // Cache busting
        if (!response.ok) {
            throw new Error(`Lỗi HTTP ${response.status} khi tải ${langCode}.json từ ${response.url}`);
        }
        window.langSystem.translations[langCode] = await response.json();
        langLog(`Đã tải thành công bản dịch cho ${langCode}.`);
    } catch (error) {
        console.error(`[LangJS] Lỗi tải bản dịch cho ${langCode}:`, error);
        if (langCode !== window.langSystem.defaultLanguage) {
            langLog(`Thử tải ngôn ngữ mặc định: ${window.langSystem.defaultLanguage} do lỗi với ${langCode}.`, 'warn');
            await fetchTranslations(window.langSystem.defaultLanguage); 
        } else {
            console.error("[LangJS] LỖI NGHIÊM TRỌNG: Không thể tải bản dịch mặc định! Chức năng ngôn ngữ sẽ bị ảnh hưởng.");
        }
    }
}

// Áp dụng bản dịch cho các phần tử trên trang (cải thiện)
window.applyTranslations = (targetElement = document.documentElement) => {
    const lang = window.langSystem.currentLanguage || window.langSystem.defaultLanguage;
    langLog(`Áp dụng bản dịch cho ngôn ngữ: ${lang} trên phần tử: ${targetElement.id || targetElement.tagName}`);
    
    const elementsToTranslate = targetElement.querySelectorAll('[data-lang-key]');
    const translations = window.langSystem.translations[lang] || window.langSystem.translations[window.langSystem.defaultLanguage] || {};

    if (Object.keys(translations).length === 0) {
        langLog(`Không có bản dịch nào cho ${lang} hoặc mặc định. DOM sẽ không được cập nhật.`, 'warn');
        return;
    }

    elementsToTranslate.forEach(el => {
        const key = el.dataset.langKey;
        const translation = translations[key];

        if (typeof translation === 'string') {
            if (el.hasAttribute('data-lang-key-aria')) {
                 el.setAttribute('aria-label', translation);
            } else if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                if (el.type === 'submit' || el.type === 'button') {
                    el.value = translation;
                } else if (el.placeholder !== undefined && (el.hasAttribute('data-lang-key-placeholder') || !el.value)) { 
                    el.placeholder = translation;
                } else if (el.hasAttribute('data-lang-key-value')){ 
                    el.value = translation;
                }
            } else if (el.hasAttribute('data-lang-key-title')) { 
                el.title = translation;
            } else {
                // Tìm text node đầu tiên không trống để thay thế, giữ lại các element con (ví dụ: icon)
                let replaced = false;
                for (let i = 0; i < el.childNodes.length; i++) {
                    const childNode = el.childNodes[i];
                    if (childNode.nodeType === Node.TEXT_NODE && childNode.textContent.trim() !== '') {
                        childNode.textContent = translation;
                        replaced = true;
                        break; 
                    } else if (childNode.nodeType === Node.ELEMENT_NODE && childNode.tagName === 'SPAN' && childNode.dataset.translate === key) { 
                        // Trường hợp đặc biệt nếu text nằm trong một span cụ thể
                        childNode.textContent = translation;
                        replaced = true;
                        break;
                    }
                }
                // Nếu không tìm thấy text node nào đáng kể, hoặc element trống, thì đặt textContent/innerHTML
                if (!replaced) {
                    // Nếu có icon và chỉ có text cần thay thế, cố gắng giữ icon
                    const icon = el.querySelector('i.fas, i.fab, i.far, i.fal, i.fa-solid, i.fa-regular, i.fa-light, i.fa-thin, i.fa-duotone');
                    if (icon && el.textContent.trim() !== translation.trim()) { // Chỉ thay nếu text thực sự khác
                        // Tìm text node bên cạnh icon để thay thế
                        let textNodeAfterIcon = icon.nextSibling;
                        while(textNodeAfterIcon && textNodeAfterIcon.nodeType !== Node.TEXT_NODE){
                            textNodeAfterIcon = textNodeAfterIcon.nextSibling;
                        }
                        if(textNodeAfterIcon && textNodeAfterIcon.nodeType === Node.TEXT_NODE){
                            textNodeAfterIcon.textContent = ` ${translation}`; // Thêm khoảng trắng
                        } else {
                             // Nếu không có text node, thêm một span mới sau icon
                            const textSpan = document.createElement('span');
                            textSpan.textContent = ` ${translation}`;
                            icon.parentNode.insertBefore(textSpan, icon.nextSibling);
                        }
                    } else {
                        el.textContent = translation; // An toàn nhất là textContent nếu không chắc chắn về cấu trúc con
                    }
                }
            }
        } else {
            langLog(`Khóa dịch '${key}' không tìm thấy cho ngôn ngữ '${lang}'. Phần tử:`, 'warn', el);
        }
    });

    document.documentElement.lang = lang;

    const currentLangDesktopEl = document.getElementById('current-lang-desktop');
    if (currentLangDesktopEl) currentLangDesktopEl.textContent = lang.toUpperCase();
    const currentLangMobileEl = document.getElementById('current-lang-mobile'); // Giả sử có ID này cho mobile
    if (currentLangMobileEl) currentLangMobileEl.textContent = lang.toUpperCase();


    langLog(`Đã áp dụng bản dịch cho ${lang}.`);
}
window.applyLanguage = window.applyTranslations; // Alias

window.getCurrentLanguage = () => {
    let preferredLanguage = localStorage.getItem(window.langSystem.languageStorageKey);
    if (preferredLanguage && window.langSystem.translations[preferredLanguage]) {
        return preferredLanguage;
    }
    const browserLanguage = (navigator.language || navigator.userLanguage || window.langSystem.defaultLanguage).split('-')[0];
    const supportedLanguages = Object.keys(window.langSystem.translations); // Hoặc một mảng cố định ['vi', 'en']
    if (supportedLanguages.includes(browserLanguage)) {
        return browserLanguage;
    }
    return window.langSystem.defaultLanguage;
};

const handleLanguageButtonClick = async (event) => {
    const button = event.currentTarget; 
    const selectedLanguage = button.dataset.lang;

    if (!selectedLanguage) {
        logWarning("Nút ngôn ngữ được click không có thuộc tính data-lang.");
        return;
    }
    if (selectedLanguage !== window.langSystem.currentLanguage) {
        langLog(`Người dùng chọn ngôn ngữ: ${selectedLanguage}`);
        await window.setLanguage(selectedLanguage);
    }
};

window.initializeLanguageButtons = () => {
    const currentLang = window.langSystem.currentLanguage || window.langSystem.defaultLanguage;
    langLog(`Khởi tạo các nút ngôn ngữ. Ngôn ngữ hiện tại: ${currentLang}`);

    const langOptionButtons = document.querySelectorAll('.lang-option, .lang-option-mobile');
    if (langOptionButtons.length === 0) {
        langLog('Không tìm thấy nút chọn ngôn ngữ nào.', 'warn');
        return;
    }

    langOptionButtons.forEach(button => {
        button.removeEventListener('click', handleLanguageButtonClick); 
        button.addEventListener('click', handleLanguageButtonClick);

        if (button.dataset.lang === currentLang) {
            button.classList.add('active-language-option', 'font-semibold', 'text-ivs-accent', 'dark:text-ivs-secondary'); 
            button.setAttribute('aria-pressed', 'true');
        } else {
            button.classList.remove('active-language-option', 'font-semibold', 'text-ivs-accent', 'dark:text-ivs-secondary');
            button.setAttribute('aria-pressed', 'false');
        }
    });
    langLog(`${langOptionButtons.length} nút ngôn ngữ đã được xử lý.`);
};

window.setLanguage = async (langCode) => {
    langLog(`Thiết lập ngôn ngữ thành: ${langCode}`);
    
    // Tải bản dịch nếu chưa có
    if (!window.langSystem.translations[langCode]) { 
        langLog(`Bản dịch cho ${langCode} chưa được tải. Đang tải...`);
        await fetchTranslations(langCode); 
    }

    // Kiểm tra lại sau khi tải, nếu vẫn không có (kể cả default), thì có lỗi nghiêm trọng
    if (!window.langSystem.translations[langCode] && langCode !== window.langSystem.defaultLanguage) {
        langLog(`Không thể tải ${langCode}, thử lại với ngôn ngữ mặc định: ${window.langSystem.defaultLanguage}`, 'warn');
        await window.setLanguage(window.langSystem.defaultLanguage); 
        return; // Thoát sau khi gọi đệ quy
    }
    
    if (!window.langSystem.translations[langCode]) {
        console.error(`[LangJS] LỖI NGHIÊM TRỌNG: Không thể thiết lập ngôn ngữ ${langCode} vì bản dịch (và cả mặc định) không tải được.`);
        return; 
    }

    localStorage.setItem(window.langSystem.languageStorageKey, langCode);
    window.langSystem.currentLanguage = langCode; 
    
    window.applyTranslations(); // Áp dụng lại tất cả bản dịch trên toàn trang
    window.initializeLanguageButtons(); // Cập nhật trạng thái active của các nút
};
window.updateLanguage = window.setLanguage; // Alias

window.initializeLanguageSystem = async () => {
    if (window.langSystem.initialized) {
        langLog("Hệ thống ngôn ngữ đã được khởi tạo trước đó. Sẽ chỉ áp dụng lại bản dịch và nút.");
        window.applyTranslations(); 
        window.initializeLanguageButtons();
        return;
    }
    langLog("Đang khởi tạo hệ thống ngôn ngữ...");

    // Xác định ngôn ngữ sẽ sử dụng
    let initialLang = localStorage.getItem(window.langSystem.languageStorageKey);
    if (!initialLang || !(await (async () => { await fetchTranslations(initialLang); return !!window.langSystem.translations[initialLang]; })()) ) {
        const browserLang = (navigator.language || navigator.userLanguage || window.langSystem.defaultLanguage).split('-')[0];
        initialLang = (await (async () => { await fetchTranslations(browserLang); return !!window.langSystem.translations[browserLang]; })()) 
                      ? browserLang 
                      : window.langSystem.defaultLanguage;
        langLog(`Không có ngôn ngữ lưu trữ hợp lệ, hoặc ngôn ngữ trình duyệt không hỗ trợ, sử dụng: ${initialLang}`);
    }
    window.langSystem.currentLanguage = initialLang;
    
    // Đảm bảo cả ngôn ngữ hiện tại và ngôn ngữ mặc định đều được tải
    await fetchTranslations(window.langSystem.currentLanguage);
    if (window.langSystem.currentLanguage !== window.langSystem.defaultLanguage) {
        await fetchTranslations(window.langSystem.defaultLanguage);
    }
    
    // Nếu sau tất cả mà ngôn ngữ hiện tại vẫn không có bản dịch, fallback về default
    if (!window.langSystem.translations[window.langSystem.currentLanguage]) {
        langLog(`Bản dịch cho ${window.langSystem.currentLanguage} không khả dụng, fallback về ${window.langSystem.defaultLanguage}.`, "warn");
        window.langSystem.currentLanguage = window.langSystem.defaultLanguage;
    }

    window.applyTranslations(); 
    window.initializeLanguageButtons(); 
    
    window.langSystem.initialized = true;
    langLog(`Hệ thống ngôn ngữ đã khởi tạo. Ngôn ngữ hiện tại: ${window.langSystem.currentLanguage}.`);
    // Log này rất quan trọng để xác nhận hàm này đã chạy và gán `window.langSystem.initialized = true;`
    console.log(`[LangJS CRITICAL CHECK] initializeLanguageSystem completed. Initialized flag: ${window.langSystem.initialized}`);
};

// QUAN TRỌNG: Việc gọi window.initializeLanguageSystem() PHẢI được thực hiện bởi loadComponents.js
// SAU KHI header (chứa nút ngôn ngữ) đã được tải VÀ DOM của header đã sẵn sàng.
// Ví dụ trong loadComponents.js:
// await loadHeader(); // Đảm bảo header.html được tải và các element của nó có trong DOM
// if (typeof window.initializeLanguageSystem === 'function') {
//     await window.initializeLanguageSystem();
// }
