import { getConfig } from './config.js';
import {isHistoryReplaying} from "./historyReplayProtection";

export function ensureHistoryStacks() {
    window.__GLOBAL_HISTORY__ = window.__GLOBAL_HISTORY__ || [];
    window.__REDO_STACK__ = window.__REDO_STACK__ || [];
}

export function clearRedoStack() {
    window.__REDO_STACK__.length = 0;
}

function trimHistory() {
    const { maxHistorySize } = getConfig();

    // Config is responsible for validation.
    // This guard is just a last-ditch safety net, not “handling”.
    if (!Number.isFinite(maxHistorySize) || maxHistorySize < 1) return;

    while (window.__GLOBAL_HISTORY__.length > maxHistorySize) {
        window.__GLOBAL_HISTORY__.shift();
    }
}

export function pushActionToHistory(action, { clearRedo = true } = {}) {
    // Extra safety check to avoid recording actions during undo/redo operations
    if (isHistoryReplaying()) return;
    window.__GLOBAL_HISTORY__.push(action);
    trimHistory();
    if (clearRedo) {
        clearRedoStack();
    }
}

export function pushActionToRedoStack(action) {
    window.__REDO_STACK__.push(action);
}

export function getHistoryStack() {
    return window.__GLOBAL_HISTORY__;
}

export function getRedoStack() {
    return window.__REDO_STACK__;
}
