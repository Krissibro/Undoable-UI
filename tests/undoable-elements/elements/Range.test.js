import { describe, it, expect, beforeEach } from "vitest";
import { ensureHistoryStacks, getHistoryStack } from "../../../src/history.js";
import { Range } from "../../../src/undoable-elements/elements/Range.js";

describe("Range", () => {
    beforeEach(() => {
        ensureHistoryStacks();
        window.__GLOBAL_HISTORY__.length = 0;
        window.__REDO_STACK__.length = 0;
    });

    it("records changes on change event and undo/redo restores values", () => {
        const el = document.createElement("input");
        el.type = "range";
        el.value = "10";
        document.body.appendChild(el);

        const wrapper = new Range(el);

        el.value = "25";
        el.dispatchEvent(new Event("change", { bubbles: true }));

        expect(getHistoryStack()).toHaveLength(1);
        const [action] = getHistoryStack();

        action.undo();
        expect(el.value).toBe("10");

        action.redo();
        expect(el.value).toBe("25");

        wrapper.dispose();
    });
});
