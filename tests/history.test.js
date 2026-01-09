import { describe, expect, it, vi } from "vitest";
import {
    ensureHistoryStacks,
    pushActionToHistory,
    getHistoryStack,
    getRedoStack,
} from "../src/history.js";
import { activateHistoryReplayProtection } from "../src/historyReplayProtection.js";

// Config is mocked so trimming is deterministic.
// We also expose __setConfig so tests can adjust maxHistorySize per test.
vi.mock("../src/config.js", () => {
    let cfg = { maxHistorySize: 3 };
    return {
        getConfig: () => cfg,
        __setConfig: (partial) => {
            cfg = { ...cfg, ...partial };
        },
    };
});

// Import the mocked helper from the mocked module
import { __setConfig } from "../src/config.js";

describe("history", () => {
    it("ensureHistoryStacks initializes globals", () => {
        delete window.__GLOBAL_HISTORY__;
        delete window.__REDO_STACK__;
        ensureHistoryStacks();
        expect(Array.isArray(window.__GLOBAL_HISTORY__)).toBe(true);
        expect(Array.isArray(window.__REDO_STACK__)).toBe(true);
    });

    it("pushActionToHistory trims to maxHistorySize and clears redo", () => {
        __setConfig({ maxHistorySize: 3 });

        ensureHistoryStacks();
        window.__REDO_STACK__.push({});

        pushActionToHistory({ id: 1 });
        pushActionToHistory({ id: 2 });
        pushActionToHistory({ id: 3 });
        pushActionToHistory({ id: 4 }); // should trim out id:1

        expect(getHistoryStack().map((a) => a.id)).toEqual([2, 3, 4]);
        expect(getRedoStack().length).toBe(0);
    });

    it("does not record during history replay", () => {
        __setConfig({ maxHistorySize: 3 });

        ensureHistoryStacks();
        activateHistoryReplayProtection(() => {
            pushActionToHistory({ id: 123 });
        });
        expect(getHistoryStack().length).toBe(0);
    });

    // ✅ Additional edge test
    it("maxHistorySize=0 keeps history empty (trims everything)", () => {
        __setConfig({ maxHistorySize: 0 });

        ensureHistoryStacks();
        pushActionToHistory({ id: 1 });
        pushActionToHistory({ id: 2 });

        expect(getHistoryStack()).toHaveLength(0);
    });
});
