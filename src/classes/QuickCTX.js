import { createElement } from "../utils/utils.js";
import MenuCommand from "./MenuCommand.js";

/**
 * Configurable CSS classes for the context menu elements.
 * @typedef {object} QuickCTXClassesOptions
 * @property {string|string[]} [container='quickctx-container'] - CSS class for the main menu container.
 * @property {string|string[]} [header='quickctx-header'] - CSS class for the menu header.
 * @property {string|string[]} [list='quickctx-list'] - CSS class for the <ul> list of commands.
 * @property {string|string[]} [item='quickctx-item'] - CSS class for menu <li> elements (commands).
 * @property {string|string[]} [separator='quickctx-separator'] - CSS class for separators.
 * @property {string|string[]} [sublist='quickctx-sublist'] - CSS class for <li> items that open submenus.
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
 * @property {number} [hoverMenuCloseDelay=600] - Delay in ms before closing a hover-triggered menu.
 * @property {number} [submenuCloseDelay=200] - Delay in ms before closing submenus after mouse leave.
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
 * @property {string} [headerText] - Optional text for the menu's header. If header is missing or empty, header will not be displayed.
 * @property {string} [triggerEvent] - Optional specific trigger event for this menu, overriding the global default.
 * @property {'hide' | 'disable'} [filterStrategy] - Overrides the global filter strategy for this menu.
 */

