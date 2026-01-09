import { describe, it, expect, vi } from "vitest";

describe("lifecycle", () => {
    it("init emits initializing then ready (when DOM already ready)", async () => {
        vi.resetModules();
        const { init } = await import("../src/lifecycle.js");

        const phases = [];
        window.addEventListener("undoableui:status", (e) => {
            phases.push(e.detail.phase);
        });

        init();

        expect(phases[0]).toBe("initializing");
        expect(phases[phases.length - 1]).toBe("ready");
    });

    it("updateConfigAndReinit before init returns null", async () => {
        vi.resetModules();
        const { updateConfigAndReinit } = await import("../src/lifecycle.js");

        const res = updateConfigAndReinit({ textChunkThrottle: 0 });
        expect(res).toBe(null);
    });

    it("coalesces rapid updateConfigAndReinit calls into a single reinit tick", async () => {
        vi.useFakeTimers();
        vi.resetModules();

        const lifecycle = await import("../src/lifecycle.js");

        const events = [];
        window.addEventListener("undoableui:status", (e) => {
            events.push(e.detail);
        });

        lifecycle.init();
        events.length = 0; // ignore init events

        lifecycle.updateConfigAndReinit({ textChunkThrottle: 1 });
        lifecycle.updateConfigAndReinit({ textChunkThrottle: 2 });
        lifecycle.updateConfigAndReinit({ textChunkThrottle: 3 });

        // flush setTimeout(0)
        vi.runAllTimers();

        const reinitEvents = events.filter((d) => d.phase === "reinitializing");
        const readyEvents = events.filter((d) => d.phase === "ready");

        // With current guard (_reinitScheduled), this should be exactly one reinit scheduled.
        expect(reinitEvents).toHaveLength(1);
        expect(readyEvents).toHaveLength(1);
        expect(readyEvents[0].reason).toBe("updateConfig");
    });
});
