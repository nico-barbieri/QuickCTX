import { createElement } from "../utils/utils.js";
import MenuCommand from "./MenuCommand.js";

// QuickCTX input definitions

/**
 * Configurable CSS classes for the context menu elements.
 * @typedef {object} QuickCTXClassesOptions
 * @property {string|string[]} [container='quickctx-container'] - CSS class for the main menu container.
 * @property {string|string[]} [header='quickctx-header'] - CSS class for the menu header.
 * @property {string|string[]} [list='quickctx-list'] - CSS class for the <ul> list of commands.
 * @property {string|string[]} [item='quickctx-item'] - CSS class for menu <li> elements (commands).
 * @property {string|string[]} [separator='quickctx-separator'] - CSS class for separators.
 * @property {string|string[]} [sublist='quickctx-sublist'] - CSS class for <li> items that open submenus.
 * @property {string|string[]} [sublistCommand='quickctx-sublist-command'] - CSS class for <li> items that open submenus.
 * @property {string|string[]} [disabled='quickctx-item--disabled'] - CSS class for disabled items.
 * @property {string|string[]} [hidden='quickctx-item--hidden'] - CSS class for hidden items.
 * @property {string|string[]} [icon='quickctx-icon'] - Icons class.
 * @property {string|string[]} [opening='quickctx--opening'] - Class added during the opening animation.
 * @property {string|string[]} [open='quickctx--open'] - Class added when the menu is fully open.
 * @property {string|string[]} [closing='quickctx--closing'] - Class added during the closing animation.
 */

/**
 * Configurable animation options for the context menu.
 * @typedef {object} QuickCTXAnimationsOptions
 * @property {number} [submenuOpenDelay=150] - Delay in ms for opening submenus on hover.
 * @property {number} [menuOpenDuration=200] - Duration in ms of the main menu opening animation.
 * @property {number} [menuCloseDuration=200] - Duration in ms of the main menu closing animation.
 * @property {number} [hoverMenuOpenDelay=300] - Delay in ms before opening a hover-triggered menu.
 * @property {number} [hoverMenuCloseDelay=300] - Delay in ms before closing a hover-triggered menu.
 * @property {number} [submenuCloseDelay=200] - Delay in ms before closing submenus after mouse leave.
 * @property {number} [holdDuration=500] - Duration in ms for a 'hold' gesture on touch devices.
 */

/**
 * Configuration options for the QuickCTX context menu.
 * @typedef {object} QuickCTXOptions
 * @property {'contextmenu' | 'click' | 'dblclick' | 'hover'} [defaultTrigger='contextmenu'] - The default trigger event for all menus ('contextmenu', 'click', 'dblclick', 'hover').
 * @property {'click' | 'mouseout' | 'auto'} [defaultCloseTrigger='auto'] - The default close behavior.
 * 'click' closes on an outside click, 'mouseout' closes on mouse leave,
 * and 'auto' uses 'mouseout' for hover-triggered menus and 'click' for all others.
 * @property {'tap' | 'hold'} [defaultMobileTrigger='tap'] - The default trigger for touch devices ('tap', 'hold').
 * @property {'closest' | 'deepest'} [overlapStrategy='closest'] - Strategy for finding the target element when multiple are nested.
 * @property {'hide' | 'disable'} [globalFilterStrategy='hide'] - Global filter strategy for irrelevant commands.
 * @property {string} [submenuArrow] -  Optional string containing the raw SVG markup for the submenu arrow icon.
 * If omitted, a default chevron icon will be used.
 * @example
 * const myArrow = `<svg viewBox="0 0 24 24"><path d="M5 3l3.057-3 11.943 12-11.943 12-3.057-3 9-9z"/></svg>`;
 * const ctx = new QuickCTX({ submenuArrow: myArrow });
 * @property {Boolean} [ignoreLinks = true] - If true, menus will not be triggered by events originating from `<a>` tags or elements with an `href` attribute.
 * @property {boolean} [ignoreButtons=true] - If true, menus will not be triggered by events originating from `<button>` or `<input>` elements of type button/submit/reset.
 * @property {QuickCTXClassesOptions} [classes] - Object containing customizable CSS classes.
 * @property {QuickCTXAnimationsOptions} [animations] - Object containing options for animations.
 */

// Main params definitions

/**
 * Defines the structure of a single item used in the `createAndBindMenu` helper.
 * @typedef {object} MenuItemDefinition
 * @property {string} label - The visible text of the menu item.
 * @property {Function|string} [action] - The function to execute or the name of a registered action. Required for 'action' type commands.
 * @property {string} [iconClass] - Optional CSS class for an icon (e.g., from Font Awesome).
 * @property {string[]} [targetTypes] - Optional array of target types. Overrides the default type set for the menu.
 * @property {MenuItemDefinition[]} [subCommands] - An array of nested menu item definitions to create a submenu.
 */

/**
 * Defines the configuration object for the `createAndBindMenu` helper method.
 * @typedef {object} MenuCreationOptions
 * @property {string} menuId - The unique ID for this menu. This ID is used to link the menu to HTML elements via the `data-custom-ctxmenu` attribute.
 * @property {string} [defaultTargetType = "*"] - A default 'type' or category to apply to all commands in this menu. This can be overridden by individual commands. It's used for filtering.
 * @property {string|HTMLElement|HTMLElement[]} [selector] - An optional CSS selector, a single HTML element, or an array of elements to bind this menu to automatically.
 * @property {Array<MenuItemDefinition|MenuCommand>} structure - The array that defines the menu's structure and items.
 * @property {string} [headerText] - Optional text for the menu's header. If header is missing or empty, header will not be displayed.
 * @property {'contextmenu' | 'click' | 'dblclick' | 'hover'} [triggerEvent] - Optional specific trigger event for this menu, overriding the global default.
 * @property {'tap' | 'hold'} [mobileTriggerEvent] - Optional specific trigger for this menu on touch devices ('tap', 'hold'), overriding the global mobile default.
 * @property {'contextmenu' | 'mouseout'} [closeTriggerEvent] - Optional close behavior for this menu ('click', 'mouseout'), overriding the default.
 * @property {'hide' | 'disable'} [filterStrategy] - Overrides the global filter strategy for this menu.
 * @property {string} [additionalClasses] - Space-separated list of additional classes to add to this menu.
 * @property {boolean} [ignoreLinks] - Overrides the global `ignoreLinks` setting for this menu. Can be set to `false` to enable menus on links for this instance only.
 * @property {boolean} [ignoreButtons] - Overrides the global `ignoreButtons` setting for this menu.
 */

