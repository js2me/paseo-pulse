var __defProp = Object.defineProperty;
var __typeError = (msg) => {
  throw TypeError(msg);
};
var __defNormalProp = (obj, key2, value) => key2 in obj ? __defProp(obj, key2, { enumerable: true, configurable: true, writable: true, value }) : obj[key2] = value;
var __publicField = (obj, key2, value) => __defNormalProp(obj, typeof key2 !== "symbol" ? key2 + "" : key2, value);
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);

// node_modules/mobx/dist/mobx.esm.js
function die(error) {
  for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }
  if (false) {
    var e = typeof error === "string" ? error : errors[error];
    if (typeof e === "function") e = e.apply(null, args);
    throw new Error("[MobX] " + e);
  }
  throw new Error(typeof error === "number" ? "[MobX] minified error nr: " + error + (args.length ? " " + args.map(String).join(",") : "") + ". Find the full error at: https://github.com/mobxjs/mobx/blob/main/packages/mobx/src/errors.ts" : "[MobX] " + error);
}
var mockGlobal = {};
function getGlobal() {
  if (typeof globalThis !== "undefined") {
    return globalThis;
  }
  if (typeof window !== "undefined") {
    return window;
  }
  if (typeof global !== "undefined") {
    return global;
  }
  if (typeof self !== "undefined") {
    return self;
  }
  return mockGlobal;
}
var assign = Object.assign;
var getDescriptor = Object.getOwnPropertyDescriptor;
var defineProperty = Object.defineProperty;
var objectPrototype = Object.prototype;
var EMPTY_ARRAY = [];
Object.freeze(EMPTY_ARRAY);
var EMPTY_OBJECT = {};
Object.freeze(EMPTY_OBJECT);
var hasProxy = typeof Proxy !== "undefined";
var plainObjectString = /* @__PURE__ */ Object.toString();
function assertProxies() {
  if (!hasProxy) {
    die(false ? "`Proxy` objects are not available in the current environment. Please configure MobX to enable a fallback implementation.`" : "Proxy not available");
  }
}
function once(func) {
  var invoked = false;
  return function() {
    if (invoked) {
      return;
    }
    invoked = true;
    return func.apply(this, arguments);
  };
}
var noop = function noop2() {
};
function isFunction(fn) {
  return typeof fn === "function";
}
function isStringish(value) {
  var t = typeof value;
  switch (t) {
    case "string":
    case "symbol":
    case "number":
      return true;
  }
  return false;
}
function isObject(value) {
  return value !== null && typeof value === "object";
}
function isPlainObject(value) {
  if (!isObject(value)) {
    return false;
  }
  var proto = Object.getPrototypeOf(value);
  if (proto == null) {
    return true;
  }
  var protoConstructor = Object.hasOwnProperty.call(proto, "constructor") && proto.constructor;
  return typeof protoConstructor === "function" && protoConstructor.toString() === plainObjectString;
}
function isGenerator(obj) {
  var constructor = obj == null ? void 0 : obj.constructor;
  if (!constructor) {
    return false;
  }
  if ("GeneratorFunction" === constructor.name || "GeneratorFunction" === constructor.displayName) {
    return true;
  }
  return false;
}
function addHiddenProp(object2, propName, value) {
  defineProperty(object2, propName, {
    enumerable: false,
    writable: true,
    configurable: true,
    value
  });
}
function addHiddenFinalProp(object2, propName, value) {
  defineProperty(object2, propName, {
    enumerable: false,
    writable: false,
    configurable: true,
    value
  });
}
function createInstanceofPredicate(name, theClass) {
  var propName = "isMobX" + name;
  theClass.prototype[propName] = true;
  return function(x) {
    return isObject(x) && x[propName] === true;
  };
}
function isES6Map(thing) {
  return thing != null && Object.prototype.toString.call(thing) === "[object Map]";
}
function isPlainES6Map(thing) {
  var mapProto = Object.getPrototypeOf(thing);
  var objectProto = Object.getPrototypeOf(mapProto);
  var nullProto = Object.getPrototypeOf(objectProto);
  return nullProto === null;
}
function isES6Set(thing) {
  return thing != null && Object.prototype.toString.call(thing) === "[object Set]";
}
var hasGetOwnPropertySymbols = typeof Object.getOwnPropertySymbols !== "undefined";
function getPlainObjectKeys(object2) {
  var keys = Object.keys(object2);
  if (!hasGetOwnPropertySymbols) {
    return keys;
  }
  var symbols = Object.getOwnPropertySymbols(object2);
  if (!symbols.length) {
    return keys;
  }
  return [].concat(keys, symbols.filter(function(s) {
    return objectPrototype.propertyIsEnumerable.call(object2, s);
  }));
}
var ownKeys = typeof Reflect !== "undefined" && Reflect.ownKeys ? Reflect.ownKeys : hasGetOwnPropertySymbols ? function(obj) {
  return Object.getOwnPropertyNames(obj).concat(Object.getOwnPropertySymbols(obj));
} : (
  /* istanbul ignore next */
  Object.getOwnPropertyNames
);
function toPrimitive(value) {
  return value === null ? null : typeof value === "object" ? "" + value : value;
}
function hasProp(target, prop) {
  return objectPrototype.hasOwnProperty.call(target, prop);
}
var getOwnPropertyDescriptors = Object.getOwnPropertyDescriptors || function getOwnPropertyDescriptors2(target) {
  var res = {};
  ownKeys(target).forEach(function(key2) {
    res[key2] = getDescriptor(target, key2);
  });
  return res;
};
function getFlag(flags, mask) {
  return !!(flags & mask);
}
function setFlag(flags, mask, newValue) {
  if (newValue) {
    flags |= mask;
  } else {
    flags &= ~mask;
  }
  return flags;
}
function _arrayLikeToArray(r, a) {
  (null == a || a > r.length) && (a = r.length);
  for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
  return n;
}
function _construct(t, e, r) {
  if (_isNativeReflectConstruct()) return Reflect.construct.apply(null, arguments);
  var o = [null];
  o.push.apply(o, e);
  var p = new (t.bind.apply(t, o))();
  return r && _setPrototypeOf(p, r.prototype), p;
}
function _defineProperties(e, r) {
  for (var t = 0; t < r.length; t++) {
    var o = r[t];
    o.enumerable = o.enumerable || false, o.configurable = true, "value" in o && (o.writable = true), Object.defineProperty(e, _toPropertyKey(o.key), o);
  }
}
function _createClass(e, r, t) {
  return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", {
    writable: false
  }), e;
}
function _createForOfIteratorHelperLoose(r, e) {
  var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
  if (t) return (t = t.call(r)).next.bind(t);
  if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) {
    t && (r = t);
    var o = 0;
    return function() {
      return o >= r.length ? {
        done: true
      } : {
        done: false,
        value: r[o++]
      };
    };
  }
  throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _extends() {
  return _extends = Object.assign ? Object.assign.bind() : function(n) {
    for (var e = 1; e < arguments.length; e++) {
      var t = arguments[e];
      for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
    }
    return n;
  }, _extends.apply(null, arguments);
}
function _getPrototypeOf(t) {
  return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function(t2) {
    return t2.__proto__ || Object.getPrototypeOf(t2);
  }, _getPrototypeOf(t);
}
function _inheritsLoose(t, o) {
  t.prototype = Object.create(o.prototype), t.prototype.constructor = t, _setPrototypeOf(t, o);
}
function _isNativeFunction(t) {
  try {
    return -1 !== Function.toString.call(t).indexOf("[native code]");
  } catch (n) {
    return "function" == typeof t;
  }
}
function _isNativeReflectConstruct() {
  try {
    var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
    }));
  } catch (t2) {
  }
  return (_isNativeReflectConstruct = function() {
    return !!t;
  })();
}
function _setPrototypeOf(t, e) {
  return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(t2, e2) {
    return t2.__proto__ = e2, t2;
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
function _unsupportedIterableToArray(r, a) {
  if (r) {
    if ("string" == typeof r) return _arrayLikeToArray(r, a);
    var t = {}.toString.call(r).slice(8, -1);
    return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0;
  }
}
function _wrapNativeSuper(t) {
  var r = "function" == typeof Map ? /* @__PURE__ */ new Map() : void 0;
  return _wrapNativeSuper = function(t2) {
    if (null === t2 || !_isNativeFunction(t2)) return t2;
    if ("function" != typeof t2) throw new TypeError("Super expression must either be null or a function");
    if (void 0 !== r) {
      if (r.has(t2)) return r.get(t2);
      r.set(t2, Wrapper);
    }
    function Wrapper() {
      return _construct(t2, arguments, _getPrototypeOf(this).constructor);
    }
    return Wrapper.prototype = Object.create(t2.prototype, {
      constructor: {
        value: Wrapper,
        enumerable: false,
        writable: true,
        configurable: true
      }
    }), _setPrototypeOf(Wrapper, t2);
  }, _wrapNativeSuper(t);
}
var storedAnnotationsSymbol = /* @__PURE__ */ Symbol("mobx-stored-annotations");
function createDecoratorAnnotation(annotation) {
  function decorator(target, property) {
    if (is20223Decorator(property)) {
      return annotation.decorate_20223_(target, property);
    } else {
      storeAnnotation(target, property, annotation);
    }
  }
  return Object.assign(decorator, annotation);
}
function storeAnnotation(prototype, key2, annotation) {
  if (!hasProp(prototype, storedAnnotationsSymbol)) {
    addHiddenProp(prototype, storedAnnotationsSymbol, _extends({}, prototype[storedAnnotationsSymbol]));
  }
  if (false) {
    var fieldName = prototype.constructor.name + ".prototype." + key2.toString();
    die("'" + fieldName + "' is decorated with 'override', but no such decorated member was found on prototype.");
  }
  assertNotDecorated(prototype, annotation, key2);
  if (!isOverride(annotation)) {
    prototype[storedAnnotationsSymbol][key2] = annotation;
  }
}
function assertNotDecorated(prototype, annotation, key2) {
  if (false) {
    var fieldName = prototype.constructor.name + ".prototype." + key2.toString();
    var currentAnnotationType = prototype[storedAnnotationsSymbol][key2].annotationType_;
    var requestedAnnotationType = annotation.annotationType_;
    die("Cannot apply '@" + requestedAnnotationType + "' to '" + fieldName + "':" + ("\nThe field is already decorated with '@" + currentAnnotationType + "'.") + "\nRe-decorating fields is not allowed.\nUse '@override' decorator for methods overridden by subclass.");
  }
}
function collectStoredAnnotations(target) {
  if (!hasProp(target, storedAnnotationsSymbol)) {
    addHiddenProp(target, storedAnnotationsSymbol, _extends({}, target[storedAnnotationsSymbol]));
  }
  return target[storedAnnotationsSymbol];
}
function is20223Decorator(context) {
  return typeof context == "object" && typeof context["kind"] == "string";
}
var $mobx = /* @__PURE__ */ Symbol("mobx administration");
var Atom = /* @__PURE__ */ (function() {
  function Atom2(name_) {
    if (name_ === void 0) {
      name_ = false ? "Atom@" + getNextId() : "Atom";
    }
    this.name_ = void 0;
    this.flags_ = 0;
    this.observers_ = /* @__PURE__ */ new Set();
    this.lastAccessedBy_ = 0;
    this.lowestObserverState_ = IDerivationState_.NOT_TRACKING_;
    this.onBOL = void 0;
    this.onBUOL = void 0;
    this.name_ = name_;
  }
  var _proto = Atom2.prototype;
  _proto.onBO = function onBO() {
    if (this.onBOL) {
      this.onBOL.forEach(function(listener) {
        return listener();
      });
    }
  };
  _proto.onBUO = function onBUO() {
    if (this.onBUOL) {
      this.onBUOL.forEach(function(listener) {
        return listener();
      });
    }
  };
  _proto.reportObserved = function reportObserved$1() {
    return reportObserved(this);
  };
  _proto.reportChanged = function reportChanged() {
    startBatch();
    propagateChanged(this);
    endBatch();
  };
  _proto.toString = function toString2() {
    return this.name_;
  };
  return _createClass(Atom2, [{
    key: "isBeingObserved",
    get: function get3() {
      return getFlag(this.flags_, Atom2.isBeingObservedMask_);
    },
    set: function set4(newValue) {
      this.flags_ = setFlag(this.flags_, Atom2.isBeingObservedMask_, newValue);
    }
  }, {
    key: "isPendingUnobservation",
    get: function get3() {
      return getFlag(this.flags_, Atom2.isPendingUnobservationMask_);
    },
    set: function set4(newValue) {
      this.flags_ = setFlag(this.flags_, Atom2.isPendingUnobservationMask_, newValue);
    }
  }, {
    key: "diffValue",
    get: function get3() {
      return getFlag(this.flags_, Atom2.diffValueMask_) ? 1 : 0;
    },
    set: function set4(newValue) {
      this.flags_ = setFlag(this.flags_, Atom2.diffValueMask_, newValue === 1 ? true : false);
    }
  }]);
})();
Atom.isBeingObservedMask_ = 1;
Atom.isPendingUnobservationMask_ = 2;
Atom.diffValueMask_ = 4;
var isAtom = /* @__PURE__ */ createInstanceofPredicate("Atom", Atom);
function createAtom(name, onBecomeObservedHandler, onBecomeUnobservedHandler) {
  if (onBecomeObservedHandler === void 0) {
    onBecomeObservedHandler = noop;
  }
  if (onBecomeUnobservedHandler === void 0) {
    onBecomeUnobservedHandler = noop;
  }
  var atom = new Atom(name);
  if (onBecomeObservedHandler !== noop) {
    onBecomeObserved(atom, onBecomeObservedHandler);
  }
  if (onBecomeUnobservedHandler !== noop) {
    onBecomeUnobserved(atom, onBecomeUnobservedHandler);
  }
  return atom;
}
function identityComparer(a, b) {
  return a === b;
}
function structuralComparer(a, b) {
  return deepEqual(a, b);
}
function shallowComparer(a, b) {
  return deepEqual(a, b, 1);
}
function defaultComparer(a, b) {
  if (Object.is) {
    return Object.is(a, b);
  }
  return a === b ? a !== 0 || 1 / a === 1 / b : a !== a && b !== b;
}
var comparer = {
  identity: identityComparer,
  structural: structuralComparer,
  "default": defaultComparer,
  shallow: shallowComparer
};
function deepEnhancer(v, _, name) {
  if (isObservable(v)) {
    return v;
  }
  if (Array.isArray(v)) {
    return observable.array(v, {
      name
    });
  }
  if (isPlainObject(v)) {
    return observable.object(v, void 0, {
      name
    });
  }
  if (isES6Map(v)) {
    return observable.map(v, {
      name
    });
  }
  if (isES6Set(v)) {
    return observable.set(v, {
      name
    });
  }
  if (typeof v === "function" && !isAction(v) && !isFlow(v)) {
    if (isGenerator(v)) {
      return flow(v);
    } else {
      return autoAction(name, v);
    }
  }
  return v;
}
function shallowEnhancer(v, _, name) {
  if (v === void 0 || v === null) {
    return v;
  }
  if (isObservableObject(v) || isObservableArray(v) || isObservableMap(v) || isObservableSet(v)) {
    return v;
  }
  if (Array.isArray(v)) {
    return observable.array(v, {
      name,
      deep: false
    });
  }
  if (isPlainObject(v)) {
    return observable.object(v, void 0, {
      name,
      deep: false
    });
  }
  if (isES6Map(v)) {
    return observable.map(v, {
      name,
      deep: false
    });
  }
  if (isES6Set(v)) {
    return observable.set(v, {
      name,
      deep: false
    });
  }
  if (false) {
    die("The shallow modifier / decorator can only used in combination with arrays, objects, maps and sets");
  }
}
function referenceEnhancer(newValue) {
  return newValue;
}
function refStructEnhancer(v, oldValue) {
  if (false) {
    die("observable.struct should not be used with observable values");
  }
  if (deepEqual(v, oldValue)) {
    return oldValue;
  }
  return v;
}
var OVERRIDE = "override";
function isOverride(annotation) {
  return annotation.annotationType_ === OVERRIDE;
}
function createActionAnnotation(name, options) {
  return {
    annotationType_: name,
    options_: options,
    make_: make_$1,
    extend_: extend_$1,
    decorate_20223_: decorate_20223_$1
  };
}
function make_$1(adm, key2, descriptor, source) {
  var _this$options_;
  if ((_this$options_ = this.options_) != null && _this$options_.bound) {
    return this.extend_(adm, key2, descriptor, false) === null ? 0 : 1;
  }
  if (source === adm.target_) {
    return this.extend_(adm, key2, descriptor, false) === null ? 0 : 2;
  }
  if (isAction(descriptor.value)) {
    return 1;
  }
  var actionDescriptor = createActionDescriptor(adm, this, key2, descriptor, false);
  defineProperty(source, key2, actionDescriptor);
  return 2;
}
function extend_$1(adm, key2, descriptor, proxyTrap) {
  var actionDescriptor = createActionDescriptor(adm, this, key2, descriptor);
  return adm.defineProperty_(key2, actionDescriptor, proxyTrap);
}
function decorate_20223_$1(mthd, context) {
  if (false) {
    assert20223DecoratorType(context, ["method", "field"]);
  }
  var kind = context.kind, name = context.name, addInitializer = context.addInitializer;
  var ann = this;
  var _createAction = function _createAction2(m) {
    var _ann$options_$name, _ann$options_, _ann$options_$autoAct, _ann$options_2;
    return createAction((_ann$options_$name = (_ann$options_ = ann.options_) == null ? void 0 : _ann$options_.name) != null ? _ann$options_$name : name.toString(), m, (_ann$options_$autoAct = (_ann$options_2 = ann.options_) == null ? void 0 : _ann$options_2.autoAction) != null ? _ann$options_$autoAct : false);
  };
  if (kind == "field") {
    return function(initMthd) {
      var _ann$options_3;
      var mthd2 = initMthd;
      if (!isAction(mthd2)) {
        mthd2 = _createAction(mthd2);
      }
      if ((_ann$options_3 = ann.options_) != null && _ann$options_3.bound) {
        mthd2 = mthd2.bind(this);
        mthd2.isMobxAction = true;
      }
      return mthd2;
    };
  }
  if (kind == "method") {
    var _this$options_2;
    if (!isAction(mthd)) {
      mthd = _createAction(mthd);
    }
    if ((_this$options_2 = this.options_) != null && _this$options_2.bound) {
      addInitializer(function() {
        var self2 = this;
        var bound = self2[name].bind(self2);
        bound.isMobxAction = true;
        self2[name] = bound;
      });
    }
    return mthd;
  }
  die("Cannot apply '" + ann.annotationType_ + "' to '" + String(name) + "' (kind: " + kind + "):" + ("\n'" + ann.annotationType_ + "' can only be used on properties with a function value."));
}
function assertActionDescriptor(adm, _ref, key2, _ref2) {
  var annotationType_ = _ref.annotationType_;
  var value = _ref2.value;
  if (false) {
    die("Cannot apply '" + annotationType_ + "' to '" + adm.name_ + "." + key2.toString() + "':" + ("\n'" + annotationType_ + "' can only be used on properties with a function value."));
  }
}
function createActionDescriptor(adm, annotation, key2, descriptor, safeDescriptors) {
  var _annotation$options_, _annotation$options_$, _annotation$options_2, _annotation$options_$2, _annotation$options_3, _annotation$options_4, _adm$proxy_2;
  if (safeDescriptors === void 0) {
    safeDescriptors = globalState.safeDescriptors;
  }
  assertActionDescriptor(adm, annotation, key2, descriptor);
  var value = descriptor.value;
  if ((_annotation$options_ = annotation.options_) != null && _annotation$options_.bound) {
    var _adm$proxy_;
    value = value.bind((_adm$proxy_ = adm.proxy_) != null ? _adm$proxy_ : adm.target_);
  }
  return {
    value: createAction(
      (_annotation$options_$ = (_annotation$options_2 = annotation.options_) == null ? void 0 : _annotation$options_2.name) != null ? _annotation$options_$ : key2.toString(),
      value,
      (_annotation$options_$2 = (_annotation$options_3 = annotation.options_) == null ? void 0 : _annotation$options_3.autoAction) != null ? _annotation$options_$2 : false,
      // https://github.com/mobxjs/mobx/discussions/3140
      (_annotation$options_4 = annotation.options_) != null && _annotation$options_4.bound ? (_adm$proxy_2 = adm.proxy_) != null ? _adm$proxy_2 : adm.target_ : void 0
    ),
    // Non-configurable for classes
    // prevents accidental field redefinition in subclass
    configurable: safeDescriptors ? adm.isPlainObject_ : true,
    // https://github.com/mobxjs/mobx/pull/2641#issuecomment-737292058
    enumerable: false,
    // Non-obsevable, therefore non-writable
    // Also prevents rewriting in subclass constructor
    writable: safeDescriptors ? false : true
  };
}
function createFlowAnnotation(name, options) {
  return {
    annotationType_: name,
    options_: options,
    make_: make_$2,
    extend_: extend_$2,
    decorate_20223_: decorate_20223_$2
  };
}
function make_$2(adm, key2, descriptor, source) {
  var _this$options_;
  if (source === adm.target_) {
    return this.extend_(adm, key2, descriptor, false) === null ? 0 : 2;
  }
  if ((_this$options_ = this.options_) != null && _this$options_.bound && (!hasProp(adm.target_, key2) || !isFlow(adm.target_[key2]))) {
    if (this.extend_(adm, key2, descriptor, false) === null) {
      return 0;
    }
  }
  if (isFlow(descriptor.value)) {
    return 1;
  }
  var flowDescriptor = createFlowDescriptor(adm, this, key2, descriptor, false, false);
  defineProperty(source, key2, flowDescriptor);
  return 2;
}
function extend_$2(adm, key2, descriptor, proxyTrap) {
  var _this$options_2;
  var flowDescriptor = createFlowDescriptor(adm, this, key2, descriptor, (_this$options_2 = this.options_) == null ? void 0 : _this$options_2.bound);
  return adm.defineProperty_(key2, flowDescriptor, proxyTrap);
}
function decorate_20223_$2(mthd, context) {
  var _this$options_3;
  if (false) {
    assert20223DecoratorType(context, ["method"]);
  }
  var name = context.name, addInitializer = context.addInitializer;
  if (!isFlow(mthd)) {
    mthd = flow(mthd);
  }
  if ((_this$options_3 = this.options_) != null && _this$options_3.bound) {
    addInitializer(function() {
      var self2 = this;
      var bound = self2[name].bind(self2);
      bound.isMobXFlow = true;
      self2[name] = bound;
    });
  }
  return mthd;
}
function assertFlowDescriptor(adm, _ref, key2, _ref2) {
  var annotationType_ = _ref.annotationType_;
  var value = _ref2.value;
  if (false) {
    die("Cannot apply '" + annotationType_ + "' to '" + adm.name_ + "." + key2.toString() + "':" + ("\n'" + annotationType_ + "' can only be used on properties with a generator function value."));
  }
}
function createFlowDescriptor(adm, annotation, key2, descriptor, bound, safeDescriptors) {
  if (safeDescriptors === void 0) {
    safeDescriptors = globalState.safeDescriptors;
  }
  assertFlowDescriptor(adm, annotation, key2, descriptor);
  var value = descriptor.value;
  if (!isFlow(value)) {
    value = flow(value);
  }
  if (bound) {
    var _adm$proxy_;
    value = value.bind((_adm$proxy_ = adm.proxy_) != null ? _adm$proxy_ : adm.target_);
    value.isMobXFlow = true;
  }
  return {
    value,
    // Non-configurable for classes
    // prevents accidental field redefinition in subclass
    configurable: safeDescriptors ? adm.isPlainObject_ : true,
    // https://github.com/mobxjs/mobx/pull/2641#issuecomment-737292058
    enumerable: false,
    // Non-obsevable, therefore non-writable
    // Also prevents rewriting in subclass constructor
    writable: safeDescriptors ? false : true
  };
}
function createComputedAnnotation(name, options) {
  return {
    annotationType_: name,
    options_: options,
    make_: make_$3,
    extend_: extend_$3,
    decorate_20223_: decorate_20223_$3
  };
}
function make_$3(adm, key2, descriptor) {
  return this.extend_(adm, key2, descriptor, false) === null ? 0 : 1;
}
function extend_$3(adm, key2, descriptor, proxyTrap) {
  assertComputedDescriptor(adm, this, key2, descriptor);
  return adm.defineComputedProperty_(key2, _extends({}, this.options_, {
    get: descriptor.get,
    set: descriptor.set
  }), proxyTrap);
}
function decorate_20223_$3(get3, context) {
  if (false) {
    assert20223DecoratorType(context, ["getter"]);
  }
  var ann = this;
  var key2 = context.name, addInitializer = context.addInitializer;
  var computedValues;
  function createComputedValue(target, adm) {
    var options = _extends({}, ann.options_, {
      get: get3,
      context: target
    });
    options.name || (options.name = false ? adm.name_ + "." + key2.toString() : "ObservableObject." + key2.toString());
    return new ComputedValue(options);
  }
  addInitializer(function() {
    var _adm$lazyComputedKeys;
    var adm = asObservableObject(this)[$mobx];
    var target = this;
    var observable2 = adm.values_.get(key2);
    if (observable2 instanceof ComputedValue && observable2.derivation !== get3) {
      adm.values_["delete"](key2);
    }
    ((_adm$lazyComputedKeys = adm.lazyComputedKeys_) != null ? _adm$lazyComputedKeys : adm.lazyComputedKeys_ = /* @__PURE__ */ new Map()).set(key2, function() {
      return createComputedValue(target, adm);
    });
  });
  return function() {
    var adm = this[$mobx];
    var observable2 = adm.values_.get(key2);
    if (observable2 instanceof ComputedValue && observable2.derivation !== get3) {
      var _computedValues;
      var computed3 = (_computedValues = computedValues) == null ? void 0 : _computedValues.get(this);
      if (!computed3) {
        var _computedValues2;
        computed3 = createComputedValue(this, adm);
        ((_computedValues2 = computedValues) != null ? _computedValues2 : computedValues = /* @__PURE__ */ new WeakMap()).set(this, computed3);
      }
      return computed3.get();
    }
    return adm.getObservablePropValue_(key2);
  };
}
function assertComputedDescriptor(adm, _ref, key2, _ref2) {
  var annotationType_ = _ref.annotationType_;
  var get3 = _ref2.get;
  if (false) {
    die("Cannot apply '" + annotationType_ + "' to '" + adm.name_ + "." + key2.toString() + "':" + ("\n'" + annotationType_ + "' can only be used on getter(+setter) properties."));
  }
}
function createObservableAnnotation(name, options) {
  return {
    annotationType_: name,
    options_: options,
    make_: make_$4,
    extend_: extend_$4,
    decorate_20223_: decorate_20223_$4
  };
}
function make_$4(adm, key2, descriptor) {
  return this.extend_(adm, key2, descriptor, false) === null ? 0 : 1;
}
function extend_$4(adm, key2, descriptor, proxyTrap) {
  var _this$options_$enhanc, _this$options_;
  assertObservableDescriptor(adm, this, key2, descriptor);
  return adm.defineObservableProperty_(key2, descriptor.value, (_this$options_$enhanc = (_this$options_ = this.options_) == null ? void 0 : _this$options_.enhancer) != null ? _this$options_$enhanc : deepEnhancer, proxyTrap);
}
function decorate_20223_$4(desc, context) {
  if (false) {
    if (context.kind === "field") {
      throw die("Please use `@observable accessor " + String(context.name) + "` instead of `@observable " + String(context.name) + "`");
    }
    assert20223DecoratorType(context, ["accessor"]);
  }
  var ann = this;
  var kind = context.kind, name = context.name;
  if (kind !== "accessor") {
    return;
  }
  function registerLazy(target, value) {
    var _adm$lazyObservableKe;
    var adm = asObservableObject(target)[$mobx];
    ((_adm$lazyObservableKe = adm.lazyObservableKeys_) != null ? _adm$lazyObservableKe : adm.lazyObservableKeys_ = /* @__PURE__ */ new Map()).set(name, function() {
      var _ann$options_$enhance, _ann$options_;
      return new ObservableValue(value, (_ann$options_$enhance = (_ann$options_ = ann.options_) == null ? void 0 : _ann$options_.enhancer) != null ? _ann$options_$enhance : deepEnhancer, false ? adm.name_ + "." + name.toString() : "ObservableObject." + name.toString(), false);
    });
    return adm;
  }
  return {
    get: function get3() {
      var _this$$mobx;
      var adm = (_this$$mobx = this[$mobx]) != null ? _this$$mobx : registerLazy(this, desc.get.call(this));
      return adm.getObservablePropValue_(name);
    },
    set: function set4(value) {
      var _this$$mobx2;
      var adm = (_this$$mobx2 = this[$mobx]) != null ? _this$$mobx2 : registerLazy(this, value);
      return adm.setObservablePropValue_(name, value);
    },
    init: function init(value) {
      registerLazy(this, value);
      return value;
    }
  };
}
function assertObservableDescriptor(adm, _ref, key2, descriptor) {
  var annotationType_ = _ref.annotationType_;
  if (false) {
    die("Cannot apply '" + annotationType_ + "' to '" + adm.name_ + "." + key2.toString() + "':" + ("\n'" + annotationType_ + "' cannot be used on getter/setter properties"));
  }
}
var AUTO = "true";
var autoAnnotation = /* @__PURE__ */ createAutoAnnotation();
function createAutoAnnotation(options) {
  return {
    annotationType_: AUTO,
    options_: options,
    make_: make_$5,
    extend_: extend_$5,
    decorate_20223_: decorate_20223_$5
  };
}
function make_$5(adm, key2, descriptor, source) {
  var _this$options_3, _this$options_4;
  if (descriptor.get) {
    return computed.make_(adm, key2, descriptor, source);
  }
  if (descriptor.set) {
    var set4 = isAction(descriptor.set) ? descriptor.set : createAction(key2.toString(), descriptor.set);
    if (source === adm.target_) {
      return adm.defineProperty_(key2, {
        configurable: globalState.safeDescriptors ? adm.isPlainObject_ : true,
        set: set4
      }) === null ? 0 : 2;
    }
    defineProperty(source, key2, {
      configurable: true,
      set: set4
    });
    return 2;
  }
  if (source !== adm.target_ && typeof descriptor.value === "function") {
    var _this$options_2;
    if (isGenerator(descriptor.value)) {
      var _this$options_;
      var flowAnnotation2 = (_this$options_ = this.options_) != null && _this$options_.autoBind ? flow.bound : flow;
      return flowAnnotation2.make_(adm, key2, descriptor, source);
    }
    var actionAnnotation2 = (_this$options_2 = this.options_) != null && _this$options_2.autoBind ? autoAction.bound : autoAction;
    return actionAnnotation2.make_(adm, key2, descriptor, source);
  }
  var observableAnnotation2 = ((_this$options_3 = this.options_) == null ? void 0 : _this$options_3.deep) === false ? observable.ref : observable;
  if (typeof descriptor.value === "function" && (_this$options_4 = this.options_) != null && _this$options_4.autoBind) {
    var _adm$proxy_;
    descriptor.value = descriptor.value.bind((_adm$proxy_ = adm.proxy_) != null ? _adm$proxy_ : adm.target_);
  }
  return observableAnnotation2.make_(adm, key2, descriptor, source);
}
function extend_$5(adm, key2, descriptor, proxyTrap) {
  var _this$options_5, _this$options_6;
  if (descriptor.get) {
    return computed.extend_(adm, key2, descriptor, proxyTrap);
  }
  if (descriptor.set) {
    return adm.defineProperty_(key2, {
      configurable: globalState.safeDescriptors ? adm.isPlainObject_ : true,
      set: createAction(key2.toString(), descriptor.set)
    }, proxyTrap);
  }
  if (typeof descriptor.value === "function" && (_this$options_5 = this.options_) != null && _this$options_5.autoBind) {
    var _adm$proxy_2;
    descriptor.value = descriptor.value.bind((_adm$proxy_2 = adm.proxy_) != null ? _adm$proxy_2 : adm.target_);
  }
  var observableAnnotation2 = ((_this$options_6 = this.options_) == null ? void 0 : _this$options_6.deep) === false ? observable.ref : observable;
  return observableAnnotation2.extend_(adm, key2, descriptor, proxyTrap);
}
function decorate_20223_$5(desc, context) {
  die("'" + this.annotationType_ + "' cannot be used as a decorator");
}
var OBSERVABLE = "observable";
var OBSERVABLE_REF = "observable.ref";
var OBSERVABLE_SHALLOW = "observable.shallow";
var OBSERVABLE_STRUCT = "observable.struct";
var defaultCreateObservableOptions = {
  deep: true,
  name: void 0,
  defaultDecorator: void 0,
  proxy: true
};
Object.freeze(defaultCreateObservableOptions);
function asCreateObservableOptions(thing) {
  return thing || defaultCreateObservableOptions;
}
var observableAnnotation = /* @__PURE__ */ createObservableAnnotation(OBSERVABLE);
var observableRefAnnotation = /* @__PURE__ */ createObservableAnnotation(OBSERVABLE_REF, {
  enhancer: referenceEnhancer
});
var observableShallowAnnotation = /* @__PURE__ */ createObservableAnnotation(OBSERVABLE_SHALLOW, {
  enhancer: shallowEnhancer
});
var observableStructAnnotation = /* @__PURE__ */ createObservableAnnotation(OBSERVABLE_STRUCT, {
  enhancer: refStructEnhancer
});
var observableDecoratorAnnotation = /* @__PURE__ */ createDecoratorAnnotation(observableAnnotation);
function getEnhancerFromOptions(options) {
  return options.deep === true ? deepEnhancer : options.deep === false ? referenceEnhancer : getEnhancerFromAnnotation(options.defaultDecorator);
}
function getAnnotationFromOptions(options) {
  var _options$defaultDecor;
  return options ? (_options$defaultDecor = options.defaultDecorator) != null ? _options$defaultDecor : createAutoAnnotation(options) : void 0;
}
function getEnhancerFromAnnotation(annotation) {
  var _annotation$options_$, _annotation$options_;
  return !annotation ? deepEnhancer : (_annotation$options_$ = (_annotation$options_ = annotation.options_) == null ? void 0 : _annotation$options_.enhancer) != null ? _annotation$options_$ : deepEnhancer;
}
function createObservable(v, arg2, arg3) {
  if (is20223Decorator(arg2)) {
    return observableAnnotation.decorate_20223_(v, arg2);
  }
  if (isStringish(arg2)) {
    storeAnnotation(v, arg2, observableAnnotation);
    return;
  }
  if (isObservable(v)) {
    return v;
  }
  if (isPlainObject(v)) {
    return observable.object(v, arg2, arg3);
  }
  if (Array.isArray(v)) {
    return observable.array(v, arg2);
  }
  if (isES6Map(v)) {
    return observable.map(v, arg2);
  }
  if (isES6Set(v)) {
    return observable.set(v, arg2);
  }
  if (typeof v === "object" && v !== null) {
    return v;
  }
  return observable.box(v, arg2);
}
assign(createObservable, observableDecoratorAnnotation);
var observableFactories = {
  box: function box(value, options) {
    var o = asCreateObservableOptions(options);
    return new ObservableValue(value, getEnhancerFromOptions(o), o.name, true, o.equals);
  },
  array: function array(initialValues, options) {
    var o = asCreateObservableOptions(options);
    return (globalState.useProxies === false || o.proxy === false ? createLegacyArray : createObservableArray)(initialValues, getEnhancerFromOptions(o), o.name);
  },
  map: function map(initialValues, options) {
    var o = asCreateObservableOptions(options);
    return new ObservableMap(initialValues, getEnhancerFromOptions(o), o.name);
  },
  set: function set(initialValues, options) {
    var o = asCreateObservableOptions(options);
    return new ObservableSet(initialValues, getEnhancerFromOptions(o), o.name);
  },
  object: function object(props, decorators, options) {
    return initObservable(function() {
      return extendObservable(globalState.useProxies === false || (options == null ? void 0 : options.proxy) === false ? asObservableObject({}, options) : asDynamicObservableObject({}, options), props, decorators);
    });
  },
  ref: /* @__PURE__ */ createDecoratorAnnotation(observableRefAnnotation),
  shallow: /* @__PURE__ */ createDecoratorAnnotation(observableShallowAnnotation),
  deep: observableDecoratorAnnotation,
  struct: /* @__PURE__ */ createDecoratorAnnotation(observableStructAnnotation)
};
var observable = /* @__PURE__ */ assign(createObservable, observableFactories);
var COMPUTED = "computed";
var COMPUTED_STRUCT = "computed.struct";
var computedAnnotation = /* @__PURE__ */ createComputedAnnotation(COMPUTED);
var computedStructAnnotation = /* @__PURE__ */ createComputedAnnotation(COMPUTED_STRUCT, {
  equals: comparer.structural
});
var computed = function computed2(arg1, arg2) {
  if (is20223Decorator(arg2)) {
    return computedAnnotation.decorate_20223_(arg1, arg2);
  }
  if (isStringish(arg2)) {
    return storeAnnotation(arg1, arg2, computedAnnotation);
  }
  if (isPlainObject(arg1)) {
    return createDecoratorAnnotation(createComputedAnnotation(COMPUTED, arg1));
  }
  if (false) {
    if (!isFunction(arg1)) {
      die("First argument to `computed` should be an expression.");
    }
    if (isFunction(arg2)) {
      die("A setter as second argument is no longer supported, use `{ set: fn }` option instead");
    }
  }
  var opts = isPlainObject(arg2) ? arg2 : {};
  opts.get = arg1;
  opts.name || (opts.name = arg1.name || "");
  return new ComputedValue(opts);
};
Object.assign(computed, computedAnnotation);
computed.struct = /* @__PURE__ */ createDecoratorAnnotation(computedStructAnnotation);
var _getDescriptor$config;
var _getDescriptor;
var currentActionId = 0;
var nextActionId = 1;
var isFunctionNameConfigurable = (_getDescriptor$config = (_getDescriptor = /* @__PURE__ */ getDescriptor(function() {
}, "name")) == null ? void 0 : _getDescriptor.configurable) != null ? _getDescriptor$config : false;
var tmpNameDescriptor = {
  value: "action",
  configurable: true,
  writable: false,
  enumerable: false
};
function createAction(actionName, fn, autoAction2, ref) {
  if (autoAction2 === void 0) {
    autoAction2 = false;
  }
  if (false) {
    if (!isFunction(fn)) {
      die("`action` can only be invoked on functions");
    }
    if (typeof actionName !== "string" || !actionName) {
      die("actions should have valid names, got: '" + actionName + "'");
    }
  }
  function res() {
    return executeAction(actionName, autoAction2, fn, ref || this, arguments);
  }
  res.isMobxAction = true;
  res.toString = function() {
    return fn.toString();
  };
  if (isFunctionNameConfigurable) {
    tmpNameDescriptor.value = actionName;
    defineProperty(res, "name", tmpNameDescriptor);
  }
  return res;
}
function executeAction(actionName, canRunAsDerivation, fn, scope, args) {
  var runInfo = _startAction(actionName, canRunAsDerivation, scope, args);
  try {
    return fn.apply(scope, args);
  } catch (err) {
    runInfo.error_ = err;
    throw err;
  } finally {
    _endAction(runInfo);
  }
}
function _startAction(actionName, canRunAsDerivation, scope, args) {
  var notifySpy_ = false;
  var startTime_ = 0;
  if (false) {
    startTime_ = Date.now();
    var flattenedArgs = args ? Array.from(args) : EMPTY_ARRAY;
    spyReportStart({
      type: ACTION,
      name: actionName,
      object: scope,
      arguments: flattenedArgs
    });
  }
  var prevDerivation_ = globalState.trackingDerivation;
  var runAsAction = !canRunAsDerivation || !prevDerivation_;
  startBatch();
  var prevAllowStateChanges_ = globalState.allowStateChanges;
  if (runAsAction) {
    untrackedStart();
    prevAllowStateChanges_ = allowStateChangesStart(true);
  }
  var prevAllowStateReads_ = allowStateReadsStart(true);
  var runInfo = {
    runAsAction_: runAsAction,
    prevDerivation_,
    prevAllowStateChanges_,
    prevAllowStateReads_,
    notifySpy_,
    startTime_,
    actionId_: nextActionId++,
    parentActionId_: currentActionId
  };
  currentActionId = runInfo.actionId_;
  return runInfo;
}
function _endAction(runInfo) {
  if (currentActionId !== runInfo.actionId_) {
    die(30);
  }
  currentActionId = runInfo.parentActionId_;
  if (runInfo.error_ !== void 0) {
    globalState.suppressReactionErrors = true;
  }
  allowStateChangesEnd(runInfo.prevAllowStateChanges_);
  allowStateReadsEnd(runInfo.prevAllowStateReads_);
  endBatch();
  if (runInfo.runAsAction_) {
    untrackedEnd(runInfo.prevDerivation_);
  }
  if (false) {
    spyReportEnd({
      time: Date.now() - runInfo.startTime_
    });
  }
  globalState.suppressReactionErrors = false;
}
function allowStateChanges(allowStateChanges2, func) {
  var prev = allowStateChangesStart(allowStateChanges2);
  try {
    return func();
  } finally {
    allowStateChangesEnd(prev);
  }
}
function allowStateChangesStart(allowStateChanges2) {
  var prev = globalState.allowStateChanges;
  globalState.allowStateChanges = allowStateChanges2;
  return prev;
}
function allowStateChangesEnd(prev) {
  globalState.allowStateChanges = prev;
}
var ObservableValue = /* @__PURE__ */ (function(_Atom) {
  function ObservableValue2(value, enhancer, name_, notifySpy, equals) {
    var _this;
    if (name_ === void 0) {
      name_ = false ? "ObservableValue@" + getNextId() : "ObservableValue";
    }
    if (notifySpy === void 0) {
      notifySpy = true;
    }
    if (equals === void 0) {
      equals = comparer["default"];
    }
    _this = _Atom.call(this, name_) || this;
    _this.enhancer = void 0;
    _this.name_ = void 0;
    _this.equals = void 0;
    _this.hasUnreportedChange_ = false;
    _this.interceptors_ = void 0;
    _this.changeListeners_ = void 0;
    _this.value_ = void 0;
    _this.dehancer = void 0;
    _this.enhancer = enhancer;
    _this.name_ = name_;
    _this.equals = equals;
    _this.value_ = enhancer(value, void 0, name_);
    if (false) {
      var _this$value_;
      spyReport({
        type: CREATE,
        object: _this,
        observableKind: "value",
        debugObjectName: _this.name_,
        newValue: "" + ((_this$value_ = _this.value_) == null ? void 0 : _this$value_.toString())
      });
    }
    return _this;
  }
  _inheritsLoose(ObservableValue2, _Atom);
  var _proto = ObservableValue2.prototype;
  _proto.dehanceValue = function dehanceValue(value) {
    if (this.dehancer !== void 0) {
      return this.dehancer(value);
    }
    return value;
  };
  _proto.set = function set4(newValue) {
    var oldValue = this.value_;
    newValue = this.prepareNewValue_(newValue);
    if (newValue !== globalState.UNCHANGED) {
      var notifySpy = isSpyEnabled();
      if (false) {
        spyReportStart({
          type: UPDATE,
          object: this,
          observableKind: "value",
          debugObjectName: this.name_,
          newValue,
          oldValue
        });
      }
      this.setNewValue_(newValue);
      if (false) {
        spyReportEnd();
      }
    }
  };
  _proto.prepareNewValue_ = function prepareNewValue_(newValue) {
    checkIfStateModificationsAreAllowed(this);
    if (hasInterceptors(this)) {
      var change = interceptChange(this, {
        object: this,
        type: UPDATE,
        newValue
      });
      if (!change) {
        return globalState.UNCHANGED;
      }
      newValue = change.newValue;
    }
    newValue = this.enhancer(newValue, this.value_, this.name_);
    return this.equals(this.value_, newValue) ? globalState.UNCHANGED : newValue;
  };
  _proto.setNewValue_ = function setNewValue_(newValue) {
    var oldValue = this.value_;
    this.value_ = newValue;
    this.reportChanged();
    if (hasListeners(this)) {
      notifyListeners(this, {
        type: UPDATE,
        object: this,
        newValue,
        oldValue
      });
    }
  };
  _proto.get = function get3() {
    this.reportObserved();
    return this.dehanceValue(this.value_);
  };
  _proto.intercept_ = function intercept_(handler) {
    return registerInterceptor(this, handler);
  };
  _proto.observe_ = function observe_(listener, fireImmediately) {
    if (fireImmediately) {
      listener({
        observableKind: "value",
        debugObjectName: this.name_,
        object: this,
        type: UPDATE,
        newValue: this.value_,
        oldValue: void 0
      });
    }
    return registerListener(this, listener);
  };
  _proto.raw = function raw() {
    return this.value_;
  };
  _proto.toJSON = function toJSON2() {
    return this.get();
  };
  _proto.toString = function toString2() {
    return this.name_ + "[" + this.value_ + "]";
  };
  _proto.valueOf = function valueOf() {
    return toPrimitive(this.get());
  };
  _proto[Symbol.toPrimitive] = function() {
    return this.valueOf();
  };
  return ObservableValue2;
})(Atom);
var ComputedValue = /* @__PURE__ */ (function() {
  function ComputedValue2(options) {
    this.dependenciesState_ = IDerivationState_.NOT_TRACKING_;
    this.observing_ = [];
    this.newObserving_ = null;
    this.observers_ = /* @__PURE__ */ new Set();
    this.runId_ = 0;
    this.lastAccessedBy_ = 0;
    this.lowestObserverState_ = IDerivationState_.UP_TO_DATE_;
    this.unboundDepsCount_ = 0;
    this.value_ = new CaughtException(null);
    this.name_ = void 0;
    this.triggeredBy_ = void 0;
    this.flags_ = 0;
    this.derivation = void 0;
    this.setter_ = void 0;
    this.isTracing_ = TraceMode.NONE;
    this.scope_ = void 0;
    this.equals_ = void 0;
    this.requiresReaction_ = void 0;
    this.keepAlive_ = void 0;
    this.onBOL = void 0;
    this.onBUOL = void 0;
    if (!options.get) {
      die(31);
    }
    this.derivation = options.get;
    this.name_ = options.name || (false ? "ComputedValue@" + getNextId() : "ComputedValue");
    if (options.set) {
      this.setter_ = createAction(false ? this.name_ + "-setter" : "ComputedValue-setter", options.set);
    }
    this.equals_ = options.equals || (options.compareStructural || options.struct ? comparer.structural : comparer["default"]);
    this.scope_ = options.context;
    this.requiresReaction_ = options.requiresReaction;
    this.keepAlive_ = !!options.keepAlive;
  }
  var _proto = ComputedValue2.prototype;
  _proto.onBecomeStale_ = function onBecomeStale_() {
    propagateMaybeChanged(this);
  };
  _proto.onBO = function onBO() {
    if (this.onBOL) {
      this.onBOL.forEach(function(listener) {
        return listener();
      });
    }
  };
  _proto.onBUO = function onBUO() {
    if (this.onBUOL) {
      this.onBUOL.forEach(function(listener) {
        return listener();
      });
    }
  };
  _proto.get = function get3() {
    if (this.isComputing) {
      die(32, this.name_, this.derivation);
    }
    if (globalState.inBatch === 0 && // !globalState.trackingDerivatpion &&
    this.observers_.size === 0 && !this.keepAlive_) {
      if (shouldCompute(this)) {
        this.warnAboutUntrackedRead_();
        startBatch();
        this.value_ = this.computeValue_(false);
        endBatch();
      }
    } else {
      reportObserved(this);
      if (shouldCompute(this)) {
        var prevTrackingContext = globalState.trackingContext;
        if (this.keepAlive_ && !prevTrackingContext) {
          globalState.trackingContext = this;
        }
        if (this.trackAndCompute()) {
          propagateChangeConfirmed(this);
        }
        globalState.trackingContext = prevTrackingContext;
      }
    }
    var result = this.value_;
    if (isCaughtException(result)) {
      throw result.cause;
    }
    return result;
  };
  _proto.set = function set4(value) {
    if (this.setter_) {
      if (this.isRunningSetter) {
        die(33, this.name_);
      }
      this.isRunningSetter = true;
      try {
        this.setter_.call(this.scope_, value);
      } finally {
        this.isRunningSetter = false;
      }
    } else {
      die(34, this.name_);
    }
  };
  _proto.trackAndCompute = function trackAndCompute() {
    var oldValue = this.value_;
    var wasSuspended = (
      /* see #1208 */
      this.dependenciesState_ === IDerivationState_.NOT_TRACKING_
    );
    var newValue = this.computeValue_(true);
    var changed = wasSuspended || isCaughtException(oldValue) || isCaughtException(newValue) || !this.equals_(oldValue, newValue);
    if (changed) {
      this.value_ = newValue;
      if (false) {
        spyReport({
          observableKind: "computed",
          debugObjectName: this.name_,
          object: this.scope_,
          type: "update",
          oldValue,
          newValue
        });
      }
    }
    return changed;
  };
  _proto.computeValue_ = function computeValue_(track) {
    this.isComputing = true;
    var prev = allowStateChangesStart(false);
    var res;
    if (track) {
      res = trackDerivedFunction(this, this.derivation, this.scope_);
    } else {
      if (globalState.disableErrorBoundaries === true) {
        res = this.derivation.call(this.scope_);
      } else {
        try {
          res = this.derivation.call(this.scope_);
        } catch (e) {
          res = new CaughtException(e);
        }
      }
    }
    allowStateChangesEnd(prev);
    this.isComputing = false;
    return res;
  };
  _proto.suspend_ = function suspend_() {
    if (!this.keepAlive_) {
      clearObserving(this);
      this.value_ = void 0;
      if (false) {
        console.log("[mobx.trace] Computed value '" + this.name_ + "' was suspended and it will recompute on the next access.");
      }
    }
  };
  _proto.observe_ = function observe_(listener, fireImmediately) {
    var _this = this;
    var firstTime = true;
    var prevValue = void 0;
    return autorun(function() {
      var newValue = _this.get();
      if (!firstTime || fireImmediately) {
        var prevU = untrackedStart();
        listener({
          observableKind: "computed",
          debugObjectName: _this.name_,
          type: UPDATE,
          object: _this,
          newValue,
          oldValue: prevValue
        });
        untrackedEnd(prevU);
      }
      firstTime = false;
      prevValue = newValue;
    });
  };
  _proto.warnAboutUntrackedRead_ = function warnAboutUntrackedRead_() {
    if (true) {
      return;
    }
    if (this.isTracing_ !== TraceMode.NONE) {
      console.log("[mobx.trace] Computed value '" + this.name_ + "' is being read outside a reactive context. Doing a full recompute.");
    }
    if (typeof this.requiresReaction_ === "boolean" ? this.requiresReaction_ : globalState.computedRequiresReaction) {
      console.warn("[mobx] Computed value '" + this.name_ + "' is being read outside a reactive context. Doing a full recompute.");
    }
  };
  _proto.toString = function toString2() {
    return this.name_ + "[" + this.derivation.toString() + "]";
  };
  _proto.valueOf = function valueOf() {
    return toPrimitive(this.get());
  };
  _proto[Symbol.toPrimitive] = function() {
    return this.valueOf();
  };
  return _createClass(ComputedValue2, [{
    key: "isComputing",
    get: function get3() {
      return getFlag(this.flags_, ComputedValue2.isComputingMask_);
    },
    set: function set4(newValue) {
      this.flags_ = setFlag(this.flags_, ComputedValue2.isComputingMask_, newValue);
    }
  }, {
    key: "isRunningSetter",
    get: function get3() {
      return getFlag(this.flags_, ComputedValue2.isRunningSetterMask_);
    },
    set: function set4(newValue) {
      this.flags_ = setFlag(this.flags_, ComputedValue2.isRunningSetterMask_, newValue);
    }
  }, {
    key: "isBeingObserved",
    get: function get3() {
      return getFlag(this.flags_, ComputedValue2.isBeingObservedMask_);
    },
    set: function set4(newValue) {
      this.flags_ = setFlag(this.flags_, ComputedValue2.isBeingObservedMask_, newValue);
    }
  }, {
    key: "isPendingUnobservation",
    get: function get3() {
      return getFlag(this.flags_, ComputedValue2.isPendingUnobservationMask_);
    },
    set: function set4(newValue) {
      this.flags_ = setFlag(this.flags_, ComputedValue2.isPendingUnobservationMask_, newValue);
    }
  }, {
    key: "diffValue",
    get: function get3() {
      return getFlag(this.flags_, ComputedValue2.diffValueMask_) ? 1 : 0;
    },
    set: function set4(newValue) {
      this.flags_ = setFlag(this.flags_, ComputedValue2.diffValueMask_, newValue === 1 ? true : false);
    }
  }]);
})();
ComputedValue.isComputingMask_ = 1;
ComputedValue.isRunningSetterMask_ = 2;
ComputedValue.isBeingObservedMask_ = 4;
ComputedValue.isPendingUnobservationMask_ = 8;
ComputedValue.diffValueMask_ = 16;
var isComputedValue = /* @__PURE__ */ createInstanceofPredicate("ComputedValue", ComputedValue);
var IDerivationState_;
(function(IDerivationState_2) {
  IDerivationState_2[IDerivationState_2["NOT_TRACKING_"] = -1] = "NOT_TRACKING_";
  IDerivationState_2[IDerivationState_2["UP_TO_DATE_"] = 0] = "UP_TO_DATE_";
  IDerivationState_2[IDerivationState_2["POSSIBLY_STALE_"] = 1] = "POSSIBLY_STALE_";
  IDerivationState_2[IDerivationState_2["STALE_"] = 2] = "STALE_";
})(IDerivationState_ || (IDerivationState_ = {}));
var TraceMode;
(function(TraceMode2) {
  TraceMode2[TraceMode2["NONE"] = 0] = "NONE";
  TraceMode2[TraceMode2["LOG"] = 1] = "LOG";
  TraceMode2[TraceMode2["BREAK"] = 2] = "BREAK";
})(TraceMode || (TraceMode = {}));
var CaughtException = function CaughtException2(cause) {
  this.cause = void 0;
  this.cause = cause;
};
function isCaughtException(e) {
  return e instanceof CaughtException;
}
function shouldCompute(derivation) {
  switch (derivation.dependenciesState_) {
    case IDerivationState_.UP_TO_DATE_:
      return false;
    case IDerivationState_.NOT_TRACKING_:
    case IDerivationState_.STALE_:
      return true;
    case IDerivationState_.POSSIBLY_STALE_: {
      var prevAllowStateReads = allowStateReadsStart(true);
      var prevUntracked = untrackedStart();
      var obs = derivation.observing_, l = obs.length;
      for (var i = 0; i < l; i++) {
        var obj = obs[i];
        if (isComputedValue(obj)) {
          if (globalState.disableErrorBoundaries) {
            obj.get();
          } else {
            try {
              obj.get();
            } catch (e) {
              untrackedEnd(prevUntracked);
              allowStateReadsEnd(prevAllowStateReads);
              return true;
            }
          }
          if (derivation.dependenciesState_ === IDerivationState_.STALE_) {
            untrackedEnd(prevUntracked);
            allowStateReadsEnd(prevAllowStateReads);
            return true;
          }
        }
      }
      changeDependenciesStateTo0(derivation);
      untrackedEnd(prevUntracked);
      allowStateReadsEnd(prevAllowStateReads);
      return false;
    }
  }
}
function checkIfStateModificationsAreAllowed(atom) {
  if (true) {
    return;
  }
  var hasObservers = atom.observers_.size > 0;
  if (!globalState.allowStateChanges && (hasObservers || globalState.enforceActions === "always")) {
    console.warn("[MobX] " + (globalState.enforceActions ? "Since strict-mode is enabled, changing (observed) observable values without using an action is not allowed. Tried to modify: " : "Side effects like changing state are not allowed at this point. Are you trying to modify state from, for example, a computed value or the render function of a React component? You can wrap side effects in 'runInAction' (or decorate functions with 'action') if needed. Tried to modify: ") + atom.name_);
  }
}
function checkIfStateReadsAreAllowed(observable2) {
  if (false) {
    console.warn("[mobx] Observable '" + observable2.name_ + "' being read outside a reactive context.");
  }
}
function trackDerivedFunction(derivation, f, context) {
  var prevAllowStateReads = allowStateReadsStart(true);
  changeDependenciesStateTo0(derivation);
  derivation.newObserving_ = new Array(
    // Reserve constant space for initial dependencies, dynamic space otherwise.
    // See https://github.com/mobxjs/mobx/pull/3833
    derivation.runId_ === 0 ? 100 : derivation.observing_.length
  );
  derivation.unboundDepsCount_ = 0;
  derivation.runId_ = ++globalState.runId;
  var prevTracking = globalState.trackingDerivation;
  globalState.trackingDerivation = derivation;
  globalState.inBatch++;
  var result;
  if (globalState.disableErrorBoundaries === true) {
    result = f.call(context);
  } else {
    try {
      result = f.call(context);
    } catch (e) {
      result = new CaughtException(e);
    }
  }
  globalState.inBatch--;
  globalState.trackingDerivation = prevTracking;
  bindDependencies(derivation);
  warnAboutDerivationWithoutDependencies(derivation);
  allowStateReadsEnd(prevAllowStateReads);
  return result;
}
function warnAboutDerivationWithoutDependencies(derivation) {
  if (true) {
    return;
  }
  if (derivation.observing_.length !== 0) {
    return;
  }
  if (typeof derivation.requiresObservable_ === "boolean" ? derivation.requiresObservable_ : globalState.reactionRequiresObservable) {
    console.warn("[mobx] Derivation '" + derivation.name_ + "' is created/updated without reading any observable value.");
  }
}
function bindDependencies(derivation) {
  var prevObserving = derivation.observing_;
  var observing = derivation.observing_ = derivation.newObserving_;
  var lowestNewObservingDerivationState = IDerivationState_.UP_TO_DATE_;
  var i0 = 0, l = derivation.unboundDepsCount_;
  for (var i = 0; i < l; i++) {
    var dep = observing[i];
    if (dep.diffValue === 0) {
      dep.diffValue = 1;
      if (i0 !== i) {
        observing[i0] = dep;
      }
      i0++;
    }
    if (dep.dependenciesState_ > lowestNewObservingDerivationState) {
      lowestNewObservingDerivationState = dep.dependenciesState_;
    }
  }
  observing.length = i0;
  derivation.newObserving_ = null;
  l = prevObserving.length;
  while (l--) {
    var _dep = prevObserving[l];
    if (_dep.diffValue === 0) {
      removeObserver(_dep, derivation);
    }
    _dep.diffValue = 0;
  }
  while (i0--) {
    var _dep2 = observing[i0];
    if (_dep2.diffValue === 1) {
      _dep2.diffValue = 0;
      addObserver(_dep2, derivation);
    }
  }
  if (lowestNewObservingDerivationState !== IDerivationState_.UP_TO_DATE_) {
    derivation.dependenciesState_ = lowestNewObservingDerivationState;
    derivation.onBecomeStale_();
  }
}
function clearObserving(derivation) {
  var obs = derivation.observing_;
  derivation.observing_ = [];
  var i = obs.length;
  while (i--) {
    removeObserver(obs[i], derivation);
  }
  derivation.dependenciesState_ = IDerivationState_.NOT_TRACKING_;
}
function untracked(action2) {
  var prev = untrackedStart();
  try {
    return action2();
  } finally {
    untrackedEnd(prev);
  }
}
function untrackedStart() {
  var prev = globalState.trackingDerivation;
  globalState.trackingDerivation = null;
  return prev;
}
function untrackedEnd(prev) {
  globalState.trackingDerivation = prev;
}
function allowStateReadsStart(allowStateReads) {
  var prev = globalState.allowStateReads;
  globalState.allowStateReads = allowStateReads;
  return prev;
}
function allowStateReadsEnd(prev) {
  globalState.allowStateReads = prev;
}
function changeDependenciesStateTo0(derivation) {
  if (derivation.dependenciesState_ === IDerivationState_.UP_TO_DATE_) {
    return;
  }
  derivation.dependenciesState_ = IDerivationState_.UP_TO_DATE_;
  var obs = derivation.observing_;
  var i = obs.length;
  while (i--) {
    obs[i].lowestObserverState_ = IDerivationState_.UP_TO_DATE_;
  }
}
var MobXGlobals = function MobXGlobals2() {
  this.version = 6;
  this.UNCHANGED = {};
  this.trackingDerivation = null;
  this.trackingContext = null;
  this.runId = 0;
  this.mobxGuid = 0;
  this.inBatch = 0;
  this.pendingUnobservations = [];
  this.pendingReactions = [];
  this.isRunningReactions = false;
  this.allowStateChanges = false;
  this.allowStateReads = true;
  this.enforceActions = true;
  this.spyListeners = [];
  this.globalReactionErrorHandlers = [];
  this.computedRequiresReaction = false;
  this.reactionRequiresObservable = false;
  this.observableRequiresReaction = false;
  this.disableErrorBoundaries = false;
  this.suppressReactionErrors = false;
  this.useProxies = true;
  this.verifyProxies = false;
  this.safeDescriptors = true;
};
var canMergeGlobalState = true;
var isolateCalled = false;
var globalState = /* @__PURE__ */ (function() {
  var global2 = /* @__PURE__ */ getGlobal();
  if (global2.__mobxInstanceCount > 0 && !global2.__mobxGlobals) {
    canMergeGlobalState = false;
  }
  if (global2.__mobxGlobals && global2.__mobxGlobals.version !== new MobXGlobals().version) {
    canMergeGlobalState = false;
  }
  if (!canMergeGlobalState) {
    setTimeout(function() {
      if (!isolateCalled) {
        die(35);
      }
    }, 1);
    return new MobXGlobals();
  } else if (global2.__mobxGlobals) {
    global2.__mobxInstanceCount += 1;
    if (!global2.__mobxGlobals.UNCHANGED) {
      global2.__mobxGlobals.UNCHANGED = {};
    }
    return global2.__mobxGlobals;
  } else {
    global2.__mobxInstanceCount = 1;
    return global2.__mobxGlobals = /* @__PURE__ */ new MobXGlobals();
  }
})();
function isolateGlobalState() {
  if (globalState.pendingReactions.length || globalState.inBatch || globalState.isRunningReactions) {
    die(36);
  }
  isolateCalled = true;
  if (canMergeGlobalState) {
    var global2 = getGlobal();
    if (--global2.__mobxInstanceCount === 0) {
      global2.__mobxGlobals = void 0;
    }
    globalState = new MobXGlobals();
  }
}
function addObserver(observable2, node) {
  observable2.observers_.add(node);
  if (observable2.lowestObserverState_ > node.dependenciesState_) {
    observable2.lowestObserverState_ = node.dependenciesState_;
  }
}
function removeObserver(observable2, node) {
  observable2.observers_["delete"](node);
  if (observable2.observers_.size === 0) {
    queueForUnobservation(observable2);
  }
}
function queueForUnobservation(observable2) {
  if (observable2.isPendingUnobservation === false) {
    observable2.isPendingUnobservation = true;
    globalState.pendingUnobservations.push(observable2);
  }
}
function startBatch() {
  globalState.inBatch++;
}
function endBatch() {
  if (--globalState.inBatch === 0) {
    runReactions();
    var list = globalState.pendingUnobservations;
    for (var i = 0; i < list.length; i++) {
      var observable2 = list[i];
      observable2.isPendingUnobservation = false;
      if (observable2.observers_.size === 0) {
        if (observable2.isBeingObserved) {
          observable2.isBeingObserved = false;
          observable2.onBUO();
        }
        if (observable2 instanceof ComputedValue) {
          observable2.suspend_();
        }
      }
    }
    globalState.pendingUnobservations = [];
  }
}
function reportObserved(observable2) {
  checkIfStateReadsAreAllowed(observable2);
  var derivation = globalState.trackingDerivation;
  if (derivation !== null) {
    if (derivation.runId_ !== observable2.lastAccessedBy_) {
      observable2.lastAccessedBy_ = derivation.runId_;
      derivation.newObserving_[derivation.unboundDepsCount_++] = observable2;
      if (!observable2.isBeingObserved && globalState.trackingContext) {
        observable2.isBeingObserved = true;
        observable2.onBO();
      }
    }
    return observable2.isBeingObserved;
  } else if (observable2.observers_.size === 0 && globalState.inBatch > 0) {
    queueForUnobservation(observable2);
  }
  return false;
}
function propagateChanged(observable2) {
  if (observable2.lowestObserverState_ === IDerivationState_.STALE_) {
    return;
  }
  observable2.lowestObserverState_ = IDerivationState_.STALE_;
  observable2.observers_.forEach(function(d) {
    if (d.dependenciesState_ === IDerivationState_.UP_TO_DATE_) {
      if (false) {
        logTraceInfo(d, observable2);
      }
      d.onBecomeStale_();
    }
    d.dependenciesState_ = IDerivationState_.STALE_;
  });
}
function propagateChangeConfirmed(observable2) {
  if (observable2.lowestObserverState_ === IDerivationState_.STALE_) {
    return;
  }
  observable2.lowestObserverState_ = IDerivationState_.STALE_;
  observable2.observers_.forEach(function(d) {
    if (d.dependenciesState_ === IDerivationState_.POSSIBLY_STALE_) {
      d.dependenciesState_ = IDerivationState_.STALE_;
      if (false) {
        logTraceInfo(d, observable2);
      }
    } else if (d.dependenciesState_ === IDerivationState_.UP_TO_DATE_) {
      observable2.lowestObserverState_ = IDerivationState_.UP_TO_DATE_;
    }
  });
}
function propagateMaybeChanged(observable2) {
  if (observable2.lowestObserverState_ !== IDerivationState_.UP_TO_DATE_) {
    return;
  }
  observable2.lowestObserverState_ = IDerivationState_.POSSIBLY_STALE_;
  observable2.observers_.forEach(function(d) {
    if (d.dependenciesState_ === IDerivationState_.UP_TO_DATE_) {
      d.dependenciesState_ = IDerivationState_.POSSIBLY_STALE_;
      d.onBecomeStale_();
    }
  });
}
var Reaction = /* @__PURE__ */ (function() {
  function Reaction2(name_, onInvalidate_, errorHandler_, requiresObservable_) {
    if (name_ === void 0) {
      name_ = false ? "Reaction@" + getNextId() : "Reaction";
    }
    this.name_ = void 0;
    this.onInvalidate_ = void 0;
    this.errorHandler_ = void 0;
    this.requiresObservable_ = void 0;
    this.observing_ = [];
    this.newObserving_ = [];
    this.dependenciesState_ = IDerivationState_.NOT_TRACKING_;
    this.runId_ = 0;
    this.unboundDepsCount_ = 0;
    this.flags_ = 0;
    this.isTracing_ = TraceMode.NONE;
    this.name_ = name_;
    this.onInvalidate_ = onInvalidate_;
    this.errorHandler_ = errorHandler_;
    this.requiresObservable_ = requiresObservable_;
  }
  var _proto = Reaction2.prototype;
  _proto.onBecomeStale_ = function onBecomeStale_() {
    this.schedule_();
  };
  _proto.schedule_ = function schedule_() {
    if (!this.isScheduled) {
      this.isScheduled = true;
      globalState.pendingReactions.push(this);
      runReactions();
    }
  };
  _proto.runReaction_ = function runReaction_() {
    if (!this.isDisposed) {
      startBatch();
      this.isScheduled = false;
      var prev = globalState.trackingContext;
      globalState.trackingContext = this;
      if (shouldCompute(this)) {
        this.isTrackPending = true;
        try {
          this.onInvalidate_();
          if (false) {
            spyReport({
              name: this.name_,
              type: "scheduled-reaction"
            });
          }
        } catch (e) {
          this.reportExceptionInDerivation_(e);
        }
      }
      globalState.trackingContext = prev;
      endBatch();
    }
  };
  _proto.track = function track(fn) {
    if (this.isDisposed) {
      return;
    }
    startBatch();
    var notify = isSpyEnabled();
    var startTime;
    if (false) {
      startTime = Date.now();
      spyReportStart({
        name: this.name_,
        type: "reaction"
      });
    }
    this.isRunning = true;
    var prevReaction = globalState.trackingContext;
    globalState.trackingContext = this;
    var result = trackDerivedFunction(this, fn, void 0);
    globalState.trackingContext = prevReaction;
    this.isRunning = false;
    this.isTrackPending = false;
    if (this.isDisposed) {
      clearObserving(this);
    }
    if (isCaughtException(result)) {
      this.reportExceptionInDerivation_(result.cause);
    }
    if (false) {
      spyReportEnd({
        time: Date.now() - startTime
      });
    }
    endBatch();
  };
  _proto.reportExceptionInDerivation_ = function reportExceptionInDerivation_(error) {
    var _this = this;
    if (this.errorHandler_) {
      this.errorHandler_(error, this);
      return;
    }
    if (globalState.disableErrorBoundaries) {
      throw error;
    }
    var message = false ? "[mobx] Encountered an uncaught exception that was thrown by a reaction or observer component, in: '" + this + "'" : "[mobx] uncaught error in '" + this + "'";
    if (!globalState.suppressReactionErrors) {
      console.error(message, error);
    } else if (false) {
      console.warn("[mobx] (error in reaction '" + this.name_ + "' suppressed, fix error of causing action below)");
    }
    if (false) {
      spyReport({
        type: "error",
        name: this.name_,
        message,
        error: "" + error
      });
    }
    globalState.globalReactionErrorHandlers.forEach(function(f) {
      return f(error, _this);
    });
  };
  _proto.dispose = function dispose() {
    if (!this.isDisposed) {
      this.isDisposed = true;
      if (!this.isRunning) {
        startBatch();
        clearObserving(this);
        endBatch();
      }
    }
  };
  _proto.getDisposer_ = function getDisposer_(abortSignal) {
    var _this2 = this;
    var dispose = function dispose2() {
      _this2.dispose();
      abortSignal == null || abortSignal.removeEventListener == null || abortSignal.removeEventListener("abort", dispose2);
    };
    abortSignal == null || abortSignal.addEventListener == null || abortSignal.addEventListener("abort", dispose);
    dispose[$mobx] = this;
    if ("dispose" in Symbol && typeof Symbol.dispose === "symbol") {
      dispose[Symbol.dispose] = dispose;
    }
    return dispose;
  };
  _proto.toString = function toString2() {
    return "Reaction[" + this.name_ + "]";
  };
  _proto.trace = function trace$1(enterBreakPoint) {
    if (enterBreakPoint === void 0) {
      enterBreakPoint = false;
    }
    trace(this, enterBreakPoint);
  };
  return _createClass(Reaction2, [{
    key: "isDisposed",
    get: function get3() {
      return getFlag(this.flags_, Reaction2.isDisposedMask_);
    },
    set: function set4(newValue) {
      this.flags_ = setFlag(this.flags_, Reaction2.isDisposedMask_, newValue);
    }
  }, {
    key: "isScheduled",
    get: function get3() {
      return getFlag(this.flags_, Reaction2.isScheduledMask_);
    },
    set: function set4(newValue) {
      this.flags_ = setFlag(this.flags_, Reaction2.isScheduledMask_, newValue);
    }
  }, {
    key: "isTrackPending",
    get: function get3() {
      return getFlag(this.flags_, Reaction2.isTrackPendingMask_);
    },
    set: function set4(newValue) {
      this.flags_ = setFlag(this.flags_, Reaction2.isTrackPendingMask_, newValue);
    }
  }, {
    key: "isRunning",
    get: function get3() {
      return getFlag(this.flags_, Reaction2.isRunningMask_);
    },
    set: function set4(newValue) {
      this.flags_ = setFlag(this.flags_, Reaction2.isRunningMask_, newValue);
    }
  }, {
    key: "diffValue",
    get: function get3() {
      return getFlag(this.flags_, Reaction2.diffValueMask_) ? 1 : 0;
    },
    set: function set4(newValue) {
      this.flags_ = setFlag(this.flags_, Reaction2.diffValueMask_, newValue === 1 ? true : false);
    }
  }]);
})();
Reaction.isDisposedMask_ = 1;
Reaction.isScheduledMask_ = 2;
Reaction.isTrackPendingMask_ = 4;
Reaction.isRunningMask_ = 8;
Reaction.diffValueMask_ = 16;
var MAX_REACTION_ITERATIONS = 100;
var reactionScheduler = function reactionScheduler2(f) {
  return f();
};
function runReactions() {
  if (globalState.inBatch > 0 || globalState.isRunningReactions) {
    return;
  }
  reactionScheduler(runReactionsHelper);
}
function runReactionsHelper() {
  globalState.isRunningReactions = true;
  var allReactions = globalState.pendingReactions;
  var iterations = 0;
  while (allReactions.length > 0) {
    if (++iterations === MAX_REACTION_ITERATIONS) {
      console.error(false ? "Reaction doesn't converge to a stable state after " + MAX_REACTION_ITERATIONS + " iterations." + (" Probably there is a cycle in the reactive function: " + allReactions[0]) : "[mobx] cycle in reaction: " + allReactions[0]);
      allReactions.splice(0);
    }
    var remainingReactions = allReactions.splice(0);
    for (var i = 0, l = remainingReactions.length; i < l; i++) {
      remainingReactions[i].runReaction_();
    }
  }
  globalState.isRunningReactions = false;
}
var isReaction = /* @__PURE__ */ createInstanceofPredicate("Reaction", Reaction);
function setReactionScheduler(fn) {
  var baseScheduler = reactionScheduler;
  reactionScheduler = function reactionScheduler3(f) {
    return fn(function() {
      return baseScheduler(f);
    });
  };
}
function isSpyEnabled() {
  return false;
}
function spy(listener) {
  if (true) {
    console.warn("[mobx.spy] Is a no-op in production builds");
    return function() {
    };
  } else {
    globalState.spyListeners.push(listener);
    return once(function() {
      globalState.spyListeners = globalState.spyListeners.filter(function(l) {
        return l !== listener;
      });
    });
  }
}
var ACTION = "action";
var ACTION_BOUND = "action.bound";
var AUTOACTION = "autoAction";
var AUTOACTION_BOUND = "autoAction.bound";
var DEFAULT_ACTION_NAME = "<unnamed action>";
var actionAnnotation = /* @__PURE__ */ createActionAnnotation(ACTION);
var actionBoundAnnotation = /* @__PURE__ */ createActionAnnotation(ACTION_BOUND, {
  bound: true
});
var autoActionAnnotation = /* @__PURE__ */ createActionAnnotation(AUTOACTION, {
  autoAction: true
});
var autoActionBoundAnnotation = /* @__PURE__ */ createActionAnnotation(AUTOACTION_BOUND, {
  autoAction: true,
  bound: true
});
function createActionFactory(autoAction2) {
  var res = function action2(arg1, arg2) {
    if (isFunction(arg1)) {
      return createAction(arg1.name || DEFAULT_ACTION_NAME, arg1, autoAction2);
    }
    if (isFunction(arg2)) {
      return createAction(arg1, arg2, autoAction2);
    }
    if (is20223Decorator(arg2)) {
      return (autoAction2 ? autoActionAnnotation : actionAnnotation).decorate_20223_(arg1, arg2);
    }
    if (isStringish(arg2)) {
      return storeAnnotation(arg1, arg2, autoAction2 ? autoActionAnnotation : actionAnnotation);
    }
    if (isStringish(arg1)) {
      return createDecoratorAnnotation(createActionAnnotation(autoAction2 ? AUTOACTION : ACTION, {
        name: arg1,
        autoAction: autoAction2
      }));
    }
    if (false) {
      die("Invalid arguments for `action`");
    }
  };
  return res;
}
var action = /* @__PURE__ */ createActionFactory(false);
Object.assign(action, actionAnnotation);
var autoAction = /* @__PURE__ */ createActionFactory(true);
Object.assign(autoAction, autoActionAnnotation);
action.bound = /* @__PURE__ */ createDecoratorAnnotation(actionBoundAnnotation);
autoAction.bound = /* @__PURE__ */ createDecoratorAnnotation(autoActionBoundAnnotation);
function runInAction(fn) {
  return executeAction(fn.name || DEFAULT_ACTION_NAME, false, fn, this, void 0);
}
function isAction(thing) {
  return isFunction(thing) && thing.isMobxAction === true;
}
function autorun(view, opts) {
  var _opts$name, _opts, _opts2, _opts3;
  if (opts === void 0) {
    opts = EMPTY_OBJECT;
  }
  if (false) {
    if (!isFunction(view)) {
      die("Autorun expects a function as first argument");
    }
    if (isAction(view)) {
      die("Autorun does not accept actions since actions are untrackable");
    }
  }
  var name = (_opts$name = (_opts = opts) == null ? void 0 : _opts.name) != null ? _opts$name : false ? view.name || "Autorun@" + getNextId() : "Autorun";
  var runSync = !opts.scheduler && !opts.delay;
  var reaction2;
  if (runSync) {
    reaction2 = new Reaction(name, function() {
      this.track(reactionRunner);
    }, opts.onError, opts.requiresObservable);
  } else {
    var scheduler = createSchedulerFromOptions(opts);
    var isScheduled = false;
    reaction2 = new Reaction(name, function() {
      if (!isScheduled) {
        isScheduled = true;
        scheduler(function() {
          isScheduled = false;
          if (!reaction2.isDisposed) {
            reaction2.track(reactionRunner);
          }
        });
      }
    }, opts.onError, opts.requiresObservable);
  }
  function reactionRunner() {
    view(reaction2);
  }
  if (!((_opts2 = opts) != null && (_opts2 = _opts2.signal) != null && _opts2.aborted)) {
    reaction2.schedule_();
  }
  return reaction2.getDisposer_((_opts3 = opts) == null ? void 0 : _opts3.signal);
}
var run = function run2(f) {
  return f();
};
function createSchedulerFromOptions(opts) {
  return opts.scheduler ? opts.scheduler : opts.delay ? function(f) {
    return setTimeout(f, opts.delay);
  } : run;
}
function reaction(expression, effect, opts) {
  var _opts$name2, _opts4, _opts5;
  if (opts === void 0) {
    opts = EMPTY_OBJECT;
  }
  if (false) {
    if (!isFunction(expression) || !isFunction(effect)) {
      die("First and second argument to reaction should be functions");
    }
    if (!isPlainObject(opts)) {
      die("Third argument of reactions should be an object");
    }
  }
  var name = (_opts$name2 = opts.name) != null ? _opts$name2 : false ? "Reaction@" + getNextId() : "Reaction";
  var effectAction = action(name, opts.onError ? wrapErrorHandler(opts.onError, effect) : effect);
  var runSync = !opts.scheduler && !opts.delay;
  var scheduler = createSchedulerFromOptions(opts);
  var firstTime = true;
  var isScheduled = false;
  var value;
  var equals = opts.compareStructural ? comparer.structural : opts.equals || comparer["default"];
  var r = new Reaction(name, function() {
    if (firstTime || runSync) {
      reactionRunner();
    } else if (!isScheduled) {
      isScheduled = true;
      scheduler(reactionRunner);
    }
  }, opts.onError, opts.requiresObservable);
  function reactionRunner() {
    isScheduled = false;
    if (r.isDisposed) {
      return;
    }
    var changed = false;
    var oldValue = value;
    r.track(function() {
      var nextValue = allowStateChanges(false, function() {
        return expression(r);
      });
      changed = firstTime || !equals(value, nextValue);
      value = nextValue;
    });
    if (firstTime && opts.fireImmediately) {
      effectAction(value, oldValue, r);
    } else if (!firstTime && changed) {
      effectAction(value, oldValue, r);
    }
    firstTime = false;
  }
  if (!((_opts4 = opts) != null && (_opts4 = _opts4.signal) != null && _opts4.aborted)) {
    r.schedule_();
  }
  return r.getDisposer_((_opts5 = opts) == null ? void 0 : _opts5.signal);
}
function wrapErrorHandler(errorHandler, baseFn) {
  return function() {
    try {
      return baseFn.apply(this, arguments);
    } catch (e) {
      errorHandler.call(this, e);
    }
  };
}
var ON_BECOME_OBSERVED = "onBO";
var ON_BECOME_UNOBSERVED = "onBUO";
function onBecomeObserved(thing, arg2, arg3) {
  return interceptHook(ON_BECOME_OBSERVED, thing, arg2, arg3);
}
function onBecomeUnobserved(thing, arg2, arg3) {
  return interceptHook(ON_BECOME_UNOBSERVED, thing, arg2, arg3);
}
function interceptHook(hook, thing, arg2, arg3) {
  var atom = typeof arg3 === "function" ? getAtom(thing, arg2) : getAtom(thing);
  var cb = isFunction(arg3) ? arg3 : arg2;
  var listenersKey = hook + "L";
  if (atom[listenersKey]) {
    atom[listenersKey].add(cb);
  } else {
    atom[listenersKey] = /* @__PURE__ */ new Set([cb]);
  }
  return function() {
    var hookListeners = atom[listenersKey];
    if (hookListeners) {
      hookListeners["delete"](cb);
      if (hookListeners.size === 0) {
        delete atom[listenersKey];
      }
    }
  };
}
var NEVER = "never";
var ALWAYS = "always";
var OBSERVED = "observed";
function configure(options) {
  if (options.isolateGlobalState === true) {
    isolateGlobalState();
  }
  var useProxies = options.useProxies, enforceActions = options.enforceActions;
  if (useProxies !== void 0) {
    globalState.useProxies = useProxies === ALWAYS ? true : useProxies === NEVER ? false : typeof Proxy !== "undefined";
  }
  if (useProxies === "ifavailable") {
    globalState.verifyProxies = true;
  }
  if (enforceActions !== void 0) {
    var ea = enforceActions === ALWAYS ? ALWAYS : enforceActions === OBSERVED;
    globalState.enforceActions = ea;
    globalState.allowStateChanges = ea === true || ea === ALWAYS ? false : true;
  }
  ["computedRequiresReaction", "reactionRequiresObservable", "observableRequiresReaction", "disableErrorBoundaries", "safeDescriptors"].forEach(function(key2) {
    if (key2 in options) {
      globalState[key2] = !!options[key2];
    }
  });
  globalState.allowStateReads = !globalState.observableRequiresReaction;
  if (false) {
    console.warn("WARNING: Debug feature only. MobX will NOT recover from errors when `disableErrorBoundaries` is enabled.");
  }
  if (options.reactionScheduler) {
    setReactionScheduler(options.reactionScheduler);
  }
}
function extendObservable(target, properties, annotations, options) {
  if (false) {
    if (arguments.length > 4) {
      die("'extendObservable' expected 2-4 arguments");
    }
    if (typeof target !== "object") {
      die("'extendObservable' expects an object as first argument");
    }
    if (isObservableMap(target)) {
      die("'extendObservable' should not be used on maps, use map.merge instead");
    }
    if (!isPlainObject(properties)) {
      die("'extendObservable' only accepts plain objects as second argument");
    }
    if (isObservable(properties) || isObservable(annotations)) {
      die("Extending an object with another observable (object) is not supported");
    }
  }
  var descriptors = getOwnPropertyDescriptors(properties);
  initObservable(function() {
    var adm = asObservableObject(target, options)[$mobx];
    ownKeys(descriptors).forEach(function(key2) {
      adm.extend_(
        key2,
        descriptors[key2],
        // must pass "undefined" for { key: undefined }
        !annotations ? true : key2 in annotations ? annotations[key2] : true
      );
    });
  });
  return target;
}
function getDependencyTree(thing, property) {
  return nodeToDependencyTree(getAtom(thing, property));
}
function nodeToDependencyTree(node) {
  var result = {
    name: node.name_
  };
  if (node.observing_ && node.observing_.length > 0) {
    result.dependencies = unique(node.observing_).map(nodeToDependencyTree);
  }
  return result;
}
function unique(list) {
  return Array.from(new Set(list));
}
var generatorId = 0;
var FlowCancellationError = /* @__PURE__ */ (function(_Error) {
  function FlowCancellationError2() {
    var _this;
    _this = _Error.call(this, "FLOW_CANCELLED") || this;
    Object.setPrototypeOf(_this, (this instanceof FlowCancellationError2 ? this.constructor : void 0).prototype);
    _this.name = "FlowCancellationError";
    return _this;
  }
  _inheritsLoose(FlowCancellationError2, _Error);
  var _proto = FlowCancellationError2.prototype;
  _proto.toString = function toString2() {
    return "Error: " + this.message;
  };
  return FlowCancellationError2;
})(/* @__PURE__ */ _wrapNativeSuper(Error));
var flowAnnotation = /* @__PURE__ */ createFlowAnnotation("flow");
var flowBoundAnnotation = /* @__PURE__ */ createFlowAnnotation("flow.bound", {
  bound: true
});
var flow = /* @__PURE__ */ Object.assign(function flow2(arg1, arg2) {
  if (is20223Decorator(arg2)) {
    return flowAnnotation.decorate_20223_(arg1, arg2);
  }
  if (isStringish(arg2)) {
    return storeAnnotation(arg1, arg2, flowAnnotation);
  }
  if (false) {
    die("Flow expects single argument with generator function");
  }
  var generator = arg1;
  var name = generator.name || "<unnamed flow>";
  var res = function res2() {
    var ctx = this;
    var args = arguments;
    var runId = ++generatorId;
    var gen = action(name + " - runid: " + runId + " - init", generator).apply(ctx, args);
    var rejector;
    var pendingPromise = void 0;
    var promise = new Promise(function(resolve, reject) {
      var stepId = 0;
      rejector = reject;
      function onFulfilled(res3) {
        pendingPromise = void 0;
        var ret;
        try {
          ret = action(name + " - runid: " + runId + " - yield " + stepId++, gen.next).call(gen, res3);
        } catch (e) {
          return reject(e);
        }
        next(ret);
      }
      function onRejected(err) {
        pendingPromise = void 0;
        var ret;
        try {
          ret = action(name + " - runid: " + runId + " - yield " + stepId++, gen["throw"]).call(gen, err);
        } catch (e) {
          return reject(e);
        }
        next(ret);
      }
      function next(ret) {
        if (isFunction(ret == null ? void 0 : ret.then)) {
          ret.then(next, reject);
          return;
        }
        if (ret.done) {
          return resolve(ret.value);
        }
        pendingPromise = Promise.resolve(ret.value);
        return pendingPromise.then(onFulfilled, onRejected);
      }
      onFulfilled(void 0);
    });
    promise.cancel = action(name + " - runid: " + runId + " - cancel", function() {
      try {
        if (pendingPromise) {
          cancelPromise(pendingPromise);
        }
        var _res = gen["return"](void 0);
        var yieldedPromise = Promise.resolve(_res.value);
        yieldedPromise.then(noop, noop);
        cancelPromise(yieldedPromise);
        rejector(new FlowCancellationError());
      } catch (e) {
        rejector(e);
      }
    });
    return promise;
  };
  res.isMobXFlow = true;
  return res;
}, flowAnnotation);
flow.bound = /* @__PURE__ */ createDecoratorAnnotation(flowBoundAnnotation);
function cancelPromise(promise) {
  if (isFunction(promise.cancel)) {
    promise.cancel();
  }
}
function isFlow(fn) {
  return (fn == null ? void 0 : fn.isMobXFlow) === true;
}
function _isObservable(value, property) {
  if (!value) {
    return false;
  }
  if (property !== void 0) {
    if (false) {
      return die("isObservable(object, propertyName) is not supported for arrays and maps. Use map.has or array.length instead.");
    }
    if (isObservableObject(value)) {
      var _adm$lazyComputedKeys, _adm$lazyObservableKe;
      var adm = value[$mobx];
      return adm.values_.has(property) || !!((_adm$lazyComputedKeys = adm.lazyComputedKeys_) != null && _adm$lazyComputedKeys.has(property)) || !!((_adm$lazyObservableKe = adm.lazyObservableKeys_) != null && _adm$lazyObservableKe.has(property));
    }
    return false;
  }
  return isObservableObject(value) || !!value[$mobx] || isAtom(value) || isReaction(value) || isComputedValue(value);
}
function isObservable(value) {
  if (false) {
    die("isObservable expects only 1 argument. Use isObservableProp to inspect the observability of a property");
  }
  return _isObservable(value);
}
function trace() {
  if (true) {
    return;
  }
  var enterBreakPoint = false;
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }
  if (typeof args[args.length - 1] === "boolean") {
    enterBreakPoint = args.pop();
  }
  var derivation = getAtomFromArgs(args);
  if (!derivation) {
    return die("'trace(break?)' can only be used inside a tracked computed value or a Reaction. Consider passing in the computed value or reaction explicitly");
  }
  if (derivation.isTracing_ === TraceMode.NONE) {
    console.log("[mobx.trace] '" + derivation.name_ + "' tracing enabled");
  }
  derivation.isTracing_ = enterBreakPoint ? TraceMode.BREAK : TraceMode.LOG;
}
function getAtomFromArgs(args) {
  switch (args.length) {
    case 0:
      return globalState.trackingDerivation;
    case 1:
      return getAtom(args[0]);
    case 2:
      return getAtom(args[0], args[1]);
  }
}
function transaction(action2, thisArg) {
  if (thisArg === void 0) {
    thisArg = void 0;
  }
  startBatch();
  try {
    return action2.apply(thisArg);
  } finally {
    endBatch();
  }
}
function getAdm(target) {
  return target[$mobx];
}
var objectProxyTraps = {
  has: function has(target, name) {
    if (false) {
      warnAboutProxyRequirement("detect new properties using the 'in' operator. Use 'has' from 'mobx' instead.");
    }
    return getAdm(target).has_(name);
  },
  get: function get(target, name) {
    return getAdm(target).get_(name);
  },
  set: function set2(target, name, value) {
    var _getAdm$set_;
    if (!isStringish(name)) {
      return false;
    }
    if (false) {
      warnAboutProxyRequirement("add a new observable property through direct assignment. Use 'set' from 'mobx' instead.");
    }
    return (_getAdm$set_ = getAdm(target).set_(name, value, true)) != null ? _getAdm$set_ : true;
  },
  deleteProperty: function deleteProperty(target, name) {
    var _getAdm$delete_;
    if (false) {
      warnAboutProxyRequirement("delete properties from an observable object. Use 'remove' from 'mobx' instead.");
    }
    if (!isStringish(name)) {
      return false;
    }
    return (_getAdm$delete_ = getAdm(target).delete_(name, true)) != null ? _getAdm$delete_ : true;
  },
  defineProperty: function defineProperty2(target, name, descriptor) {
    var _getAdm$definePropert;
    if (false) {
      warnAboutProxyRequirement("define property on an observable object. Use 'defineProperty' from 'mobx' instead.");
    }
    return (_getAdm$definePropert = getAdm(target).defineProperty_(name, descriptor)) != null ? _getAdm$definePropert : true;
  },
  ownKeys: function ownKeys2(target) {
    if (false) {
      warnAboutProxyRequirement("iterate keys to detect added / removed properties. Use 'keys' from 'mobx' instead.");
    }
    return getAdm(target).ownKeys_();
  },
  preventExtensions: function preventExtensions(target) {
    die(13);
  }
};
function asDynamicObservableObject(target, options) {
  var _target$$mobx, _target$$mobx$proxy_;
  assertProxies();
  target = asObservableObject(target, options);
  return (_target$$mobx$proxy_ = (_target$$mobx = target[$mobx]).proxy_) != null ? _target$$mobx$proxy_ : _target$$mobx.proxy_ = new Proxy(target, objectProxyTraps);
}
function hasInterceptors(interceptable) {
  return interceptable.interceptors_ !== void 0 && interceptable.interceptors_.length > 0;
}
function registerInterceptor(interceptable, handler) {
  var interceptors = interceptable.interceptors_ || (interceptable.interceptors_ = []);
  interceptors.push(handler);
  return once(function() {
    var idx = interceptors.indexOf(handler);
    if (idx !== -1) {
      interceptors.splice(idx, 1);
    }
  });
}
function interceptChange(interceptable, change) {
  var prevU = untrackedStart();
  try {
    var interceptors = [].concat(interceptable.interceptors_ || []);
    for (var i = 0, l = interceptors.length; i < l; i++) {
      change = interceptors[i](change);
      if (change && !change.type) {
        die(14);
      }
      if (!change) {
        break;
      }
    }
    return change;
  } finally {
    untrackedEnd(prevU);
  }
}
function hasListeners(listenable) {
  return listenable.changeListeners_ !== void 0 && listenable.changeListeners_.length > 0;
}
function registerListener(listenable, handler) {
  var listeners = listenable.changeListeners_ || (listenable.changeListeners_ = []);
  listeners.push(handler);
  return once(function() {
    var idx = listeners.indexOf(handler);
    if (idx !== -1) {
      listeners.splice(idx, 1);
    }
  });
}
function notifyListeners(listenable, change) {
  var prevU = untrackedStart();
  var listeners = listenable.changeListeners_;
  if (!listeners) {
    return;
  }
  listeners = listeners.slice();
  for (var i = 0, l = listeners.length; i < l; i++) {
    listeners[i](change);
  }
  untrackedEnd(prevU);
}
function makeObservable(target, annotations, options) {
  initObservable(function() {
    var _annotations;
    var adm = asObservableObject(target, options)[$mobx];
    if (false) {
      die("makeObservable second arg must be nullish when using decorators. Mixing @decorator syntax with annotations is not supported.");
    }
    (_annotations = annotations) != null ? _annotations : annotations = collectStoredAnnotations(target);
    ownKeys(annotations).forEach(function(key2) {
      return adm.make_(key2, annotations[key2]);
    });
  });
  return target;
}
var keysSymbol = /* @__PURE__ */ Symbol("mobx-keys");
function makeAutoObservable(target, overrides, options) {
  if (false) {
    if (!isPlainObject(target) && !isPlainObject(Object.getPrototypeOf(target))) {
      die("'makeAutoObservable' can only be used for classes that don't have a superclass");
    }
    if (isObservableObject(target)) {
      die("makeAutoObservable can only be used on objects not already made observable");
    }
  }
  if (isPlainObject(target)) {
    return extendObservable(target, target, overrides, options);
  }
  initObservable(function() {
    var adm = asObservableObject(target, options)[$mobx];
    if (!target[keysSymbol]) {
      var proto = Object.getPrototypeOf(target);
      var keys = new Set([].concat(ownKeys(target), ownKeys(proto)));
      keys["delete"]("constructor");
      keys["delete"]($mobx);
      addHiddenProp(proto, keysSymbol, keys);
    }
    target[keysSymbol].forEach(function(key2) {
      return adm.make_(
        key2,
        // must pass "undefined" for { key: undefined }
        !overrides ? true : key2 in overrides ? overrides[key2] : true
      );
    });
  });
  return target;
}
var SPLICE = "splice";
var UPDATE = "update";
var MAX_SPLICE_SIZE = 1e4;
var arrayTraps = {
  get: function get2(target, name) {
    var adm = target[$mobx];
    if (name === $mobx) {
      return adm;
    }
    if (name === "length") {
      return adm.getArrayLength_();
    }
    if (typeof name === "string" && !isNaN(name)) {
      return adm.get_(parseInt(name));
    }
    if (hasProp(arrayExtensions, name)) {
      return arrayExtensions[name];
    }
    return target[name];
  },
  set: function set3(target, name, value) {
    var adm = target[$mobx];
    if (name === "length") {
      adm.setArrayLength_(value);
    }
    if (typeof name === "symbol" || isNaN(name)) {
      target[name] = value;
    } else {
      adm.set_(parseInt(name), value);
    }
    return true;
  },
  preventExtensions: function preventExtensions2() {
    die(15);
  }
};
var ObservableArrayAdministration = /* @__PURE__ */ (function() {
  function ObservableArrayAdministration2(name, enhancer, owned_, legacyMode_) {
    if (name === void 0) {
      name = false ? "ObservableArray@" + getNextId() : "ObservableArray";
    }
    this.owned_ = void 0;
    this.legacyMode_ = void 0;
    this.atom_ = void 0;
    this.values_ = [];
    this.interceptors_ = void 0;
    this.changeListeners_ = void 0;
    this.enhancer_ = void 0;
    this.dehancer = void 0;
    this.proxy_ = void 0;
    this.lastKnownLength_ = 0;
    this.owned_ = owned_;
    this.legacyMode_ = legacyMode_;
    this.atom_ = new Atom(name);
    this.enhancer_ = function(newV, oldV) {
      return enhancer(newV, oldV, false ? name + "[..]" : "ObservableArray[..]");
    };
  }
  var _proto = ObservableArrayAdministration2.prototype;
  _proto.dehanceValue_ = function dehanceValue_(value) {
    if (this.dehancer !== void 0) {
      return this.dehancer(value);
    }
    return value;
  };
  _proto.dehanceValues_ = function dehanceValues_(values) {
    if (this.dehancer !== void 0 && values.length > 0) {
      return values.map(this.dehancer);
    }
    return values;
  };
  _proto.intercept_ = function intercept_(handler) {
    return registerInterceptor(this, handler);
  };
  _proto.observe_ = function observe_(listener, fireImmediately) {
    if (fireImmediately === void 0) {
      fireImmediately = false;
    }
    if (fireImmediately) {
      listener({
        observableKind: "array",
        object: this.proxy_,
        debugObjectName: this.atom_.name_,
        type: "splice",
        index: 0,
        added: this.values_.slice(),
        addedCount: this.values_.length,
        removed: [],
        removedCount: 0
      });
    }
    return registerListener(this, listener);
  };
  _proto.getArrayLength_ = function getArrayLength_() {
    this.atom_.reportObserved();
    return this.values_.length;
  };
  _proto.setArrayLength_ = function setArrayLength_(newLength) {
    if (typeof newLength !== "number" || isNaN(newLength) || newLength < 0) {
      die("Out of range: " + newLength);
    }
    var currentLength = this.values_.length;
    if (newLength === currentLength) {
      return;
    } else if (newLength > currentLength) {
      var newItems = new Array(newLength - currentLength);
      for (var i = 0; i < newLength - currentLength; i++) {
        newItems[i] = void 0;
      }
      this.spliceWithArray_(currentLength, 0, newItems);
    } else {
      this.spliceWithArray_(newLength, currentLength - newLength);
    }
  };
  _proto.updateArrayLength_ = function updateArrayLength_(oldLength, delta) {
    if (oldLength !== this.lastKnownLength_) {
      die(16);
    }
    this.lastKnownLength_ += delta;
    if (this.legacyMode_ && delta > 0) {
      reserveArrayBuffer(oldLength + delta + 1);
    }
  };
  _proto.spliceWithArray_ = function spliceWithArray_(index, deleteCount, newItems) {
    var _this = this;
    checkIfStateModificationsAreAllowed(this.atom_);
    var length = this.values_.length;
    if (index === void 0) {
      index = 0;
    } else if (index > length) {
      index = length;
    } else if (index < 0) {
      index = Math.max(0, length + index);
    }
    if (arguments.length === 1) {
      deleteCount = length - index;
    } else if (deleteCount === void 0 || deleteCount === null) {
      deleteCount = 0;
    } else {
      deleteCount = Math.max(0, Math.min(deleteCount, length - index));
    }
    if (newItems === void 0) {
      newItems = EMPTY_ARRAY;
    }
    if (hasInterceptors(this)) {
      var change = interceptChange(this, {
        object: this.proxy_,
        type: SPLICE,
        index,
        removedCount: deleteCount,
        added: newItems
      });
      if (!change) {
        return EMPTY_ARRAY;
      }
      deleteCount = change.removedCount;
      newItems = change.added;
    }
    newItems = newItems.length === 0 ? newItems : newItems.map(function(v) {
      return _this.enhancer_(v, void 0);
    });
    if (this.legacyMode_ || false) {
      var lengthDelta = newItems.length - deleteCount;
      this.updateArrayLength_(length, lengthDelta);
    }
    var res = this.spliceItemsIntoValues_(index, deleteCount, newItems);
    if (deleteCount !== 0 || newItems.length !== 0) {
      this.notifyArraySplice_(index, newItems, res);
    }
    return this.dehanceValues_(res);
  };
  _proto.spliceItemsIntoValues_ = function spliceItemsIntoValues_(index, deleteCount, newItems) {
    if (newItems.length < MAX_SPLICE_SIZE) {
      var _this$values_;
      return (_this$values_ = this.values_).splice.apply(_this$values_, [index, deleteCount].concat(newItems));
    } else {
      var res = this.values_.slice(index, index + deleteCount);
      var oldItems = this.values_.slice(index + deleteCount);
      this.values_.length += newItems.length - deleteCount;
      for (var i = 0; i < newItems.length; i++) {
        this.values_[index + i] = newItems[i];
      }
      for (var _i = 0; _i < oldItems.length; _i++) {
        this.values_[index + newItems.length + _i] = oldItems[_i];
      }
      return res;
    }
  };
  _proto.notifyArrayChildUpdate_ = function notifyArrayChildUpdate_(index, newValue, oldValue) {
    var notifySpy = !this.owned_ && isSpyEnabled();
    var notify = hasListeners(this);
    var change = notify || notifySpy ? {
      observableKind: "array",
      object: this.proxy_,
      type: UPDATE,
      debugObjectName: this.atom_.name_,
      index,
      newValue,
      oldValue
    } : null;
    if (false) {
      spyReportStart(change);
    }
    this.atom_.reportChanged();
    if (notify) {
      notifyListeners(this, change);
    }
    if (false) {
      spyReportEnd();
    }
  };
  _proto.notifyArraySplice_ = function notifyArraySplice_(index, added, removed) {
    var notifySpy = !this.owned_ && isSpyEnabled();
    var notify = hasListeners(this);
    var change = notify || notifySpy ? {
      observableKind: "array",
      object: this.proxy_,
      debugObjectName: this.atom_.name_,
      type: SPLICE,
      index,
      removed,
      added,
      removedCount: removed.length,
      addedCount: added.length
    } : null;
    if (false) {
      spyReportStart(change);
    }
    this.atom_.reportChanged();
    if (notify) {
      notifyListeners(this, change);
    }
    if (false) {
      spyReportEnd();
    }
  };
  _proto.get_ = function get_(index) {
    if (this.legacyMode_ && index >= this.values_.length) {
      console.warn(false ? "[mobx.array] Attempt to read an array index (" + index + ") that is out of bounds (" + this.values_.length + "). Please check length first. Out of bound indices will not be tracked by MobX" : "[mobx] Out of bounds read: " + index);
      return void 0;
    }
    this.atom_.reportObserved();
    return this.dehanceValue_(this.values_[index]);
  };
  _proto.set_ = function set_(index, newValue) {
    var values = this.values_;
    if (this.legacyMode_ && index > values.length) {
      die(17, index, values.length);
    }
    if (index < values.length) {
      checkIfStateModificationsAreAllowed(this.atom_);
      var oldValue = values[index];
      if (hasInterceptors(this)) {
        var change = interceptChange(this, {
          type: UPDATE,
          object: this.proxy_,
          // since "this" is the real array we need to pass its proxy
          index,
          newValue
        });
        if (!change) {
          return;
        }
        newValue = change.newValue;
      }
      newValue = this.enhancer_(newValue, oldValue);
      var changed = newValue !== oldValue;
      if (changed) {
        values[index] = newValue;
        this.notifyArrayChildUpdate_(index, newValue, oldValue);
      }
    } else {
      var newItems = new Array(index + 1 - values.length);
      for (var i = 0; i < newItems.length - 1; i++) {
        newItems[i] = void 0;
      }
      newItems[newItems.length - 1] = newValue;
      this.spliceWithArray_(values.length, 0, newItems);
    }
  };
  return ObservableArrayAdministration2;
})();
function createObservableArray(initialValues, enhancer, name, owned) {
  if (name === void 0) {
    name = false ? "ObservableArray@" + getNextId() : "ObservableArray";
  }
  if (owned === void 0) {
    owned = false;
  }
  assertProxies();
  return initObservable(function() {
    var adm = new ObservableArrayAdministration(name, enhancer, owned, false);
    addHiddenFinalProp(adm.values_, $mobx, adm);
    var proxy = new Proxy(adm.values_, arrayTraps);
    adm.proxy_ = proxy;
    if (initialValues && initialValues.length) {
      adm.spliceWithArray_(0, 0, initialValues);
    }
    return proxy;
  });
}
var arrayExtensions = {
  clear: function clear() {
    return this.splice(0);
  },
  replace: function replace(newItems) {
    var adm = this[$mobx];
    return adm.spliceWithArray_(0, adm.values_.length, newItems);
  },
  // Used by JSON.stringify
  toJSON: function toJSON() {
    return this.slice();
  },
  /*
   * functions that do alter the internal structure of the array, (based on lib.es6.d.ts)
   * since these functions alter the inner structure of the array, the have side effects.
   * Because the have side effects, they should not be used in computed function,
   * and for that reason the do not call dependencyState.notifyObserved
   */
  splice: function splice(index, deleteCount) {
    for (var _len = arguments.length, newItems = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      newItems[_key - 2] = arguments[_key];
    }
    var adm = this[$mobx];
    switch (arguments.length) {
      case 0:
        return [];
      case 1:
        return adm.spliceWithArray_(index);
      case 2:
        return adm.spliceWithArray_(index, deleteCount);
    }
    return adm.spliceWithArray_(index, deleteCount, newItems);
  },
  spliceWithArray: function spliceWithArray(index, deleteCount, newItems) {
    return this[$mobx].spliceWithArray_(index, deleteCount, newItems);
  },
  push: function push() {
    var adm = this[$mobx];
    for (var _len2 = arguments.length, items = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      items[_key2] = arguments[_key2];
    }
    adm.spliceWithArray_(adm.values_.length, 0, items);
    return adm.values_.length;
  },
  pop: function pop() {
    return this.splice(Math.max(this[$mobx].values_.length - 1, 0), 1)[0];
  },
  shift: function shift() {
    return this.splice(0, 1)[0];
  },
  unshift: function unshift() {
    var adm = this[$mobx];
    for (var _len3 = arguments.length, items = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      items[_key3] = arguments[_key3];
    }
    adm.spliceWithArray_(0, 0, items);
    return adm.values_.length;
  },
  reverse: function reverse() {
    if (globalState.trackingDerivation) {
      die(37, "reverse");
    }
    this.replace(this.slice().reverse());
    return this;
  },
  sort: function sort() {
    if (globalState.trackingDerivation) {
      die(37, "sort");
    }
    var copy = this.slice();
    copy.sort.apply(copy, arguments);
    this.replace(copy);
    return this;
  },
  remove: function remove(value) {
    var adm = this[$mobx];
    var idx = adm.dehanceValues_(adm.values_).indexOf(value);
    if (idx > -1) {
      this.splice(idx, 1);
      return true;
    }
    return false;
  }
};
addArrayExtension("at", simpleFunc);
addArrayExtension("concat", simpleFunc);
addArrayExtension("flat", simpleFunc);
addArrayExtension("includes", simpleFunc);
addArrayExtension("indexOf", simpleFunc);
addArrayExtension("join", simpleFunc);
addArrayExtension("lastIndexOf", simpleFunc);
addArrayExtension("slice", simpleFunc);
addArrayExtension("toString", simpleFunc);
addArrayExtension("toLocaleString", simpleFunc);
addArrayExtension("toSorted", simpleFunc);
addArrayExtension("toSpliced", simpleFunc);
addArrayExtension("with", simpleFunc);
addArrayExtension("every", mapLikeFunc);
addArrayExtension("filter", mapLikeFunc);
addArrayExtension("find", mapLikeFunc);
addArrayExtension("findIndex", mapLikeFunc);
addArrayExtension("findLast", mapLikeFunc);
addArrayExtension("findLastIndex", mapLikeFunc);
addArrayExtension("flatMap", mapLikeFunc);
addArrayExtension("forEach", mapLikeFunc);
addArrayExtension("map", mapLikeFunc);
addArrayExtension("some", mapLikeFunc);
addArrayExtension("toReversed", mapLikeFunc);
addArrayExtension("reduce", reduceLikeFunc);
addArrayExtension("reduceRight", reduceLikeFunc);
function addArrayExtension(funcName, funcFactory) {
  if (typeof Array.prototype[funcName] === "function") {
    arrayExtensions[funcName] = funcFactory(funcName);
  }
}
function simpleFunc(funcName) {
  return function() {
    var adm = this[$mobx];
    adm.atom_.reportObserved();
    var dehancedValues = adm.dehanceValues_(adm.values_);
    return dehancedValues[funcName].apply(dehancedValues, arguments);
  };
}
function mapLikeFunc(funcName) {
  return function(callback, thisArg) {
    var _this2 = this;
    var adm = this[$mobx];
    adm.atom_.reportObserved();
    var dehancedValues = adm.dehanceValues_(adm.values_);
    return dehancedValues[funcName](function(element, index) {
      return callback.call(thisArg, element, index, _this2);
    });
  };
}
function reduceLikeFunc(funcName) {
  return function() {
    var _this3 = this;
    var adm = this[$mobx];
    adm.atom_.reportObserved();
    var dehancedValues = adm.dehanceValues_(adm.values_);
    var callback = arguments[0];
    arguments[0] = function(accumulator, currentValue, index) {
      return callback(accumulator, currentValue, index, _this3);
    };
    return dehancedValues[funcName].apply(dehancedValues, arguments);
  };
}
var isObservableArrayAdministration = /* @__PURE__ */ createInstanceofPredicate("ObservableArrayAdministration", ObservableArrayAdministration);
function isObservableArray(thing) {
  return isObject(thing) && isObservableArrayAdministration(thing[$mobx]);
}
var ObservableMapMarker = {};
var ADD = "add";
var DELETE = "delete";
var ObservableMap = /* @__PURE__ */ (function() {
  function ObservableMap2(initialData, enhancer_, name_) {
    var _this = this;
    if (enhancer_ === void 0) {
      enhancer_ = deepEnhancer;
    }
    if (name_ === void 0) {
      name_ = false ? "ObservableMap@" + getNextId() : "ObservableMap";
    }
    this.enhancer_ = void 0;
    this.name_ = void 0;
    this[$mobx] = ObservableMapMarker;
    this.data_ = void 0;
    this.hasMap_ = void 0;
    this.keysAtom_ = void 0;
    this.interceptors_ = void 0;
    this.changeListeners_ = void 0;
    this.dehancer = void 0;
    this.enhancer_ = enhancer_;
    this.name_ = name_;
    if (!isFunction(Map)) {
      die(18);
    }
    initObservable(function() {
      _this.keysAtom_ = createAtom(false ? _this.name_ + ".keys()" : "ObservableMap.keys()");
      _this.data_ = /* @__PURE__ */ new Map();
      _this.hasMap_ = /* @__PURE__ */ new Map();
      if (initialData) {
        _this.merge(initialData);
      }
    });
  }
  var _proto = ObservableMap2.prototype;
  _proto.has_ = function has_(key2) {
    return this.data_.has(key2);
  };
  _proto.has = function has2(key2) {
    var _this2 = this;
    if (!globalState.trackingDerivation) {
      return this.has_(key2);
    }
    var entry = this.hasMap_.get(key2);
    if (!entry) {
      var newEntry = entry = new ObservableValue(this.has_(key2), referenceEnhancer, false ? this.name_ + "." + stringifyKey(key2) + "?" : "ObservableMap.key?", false);
      this.hasMap_.set(key2, newEntry);
      onBecomeUnobserved(newEntry, function() {
        return _this2.hasMap_["delete"](key2);
      });
    }
    return entry.get();
  };
  _proto.set = function set4(key2, value) {
    var hasKey = this.has_(key2);
    if (hasInterceptors(this)) {
      var change = interceptChange(this, {
        type: hasKey ? UPDATE : ADD,
        object: this,
        newValue: value,
        name: key2
      });
      if (!change) {
        return this;
      }
      value = change.newValue;
    }
    if (hasKey) {
      this.updateValue_(key2, value);
    } else {
      this.addValue_(key2, value);
    }
    return this;
  };
  _proto["delete"] = function _delete(key2) {
    var _this3 = this;
    checkIfStateModificationsAreAllowed(this.keysAtom_);
    if (hasInterceptors(this)) {
      var change = interceptChange(this, {
        type: DELETE,
        object: this,
        name: key2
      });
      if (!change) {
        return false;
      }
    }
    if (this.has_(key2)) {
      var notifySpy = isSpyEnabled();
      var notify = hasListeners(this);
      var _change = notify || notifySpy ? {
        observableKind: "map",
        debugObjectName: this.name_,
        type: DELETE,
        object: this,
        oldValue: this.data_.get(key2).value_,
        name: key2
      } : null;
      if (false) {
        spyReportStart(_change);
      }
      transaction(function() {
        var _this3$hasMap_$get;
        _this3.keysAtom_.reportChanged();
        (_this3$hasMap_$get = _this3.hasMap_.get(key2)) == null || _this3$hasMap_$get.setNewValue_(false);
        var observable2 = _this3.data_.get(key2);
        observable2.setNewValue_(void 0);
        _this3.data_["delete"](key2);
      });
      if (notify) {
        notifyListeners(this, _change);
      }
      if (false) {
        spyReportEnd();
      }
      return true;
    }
    return false;
  };
  _proto.updateValue_ = function updateValue_(key2, newValue) {
    var observable2 = this.data_.get(key2);
    newValue = observable2.prepareNewValue_(newValue);
    if (newValue !== globalState.UNCHANGED) {
      var notifySpy = isSpyEnabled();
      var notify = hasListeners(this);
      var change = notify || notifySpy ? {
        observableKind: "map",
        debugObjectName: this.name_,
        type: UPDATE,
        object: this,
        oldValue: observable2.value_,
        name: key2,
        newValue
      } : null;
      if (false) {
        spyReportStart(change);
      }
      observable2.setNewValue_(newValue);
      if (notify) {
        notifyListeners(this, change);
      }
      if (false) {
        spyReportEnd();
      }
    }
  };
  _proto.addValue_ = function addValue_(key2, newValue) {
    var _this4 = this;
    checkIfStateModificationsAreAllowed(this.keysAtom_);
    transaction(function() {
      var _this4$hasMap_$get;
      var observable2 = new ObservableValue(newValue, _this4.enhancer_, false ? _this4.name_ + "." + stringifyKey(key2) : "ObservableMap.key", false);
      _this4.data_.set(key2, observable2);
      newValue = observable2.value_;
      (_this4$hasMap_$get = _this4.hasMap_.get(key2)) == null || _this4$hasMap_$get.setNewValue_(true);
      _this4.keysAtom_.reportChanged();
    });
    var notifySpy = isSpyEnabled();
    var notify = hasListeners(this);
    var change = notify || notifySpy ? {
      observableKind: "map",
      debugObjectName: this.name_,
      type: ADD,
      object: this,
      name: key2,
      newValue
    } : null;
    if (false) {
      spyReportStart(change);
    }
    if (notify) {
      notifyListeners(this, change);
    }
    if (false) {
      spyReportEnd();
    }
  };
  _proto.get = function get3(key2) {
    if (this.has(key2)) {
      return this.dehanceValue_(this.data_.get(key2).get());
    }
    return this.dehanceValue_(void 0);
  };
  _proto.getOrInsert = function getOrInsert(key2, value) {
    if (!this.has(key2)) {
      this.set(key2, value);
    }
    return this.get(key2);
  };
  _proto.getOrInsertComputed = function getOrInsertComputed(key2, callback) {
    if (!this.has(key2)) {
      this.set(key2, callback(key2));
    }
    return this.get(key2);
  };
  _proto.dehanceValue_ = function dehanceValue_(value) {
    if (this.dehancer !== void 0) {
      return this.dehancer(value);
    }
    return value;
  };
  _proto.keys = function keys() {
    this.keysAtom_.reportObserved();
    return this.data_.keys();
  };
  _proto.values = function values() {
    var self2 = this;
    var keys = this.keys();
    return makeIterableForMap({
      next: function next() {
        var _keys$next = keys.next(), done = _keys$next.done, value = _keys$next.value;
        return {
          done,
          value: done ? void 0 : self2.get(value)
        };
      }
    });
  };
  _proto.entries = function entries() {
    var self2 = this;
    var keys = this.keys();
    return makeIterableForMap({
      next: function next() {
        var _keys$next2 = keys.next(), done = _keys$next2.done, value = _keys$next2.value;
        return {
          done,
          value: done ? void 0 : [value, self2.get(value)]
        };
      }
    });
  };
  _proto[Symbol.iterator] = function() {
    return this.entries();
  };
  _proto.forEach = function forEach(callback, thisArg) {
    for (var _iterator = _createForOfIteratorHelperLoose(this), _step; !(_step = _iterator()).done; ) {
      var _step$value = _step.value, key2 = _step$value[0], value = _step$value[1];
      callback.call(thisArg, value, key2, this);
    }
  };
  _proto.merge = function merge(other) {
    var _this5 = this;
    if (isObservableMap(other)) {
      other = new Map(other);
    }
    transaction(function() {
      if (isPlainObject(other)) {
        getPlainObjectKeys(other).forEach(function(key2) {
          return _this5.set(key2, other[key2]);
        });
      } else if (Array.isArray(other)) {
        other.forEach(function(_ref) {
          var key2 = _ref[0], value = _ref[1];
          return _this5.set(key2, value);
        });
      } else if (isES6Map(other)) {
        if (!isPlainES6Map(other)) {
          die(19, other);
        }
        other.forEach(function(value, key2) {
          return _this5.set(key2, value);
        });
      } else if (other !== null && other !== void 0) {
        die(20, other);
      }
    });
    return this;
  };
  _proto.clear = function clear2() {
    var _this6 = this;
    transaction(function() {
      untracked(function() {
        for (var _iterator2 = _createForOfIteratorHelperLoose(_this6.keys()), _step2; !(_step2 = _iterator2()).done; ) {
          var key2 = _step2.value;
          _this6["delete"](key2);
        }
      });
    });
  };
  _proto.replace = function replace2(values) {
    var _this7 = this;
    transaction(function() {
      var replacementMap = convertToMap(values);
      var orderedData = /* @__PURE__ */ new Map();
      var keysReportChangedCalled = false;
      for (var _iterator3 = _createForOfIteratorHelperLoose(_this7.data_.keys()), _step3; !(_step3 = _iterator3()).done; ) {
        var key2 = _step3.value;
        if (!replacementMap.has(key2)) {
          var deleted = _this7["delete"](key2);
          if (deleted) {
            keysReportChangedCalled = true;
          } else {
            var value = _this7.data_.get(key2);
            orderedData.set(key2, value);
          }
        }
      }
      for (var _iterator4 = _createForOfIteratorHelperLoose(replacementMap.entries()), _step4; !(_step4 = _iterator4()).done; ) {
        var _step4$value = _step4.value, _key = _step4$value[0], _value = _step4$value[1];
        var keyExisted = _this7.data_.has(_key);
        _this7.set(_key, _value);
        if (_this7.data_.has(_key)) {
          var _value2 = _this7.data_.get(_key);
          orderedData.set(_key, _value2);
          if (!keyExisted) {
            keysReportChangedCalled = true;
          }
        }
      }
      if (!keysReportChangedCalled) {
        if (_this7.data_.size !== orderedData.size) {
          _this7.keysAtom_.reportChanged();
        } else {
          var iter1 = _this7.data_.keys();
          var iter2 = orderedData.keys();
          var next1 = iter1.next();
          var next2 = iter2.next();
          while (!next1.done) {
            if (next1.value !== next2.value) {
              _this7.keysAtom_.reportChanged();
              break;
            }
            next1 = iter1.next();
            next2 = iter2.next();
          }
        }
      }
      _this7.data_ = orderedData;
    });
    return this;
  };
  _proto.toString = function toString2() {
    return "[object ObservableMap]";
  };
  _proto.toJSON = function toJSON2() {
    return Array.from(this);
  };
  _proto.observe_ = function observe_(listener, fireImmediately) {
    if (false) {
      die("`observe` doesn't support fireImmediately=true in combination with maps.");
    }
    return registerListener(this, listener);
  };
  _proto.intercept_ = function intercept_(handler) {
    return registerInterceptor(this, handler);
  };
  return _createClass(ObservableMap2, [{
    key: "size",
    get: function get3() {
      this.keysAtom_.reportObserved();
      return this.data_.size;
    }
  }, {
    key: Symbol.toStringTag,
    get: function get3() {
      return "Map";
    }
  }]);
})();
var isObservableMap = /* @__PURE__ */ createInstanceofPredicate("ObservableMap", ObservableMap);
function makeIterableForMap(iterator) {
  iterator[Symbol.toStringTag] = "MapIterator";
  return makeIterable(iterator);
}
function convertToMap(dataStructure) {
  if (isES6Map(dataStructure) || isObservableMap(dataStructure)) {
    return dataStructure;
  } else if (Array.isArray(dataStructure)) {
    return new Map(dataStructure);
  } else if (isPlainObject(dataStructure)) {
    var map2 = /* @__PURE__ */ new Map();
    for (var key2 in dataStructure) {
      map2.set(key2, dataStructure[key2]);
    }
    return map2;
  } else {
    return die(21, dataStructure);
  }
}
var ObservableSetMarker = {};
var ObservableSet = /* @__PURE__ */ (function() {
  function ObservableSet2(initialData, enhancer, name_) {
    var _this = this;
    if (enhancer === void 0) {
      enhancer = deepEnhancer;
    }
    if (name_ === void 0) {
      name_ = false ? "ObservableSet@" + getNextId() : "ObservableSet";
    }
    this.name_ = void 0;
    this[$mobx] = ObservableSetMarker;
    this.data_ = /* @__PURE__ */ new Set();
    this.atom_ = void 0;
    this.changeListeners_ = void 0;
    this.interceptors_ = void 0;
    this.dehancer = void 0;
    this.enhancer_ = void 0;
    this.name_ = name_;
    if (!isFunction(Set)) {
      die(22);
    }
    this.enhancer_ = function(newV, oldV) {
      return enhancer(newV, oldV, name_);
    };
    initObservable(function() {
      _this.atom_ = createAtom(_this.name_);
      if (initialData) {
        _this.replace(initialData);
      }
    });
  }
  var _proto = ObservableSet2.prototype;
  _proto.dehanceValue_ = function dehanceValue_(value) {
    if (this.dehancer !== void 0) {
      return this.dehancer(value);
    }
    return value;
  };
  _proto.clear = function clear2() {
    var _this2 = this;
    transaction(function() {
      untracked(function() {
        for (var _iterator = _createForOfIteratorHelperLoose(_this2.data_.values()), _step; !(_step = _iterator()).done; ) {
          var value = _step.value;
          _this2["delete"](value);
        }
      });
    });
  };
  _proto.forEach = function forEach(callbackFn, thisArg) {
    for (var _iterator2 = _createForOfIteratorHelperLoose(this), _step2; !(_step2 = _iterator2()).done; ) {
      var value = _step2.value;
      callbackFn.call(thisArg, value, value, this);
    }
  };
  _proto.add = function add(value) {
    var _this3 = this;
    checkIfStateModificationsAreAllowed(this.atom_);
    if (hasInterceptors(this)) {
      var change = interceptChange(this, {
        type: ADD,
        object: this,
        newValue: value
      });
      if (!change) {
        return this;
      }
      value = change.newValue;
    }
    if (!this.has(value)) {
      transaction(function() {
        _this3.data_.add(_this3.enhancer_(value, void 0));
        _this3.atom_.reportChanged();
      });
      var notifySpy = false;
      var notify = hasListeners(this);
      var _change = notify || notifySpy ? {
        observableKind: "set",
        debugObjectName: this.name_,
        type: ADD,
        object: this,
        newValue: value
      } : null;
      if (notifySpy && false) {
        spyReportStart(_change);
      }
      if (notify) {
        notifyListeners(this, _change);
      }
      if (notifySpy && false) {
        spyReportEnd();
      }
    }
    return this;
  };
  _proto["delete"] = function _delete(value) {
    var _this4 = this;
    if (hasInterceptors(this)) {
      var change = interceptChange(this, {
        type: DELETE,
        object: this,
        oldValue: value
      });
      if (!change) {
        return false;
      }
    }
    if (this.has(value)) {
      var notifySpy = false;
      var notify = hasListeners(this);
      var _change2 = notify || notifySpy ? {
        observableKind: "set",
        debugObjectName: this.name_,
        type: DELETE,
        object: this,
        oldValue: value
      } : null;
      if (notifySpy && false) {
        spyReportStart(_change2);
      }
      transaction(function() {
        _this4.atom_.reportChanged();
        _this4.data_["delete"](value);
      });
      if (notify) {
        notifyListeners(this, _change2);
      }
      if (notifySpy && false) {
        spyReportEnd();
      }
      return true;
    }
    return false;
  };
  _proto.has = function has2(value) {
    this.atom_.reportObserved();
    return this.data_.has(this.dehanceValue_(value));
  };
  _proto.entries = function entries() {
    var values = this.values();
    return makeIterableForSet({
      next: function next() {
        var _values$next = values.next(), value = _values$next.value, done = _values$next.done;
        return !done ? {
          value: [value, value],
          done
        } : {
          value: void 0,
          done
        };
      }
    });
  };
  _proto.keys = function keys() {
    return this.values();
  };
  _proto.values = function values() {
    this.atom_.reportObserved();
    var self2 = this;
    var values2 = this.data_.values();
    return makeIterableForSet({
      next: function next() {
        var _values$next2 = values2.next(), value = _values$next2.value, done = _values$next2.done;
        return !done ? {
          value: self2.dehanceValue_(value),
          done
        } : {
          value: void 0,
          done
        };
      }
    });
  };
  _proto.intersection = function intersection(otherSet) {
    if (isES6Set(otherSet) && !isObservableSet(otherSet)) {
      return otherSet.intersection(this);
    } else {
      var dehancedSet = new Set(this);
      return dehancedSet.intersection(otherSet);
    }
  };
  _proto.union = function union(otherSet) {
    if (isES6Set(otherSet) && !isObservableSet(otherSet)) {
      return otherSet.union(this);
    } else {
      var dehancedSet = new Set(this);
      return dehancedSet.union(otherSet);
    }
  };
  _proto.difference = function difference(otherSet) {
    return new Set(this).difference(otherSet);
  };
  _proto.symmetricDifference = function symmetricDifference(otherSet) {
    if (isES6Set(otherSet) && !isObservableSet(otherSet)) {
      return otherSet.symmetricDifference(this);
    } else {
      var dehancedSet = new Set(this);
      return dehancedSet.symmetricDifference(otherSet);
    }
  };
  _proto.isSubsetOf = function isSubsetOf(otherSet) {
    return new Set(this).isSubsetOf(otherSet);
  };
  _proto.isSupersetOf = function isSupersetOf(otherSet) {
    return new Set(this).isSupersetOf(otherSet);
  };
  _proto.isDisjointFrom = function isDisjointFrom(otherSet) {
    if (isES6Set(otherSet) && !isObservableSet(otherSet)) {
      return otherSet.isDisjointFrom(this);
    } else {
      var dehancedSet = new Set(this);
      return dehancedSet.isDisjointFrom(otherSet);
    }
  };
  _proto.replace = function replace2(other) {
    var _this5 = this;
    if (isObservableSet(other)) {
      other = new Set(other);
    }
    transaction(function() {
      if (Array.isArray(other)) {
        _this5.clear();
        other.forEach(function(value) {
          return _this5.add(value);
        });
      } else if (isES6Set(other)) {
        _this5.clear();
        other.forEach(function(value) {
          return _this5.add(value);
        });
      } else if (other !== null && other !== void 0) {
        die("Cannot initialize set from " + other);
      }
    });
    return this;
  };
  _proto.observe_ = function observe_(listener, fireImmediately) {
    if (false) {
      die("`observe` doesn't support fireImmediately=true in combination with sets.");
    }
    return registerListener(this, listener);
  };
  _proto.intercept_ = function intercept_(handler) {
    return registerInterceptor(this, handler);
  };
  _proto.toJSON = function toJSON2() {
    return Array.from(this);
  };
  _proto.toString = function toString2() {
    return "[object ObservableSet]";
  };
  _proto[Symbol.iterator] = function() {
    return this.values();
  };
  return _createClass(ObservableSet2, [{
    key: "size",
    get: function get3() {
      this.atom_.reportObserved();
      return this.data_.size;
    }
  }, {
    key: Symbol.toStringTag,
    get: function get3() {
      return "Set";
    }
  }]);
})();
var isObservableSet = /* @__PURE__ */ createInstanceofPredicate("ObservableSet", ObservableSet);
function makeIterableForSet(iterator) {
  iterator[Symbol.toStringTag] = "SetIterator";
  return makeIterable(iterator);
}
var descriptorCache = /* @__PURE__ */ Object.create(null);
var REMOVE = "remove";
var ObservableObjectAdministration = /* @__PURE__ */ (function() {
  function ObservableObjectAdministration2(target_, values_, name_, defaultAnnotation_) {
    if (values_ === void 0) {
      values_ = /* @__PURE__ */ new Map();
    }
    if (defaultAnnotation_ === void 0) {
      defaultAnnotation_ = autoAnnotation;
    }
    this.target_ = void 0;
    this.values_ = void 0;
    this.name_ = void 0;
    this.defaultAnnotation_ = void 0;
    this.keysAtom_ = void 0;
    this.changeListeners_ = void 0;
    this.interceptors_ = void 0;
    this.proxy_ = void 0;
    this.isPlainObject_ = void 0;
    this.appliedAnnotations_ = void 0;
    this.pendingKeys_ = void 0;
    this.lazyComputedKeys_ = void 0;
    this.lazyObservableKeys_ = void 0;
    this.target_ = target_;
    this.values_ = values_;
    this.name_ = name_;
    this.defaultAnnotation_ = defaultAnnotation_;
    this.keysAtom_ = new Atom(false ? this.name_ + ".keys" : "ObservableObject.keys");
    this.isPlainObject_ = isPlainObject(this.target_);
    if (false) {
      die("defaultAnnotation must be valid annotation");
    }
    if (false) {
      this.appliedAnnotations_ = {};
    }
  }
  var _proto = ObservableObjectAdministration2.prototype;
  _proto.getObservablePropValue_ = function getObservablePropValue_(key2) {
    var _ref, _this$values_$get;
    var observable2 = (_ref = (_this$values_$get = this.values_.get(key2)) != null ? _this$values_$get : this.materializeLazyComputed_(key2)) != null ? _ref : this.materializeLazyObservable_(key2);
    return observable2.get();
  };
  _proto.materializeLazyComputed_ = function materializeLazyComputed_(key2) {
    var _this$lazyComputedKey;
    var factory = (_this$lazyComputedKey = this.lazyComputedKeys_) == null ? void 0 : _this$lazyComputedKey.get(key2);
    if (!factory) {
      return void 0;
    }
    this.lazyComputedKeys_["delete"](key2);
    if (this.lazyComputedKeys_.size === 0) {
      this.lazyComputedKeys_ = void 0;
    }
    var computed3 = factory();
    this.values_.set(key2, computed3);
    return computed3;
  };
  _proto.materializeLazyObservable_ = function materializeLazyObservable_(key2) {
    var _this$lazyObservableK;
    var factory = (_this$lazyObservableK = this.lazyObservableKeys_) == null ? void 0 : _this$lazyObservableK.get(key2);
    if (!factory) {
      return void 0;
    }
    this.lazyObservableKeys_["delete"](key2);
    if (this.lazyObservableKeys_.size === 0) {
      this.lazyObservableKeys_ = void 0;
    }
    var observable2 = factory();
    this.values_.set(key2, observable2);
    return observable2;
  };
  _proto.setObservablePropValue_ = function setObservablePropValue_(key2, newValue) {
    var _ref2, _this$values_$get2;
    var observable2 = (_ref2 = (_this$values_$get2 = this.values_.get(key2)) != null ? _this$values_$get2 : this.materializeLazyComputed_(key2)) != null ? _ref2 : this.materializeLazyObservable_(key2);
    if (observable2 instanceof ComputedValue) {
      observable2.set(newValue);
      return true;
    }
    if (hasInterceptors(this)) {
      var change = interceptChange(this, {
        type: UPDATE,
        object: this.proxy_ || this.target_,
        name: key2,
        newValue
      });
      if (!change) {
        return null;
      }
      newValue = change.newValue;
    }
    newValue = observable2.prepareNewValue_(newValue);
    if (newValue !== globalState.UNCHANGED) {
      var notify = hasListeners(this);
      var notifySpy = false;
      var _change = notify || notifySpy ? {
        type: UPDATE,
        observableKind: "object",
        debugObjectName: this.name_,
        object: this.proxy_ || this.target_,
        oldValue: observable2.value_,
        name: key2,
        newValue
      } : null;
      if (false) {
        spyReportStart(_change);
      }
      observable2.setNewValue_(newValue);
      if (notify) {
        notifyListeners(this, _change);
      }
      if (false) {
        spyReportEnd();
      }
    }
    return true;
  };
  _proto.get_ = function get_(key2) {
    if (globalState.trackingDerivation && !hasProp(this.target_, key2)) {
      this.has_(key2);
    }
    return this.target_[key2];
  };
  _proto.set_ = function set_(key2, value, proxyTrap) {
    if (proxyTrap === void 0) {
      proxyTrap = false;
    }
    if (hasProp(this.target_, key2)) {
      if (this.values_.has(key2)) {
        return this.setObservablePropValue_(key2, value);
      } else if (proxyTrap) {
        return Reflect.set(this.target_, key2, value);
      } else {
        this.target_[key2] = value;
        return true;
      }
    } else {
      return this.extend_(key2, {
        value,
        enumerable: true,
        writable: true,
        configurable: true
      }, this.defaultAnnotation_, proxyTrap);
    }
  };
  _proto.has_ = function has_(key2) {
    if (!globalState.trackingDerivation) {
      return key2 in this.target_;
    }
    this.pendingKeys_ || (this.pendingKeys_ = /* @__PURE__ */ new Map());
    var entry = this.pendingKeys_.get(key2);
    if (!entry) {
      entry = new ObservableValue(key2 in this.target_, referenceEnhancer, false ? this.name_ + "." + stringifyKey(key2) + "?" : "ObservableObject.key?", false);
      this.pendingKeys_.set(key2, entry);
    }
    return entry.get();
  };
  _proto.make_ = function make_(key2, annotation) {
    if (annotation === true) {
      annotation = this.defaultAnnotation_;
    }
    if (annotation === false) {
      return;
    }
    assertAnnotable(this, annotation, key2);
    if (!(key2 in this.target_)) {
      var _this$target_$storedA;
      if ((_this$target_$storedA = this.target_[storedAnnotationsSymbol]) != null && _this$target_$storedA[key2]) {
        return;
      } else {
        die(1, annotation.annotationType_, this.name_ + "." + key2.toString());
      }
    }
    var source = this.target_;
    while (source && source !== objectPrototype) {
      var descriptor = getDescriptor(source, key2);
      if (descriptor) {
        var outcome = annotation.make_(this, key2, descriptor, source);
        if (outcome === 0) {
          return;
        }
        if (outcome === 1) {
          break;
        }
      }
      source = Object.getPrototypeOf(source);
    }
    recordAnnotationApplied(this, annotation, key2);
  };
  _proto.extend_ = function extend_(key2, descriptor, annotation, proxyTrap) {
    if (proxyTrap === void 0) {
      proxyTrap = false;
    }
    if (annotation === true) {
      annotation = this.defaultAnnotation_;
    }
    if (annotation === false) {
      return this.defineProperty_(key2, descriptor, proxyTrap);
    }
    assertAnnotable(this, annotation, key2);
    var outcome = annotation.extend_(this, key2, descriptor, proxyTrap);
    if (outcome) {
      recordAnnotationApplied(this, annotation, key2);
    }
    return outcome;
  };
  _proto.defineProperty_ = function defineProperty_(key2, descriptor, proxyTrap) {
    if (proxyTrap === void 0) {
      proxyTrap = false;
    }
    checkIfStateModificationsAreAllowed(this.keysAtom_);
    try {
      startBatch();
      var deleteOutcome = this.delete_(key2);
      if (!deleteOutcome) {
        return deleteOutcome;
      }
      if (hasInterceptors(this)) {
        var change = interceptChange(this, {
          object: this.proxy_ || this.target_,
          name: key2,
          type: ADD,
          newValue: descriptor.value
        });
        if (!change) {
          return null;
        }
        var newValue = change.newValue;
        if (descriptor.value !== newValue) {
          descriptor = _extends({}, descriptor, {
            value: newValue
          });
        }
      }
      if (proxyTrap) {
        if (!Reflect.defineProperty(this.target_, key2, descriptor)) {
          return false;
        }
      } else {
        defineProperty(this.target_, key2, descriptor);
      }
      this.notifyPropertyAddition_(key2, descriptor.value);
    } finally {
      endBatch();
    }
    return true;
  };
  _proto.defineObservableProperty_ = function defineObservableProperty_(key2, value, enhancer, proxyTrap) {
    if (proxyTrap === void 0) {
      proxyTrap = false;
    }
    checkIfStateModificationsAreAllowed(this.keysAtom_);
    try {
      startBatch();
      var deleteOutcome = this.delete_(key2);
      if (!deleteOutcome) {
        return deleteOutcome;
      }
      if (hasInterceptors(this)) {
        var change = interceptChange(this, {
          object: this.proxy_ || this.target_,
          name: key2,
          type: ADD,
          newValue: value
        });
        if (!change) {
          return null;
        }
        value = change.newValue;
      }
      var cachedDescriptor = getCachedObservablePropDescriptor(key2);
      var descriptor = {
        configurable: globalState.safeDescriptors ? this.isPlainObject_ : true,
        enumerable: true,
        get: cachedDescriptor.get,
        set: cachedDescriptor.set
      };
      if (proxyTrap) {
        if (!Reflect.defineProperty(this.target_, key2, descriptor)) {
          return false;
        }
      } else {
        defineProperty(this.target_, key2, descriptor);
      }
      var observable2 = new ObservableValue(value, enhancer, false ? this.name_ + "." + key2.toString() : "ObservableObject.key", false);
      this.values_.set(key2, observable2);
      this.notifyPropertyAddition_(key2, observable2.value_);
    } finally {
      endBatch();
    }
    return true;
  };
  _proto.defineComputedProperty_ = function defineComputedProperty_(key2, options, proxyTrap) {
    if (proxyTrap === void 0) {
      proxyTrap = false;
    }
    checkIfStateModificationsAreAllowed(this.keysAtom_);
    try {
      startBatch();
      var deleteOutcome = this.delete_(key2);
      if (!deleteOutcome) {
        return deleteOutcome;
      }
      if (hasInterceptors(this)) {
        var change = interceptChange(this, {
          object: this.proxy_ || this.target_,
          name: key2,
          type: ADD,
          newValue: void 0
        });
        if (!change) {
          return null;
        }
      }
      options.name || (options.name = false ? this.name_ + "." + key2.toString() : "ObservableObject.key");
      options.context = this.proxy_ || this.target_;
      var cachedDescriptor = getCachedObservablePropDescriptor(key2);
      var descriptor = {
        configurable: globalState.safeDescriptors ? this.isPlainObject_ : true,
        enumerable: false,
        get: cachedDescriptor.get,
        set: cachedDescriptor.set
      };
      if (proxyTrap) {
        if (!Reflect.defineProperty(this.target_, key2, descriptor)) {
          return false;
        }
      } else {
        defineProperty(this.target_, key2, descriptor);
      }
      this.values_.set(key2, new ComputedValue(options));
      this.notifyPropertyAddition_(key2, void 0);
    } finally {
      endBatch();
    }
    return true;
  };
  _proto.delete_ = function delete_(key2, proxyTrap) {
    if (proxyTrap === void 0) {
      proxyTrap = false;
    }
    checkIfStateModificationsAreAllowed(this.keysAtom_);
    if (!hasProp(this.target_, key2)) {
      return true;
    }
    if (hasInterceptors(this)) {
      var change = interceptChange(this, {
        object: this.proxy_ || this.target_,
        name: key2,
        type: REMOVE
      });
      if (!change) {
        return null;
      }
    }
    try {
      var _this$pendingKeys_;
      startBatch();
      var notify = hasListeners(this);
      var notifySpy = false;
      var observable2 = this.values_.get(key2);
      var value = void 0;
      if (!observable2 && (notify || notifySpy)) {
        var _getDescriptor2;
        value = (_getDescriptor2 = getDescriptor(this.target_, key2)) == null ? void 0 : _getDescriptor2.value;
      }
      if (proxyTrap) {
        if (!Reflect.deleteProperty(this.target_, key2)) {
          return false;
        }
      } else {
        delete this.target_[key2];
      }
      if (false) {
        delete this.appliedAnnotations_[key2];
      }
      if (observable2) {
        this.values_["delete"](key2);
        if (observable2 instanceof ObservableValue) {
          value = observable2.value_;
        }
        propagateChanged(observable2);
      }
      this.keysAtom_.reportChanged();
      (_this$pendingKeys_ = this.pendingKeys_) == null || (_this$pendingKeys_ = _this$pendingKeys_.get(key2)) == null || _this$pendingKeys_.set(key2 in this.target_);
      if (notify || notifySpy) {
        var _change2 = {
          type: REMOVE,
          observableKind: "object",
          object: this.proxy_ || this.target_,
          debugObjectName: this.name_,
          oldValue: value,
          name: key2
        };
        if (false) {
          spyReportStart(_change2);
        }
        if (notify) {
          notifyListeners(this, _change2);
        }
        if (false) {
          spyReportEnd();
        }
      }
    } finally {
      endBatch();
    }
    return true;
  };
  _proto.observe_ = function observe_(callback, fireImmediately) {
    if (false) {
      die("`observe` doesn't support the fire immediately property for observable objects.");
    }
    return registerListener(this, callback);
  };
  _proto.intercept_ = function intercept_(handler) {
    return registerInterceptor(this, handler);
  };
  _proto.notifyPropertyAddition_ = function notifyPropertyAddition_(key2, value) {
    var _this$pendingKeys_2;
    var notify = hasListeners(this);
    var notifySpy = false;
    if (notify || notifySpy) {
      var change = notify || notifySpy ? {
        type: ADD,
        observableKind: "object",
        debugObjectName: this.name_,
        object: this.proxy_ || this.target_,
        name: key2,
        newValue: value
      } : null;
      if (false) {
        spyReportStart(change);
      }
      if (notify) {
        notifyListeners(this, change);
      }
      if (false) {
        spyReportEnd();
      }
    }
    (_this$pendingKeys_2 = this.pendingKeys_) == null || (_this$pendingKeys_2 = _this$pendingKeys_2.get(key2)) == null || _this$pendingKeys_2.set(true);
    this.keysAtom_.reportChanged();
  };
  _proto.ownKeys_ = function ownKeys_() {
    this.keysAtom_.reportObserved();
    return ownKeys(this.target_);
  };
  _proto.keys_ = function keys_() {
    this.keysAtom_.reportObserved();
    return Object.keys(this.target_);
  };
  return ObservableObjectAdministration2;
})();
function asObservableObject(target, options) {
  var _options$name;
  if (false) {
    die("Options can't be provided for already observable objects.");
  }
  if (hasProp(target, $mobx)) {
    if (false) {
      die("Cannot convert '" + getDebugName(target) + "' into observable object:\nThe target is already observable of different type.\nExtending builtins is not supported.");
    }
    return target;
  }
  if (false) {
    die("Cannot make the designated object observable; it is not extensible");
  }
  var name = (_options$name = options == null ? void 0 : options.name) != null ? _options$name : false ? (isPlainObject(target) ? "ObservableObject" : target.constructor.name) + "@" + getNextId() : "ObservableObject";
  var adm = new ObservableObjectAdministration(target, /* @__PURE__ */ new Map(), String(name), getAnnotationFromOptions(options));
  addHiddenProp(target, $mobx, adm);
  return target;
}
var isObservableObjectAdministration = /* @__PURE__ */ createInstanceofPredicate("ObservableObjectAdministration", ObservableObjectAdministration);
function getCachedObservablePropDescriptor(key2) {
  return descriptorCache[key2] || (descriptorCache[key2] = {
    get: function get3() {
      return this[$mobx].getObservablePropValue_(key2);
    },
    set: function set4(value) {
      return this[$mobx].setObservablePropValue_(key2, value);
    }
  });
}
function isObservableObject(thing) {
  if (isObject(thing)) {
    return isObservableObjectAdministration(thing[$mobx]);
  }
  return false;
}
function recordAnnotationApplied(adm, annotation, key2) {
  var _adm$target_$storedAn;
  if (false) {
    adm.appliedAnnotations_[key2] = annotation;
  }
  (_adm$target_$storedAn = adm.target_[storedAnnotationsSymbol]) == null || delete _adm$target_$storedAn[key2];
}
function assertAnnotable(adm, annotation, key2) {
  if (false) {
    die("Cannot annotate '" + adm.name_ + "." + key2.toString() + "': Invalid annotation.");
  }
  if (false) {
    var fieldName = adm.name_ + "." + key2.toString();
    var currentAnnotationType = adm.appliedAnnotations_[key2].annotationType_;
    var requestedAnnotationType = annotation.annotationType_;
    die("Cannot apply '" + requestedAnnotationType + "' to '" + fieldName + "':" + ("\nThe field is already annotated with '" + currentAnnotationType + "'.") + "\nRe-annotating fields is not allowed.\nUse 'override' annotation for methods overridden by subclass.");
  }
}
var ENTRY_0 = /* @__PURE__ */ createArrayEntryDescriptor(0);
var safariPrototypeSetterInheritanceBug = /* @__PURE__ */ (function() {
  var v = false;
  var p = {};
  Object.defineProperty(p, "0", {
    set: function set4() {
      v = true;
    }
  });
  Object.create(p)["0"] = 1;
  return v === false;
})();
var OBSERVABLE_ARRAY_BUFFER_SIZE = 0;
var StubArray = function StubArray2() {
};
function inherit(ctor, proto) {
  if (Object.setPrototypeOf) {
    Object.setPrototypeOf(ctor.prototype, proto);
  } else if (ctor.prototype.__proto__ !== void 0) {
    ctor.prototype.__proto__ = proto;
  } else {
    ctor.prototype = proto;
  }
}
inherit(StubArray, Array.prototype);
var LegacyObservableArray = /* @__PURE__ */ (function(_StubArray) {
  function LegacyObservableArray2(initialValues, enhancer, name, owned) {
    var _this;
    if (name === void 0) {
      name = false ? "ObservableArray@" + getNextId() : "ObservableArray";
    }
    if (owned === void 0) {
      owned = false;
    }
    _this = _StubArray.call(this) || this;
    initObservable(function() {
      var adm = new ObservableArrayAdministration(name, enhancer, owned, true);
      adm.proxy_ = _this;
      addHiddenFinalProp(_this, $mobx, adm);
      if (initialValues && initialValues.length) {
        _this.spliceWithArray(0, 0, initialValues);
      }
      if (safariPrototypeSetterInheritanceBug) {
        Object.defineProperty(_this, "0", ENTRY_0);
      }
    });
    return _this;
  }
  _inheritsLoose(LegacyObservableArray2, _StubArray);
  var _proto = LegacyObservableArray2.prototype;
  _proto.concat = function concat() {
    this[$mobx].atom_.reportObserved();
    for (var _len = arguments.length, arrays = new Array(_len), _key = 0; _key < _len; _key++) {
      arrays[_key] = arguments[_key];
    }
    return Array.prototype.concat.apply(
      this.slice(),
      //@ts-ignore
      arrays.map(function(a) {
        return isObservableArray(a) ? a.slice() : a;
      })
    );
  };
  _proto[Symbol.iterator] = function() {
    var self2 = this;
    var nextIndex = 0;
    return makeIterable({
      next: function next() {
        return nextIndex < self2.length ? {
          value: self2[nextIndex++],
          done: false
        } : {
          done: true,
          value: void 0
        };
      }
    });
  };
  return _createClass(LegacyObservableArray2, [{
    key: "length",
    get: function get3() {
      return this[$mobx].getArrayLength_();
    },
    set: function set4(newLength) {
      this[$mobx].setArrayLength_(newLength);
    }
  }, {
    key: Symbol.toStringTag,
    get: function get3() {
      return "Array";
    }
  }]);
})(StubArray);
Object.entries(arrayExtensions).forEach(function(_ref) {
  var prop = _ref[0], fn = _ref[1];
  if (prop !== "concat") {
    addHiddenProp(LegacyObservableArray.prototype, prop, fn);
  }
});
function createArrayEntryDescriptor(index) {
  return {
    enumerable: false,
    configurable: true,
    get: function get3() {
      return this[$mobx].get_(index);
    },
    set: function set4(value) {
      this[$mobx].set_(index, value);
    }
  };
}
function createArrayBufferItem(index) {
  defineProperty(LegacyObservableArray.prototype, "" + index, createArrayEntryDescriptor(index));
}
function reserveArrayBuffer(max) {
  if (max > OBSERVABLE_ARRAY_BUFFER_SIZE) {
    for (var index = OBSERVABLE_ARRAY_BUFFER_SIZE; index < max + 100; index++) {
      createArrayBufferItem(index);
    }
    OBSERVABLE_ARRAY_BUFFER_SIZE = max;
  }
}
reserveArrayBuffer(1e3);
function createLegacyArray(initialValues, enhancer, name) {
  return new LegacyObservableArray(initialValues, enhancer, name);
}
function getAtom(thing, property) {
  if (typeof thing === "object" && thing !== null) {
    if (isObservableArray(thing)) {
      if (property !== void 0) {
        die(23);
      }
      return thing[$mobx].atom_;
    }
    if (isObservableSet(thing)) {
      return thing.atom_;
    }
    if (isObservableMap(thing)) {
      if (property === void 0) {
        return thing.keysAtom_;
      }
      var observable2 = thing.data_.get(property) || thing.hasMap_.get(property);
      if (!observable2) {
        die(25, property, getDebugName(thing));
      }
      return observable2;
    }
    if (isObservableObject(thing)) {
      var _ref, _adm$values_$get;
      if (!property) {
        return die(26);
      }
      var adm = thing[$mobx];
      var _observable = (_ref = (_adm$values_$get = adm.values_.get(property)) != null ? _adm$values_$get : adm.materializeLazyComputed_(property)) != null ? _ref : adm.materializeLazyObservable_(property);
      if (!_observable) {
        die(27, property, getDebugName(thing));
      }
      return _observable;
    }
    if (isAtom(thing) || isComputedValue(thing) || isReaction(thing)) {
      return thing;
    }
  } else if (isFunction(thing)) {
    if (isReaction(thing[$mobx])) {
      return thing[$mobx];
    }
  }
  die(28);
}
function getAdministration(thing, property) {
  if (!thing) {
    die(29);
  }
  if (property !== void 0) {
    return getAdministration(getAtom(thing, property));
  }
  if (isAtom(thing) || isComputedValue(thing) || isReaction(thing)) {
    return thing;
  }
  if (isObservableMap(thing) || isObservableSet(thing)) {
    return thing;
  }
  if (thing[$mobx]) {
    return thing[$mobx];
  }
  die(24, thing);
}
function getDebugName(thing, property) {
  var named;
  if (property !== void 0) {
    named = getAtom(thing, property);
  } else if (isAction(thing)) {
    return thing.name;
  } else if (isObservableObject(thing) || isObservableMap(thing) || isObservableSet(thing)) {
    named = getAdministration(thing);
  } else {
    named = getAtom(thing);
  }
  return named.name_;
}
function initObservable(cb) {
  var derivation = untrackedStart();
  var allowStateChanges2 = allowStateChangesStart(true);
  startBatch();
  try {
    return cb();
  } finally {
    endBatch();
    allowStateChangesEnd(allowStateChanges2);
    untrackedEnd(derivation);
  }
}
var toString = objectPrototype.toString;
function deepEqual(a, b, depth) {
  if (depth === void 0) {
    depth = -1;
  }
  return eq(a, b, depth);
}
function eq(a, b, depth, aStack, bStack) {
  if (a === b) {
    return a !== 0 || 1 / a === 1 / b;
  }
  if (a == null || b == null) {
    return false;
  }
  if (a !== a) {
    return b !== b;
  }
  var type = typeof a;
  if (type !== "function" && type !== "object" && typeof b != "object") {
    return false;
  }
  var className = toString.call(a);
  if (className !== toString.call(b)) {
    return false;
  }
  switch (className) {
    // Strings, numbers, regular expressions, dates, and booleans are compared by value.
    case "[object RegExp]":
    // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
    case "[object String]":
      return "" + a === "" + b;
    case "[object Number]":
      if (+a !== +a) {
        return +b !== +b;
      }
      return +a === 0 ? 1 / +a === 1 / b : +a === +b;
    case "[object Date]":
    case "[object Boolean]":
      return +a === +b;
    case "[object Symbol]":
      return typeof Symbol !== "undefined" && Symbol.valueOf.call(a) === Symbol.valueOf.call(b);
    case "[object Map]":
    case "[object Set]":
      if (depth >= 0) {
        depth++;
      }
      break;
  }
  a = unwrap(a);
  b = unwrap(b);
  var areArrays = className === "[object Array]";
  if (!areArrays) {
    if (typeof a != "object" || typeof b != "object") {
      return false;
    }
    var aCtor = a.constructor, bCtor = b.constructor;
    if (aCtor !== bCtor && !(isFunction(aCtor) && aCtor instanceof aCtor && isFunction(bCtor) && bCtor instanceof bCtor) && "constructor" in a && "constructor" in b) {
      return false;
    }
  }
  if (depth === 0) {
    return false;
  } else if (depth < 0) {
    depth = -1;
  }
  aStack = aStack || [];
  bStack = bStack || [];
  var length = aStack.length;
  while (length--) {
    if (aStack[length] === a) {
      return bStack[length] === b;
    }
  }
  aStack.push(a);
  bStack.push(b);
  if (areArrays) {
    length = a.length;
    if (length !== b.length) {
      return false;
    }
    while (length--) {
      if (!eq(a[length], b[length], depth - 1, aStack, bStack)) {
        return false;
      }
    }
  } else {
    var keys = Object.keys(a);
    var _length = keys.length;
    if (Object.keys(b).length !== _length) {
      return false;
    }
    for (var i = 0; i < _length; i++) {
      var key2 = keys[i];
      if (!(hasProp(b, key2) && eq(a[key2], b[key2], depth - 1, aStack, bStack))) {
        return false;
      }
    }
  }
  aStack.pop();
  bStack.pop();
  return true;
}
function unwrap(a) {
  if (isObservableArray(a)) {
    return a.slice();
  }
  if (isES6Map(a) || isObservableMap(a)) {
    return Array.from(a.entries());
  }
  if (isES6Set(a) || isObservableSet(a)) {
    return Array.from(a.entries());
  }
  return a;
}
var _global$Iterator;
var global$1 = /* @__PURE__ */ getGlobal();
var maybeIteratorPrototype = ((_global$Iterator = global$1.Iterator) == null ? void 0 : _global$Iterator.prototype) || {};
function makeIterable(iterator) {
  iterator[Symbol.iterator] = getSelf;
  return Object.assign(Object.create(maybeIteratorPrototype), iterator);
}
function getSelf() {
  return this;
}
["Symbol", "Map", "Set"].forEach(function(m) {
  var g = getGlobal();
  if (typeof g[m] === "undefined") {
    die("MobX requires global '" + m + "' to be available or polyfilled");
  }
});
if (typeof __MOBX_DEVTOOLS_GLOBAL_HOOK__ === "object") {
  __MOBX_DEVTOOLS_GLOBAL_HOOK__.injectMobx({
    spy,
    extras: {
      getDebugName
    },
    $mobx
  });
}

// node_modules/yummies/complex.js
var createPubSub = () => {
  const pubSub = ((...args) => {
    pubSub.lastPub = args;
    pubSub.subs.forEach((sub) => {
      sub(...args);
    });
  });
  pubSub.lastPub = void 0;
  pubSub.subs = [];
  pubSub.unsub = (sub) => {
    pubSub.subs = pubSub.subs.filter((it) => it !== sub);
  };
  pubSub.sub = (sub) => {
    pubSub.subs.push(sub);
    return () => pubSub.unsub(sub);
  };
  return pubSub;
};

// node_modules/yummies/data.js
var isShallowEqual = (a, b) => {
  if (a === b) return true;
  if (typeof a !== "object" || typeof b !== "object" || a === null || b === null) return false;
  if (a.constructor !== b.constructor) return false;
  const isArrayA = Array.isArray(a);
  if (isArrayA !== Array.isArray(b)) return false;
  if (isArrayA) {
    const arrA = a;
    const arrB = b;
    if (arrA.length !== arrB.length) return false;
    for (const [i, element] of arrA.entries()) if (element !== arrB[i]) return false;
    return true;
  }
  if (a instanceof Date) return a.getTime() === b.getTime();
  if (a instanceof RegExp) return a.toString() === b.toString();
  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);
  if (aKeys.length !== bKeys.length) return false;
  const bObj = b;
  for (const key2 of aKeys) if (!Object.hasOwn(bObj, key2) || a[key2] !== bObj[key2]) return false;
  return true;
};

