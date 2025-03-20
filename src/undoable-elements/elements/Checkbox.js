import { UndoableElement } from '../UndoableElement.js';
import { Action } from '../Action.js';

/**
 * CheckboxCommand encapsulates a toggle action on a checkbox.
 */
export class CheckboxAction extends Action {
    /**
     * @param {HTMLInputElement} checkbox - The checkbox element.
     * @param {boolean} previousState - The state before the change.
     * @param {boolean} newState - The state after the change.
     */
    constructor(checkbox, previousState, newState) {
        super(checkbox)
        this.previousState = previousState;
        this.newState = newState;
    }

    redo() {
        this.element.checked = this.newState;
    }

    undo() {
        this.element.checked = this.previousState;
    }
}

/**
 * CheckboxUndoable wraps a checkbox element to automatically attach an event listener.
 * It extends the base UndoableElement class.
 */
export class Checkbox extends UndoableElement {
    constructor(element) {
        super(element);
        this.attachListeners();
    }

    attachListeners() {
        this.element.addEventListener('change', (event) => {
            // For toggling, assume the previous state is the opposite of the current.
            const newState = this.element.checked;
            const previousState = !newState;
            this.createAction(previousState, newState);
        });
    }

    createAction(previousState, newState) {
        const action = new CheckboxAction(this.element, previousState, newState);
        window.__GLOBAL_HISTORY__.push(action);
        // Clear redo stack
        window.__REDO_STACK__.length = 0;
        console.log('Checkbox command recorded:', action);
    }
}
