import { UndoableElement } from '../UndoableElement.js';
import { Action } from '../Action.js';

/**
 * DateTimeAction encapsulates a change on a date/time input.
 * It records the previous value and the new value.
 */
export class DateTimeAction extends Action {
    /**
     * @param {HTMLInputElement} element - The date/time input element.
     * @param {string} previousValue - The value before the change.
     * @param {string} newValue - The value after the change.
     */
    constructor(element, previousValue, newValue) {
        super(element);
        this.previousValue = previousValue;
        this.newValue = newValue;
    }

    /**
     * Executes the action by setting the input's value to the new value.
     */
    performAction() {
        this.element.value = this.newValue;
    }

    /**
     * Undoes the action by reverting the input's value to the previous value.
     */
    undo() {
        this.element.value = this.previousValue;
    }
}

/**
 * DateTime wraps a date/time input element (e.g., type="date", "time", "datetime-local")
 * to automatically attach event listeners for undo/redo functionality.
 */
export class DateTime extends UndoableElement {
    constructor(element) {
        super(element);
        // Record the initial value when the element is created.
        this.oldValue = element.value;
        this.attachListeners();
    }

    attachListeners() {
        // Use focus to capture the starting (old) value.
        this.element.addEventListener('focus', () => {
            this.oldValue = this.element.value;
        });

        // On change, create a new DateTimeAction if the value has changed.
        this.element.addEventListener('change', (event) => {
            const previousValue = this.oldValue;
            const newValue = this.element.value;
            if (previousValue !== newValue) {
                const action = this.createAction(previousValue, newValue);
                window.__GLOBAL_HISTORY__.push(action);
                window.__REDO_STACK__.length = 0; // Clear redo history.
                // Update oldValue to the new value.
                this.oldValue = newValue;
                console.log('DateTime command recorded:', action);
            }
        });
    }

    /**
     * Creates a DateTimeAction using the previous and new values.
     * @param {string} previousValue
     * @param {string} newValue
     * @returns {DateTimeAction}
     */
    createAction(previousValue, newValue) {
        return new DateTimeAction(this.element, previousValue, newValue);
    }
}
