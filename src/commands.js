import { ensureHistoryStacks, pushActionToHistory, pushActionToRedoStack } from "./history";
import { activateHistoryReplayProtection } from "./historyReplayProtection";
import { dispatchEvents } from "./dispatchEventHandler";
import { getConfig } from "./config";
import { TextBox } from "./undoable-elements/elements/TextBox";

/**
 * Global undo function: undoes the most recent action.
 */
export function undo() {
    ensureHistoryStacks();
    flushActiveUndoables();

    if (window.__GLOBAL_HISTORY__.length > 0) {
        const action = window.__GLOBAL_HISTORY__.pop();

        activateHistoryReplayProtection(() => {
            action.undo();
            dispatchEvents(action, getConfig())
        });

        pushActionToRedoStack(action);
    }
}

/**
 * Global redo function: re-executes the most recently undone action.
 */
export function redo() {
    ensureHistoryStacks();
    flushActiveUndoables();

    if (window.__REDO_STACK__.length > 0) {
        const action = window.__REDO_STACK__.pop();

        activateHistoryReplayProtection(() => {
            action.redo();
            dispatchEvents(action, getConfig())
        });

        pushActionToHistory(action, { clearRedo: false });
    }
}

// Make sure any in-progress edits are finalized. (Before the throttle time is up for example)
export function flushActiveUndoables() {
    if (typeof TextBox.flushAll === 'function') {
        TextBox.flushAll();
    }
}