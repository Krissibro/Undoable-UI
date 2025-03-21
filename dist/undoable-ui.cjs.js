'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _assertThisInitialized(e) {
  if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return e;
}
function _callSuper(t, o, e) {
  return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e));
}
function _classCallCheck(a, n) {
  if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function");
}
function _defineProperties(e, r) {
  for (var t = 0; t < r.length; t++) {
    var o = r[t];
    o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o);
  }
}
function _createClass(e, r, t) {
  return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", {
    writable: !1
  }), e;
}
function _getPrototypeOf(t) {
  return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) {
    return t.__proto__ || Object.getPrototypeOf(t);
  }, _getPrototypeOf(t);
}
function _inherits(t, e) {
  if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function");
  t.prototype = Object.create(e && e.prototype, {
    constructor: {
      value: t,
      writable: !0,
      configurable: !0
    }
  }), Object.defineProperty(t, "prototype", {
    writable: !1
  }), e && _setPrototypeOf(t, e);
}
function _isNativeReflectConstruct() {
  try {
    var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
  } catch (t) {}
  return (_isNativeReflectConstruct = function () {
    return !!t;
  })();
}
function _possibleConstructorReturn(t, e) {
  if (e && ("object" == typeof e || "function" == typeof e)) return e;
  if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined");
  return _assertThisInitialized(t);
}
function _setPrototypeOf(t, e) {
  return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) {
    return t.__proto__ = e, t;
  }, _setPrototypeOf(t, e);
}
function _toPrimitive(t, r) {
  if ("object" != typeof t || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != typeof i) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == typeof i ? i : i + "";
}

/**
 * Base class for undoable elements.
 * Subclasses should implement:
 *   - attachListeners(): to attach event listeners for this element.
 *   - createAction(event): to create an Action object for a given event.
 */
var UndoableElement = /*#__PURE__*/function () {
  function UndoableElement(element) {
    _classCallCheck(this, UndoableElement);
    this.element = element;
  }
  return _createClass(UndoableElement, [{
    key: "attachListeners",
    value: function attachListeners() {
      throw new Error("attachListeners() must be implemented by subclasses.");
    }
  }, {
    key: "createAction",
    value: function createAction(event) {
      throw new Error("createCommand() must be implemented by subclasses.");
    }
  }]);
}();

var Action = /*#__PURE__*/function () {
  /**
   * @param {HTMLElement} element - The HTML element.
   */
  function Action(element) {
    _classCallCheck(this, Action);
    this.element = element;
  }
  return _createClass(Action, [{
    key: "redo",
    value: function redo() {
      throw new Error("redo() must be implemented by subclasses.");
    }
  }, {
    key: "undo",
    value: function undo() {
      throw new Error("undo() must be implemented by subclasses.");
    }
  }]);
}();

/**
 * CheckboxCommand encapsulates a toggle action on a checkbox.
 */
var CheckboxAction = /*#__PURE__*/function (_Action) {
  /**
   * @param {HTMLInputElement} checkbox - The checkbox element.
   * @param {boolean} previousState - The state before the change.
   * @param {boolean} newState - The state after the change.
   */
  function CheckboxAction(checkbox, previousState, newState) {
    var _this;
    _classCallCheck(this, CheckboxAction);
    _this = _callSuper(this, CheckboxAction, [checkbox]);
    _this.previousState = previousState;
    _this.newState = newState;
    return _this;
  }
  _inherits(CheckboxAction, _Action);
  return _createClass(CheckboxAction, [{
    key: "redo",
    value: function redo() {
      this.element.checked = this.newState;
    }
  }, {
    key: "undo",
    value: function undo() {
      this.element.checked = this.previousState;
    }
  }]);
}(Action);

/**
 * CheckboxUndoable wraps a checkbox element to automatically attach an event listener.
 * It extends the base UndoableElement class.
 */
