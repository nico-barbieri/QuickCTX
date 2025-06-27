/**
 * @typedef {'action' | 'sublist' | 'separator'} CommandType
 * The type of the menu command.
 * - 'action': Executes an action.
 * - 'sublist': Displays a submenu.
 * - 'separator': Displays a divider line or a sub-header.
 */

class MenuCommand {
    /**
     * Creates a MenuCommand instance. MenuCommand class contains the configuration for a single command in a context menu.
     * @param {object} options - Options for the command.
     * @param {string} [options.id=crypto.randomUUID()] - Unique ID for the command.
     * @param {string} [options.label] - The displayed text for the command (not used for 'separator' unless no content is provided).
     * @param {CommandType} [options.type='action'] - The type of command.
     * @param {Function|string} [options.action] - The callback function to execute (for 'action' type) or the name of a registered action.
     * @param {string[]} [options.targetTypes=['*']] - Array of strings specifying for which target types this command is active. ['*'] for all.
     * @param {Array<object|MenuCommand>} [options.subCommands=[]] - Array of MenuCommand configurations or instances for submenus (for 'sublist' type).
     * @param {string|null} [options.iconClass=null] - CSS class for an icon (e.g., from Font Awesome).
     * @param {boolean} [options.disabled=false] - If true, the command is displayed but not clickable.
     * @param {boolean} [options.visible=true] - If true, the command is visible.
     * @param {number} [options.order=0] - Number for ordering commands within the menu.
     * @param {string|HTMLElement|null} [options.content=null] - HTML content or text for a separator, turning it into a sub-header.
     * @param {boolean} [options.isHtmlDefined=false] - Internal flag to indicate if the command was defined via HTML.
     */
    constructor({
        id = window.crypto?.randomUUID ? crypto.randomUUID() : (Date.now().toString(36) + Math.random().toString(36).substring(2)),
        label,
        type = "action",
        action,
        targetTypes = ["*"],
        subCommands = [],
        iconClass = null,
        disabled = false,
        visible = true,
        order = 0,
        content = null,
    }) {
        if (this.type === "separator" && !label) {
            throw new Error(
                `MenuCommand (ID: ${id}): 'label' is required for types other than 'separator'.`
            );
        }

        this.id = id;
        this.label = label;
        this.type = type;
        this.action = action;
        this.targetTypes =
            Array.isArray(targetTypes) && targetTypes.length > 0
                ? targetTypes
                : ["*"];
        this.subCommands = subCommands.map((cmdConfig) => {
            const subCmd =
                cmdConfig instanceof MenuCommand
                    ? cmdConfig
                    : new MenuCommand(cmdConfig);
            subCmd.parentCommand = this; 
            return subCmd;
        });
        this.iconClass = iconClass;
        this.disabled = disabled;
        this.visible = visible;
        this.order = order;
        this.content = content;
    }

    /**
     * A static factory method to create a separator command.
     * @param {string|HTMLElement|null} [content=null] - Optional text or HTML element to display. If provided, the separator acts as a sub-header.
     * @returns {MenuCommand} A new MenuCommand instance of type 'separator'.
     */
    static Separator(content = null) {
        return new MenuCommand({
            type: "separator",
            content: content,
        });
    }
}

export default MenuCommand;
