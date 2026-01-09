// scripts/templates.js
export const templates = {
  "Text Inputs": `
    <div class="group">
      <h2>Text Inputs (New)</h2>

      <div class="nested-grid">
          <label class="test-label" for="textbox1">Text:</label>
          <input type="text" id="textbox1" name="textbox1" placeholder="Type something here...">
    
          <label class="test-label" for="textbox2">Search:</label>
          <input type="search" id="textbox2" name="textbox2" placeholder="Search...">
    
          <label class="test-label" for="textbox3">Email:</label>
          <input type="email" id="textbox3" name="textbox3" placeholder="example@example.com">
    
          <label class="test-label" for="textbox4">URL:</label>
          <input type="url" id="textbox4" name="textbox4" placeholder="https://example.com">
    
          <label class="test-label" for="textbox5">Number:</label>
          <input type="number" id="textbox5" name="textbox5" placeholder="Enter a number">
    
          <label class="test-label" for="textbox6">Tel:</label>
          <input type="tel" id="textbox6" name="textbox6" placeholder="Phone number">
      </div>
    </div>
  `,

  "Text area": `
    <div class="group">
      <h2>Textarea (New)</h2>

      <label class="test-label" for="dyn_textarea_1">Textarea:</label>
      <textarea class="editable-box" id="dyn_textarea_1" rows="3" placeholder="Multi-line text"></textarea>
    </div>
  `,

  "Contenteditable": `
    <div class="group">
      <h2>Content Editable (New)</h2>

      <label class="test-label" for="dyn_editable_1">Editable:</label>
      <div id="dyn_editable_1" class="editable-box" contenteditable="true">Type some text here...</div>
    </div>
  `,

  // --- Radio / checkbox ---
  "Checkboxes": `
    <div class="group">
      <h2>Checkboxes (New)</h2>

      <label class="test-label"><input type="checkbox" /> Option 1</label>
      <label class="test-label"><input type="checkbox" /> Option 2</label>
      <label class="test-label"><input type="checkbox" /> Option 3</label>
      <label class="test-label"><input type="checkbox" /> Option 4</label>
    </div>
  `,

  "Radio Group": `
    <div class="group">
      <h2>Radio Inputs (New)</h2>

      <label class="test-label"><input type="radio" /> Radio 1</label>
      <label class="test-label"><input type="radio" /> Radio 2</label>
      <label class="test-label"><input type="radio" /> Radio 3</label>
      <label class="test-label"><input type="radio" /> Radio 4</label>
    </div>
  `,

  // --- Range ---
  "Range": `
    <div class="group">
      <h2>Range Input (New)</h2>

      <label class="test-label" for="dyn_range_1">Volume (for example):</label>
      <input type="range" id="dyn_range_1" min="0" max="100" value="50" />
    </div>
  `,

  // --- Date/time ---
  "Date Time": `
    <div class="group">
      <h2>Date/Time Inputs (New)</h2>

      <label class="test-label" for="dyn_date_1">Date:</label>
      <input type="date" id="dyn_date_1" value="2023-01-01" />

      <label class="test-label" for="dyn_time_1">Time:</label>
      <input type="time" id="dyn_time_1" value="12:00" />

      <label class="test-label" for="dyn_datetime_1">Datetime:</label>
      <input type="datetime-local" id="dyn_datetime_1" value="2023-01-01T12:00" />
    </div>
  `,

  // --- Select ---
  "Select": `
    <div class="group">
      <h2>Select Input (New)</h2>

      <label class="test-label" for="dyn_select_1">Choose an option:</label>
      <select id="dyn_select_1">
        <option value="option1">Option 1</option>
        <option value="option2">Option 2</option>
        <option value="option3">Option 3</option>
        <option value="option4">Option 4</option>
      </select>
    </div>
  `,

  // --- Color ---
  "Color": `
    <div class="group">
      <h2>Color Picker (New)</h2>

      <label class="test-label" for="dyn_color_1">Pick a color:</label>
      <input type="color" class="color-picker" id="dyn_color_1" value="#006994" />

      <div class="mono-value" id="dyn_color_1_value">#006994</div>

      <script>
        (() => {
          const input = document.getElementById("dyn_color_1");
          const out = document.getElementById("dyn_color_1_value");
          if (!input || !out) return;
          const update = () => (out.textContent = input.value);
          update();
          input.addEventListener("input", update);
          input.addEventListener("change", update);
        })();
      </script>
    </div>
  `,
};