// node_modules/yummies/mobx.js
var computedEqualsResolvers = {
  true: comparer.default,
  shallow: comparer.shallow,
  struct: comparer.structural
};
var applyObservable = (context, annotationsArray, useDecorators) => {
  if (useDecorators) {
    annotationsArray.forEach(([annotation, ...fields]) => {
      fields.forEach((field) => {
        annotation(context, field);
      });
    });
    makeObservable(context);
  } else {
    const annotationsObject = {};
    annotationsArray.forEach(([annotation, ...fields]) => {
      fields.forEach((field) => {
        annotationsObject[field] = annotation;
      });
    });
    makeObservable(context, annotationsObject);
  }
};

// node_modules/yummies/html.js
var startViewTransitionSafety = (fn, params) => {
  if (typeof document !== "undefined" && document.startViewTransition && !params?.disabled) return document.startViewTransition(fn);
  fn();
};

// node_modules/mobx-view-model/index.js
var mergeVMConfigs = (...configs) => {
  const result = {
    ...viewModelsConfig,
    startViewTransitions: structuredClone(viewModelsConfig.startViewTransitions),
    observable: {
      viewModels: { ...viewModelsConfig.observable.viewModels },
      viewModelStores: { ...viewModelsConfig.observable.viewModelStores }
    }
  };
  configs.forEach((config) => {
    if (!config) return;
    const { startViewTransitions, comparePayload, observable: observable2, ...otherConfigUpdates } = config;
    if (startViewTransitions) {
      const startViewTransitonsUpdate = typeof startViewTransitions === "boolean" ? {
        mount: startViewTransitions,
        payloadChange: startViewTransitions,
        unmount: startViewTransitions
      } : startViewTransitions;
      Object.assign(result.startViewTransitions, startViewTransitonsUpdate);
    }
    if (observable2?.viewModels) Object.assign(result.observable.viewModels, observable2.viewModels || {});
    if (observable2?.viewModelStores) Object.assign(result.observable.viewModelStores, observable2.viewModelStores || {});
    if (comparePayload != null) result.comparePayload = comparePayload;
    Object.assign(result, otherConfigUpdates);
  });
  return result;
};
var emptyObject = Object.freeze({});
var noop3 = () => {
};
var isClient = typeof window !== "undefined";
if (false) noop3.displayName = "DefaultFallback";
var key = "@view-model@";
var _internals = {
  key,
  emptyObject,
  noop: noop3,
  isClient,
  marker: Symbol.for(key),
  comparer: {
    shallow: isShallowEqual,
    strict: comparer.structural
  }
};
var isViewModel = (value) => value[_internals.marker] === true;
var isViewModelClass = (value) => value.prototype[_internals.marker] === true;
var isViewModelSimple = (value) => !isViewModel(value);
var isViewModelSimpleClass = (value) => !isViewModelClass(value);
var _a;
globalThis[_a = _internals.marker] ?? (globalThis[_a] = {
  mode: "csr-only",
  comparePayload: false,
  payloadComputed: "struct",
  payloadObservable: "ref",
  startViewTransitions: {
    mount: false,
    payloadChange: false,
    unmount: false
  },
  observable: {
    viewModels: { useDecorators: true },
    viewModelStores: { useDecorators: true }
  },
  getPayload: (allProps) => allProps.payload ?? _internals.emptyObject,
  factory: (config) => {
    const VM = config.VM;
    if (isViewModelSimpleClass(VM)) {
      const instance = new VM();
      instance.id ?? (instance.id = config.id);
      return instance;
    }
    return new VM({
      ...config,
      vmConfig: mergeVMConfigs(config.vmConfig)
    });
  },
  hooks: { storeCreate: createPubSub() }
});
var viewModelsConfig = globalThis[_internals.marker];
var applyObservable2 = (context, annotationsArray, observableConfig) => {
  if (observableConfig.custom) return observableConfig.custom(context, annotationsArray);
  applyObservable(context, annotationsArray, observableConfig.useDecorators);
};
var baseAnnotations$1 = [[
  computed,
  "isMounted",
  "isHydrated",
  "parentViewModel"
], [
  action,
  "willMount",
  "didMount",
  "didUnmount",
  "willUnmount",
  "mount",
  "unmount"
]];
var _mountPromise, _vm, _a2;
var ViewModelBase = (_a2 = class {
  constructor(params) {
    __publicField(this, "abortController");
    __publicField(this, "unmountSignal");
    __publicField(this, "id");
    __publicField(this, "vm");
    __publicField(this, "props");
    /** In-flight mount(); re-entrant calls must reuse the same Promise. */
    __privateAdd(this, _mountPromise);
    __privateAdd(this, _vm);
    this.id = params.id;
    const config = mergeVMConfigs(params.vmConfig);
    __privateSet(this, _vm, makeObservable({
      params,
      config,
      data: params.data,
      state: "init",
      payloadComparator: _internals.comparer[config.comparePayload] || config.comparePayload || void 0,
      payload: params.payload
    }, {
      state: observable.ref,
      payload: config.payloadObservable && observable[config.payloadObservable]
    }));
    this.vm = __privateGet(this, _vm);
    this.props = params.props ?? {};
    this.abortController = new AbortController();
    this.unmountSignal = this.abortController.signal;
    const annotations = [...baseAnnotations$1];
    if (__privateGet(this, _vm).config.payloadComputed) if (__privateGet(this, _vm).config.payloadComputed === "struct") annotations.push([computed({ equals: comparer.structural }), "payload"]);
    else annotations.push([computed({ equals: __privateGet(this, _vm).config.payloadComputed === true ? void 0 : __privateGet(this, _vm).config.payloadComputed }), "payload"]);
    applyObservable2(this, annotations, __privateGet(this, _vm).config.observable.viewModels);
  }
  get payload() {
    return __privateGet(this, _vm).payload;
  }
  get viewModels() {
    if (false) console.error("Error #3: No access to ViewModelStore.\nThis happened because [viewModels] param is not provided during to creating instance ViewModelBase.\nMore info: https://js2me.github.io/mobx-view-model/errors/3");
    return __privateGet(this, _vm).params.viewModels;
  }
  get isMounted() {
    return __privateGet(this, _vm).state === "mounted" || __privateGet(this, _vm).state === "hydrated";
  }
  get isHydrated() {
    return __privateGet(this, _vm).state === "hydrated";
  }
  willUnmount() {
  }
  /**
  * Empty method to be overridden
  */
  willMount() {
  }
  /**
  * The method is called when the view starts mounting
  */
  mount() {
    if (this.isMounted) return;
    if (__privateGet(this, _mountPromise)) return __privateGet(this, _mountPromise);
    if (this.abortController.signal.aborted) {
      this.abortController = new AbortController();
      this.unmountSignal = this.abortController.signal;
    }
    __privateGet(this, _vm).state = "mounting";
    const result = this.willMount();
    const finalizeMount = () => {
      if (__privateGet(this, _vm).state !== "mounting") return;
      __privateGet(this, _vm).config.onMount?.(this);
      startViewTransitionSafety(() => {
        runInAction(() => {
          __privateGet(this, _vm).state = "mounted";
          this.didMount();
        });
      }, { disabled: !__privateGet(this, _vm).config.startViewTransitions.mount });
    };
    if (result != null && typeof result.then === "function") {
      __privateSet(this, _mountPromise, Promise.resolve(result).then(finalizeMount));
      return __privateGet(this, _mountPromise);
    }
    return finalizeMount();
  }
  /**
  * The method is called when the view was mounted
  */
  didMount() {
  }
  /**
  * The method is called when the view starts unmounting
  */
  unmount() {
    __privateSet(this, _mountPromise, void 0);
    runInAction(() => __privateGet(this, _vm).state = "unmounting");
    this.willUnmount();
    __privateGet(this, _vm).config.onUnmount?.(this);
    startViewTransitionSafety(() => {
      if (__privateGet(this, _vm).state !== "unmounting") return;
      runInAction(() => __privateGet(this, _vm).state = "unmounted");
      this.didUnmount();
      this.abortController.abort();
    }, { disabled: !__privateGet(this, _vm).config.startViewTransitions.unmount });
  }
  /**
  * The method is called when the view was unmounted
  */
  didUnmount() {
  }
  /**
  * Checks whether the given view model is a child of the current view model.
  * When `deep` is `true`, checks the whole parent chain.
  *
  * [**Documentation**](https://js2me.github.io/mobx-view-model/api/view-models/base-implementation#haschild-vm-anyviewmodel--anyviewmodelsimple-deep-boolean-boolean)
  */
  hasChild(vm, deep) {
    if (deep) {
      let usedVm = vm;
      while (usedVm) if (usedVm.parentViewModel === this) return true;
      else usedVm = usedVm.parentViewModel;
      return false;
    }
    return vm.parentViewModel === this;
  }
  /**
  * Checks whether the given view model is a parent of the current view model.
  * When `deep` is `true`, checks the whole parent chain.
  *
  * [**Documentation**](https://js2me.github.io/mobx-view-model/api/view-models/base-implementation#hasparent-vm-anyviewmodel--anyviewmodelsimple-deep-boolean-boolean)
  */
  hasParent(vm, deep) {
    if (deep) {
      let usedVm = this.parentViewModel;
      while (usedVm) if (usedVm === vm) return true;
      else usedVm = usedVm.parentViewModel;
      return false;
    } else return this.parentViewModel === vm;
  }
  /**
  * Returns the parent view model
  */
  get parentViewModel() {
    return __privateGet(this, _vm).params.parentViewModel;
  }
  /**
  * The method is called when the payload changes in the react component
  */
  setPayload(payload) {
    const isEqual = !!__privateGet(this, _vm).payloadComparator?.(__privateGet(this, _vm).payload, payload);
    if (!isEqual) startViewTransitionSafety(() => runInAction(() => __privateGet(this, _vm).payload = payload), { disabled: !__privateGet(this, _vm).config.startViewTransitions.payloadChange });
    return isEqual;
  }
}, _mountPromise = new WeakMap(), _vm = new WeakMap(), _a2.prototype[_internals.marker] = true, _a2);
var baseAnnotations = [[
  action,
  "link",
  "unlink"
]];
var ViewModelStoreBase = class {
  constructor(config) {
    __publicField(this, "config");
    __publicField(this, "viewModels");
    __publicField(this, "linkedAnchorVMClasses");
    __publicField(this, "viewModelIdsByClasses");
    __publicField(this, "vmConfig");
    __publicField(this, "resource");
    this.config = config;
    this.viewModels = observable.map([], { deep: false });
    this.linkedAnchorVMClasses = observable.map([], { deep: false });
    this.viewModelIdsByClasses = observable.map([], { deep: true });
    this.vmConfig = mergeVMConfigs(config?.vmConfig);
    this.resource = config?.resource ?? this.vmConfig.resource;
    applyObservable2(this, baseAnnotations, this.vmConfig.observable.viewModelStores);
    this.vmConfig.hooks.storeCreate(this);
  }
  connect(instance, config) {
    this.link(config.VM, ...config.anchors ?? []);
    this.viewModels.set(config.id, instance);
    this.attachVMConstructor(instance);
    instance.init?.({
      ...config,
      viewModels: this
    });
  }
  /**
  * Defines a view model: returns the existing instance if one with the same ID
  * is already registered, otherwise creates a new instance, connects it to the
  * store, and returns it.
  *
  * [**Documentation**](https://js2me.github.io/mobx-view-model/api/view-model-store/interface#define)
  */
  define(config) {
    config.id = this.generateId(config);
    const existing = untracked(() => this.viewModels.get(config.id));
    if (existing) return existing;
    const instance = this.create(config);
    this.connect(instance, config);
    return instance;
  }
  unmount(instance) {
    instance.unmount?.();
    this.dettachVMConstructor(instance);
    if (instance.id) this.viewModels.delete(instance.id);
  }
  /**
  * [**Documentation**](https://js2me.github.io/mobx-view-model/api/view-model-store/interface#createviewmodel-config)
  * Creates a new view model instance based on the provided configuration.
  * @param config - The configuration for creating the view model.
  * @returns The newly created view model instance.
  */
  create(config) {
    const vmConfig = mergeVMConfigs(this.vmConfig, config.vmConfig);
    const vmParams = {
      ...config,
      vmConfig
    };
    return config?.factory?.(config) ?? vmConfig.factory(vmParams);
  }
  /**
  * [**Documentation**](https://js2me.github.io/mobx-view-model/api/view-model-store/interface#generateid-config)
  * Generates a unique ID for a view model based on the provided configuration.
  * @param config - The configuration for generating the ID.
  * @returns The generated unique ID.
  */
  generateId(config) {
    return config.id;
  }
  /**
  * [**Documentation**](https://js2me.github.io/mobx-view-model/api/view-model-store/interface#link)
  * Link anchors (React components) with view model class.
  * @param VM - The view model class to link to.
  * @param anchors - The anchors to link.
  */
  link(VM, ...anchors) {
    anchors.forEach((anchor) => {
      if (anchor && !this.linkedAnchorVMClasses.has(anchor)) this.linkedAnchorVMClasses.set(anchor, VM);
    });
  }
  /**
  * [**Documentation**](https://js2me.github.io/mobx-view-model/api/view-model-store/interface#unlink)
  * Unlink anchors (React components) with view model class.
  * @param anchors - The anchors to unlink.
  */
  unlink(...anchors) {
    anchors.forEach((anchor) => {
      if (anchor && this.linkedAnchorVMClasses.has(anchor)) this.linkedAnchorVMClasses.delete(anchor);
    });
  }
  /**
  * [**Documentation**](https://js2me.github.io/mobx-view-model/api/view-model-store/interface#getids-vmlookup)
  * @param vmLookup - The ID or class type of the view model. See {@link ViewModelLookup}.
  * @returns The IDs of the view models
  */
  getIds(vmLookup) {
    if (!vmLookup) return [];
    if (typeof vmLookup === "string") return [vmLookup];
    const viewModelClass = this.linkedAnchorVMClasses.get(vmLookup) || vmLookup;
    return [...this.viewModelIdsByClasses.get(viewModelClass) || []];
  }
  /**
  * [**Documentation**](https://js2me.github.io/mobx-view-model/api/view-model-store/interface#getid-vmlookup)
  * @param vmLookup - The ID or class type of the view model. See {@link ViewModelLookup}.
  * @returns The ID of the view model, or null if not found.
  */
  getId(vmLookup) {
    const viewModelIds = this.getIds(vmLookup);
    if (viewModelIds.length === 0) return null;
    if (false) console.warn(`Found more than 1 view model with the same identifier. Last instance will been returned`);
    return viewModelIds.at(-1);
  }
  /**
  * [**Documentation**](https://js2me.github.io/mobx-view-model/api/view-model-store/interface#has-vmlookup)
  * @param vmLookup - The ID or class type of the view model. See {@link ViewModelLookup}.
  * @returns True if the instance exists, false otherwise.
  */
  has(vmLookup) {
    const id = this.getId(vmLookup);
    if (!id) return false;
    return this.viewModels.has(id);
  }
  /**
  * [**Documentation**](https://js2me.github.io/mobx-view-model/api/view-model-store/interface#get-vmlookup)
  * @param vmLookup - The ID or class type of the view model. See {@link ViewModelLookup}.
  * @returns The view model instance, or null if not found.
  */
  get(vmLookup) {
    const id = this.getId(vmLookup);
    if (!id) return null;
    return this.viewModels.get(id) ?? null;
  }
  /**
  * [**Documentation**](https://js2me.github.io/mobx-view-model/api/view-model-store/interface#getall-vmlookup)
  * @param vmLookup - The ID or class type of the view model. See {@link ViewModelLookup}.
  * @returns All view model instances matching the lookup.
  */
  getAll(vmLookup) {
    return this.getIds(vmLookup).map((id) => this.viewModels.get(id));
  }
  /**
  * Indexes the instance id by its class so `get(CartPageVM)` / `useViewModel(CartPageVM)` work.
  */
  attachVMConstructor(model) {
    const constructor = model.constructor;
    const modelId = model.id;
    const vmIds = this.viewModelIdsByClasses.get(constructor);
    if (vmIds) {
      if (!vmIds.includes(modelId)) vmIds.push(modelId);
    } else this.viewModelIdsByClasses.set(constructor, [modelId]);
  }
  dettachVMConstructor(model) {
    const constructor = model.constructor;
    if (this.viewModelIdsByClasses.has(constructor)) {
      const vmIds = this.viewModelIdsByClasses.get(constructor).filter((it) => it !== model.id);
      if (vmIds.length > 0) this.viewModelIdsByClasses.set(constructor, vmIds);
      else this.viewModelIdsByClasses.delete(constructor);
    }
  }
  clean() {
    this.viewModels.clear();
    this.linkedAnchorVMClasses.clear();
    this.viewModelIdsByClasses.clear();
  }
};