/**
 * @typedef {object} ContextMenuConfigOptions
 * @property {string} id - The unique ID for this menu configuration, used to link it to HTML elements.
 * @property {string} [headerTextTemplate=""] - A template for the menu's header text. If header is missing or empty, header will not be displayed. Use `{type}` to insert the target type dynamically (ex. "Element: {type}").
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
     * @param {QuickCTXOptions} [options={}] - Global configuration options for the library.
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
                hoverMenuCloseDelay: 600, // Option for hover-triggered menus
                submenuCloseDelay: 200, // Delay before closing submenus
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

        /**
         * A timeout ID for the hover-triggered menu hiding delay.
         * @type {number|null}
         * @private
         */
        this.hoverHideTimeout = null;

        // EVENT HANDLERS TO OPEN AND CLOSE MENUS

        // Bind 'this' context for all event handlers consistently to maintain instance scope.
        this._boundHandleTrigger = this._handleTriggerEvent.bind(this);
        this._boundOutsideClick = this._handleOutsideClick.bind(this);
        this._boundHandleKeydown = this._handleKeydown.bind(this);

        // for hover-triggered menus
        this._boundHandleHoverEnter = this._cancelHoverHide.bind(this);
        this._boundHandleHoverLeave = this._scheduleHoverHide.bind(this);

        this._init(); // Initialize the context menu manager
    }

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

    /**
     * Initializes the library, creates the main menu element, sets up event listeners,
     * and parses any HTML-defined menus.
     * @private
     */
    _init() {
        this._log({ event: "init", message: "Initializing QuickCTX" });

        this.menuElement = createElement("div", this.options.classes.container);

        Object.assign(this.menuElement.style, {
            position: "fixed", // garantees the menu is positioned relative to the viewport
            zIndex: "10000", // A high default z-index
            display: "none", // Start hidden
        });

        document.body.appendChild(this.menuElement);

        this._setupEventListeners();

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
            document.addEventListener("click", this._boundOutsideClick);
        } else {
            document.removeEventListener("click", this._boundOutsideClick);
        }

        this._log({
            event: "setupListeners",
            message: "Event listeners set up",
            data: { activeTriggers: Array.from(activeTriggers) },
        });
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

        this._log({
            event: "updateOptions",
            message: "Updating options...",
            data: this.options,
        });
        // Re-setup event listeners to reflect potential changes in the default trigger.
        this._setupEventListeners();
    }

    _handleTriggerEvent(event) {
        if (this.menuElement.classList.contains(this.options.classes.closing))
            return; // Prevent handling if the menu is currently closing. NOTE: add class assignation handling logic

        this._log({
            event: "handleTrigger",
            message: `Handling trigger event: ${event.type}`,
            data: { target: event.target },
        });

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
            this._log({
                event: "handleTrigger",
                message: `No menu configuration found for ID: ${menuId}`,
                data: { menuId },
                isError: true,
            });

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
            this._cancelHoverHide();
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

        this._buildAndShowMenu(
            config,
            targetElement,
            targetType,
            event.clientX,
            event.clientY
        );

        // logic to build the menu based on the configuration

        this._log({
            event: "handleTrigger",
            message: `Triggering menu ${menuId} for target type: ${targetType}`,
        });

        if (expectedTrigger === "hover") {
            this._log({
                event: "handleTrigger",
                message: `Managing hover trigged menu for target type: ${targetType}`,
            });

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

    _handleKeydown(event) {
        if (event.key === "Escape") this._hideMenu();
    }

    _scheduleHoverHide() {
        this._cancelHoverHide();
        this.hoverHideTimeout = setTimeout(() => {
            this._hideMenu();
        }, this.options.animations.hoverMenuCloseDelay);
    }

    _cancelHoverHide() {
        if (this.hoverHideTimeout) {
            clearTimeout(this.hoverHideTimeout);
            this.hoverHideTimeout = null;
        }
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
        const menuToBuild = parentMenuElement || this.menuElement;
        if (!parentMenuElement) {
            if (this.menuHideTimeout) {
                clearTimeout(this.menuHideTimeout);
                this.menuHideTimeout = null;
            }
            this.menuElement.classList.remove(
                this.options.classes.closing,
                this.options.classes.open,
                this.options.classes.opening
            );
            const savedTarget = this.currentTargetElement;
            this._hideMenu(); // Hide any currently active menu before building a new one
            this.currentTargetElement = savedTarget; // Restore the current target element
            this.activeMenuElement = menuToBuild;
        } else {
            this.activeSubmenus.push(menuToBuild);
            menuToBuild.classList.remove(
                this.options.classes.closing,
                this.options.classes.open,
                this.options.classes.opening
            );
        }

        menuToBuild.innerHTML = "";

        if (!parentMenuElement) {
            const headerTextTemplate = config.headerTextTemplate;
            const headerText =
                headerTextTemplate?.replace(/{type}/g, targetType) || "";

            if (headerText) {
                menuToBuild.appendChild(
                    createElement(
                        "div",
                        this.options.classes.header,
                        {},
                        headerText
                    )
                );
            }
        }

        const ul = createElement("ul", this.options.classes.list);
        let visibleItems = 0;
        config.commands.forEach((command) => {
            const typeMatch =
                command.targetTypes.includes("*") ||
                command.targetTypes.includes(targetType);
            if (!typeMatch && command.visible) return;
            if (!command.visible) return;
            let effectiveDisabled = command.disabled;
            if (!typeMatch) {
                if (
                    (config.filterStrategy ||
                        this.options.globalFilterStrategy) === "hide"
                )
                    return;
                effectiveDisabled = true;
            }
            ul.appendChild(
                this._createMenuItemDOM(
                    command,
                    targetElement,
                    effectiveDisabled,
                    parentMenuElement !== null
                )
            );
            visibleItems++;
        });
        if (visibleItems === 0) {
            if (!parentMenuElement) this._hideMenu(true);
            else parentCommand?.element.classList.remove("has-submenu-arrow");
            return null;
        }
        menuToBuild.appendChild(ul);

        this._showMenuDOM(
            menuToBuild,
            x,
            y,
            targetElement,
            parentMenuElement !== null,
            parentCommand
        );
        if (!parentMenuElement) {
            document.addEventListener("click", this._boundOutsideClick, true);
            document.addEventListener("keydown", this._boundHandleKeydown);
        }
        return menuToBuild;
    }

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
            if (isDisabled) return;

            // Close any submenus that don't belong to this item's parent chain.
            this._closeSiblingSubmenus(command);

            // If this item is a sublist, schedule its opening.
            if (command.type === "sublist" && command.subCommands?.length > 0) {
                this._scheduleSubmenuOpen(command, li, targetElement);
            }
        });

        li.addEventListener("mouseleave", () => {
            this._cancelSubmenuOpen(command);
            this._scheduleSubmenuClose(command);
        });

        if (command.type === "sublist" && command.subCommands?.length > 0) {
            li.classList.add(this.options.classes.sublist, "has-submenu-arrow");
            li.appendChild(
                createElement("span", "submenu-arrow", {}, " \u25B6")
            );
            let hoverTimeout;

            li.addEventListener("mouseenter", (e) => {
                if (isDisabled) return;
                const currentLevel = this.activeSubmenus.indexOf(
                    command.submenuElement
                );

                this._closeSubmenus();

                if (
                    command.type === "sublist" &&
                    command.subCommands?.length > 0
                ) {
                    hoverTimeout = setTimeout(() => {
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
                                "submenu",
                            ]);
                            Object.assign(subMenuEl.style, {
                                position: "fixed",
                                zIndex: "10000",
                                display: "none",
                            });
                            document.body.appendChild(subMenuEl);
                            command.submenuElement = subMenuEl;
                        }
                        const rect = li.getBoundingClientRect();
                        this._buildAndShowMenu(
                            {
                                commands: command.subCommands,
                                filterStrategy:
                                    command.filterStrategy ||
                                    this.options.globalFilterStrategy,
                            },
                            targetElement,
                            targetElement.dataset.customCtxmenuType ||
                                "default",
                            rect.right,
                            rect.top,
                            subMenuEl,
                            command
                        );
                    }, this.options.animations.submenuOpenDelay);
                }
            });

            li.addEventListener("mouseleave", () => clearTimeout(hoverTimeout));
        } else if (command.type === "action") {
            li.addEventListener("click", (event) => {
                event.stopPropagation();
                if (isDisabled) return;
                let action = command.action;

                if (typeof action === "string")
                    action = this.registeredActions[action];

                if (action === undefined) {
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
                    } catch (err) {
                        this._log({
                            event: "actionError",
                            message: `Error executing action for command "${command.label}"`,
                            data: {
                                commandId: command.id,
                                commandLabel: command.label,
                                error: err.message,
                            },
                            isError: true,
                        });

                        throw new Error(
                            `Error executing action for command "${command.label}": ${err.message}`
                        );
                    }
                }

                this.currentTargetElement?.dispatchEvent(
                    new CustomEvent("QuickCTXActionSelected", {
                        detail: {
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

                this._hideMenu();
            });
        }
        return li;
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
                "submenu",
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
        subMenuEl.addEventListener("mouseenter", () =>
            this._cancelSubmenuClose(command)
        );
        subMenuEl.addEventListener("mouseleave", () =>
            this._scheduleSubmenuClose(command)
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
    _scheduleSubmenuClose(command) {
        this._cancelSubmenuClose(command);
        command.closeTimeout = setTimeout(() => {
            const submenuInfo = this.activeSubmenus.find(
                (s) => s.parentCommand === command
            );
            if (submenuInfo) {
                this._closeSingleSubmenu(submenuInfo);
                this.activeSubmenus = this.activeSubmenus.filter(
                    (s) => s.parentCommand !== command
                );
            }
        }, this.options.animations.submenuCloseDelay);
    }
    _cancelSubmenuClose(command) {
        if (command.closeTimeout) {
            clearTimeout(command.closeTimeout);
            command.closeTimeout = null;
        }
    }
    _closeSingleSubmenu(submenuInfo, instant = false) {
        const submenu = submenuInfo.element;
        if (!submenu) return;
        // Clean up its listeners
        submenu.removeEventListener("mouseenter", this._cancelSubmenuClose);
        submenu.removeEventListener("mouseleave", this._scheduleSubmenuClose);
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
    _closeSiblingSubmenus(command) {
        for (let i = this.activeSubmenus.length - 1; i >= 0; i--) {
            const submenuInfo = this.activeSubmenus[i];
            // Check if submenu's parent is the current command
            let isChild = false;
            let current = command;
            while (current && current.parentCommand) {
                if (current.parentCommand === submenuInfo.parentCommand) {
                    isChild = true;
                    break;
                }
                current = current.parentCommand;
            }
            if (submenuInfo.parentCommand !== command && !isChild) {
                this._closeSingleSubmenu(submenuInfo);
                this.activeSubmenus.splice(i, 1);
            }
        }
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
        parentCommand
    ) {
        menuDomElement.style.display = "block";
        menuDomElement.classList.remove(this.options.classes.closing);
        menuDomElement.classList.add(this.options.classes.opening);
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

    /**
     * Recursively closes open submenus.
     * @private
     */
    _closeSubmenus(fromLevel = 0, instant = false) {
        while (this.activeSubmenus.length > fromLevel) {
            const submenu = this.activeSubmenus.pop();
            if (!submenu) continue;
            const close = () => {
                submenu.style.display = "none";
                submenu.classList.remove(
                    this.options.classes.open,
                    this.options.classes.opening,
                    this.options.classes.closing
                );
                submenu.innerHTML = "";
                if (submenu.parentElement === document.body)
                    document.body.removeChild(submenu);
            };
            if (instant) close();
            else {
                submenu.classList.remove(this.options.classes.open);
                submenu.classList.add(this.options.classes.closing);
                setTimeout(close, this.options.animations.menuCloseDuration);
            }
        }
    }

    _hideMenu(instant = false) {
        // logic to hide the currently active menu

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

        document.removeEventListener("click", this._boundOutsideClick, true);
        document.removeEventListener("keydown", this._boundHandleKeydown);

        if (this.currentTargetElement) {
            this.currentTargetElement.removeEventListener(
                "mouseleave",
                this._boundHandleHoverLeave
            );
            this.currentTargetElement.removeEventListener(
                "mouseenter",
                this._boundHandleHoverEnter
            );
        }
        if (this.activeMenuElement) {
            this.activeMenuElement.removeEventListener(
                "mouseleave",
                this._boundHandleHoverLeave
            );
            this.activeMenuElement.removeEventListener(
                "mouseenter",
                this._boundHandleHoverEnter
            );
        }
        this._cancelHoverHide();

        if (this.menuHideTimeout) clearTimeout(this.menuHideTimeout);

        if (this.activeMenuElement) {
            const menuToHide = this.activeMenuElement;
            const hide = () => {
                menuToHide.style.display = "none";
                menuToHide.classList.remove(
                    this.options.classes.open,
                    this.options.classes.opening,
                    this.options.classes.closing
                );
                menuToHide.innerHTML = "";
                if (this.activeMenuElement === menuToHide)
                    this.activeMenuElement = null;
            };
            if (instant || this.options.animations.menuCloseDuration === 0) {
                hide();
            } else {
                menuToHide.classList.remove(
                    this.options.classes.open,
                    this.options.classes.opening
                );
                menuToHide.classList.add(this.options.classes.closing);
                this.menuHideTimeout = setTimeout(() => {
                    hide();
                    this.menuHideTimeout = null;
                }, this.options.animations.menuCloseDuration);
            }
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
            this.menuElement.classList.contains(this.options.classes.opening)
        ) {
            return;
        }

        // If the click is inside the active menu, do nothing.
        if (this.activeMenuElement.contains(event.target)) {
            return;
        }

        this._hideMenu();
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
                            actionName = `quickctx-action-${crypto.randomUUID()}`;
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
                filterStrategy:
                    this.menuConfigurations[configOptions.id].filterStrategy,
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
        if (typeof callback !== "function" && callback !== null) {
            console.error(
                `Callback for action "${actionName}" must be a function or null.`
            );
            return;
        }
        this.registeredActions[actionName] = callback;
    }
}

export default QuickCTX;
