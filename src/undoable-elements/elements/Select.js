import { UndoableElement } from '../UndoableElement.js';
import { Action } from '../Action.js';
import {pushActionToHistory} from "../../history";

/**
 * SelectAction encapsulates a selection change on a <select> element.
 * It records the previous selected value and the new selected value.
 */
export class SelectAction extends Action {
    /**
     * @param {HTMLSelectElement} selectElement - The <select> element.
     * @param {Select} selectListener - The select listener instance.
     * @param {string} previousValue - The value before the change.
     * @param {string} newValue - The value after the change.
     */
    constructor(selectElement, selectListener, previousValue, newValue) {
        super(selectElement);
        this.selectListener = selectListener;
        this.previousValue = previousValue;
        this.newValue = newValue;
    }

    /**
     * Executes the action by setting the select element's value to the new value.
     */
    redo() {
        this.selectListener.oldValue = this.newValue;
        this.element.value = this.newValue;
    }

    /**
     * Undoes the action by reverting the select element's value to the previous value.
     */
    undo() {
        this.selectListener.oldValue = this.previousValue
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

    /**
     * Creates a SelectAction using the previous and new values.
     * @param {string} previousValue
     * @param {string} newValue
     * @returns {SelectAction}
     */
    createAction(previousValue, newValue) {
        const action = new SelectAction(this.element, this, previousValue, newValue);
        pushActionToHistory(action);
        // Update oldValue for subsequent changes.
        this.oldValue = newValue;
    }

    handleChanges () {
        // On change, record the new selection if it differs.
        const previousValue = this.oldValue;
        const newValue = this.element.value;
        if (previousValue !== newValue) {
            this.createAction(previousValue, newValue);
        }
    }

    attachListeners() {
        this.addProtectedListener("change", this.handleChanges);
    }
}
