

let _hasGlobalListeners = false;
export let isMouseDown = false;

export function ensureGlobalListeners({ undo, redo }) {
    if ( _hasGlobalListeners ) return;
    addGlobalUndoRedoShortcuts({ undo, redo });
    addMouseDownListeners();
    _hasGlobalListeners = true;
}

function addGlobalUndoRedoShortcuts({ undo, redo }) {
    document.addEventListener('keydown', function (event) {
        const isCtrlOrCmd = event.ctrlKey || event.metaKey;
        if ( !isCtrlOrCmd ) return;

        const key = event.key.toLowerCase();

        // Ctrl+Z or Cmd+Z for Undo
        if ( !event.shiftKey && key === "z" ) {
            event.preventDefault();
            undo();
            return;
        }

        // Ctrl+Y or Cmd+Shift+Z for Redo
        if ( (key === "y") || (event.shiftKey && key === "z") ) {
            event.preventDefault();
            redo();
        }
    });
}

// TODO: needed?
// For the color picker for example, check if mouse is down to avoid capturing intermediate states
function addMouseDownListeners() {
    document.addEventListener('mousedown', () => isMouseDown = true);
    document.addEventListener('mouseup',   () => isMouseDown = false);
}

