// Global namespace for the language system
window.langSystem = window.langSystem || {
    translations: {},
    defaultLanguage: 'en', // Default language
    languageStorageKey: 'userPreferredLanguage_v2', // Use a new key if schema changes
    isDebugMode: false, // Set to true for development console logs
    currentLanguage: null,
    initialized: false,
    languageFilesPath: '/lang/' // Configurable path to language JSON files
};

// Debug logging utility
function langLog(message, type = 'log') {
    if (window.langSystem.isDebugMode || type === 'error' || type === 'warn') {
        console[type](`[LangJS] ${message}`);
    }
}

// Fetches translation files
async function fetchTranslations(langCode) {
    langLog(`Fetching translations for: ${langCode}`);
    // Prevent re-fetching if already loaded, unless forceReload is implemented
    if (window.langSystem.translations[langCode] && Object.keys(window.langSystem.translations[langCode]).length > 0) {
        langLog(`Translations for ${langCode} already in memory.`);
        return;
    }
    try {
        // Ensure correct path construction, assuming languageFilesPath is relative to domain root
        const response = await fetch(`${window.langSystem.languageFilesPath}${langCode}.json?v=${new Date().getTime()}`); // Cache busting
        if (!response.ok) {
            throw new Error(`HTTP error ${response.status} loading ${langCode}.json from ${response.url}`);
        }
        window.langSystem.translations[langCode] = await response.json();
        langLog(`Successfully loaded translations for ${langCode}.`);
    } catch (error) {
        console.error(`[LangJS] Error loading translations for ${langCode}:`, error);
        // Fallback to default language if the requested one fails and it's not the default one already
        if (langCode !== window.langSystem.defaultLanguage) {
            langLog(`Falling back to default language: ${window.langSystem.defaultLanguage} due to error with ${langCode}.`, 'warn');
            await fetchTranslations(window.langSystem.defaultLanguage); // Attempt to load default
        } else {
            // If default also fails, this is a critical issue.
            console.error("[LangJS] CRITICAL: Failed to load default language translations! Language functionality will be impaired.");
            // Potentially display a user-facing error or use very basic inline text as ultimate fallback.
        }
    }
}

