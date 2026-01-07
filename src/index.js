// src/index.js
import { getConfig } from "./config";
import { init, resetConfigAndReinit, updateConfigAndReinit } from "./lifecycle";
import { redo, undo } from "./commands";


if (typeof window !== 'undefined') {
    // TODO: Consider if auto-initialization is desired

    // Expose the API globally (UMD style)
    window.UndoableUI = {
        init,
        undo,
        redo,
        updateConfig: updateConfigAndReinit,
        resetConfig: resetConfigAndReinit,
        getConfig,
    };
}
