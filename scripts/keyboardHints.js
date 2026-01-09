export function initKeyboardHints({ hostId = "kbdHints" } = {}) {
    const host = document.getElementById(hostId);
    if (!host) return;

    const platform = navigator.userAgentData?.platform || navigator.platform || "";
    const isApple = /Mac|iPhone|iPad|iPod/i.test(platform);

    // “Mod” key label (Ctrl on Windows/Linux, ⌘ on Mac)
    const modLabel = isApple ? "⌘" : "Ctrl";
    const shiftLabel = isApple ? "⇧" : "Shift";

    host.querySelectorAll(".kbd-mod").forEach((el) => (el.textContent = modLabel));
    host.querySelectorAll(".kbd-shift").forEach((el) => (el.textContent = shiftLabel));

    const comboUndo = host.querySelector('.kbd-combo[data-action="undo"]');
    const comboRedo = host.querySelector('.kbd-combo[data-action="redo"]');

    const timers = new Map();

    function flash(el) {
        if (!el) return;
        el.classList.add("active");
        clearTimeout(timers.get(el));
        timers.set(
            el,
            setTimeout(() => el.classList.remove("active"), 420)
        );
    }

    function keyLower(e) {
        return String(e.key || "").toLowerCase();
    }

    // Capture phase so we still see it even if something else handles it
    window.addEventListener(
        "keydown",
        (e) => {
            if (e.repeat) return;

            const modPressed = isApple ? e.metaKey : e.ctrlKey;
            if (!modPressed) return;

            const k = keyLower(e);

            // Undo: Mod+Z (no shift)
            if (!e.shiftKey && k === "z") {
                flash(comboUndo);
                return;
            }

            // Redo: Mod+Y OR Mod+Shift+Z
            if (k === "y" || (e.shiftKey && k === "z")) {
                flash(comboRedo);
            }
        },
        { capture: true }
    );
}
