import { emitStatus } from "./dispatchEventHandler";
import { getConfig, resetConfigToBaseline, setBaselineConfig, updateConfig } from "./config";
import { createFactoryMap } from "./undoable-elements/elementFactoryMap";
import { ensureHistoryStacks } from "./history";
import { initializeUndoableWrappers, reinitializeUndoWrappers } from "./undoableWrapperHandler";
import { ensureGlobalListeners } from "./globalListeners";
import { flushActiveUndoables, redo, undo } from "./commands";



let factoryMap = null;

let _initialized = false;

//init coordination
let _initScheduled = false;
let _initInProgress = false;
let _pendingBaselineConfig = null;     // last init({config}) before init actually runs

// reinit coordination (coalescing)
let _reinitInProgress = false;
let _reinitScheduled = false;
let _reinitQueued = false;
// For when reinit is requested multiple times in succession. Last config matters.
let _latestReinitInReason = null;


// TODO: leaving it here for now, but could just use setTimeout as is
// queueMicrotask fallback
// const queueMicrotaskFn =
//     (typeof queueMicrotask === "function")
//         ? queueMicrotask
//         : (fn) => Promise.resolve().then(fn);


function runInit() {
    if (_initialized || _initInProgress) return;
    _initInProgress = true;
    _initScheduled = false;

    emitStatus({ phase: "initializing", busy: true, reason: "init" });

    const baselineFromInit = _pendingBaselineConfig || {};
    _pendingBaselineConfig = null;

    const config = setBaselineConfig(baselineFromInit);
    factoryMap = createFactoryMap(config);

    ensureHistoryStacks();
    initializeUndoableWrappers(factoryMap);
    ensureGlobalListeners({ undo, redo });

    _initialized = true;
    _initInProgress = false;
    _initScheduled = false;

    emitStatus({ phase: "ready", busy: false, reason: "init" });
}

function scheduleInitIfNeeded() {
    if (_initialized || _initInProgress || _initScheduled) return;
    _initScheduled = true;

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", runInit, { once: true });
    } else {
        // DOM already ready: run immediately (fixes the “init no-op” bug)
        runInit();
    }
}

function requestReinit(reason) {
    _latestReinitInReason = reason || "reinit";

    if (_reinitInProgress) {
        _reinitQueued = true;
        return;
    }
    if (_reinitScheduled) return;
    _reinitScheduled = true;

    emitStatus({ phase: "reinitializing", busy: true, reason: _latestReinitInReason });

    // queueMicrotaskFn(runReinit);
    setTimeout(runReinit, 0)
}

function runReinit() {
    _reinitScheduled = false;
    if (!_initialized) return; // init not done yet
    if (_reinitInProgress) return;

    _reinitInProgress = true;

    const reason = _latestReinitInReason;
    try {
        // emitStatus({ phase: "reinitializing", busy: true, reason });
        // Commit pending chunks before disposing wrappers
        flushActiveUndoables();
        // Latest config wins
        factoryMap = createFactoryMap(getConfig());
        reinitializeUndoWrappers(factoryMap);

        // emitStatus({ phase: "ready", busy: false, reason });
    } finally {
        // Check if another reinit was queued during this one
        _reinitInProgress = false;

        emitStatus({ phase: "ready", busy: false, reason });
        if (_reinitQueued) {
            _reinitQueued = false;
            requestReinit("queued");
        }
    }
}

/**
 * Public: init()
 * Initialization function.
 * Scans the DOM for undoable elements and attaches their handlers.
 * Sets up mutation observers to handle dynamically added elements.
 * Also sets up global keyboard shortcuts for undo/redo.
 * Safe to call multiple times; initialization only happens once.
 * Last init({config}) wins if called multiple times before init completes.
 * @param options
 * @returns {null}
 */
export function init(options = {}) {
    const { config: userConfig = {} } = options;

    if (_initialized) return getConfig();
    // last init config wins
    _pendingBaselineConfig = userConfig;

    scheduleInitIfNeeded();
    return getConfig();
}

/**
 * Public: updateConfigAndReinitialize()
 * Updates config and optionally reinitializes wrappers.
 * @param {object} partialConfig
 * @param {{ reinitialize?: boolean }} [options]
 * @returns {object} updated config
 */
export function updateConfigAndReinit(partialConfig = {}, options = {}) {
    if (!_initialized) return null;

    const { reinitialize = true } = options;
    const config = updateConfig(partialConfig);

    if (reinitialize) {
        requestReinit("updateConfig");
    }

    return config;
}

/**
 * Public: resetConfigAndReinitialize()
 * Resets config and optionally reinitializes wrappers.
 * @param {{ reinitialize?: boolean }} [options]
 * @returns {object} reset config
 */
export function resetConfigAndReinit(options = {}) {
    if (!_initialized) return null;

    const { reinitialize = true } = options;
    const config = resetConfigToBaseline();

    if (reinitialize) {
        requestReinit("resetConfig");
    }

    return config;
}