/**
 * @typedef {object} ContextMenuConfigOptions
 * @property {string} id - The unique ID for this menu configuration, used to link it to HTML elements.
 * @property {string} [headerTextTemplate=""] - A template for the menu's header text. If header is missing or empty, header will not be displayed. Use `{type}` to insert the target type dynamically (ex. "Element: {type}").
 * @property {Array<object|MenuCommand>} commands - An array of MenuCommand instances or configuration objects that define the menu's items.
 * @property {'contextmenu' | 'click' | 'dblclick' | 'hover'} [triggerEvent] - Overrides the default trigger for this specific menu.
 * @property {'tap' | 'hold'} [mobileTriggerEvent] - Optional specific trigger for this menu on touch devices ('tap', 'hold'), overriding the global mobile default.
 * @property {'click' | 'mouseout'} [closeTriggerEvent] - Optional close behavior for this menu ('click', 'mouseout'), overriding the default.
 * @property {'hide' | 'disable'} [filterStrategy] - Overrides the global filter strategy for this menu.
 * @property {string} [additionalClasses] - Space-separated list of additional classes to add to a specific menu.
 * @property {boolean} [ignoreLinks] - Overrides the global `ignoreLinks` setting for this menu. Can be set to `false` to enable menus on links for this instance only.
 * @property {boolean} [ignoreButtons] - Overrides the global `ignoreButtons` setting for this menu.
 */

/**
 * Represents the state of an active submenu.
 * @typedef {object} SubmenuInfo
 * @property {HTMLElement} element - The DOM element of the submenu container.
 * @property {MenuCommand} parentCommand - The command that opened this submenu.
 */

/**
 * @typedef {object} Log
 * @property {string} event - The type of event being logged (e.g., 'init', 'action').
 * @property {string} message - A descriptive message about the event.
 * @property {object} [data] - Optional additional data related to the event, such as element IDs or action names.
 * @property {Date} timestamp - The date and time when the event occurred.
 * @property {Boolean} isError - Indicates if the log entry is an error.
 */

/**
 * Manages the creation, display, and interaction of custom context menus.
 */
class QuickCTX {
    /**
     * Creates a context menu manager instance.
     * @param {QuickCTXOptions} [options={}] - Global configuration options for the library.
     */
    constructor(options = {}) {
        this.isTouchDevice =
            "ontouchstart" in window || navigator.maxTouchPoints > 0;

        const defaultSubmenuArrow = `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16"><path fill="currentColor" d="M6.22 3.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L9.94 8L6.22 4.28a.75.75 0 0 1 0-1.06z"/></svg>`;

        const defaultOptions = {
            defaultTrigger: "contextmenu", //choice of trigger
            defaultMobileTrigger: "tap",
            defaultCloseTrigger: "auto",
            overlapStrategy: "closest", // closest or deepest
            globalFilterStrategy: "hide", // hide or gray out filtered commands
            submenuArrow: defaultSubmenuArrow,
            ignoreButtons: true,
            ignoreLinks: true,
            classes: {
                // css classes to assign to various elements
                container: "quickctx-container",
                header: "quickctx-header",
                list: "quickctx-list",
                item: "quickctx-item",
                separator: "quickctx-separator",
                sublist: "quickctx-sublist",
                sublistCommand: "quickctx-sublist-command",
                disabled: "quickctx-item--disabled",
                hidden: "quickctx-item--hidden",
                icon: "quickctx-icon",
                opening: "quickctx--opening",
                open: "quickctx--open",
                closing: "quickctx--closing",
            },
            animations: {
                // timing for animations
                submenuOpenDelay: 150,
                menuOpenDuration: 200,
                menuCloseDuration: 200,
                hoverMenuOpenDelay: 450,
                hoverMenuCloseDelay: 300, // Option for hover-triggered menus
                submenuCloseDelay: 200, // Delay before closing submenus
                holdDuration: 500,
            },
        };

        /**
         * The active configuration options for the instance, merged from defaults and user-provided options.
         * @type {QuickCTXOptions}
         */
        this.options = {
            ...defaultOptions,
            ...options,
            classes: {
                ...defaultOptions.classes,
                ...(options.classes || {}),
            },
            animations: {
                ...defaultOptions.animations,
                ...(options.animations || {}),
            },
        };

        this.logger = console.log; // Default logger function
        this.loggerIsEnabled = false; // Flag to enable or disable logging

        /**
         * A map of menu configurations, keyed by menu ID. Each menu configuration represent a combination of commands associated with a specific target type.
         * @type {Object.<string, ContextMenuConfigOptions>}
         * @private
         */
        this.menuConfigurations = {};

        /**
         * A map of registered action names to their callback functions. This allows for easy registration and retrieval of actions that can be executed by menu commands (without needing either to pass the function directly or duplicate them if they are used in multiple menus).
         * @type {Object.<string, Function>}
         * @private
         */
        this.registeredActions = {};

        /**
         * A map to track functions that have been automatically registered to avoid duplication.
         * @type {Map<Function, string>}
         * @private
         */
        this.functionActionMap = new Map();

        /**
         * The DOM element for the currently visible main menu.
         * @type {HTMLElement|null}
         * @private
         */
        this.activeMenuElement = null;

        /**
         * The DOM element that triggered the currently active menu.
         * @type {HTMLElement|null}
         * @private
         */
        this.currentTargetElement = null;

        /**
         * An array of DOM elements for currently open submenus.
         * @type {SubmenuInfo[]}
         * @private
         */
        this.activeSubmenus = [];

        /**
         * A timeout ID for the menu closing animation.
         * @type {number|null}
         * @private
         */
        this.menuHideTimeout = null;

        /**
         * A timeout ID for the hover-triggered menu hiding delay.
         * @type {number|null}
         * @private
         */
        this.hoverHideTimeout = null;

        /**
         * A timeout ID for the hover-triggered menu opening delay.
         * @type {number|null}
         * @private
         */
        this.hoverOpenTimeout = null;

        this.submenuCloseTimeout = null;

        this.touchState = {};

        // EVENT HANDLERS TO OPEN AND CLOSE MENUS

        // Bind 'this' context for all event handlers consistently to maintain instance scope.
        this._boundHandleTrigger = this._handleTriggerEvent.bind(this);
        this._boundHandleKeydown = this._handleKeydown.bind(this);
        this._boundHandleScroll = this._handleScroll.bind(this);
        this._boundOutsideClick = this._handleOutsideClick.bind(this);
        this._boundScheduleAllSubmenusClose =
            this._scheduleAllSubmenusClose.bind(this);
        this._boundCancelAllSubmenusClose =
            this._cancelAllSubmenusClose.bind(this);

        // for hover-triggered menus
        this._boundHandleHoverEnter = this._cancelHoverHide.bind(this);
        this._boundHandleHoverLeave = this._scheduleHoverHide.bind(this);
        this._boundCancelHoverOpen = this._cancelHoverOpen.bind(this);

        // touch events
        this._boundHandleTouchStart = this._handleTouchStart.bind(this);
        this._boundHandleTouchMove = this._handleTouchMove.bind(this);
        this._boundHandleTouchEnd = this._handleTouchEnd.bind(this);

        this._init(); // Initialize the context menu manager
    }

