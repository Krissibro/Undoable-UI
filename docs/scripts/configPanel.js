import { qs } from "./domUtils.js";

function safeGetAPI() {
    const api = window.UndoableUI;
    if (!api) {
        throw new Error("window.UndoableUI not found. Is dist/undoable-ui.umd.js loaded?");
    }
    return api;
}

function parseOptionalNumber(value) {
    const trimmed = String(value ?? "").trim();
    if (trimmed === "") return undefined;
    const n = Number(trimmed);
    return Number.isFinite(n) ? n : undefined;
}

function render(hostEl) {
    hostEl.innerHTML = `
    <div class="cfg">
      <div class="cfg-header">
        <div>
          <div class="cfg-title">Config</div>
          <div class="cfg-subtitle">Live tweak UndoableUI behavior</div>
        </div>
      </div>

      <div class="cfg-grid">
        <label class="cfg-field">
          <span class="cfg-label">textChunkThrottle (ms)</span>
          <input id="cfg_textChunkThrottle" type="number" min="0" step="50" />
        </label>

        <label class="cfg-field">
          <span class="cfg-label">maxUndoStack</span>
          <input id="cfg_maxUndoStack" type="number" min="1" step="10" />
        </label>

        <label class="cfg-field cfg-span-2">
          <span class="cfg-label">undoRedoEventDispatchStrategy</span>
          <select id="cfg_dispatchStrategy">
            <option value="none">none</option>
            <option value="input">input</option>
            <option value="change">change</option>
            <option value="both">both</option>
          </select>
        </label>

        <label class="cfg-check cfg-span-2">
          <input id="cfg_collapseTextEdits" type="checkbox" />
          <span>collapseTextEdits</span>
        </label>

        <label class="cfg-check cfg-span-2">
          <input id="cfg_reinitialize" type="checkbox" checked />
          <span>reinitialize wrappers</span>
        </label>
      </div>

      <div class="cfg-actions">
        <button id="cfg_apply" class="cfg-btn cfg-btn-primary" type="button">Apply</button>
        <button id="cfg_reset" class="cfg-btn" type="button">Reset</button>
      </div>

      <div class="cfg-status" id="cfg_status"></div>

      <details class="cfg-details" open>
        <summary class="cfg-summary">Current config</summary>
        <pre id="cfg_output" class="cfg-output"></pre>
      </details>
    </div>
  `;
}

function setStatus(msg) {
    qs("cfg_status").textContent = msg;
}

function syncUIFromConfig(config) {
    if (!config || typeof config !== "object") return;

    if ("textChunkThrottle" in config) qs("cfg_textChunkThrottle").value = String(config.textChunkThrottle ?? "");
    if ("maxUndoStack" in config) qs("cfg_maxUndoStack").value = String(config.maxUndoStack ?? "");
    if ("collapseTextEdits" in config) qs("cfg_collapseTextEdits").checked = Boolean(config.collapseTextEdits);
    if ("undoRedoEventDispatchStrategy" in config) {
        qs("cfg_dispatchStrategy").value = String(config.undoRedoEventDispatchStrategy);
    }

    qs("cfg_output").textContent = JSON.stringify(config, null, 2);
}

function readPartialFromUI() {
    const partial = {};

    const t = parseOptionalNumber(qs("cfg_textChunkThrottle").value);
    if (t !== undefined) partial.textChunkThrottle = t;

    const m = parseOptionalNumber(qs("cfg_maxUndoStack").value);
    if (m !== undefined) partial.maxUndoStack = m;

    partial.collapseTextEdits = qs("cfg_collapseTextEdits").checked;
    partial.undoRedoEventDispatchStrategy = qs("cfg_dispatchStrategy").value;

    return partial;
}

export function mountConfigPanel({ hostId }) {
    const host = qs(hostId);
    render(host);

    const api = safeGetAPI();

    // Load current config without side effects if you eventually expose api.getConfig().
    // For now, keep your existing "reset without reinit" approach.
    try {
        const initial = api.resetConfigToDefaults({ reinitialize: false });
        syncUIFromConfig(initial);
        setStatus("Loaded defaults (no reinit).");
    } catch {
        syncUIFromConfig({
            maxUndoStack: 100,
            textChunkThrottle: 300,
            collapseTextEdits: false,
            undoRedoEventDispatchStrategy: "both",
        });
        setStatus("Loaded UI defaults (library not queried).");
    }

    qs("cfg_apply").addEventListener("click", () => {
        const reinitialize = qs("cfg_reinitialize").checked;
        const partial = readPartialFromUI();

        const updated = api.updateConfig(partial, { reinitialize });
        syncUIFromConfig(updated);
        setStatus(`Applied (${reinitialize ? "reinit" : "no reinit"}).`);
    });

    qs("cfg_reset").addEventListener("click", () => {
        const reinitialize = qs("cfg_reinitialize").checked;

        const reset = api.resetConfigToDefaults({ reinitialize });
        syncUIFromConfig(reset);
        setStatus(`Reset (${reinitialize ? "reinit" : "no reinit"}).`);
    });
}
