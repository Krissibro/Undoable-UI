import { templates } from "./templates.js";
import { htmlToElement, qs } from "./domUtils.js";

function injectControls(hostEl) {
    hostEl.innerHTML = `
    <div class="add-controls">
      <select id="templateSelect">
        ${Object.keys(templates).map(k => `<option value="${k}">${k}</option>`).join("")}
      </select>
      <button id="addToGridBtn" type="button">Add to grid</button>
    </div>
  `;
}

function uniquifyRadioNames(groupEl) {
    const radios = groupEl.querySelectorAll('input[type="radio"]');
    if (radios.length === 0) return;
    const name = `dyn_group_${crypto.randomUUID()}`;
    radios.forEach(r => (r.name = name));
}

function getInterestingInputs(groupEl) {
    return groupEl.querySelectorAll(`
    input[type="text"],
    input[type="search"],
    input[type="email"],
    input[type="url"],
    input[type="number"],
    input[type="tel"],
    textarea,
    [contenteditable="true"],
    input[type="checkbox"],
    input[type="radio"],
    input[type="range"],
    input[type="date"],
    input[type="time"],
    input[type="datetime-local"],
    select,
    input[type="color"]
  `);
}

function logWrappedStatus(groupEl) {
    const inputs = getInterestingInputs(groupEl);

    // MutationObserver runs async; let it breathe for a tick.
    setTimeout(() => {
        const statuses = [...inputs].map(el => ({
            tag: el.tagName.toLowerCase(),
            type: el.getAttribute("type") || (el.isContentEditable ? "contenteditable" : ""),
            wrapped: Boolean(el.__undoable__),
        }));

        const allWrapped = statuses.every(s => s.wrapped);
        console.log(
            allWrapped ? "✅ New group wrapped by MutationObserver" : "❌ Some elements not wrapped",
            statuses
        );
    }, 0);
}

function addSelectedTemplateToGrid(gridEl) {
    const key = qs("templateSelect").value;

    const groupEl = htmlToElement(templates[key]);
    uniquifyRadioNames(groupEl);
    gridEl.appendChild(groupEl);

    // Do NOT call UndoableUI.init() here — we’re testing the observer.
    logWrappedStatus(groupEl);

    groupEl.scrollIntoView({ behavior: "smooth", block: "end" });
}

export function mountAddSquaresController({ hostId, gridId }) {
    const host = qs(hostId);
    const grid = qs(gridId);

    injectControls(host);

    qs("addToGridBtn").addEventListener("click", () => addSelectedTemplateToGrid(grid));
}
