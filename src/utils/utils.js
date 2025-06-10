/**
 * Creates a DOM element with specified classes and attributes.
 * @param {string} tag - The HTML tag of the element to create.
 * @param {string|string[]} [classes=[]] - A string or array of strings for CSS classes.
 * @param {object} [attributes={}] - An object with key-value pairs for attributes.
 * @param {string} [textContent=''] - The text content of the element.
 * @returns {HTMLElement} The created HTML element.
 */
function createElement(tag, classes = [], attributes = {}, textContent = '') {
    const el = document.createElement(tag);
    if (classes) {
        const classArray = Array.isArray(classes) ? classes : [classes];
        classArray.forEach(cls => cls && el.classList.add(cls));
    }
    for (const attr in attributes) {
        if (Object.prototype.hasOwnProperty.call(attributes, attr)) {
            el.setAttribute(attr, attributes[attr]);
        }
    }
    if (textContent) {
        el.textContent = textContent;
    }
    return el;
}

export { createElement };
