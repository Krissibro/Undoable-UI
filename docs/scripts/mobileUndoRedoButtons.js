function isEditable(el) {
    if (!el) return false;
    if (el.isContentEditable) return true;

    const tag = el.tagName?.toLowerCase();
    if (tag === "textarea") return true;
    if (tag === "input") {
        const type = (el.getAttribute("type") || "text").toLowerCase();
        // types where the OS keyboard is relevant
        return ["text", "search", "email", "url", "number", "tel", "password"].includes(type);
    }
    return false;
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

    // Track last focused editable element (so we can restore focus)
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
        const keep = isEditable(active) ? active : lastEditable;

        fn();

        // Safety: re-focus after the action (prevents keyboard drop / reopens quickly)
        if (keep && typeof keep.focus === "function") {
            requestAnimationFrame(() => keep.focus({ preventScroll: true }));
        }
    }

    // Important part:
    // Use pointerdown/touchstart + preventDefault so the button doesn't steal focus.
    function bindFab(btn, actionFn) {
        const handler = (e) => {
            // Prevent the browser from moving focus to the button (which closes the keyboard)
            e.preventDefault();
            e.stopPropagation();
            runAndPreserveKeyboard(actionFn);
        };

        if ("PointerEvent" in window) {
            btn.addEventListener("pointerdown", handler);
        } else {
            // Older iOS fallback. Must be passive:false or preventDefault won't work.
            btn.addEventListener("touchstart", handler, { passive: false });
        }

        // Prevent click from firing a second time (some browsers will still emit it)
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

    // --- Keep the buttons just above the on-screen keyboard (mobile) ---
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