var Checkbox = /*#__PURE__*/function (_UndoableElement) {
  function Checkbox(element) {
    var _this2;
    _classCallCheck(this, Checkbox);
    _this2 = _callSuper(this, Checkbox, [element]);
    _this2.attachListeners();
    return _this2;
  }
  _inherits(Checkbox, _UndoableElement);
  return _createClass(Checkbox, [{
    key: "attachListeners",
    value: function attachListeners() {
      var _this3 = this;
      this.element.addEventListener('change', function (event) {
        // For toggling, assume the previous state is the opposite of the current.
        var newState = _this3.element.checked;
        var previousState = !newState;
        _this3.createAction(previousState, newState);
      });
    }
  }, {
    key: "createAction",
    value: function createAction(previousState, newState) {
      var action = new CheckboxAction(this.element, previousState, newState);
      window.__GLOBAL_HISTORY__.push(action);
      // Clear redo stack
      window.__REDO_STACK__.length = 0;
    }
  }]);
}(UndoableElement);

/**
 * RadioAction encapsulates a toggle action on a radio input.
 * It records the new radio (the one clicked) and the previously selected radio in the group.
 */
var RadioAction = /*#__PURE__*/function (_Action) {
  /**
   * @param {HTMLInputElement} radio - The radio element that was clicked (new selection).
   * @param {HTMLInputElement|null} previousRadio - The previously selected radio in the group (or null if none).
   */
  function RadioAction(radio, previousRadio) {
    var _this;
    _classCallCheck(this, RadioAction);
    _this = _callSuper(this, RadioAction, [radio]);
    _this.newRadio = radio;
    _this.previousRadio = previousRadio; // may be null if there was no previous selection
    return _this;
  }

  /**
   * Executes the action by checking the new radio and unchecking the previous one (if present).
   */
  _inherits(RadioAction, _Action);
  return _createClass(RadioAction, [{
    key: "redo",
    value: function redo() {
      this.newRadio.checked = true;
      if (this.previousRadio && this.previousRadio !== this.newRadio) {
        this.previousRadio.checked = false;
      }
      Radio.previousSelections[this.newRadio.name] = this.newRadio;
    }

    /**
     * Undoes the action by reverting to the previous radio selection.
     */
  }, {
    key: "undo",
    value: function undo() {
      if (this.previousRadio) {
        this.previousRadio.checked = true;
        this.newRadio.checked = false;
        Radio.previousSelections[this.previousRadio.name] = this.previousRadio;
      } else {
        // If there was no previous radio, simply uncheck the new one.
        this.newRadio.checked = false;
        Radio.previousSelections[this.newRadio.name] = null;
      }
    }
  }]);
}(Action);

/**
 * Radio class wraps a radio input element to automatically attach event listeners.
 * It extends the base UndoableElement class.
 */
var Radio = /*#__PURE__*/function (_UndoableElement) {
  function Radio(element) {
    var _this2;
    _classCallCheck(this, Radio);
    _this2 = _callSuper(this, Radio, [element]);

    // Use a static property on the Radio class to store previous selections per group.
    if (!Radio.previousSelections) {
      Radio.previousSelections = {};
    }
    _this2.groupName = _this2.element.name;
    if (_this2.groupName) {
      var radios = document.querySelectorAll("input[type=\"radio\"][name=\"".concat(_this2.groupName, "\"]"));
      radios.forEach(function (radio) {
        if (radio.checked) {
          Radio.previousSelections[_this2.groupName] = radio;
        }
      });
    }
    // TODO: What happens if the radio button does not have a group name?
    _this2.attachListeners();
    return _this2;
  }
  _inherits(Radio, _UndoableElement);
  return _createClass(Radio, [{
    key: "attachListeners",
    value: function attachListeners() {
      var _this3 = this;
      // On change, create a RadioAction.
      this.element.addEventListener('change', function () {
        var groupName = _this3.element.name;
        if (!groupName) return;
        var previousRadio = Radio.previousSelections[groupName] || null;
        // Update stored previous selection to the current element.
        Radio.previousSelections[groupName] = _this3.element;
        _this3.createAction(previousRadio);
      });
    }

    /**
     * Creates a RadioAction using the current element and the previously selected radio.
     * @param {HTMLInputElement|null} previousRadio
     * @returns {RadioAction}
     */
  }, {
    key: "createAction",
    value: function createAction(previousRadio) {
      var action = new RadioAction(this.element, previousRadio);
      window.__GLOBAL_HISTORY__.push(action);
      window.__REDO_STACK__.length = 0;
    }
  }]);
}(UndoableElement);

