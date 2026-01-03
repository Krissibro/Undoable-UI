import {registerInstance, unregisterInstance} from "./elementRegistry";

/**
 * Base class for undoable elements.
 * Subclasses should implement:
 *   - attachListeners(): to attach event listeners for this element.
 *   - createAction(event): to create an Action object for a given event.
 */
export class UndoableElement {
    constructor(element) {
        this.element = element;
        registerInstance(this)
    }

    attachListeners() {
        throw new Error("attachListeners() must be implemented by subclasses.");
    }

    createAction(event) {
        throw new Error("createCommand() must be implemented by subclasses.");
    }

    dispose() {
        this.disposeListeners();
        this.element.__undoable__ = undefined;
        unregisterInstance(this);
    }

    disposeListeners() {
        throw new Error("disposeListeners() must be implemented by subclasses.");
    }
}