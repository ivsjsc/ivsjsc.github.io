'use strict';

window.componentState = window.componentState || {
    componentsLoadedAndInitialized: false,
    headerInitialized: false,
    fabInitialized: false,
    footerInitialized: false,
    headerElement: null,
    isMobileMenuOpen: false,
};

function componentLog(message, type = 'log') {
    const debugMode = true; // Nên đặt là true khi phát triển, false khi deploy
    if (debugMode || type === 'error' || type === 'warn') {
        console[type](`[IVS Components] ${message}`);
    }
}

function isMobileDevice() {
    return window.innerWidth < 768; 
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const context = this;
        const later = () => {
            timeout = null;
            func.apply(context, args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

async function loadComponent(componentName, placeholderId, filePath) {
    componentLog(`Đang tải: ${componentName} từ ${filePath} vào #${placeholderId}`);
    try {
        const response = await fetch(filePath);
        if (!response.ok) throw new Error(`Lỗi HTTP ${response.status} cho ${filePath}`);
        const html = await response.text();
        const placeholder = document.getElementById(placeholderId);
        if (placeholder) {
            placeholder.innerHTML = html;
            componentLog(`${componentName} đã được chèn vào DOM.`);
            return true;
        }
        throw new Error(`Không tìm thấy Placeholder #${placeholderId}.`);
    } catch (error) {
        componentLog(`Lỗi khi tải ${componentName}: ${error.message}`, 'error');
        const placeholder = document.getElementById(placeholderId);
        if (placeholder) placeholder.innerHTML = `<div class="p-3 text-center text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/50 rounded-md">Lỗi tải ${componentName}.</div>`;
        return false;
    }
}

// --- BEGIN PHẦN ĐÃ CÓ TRONG loadComponents.js CỦA BẠN ---
// Giả định các hàm initializeHeaderInternal, loadHeader, initializeFooterInternal đã tồn tại
// và bạn sẽ chèn/thay thế hàm initializeFabButtonsInternal dưới đây vào đúng vị trí.
// Ví dụ:
// function initializeHeaderInternal() { /* ... code của bạn ... */ }
// async function loadHeader() { /* ... code của bạn ... */ }
// function initializeFooterInternal() { /* ... code của bạn ... */ }
// window.initializeHeader = initializeHeaderInternal;
// window.initializeFooter = initializeFooterInternal;
// --- END PHẦN ĐÃ CÓ ---


// HÀM TẠO NỘI DUNG CHO MENU LIÊN HỆ
function populateContactOptions(contactMenuElement) {
    if (!contactMenuElement) {
        componentLog("Phần tử menu liên hệ không tồn tại để điền nội dung.", "warn");
        return;
    }
    // *** BẠN CẦN TÙY CHỈNH CÁC THÔNG TIN LIÊN HỆ THỰC TẾ VÀO ĐÂY ***
    const contacts = [
        { key: "fab_call_hotline", text: "Gọi Hotline", href: "tel:+849xxxxxxxx", icon: "fas fa-phone", color: "text-ivs-accent" },
        { key: "fab_send_email", text: "Gửi Email", href: "mailto:info@ivs.edu.vn", icon: "fas fa-envelope", color: "text-ivs-accent" },
        { key: "fab_chat_zalo", text: "Chat Zalo", href: "https://zalo.me/YOUR_ZALO_OA_ID_OR_NUMBER", icon: "fas fa-comment-dots", color: "text-blue-500" }, // Thay YOUR_ZALO_OA_ID_OR_NUMBER
        { key: "fab_fanpage_fb", text: "Fanpage Facebook", href: "https://www.facebook.com/IVSJSC/", icon: "fab fa-facebook-f", color: "text-blue-600" },
        { key: "fab_contact_page", text: "Trang Liên Hệ", href: "/contact.html", icon: "fas fa-map-marker-alt", color: "text-ivs-accent" }
    ];

    let contactHtml = '';
    contacts.forEach(contact => {
        contactHtml += `
            <a href="${contact.href}" 
               role="menuitem" 
               class="fab-submenu-item group" 
               data-lang-key="${contact.key}"
               ${contact.href.startsWith('http') ? 'target="_blank" rel="noopener noreferrer"' : ''}>
                <i class="${contact.icon} fa-fw ${contact.color} group-hover:${contact.color.replace('-500', '-600').replace('-accent', '-accent-dark')}"></i>
                <span>${contact.text}</span>
            </a>
        `;
    });
    contactMenuElement.innerHTML = contactHtml;

    // Áp dụng bản dịch cho các mục vừa thêm (nếu hệ thống ngôn ngữ đã sẵn sàng)
    if (typeof window.applyTranslations === 'function' && window.langSystem && window.langSystem.initialized) {
        window.applyTranslations(contactMenuElement);
    } else if (typeof window.applyLanguage === 'function' && window.langSystem && window.langSystem.initialized) { // Fallback cho tên hàm cũ
        window.applyLanguage(contactMenuElement);
    }
}

// HÀM TẠO NỘI DUNG CHO MENU CHIA SẺ
function populateShareOptions(shareMenuElement) {
    if (!shareMenuElement) {
        componentLog("Phần tử menu chia sẻ không tồn tại để điền nội dung.", "warn");
        return;
    }

    const currentUrl = encodeURIComponent(window.location.href);
    const pageTitle = encodeURIComponent(document.title);

    const shares = [
        { text: "Facebook", icon: "fab fa-facebook-f", color: "text-blue-600", action: `window.open('https://www.facebook.com/sharer/sharer.php?u=${currentUrl}', '_blank', 'noopener,noreferrer')` },
        { text: "Twitter", icon: "fab fa-twitter", color: "text-sky-500", action: `window.open('https://twitter.com/intent/tweet?url=${currentUrl}&text=${pageTitle}', '_blank', 'noopener,noreferrer')` },
        // { text: "LinkedIn", icon: "fab fa-linkedin-in", color: "text-blue-700", action: `window.open('https://www.linkedin.com/sharing/share-offsite/?url=${currentUrl}', '_blank', 'noopener,noreferrer')` },
        { text: "Sao chép liên kết", icon: "fas fa-link", color: "text-gray-500", action: `navigator.clipboard.writeText(decodeURIComponent('${currentUrl}')).then(() => alert('Đã sao chép liên kết!'), () => alert('Không thể sao chép liên kết.'))` }
    ];

    let shareHtml = '';
    shares.forEach(share => {
        shareHtml += `
            <button role="menuitem" class="fab-submenu-item group w-full" onclick="${share.action}">
                <i class="${share.icon} fa-fw ${share.color} group-hover:${share.color.replace('-500', '-600').replace('-600','-700')}"></i>
                <span>${share.text}</span>
            </button>
        `;
    });
    shareMenuElement.innerHTML = shareHtml;
    // Thường không cần dịch các nút "Facebook", "Twitter", nhưng "Sao chép liên kết" có thể cần data-lang-key nếu muốn
}


function initializeFabButtonsInternal() {
    if (window.componentState.fabInitialized) {
        componentLog('FABs đã được khởi tạo trước đó.', 'warn');
        return;
    }
    componentLog("Đang khởi tạo các nút FAB...");

    const fabContainerHost = document.getElementById('fab-container-placeholder');
    if (!fabContainerHost) {
        componentLog("Placeholder cho FAB (#fab-container-placeholder) không tìm thấy. Bỏ qua.", 'error');
        return; 
    }
    
    const fabContainer = fabContainerHost.querySelector('#fab-container');
    if (!fabContainer) {
        componentLog("#fab-container không tìm thấy bên trong placeholder. Đảm bảo fab-container.html đã được tải vào.", "error");
        return;
    }

    // --- Nút Cuộn Lên Đầu Trang ---
    const scrollToTopFab = fabContainer.querySelector('#scroll-to-top-btn'); 
    if (scrollToTopFab) {
        const fabScrollHandler = debounce(() => {
            const isVisible = window.scrollY > (isMobileDevice() ? 200 : 120);
            scrollToTopFab.classList.toggle('hidden', !isVisible); // Sử dụng class 'hidden' của Tailwind
            scrollToTopFab.classList.toggle('opacity-0', !isVisible);
            scrollToTopFab.classList.toggle('scale-90', !isVisible);
            scrollToTopFab.classList.toggle('pointer-events-none', !isVisible);

            scrollToTopFab.classList.toggle('opacity-100', isVisible);
            scrollToTopFab.classList.toggle('scale-100', isVisible);
            scrollToTopFab.classList.toggle('pointer-events-auto', isVisible);
        }, 100);
        window.addEventListener('scroll', fabScrollHandler, { passive: true });
        fabScrollHandler(); 
        scrollToTopFab.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
        componentLog('Nút cuộn lên đầu trang đã được khởi tạo.');
    } else {
        componentLog('Nút cuộn lên đầu trang (#scroll-to-top-btn) không tìm thấy.', 'warn');
    }

    // --- Các nút FAB có Menu Con ---
    const fabButtonsWithSubmenu = fabContainer.querySelectorAll('button[aria-haspopup="true"]');
    fabButtonsWithSubmenu.forEach(btn => {
        const menuId = btn.getAttribute('aria-controls');
        const menu = fabContainer.querySelector(`#${menuId}`); 
        if (menu) {
            // **QUAN TRỌNG: Điền nội dung cho menu con**
            if (menuId === 'contact-options') {
                populateContactOptions(menu);
                componentLog('Đã điền nội dung cho menu liên hệ.');
            } else if (menuId === 'share-options') {
                populateShareOptions(menu);
                componentLog('Đã điền nội dung cho menu chia sẻ.');
            }

            const openFabMenu = () => {
                menu.classList.remove('hidden');
                requestAnimationFrame(() => { 
                    menu.classList.remove('opacity-0', 'scale-95', 'pointer-events-none');
                    menu.classList.add('opacity-100', 'scale-100', 'pointer-events-auto');
                });
                btn.setAttribute('aria-expanded', 'true');
                componentLog(`Menu FAB '${menuId}' đã mở.`);
            };

            const closeFabMenu = () => {
                menu.classList.remove('opacity-100', 'scale-100', 'pointer-events-auto');
                menu.classList.add('opacity-0', 'scale-95', 'pointer-events-none');
                // Sử dụng transitionend để thêm class 'hidden' sau khi hiệu ứng hoàn tất
                menu.addEventListener('transitionend', function handler() {
                    if (menu.classList.contains('opacity-0')) { // Chỉ thêm hidden nếu nó thực sự đã bị ẩn
                        menu.classList.add('hidden');
                    }
                    menu.removeEventListener('transitionend', handler);
                }, { once: true });
                btn.setAttribute('aria-expanded', 'false');
                componentLog(`Menu FAB '${menuId}' đã đóng.`);
            };
            
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const isCurrentlyOpen = btn.getAttribute('aria-expanded') === 'true';
                
                // Đóng tất cả các menu con khác
                fabButtonsWithSubmenu.forEach(otherBtn => {
                    if (otherBtn !== btn) {
                        const otherMenuId = otherBtn.getAttribute('aria-controls');
                        const otherMenu = fabContainer.querySelector(`#${otherMenuId}`);
                        if (otherMenu && otherBtn.getAttribute('aria-expanded') === 'true') {
                            otherMenu.classList.remove('opacity-100', 'scale-100', 'pointer-events-auto');
                            otherMenu.classList.add('opacity-0', 'scale-95', 'pointer-events-none');
                            otherMenu.addEventListener('transitionend', function handler() {
                                if (otherMenu.classList.contains('opacity-0')) {
                                    otherMenu.classList.add('hidden');
                                }
                                otherMenu.removeEventListener('transitionend', handler);
                            }, { once: true });
                            otherBtn.setAttribute('aria-expanded', 'false');
                        }
                    }
                });

                if(isCurrentlyOpen) {
                    closeFabMenu();
                } else {
                    openFabMenu();
                }
            });
            
            btn.addEventListener('keydown', (e) => { 
                if (e.key === 'Escape' && btn.getAttribute('aria-expanded') === 'true') {
                    closeFabMenu();
                    btn.focus(); // Trả focus về nút chính
                }
            });
        } else {
            componentLog(`Không tìm thấy menu con #${menuId} cho nút FAB.`, 'warn');
        }
    });
     
    // Đóng tất cả menu FAB khi click ra ngoài #fab-container
    document.addEventListener('click', (e) => { 
        if (!fabContainer.contains(e.target)) { // Nếu click ra ngoài #fab-container
            fabButtonsWithSubmenu.forEach(btn => {
                 const menuId = btn.getAttribute('aria-controls');
                 const menu = fabContainer.querySelector(`#${menuId}`);
                 if (menu && btn.getAttribute('aria-expanded') === 'true') { // Chỉ đóng nếu đang mở
                    menu.classList.remove('opacity-100', 'scale-100', 'pointer-events-auto');
                    menu.classList.add('opacity-0', 'scale-95', 'pointer-events-none');
                    menu.addEventListener('transitionend', function handler() {
                        if (menu.classList.contains('opacity-0')) {
                            menu.classList.add('hidden');
                        }
                        menu.removeEventListener('transitionend', handler);
                    }, { once: true });
                    btn.setAttribute('aria-expanded', 'false');
                 }
            });
        }
    });

    window.componentState.fabInitialized = true;
    componentLog("Các nút FAB đã được khởi tạo với nội dung.");
}
window.initializeFabButtons = initializeFabButtonsInternal; // Đảm bảo gán vào window

// --- PHẦN CUỐI CỦA loadComponents.js ---
async function loadCommonComponents() {
    if (window.componentState.componentsLoadedAndInitialized) {
        componentLog('Các thành phần chung đã được tải và khởi tạo trước đó.', 'info');
        return;
    }
    componentLog('Bắt đầu chuỗi tải các thành phần chung...');
    
    // 1. Tải Header, sau đó khởi tạo Header
    const headerLoaded = await loadHeader(); // loadHeader sẽ tự gọi initializeHeaderInternal

    // 2. Khởi tạo hệ thống ngôn ngữ SAU KHI Header (chứa nút ngôn ngữ) đã được tải và khởi tạo
    if(headerLoaded && window.componentState.headerInitialized) {
        if (typeof window.initializeLanguageSystem === 'function') {
            try {
                await window.initializeLanguageSystem(); 
                componentLog('Hệ thống ngôn ngữ đã được khởi tạo sau header.');
            } catch (langError) { componentLog(`Lỗi khởi tạo hệ thống ngôn ngữ: ${langError.message}`, 'error'); }
        } else { 
            componentLog('Hàm initializeLanguageSystem không tồn tại. Sẽ thử fallback applyLanguage.', 'warn');
            if (typeof window.applyTranslations === 'function') { // Fallback cho tên hàm applyLanguage cũ hơn
                try { window.applyTranslations(document.documentElement); } catch(e) { componentLog('Lỗi khi gọi applyTranslations fallback.', 'error');}
            } else if (typeof window.applyLanguage === 'function') {
                try { window.applyLanguage(document.documentElement); } catch(e) { componentLog('Lỗi khi gọi applyLanguage fallback.', 'error');}
            }
             else {
                 componentLog('Cả initializeLanguageSystem và applyTranslations/applyLanguage đều không tồn tại. Dịch thuật có thể không hoạt động.', 'error');
            }
        }
    } else {
        componentLog('Header không tải hoặc khởi tạo thành công. Hệ thống ngôn ngữ có thể không hoạt động đúng.', 'error');
        if (typeof window.initializeLanguageSystem === 'function') {
            try { await window.initializeLanguageSystem(); } catch (e) { componentLog('Lỗi khởi tạo ngôn ngữ (fallback khi header lỗi): '+e.message, 'error'); }
        }
    }

    // 3. Tải Footer và khởi tạo Footer
    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (footerPlaceholder) {
        const footerLoaded = await loadComponent('Footer', 'footer-placeholder', '/components/footer.html');
        if (footerLoaded && typeof initializeFooterInternal === 'function') initializeFooterInternal();
    } else { componentLog('Placeholder cho Footer không tìm thấy.', 'info'); }
    
    // 4. Tải FAB container và khởi tạo FABs
    const fabPlaceholder = document.getElementById('fab-container-placeholder');
    if (fabPlaceholder) {
        const fabLoaded = await loadComponent('FABs', 'fab-container-placeholder', '/components/fab-container.html');
        if (fabLoaded) {
            initializeFabButtonsInternal(); 
        } else {
            componentLog('Không thể tải fab-container.html, FABs sẽ không được khởi tạo.', 'error');
        }
    } else { componentLog('Placeholder cho FAB không tìm thấy.', 'info'); }
    
    window.componentState.componentsLoadedAndInitialized = true;
    componentLog('Chuỗi tải các thành phần chung đã hoàn tất.');

    if (typeof window.onPageComponentsLoadedCallback === 'function') { 
        componentLog('Đang gọi onPageComponentsLoadedCallback của trang...');
        try {
            await window.onPageComponentsLoadedCallback(); 
        } catch(pageCallbackError) {
            componentLog(`Lỗi trong onPageComponentsLoadedCallback: ${pageCallbackError.message}`, 'error');
        }
    } else {
         componentLog('Không tìm thấy onPageComponentsLoadedCallback của trang.', 'info');
    }
}

// Đảm bảo loadCommonComponents được gọi sau khi DOM sẵn sàng
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadCommonComponents);
} else {
    if (!window.componentState.componentsLoadedAndInitialized) { 
        loadCommonComponents();
    }
}
