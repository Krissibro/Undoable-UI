// src/index.js
import { TextBox } from "./undoable-elements/elements/TextBox";
import { getConfig, resetConfigToBaseline, setBaselineConfig, updateConfig } from "./config";
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
        const isCtrlOrCmd = event.ctrlKey || event.metaKey;
        if ( !isCtrlOrCmd ) return;

        const key = event.key.toLowerCase();

        // Ctrl+Z or Cmd+Z for Undo
        if ( !event.shiftKey && key === "z" ) {
            event.preventDefault();
            undo();
            return;
        }

        // Ctrl+Y or Cmd+Shift+Z for Redo
        if ( (key === "y") || (event.shiftKey && key === "z") ) {
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
 * Updates config and optionally reinitializes wrappers.
 * @param {object} partialConfig
 * @param {{ reinitialize?: boolean }} [options]
 * @returns {object} updated config
 */
export function updateConfigAndReinitialize(partialConfig = {}, options = {}) {
    const { reinitialize = true } = options;

    config = updateConfig(partialConfig);

    if (reinitialize) {
        factoryMap = createFactoryMap(config);
        reinitializeUndoWrappers(factoryMap);
    }

    return config;
}

/**
 * Resets config and optionally reinitializes wrappers.
 * @param {{ reinitialize?: boolean }} [options]
 * @returns {object} reset config
 */
export function resetConfigAndReinitialize(options = {}) {
    const { reinitialize = true } = options;

    config = resetConfigToBaseline();

    if (reinitialize) {
        factoryMap = createFactoryMap(config);
        reinitializeUndoWrappers(factoryMap);
    }

    return config;
}


/**
 * Initialization function.
 * Scans the DOM for undoable elements and attaches their handlers.
 * Sets up mutation observers to handle dynamically added elements.
 * Also sets up global keyboard shortcuts for undo/redo.
 */
export function init(options = {}) {
    const {
        config: userConfig = {}
    } = options;
    config = setBaselineConfig(userConfig);
    factoryMap = createFactoryMap(config);
    ensureHistoryStacks();

    onDomReady(() => {
        initializeUndoableWrappers(factoryMap);
        addGlobalUndoRedoShortcuts();
        addMouseDownListeners();
    });

    return config;
}

function onDomReady(fn) {
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", fn, { once: true });
    } else {
        fn();
    }
}

// Auto-initialize when DOM is ready.
if (typeof window !== 'undefined') {
    // TODO: Consider if auto-initialization is desired
    // if (document.readyState === 'loading') {
    //     document.addEventListener('DOMContentLoaded', () => init());
    // } else {
    //     init();
    // }

    // Expose the API globally (UMD style)
    window.UndoableUI = {
        init,
        undo,
        redo,
        updateConfig: updateConfigAndReinitialize,
        resetConfig: resetConfigAndReinitialize,
        getConfig,
    };
}
