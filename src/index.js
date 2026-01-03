// src/index.js
import { Checkbox } from './undoable-elements/elements/Checkbox.js';
import { Radio } from "./undoable-elements/elements/Radio";
import { Range } from './undoable-elements/elements/Range.js';
import { DateTime } from "./undoable-elements/elements/DateTime";
import { Select } from "./undoable-elements/elements/Select";
import { ColorPicker } from "./undoable-elements/elements/ColorPicker";
import { TextBoxCollapse } from "./undoable-elements/elements/TextBoxCollapse";
import { TextBox } from "./undoable-elements/elements/TextBox";
import { getConfig } from "./config";
import { ensureStacks, pushActionToHistory, pushActionToRedoStack } from "./history";

// Global history arrays
// for simplicity, we attach these to the window so they are accessible by our modules
// window.__GLOBAL_HISTORY__ = window.__GLOBAL_HISTORY__ || [];
// window.__REDO_STACK__ = window.__REDO_STACK__ || [];
ensureStacks();

window.isMouseDown = false;

let config;
let factoryMap;



// TODO: Could be more efficient by only scanning the DOM once.
// If possible, maybe use the factory to pattern match the node type
// TODO: Instead of attaching listeners to all elements, could use event delegation maybe.
/**
 * Scan the DOM for undoable elements.
 * For each mapping in factoryMap, select all matching elements and create a handler.
 */
function scanForUndoableElements(root = document) {
    factoryMap.forEach(({ selector, factory }) => {
        const elements = root.querySelectorAll(selector);
        elements.forEach((element) => {
            // Optionally, check if element is already wrapped.
            if (!element.__undoable__) {
                // If the element exist in the factory, wrap it.
                element.__undoable__ = factory(element);
            }
        });
    });
}

// TODO: Not tested
// Also gotta make sure its not missing any children elements
function setupMutationObserver() {
    const observer = new MutationObserver(
        mutations => {
            for ( const mutation of mutations ) {
                for ( const node of mutation.addedNodes ) {
                    if ( !node instanceof HTMLElement ) return;
                    scanForUndoableElements(node)
                }
            }
        }
    )
}


/**
 * Global undo function: undoes the most recent action.
 */
export function undo() {
    // Make sure any in-progress edits are finalized. (Before the throttle time is up)
    if (typeof TextBox.flushAll === 'function') {
        TextBox.flushAll();
    }

    if (window.__GLOBAL_HISTORY__.length > 0) {
        const action = window.__GLOBAL_HISTORY__.pop();
        action.undo();
        pushActionToRedoStack(action);
    }
}

/**
 * Global redo function: re-executes the most recently undone action.
 */
export function redo() {
    if (typeof TextBox.flushAll === 'function') {
        TextBox.flushAll();
    }

    if (window.__REDO_STACK__.length > 0) {
        const action = window.__REDO_STACK__.pop();
        action.redo();
        pushActionToHistory(action, { clearRedo: false });
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

    /**
     * Factory mapping: Each entry defines a CSS selector and a factory function
     * that takes a DOM element and returns an instance of an undoable handler.
     */
    factoryMap = [
        {
            // Input types for text, search, email, url, number, tel + textarea
            // (Skipping password)
            selector: `input[type="text"],
               input[type="search"],
               input[type="email"],
               input[type="url"],
               input[type="number"],
               input[type="tel"],
               textarea,
               [contenteditable="true"]`,
            factory: element =>
                config.collapseTextEdits
                    ? new TextBoxCollapse(element, config)
                    : new TextBox(element, config),
        },
        {
            selector: 'input[type="checkbox"]',
            factory: (element) => new Checkbox(element),
        },
        {
            selector: 'input[type="radio"]',
            factory: (element) => new Radio(element),
        },
        {
            selector: 'input[type="range"]',
            factory: (element) => new Range(element),
        },
        {
            selector: 'input[type="date"], input[type="time"], input[type="datetime-local"]',
            factory: (element) => new DateTime(element),
        },
        {
            selector: 'select',
            factory: (element) => new Select(element),
        },
        {
            selector: 'input[type="color"]',
            factory: (element) => new ColorPicker(element),
        },
        // Future element types can be added here.
    ];

    addMouseDownListeners();
    scanForUndoableElements();
    setupMutationObserver();
    addGlobalUndoRedoShortcuts();
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
