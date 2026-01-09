import { describe, it, expect } from "vitest";
import { getHistoryStack } from "../../../src/history.js";
import { DateTime } from "../../../src/undoable-elements/elements/DateTime.js";

describe("DateTime", () => {
    it("records a single action even if both input and change fire", () => {
        const el = document.createElement("input");
        el.type = "date";
        el.value = "2025-01-01";
        document.body.appendChild(el);

        const wrapper = new DateTime(el);

        el.value = "2025-02-02";
        el.dispatchEvent(new Event("input", { bubbles: true }));
        el.dispatchEvent(new Event("change", { bubbles: true }));

        expect(getHistoryStack()).toHaveLength(1);

        const [action] = getHistoryStack();

        action.undo();
        expect(el.value).toBe("2025-01-01");

        action.redo();
        expect(el.value).toBe("2025-02-02");

        wrapper.dispose();
    });
});
