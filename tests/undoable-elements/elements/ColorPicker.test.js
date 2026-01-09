import { describe, it, expect, beforeEach } from "vitest";
import { ensureHistoryStacks, getHistoryStack } from "../../../src/history.js";
import { ColorPicker } from "../../../src/undoable-elements/elements/ColorPicker.js";

describe("ColorPicker", () => {
    beforeEach(() => {
        ensureHistoryStacks();
        window.__GLOBAL_HISTORY__.length = 0;
        window.__REDO_STACK__.length = 0;
    });

    it("records changes on change event and updates oldColor", () => {
        const el = document.createElement("input");
        el.type = "color";
        el.value = "#000000";
        document.body.appendChild(el);

        const wrapper = new ColorPicker(el);

        el.value = "#ffffff";
        el.dispatchEvent(new Event("change", { bubbles: true }));

        expect(getHistoryStack()).toHaveLength(1);
        const [action] = getHistoryStack();

        action.undo();
        expect(el.value).toBe("#000000");
        expect(wrapper.oldColor).toBe("#000000");

        action.redo();
        expect(el.value).toBe("#ffffff");
        expect(wrapper.oldColor).toBe("#ffffff");

        wrapper.dispose();
    });
});