// node_modules/mobx-view-model-react/index.js
import * as React2 from "react";
import { createContext, createElement, forwardRef as forwardRef2, useContext, useEffect, useId, useLayoutEffect, useRef, useState as useState5, useSyncExternalStore as useSyncExternalStore2 } from "react";

// node_modules/mobx-react-lite/es/utils/assertEnvironment.js
import { useState } from "react";
if (!useState) {
  throw new Error("mobx-react-lite requires React with Hooks support");
}
if (!makeObservable) {
  throw new Error("mobx-react-lite@3 requires mobx at least version 6 to be available");
}

// scripts/react-batching.ts
function unstable_batchedUpdates(callback) {
  return callback();
}

// node_modules/mobx-react-lite/es/utils/observerBatching.js
function defaultNoopBatch(callback) {
  callback();
}
function observerBatching(reactionScheduler3) {
  if (!reactionScheduler3) {
    reactionScheduler3 = defaultNoopBatch;
    if (false) {
      console.warn("[MobX] Failed to get unstable_batched updates from react-dom / react-native");
    }
  }
  configure({ reactionScheduler: reactionScheduler3 });
}

// node_modules/mobx-react-lite/es/useObserver.js
import React from "react";

// node_modules/mobx-react-lite/es/utils/printDebugValue.js
function printDebugValue(v) {
  return getDependencyTree(v);
}

