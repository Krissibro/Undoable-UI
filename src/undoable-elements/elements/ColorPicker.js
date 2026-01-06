import { UndoableElement } from '../UndoableElement.js';
import { Action } from '../Action.js';
import {pushActionToHistory} from "../../history";

/**
 * ColorAction encapsulates a change on a color input.
 * It records the previous and new color values.
 */
export class ColorAction extends Action {
    /**
     * @param {HTMLInputElement} colorElement - The color input element.
     * @param {ColorPicker} colorPickerWrapper - The color picker listener instance.
     * @param {string} previousColor - The color before the change.
     * @param {string} newColor - The color after the change.
     */
    constructor(colorElement, colorPickerWrapper, previousColor, newColor) {
        super(colorElement);
        this.colorPickerListener = colorPickerWrapper;
        this.previousColor = previousColor;
        this.newColor = newColor;
    }

    /**
     * Executes the action by setting the input's value to the new color.
     */
    redo() {
        this.colorPickerListener.oldColor = this.newColor;
        this.element.value = this.newColor;
    }

    /**
     * Undoes the action by reverting the input's value to the previous color.
     */
    undo() {
        this.colorPickerListener.oldColor = this.previousColor;
        this.element.value = this.previousColor;
    }
}

/**
 * ColorPicker wraps a color input element to automatically attach event listeners
 * for undo/redo functionality.
 */
export class ColorPicker extends UndoableElement {
    constructor(element) {
        super(element);
        // Record the initial color value.
        this.oldColor = element.value;
        this.attachListeners();
    }

    /**
     * Creates a ColorAction using the previous and new color values.
     * Then pushes the action to the global history.
     * @param {string} previousColor
     * @param {string} newColor
     * @returns {ColorAction}
     */
    createAction(previousColor, newColor) {
        const action = new ColorAction(this.element, this, previousColor, newColor);
        pushActionToHistory(action);
        this.oldColor = newColor;
    }

    handleChanges() {
        const previousColor = this.oldColor;
        const newColor = this.element.value;
        if (previousColor !== newColor) {
            this.createAction(previousColor, newColor);
        }
    }

    attachListeners() {
        // Define a single handler for both 'input' and 'change' events.
        this.addProtectedListener('change', this.handleChanges)
    }
}
