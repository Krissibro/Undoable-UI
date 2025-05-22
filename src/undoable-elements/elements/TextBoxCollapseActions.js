import { Action } from '../Action.js';
import { UndoableElement } from "../UndoableElement";
import { isContentEditable, getValue, setValue } from "./TextElementHelpers";


/**
 * Time window (ms) to merge consecutive keystrokes into a single chunk
 */
const CHUNK_MERGE_DELAY = 500;

/**
 * Pressing these keys will break the current chunk immediately
 */
const BOUNDARY_KEY_LIST = ['Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];


/**
 * TextAction represents a single edit from oldValue -> newValue
 * for a text-based element (input, textarea, or contenteditable).
 */
export class TextAction extends Action {
    /**
     * @param {HTMLElement} element - The text-based element.
     * @param {string} oldValue - The text before the change.
     * @param {string} newValue - The text after the change.
     */
    constructor(element, oldValue, newValue) {
        super(element);
        this.oldValue = oldValue;
        this.newValue = newValue;
    }

    redo() {
        setValue(this.element, this.newValue);
    }

    undo() {
        setValue(this.element, this.oldValue);
    }
}





/**
 * Manages partial text edits (chunks) while typing, then merges them
 * into one final action on blur.
 */
class TextChunkManager {
    constructor(element, initialText) {
        this.element = element;
        this.initialText = initialText;  // text at the moment of focus
        this.sessionEdits = [];         // partial actions in this focus session
        this.currentEdit = null;        // the chunk currently being built
        this.lastChunkTimestamp = 0;    // last time we updated a chunk
        this.boundaryKeyDetected = false;
    }

    /**
     * Initialize or reset the chunking session (on focus).
     */
    startSession() {
        this.sessionEdits = [];
        this.currentEdit = null;
        this.lastChunkTimestamp = 0;
        this.boundaryKeyDetected = false;
    }

    /**
     * Process a keydown event to detect boundary keys (Enter, arrows).
     */
    processKeydown(event) {
        if (BOUNDARY_KEY_LIST.includes(event.key)) {
            // Finalize current chunk if user pressed a boundary key
            this.finalizeCurrentEdit();
            this.boundaryKeyDetected = true;
        } else {
            this.boundaryKeyDetected = false;
        }
    }

    /**
     * Process an input event to create or merge partial edits.
     */
    processInput() {
        const newValue = getValue(this.element);
        const now = Date.now();

        if (!this.currentEdit) {
            // Start a new chunk for the first keystroke
            this.startNewEdit(newValue);
        } else {
            // Check time since last update
            const timeDelta = now - this.lastChunkTimestamp;
            if (timeDelta < CHUNK_MERGE_DELAY && !this.boundaryKeyDetected) {
                // Merge with current chunk
                this.mergeIntoCurrentEdit(newValue);
            } else {
                // Finalize old chunk, start a new one
                this.finalizeCurrentEdit();
                this.startNewEdit(newValue);
            }
        }

        this.lastChunkTimestamp = now;
    }

    /**
     * Creates a new chunk from the last known text -> current text.
     */
    startNewEdit(newValue) {
        // For the first chunk or if we've had partials before
        // the oldValue is either the finalValue of the last chunk
        // or the initial text at focus if none.
        const oldVal = this.sessionEdits.length > 0
            ? this.sessionEdits[this.sessionEdits.length - 1].newValue
            : this.initialText;

        const action = new TextAction(this.element, oldVal, newValue);
        window.__GLOBAL_HISTORY__.push(action);
        window.__REDO_STACK__.length = 0;

        this.sessionEdits.push(action);
        this.currentEdit = action;
    }

    /**
     * Merges the newValue into the current chunk action object.
     */
    mergeIntoCurrentEdit(newValue) {
        if (!this.currentEdit) return;

        // Pop the top of the global history
        const popped = window.__GLOBAL_HISTORY__.pop();
        if (popped !== this.currentEdit) {
            // Edge case: partial undos might have removed or changed the top
            if (popped) {
                // Put it back if mismatch
                window.__GLOBAL_HISTORY__.push(popped);
            }
            return;
        }

        // Update current chunk's newValue
        this.currentEdit.newValue = newValue;
        // Re-push updated chunk
        window.__GLOBAL_HISTORY__.push(this.currentEdit);

        // Also update the sessionEdits array
        this.sessionEdits[this.sessionEdits.length - 1].newValue = newValue;
    }

    /**
     * Finalize the current chunk so subsequent input starts a new chunk.
     */
    finalizeCurrentEdit() {
        this.currentEdit = null;
    }

    /**
     * On blur, unify partial actions into one big action: initialText -> finalValue.
     */
    finalizeFocusSession(finalValue) {
        // If no actual change, do nothing
        if (this.initialText === finalValue) return;

        // Remove partial actions from global history
        while (this.sessionEdits.length > 0) {
            const partial = this.sessionEdits.pop();
            const idx = window.__GLOBAL_HISTORY__.indexOf(partial);
            if (idx !== -1) {
                window.__GLOBAL_HISTORY__.splice(idx, 1);
            }
        }

        // Create one merged action
        const mergedAction = new TextAction(this.element, this.initialText, finalValue);
        window.__GLOBAL_HISTORY__.push(mergedAction);
        window.__REDO_STACK__.length = 0;
    }
}

/**
 * TextBox uses a TextChunkManager to handle partial text edits (chunks) while typing,
 * then merges them into a single action when the user blurs the field.
 */
export class TextBoxCollapseActions extends UndoableElement {
    constructor(element) {
        super(element);
        this.initialFocusValue = null;
        this.chunkManager = null;

        this.attachListeners();
    }

    attachListeners() {
        // On focus, start a new chunking session
        this.element.addEventListener('focus', () => {
            this.initialFocusValue = getValue(this.element);
            this.chunkManager = new TextChunkManager(this.element, this.initialFocusValue);
            this.chunkManager.startSession();
        });

        // On keydown, detect boundary keys
        this.element.addEventListener('keydown', (event) => {
            // If overriding native undo, you might handle Ctrl+Z here
            this.chunkManager?.processKeydown(event);
        });

        // On input, create or merge partial actions
        this.element.addEventListener('input', () => {
            this.chunkManager?.processInput();
        });

        // On blur/focusout, unify partial actions into one merged action
        const blurEvent = isContentEditable(this.element) ? 'focusout' : 'blur';
        this.element.addEventListener(blurEvent, () => {
            if (!this.chunkManager) return;
            const finalValue = getValue(this.element);
            this.chunkManager.finalizeFocusSession(finalValue);

            // Reset
            this.initialFocusValue = null;
            this.chunkManager = null;
        });
    }
}

