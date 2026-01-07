import {registerInstance, unregisterInstance} from "./elementRegistry";
import {isHistoryReplaying} from "../historyReplayProtection";

/**
 * Base class for undoable elements.
 * Subclasses should implement:
 *   - attachListeners(): to attach event listeners for this element.
 *   - createAction(event): to create an Action object for a given event.
 */
export class UndoableElement {
    constructor(element) {
        /** @type {HTMLElement} */
        this.element = element;
        this._listenerCleanups = [];
        this._disposed = false;
        registerInstance(this)
    }

    /**
     * Creates an Action object for the given event.
     * Must be implemented by subclasses.
     * @param event
     */
    createAction(event) {
        throw new Error("createCommand() must be implemented by subclasses.");
    }

    /**
     * Attaches necessary event listeners to the element.
     * Must be implemented by subclasses.
     */
    attachListeners() {
        throw new Error("attachListeners() must be implemented by subclasses.");
    }

    /**
     * Creates an event listener that is protected against history replay.
     * This prevents timers/chunks/cache updates from running during replay.
     * @param type
     * @param handler
     * @param options
     * @returns {function(*): *}
     */
    addProtectedListener(type, handler, options = undefined) {
        // Wrap the handler to prevent execution during history replay
        const wrappedHandler = (event) => {
            if ( isHistoryReplaying() ) return;
            // Call the original handler
            // This ensures the correct 'this' context is maintained
            return handler.call(this, event);
        };

        // Attach the event listener to the element with the wrapped handler
        this.element.addEventListener(type, wrappedHandler, options)

        // Store the cleanup function to remove the listener later
        // With optional extra dispose behaviour per subclass
        this._listenerCleanups.push(() => {
            this.element.removeEventListener(type, wrappedHandler, options)
        });

        // Return the wrapped handler in case it's needed elsewhere
        return wrappedHandler;
    }



    /**
     * Cleans up event listeners and unregisters the instance.
     */
    dispose() {
        // Avoid double disposal
        if (this._disposed) return;
        this._disposed = true;
        this._listenerCleanups.forEach((cleanup) => cleanup());
        this._listenerCleanups = [];

        this.extraSubclassCleanup();

        this.element.__undoable__ = undefined;
        unregisterInstance(this);
    }

    extraSubclassCleanup() {}
}