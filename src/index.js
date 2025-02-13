// src/index.js
import { CheckboxUndoable } from 'undoable-elements/checkbox.js';

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
        factory: (el) => new CheckboxUndoable(el),
    },
    // Future element types can be added here.
];

/**
 * Scan the DOM for undoable elements.
 * For each mapping in factoryMap, select all matching elements and create a handler.
 */
function scanForUndoableElements() {
    factoryMap.forEach(({ selector, factory }) => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((el) => {
            // Optionally, check if element is already wrapped.
            if (!el.__undoable__) {
                el.__undoable__ = factory(el);
            }
        });
    });
}

/**
 * Global undo function: undoes the most recent action.
 */
export function undo() {
    if (window.__GLOBAL_HISTORY__.length > 0) {
        const command = window.__GLOBAL_HISTORY__.pop();
        command.undo();
        window.__REDO_STACK__.push(command);
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
        const command = window.__REDO_STACK__.pop();
        command.execute();
        window.__GLOBAL_HISTORY__.push(command);
        console.log('Global redo executed');
    } else {
        console.log('No command to redo');
    }
}

/**
 * Initialization function.
 * Scans the DOM for undoable elements and attaches their handlers.
 */
export function init() {
    scanForUndoableElements();
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
