import { UndoableElement } from '../UndoableElement.js';
import { Action } from '../Action.js';
import {pushActionToHistory} from "../../history";

/**
 * CheckboxCommand encapsulates a toggle action on a checkbox.
 */
export class CheckboxAction extends Action {
    /**
     * @param {HTMLInputElement} checkboxElement - The checkbox element.
     * @param {boolean} previousState - The state before the change.
     * @param {boolean} newState - The state after the change.
     */
    constructor(checkboxElement, previousState, newState) {
        super(checkboxElement)
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

    createAction(previousState, newState) {
        const action = new CheckboxAction(this.element, previousState, newState);
        pushActionToHistory(action);
    }

    handleChange() {
        // For toggling, assume the previous state is the opposite of the current.
        const newState = this.element.checked;
        const previousState = !newState;
        this.createAction(previousState, newState);
    }

    attachListeners() {
        this.addProtectedListener('change', this.handleChange);
    }
}
