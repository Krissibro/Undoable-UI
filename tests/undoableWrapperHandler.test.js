import { describe, it, expect, vi } from "vitest";
import { scanForAndWrapUndoableElements, createMutationObserver } from "../src/undoableWrapperHandler.js";

describe("undoableWrapperHandler", () => {
    it("wraps both root element (if matching) and descendants", () => {
        const factoryMap = [
            {
                selector: 'input[type="checkbox"]',
                factory: (el) => ({ el, dispose: vi.fn() }),
            },
        ];

        // root matches selector
        const root = document.createElement("input");
        root.type = "checkbox";

        scanForAndWrapUndoableElements(root, factoryMap);
        expect(root.__undoable__).toBeTruthy();

        // descendants
        const container = document.createElement("div");
        container.innerHTML = `
      <input id="a" type="checkbox" />
      <div><input id="b" type="checkbox" /></div>
    `;
        scanForAndWrapUndoableElements(container, factoryMap);

        expect(container.querySelector("#a").__undoable__).toBeTruthy();
        expect(container.querySelector("#b").__undoable__).toBeTruthy();
    });

    it("does not double-wrap elements that already have __undoable__", () => {
        const factoryMap = [
            { selector: 'input[type="checkbox"]', factory: () => ({ marker: "new" }) },
        ];

        const input = document.createElement("input");
        input.type = "checkbox";
        input.__undoable__ = { marker: "existing" };

        scanForAndWrapUndoableElements(input, factoryMap);
        expect(input.__undoable__.marker).toBe("existing");
    });

    it("MutationObserver wraps newly added nodes and their subtree", async () => {
        const factoryMap = [
            {
                selector: 'input[type="checkbox"]',
                factory: (el) => ({ el }),
            },
        ];

        const observer = createMutationObserver(factoryMap);

        const wrapper = document.createElement("div");
        wrapper.innerHTML = `<div><input id="m" type="checkbox" /></div>`;
        document.body.appendChild(wrapper);

        // Let MutationObserver flush
        await new Promise((r) => setTimeout(r, 0));

        expect(document.querySelector("#m").__undoable__).toBeTruthy();

        observer.disconnect();
    });
});