/**
 * RangeAction encapsulates a change action on a range input.
 * It records the previous value and the new value.
 */
var RangeAction = /*#__PURE__*/function (_Action) {
  /**
   * @param {HTMLInputElement} range - The range input element.
   * @param {Range} rangeListener - The range listener instance.
   * @param {number|string} previousValue - The value before the change.
   * @param {number|string} newValue - The value after the change.
   */
  function RangeAction(range, rangeListener, previousValue, newValue) {
    var _this;
    _classCallCheck(this, RangeAction);
    _this = _callSuper(this, RangeAction, [range]);
    _this.rangeListener = rangeListener;
    _this.previousValue = previousValue;
    _this.newValue = newValue;
    return _this;
  }

  /**
   * Executes the action by setting the range's value to the new value.
   */
  _inherits(RangeAction, _Action);
  return _createClass(RangeAction, [{
    key: "redo",
    value: function redo() {
      this.rangeListener.oldValue = this.newValue;
      this.element.value = this.newValue;
    }

    /**
     * Undoes the action by reverting the range's value to the previous value.
     */
  }, {
    key: "undo",
    value: function undo() {
      this.rangeListener.oldValue = this.previousValue;
      this.element.value = this.previousValue;
    }
  }]);
}(Action);

/**
 * Range wraps a range input element to automatically attach event listeners.
 * It extends the base UndoableElement class.
 */
var Range = /*#__PURE__*/function (_UndoableElement) {
  function Range(element) {
    var _this2;
    _classCallCheck(this, Range);
    _this2 = _callSuper(this, Range, [element]);
    // Initialize a property to store the previous value.
    _this2.oldValue = element.value;
    _this2.attachListeners();
    return _this2;
  }
  _inherits(Range, _UndoableElement);
  return _createClass(Range, [{
    key: "attachListeners",
    value: function attachListeners() {
      var _this3 = this;
      // On change, create a RangeAction.
      this.element.addEventListener('change', function (event) {
        var previousValue = _this3.oldValue;
        var newValue = _this3.element.value;
        // Only record an action if the value has actually changed.
        if (previousValue !== newValue) {
          _this3.createAction(previousValue, newValue);
        }
      });
    }

    /**
     * Creates a RangeAction using the current element's old and new values.
     * Then adds the action to the global history.
     * @param {number|string} previousValue
     * @param {number|string} newValue
     * @returns {RangeAction}
     */
  }, {
    key: "createAction",
    value: function createAction(previousValue, newValue) {
      var action = new RangeAction(this.element, this, previousValue, newValue);
      window.__GLOBAL_HISTORY__.push(action);
      window.__REDO_STACK__.length = 0;
      // Update the oldValue to the new value for subsequent changes.
      this.oldValue = newValue;
    }
  }]);
}(UndoableElement);

/**
 * DateTimeAction encapsulates a change on a date/time input.
 * It records the previous value and the new value.
 */
var DateTimeAction = /*#__PURE__*/function (_Action) {
  /**
   * @param {HTMLInputElement} element - The date/time input element.
   * @param {DateTime} dateTimeListener - The DateTime instance.
   * @param {string} previousValue - The value before the change.
   * @param {string} newValue - The value after the change.
   */
  function DateTimeAction(element, dateTimeListener, previousValue, newValue) {
    var _this;
    _classCallCheck(this, DateTimeAction);
    _this = _callSuper(this, DateTimeAction, [element]);
    _this.dateTimeListener = dateTimeListener;
    _this.previousValue = previousValue;
    _this.newValue = newValue;
    return _this;
  }

  /**
   * Executes the action by setting the input's value to the new value.
   */
  _inherits(DateTimeAction, _Action);
  return _createClass(DateTimeAction, [{
    key: "redo",
    value: function redo() {
      this.dateTimeListener.oldValue = this.newValue;
      this.element.value = this.newValue;
    }

    /**
     * Undoes the action by reverting the input's value to the previous value.
     */
  }, {
    key: "undo",
    value: function undo() {
      this.dateTimeListener.oldValue = this.previousValue;
      this.element.value = this.previousValue;
    }
  }]);
}(Action);