// Applies translations to elements on the page
window.applyLanguageTranslations = () => {
    const lang = window.langSystem.currentLanguage || window.langSystem.defaultLanguage;
    langLog(`Applying translations for language: ${lang}`);
    
    const elements = document.querySelectorAll('[data-lang-key]');
    const translations = window.langSystem.translations[lang] || window.langSystem.translations[window.langSystem.defaultLanguage] || {};

    if (Object.keys(translations).length === 0) {
        langLog(`No translations available for ${lang} or default. DOM will not be updated.`, 'warn');
        return;
    }

    elements.forEach(el => {
        const key = el.dataset.langKey;
        const translation = translations[key];

        if (typeof translation === 'string') {
            // Handle different ways of setting text based on element type or attributes
            if (el.hasAttribute('data-lang-key-aria')) { // For aria-labels
                 el.setAttribute('aria-label', translation);
            } else if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                if (el.type === 'submit' || el.type === 'button') {
                    el.value = translation;
                } else if (el.placeholder !== undefined && (el.hasAttribute('data-lang-key-placeholder') || !el.value)) { 
                    // Only update placeholder if explicitly targeted or if value is empty
                    el.placeholder = translation;
                } else if (el.hasAttribute('data-lang-key-value')){ // For input values that need translation
                    el.value = translation;
                }
            } else if (el.hasAttribute('data-lang-key-title')) { // For title attributes
                el.title = translation;
            } else {
                // For general elements, attempt to preserve HTML structure inside, e.g., icons
                let firstChildNode = el.firstChild;
                let lastChildNode = el.lastChild;
                let contentNodes = Array.from(el.childNodes).filter(node => node.nodeType === Node.TEXT_NODE || node.nodeName === '#text');

                if (contentNodes.length > 0) {
                    // If there's text content, replace it. This is a simple approach.
                    // For complex HTML inside, a more sophisticated replacement might be needed.
                    let textContentReplaced = false;
                    el.childNodes.forEach(child => {
                        if(child.nodeType === Node.TEXT_NODE && child.textContent.trim() !== ''){
                            child.textContent = translation;
                            textContentReplaced = true;
                        }
                    });
                    if(!textContentReplaced) el.innerHTML = translation; // Fallback if no direct text node found (e.g. empty or only contains other elements)
                } else if(el.childNodes.length === 0 || (el.childNodes.length === 1 && el.firstChild.nodeType !== Node.ELEMENT_NODE)) {
                    // If no significant child elements or only a text node that might be empty, set innerHTML
                     el.innerHTML = translation;
                } else {
                     // If element contains other HTML elements, try to replace only the main text content node
                     // This part might need refinement based on actual HTML structure
                     let textNodeFoundAndReplaced = false;
                     for(let i=0; i < el.childNodes.length; i++){
                         if(el.childNodes[i].nodeType === Node.TEXT_NODE && el.childNodes[i].textContent.trim() !== ''){
                             el.childNodes[i].textContent = translation;
                             textNodeFoundAndReplaced = true;
                             break;
                         }
                     }
                     if(!textNodeFoundAndReplaced) { // Fallback if no suitable text node is found
                        // Check if it's a button with an icon and text
                        const icon = el.querySelector('i.fas, i.fab, i.far, i.fal, i.fa-solid, i.fa-regular, i.fa-light, i.fa-thin, i.fa-duotone');
                        if (icon && (el.lastChild === icon || el.firstChild === icon) && el.textContent.trim().length > 0) {
                             // Get text nodes that are not the icon itself
                             let textToReplace = "";
                             el.childNodes.forEach(node => {
                                 if (node !== icon && node.nodeType === Node.TEXT_NODE) {
                                     textToReplace += node.textContent;
                                 }
                             });
                             if(textToReplace.trim().length > 0){ // Only replace if there was text besides the icon
                                 el.innerHTML = icon.outerHTML + " " + translation;
                             } else {
                                 el.innerHTML = icon.outerHTML + " " + translation; // Case where button only had icon and key
                             }
                        } else {
                             el.textContent = translation; // Default to textContent if innerHTML might break structure
                        }
                     }
                }
            }
        } else {
            // langLog(`Translation key '${key}' not found for lang '${lang}'. Element:`, 'warn');
            // element.textContent = `[${key}]`; // Fallback text for missing keys
        }
    });

    // Update the HTML lang attribute
    document.documentElement.lang = lang;

    // Update displayed current language in UI elements (e.g., buttons)
    const currentLangDesktopEl = document.getElementById('current-lang-desktop');
    if (currentLangDesktopEl) currentLangDesktopEl.textContent = lang.toUpperCase();
    // Add for mobile if exists:
    // const currentLangMobileEl = document.getElementById('current-lang-mobile');
    // if (currentLangMobileEl) currentLangMobileEl.textContent = lang.toUpperCase();

    langLog(`Translations applied for ${lang}.`);
}
window.applyLanguage = window.applyLanguageTranslations; // Alias for backward compatibility


// Sets the current language, stores it, and re-applies translations
window.setLanguage = async (langCode) => {
    if (!window.langSystem.translations[langCode]) { // Check if language JSON is loaded
        langLog(`Translations for ${langCode} not yet loaded. Fetching...`);
        await fetchTranslations(langCode); // Load if not present
    }

    if (!window.langSystem.translations[langCode] && langCode !== window.langSystem.defaultLanguage) {
        langLog(`Failed to load ${langCode}, attempting to set default: ${window.langSystem.defaultLanguage}`, 'warn');
        await window.setLanguage(window.langSystem.defaultLanguage); // Recursive call to set default
        return;
    }
    
    if (!window.langSystem.translations[langCode]) {
        console.error(`[LangJS] CRITICAL: Cannot set language ${langCode} as translations (and default) failed to load.`);
        return; // Critical failure
    }

    localStorage.setItem(window.langSystem.languageStorageKey, langCode);
    window.langSystem.currentLanguage = langCode;
    langLog(`Language set to: ${langCode} and stored.`);
    
    window.applyLanguageTranslations(); // Re-apply all translations
    window.initializeLanguageButtons(); // Update active state of buttons
};

