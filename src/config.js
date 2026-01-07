
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


export function getConfig() {
    return { ...currentConfig };
}

export function setBaselineConfig(partial = {}) {
    baselineConfig = { ...defaultConfig, ...partial };
    currentConfig  = { ...baselineConfig };
    return currentConfig;
}

/**
 * Merges the provided partialConfig with the existing configuration.
 * Any properties not specified in partialConfig will retain their current values.
 * @param {Object} partialConfig - An object containing configuration properties to update.
 */
export function updateConfig(partialConfig = {}) {
    currentConfig = { ...currentConfig, ...partialConfig };
    return currentConfig;
}

/** Resets the current configuration to the default settings.
 */
export function resetConfigToBaseline() {
    currentConfig = { ...baselineConfig };
    return currentConfig;
}
