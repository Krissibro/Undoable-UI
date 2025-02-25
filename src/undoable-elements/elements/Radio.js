import { UndoableElement } from '../UndoableElement.js';
import { Action } from '../Action.js';

/**
 * RadioAction encapsulates a toggle action on a radio input.
 * It records the new radio (the one clicked) and the previously selected radio in the group.
 */
export class RadioAction extends Action {
    /**
     * @param {HTMLInputElement} radio - The radio element that was clicked (new selection).
     * @param {HTMLInputElement|null} previousRadio - The previously selected radio in the group (or null if none).
     */
    constructor(radio, previousRadio) {
        super(radio);
        this.newRadio = radio;
        this.previousRadio = previousRadio; // may be null if there was no previous selection
    }

    /**
     * Executes the action by checking the new radio and unchecking the previous one (if present).
     */
    performAction() {
        this.newRadio.checked = true;
        if (this.previousRadio && this.previousRadio !== this.newRadio) {
            this.previousRadio.checked = false;
        }
    }

    /**
     * Undoes the action by reverting to the previous radio selection.
     */
    undo() {
        if (this.previousRadio) {
            this.previousRadio.checked = true;
            this.newRadio.checked = false;
        } else {
            // If there was no previous radio, simply uncheck the new one.
            this.newRadio.checked = false;
        }
    }
}

/**
 * Radio class wraps a radio input element to automatically attach event listeners.
 * It extends the base UndoableElement class.
 */
export class Radio extends UndoableElement {
    constructor(element) {
        super(element);
        if (this.element.type !== 'radio') {
            throw new Error('Element is not a radio input.');
        }
        this.attachListeners();
    }

    attachListeners() {
        // Use a static property on the Radio class to store previous selections per group.
        if (!Radio.previousSelections) {
            Radio.previousSelections = {};
        }

        // On focus, record the current selection for this radio group if not already recorded.
        // The focus value is the initial value for the range action.
        this.element.addEventListener('focus', () => {
            const groupName = this.element.name;
            if (!groupName) return;
            if (this.element.checked) {
                Radio.previousSelections[groupName] = this.element;
            } else if (!Radio.previousSelections[groupName]) {
                // Scan for any checked radio in the group.
                const radios = document.querySelectorAll(`input[type="radio"][name="${groupName}"]`);
                radios.forEach(radio => {
                    if (radio.checked) {
                        Radio.previousSelections[groupName] = radio;
                    }
                });
            }
        });

        // On change, create a RadioAction.
        this.element.addEventListener('change', () => {
            const groupName = this.element.name;
            if (!groupName) return;
            const previousRadio = Radio.previousSelections[groupName] || null;
            // Update stored previous selection to the current element.
            Radio.previousSelections[groupName] = this.element;

            const action = this.createAction(previousRadio);
            window.__GLOBAL_HISTORY__.push(action);
            window.__REDO_STACK__.length = 0;
            console.log('Radio command recorded:', action);
        });
    }

    /**
     * Creates a RadioAction using the current element and the previously selected radio.
     * @param {HTMLInputElement|null} previousRadio
     * @returns {RadioAction}
     */
    createAction(previousRadio) {
        return new RadioAction(this.element, previousRadio);
    }
}
