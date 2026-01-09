import { describe, it, expect, beforeEach, vi } from "vitest";
import { setBaselineConfig, getConfig, updateConfig } from "../src/config.js";
import { ensureHistoryStacks, getHistoryStack, getRedoStack } from "../src/history.js";
import { undo, redo } from "../src/commands.js";
import { TextBox } from "../src/undoable-elements/elements/TextBox.js";

describe("commands (undo/redo)", () => {
    beforeEach(() => {
        ensureHistoryStacks();
        window.__GLOBAL_HISTORY__.length = 0;
        window.__REDO_STACK__.length = 0;
    });

    it("undo/redo moves actions between stacks and dispatches events when strategy=both", () => {
        setBaselineConfig({ undoRedoEventDispatchStrategy: "both", textChunkThrottle: 0 });

        const input = document.createElement("input");
        input.type = "text";
        document.body.appendChild(input);

        const tb = new TextBox(input, getConfig());

        // Create one history action via input event
        input.value = "hello";
        input.dispatchEvent(new Event("input", { bubbles: true }));
        expect(getHistoryStack()).toHaveLength(1);
        expect(getRedoStack()).toHaveLength(0);

        // Count events caused by undo/redo (ignore the one we manually dispatched above)
        let inputEvents = 0;
        let changeEvents = 0;
        input.addEventListener("input", () => inputEvents++);
        input.addEventListener("change", () => changeEvents++);

        // Undo should revert value and dispatch input+change
        undo();
        expect(input.value).toBe("");
        expect(getHistoryStack()).toHaveLength(0);
        expect(getRedoStack()).toHaveLength(1);

        // Important: replay protection should prevent new actions being recorded
        expect(getHistoryStack()).toHaveLength(0);

        expect(inputEvents).toBe(1);
        expect(changeEvents).toBe(1);

        // Redo should re-apply and dispatch again
        redo();
        expect(input.value).toBe("hello");
        expect(getHistoryStack()).toHaveLength(1);
        expect(getRedoStack()).toHaveLength(0);

        expect(inputEvents).toBe(2);
        expect(changeEvents).toBe(2);

        tb.dispose();
    });

    it("does not dispatch events when strategy=none", () => {
        setBaselineConfig({ undoRedoEventDispatchStrategy: "none", textChunkThrottle: 0 });

        const input = document.createElement("input");
        input.type = "text";
        document.body.appendChild(input);

        const tb = new TextBox(input, getConfig());

        input.value = "x";
        input.dispatchEvent(new Event("input", { bubbles: true }));
        expect(getHistoryStack()).toHaveLength(1);

        let inputEvents = 0;
        let changeEvents = 0;
        input.addEventListener("input", () => inputEvents++);
        input.addEventListener("change", () => changeEvents++);

        undo();
        redo();

        expect(inputEvents).toBe(0);
        expect(changeEvents).toBe(0);

        tb.dispose();
    });

    it("flushActiveUndoables commits a pending TextBox chunk before undo runs", () => {
        vi.useFakeTimers();

        setBaselineConfig({ undoRedoEventDispatchStrategy: "both", textChunkThrottle: 1000 });

        const input = document.createElement("input");
        input.type = "text";
        document.body.appendChild(input);

        const tb = new TextBox(input, getConfig());

        // Start a chunk; with throttle=1000 this should NOT commit yet
        input.value = "pending";
        input.dispatchEvent(new Event("input", { bubbles: true }));

        expect(getHistoryStack()).toHaveLength(0);

        // undo() calls flushActiveUndoables() first, which should commit the chunk
        // and then undo it (so value returns to empty)
        undo();

        expect(input.value).toBe("");
        expect(getHistoryStack()).toHaveLength(0);
        expect(getRedoStack()).toHaveLength(1);

        // Ensure no timer later creates surprise history
        vi.runAllTimers();
        expect(getHistoryStack()).toHaveLength(0);

        tb.dispose();
    });

    it("updateConfig affects undo/redo dispatch strategy (sanity)", () => {
        setBaselineConfig({ undoRedoEventDispatchStrategy: "both" });
        updateConfig({ undoRedoEventDispatchStrategy: "none" });

        const cfg = getConfig();
        expect(cfg.undoRedoEventDispatchStrategy).toBe("none");
    });
});
