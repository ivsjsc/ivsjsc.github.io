// Remove any existing declarations
window.languageManager = {
    defaultLanguage: 'vi',
    currentLanguage: localStorage.getItem('language') || 'vi',
    translations: {},
    
    initialize() {
        this.loadTranslations();
        this.setLanguage(this.currentLanguage);
        this.initializeButtons();
    },

    setLanguage(lang) {
        this.currentLanguage = lang;
        localStorage.setItem('language', lang);
        this.updateContent();
    },

    // ... rest of language management code
};