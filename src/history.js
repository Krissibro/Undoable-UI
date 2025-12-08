import { getConfig } from './config.js';

export function ensureStacks() {
    window.__GLOBAL_HISTORY__ = window.__GLOBAL_HISTORY__ || [];
    window.__REDO_STACK__ = window.__REDO_STACK__ || [];
}

ensureStacks();

export function clearRedoStack() {
    window.__REDO_STACK__.length = 0;
}

function trimHistory() {
    const { maxUndoStack } = getConfig();
    if (Number.isFinite(maxUndoStack) && maxUndoStack > 0) {
        while (window.__GLOBAL_HISTORY__.length > maxUndoStack) {
            window.__GLOBAL_HISTORY__.shift();
        }
    }
}

export function pushActionToHistory(action, { clearRedo = true } = {}) {
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
