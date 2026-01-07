
export function dispatchEvents( action, config ) {
    const dispatchStrategy = config?.undoRedoEventDispatchStrategy;

    if ( !dispatchStrategy || dispatchStrategy === "none" ) return;

    // Check if the action has multiple affected elements
    // Radio button groups for example
    const targetElements =
        typeof action.affectedElements === "function"
            ? action.affectedElements()
            : [action.element];

    // Dispatch events for each affected element
    for ( const element of targetElements ) {
        if ( !element ) continue;

        if ( dispatchStrategy === "input" || dispatchStrategy === "both" ) {
            element.dispatchEvent(new Event("input", { bubbles: true }));
        }
        if ( dispatchStrategy === "change" || dispatchStrategy === "both" ) {
            element.dispatchEvent(new Event("change", {bubbles: true}));
        }
        // TODO: Maybe add a custom undo event here?
    }
}

export function emitStatus( detail ) {
    // detail example: { phase: "reinitializing", busy: true, reason: "updateConfig" }
    window.dispatchEvent(new CustomEvent("undoableui:status", { detail }));
}