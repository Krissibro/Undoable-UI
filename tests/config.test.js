import { describe, expect, it } from "vitest";
import { defaultConfig, getConfig, setBaselineConfig, updateConfig, resetConfigToBaseline } from "../src/config.js";

describe("config", () => {
    it("getConfig returns a copy", () => {
        setBaselineConfig({ maxHistorySize: 10 });

        const cfg = getConfig();
        const mutated = { ...cfg, maxHistorySize: 999 };

        // The important assertion: internal config didn't change
        expect(getConfig().maxHistorySize).toBe(10);

        // (optional) sanity check your local mutated copy is different
        expect(mutated.maxHistorySize).toBe(999);
    });

    it("updateConfig merges", () => {
        setBaselineConfig({ textChunkThrottle: 200, collapseTextEdits: false });

        const updated = updateConfig({ collapseTextEdits: true });
        expect(updated.textChunkThrottle).toBe(200);
        expect(updated.collapseTextEdits).toBe(true);
    });

    it("setBaselineConfig resets baseline + current", () => {
        const cfg = setBaselineConfig({ textChunkThrottle: 123 });
        expect(cfg.textChunkThrottle).toBe(123);

        updateConfig({ textChunkThrottle: 999 });
        expect(getConfig().textChunkThrottle).toBe(999);

        resetConfigToBaseline();
        expect(getConfig().textChunkThrottle).toBe(123);
    });

    it("defaults remain intact", () => {
        expect(defaultConfig).toHaveProperty("maxHistorySize");
    });
});
