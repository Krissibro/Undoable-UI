import { Action } from '../Action.js';
import {UndoableElement} from "../UndoableElement";

/**
 * TextBoxAction encapsulates a change in a text-based input or contenteditable element.
 */
export class TextBoxAction extends Action {
    /**
     * @param {HTMLElement} element - The text-based element (input, textarea, or contenteditable).
     * @param {string} previousValue - The text before the change.
     * @param {string} newValue - The text after the change.
     */
    constructor(element, previousValue, newValue) {
        super(element);
        this.previousValue = previousValue;
        this.newValue = newValue;
    }

    /**
     * performAction() sets the element's value/content to the new value.
     */
    performAction() {
        if (this.isContentEditable()) {
            this.element.innerText = this.newValue;
        } else {
            this.element.value = this.newValue;
        }
    }

    /**
     * undo() reverts the element's value/content to the previous value.
     */
    undo() {
        if (this.isContentEditable()) {
            this.element.innerText = this.previousValue;
        } else {
            this.element.value = this.previousValue;
        }
    }

    /**
     * Helper to check if the element is contenteditable.
     */
    isContentEditable() {
        return this.element.isContentEditable || this.element.getAttribute('contenteditable') === 'true';
    }
}


/**
 * TextBox handles text-based inputs (text, search, email, url, number, tel, textarea)
 * and contenteditable elements. It stores the old value on focus and creates
 * an action on blur if the value changed.
 */
export class TextBox extends UndoableElement {
    constructor(element) {
        super(element);
        // We’ll skip password fields intentionally.
        this.attachListeners();
    }

    attachListeners() {
        // Store the old value on focus.
        this.element.addEventListener('focus', () => {
            this.oldValue = this.getCurrentValue();
        });

        // On blur (or focusout for contenteditable), check if the value changed.
        // If so, create an action and push it to the global history.
        const eventType = this.isContentEditable() ? 'focusout' : 'blur';
        this.element.addEventListener(eventType, () => {
            const newValue = this.getCurrentValue();
            if (this.oldValue !== newValue) {
                const action = this.createAction(this.oldValue, newValue);
                window.__GLOBAL_HISTORY__.push(action);
                window.__REDO_STACK__.length = 0;
                this.oldValue = newValue;
                console.log('TextBox command recorded:', action);
            }
        });
    }

    /**
     * Creates a TextBoxAction with the old and new values.
     * @param {string} previousValue
     * @param {string} newValue
     * @returns {TextBoxAction}
     */
    createAction(previousValue, newValue) {
        return new TextBoxAction(this.element, previousValue, newValue);
    }

    /**
     * Helper to retrieve the current text from the element.
     */
    getCurrentValue() {
        if (this.isContentEditable()) {
            return this.element.innerText;
        }
        return this.element.value;
    }

    /**
     * Helper to detect if element is contenteditable.
     */
    isContentEditable() {
        return this.element.isContentEditable || this.element.getAttribute('contenteditable') === 'true';
    }
}