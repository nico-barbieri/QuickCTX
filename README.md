# QuickCTX ✨

**A simple, powerful, and fast library for creating custom context menus on any HTML element.**

QuickCTX allows you to build beautiful, fully functional, and deeply nested context menus with just a few lines of code. It's lightweight, has zero dependencies, and is designed for an excellent developer experience, giving you full control over behavior and appearance.

#### **[➡️ Try the Live Showcase Here!](https://nico-barbieri.github.io/QuickCTX/)**
---

[![NPM Version](https://img.shields.io/npm/v/@nicobarbieri/quickctx?style=flat-square&color=cc3534)](https://www.npmjs.com/package/@nicobarbieri/quickctx)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg?style=flat-square)](https://standardjs.com)

## Index
1. [Key Features](#-key-features)
2. [Installation](#-installation)
3. [Quick Start](#-quick-start)
4. [Core Concepts](#-core-concepts)
5. [Styling & Theming](#-styling--theming)
6. [Advanced Configuration & API Reference](#️-advanced-configuration--api-reference)
7. [Support the project <3](#️-support-the-project)
7. [License](#-license)


## 🚀 Key Features

* **Zero Dependencies:** Pure, vanilla JavaScript for maximum performance and minimum footprint.
* **Highly Configurable:** Control everything from triggers and animations to class names and contextual filtering.
* **Intuitive API:** Get up and running in minutes with the `createAndBindMenu` helper method.
* **Nested Submenus:** Create complex, multi-level submenus with ease.
* **Flexible Action Handling:** Use direct function binding or a clean, event-driven approach.
* **Smart & Efficient:** A central manager handles all menus, optimizing performance with a single set of global event listeners.
* **Fully Themable:** Comes with clean default styles that are a breeze to override with CSS variables or custom classes.

## 📦 Installation

Choose your preferred method to integrate QuickCTX into your project.

### 1. NPM / Yarn

For modern JavaScript projects (like React, Vue, Svelte, etc.), installing from NPM is the recommended approach.

```bash
npm install @nicobarbieri/quickctx
```

or

```bash
yarn add @nicobarbieri/quickctx
```

Then, you can import `QuickCTX` and `MenuCommand` directly into your project:

```javascript
import { QuickCTX, MenuCommand } from '@nicobarbieri/quickctx';
import '@nicobarbieri/quickctx/dist/quickctx.css'; // Import the default style
```
Importing the default stylesheet provides a solid visual foundation. You can use it as a base and easily customize the appearance by overriding its CSS variables, or replace it entirely with your own stylesheet. QuickCTX only handles the necessary internal state (like positioning and `display`) and the dynamic assignment of classes, giving you complete freedom over the final look and feel. See the [Styling & Theming](#-styling--theming) section for more details.

### 2. Browser / CDN

For direct use in HTML files or for quick prototyping, you can use the UMD bundle via a CDN like jsDelivr. Just add this to your HTML file:

```html
<!-- Add the Stylesheet in your <head> -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@nicobarbieri/quickctx/dist/quickctx.css">

<!-- Add the Script at the end of your <body> -->
<script src="https://cdn.jsdelivr.net/npm/@nicobarbieri/quickctx/dist/quickctx.umd.min.js"></script>
```

This will make the `QuickCTX` and `MenuCommand` classes available globally under the `window.QuickCTX` object.

## ⚡ Quick Start

Creating your first context menu takes just a moment.

**HTML:**

```html
<div id="my-element">Right-click me!</div>
```

**JavaScript:**

```javascript
// 1. Initialize the manager
const ctxManager = new QuickCTX();

// 2. Define and bind your menu
ctxManager.createAndBindMenu({
  menuId: 'myFirstMenu',
  selector: '#my-element', // Bind to our div
  structure: [
    { label: "Copy", iconClass: 'fa fa-copy', action: () => console.log("Copy action!") },
    { label: "Paste", iconClass: 'fa fa-paste', action: () => console.log("Paste action!") },
    MenuCommand.Separator(), // Adds a dividing line
    { label: "Delete", iconClass: 'fa fa-trash', action: () => console.log("Delete action!"), disabled: true }
  ]
});
```

## 🧠 Core Concepts

### 1. The `QuickCTX` Manager

First, you create a single instance of the `QuickCTX` class. This "manager" will handle all your menus and their events. You can pass a global configuration object during initialization to set the default behavior for all menus.

```javascript
const ctxManager = new QuickCTX({
  defaultTrigger: 'contextmenu',
  globalFilterStrategy: 'disable' 
});
```
All available configuration options are detailed in the [Advanced Configuration & API Reference](#️-advanced-configuration--api-reference) section.

### 2. Creating & Configuring Menus

The `createAndBindMenu` method is your primary tool. It takes a single configuration object to define a menu's content and behavior, and automatically binds it to the specified HTML elements.

```javascript
ctxManager.createAndBindMenu({
  menuId: 'imageMenu',
  selector: '[data-type="image"]',
  triggerEvent: 'click', // <- Override the global default for this menu only
  headerText: 'Image Actions',
  structure: [ /* ... command objects ... */ ]
});
```

#### Menu Configuration Options

| Property              | Type                             | Description                                                                                              |
| --------------------- | -------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `menuId`              | `string`                         | **Required.** A unique ID for this menu configuration.                                                   |
| `structure`           | `Array<object>`                  | **Required.** The array of command objects that defines the menu's items. See table below.             |
| `selector`            | `string \| HTMLElement \| Array` | A CSS selector or HTML element(s) to automatically bind this menu to.                                    |
| `defaultTargetType`   | `string`                         | A default "type" to apply to all commands in this menu, useful for contextual filtering.                 |
| `headerText`          | `string`                         | Optional text for the menu's header. Can use `{type}` for dynamic replacement (e.g., "Actions for {type}"). |
| `triggerEvent`        | `string`                         | Overrides the global `defaultTrigger` for this specific menu.                                            |
| `filterStrategy`      | `string`                         | Overrides the global `globalFilterStrategy` for this specific menu.                                      |
| `additionalClasses`      | `string`                         | Space-separated list of additional classes to add to the menu.                                      |

#### Command Object Properties (`structure` array items)

| Property      | Type                            | Description                                                                                                              |
| ------------- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `label`       | `string`                        | **Required.** The visible text of the menu item.                                                                         |
| `action`      | `Function \| string`            | The function to execute, or the name of a pre-registered action.                                                         |
| `iconClass`   | `string`                        | Optional. CSS classes for an icon (e.g., `'fa solid fa-star'`).                                                          |
| `disabled`    | `boolean`                       | Optional. If `true`, the item is visible but not clickable. Defaults to `false`.                                         |
| `type`        | `'action'\|'sublist'\|'separator'` | Optional. Defaults to `'action'`. Use `'sublist'` for nested menus.                                                      |
| `subCommands` | `Array<object>`                 | If `type` is `'sublist'`, this holds the structure for the nested submenu.                                               |
| `targetTypes` | `Array<string>`                 | Optional. An array of strings to specify for which element types this command should be active. Defaults to `['*']` (all). |

For separators, you can simply use the static helper `MenuCommand.Separator("Optional Subheader")`. Providing content turns the separator into a sub-header.

### 3. Powerful Contextual Logic with `targetTypes`

This is where QuickCTX shines. You can use a single menu configuration for multiple types of elements and show, hide, or disable commands dynamically.

First, assign types to your HTML elements:

```html
<div class="item" data-custom-ctxmenu="fileMenu" data-custom-ctxmenu-type="folder">Folder</div>
<div class="item" data-custom-ctxmenu="fileMenu" data-custom-ctxmenu-type="image">Image</div>
<div class="item" data-custom-ctxmenu="fileMenu" data-custom-ctxmenu-type="text">Text File</div>
```

Now, define your menu structure using `targetTypes`.

```javascript
ctxManager.createAndBindMenu({
  menuId: 'fileMenu',
  selector: '.item',
  filterStrategy: 'disable', // 'disable' will grey out irrelevant items
  structure: [
    // This command is active for ALL types
    { label: "Properties", action: showProperties, targetTypes: ['*'] },

    // This command is ONLY active for 'folder' type elements
    { label: "Open Folder", action: openFolder, targetTypes: ['folder'] },

    // This command is active for 'image' and 'text' types
    { label: "Edit", action: editFile, targetTypes: ['image', 'text'] },

    MenuCommand.Separator(),
    { label: "Delete", action: deleteItem, targetTypes: ['*'] }
  ]
});
```

When a user interacts with a "folder", the "Open Folder" command will be enabled, while "Edit" will be disabled (or hidden, if `filterStrategy` is set to `'hide'`). This allows for incredibly powerful and clean contextual logic.

### 4. Handling Actions

#### Direct Binding

Pass a function directly to the `action` property. The function receives an object containing the DOM `target` and the `command` configuration.

```javascript
{ 
  label: "Inspect", 
  action: (event) => {
    console.log(`Action executed on element:`, event.target);
    console.log(`Command details:`, event.command.label);
  } 
}
```

#### Event-Driven Approach

For more decoupled code, listen for the `QuickCTXActionSelected` custom event, which is dispatched on the target element whenever an action is executed.

```javascript
document.addEventListener('QuickCTXActionSelected', (e) => {
  const { menuId, commandId, commandLabel, targetElement, targetType } = e.detail;
  console.log(`User selected '${commandLabel}' on an element of type '${targetType}'`);
});
```

## 🎨 Styling & Theming

You have full control over the appearance of your menus.

#### Method 1: Overriding CSS Variables (Easy & Recommended)

This is the simplest way to quickly theme your menus. The default stylesheet is built with CSS custom properties (variables) that you can easily override.

**Example:** Let's replicate the theme from the project's example page.

In your main CSS file (like `index.css`), you can define your site's color palette, and then create a ruleset for `.quickctx-container` that maps your theme to QuickCTX's variables.

```css
/* 1. Your site's main theme variables */
body {
    --primary-color: #1B9AAA;
    --secondary-color-lighter: hsl(43, 55%, 95%);
    --element-background-hover: #DDDBCB;
    --text-color: #101010;
    --border-color: rgba(0, 0, 0, 0.125);
    --basic-shadow: 0px 2px 8px rgba(0,0,0,0.1);
}

/* 2. Map your theme to QuickCTX's variables */
.quickctx-container {
    --quickctx-background: var(--secondary-color-lighter);
    --quickctx-element-background-hover: var(--element-background-hover);
    --quickctx-text-color: var(--text-color);
    --quickctx-border-color: var(--border-color);
    --quickctx-header-text-color: var(--primary-color);
    --quickctx-shadow: var(--basic-shadow);
    --quickctx-font-family: 'Inter', sans-serif;
    --quickctx-border-radius: 8px;
}
```

#### Method 2: Overriding CSS Classes (Advanced)

For deeper integration or to use a different styling methodology (like Tailwind CSS), you can provide your own class names via the `classes` option in the constructor.

**Hybrid Approach (Recommended for overrides):**
A great strategy is to keep the default class and add your own custom class for overrides. This way, you inherit the base functionality and only style what you need.

**JavaScript:**
```javascript
// In your QuickCTX initialization
const ctxManager = new QuickCTX({
  classes: {
    // Keep the default class and add our custom one
    container: 'quickctx-container ctxstyle-override'
  }
});
```

**CSS:**
Now in your CSS, you can target `.ctxstyle-override` to add or change styles with high specificity.
```css
/* Your custom override class from the example page */
.dark-theme .quickctx-container.ctxstyle-override {
    --quickctx-background: var(--element-background);
    --quickctx-header-background: transparent;

    /* Add a modern backdrop filter for dark mode */
    backdrop-filter: blur(10px) brightness(0.8);
}
```

**Total Replacement Approach:**
You can also completely replace the default classes if you plan to write all the styles from scratch.

```javascript
const ctxManager = new QuickCTX({
  classes: {
    container: 'shadow-lg bg-white rounded-md border',
    item: 'px-4 py-2 hover:bg-blue-500',
    disabled: 'opacity-50 cursor-not-allowed'
  }
});
```
*Note: If you replace the classes entirely, you will be responsible for recreating all base styles, including, for example, animations handled by classes like `.quickctx--open` and `.quickctx--closing`.*

The full list of overridable classes and CSS variables are available in the [Advanced Configuration & API Reference](#️-advanced-configuration--api-reference) section.

## ⚙️ Advanced Configuration & API Reference

You can pass a configuration object to the `new QuickCTX(options)` constructor to set global defaults. Many of these can be overridden on a per-menu basis in `createAndBindMenu`.

#### Main `options` Object

| Property                 | Type     | Default         | Description                                                                                                    |
| ------------------------ | -------- | --------------- | -------------------------------------------------------------------------------------------------------------- |
| `defaultTrigger`         | `string` | `'contextmenu'` | Default trigger event. Options: `'contextmenu'`, `'click'`, `'dblclick'`, `'hover'`.                             |
| `globalFilterStrategy`   | `string` | `'hide'`        | What to do with commands that don't match the element type. Options: `'hide'`, `'disable'`.                      |
| `overlapStrategy`        | `string` | `'closest'`     | For nested elements, which menu to show. Options: `'closest'`, `'deepest'`.                                      |
| `animations`             | `object` | `{...}`         | An object to control all animation timings. See table below.                                                   |
| `classes`                | `object` | `{...}`         | An object to override default CSS class names. See table below.                                                |

#### `animations` Object

| Property                | Type     | Default | Description                                                        |
| ----------------------- | -------- | ------- | ------------------------------------------------------------------ |
| `menuOpenDuration`      | `number` | `200`   | Duration in ms of the main menu opening animation.                 |
| `menuCloseDuration`     | `number` | `200`   | Duration in ms of the main menu closing animation.                 |
| `hoverMenuOpenDelay`    | `number` | `450`   | Delay in ms before a hover-triggered menu opens.                   |
| `hoverMenuCloseDelay`   | `number` | `300`   | Delay in ms before a hover-triggered menu closes after mouseout.   |
| `submenuOpenDelay`      | `number` | `150`   | Delay in ms for opening submenus on hover.                         |
| `submenuCloseDelay`     | `number` | `200`   | Delay in ms before closing submenus after mouse leave.             |

#### `classes` Object

| Property           | Default                        | Description                                     |
| ------------------ | ------------------------------ | ----------------------------------------------- |
| `container`        | `'quickctx-container'`         | The main menu container `<div>`.                |
| `header`           | `'quickctx-header'`            | The header `<div>`.                             |
| `list`             | `'quickctx-list'`              | The `<ul>` element holding the commands.        |
| `item`             | `'quickctx-item'`              | The `<li>` element for a single command.        |
| `separator`        | `'quickctx-separator'`         | A `<li>` used as a separator line.              |
| `sublist`          | `'quickctx-sublist'`           | A class added to submenu containers (`<div>`).  |
| `sublistCommand`   | `'quickctx-sublist-command'`   | A class added to `<li>` items that open submenus. |
| `disabled`         | `'quickctx-item--disabled'`    | Added to disabled `<li>` items.                 |
| `hidden`           | `'quickctx-item--hidden'`      | (Not used by default, available for custom CSS) |
| `icon`             | `'quickctx-icon'`              | The `<span>` wrapper for an icon.               |
| `opening`          | `'quickctx--opening'`          | State class during the opening animation.       |
| `open`             | `'quickctx--open'`             | State class when the menu is fully open.        |
| `closing`          | `'quickctx--closing'`          | State class during the closing animation.       |

#### All CSS Variables

| Variable                              | Default          | Description                               |
| ------------------------------------- | ---------------- | ----------------------------------------- |
| `--quickctx-background`               | `#ffffff`        | Main background color of the menu.        |
| `--quickctx-element-background-hover` | `#f0f0f0`        | Background of items on hover.             |
| `--quickctx-header-background`        | `#f7f7f7`        | Background color of the header.           |
| `--quickctx-header-text-color`        | `#555555`        | Text color of the header.                 |
| `--quickctx-text-color`               | `#333333`        | Default text color for items.             |
| `--quickctx-text-color-hover`         | `#000000`        | Text color for items on hover.            |
| `--quickctx-text-color-disabled`      | `#aaaaaa`        | Text color for disabled items.            |
| `--quickctx-border-size`              | `1px`            | Border width for menu and separators.     |
| `--quickctx-border-color`             | `#cccccc`        | Border color for the menu.                |
| `--quickctx-container-padding`        | `4px 0`          | Padding for the main container.           |
| `--quickctx-element-padding`          | `8px 12px 8px 24px` | Padding for individual menu items.        |
| `--quickctx-header-padding`           | `6px 12px`       | Padding for the header.                   |
| `--quickctx-border-radius`            | `4px`            | Corner radius for the menu.               |
| `--quickctx-min-width`                | `180px`          | Minimum width of the menu.                |
| `--quickctx-font-family`              | `Arial, sans-serif` | Font family used in the menu.             |
| `--quickctx-font-size`                | `14px`           | Base font size.                           |
| `--quickctx-shadow`                   | `2px 2px...`     | Box shadow for the menu.                  |

#### Public Methods

| Method                                       | Description                                                                                           |
| -------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `createAndBindMenu(menuOptions)`             | The primary method to create, configure, and bind a menu in a single call.                            |
| `addMenuConfiguration(config)`               | Adds a menu configuration to the manager without binding it to any elements.                          |
| `updateMenuConfiguration(menuId, newOptions)` | Updates an existing menu configuration at runtime (e.g., to change its trigger).     |
| `updateMenuCommand(menuId, action, updates)` | Updates one or more properties of a specific command at runtime, searching by its associated action (the string used to register it or the function itself) and menu id. |
| `bindMenuToElements(selector, menuId, type)` | Binds an existing menu configuration to one or more elements.                                         |
| `unbindMenuFromElements(selector)`           | Removes menu bindings from one or more elements.                                                      |
| `registerAction(name, callback)`             | Registers a named action that can be referenced by string in the `structure` array.                   |
| `setLogger(loggerFunction)`                  | Sets a custom function to handle library logs (e.g., to display them in a custom UI element).          |
| `setLoggerIsEnabled(boolean)`                | Enables or disables logging to the console or the custom logger.                                      |
| `updateOptions(newOptions)`                  | Updates the manager's configuration at runtime.                                                       |

## ❤️ Support the Project

If you find QuickCTX useful and want to support its development, you could offer me a [ko-fi](https://ko-fi.com/V7V11GPBTJ)! Any support is greatly appreciated. ;) 

<br>

<div align="center">

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/V7V11GPBTJ)

</div>

## 📄 License

QuickCTX is open-source software licensed under the [MIT License](LICENSE).
