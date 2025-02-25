// src/index.js
import { Checkbox } from './undoable-elements/elements/Checkbox.js';
import { Radio } from "./undoable-elements/elements/Radio";
import { Range } from './undoable-elements/elements/Range.js';
import { DateTime } from "./undoable-elements/elements/DateTime";
import { Select } from "./undoable-elements/elements/Select";
import {ColorPicker} from "./undoable-elements/elements/ColorPicker";

// Global history arrays
// for simplicity, we attach these to the window so they are accessible by our modules
window.__GLOBAL_HISTORY__ = window.__GLOBAL_HISTORY__ || [];
window.__REDO_STACK__ = window.__REDO_STACK__ || [];

/**
 * Factory mapping: Each entry defines a CSS selector and a factory function
 * that takes a DOM element and returns an instance of an undoable handler.
 */
const factoryMap = [
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

// TODO: Could be more efficient by only scanning the DOM once.
// If possible
// TODO: Instead of attaching listeners to all elements, could use event delegation maybe.
/**
 * Scan the DOM for undoable elements.
 * For each mapping in factoryMap, select all matching elements and create a handler.
 */
function scanForUndoableElements() {
    factoryMap.forEach(({ selector, factory }) => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((element) => {
            // Optionally, check if element is already wrapped.
            if (!element.__undoable__) {
                element.__undoable__ = factory(element);
            }
        });
    });
}

// TODO: Add mutation observer to automatically attach listeners to new elements.

/**
 * Global undo function: undoes the most recent action.
 */
export function undo() {
    if (window.__GLOBAL_HISTORY__.length > 0) {
        const action = window.__GLOBAL_HISTORY__.pop();
        action.undo();
        window.__REDO_STACK__.push(action);
        console.log('Global undo executed');
    } else {
        console.log('No command to undo');
    }
}

/**
 * Global redo function: re-executes the most recently undone action.
 */
export function redo() {
    if (window.__REDO_STACK__.length > 0) {
        const action = window.__REDO_STACK__.pop();
        action.performAction();
        window.__GLOBAL_HISTORY__.push(action);
        console.log('Global redo executed');
    } else {
        console.log('No command to redo');
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

/**
 * Initialization function.
 * Scans the DOM for undoable elements and attaches their handlers.
 */
export function init() {
    scanForUndoableElements();
    addGlobalUndoRedoShortcuts()
    console.log('UndoableUI initialized');
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