// Initializes language buttons with event listeners and active state
window.initializeLanguageButtons = () => {
    const currentLang = window.langSystem.currentLanguage || window.langSystem.defaultLanguage;
    langLog(`Initializing language buttons. Current active: ${currentLang}`);

    const langOptionButtons = document.querySelectorAll('.lang-option, .lang-option-mobile');
    if (langOptionButtons.length === 0) {
        langLog('No language option buttons found on the page.', 'warn');
        return;
    }

    langOptionButtons.forEach(button => {
        // Remove existing listeners to prevent duplicates if re-initialized
        button.removeEventListener('click', handleLanguageButtonClick); 
        button.addEventListener('click', handleLanguageButtonClick);

        if (button.dataset.lang === currentLang) {
            button.classList.add('active-language-option'); // Define this class in CSS for styling
            button.setAttribute('aria-pressed', 'true');
        } else {
            button.classList.remove('active-language-option');
            button.setAttribute('aria-pressed', 'false');
        }
    });
    langLog(`${langOptionButtons.length} language buttons processed.`);
};

// Event handler for language button clicks
async function handleLanguageButtonClick(event) {
    const button = event.currentTarget;
    const selectedLanguage = button.dataset.lang;
    if (selectedLanguage && selectedLanguage !== window.langSystem.currentLanguage) {
        langLog(`Language button clicked: ${selectedLanguage}`);
        await window.setLanguage(selectedLanguage);
         // Close dropdowns if they are open (example for desktop)
        const desktopDropdown = button.closest('.desktop-dropdown-content');
        if (desktopDropdown && !desktopDropdown.classList.contains('hidden')) {
            const toggleButton = document.getElementById(desktopDropdown.getAttribute('aria-labelledby'));
            desktopDropdown.classList.add('hidden','opacity-0','scale-95', 'fab-hidden-alt'); // Using Tailwind for hidden
            if(toggleButton) toggleButton.setAttribute('aria-expanded', 'false');
        }
        // Similar logic for mobile menu if needed
        const mobileDropdown = button.closest('.mobile-submenu-content');
        if(mobileDropdown && mobileDropdown.style.maxHeight !== '0px'){
            const mobileToggleButton = mobileDropdown.previousElementSibling;
            if(mobileToggleButton && mobileToggleButton.classList.contains('mobile-submenu-toggle')){
                mobileToggleButton.click(); // Simulate click to close
            }
        }

    } else if (!selectedLanguage) {
        langLog('Clicked language button missing data-lang attribute.', 'warn');
    }
}

// Main initialization function for the language system
window.initializeLanguageSystem = async () => {
    if (window.langSystem.initialized) {
        // langLog("Language system already initialized. Re-applying translations and button states.");
        // window.applyLanguageTranslations(); // Re-apply in case DOM changed
        // window.initializeLanguageButtons(); // Re-init buttons
        return;
    }
    langLog("Initializing language system...");

    let storedLang = localStorage.getItem(window.langSystem.languageStorageKey);
    if (storedLang && !window.langSystem.translations[storedLang]) { // If stored lang exists but no translations loaded
        langLog(`Stored language ${storedLang} found, but translations not loaded. Fetching.`);
        await fetchTranslations(storedLang);
    } else if (!storedLang) {
        langLog(`No language stored. Using default: ${window.langSystem.defaultLanguage}`);
    }
    
    window.langSystem.currentLanguage = storedLang && window.langSystem.translations[storedLang] 
                                          ? storedLang 
                                          : window.langSystem.defaultLanguage;
    
    // Ensure default language translations are loaded if not already
    if (!window.langSystem.translations[window.langSystem.defaultLanguage]) {
        await fetchTranslations(window.langSystem.defaultLanguage);
    }
    // If current language is different from default and not loaded, load it
    if (window.langSystem.currentLanguage !== window.langSystem.defaultLanguage && !window.langSystem.translations[window.langSystem.currentLanguage]) {
        await fetchTranslations(window.langSystem.currentLanguage);
         // If after fetching the chosen language it's still not available, fall back to default
        if (!window.langSystem.translations[window.langSystem.currentLanguage]) {
            langLog(`Failed to load preferred language ${window.langSystem.currentLanguage}, falling back to default.`, 'warn');
            window.langSystem.currentLanguage = window.langSystem.defaultLanguage;
        }
    }

    window.applyLanguageTranslations();
    window.initializeLanguageButtons(); // Initialize buttons after translations applied
    
    window.langSystem.initialized = true;
    langLog(`Language system initialized. Current language: ${window.langSystem.currentLanguage}.`);
};

// Alias for backward compatibility or simpler calls
window.updateLanguage = window.setLanguage;

// The call to initializeLanguageSystem() should be made from loadComponents.js
// after the header (which contains language buttons) is loaded and its own JS is initialized.
// This ensures that the language buttons are in the DOM when initializeLanguageButtons() is called.
