window.translations = {};

const defaultLanguage = 'vi';
const languageStorageKey = 'userPreferredLanguage';

const isDebugMode = false;

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

async function fetchTranslations(lang) {
    logDebug(`Fetching translations for: ${lang}`);
    if (window.translations[lang] && Object.keys(window.translations[lang]).length > 0) {
        logDebug(`Translations for ${lang} already loaded.`);
        return;
    }
    try {
        const response = await fetch(`/lang/${lang}.json`);
        if (!response.ok) {
            throw new Error(`Failed to load translations for ${lang}: ${response.statusText}`);
        }
        window.translations[lang] = await response.json();
        logDebug(`Successfully loaded translations for ${lang}.`);
    } catch (error) {
        console.error(`[LangJS] Error loading translations for ${lang}:`, error);
        if (lang !== defaultLanguage) {
            logWarning(`Falling back to default language: ${defaultLanguage}`);
            await fetchTranslations(defaultLanguage);
        } else {
            console.error("[LangJS] Failed to load default translations!");
        }
    }
}

window.applyTranslations = () => {
    logDebug("Applying translations...");
    const elementsToTranslate = document.querySelectorAll('[data-lang-key]');
    const currentLang = window.getCurrentLanguage();
    const currentTranslations = window.translations[currentLang];
    const defaultTranslations = window.translations[defaultLanguage];

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
    const storedLanguage = localStorage.getItem(languageStorageKey);
    if (storedLanguage) {
        logDebug(`Retrieved language from localStorage: ${storedLanguage}`);
        return storedLanguage;
    } else {
        const browserLanguage = navigator.language || navigator.userLanguage;
        const languageCode = browserLanguage ? browserLanguage.split('-')[0] : defaultLanguage;
        logDebug(`Using browser language: ${languageCode}`);
        return languageCode;
    }
};

const handleLanguageButtonClick = async (event) => {
    const selectedLanguage = event.target.dataset.lang;
    if (!selectedLanguage) {
        logWarning("Clicked language button has no data-lang attribute.");
        return;
    }
    logDebug(`User selected language: ${selectedLanguage}`);
    localStorage.setItem(languageStorageKey, selectedLanguage);
    await fetchTranslations(selectedLanguage);
    window.applyTranslations();

    const langButtons = document.querySelectorAll('.lang-button');
    langButtons.forEach(button => {
        button.classList.remove('active-lang');
    });
    event.target.classList.add('active-lang');
};

window.initializeLanguageButtons = () => {
    logDebug("Initializing language buttons...");
    const langButtons = document.querySelectorAll('.lang-button');

    if (langButtons.length === 0) {
        logWarning("No language buttons (.lang-button) found.");
        return;
    }
    langButtons.forEach(button => {
        button.removeEventListener('click', handleLanguageButtonClick);
        button.addEventListener('click', handleLanguageButtonClick);
    });
    logDebug(`Click events attached to ${langButtons.length} language buttons.`);
};

async function initializeLanguageSystem() {
    if (window.languageInitialized) {
        logDebug("Language system already initialized.");
        return;
    }
    logDebug("Initializing language system...");
    window.languageInitialized = true;

    const userPreferredLanguage = window.getCurrentLanguage();
    await fetchTranslations(userPreferredLanguage);
    window.applyTranslations();

    logDebug(`Language system initialized with language: ${userPreferredLanguage}.`);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeLanguageSystem);
} else {
    initializeLanguageSystem();
}


document.querySelectorAll('#language-toggle-container button').forEach(btn => {
    btn.classList.remove('active-lang');
});
document.getElementById(`lang-${lang}`).classList.add('active-lang');