// node_modules/mobx-react-lite/es/staticRendering.js
var globalIsUsingStaticRendering = false;
function isUsingStaticRendering() {
  return globalIsUsingStaticRendering;
}

// node_modules/mobx-react-lite/es/utils/UniversalFinalizationRegistry.js
var REGISTRY_FINALIZE_AFTER = 1e4;
var REGISTRY_SWEEP_INTERVAL = 1e4;
var TimerBasedFinalizationRegistry = (
  /** @class */
  (function() {
    function TimerBasedFinalizationRegistry2(finalize) {
      var _this = this;
      Object.defineProperty(this, "finalize", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: finalize
      });
      Object.defineProperty(this, "registrations", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: /* @__PURE__ */ new Map()
      });
      Object.defineProperty(this, "sweepTimeout", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, "sweep", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: function(maxAge) {
          if (maxAge === void 0) {
            maxAge = REGISTRY_FINALIZE_AFTER;
          }
          clearTimeout(_this.sweepTimeout);
          _this.sweepTimeout = void 0;
          var now = Date.now();
          _this.registrations.forEach(function(registration, token) {
            if (now - registration.registeredAt >= maxAge) {
              _this.finalize(registration.value);
              _this.registrations.delete(token);
            }
          });
          if (_this.registrations.size > 0) {
            _this.scheduleSweep();
          }
        }
      });
      Object.defineProperty(this, "finalizeAllImmediately", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: function() {
          _this.sweep(0);
        }
      });
    }
    Object.defineProperty(TimerBasedFinalizationRegistry2.prototype, "register", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(target, value, token) {
        this.registrations.set(token, {
          value,
          registeredAt: Date.now()
        });
        this.scheduleSweep();
      }
    });
    Object.defineProperty(TimerBasedFinalizationRegistry2.prototype, "unregister", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(token) {
        this.registrations.delete(token);
      }
    });
    Object.defineProperty(TimerBasedFinalizationRegistry2.prototype, "scheduleSweep", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function() {
        if (this.sweepTimeout === void 0) {
          this.sweepTimeout = setTimeout(this.sweep, REGISTRY_SWEEP_INTERVAL);
        }
      }
    });
    return TimerBasedFinalizationRegistry2;
  })()
);
var UniversalFinalizationRegistry = typeof FinalizationRegistry !== "undefined" ? FinalizationRegistry : TimerBasedFinalizationRegistry;

