// src/index.js
import { TextBox } from "./undoable-elements/elements/TextBox";
import { getConfig, resetConfigToDefaults, updateConfig } from "./config";
import { ensureHistoryStacks, pushActionToHistory, pushActionToRedoStack } from "./history";
import { createFactoryMap } from "./undoable-elements/elementFactoryMap";
import { activateHistoryReplayProtection } from "./historyReplayProtection";
import { dispatchEvents } from "./dispatchEventHandler";
import { initializeUndoableWrappers, reinitializeUndoWrappers } from "./undoableWrapperHandler";

let config;
let factoryMap;
window.isMouseDown = false;

/**
 * Global undo function: undoes the most recent action.
 */
export function undo() {
    flushActiveUndoables()

    if (window.__GLOBAL_HISTORY__.length > 0) {
        const action = window.__GLOBAL_HISTORY__.pop();

        activateHistoryReplayProtection(() => {
            action.undo();
            dispatchEvents(action, config)
        });

        pushActionToRedoStack(action);
    }
}

/**
 * Global redo function: re-executes the most recently undone action.
 */
export function redo() {
    flushActiveUndoables()

    if (window.__REDO_STACK__.length > 0) {
        const action = window.__REDO_STACK__.pop();

        activateHistoryReplayProtection(() => {
            action.redo();
            dispatchEvents(action, config)
        });

        pushActionToHistory(action, { clearRedo: false });
    }
}

// Make sure any in-progress edits are finalized. (Before the throttle time is up for example)
function flushActiveUndoables() {
    if (typeof TextBox.flushAll === 'function') {
        TextBox.flushAll();
    }
}

function addGlobalUndoRedoShortcuts() {
    document.addEventListener('keydown', function (event) {
        // Check for Ctrl+Z or Cmd+Z (for Mac)
        if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'z') {
            event.preventDefault(); // Prevent native browser undo behavior
            undo();
        }
        // Check for Ctrl+Y or Cmd+Y (for Mac)
        else if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'y') {
            event.preventDefault();
            redo();
        }
    });
}

// TODO: needed?
// For the color picker for example, check if mouse is down to avoid capturing intermediate states
function addMouseDownListeners() {
    document.addEventListener('mousedown', () => window.isMouseDown = true);
    document.addEventListener('mouseup',   () => window.isMouseDown = false);
}

/**
 * Initialization function.
 * Scans the DOM for undoable elements and attaches their handlers.
 */
export function init() {

    config = getConfig();
    factoryMap = createFactoryMap(config);

    ensureHistoryStacks();
    initializeUndoableWrappers(factoryMap);
    addGlobalUndoRedoShortcuts();
    addMouseDownListeners();
}

// Auto-initialize when DOM is ready.
if (typeof window !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => init());
    } else {
        init();
    }

    // Expose the API globally (UMD style)
    window.UndoableUI = { undo, redo };
}
