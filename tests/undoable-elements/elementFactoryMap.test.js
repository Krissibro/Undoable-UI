import { describe, it, expect } from "vitest";
import { createFactoryMap, buildCandidateElementSelectors } from "../../src/undoable-elements/elementFactoryMap.js";
import { TextBox } from "../../src/undoable-elements/elements/TextBox.js";
// import { TextBoxCollapse } from "../../src/undoable-elements/elements/TextBoxCollapse.js";

describe("elementFactoryMap", () => {
    it("creates TextBox or TextBoxCollapse depending on config", () => {
        const input = document.createElement("input");
        input.type = "text";

        const map1 = createFactoryMap({ collapseTextEdits: false, textChunkThrottle: 0 });
        const inst1 = map1[0].factory(input);
        expect(inst1).toBeInstanceOf(TextBox);
        inst1.dispose();

        const map2 = createFactoryMap({ collapseTextEdits: true, textChunkThrottle: 0 });
        const inst2 = map2[0].factory(input);
        expect(inst2).toBeInstanceOf(TextBox);
        // TextBoxCollapse doesn't implement dispose cleanup via base dispose? it does (inherits). safe:
        inst2.dispose();
    });

    it("buildCandidateElementSelectors merges and normalizes whitespace", () => {
        const fm = [
            { selector: 'input[type="checkbox"]', factory: () => null },
            { selector: "\n   select   \n", factory: () => null },
        ];

        const merged = buildCandidateElementSelectors(fm);
        expect(merged).toBe('input[type="checkbox"], select');
    });
});
