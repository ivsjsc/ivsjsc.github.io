// ...existing code...

// Language System Initialization
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
    logDebug(`Attempting to load translations for: ${lang}`);
    try {
        const response = await fetch(`/languages/${lang}.json`);
        if (!response.ok) {
            logWarning(`Could not load translations for ${lang}. Status: ${response.status}.`);
            if (lang !== defaultLanguage) {
                logWarning(`Falling back to default language: ${defaultLanguage}`);
                return fetchTranslations(defaultLanguage);
            }
            throw new Error(`Failed to load default language file: ${defaultLanguage}.json`);
        }
        window.translations[lang] = await response.json();
        logDebug(`Successfully loaded translations for: ${lang}`);
    } catch (error) {
        console.error(`Error fetching translations for ${lang}:`, error);
        if (!window.translations[defaultLanguage] && lang !== defaultLanguage) {
            await fetchTranslations(defaultLanguage);
        } else if (!window.translations[lang]) {
            window.translations[lang] = {};
        }
    }
}

window.applyTranslations = function(lang) {
    logDebug(`Applying translations for language: ${lang}`);
    if (!window.translations || !window.translations[lang]) {
        logWarning(`No translations loaded for "${lang}". Make sure fetchTranslations was called and successful.`);
        if (lang !== defaultLanguage && (!window.translations || !window.translations[defaultLanguage])) {
            console.warn(`[LangJS] Translations for ${lang} not found, and default not loaded. Attempting to load default.`);
            fetchTranslations(defaultLanguage).then(() => {
                if (window.translations[defaultLanguage]) {
                    applyTranslations(defaultLanguage);
                }
            });
            return;
        } else if (lang !== defaultLanguage && window.translations && window.translations[defaultLanguage]) {
            logWarning(`[LangJS] Using default translations as fallback for ${lang}.`);
            lang = defaultLanguage;
        } else if (lang === defaultLanguage && (!window.translations || !window.translations[defaultLanguage])) {
            console.error(`[LangJS] CRITICAL: Default translations for ${defaultLanguage} are not loaded. Cannot translate.`);
            return;
        }
    }

    const currentTranslations = window.translations[lang] || window.translations[defaultLanguage] || {};
    let elementsTranslated = 0;

    document.querySelectorAll('[data-lang-key]').forEach(element => {
        const key = element.getAttribute('data-lang-key');
        if (currentTranslations[key] !== undefined) {
            if (element.tagName === 'TITLE') {
                element.textContent = currentTranslations[key];
            } else {
                element.innerHTML = currentTranslations[key];
            }
            elementsTranslated++;
        } else {
            logWarning(`Translation key "${key}" not found for language "${lang}". Element content: "${element.textContent.trim().substring(0,30)}..."`);
        }
    });

    const attributesToTranslate = ['placeholder', 'alt', 'title', 'aria-label'];
    attributesToTranslate.forEach(attr => {
        document.querySelectorAll(`[data-lang-key-${attr}]`).forEach(element => {
            const key = element.getAttribute(`data-lang-key-${attr}`);
            if (currentTranslations[key] !== undefined) {
                element.setAttribute(attr, currentTranslations[key]);
            } else {
                logWarning(`Translation key for attribute ${attr}="${key}" not found for lang "${lang}".`);
            }
        });
    });

    const metaDescriptionTag = document.querySelector('meta[name="description"]');
    if (metaDescriptionTag) {
        const key = metaDescriptionTag.getAttribute('data-lang-key') || 'meta_description_default';
        if (currentTranslations[key]) metaDescriptionTag.setAttribute('content', currentTranslations[key]);
    }
    const ogTitleTag = document.querySelector('meta[property="og:title"]');
    if (ogTitleTag) {
        const key = ogTitleTag.getAttribute('data-lang-key') || 'og_title_default';
        if (currentTranslations[key]) ogTitleTag.setAttribute('content', currentTranslations[key]);
    }
    const ogDescriptionTag = document.querySelector('meta[property="og:description"]');
    if (ogDescriptionTag) {
        const key = ogDescriptionTag.getAttribute('data-lang-key') || 'og_description_default';
        if (currentTranslations[key]) ogDescriptionTag.setAttribute('content', currentTranslations[key]);
    }

    document.documentElement.lang = lang;
    logDebug(`Translations applied. Elements updated: ${elementsTranslated}. HTML lang set to: ${lang}`);

    if (typeof window.updateLanguageSwitcherUI === 'function') {
        window.updateLanguageSwitcherUI(lang);
    }

    if (document.getElementById('news-container') && typeof window.loadInternalNews === 'function') {
        logDebug("News container found, reloading internal news.");
        window.loadInternalNews();
    }
}

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
}

