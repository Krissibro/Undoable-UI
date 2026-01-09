import { afterEach, beforeEach, vi } from "vitest";
import { disposeAllUndoables } from "../src/undoable-elements/elementRegistry.js";
import { setBaselineConfig } from "../src/config.js";

// Helper: clean history stacks every test
function resetHistory() {
    window.__GLOBAL_HISTORY__ = [];
    window.__REDO_STACK__ = [];
}

beforeEach(() => {
    // Always reset config baseline/current so tests don't depend on order.
    setBaselineConfig({});

    document.body.innerHTML = "";
    resetHistory();
    vi.useRealTimers();

    // Ensure wrapper instances (and their listeners) don’t leak across tests
    disposeAllUndoables();
});

afterEach(() => {
    // Clean up any leftover DOM listeners by nuking the DOM
    document.body.innerHTML = "";
    resetHistory();

    // Double-tap cleanup in case a test registered instances late
    disposeAllUndoables();
    vi.useRealTimers();
});