/**
 * DateTime wraps a date/time input element (e.g., type="date", "time", "datetime-local")
 * to automatically attach event listeners for undo/redo functionality.
 */
var DateTime = /*#__PURE__*/function (_UndoableElement) {
  function DateTime(element) {
    var _this2;
    _classCallCheck(this, DateTime);
    _this2 = _callSuper(this, DateTime, [element]);
    // Record the initial value when the element is created.
    _this2.oldValue = element.value;
    _this2.attachListeners();
    return _this2;
  }
  _inherits(DateTime, _UndoableElement);
  return _createClass(DateTime, [{
    key: "attachListeners",
    value: function attachListeners() {
      var _this3 = this;
      // Use focus to capture the starting (old) value.
      this.element.addEventListener('focus', function () {
        _this3.oldValue = _this3.element.value;
      });

      // On change, create a new DateTimeAction if the value has changed.
      var handler = function handler(event) {
        var previousValue = _this3.oldValue;
        var newValue = _this3.element.value;
        if (previousValue !== newValue) {
          _this3.createAction(previousValue, newValue);
        }
      };

      // Attach the same handler to both 'input' and 'change'
      ['input', 'change'].forEach(function (type) {
        _this3.element.addEventListener(type, handler);
      });
    }

    /**
     * Creates a DateTimeAction using the previous and new values.
     * @param {string} previousValue
     * @param {string} newValue
     * @returns {DateTimeAction}
     */
  }, {
    key: "createAction",
    value: function createAction(previousValue, newValue) {
      var action = new DateTimeAction(this.element, this, previousValue, newValue);
      window.__GLOBAL_HISTORY__.push(action);
      window.__REDO_STACK__.length = 0; // Clear redo history.
      // Update oldValue to the new value.
      this.oldValue = newValue;
    }
  }]);
}(UndoableElement);

/**
 * SelectAction encapsulates a selection change on a <select> element.
 * It records the previous selected value and the new selected value.
 */
var SelectAction = /*#__PURE__*/function (_Action) {
  /**
   * @param {HTMLSelectElement} selectElement - The <select> element.
   * @param {Select} selectListener - The select listener instance.
   * @param {string} previousValue - The value before the change.
   * @param {string} newValue - The value after the change.
   */
  function SelectAction(selectElement, selectListener, previousValue, newValue) {
    var _this;
    _classCallCheck(this, SelectAction);
    _this = _callSuper(this, SelectAction, [selectElement]);
    _this.selectListener = selectListener;
    _this.previousValue = previousValue;
    _this.newValue = newValue;
    return _this;
  }

  /**
   * Executes the action by setting the select element's value to the new value.
   */
  _inherits(SelectAction, _Action);
  return _createClass(SelectAction, [{
    key: "redo",
    value: function redo() {
      this.selectListener.oldValue = this.newValue;
      this.element.value = this.newValue;
    }

    /**
     * Undoes the action by reverting the select element's value to the previous value.
     */
  }, {
    key: "undo",
    value: function undo() {
      this.selectListener.oldValue = this.previousValue;
      this.element.value = this.previousValue;
    }
  }]);
}(Action);

/**
 * Select wraps a <select> element to automatically attach event listeners
 * for undo/redo functionality.
 */
