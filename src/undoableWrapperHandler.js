import {disposeAllUndoables} from "./undoable-elements/elementRegistry";
import {buildCandidateElementSelectors} from "./undoable-elements/elementFactoryMap";


let mutationObserver = null;

/**
 * Initialize undoable wrappers for elements in the document
 * by scanning the DOM and setting up a MutationObserver.
 * @param factoryMap
 */
export function initializeUndoableWrappers(factoryMap) {
    scanForAndWrapUndoableElements(document, factoryMap);
    if (mutationObserver) mutationObserver.disconnect();
    mutationObserver = createMutationObserver(factoryMap);
}

/**
 * Reinitialize undoable wrappers by disposing existing ones
 * and rescanning the DOM for undoable elements.
 * Then sets up a new MutationObserver.
 * @param factoryMap
 */
export function reinitializeUndoWrappers (factoryMap) {
    disposeAllUndoables();
    scanForAndWrapUndoableElements(document, factoryMap);
    if (mutationObserver) mutationObserver.disconnect();
    mutationObserver = createMutationObserver(factoryMap);
}

// Idea: Instead of attaching listeners to all elements, could use event delegation.
// Maybe too deep into the project now for that refactor though.
// At least for now.
/**
 * Scan the DOM for undoable elements based of a root node
 * and wrap them with their respective undoable handlers.
 * @param {HTMLElement|Document} root - The root element to start scanning from.
 * @return {void}
 */
export function scanForAndWrapUndoableElements(root, factoryMap) {
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
export function createMutationObserver(factoryMap) {
    const observer = new MutationObserver((mutations) => {
        for ( const mutation of mutations ) {
            for ( const node of mutation.addedNodes ) {
                // skip text nodes, comments, etc.
                if ( !(node instanceof HTMLElement) ) continue;
                // Scan the subtree of the added node
                scanForAndWrapUndoableElements(node, factoryMap)
            }
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });

    return observer;
}