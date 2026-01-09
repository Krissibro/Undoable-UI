import { describe, it, expect } from "vitest";
import { getHistoryStack } from "../../../src/history.js";
import { Select } from "../../../src/undoable-elements/elements/Select.js";

describe("Select", () => {
    it("records selection changes and undo/redo restores selected value", () => {
        const el = document.createElement("select");
        el.innerHTML = `
      <option value="a">A</option>
      <option value="b">B</option>
    `;
        el.value = "a";
        document.body.appendChild(el);

        const wrapper = new Select(el);

        el.value = "b";
        el.dispatchEvent(new Event("change", { bubbles: true }));

        expect(getHistoryStack()).toHaveLength(1);
        const [action] = getHistoryStack();

        action.undo();
        expect(el.value).toBe("a");

        action.redo();
        expect(el.value).toBe("b");

        wrapper.dispose();
    });
});
