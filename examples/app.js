import QuickCTX from '../src/classes/QuickCTX.js';
import MenuCommand from '../src/classes/MenuCommand.js';

document.addEventListener('DOMContentLoaded', () => {
    const logArea = document.getElementById('logArea');
    const testBoxes = document.querySelectorAll('.test-box');

    function log(logContent) {
        const timestamp = logContent.timestamp?.toLocaleTimeString() || new Date().toLocaleTimeString();

        let errorAlert = logContent.isError ? '⚠️ ' : '';
        let logMessage = errorAlert + `[${timestamp}] ${logContent.event ? `[${logContent.event}] ` : ''}${logContent.message || logContent}`;

        if (logContent.data) {
            logMessage += `\n${JSON.stringify(logContent.data, null, 2)}`;
        }

        logArea.textContent = logMessage + '\n\n' + logArea.textContent;
    }

    log({message: "Page loaded. Initializing QuickCTX..."});

    try {
        
        const ctxManager = new QuickCTX({
            trigger: 'contextmenu', 
            globalFilterStrategy: 'disable', 
        });

        ctxManager.setLogger(log);
        ctxManager.setLoggerIsEnabled(true);

        const openAction = (event) => {
            log(`Action 'Open' executed on element with ID: ${event.target.dataset.id}`);
        };
        const editAction = (event) => {
            log(`Action 'Edit' executed on element with ID: ${event.target.dataset.id}`);
        };
        const deleteAction = (event) => {
            log(`Action 'Delete' executed on element with ID: ${event.target.dataset.id}`);
        };
        // Nuove azioni per i nuovi menu
        const applyFilterAction = (event) => {
             log(`Action 'Apply Filter' executed on element with ID: ${event.target.dataset.id}`);
        };
        const shareEmailAction = (event) => {
             log(`Action 'Share via Email' executed on element with ID: ${event.target.dataset.id}`);
        };
        const viewProfileAction = (event) => {
             log(`Action 'View Profile' (from hover) on element with ID: ${event.target.dataset.id}`);
        };

        // --- MENU 1
        ctxManager.createAndBindMenu({
            menuId: 'documentMenu',
            selector: '[data-type="document"]', 
            defaultTargetType: 'document',     
            headerText: 'Document Actions', 
            structure: [
                { label: "Open", action: openAction },
                { label: "Edit", action: editAction },
                MenuCommand.Separator(), 
                { label: "Delete", action: deleteAction }
            ]
        });

        // --- MENU 2
        ctxManager.createAndBindMenu({
            menuId: 'imageMenu',
            selector: '[data-type="image"]',
            defaultTargetType: 'image',
            headerText: 'Image Actions',
            structure: [
                { label: "Edit Image", action: editAction },
                { label: "Apply Filter", action: applyFilterAction },
                MenuCommand.Separator("Sharing Options"), // separator with custom content
                {
                    label: "Share",
                    // to create a submenu, we use a subCommands array
                    subCommands: [
                        { label: "Share via Email", action: shareEmailAction },
                        { label: "Copy Link", action: (e) => log('Link copied!') }
                    ]
                }
            ]
        });

        // --- MENU 3
        ctxManager.createAndBindMenu({
            menuId: 'userMenu',
            selector: '[data-type="user"]',
            defaultTargetType: 'user',
            headerText: 'User Actions',
            triggerEvent: 'hover',
            structure: [
                { label: "View Profile", action: viewProfileAction },
                { label: "Send Message", action: (e) => log('Message sent!')}
            ]
        });



    } catch (error) {
        log({message: "Error while initializing QuickCTX:", isError: true, data: {
            name: error.name,
            message: error.message,
            stack: error.stack.split('\n').slice(0, 3).join('\n')
        }});
    }
});
