import { UndoableElement } from '../UndoableElement.js';
import { Action } from '../Action.js';

/**
 * RangeAction encapsulates a change action on a range input.
 * It records the previous value and the new value.
 */
export class RangeAction extends Action {
    /**
     * @param {HTMLInputElement} range - The range input element.
     * @param {number|string} previousValue - The value before the change.
     * @param {number|string} newValue - The value after the change.
     */
    constructor(range, previousValue, newValue) {
        super(range);
        this.previousValue = previousValue;
        this.newValue = newValue;
    }

    /**
     * Executes the action by setting the range's value to the new value.
     */
    performAction() {
        this.element.value = this.newValue;
    }

    /**
     * Undoes the action by reverting the range's value to the previous value.
     */
    undo() {
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

    attachListeners() {
        // When the range gains focus, record its current value.
        // The focus value is the initial value for the range action.
        this.element.addEventListener('focus', () => {
            this.oldValue = this.element.value;
        });

        // On change, create a RangeAction.
        this.element.addEventListener('change', (event) => {
            const previousValue = this.oldValue;
            const newValue = this.element.value;
            // Only record an action if the value has actually changed.
            if (previousValue !== newValue) {
                const action = this.createAction(previousValue, newValue);
                window.__GLOBAL_HISTORY__.push(action);
                window.__REDO_STACK__.length = 0;
                // Update the oldValue to the new value for subsequent changes.
                this.oldValue = newValue;
                console.log('Range command recorded:', action);
            }
        });
    }

    /**
     * Creates a RangeAction using the current element's old and new values.
     * @param {number|string} previousValue
     * @param {number|string} newValue
     * @returns {RangeAction}
     */
    createAction(previousValue, newValue) {
        return new RangeAction(this.element, previousValue, newValue);
    }
}