// node_modules/mobx-react-lite/es/utils/observerFinalizationRegistry.js
var observerFinalizationRegistry = new UniversalFinalizationRegistry(function(adm) {
  var _a5;
  (_a5 = adm.reaction) === null || _a5 === void 0 ? void 0 : _a5.dispose();
  adm.reaction = null;
});

// scripts/react-external-store.ts
import { useSyncExternalStore } from "react";

// node_modules/mobx-react-lite/es/useObserver.js
function createReaction(adm) {
  adm.reaction = new Reaction("observer".concat(adm.name), function() {
    var _a5;
    adm.stateVersion = /* @__PURE__ */ Symbol();
    (_a5 = adm.onStoreChange) === null || _a5 === void 0 ? void 0 : _a5.call(adm);
  });
}
function useObserver(render, baseComponentName) {
  if (baseComponentName === void 0) {
    baseComponentName = "observed";
  }
  if (isUsingStaticRendering()) {
    return render();
  }
  var admRef = React.useRef(null);
  if (!admRef.current) {
    var adm_1 = {
      reaction: null,
      onStoreChange: null,
      stateVersion: /* @__PURE__ */ Symbol(),
      name: baseComponentName,
      subscribe: function(onStoreChange) {
        observerFinalizationRegistry.unregister(adm_1);
        adm_1.onStoreChange = onStoreChange;
        if (!adm_1.reaction) {
          createReaction(adm_1);
          adm_1.stateVersion = /* @__PURE__ */ Symbol();
        }
        return function() {
          var _a5;
          adm_1.onStoreChange = null;
          (_a5 = adm_1.reaction) === null || _a5 === void 0 ? void 0 : _a5.dispose();
          adm_1.reaction = null;
        };
      },
      getSnapshot: function() {
        return adm_1.stateVersion;
      }
    };
    admRef.current = adm_1;
  }
  var adm = admRef.current;
  if (!adm.reaction) {
    createReaction(adm);
    observerFinalizationRegistry.register(admRef, adm, adm);
  }
  React.useDebugValue(adm.reaction, printDebugValue);
  useSyncExternalStore(
    // Both of these must be stable, otherwise it would keep resubscribing every render.
    adm.subscribe,
    adm.getSnapshot,
    adm.getSnapshot
  );
  var renderResult;
  var exception;
  adm.reaction.track(function() {
    try {
      renderResult = render();
    } catch (e) {
      exception = e;
    }
  });
  if (exception) {
    throw exception;
  }
  return renderResult;
}

