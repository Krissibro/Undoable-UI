// templates.js
export const templates = {
    text: `
    <div class="group">
      <h2>Text Input (New)</h2>
      <label>Text:
        <input type="text" placeholder="Type something here...">
      </label>
    </div>
  `,
    textarea: `
    <div class="group">
      <h2>Textarea (New)</h2>
      <label>Textarea:<br>
        <textarea class="editable-box" rows="3" placeholder="Multi-line text"></textarea>
      </label>
    </div>
  `,
    contenteditable: `
    <div class="group">
      <h2>Content Editable (New)</h2>
      <label>Editable:
        <div class="editable-box" contenteditable="true">Type some text here...</div>
      </label>
    </div>
  `,
    checkbox: `
    <div class="group">
      <h2>Checkboxes (New)</h2>
      <label><input type="checkbox"> Option 1</label>
      <label><input type="checkbox"> Option 2</label>
      <label><input type="checkbox"> Option 3</label>
    </div>
  `,
    radio: `
    <div class="group">
      <h2>Radio Group (New)</h2>
      <label><input type="radio"> Radio 1</label>
      <label><input type="radio"> Radio 2</label>
      <label><input type="radio"> Radio 3</label>
    </div>
  `
};
