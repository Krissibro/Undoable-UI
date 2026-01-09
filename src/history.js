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
    let { maxHistorySize } = getConfig();

    // Normalize: accept numbers or numeric strings
    maxHistorySize = typeof maxHistorySize === "string"
        ? Number(maxHistorySize)
        : maxHistorySize;

    // Fallback for nonsense (NaN, Infinity, undefined, objects, etc.)
    if (!Number.isFinite(maxHistorySize)) {
        return; // or set to a default like 100, depending on your philosophy
    }

    // Clamp + integerize
    maxHistorySize = Math.max(0, Math.trunc(maxHistorySize));

    // 0 means "history disabled"
    if (maxHistorySize === 0) {
        window.__GLOBAL_HISTORY__.length = 0;
        return;
    }

    const overflow = window.__GLOBAL_HISTORY__.length - maxHistorySize;
    if (overflow > 0) {
        window.__GLOBAL_HISTORY__.splice(0, overflow);
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
