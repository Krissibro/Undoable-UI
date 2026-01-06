import { UndoableElement } from '../UndoableElement.js';
import { Action } from '../Action.js';
import {pushActionToHistory} from "../../history";

/**
 * RangeAction encapsulates a change action on a range input.
 * It records the previous value and the new value.
 */
export class RangeAction extends Action {
    /**
     * @param {HTMLInputElement} range - The range input element.
     * @param {Range} rangeListener - The range listener instance.
     * @param {number|string} previousValue - The value before the change.
     * @param {number|string} newValue - The value after the change.
     */
    constructor(range, rangeListener, previousValue, newValue) {
        super(range);
        this.rangeListener = rangeListener;
        this.previousValue = previousValue;
        this.newValue = newValue;
    }

    /**
     * Executes the action by setting the range's value to the new value.
     */
    redo() {
        this.rangeListener.oldValue = this.newValue;
        this.element.value = this.newValue;
    }

    /**
     * Undoes the action by reverting the range's value to the previous value.
     */
    undo() {
        this.rangeListener.oldValue = this.previousValue
        this.element.value = this.previousValue;
    }
}

/**
 * Range wraps a range input element to automatically attach event listeners.
 * It extends the base UndoableElement class.
 */
export class Range extends UndoableElement {
    constructor(element) {
        super(element);
        // Initialize a property to store the previous value.
        this.oldValue = element.value;
        this.attachListeners();
    }

    /**
     * Creates a RangeAction using the current element's old and new values.
     * Then adds the action to the global history.
     * @param {number|string} previousValue
     * @param {number|string} newValue
     * @returns {RangeAction}
     */
    createAction(previousValue, newValue) {
        const action = new RangeAction(this.element, this, previousValue, newValue);
        pushActionToHistory(action);
        // Update the oldValue to the new value for subsequent changes.
        this.oldValue = newValue;
    }

    handleChanges() {
        // On change, create a RangeAction.
        const previousValue = this.oldValue;
        const newValue = this.element.value;
        // Only record an action if the value has actually changed.
        if (previousValue !== newValue) {
            this.createAction(previousValue, newValue);
        }
    }

    attachListeners() {
        this.addProtectedListener("change", this.handleChanges);
    }
}