// node_modules/mobx-react-lite/es/observer.js
import { forwardRef, memo } from "react";
var _a3;
var _b;
var hasSymbol = typeof Symbol === "function" && Symbol.for;
var isFunctionNameConfigurable2 = (_b = (_a3 = Object.getOwnPropertyDescriptor(function() {
}, "name")) === null || _a3 === void 0 ? void 0 : _a3.configurable) !== null && _b !== void 0 ? _b : false;
var ReactForwardRefSymbol = hasSymbol ? /* @__PURE__ */ Symbol.for("react.forward_ref") : typeof forwardRef === "function" && forwardRef(function(props) {
  return null;
})["$$typeof"];
var ReactMemoSymbol = hasSymbol ? /* @__PURE__ */ Symbol.for("react.memo") : typeof memo === "function" && memo(function(props) {
  return null;
})["$$typeof"];
function observer(baseComponent, options) {
  var _a5;
  if (false) {
    warnObserverOptionsDeprecated = false;
    console.warn("[mobx-react-lite] `observer(fn, { forwardRef: true })` is deprecated, use `observer(React.forwardRef(fn))`");
  }
  if (ReactMemoSymbol && baseComponent["$$typeof"] === ReactMemoSymbol) {
    throw new Error("[mobx-react-lite] You are trying to use `observer` on a function component wrapped in either another `observer` or `React.memo`. The observer already applies 'React.memo' for you.");
  }
  if (isUsingStaticRendering()) {
    return baseComponent;
  }
  var useForwardRef = (_a5 = options === null || options === void 0 ? void 0 : options.forwardRef) !== null && _a5 !== void 0 ? _a5 : false;
  var render = baseComponent;
  var baseComponentName = baseComponent.displayName || baseComponent.name;
  if (ReactForwardRefSymbol && baseComponent["$$typeof"] === ReactForwardRefSymbol) {
    useForwardRef = true;
    render = baseComponent["render"];
    if (typeof render !== "function") {
      throw new Error("[mobx-react-lite] `render` property of ForwardRef was not a function");
    }
  }
  var observerComponent = function(props, ref) {
    return useObserver(function() {
      return render(props, ref);
    }, baseComponentName);
  };
  observerComponent.displayName = baseComponent.displayName;
  if (isFunctionNameConfigurable2) {
    Object.defineProperty(observerComponent, "name", {
      value: baseComponent.name,
      writable: true,
      configurable: true
    });
  }
  if (baseComponent.contextTypes) {
    ;
    observerComponent.contextTypes = baseComponent.contextTypes;
    if (false) {
      warnLegacyContextTypes = false;
      console.warn("[mobx-react-lite] Support for Legacy Context in function components will be removed in the next major release.");
    }
  }
  if (useForwardRef) {
    observerComponent = forwardRef(observerComponent);
  }
  observerComponent = memo(observerComponent);
  copyStaticProperties(baseComponent, observerComponent);
  if (false) {
    Object.defineProperty(observerComponent, "contextTypes", {
      set: function() {
        var _a6, _b2;
        throw new Error("[mobx-react-lite] `".concat(this.displayName || ((_a6 = this.type) === null || _a6 === void 0 ? void 0 : _a6.displayName) || ((_b2 = this.type) === null || _b2 === void 0 ? void 0 : _b2.name) || "Component", ".contextTypes` must be set before applying `observer`."));
      }
    });
  }
  return observerComponent;
}
var hoistBlackList = {
  $$typeof: true,
  render: true,
  compare: true,
  type: true,
  // Don't redefine `displayName`,
  // it's defined as getter-setter pair on `memo` (see #3192).
  displayName: true
};
function copyStaticProperties(base, target) {
  Object.keys(base).forEach(function(key2) {
    if (!hoistBlackList[key2]) {
      Object.defineProperty(target, key2, Object.getOwnPropertyDescriptor(base, key2));
    }
  });
}

