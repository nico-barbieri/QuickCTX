import { createElement } from "./utils.js";

/**
 * Configurable CSS classes for the context menu elements.
 * @typedef {object} QuickCTXClassesOptions
 * @property {string} [container='quickctx-container'] - CSS class for the main menu container.
 * @property {string} [header='quickctx-header'] - CSS class for the menu header.
 * @property {string} [list='quickctx-list'] - CSS class for the <ul> list of commands.
 * @property {string} [item='quickctx-item'] - CSS class for menu <li> elements (commands).
 * @property {string} [separator='quickctx-separator'] - CSS class for separators.
 * @property {string} [sublist='quickctx-sublist'] - CSS class for <li> items that open submenus.
 * @property {string} [disabled='quickctx-item--disabled'] - CSS class for disabled items.
 * @property {string} [hidden='quickctx-item--hidden'] - CSS class for hidden items.
 * @property {string} [iconPrefix='quickctx-icon-'] - Prefix for icon classes.
 * @property {string} [opening='quickctx--opening'] - Class added during the opening animation.
 * @property {string} [open='quickctx--open'] - Class added when the menu is fully open.
 * @property {string} [closing='quickctx--closing'] - Class added during the closing animation.
 */

/**
 * Configurable animation options for the context menu.
 * @typedef {object} QuickCTXAnimationsOptions
 * @property {number} [submenuOpenDelay=150] - Delay in ms for opening submenus on hover.
 * @property {number} [menuOpenDuration=200] - Duration in ms of the main menu opening animation.
 * @property {number} [menuCloseDuration=200] - Duration in ms of the main menu closing animation.
 */

/**
 * Configuration options for the QuickCTX context menu.
 * @typedef {object} QuickCTXOptions
 * @property {string} [trigger='contextmenu'] - The default trigger event for all menus ('contextmenu', 'click', 'dblclick', 'hover').
 * @property {'closest' | 'deepest'} [overlapStrategy='closest'] - Strategy for finding the target element when multiple are nested.
 * @property {'hide' | 'disable'} [globalFilterStrategy='hide'] - Global filter strategy for irrelevant commands.
 * @property {QuickCTXClassesOptions} [classes] - Object containing customizable CSS classes.
 * @property {QuickCTXAnimationsOptions} [animations] - Object containing options for animations.
 */

/**
 * Manages the creation, display, and interaction of custom context menus.
 */
class QuickCTX {
    /**
     * Creates a context menu manager instance.
     * @param {ContextMenuOptions} [options={}] - Global configuration options for the library.
     */
    constructor(options = {}) {
        this.defaultTrigger = "contextmenu"; // default trigger event

        const defaultOptions = {
            trigger: this.defaultTrigger, //choice of trigger
            overlapStrategy: "closest", // closest or deepest
            globalFilterStrategy: "hide", // hide or gray out filtered commands
            classes: { // css classes to assign to various elements
                container: "quickctx-container",
                header: "quickctx-header",
                list: "quickctx-list",
                item: "quickctx-item",
                separator: "quickctx-separator",
                sublist: "quickctx-sublist",
                disabled: "quickctx-item--disabled",
                hidden: "quickctx-item--hidden",
                iconPrefix: "quickctx-icon-",
                opening: "quickctx--opening",
                open: "quickctx--open",
                closing: "quickctx--closing",
            },
            animations: { // timing for animations
                submenuOpenDelay: 150,
                menuOpenDuration: 200,
                menuCloseDuration: 200,
                hoverMenuCloseDelay: 600 // Option for hover-triggered menus
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

        /**
         * A map of menu configurations, keyed by menu ID. Each menu configuration represent a combination of commands associated with a specific target type.
         * @type {Object.<string, object>}
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
         * @type {HTMLElement[]}
         * @private
         */
        this.activeSubmenus = [];

        /**
         * A timeout ID for the menu closing animation.
         * @type {number|null}
         * @private
         */
        this.menuHideTimeout = null;

        // EVENT HANDLERS TO OPEN AND CLOSE MENUS

        // Bind 'this' context for all event handlers consistently to maintain instance scope.
        this._boundHandleTrigger = this._handleTriggerEvent.bind(this);
        this._boundOutsideClick = this._handleOutsideClick.bind(this);
        this._boundHandleKeydown = this._handleKeydown.bind(this);

        // for hover-triggered menus
        this._boundHandleHoverEnter = this._handleHoverEnter.bind(this);
        this._boundHandleHoverLeave = this._scheduleHoverHide.bind(this);

        this._init(); // Initialize the context menu manager
    }

    /**
     * Initializes the library, creates the main menu element, sets up event listeners,
     * and parses any HTML-defined menus.
     * @private
     */
    _init() {
        this.menuElement = createElement("div", this.options.classes.container);
        document.body.appendChild(this.menuElement);

        this._setupEventListeners();

        // Parse and register any HTML-defined menus after the DOM is fully loaded.

        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", () =>
                this._parseAndRegisterHtmlDefinedMenus()
            );
        } else {
            this._parseAndRegisterHtmlDefinedMenus();
        }
    }

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
        ];

        // Clear all potential listeners to ensure a clean state before re-adding.
        supportedTriggers.forEach((trigger) =>
            document.removeEventListener(trigger, this._boundHandleTrigger)
        );

        // Collect all unique triggers from the default options and all registered menu configurations.
        const activeTriggers = new Set([this.options.trigger]);
        Object.values(this.menuConfigurations).forEach((config) => {
            if (config.triggerEvent) activeTriggers.add(config.triggerEvent);
        });

        // Add listeners only for the active triggers.
        activeTriggers.forEach((trigger) => {
            if (supportedTriggers.includes(trigger)) {
                document.addEventListener(trigger, this._boundHandleTrigger);
            }
        });

        // Always ensure a 'click' listener is present to handle closing the menu by clicking outside,
        // unless 'click' is already the main trigger.
        if (!activeTriggers.has("click")) {
            document.addEventListener("click", this._boundHandleTrigger);
        }
    }

    /**
     * Updates the library's options at runtime and re-initializes event listeners.
     * @param {ContextMenuOptions} [newOptions={}] - The new options to merge with the current configuration.
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
        // Re-setup event listeners to reflect potential changes in the default trigger.
        this._setupEventListeners();
    }

    _handleTriggerEvent(event) {
        // open logic to implement
    }

    _handleOutsideClick(event) {
        // logic to handle clicks outside the menu (to close it)
    }

    _handleKeydown(event) {
        // logic to handle esc key to close the menu
    }

    _scheduleHoverHide(event) {
        // logic to schedule hiding the menu when using hover as trigger
    }

    _handleHoverEnter(event) {
        // logic to handle hover enter event for hover-triggered menus
    }

    _parseAndRegisterHtmlDefinedMenus() {
        // logic to parse HTML-defined menus and register them
    }
}