    /**
     * Updates the library's options at runtime and re-initializes event listeners.
     * @param {QuickCTXOptions} [newOptions={}] - The new options to merge with the current configuration.
     */
    updateOptions(newOptions = {}) {
        this.options = {
            ...this.options,
            ...newOptions,
            classes: { ...this.options.classes, ...(newOptions.classes || {}) },
            animations: {
                ...this.options.animations,
                ...(newOptions.animations || {}),
            },
        };

        this._log({
            event: "updateOptions",
            message: "Updating options...",
            data: this.options,
        });
        // Re-setup event listeners to reflect potential changes in the default trigger.
        this._setupEventListeners();
    }

    /********** TOUCH EVENT HANDLERS **********/

    _handleTouchStart(event) {
        if (this.activeMenuElement) return;

        const targetElement = event.target.closest("[data-custom-ctxmenu]");

        if (!targetElement) return;

        const menuId = targetElement.getAttribute("data-custom-ctxmenu");
        const config = this.menuConfigurations[menuId];
        if (!config) return;

        const shouldIgnoreLinks =
            config.ignoreLinks ?? this.options.ignoreLinks;
        const shouldIgnoreButtons =
            config.ignoreButtons ?? this.options.ignoreButtons;

        if (shouldIgnoreLinks && event.target.closest("a, [href]")) return;
        if (
            shouldIgnoreButtons &&
            event.target.closest(
                'button, input[type="button"], input[type="submit"], input[type="reset"]'
            )
        )
            return;

        const expectedMobileTrigger =
            config.mobileTriggerEvent || this.options.defaultMobileTrigger;

        if (expectedMobileTrigger === "hold") {
            event.preventDefault();
        }

        document.addEventListener("touchmove", this._boundHandleTouchMove, {
            passive: true,
        });
        document.addEventListener("touchend", this._boundHandleTouchEnd);

        const touch = event.touches[0];

        this.touchState = {
            targetElement,
            config,
            startTime: Date.now(),
            startCoords: { x: touch.clientX, y: touch.clientY },
            isHolding: false,
            timeout: null,
        };

        if (expectedMobileTrigger === "hold") {
            this.touchState.timeout = setTimeout(() => {
                this.touchState.isHolding = true;

                const mockEvent = {
                    clientX: this.touchState.startCoords.x,
                    clientY: this.touchState.startCoords.y,
                    preventDefault: () => {},
                    stopPropagation: () => {},
                };

                this._openMenu(
                    this.touchState.config,
                    this.touchState.targetElement,
                    mockEvent
                );
            }, this.options.animations.holdDuration);
        }
    }

    _handleTouchMove(event) {
        if (!this.touchState || !this.touchState.timeout) return;

        const touch = event.touches[0];
        const deltaX = Math.abs(touch.clientX - this.touchState.startCoords.x);
        const deltaY = Math.abs(touch.clientY - this.touchState.startCoords.y);

        if (deltaX > 15 || deltaY > 15) {
            clearTimeout(this.touchState.timeout);
            this.touchState = null;

            document.removeEventListener(
                "touchmove",
                this._boundHandleTouchMove
            );
            document.removeEventListener("touchend", this._boundHandleTouchEnd);
        }
    }

    _handleTouchEnd(event) {
        if (!this.touchState) return;

        clearTimeout(this.touchState.timeout);
        const duration = Date.now() - this.touchState.startTime;

        document.removeEventListener("touchmove", this._boundHandleTouchMove);
        document.removeEventListener("touchend", this._boundHandleTouchEnd);

        if (this.touchState.isHolding) {
            this.touchState = null;
            return;
        }

        const expectedMobileTrigger =
            this.touchState.config.mobileTriggerEvent ||
            this.options.defaultMobileTrigger;

        if (duration < 300 && expectedMobileTrigger === "tap") {
            const mockEvent = {
                clientX: this.touchState.startCoords.x,
                clientY: this.touchState.startCoords.y,
                preventDefault: () => {},
                stopPropagation: () => {},
            };

            event.preventDefault();

            this._openMenu(
                this.touchState.config,
                this.touchState.targetElement,
                mockEvent
            );
        }

        this.touchState = null;
    }

    /********** LOG **********/

    /**
     * Sets a custom logger function for logging messages.
     * @param {Function} logger - A function that takes a message and optional data to log.
     */
    setLogger(logger) {
        if (typeof logger === "function") {
            this.logger = logger;
        } else {
            console.warn(
                "Logger must be a function. Default logging will be used."
            );
            this.logger = console.log; // Fallback to console.log if no valid logger is provided
        }
    }

    /**
     * Enables or disables logging.
     * @param {boolean} enabled - If true, logging is enabled; if false, logging is disabled.
     */
    setLoggerIsEnabled(enabled) {
        this.loggerIsEnabled = !!enabled;
    }

    /**
     * Internal log handler. Checks if logging is enabled before calling the logger function.
     * @param {Log} logContent - The arguments to log.
     * @private
     */
    _log(logContent) {
        if (!this.loggerIsEnabled) {
            return;
        }
        this.logger({ ...logContent, timestamp: new Date() });
    }

    /********** INIT **********/

    /**
     * Initializes the library, setting up event listeners
     * @private
     */
    _init() {
        this._log({ event: "init", message: "Initializing QuickCTX" });

        this._setupEventListeners();

        this._log({ event: "init", message: "QuickCTX initialized" });
    }

    /********** HANDLING EVENTS **********/

    /**
     * Sets up global event listeners based on configured triggers. This method also removes old
     * listeners before adding new ones, making it safe to call on option updates.
     * @private
     */
    _setupEventListeners() {
        const supportedTriggers = [
            "contextmenu",
            "click",
            "dblclick",
            "mouseover",
            "mouseout",
        ];

        // Clear all potential listeners to ensure a clean state before re-adding.
        supportedTriggers.forEach((trigger) => {
            document.removeEventListener(trigger, this._boundHandleTrigger);
        });

        document.removeEventListener("touchstart", this._boundHandleTouchStart);

        if (this.isTouchDevice) {
            document.addEventListener(
                "touchstart",
                this._boundHandleTouchStart,
                { passive: false }
            );

            this._log({
                event: "setupListeners",
                message: "Touch event listeners enabled.",
            });
        }

        // Collect all unique triggers from the default options and all registered menu configurations.
        const activeTriggers = new Set([this.options.defaultTrigger]);
        Object.values(this.menuConfigurations).forEach((config) => {
            if (config.triggerEvent) {
                const eventName =
                    config.triggerEvent === "hover"
                        ? ["mouseover", "mouseout"]
                        : [config.triggerEvent];

                eventName.forEach((e) => activeTriggers.add(e));
            }
        });

        // Add listeners only for the active triggers.
        activeTriggers.forEach((trigger) => {
            if (supportedTriggers.includes(trigger)) {
                document.addEventListener(trigger, this._boundHandleTrigger);
            }
        });

        this._log({
            event: "setupListeners",
            message: "Event listeners set up",
            data: { activeTriggers: Array.from(activeTriggers) },
        });
    }

