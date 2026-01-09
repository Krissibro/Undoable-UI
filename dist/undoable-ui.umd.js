(function (factory) {
  typeof define === 'function' && define.amd ? define(factory) :
  factory();
})((function () { 'use strict';

  function _arrayLikeToArray(r, a) {
    (null == a || a > r.length) && (a = r.length);
    for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
    return n;
  }
  function _arrayWithHoles(r) {
    if (Array.isArray(r)) return r;
  }
  function _arrayWithoutHoles(r) {
    if (Array.isArray(r)) return _arrayLikeToArray(r);
  }
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
  function _createForOfIteratorHelper(r, e) {
    var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
    if (!t) {
      if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) {
        t && (r = t);
        var n = 0,
          F = function () {};
        return {
          s: F,
          n: function () {
            return n >= r.length ? {
              done: !0
            } : {
              done: !1,
              value: r[n++]
            };
          },
          e: function (r) {
            throw r;
          },
          f: F
        };
      }
      throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }
    var o,
      a = !0,
      u = !1;
    return {
      s: function () {
        t = t.call(r);
      },
      n: function () {
        var r = t.next();
        return a = r.done, r;
      },
      e: function (r) {
        u = !0, o = r;
      },
      f: function () {
        try {
          a || null == t.return || t.return();
        } finally {
          if (u) throw o;
        }
      }
    };
  }
  function _defineProperty(e, r, t) {
    return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
      value: t,
      enumerable: !0,
      configurable: !0,
      writable: !0
    }) : e[r] = t, e;
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
  function _iterableToArray(r) {
    if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r);
  }
  function _iterableToArrayLimit(r, l) {
    var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
    if (null != t) {
      var e,
        n,
        i,
        u,
        a = [],
        f = !0,
        o = !1;
      try {
        if (i = (t = t.call(r)).next, 0 === l) {
          if (Object(t) !== t) return;
          f = !1;
        } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0);
      } catch (r) {
        o = !0, n = r;
      } finally {
        try {
          if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return;
        } finally {
          if (o) throw n;
        }
      }
      return a;
    }
  }
  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  function ownKeys(e, r) {
    var t = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
      var o = Object.getOwnPropertySymbols(e);
      r && (o = o.filter(function (r) {
        return Object.getOwnPropertyDescriptor(e, r).enumerable;
      })), t.push.apply(t, o);
    }
    return t;
  }
  function _objectSpread2(e) {
    for (var r = 1; r < arguments.length; r++) {
      var t = null != arguments[r] ? arguments[r] : {};
      r % 2 ? ownKeys(Object(t), !0).forEach(function (r) {
        _defineProperty(e, r, t[r]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) {
        Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
      });
    }
    return e;
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
  function _slicedToArray(r, e) {
    return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest();
  }
  function _toConsumableArray(r) {
    return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread();
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
  function _unsupportedIterableToArray(r, a) {
    if (r) {
      if ("string" == typeof r) return _arrayLikeToArray(r, a);
      var t = {}.toString.call(r).slice(8, -1);
      return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0;
    }
  }

  var defaultConfig = Object.freeze({
    maxHistorySize: 100,
    textChunkThrottle: 300,
    collapseTextEdits: false,
    // Dispatch native events after undo/redo so app UI updates.
    // "none" | "input" | "change" | "both"
    undoRedoEventDispatchStrategy: "both"
    // TODO: future attributes
    // debug: false,
    // scopeStrategy: 'global', // or 'local'
    // branchingHistory: false,
  });
  var baselineConfig = _objectSpread2({}, defaultConfig);
  var currentConfig = _objectSpread2({}, defaultConfig);
  var allowedKeys = new Set(["maxHistorySize", "textChunkThrottle", "collapseTextEdits", "undoRedoEventDispatchStrategy"]);
  var allowedDispatch = new Set(["none", "input", "change", "both"]);
  function getConfig() {
    return _objectSpread2({}, currentConfig);
  }
  function setBaselineConfig() {
    var partialBaseline = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var normalizedConfig = normalizeConfig(partialBaseline, defaultConfig);
    baselineConfig = _objectSpread2(_objectSpread2({}, defaultConfig), normalizedConfig);
    currentConfig = _objectSpread2({}, baselineConfig);
    return getConfig();
  }

  /**
   * Merges the provided partialConfig with the existing configuration.
   * Any properties not specified in partialConfig will retain their current values.
   * @param {Object} partialConfig - An object containing configuration properties to update.
   */
  function updateConfig() {
    var partialConfig = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var normalizedConfig = normalizeConfig(partialConfig, currentConfig);
    currentConfig = _objectSpread2(_objectSpread2({}, currentConfig), normalizedConfig);
    return getConfig();
  }

  /** Resets the current configuration to the default settings.
   */
  function resetConfigToBaseline() {
    currentConfig = _objectSpread2({}, baselineConfig);
    return _objectSpread2({}, currentConfig);
  }

  // ---------- normalization helpers ----------

  function toFiniteNumber(x) {
    if (typeof x === "number") return Number.isFinite(x) ? x : null;
    if (typeof x === "string") {
      var s = x.trim();
      if (s === "") return null;
      var n = Number(s);
      return Number.isFinite(n) ? n : null;
    }
    return null;
  }
  function normalizeConfig() {
    var partial = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var out = {};

    // Keep only known keys (typos get ignored)
    for (var _i = 0, _Object$entries = Object.entries(partial); _i < _Object$entries.length; _i++) {
      var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
        k = _Object$entries$_i[0],
        v = _Object$entries$_i[1];
      if (!allowedKeys.has(k)) continue;
      out[k] = v;
    }

    // maxHistorySize: must be a finite int >= 1 (0/negative/nonsense ignored)
    if ("maxHistorySize" in out) {
      var n = toFiniteNumber(out.maxHistorySize);
      if (n === null) {
        delete out.maxHistorySize;
      } else {
        var _int = Math.trunc(n);
        if (_int < 1) {
          delete out.maxHistorySize;
        } else {
          // optional ceiling to avoid absurd memory
          out.maxHistorySize = Math.min(_int, 10000);
        }
      }
    }

    // textChunkThrottle: must be finite int >= 0 (negative/nonsense ignored)
    if ("textChunkThrottle" in out) {
      var _n = toFiniteNumber(out.textChunkThrottle);
      if (_n === null) {
        delete out.textChunkThrottle;
      } else {
        var _int2 = Math.trunc(_n);
        if (_int2 < 0) {
          delete out.textChunkThrottle;
        } else {
          out.textChunkThrottle = Math.min(_int2, 60000);
        }
      }
    }

    // collapseTextEdits: only accept actual booleans (string "false" should NOT become true)
    if ("collapseTextEdits" in out) {
      if (typeof out.collapseTextEdits !== "boolean") {
        delete out.collapseTextEdits;
      }
    }

    // undoRedoEventDispatchStrategy: enum, invalid ignored
    if ("undoRedoEventDispatchStrategy" in out) {
      var s = String(out.undoRedoEventDispatchStrategy);
      if (!allowedDispatch.has(s)) {
        delete out.undoRedoEventDispatchStrategy;
      } else {
        out.undoRedoEventDispatchStrategy = s;
      }
    }

    // If you ever want: “invalid should revert to defaults” instead of “ignored”
    // then this is where you'd use baseDefaults[key] as fallback.
    return out;
  }

  /** @typedef {import("./undoable-elements/Action.js").Action} Action */

  /**
   * Dispatch input/change events on elements affected by an undoable action.
   * @param {Action} action - The undoable action containing affected elements.
   * @param {Object} config - Configuration object specifying dispatch strategy.
   */
  function dispatchEvents(action, config) {
    if (typeof window === "undefined") return;
    var dispatchStrategy = config === null || config === void 0 ? void 0 : config.undoRedoEventDispatchStrategy;
    if (!dispatchStrategy || dispatchStrategy === "none") return;

    // Check if the action has multiple affected elements
    // Radio button groups for example
    var targetElements = typeof action.affectedElements === "function" ? action.affectedElements() : [action.element];

    // Dispatch events for each affected element
    var _iterator = _createForOfIteratorHelper(targetElements),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var element = _step.value;
        if (!element) continue;
        if (dispatchStrategy === "input" || dispatchStrategy === "both") {
          element.dispatchEvent(new Event("input", {
            bubbles: true
          }));
        }
        if (dispatchStrategy === "change" || dispatchStrategy === "both") {
          element.dispatchEvent(new Event("change", {
            bubbles: true
          }));
        }
        // TODO: Maybe add a custom undo event here?
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  }

  /**
   * Emit a custom event to signal status changes in the undoable UI system.
   * @param {Object} detail - An object containing status details.
   */
  function emitStatus(detail) {
    if (typeof window === "undefined") return;
    // detail example: { phase: "reinitializing", busy: true, reason: "updateConfig" }
    window.dispatchEvent(new CustomEvent("undoableui:status", {
      detail: detail
    }));
  }

  var instances = new Set();
  function registerInstance(instance) {
    instances.add(instance);
  }
  function unregisterInstance(instance) {
    instances["delete"](instance);
  }
  function disposeAllUndoables() {
    instances.forEach(function (instance) {
      if (typeof instance.dispose === "function") {
        instance.dispose();
      }
    });
    instances.clear();
  }

  // Counter instead of boolean to support nested calls in the future
  var historyReplayDepth = 0;
  function activateHistoryReplayProtection(fn) {
    historyReplayDepth++;
    try {
      return fn();
    } finally {
      historyReplayDepth--;
    }
  }
  function isHistoryReplaying() {
    return historyReplayDepth > 0;
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
      /** @type {HTMLElement} */
      this.element = element;
      this._listenerCleanups = [];
      this._disposed = false;
      registerInstance(this);
    }

    /**
     * Creates an Action object for the given event.
     * Must be implemented by subclasses.
     * @param event
     */
    return _createClass(UndoableElement, [{
      key: "createAction",
      value: function createAction(event) {
        throw new Error("createCommand() must be implemented by subclasses.");
      }

      /**
       * Attaches necessary event listeners to the element.
       * Must be implemented by subclasses.
       */
    }, {
      key: "attachListeners",
      value: function attachListeners() {
        throw new Error("attachListeners() must be implemented by subclasses.");
      }

      /**
       * Creates an event listener that is protected against history replay.
       * This prevents timers/chunks/cache updates from running during replay.
       * @param type
       * @param handler
       * @param options
       * @returns {function(*): *}
       */
    }, {
      key: "addProtectedListener",
      value: function addProtectedListener(type, handler) {
        var _this = this;
        var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
        // Wrap the handler to prevent execution during history replay
        var wrappedHandler = function wrappedHandler(event) {
          if (isHistoryReplaying()) return;
          // Call the original handler
          // This ensures the correct 'this' context is maintained
          return handler.call(_this, event);
        };

        // Attach the event listener to the element with the wrapped handler
        this.element.addEventListener(type, wrappedHandler, options);

        // Store the cleanup function to remove the listener later
        // With optional extra dispose behaviour per subclass
        this._listenerCleanups.push(function () {
          _this.element.removeEventListener(type, wrappedHandler, options);
        });

        // Return the wrapped handler in case it's needed elsewhere
        return wrappedHandler;
      }

      /**
       * Cleans up event listeners and unregisters the instance.
       */
    }, {
      key: "dispose",
      value: function dispose() {
        // Avoid double disposal
        if (this._disposed) return;
        this._disposed = true;
        this._listenerCleanups.forEach(function (cleanup) {
          return cleanup();
        });
        this._listenerCleanups = [];
        this.extraSubclassCleanup();
        this.element.__undoable__ = undefined;
        unregisterInstance(this);
      }
    }, {
      key: "extraSubclassCleanup",
      value: function extraSubclassCleanup() {}
    }]);
  }();

  var Action = /*#__PURE__*/function () {
    /**
     * @param {HTMLElement} element - The HTML element.
     */
    function Action(element) {
      _classCallCheck(this, Action);
      /** @type {HTMLElement} */
      this.element = element;
    }

    /**
     * Get all elements affected by this action.
     * @returns {HTMLElement[]}
     */
    return _createClass(Action, [{
      key: "affectedElements",
      value: function affectedElements() {
        return [this.element];
      }
    }, {
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

  function ensureHistoryStacks() {
    window.__GLOBAL_HISTORY__ = window.__GLOBAL_HISTORY__ || [];
    window.__REDO_STACK__ = window.__REDO_STACK__ || [];
  }
  function clearRedoStack() {
    window.__REDO_STACK__.length = 0;
  }
  function trimHistory() {
    var _getConfig = getConfig(),
      maxHistorySize = _getConfig.maxHistorySize;

    // Config is responsible for validation.
    // This guard is just a last-ditch safety net, not “handling”.
    if (!Number.isFinite(maxHistorySize) || maxHistorySize < 1) return;
    while (window.__GLOBAL_HISTORY__.length > maxHistorySize) {
      window.__GLOBAL_HISTORY__.shift();
    }
  }
  function pushActionToHistory(action) {
    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref$clearRedo = _ref.clearRedo,
      clearRedo = _ref$clearRedo === void 0 ? true : _ref$clearRedo;
    // Extra safety check to avoid recording actions during undo/redo operations
    if (isHistoryReplaying()) return;
    window.__GLOBAL_HISTORY__.push(action);
    trimHistory();
    if (clearRedo) {
      clearRedoStack();
    }
  }
  function pushActionToRedoStack(action) {
    window.__REDO_STACK__.push(action);
  }

  /**
   * CheckboxCommand encapsulates a toggle action on a checkbox.
   */
  var CheckboxAction = /*#__PURE__*/function (_Action) {
    /**
     * @param {HTMLInputElement} checkboxElement - The checkbox element.
     * @param {boolean} previousState - The state before the change.
     * @param {boolean} newState - The state after the change.
     */
    function CheckboxAction(checkboxElement, previousState, newState) {
      var _this;
      _classCallCheck(this, CheckboxAction);
      _this = _callSuper(this, CheckboxAction, [checkboxElement]);
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
      key: "createAction",
      value: function createAction(previousState, newState) {
        var action = new CheckboxAction(this.element, previousState, newState);
        pushActionToHistory(action);
      }
    }, {
      key: "handleChange",
      value: function handleChange() {
        // For toggling, assume the previous state is the opposite of the current.
        var newState = this.element.checked;
        var previousState = !newState;
        this.createAction(previousState, newState);
      }
    }, {
      key: "attachListeners",
      value: function attachListeners() {
        this.addProtectedListener('change', this.handleChange);
      }
    }]);
  }(UndoableElement);

  /**
   * RadioAction encapsulates a toggle action on a radio input.
   * It records the new radio (the one clicked) and the previously selected radio in the group.
   */
  var RadioAction = /*#__PURE__*/function (_Action) {
    /**
     * @param {HTMLInputElement} radioElement - The radio element that was clicked (new selection).
     * @param {HTMLInputElement|null} previousRadio - The previously selected radio in the group (or null if none).
     */
    function RadioAction(radioElement, previousRadio) {
      var _this;
      _classCallCheck(this, RadioAction);
      _this = _callSuper(this, RadioAction, [radioElement]);
      _this.newRadio = radioElement;
      _this.previousRadio = previousRadio; // may be null if there was no previous selection
      return _this;
    }
    _inherits(RadioAction, _Action);
    return _createClass(RadioAction, [{
      key: "affectedElements",
      value: function affectedElements() {
        // Filter to avoid returning null values
        return [this.element, this.previousRadio].filter(Boolean);
      }

      /**
       * Executes the action by checking the new radio and unchecking the previous one (if present).
       */
    }, {
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

    /**
     * Creates a RadioAction using the current element and the previously selected radio.
     * @param {HTMLInputElement|null} previousRadio
     * @returns {RadioAction}
     */
    _inherits(Radio, _UndoableElement);
    return _createClass(Radio, [{
      key: "createAction",
      value: function createAction(previousRadio) {
        var action = new RadioAction(this.element, previousRadio);
        pushActionToHistory(action);
      }
    }, {
      key: "handleChanges",
      value: function handleChanges() {
        var groupName = this.element.name;
        if (!groupName) return;
        var previousRadio = Radio.previousSelections[groupName] || null;
        // Update stored previous selection to the current element.
        Radio.previousSelections[groupName] = this.element;
        this.createAction(previousRadio);
      }
    }, {
      key: "attachListeners",
      value: function attachListeners() {
        // On change, create a RadioAction.
        this.addProtectedListener("change", this.handleChanges);
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

    /**
     * Creates a RangeAction using the current element's old and new values.
     * Then adds the action to the global history.
     * @param {number|string} previousValue
     * @param {number|string} newValue
     * @returns {RangeAction}
     */
    _inherits(Range, _UndoableElement);
    return _createClass(Range, [{
      key: "createAction",
      value: function createAction(previousValue, newValue) {
        var action = new RangeAction(this.element, this, previousValue, newValue);
        pushActionToHistory(action);
        // Update the oldValue to the new value for subsequent changes.
        this.oldValue = newValue;
      }
    }, {
      key: "handleChanges",
      value: function handleChanges() {
        // On change, create a RangeAction.
        var previousValue = this.oldValue;
        var newValue = this.element.value;
        // Only record an action if the value has actually changed.
        if (previousValue !== newValue) {
          this.createAction(previousValue, newValue);
        }
      }
    }, {
      key: "attachListeners",
      value: function attachListeners() {
        this.addProtectedListener("change", this.handleChanges);
      }
    }]);
  }(UndoableElement);

  /**
   * DateTimeAction encapsulates a change on a date/time input.
   * It records the previous value and the new value.
   */
  var DateTimeAction = /*#__PURE__*/function (_Action) {
    /**
     * @param {HTMLInputElement} dateTimeElement - The date/time input element.
     * @param {DateTime} dateTimeWrapper - The DateTime instance.
     * @param {string} previousValue - The value before the change.
     * @param {string} newValue - The value after the change.
     */
    function DateTimeAction(dateTimeElement, dateTimeWrapper, previousValue, newValue) {
      var _this;
      _classCallCheck(this, DateTimeAction);
      _this = _callSuper(this, DateTimeAction, [dateTimeElement]);
      _this.dateTimeListener = dateTimeWrapper;
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

    /**
     * Creates a DateTimeAction using the previous and new values.
     * @param {string} previousValue
     * @param {string} newValue
     * @returns {DateTimeAction}
     */
    _inherits(DateTime, _UndoableElement);
    return _createClass(DateTime, [{
      key: "createAction",
      value: function createAction(previousValue, newValue) {
        var action = new DateTimeAction(this.element, this, previousValue, newValue);
        pushActionToHistory(action);
        // Update oldValue to the new value.
        this.oldValue = newValue;
      }
    }, {
      key: "handleChanges",
      value: function handleChanges() {
        // On change, create a new DateTimeAction if the value has changed.
        var previousValue = this.oldValue;
        var newValue = this.element.value;
        if (previousValue !== newValue) {
          this.createAction(previousValue, newValue);
        }
      }
    }, {
      key: "attachListeners",
      value: function attachListeners() {
        var _this3 = this;
        // Attach the same handler to both 'input' and 'change'
        ['input', 'change'].forEach(function (type) {
          _this3.addProtectedListener(type, _this3.handleChanges);
        });
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

    /**
     * Creates a SelectAction using the previous and new values.
     * @param {string} previousValue
     * @param {string} newValue
     * @returns {SelectAction}
     */
    _inherits(Select, _UndoableElement);
    return _createClass(Select, [{
      key: "createAction",
      value: function createAction(previousValue, newValue) {
        var action = new SelectAction(this.element, this, previousValue, newValue);
        pushActionToHistory(action);
        // Update oldValue for subsequent changes.
        this.oldValue = newValue;
      }
    }, {
      key: "handleChanges",
      value: function handleChanges() {
        // On change, record the new selection if it differs.
        var previousValue = this.oldValue;
        var newValue = this.element.value;
        if (previousValue !== newValue) {
          this.createAction(previousValue, newValue);
        }
      }
    }, {
      key: "attachListeners",
      value: function attachListeners() {
        this.addProtectedListener("change", this.handleChanges);
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
     * @param {ColorPicker} colorPickerWrapper - The color picker listener instance.
     * @param {string} previousColor - The color before the change.
     * @param {string} newColor - The color after the change.
     */
    function ColorAction(colorElement, colorPickerWrapper, previousColor, newColor) {
      var _this;
      _classCallCheck(this, ColorAction);
      _this = _callSuper(this, ColorAction, [colorElement]);
      _this.colorPickerListener = colorPickerWrapper;
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

    /**
     * Creates a ColorAction using the previous and new color values.
     * Then pushes the action to the global history.
     * @param {string} previousColor
     * @param {string} newColor
     * @returns {ColorAction}
     */
    _inherits(ColorPicker, _UndoableElement);
    return _createClass(ColorPicker, [{
      key: "createAction",
      value: function createAction(previousColor, newColor) {
        var action = new ColorAction(this.element, this, previousColor, newColor);
        pushActionToHistory(action);
        this.oldColor = newColor;
      }
    }, {
      key: "handleChanges",
      value: function handleChanges() {
        var previousColor = this.oldColor;
        var newColor = this.element.value;
        if (previousColor !== newColor) {
          this.createAction(previousColor, newColor);
        }
      }
    }, {
      key: "attachListeners",
      value: function attachListeners() {
        // Define a single handler for both 'input' and 'change' events.
        this.addProtectedListener('change', this.handleChanges);
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
   * @param {string} value
   */
  function setValue(element, value) {
    if (isContentEditable(element)) {
      element.innerText = value;
    } else {
      element.value = value;
    }
  }

  var BOUNDARY_KEYS = new Set(["Enter", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End", "PageUp", "PageDown"]);

  /**
   * TextAction encapsulates a text change on an input/textarea/contenteditable.
   * It records the previous text and the new text.
   */
  var TextAction = /*#__PURE__*/function (_Action) {
    /**
     * @param {HTMLElement} textElement
     * @param {TextBox} textBoxWrapper
     * @param {string} previousValue
     * @param {string} newValue
     */
    function TextAction(textElement, textBoxWrapper, previousValue, newValue) {
      var _this;
      _classCallCheck(this, TextAction);
      _this = _callSuper(this, TextAction, [textElement]);
      _this.textBoxWrapper = textBoxWrapper;
      _this.previousValue = previousValue;
      _this.newValue = newValue;
      return _this;
    }
    _inherits(TextAction, _Action);
    return _createClass(TextAction, [{
      key: "redo",
      value: function redo() {
        this.textBoxWrapper.previousValue = this.newValue;
        setValue(this.element, this.newValue);
      }
    }, {
      key: "undo",
      value: function undo() {
        this.textBoxWrapper.previousValue = this.previousValue;
        setValue(this.element, this.previousValue);
      }
    }]);
  }(Action);

  /**
   * TextBox wraps text-like elements and groups rapid edits into "chunks".
   *
   * It uses config.textChunkThrottle (ms) to decide how long to wait after
   * the last keystroke before committing an action.
   */
  var TextBox = /*#__PURE__*/function (_UndoableElement) {
    /**
     * @param {HTMLElement} element
     * @param {Object} config
     */
    function TextBox(element, config) {
      var _this2;
      _classCallCheck(this, TextBox);
      _this2 = _callSuper(this, TextBox, [element]);
      _this2.throttleMs = typeof config.textChunkThrottle === "number" ? config.textChunkThrottle : 0;

      // Last committed value (what undo/redo considers the "current" value)
      _this2.previousValue = getValue(_this2.element);

      // Chunking state
      _this2.chunkActive = false;
      _this2.chunkStartValue = _this2.previousValue;
      _this2.chunkTimerId = null;
      _this2.attachListeners();
      TextBox._instances.add(_this2);
      return _this2;
    }

    /**
     * Commit the current chunk (if any) as a TextAction in history.
     */
    _inherits(TextBox, _UndoableElement);
    return _createClass(TextBox, [{
      key: "commitChunk",
      value: function commitChunk() {
        if (this.chunkTimerId !== null) {
          clearTimeout(this.chunkTimerId);
          this.chunkTimerId = null;
        }
        var finalValue = getValue(this.element);

        // If we never actually started a chunk but value drifted (programmatic change),
        // fall back to a simple previous => current action.
        if (!this.chunkActive) {
          if (finalValue !== this.previousValue) {
            var action = new TextAction(this.element, this, this.previousValue, finalValue);
            pushActionToHistory(action);
            this.previousValue = finalValue;
          }
          return;
        }

        // Chunk was active, only commit if something actually changed from the start.
        if (finalValue !== this.chunkStartValue) {
          var _action = new TextAction(this.element, this, this.chunkStartValue, finalValue);
          pushActionToHistory(_action);
          this.previousValue = finalValue;
        }
        this.chunkActive = false;
      }

      /**
       * Called on every input event.
       * Starts or continues a chunk and (re)schedules the commit timer.
       */
    }, {
      key: "handleInputEvent",
      value: function handleInputEvent() {
        var _this3 = this;
        var currentValue = getValue(this.element);

        // No actual change compared to last committed value; ignore.
        if (!this.chunkActive && currentValue === this.previousValue) {
          return;
        }

        // First change in this chunk: remember where we started.
        if (!this.chunkActive) {
          this.chunkActive = true;
          this.chunkStartValue = this.previousValue;
        }

        // If throttle is 0 or negative, commit immediately for each input.
        if (!this.throttleMs || this.throttleMs <= 0) {
          this.commitChunk();
          return;
        }

        // Otherwise, debounce commits: reset the timer on each keystroke.
        if (this.chunkTimerId !== null) {
          clearTimeout(this.chunkTimerId);
        }
        // Set new timer to commit chunk
        this.chunkTimerId = setTimeout(function () {
          _this3.commitChunk();
        }, this.throttleMs);
      }
    }, {
      key: "handleBoundaryKeyEvent",
      value: function handleBoundaryKeyEvent(event) {
        if (BOUNDARY_KEYS.has(event.key)) {
          this.commitChunk();
        }
      }

      /**
       * Attach listeners for input/change/blur.
       * We record every change via input, but only push an action when:
       *  - the throttle timer fires, or
       *  - the element blurs / change event fires.
       */
    }, {
      key: "attachListeners",
      value: function attachListeners() {
        this.addProtectedListener("input", this.handleInputEvent);
        this.addProtectedListener("keydown", this.handleBoundaryKeyEvent);
        this.addProtectedListener("pointerdown", this.commitChunk);
        // On blur or change, force a commit of any pending chunk.
        this.addProtectedListener("blur", this.commitChunk);
        this.addProtectedListener("change", this.commitChunk);
      }
    }, {
      key: "extraSubclassCleanup",
      value: function extraSubclassCleanup() {
        // Clear pending timer so it can't fire after dispose
        if (this.chunkTimerId !== null) {
          clearTimeout(this.chunkTimerId);
          this.chunkTimerId = null;
        }
        TextBox._instances["delete"](this);
      }
    }], [{
      key: "flushAll",
      value: function flushAll() {
        var _iterator = _createForOfIteratorHelper(TextBox._instances),
          _step;
        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var textbox = _step.value;
            textbox.commitChunk();
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      }
    }]);
  }(UndoableElement);
  _defineProperty(TextBox, "_instances", new Set());

  /**
   * Factory mapping: Each entry defines a CSS selector and a factory function
   * that takes a DOM element and returns an instance of an undoable handler.
   * This MUST be called at init-time, not import-time.
   *
   */
  function createFactoryMap(config) {
    return [
    // Does not support input[type="password"] for security reasons
    {
      selector: "\n        input[type=\"text\"],\n        input[type=\"search\"],\n        input[type=\"email\"],\n        input[type=\"url\"],\n        input[type=\"number\"],\n        input[type=\"tel\"],\n        textarea,\n        [contenteditable=\"true\"]\n      ",
      factory: function factory(element) {
        return config.collapseTextEdits ? new TextBox(element, config) : new TextBox(element, config);
      }
    }, {
      selector: 'input[type="checkbox"]',
      factory: function factory(el) {
        return new Checkbox(el);
      }
    }, {
      selector: 'input[type="radio"]',
      factory: function factory(el) {
        return new Radio(el);
      }
    }, {
      selector: 'input[type="range"]',
      factory: function factory(el) {
        return new Range(el);
      }
    }, {
      selector: 'input[type="date"], input[type="time"], input[type="datetime-local"]',
      factory: function factory(el) {
        return new DateTime(el);
      }
    }, {
      selector: 'select',
      factory: function factory(el) {
        return new Select(el);
      }
    }, {
      selector: 'input[type="color"]',
      factory: function factory(el) {
        return new ColorPicker(el);
      }
    }];
  }
  function buildCandidateElementSelectors(factoryMap) {
    // Merge all selectors into one comma-separated selector list
    // and normalize whitespace
    return factoryMap.map(function (element) {
      return element.selector;
    }).join(", ").replace(/\s+/g, " ").trim();
  }

  var mutationObserver = null;

  /**
   * Initialize undoable wrappers for elements in the document
   * by scanning the DOM and setting up a MutationObserver.
   * @param factoryMap
   */
  function initializeUndoableWrappers(factoryMap) {
    scanForAndWrapUndoableElements(document, factoryMap);
    resetObserver(factoryMap);
  }

  /**
   * Reinitialize undoable wrappers by disposing existing ones
   * and rescanning the DOM for undoable elements.
   * Then sets up a new MutationObserver.
   * @param factoryMap
   */
  function reinitializeUndoWrappers(factoryMap) {
    disposeAllUndoables();
    scanForAndWrapUndoableElements(document, factoryMap);
    resetObserver(factoryMap);
  }

  /**
   * Resets the MutationObserver with a new one based on the provided factoryMap.
   * @param factoryMap
   */
  function resetObserver(factoryMap) {
    if (mutationObserver) mutationObserver.disconnect();
    mutationObserver = createMutationObserver(factoryMap);
  }

  // Idea: Instead of attaching listeners to all elements, could use event delegation.
  // Maybe too deep into the project now for that refactor though.
  // At least for now.
  /**
   * Scan the DOM for undoable elements based of a root node
   * and wrap them with their respective undoable handlers.
   * @param {HTMLElement|Document} root - The root element to start scanning from.
   * @param factoryMap
   * @return {void}
   */
  function scanForAndWrapUndoableElements(root, factoryMap) {
    var elementSelectors = buildCandidateElementSelectors(factoryMap);
    var candidates = [];

    // Check if the root itself matches any selectors since querySelectorAll won't include it
    if (root instanceof Element && root.matches(elementSelectors)) {
      candidates.push(root);
    }
    var queriedElements = root.querySelectorAll(elementSelectors);
    candidates.push.apply(candidates, _toConsumableArray(queriedElements));
    for (var _i = 0, _candidates = candidates; _i < _candidates.length; _i++) {
      var currentElement = _candidates[_i];
      if (currentElement.__undoable__) continue;
      var _iterator = _createForOfIteratorHelper(factoryMap),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var _step$value = _step.value,
            selector = _step$value.selector,
            factory = _step$value.factory;
          if (currentElement.matches(selector)) {
            currentElement.__undoable__ = factory(currentElement);
            break;
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }
  }

  /**
   * Sets up a MutationObserver to watch for added nodes in the DOM.
   * When new nodes are added, it scans them for undoable elements and wraps them.
   * @returns {MutationObserver}
   */
  function createMutationObserver(factoryMap) {
    var observer = new MutationObserver(function (mutations) {
      var _iterator2 = _createForOfIteratorHelper(mutations),
        _step2;
      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var mutation = _step2.value;
          var _iterator3 = _createForOfIteratorHelper(mutation.addedNodes),
            _step3;
          try {
            for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
              var node = _step3.value;
              // skip text nodes, comments, etc.
              if (!(node instanceof HTMLElement)) continue;
              // Scan the subtree of the added node
              scanForAndWrapUndoableElements(node, factoryMap);
            }
          } catch (err) {
            _iterator3.e(err);
          } finally {
            _iterator3.f();
          }
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    return observer;
  }

  var _hasGlobalListeners = false;
  function ensureGlobalListeners(_ref) {
    var undo = _ref.undo,
      redo = _ref.redo;
    if (_hasGlobalListeners) return;
    addGlobalUndoRedoShortcuts({
      undo: undo,
      redo: redo
    });
    addMouseDownListeners();
    _hasGlobalListeners = true;
  }
  function addGlobalUndoRedoShortcuts(_ref2) {
    var undo = _ref2.undo,
      redo = _ref2.redo;
    document.addEventListener('keydown', function (event) {
      var isCtrlOrCmd = event.ctrlKey || event.metaKey;
      if (!isCtrlOrCmd) return;
      var key = event.key.toLowerCase();

      // Ctrl+Z or Cmd+Z for Undo
      if (!event.shiftKey && key === "z") {
        event.preventDefault();
        undo();
        return;
      }

      // Ctrl+Y or Cmd+Shift+Z for Redo
      if (key === "y" || event.shiftKey && key === "z") {
        event.preventDefault();
        redo();
      }
    });
  }

  // TODO: needed?
  // For the color picker for example, check if mouse is down to avoid capturing intermediate states
  function addMouseDownListeners() {
    document.addEventListener('mousedown', function () {
      return true;
    });
    document.addEventListener('mouseup', function () {
      return false;
    });
  }

  /**
   * Global undo function: undoes the most recent action.
   */
  function undo() {
    ensureHistoryStacks();
    flushActiveUndoables();
    if (window.__GLOBAL_HISTORY__.length > 0) {
      var action = window.__GLOBAL_HISTORY__.pop();
      activateHistoryReplayProtection(function () {
        action.undo();
        dispatchEvents(action, getConfig());
      });
      pushActionToRedoStack(action);
    }
  }

  /**
   * Global redo function: re-executes the most recently undone action.
   */
  function redo() {
    ensureHistoryStacks();
    flushActiveUndoables();
    if (window.__REDO_STACK__.length > 0) {
      var action = window.__REDO_STACK__.pop();
      activateHistoryReplayProtection(function () {
        action.redo();
        dispatchEvents(action, getConfig());
      });
      pushActionToHistory(action, {
        clearRedo: false
      });
    }
  }

  // Make sure any in-progress edits are finalized. (Before the throttle time is up for example)
  function flushActiveUndoables() {
    if (typeof TextBox.flushAll === 'function') {
      TextBox.flushAll();
    }
  }

  var factoryMap = null;
  var _initialized = false;

  //init coordination
  var _initScheduled = false;
  var _initInProgress = false;
  var _pendingBaselineConfig = null; // last init({config}) before init actually runs

  // reinit coordination (coalescing)
  var _reinitInProgress = false;
  var _reinitScheduled = false;
  var _reinitQueued = false;
  // For when reinit is requested multiple times in succession. Last config matters.
  var _latestReinitInReason = null;

  // TODO: leaving it here for now, but could just use setTimeout as is
  // queueMicrotask fallback
  // const queueMicrotaskFn =
  //     (typeof queueMicrotask === "function")
  //         ? queueMicrotask
  //         : (fn) => Promise.resolve().then(fn);

  function runInit() {
    if (_initialized || _initInProgress) return;
    _initInProgress = true;
    _initScheduled = false;
    emitStatus({
      phase: "initializing",
      busy: true,
      reason: "init"
    });
    var baselineFromInit = _pendingBaselineConfig || {};
    _pendingBaselineConfig = null;
    var config = setBaselineConfig(baselineFromInit);
    factoryMap = createFactoryMap(config);
    ensureHistoryStacks();
    initializeUndoableWrappers(factoryMap);
    ensureGlobalListeners({
      undo: undo,
      redo: redo
    });
    _initialized = true;
    _initInProgress = false;
    _initScheduled = false;
    emitStatus({
      phase: "ready",
      busy: false,
      reason: "init"
    });
  }
  function scheduleInitIfNeeded() {
    if (_initialized || _initInProgress || _initScheduled) return;
    _initScheduled = true;
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", runInit, {
        once: true
      });
    } else {
      // DOM already ready: run immediately (fixes the “init no-op” bug)
      runInit();
    }
  }
  function requestReinit(reason) {
    _latestReinitInReason = reason || "reinit";
    if (_reinitInProgress) {
      _reinitQueued = true;
      return;
    }
    if (_reinitScheduled) return;
    _reinitScheduled = true;
    emitStatus({
      phase: "reinitializing",
      busy: true,
      reason: _latestReinitInReason
    });

    // queueMicrotaskFn(runReinit);
    setTimeout(runReinit, 0);
  }
  function runReinit() {
    _reinitScheduled = false;
    if (!_initialized) return; // init not done yet
    if (_reinitInProgress) return;
    _reinitInProgress = true;
    var reason = _latestReinitInReason;
    try {
      // emitStatus({ phase: "reinitializing", busy: true, reason });
      // Commit pending chunks before disposing wrappers
      flushActiveUndoables();
      // Latest config wins
      factoryMap = createFactoryMap(getConfig());
      reinitializeUndoWrappers(factoryMap);

      // emitStatus({ phase: "ready", busy: false, reason });
    } finally {
      // Check if another reinit was queued during this one
      _reinitInProgress = false;
      emitStatus({
        phase: "ready",
        busy: false,
        reason: reason
      });
      if (_reinitQueued) {
        _reinitQueued = false;
        requestReinit("queued");
      }
    }
  }

  /**
   * Public: init()
   * Initialization function.
   * Scans the DOM for undoable elements and attaches their handlers.
   * Sets up mutation observers to handle dynamically added elements.
   * Also sets up global keyboard shortcuts for undo/redo.
   * Safe to call multiple times; initialization only happens once.
   * Last init({config}) wins if called multiple times before init completes.
   * @param options
   * @returns {null}
   */
  function init() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var _options$config = options.config,
      userConfig = _options$config === void 0 ? {} : _options$config;
    if (_initialized) return getConfig();
    // last init config wins
    _pendingBaselineConfig = userConfig;
    scheduleInitIfNeeded();
    return getConfig();
  }

  /**
   * Public: updateConfigAndReinitialize()
   * Updates config and optionally reinitializes wrappers.
   * @param {object} partialConfig
   * @param {{ reinitialize?: boolean }} [options]
   * @returns {object} updated config
   */
  function updateConfigAndReinit() {
    var partialConfig = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    if (!_initialized) return null;
    var _options$reinitialize = options.reinitialize,
      reinitialize = _options$reinitialize === void 0 ? true : _options$reinitialize;
    var config = updateConfig(partialConfig);
    if (reinitialize) {
      requestReinit("updateConfig");
    }
    return config;
  }

  /**
   * Public: resetConfigAndReinitialize()
   * Resets config and optionally reinitializes wrappers.
   * @param {{ reinitialize?: boolean }} [options]
   * @returns {object} reset config
   */
  function resetConfigAndReinit() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    if (!_initialized) return null;
    var _options$reinitialize2 = options.reinitialize,
      reinitialize = _options$reinitialize2 === void 0 ? true : _options$reinitialize2;
    var config = resetConfigToBaseline();
    if (reinitialize) {
      requestReinit("resetConfig");
    }
    return config;
  }

  // src/index.js
  if (typeof window !== 'undefined') {
    // TODO: Consider if auto-initialization is desired

    // Expose the API globally (UMD style)
    window.UndoableUI = {
      init: init,
      undo: undo,
      redo: redo,
      updateConfig: updateConfigAndReinit,
      resetConfig: resetConfigAndReinit,
      getConfig: getConfig
    };
  }

}));
//# sourceMappingURL=undoable-ui.umd.js.map
