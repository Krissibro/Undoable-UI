import { describe, expect, it, vi } from "vitest";
import { ensureHistoryStacks, pushActionToHistory, getHistoryStack, getRedoStack } from "../src/history.js";
import { activateHistoryReplayProtection } from "../src/historyReplayProtection.js";

vi.mock("../src/config.js", () => {
    // Make trimming deterministic for this test file
    let cfg = { maxHistorySize: 3 };
    return {
        getConfig: () => cfg
    };
});

describe("history", () => {
    it("ensureHistoryStacks initializes globals", () => {
        delete window.__GLOBAL_HISTORY__;
        delete window.__REDO_STACK__;
        ensureHistoryStacks();
        expect(Array.isArray(window.__GLOBAL_HISTORY__)).toBe(true);
        expect(Array.isArray(window.__REDO_STACK__)).toBe(true);
    });

    it("pushActionToHistory trims to maxHistorySize and clears redo", () => {
        ensureHistoryStacks();
        window.__REDO_STACK__.push({});

        pushActionToHistory({ id: 1 });
        pushActionToHistory({ id: 2 });
        pushActionToHistory({ id: 3 });
        pushActionToHistory({ id: 4 }); // should trim out id:1

        expect(getHistoryStack().map(a => a.id)).toEqual([2, 3, 4]);
        expect(getRedoStack().length).toBe(0);
    });

    it("does not record during history replay", () => {
        ensureHistoryStacks();
        activateHistoryReplayProtection(() => {
            pushActionToHistory({ id: 123 });
        });
        expect(getHistoryStack().length).toBe(0);
    });
});
