// undoable-elements/elements/TextBox.js

import { UndoableElement } from '../UndoableElement.js';
import { Action } from '../Action.js';
import { pushActionToHistory } from '../../history.js';
import { getValue, setValue } from './TextElementHelpers.js';

/**
 * TextAction encapsulates a text change on an input/textarea/contenteditable.
 * It records the previous text and the new text.
 */
export class TextAction extends Action {
    /**
     * @param {HTMLElement} element
     * @param {TextBox} textBoxListener
     * @param {string} previousText
     * @param {string} newText
     */
    constructor(element, textBoxListener, previousText, newText) {
        super(element);
        this.textBoxListener = textBoxListener;
        this.previousText = previousText;
        this.newText = newText;
    }

    redo() {
        this.textBoxListener.oldValue = this.newText;
        setValue(this.element, this.newText);
    }

    undo() {
        this.textBoxListener.oldValue = this.previousText;
        setValue(this.element, this.previousText);
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
            typeof config.textChunkThrottle === 'number'
                ? config.textChunkThrottle
                : 0;

        // Last committed value (what undo/redo considers the "current" value)
        this.oldValue = getValue(this.element);

        // Chunking state
        this.chunkActive = false;
        this.chunkStartValue = this.oldValue;
        this.chunkTimerId = null;

        // Track instances so we can flush pending chunks globally if needed
        TextBox._instances.add(this);

        this.attachListeners();
    }

    /**
     * Attach listeners for input/change/blur.
     * We record every change via input, but only push an action when:
     *  - the throttle timer fires, or
     *  - the element blurs / change event fires.
     */
    attachListeners() {
        const handleInput = () => {
            this.handleInputEvent();
        };

        const finalizeChunk = () => {
            this.commitChunk();
        };

        this.element.addEventListener('input', handleInput);
        // On blur or change, force a commit of any pending chunk.
        this.element.addEventListener('blur', finalizeChunk);
        this.element.addEventListener('change', finalizeChunk);
    }

    /**
     * Called on every input event.
     * Starts or continues a chunk and (re)schedules the commit timer.
     */
    handleInputEvent() {
        const currentValue = getValue(this.element);

        // No actual change compared to last committed value; ignore.
        if (!this.chunkActive && currentValue === this.oldValue) {
            return;
        }

        // First change in this chunk: remember where we started.
        if (!this.chunkActive) {
            this.chunkActive = true;
            this.chunkStartValue = this.oldValue;
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

        this.chunkTimerId = setTimeout(() => {
            this.commitChunk();
        }, this.throttleMs);
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
        // fall back to a simple previous → current action.
        if (!this.chunkActive) {
            if (finalValue !== this.oldValue) {
                const action = new TextAction(
                    this.element,
                    this,
                    this.oldValue,
                    finalValue
                );
                pushActionToHistory(action);
                this.oldValue = finalValue;
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
            this.oldValue = finalValue;
        }

        this.chunkActive = false;
    }

    /**
     * Optional cleanup if you ever detach this element manually.
     */
    dispose() {
        TextBox._instances.delete(this);
        // If you want to be thorough, also remove event listeners (not stored here yet).
    }

    /**
     * Flush any pending chunks for *all* TextBox instances.
     * Useful to call before global undo/redo.
     * For example if the user triggers undo while still within an editing session. (Before the throttle timer fires.)
     */
    static flushAll() {
        TextBox._instances.forEach((instance) => {
            instance.commitChunk();
        });
    }
}

// Static collection of all active instances
TextBox._instances = new Set();
