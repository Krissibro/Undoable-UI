
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


function toInt(x, fallback) {
    if (typeof x === "number" && Number.isFinite(x)) return Math.trunc(x);
    if (typeof x === "string" && x.trim() !== "" && Number.isFinite(Number(x))) return Math.trunc(Number(x));
    return fallback;
}

function clamp(n, min, max) {
    return Math.min(max, Math.max(min, n));
}

function normalizeConfig(partial = {}, baseDefaults) {
    const out = {};

    // Only keep known keys (prevents typos silently doing nothing)
    for (const [k, v] of Object.entries(partial)) {
        if (!allowedKeys.has(k)) continue;
        out[k] = v;
    }

    // maxHistorySize: int 0..10000 (choose your ceiling)
    if ("maxHistorySize" in out) {
        const raw = toInt(out.maxHistorySize, baseDefaults.maxHistorySize);
        out.maxHistorySize = clamp(raw, 1, 10000);
    }

    // textChunkThrottle: int 0..60000ms
    if ("textChunkThrottle" in out) {
        const raw = toInt(out.textChunkThrottle, baseDefaults.textChunkThrottle);
        out.textChunkThrottle = clamp(raw, 0, 60000);
    }

    // collapseTextEdits: boolean (coerce only simple cases if you want)
    if ("collapseTextEdits" in out) {
        out.collapseTextEdits = Boolean(out.collapseTextEdits);
    }

    // undoRedoEventDispatchStrategy: enum
    if ("undoRedoEventDispatchStrategy" in out) {
        const s = String(out.undoRedoEventDispatchStrategy);
        out.undoRedoEventDispatchStrategy = allowedDispatch.has(s)
            ? s
            : baseDefaults.undoRedoEventDispatchStrategy;
    }

    return out;
}
