import { UndoableElement } from '../UndoableElement.js';
import { Action } from '../Action.js';
import {pushActionToHistory} from "../../history";

/**
 * RadioAction encapsulates a toggle action on a radio input.
 * It records the new radio (the one clicked) and the previously selected radio in the group.
 */
export class RadioAction extends Action {
    /**
     * @param {HTMLInputElement} radioElement - The radio element that was clicked (new selection).
     * @param {HTMLInputElement|null} previousRadio - The previously selected radio in the group (or null if none).
     */
    constructor(radioElement, previousRadio) {
        super(radioElement);
        this.newRadio = radioElement;
        this.previousRadio = previousRadio; // may be null if there was no previous selection
    }

    affectedElements() {
        // Filter to avoid returning null values
        return [this.element, this.previousRadio].filter(Boolean)
    }

    /**
     * Executes the action by checking the new radio and unchecking the previous one (if present).
     */
    redo() {
        this.newRadio.checked = true;
        if (this.previousRadio && this.previousRadio !== this.newRadio) {
            this.previousRadio.checked = false;
        }
        Radio.previousSelections[this.newRadio.name] = this.newRadio;
    }

    /**
     * Undoes the action by reverting to the previous radio selection.
     */
    undo() {
        if (this.previousRadio) {
            this.previousRadio.checked = true;
            this.newRadio.checked = false;
            Radio.previousSelections[this.previousRadio.name] = this.previousRadio;
        } else {
            // If there was no previous radio, simply uncheck the new one.
            this.newRadio.checked = false;
            Radio.previousSelections[this.newRadio.name] = null;
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

        // Use a static property on the Radio class to store previous selections per group.
        if (!Radio.previousSelections) {
            Radio.previousSelections = {};
        }

        this.groupName = this.element.name;

        if (this.groupName) {
            const radios = document.querySelectorAll(`input[type="radio"][name="${this.groupName}"]`);
            radios.forEach(radio => {
                if (radio.checked) {
                    Radio.previousSelections[this.groupName] = radio;
                }
            });
        }
        // TODO: What happens if the radio button does not have a group name?
        this.attachListeners();
    }

    /**
     * Creates a RadioAction using the current element and the previously selected radio.
     * @param {HTMLInputElement|null} previousRadio
     * @returns {RadioAction}
     */
    createAction(previousRadio) {
        const action = new RadioAction(this.element, previousRadio);
        pushActionToHistory(action);
    }

    handleChanges() {
        const groupName = this.element.name;
        if (!groupName) return;
        const previousRadio = Radio.previousSelections[groupName] || null;
        // Update stored previous selection to the current element.
        Radio.previousSelections[groupName] = this.element;

        this.createAction(previousRadio);
    }

    attachListeners() {
        // On change, create a RadioAction.
        this.addProtectedListener("change", this.handleChanges);
    }
}