// node_modules/mobx-react-lite/es/ObserverComponent.js
function ObserverComponent(_a5) {
  var children = _a5.children, render = _a5.render;
  if (children && render) {
    console.error("MobX Observer: Do not use children and render in the same time in `Observer`");
  }
  var component = children || render;
  if (typeof component !== "function") {
    return null;
  }
  return useObserver(component);
}
if (false) {
  ObserverComponent.propTypes = {
    children: ObserverPropsCheck,
    render: ObserverPropsCheck
  };
}
ObserverComponent.displayName = "Observer";

// node_modules/mobx-react-lite/es/useLocalObservable.js
import { useState as useState2 } from "react";

// node_modules/mobx-react-lite/es/useLocalStore.js
import { useState as useState4 } from "react";

// node_modules/mobx-react-lite/es/useAsObservableSource.js
import { useState as useState3 } from "react";

// node_modules/mobx-react-lite/es/index.js
var _a4;
observerBatching(unstable_batchedUpdates);
var clearTimers = (_a4 = observerFinalizationRegistry["finalizeAllImmediately"]) !== null && _a4 !== void 0 ? _a4 : (function() {
});

// node_modules/mobx-view-model-react/index.js
import { Fragment, jsx } from "react/jsx-runtime";
var symbol$1 = /* @__PURE__ */ Symbol.for(`${_internals.key}/react/avm-ctx`);
globalThis[symbol$1] ?? (globalThis[symbol$1] = createContext(null));
var ActiveViewModelContext = globalThis[symbol$1];
if (false) ActiveViewModelContext.displayName = "ActiveViewModel";
var symbol = /* @__PURE__ */ Symbol.for(`${_internals.key}/react/vms-ctx`);
globalThis[symbol] ?? (globalThis[symbol] = createContext(null));
var ViewModelsContext = globalThis[symbol];
if (false) ViewModelsContext.displayName = "ViewModels";
var ActiveViewModelProvider = ActiveViewModelContext.Provider;
var reactUse = React2.use;
var unconfirmed = /* @__PURE__ */ new Map();
var orphanCleanupScheduled = false;
var committedOwners = /* @__PURE__ */ new WeakMap();
var acquireVm = (vm) => {
  committedOwners.set(vm, (committedOwners.get(vm) ?? 0) + 1);
};
var releaseVm = (vm, store) => {
  const owners = committedOwners.get(vm);
  if (!owners) return;
  if (owners > 1) {
    committedOwners.set(vm, owners - 1);
    return;
  }
  committedOwners.delete(vm);
  runInAction(() => {
    if (store && (vm.id == null || store.get(vm.id) === vm)) store.unmount(vm);
    else vm.unmount?.();
  });
};
var registerUnconfirmed = (vm, store) => {
  unconfirmed.set(vm, store);
  return { vm };
};
var scheduleOrphanCleanup = () => {
  if (orphanCleanupScheduled) return;
  orphanCleanupScheduled = true;
  setTimeout(() => {
    orphanCleanupScheduled = false;
    if (unconfirmed.size === 0) return;
    for (const [vm, store] of unconfirmed) {
      unconfirmed.delete(vm);
      runInAction(() => {
        if (store) store.unmount(vm);
        else vm.unmount?.();
      });
    }
  });
};
var confirmCreation = (entry) => {
  unconfirmed.delete(entry.vm);
  if (unconfirmed.size > 0) scheduleOrphanCleanup();
};
var stagedStores = /* @__PURE__ */ new WeakMap();
var stagedVmRegistry = typeof FinalizationRegistry === "function" ? new FinalizationRegistry(({ store, id, vm }) => {
  const stagedStore = stagedStores.get(store);
  if (stagedStore?.entries.get(id)?.vm === vm) stagedStore?.entries.delete(id);
}) : null;
var getStagedStore = (store) => {
  let stagedStore = stagedStores.get(store);
  if (!stagedStore) {
    stagedStore = {
      entries: /* @__PURE__ */ new Map(),
      epoch: 0,
      sweepScheduled: false
    };
    stagedStores.set(store, stagedStore);
  }
  return stagedStore;
};
var getStaged = (store, lookup) => {
  const stagedStore = stagedStores.get(store);
  if (!stagedStore) return null;
  if (typeof lookup === "string") return stagedStore.entries.get(lookup)?.vm ?? null;
  for (const entry of [...stagedStore.entries.values()].reverse()) if (entry.config.VM === lookup || entry.config.anchors?.includes(lookup)) return entry.vm;
  return null;
};
var getRenderPhaseViewModel = (store, lookup) => getStaged(store, lookup) ?? store.get(lookup);
var createRenderPhaseStore = (store) => new Proxy(store, { get(target, property, receiver) {
  if (property === "get") return (lookup) => getRenderPhaseViewModel(target, lookup);
  if (property === "has") return (lookup) => getRenderPhaseViewModel(target, lookup) != null;
  if (property === "getIds") return (lookup) => {
    const ids = target.getIds(lookup);
    if (typeof lookup === "string") return ids;
    const stagedStore = stagedStores.get(target);
    for (const [id, entry] of stagedStore?.entries ?? []) if ((entry.config.VM === lookup || entry.config.anchors?.includes(lookup)) && !ids.includes(id)) ids.push(id);
    return ids;
  };
  if (property === "getId") return (lookup) => {
    return receiver.getIds(lookup).at(-1) ?? null;
  };
  if (property === "getAll") return (lookup) => receiver.getIds(lookup).map((id) => getRenderPhaseViewModel(target, id)).filter((vm) => vm != null);
  return Reflect.get(target, property, receiver);
} });
var stageViewModel = (store, config, owner) => {
  config.id = store.generateId(config);
  const existing = store.get(config.id);
  if (existing) return existing;
  const stagedStore = getStagedStore(store);
  const staged = stagedStore.entries.get(config.id);
  if (staged) return staged.vm;
  const vm = store.create({
    ...config,
    viewModels: createRenderPhaseStore(store)
  });
  stagedStore.entries.set(config.id, {
    vm,
    config,
    epoch: ++stagedStore.epoch
  });
  stagedVmRegistry?.register(owner, {
    store,
    id: config.id,
    vm
  }, vm);
  return vm;
};
var scheduleSweep = (stagedStore) => {
  if (stagedStore.sweepScheduled) return;
  stagedStore.sweepScheduled = true;
  const epochAtCommit = stagedStore.epoch;
  setTimeout(() => {
    stagedStore.sweepScheduled = false;
    for (const [id, entry] of stagedStore.entries) if (entry.epoch <= epochAtCommit) {
      stagedStore.entries.delete(id);
      stagedVmRegistry?.unregister(entry.vm);
    }
  });
};
var commitStagedViewModel = (store, config, vm) => {
  const stagedStore = getStagedStore(store);
  if (stagedStore.entries.get(config.id)?.vm === vm) stagedStore.entries.delete(config.id);
  stagedVmRegistry?.unregister(vm);
  if (store.get(config.id) === vm) {
    scheduleSweep(stagedStore);
    return;
  }
  runInAction(() => {
    store.connect(vm, config);
  });
  scheduleSweep(stagedStore);
};
var EMPTY_ARR = [];
var { emptyObject: emptyObject2, noop: noop4 } = _internals;
var isProd = true;
var subscribeNoop = () => noop4;
var getClientHydrated = () => true;
var getServerHydrated = () => false;
var useCommitEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;
var viewModelPayloadVersions = /* @__PURE__ */ new WeakMap();
var instantiateVm = (id, VM, payload, data, rawCfg, props, viewModels, parentViewModel, stagedOwner) => runInAction(() => {
  const config = {
    ...rawCfg,
    id,
    payload,
    data,
    VM,
    viewModels,
    parentViewModel,
    ctx: rawCfg?.ctx ?? emptyObject2,
    props: props ?? rawCfg?.props
  };
  const instance = viewModels ? stagedOwner ? stageViewModel(viewModels, config, stagedOwner) : viewModels.define(config) : config.factory?.(config) ?? viewModelsConfig.factory(config);
  if (!viewModels) instance.init?.({
    ...config,
    viewModels: void 0
  });
  return {
    instance,
    config
  };
});
var bindModel = (instance, payload, parentViewModel) => {
  if (isViewModelSimple(instance)) {
    instance.parentViewModel = parentViewModel;
    instance.setPayload?.(payload);
  }
};
var bindLifecycle = (instance, payload, parentViewModel) => runInAction(() => {
  bindModel(instance, payload, parentViewModel);
  return isViewModel(instance) && instance.isMounted ? void 0 : instance.mount?.();
});
var mountLifecycle = (instance) => runInAction(() => isViewModel(instance) && instance.isMounted ? void 0 : instance.mount?.());
function useCreateViewModel(VM, payload = emptyObject2, rawCfg, props) {
  const viewModels = useContext(ViewModelsContext);
  const parentViewModel = useContext(ActiveViewModelContext);
  const cache = useRef(null);
  const reactId = useId();
  const isUpdate = !!cache.current;
  const [, forceRender] = useState5(0);
  if (cache.current) {
  } else {
    const isClient2 = _internals.isClient;
    const isSSR = viewModelsConfig.mode === "ssr";
    const vmId = rawCfg?.id ?? (isProd ? reactId : `${reactId}:${VM.name}`);
    const existing = viewModels?.get(vmId);
    const vmResource = viewModels?.resource ?? viewModelsConfig.resource;
    const data = existing ? existing.vm?.data : vmResource?.read(vmId);
    const useStaging = isClient2 && viewModels != null;
    const { instance: model2, config } = instantiateVm(vmId, VM, payload, data, rawCfg, props, viewModels, parentViewModel, useStaging ? cache : void 0);
    const bindAfterCommit = isClient2 && !!viewModels && viewModels.get(config.id) === model2;
    if (isClient2 && !bindAfterCommit) bindModel(model2, payload, parentViewModel);
    cache.current = {
      vm: model2,
      config,
      appliedPayload: payload,
      appliedProps: props,
      bindAfterCommit,
      promise: !isClient2 ? bindLifecycle(model2, payload, parentViewModel) : void 0,
      isSSR,
      creationEntry: useStaging || !isClient2 ? void 0 : registerUnconfirmed(model2, viewModels),
      staged: useStaging || void 0,
      fn: () => {
        if (cache.current.creationEntry) {
          confirmCreation(cache.current.creationEntry);
          cache.current.creationEntry = void 0;
        }
        const vm = cache.current.vm;
        if (cache.current.staged) {
          cache.current.staged = false;
          commitStagedViewModel(viewModels, cache.current.config, vm);
        }
        if (viewModels && isViewModel(vm) && vm.id != null && !viewModels.has(vm.id)) runInAction(() => {
          viewModels.define({
            ...cache.current.config,
            factory: () => vm
          });
        });
        acquireVm(vm);
        const mountResult = mountLifecycle(vm);
        if (mountResult) cache.current.promise = mountResult;
        if (isViewModel(vm) && vm.vm.state === "mounted" && cache.current.isSSR) runInAction(() => {
          vm.vm.state = "hydrated";
        });
        return () => {
          releaseVm(cache.current.vm, viewModels);
        };
      }
    };
  }
  const model = cache.current.vm;
  useCommitEffect(cache.current.fn, EMPTY_ARR);
  useCommitEffect(() => {
    if (cache.current.skipForcedCommit) {
      cache.current.skipForcedCommit = false;
      if (cache.current.appliedProps === props) return;
    }
    if (cache.current.bindAfterCommit) {
      cache.current.bindAfterCommit = false;
      runInAction(() => bindModel(model, payload, parentViewModel));
      if (isViewModelSimple(model)) {
        viewModelPayloadVersions.set(model, (viewModelPayloadVersions.get(model) ?? 0) + 1);
        cache.current.skipForcedCommit = true;
        forceRender((revision) => revision + 1);
      }
    } else if (isUpdate && !Object.is(cache.current.appliedPayload, payload)) {
      cache.current.appliedPayload = payload;
      cache.current.appliedProps = props;
      model.setPayload?.(payload);
      if (isViewModelSimple(model)) {
        viewModelPayloadVersions.set(model, (viewModelPayloadVersions.get(model) ?? 0) + 1);
        cache.current.skipForcedCommit = true;
        forceRender((revision) => revision + 1);
      }
    }
  }, [payload]);
  if (cache.current.isSSR) {
    const pending = cache.current.promise;
    const isHydrated = useSyncExternalStore2(subscribeNoop, getClientHydrated, getServerHydrated);
    if (reactUse && pending && (!_internals.isClient || !isHydrated)) reactUse(pending);
  }
  return model;
}
var OnlyViewModel = observer(({ model, config, payload, children }) => {
  const vm = useCreateViewModel(model, payload, config);
  if (!vm.isMounted) return null;
  if (typeof children === "function") return children(vm);
  return /* @__PURE__ */ jsx(Fragment, { children });
});
var ViewModelsProvider = ViewModelsContext.Provider;
var ReactMemoSymbol2 = /* @__PURE__ */ Symbol.for("react.memo");
var getServerReadySnapshot = () => true;
function withViewModel(VM, rawRenderFn, rawConfig) {
  const config = rawConfig ?? {};
  const anchors = config.anchors ?? (config.anchors = []);
  const getPayload = config.getPayload ?? viewModelsConfig.getPayload;
  const forwardRefMode = !!config.forwardRef;
  const Fallback = config.fallback ?? config.vmConfig?.fallbackComponent ?? viewModelsConfig.fallbackComponent;
  const renderFn = (config.vmConfig?.processRender ?? viewModelsConfig.processRender)?.(rawRenderFn, VM, config) ?? rawRenderFn ?? _internals.noop;
  if (renderFn?.$$typeof === ReactMemoSymbol2) {
    if (false) throw new Error(`Error #4: [mobx-view-model-react] You are trying to wrap a View component in \`observer\` or \`React.memo\` inside \`withViewModel\`. \`withViewModel\` already applies \`observer\` automatically, so do not wrap the View component manually.
More info: https://js2me.github.io/mobx-view-model/errors/4`);
    throw new Error("Error #4: https://js2me.github.io/mobx-view-model/errors/4");
  }
  const simpleView = !isViewModelClass(VM);
  const PayloadVersionContext = createContext(0);
  const View = observer(simpleView ? (props) => {
    useContext(PayloadVersionContext);
    return renderFn(props);
  } : renderFn);
  if (false) View.displayName = `View(${VM.name})`;
  const Wrapper = (allProps, ref) => {
    const viewModels = useContext(ViewModelsContext);
    const model = useCreateViewModel(VM, getPayload(allProps), config, allProps);
    (config.reactHook ?? viewModelsConfig.reactHook)?.(allProps, config.ctx ?? {}, viewModels, ref);
    const cacheRef = useRef();
    if (cacheRef.current) cacheRef.current.value = model;
    else cacheRef.current = {
      value: model,
      subscribe: (onStoreChange) => reaction(() => {
        const current = cacheRef.current.value;
        return !isViewModel(current) || current.isMounted;
      }, () => {
        onStoreChange();
      }),
      getSnapshot: () => {
        const current = cacheRef.current.value;
        return current.isMounted !== false || current.vm.state === "unmounting" || current.vm.state === "unmounted";
      }
    };
    const getServerSnapshot = typeof window !== "undefined" && viewModelsConfig.mode === "ssr" && typeof reactUse === "function" ? getServerReadySnapshot : cacheRef.current.getSnapshot;
    const isReadyToRender = useSyncExternalStore2(cacheRef.current.subscribe, cacheRef.current.getSnapshot, getServerSnapshot);
    let child = null;
    if (isReadyToRender) {
      const viewProps = {
        ...allProps,
        model
      };
      delete viewProps.payload;
      if (forwardRefMode) viewProps.ref = ref;
      child = createElement(View, viewProps);
      if (simpleView) child = createElement(PayloadVersionContext.Provider, { value: viewModelPayloadVersions.get(model) ?? 0 }, child);
    } else if (Fallback) child = createElement(Fallback);
    return createElement(ActiveViewModelProvider, cacheRef.current, child);
  };
  if (false) Wrapper.displayName = `withViewModel(${VM.name})`;
  const ConnectVMComponent = forwardRefMode ? forwardRef2(Wrapper) : Wrapper;
  anchors.push(ConnectVMComponent);
  ConnectVMComponent.connect = (anchor) => {
    if (!anchors.includes(anchor)) anchors.push(anchor);
    return ConnectVMComponent;
  };
  return ConnectVMComponent;
}
export {
  ViewModelBase,
  ViewModelStoreBase,
  ViewModelsProvider,
  action,
  comparer,
  computed,
  makeAutoObservable,
  makeObservable,
  observable,
  observer,
  reaction,
  runInAction,
  useCreateViewModel,
  withViewModel
};
//# sourceMappingURL=mvvm.js.map
