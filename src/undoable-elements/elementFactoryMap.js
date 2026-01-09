import { Checkbox } from "./elements/Checkbox.js";
import { Radio } from "./elements/Radio.js";
import { Range } from "./elements/Range.js";
import { DateTime } from "./elements/DateTime.js";
import { Select } from "./elements/Select.js";
import { ColorPicker } from "./elements/ColorPicker.js";
import { TextBox } from "./elements/TextBox.js";
import { TextBoxCollapse } from "./elements/TextBoxCollapse.js";


/**

 */
/**
 * Factory mapping: Each entry defines a CSS selector and a factory function
 * that takes a DOM element and returns an instance of an undoable handler.
 * This MUST be called at init-time, not import-time.
 *
 */
export function createFactoryMap(config) {
    return [
        // Does not support input[type="password"] for security reasons
        {
            selector: `
        input[type="text"],
        input[type="search"],
        input[type="email"],
        input[type="url"],
        input[type="number"],
        input[type="tel"],
        textarea,
        [contenteditable="true"]
      `,
            factory: element =>
                config.collapseTextEdits
                    ? new TextBox(element, config)
                    : new TextBox(element, config),
        },
        {
            selector: 'input[type="checkbox"]',
            factory: el => new Checkbox(el),
        },
        {
            selector: 'input[type="radio"]',
            factory: el => new Radio(el),
        },
        {
            selector: 'input[type="range"]',
            factory: el => new Range(el),
        },
        {
            selector: 'input[type="date"], input[type="time"], input[type="datetime-local"]',
            factory: el => new DateTime(el),
        },
        {
            selector: 'select',
            factory: el => new Select(el),
        },
        {
            selector: 'input[type="color"]',
            factory: el => new ColorPicker(el),
        },
    ];
}


export function buildCandidateElementSelectors(factoryMap) {
    // Merge all selectors into one comma-separated selector list
    // and normalize whitespace
    return factoryMap
        .map(element => element.selector)
        .join(", ")
        .replace(/\s+/g, " ")
        .trim()
}