    /**
     * Handles the trigger event for showing the context menu.
     * @param {Event} event - The event that triggered the context menu (e.g., 'contextmenu', 'click', 'mouseover').
     * @private
     */
    _handleTriggerEvent(event) {
        if (this.isTouchDevice && event.type === "contextmenu") {
            event.preventDefault();
            return;
        }

        this._log({
            event: "handleTrigger",
            message: `Handling trigger event: ${event.type}`,
            data: { target: event.target },
        });

        // if cursor leaves an element, avoid hover menus opening
        if (event.type === "mouseout") {
            this._cancelHoverOpen();
            return;
        }

        let targetElement =
            this.options.overlapStrategy === "deepest" &&
            event.target.matches("[data-custom-ctxmenu]")
                ? event.target
                : event.target.closest("[data-custom-ctxmenu]");

        // if no target is found, return
        if (!targetElement) return;

        const menuId = targetElement.getAttribute("data-custom-ctxmenu");
        if (!menuId) {
            this._log({
                event: "handleTrigger",
                message: `No menu ID found on target element: ${targetElement.tagName}`,
                data: { targetElementId: targetElement.id || "unknown" },
                isError: true,
            });
            throw new Error(
                `No menu ID found on target element: ${targetElement.tagName}`
            );
        }

        const config = this.menuConfigurations[menuId];

        if (!config) {
            this._log({
                event: "handleTrigger",
                message: `No menu configuration found for ID: ${menuId}`,
                data: { menuId },
                isError: true,
            });

            throw new Error(`No menu configuration found for ID: ${menuId}`);
        }

        const shouldIgnoreLinks =
            config.ignoreLinks ?? this.options.ignoreLinks;
        const shouldIgnoreButtons =
            config.ignoreButtons ?? this.options.ignoreButtons;

        if (shouldIgnoreLinks && event.target.closest("a, [href]")) return;
        if (
            shouldIgnoreButtons &&
            event.target.closest(
                'button, input[type="button"], input[type="submit"], input[type="reset"]'
            )
        )
            return;

        const eventTriggerType =
            event.type === "mouseover" ? "hover" : event.type;

        const expectedTrigger =
            config.triggerEvent || this.options.defaultTrigger;

        if (eventTriggerType !== expectedTrigger) return;

        // avoid annoying recreation of menu during hover, only for hover-triggered menus
        if (
            expectedTrigger === "hover" &&
            this.currentTargetElement === targetElement
        )
            return;

        if (
            eventTriggerType === "hover" &&
            this.options.animations.hoverMenuOpenDelay > 0
        ) {
            this._cancelHoverOpen();
            this.hoverOpenTimeout = setTimeout(() => {
                this._openMenu(config, targetElement, event);
            }, this.options.animations.hoverMenuOpenDelay);
        } else {
            this._openMenu(config, targetElement, event);
        }
    }

    /**
     * Handles the key "escape" event to close any active menu instantly.
     * @private
     */
    _handleKeydown(event) {
        if (event.key === "Escape")
            this._hideMenu(this.activeMenuElement, false);
    }

    /**
     * Handles the scroll event to close any active menu instantly.
     * @private
     */
    _handleScroll() {
        if (this.activeMenuElement) {
            this._hideMenu(this.activeMenuElement, false);
        }
    }

    /**
     * Handles document clicks to close the menu if the click is outside.
     * @param {Event} event - The click event.
     * @private
     */
    _handleOutsideClick(event) {
        // If there's no active menu, or the menu is just opening, do nothing.
        if (
            !this.activeMenuElement ||
            this.activeMenuElement.classList.contains(
                this.options.classes.opening
            )
        ) {
            return;
        }

        // If the click is inside the active menu or a submenu, do nothing.
        if (this.activeMenuElement.contains(event.target)) {
            return;
        }

        for (const submenuInfo of this.activeSubmenus) {
            if (
                submenuInfo.element &&
                submenuInfo.element.contains(event.target)
            ) {
                return;
            }
        }

        this._hideMenu(this.activeMenuElement, false);
    }

    _setupHoverListeners(target, menu) {
        target.addEventListener("mouseleave", this._boundHandleHoverLeave);
        menu.addEventListener("mouseleave", this._boundHandleHoverLeave);
        target.addEventListener("mouseenter", this._boundHandleHoverEnter);
        menu.addEventListener("mouseenter", this._boundHandleHoverEnter);
    }

    /********** OPEN/CLOSE LOGIC **********/

    /**
     * Handles the logic of building and displaying a menu for a given trigger.
     * This method centralizes the opening logic to be called either directly or with a delay.
     * @param {object} config - The menu configuration.
     * @param {HTMLElement} targetElement - The element that triggered the menu.
     * @param {Event} event - The original trigger event.
     * @private
     */
    _openMenu(config, targetElement, event) {
        // If another menu is already active, start its closing animation without waiting.
        if (
            this.activeMenuElement &&
            !this.activeMenuElement.classList.contains(
                this.options.classes.closing
            )
        ) {
            this._hideMenu(this.activeMenuElement, false); // false = with animation
        }

        event.preventDefault();
        event.stopPropagation();

        this.currentTargetElement = targetElement;

        const targetType =
            targetElement.getAttribute("data-custom-ctxmenu-type") || "default";

        const newMenuElement = createElement(
            "div",
            this.options.classes.container
        );

        Object.assign(newMenuElement.style, {
            position: "fixed",
            zIndex: "10000",
            display: "none",
        });

        document.body.appendChild(newMenuElement);

        this.activeMenuElement = newMenuElement;

        this._buildAndShowMenu(
            config,
            targetElement,
            targetType,
            event.clientX,
            event.clientY
        );

        this._log({
            event: "_openMenu",
            message: `Opened menu ${this.menuConfigurations.id} for target type: ${targetType}`,
        });

        const trigger = this.isTouchDevice
            ? config.mobileTriggerEvent || this.options.defaultMobileTrigger
            : config.triggerEvent || this.options.defaultTrigger;

        let effectiveCloseTrigger =
            config.closeTriggerEvent || this.options.defaultCloseTrigger;

        if (effectiveCloseTrigger === "auto") {
            effectiveCloseTrigger = trigger === "hover" ? "mouseout" : "click";
        }

        if (effectiveCloseTrigger === "mouseout" && !this.isTouchDevice) {
            this._setupHoverListeners(targetElement, this.activeMenuElement);
            this._log({
                event: "setupCloseListeners",
                message: "Using 'mouseout' close trigger.",
            });
        } else {
            //add listener to close at the end
            setTimeout(() => {
                document.addEventListener(
                    "click",
                    this._boundOutsideClick,
                    true
                );
                if (this.activeMenuElement) {
                }
            }, 0);

            this._log({
                event: "setupCloseListeners",
                message: "Using 'click' close trigger.",
            });
        }

        document.addEventListener("keydown", this._boundHandleKeydown);
        window.addEventListener("scroll", this._boundHandleScroll, true);
    }

