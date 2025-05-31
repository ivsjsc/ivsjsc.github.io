// Khởi tạo không gian tên toàn cục cho hệ thống ngôn ngữ
window.langSystem = window.langSystem || {
    translations: {},
    defaultLanguage: 'vi',
    languageStorageKey: 'userPreferredLanguage',
    isDebugMode: false, 
    currentLanguage: null,
    initialized: false
};

function logDebug(message) {
    if (window.langSystem.isDebugMode) {
        console.log(`[LangJS] ${message}`);
    }
}

function logWarning(message) {
    if (window.langSystem.isDebugMode) {
        console.warn(`[LangJS] ${message}`);
    }
}

async function fetchTranslations(lang) {
    logDebug(`Fetching translations for: ${lang}`);
    if (window.langSystem.translations[lang] && Object.keys(window.langSystem.translations[lang]).length > 0) {
        logDebug(`Translations for ${lang} already loaded.`);
        return;
    }
    try {
        const response = await fetch(`${window.location.origin}/lang/${lang}.json`);
        if (!response.ok) {
            throw new Error(`Failed to load translations for ${lang}: ${response.statusText}`);
        }
        window.langSystem.translations[lang] = await response.json();
        logDebug(`Successfully loaded translations for ${lang}.`);
    } catch (error) {
        console.error(`[LangJS] Error loading translations for ${lang}:`, error);
        if (lang !== window.langSystem.defaultLanguage) {
            logWarning(`Falling back to default language: ${window.langSystem.defaultLanguage}`);
            await fetchTranslations(window.langSystem.defaultLanguage);
        } else {
            console.error("[LangJS] Failed to load default translations!");
        }
    }
}

window.applyTranslations = () => {
    logDebug("Applying translations...");
    const elementsToTranslate = document.querySelectorAll('[data-lang-key]');
    const currentLang = window.getCurrentLanguage();
    const currentTranslations = window.langSystem.translations[currentLang];
    const defaultTranslations = window.langSystem.translations[window.langSystem.defaultLanguage];

    elementsToTranslate.forEach(element => {
        const key = element.getAttribute('data-lang-key');
        if (currentTranslations && currentTranslations[key]) {
            element.textContent = currentTranslations[key];
        } else if (defaultTranslations && defaultTranslations[key]) {
            element.textContent = defaultTranslations[key];
            logWarning(`Translation for key '${key}' not found in current language (${currentLang}). Using default translation.`);
        } else {
            logWarning(`Translation for key '${key}' not found in any language.`);
        }
    });
    logDebug("Translations applied.");
};

window.getCurrentLanguage = () => {
    const storedLanguage = localStorage.getItem(window.langSystem.languageStorageKey);
    if (storedLanguage) {
        logDebug(`Retrieved language from localStorage: ${storedLanguage}`);
        return storedLanguage;
    } else {
        const browserLanguage = navigator.language || navigator.userLanguage;
        const languageCode = browserLanguage ? browserLanguage.split('-')[0] : window.langSystem.defaultLanguage;
        logDebug(`Using browser language: ${languageCode}`);
        return languageCode;
    }
};

window.updateLanguage = window.setLanguage;

const handleLanguageButtonClick = async (event) => {
    const selectedLanguage = event.target.dataset.lang;
    if (!selectedLanguage) {
        logWarning("Clicked language button has no data-lang attribute.");
        return;
    }
    logDebug(`User selected language: ${selectedLanguage}`);
    await window.setLanguage(selectedLanguage);
};

window.initializeLanguageButtons = () => {
    logDebug("Initializing language buttons...");
    const langButtons = document.querySelectorAll('.lang-button');
    const currentActiveLang = window.getCurrentLanguage();

    if (langButtons.length === 0) {
        logWarning("No language buttons (.lang-button) found.");
        return;
    }

    langButtons.forEach(button => {
        button.removeEventListener('click', handleLanguageButtonClick);
        button.addEventListener('click', handleLanguageButtonClick);

        if (button.dataset.lang === currentActiveLang) {
            button.classList.add('active-lang');
            button.setAttribute('aria-pressed', 'true');
        } else {
            button.classList.remove('active-lang');
            button.setAttribute('aria-pressed', 'false');
        }
    });
    logDebug(`Click events attached and active state set for ${langButtons.length} language buttons.`);
};

window.initializeLanguageSystem = async function() {
    if (window.langSystem.initialized) {
        logDebug("Language system already initialized.");
        return;
    }
    logDebug("Initializing language system...");
    
    const userPreferredLanguage = window.getCurrentLanguage();
    await fetchTranslations(userPreferredLanguage);
    window.applyTranslations();
    window.initializeLanguageButtons(); 
    
    window.langSystem.initialized = true;
    window.langSystem.currentLanguage = userPreferredLanguage;
    logDebug(`Language system initialized with language: ${userPreferredLanguage}.`);
};

window.setLanguage = async (lang) => {
    logDebug(`Setting language to: ${lang}`);
    localStorage.setItem(window.langSystem.languageStorageKey, lang);
    window.langSystem.currentLanguage = lang; 
    await fetchTranslations(lang);
    window.applyTranslations();
    if (window.initializeLanguageButtons) {
        window.initializeLanguageButtons(); 
    }
};
