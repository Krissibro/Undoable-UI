import { UndoableElement } from '../UndoableElement.js';
import { Action } from '../Action.js';

/**
 * SelectAction encapsulates a selection change on a <select> element.
 * It records the previous selected value and the new selected value.
 */
export class SelectAction extends Action {
    /**
     * @param {HTMLSelectElement} selectElement - The <select> element.
     * @param {string} previousValue - The value before the change.
     * @param {string} newValue - The value after the change.
     */
    constructor(selectElement, previousValue, newValue) {
        super(selectElement);
        this.previousValue = previousValue;
        this.newValue = newValue;
    }

    /**
     * Executes the action by setting the select element's value to the new value.
     */
    performAction() {
        this.element.value = this.newValue;
    }

    /**
     * Undoes the action by reverting the select element's value to the previous value.
     */
    undo() {
        this.element.value = this.previousValue;
    }
}

/**
 * Select wraps a <select> element to automatically attach event listeners
 * for undo/redo functionality.
 */
export class Select extends UndoableElement {
    constructor(element) {
        super(element);
        // Record the initial selected value.
        this.oldValue = element.value;
        this.attachListeners();
    }

    attachListeners() {
        // On focus, capture the current (old) value.
        this.element.addEventListener('focus', () => {
            this.oldValue = this.element.value;
        });
        // On change, record the new selection if it differs.
        this.element.addEventListener('change', () => {
            const previousValue = this.oldValue;
            const newValue = this.element.value;
            if (previousValue !== newValue) {
                const action = this.createAction(previousValue, newValue);
                window.__GLOBAL_HISTORY__.push(action);
                window.__REDO_STACK__.length = 0; // Clear redo history.
                // Update oldValue for subsequent changes.
                this.oldValue = newValue;
                console.log('Select command recorded:', action);
            }
        });
    }

    /**
     * Creates a SelectAction using the previous and new values.
     * @param {string} previousValue
     * @param {string} newValue
     * @returns {SelectAction}
     */
    createAction(previousValue, newValue) {
        return new SelectAction(this.element, previousValue, newValue);
    }
}