    _scheduleHoverHide() {
        this._cancelHoverHide();
        this.hoverHideTimeout = setTimeout(() => {
            this._hideMenu(this.activeMenuElement);
        }, this.options.animations.hoverMenuCloseDelay);
    }

    _cancelHoverHide() {
        if (this.hoverHideTimeout) {
            clearTimeout(this.hoverHideTimeout);
            this.hoverHideTimeout = null;
        }
    }

    _cancelHoverOpen() {
        if (this.hoverOpenTimeout) {
            clearTimeout(this.hoverOpenTimeout);
            this.hoverOpenTimeout = null;
        }
    }

    _scheduleSubmenuOpen(command, parentLi, targetElement) {
        this._cancelSubmenuOpen(command);
        command.openTimeout = setTimeout(() => {
            this._openSubmenu(command, parentLi, targetElement);
        }, this.options.animations.submenuOpenDelay);
    }

    _cancelSubmenuOpen(command) {
        if (command.openTimeout) {
            clearTimeout(command.openTimeout);
            command.openTimeout = null;
        }
    }

    _openSubmenu(command, parentLi, targetElement) {
        if (
            command.submenuElement?.classList.contains(
                this.options.classes.open
            )
        )
            return;
        let subMenuEl = command.submenuElement;
        if (!subMenuEl || !document.body.contains(subMenuEl)) {
            subMenuEl = createElement("div", [
                this.options.classes.container,
                this.options.classes.sublist,
            ]);
            Object.assign(subMenuEl.style, {
                position: "fixed",
                zIndex: "10001",
                display: "none",
            });
            document.body.appendChild(subMenuEl);
            command.submenuElement = subMenuEl;
        }
        // Add listeners to the submenu itself to prevent it from closing when entered
        subMenuEl.addEventListener(
            "mousemove",
            this._boundCancelAllSubmenusClose
        );
        subMenuEl.addEventListener(
            "mouseleave",
            this._boundScheduleAllSubmenusClose
        );

        const rect = parentLi.getBoundingClientRect();
        this._buildAndShowMenu(
            { commands: command.subCommands },
            targetElement,
            targetElement.dataset.customCtxmenuType || "default",
            rect.right,
            rect.top,
            subMenuEl,
            command
        );
    }

    _scheduleAllSubmenusClose() {
        this._cancelAllSubmenusClose(); // Previene timer duplicati
        this.submenuCloseTimeout = setTimeout(() => {
            this._closeSubmenus(); // Chiude TUTTI i sottomenu
        }, this.options.animations.submenuCloseDelay);
    }

    _cancelAllSubmenusClose() {
        clearTimeout(this.submenuCloseTimeout);
    }

    /**
     * Closes all active submenus that are not in the direct ancestry
     * of the currently hovered command.
     * @param {MenuCommand} command - The command of the item being hovered.
     * @private
     */
    _closeSiblingSubmenus(command) {
        const ancestors = new Set();
        let current = command;
        while (current) {
            ancestors.add(current);
            current = current.parentCommand;
        }

        for (let i = this.activeSubmenus.length - 1; i >= 0; i--) {
            const submenuInfo = this.activeSubmenus[i];
            if (!ancestors.has(submenuInfo.parentCommand)) {
                this._closeSingleSubmenu(submenuInfo);
                this.activeSubmenus.splice(i, 1);
            }
        }
    }

    _closeSingleSubmenu(submenuInfo, instant = false) {
        const submenu = submenuInfo.element;
        if (!submenu) return;

        // Clean up its listeners
        submenu.removeEventListener("mousemove", this._cancelAllSubmenusClose);
        submenu.removeEventListener(
            "mouseleave",
            this._scheduleAllSubmenusClose
        );
        if (instant) {
            if (submenu.parentElement) document.body.removeChild(submenu);
        } else {
            submenu.classList.remove(this.options.classes.open);
            submenu.classList.add(this.options.classes.closing);
            setTimeout(() => {
                if (submenu.parentElement) document.body.removeChild(submenu);
            }, this.options.animations.menuCloseDuration);
        }
    }

    /**
     * Recursively closes open submenus.
     * @private
     */
    _closeSubmenus(fromLevel = 0, instant = false) {
        while (this.activeSubmenus.length > fromLevel) {
            const submenuInfo = this.activeSubmenus.pop();
            if (!submenuInfo) continue;

            const submenuEl = submenuInfo.element;

            const close = () => {
                submenuEl.style.display = "none";
                submenuEl.classList.remove(
                    this.options.classes.open,
                    this.options.classes.opening,
                    this.options.classes.closing
                );
                submenuEl.innerHTML = "";
                if (submenuEl.parentElement === document.body)
                    document.body.removeChild(submenuEl);
            };
            if (instant) close();
            else {
                submenuEl.classList.remove(this.options.classes.open);
                submenuEl.classList.add(this.options.classes.closing);
                setTimeout(close, this.options.animations.menuCloseDuration);
            }
        }
    }

    _hideMenu(menuToHide, instant = false) {
        if (!menuToHide) return;

        this._log({
            event: "hideMenu",
            message: `Hiding menu: ${
                this.activeMenuElement ? this.activeMenuElement.id : "none"
            }`,
            data: {
                activeMenuId: this.activeMenuElement
                    ? this.activeMenuElement.id
                    : null,
            },
        });

        this._closeSubmenus(0, instant);

        const hide = () => {
            if (menuToHide.parentElement) {
                menuToHide.parentElement.removeChild(menuToHide);
            }

            // Reset state only if the menu being hidden is the active one.

            if (this.activeMenuElement === menuToHide) {
                const target = this.currentTargetElement;
                this.activeMenuElement = null;
                this.currentTargetElement = null;

                // Clean up global listeners associated with an open menu.
                document.removeEventListener(
                    "click",
                    this._boundOutsideClick,
                    true
                );

                document.removeEventListener(
                    "keydown",
                    this._boundHandleKeydown
                );

                window.removeEventListener(
                    "scroll",
                    this._boundHandleScroll,
                    true
                );

                if (target) {
                    target.removeEventListener(
                        "mouseleave",
                        this._boundHandleHoverLeave
                    );
                    target.removeEventListener(
                        "mouseenter",
                        this._boundHandleHoverEnter
                    );
                }

                menuToHide.removeEventListener(
                    "mouseleave",
                    this._boundHandleHoverLeave
                );
                menuToHide.removeEventListener(
                    "mouseenter",
                    this._boundHandleHoverEnter
                );
            }
        };

        if (instant || this.options.animations.menuCloseDuration === 0) {
            hide();
        } else {
            menuToHide.classList.remove(
                this.options.classes.open,
                this.options.classes.opening
            );
            menuToHide.classList.add(this.options.classes.closing);
            setTimeout(hide, this.options.animations.menuCloseDuration);
        }

        this._log({
            event: "hideMenu",
            message: "Menu hidden successfully",
            data: {
                activeMenuId: this.activeMenuElement
                    ? this.activeMenuElement.id
                    : null,
            },
        });
    }

