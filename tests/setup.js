import { afterEach, beforeEach, vi } from "vitest";
import { disposeAllUndoables } from "../src/undoable-elements/elementRegistry";

// Helper: clean history stacks every test
function resetHistory() {
    window.__GLOBAL_HISTORY__ = [];
    window.__REDO_STACK__ = [];
}

beforeEach(() => {
    document.body.innerHTML = "";
    resetHistory();
    vi.useRealTimers();
    disposeAllUndoables();
});

afterEach(() => {
    // Clean up any leftover DOM listeners by nuking the DOM
    document.body.innerHTML = "";
    resetHistory();
});