var Select = /*#__PURE__*/function (_UndoableElement) {
  function Select(element) {
    var _this2;
    _classCallCheck(this, Select);
    _this2 = _callSuper(this, Select, [element]);
    // Record the initial selected value.
    _this2.oldValue = element.value;
    _this2.attachListeners();
    return _this2;
  }
  _inherits(Select, _UndoableElement);
  return _createClass(Select, [{
    key: "attachListeners",
    value: function attachListeners() {
      var _this3 = this;
      // On change, record the new selection if it differs.
      this.element.addEventListener('change', function () {
        var previousValue = _this3.oldValue;
        var newValue = _this3.element.value;
        if (previousValue !== newValue) {
          _this3.createAction(previousValue, newValue);
        }
      });
    }

    /**
     * Creates a SelectAction using the previous and new values.
     * @param {string} previousValue
     * @param {string} newValue
     * @returns {SelectAction}
     */
  }, {
    key: "createAction",
    value: function createAction(previousValue, newValue) {
      var action = new SelectAction(this.element, this, previousValue, newValue);
      window.__GLOBAL_HISTORY__.push(action);
      window.__REDO_STACK__.length = 0; // Clear redo history.
      // Update oldValue for subsequent changes.
      this.oldValue = newValue;
    }
  }]);
}(UndoableElement);

/**
 * ColorAction encapsulates a change on a color input.
 * It records the previous and new color values.
 */
var ColorAction = /*#__PURE__*/function (_Action) {
  /**
   * @param {HTMLInputElement} colorElement - The color input element.
   * @param {ColorPicker} colorPickerListener - The color picker listener instance.
   * @param {string} previousColor - The color before the change.
   * @param {string} newColor - The color after the change.
   */
  function ColorAction(colorElement, colorPickerListener, previousColor, newColor) {
    var _this;
    _classCallCheck(this, ColorAction);
    _this = _callSuper(this, ColorAction, [colorElement]);
    _this.colorPickerListener = colorPickerListener;
    _this.previousColor = previousColor;
    _this.newColor = newColor;
    return _this;
  }

  /**
   * Executes the action by setting the input's value to the new color.
   */
  _inherits(ColorAction, _Action);
  return _createClass(ColorAction, [{
    key: "redo",
    value: function redo() {
      this.colorPickerListener.oldColor = this.newColor;
      this.element.value = this.newColor;
    }

    /**
     * Undoes the action by reverting the input's value to the previous color.
     */
  }, {
    key: "undo",
    value: function undo() {
      this.colorPickerListener.oldColor = this.previousColor;
      this.element.value = this.previousColor;
    }
  }]);
}(Action);

/**
 * ColorPicker wraps a color input element to automatically attach event listeners
 * for undo/redo functionality.
 */
var ColorPicker = /*#__PURE__*/function (_UndoableElement) {
  function ColorPicker(element) {
    var _this2;
    _classCallCheck(this, ColorPicker);
    _this2 = _callSuper(this, ColorPicker, [element]);
    // Record the initial color value.
    _this2.oldColor = element.value;
    _this2.attachListeners();
    return _this2;
  }
  _inherits(ColorPicker, _UndoableElement);
  return _createClass(ColorPicker, [{
    key: "attachListeners",
    value: function attachListeners() {
      var _this3 = this;
      // Define a single handler for both 'input' and 'change' events.
      this.element.addEventListener('change', function () {
        var previousColor = _this3.oldColor;
        var newColor = _this3.element.value;
        if (previousColor !== newColor) {
          _this3.createAction(previousColor, newColor);
        }
      });
    }

    /**
     * Creates a ColorAction using the previous and new color values.
     * Then pushes the action to the global history.
     * @param {string} previousColor
     * @param {string} newColor
     * @returns {ColorAction}
     */
  }, {
    key: "createAction",
    value: function createAction(previousColor, newColor) {
      var action = new ColorAction(this.element, this, previousColor, newColor);
      window.__GLOBAL_HISTORY__.push(action);
      window.__REDO_STACK__.length = 0; // Clear redo history.
      this.oldColor = newColor;
    }
  }]);
}(UndoableElement);

/**
 * Check if the element is contenteditable.
 * @param {HTMLElement} element
 * @returns {boolean}
 */
function isContentEditable(element) {
  return element.isContentEditable || element.getAttribute('contenteditable') === 'true';
}

/**
 * Retrieve the current text from an element, either value or innerText.
 * @param {HTMLElement} element
 * @returns {string}
 */
function getValue(element) {
  if (isContentEditable(element)) {
    return element.innerText;
  }
  return element.value;
}

