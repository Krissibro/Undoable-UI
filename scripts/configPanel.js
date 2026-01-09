import { qs } from "./domUtils.js";

function safeGetAPI() {
    const api = window.UndoableUI;
    if (!api) throw new Error("window.UndoableUI not found. Is dist/undoable-ui.umd.js loaded?");
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
    <div class="ctrl">
      <div class="ui-grid-2">
        <label class="ui-field">
          <span class="ui-label">textChunkThrottle (ms)</span>
          <input class="ui-input" id="cfg_textChunkThrottle" type="number" min="0" step="50" />
        </label>

        <label class="ui-field">
          <span class="ui-label">maxHistorySize</span>
          <input class="ui-input" id="cfg_maxHistorySize" type="number" min="1" step="10" />
        </label>

        <label class="ui-field ui-span-2">
          <span class="ui-label">undoRedoEventDispatchStrategy</span>
          <select class="ui-input" id="cfg_dispatchStrategy">
            <option value="none">none</option>
            <option value="input">input</option>
            <option value="change">change</option>
            <option value="both">both</option>
          </select>
        </label>

        <label class="ui-check ui-span-2">
          <input id="cfg_collapseTextEdits" type="checkbox" />
          <span>collapseTextEdits</span>
        </label>

        <label class="ui-check ui-span-2">
          <input id="cfg_reinitialize" type="checkbox" checked />
          <span>Reinitialize wrappers and use updated config</span>
        </label>
      </div>

      <div class="ui-actions">
        <button id="cfg_apply" class="btn btn-primary" type="button">Apply</button>
        <button id="cfg_reset" class="btn" type="button">Reset</button>
      </div>

      <div class="ui-status" id="cfg_status"></div>

      <details class="ui-details" open>
        <summary class="ui-summary">Current config</summary>
        <pre id="cfg_output" class="ui-pre"></pre>
      </details>
    </div>
  `;
}



/**
 * Status UX strategy:
 * - "authoritative" status comes from undoableui:status events
 * - we can show a *temporary* local message (like "Queued apply…") that auto-clears
 */
let tempStatusTimer = null;
let lastEventAt = 0;

function setStatus(msg) {
    qs("cfg_status").textContent = msg;
}

function setTempStatus(msg, ms = 800) {
    // Don't stomp on active busy events
    // (If the lib is currently busy, its event loop should own the status)
    const isBusy = document.body?.dataset?.undoableuiBusy === "1";
    if (isBusy) return;

    clearTimeout(tempStatusTimer);
    setStatus(msg);
    tempStatusTimer = setTimeout(() => {
        // Only clear if no recent events arrived (so we don’t erase real status)
        const quietFor = Date.now() - lastEventAt;
        if (quietFor > ms) setStatus("Ready.");
    }, ms);
}

function setBusyUIFromEvent(busy, phase, reason) {
    // disable buttons while busy
    qs("cfg_apply").disabled = busy;
    qs("cfg_reset").disabled = busy;

    // optional: disable inputs too
    qs("cfg_textChunkThrottle").disabled = busy;
    qs("cfg_maxHistorySize").disabled = busy;
    qs("cfg_dispatchStrategy").disabled = busy;
    qs("cfg_collapseTextEdits").disabled = busy;
    qs("cfg_reinitialize").disabled = busy;

    // spinner class
    qs("cfg_status").classList.toggle("busy", busy);

    // authoritative text
    if (busy) setStatus(`${phase}… (${reason || "unknown"})`);
    else setStatus("Ready.");
}

function syncUIFromConfig(config) {
    if (!config || typeof config !== "object") return;

    if ("textChunkThrottle" in config) qs("cfg_textChunkThrottle").value = String(config.textChunkThrottle ?? "");
    if ("maxHistorySize" in config) qs("cfg_maxHistorySize").value = String(config.maxHistorySize ?? "");
    if ("collapseTextEdits" in config) qs("cfg_collapseTextEdits").checked = Boolean(config.collapseTextEdits);
    if ("undoRedoEventDispatchStrategy" in config) qs("cfg_dispatchStrategy").value = String(config.undoRedoEventDispatchStrategy);

    qs("cfg_output").textContent = JSON.stringify(config, null, 2);
}

function readPartialFromUI() {
    const partial = {};

    const t = parseOptionalNumber(qs("cfg_textChunkThrottle").value);
    if (t !== undefined) partial.textChunkThrottle = t;

    const m = parseOptionalNumber(qs("cfg_maxHistorySize").value);
    if (m !== undefined) partial.maxHistorySize = m;

    partial.collapseTextEdits = qs("cfg_collapseTextEdits").checked;
    partial.undoRedoEventDispatchStrategy = qs("cfg_dispatchStrategy").value;

    return partial;
}

function isPromise(x) {
    return x && typeof x.then === "function";
}

export function mountConfigPanel({ hostId }) {
    const host = qs(hostId);
    render(host);

    const api = safeGetAPI();

    function handleUndoableStatusEvent(e) {
        // Log EVERYTHING so we can see what the library really emits
        console.log("undoableui:status event", {
            target: e.target,
            currentTarget: e.currentTarget,
            detail: e.detail,
        });

        lastEventAt = Date.now();
        clearTimeout(tempStatusTimer);
        tempStatusTimer = null;

        const detail = e.detail || {};

        // Be tolerant: accept multiple possible field names
        const busy = Boolean(detail.busy ?? detail.isBusy ?? detail.working ?? false);
        const phase = String(detail.phase ?? detail.stage ?? detail.status ?? "working");
        const reason = String(detail.reason ?? detail.message ?? "");

        setBusyUIFromEvent(busy, phase, reason);
    }

// Listen in more places, including capture phase
    window.addEventListener("undoableui:status", handleUndoableStatusEvent, true);
    document.addEventListener("undoableui:status", handleUndoableStatusEvent, true);

    // initial load
    try {
        syncUIFromConfig(api.getConfig());
    } catch {
        syncUIFromConfig({
            maxHistorySize: 100,
            textChunkThrottle: 300,
            collapseTextEdits: false,
            undoRedoEventDispatchStrategy: "both",
        });
    }
    setStatus("Ready.");

    qs("cfg_apply").addEventListener("click", async () => {
        const reinitialize = qs("cfg_reinitialize").checked;
        const partial = readPartialFromUI();

        try {
            // Show a quick “queued” message, but do NOT pretend we know the real phase.
            setTempStatus(reinitialize ? "Queued apply + reinit…" : "Queued apply…", 900);

            const updated = api.updateConfig(partial, { reinitialize });
            if (isPromise(updated)) await updated;

            // reflect actual config after operation
            try {
                syncUIFromConfig(api.getConfig());
            } catch {
                // if your updateConfig returns config, use that
                if (updated && typeof updated === "object") syncUIFromConfig(updated);
            }
        } catch (err) {
            console.error(err);
            setStatus(`❌ Apply failed: ${err?.message || err}`);
        }
    });

    qs("cfg_reset").addEventListener("click", async () => {
        const reinitialize = qs("cfg_reinitialize").checked;

        try {
            setTempStatus(reinitialize ? "Queued reset + reinit…" : "Queued reset…", 900);

            const reset = api.resetConfig({ reinitialize });
            if (isPromise(reset)) await reset;

            try {
                syncUIFromConfig(api.getConfig());
            } catch {
                if (reset && typeof reset === "object") syncUIFromConfig(reset);
            }
        } catch (err) {
            console.error(err);
            setStatus(`❌ Reset failed: ${err?.message || err}`);
        }
    });
}
