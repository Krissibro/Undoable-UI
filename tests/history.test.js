import { describe, expect, it, beforeEach, vi } from "vitest";
import {
    ensureHistoryStacks,
    pushActionToHistory,
    getHistoryStack,
    getRedoStack,
} from "../src/history.js";
import { activateHistoryReplayProtection } from "../src/historyReplayProtection.js";

// History assumes config is already valid.
// So in these tests we only feed it valid numbers.
vi.mock("../src/config.js", () => {
    let cfg = { maxHistorySize: 3 };
    return {
        getConfig: () => cfg,
        __setConfig: (partial) => {
            cfg = { ...cfg, ...partial };
        },
    };
});

import { __setConfig } from "../src/config.js";

describe("history", () => {
    beforeEach(() => {
        __setConfig({ maxHistorySize: 3 });
        ensureHistoryStacks();
        window.__GLOBAL_HISTORY__.length = 0;
        window.__REDO_STACK__.length = 0;
    });

    it("ensureHistoryStacks initializes globals", () => {
        delete window.__GLOBAL_HISTORY__;
        delete window.__REDO_STACK__;

        ensureHistoryStacks();

        expect(Array.isArray(window.__GLOBAL_HISTORY__)).toBe(true);
        expect(Array.isArray(window.__REDO_STACK__)).toBe(true);
    });

    it("ensureHistoryStacks does not replace existing arrays", () => {
        ensureHistoryStacks();
        const h = window.__GLOBAL_HISTORY__;
        const r = window.__REDO_STACK__;

        ensureHistoryStacks();

        expect(window.__GLOBAL_HISTORY__).toBe(h);
        expect(window.__REDO_STACK__).toBe(r);
    });

    it("pushActionToHistory trims to maxHistorySize and clears redo by default", () => {
        __setConfig({ maxHistorySize: 3 });

        window.__REDO_STACK__.push({ id: "redo" });

        pushActionToHistory({ id: 1 });
        pushActionToHistory({ id: 2 });
        pushActionToHistory({ id: 3 });
        pushActionToHistory({ id: 4 }); // trims out id: 1

        expect(getHistoryStack().map((a) => a.id)).toEqual([2, 3, 4]);
        expect(getRedoStack()).toHaveLength(0);
    });

    it("pushActionToHistory respects clearRedo=false", () => {
        __setConfig({ maxHistorySize: 10 });

        window.__REDO_STACK__.push({ id: "redo" });

        pushActionToHistory({ id: 1 }, { clearRedo: false });

        expect(getHistoryStack().map((a) => a.id)).toEqual([1]);
        expect(getRedoStack().map((a) => a.id)).toEqual(["redo"]);
    });

    it("does not record during history replay", () => {
        activateHistoryReplayProtection(() => {
            pushActionToHistory({ id: 123 });
        });

        expect(getHistoryStack()).toHaveLength(0);
    });
});
