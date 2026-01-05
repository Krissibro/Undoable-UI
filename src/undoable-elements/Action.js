export class Action {
    /**
     * @param {HTMLElement} element - The HTML element.
     */
    constructor(element) {
        this.element = element;
    }

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