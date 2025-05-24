async function loadComponent(placeholderId, filePath) {
    try {
        const response = await fetch(filePath);
        if (!response.ok) {
            throw new Error(`Failed to load component from ${filePath}: ${response.statusText}`);
        }
        const html = await response.text();
        const placeholder = document.getElementById(placeholderId);
        if (placeholder) {
            placeholder.innerHTML = html;
        } else {
             console.error(`[Script] Placeholder element with id '${placeholderId}' not found.`);
        }

        if (placeholderId === 'header-placeholder') {
            await initializeHeader();
        }
        if (placeholderId === 'footer-placeholder') {
            initializeFooter();
        }

    } catch (error) {
        console.error(`[Script] Error loading component from ${filePath}:`, error);
        const placeholder = document.getElementById(placeholderId);
        if (placeholder) {
            placeholder.innerHTML = `<p style="color: red;">Error loading component: ${error.message || error}</p>`;
        }
    }
}

async function loadComponentsAndInitialize() {
    const HEADER_COMPONENT_URL = '/components/header.html';
    const FOOTER_COMPONENT_URL = '/components/footer.html';

    await loadComponent('header-placeholder', "/components/header.html");
    await loadComponent('footer-placeholder', "/components/footer.html");
}

if (typeof window !== 'undefined') {
    window.loadComponentsAndInitialize = loadComponentsAndInitialize;
}
