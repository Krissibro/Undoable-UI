import { UndoableElement } from '../UndoableElement.js';
import { Action } from '../Action.js';
import {pushActionToHistory} from "../../history";

/**
 * DateTimeAction encapsulates a change on a date/time input.
 * It records the previous value and the new value.
 */
export class DateTimeAction extends Action {
    /**
     * @param {HTMLInputElement} dateTimeElement - The date/time input element.
     * @param {DateTime} dateTimeWrapper - The DateTime instance.
     * @param {string} previousValue - The value before the change.
     * @param {string} newValue - The value after the change.
     */
    constructor(dateTimeElement, dateTimeWrapper, previousValue, newValue) {
        super(dateTimeElement);
        this.dateTimeListener = dateTimeWrapper;
        this.previousValue = previousValue;
        this.newValue = newValue;
    }

    /**
     * Executes the action by setting the input's value to the new value.
     */
    redo() {
        this.dateTimeListener.oldValue = this.newValue;
        this.element.value = this.newValue;
    }

    /**
     * Undoes the action by reverting the input's value to the previous value.
     */
    undo() {
        this.dateTimeListener.oldValue = this.previousValue;
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

        // Stable reference to be used to handle changes in the listeners
        this.handleChanges = this.handleChanges.bind(this)
        this.attachListeners();
    }

    /**
     * Creates a DateTimeAction using the previous and new values.
     * @param {string} previousValue
     * @param {string} newValue
     * @returns {DateTimeAction}
     */
    createAction(previousValue, newValue) {
        const action = new DateTimeAction(this.element, this, previousValue, newValue);
        pushActionToHistory(action);
        // Update oldValue to the new value.
        this.oldValue = newValue;
    }

    handleChanges() {
        // On change, create a new DateTimeAction if the value has changed.
        const previousValue = this.oldValue;
        const newValue = this.element.value;
        if (previousValue !== newValue) {
            this.createAction(previousValue, newValue);
        }
    }

    attachListeners() {
        // Attach the same handler to both 'input' and 'change'
        ['input', 'change'].forEach(type => {
            this.element.addEventListener(type, this.handleChanges);
        });
    }

    disposeListeners() {
        // Attach the same handler to both 'input' and 'change'
        ['input', 'change'].forEach(type => {
            this.element.removeEventListener(type, this.handleChanges);
        });
    }
}
