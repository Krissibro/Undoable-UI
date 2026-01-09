import { describe, it, expect, vi } from "vitest";

describe("index.js global exposure", () => {
    it("exposes window.UndoableUI with expected API", async () => {
        await import("../src/index.js");

        expect(window.UndoableUI).toBeTruthy();
        expect(typeof window.UndoableUI.init).toBe("function");
        expect(typeof window.UndoableUI.undo).toBe("function");
        expect(typeof window.UndoableUI.redo).toBe("function");
        expect(typeof window.UndoableUI.updateConfig).toBe("function");
        expect(typeof window.UndoableUI.resetConfig).toBe("function");
        expect(typeof window.UndoableUI.getConfig).toBe("function");
    });

    it("public API smoke: init wraps input and undo reverts value", async () => {
        vi.resetModules();
        await import("../src/index.js");

        const input = document.createElement("input");
        input.type = "text";
        document.body.appendChild(input);

        // Assumes init() works with no args (common for libs like this).
        // If your init signature differs, adjust the call here.
        window.UndoableUI.updateConfig({ textChunkThrottle: 0, undoRedoEventDispatchStrategy: "none" });
        window.UndoableUI.init();

        input.value = "hello";
        input.dispatchEvent(new Event("input", { bubbles: true }));

        window.UndoableUI.undo();
        expect(input.value).toBe("");

        window.UndoableUI.redo();
        expect(input.value).toBe("hello");
    });
});
