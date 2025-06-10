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
            log(`Action 'Open' executed on element with ID: ${event.target.id}`);
        };

        const editAction = (event) => {
            log(`Action 'Edit' executed on element with ID: ${event.target.id}`);
        };

        const deleteAction = (event) => {
            log(`Action 'Delete' executed on element with ID: ${event.target.id}`);
        };

        ctxManager.createAndBindMenu({
            menuId: 'testMenu',
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


    } catch (error) {
        log({message: "Error while initializing QuickCTX:", isError: true, data: {
            name: error.name,
            message: error.message,
            stack: error.stack.split('\n').slice(0, 3).join('\n')
        }});
    }
});
