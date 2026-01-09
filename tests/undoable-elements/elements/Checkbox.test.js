import { describe, it, expect, beforeEach } from "vitest";
import { ensureHistoryStacks, getHistoryStack } from "../../../src/history.js";
import { Checkbox } from "../../../src/undoable-elements/elements/Checkbox.js";

describe("Checkbox", () => {
    beforeEach(() => {
        ensureHistoryStacks();
        window.__GLOBAL_HISTORY__.length = 0;
        window.__REDO_STACK__.length = 0;
    });

    it("pushes a CheckboxAction on change and undo/redo toggles checked state", () => {
        const el = document.createElement("input");
        el.type = "checkbox";
        document.body.appendChild(el);

        const wrapper = new Checkbox(el);

        el.checked = true;
        el.dispatchEvent(new Event("change", { bubbles: true }));

        const [action] = getHistoryStack();
        expect(action.previousState).toBe(false);
        expect(action.newState).toBe(true);

        action.undo();
        expect(el.checked).toBe(false);

        action.redo();
        expect(el.checked).toBe(true);

        wrapper.dispose();
    });
});