    /**
     * Programmatically opens a context menu for a given target element.
     * @param {string|HTMLElement} targetOrSelector - The target element or a CSS selector for it.
     * @param {number} [x=-1] - Optional X coordinate. If -1, the menu is centered on the target.
     * @param {number} [y=-1] - Optional Y coordinate. If -1, the menu is centered on the target.
     * @returns {boolean} Returns `true` if the menu was opened successfully, otherwise `false`.
     */
    openMenu(targetOrSelector, x = -1, y = -1) {
        const targetElement =
            typeof targetOrSelector === "string"
                ? document.querySelector(targetOrSelector)
                : targetOrSelector;

        if (!targetElement || !(targetElement instanceof HTMLElement)) {
            this._log({
                event: "openMenu",
                message: "Invalid target element provided.",
                isError: true,
            });
            return false;
        }

        const menuId = targetElement.getAttribute("data-custom-ctxmenu");
        if (!menuId) {
            this._log({
                event: "openMenu",
                message: `Target element has no 'data-custom-ctxmenu' attribute.`,
                isError: true,
            });
            return false;
        }

        const config = this.menuConfigurations[menuId];
        if (!config) {
            this._log({
                event: "openMenu",
                message: `No menu configuration found for ID: ${menuId}`,
                isError: true,
            });
            return false;
        }

        let finalX = x;
        let finalY = y;

        if (x === -1 || y === -1) {
            const rect = targetElement.getBoundingClientRect();
            finalX = rect.left + rect.width / 2;
            finalY = rect.top + rect.height / 2;
        }

        const mockEvent = {
            clientX: finalX,
            clientY: finalY,
            preventDefault: () => {},
            stopPropagation: () => {},
        };

        this._openMenu(config, targetElement, mockEvent);
        return true;
    }

    /**
     * Programmatically closes any currently active menu.
     * @param {boolean} [instant=false] - If true, closes the menu instantly without animation.
     */
    closeMenu(instant = false) {
        this._hideMenu(this.activeMenuElement, instant);
    }

    /********** DOM BUILD **********/

    /**
     * Creates the DOM element (LI) for a single menu command.
     * @private
     */
    _createMenuItemDOM(command, targetElement, isDisabled, isSubmenuItem) {
        this._log({
            event: "createMenuItemDOM",
            message: `Creating DOM for command: ${command.label}`,
            data: {
                commandId: command.id,
                targetElementId: targetElement.id || "unknown",
                isDisabled,
                isSubmenuItem,
            },
        });

        const li = createElement("li", [this.options.classes.item]);

        li.style.position = "relative"; // Ensure the LI is positioned correctly for submenus

        if (command.type === "separator") {
            li.classList.add(this.options.classes.separator);
            if (command.content) {
                li.classList.add("quickctx-subheader");
                if (typeof command.content === "string")
                    li.textContent = command.content;
                else if (command.content instanceof HTMLElement)
                    li.appendChild(command.content);
            }

            li.addEventListener("mouseenter", () => {
                this._boundCancelAllSubmenusClose();

                this._closeSiblingSubmenus(command);
            });

            return li;
        }

        if (isDisabled) li.classList.add(this.options.classes.disabled);

        if (command.iconClass) {
            const iconSpan = createElement("span", this.options.classes.icon);

            command.iconClass
                .split(" ")
                .filter(Boolean)
                .forEach((ic) =>
                    iconSpan.classList.add(ic, ic.replace(".", "_"))
                );

            li.appendChild(iconSpan);
        }

        li.innerHTML = li.innerHTML + command.label;

        command.element = li;

        li.addEventListener("mouseenter", () => {
            this._boundCancelAllSubmenusClose();

            if (isDisabled) return;

            this._closeSiblingSubmenus(command);

            // If this item is a sublist, schedule its opening.
            if (command.type === "sublist" && command.subCommands?.length > 0) {
                this._scheduleSubmenuOpen(command, li, targetElement);
            }
        });

        li.addEventListener("mouseleave", this._boundScheduleAllSubmenusClose);

        if (command.type === "sublist" && command.subCommands?.length > 0) {
            li.classList.add(
                this.options.classes.sublistCommand,
                "has-submenu-arrow"
            );
            const arrowSpan = createElement("span", "submenu-arrow");

            arrowSpan.innerHTML = this.options.submenuArrow;
            li.appendChild(arrowSpan);
        }

        if (command.type === "action") {
            //if it's an action, add click listener
            li.addEventListener("click", (event) => {
                event.stopPropagation();
                if (isDisabled) return;

                let action = command.action;

                if (typeof action === "string") {
                    action = this.registeredActions[action];
                }

                if (action === "undefined") {
                    this._log({
                        event: "actionError",
                        message: `No action registered for command "${command.label}"`,
                        data: {
                            commandId: command.id,
                            commandLabel: command.label,
                        },
                        isError: true,
                    });
                    throw new Error(
                        `No action registered for command "${command.label}"`
                    );
                }

                if (typeof action === "function") {
                    try {
                        action({ target: this.currentTargetElement, command });
                    } catch (error) {
                        this._log({
                            event: "actionError",
                            message: `Error executing action for command "${command.label}"`,
                            data: {
                                commandId: command.id,
                                commandLabel: command.label,
                                error: error.message,
                            },
                            isError: true,
                        });

                        throw new Error(
                            `Error executing action for command "${command.label}": ${error.message}`
                        );
                    }
                }

                this.currentTargetElement?.dispatchEvent(
                    new CustomEvent("QuickCTXActionSelected", {
                        detail: {
                            menuId: this.currentTargetElement?.dataset
                                .customCtxmenu,
                            commandId: command.id,
                            commandLabel: command.label,
                            targetElement: this.currentTargetElement,
                            targetType:
                                this.currentTargetElement?.dataset
                                    .customCtxmenuType,
                        },
                        bubbles: true,
                        composed: true,
                    })
                );

                this._hideMenu(this.activeMenuElement);
            });
        }
        return li;
    }

