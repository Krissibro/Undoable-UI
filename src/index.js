// src/index.js
import { TextBox } from "./undoable-elements/elements/TextBox";
import { getConfig } from "./config";
import { ensureStacks, pushActionToHistory, pushActionToRedoStack } from "./history";
import { disposeAllUndoables } from "./undoable-elements/elementRegistry";
import { buildCandidateElementSelectors, createFactoryMap } from "./undoable-elements/elementFactoryMap";

// Global history arrays
// for simplicity, we attach these to the window so they are accessible by our modules
// window.__GLOBAL_HISTORY__ = window.__GLOBAL_HISTORY__ || [];
// window.__REDO_STACK__ = window.__REDO_STACK__ || [];
ensureStacks();

window.isMouseDown = false;

let config;
let factoryMap;


// Idea: Instead of attaching listeners to all elements, could use event delegation.
// Maybe too deep into the project now for that refactor though.
// At least for now.
/**
 * Scan the DOM for undoable elements based of a root node
 * and wrap them with their respective undoable handlers.
 * @param {HTMLElement|Document} [root=document] - The root element to start scanning from.
 * Defaults to the entire document.
 * @return {void}
 */
function scanForAndWrapUndoableElements(root) {
    const elementSelectors = buildCandidateElementSelectors(factoryMap)

    const candidates = [];

    // Check if the root itself matches any selectors since querySelectorAll won't include it
    if ( root instanceof Element && root.matches(elementSelectors) ) {
        candidates.push(root);
    }

    const queriedElements = root.querySelectorAll(elementSelectors)
    candidates.push(...queriedElements);

    for ( const currentElement of candidates ) {
        if ( currentElement.__undoable__ ) continue;

        for ( const { selector, factory } of factoryMap ) {
            if ( currentElement.matches(selector) ) {
                currentElement.__undoable__ = factory(currentElement)
                break;
            }
        }
    }
}

/**
 * Sets up a MutationObserver to watch for added nodes in the DOM.
 * When new nodes are added, it scans them for undoable elements and wraps them.
 * @returns {MutationObserver}
 */
function setupMutationObserver() {
    const observer = new MutationObserver((mutations) => {
        for ( const mutation of mutations ) {
            for ( const node of mutation.addedNodes ) {
                // skip text nodes, comments, etc.
                if ( !(node instanceof HTMLElement) ) continue;

                // Check if the added node itself matches any factory selectors
                factoryMap.forEach( ({ selector, factory }) => {
                    if ( node.matches(selector) && !node.__undoable__ ) {
                        node.__undoable__ = factory(node);
                    }
                });

                // Also scan the subtree of the added node
                scanForAndWrapUndoableElements(node)
            }
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });

    return observer;
}

// Make sure any in-progress edits are finalized. (Before the throttle time is up for example)
function flushActiveUndoables() {
    if (typeof TextBox.flushAll === 'function') {
        TextBox.flushAll();
    }
}

/**
 * Global undo function: undoes the most recent action.
 */
export function undo() {
    flushActiveUndoables()

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
    flushActiveUndoables()

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

// TODO: needed?
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

    addMouseDownListeners();
    scanForAndWrapUndoableElements(document);
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
