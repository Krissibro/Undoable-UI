import { describe, it, expect } from "vitest";

describe("index.js global exposure", () => {
    it("exposes window.UndoableUI with expected API", async () => {
        // importing should attach to window in jsdom
        await import("../src/index.js");

        expect(window.UndoableUI).toBeTruthy();
        expect(typeof window.UndoableUI.init).toBe("function");
        expect(typeof window.UndoableUI.undo).toBe("function");
        expect(typeof window.UndoableUI.redo).toBe("function");
        expect(typeof window.UndoableUI.updateConfig).toBe("function");
        expect(typeof window.UndoableUI.resetConfig).toBe("function");
        expect(typeof window.UndoableUI.getConfig).toBe("function");
    });
});
