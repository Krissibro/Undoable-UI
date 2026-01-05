import { qs } from "./domUtils.js";

export function initColorValueMirror({ inputId, outputId }) {
    const colorInput = qs(inputId);
    const colorValue = qs(outputId);

    const update = () => {
        colorValue.textContent = colorInput.value;
    };

    update();
    colorInput.addEventListener("change", update);
    colorInput.addEventListener("input", update);
}
