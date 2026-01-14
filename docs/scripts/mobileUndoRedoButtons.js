export function initMobileUndoRedoFABs() {
    const wrap = document.getElementById("mobileUndoRedo");
    if (!wrap) return;

    const btnUndo = document.getElementById("fabUndo");
    const btnRedo = document.getElementById("fabRedo");

    const api = window.UndoableUI;
    const hasAPI = api && typeof api.undo === "function" && typeof api.redo === "function";

    // If the library isn't loaded, disable buttons so the UI doesn't lie
    if (!hasAPI) {
        btnUndo.disabled = true;
        btnRedo.disabled = true;
        btnUndo.title = "UndoableUI not loaded";
        btnRedo.title = "UndoableUI not loaded";
        return;
    }

    btnUndo.addEventListener("click", () => api.undo());
    btnRedo.addEventListener("click", () => api.redo());

    // --- Keep the buttons just above the on-screen keyboard (mobile) ---
    const vv = window.visualViewport;

    const updateKeyboardOffset = () => {
        if (!vv) return;

        // How much of the layout viewport is NOT visible (keyboard, browser UI, etc.)
        const hidden =
            Math.max(0, window.innerHeight - vv.height - vv.offsetTop);

        wrap.style.setProperty("--kbd-offset", `${hidden}px`);
    };

    updateKeyboardOffset();

    if (vv) {
        vv.addEventListener("resize", updateKeyboardOffset);
        vv.addEventListener("scroll", updateKeyboardOffset);
    }
    window.addEventListener("resize", updateKeyboardOffset);
}
