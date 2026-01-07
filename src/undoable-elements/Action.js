export class Action {
    /**
     * @param {HTMLElement} element - The HTML element.
     */
    constructor(element) {
        /** @type {HTMLElement} */
        this.element = element;
    }

    /**
     * Get all elements affected by this action.
     * @returns {HTMLElement[]}
     */
    affectedElements() {
        return [this.element];
    }

    redo() {
        throw new Error("redo() must be implemented by subclasses.");
    }

    undo() {
        throw new Error("undo() must be implemented by subclasses.");
    }
}