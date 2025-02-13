// src/index.js

// Global history stacks for undo/redo actions
const globalHistory = [];
const redoStack = [];

/**
 * CheckboxCommand encapsulates a single toggle action on a checkbox.
 * It records the checkbox element, its previous state, and its new state.
 */
class CheckboxCommand {
    /**
     * @param {HTMLInputElement} checkbox - The checkbox element.
     * @param {boolean} previousState - The state before the change.
     * @param {boolean} newState - The state after the change.
     */
    constructor(checkbox, previousState, newState) {
        this.checkbox = checkbox;
        this.previousState = previousState;
        this.newState = newState;
    }

    /**
     * Execute sets the checkbox to the new state.
     */
    execute() {
        this.checkbox.checked = this.newState;
    }

    /**
     * Undo reverts the checkbox to its previous state.
     */
    undo() {
        this.checkbox.checked = this.previousState;
    }
}

/**
 * Event handler for checkbox changes.
 * When a checkbox is toggled, this function creates a new CheckboxCommand
 * representing the action and adds it to the global history.
 */
function handleCheckboxChange(event) {
    const checkbox = event.target;
    const newState = checkbox.checked;
    // For a simple toggle, assume the previous state was the opposite of the new state.
    const previousState = !newState;
    const command = new CheckboxCommand(checkbox, previousState, newState);

    // Push the new command to the global history stack.
    globalHistory.push(command);

    // Clear the redo stack because new actions invalidate the redo history.
    redoStack.length = 0;

    console.log('Recorded command:', command);
}

/**
 * Scans the DOM for all checkboxes and attaches the change event listener.
 * This is our one-time DOM scan during initialization.
 */
function scanForCheckboxes() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', handleCheckboxChange);
    });
}

/**
 * Global undo function.
 * It removes the most recent command from the global history,
 * calls its undo() method, and pushes it onto the redo stack.
 */
function undo() {
    if (globalHistory.length > 0) {
        const command = globalHistory.pop();
        command.undo();
        redoStack.push(command);
        console.log('Undo executed');
    } else {
        console.log('No command to undo');
    }
}

/**
 * Global redo function.
 * It removes the most recent command from the redo stack,
 * re-executes it, and pushes it back onto the global history.
 */
function redo() {
    if (redoStack.length > 0) {
        const command = redoStack.pop();
        command.execute();
        globalHistory.push(command);
        console.log('Redo executed');
    } else {
        console.log('No command to redo');
    }
}

/**
 * Initialization function.
 * This function performs the one-time DOM scan for checkboxes.
 * Might extend this to also use MutationObserver later.
 */
export function init() {
    scanForCheckboxes();
    console.log('UndoableUI initialized');
}

// Export undo and redo functions so they can be accessed by developers.
export { undo, redo };

// UMD: Attach the API to the window if running in a browser without a module system.
if (typeof window !== 'undefined') {
    window.UndoableUI = { undo, redo };

    // Wait until the DOM is fully loaded before initializing
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => init());
    } else {
        init(); // If DOM is already loaded, initialize immediately
    }
}