    /**
     * Constructs the DOM for a menu based on its configuration.
     * @private
     */
    _buildAndShowMenu(
        config,
        targetElement,
        targetType,
        x,
        y,
        parentMenuElement = null,
        parentCommand = null
    ) {
        this._log({
            event: "buildMenu",
            message: `Building menu for target type: ${targetType}`,
            data: {
                targetElementId: targetElement.id || "unknown",
                parentMenuId: parentMenuElement ? parentMenuElement.id : null,
            },
        });

        // If a parent menu is provided, we are building a submenu.
        const menuToBuild = parentMenuElement || this.activeMenuElement;

        let additionalClasses = config.additionalClasses;

        if (parentMenuElement) {
            this.activeSubmenus.push({
                element: menuToBuild,
                parentCommand: parentCommand,
            });

            additionalClasses = this.activeMenuElement.className;
        }

        menuToBuild.innerHTML = "";

        const headerText = (
            config.headerText ||
            config.headerTextTemplate ||
            ""
        ).replace(/{type}/g, targetType);
        if (!parentMenuElement && headerText) {
            menuToBuild.appendChild(
                createElement(
                    "div",
                    this.options.classes.header,
                    {},
                    headerText
                )
            );
        }

        const ul = createElement("ul", this.options.classes.list);
        let visibleItems = 0;
        config.commands.forEach((command) => {
            if (parentCommand) command.parentCommand = parentCommand; // Hierarchical tracking

            const typeMatch =
                command.targetTypes.includes("*") ||
                command.targetTypes.includes(targetType);

            if (!command.visible) return;

            let effectiveDisabled = command.disabled;

            if (!typeMatch) {
                if (
                    (config.filterStrategy ||
                        this.options.globalFilterStrategy) === "hide"
                ) {
                    return;
                }
                effectiveDisabled = true;
            }

            ul.appendChild(
                this._createMenuItemDOM(
                    command,
                    targetElement,
                    effectiveDisabled
                )
            );
            visibleItems++;
        });

        if (visibleItems > 0) {
            menuToBuild.appendChild(ul);
            this._showMenuDOM(
                menuToBuild,
                x,
                y,
                targetElement,
                parentMenuElement !== null,
                parentCommand,
                additionalClasses
            );
        } else {
            this._hideMenu(this.activeMenuElement, true); //hide instantly if empty
        }

        if (visibleItems === 0) {
            if (!parentMenuElement)
                this._hideMenu(this.activeMenuElement, true);
            else parentCommand?.element.classList.remove("has-submenu-arrow");
            return null;
        }
        menuToBuild.appendChild(ul);

        if (!parentMenuElement) {
            document.addEventListener("click", this._boundOutsideClick, true);
            document.addEventListener("keydown", this._boundHandleKeydown);
        }
        return menuToBuild;
    }

    /**
     * Positions and animates the menu into view.
     * @private
     */
    _showMenuDOM(
        menuDomElement,
        x,
        y,
        targetElement,
        isSubmenu,
        parentCommand,
        additionalClasses
    ) {
        menuDomElement.style.display = "block";
        menuDomElement.classList.remove(this.options.classes.closing);
        menuDomElement.classList.add(this.options.classes.opening);
        additionalClasses
            ?.split(" ")
            .forEach((additionalClass) =>
                menuDomElement.classList.add(additionalClass)
            );

        const menuRect = menuDomElement.getBoundingClientRect();
        const docWidth = window.innerWidth;
        const docHeight = window.innerHeight;
        if (isSubmenu && parentCommand?.element) {
            const parentLiRect = parentCommand.element.getBoundingClientRect();
            x = parentLiRect.right - 5;
            y = parentLiRect.top;
        }
        if (x + menuRect.width > docWidth)
            x = isSubmenu
                ? x -
                  menuRect.width -
                  (parentCommand?.element.getBoundingClientRect().width || 0) +
                  10
                : docWidth - menuRect.width - 10;
        if (x < 10) x = 10;
        if (y + menuRect.height > docHeight)
            y = docHeight - menuRect.height - 10;
        if (y < 10) y = 10;
        menuDomElement.style.left = `${x}px`;
        menuDomElement.style.top = `${y}px`;
        void menuDomElement.offsetWidth;
        menuDomElement.classList.remove(this.options.classes.opening);
        menuDomElement.classList.add(this.options.classes.open);
    }

    /********** MENU CREATION AND CONFIG **********/

    /**
     * Registers a named action that can be referenced by commands.
     * @param {string} actionName - The unique name for the action.
     * @param {Function} callback - The function to execute. It receives `(targetElement, command)`.
     */
    registerAction(actionName, callback) {
        if (typeof callback !== "function" && callback !== null) {
            console.error(
                `Callback for action "${actionName}" must be a function or null.`
            );
            return;
        }
        this.registeredActions[actionName] = callback;
    }

    /**
     * Adds a menu configuration to the manager.
     * @param {ContextMenuConfigOptions} configOptions - The configuration object for the menu.
     */
    addMenuConfiguration(configOptions) {
        if (!configOptions.id) {
            this._log({
                event: "addMenuConfiguration",
                message: "Failed to add menu configuration: ID is required.",
                isError: true,
            });
            throw new Error("ID is required for menu configuration.");
        }

        if (this.menuConfigurations[configOptions.id]) {
            this._log({
                event: "addMenuConfiguration",
                message: `Overwriting existing menu configuration with ID: ${configOptions.id}`,
            });
        }

        const commands = Array.isArray(configOptions.commands)
            ? configOptions.commands
                  .map((cmd) =>
                      cmd instanceof MenuCommand ? cmd : new MenuCommand(cmd)
                  )
                  .sort((a, b) => a.order - b.order)
            : [];
        this.menuConfigurations[configOptions.id] = {
            ...configOptions,
            commands,
            triggerEvent:
                configOptions.triggerEvent || this.options.defaultTrigger,
            mobileTriggerEvent:
                configOptions.mobileTriggerEvent ||
                this.options.defaultMobileTrigger,
            closeTriggerEvent:
                configOptions.closeTriggerEvent ||
                this.options.defaultCloseTrigger,
            filterStrategy:
                configOptions.filterStrategy ||
                this.options.globalFilterStrategy,
        };

        this._log({
            event: "addMenuConfiguration",
            message: `Menu configuration added for ID: ${configOptions.id}`,
            data: {
                commandsCount: commands.length,
                filterStrategy:
                    this.menuConfigurations[configOptions.id].filterStrategy,
            },
        });

        this._setupEventListeners();
    }

    /**
     * Updates an existing menu configuration with new options.
     * This is useful for dynamically changing a menu's properties, such as its trigger event.
     * @param {string} menuId - The ID of the menu configuration to update.
     * @param {object} newOptions - An object containing the properties to update (e.g., { triggerEvent: 'hover' }).
     */
    updateMenuConfiguration(menuId, newOptions) {
        if (!this.menuConfigurations[menuId]) {
            this._log({
                event: "updateMenuConfiguration",
                message: `Menu with ID "${menuId}" not found.`,
                isError: true,
            });
            return;
        }

        // Merge the new options into the existing configuration
        this.menuConfigurations[menuId] = {
            ...this.menuConfigurations[menuId],
            ...newOptions,
        };

        // Re-run the event listener setup to apply changes to triggers
        this._setupEventListeners();

        this._log({
            event: "updateMenuConfiguration",
            message: `Menu "${menuId}" updated successfully.`,
            data: { newOptions },
        });
    }

