function isEditable(el) {
    if (!el) return false;
    if (el.isContentEditable) return true;

    const tag = el.tagName?.toLowerCase();
    if (tag === "textarea") return true;

    if (tag === "input") {
        const type = (el.getAttribute("type") || "text").toLowerCase();
        return ["text", "search", "email", "url", "number", "tel", "password"].includes(type);
    }
    return false;
}

function isKeyboardLikelyOpen() {
    const vv = window.visualViewport;
    if (!vv) return false;

    const hidden = Math.max(0, window.innerHeight - vv.height - vv.offsetTop);

    // Threshold: small bars / browser UI shouldn't count as keyboard.
    return hidden > 80;
}

export function initMobileUndoRedoFABs() {
    const wrap = document.getElementById("mobileUndoRedo");
    if (!wrap) return;

    const btnUndo = document.getElementById("fabUndo");
    const btnRedo = document.getElementById("fabRedo");

    const api = window.UndoableUI;
    const hasAPI = api && typeof api.undo === "function" && typeof api.redo === "function";

    if (!hasAPI) {
        btnUndo.disabled = true;
        btnRedo.disabled = true;
        btnUndo.title = "UndoableUI not loaded";
        btnRedo.title = "UndoableUI not loaded";
        return;
    }

    // Track the last focused editable, but ONLY use it when the keyboard is open
    let lastEditable = null;
    document.addEventListener(
        "focusin",
        (e) => {
            const t = e.target;
            if (isEditable(t)) lastEditable = t;
        },
        true
    );

    function runAndPreserveKeyboard(fn) {
        const active = document.activeElement;

        // Prefer: keep the currently focused editable (caret stays where you were typing)
        let keep = isEditable(active) ? active : null;

        // Fallback: only restore last editable if keyboard is actually open
        if (!keep && isKeyboardLikelyOpen()) keep = lastEditable;

        fn();

        if (keep && typeof keep.focus === "function" && document.activeElement !== keep) {
            requestAnimationFrame(() => keep.focus({ preventScroll: true }));
        }
    }

    function bindFab(btn, actionFn) {
        const handler = (e) => {
            e.preventDefault();
            e.stopPropagation();
            runAndPreserveKeyboard(actionFn);
        };

        if ("PointerEvent" in window) {
            btn.addEventListener("pointerdown", handler);
        } else {
            btn.addEventListener("touchstart", handler, { passive: false });
        }

        // avoid double-trigger
        btn.addEventListener(
            "click",
            (e) => {
                e.preventDefault();
                e.stopPropagation();
            },
            true
        );
    }

    bindFab(btnUndo, () => api.undo());
    bindFab(btnRedo, () => api.redo());

    // --- your existing keyboard offset logic ---
    const vv = window.visualViewport;

    const updateKeyboardOffset = () => {
        if (!vv) return;
        const hidden = Math.max(0, window.innerHeight - vv.height - vv.offsetTop);
        wrap.style.setProperty("--kbd-offset", `${hidden}px`);
    };

    updateKeyboardOffset();

    if (vv) {
        vv.addEventListener("resize", updateKeyboardOffset);
        vv.addEventListener("scroll", updateKeyboardOffset);
    }
    window.addEventListener("resize", updateKeyboardOffset);
}
