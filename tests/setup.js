import { afterEach, beforeEach, vi } from "vitest";

// Helper: clean history stacks every test
function resetHistory() {
    window.__GLOBAL_HISTORY__ = [];
    window.__REDO_STACK__ = [];
}

beforeEach(() => {
    document.body.innerHTML = "";
    resetHistory();
    vi.useRealTimers();
});

afterEach(() => {
    // Clean up any leftover DOM listeners by nuking the DOM
    document.body.innerHTML = "";
    resetHistory();
});