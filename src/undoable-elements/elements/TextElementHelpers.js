/**
 * Check if the element is contenteditable.
 * @param {HTMLElement} element
 * @returns {boolean}
 */
export function isContentEditable(element) {
    return element.isContentEditable || element.getAttribute('contenteditable') === 'true';
}

/**
 * Retrieve the current text from an element, either value or innerText.
 * @param {HTMLElement} element
 * @returns {string}
 */
export function getValue(element) {
    if (isContentEditable(element)) {
        return element.innerText;
    }
    return element.value;
}

/**
 * Set the text of an element, either value or innerText.
 * @param {HTMLElement} element
 * @param {string} value
 */
export function setValue(element, value) {
    if (isContentEditable(element)) {
        element.innerText = value;
    } else {
        element.value = value;
    }
}