window.setLanguage = async function(lang) {
    logDebug(`Setting language to: ${lang}`);
    const supportedLanguages = ['vi', 'en'];
    if (!supportedLanguages.includes(lang)) {
        logWarning(`Unsupported language "${lang}". Defaulting to "${defaultLanguage}".`);
        lang = defaultLanguage;
    }

    localStorage.setItem(languageStorageKey, lang);
    logDebug(`Language "${lang}" saved to localStorage.`);

    if (!window.translations || !window.translations[lang]) {
        await fetchTranslations(lang);
    }

    window.applyTranslations(lang);
}

window.updateLanguageSwitcherUI = function(currentLang) {
    logDebug(`Updating language switcher UI for lang: ${currentLang}`);
    const flagPath = `/images/flags/${currentLang}.svg`;

    const desktopFlag = document.getElementById('desktop-current-lang-flag');
    const desktopText = document.getElementById('desktop-current-lang-text');
    if (desktopFlag) desktopFlag.src = flagPath;
    if (desktopText) desktopText.textContent = currentLang.toUpperCase();

    document.querySelectorAll('#desktop-lang-options .lang-button').forEach(btn => {
        btn.classList.toggle('bg-gray-200', btn.getAttribute('data-lang') === currentLang);
        btn.classList.toggle('font-semibold', btn.getAttribute('data-lang') === currentLang);
    });

    const mobileFlag = document.getElementById('mobile-current-lang-flag');
    const mobileText = document.getElementById('mobile-current-lang-text');
    if (mobileFlag) mobileFlag.src = flagPath;
    if (mobileText) mobileText.textContent = currentLang.toUpperCase();

    document.querySelectorAll('#mobile-lang-options .lang-button').forEach(btn => {
        btn.classList.toggle('bg-gray-200', btn.getAttribute('data-lang') === currentLang);
        btn.classList.toggle('font-semibold', btn.getAttribute('data-lang') === currentLang);
    });
}

window.attachLanguageSwitcherEvents = function() {
    logDebug("Attempting to attach language switcher event listeners...");
    const langButtons = document.querySelectorAll('.lang-button');

    if (langButtons.length === 0) {
        logWarning("No language buttons found to attach events to. Ensure header is loaded and buttons have 'lang-button' class.");
        return;
    }

    langButtons.forEach(button => {
        button.removeEventListener('click', handleLangButtonClick);
        button.addEventListener('click', handleLangButtonClick);
    });
    logDebug(`Attached click listeners to ${langButtons.length} language buttons.`);
}

function handleLangButtonClick(event) {
    const lang = event.currentTarget.getAttribute('data-lang');
    if (lang) {
        logDebug(`Language button clicked. Selected lang: ${lang}`);
        window.setLanguage(lang);
        const desktopDropdown = document.getElementById('desktop-language-dropdown');
        if (desktopDropdown && desktopDropdown.classList.contains('open')) {
            desktopDropdown.querySelector('#desktop-lang-toggle')?.click();
        }
        const mobileDropdown = document.getElementById('mobile-language-dropdown');
        if (mobileDropdown && mobileDropdown.classList.contains('open')) {
            mobileDropdown.querySelector('#mobile-lang-toggle')?.click();
        }
    } else {
        logWarning("Language button clicked, but 'data-lang' attribute is missing.");
    }
}

async function initializeLanguageSystem() {
    logDebug("Initializing language system...");
    const currentLang = window.getCurrentLanguage();
    await fetchTranslations(currentLang);
    window.applyTranslations(currentLang);
    window.languageInitialized = true;
    logDebug(`Language system initialized with language: ${currentLang}`);
}

document.addEventListener('DOMContentLoaded', () => {
    if (!window.languageInitialized) {
        initializeLanguageSystem();
    }
});