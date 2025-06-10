import { createElement } from "../utils/utils.js";
import MenuCommand from "./MenuCommand.js";

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

// MAIN PARAMS DEFINITION

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
 * @property {string} [defaultTargetType] - A default 'type' or category to apply to all commands in this menu. This can be overridden by individual commands. It's used for filtering.
 * @property {string|HTMLElement|HTMLElement[]} [selector] - An optional CSS selector, a single HTML element, or an array of elements to bind this menu to automatically.
 * @property {Array<MenuItemDefinition|MenuCommand>} structure - The array that defines the menu's structure and items.
 * @property {string} [headerText] - Optional text for the menu's header. Defaults to "Menu".
 * @property {string} [triggerEvent] - Optional specific trigger event for this menu, overriding the global default.
 * @property {'hide' | 'disable'} [filterStrategy] - Overrides the global filter strategy for this menu.
 */

/**
 * @typedef {object} ContextMenuConfigOptions
 * @property {string} id - The unique ID for this menu configuration, used to link it to HTML elements.
 * @property {string} [headerTextTemplate="Element: {type}"] - A template for the menu's header text. The `{type}` placeholder will be replaced with the target element's type.
 * @property {Array<object|MenuCommand>} commands - An array of MenuCommand instances or configuration objects that define the menu's items.
 * @property {string} [triggerEvent] - Overrides the default trigger for this specific menu.
 * @property {'hide' | 'disable'} [filterStrategy] - Overrides the global filter strategy for this menu.
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
     * @param {ContextMenuOptions} [options={}] - Global configuration options for the library.
     */
    constructor(options = {}) {
        this.defaultTrigger = "contextmenu"; // default trigger event

        const defaultOptions = {
            trigger: this.defaultTrigger, //choice of trigger
            overlapStrategy: "closest", // closest or deepest
            globalFilterStrategy: "hide", // hide or gray out filtered commands
            classes: {
                // css classes to assign to various elements
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
            animations: {
                // timing for animations
                submenuOpenDelay: 150,
                menuOpenDuration: 200,
                menuCloseDuration: 200,
                hoverMenuCloseDelay: 600, // Option for hover-triggered menus
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

    setLogger(logger) {
        /**
         * Sets a custom logger function for logging messages.
         * @param {Function} logger - A function that takes a message and optional data to log.
         */
        if (typeof logger === "function") {
            this.logger = logger;
        } else {
            console.warn(
                "Logger must be a function. Default logging will be used."
            );
            this.logger = console.log; // Fallback to console.log if no valid logger is provided
        }
    }

    setLoggerIsEnabled(enabled) {
        /**
         * Enables or disables logging.
         * @param {boolean} enabled - If true, logging is enabled; if false, logging is disabled.
         */
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

    /**
     * Initializes the library, creates the main menu element, sets up event listeners,
     * and parses any HTML-defined menus.
     * @private
     */
    _init() {
        this._log({ event: "init", message: "Initializing QuickCTX" });

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

        this._log({ event: "init", message: "QuickCTX initialized" });
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

        this._log({ event: "setupListeners", message: "Event listeners set up", data: { activeTriggers: Array.from(activeTriggers) } });
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

        this._log({ event: "updateOptions", message: "Updating options...", data: this.options });
        // Re-setup event listeners to reflect potential changes in the default trigger.
        this._setupEventListeners();
    }

    _handleTriggerEvent(event) {
        if (this.menuElement.classList.contains(this.options.classes.closing))
            return; // Prevent handling if the menu is currently closing. NOTE: add class assignation handling logic

        this._log({ event: "handleTrigger", message: `Handling trigger event: ${event.type}`, data: { target: event.target } });

        let targetElement =
            this.options.overlapStrategy === "deepest" &&
            event.target.matches("[data-custom-ctxmenu]")
                ? event.target
                : event.target.closest("[data-custom-ctxmenu]");

        // if no target is found, return and optionally hide the menu
        if (!targetElement) {
            if (
                event.type === "click" &&
                this.activeMenuElement &&
                !this.menuElement.contains(event.target)
            )
                this._hideMenu();
            return;
        }

        const menuId = targetElement.getAttribute("data-custom-ctxmenu") || "";
        const config = this.menuConfigurations[menuId];

        if (!config) {
            this._log({ event: "handleTrigger", message: `No menu configuration found for ID: ${menuId}`, data: { menuId }, isError: true });
            
            if (
                event.type === "click" &&
                this.activeMenuElement &&
                !this.menuElement.contains(event.target)
            )
                this._hideMenu();
            return;
        }

        const eventTriggerType =
            event.type === "mouseover" ? "hover" : event.type;
        const expectedTrigger = config.triggerEvent || this.options.trigger;

        if (eventTriggerType !== expectedTrigger) {
            if (
                event.type === "click" &&
                this.activeMenuElement &&
                !this.menuElement.contains(event.target)
            )
                this._hideMenu();
            return;
        }

        if (expectedTrigger === "hover") {
            this._handleHoverEnter();
            if (
                this.activeMenuElement &&
                this.currentTargetElement === targetElement
            )
                return;
        }

        event.preventDefault();
        event.stopPropagation();

        this.currentTargetElement = targetElement;

        const targetType =
            targetElement.getAttribute("data-custom-ctxmenu-type") || "default";

        // logic to build the menu based on the configuration

        this._log({
            event: "handleTrigger", message: `Triggering menu ${menuId} for target type: ${targetType}`})

        if (expectedTrigger === "hover") {
            this._log({
                event: "handleTrigger",
                message: `Managing hover trigged menu for target type: ${targetType}`});

            targetElement.addEventListener(
                "mouseleave",
                this._boundHandleHoverLeave
            );
            this.menuElement.addEventListener(
                "mouseleave",
                this._boundHandleHoverLeave
            );
            targetElement.addEventListener(
                "mouseenter",
                this._boundHandleHoverEnter
            );
            this.menuElement.addEventListener(
                "mouseenter",
                this._boundHandleHoverEnter
            );
        }
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

    _hideMenu() {
        // logic to hide the currently active menu

        this._log({
            event: "hideMenu",
            message: `Hiding menu: ${this.activeMenuElement ? this.activeMenuElement.id : "none"}`,
            data: { activeMenuId: this.activeMenuElement ? this.activeMenuElement.id : null }});
    }

    /**
     * The primary helper method to define, configure, and bind a menu in a single call.
     * @param {MenuCreationOptions} options - Configuration for creating and binding the menu.
     */
    createAndBindMenu({
        menuId,
        defaultTargetType,
        selector,
        structure,
        headerText,
        triggerEvent,
        filterStrategy,
    }) {
        if (!menuId || !structure) {

            this._log({
                event: "createAndBindMenu",
                message: "Failed to create and bind menu: missing required parameters.",
                isError: true,
            });

            throw new Error(
                "`menuId` and `structure` are required for createAndBindMenu.")
        }

        const processStructure = (struct, defaultType) => {
            return struct
                .map((item) => {
                    if (item instanceof MenuCommand) {
                        if (
                            item.targetTypes.length === 1 &&
                            item.targetTypes[0] === "*"
                        ) {
                            item.targetTypes = [defaultType];
                        }
                        return item;
                    }

                    if (typeof item !== "object" || item === null) return null;
                    const commandConf = { ...item };

                    if (typeof commandConf.action === "function") {
                        const actionFunc = commandConf.action;
                        let actionName = this.functionActionMap.get(actionFunc);

                        if (!actionName) {
                            actionName = `quickctx-action-${crypto.randomUUID()}`;
                            this.registerAction(actionName, actionFunc);
                            this.functionActionMap.set(actionFunc, actionName);
                        }
                        commandConf.action = actionName;
                    }

                    if (!commandConf.targetTypes && defaultType) {
                        commandConf.targetTypes = [defaultType];
                    }

                    if (
                        commandConf.subCommands &&
                        Array.isArray(commandConf.subCommands)
                    ) {
                        commandConf.subCommands = processStructure(
                            commandConf.subCommands,
                            defaultType
                        );
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
            message: `Processed commands for menu ${menuId}`});


        const menuConfig = {
            id: menuId,
            headerTextTemplate: headerText || "Menu",
            commands,
            triggerEvent,
            filterStrategy,
        };

        this.addMenuConfiguration(menuConfig);
        

        if (selector && defaultTargetType) {
            this.bindMenuToElements(selector, menuId, defaultTargetType);
        }
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
                el.dataset.customCtxmenuType = type;
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

        if (
            this.menuConfigurations[configOptions.id] &&
            !this.menuConfigurations[configOptions.id].isHtmlSource
        ) {
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
            triggerEvent: configOptions.triggerEvent || this.options.trigger,
            filterStrategy:
                configOptions.filterStrategy ||
                this.options.globalFilterStrategy,
        };

        this._log({
            event: "addMenuConfiguration",
            message: `Menu configuration added for ID: ${configOptions.id}`,
            data: {
                commandsCount: commands.length,
                filterStrategy: this.menuConfigurations[configOptions.id].filterStrategy,
            },
        });

        this._setupEventListeners();
    }

    /**
     * Registers a named action that can be referenced by commands.
     * @param {string} actionName - The unique name for the action.
     * @param {Function} callback - The function to execute. It receives `(targetElement, command)`.
     */
    registerAction(actionName, callback) {
        if (typeof callback !== "function") {
            console.error(
                `Callback for action "${actionName}" must be a function.`
            );
            return;
        }
        this.registeredActions[actionName] = callback;
    }
}

export default QuickCTX;
