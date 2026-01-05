// Counter instead of boolean to support nested calls in the future
let historyReplayDepth = 0;

export function activateHistoryReplayProtection(fn) {
    historyReplayDepth++;
    try {
        return fn();
    } finally {
        historyReplayDepth--;
    }
}

export function isHistoryReplaying() {
    return historyReplayDepth > 0;
}