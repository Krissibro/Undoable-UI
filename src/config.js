
export const defaultConfig = Object.freeze({
    maxHistorySize:     100,
    textChunkThrottle:  300,
    collapseTextEdits:  false,
    // Dispatch native events after undo/redo so app UI updates.
    // "none" | "input" | "change" | "both"
    undoRedoEventDispatchStrategy: "both",
    // TODO: future attributes
    // debug: false,
    // scopeStrategy: 'global', // or 'local'
    // branchingHistory: false,

});

let baselineConfig = { ...defaultConfig };
let currentConfig = { ...defaultConfig };

const allowedKeys = new Set([
    "maxHistorySize",
    "textChunkThrottle",
    "collapseTextEdits",
    "undoRedoEventDispatchStrategy",
]);

const allowedDispatch = new Set(["none", "input", "change", "both"]);



export function getConfig() {
    return { ...currentConfig };
}

export function setBaselineConfig(partialBaseline = {}) {
    const normalizedConfig = normalizeConfig(partialBaseline, defaultConfig);
    baselineConfig = { ...defaultConfig, ...normalizedConfig };
    currentConfig = { ...baselineConfig };
    return getConfig();
}

/**
 * Merges the provided partialConfig with the existing configuration.
 * Any properties not specified in partialConfig will retain their current values.
 * @param {Object} partialConfig - An object containing configuration properties to update.
 */
export function updateConfig(partialConfig = {}) {
    const normalizedConfig = normalizeConfig(partialConfig, currentConfig);
    currentConfig = { ...currentConfig, ...normalizedConfig };
    return getConfig();
}

/** Resets the current configuration to the default settings.
 */
export function resetConfigToBaseline() {
    currentConfig = { ...baselineConfig };
    return { ...currentConfig };
}



// ---------- normalization helpers ----------

function toFiniteNumber(x) {
    if (typeof x === "number") return Number.isFinite(x) ? x : null;
    if (typeof x === "string") {
        const s = x.trim();
        if (s === "") return null;
        const n = Number(s);
        return Number.isFinite(n) ? n : null;
    }
    return null;
}

function normalizeConfig(partial = {}, baseDefaults) {
    const out = {};

    // Keep only known keys (typos get ignored)
    for (const [k, v] of Object.entries(partial)) {
        if (!allowedKeys.has(k)) continue;
        out[k] = v;
    }

    // maxHistorySize: must be a finite int >= 1 (0/negative/nonsense ignored)
    if ("maxHistorySize" in out) {
        const n = toFiniteNumber(out.maxHistorySize);
        if (n === null) {
            delete out.maxHistorySize;
        } else {
            const int = Math.trunc(n);
            if (int < 1) {
                delete out.maxHistorySize;
            } else {
                // optional ceiling to avoid absurd memory
                out.maxHistorySize = Math.min(int, 10000);
            }
        }
    }

    // textChunkThrottle: must be finite int >= 0 (negative/nonsense ignored)
    if ("textChunkThrottle" in out) {
        const n = toFiniteNumber(out.textChunkThrottle);
        if (n === null) {
            delete out.textChunkThrottle;
        } else {
            const int = Math.trunc(n);
            if (int < 0) {
                delete out.textChunkThrottle;
            } else {
                out.textChunkThrottle = Math.min(int, 60000);
            }
        }
    }

    // collapseTextEdits: only accept actual booleans (string "false" should NOT become true)
    if ("collapseTextEdits" in out) {
        if (typeof out.collapseTextEdits !== "boolean") {
            delete out.collapseTextEdits;
        }
    }

    // undoRedoEventDispatchStrategy: enum, invalid ignored
    if ("undoRedoEventDispatchStrategy" in out) {
        const s = String(out.undoRedoEventDispatchStrategy);
        if (!allowedDispatch.has(s)) {
            delete out.undoRedoEventDispatchStrategy;
        } else {
            out.undoRedoEventDispatchStrategy = s;
        }
    }

    // If you ever want: “invalid should revert to defaults” instead of “ignored”
    // then this is where you'd use baseDefaults[key] as fallback.
    return out;
}
