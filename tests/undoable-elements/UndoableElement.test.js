import { describe, it, expect } from "vitest";
import { UndoableElement } from "../../src/undoable-elements/UndoableElement.js";
import { activateHistoryReplayProtection } from "../../src/historyReplayProtection.js";

class TestWrapper extends UndoableElement {
    constructor(el) {
        super(el);
        this.calls = 0;
        this.cleaned = false;
        this.thisWasWrapper = false; // ✅ NEW
        this.attachListeners();
    }
    attachListeners() {
        this.addProtectedListener("change", this.handle);
    }
    handle() {
        this.calls++;
        this.thisWasWrapper = this instanceof TestWrapper; // ✅ NEW
    }
    extraSubclassCleanup() {
        this.cleaned = true;
    }
}

describe("UndoableElement base class", () => {
    it("protected listener does not fire during history replay", () => {
        const el = document.createElement("input");
        el.type = "checkbox";

        const w = new TestWrapper(el);

        el.dispatchEvent(new Event("change"));
        expect(w.calls).toBe(1);

        activateHistoryReplayProtection(() => {
            el.dispatchEvent(new Event("change"));
        });

        expect(w.calls).toBe(1);

        w.dispose();
    });

    it("protected listener preserves `this` binding to the wrapper instance", () => {
        const el = document.createElement("input");
        el.type = "checkbox";

        const w = new TestWrapper(el);
        el.dispatchEvent(new Event("change"));

        expect(w.thisWasWrapper).toBe(true);

        w.dispose();
    });

    it("dispose removes listeners, clears __undoable__, and runs subclass cleanup", () => {
        const el = document.createElement("input");
        el.type = "checkbox";

        const w = new TestWrapper(el);
        el.__undoable__ = w;

        w.dispose();
        expect(el.__undoable__).toBeUndefined();
        expect(w.cleaned).toBe(true);

        el.dispatchEvent(new Event("change"));
        expect(w.calls).toBe(0);
    });
});
