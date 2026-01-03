// demo.js
import { templates } from "./templates.js";

function htmlToElement(html) {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = html.trim();
    return wrapper.firstElementChild;
}

function injectControls() {
    const host = document.getElementById("add-squares-to-grid-controller");
    host.innerHTML = `
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
    // Grab elements your library wraps (same types as your selector)
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

    // MutationObserver callbacks happen async; queue a microtask-ish check
    setTimeout(() => {
        const statuses = [...inputs].map(el => ({
            tag: el.tagName.toLowerCase(),
            type: el.getAttribute("type") || (el.isContentEditable ? "contenteditable" : ""),
            wrapped: Boolean(el.__undoable__)
        }));

        const allWrapped = statuses.every(s => s.wrapped);

        console.log(allWrapped ? "✅ New group wrapped by MutationObserver" : "❌ Some elements not wrapped", statuses);
    }, 0);
}

function addSelectedTemplateToGrid() {
    const grid = document.getElementById("grid");
    const key = document.getElementById("templateSelect").value;

    const groupEl = htmlToElement(templates[key]);
    uniquifyRadioNames(groupEl);

    grid.appendChild(groupEl);

    // The whole point: do NOT call UndoableUI.init() here.
    // We want to see if MutationObserver wraps it automatically.
    logWrappedStatus(groupEl);

    groupEl.scrollIntoView({ behavior: "smooth", block: "end" });
}

function main() {
    injectControls();
    document.getElementById("addToGridBtn").addEventListener("click", addSelectedTemplateToGrid);
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", main);
} else {
    main();
}
