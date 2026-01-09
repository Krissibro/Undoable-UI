import { describe, it, expect, vi } from "vitest";

describe("globalListeners", () => {
    it("binds undo/redo shortcuts once and prevents default", async () => {
        vi.resetModules();
        const mod = await import("../src/globalListeners.js");
        const ensureGlobalListeners = mod.ensureGlobalListeners;

        const undo = vi.fn();
        const redo = vi.fn();

        ensureGlobalListeners({ undo, redo });

        const eUndo = new KeyboardEvent("keydown", {
            key: "z",
            ctrlKey: true,
            bubbles: true,
            cancelable: true,
        });
        document.dispatchEvent(eUndo);
        expect(undo).toHaveBeenCalledTimes(1);
        expect(eUndo.defaultPrevented).toBe(true);

        const eRedoY = new KeyboardEvent("keydown", {
            key: "y",
            ctrlKey: true,
            bubbles: true,
            cancelable: true,
        });
        document.dispatchEvent(eRedoY);
        expect(redo).toHaveBeenCalledTimes(1);
        expect(eRedoY.defaultPrevented).toBe(true);

        const eRedoShiftZ = new KeyboardEvent("keydown", {
            key: "z",
            ctrlKey: true,
            shiftKey: true,
            bubbles: true,
            cancelable: true,
        });
        document.dispatchEvent(eRedoShiftZ);
        expect(redo).toHaveBeenCalledTimes(2);
        expect(eRedoShiftZ.defaultPrevented).toBe(true);

        // Second call should NOT add duplicates and should NOT replace handlers
        const undo2 = vi.fn();
        const redo2 = vi.fn();
        ensureGlobalListeners({ undo: undo2, redo: redo2 });

        const eUndo2 = new KeyboardEvent("keydown", {
            key: "z",
            ctrlKey: true,
            bubbles: true,
            cancelable: true,
        });
        document.dispatchEvent(eUndo2);

        expect(undo).toHaveBeenCalledTimes(2);
        expect(undo2).toHaveBeenCalledTimes(0);
    });
});
