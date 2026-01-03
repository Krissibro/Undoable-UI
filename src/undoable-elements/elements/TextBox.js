// undoable-elements/elements/TextBox.js

import { UndoableElement } from '../UndoableElement.js';
import { Action } from '../Action.js';
import { pushActionToHistory } from '../../history.js';
import { getValue, setValue } from './textElementHelpers.js';

const BOUNDARY_KEYS = new Set([
    "Enter",
    "ArrowLeft",
    "ArrowRight",
    "ArrowUp",
    "ArrowDown",
    "Home",
    "End",
    "PageUp",
    "PageDown"
]);

/**
 * TextAction encapsulates a text change on an input/textarea/contenteditable.
 * It records the previous text and the new text.
 */
export class TextAction extends Action {
    /**
     * @param {HTMLElement} textElement
     * @param {TextBox} textBoxWrapper
     * @param {string} previousValue
     * @param {string} newValue
     */
    constructor(textElement, textBoxWrapper, previousValue, newValue) {
        super(textElement);
        this.textBoxWrapper = textBoxWrapper;
        this.previousValue = previousValue;
        this.newValue = newValue;
    }

    redo() {
        this.textBoxWrapper.previousValue = this.newValue;
        setValue(this.element, this.newValue);
    }

    undo() {
        this.textBoxWrapper.previousValue = this.previousValue;
        setValue(this.element, this.previousValue);
    }
}

/**
 * TextBox wraps text-like elements and groups rapid edits into "chunks".
 *
 * It uses config.textChunkThrottle (ms) to decide how long to wait after
 * the last keystroke before committing an action.
 */
export class TextBox extends UndoableElement {
    /**
     * @param {HTMLElement} element
     * @param {Object} config
     */
    constructor(element, config = {}) {
        super(element);

        this.config = config;
        this.throttleMs =
            typeof config.textChunkThrottle === "number"
                ? config.textChunkThrottle
                : 0;

        // Last committed value (what undo/redo considers the "current" value)
        this.previousValue = getValue(this.element);

        // Chunking state
        this.chunkActive = false;
        this.chunkStartValue = this.previousValue;
        this.chunkTimerId = null;

        // Stable reference to be used to handle changes in the listeners
        this.handleBoundaryKeyEvent = this.handleBoundaryKeyEvent.bind(this)
        this.handleInputEvent = this.handleInputEvent.bind(this)
        this.commitChunk = this.commitChunk.bind(this)

        this._listenerCleanups = [];
        this.attachListeners();
    }

    /**
     * Commit the current chunk (if any) as a TextAction in history.
     */
    commitChunk() {
        if (this.chunkTimerId !== null) {
            clearTimeout(this.chunkTimerId);
            this.chunkTimerId = null;
        }

        const finalValue = getValue(this.element);

        // If we never actually started a chunk but value drifted (programmatic change),
        // fall back to a simple previous => current action.
        if (!this.chunkActive) {
            if (finalValue !== this.previousValue) {
                const action = new TextAction(
                    this.element,
                    this,
                    this.previousValue,
                    finalValue
                );
                pushActionToHistory(action);
                this.previousValue = finalValue;
            }
            return;
        }

        // Chunk was active; only commit if something actually changed from the start.
        if (finalValue !== this.chunkStartValue) {
            const action = new TextAction(
                this.element,
                this,
                this.chunkStartValue,
                finalValue
            );
            pushActionToHistory(action);
            this.previousValue = finalValue;
        }

        this.chunkActive = false;
    }

    /**
     * Called on every input event.
     * Starts or continues a chunk and (re)schedules the commit timer.
     */
    handleInputEvent() {
        const currentValue = getValue(this.element);

        // No actual change compared to last committed value; ignore.
        if (!this.chunkActive && currentValue === this.previousValue) {
            return;
        }

        // First change in this chunk: remember where we started.
        if (!this.chunkActive) {
            this.chunkActive = true;
            this.chunkStartValue = this.previousValue;
        }

        // If throttle is 0 or negative, commit immediately for each input.
        if (!this.throttleMs || this.throttleMs <= 0) {
            this.commitChunk();
            return;
        }

        // Otherwise, debounce commits: reset the timer on each keystroke.
        if (this.chunkTimerId !== null) {
            clearTimeout(this.chunkTimerId);
        }
        // Set new timer to commit chunk
        this.chunkTimerId = setTimeout(() =>
            { this.commitChunk();},
            this.throttleMs
        );
    }

    handleBoundaryKeyEvent(event) {
        if (BOUNDARY_KEYS.has(event.key)) {
            this.commitChunk()
        }
    }

    /**
     * Attach listeners for input/change/blur.
     * We record every change via input, but only push an action when:
     *  - the throttle timer fires, or
     *  - the element blurs / change event fires.
     */
    attachListeners() {
        this._addEventListener("input", this.handleInputEvent);
        this._addEventListener("keydown", this.handleBoundaryKeyEvent);
        // On blur or change, force a commit of any pending chunk.
        this._addEventListener("blur", this.commitChunk);
        this._addEventListener("change", this.commitChunk);
    }

    _addEventListener(type, handler, options) {
        this.element.addEventListener(type, handler, options)
        this._listenerCleanups.push(() => this.element.removeEventListener(type, handler, options));
    }

    disposeListeners() {
        // Clear pending timer so it can't fire after dispose
        if (this.chunkTimerId !== null) {
            clearTimeout(this.chunkTimerId);
            this.chunkTimerId = null;
        }

        this._listenerCleanups.forEach((fn) => fn())
        this._listenerCleanups = []
    }
}
