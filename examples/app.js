import QuickCTX from '../src/classes/QuickCTX.js';
import MenuCommand from '../src/classes/MenuCommand.js';

document.addEventListener('DOMContentLoaded', () => {

    const themeToggleButton = document.getElementById('themeToggleButton');
    const bodyElement = document.body;

    // Function to apply the theme
    const applyTheme = (theme) => {
        if (theme === 'dark') {
            bodyElement.classList.add('dark-theme');
        } else {
            bodyElement.classList.remove('dark-theme');
        }
        localStorage.setItem('quickctx-theme-preference', theme);
    };

    // Add click event to the toggle button
    themeToggleButton.addEventListener('click', () => {
        const isDarkMode = bodyElement.classList.contains('dark-theme');
        applyTheme(isDarkMode ? 'light' : 'dark');
    });

    // Check for saved theme in localStorage or user's system preference on load
    const savedTheme = localStorage.getItem('quickctx-theme-preference');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
        applyTheme(savedTheme);
    } else {
        applyTheme(prefersDark ? 'dark' : 'light');
    }


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
            classes: {
                container: 'quickctx-container ctxstyle-override'
            },
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

        const propertyAction = (event) => {
            log(`Action 'Property' executed on element with ID: ${event.target.dataset.id}`);
        };
        // Nuove azioni per i nuovi menu
        const saveImageAction = (event) => {
             log(`Action 'Save' executed on element with ID: ${event.target.dataset.id}`);
        };
        const shareEmailAction = (event) => {
             log(`Action 'Share via Email' executed on element with ID: ${event.target.dataset.id}`);
        };
        const viewProfileAction = (event) => {
             log(`Action 'View Profile' (from hover) on element with ID: ${event.target.dataset.id}`);
        };

        // --- MENU 1

        const commonCommands = [
            MenuCommand.Separator("Common Actions"),
            { label: "Properties", action: propertyAction, iconClass: 'fa solid fa-info-circle' }
        ]

        ctxManager.createAndBindMenu({
            menuId: 'documentMenu',
            selector: '[data-type="document"]', 
            defaultTargetType: 'document',     
            headerText: 'Document Actions', 
            structure: [
                { label: "Open", action: openAction },
                { label: "Edit", action: editAction },
                { label: "Delete", action: deleteAction },
                ...commonCommands
            ]
        });

        // --- MENU 2
        ctxManager.createAndBindMenu({
            menuId: 'imageMenu',
            selector: '[data-type="image"]',
            defaultTargetType: 'image',
            headerText: null /* 'Image Actions' */,
            triggerEvent: 'click',
            structure: [
                { label: "Edit Image", action: editAction, iconClass: 'fa solid fa-edit' },
                { label: "Save Image", action: saveImageAction, iconClass: 'fa solid fa-download' },
                MenuCommand.Separator("Sharing Options"), // separator with custom content
                {
                    label: "Share",
                    type: 'sublist',
                    subCommands: [
                        { label: "Share via Email", action: shareEmailAction },
                        { label: "Copy Link", action: (e) => log('Link copied!') }
                    ]
                },
                ...commonCommands
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
                { label: "Send Message", action: (e) => log('Message sent!')},
                ...commonCommands
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
