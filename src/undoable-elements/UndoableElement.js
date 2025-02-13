/**
 * Base class for undoable elements.
 * Subclasses should implement:
 *   - attachListeners(): to attach event listeners for this element.
 *   - createAction(event): to create an Action object for a given event.
 */
export class UndoableElement {
    constructor(element) {
        this.element = element;
    }

    attachListeners() {
        throw new Error("attachListeners() must be implemented by subclasses.");
    }

    createAction(event) {
        throw new Error("createCommand() must be implemented by subclasses.");
    }
}