    /**
     * Finds and updates a specific command within any menu or nested submenu
     * by its unique ID. It performs a partial update, merging the new properties
     * into the existing command's configuration.
     *
     * @param {string} menuId - The ID of the menu configuration containing the command.
     * @param {string|function} action - The action associated to the command
     * @param {Partial<MenuCommand>} updates - An object containing the properties to update
     * on the command (e.g., { label: 'New Text', disabled: false, iconClass: 'fa fa-star' }).
     * @returns {boolean} Returns `true` if the command was found and updated, otherwise `false`.
     */
    updateMenuCommand(menuId, action, updates) {
        const menuConfig = this.menuConfigurations[menuId];

        action =
            typeof action === "function"
                ? this.functionActionMap.get(action)
                : action;

        if (!menuConfig) {
            this._log({
                event: "updateMenuCommand",
                message: `Menu with ID "${menuId}" not found.`,
                isError: true,
            });

            return false;
        }

        let commandLabel;

        // Helper function to recursively search for the command.
        const findAndMerge = (commands) => {
            for (const command of commands) {
                // Target command found.
                if (command.action === action) {
                    Object.assign(command, updates);
                    commandLabel = command.label;
                    return true;
                }
                // If the command is a submenu, search within it.
                if (command.subCommands && command.subCommands.length > 0) {
                    if (findAndMerge(command.subCommands)) {
                        return true;
                    }
                }
            }
            return false;
        };

        const wasCommandUpdated = findAndMerge(menuConfig.commands);

        if (wasCommandUpdated) {
            this._log({
                event: "updateMenuCommand",
                message: `Command "${commandLabel}" in menu "${menuId}" was successfully updated.`,
                data: { updates },
            });
        } else {
            this._log({
                event: "updateMenuCommand",
                message: `Command not found in menu "${menuId}".`,
                isError: true,
            });
        }

        return wasCommandUpdated;
    }

    /**
     * Binds a menu configuration to one or more HTML elements.
     * @param {string|HTMLElement|HTMLElement[]} selectorOrElements - A CSS selector, a single HTML element, or an array of elements.
     * @param {string} menuId - The ID of the menu configuration to bind.
     * @param {string} type - The 'type' to assign to these elements.
     */
    bindMenuToElements(selectorOrElements, menuId, type) {
        const elements =
            typeof selectorOrElements === "string"
                ? document.querySelectorAll(selectorOrElements)
                : Array.isArray(selectorOrElements)
                ? selectorOrElements
                : [selectorOrElements];

        elements.forEach((el) => {
            if (el instanceof HTMLElement) {
                el.dataset.customCtxmenu = menuId;
                el.dataset.customCtxmenuType = el.dataset.customCtxmenuType
                    ? el.dataset.customCtxmenuType
                    : type;
            }
        });

        this._log({
            event: "bindMenuToElements",
            message: `Bound menu ${menuId} to elements of type ${type}`,
            data: {
                elementsCount: elements.length,
                menuId,
                type,
            },
        });
    }

    /**
     * Unbinds a menu from one or more HTML elements.
     * @param {string|HTMLElement|HTMLElement[]} selectorOrElements - A CSS selector, a single HTML element, or an array of elements.
     */
    unbindMenuFromElements(selectorOrElements) {
        const elements =
            typeof selectorOrElements === "string"
                ? document.querySelectorAll(selectorOrElements)
                : Array.isArray(selectorOrElements)
                ? selectorOrElements
                : [selectorOrElements];

        elements.forEach((el) => {
            if (el instanceof HTMLElement) {
                delete el.dataset.customCtxmenu;
                delete el.dataset.customCtxmenuType;
            }
        });

        this._log({
            event: "unbindMenuFromElements",
            message: `Unbound menu from elements`,
            data: {
                elementsCount: elements.length,
                selectorOrElements,
            },
        });
    }

    /**
     * The primary helper method to define, configure, and bind a menu in a single call.
     * @param {MenuCreationOptions} options - Configuration for creating and binding the menu.
     */
    createAndBindMenu({
        menuId,
        defaultTargetType = "*",
        selector,
        structure,
        headerText,
        triggerEvent,
        mobileTriggerEvent,
        closeTriggerEvent,
        filterStrategy,
        additionalClasses,
        ignoreButtons,
        ignoreLinks
    }) {
        if (!menuId || !structure) {
            this._log({
                event: "createAndBindMenu",
                message:
                    "Failed to create and bind menu: missing required parameters.",
                isError: true,
            });

            throw new Error(
                "`menuId` and `structure` are required for createAndBindMenu."
            );
        }

        const processStructure = (struct, defaultType) => {
            return struct
                .map((item) => {
                    const commandConf =
                        item instanceof MenuCommand
                            ? { ...item } // Clone properties from the MenuCommand instance
                            : typeof item === "object" && item !== null
                            ? { ...item }
                            : null;

                    if (typeof commandConf !== "object" || commandConf === null)
                        return null;

                    if (
                        commandConf.subCommands &&
                        Array.isArray(commandConf.subCommands) &&
                        commandConf.subCommands.length > 0
                    ) {
                        commandConf.type = "sublist";
                        commandConf.subCommands = processStructure(
                            commandConf.subCommands,
                            defaultType
                        );
                    }

                    if (typeof commandConf.action === "function") {
                        const actionFunc = commandConf.action;
                        let actionName = this.functionActionMap.get(actionFunc);

                        if (!actionName) {
                            const uniqueId = window.crypto?.randomUUID
                                ? crypto.randomUUID()
                                : Date.now().toString(36) +
                                  Math.random().toString(36).substring(2);
                            actionName = `quickctx-action-${uniqueId}`;
                            this.registerAction(actionName, actionFunc);
                            this.functionActionMap.set(actionFunc, actionName);
                        }
                        commandConf.action = actionName;
                    }

                    if (!commandConf.targetTypes && defaultType) {
                        commandConf.targetTypes = [defaultType];
                    }

                    return new MenuCommand(commandConf);
                })
                .filter(Boolean);
        };

        this._log({
            event: "createAndBindMenu",
            message: `Creating and binding menu with ID: ${menuId}`,
            data: {
                defaultTargetType,
                selector,
                structure,
                headerText,
                triggerEvent,
                filterStrategy,
            },
        });

        const commands = processStructure(structure, defaultTargetType);

        this._log({
            event: "createAndBindMenu",
            message: `Processed commands for menu ${menuId}`,
        });

        const menuConfig = {
            id: menuId,
            headerTextTemplate: headerText,
            commands,
            triggerEvent,
            mobileTriggerEvent,
            closeTriggerEvent,
            filterStrategy,
            additionalClasses,
            ignoreButtons,
            ignoreLinks
        };

        this.addMenuConfiguration(menuConfig);

        if (selector && defaultTargetType) {
            this.bindMenuToElements(selector, menuId, defaultTargetType);
        }
    }
}

export default QuickCTX;
