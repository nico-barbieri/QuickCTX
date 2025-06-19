import MenuCommand from './classes/MenuCommand.js';
import QuickCTX from './classes/QuickCTX.js';

// export the main components. For UMD, these will be `window.QuickCTX.QuickCTX` and `window.QuickCTX.MenuCommand`, for ESM they will be imported directly.
export { QuickCTX, MenuCommand };

// for UMD builds, attach the components to the global window object
if (typeof window !== 'undefined') {
    if (!window.QuickCTX) {
        window.QuickCTX = {};
    }
    window.QuickCTX.QuickCTX = QuickCTX;
    window.QuickCTX.MenuCommand = MenuCommand;
}