/**
 * Set the text of an element, either value or innerText.
 * @param {HTMLElement} element
 * @param {string} val
 */
function setValue(element, val) {
  if (isContentEditable(element)) {
    element.innerText = val;
  } else {
    element.value = val;
  }
}

/**
 * Time window (ms) to merge consecutive keystrokes into a single chunk
 */
var CHUNK_MERGE_DELAY = 500;

/**
 * Pressing these keys will break the current chunk immediately
 */
var BOUNDARY_KEY_LIST = ['Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];

/**
 * TextAction represents a single edit from oldValue -> newValue
 * for a text-based element (input, textarea, or contenteditable).
 */
var TextAction = /*#__PURE__*/function (_Action) {
  /**
   * @param {HTMLElement} element - The text-based element.
   * @param {string} oldValue - The text before the change.
   * @param {string} newValue - The text after the change.
   */
  function TextAction(element, oldValue, newValue) {
    var _this;
    _classCallCheck(this, TextAction);
    _this = _callSuper(this, TextAction, [element]);
    _this.oldValue = oldValue;
    _this.newValue = newValue;
    return _this;
  }
  _inherits(TextAction, _Action);
  return _createClass(TextAction, [{
    key: "redo",
    value: function redo() {
      setValue(this.element, this.newValue);
    }
  }, {
    key: "undo",
    value: function undo() {
      setValue(this.element, this.oldValue);
    }
  }]);
}(Action);

/**
 * Manages partial text edits (chunks) while typing, then merges them
 * into one final action on blur.
 */
var TextChunkManager = /*#__PURE__*/function () {
  function TextChunkManager(element, initialText) {
    _classCallCheck(this, TextChunkManager);
    this.element = element;
    this.initialText = initialText; // text at the moment of focus
    this.sessionEdits = []; // partial actions in this focus session
    this.currentEdit = null; // the chunk currently being built
    this.lastChunkTimestamp = 0; // last time we updated a chunk
    this.boundaryKeyDetected = false;
  }

  /**
   * Initialize or reset the chunking session (on focus).
   */
  return _createClass(TextChunkManager, [{
    key: "startSession",
    value: function startSession() {
      this.sessionEdits = [];
      this.currentEdit = null;
      this.lastChunkTimestamp = 0;
      this.boundaryKeyDetected = false;
    }

    /**
     * Process a keydown event to detect boundary keys (Enter, arrows).
     */
  }, {
    key: "processKeydown",
    value: function processKeydown(event) {
      if (BOUNDARY_KEY_LIST.includes(event.key)) {
        // Finalize current chunk if user pressed a boundary key
        this.finalizeCurrentEdit();
        this.boundaryKeyDetected = true;
      } else {
        this.boundaryKeyDetected = false;
      }
    }

    /**
     * Process an input event to create or merge partial edits.
     */
  }, {
    key: "processInput",
    value: function processInput() {
      var newValue = getValue(this.element);
      var now = Date.now();
      if (!this.currentEdit) {
        // Start a new chunk for the first keystroke
        this.startNewEdit(newValue);
      } else {
        // Check time since last update
        var timeDelta = now - this.lastChunkTimestamp;
        if (timeDelta < CHUNK_MERGE_DELAY && !this.boundaryKeyDetected) {
          // Merge with current chunk
          this.mergeIntoCurrentEdit(newValue);
        } else {
          // Finalize old chunk, start a new one
          this.finalizeCurrentEdit();
          this.startNewEdit(newValue);
        }
      }
      this.lastChunkTimestamp = now;
    }

    /**
     * Creates a new chunk from the last known text -> current text.
     */
  }, {
    key: "startNewEdit",
    value: function startNewEdit(newValue) {
      // For the first chunk or if we've had partials before
      // the oldValue is either the finalValue of the last chunk
      // or the initial text at focus if none.
      var oldVal = this.sessionEdits.length > 0 ? this.sessionEdits[this.sessionEdits.length - 1].newValue : this.initialText;
      var action = new TextAction(this.element, oldVal, newValue);
      window.__GLOBAL_HISTORY__.push(action);
      window.__REDO_STACK__.length = 0;
      this.sessionEdits.push(action);
      this.currentEdit = action;
    }

    /**
     * Merges the newValue into the current chunk action object.
     */
  }, {
    key: "mergeIntoCurrentEdit",
    value: function mergeIntoCurrentEdit(newValue) {
      if (!this.currentEdit) return;

      // Pop the top of the global history
      var popped = window.__GLOBAL_HISTORY__.pop();
      if (popped !== this.currentEdit) {
        // Edge case: partial undos might have removed or changed the top
        if (popped) {
          // Put it back if mismatch
          window.__GLOBAL_HISTORY__.push(popped);
        }
        return;
      }

      // Update current chunk's newValue
      this.currentEdit.newValue = newValue;
      // Re-push updated chunk
      window.__GLOBAL_HISTORY__.push(this.currentEdit);

      // Also update the sessionEdits array
      this.sessionEdits[this.sessionEdits.length - 1].newValue = newValue;
    }

    /**
     * Finalize the current chunk so subsequent input starts a new chunk.
     */
  }, {
    key: "finalizeCurrentEdit",
    value: function finalizeCurrentEdit() {
      this.currentEdit = null;
    }

    /**
     * On blur, unify partial actions into one big action: initialText -> finalValue.
     */
  }, {
    key: "finalizeFocusSession",
    value: function finalizeFocusSession(finalValue) {
      // If no actual change, do nothing
      if (this.initialText === finalValue) return;

      // Remove partial actions from global history
      while (this.sessionEdits.length > 0) {
        var partial = this.sessionEdits.pop();
        var idx = window.__GLOBAL_HISTORY__.indexOf(partial);
        if (idx !== -1) {
          window.__GLOBAL_HISTORY__.splice(idx, 1);
        }
      }

      // Create one merged action
      var mergedAction = new TextAction(this.element, this.initialText, finalValue);
      window.__GLOBAL_HISTORY__.push(mergedAction);
      window.__REDO_STACK__.length = 0;
    }
  }]);
}();
/**
 * TextBox uses a TextChunkManager to handle partial text edits (chunks) while typing,
 * then merges them into a single action when the user blurs the field.
 */
var TextBox = /*#__PURE__*/function (_UndoableElement) {
  function TextBox(element) {
    var _this2;
    _classCallCheck(this, TextBox);
    _this2 = _callSuper(this, TextBox, [element]);
    _this2.attachListeners();
    return _this2;
  }
  _inherits(TextBox, _UndoableElement);
  return _createClass(TextBox, [{
    key: "attachListeners",
    value: function attachListeners() {
      var _this3 = this;
      this.initialFocusValue = null;
      this.chunkManager = null;

      // On focus, start a new chunking session
      this.element.addEventListener('focus', function () {
        _this3.initialFocusValue = getValue(_this3.element);
        _this3.chunkManager = new TextChunkManager(_this3.element, _this3.initialFocusValue);
        _this3.chunkManager.startSession();
      });

      // On keydown, detect boundary keys
      this.element.addEventListener('keydown', function (event) {
        var _this3$chunkManager;
        // If overriding native undo, you might handle Ctrl+Z here
        (_this3$chunkManager = _this3.chunkManager) === null || _this3$chunkManager === void 0 || _this3$chunkManager.processKeydown(event);
      });

      // On input, create or merge partial actions
      this.element.addEventListener('input', function () {
        var _this3$chunkManager2;
        (_this3$chunkManager2 = _this3.chunkManager) === null || _this3$chunkManager2 === void 0 || _this3$chunkManager2.processInput();
      });

      // On blur/focusout, unify partial actions into one merged action
      var blurEvent = isContentEditable(this.element) ? 'focusout' : 'blur';
      this.element.addEventListener(blurEvent, function () {
        if (!_this3.chunkManager) return;
        var finalValue = getValue(_this3.element);
        _this3.chunkManager.finalizeFocusSession(finalValue);

        // Reset
        _this3.initialFocusValue = null;
        _this3.chunkManager = null;
      });
    }
  }]);
}(UndoableElement);

// src/index.js

// Global history arrays
// for simplicity, we attach these to the window so they are accessible by our modules
window.__GLOBAL_HISTORY__ = window.__GLOBAL_HISTORY__ || [];
window.__REDO_STACK__ = window.__REDO_STACK__ || [];
window.isMouseDown = false;

/**
 * Factory mapping: Each entry defines a CSS selector and a factory function
 * that takes a DOM element and returns an instance of an undoable handler.
 */
var factoryMap = [{
  // Input types for text, search, email, url, number, tel + textarea
  // (Skipping password)
  selector: "input[type=\"text\"],\n               input[type=\"search\"],\n               input[type=\"email\"],\n               input[type=\"url\"],\n               input[type=\"number\"],\n               input[type=\"tel\"],\n               textarea,\n               [contenteditable=\"true\"]",
  factory: function factory(element) {
    return new TextBox(element);
  }
}, {
  selector: 'input[type="checkbox"]',
  factory: function factory(element) {
    return new Checkbox(element);
  }
}, {
  selector: 'input[type="radio"]',
  factory: function factory(element) {
    return new Radio(element);
  }
}, {
  selector: 'input[type="range"]',
  factory: function factory(element) {
    return new Range(element);
  }
}, {
  selector: 'input[type="date"], input[type="time"], input[type="datetime-local"]',
  factory: function factory(element) {
    return new DateTime(element);
  }
}, {
  selector: 'select',
  factory: function factory(element) {
    return new Select(element);
  }
}, {
  selector: 'input[type="color"]',
  factory: function factory(element) {
    return new ColorPicker(element);
  }
}
// Future element types can be added here.
];

// TODO: Could be more efficient by only scanning the DOM once.
// If possible
// TODO: Instead of attaching listeners to all elements, could use event delegation maybe.
/**
 * Scan the DOM for undoable elements.
 * For each mapping in factoryMap, select all matching elements and create a handler.
 */
function scanForUndoableElements() {
  factoryMap.forEach(function (_ref) {
    var selector = _ref.selector,
      factory = _ref.factory;
    var elements = document.querySelectorAll(selector);
    elements.forEach(function (element) {
      // Optionally, check if element is already wrapped.
      if (!element.__undoable__) {
        element.__undoable__ = factory(element);
      }
    });
  });
}

// TODO: Add mutation observer to automatically attach listeners to new elements.

/**
 * Global undo function: undoes the most recent action.
 */
function undo() {
  if (window.__GLOBAL_HISTORY__.length > 0) {
    var action = window.__GLOBAL_HISTORY__.pop();
    action.undo();
    window.__REDO_STACK__.push(action);
  }
}

/**
 * Global redo function: re-executes the most recently undone action.
 */
function redo() {
  if (window.__REDO_STACK__.length > 0) {
    var action = window.__REDO_STACK__.pop();
    action.redo();
    window.__GLOBAL_HISTORY__.push(action);
  }
}
function addGlobalUndoRedoShortcuts() {
  document.addEventListener('keydown', function (event) {
    // Check for Ctrl+Z or Cmd+Z (for Mac)
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'z') {
      event.preventDefault(); // Prevent native browser undo behavior
      undo();
    }
    // Check for Ctrl+Y or Cmd+Y (for Mac)
    else if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'y') {
      event.preventDefault();
      redo();
    }
  });
}
function addMouseDownListeners() {
  document.addEventListener('mousedown', function () {
    return window.isMouseDown = true;
  });
  document.addEventListener('mouseup', function () {
    return window.isMouseDown = false;
  });
}

/**
 * Initialization function.
 * Scans the DOM for undoable elements and attaches their handlers.
 */
function init() {
  addMouseDownListeners();
  scanForUndoableElements();
  addGlobalUndoRedoShortcuts();
}

// Auto-initialize when DOM is ready.
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      return init();
    });
  } else {
    init();
  }

  // Expose the API globally (UMD style)
  window.UndoableUI = {
    undo: undo,
    redo: redo
  };
}

exports.init = init;
exports.redo = redo;
exports.undo = undo;
//# sourceMappingURL=undoable-ui.cjs.js.map
