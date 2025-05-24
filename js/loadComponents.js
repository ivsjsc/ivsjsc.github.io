async function loadComponent(placeholderId, filePath) {
    try {
        const response = await fetch(filePath);
        if (!response.ok) {
            throw new Error(`Failed to load component from ${filePath}: ${response.statusText}`);
        }
        const html = await response.text();
        document.getElementById(placeholderId).innerHTML = html;
    } catch (error) {
        console.error(error);
        document.getElementById(placeholderId).innerHTML = `<p style="color: red;">Error loading ${filePath}: ${error.message}</p>`;
    }
}

async function loadComponentsAndInitialize(callback) {
    await loadComponent('header-placeholder', '/components/header.html');
    await loadComponent('footer-placeholder', '/components/footer.html');
    if (callback && typeof callback === 'function') {
        callback();
    }
}

if (typeof window !== 'undefined') {
    window.loadComponentsAndInitialize = loadComponentsAndInitialize;
}
