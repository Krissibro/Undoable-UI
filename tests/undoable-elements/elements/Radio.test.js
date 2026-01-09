import { describe, it, expect, beforeEach } from "vitest";
import { ensureHistoryStacks, getHistoryStack } from "../../../src/history.js";
import { Radio } from "../../../src/undoable-elements/elements/Radio.js";

describe("Radio", () => {
    beforeEach(() => {
        ensureHistoryStacks();
        window.__GLOBAL_HISTORY__.length = 0;
        window.__REDO_STACK__.length = 0;
        // clear static cache between tests
        delete Radio.previousSelections;
    });

    it("records radio group changes with previous selection and undo/redo restores", () => {
        const r1 = document.createElement("input");
        r1.type = "radio";
        r1.name = "g";
        r1.id = "r1";

        const r2 = document.createElement("input");
        r2.type = "radio";
        r2.name = "g";
        r2.id = "r2";

        document.body.appendChild(r1);
        document.body.appendChild(r2);

        const w1 = new Radio(r1);
        const w2 = new Radio(r2);

        // Select r1
        r1.checked = true;
        r1.dispatchEvent(new Event("change", { bubbles: true }));
        expect(getHistoryStack()).toHaveLength(1);
        expect(getHistoryStack()[0].previousRadio).toBe(null);

        // Select r2 (manually uncheck r1 since jsdom doesn't always simulate group behavior)
        r1.checked = false;
        r2.checked = true;
        r2.dispatchEvent(new Event("change", { bubbles: true }));

        expect(getHistoryStack()).toHaveLength(2);
        const action = getHistoryStack()[1];
        expect(action.previousRadio).toBe(r1);

        action.undo();
        expect(r1.checked).toBe(true);
        expect(r2.checked).toBe(false);

        action.redo();
        expect(r2.checked).toBe(true);

        w1.dispose();
        w2.dispose();
    });

    it("affectedElements includes both new and previous radios (when present)", () => {
        const r1 = document.createElement("input");
        r1.type = "radio";
        r1.name = "g";
        const r2 = document.createElement("input");
        r2.type = "radio";
        r2.name = "g";
        document.body.appendChild(r1);
        document.body.appendChild(r2);

        const w1 = new Radio(r1);
        const w2 = new Radio(r2);

        r1.checked = true;
        r1.dispatchEvent(new Event("change", { bubbles: true }));

        r1.checked = false;
        r2.checked = true;
        r2.dispatchEvent(new Event("change", { bubbles: true }));

        const action = getHistoryStack()[1];
        const els = action.affectedElements();
        expect(els).toContain(r2);
        expect(els).toContain(r1);

        w1.dispose();
        w2.dispose();
    });
});
