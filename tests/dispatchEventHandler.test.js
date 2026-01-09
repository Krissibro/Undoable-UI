import { describe, expect, it, vi } from "vitest";
import { dispatchEvents, emitStatus } from "../src/dispatchEventHandler.js";

describe("dispatchEventHandler", () => {
    it("dispatches input/change based on strategy", () => {
        const el = document.createElement("input");
        let inputCount = 0;
        let changeCount = 0;

        el.addEventListener("input", () => inputCount++);
        el.addEventListener("change", () => changeCount++);

        dispatchEvents({ element: el }, { undoRedoEventDispatchStrategy: "both" });

        expect(inputCount).toBe(1);
        expect(changeCount).toBe(1);
    });

    it("uses affectedElements() when present", () => {
        const a = document.createElement("input");
        const b = document.createElement("input");
        let count = 0;
        a.addEventListener("change", () => count++);
        b.addEventListener("change", () => count++);

        const action = {
            element: a,
            affectedElements: () => [a, b]
        };

        dispatchEvents(action, { undoRedoEventDispatchStrategy: "change" });
        expect(count).toBe(2);
    });

    it("emitStatus dispatches undoableui:status", () => {
        const spy = vi.fn();
        window.addEventListener("undoableui:status", spy);

        emitStatus({ phase: "ready", busy: false });

        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy.mock.calls[0][0].detail).toEqual({ phase: "ready", busy: false });
    });
});
