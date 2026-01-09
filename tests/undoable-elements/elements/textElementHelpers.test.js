import { describe, it, expect } from "vitest";
import { getValue, isContentEditable, setValue } from "../../../src/undoable-elements/elements/textElementHelpers.js";

describe("textElementHelpers", () => {
    it("handles normal inputs via .value", () => {
        const input = document.createElement("input");
        input.value = "a";

        expect(isContentEditable(input)).toBe(false);
        expect(getValue(input)).toBe("a");

        setValue(input, "b");
        expect(input.value).toBe("b");
    });

    it("handles contenteditable elements via .innerText", () => {
        const div = document.createElement("div");
        div.setAttribute("contenteditable", "true");
        div.innerText = "hello";

        expect(isContentEditable(div)).toBe(true);
        expect(getValue(div)).toBe("hello");

        setValue(div, "world");
        expect(div.innerText).toBe("world");
    });
});
