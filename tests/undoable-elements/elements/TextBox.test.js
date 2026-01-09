import { describe, expect, it, vi } from "vitest";
import { ensureHistoryStacks, getHistoryStack } from "../../../src/history.js";
import { TextBox } from "../../../src/undoable-elements/elements/TextBox.js";

describe("TextBox", () => {
    it("debounces into one action after throttle", () => {
        vi.useFakeTimers();
        ensureHistoryStacks();

        const input = document.createElement("input");
        input.type = "text";
        input.value = "a";
        document.body.appendChild(input);

        new TextBox(input, { textChunkThrottle: 300 });

        input.value = "ab";
        input.dispatchEvent(new Event("input", { bubbles: true }));

        input.value = "abc";
        input.dispatchEvent(new Event("input", { bubbles: true }));

        expect(getHistoryStack().length).toBe(0);

        vi.advanceTimersByTime(300);
        expect(getHistoryStack().length).toBe(1);

        const action = getHistoryStack()[0];
        expect(action.previousValue).toBe("a");
        expect(action.newValue).toBe("abc");

        action.undo();
        expect(input.value).toBe("a");
        action.redo();
        expect(input.value).toBe("abc");
    });

    it("boundary keys commit immediately", () => {
        vi.useFakeTimers();
        ensureHistoryStacks();

        const input = document.createElement("input");
        input.type = "text";
        input.value = "hello";
        document.body.appendChild(input);

        new TextBox(input, { textChunkThrottle: 9999 });

        input.value = "hello!";
        input.dispatchEvent(new Event("input", { bubbles: true }));

        input.dispatchEvent(
            new KeyboardEvent("keydown", { key: "ArrowLeft", bubbles: true })
        );

        expect(getHistoryStack().length).toBe(1);
        expect(getHistoryStack()[0].previousValue).toBe("hello");
        expect(getHistoryStack()[0].newValue).toBe("hello!");
    });

    it("flushAll commits active chunks across instances", () => {
        vi.useFakeTimers();
        ensureHistoryStacks();

        const a = document.createElement("input");
        a.type = "text";
        a.value = "1";
        const b = document.createElement("input");
        b.type = "text";
        b.value = "x";
        document.body.append(a, b);

        new TextBox(a, { textChunkThrottle: 9999 });
        new TextBox(b, { textChunkThrottle: 9999 });

        a.value = "12";
        a.dispatchEvent(new Event("input", { bubbles: true }));
        b.value = "xy";
        b.dispatchEvent(new Event("input", { bubbles: true }));

        TextBox.flushAll();
        expect(getHistoryStack().length).toBe(2);
    });

    it("dispose removes instance from global flushing behavior", () => {
        vi.useFakeTimers();
        ensureHistoryStacks();
        window.__GLOBAL_HISTORY__.length = 0;
        window.__REDO_STACK__.length = 0;

        const input = document.createElement("input");
        input.type = "text";
        input.value = "a";
        document.body.appendChild(input);

        const tb = new TextBox(input, { textChunkThrottle: 9999 });

        input.value = "ab";
        input.dispatchEvent(new Event("input", { bubbles: true }));

        // Now dispose before flushing
        tb.dispose();

        // Should not throw and should not commit anything from the disposed instance
        expect(() => TextBox.flushAll()).not.toThrow();
        expect(getHistoryStack()).toHaveLength(0);
    });
});
