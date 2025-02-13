// src/checkbox.js
import { UndoableElement } from './base.js';

/**
 * CheckboxCommand encapsulates a toggle action on a checkbox.
 */
export class CheckboxAction {
    /**
     * @param {HTMLInputElement} checkbox - The checkbox element.
     * @param {boolean} previousState - The state before the change.
     * @param {boolean} newState - The state after the change.
     */
    constructor(checkbox, previousState, newState) {
        this.checkbox = checkbox;
        this.previousState = previousState;
        this.newState = newState;
    }

    execute() {
        this.checkbox.checked = this.newState;
    }

    undo() {
        this.checkbox.checked = this.previousState;
    }
}

/**
 * CheckboxUndoable wraps a checkbox element to automatically attach an event listener.
 * It extends the base UndoableElement class.
 */
export class CheckboxUndoable extends UndoableElement {
    constructor(element) {
        super(element);
        this.attachListeners();
    }

    attachListeners() {
        this.element.addEventListener('change', (event) => {
            const command = this.createAction(event);
            // Push the command to the global history.
            window.__GLOBAL_HISTORY__.push(command);
            // Clear redo stack
            window.__REDO_STACK__.length = 0;
            console.log('Checkbox command recorded:', command);
        });
    }

    createAction(event) {
        // For toggling, assume the previous state is the opposite of the current.
        const newState = this.element.checked;
        const previousState = !newState;
        return new CheckboxAction(this.element, previousState, newState);
    }
}
