import { onReady } from "./domUtils.js";
import { initColorValueMirror } from "./colorValueMirror.js";
import { mountAddSquaresController } from "./addSquaresController.js";
import { mountConfigPanel } from "./configPanel.js";
import { initKeyboardHints } from "./keyboardHints.js";


onReady(() => {
    // Attach status listener FIRST, so we don't miss init/reinit events
    window.addEventListener("undoableui:status", (e) => {
        const { phase, busy } = e.detail || {};
        document.body.dataset.undoableuiBusy = busy ? "1" : "0";
        document.body.dataset.undoableuiPhase = phase || "";
    });

    // Now init the library (emits status events)
    if (window.UndoableUI?.init) {
        window.UndoableUI.init({
            config: {
                maxHistorySize: 100,
                textChunkThrottle: 300,
            },
        });
    } else {
        console.warn("window.UndoableUI not found. Is dist/undoable-ui.umd.js loading correctly?");
    }

    initColorValueMirror({
        inputId: "color1",
        outputId: "color1Value",
    });

    mountConfigPanel({
        hostId: "config-controller",
    });

    mountAddSquaresController({
        hostId: "add-squares-to-grid-controller",
        gridId: "grid",
    });

    initKeyboardHints({ hostId: "kbdHints" });

    // Open "Additional options" by default on desktop, collapsed on mobile
    const additional = document.getElementById("additionalOptions");
    if (additional && window.matchMedia("(min-width: 981px)").matches) {
        additional.open = true;
    }

});
