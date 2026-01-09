import { describe, it, expect, afterEach, vi } from "vitest";
import { registerInstance, unregisterInstance, disposeAllUndoables } from "../../src/undoable-elements/elementRegistry.js";

describe("elementRegistry", () => {
    afterEach(() => {
        disposeAllUndoables();
    });

    it("disposeAllUndoables calls dispose on all registered instances and clears them", () => {
        const a = { dispose: vi.fn() };
        const b = { dispose: vi.fn() };

        registerInstance(a);
        registerInstance(b);

        disposeAllUndoables();

        expect(a.dispose).toHaveBeenCalledTimes(1);
        expect(b.dispose).toHaveBeenCalledTimes(1);

        // second call should not call again (registry cleared)
        disposeAllUndoables();
        expect(a.dispose).toHaveBeenCalledTimes(1);
    });

    it("unregisterInstance removes it so disposeAllUndoables won't dispose it", () => {
        const a = { dispose: vi.fn() };
        registerInstance(a);
        unregisterInstance(a);

        disposeAllUndoables();
        expect(a.dispose).not.toHaveBeenCalled();
    });
});
