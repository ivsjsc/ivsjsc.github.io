window.componentManager = {
    loaded: false,
    
    async initialize() {
        if (this.loaded) return;
        
        try {
            await this.loadHeader();
            await this.loadFooter();
            this.loaded = true;
            this.initializeComponents();
        } catch (error) {
            console.error('Error loading components:', error);
        }
    },

    async loadHeader() {
        const response = await fetch('/components/header.html');
        const html = await response.text();
        document.getElementById('header-container').innerHTML = html;
    },

    initializeComponents() {
        if (window.initializeHeader) {
            window.initializeHeader();
        }
        if (window.languageManager) {
            window.languageManager.initialize();
        }
    }
};

// Only declare once
if (!window.componentsLoadedAndInitialized) {
    window.componentsLoadedAndInitialized = true;
    document.addEventListener('DOMContentLoaded', () => {
        window.componentManager.initialize();
    });
}