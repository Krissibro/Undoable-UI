import { Action } from '../Action.js';
import {UndoableElement} from "../UndoableElement";

/**
 * TextBoxAction encapsulates a change in a text-based input or contenteditable element.
 */
export class TextAction extends Action {
    /**
     * @param {HTMLElement} element - The text-based element (input, textarea, or contenteditable).
     * @param {string} oldValue - The text before the change.
     * @param {string} newValue - The text after the change.
     */
    constructor(element, oldValue, newValue) {
        super(element);
        this.oldValue = oldValue;
        this.newValue = newValue;
    }

    performAction() {
        setValue(this.element, this.newValue);
    }

    undo() {
        setValue(this.element, this.oldValue);
    }
}


/**
 * TextBox handles text-based inputs (text, search, email, url, number, tel, textarea)
 * and contenteditable elements, allowing partial undo while focused, then merging
 * all edits into one big action on blur.
 */
export class TextBox extends UndoableElement {
    constructor(element) {
        super(element);
        this.attachListeners();
    }

    attachListeners() {
        // We'll store the "focus start" value and partial actions
        this.focusStartValue = null;
        this.partialActions = [];
        this.previousValue = null;


        // On focus, record the initial text for merging later.
        this.element.addEventListener('focus', () => {
            this.focusStartValue = getValue(this.element);
            this.partialActions = [];
            this.previousValue = this.focusStartValue;
        });


        // On input, create partial actions so the user can undo while focused.
        this.element.addEventListener('input', () => {
            const oldVal = this.previousValue;
            const newVal = getValue(this.element);

            if (oldVal !== newVal) {
                const action = new TextAction(this.element, oldVal, newVal);
                window.__GLOBAL_HISTORY__.push(action);
                window.__REDO_STACK__.length = 0;
                this.partialActions.push(action);
                this.previousValue = newVal;
            }
        });


        // On blur (or focusout), remove partial actions and push one merged action
        const blurEvent = isContentEditable(this.element) ? 'focusout' : 'blur';
        this.element.addEventListener(blurEvent, () => {
            const finalValue = getValue(this.element);

            // If no change from focus start, do nothing
            if (this.focusStartValue === finalValue) return;

            // Remove partial actions from global history
            while (this.partialActions.length > 0) {
                const lastPartialAction = this.partialActions.pop();
                // Attempt to remove 'last' from the top of global history
                if (window.__GLOBAL_HISTORY__.includes(lastPartialAction)) {
                    const popped = window.__GLOBAL_HISTORY__.pop();
                    if (popped !== lastPartialAction) {
                        // Put it back if it's not the correct one
                        window.__GLOBAL_HISTORY__.push(popped);
                        break;
                    }
                }
            }
            // Now push one merged action
            const merged = new TextAction(this.element, this.focusStartValue, finalValue);
            window.__GLOBAL_HISTORY__.push(merged);
            window.__REDO_STACK__.length = 0;

            console.log('Merged TextBox action recorded:', merged);

            // Reset
            this.focusStartValue = null;
            this.previousValue = null;
        });
    }
}



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
 * @param {string} val
 */
export function setValue(element, val) {
    if (isContentEditable(element)) {
        element.innerText = val;
    } else {
        element.value = val;
    }
}