const instances = new Set();

export function registerInstance (instance) {
    instances.add(instance);
}

export function unregisterInstance (instance) {
    instances.delete(instance)
}

export function disposeAllUndoables () {
    instances.forEach( (instance) => {
        if ( typeof instance.dispose === "function") {
            instance.dispose();
        }
    });
    instances.clear()
}