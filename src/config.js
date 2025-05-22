
const defaultConfig = {
    collapseTextEdits: false,
    maxUndoStack:    100,
    textChunkThrottle: 500,
};


let _cachedConfig = null;

/**
 * Fetches (once) the user’s JSON config and
 * shallow-merges it over the defaults.
 * @param {string} path  URL or relative path to the JSON config
 * @returns {Promise<Config>}
 */
export async function getConfig(path = './undo.config.json') {
    if (_cachedConfig) return _cachedConfig;

    let userConfig = {};
    try {
        const res = await fetch(path);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        userConfig = await res.json();
    } catch (e) {
        console.warn(`Could not load config at ${path}, using defaults.`, e);
    }

    // shallow merge: any key present in userConfig overrides defaultConfig
    _cachedConfig = { ...defaultConfig, ...userConfig };
    return _cachedConfig;
}