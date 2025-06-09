import QuickCTX from '../src/QuickCTX.js';

document.addEventListener('DOMContentLoaded', () => {
    const logArea = document.getElementById('logArea');
    const testBoxes = document.querySelectorAll('.test-box');

    function log(message, data = null) {
        const timestamp = new Date().toLocaleTimeString();
        let logMessage = `[${timestamp}] ${message}`;
        if (data) {
            logMessage += `\n${JSON.stringify(data, null, 2)}`;
        }
        logArea.textContent = logMessage + '\n\n' + logArea.textContent;
    }

    log("Page loaded. Initializing QuickCTX...");

    try {
        
        const ctxManager = new QuickCTX({
            trigger: 'contextmenu', 
            globalFilterStrategy: 'disable', 
            animations: {
                menuOpenDuration: 250 
            }
        });

        
        log("QuickCTX instance successfully created.", {
            options: ctxManager.options
        });


    } catch (error) {
        log("Error while initializing QuickCTX:", {
            name: error.name,
            message: error.message,
            stack: error.stack.split('\n').slice(0, 3).join('\n')
        });
    }

});
