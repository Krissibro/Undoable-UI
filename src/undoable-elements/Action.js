export class Action {
    /**
     * @param {HTMLInputElement} element - The HTML element.
     */
    constructor(element) {
        this.element = element;
    }

    performAction() {
        throw new Error("performAction() must be implemented by subclasses.");
    }

    undo() {
        throw new Error("undo() must be implemented by subclasses.");
    }
}