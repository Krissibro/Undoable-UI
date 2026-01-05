import { onReady } from "./domUtils.js";
import { initColorValueMirror } from "./colorValueMirror.js";
import { mountAddSquaresController } from "./addSquaresController.js";
import { mountConfigPanel } from "./configPanel.js";

onReady(() => {
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
});