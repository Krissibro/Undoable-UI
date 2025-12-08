export const defaultConfig = Object.freeze({
    maxUndoStack:       100,
    textChunkThrottle:  300,
    collapseTextEdits:  false,
    // TODO: future attributes
    // debug: false,
    // scopeStrategy: 'global', // or 'local'
    // branchingHistory: false,
});


let currentConfig = { ...defaultConfig };


export function getConfig() {
    return currentConfig;
}

export function setConfig(partialConfig = {}) {
    currentConfig = { ...defaultConfig, ...partialConfig };
    return currentConfig;
}

export function resetConfig() {
    currentConfig = { ...defaultConfig };
    return currentConfig;
}
