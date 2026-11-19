var ri = Object.defineProperty;
var Or = (e) => {
  throw TypeError(e);
};
var ni = (e, t, n) => t in e ? ri(e, t, { enumerable: true, configurable: true, writable: true, value: n }) : e[t] = n;
var R = (e, t, n) => ni(e, typeof t !== "symbol" ? t + "" : t, n);
var Er = (e, t, n) => t.has(e) || Or("Cannot " + n);
var m = (e, t, n) => (Er(e, t, "read from private field"), n ? n.call(e) : t.get(e));
var Rt = (e, t, n) => t.has(e) ? Or("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, n);
var tt = (e, t, n, r) => (Er(e, t, "write to private field"), r ? r.call(e, n) : t.set(e, n), n);

// node_modules/mobx/dist/mobx.esm.js
function h(e) {
  for (var t = arguments.length, n = new Array(t > 1 ? t - 1 : 0), r = 1; r < t; r++) {
    n[r - 1] = arguments[r];
  }
  if (false) {
    var i = typeof e === "string" ? e : errors[e];
    if (typeof i === "function") i = i.apply(null, n);
    throw new Error("[MobX] " + i);
  }
  throw new Error(typeof e === "number" ? "[MobX] minified error nr: " + e + (n.length ? " " + n.map(String).join(",") : "") + ". Find the full error at: https://github.com/mobxjs/mobx/blob/main/packages/mobx/src/errors.ts" : "[MobX] " + e);
}
var ii = {};
function vt() {
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
  return ii;
}
var Ur = Object.assign;
var ut = Object.getOwnPropertyDescriptor;
var Q = Object.defineProperty;
var ht = Object.prototype;
var jt = [];
Object.freeze(jt);
var Wt = {};
Object.freeze(Wt);
var oi = typeof Proxy !== "undefined";
var si = /* @__PURE__ */ Object.toString();
function $r() {
  if (!oi) {
    h(false ? "`Proxy` objects are not available in the current environment. Please configure MobX to enable a fallback implementation.`" : "Proxy not available");
  }
}
function zr(e) {
  var t = false;
  return function() {
    if (t) {
      return;
    }
    t = true;
    return e.apply(this, arguments);
  };
}
var Ve = function e() {
};
function G(e) {
  return typeof e === "function";
}
function be(e) {
  var t = typeof e;
  switch (t) {
    case "string":
    case "symbol":
    case "number":
      return true;
  }
  return false;
}
function _t(e) {
  return e !== null && typeof e === "object";
}
function ae(e) {
  if (!_t(e)) {
    return false;
  }
  var t = Object.getPrototypeOf(e);
  if (t == null) {
    return true;
  }
  var n = Object.hasOwnProperty.call(t, "constructor") && t.constructor;
  return typeof n === "function" && n.toString() === si;
}
function Fr(e) {
  var t = e == null ? void 0 : e.constructor;
  if (!t) {
    return false;
  }
  if ("GeneratorFunction" === t.name || "GeneratorFunction" === t.displayName) {
    return true;
  }
  return false;
}
function ze(e, t, n) {
  Q(e, t, {
    enumerable: false,
    writable: true,
    configurable: true,
    value: n
  });
}
function Kr(e, t, n) {
  Q(e, t, {
    enumerable: false,
    writable: false,
    configurable: true,
    value: n
  });
}
function Oe(e, t) {
  var n = "isMobX" + e;
  t.prototype[n] = true;
  return function(r) {
    return _t(r) && r[n] === true;
  };
}
function Ce(e) {
  return e != null && Object.prototype.toString.call(e) === "[object Map]";
}
function ai(e) {
  var t = Object.getPrototypeOf(e);
  var n = Object.getPrototypeOf(t);
  var r = Object.getPrototypeOf(n);
  return r === null;
}
function ne(e) {
  return e != null && Object.prototype.toString.call(e) === "[object Set]";
}
var qr = typeof Object.getOwnPropertySymbols !== "undefined";
function ui(e) {
  var t = Object.keys(e);
  if (!qr) {
    return t;
  }
  var n = Object.getOwnPropertySymbols(e);
  if (!n.length) {
    return t;
  }
  return [].concat(t, n.filter(function(r) {
    return ht.propertyIsEnumerable.call(e, r);
  }));
}
var xe = typeof Reflect !== "undefined" && Reflect.ownKeys ? Reflect.ownKeys : qr ? function(e) {
  return Object.getOwnPropertyNames(e).concat(Object.getOwnPropertySymbols(e));
} : (
  /* istanbul ignore next */
  Object.getOwnPropertyNames
);
function Gr(e) {
  return e === null ? null : typeof e === "object" ? "" + e : e;
}
function oe(e, t) {
  return ht.hasOwnProperty.call(e, t);
}
var ci = Object.getOwnPropertyDescriptors || function e(t) {
  var n = {};
  xe(t).forEach(function(r) {
    n[r] = ut(t, r);
  });
  return n;
};
function T(e, t) {
  return !!(e & t);
}
function j(e, t, n) {
  if (n) {
    e |= t;
  } else {
    e &= ~t;
  }
  return e;
}
function wr(e, t) {
  (null == t || t > e.length) && (t = e.length);
  for (var n = 0, r = Array(t); n < t; n++) r[n] = e[n];
  return r;
}
function li(e, t, n) {
  if (Wr()) return Reflect.construct.apply(null, arguments);
  var r = [null];
  r.push.apply(r, t);
  var i = new (e.bind.apply(e, r))();
  return n && ke(i, n.prototype), i;
}
function Nr(e, t) {
  for (var n = 0; n < t.length; n++) {
    var r = t[n];
    r.enumerable = r.enumerable || false, r.configurable = true, "value" in r && (r.writable = true), Object.defineProperty(e, pi(r.key), r);
  }
}
function Pe(e, t, n) {
  return t && Nr(e.prototype, t), n && Nr(e, n), Object.defineProperty(e, "prototype", {
    writable: false
  }), e;
}
function De(e, t) {
  var n = "undefined" != typeof Symbol && e[Symbol.iterator] || e["@@iterator"];
  if (n) return (n = n.call(e)).next.bind(n);
  if (Array.isArray(e) || (n = vi(e)) || t && e && "number" == typeof e.length) {
    n && (e = n);
    var r = 0;
    return function() {
      return r >= e.length ? {
        done: true
      } : {
        done: false,
        value: e[r++]
      };
    };
  }
  throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function me() {
  return me = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var n = arguments[t];
      for (var r in n) ({}).hasOwnProperty.call(n, r) && (e[r] = n[r]);
    }
    return e;
  }, me.apply(null, arguments);
}
function It(e) {
  return It = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function(t) {
    return t.__proto__ || Object.getPrototypeOf(t);
  }, It(e);
}
function Ht(e, t) {
  e.prototype = Object.create(t.prototype), e.prototype.constructor = e, ke(e, t);
}
function fi(e) {
  try {
    return -1 !== Function.toString.call(e).indexOf("[native code]");
  } catch (t) {
    return "function" == typeof e;
  }
}
function Wr() {
  try {
    var e = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
    }));
  } catch (t) {
  }
  return (Wr = function() {
    return !!e;
  })();
}
function ke(e, t) {
  return ke = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(n, r) {
    return n.__proto__ = r, n;
  }, ke(e, t);
}
function di(e, t) {
  if ("object" != typeof e || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (void 0 !== n) {
    var r = n.call(e, t || "default");
    if ("object" != typeof r) return r;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === t ? String : Number)(e);
}
function pi(e) {
  var t = di(e, "string");
  return "symbol" == typeof t ? t : t + "";
}
function vi(e, t) {
  if (e) {
    if ("string" == typeof e) return wr(e, t);
    var n = {}.toString.call(e).slice(8, -1);
    return "Object" === n && e.constructor && (n = e.constructor.name), "Map" === n || "Set" === n ? Array.from(e) : "Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? wr(e, t) : void 0;
  }
}
function Bt(e) {
  var t = "function" == typeof Map ? /* @__PURE__ */ new Map() : void 0;
  return Bt = function(n) {
    if (null === n || !fi(n)) return n;
    if ("function" != typeof n) throw new TypeError("Super expression must either be null or a function");
    if (void 0 !== t) {
      if (t.has(n)) return t.get(n);
      t.set(n, r);
    }
    function r() {
      return li(n, arguments, It(this).constructor);
    }
    return r.prototype = Object.create(n.prototype, {
      constructor: {
        value: r,
        enumerable: false,
        writable: true,
        configurable: true
      }
    }), ke(r, n);
  }, Bt(e);
}
var J = /* @__PURE__ */ Symbol("mobx-stored-annotations");
function ee(e) {
  function t(n, r) {
    if (Ke(r)) {
      return e.decorate_20223_(n, r);
    } else {
      Fe(n, r, e);
    }
  }
  return Object.assign(t, e);
}
function Fe(e, t, n) {
  if (!oe(e, J)) {
    ze(e, J, me({}, e[J]));
  }
  if (false) {
    var r = e.constructor.name + ".prototype." + t.toString();
    h("'" + r + "' is decorated with 'override', but no such decorated member was found on prototype.");
  }
  hi(e, n, t);
  if (!Ni(n)) {
    e[J][t] = n;
  }
}
function hi(e, t, n) {
  if (false) {
    var r = e.constructor.name + ".prototype." + n.toString();
    var i = e[J][n].annotationType_;
    var o = t.annotationType_;
    h("Cannot apply '@" + o + "' to '" + r + "':" + ("\nThe field is already decorated with '@" + i + "'.") + "\nRe-decorating fields is not allowed.\nUse '@override' decorator for methods overridden by subclass.");
  }
}
function _i(e) {
  if (!oe(e, J)) {
    ze(e, J, me({}, e[J]));
  }
  return e[J];
}
function Ke(e) {
  return typeof e == "object" && typeof e["kind"] == "string";
}
var p = /* @__PURE__ */ Symbol("mobx administration");
var fe = /* @__PURE__ */ (function() {
  function e(n) {
    if (n === void 0) {
      n = false ? "Atom@" + getNextId() : "Atom";
    }
    this.name_ = void 0;
    this.flags_ = 0;
    this.observers_ = /* @__PURE__ */ new Set();
    this.lastAccessedBy_ = 0;
    this.lowestObserverState_ = _.NOT_TRACKING_;
    this.onBOL = void 0;
    this.onBUOL = void 0;
    this.name_ = n;
  }
  var t = e.prototype;
  t.onBO = function n() {
    if (this.onBOL) {
      this.onBOL.forEach(function(r) {
        return r();
      });
    }
  };
  t.onBUO = function n() {
    if (this.onBUOL) {
      this.onBUOL.forEach(function(r) {
        return r();
      });
    }
  };
  t.reportObserved = function n() {
    return cn(this);
  };
  t.reportChanged = function n() {
    $();
    ln(this);
    z();
  };
  t.toString = function n() {
    return this.name_;
  };
  return Pe(e, [{
    key: "isBeingObserved",
    get: function n() {
      return T(this.flags_, e.isBeingObservedMask_);
    },
    set: function n(r) {
      this.flags_ = j(this.flags_, e.isBeingObservedMask_, r);
    }
  }, {
    key: "isPendingUnobservation",
    get: function n() {
      return T(this.flags_, e.isPendingUnobservationMask_);
    },
    set: function n(r) {
      this.flags_ = j(this.flags_, e.isPendingUnobservationMask_, r);
    }
  }, {
    key: "diffValue",
    get: function n() {
      return T(this.flags_, e.diffValueMask_) ? 1 : 0;
    },
    set: function n(r) {
      this.flags_ = j(this.flags_, e.diffValueMask_, r === 1 ? true : false);
    }
  }]);
})();
fe.isBeingObservedMask_ = 1;
fe.isPendingUnobservationMask_ = 2;
fe.diffValueMask_ = 4;
var Xt = /* @__PURE__ */ Oe("Atom", fe);
function Yt(e, t, n) {
  if (t === void 0) {
    t = Ve;
  }
  if (n === void 0) {
    n = Ve;
  }
  var r = new fe(e);
  if (t !== Ve) {
    bn(r, t);
  }
  if (n !== Ve) {
    er(r, n);
  }
  return r;
}
function bi(e, t) {
  return e === t;
}
function mi(e, t) {
  return nr(e, t);
}
function gi(e, t) {
  return nr(e, t, 1);
}
function yi(e, t) {
  if (Object.is) {
    return Object.is(e, t);
  }
  return e === t ? e !== 0 || 1 / e === 1 / t : e !== e && t !== t;
}
var C = {
  identity: bi,
  structural: mi,
  "default": yi,
  shallow: gi
};
function ge(e, t, n) {
  if (wn(e)) {
    return e;
  }
  if (Array.isArray(e)) {
    return w.array(e, {
      name: n
    });
  }
  if (ae(e)) {
    return w.object(e, void 0, {
      name: n
    });
  }
  if (Ce(e)) {
    return w.map(e, {
      name: n
    });
  }
  if (ne(e)) {
    return w.set(e, {
      name: n
    });
  }
  if (typeof e === "function" && !Me(e) && !Ue(e)) {
    if (Fr(e)) {
      return Re(e);
    } else {
      return Le(n, e);
    }
  }
  return e;
}
function Oi(e, t, n) {
  if (e === void 0 || e === null) {
    return e;
  }
  if ($e(e) || wt(e) || we(e) || Y(e)) {
    return e;
  }
  if (Array.isArray(e)) {
    return w.array(e, {
      name: n,
      deep: false
    });
  }
  if (ae(e)) {
    return w.object(e, void 0, {
      name: n,
      deep: false
    });
  }
  if (Ce(e)) {
    return w.map(e, {
      name: n,
      deep: false
    });
  }
  if (ne(e)) {
    return w.set(e, {
      name: n,
      deep: false
    });
  }
  if (false) {
    h("The shallow modifier / decorator can only used in combination with arrays, objects, maps and sets");
  }
}
function bt(e) {
  return e;
}
function Ei(e, t) {
  if (false) {
    h("observable.struct should not be used with observable values");
  }
  if (nr(e, t)) {
    return t;
  }
  return e;
}
var wi = "override";
function Ni(e) {
  return e.annotationType_ === wi;
}
function qe(e, t) {
  return {
    annotationType_: e,
    options_: t,
    make_: Si,
    extend_: Ai,
    decorate_20223_: Vi
  };
}
function Si(e, t, n, r) {
  var i;
  if ((i = this.options_) != null && i.bound) {
    return this.extend_(e, t, n, false) === null ? 0 : 1;
  }
  if (r === e.target_) {
    return this.extend_(e, t, n, false) === null ? 0 : 2;
  }
  if (Me(n.value)) {
    return 1;
  }
  var o = Hr(e, this, t, n, false);
  Q(r, t, o);
  return 2;
}
function Ai(e, t, n, r) {
  var i = Hr(e, this, t, n);
  return e.defineProperty_(t, i, r);
}
function Vi(e, t) {
  if (false) {
    assert20223DecoratorType(t, ["method", "field"]);
  }
  var n = t.kind, r = t.name, i = t.addInitializer;
  var o = this;
  var s = function u(c) {
    var l, d, v, O;
    return ye((l = (d = o.options_) == null ? void 0 : d.name) != null ? l : r.toString(), c, (v = (O = o.options_) == null ? void 0 : O.autoAction) != null ? v : false);
  };
  if (n == "field") {
    return function(u) {
      var c;
      var l = u;
      if (!Me(l)) {
        l = s(l);
      }
      if ((c = o.options_) != null && c.bound) {
        l = l.bind(this);
        l.isMobxAction = true;
      }
      return l;
    };
  }
  if (n == "method") {
    var a;
    if (!Me(e)) {
      e = s(e);
    }
    if ((a = this.options_) != null && a.bound) {
      i(function() {
        var u = this;
        var c = u[r].bind(u);
        c.isMobxAction = true;
        u[r] = c;
      });
    }
    return e;
  }
  h("Cannot apply '" + o.annotationType_ + "' to '" + String(r) + "' (kind: " + n + "):" + ("\n'" + o.annotationType_ + "' can only be used on properties with a function value."));
}
function Di(e, t, n, r) {
  var i = t.annotationType_;
  var o = r.value;
  if (false) {
    h("Cannot apply '" + i + "' to '" + e.name_ + "." + n.toString() + "':" + ("\n'" + i + "' can only be used on properties with a function value."));
  }
}
function Hr(e, t, n, r, i) {
  var o, s, a, u, c, l, d;
  if (i === void 0) {
    i = f.safeDescriptors;
  }
  Di(e, t, n, r);
  var v = r.value;
  if ((o = t.options_) != null && o.bound) {
    var O;
    v = v.bind((O = e.proxy_) != null ? O : e.target_);
  }
  return {
    value: ye(
      (s = (a = t.options_) == null ? void 0 : a.name) != null ? s : n.toString(),
      v,
      (u = (c = t.options_) == null ? void 0 : c.autoAction) != null ? u : false,
      // https://github.com/mobxjs/mobx/discussions/3140
      (l = t.options_) != null && l.bound ? (d = e.proxy_) != null ? d : e.target_ : void 0
    ),
    // Non-configurable for classes
    // prevents accidental field redefinition in subclass
    configurable: i ? e.isPlainObject_ : true,
    // https://github.com/mobxjs/mobx/pull/2641#issuecomment-737292058
    enumerable: false,
    // Non-obsevable, therefore non-writable
    // Also prevents rewriting in subclass constructor
    writable: i ? false : true
  };
}
function Xr(e, t) {
  return {
    annotationType_: e,
    options_: t,
    make_: xi,
    extend_: Mi,
    decorate_20223_: Ri
  };
}
function xi(e, t, n, r) {
  var i;
  if (r === e.target_) {
    return this.extend_(e, t, n, false) === null ? 0 : 2;
  }
  if ((i = this.options_) != null && i.bound && (!oe(e.target_, t) || !Ue(e.target_[t]))) {
    if (this.extend_(e, t, n, false) === null) {
      return 0;
    }
  }
  if (Ue(n.value)) {
    return 1;
  }
  var o = Yr(e, this, t, n, false, false);
  Q(r, t, o);
  return 2;
}
function Mi(e, t, n, r) {
  var i;
  var o = Yr(e, this, t, n, (i = this.options_) == null ? void 0 : i.bound);
  return e.defineProperty_(t, o, r);
}
function Ri(e, t) {
  var n;
  if (false) {
    assert20223DecoratorType(t, ["method"]);
  }
  var r = t.name, i = t.addInitializer;
  if (!Ue(e)) {
    e = Re(e);
  }
  if ((n = this.options_) != null && n.bound) {
    i(function() {
      var o = this;
      var s = o[r].bind(o);
      s.isMobXFlow = true;
      o[r] = s;
    });
  }
  return e;
}
function Ci(e, t, n, r) {
  var i = t.annotationType_;
  var o = r.value;
  if (false) {
    h("Cannot apply '" + i + "' to '" + e.name_ + "." + n.toString() + "':" + ("\n'" + i + "' can only be used on properties with a generator function value."));
  }
}
function Yr(e, t, n, r, i, o) {
  if (o === void 0) {
    o = f.safeDescriptors;
  }
  Ci(e, t, n, r);
  var s = r.value;
  if (!Ue(s)) {
    s = Re(s);
  }
  if (i) {
    var a;
    s = s.bind((a = e.proxy_) != null ? a : e.target_);
    s.isMobXFlow = true;
  }
  return {
    value: s,
    // Non-configurable for classes
    // prevents accidental field redefinition in subclass
    configurable: o ? e.isPlainObject_ : true,
    // https://github.com/mobxjs/mobx/pull/2641#issuecomment-737292058
    enumerable: false,
    // Non-obsevable, therefore non-writable
    // Also prevents rewriting in subclass constructor
    writable: o ? false : true
  };
}
function Jt(e, t) {
  return {
    annotationType_: e,
    options_: t,
    make_: Pi,
    extend_: Ti,
    decorate_20223_: ji
  };
}
function Pi(e, t, n) {
  return this.extend_(e, t, n, false) === null ? 0 : 1;
}
function Ti(e, t, n, r) {
  Ii(e, this, t, n);
  return e.defineComputedProperty_(t, me({}, this.options_, {
    get: n.get,
    set: n.set
  }), r);
}
function ji(e, t) {
  if (false) {
    assert20223DecoratorType(t, ["getter"]);
  }
  var n = this;
  var r = t.name, i = t.addInitializer;
  var o;
  function s(a, u) {
    var c = me({}, n.options_, {
      get: e,
      context: a
    });
    c.name || (c.name = false ? u.name_ + "." + r.toString() : "ObservableObject." + r.toString());
    return new I(c);
  }
  i(function() {
    var a;
    var u = Ne(this)[p];
    var c = this;
    var l = u.values_.get(r);
    if (l instanceof I && l.derivation !== e) {
      u.values_["delete"](r);
    }
    ((a = u.lazyComputedKeys_) != null ? a : u.lazyComputedKeys_ = /* @__PURE__ */ new Map()).set(r, function() {
      return s(c, u);
    });
  });
  return function() {
    var a = this[p];
    var u = a.values_.get(r);
    if (u instanceof I && u.derivation !== e) {
      var c;
      var l = (c = o) == null ? void 0 : c.get(this);
      if (!l) {
        var d;
        l = s(this, a);
        ((d = o) != null ? d : o = /* @__PURE__ */ new WeakMap()).set(this, l);
      }
      return l.get();
    }
    return a.getObservablePropValue_(r);
  };
}
function Ii(e, t, n, r) {
  var i = t.annotationType_;
  var o = r.get;
  if (false) {
    h("Cannot apply '" + i + "' to '" + e.name_ + "." + n.toString() + "':" + ("\n'" + i + "' can only be used on getter(+setter) properties."));
  }
}
function mt(e, t) {
  return {
    annotationType_: e,
    options_: t,
    make_: Bi,
    extend_: ki,
    decorate_20223_: Li
  };
}
function Bi(e, t, n) {
  return this.extend_(e, t, n, false) === null ? 0 : 1;
}
function ki(e, t, n, r) {
  var i, o;
  Ui(e, this, t, n);
  return e.defineObservableProperty_(t, n.value, (i = (o = this.options_) == null ? void 0 : o.enhancer) != null ? i : ge, r);
}
function Li(e, t) {
  if (false) {
    if (t.kind === "field") {
      throw h("Please use `@observable accessor " + String(t.name) + "` instead of `@observable " + String(t.name) + "`");
    }
    assert20223DecoratorType(t, ["accessor"]);
  }
  var n = this;
  var r = t.kind, i = t.name;
  if (r !== "accessor") {
    return;
  }
  function o(s, a) {
    var u;
    var c = Ne(s)[p];
    ((u = c.lazyObservableKeys_) != null ? u : c.lazyObservableKeys_ = /* @__PURE__ */ new Map()).set(i, function() {
      var l, d;
      return new he(a, (l = (d = n.options_) == null ? void 0 : d.enhancer) != null ? l : ge, false ? c.name_ + "." + i.toString() : "ObservableObject." + i.toString(), false);
    });
    return c;
  }
  return {
    get: function s() {
      var a;
      var u = (a = this[p]) != null ? a : o(this, e.get.call(this));
      return u.getObservablePropValue_(i);
    },
    set: function s(a) {
      var u;
      var c = (u = this[p]) != null ? u : o(this, a);
      return c.setObservablePropValue_(i, a);
    },
    init: function s(a) {
      o(this, a);
      return a;
    }
  };
}
function Ui(e, t, n, r) {
  var i = t.annotationType_;
  if (false) {
    h("Cannot apply '" + i + "' to '" + e.name_ + "." + n.toString() + "':" + ("\n'" + i + "' cannot be used on getter/setter properties"));
  }
}
var $i = "true";
var zi = /* @__PURE__ */ Jr();
function Jr(e) {
  return {
    annotationType_: $i,
    options_: e,
    make_: Fi,
    extend_: Ki,
    decorate_20223_: qi
  };
}
function Fi(e, t, n, r) {
  var i, o;
  if (n.get) {
    return re.make_(e, t, n, r);
  }
  if (n.set) {
    var s = Me(n.set) ? n.set : ye(t.toString(), n.set);
    if (r === e.target_) {
      return e.defineProperty_(t, {
        configurable: f.safeDescriptors ? e.isPlainObject_ : true,
        set: s
      }) === null ? 0 : 2;
    }
    Q(r, t, {
      configurable: true,
      set: s
    });
    return 2;
  }
  if (r !== e.target_ && typeof n.value === "function") {
    var a;
    if (Fr(n.value)) {
      var u;
      var c = (u = this.options_) != null && u.autoBind ? Re.bound : Re;
      return c.make_(e, t, n, r);
    }
    var l = (a = this.options_) != null && a.autoBind ? Le.bound : Le;
    return l.make_(e, t, n, r);
  }
  var d = ((i = this.options_) == null ? void 0 : i.deep) === false ? w.ref : w;
  if (typeof n.value === "function" && (o = this.options_) != null && o.autoBind) {
    var v;
    n.value = n.value.bind((v = e.proxy_) != null ? v : e.target_);
  }
  return d.make_(e, t, n, r);
}
function Ki(e, t, n, r) {
  var i, o;
  if (n.get) {
    return re.extend_(e, t, n, r);
  }
  if (n.set) {
    return e.defineProperty_(t, {
      configurable: f.safeDescriptors ? e.isPlainObject_ : true,
      set: ye(t.toString(), n.set)
    }, r);
  }
  if (typeof n.value === "function" && (i = this.options_) != null && i.autoBind) {
    var s;
    n.value = n.value.bind((s = e.proxy_) != null ? s : e.target_);
  }
  var a = ((o = this.options_) == null ? void 0 : o.deep) === false ? w.ref : w;
  return a.extend_(e, t, n, r);
}
function qi(e, t) {
  h("'" + this.annotationType_ + "' cannot be used as a decorator");
}
var Gi = "observable";
var Wi = "observable.ref";
var Hi = "observable.shallow";
var Xi = "observable.struct";
var Zr = {
  deep: true,
  name: void 0,
  defaultDecorator: void 0,
  proxy: true
};
Object.freeze(Zr);
function rt(e) {
  return e || Zr;
}
var kt = /* @__PURE__ */ mt(Gi);
var Yi = /* @__PURE__ */ mt(Wi, {
  enhancer: bt
});
var Ji = /* @__PURE__ */ mt(Hi, {
  enhancer: Oi
});
var Zi = /* @__PURE__ */ mt(Xi, {
  enhancer: Ei
});
var Qr = /* @__PURE__ */ ee(kt);
function nt(e) {
  return e.deep === true ? ge : e.deep === false ? bt : eo(e.defaultDecorator);
}
function Qi(e) {
  var t;
  return e ? (t = e.defaultDecorator) != null ? t : Jr(e) : void 0;
}
function eo(e) {
  var t, n;
  return !e ? ge : (t = (n = e.options_) == null ? void 0 : n.enhancer) != null ? t : ge;
}
function en(e, t, n) {
  if (Ke(t)) {
    return kt.decorate_20223_(e, t);
  }
  if (be(t)) {
    Fe(e, t, kt);
    return;
  }
  if (wn(e)) {
    return e;
  }
  if (ae(e)) {
    return w.object(e, t, n);
  }
  if (Array.isArray(e)) {
    return w.array(e, t);
  }
  if (Ce(e)) {
    return w.map(e, t);
  }
  if (ne(e)) {
    return w.set(e, t);
  }
  if (typeof e === "object" && e !== null) {
    return e;
  }
  return w.box(e, t);
}
Ur(en, Qr);
var to = {
  box: function e(t, n) {
    var r = rt(n);
    return new he(t, nt(r), r.name, true, r.equals);
  },
  array: function e(t, n) {
    var r = rt(n);
    return (f.useProxies === false || r.proxy === false ? es : Ko)(t, nt(r), r.name);
  },
  map: function e(t, n) {
    var r = rt(n);
    return new Sn(t, nt(r), r.name);
  },
  set: function e(t, n) {
    var r = rt(n);
    return new An(t, nt(r), r.name);
  },
  object: function e(t, n, r) {
    return pe(function() {
      return yn(f.useProxies === false || (r == null ? void 0 : r.proxy) === false ? Ne({}, r) : Uo({}, r), t, n);
    });
  },
  ref: /* @__PURE__ */ ee(Yi),
  shallow: /* @__PURE__ */ ee(Ji),
  deep: Qr,
  struct: /* @__PURE__ */ ee(Zi)
};
var w = /* @__PURE__ */ Ur(en, to);
var tn = "computed";
var ro = "computed.struct";
var Lt = /* @__PURE__ */ Jt(tn);
var no = /* @__PURE__ */ Jt(ro, {
  equals: C.structural
});
var re = function e(t, n) {
  if (Ke(n)) {
    return Lt.decorate_20223_(t, n);
  }
  if (be(n)) {
    return Fe(t, n, Lt);
  }
  if (ae(t)) {
    return ee(Jt(tn, t));
  }
  if (false) {
    if (!G(t)) {
      h("First argument to `computed` should be an expression.");
    }
    if (G(n)) {
      h("A setter as second argument is no longer supported, use `{ set: fn }` option instead");
    }
  }
  var r = ae(n) ? n : {};
  r.get = t;
  r.name || (r.name = t.name || "");
  return new I(r);
};
Object.assign(re, Lt);
re.struct = /* @__PURE__ */ ee(no);
var Sr;
var Ar;
var ct = 0;
var io = 1;
var oo = (Sr = (Ar = /* @__PURE__ */ ut(function() {
}, "name")) == null ? void 0 : Ar.configurable) != null ? Sr : false;
var Vr = {
  value: "action",
  configurable: true,
  writable: false,
  enumerable: false
};
function ye(e, t, n, r) {
  if (n === void 0) {
    n = false;
  }
  if (false) {
    if (!G(t)) {
      h("`action` can only be invoked on functions");
    }
    if (typeof e !== "string" || !e) {
      h("actions should have valid names, got: '" + e + "'");
    }
  }
  function i() {
    return rn(e, n, t, r || this, arguments);
  }
  i.isMobxAction = true;
  i.toString = function() {
    return t.toString();
  };
  if (oo) {
    Vr.value = e;
    Q(i, "name", Vr);
  }
  return i;
}
function rn(e, t, n, r, i) {
  var o = so(e, t, r, i);
  try {
    return n.apply(r, i);
  } catch (s) {
    o.error_ = s;
    throw s;
  } finally {
    ao(o);
  }
}
function so(e, t, n, r) {
  var i = false;
  var o = 0;
  if (false) {
    o = Date.now();
    var s = r ? Array.from(r) : jt;
    spyReportStart({
      type: dn,
      name: e,
      object: n,
      arguments: s
    });
  }
  var a = f.trackingDerivation;
  var u = !t || !a;
  $();
  var c = f.allowStateChanges;
  if (u) {
    Ee();
    c = gt(true);
  }
  var l = Zt(true);
  var d = {
    runAsAction_: u,
    prevDerivation_: a,
    prevAllowStateChanges_: c,
    prevAllowStateReads_: l,
    notifySpy_: i,
    startTime_: o,
    actionId_: io++,
    parentActionId_: ct
  };
  ct = d.actionId_;
  return d;
}
function ao(e) {
  if (ct !== e.actionId_) {
    h(30);
  }
  ct = e.parentActionId_;
  if (e.error_ !== void 0) {
    f.suppressReactionErrors = true;
  }
  yt(e.prevAllowStateChanges_);
  Be(e.prevAllowStateReads_);
  z();
  if (e.runAsAction_) {
    se(e.prevDerivation_);
  }
  if (false) {
    spyReportEnd({
      time: Date.now() - e.startTime_
    });
  }
  f.suppressReactionErrors = false;
}
function uo(e, t) {
  var n = gt(e);
  try {
    return t();
  } finally {
    yt(n);
  }
}
function gt(e) {
  var t = f.allowStateChanges;
  f.allowStateChanges = e;
  return t;
}
function yt(e) {
  f.allowStateChanges = e;
}
var he = /* @__PURE__ */ (function(e) {
  function t(r, i, o, s, a) {
    var u;
    if (o === void 0) {
      o = false ? "ObservableValue@" + getNextId() : "ObservableValue";
    }
    if (s === void 0) {
      s = true;
    }
    if (a === void 0) {
      a = C["default"];
    }
    u = e.call(this, o) || this;
    u.enhancer = void 0;
    u.name_ = void 0;
    u.equals = void 0;
    u.hasUnreportedChange_ = false;
    u.interceptors_ = void 0;
    u.changeListeners_ = void 0;
    u.value_ = void 0;
    u.dehancer = void 0;
    u.enhancer = i;
    u.name_ = o;
    u.equals = a;
    u.value_ = i(r, void 0, o);
    if (false) {
      var c;
      spyReport({
        type: CREATE,
        object: u,
        observableKind: "value",
        debugObjectName: u.name_,
        newValue: "" + ((c = u.value_) == null ? void 0 : c.toString())
      });
    }
    return u;
  }
  Ht(t, e);
  var n = t.prototype;
  n.dehanceValue = function r(i) {
    if (this.dehancer !== void 0) {
      return this.dehancer(i);
    }
    return i;
  };
  n.set = function r(i) {
    var o = this.value_;
    i = this.prepareNewValue_(i);
    if (i !== f.UNCHANGED) {
      var s = _e();
      if (false) {
        spyReportStart({
          type: te,
          object: this,
          observableKind: "value",
          debugObjectName: this.name_,
          newValue: i,
          oldValue: o
        });
      }
      this.setNewValue_(i);
      if (false) {
        spyReportEnd();
      }
    }
  };
  n.prepareNewValue_ = function r(i) {
    Z(this);
    if (L(this)) {
      var o = U(this, {
        object: this,
        type: te,
        newValue: i
      });
      if (!o) {
        return f.UNCHANGED;
      }
      i = o.newValue;
    }
    i = this.enhancer(i, this.value_, this.name_);
    return this.equals(this.value_, i) ? f.UNCHANGED : i;
  };
  n.setNewValue_ = function r(i) {
    var o = this.value_;
    this.value_ = i;
    this.reportChanged();
    if (K(this)) {
      q(this, {
        type: te,
        object: this,
        newValue: i,
        oldValue: o
      });
    }
  };
  n.get = function r() {
    this.reportObserved();
    return this.dehanceValue(this.value_);
  };
  n.intercept_ = function r(i) {
    return Ge(this, i);
  };
  n.observe_ = function r(i, o) {
    if (o) {
      i({
        observableKind: "value",
        debugObjectName: this.name_,
        object: this,
        type: te,
        newValue: this.value_,
        oldValue: void 0
      });
    }
    return We(this, i);
  };
  n.raw = function r() {
    return this.value_;
  };
  n.toJSON = function r() {
    return this.get();
  };
  n.toString = function r() {
    return this.name_ + "[" + this.value_ + "]";
  };
  n.valueOf = function r() {
    return Gr(this.get());
  };
  n[Symbol.toPrimitive] = function() {
    return this.valueOf();
  };
  return t;
})(fe);
var I = /* @__PURE__ */ (function() {
  function e(n) {
    this.dependenciesState_ = _.NOT_TRACKING_;
    this.observing_ = [];
    this.newObserving_ = null;
    this.observers_ = /* @__PURE__ */ new Set();
    this.runId_ = 0;
    this.lastAccessedBy_ = 0;
    this.lowestObserverState_ = _.UP_TO_DATE_;
    this.unboundDepsCount_ = 0;
    this.value_ = new lt(null);
    this.name_ = void 0;
    this.triggeredBy_ = void 0;
    this.flags_ = 0;
    this.derivation = void 0;
    this.setter_ = void 0;
    this.isTracing_ = ce.NONE;
    this.scope_ = void 0;
    this.equals_ = void 0;
    this.requiresReaction_ = void 0;
    this.keepAlive_ = void 0;
    this.onBOL = void 0;
    this.onBUOL = void 0;
    if (!n.get) {
      h(31);
    }
    this.derivation = n.get;
    this.name_ = n.name || (false ? "ComputedValue@" + getNextId() : "ComputedValue");
    if (n.set) {
      this.setter_ = ye(false ? this.name_ + "-setter" : "ComputedValue-setter", n.set);
    }
    this.equals_ = n.equals || (n.compareStructural || n.struct ? C.structural : C["default"]);
    this.scope_ = n.context;
    this.requiresReaction_ = n.requiresReaction;
    this.keepAlive_ = !!n.keepAlive;
  }
  var t = e.prototype;
  t.onBecomeStale_ = function n() {
    _o(this);
  };
  t.onBO = function n() {
    if (this.onBOL) {
      this.onBOL.forEach(function(r) {
        return r();
      });
    }
  };
  t.onBUO = function n() {
    if (this.onBUOL) {
      this.onBUOL.forEach(function(r) {
        return r();
      });
    }
  };
  t.get = function n() {
    if (this.isComputing) {
      h(32, this.name_, this.derivation);
    }
    if (f.inBatch === 0 && // !globalState.trackingDerivatpion &&
    this.observers_.size === 0 && !this.keepAlive_) {
      if (Ut(this)) {
        this.warnAboutUntrackedRead_();
        $();
        this.value_ = this.computeValue_(false);
        z();
      }
    } else {
      cn(this);
      if (Ut(this)) {
        var r = f.trackingContext;
        if (this.keepAlive_ && !r) {
          f.trackingContext = this;
        }
        if (this.trackAndCompute()) {
          ho(this);
        }
        f.trackingContext = r;
      }
    }
    var i = this.value_;
    if (ot(i)) {
      throw i.cause;
    }
    return i;
  };
  t.set = function n(r) {
    if (this.setter_) {
      if (this.isRunningSetter) {
        h(33, this.name_);
      }
      this.isRunningSetter = true;
      try {
        this.setter_.call(this.scope_, r);
      } finally {
        this.isRunningSetter = false;
      }
    } else {
      h(34, this.name_);
    }
  };
  t.trackAndCompute = function n() {
    var r = this.value_;
    var i = (
      /* see #1208 */
      this.dependenciesState_ === _.NOT_TRACKING_
    );
    var o = this.computeValue_(true);
    var s = i || ot(r) || ot(o) || !this.equals_(r, o);
    if (s) {
      this.value_ = o;
      if (false) {
        spyReport({
          observableKind: "computed",
          debugObjectName: this.name_,
          object: this.scope_,
          type: "update",
          oldValue: r,
          newValue: o
        });
      }
    }
    return s;
  };
  t.computeValue_ = function n(r) {
    this.isComputing = true;
    var i = gt(false);
    var o;
    if (r) {
      o = nn(this, this.derivation, this.scope_);
    } else {
      if (f.disableErrorBoundaries === true) {
        o = this.derivation.call(this.scope_);
      } else {
        try {
          o = this.derivation.call(this.scope_);
        } catch (s) {
          o = new lt(s);
        }
      }
    }
    yt(i);
    this.isComputing = false;
    return o;
  };
  t.suspend_ = function n() {
    if (!this.keepAlive_) {
      $t(this);
      this.value_ = void 0;
      if (false) {
        console.log("[mobx.trace] Computed value '" + this.name_ + "' was suspended and it will recompute on the next access.");
      }
    }
  };
  t.observe_ = function n(r, i) {
    var o = this;
    var s = true;
    var a = void 0;
    return So(function() {
      var u = o.get();
      if (!s || i) {
        var c = Ee();
        r({
          observableKind: "computed",
          debugObjectName: o.name_,
          type: te,
          object: o,
          newValue: u,
          oldValue: a
        });
        se(c);
      }
      s = false;
      a = u;
    });
  };
  t.warnAboutUntrackedRead_ = function n() {
    if (true) {
      return;
    }
    if (this.isTracing_ !== ce.NONE) {
      console.log("[mobx.trace] Computed value '" + this.name_ + "' is being read outside a reactive context. Doing a full recompute.");
    }
    if (typeof this.requiresReaction_ === "boolean" ? this.requiresReaction_ : f.computedRequiresReaction) {
      console.warn("[mobx] Computed value '" + this.name_ + "' is being read outside a reactive context. Doing a full recompute.");
    }
  };
  t.toString = function n() {
    return this.name_ + "[" + this.derivation.toString() + "]";
  };
  t.valueOf = function n() {
    return Gr(this.get());
  };
  t[Symbol.toPrimitive] = function() {
    return this.valueOf();
  };
  return Pe(e, [{
    key: "isComputing",
    get: function n() {
      return T(this.flags_, e.isComputingMask_);
    },
    set: function n(r) {
      this.flags_ = j(this.flags_, e.isComputingMask_, r);
    }
  }, {
    key: "isRunningSetter",
    get: function n() {
      return T(this.flags_, e.isRunningSetterMask_);
    },
    set: function n(r) {
      this.flags_ = j(this.flags_, e.isRunningSetterMask_, r);
    }
  }, {
    key: "isBeingObserved",
    get: function n() {
      return T(this.flags_, e.isBeingObservedMask_);
    },
    set: function n(r) {
      this.flags_ = j(this.flags_, e.isBeingObservedMask_, r);
    }
  }, {
    key: "isPendingUnobservation",
    get: function n() {
      return T(this.flags_, e.isPendingUnobservationMask_);
    },
    set: function n(r) {
      this.flags_ = j(this.flags_, e.isPendingUnobservationMask_, r);
    }
  }, {
    key: "diffValue",
    get: function n() {
      return T(this.flags_, e.diffValueMask_) ? 1 : 0;
    },
    set: function n(r) {
      this.flags_ = j(this.flags_, e.diffValueMask_, r === 1 ? true : false);
    }
  }]);
})();
I.isComputingMask_ = 1;
I.isRunningSetterMask_ = 2;
I.isBeingObservedMask_ = 4;
I.isPendingUnobservationMask_ = 8;
I.diffValueMask_ = 16;
var Ot = /* @__PURE__ */ Oe("ComputedValue", I);
var _;
(function(e) {
  e[e["NOT_TRACKING_"] = -1] = "NOT_TRACKING_";
  e[e["UP_TO_DATE_"] = 0] = "UP_TO_DATE_";
  e[e["POSSIBLY_STALE_"] = 1] = "POSSIBLY_STALE_";
  e[e["STALE_"] = 2] = "STALE_";
})(_ || (_ = {}));
var ce;
(function(e) {
  e[e["NONE"] = 0] = "NONE";
  e[e["LOG"] = 1] = "LOG";
  e[e["BREAK"] = 2] = "BREAK";
})(ce || (ce = {}));
var lt = function e(t) {
  this.cause = void 0;
  this.cause = t;
};
function ot(e) {
  return e instanceof lt;
}
function Ut(e) {
  switch (e.dependenciesState_) {
    case _.UP_TO_DATE_:
      return false;
    case _.NOT_TRACKING_:
    case _.STALE_:
      return true;
    case _.POSSIBLY_STALE_: {
      var t = Zt(true);
      var n = Ee();
      var r = e.observing_, i = r.length;
      for (var o = 0; o < i; o++) {
        var s = r[o];
        if (Ot(s)) {
          if (f.disableErrorBoundaries) {
            s.get();
          } else {
            try {
              s.get();
            } catch (a) {
              se(n);
              Be(t);
              return true;
            }
          }
          if (e.dependenciesState_ === _.STALE_) {
            se(n);
            Be(t);
            return true;
          }
        }
      }
      on(e);
      se(n);
      Be(t);
      return false;
    }
  }
}
function Z(e) {
  if (true) {
    return;
  }
  var t = e.observers_.size > 0;
  if (!f.allowStateChanges && (t || f.enforceActions === "always")) {
    console.warn("[MobX] " + (f.enforceActions ? "Since strict-mode is enabled, changing (observed) observable values without using an action is not allowed. Tried to modify: " : "Side effects like changing state are not allowed at this point. Are you trying to modify state from, for example, a computed value or the render function of a React component? You can wrap side effects in 'runInAction' (or decorate functions with 'action') if needed. Tried to modify: ") + e.name_);
  }
}
function co(e) {
  if (false) {
    console.warn("[mobx] Observable '" + e.name_ + "' being read outside a reactive context.");
  }
}
function nn(e, t, n) {
  var r = Zt(true);
  on(e);
  e.newObserving_ = new Array(
    // Reserve constant space for initial dependencies, dynamic space otherwise.
    // See https://github.com/mobxjs/mobx/pull/3833
    e.runId_ === 0 ? 100 : e.observing_.length
  );
  e.unboundDepsCount_ = 0;
  e.runId_ = ++f.runId;
  var i = f.trackingDerivation;
  f.trackingDerivation = e;
  f.inBatch++;
  var o;
  if (f.disableErrorBoundaries === true) {
    o = t.call(n);
  } else {
    try {
      o = t.call(n);
    } catch (s) {
      o = new lt(s);
    }
  }
  f.inBatch--;
  f.trackingDerivation = i;
  fo(e);
  lo(e);
  Be(r);
  return o;
}
function lo(e) {
  if (true) {
    return;
  }
  if (e.observing_.length !== 0) {
    return;
  }
  if (typeof e.requiresObservable_ === "boolean" ? e.requiresObservable_ : f.reactionRequiresObservable) {
    console.warn("[mobx] Derivation '" + e.name_ + "' is created/updated without reading any observable value.");
  }
}
function fo(e) {
  var t = e.observing_;
  var n = e.observing_ = e.newObserving_;
  var r = _.UP_TO_DATE_;
  var i = 0, o = e.unboundDepsCount_;
  for (var s = 0; s < o; s++) {
    var a = n[s];
    if (a.diffValue === 0) {
      a.diffValue = 1;
      if (i !== s) {
        n[i] = a;
      }
      i++;
    }
    if (a.dependenciesState_ > r) {
      r = a.dependenciesState_;
    }
  }
  n.length = i;
  e.newObserving_ = null;
  o = t.length;
  while (o--) {
    var u = t[o];
    if (u.diffValue === 0) {
      an(u, e);
    }
    u.diffValue = 0;
  }
  while (i--) {
    var c = n[i];
    if (c.diffValue === 1) {
      c.diffValue = 0;
      vo(c, e);
    }
  }
  if (r !== _.UP_TO_DATE_) {
    e.dependenciesState_ = r;
    e.onBecomeStale_();
  }
}
function $t(e) {
  var t = e.observing_;
  e.observing_ = [];
  var n = t.length;
  while (n--) {
    an(t[n], e);
  }
  e.dependenciesState_ = _.NOT_TRACKING_;
}
function Et(e) {
  var t = Ee();
  try {
    return e();
  } finally {
    se(t);
  }
}
function Ee() {
  var e = f.trackingDerivation;
  f.trackingDerivation = null;
  return e;
}
function se(e) {
  f.trackingDerivation = e;
}
function Zt(e) {
  var t = f.allowStateReads;
  f.allowStateReads = e;
  return t;
}
function Be(e) {
  f.allowStateReads = e;
}
function on(e) {
  if (e.dependenciesState_ === _.UP_TO_DATE_) {
    return;
  }
  e.dependenciesState_ = _.UP_TO_DATE_;
  var t = e.observing_;
  var n = t.length;
  while (n--) {
    t[n].lowestObserverState_ = _.UP_TO_DATE_;
  }
}
var st = function e() {
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
var at = true;
var sn = false;
var f = /* @__PURE__ */ (function() {
  var e = /* @__PURE__ */ vt();
  if (e.__mobxInstanceCount > 0 && !e.__mobxGlobals) {
    at = false;
  }
  if (e.__mobxGlobals && e.__mobxGlobals.version !== new st().version) {
    at = false;
  }
  if (!at) {
    setTimeout(function() {
      if (!sn) {
        h(35);
      }
    }, 1);
    return new st();
  } else if (e.__mobxGlobals) {
    e.__mobxInstanceCount += 1;
    if (!e.__mobxGlobals.UNCHANGED) {
      e.__mobxGlobals.UNCHANGED = {};
    }
    return e.__mobxGlobals;
  } else {
    e.__mobxInstanceCount = 1;
    return e.__mobxGlobals = /* @__PURE__ */ new st();
  }
})();
function po() {
  if (f.pendingReactions.length || f.inBatch || f.isRunningReactions) {
    h(36);
  }
  sn = true;
  if (at) {
    var e = vt();
    if (--e.__mobxInstanceCount === 0) {
      e.__mobxGlobals = void 0;
    }
    f = new st();
  }
}
function vo(e, t) {
  e.observers_.add(t);
  if (e.lowestObserverState_ > t.dependenciesState_) {
    e.lowestObserverState_ = t.dependenciesState_;
  }
}
function an(e, t) {
  e.observers_["delete"](t);
  if (e.observers_.size === 0) {
    un(e);
  }
}
function un(e) {
  if (e.isPendingUnobservation === false) {
    e.isPendingUnobservation = true;
    f.pendingUnobservations.push(e);
  }
}
function $() {
  f.inBatch++;
}
function z() {
  if (--f.inBatch === 0) {
    fn();
    var e = f.pendingUnobservations;
    for (var t = 0; t < e.length; t++) {
      var n = e[t];
      n.isPendingUnobservation = false;
      if (n.observers_.size === 0) {
        if (n.isBeingObserved) {
          n.isBeingObserved = false;
          n.onBUO();
        }
        if (n instanceof I) {
          n.suspend_();
        }
      }
    }
    f.pendingUnobservations = [];
  }
}
function cn(e) {
  co(e);
  var t = f.trackingDerivation;
  if (t !== null) {
    if (t.runId_ !== e.lastAccessedBy_) {
      e.lastAccessedBy_ = t.runId_;
      t.newObserving_[t.unboundDepsCount_++] = e;
      if (!e.isBeingObserved && f.trackingContext) {
        e.isBeingObserved = true;
        e.onBO();
      }
    }
    return e.isBeingObserved;
  } else if (e.observers_.size === 0 && f.inBatch > 0) {
    un(e);
  }
  return false;
}
function ln(e) {
  if (e.lowestObserverState_ === _.STALE_) {
    return;
  }
  e.lowestObserverState_ = _.STALE_;
  e.observers_.forEach(function(t) {
    if (t.dependenciesState_ === _.UP_TO_DATE_) {
      if (false) {
        logTraceInfo(t, e);
      }
      t.onBecomeStale_();
    }
    t.dependenciesState_ = _.STALE_;
  });
}
function ho(e) {
  if (e.lowestObserverState_ === _.STALE_) {
    return;
  }
  e.lowestObserverState_ = _.STALE_;
  e.observers_.forEach(function(t) {
    if (t.dependenciesState_ === _.POSSIBLY_STALE_) {
      t.dependenciesState_ = _.STALE_;
      if (false) {
        logTraceInfo(t, e);
      }
    } else if (t.dependenciesState_ === _.UP_TO_DATE_) {
      e.lowestObserverState_ = _.UP_TO_DATE_;
    }
  });
}
function _o(e) {
  if (e.lowestObserverState_ !== _.UP_TO_DATE_) {
    return;
  }
  e.lowestObserverState_ = _.POSSIBLY_STALE_;
  e.observers_.forEach(function(t) {
    if (t.dependenciesState_ === _.UP_TO_DATE_) {
      t.dependenciesState_ = _.POSSIBLY_STALE_;
      t.onBecomeStale_();
    }
  });
}
var W = /* @__PURE__ */ (function() {
  function e(n, r, i, o) {
    if (n === void 0) {
      n = false ? "Reaction@" + getNextId() : "Reaction";
    }
    this.name_ = void 0;
    this.onInvalidate_ = void 0;
    this.errorHandler_ = void 0;
    this.requiresObservable_ = void 0;
    this.observing_ = [];
    this.newObserving_ = [];
    this.dependenciesState_ = _.NOT_TRACKING_;
    this.runId_ = 0;
    this.unboundDepsCount_ = 0;
    this.flags_ = 0;
    this.isTracing_ = ce.NONE;
    this.name_ = n;
    this.onInvalidate_ = r;
    this.errorHandler_ = i;
    this.requiresObservable_ = o;
  }
  var t = e.prototype;
  t.onBecomeStale_ = function n() {
    this.schedule_();
  };
  t.schedule_ = function n() {
    if (!this.isScheduled) {
      this.isScheduled = true;
      f.pendingReactions.push(this);
      fn();
    }
  };
  t.runReaction_ = function n() {
    if (!this.isDisposed) {
      $();
      this.isScheduled = false;
      var r = f.trackingContext;
      f.trackingContext = this;
      if (Ut(this)) {
        this.isTrackPending = true;
        try {
          this.onInvalidate_();
          if (false) {
            spyReport({
              name: this.name_,
              type: "scheduled-reaction"
            });
          }
        } catch (i) {
          this.reportExceptionInDerivation_(i);
        }
      }
      f.trackingContext = r;
      z();
    }
  };
  t.track = function n(r) {
    if (this.isDisposed) {
      return;
    }
    $();
    var i = _e();
    var o;
    if (false) {
      o = Date.now();
      spyReportStart({
        name: this.name_,
        type: "reaction"
      });
    }
    this.isRunning = true;
    var s = f.trackingContext;
    f.trackingContext = this;
    var a = nn(this, r, void 0);
    f.trackingContext = s;
    this.isRunning = false;
    this.isTrackPending = false;
    if (this.isDisposed) {
      $t(this);
    }
    if (ot(a)) {
      this.reportExceptionInDerivation_(a.cause);
    }
    if (false) {
      spyReportEnd({
        time: Date.now() - o
      });
    }
    z();
  };
  t.reportExceptionInDerivation_ = function n(r) {
    var i = this;
    if (this.errorHandler_) {
      this.errorHandler_(r, this);
      return;
    }
    if (f.disableErrorBoundaries) {
      throw r;
    }
    var o = false ? "[mobx] Encountered an uncaught exception that was thrown by a reaction or observer component, in: '" + this + "'" : "[mobx] uncaught error in '" + this + "'";
    if (!f.suppressReactionErrors) {
      console.error(o, r);
    } else if (false) {
      console.warn("[mobx] (error in reaction '" + this.name_ + "' suppressed, fix error of causing action below)");
    }
    if (false) {
      spyReport({
        type: "error",
        name: this.name_,
        message: o,
        error: "" + r
      });
    }
    f.globalReactionErrorHandlers.forEach(function(s) {
      return s(r, i);
    });
  };
  t.dispose = function n() {
    if (!this.isDisposed) {
      this.isDisposed = true;
      if (!this.isRunning) {
        $();
        $t(this);
        z();
      }
    }
  };
  t.getDisposer_ = function n(r) {
    var i = this;
    var o = function s() {
      i.dispose();
      r == null || r.removeEventListener == null || r.removeEventListener("abort", s);
    };
    r == null || r.addEventListener == null || r.addEventListener("abort", o);
    o[p] = this;
    if ("dispose" in Symbol && typeof Symbol.dispose === "symbol") {
      o[Symbol.dispose] = o;
    }
    return o;
  };
  t.toString = function n() {
    return "Reaction[" + this.name_ + "]";
  };
  t.trace = function n(r) {
    if (r === void 0) {
      r = false;
    }
    Bo(this, r);
  };
  return Pe(e, [{
    key: "isDisposed",
    get: function n() {
      return T(this.flags_, e.isDisposedMask_);
    },
    set: function n(r) {
      this.flags_ = j(this.flags_, e.isDisposedMask_, r);
    }
  }, {
    key: "isScheduled",
    get: function n() {
      return T(this.flags_, e.isScheduledMask_);
    },
    set: function n(r) {
      this.flags_ = j(this.flags_, e.isScheduledMask_, r);
    }
  }, {
    key: "isTrackPending",
    get: function n() {
      return T(this.flags_, e.isTrackPendingMask_);
    },
    set: function n(r) {
      this.flags_ = j(this.flags_, e.isTrackPendingMask_, r);
    }
  }, {
    key: "isRunning",
    get: function n() {
      return T(this.flags_, e.isRunningMask_);
    },
    set: function n(r) {
      this.flags_ = j(this.flags_, e.isRunningMask_, r);
    }
  }, {
    key: "diffValue",
    get: function n() {
      return T(this.flags_, e.diffValueMask_) ? 1 : 0;
    },
    set: function n(r) {
      this.flags_ = j(this.flags_, e.diffValueMask_, r === 1 ? true : false);
    }
  }]);
})();
W.isDisposedMask_ = 1;
W.isScheduledMask_ = 2;
W.isTrackPendingMask_ = 4;
W.isRunningMask_ = 8;
W.diffValueMask_ = 16;
var bo = 100;
var zt = function e(t) {
  return t();
};
function fn() {
  if (f.inBatch > 0 || f.isRunningReactions) {
    return;
  }
  zt(mo);
}
function mo() {
  f.isRunningReactions = true;
  var e = f.pendingReactions;
  var t = 0;
  while (e.length > 0) {
    if (++t === bo) {
      console.error(false ? "Reaction doesn't converge to a stable state after " + bo + " iterations." + (" Probably there is a cycle in the reactive function: " + e[0]) : "[mobx] cycle in reaction: " + e[0]);
      e.splice(0);
    }
    var n = e.splice(0);
    for (var r = 0, i = n.length; r < i; r++) {
      n[r].runReaction_();
    }
  }
  f.isRunningReactions = false;
}
var ft = /* @__PURE__ */ Oe("Reaction", W);
function go(e) {
  var t = zt;
  zt = function n(r) {
    return e(function() {
      return t(r);
    });
  };
}
function _e() {
  return false;
}
function yo(e) {
  if (true) {
    console.warn("[mobx.spy] Is a no-op in production builds");
    return function() {
    };
  } else {
    f.spyListeners.push(e);
    return zr(function() {
      f.spyListeners = f.spyListeners.filter(function(t) {
        return t !== e;
      });
    });
  }
}
var dn = "action";
var Oo = "action.bound";
var pn = "autoAction";
var Eo = "autoAction.bound";
var vn = "<unnamed action>";
var Ft = /* @__PURE__ */ qe(dn);
var wo = /* @__PURE__ */ qe(Oo, {
  bound: true
});
var Kt = /* @__PURE__ */ qe(pn, {
  autoAction: true
});
var No = /* @__PURE__ */ qe(Eo, {
  autoAction: true,
  bound: true
});
function hn(e) {
  var t = function n(r, i) {
    if (G(r)) {
      return ye(r.name || vn, r, e);
    }
    if (G(i)) {
      return ye(r, i, e);
    }
    if (Ke(i)) {
      return (e ? Kt : Ft).decorate_20223_(r, i);
    }
    if (be(i)) {
      return Fe(r, i, e ? Kt : Ft);
    }
    if (be(r)) {
      return ee(qe(e ? pn : dn, {
        name: r,
        autoAction: e
      }));
    }
    if (false) {
      h("Invalid arguments for `action`");
    }
  };
  return t;
}
var F = /* @__PURE__ */ hn(false);
Object.assign(F, Ft);
var Le = /* @__PURE__ */ hn(true);
Object.assign(Le, Kt);
F.bound = /* @__PURE__ */ ee(wo);
Le.bound = /* @__PURE__ */ ee(No);
function x(e) {
  return rn(e.name || vn, false, e, this, void 0);
}
function Me(e) {
  return G(e) && e.isMobxAction === true;
}
function So(e, t) {
  var n, r, i, o;
  if (t === void 0) {
    t = Wt;
  }
  if (false) {
    if (!G(e)) {
      h("Autorun expects a function as first argument");
    }
    if (Me(e)) {
      h("Autorun does not accept actions since actions are untrackable");
    }
  }
  var s = (n = (r = t) == null ? void 0 : r.name) != null ? n : false ? e.name || "Autorun@" + getNextId() : "Autorun";
  var a = !t.scheduler && !t.delay;
  var u;
  if (a) {
    u = new W(s, function() {
      this.track(d);
    }, t.onError, t.requiresObservable);
  } else {
    var c = _n(t);
    var l = false;
    u = new W(s, function() {
      if (!l) {
        l = true;
        c(function() {
          l = false;
          if (!u.isDisposed) {
            u.track(d);
          }
        });
      }
    }, t.onError, t.requiresObservable);
  }
  function d() {
    e(u);
  }
  if (!((i = t) != null && (i = i.signal) != null && i.aborted)) {
    u.schedule_();
  }
  return u.getDisposer_((o = t) == null ? void 0 : o.signal);
}
var Ao = function e(t) {
  return t();
};
function _n(e) {
  return e.scheduler ? e.scheduler : e.delay ? function(t) {
    return setTimeout(t, e.delay);
  } : Ao;
}
function Qt(e, t, n) {
  var r, i, o;
  if (n === void 0) {
    n = Wt;
  }
  if (false) {
    if (!G(e) || !G(t)) {
      h("First and second argument to reaction should be functions");
    }
    if (!ae(n)) {
      h("Third argument of reactions should be an object");
    }
  }
  var s = (r = n.name) != null ? r : false ? "Reaction@" + getNextId() : "Reaction";
  var a = F(s, n.onError ? Vo(n.onError, t) : t);
  var u = !n.scheduler && !n.delay;
  var c = _n(n);
  var l = true;
  var d = false;
  var v;
  var O = n.compareStructural ? C.structural : n.equals || C["default"];
  var b = new W(s, function() {
    if (l || u) {
      A();
    } else if (!d) {
      d = true;
      c(A);
    }
  }, n.onError, n.requiresObservable);
  function A() {
    d = false;
    if (b.isDisposed) {
      return;
    }
    var D = false;
    var M = v;
    b.track(function() {
      var N = uo(false, function() {
        return e(b);
      });
      D = l || !O(v, N);
      v = N;
    });
    if (l && n.fireImmediately) {
      a(v, M, b);
    } else if (!l && D) {
      a(v, M, b);
    }
    l = false;
  }
  if (!((i = n) != null && (i = i.signal) != null && i.aborted)) {
    b.schedule_();
  }
  return b.getDisposer_((o = n) == null ? void 0 : o.signal);
}
function Vo(e, t) {
  return function() {
    try {
      return t.apply(this, arguments);
    } catch (n) {
      e.call(this, n);
    }
  };
}
var Do = "onBO";
var xo = "onBUO";
function bn(e, t, n) {
  return mn(Do, e, t, n);
}
function er(e, t, n) {
  return mn(xo, e, t, n);
}
function mn(e, t, n, r) {
  var i = typeof r === "function" ? le(t, n) : le(t);
  var o = G(r) ? r : n;
  var s = e + "L";
  if (i[s]) {
    i[s].add(o);
  } else {
    i[s] = /* @__PURE__ */ new Set([o]);
  }
  return function() {
    var a = i[s];
    if (a) {
      a["delete"](o);
      if (a.size === 0) {
        delete i[s];
      }
    }
  };
}
var Mo = "never";
var it = "always";
var Ro = "observed";
function gn(e) {
  if (e.isolateGlobalState === true) {
    po();
  }
  var t = e.useProxies, n = e.enforceActions;
  if (t !== void 0) {
    f.useProxies = t === it ? true : t === Mo ? false : typeof Proxy !== "undefined";
  }
  if (t === "ifavailable") {
    f.verifyProxies = true;
  }
  if (n !== void 0) {
    var r = n === it ? it : n === Ro;
    f.enforceActions = r;
    f.allowStateChanges = r === true || r === it ? false : true;
  }
  ["computedRequiresReaction", "reactionRequiresObservable", "observableRequiresReaction", "disableErrorBoundaries", "safeDescriptors"].forEach(function(i) {
    if (i in e) {
      f[i] = !!e[i];
    }
  });
  f.allowStateReads = !f.observableRequiresReaction;
  if (false) {
    console.warn("WARNING: Debug feature only. MobX will NOT recover from errors when `disableErrorBoundaries` is enabled.");
  }
  if (e.reactionScheduler) {
    go(e.reactionScheduler);
  }
}
function yn(e, t, n, r) {
  if (false) {
    if (arguments.length > 4) {
      h("'extendObservable' expected 2-4 arguments");
    }
    if (typeof e !== "object") {
      h("'extendObservable' expects an object as first argument");
    }
    if (we(e)) {
      h("'extendObservable' should not be used on maps, use map.merge instead");
    }
    if (!ae(t)) {
      h("'extendObservable' only accepts plain objects as second argument");
    }
    if (wn(t) || wn(n)) {
      h("Extending an object with another observable (object) is not supported");
    }
  }
  var i = ci(t);
  pe(function() {
    var o = Ne(e, r)[p];
    xe(i).forEach(function(s) {
      o.extend_(
        s,
        i[s],
        // must pass "undefined" for { key: undefined }
        !n ? true : s in n ? n[s] : true
      );
    });
  });
  return e;
}
function On(e, t) {
  return En(le(e, t));
}
function En(e) {
  var t = {
    name: e.name_
  };
  if (e.observing_ && e.observing_.length > 0) {
    t.dependencies = Co(e.observing_).map(En);
  }
  return t;
}
function Co(e) {
  return Array.from(new Set(e));
}
var Po = 0;
var To = /* @__PURE__ */ (function(e) {
  function t() {
    var r;
    r = e.call(this, "FLOW_CANCELLED") || this;
    Object.setPrototypeOf(r, (this instanceof t ? this.constructor : void 0).prototype);
    r.name = "FlowCancellationError";
    return r;
  }
  Ht(t, e);
  var n = t.prototype;
  n.toString = function r() {
    return "Error: " + this.message;
  };
  return t;
})(/* @__PURE__ */ Bt(Error));
var Ct = /* @__PURE__ */ Xr("flow");
var jo = /* @__PURE__ */ Xr("flow.bound", {
  bound: true
});
var Re = /* @__PURE__ */ Object.assign(function e(t, n) {
  if (Ke(n)) {
    return Ct.decorate_20223_(t, n);
  }
  if (be(n)) {
    return Fe(t, n, Ct);
  }
  if (false) {
    h("Flow expects single argument with generator function");
  }
  var r = t;
  var i = r.name || "<unnamed flow>";
  var o = function s() {
    var a = this;
    var u = arguments;
    var c = ++Po;
    var l = F(i + " - runid: " + c + " - init", r).apply(a, u);
    var d;
    var v = void 0;
    var O = new Promise(function(b, A) {
      var D = 0;
      d = A;
      function M(V) {
        v = void 0;
        var E;
        try {
          E = F(i + " - runid: " + c + " - yield " + D++, l.next).call(l, V);
        } catch (S) {
          return A(S);
        }
        X(E);
      }
      function N(V) {
        v = void 0;
        var E;
        try {
          E = F(i + " - runid: " + c + " - yield " + D++, l["throw"]).call(l, V);
        } catch (S) {
          return A(S);
        }
        X(E);
      }
      function X(V) {
        if (G(V == null ? void 0 : V.then)) {
          V.then(X, A);
          return;
        }
        if (V.done) {
          return b(V.value);
        }
        v = Promise.resolve(V.value);
        return v.then(M, N);
      }
      M(void 0);
    });
    O.cancel = F(i + " - runid: " + c + " - cancel", function() {
      try {
        if (v) {
          Dr(v);
        }
        var b = l["return"](void 0);
        var A = Promise.resolve(b.value);
        A.then(Ve, Ve);
        Dr(A);
        d(new To());
      } catch (D) {
        d(D);
      }
    });
    return O;
  };
  o.isMobXFlow = true;
  return o;
}, Ct);
Re.bound = /* @__PURE__ */ ee(jo);
function Dr(e) {
  if (G(e.cancel)) {
    e.cancel();
  }
}
function Ue(e) {
  return (e == null ? void 0 : e.isMobXFlow) === true;
}
function Io(e, t) {
  if (!e) {
    return false;
  }
  if (t !== void 0) {
    if (false) {
      return h("isObservable(object, propertyName) is not supported for arrays and maps. Use map.has or array.length instead.");
    }
    if ($e(e)) {
      var n, r;
      var i = e[p];
      return i.values_.has(t) || !!((n = i.lazyComputedKeys_) != null && n.has(t)) || !!((r = i.lazyObservableKeys_) != null && r.has(t));
    }
    return false;
  }
  return $e(e) || !!e[p] || Xt(e) || ft(e) || Ot(e);
}
function wn(e) {
  if (false) {
    h("isObservable expects only 1 argument. Use isObservableProp to inspect the observability of a property");
  }
  return Io(e);
}
function Bo() {
  if (true) {
    return;
  }
  var e = false;
  for (var t = arguments.length, n = new Array(t), r = 0; r < t; r++) {
    n[r] = arguments[r];
  }
  if (typeof n[n.length - 1] === "boolean") {
    e = n.pop();
  }
  var i = ko(n);
  if (!i) {
    return h("'trace(break?)' can only be used inside a tracked computed value or a Reaction. Consider passing in the computed value or reaction explicitly");
  }
  if (i.isTracing_ === ce.NONE) {
    console.log("[mobx.trace] '" + i.name_ + "' tracing enabled");
  }
  i.isTracing_ = e ? ce.BREAK : ce.LOG;
}
function ko(e) {
  switch (e.length) {
    case 0:
      return f.trackingDerivation;
    case 1:
      return le(e[0]);
    case 2:
      return le(e[0], e[1]);
  }
}
function ie(e, t) {
  if (t === void 0) {
    t = void 0;
  }
  $();
  try {
    return e.apply(t);
  } finally {
    z();
  }
}
function Ae(e) {
  return e[p];
}
var Lo = {
  has: function e(t, n) {
    if (false) {
      warnAboutProxyRequirement("detect new properties using the 'in' operator. Use 'has' from 'mobx' instead.");
    }
    return Ae(t).has_(n);
  },
  get: function e(t, n) {
    return Ae(t).get_(n);
  },
  set: function e(t, n, r) {
    var i;
    if (!be(n)) {
      return false;
    }
    if (false) {
      warnAboutProxyRequirement("add a new observable property through direct assignment. Use 'set' from 'mobx' instead.");
    }
    return (i = Ae(t).set_(n, r, true)) != null ? i : true;
  },
  deleteProperty: function e(t, n) {
    var r;
    if (false) {
      warnAboutProxyRequirement("delete properties from an observable object. Use 'remove' from 'mobx' instead.");
    }
    if (!be(n)) {
      return false;
    }
    return (r = Ae(t).delete_(n, true)) != null ? r : true;
  },
  defineProperty: function e(t, n, r) {
    var i;
    if (false) {
      warnAboutProxyRequirement("define property on an observable object. Use 'defineProperty' from 'mobx' instead.");
    }
    return (i = Ae(t).defineProperty_(n, r)) != null ? i : true;
  },
  ownKeys: function e(t) {
    if (false) {
      warnAboutProxyRequirement("iterate keys to detect added / removed properties. Use 'keys' from 'mobx' instead.");
    }
    return Ae(t).ownKeys_();
  },
  preventExtensions: function e(t) {
    h(13);
  }
};
function Uo(e, t) {
  var n, r;
  $r();
  e = Ne(e, t);
  return (r = (n = e[p]).proxy_) != null ? r : n.proxy_ = new Proxy(e, Lo);
}
function L(e) {
  return e.interceptors_ !== void 0 && e.interceptors_.length > 0;
}
function Ge(e, t) {
  var n = e.interceptors_ || (e.interceptors_ = []);
  n.push(t);
  return zr(function() {
    var r = n.indexOf(t);
    if (r !== -1) {
      n.splice(r, 1);
    }
  });
}
function U(e, t) {
  var n = Ee();
  try {
    var r = [].concat(e.interceptors_ || []);
    for (var i = 0, o = r.length; i < o; i++) {
      t = r[i](t);
      if (t && !t.type) {
        h(14);
      }
      if (!t) {
        break;
      }
    }
    return t;
  } finally {
    se(n);
  }
}
function K(e) {
  return e.changeListeners_ !== void 0 && e.changeListeners_.length > 0;
}
function We(e, t) {
  var n = e.changeListeners_ || (e.changeListeners_ = []);
  n.push(t);
  return zr(function() {
    var r = n.indexOf(t);
    if (r !== -1) {
      n.splice(r, 1);
    }
  });
}
function q(e, t) {
  var n = Ee();
  var r = e.changeListeners_;
  if (!r) {
    return;
  }
  r = r.slice();
  for (var i = 0, o = r.length; i < o; i++) {
    r[i](t);
  }
  se(n);
}
function de(e, t, n) {
  pe(function() {
    var r;
    var i = Ne(e, n)[p];
    if (false) {
      h("makeObservable second arg must be nullish when using decorators. Mixing @decorator syntax with annotations is not supported.");
    }
    (r = t) != null ? r : t = _i(e);
    xe(t).forEach(function(o) {
      return i.make_(o, t[o]);
    });
  });
  return e;
}
var Pt = /* @__PURE__ */ Symbol("mobx-keys");
function $o(e, t, n) {
  if (false) {
    if (!ae(e) && !ae(Object.getPrototypeOf(e))) {
      h("'makeAutoObservable' can only be used for classes that don't have a superclass");
    }
    if ($e(e)) {
      h("makeAutoObservable can only be used on objects not already made observable");
    }
  }
  if (ae(e)) {
    return yn(e, e, t, n);
  }
  pe(function() {
    var r = Ne(e, n)[p];
    if (!e[Pt]) {
      var i = Object.getPrototypeOf(e);
      var o = new Set([].concat(xe(e), xe(i)));
      o["delete"]("constructor");
      o["delete"](p);
      ze(i, Pt, o);
    }
    e[Pt].forEach(function(s) {
      return r.make_(
        s,
        // must pass "undefined" for { key: undefined }
        !t ? true : s in t ? t[s] : true
      );
    });
  });
  return e;
}
var xr = "splice";
var te = "update";
var zo = 1e4;
var Fo = {
  get: function e(t, n) {
    var r = t[p];
    if (n === p) {
      return r;
    }
    if (n === "length") {
      return r.getArrayLength_();
    }
    if (typeof n === "string" && !isNaN(n)) {
      return r.get_(parseInt(n));
    }
    if (oe(dt, n)) {
      return dt[n];
    }
    return t[n];
  },
  set: function e(t, n, r) {
    var i = t[p];
    if (n === "length") {
      i.setArrayLength_(r);
    }
    if (typeof n === "symbol" || isNaN(n)) {
      t[n] = r;
    } else {
      i.set_(parseInt(n), r);
    }
    return true;
  },
  preventExtensions: function e() {
    h(15);
  }
};
var tr = /* @__PURE__ */ (function() {
  function e(n, r, i, o) {
    if (n === void 0) {
      n = false ? "ObservableArray@" + getNextId() : "ObservableArray";
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
    this.owned_ = i;
    this.legacyMode_ = o;
    this.atom_ = new fe(n);
    this.enhancer_ = function(s, a) {
      return r(s, a, false ? n + "[..]" : "ObservableArray[..]");
    };
  }
  var t = e.prototype;
  t.dehanceValue_ = function n(r) {
    if (this.dehancer !== void 0) {
      return this.dehancer(r);
    }
    return r;
  };
  t.dehanceValues_ = function n(r) {
    if (this.dehancer !== void 0 && r.length > 0) {
      return r.map(this.dehancer);
    }
    return r;
  };
  t.intercept_ = function n(r) {
    return Ge(this, r);
  };
  t.observe_ = function n(r, i) {
    if (i === void 0) {
      i = false;
    }
    if (i) {
      r({
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
    return We(this, r);
  };
  t.getArrayLength_ = function n() {
    this.atom_.reportObserved();
    return this.values_.length;
  };
  t.setArrayLength_ = function n(r) {
    if (typeof r !== "number" || isNaN(r) || r < 0) {
      h("Out of range: " + r);
    }
    var i = this.values_.length;
    if (r === i) {
      return;
    } else if (r > i) {
      var o = new Array(r - i);
      for (var s = 0; s < r - i; s++) {
        o[s] = void 0;
      }
      this.spliceWithArray_(i, 0, o);
    } else {
      this.spliceWithArray_(r, i - r);
    }
  };
  t.updateArrayLength_ = function n(r, i) {
    if (r !== this.lastKnownLength_) {
      h(16);
    }
    this.lastKnownLength_ += i;
    if (this.legacyMode_ && i > 0) {
      Mn(r + i + 1);
    }
  };
  t.spliceWithArray_ = function n(r, i, o) {
    var s = this;
    Z(this.atom_);
    var a = this.values_.length;
    if (r === void 0) {
      r = 0;
    } else if (r > a) {
      r = a;
    } else if (r < 0) {
      r = Math.max(0, a + r);
    }
    if (arguments.length === 1) {
      i = a - r;
    } else if (i === void 0 || i === null) {
      i = 0;
    } else {
      i = Math.max(0, Math.min(i, a - r));
    }
    if (o === void 0) {
      o = jt;
    }
    if (L(this)) {
      var u = U(this, {
        object: this.proxy_,
        type: xr,
        index: r,
        removedCount: i,
        added: o
      });
      if (!u) {
        return jt;
      }
      i = u.removedCount;
      o = u.added;
    }
    o = o.length === 0 ? o : o.map(function(d) {
      return s.enhancer_(d, void 0);
    });
    if (this.legacyMode_ || false) {
      var c = o.length - i;
      this.updateArrayLength_(a, c);
    }
    var l = this.spliceItemsIntoValues_(r, i, o);
    if (i !== 0 || o.length !== 0) {
      this.notifyArraySplice_(r, o, l);
    }
    return this.dehanceValues_(l);
  };
  t.spliceItemsIntoValues_ = function n(r, i, o) {
    if (o.length < zo) {
      var s;
      return (s = this.values_).splice.apply(s, [r, i].concat(o));
    } else {
      var a = this.values_.slice(r, r + i);
      var u = this.values_.slice(r + i);
      this.values_.length += o.length - i;
      for (var c = 0; c < o.length; c++) {
        this.values_[r + c] = o[c];
      }
      for (var l = 0; l < u.length; l++) {
        this.values_[r + o.length + l] = u[l];
      }
      return a;
    }
  };
  t.notifyArrayChildUpdate_ = function n(r, i, o) {
    var s = !this.owned_ && _e();
    var a = K(this);
    var u = a || s ? {
      observableKind: "array",
      object: this.proxy_,
      type: te,
      debugObjectName: this.atom_.name_,
      index: r,
      newValue: i,
      oldValue: o
    } : null;
    if (false) {
      spyReportStart(u);
    }
    this.atom_.reportChanged();
    if (a) {
      q(this, u);
    }
    if (false) {
      spyReportEnd();
    }
  };
  t.notifyArraySplice_ = function n(r, i, o) {
    var s = !this.owned_ && _e();
    var a = K(this);
    var u = a || s ? {
      observableKind: "array",
      object: this.proxy_,
      debugObjectName: this.atom_.name_,
      type: xr,
      index: r,
      removed: o,
      added: i,
      removedCount: o.length,
      addedCount: i.length
    } : null;
    if (false) {
      spyReportStart(u);
    }
    this.atom_.reportChanged();
    if (a) {
      q(this, u);
    }
    if (false) {
      spyReportEnd();
    }
  };
  t.get_ = function n(r) {
    if (this.legacyMode_ && r >= this.values_.length) {
      console.warn(false ? "[mobx.array] Attempt to read an array index (" + r + ") that is out of bounds (" + this.values_.length + "). Please check length first. Out of bound indices will not be tracked by MobX" : "[mobx] Out of bounds read: " + r);
      return void 0;
    }
    this.atom_.reportObserved();
    return this.dehanceValue_(this.values_[r]);
  };
  t.set_ = function n(r, i) {
    var o = this.values_;
    if (this.legacyMode_ && r > o.length) {
      h(17, r, o.length);
    }
    if (r < o.length) {
      Z(this.atom_);
      var s = o[r];
      if (L(this)) {
        var a = U(this, {
          type: te,
          object: this.proxy_,
          // since "this" is the real array we need to pass its proxy
          index: r,
          newValue: i
        });
        if (!a) {
          return;
        }
        i = a.newValue;
      }
      i = this.enhancer_(i, s);
      var u = i !== s;
      if (u) {
        o[r] = i;
        this.notifyArrayChildUpdate_(r, i, s);
      }
    } else {
      var c = new Array(r + 1 - o.length);
      for (var l = 0; l < c.length - 1; l++) {
        c[l] = void 0;
      }
      c[c.length - 1] = i;
      this.spliceWithArray_(o.length, 0, c);
    }
  };
  return e;
})();
function Ko(e, t, n, r) {
  if (n === void 0) {
    n = false ? "ObservableArray@" + getNextId() : "ObservableArray";
  }
  if (r === void 0) {
    r = false;
  }
  $r();
  return pe(function() {
    var i = new tr(n, t, r, false);
    Kr(i.values_, p, i);
    var o = new Proxy(i.values_, Fo);
    i.proxy_ = o;
    if (e && e.length) {
      i.spliceWithArray_(0, 0, e);
    }
    return o;
  });
}
var dt = {
  clear: function e() {
    return this.splice(0);
  },
  replace: function e(t) {
    var n = this[p];
    return n.spliceWithArray_(0, n.values_.length, t);
  },
  // Used by JSON.stringify
  toJSON: function e() {
    return this.slice();
  },
  /*
   * functions that do alter the internal structure of the array, (based on lib.es6.d.ts)
   * since these functions alter the inner structure of the array, the have side effects.
   * Because the have side effects, they should not be used in computed function,
   * and for that reason the do not call dependencyState.notifyObserved
   */
  splice: function e(t, n) {
    for (var r = arguments.length, i = new Array(r > 2 ? r - 2 : 0), o = 2; o < r; o++) {
      i[o - 2] = arguments[o];
    }
    var s = this[p];
    switch (arguments.length) {
      case 0:
        return [];
      case 1:
        return s.spliceWithArray_(t);
      case 2:
        return s.spliceWithArray_(t, n);
    }
    return s.spliceWithArray_(t, n, i);
  },
  spliceWithArray: function e(t, n, r) {
    return this[p].spliceWithArray_(t, n, r);
  },
  push: function e() {
    var t = this[p];
    for (var n = arguments.length, r = new Array(n), i = 0; i < n; i++) {
      r[i] = arguments[i];
    }
    t.spliceWithArray_(t.values_.length, 0, r);
    return t.values_.length;
  },
  pop: function e() {
    return this.splice(Math.max(this[p].values_.length - 1, 0), 1)[0];
  },
  shift: function e() {
    return this.splice(0, 1)[0];
  },
  unshift: function e() {
    var t = this[p];
    for (var n = arguments.length, r = new Array(n), i = 0; i < n; i++) {
      r[i] = arguments[i];
    }
    t.spliceWithArray_(0, 0, r);
    return t.values_.length;
  },
  reverse: function e() {
    if (f.trackingDerivation) {
      h(37, "reverse");
    }
    this.replace(this.slice().reverse());
    return this;
  },
  sort: function e() {
    if (f.trackingDerivation) {
      h(37, "sort");
    }
    var t = this.slice();
    t.sort.apply(t, arguments);
    this.replace(t);
    return this;
  },
  remove: function e(t) {
    var n = this[p];
    var r = n.dehanceValues_(n.values_).indexOf(t);
    if (r > -1) {
      this.splice(r, 1);
      return true;
    }
    return false;
  }
};
y("at", B);
y("concat", B);
y("flat", B);
y("includes", B);
y("indexOf", B);
y("join", B);
y("lastIndexOf", B);
y("slice", B);
y("toString", B);
y("toLocaleString", B);
y("toSorted", B);
y("toSpliced", B);
y("with", B);
y("every", H);
y("filter", H);
y("find", H);
y("findIndex", H);
y("findLast", H);
y("findLastIndex", H);
y("flatMap", H);
y("forEach", H);
y("map", H);
y("some", H);
y("toReversed", H);
y("reduce", Nn);
y("reduceRight", Nn);
function y(e, t) {
  if (typeof Array.prototype[e] === "function") {
    dt[e] = t(e);
  }
}
function B(e) {
  return function() {
    var t = this[p];
    t.atom_.reportObserved();
    var n = t.dehanceValues_(t.values_);
    return n[e].apply(n, arguments);
  };
}
function H(e) {
  return function(t, n) {
    var r = this;
    var i = this[p];
    i.atom_.reportObserved();
    var o = i.dehanceValues_(i.values_);
    return o[e](function(s, a) {
      return t.call(n, s, a, r);
    });
  };
}
function Nn(e) {
  return function() {
    var t = this;
    var n = this[p];
    n.atom_.reportObserved();
    var r = n.dehanceValues_(n.values_);
    var i = arguments[0];
    arguments[0] = function(o, s, a) {
      return i(o, s, a, t);
    };
    return r[e].apply(r, arguments);
  };
}
var qo = /* @__PURE__ */ Oe("ObservableArrayAdministration", tr);
function wt(e) {
  return _t(e) && qo(e[p]);
}
var Go = {};
var ue = "add";
var pt = "delete";
var Sn = /* @__PURE__ */ (function() {
  function e(n, r, i) {
    var o = this;
    if (r === void 0) {
      r = ge;
    }
    if (i === void 0) {
      i = false ? "ObservableMap@" + getNextId() : "ObservableMap";
    }
    this.enhancer_ = void 0;
    this.name_ = void 0;
    this[p] = Go;
    this.data_ = void 0;
    this.hasMap_ = void 0;
    this.keysAtom_ = void 0;
    this.interceptors_ = void 0;
    this.changeListeners_ = void 0;
    this.dehancer = void 0;
    this.enhancer_ = r;
    this.name_ = i;
    if (!G(Map)) {
      h(18);
    }
    pe(function() {
      o.keysAtom_ = Yt(false ? o.name_ + ".keys()" : "ObservableMap.keys()");
      o.data_ = /* @__PURE__ */ new Map();
      o.hasMap_ = /* @__PURE__ */ new Map();
      if (n) {
        o.merge(n);
      }
    });
  }
  var t = e.prototype;
  t.has_ = function n(r) {
    return this.data_.has(r);
  };
  t.has = function n(r) {
    var i = this;
    if (!f.trackingDerivation) {
      return this.has_(r);
    }
    var o = this.hasMap_.get(r);
    if (!o) {
      var s = o = new he(this.has_(r), bt, false ? this.name_ + "." + stringifyKey(r) + "?" : "ObservableMap.key?", false);
      this.hasMap_.set(r, s);
      er(s, function() {
        return i.hasMap_["delete"](r);
      });
    }
    return o.get();
  };
  t.set = function n(r, i) {
    var o = this.has_(r);
    if (L(this)) {
      var s = U(this, {
        type: o ? te : ue,
        object: this,
        newValue: i,
        name: r
      });
      if (!s) {
        return this;
      }
      i = s.newValue;
    }
    if (o) {
      this.updateValue_(r, i);
    } else {
      this.addValue_(r, i);
    }
    return this;
  };
  t["delete"] = function n(r) {
    var i = this;
    Z(this.keysAtom_);
    if (L(this)) {
      var o = U(this, {
        type: pt,
        object: this,
        name: r
      });
      if (!o) {
        return false;
      }
    }
    if (this.has_(r)) {
      var s = _e();
      var a = K(this);
      var u = a || s ? {
        observableKind: "map",
        debugObjectName: this.name_,
        type: pt,
        object: this,
        oldValue: this.data_.get(r).value_,
        name: r
      } : null;
      if (false) {
        spyReportStart(u);
      }
      ie(function() {
        var c;
        i.keysAtom_.reportChanged();
        (c = i.hasMap_.get(r)) == null || c.setNewValue_(false);
        var l = i.data_.get(r);
        l.setNewValue_(void 0);
        i.data_["delete"](r);
      });
      if (a) {
        q(this, u);
      }
      if (false) {
        spyReportEnd();
      }
      return true;
    }
    return false;
  };
  t.updateValue_ = function n(r, i) {
    var o = this.data_.get(r);
    i = o.prepareNewValue_(i);
    if (i !== f.UNCHANGED) {
      var s = _e();
      var a = K(this);
      var u = a || s ? {
        observableKind: "map",
        debugObjectName: this.name_,
        type: te,
        object: this,
        oldValue: o.value_,
        name: r,
        newValue: i
      } : null;
      if (false) {
        spyReportStart(u);
      }
      o.setNewValue_(i);
      if (a) {
        q(this, u);
      }
      if (false) {
        spyReportEnd();
      }
    }
  };
  t.addValue_ = function n(r, i) {
    var o = this;
    Z(this.keysAtom_);
    ie(function() {
      var c;
      var l = new he(i, o.enhancer_, false ? o.name_ + "." + stringifyKey(r) : "ObservableMap.key", false);
      o.data_.set(r, l);
      i = l.value_;
      (c = o.hasMap_.get(r)) == null || c.setNewValue_(true);
      o.keysAtom_.reportChanged();
    });
    var s = _e();
    var a = K(this);
    var u = a || s ? {
      observableKind: "map",
      debugObjectName: this.name_,
      type: ue,
      object: this,
      name: r,
      newValue: i
    } : null;
    if (false) {
      spyReportStart(u);
    }
    if (a) {
      q(this, u);
    }
    if (false) {
      spyReportEnd();
    }
  };
  t.get = function n(r) {
    if (this.has(r)) {
      return this.dehanceValue_(this.data_.get(r).get());
    }
    return this.dehanceValue_(void 0);
  };
  t.getOrInsert = function n(r, i) {
    if (!this.has(r)) {
      this.set(r, i);
    }
    return this.get(r);
  };
  t.getOrInsertComputed = function n(r, i) {
    if (!this.has(r)) {
      this.set(r, i(r));
    }
    return this.get(r);
  };
  t.dehanceValue_ = function n(r) {
    if (this.dehancer !== void 0) {
      return this.dehancer(r);
    }
    return r;
  };
  t.keys = function n() {
    this.keysAtom_.reportObserved();
    return this.data_.keys();
  };
  t.values = function n() {
    var r = this;
    var i = this.keys();
    return Mr({
      next: function o() {
        var s = i.next(), a = s.done, u = s.value;
        return {
          done: a,
          value: a ? void 0 : r.get(u)
        };
      }
    });
  };
  t.entries = function n() {
    var r = this;
    var i = this.keys();
    return Mr({
      next: function o() {
        var s = i.next(), a = s.done, u = s.value;
        return {
          done: a,
          value: a ? void 0 : [u, r.get(u)]
        };
      }
    });
  };
  t[Symbol.iterator] = function() {
    return this.entries();
  };
  t.forEach = function n(r, i) {
    for (var o = De(this), s; !(s = o()).done; ) {
      var a = s.value, u = a[0], c = a[1];
      r.call(i, c, u, this);
    }
  };
  t.merge = function n(r) {
    var i = this;
    if (we(r)) {
      r = new Map(r);
    }
    ie(function() {
      if (ae(r)) {
        ui(r).forEach(function(o) {
          return i.set(o, r[o]);
        });
      } else if (Array.isArray(r)) {
        r.forEach(function(o) {
          var s = o[0], a = o[1];
          return i.set(s, a);
        });
      } else if (Ce(r)) {
        if (!ai(r)) {
          h(19, r);
        }
        r.forEach(function(o, s) {
          return i.set(s, o);
        });
      } else if (r !== null && r !== void 0) {
        h(20, r);
      }
    });
    return this;
  };
  t.clear = function n() {
    var r = this;
    ie(function() {
      Et(function() {
        for (var i = De(r.keys()), o; !(o = i()).done; ) {
          var s = o.value;
          r["delete"](s);
        }
      });
    });
  };
  t.replace = function n(r) {
    var i = this;
    ie(function() {
      var o = Wo(r);
      var s = /* @__PURE__ */ new Map();
      var a = false;
      for (var u = De(i.data_.keys()), c; !(c = u()).done; ) {
        var l = c.value;
        if (!o.has(l)) {
          var d = i["delete"](l);
          if (d) {
            a = true;
          } else {
            var v = i.data_.get(l);
            s.set(l, v);
          }
        }
      }
      for (var O = De(o.entries()), b; !(b = O()).done; ) {
        var A = b.value, D = A[0], M = A[1];
        var N = i.data_.has(D);
        i.set(D, M);
        if (i.data_.has(D)) {
          var X = i.data_.get(D);
          s.set(D, X);
          if (!N) {
            a = true;
          }
        }
      }
      if (!a) {
        if (i.data_.size !== s.size) {
          i.keysAtom_.reportChanged();
        } else {
          var V = i.data_.keys();
          var E = s.keys();
          var S = V.next();
          var Ie = E.next();
          while (!S.done) {
            if (S.value !== Ie.value) {
              i.keysAtom_.reportChanged();
              break;
            }
            S = V.next();
            Ie = E.next();
          }
        }
      }
      i.data_ = s;
    });
    return this;
  };
  t.toString = function n() {
    return "[object ObservableMap]";
  };
  t.toJSON = function n() {
    return Array.from(this);
  };
  t.observe_ = function n(r, i) {
    if (false) {
      h("`observe` doesn't support fireImmediately=true in combination with maps.");
    }
    return We(this, r);
  };
  t.intercept_ = function n(r) {
    return Ge(this, r);
  };
  return Pe(e, [{
    key: "size",
    get: function n() {
      this.keysAtom_.reportObserved();
      return this.data_.size;
    }
  }, {
    key: Symbol.toStringTag,
    get: function n() {
      return "Map";
    }
  }]);
})();
var we = /* @__PURE__ */ Oe("ObservableMap", Sn);
function Mr(e) {
  e[Symbol.toStringTag] = "MapIterator";
  return ir(e);
}
function Wo(e) {
  if (Ce(e) || we(e)) {
    return e;
  } else if (Array.isArray(e)) {
    return new Map(e);
  } else if (ae(e)) {
    var t = /* @__PURE__ */ new Map();
    for (var n in e) {
      t.set(n, e[n]);
    }
    return t;
  } else {
    return h(21, e);
  }
}
var Ho = {};
var An = /* @__PURE__ */ (function() {
  function e(n, r, i) {
    var o = this;
    if (r === void 0) {
      r = ge;
    }
    if (i === void 0) {
      i = false ? "ObservableSet@" + getNextId() : "ObservableSet";
    }
    this.name_ = void 0;
    this[p] = Ho;
    this.data_ = /* @__PURE__ */ new Set();
    this.atom_ = void 0;
    this.changeListeners_ = void 0;
    this.interceptors_ = void 0;
    this.dehancer = void 0;
    this.enhancer_ = void 0;
    this.name_ = i;
    if (!G(Set)) {
      h(22);
    }
    this.enhancer_ = function(s, a) {
      return r(s, a, i);
    };
    pe(function() {
      o.atom_ = Yt(o.name_);
      if (n) {
        o.replace(n);
      }
    });
  }
  var t = e.prototype;
  t.dehanceValue_ = function n(r) {
    if (this.dehancer !== void 0) {
      return this.dehancer(r);
    }
    return r;
  };
  t.clear = function n() {
    var r = this;
    ie(function() {
      Et(function() {
        for (var i = De(r.data_.values()), o; !(o = i()).done; ) {
          var s = o.value;
          r["delete"](s);
        }
      });
    });
  };
  t.forEach = function n(r, i) {
    for (var o = De(this), s; !(s = o()).done; ) {
      var a = s.value;
      r.call(i, a, a, this);
    }
  };
  t.add = function n(r) {
    var i = this;
    Z(this.atom_);
    if (L(this)) {
      var o = U(this, {
        type: ue,
        object: this,
        newValue: r
      });
      if (!o) {
        return this;
      }
      r = o.newValue;
    }
    if (!this.has(r)) {
      ie(function() {
        i.data_.add(i.enhancer_(r, void 0));
        i.atom_.reportChanged();
      });
      var s = false;
      var a = K(this);
      var u = a || s ? {
        observableKind: "set",
        debugObjectName: this.name_,
        type: ue,
        object: this,
        newValue: r
      } : null;
      if (s && false) {
        spyReportStart(u);
      }
      if (a) {
        q(this, u);
      }
      if (s && false) {
        spyReportEnd();
      }
    }
    return this;
  };
  t["delete"] = function n(r) {
    var i = this;
    if (L(this)) {
      var o = U(this, {
        type: pt,
        object: this,
        oldValue: r
      });
      if (!o) {
        return false;
      }
    }
    if (this.has(r)) {
      var s = false;
      var a = K(this);
      var u = a || s ? {
        observableKind: "set",
        debugObjectName: this.name_,
        type: pt,
        object: this,
        oldValue: r
      } : null;
      if (s && false) {
        spyReportStart(u);
      }
      ie(function() {
        i.atom_.reportChanged();
        i.data_["delete"](r);
      });
      if (a) {
        q(this, u);
      }
      if (s && false) {
        spyReportEnd();
      }
      return true;
    }
    return false;
  };
  t.has = function n(r) {
    this.atom_.reportObserved();
    return this.data_.has(this.dehanceValue_(r));
  };
  t.entries = function n() {
    var r = this.values();
    return Rr({
      next: function i() {
        var o = r.next(), s = o.value, a = o.done;
        return !a ? {
          value: [s, s],
          done: a
        } : {
          value: void 0,
          done: a
        };
      }
    });
  };
  t.keys = function n() {
    return this.values();
  };
  t.values = function n() {
    this.atom_.reportObserved();
    var r = this;
    var i = this.data_.values();
    return Rr({
      next: function o() {
        var s = i.next(), a = s.value, u = s.done;
        return !u ? {
          value: r.dehanceValue_(a),
          done: u
        } : {
          value: void 0,
          done: u
        };
      }
    });
  };
  t.intersection = function n(r) {
    if (ne(r) && !Y(r)) {
      return r.intersection(this);
    } else {
      var i = new Set(this);
      return i.intersection(r);
    }
  };
  t.union = function n(r) {
    if (ne(r) && !Y(r)) {
      return r.union(this);
    } else {
      var i = new Set(this);
      return i.union(r);
    }
  };
  t.difference = function n(r) {
    return new Set(this).difference(r);
  };
  t.symmetricDifference = function n(r) {
    if (ne(r) && !Y(r)) {
      return r.symmetricDifference(this);
    } else {
      var i = new Set(this);
      return i.symmetricDifference(r);
    }
  };
  t.isSubsetOf = function n(r) {
    return new Set(this).isSubsetOf(r);
  };
  t.isSupersetOf = function n(r) {
    return new Set(this).isSupersetOf(r);
  };
  t.isDisjointFrom = function n(r) {
    if (ne(r) && !Y(r)) {
      return r.isDisjointFrom(this);
    } else {
      var i = new Set(this);
      return i.isDisjointFrom(r);
    }
  };
  t.replace = function n(r) {
    var i = this;
    if (Y(r)) {
      r = new Set(r);
    }
    ie(function() {
      if (Array.isArray(r)) {
        i.clear();
        r.forEach(function(o) {
          return i.add(o);
        });
      } else if (ne(r)) {
        i.clear();
        r.forEach(function(o) {
          return i.add(o);
        });
      } else if (r !== null && r !== void 0) {
        h("Cannot initialize set from " + r);
      }
    });
    return this;
  };
  t.observe_ = function n(r, i) {
    if (false) {
      h("`observe` doesn't support fireImmediately=true in combination with sets.");
    }
    return We(this, r);
  };
  t.intercept_ = function n(r) {
    return Ge(this, r);
  };
  t.toJSON = function n() {
    return Array.from(this);
  };
  t.toString = function n() {
    return "[object ObservableSet]";
  };
  t[Symbol.iterator] = function() {
    return this.values();
  };
  return Pe(e, [{
    key: "size",
    get: function n() {
      this.atom_.reportObserved();
      return this.data_.size;
    }
  }, {
    key: Symbol.toStringTag,
    get: function n() {
      return "Set";
    }
  }]);
})();
var Y = /* @__PURE__ */ Oe("ObservableSet", An);
function Rr(e) {
  e[Symbol.toStringTag] = "SetIterator";
  return ir(e);
}
var Cr = /* @__PURE__ */ Object.create(null);
var Pr = "remove";
var Vn = /* @__PURE__ */ (function() {
  function e(n, r, i, o) {
    if (r === void 0) {
      r = /* @__PURE__ */ new Map();
    }
    if (o === void 0) {
      o = zi;
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
    this.target_ = n;
    this.values_ = r;
    this.name_ = i;
    this.defaultAnnotation_ = o;
    this.keysAtom_ = new fe(false ? this.name_ + ".keys" : "ObservableObject.keys");
    this.isPlainObject_ = ae(this.target_);
    if (false) {
      h("defaultAnnotation must be valid annotation");
    }
    if (false) {
      this.appliedAnnotations_ = {};
    }
  }
  var t = e.prototype;
  t.getObservablePropValue_ = function n(r) {
    var i, o;
    var s = (i = (o = this.values_.get(r)) != null ? o : this.materializeLazyComputed_(r)) != null ? i : this.materializeLazyObservable_(r);
    return s.get();
  };
  t.materializeLazyComputed_ = function n(r) {
    var i;
    var o = (i = this.lazyComputedKeys_) == null ? void 0 : i.get(r);
    if (!o) {
      return void 0;
    }
    this.lazyComputedKeys_["delete"](r);
    if (this.lazyComputedKeys_.size === 0) {
      this.lazyComputedKeys_ = void 0;
    }
    var s = o();
    this.values_.set(r, s);
    return s;
  };
  t.materializeLazyObservable_ = function n(r) {
    var i;
    var o = (i = this.lazyObservableKeys_) == null ? void 0 : i.get(r);
    if (!o) {
      return void 0;
    }
    this.lazyObservableKeys_["delete"](r);
    if (this.lazyObservableKeys_.size === 0) {
      this.lazyObservableKeys_ = void 0;
    }
    var s = o();
    this.values_.set(r, s);
    return s;
  };
  t.setObservablePropValue_ = function n(r, i) {
    var o, s;
    var a = (o = (s = this.values_.get(r)) != null ? s : this.materializeLazyComputed_(r)) != null ? o : this.materializeLazyObservable_(r);
    if (a instanceof I) {
      a.set(i);
      return true;
    }
    if (L(this)) {
      var u = U(this, {
        type: te,
        object: this.proxy_ || this.target_,
        name: r,
        newValue: i
      });
      if (!u) {
        return null;
      }
      i = u.newValue;
    }
    i = a.prepareNewValue_(i);
    if (i !== f.UNCHANGED) {
      var c = K(this);
      var l = false;
      var d = c || l ? {
        type: te,
        observableKind: "object",
        debugObjectName: this.name_,
        object: this.proxy_ || this.target_,
        oldValue: a.value_,
        name: r,
        newValue: i
      } : null;
      if (false) {
        spyReportStart(d);
      }
      a.setNewValue_(i);
      if (c) {
        q(this, d);
      }
      if (false) {
        spyReportEnd();
      }
    }
    return true;
  };
  t.get_ = function n(r) {
    if (f.trackingDerivation && !oe(this.target_, r)) {
      this.has_(r);
    }
    return this.target_[r];
  };
  t.set_ = function n(r, i, o) {
    if (o === void 0) {
      o = false;
    }
    if (oe(this.target_, r)) {
      if (this.values_.has(r)) {
        return this.setObservablePropValue_(r, i);
      } else if (o) {
        return Reflect.set(this.target_, r, i);
      } else {
        this.target_[r] = i;
        return true;
      }
    } else {
      return this.extend_(r, {
        value: i,
        enumerable: true,
        writable: true,
        configurable: true
      }, this.defaultAnnotation_, o);
    }
  };
  t.has_ = function n(r) {
    if (!f.trackingDerivation) {
      return r in this.target_;
    }
    this.pendingKeys_ || (this.pendingKeys_ = /* @__PURE__ */ new Map());
    var i = this.pendingKeys_.get(r);
    if (!i) {
      i = new he(r in this.target_, bt, false ? this.name_ + "." + stringifyKey(r) + "?" : "ObservableObject.key?", false);
      this.pendingKeys_.set(r, i);
    }
    return i.get();
  };
  t.make_ = function n(r, i) {
    if (i === true) {
      i = this.defaultAnnotation_;
    }
    if (i === false) {
      return;
    }
    Ir(this, i, r);
    if (!(r in this.target_)) {
      var o;
      if ((o = this.target_[J]) != null && o[r]) {
        return;
      } else {
        h(1, i.annotationType_, this.name_ + "." + r.toString());
      }
    }
    var s = this.target_;
    while (s && s !== ht) {
      var a = ut(s, r);
      if (a) {
        var u = i.make_(this, r, a, s);
        if (u === 0) {
          return;
        }
        if (u === 1) {
          break;
        }
      }
      s = Object.getPrototypeOf(s);
    }
    jr(this, i, r);
  };
  t.extend_ = function n(r, i, o, s) {
    if (s === void 0) {
      s = false;
    }
    if (o === true) {
      o = this.defaultAnnotation_;
    }
    if (o === false) {
      return this.defineProperty_(r, i, s);
    }
    Ir(this, o, r);
    var a = o.extend_(this, r, i, s);
    if (a) {
      jr(this, o, r);
    }
    return a;
  };
  t.defineProperty_ = function n(r, i, o) {
    if (o === void 0) {
      o = false;
    }
    Z(this.keysAtom_);
    try {
      $();
      var s = this.delete_(r);
      if (!s) {
        return s;
      }
      if (L(this)) {
        var a = U(this, {
          object: this.proxy_ || this.target_,
          name: r,
          type: ue,
          newValue: i.value
        });
        if (!a) {
          return null;
        }
        var u = a.newValue;
        if (i.value !== u) {
          i = me({}, i, {
            value: u
          });
        }
      }
      if (o) {
        if (!Reflect.defineProperty(this.target_, r, i)) {
          return false;
        }
      } else {
        Q(this.target_, r, i);
      }
      this.notifyPropertyAddition_(r, i.value);
    } finally {
      z();
    }
    return true;
  };
  t.defineObservableProperty_ = function n(r, i, o, s) {
    if (s === void 0) {
      s = false;
    }
    Z(this.keysAtom_);
    try {
      $();
      var a = this.delete_(r);
      if (!a) {
        return a;
      }
      if (L(this)) {
        var u = U(this, {
          object: this.proxy_ || this.target_,
          name: r,
          type: ue,
          newValue: i
        });
        if (!u) {
          return null;
        }
        i = u.newValue;
      }
      var c = Tr(r);
      var l = {
        configurable: f.safeDescriptors ? this.isPlainObject_ : true,
        enumerable: true,
        get: c.get,
        set: c.set
      };
      if (s) {
        if (!Reflect.defineProperty(this.target_, r, l)) {
          return false;
        }
      } else {
        Q(this.target_, r, l);
      }
      var d = new he(i, o, false ? this.name_ + "." + r.toString() : "ObservableObject.key", false);
      this.values_.set(r, d);
      this.notifyPropertyAddition_(r, d.value_);
    } finally {
      z();
    }
    return true;
  };
  t.defineComputedProperty_ = function n(r, i, o) {
    if (o === void 0) {
      o = false;
    }
    Z(this.keysAtom_);
    try {
      $();
      var s = this.delete_(r);
      if (!s) {
        return s;
      }
      if (L(this)) {
        var a = U(this, {
          object: this.proxy_ || this.target_,
          name: r,
          type: ue,
          newValue: void 0
        });
        if (!a) {
          return null;
        }
      }
      i.name || (i.name = false ? this.name_ + "." + r.toString() : "ObservableObject.key");
      i.context = this.proxy_ || this.target_;
      var u = Tr(r);
      var c = {
        configurable: f.safeDescriptors ? this.isPlainObject_ : true,
        enumerable: false,
        get: u.get,
        set: u.set
      };
      if (o) {
        if (!Reflect.defineProperty(this.target_, r, c)) {
          return false;
        }
      } else {
        Q(this.target_, r, c);
      }
      this.values_.set(r, new I(i));
      this.notifyPropertyAddition_(r, void 0);
    } finally {
      z();
    }
    return true;
  };
  t.delete_ = function n(r, i) {
    if (i === void 0) {
      i = false;
    }
    Z(this.keysAtom_);
    if (!oe(this.target_, r)) {
      return true;
    }
    if (L(this)) {
      var o = U(this, {
        object: this.proxy_ || this.target_,
        name: r,
        type: Pr
      });
      if (!o) {
        return null;
      }
    }
    try {
      var s;
      $();
      var a = K(this);
      var u = false;
      var c = this.values_.get(r);
      var l = void 0;
      if (!c && (a || u)) {
        var d;
        l = (d = ut(this.target_, r)) == null ? void 0 : d.value;
      }
      if (i) {
        if (!Reflect.deleteProperty(this.target_, r)) {
          return false;
        }
      } else {
        delete this.target_[r];
      }
      if (false) {
        delete this.appliedAnnotations_[r];
      }
      if (c) {
        this.values_["delete"](r);
        if (c instanceof he) {
          l = c.value_;
        }
        ln(c);
      }
      this.keysAtom_.reportChanged();
      (s = this.pendingKeys_) == null || (s = s.get(r)) == null || s.set(r in this.target_);
      if (a || u) {
        var v = {
          type: Pr,
          observableKind: "object",
          object: this.proxy_ || this.target_,
          debugObjectName: this.name_,
          oldValue: l,
          name: r
        };
        if (false) {
          spyReportStart(v);
        }
        if (a) {
          q(this, v);
        }
        if (false) {
          spyReportEnd();
        }
      }
    } finally {
      z();
    }
    return true;
  };
  t.observe_ = function n(r, i) {
    if (false) {
      h("`observe` doesn't support the fire immediately property for observable objects.");
    }
    return We(this, r);
  };
  t.intercept_ = function n(r) {
    return Ge(this, r);
  };
  t.notifyPropertyAddition_ = function n(r, i) {
    var o;
    var s = K(this);
    var a = false;
    if (s || a) {
      var u = s || a ? {
        type: ue,
        observableKind: "object",
        debugObjectName: this.name_,
        object: this.proxy_ || this.target_,
        name: r,
        newValue: i
      } : null;
      if (false) {
        spyReportStart(u);
      }
      if (s) {
        q(this, u);
      }
      if (false) {
        spyReportEnd();
      }
    }
    (o = this.pendingKeys_) == null || (o = o.get(r)) == null || o.set(true);
    this.keysAtom_.reportChanged();
  };
  t.ownKeys_ = function n() {
    this.keysAtom_.reportObserved();
    return xe(this.target_);
  };
  t.keys_ = function n() {
    this.keysAtom_.reportObserved();
    return Object.keys(this.target_);
  };
  return e;
})();
function Ne(e, t) {
  var n;
  if (false) {
    h("Options can't be provided for already observable objects.");
  }
  if (oe(e, p)) {
    if (false) {
      h("Cannot convert '" + qt(e) + "' into observable object:\nThe target is already observable of different type.\nExtending builtins is not supported.");
    }
    return e;
  }
  if (false) {
    h("Cannot make the designated object observable; it is not extensible");
  }
  var r = (n = t == null ? void 0 : t.name) != null ? n : false ? (ae(e) ? "ObservableObject" : e.constructor.name) + "@" + getNextId() : "ObservableObject";
  var i = new Vn(e, /* @__PURE__ */ new Map(), String(r), Qi(t));
  ze(e, p, i);
  return e;
}
var Xo = /* @__PURE__ */ Oe("ObservableObjectAdministration", Vn);
function Tr(e) {
  return Cr[e] || (Cr[e] = {
    get: function t() {
      return this[p].getObservablePropValue_(e);
    },
    set: function t(n) {
      return this[p].setObservablePropValue_(e, n);
    }
  });
}
function $e(e) {
  if (_t(e)) {
    return Xo(e[p]);
  }
  return false;
}
function jr(e, t, n) {
  var r;
  if (false) {
    e.appliedAnnotations_[n] = t;
  }
  (r = e.target_[J]) == null || delete r[n];
}
function Ir(e, t, n) {
  if (false) {
    h("Cannot annotate '" + e.name_ + "." + n.toString() + "': Invalid annotation.");
  }
  if (false) {
    var r = e.name_ + "." + n.toString();
    var i = e.appliedAnnotations_[n].annotationType_;
    var o = t.annotationType_;
    h("Cannot apply '" + o + "' to '" + r + "':" + ("\nThe field is already annotated with '" + i + "'.") + "\nRe-annotating fields is not allowed.\nUse 'override' annotation for methods overridden by subclass.");
  }
}
var Yo = /* @__PURE__ */ xn(0);
var Jo = /* @__PURE__ */ (function() {
  var e = false;
  var t = {};
  Object.defineProperty(t, "0", {
    set: function n() {
      e = true;
    }
  });
  Object.create(t)["0"] = 1;
  return e === false;
})();
var Tt = 0;
var Dn = function e() {
};
function Zo(e, t) {
  if (Object.setPrototypeOf) {
    Object.setPrototypeOf(e.prototype, t);
  } else if (e.prototype.__proto__ !== void 0) {
    e.prototype.__proto__ = t;
  } else {
    e.prototype = t;
  }
}
Zo(Dn, Array.prototype);
var rr = /* @__PURE__ */ (function(e) {
  function t(r, i, o, s) {
    var a;
    if (o === void 0) {
      o = false ? "ObservableArray@" + getNextId() : "ObservableArray";
    }
    if (s === void 0) {
      s = false;
    }
    a = e.call(this) || this;
    pe(function() {
      var u = new tr(o, i, s, true);
      u.proxy_ = a;
      Kr(a, p, u);
      if (r && r.length) {
        a.spliceWithArray(0, 0, r);
      }
      if (Jo) {
        Object.defineProperty(a, "0", Yo);
      }
    });
    return a;
  }
  Ht(t, e);
  var n = t.prototype;
  n.concat = function r() {
    this[p].atom_.reportObserved();
    for (var i = arguments.length, o = new Array(i), s = 0; s < i; s++) {
      o[s] = arguments[s];
    }
    return Array.prototype.concat.apply(
      this.slice(),
      //@ts-ignore
      o.map(function(a) {
        return wt(a) ? a.slice() : a;
      })
    );
  };
  n[Symbol.iterator] = function() {
    var r = this;
    var i = 0;
    return ir({
      next: function o() {
        return i < r.length ? {
          value: r[i++],
          done: false
        } : {
          done: true,
          value: void 0
        };
      }
    });
  };
  return Pe(t, [{
    key: "length",
    get: function r() {
      return this[p].getArrayLength_();
    },
    set: function r(i) {
      this[p].setArrayLength_(i);
    }
  }, {
    key: Symbol.toStringTag,
    get: function r() {
      return "Array";
    }
  }]);
})(Dn);
Object.entries(dt).forEach(function(e) {
  var t = e[0], n = e[1];
  if (t !== "concat") {
    ze(rr.prototype, t, n);
  }
});
function xn(e) {
  return {
    enumerable: false,
    configurable: true,
    get: function t() {
      return this[p].get_(e);
    },
    set: function t(n) {
      this[p].set_(e, n);
    }
  };
}
function Qo(e) {
  Q(rr.prototype, "" + e, xn(e));
}
function Mn(e) {
  if (e > Tt) {
    for (var t = Tt; t < e + 100; t++) {
      Qo(t);
    }
    Tt = e;
  }
}
Mn(1e3);
function es(e, t, n) {
  return new rr(e, t, n);
}
function le(e, t) {
  if (typeof e === "object" && e !== null) {
    if (wt(e)) {
      if (t !== void 0) {
        h(23);
      }
      return e[p].atom_;
    }
    if (Y(e)) {
      return e.atom_;
    }
    if (we(e)) {
      if (t === void 0) {
        return e.keysAtom_;
      }
      var n = e.data_.get(t) || e.hasMap_.get(t);
      if (!n) {
        h(25, t, qt(e));
      }
      return n;
    }
    if ($e(e)) {
      var r, i;
      if (!t) {
        return h(26);
      }
      var o = e[p];
      var s = (r = (i = o.values_.get(t)) != null ? i : o.materializeLazyComputed_(t)) != null ? r : o.materializeLazyObservable_(t);
      if (!s) {
        h(27, t, qt(e));
      }
      return s;
    }
    if (Xt(e) || Ot(e) || ft(e)) {
      return e;
    }
  } else if (G(e)) {
    if (ft(e[p])) {
      return e[p];
    }
  }
  h(28);
}
function Rn(e, t) {
  if (!e) {
    h(29);
  }
  if (t !== void 0) {
    return Rn(le(e, t));
  }
  if (Xt(e) || Ot(e) || ft(e)) {
    return e;
  }
  if (we(e) || Y(e)) {
    return e;
  }
  if (e[p]) {
    return e[p];
  }
  h(24, e);
}
function qt(e, t) {
  var n;
  if (t !== void 0) {
    n = le(e, t);
  } else if (Me(e)) {
    return e.name;
  } else if ($e(e) || we(e) || Y(e)) {
    n = Rn(e);
  } else {
    n = le(e);
  }
  return n.name_;
}
function pe(e) {
  var t = Ee();
  var n = gt(true);
  $();
  try {
    return e();
  } finally {
    z();
    yt(n);
    se(t);
  }
}
var Br = ht.toString;
function nr(e, t, n) {
  if (n === void 0) {
    n = -1;
  }
  return Gt(e, t, n);
}
function Gt(e, t, n, r, i) {
  if (e === t) {
    return e !== 0 || 1 / e === 1 / t;
  }
  if (e == null || t == null) {
    return false;
  }
  if (e !== e) {
    return t !== t;
  }
  var o = typeof e;
  if (o !== "function" && o !== "object" && typeof t != "object") {
    return false;
  }
  var s = Br.call(e);
  if (s !== Br.call(t)) {
    return false;
  }
  switch (s) {
    // Strings, numbers, regular expressions, dates, and booleans are compared by value.
    case "[object RegExp]":
    // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
    case "[object String]":
      return "" + e === "" + t;
    case "[object Number]":
      if (+e !== +e) {
        return +t !== +t;
      }
      return +e === 0 ? 1 / +e === 1 / t : +e === +t;
    case "[object Date]":
    case "[object Boolean]":
      return +e === +t;
    case "[object Symbol]":
      return typeof Symbol !== "undefined" && Symbol.valueOf.call(e) === Symbol.valueOf.call(t);
    case "[object Map]":
    case "[object Set]":
      if (n >= 0) {
        n++;
      }
      break;
  }
  e = kr(e);
  t = kr(t);
  var a = s === "[object Array]";
  if (!a) {
    if (typeof e != "object" || typeof t != "object") {
      return false;
    }
    var u = e.constructor, c = t.constructor;
    if (u !== c && !(G(u) && u instanceof u && G(c) && c instanceof c) && "constructor" in e && "constructor" in t) {
      return false;
    }
  }
  if (n === 0) {
    return false;
  } else if (n < 0) {
    n = -1;
  }
  r = r || [];
  i = i || [];
  var l = r.length;
  while (l--) {
    if (r[l] === e) {
      return i[l] === t;
    }
  }
  r.push(e);
  i.push(t);
  if (a) {
    l = e.length;
    if (l !== t.length) {
      return false;
    }
    while (l--) {
      if (!Gt(e[l], t[l], n - 1, r, i)) {
        return false;
      }
    }
  } else {
    var d = Object.keys(e);
    var v = d.length;
    if (Object.keys(t).length !== v) {
      return false;
    }
    for (var O = 0; O < v; O++) {
      var b = d[O];
      if (!(oe(t, b) && Gt(e[b], t[b], n - 1, r, i))) {
        return false;
      }
    }
  }
  r.pop();
  i.pop();
  return true;
}
function kr(e) {
  if (wt(e)) {
    return e.slice();
  }
  if (Ce(e) || we(e)) {
    return Array.from(e.entries());
  }
  if (ne(e) || Y(e)) {
    return Array.from(e.entries());
  }
  return e;
}
var Lr;
var ts = /* @__PURE__ */ vt();
var rs = ((Lr = ts.Iterator) == null ? void 0 : Lr.prototype) || {};
function ir(e) {
  e[Symbol.iterator] = ns;
  return Object.assign(Object.create(rs), e);
}
function ns() {
  return this;
}
["Symbol", "Map", "Set"].forEach(function(e) {
  var t = vt();
  if (typeof t[e] === "undefined") {
    h("MobX requires global '" + e + "' to be available or polyfilled");
  }
});
if (typeof __MOBX_DEVTOOLS_GLOBAL_HOOK__ === "object") {
  __MOBX_DEVTOOLS_GLOBAL_HOOK__.injectMobx({
    spy: yo,
    extras: {
      getDebugName: qt
    },
    $mobx: p
  });
}

// node_modules/yummies/complex.js
var Cn = () => {
  const e = ((...t) => {
    e.lastPub = t;
    e.subs.forEach((n) => {
      n(...t);
    });
  });
  e.lastPub = void 0;
  e.subs = [];
  e.unsub = (t) => {
    e.subs = e.subs.filter((n) => n !== t);
  };
  e.sub = (t) => {
    e.subs.push(t);
    return () => e.unsub(t);
  };
  return e;
};

// node_modules/yummies/data.js
var Pn = (e, t) => {
  if (e === t) return true;
  if (typeof e !== "object" || typeof t !== "object" || e === null || t === null) return false;
  if (e.constructor !== t.constructor) return false;
  const n = Array.isArray(e);
  if (n !== Array.isArray(t)) return false;
  if (n) {
    const s = e;
    const a = t;
    if (s.length !== a.length) return false;
    for (const [u, c] of s.entries()) if (c !== a[u]) return false;
    return true;
  }
  if (e instanceof Date) return e.getTime() === t.getTime();
  if (e instanceof RegExp) return e.toString() === t.toString();
  const r = Object.keys(e);
  const i = Object.keys(t);
  if (r.length !== i.length) return false;
  const o = t;
  for (const s of r) if (!Object.hasOwn(o, s) || e[s] !== o[s]) return false;
  return true;
};

// node_modules/yummies/mobx.js
var sa = {
  true: C.default,
  shallow: C.shallow,
  struct: C.structural
};
var Tn = (e, t, n) => {
  if (n) {
    t.forEach(([r, ...i]) => {
      i.forEach((o) => {
        r(e, o);
      });
    });
    de(e);
  } else {
    const r = {};
    t.forEach(([i, ...o]) => {
      o.forEach((s) => {
        r[s] = i;
      });
    });
    de(e, r);
  }
};

// node_modules/yummies/html.js
var Nt = (e, t) => {
  if (typeof document !== "undefined" && document.startViewTransition && !t?.disabled) return document.startViewTransition(e);
  e();
};

// node_modules/mobx-view-model/index.js
var St = (...e) => {
  const t = {
    ...k,
    startViewTransitions: structuredClone(k.startViewTransitions),
    observable: {
      viewModels: { ...k.observable.viewModels },
      viewModelStores: { ...k.observable.viewModelStores }
    }
  };
  e.forEach((n) => {
    if (!n) return;
    const { startViewTransitions: r, comparePayload: i, observable: o, ...s } = n;
    if (r) {
      const a = typeof r === "boolean" ? {
        mount: r,
        payloadChange: r,
        unmount: r
      } : r;
      Object.assign(t.startViewTransitions, a);
    }
    if (o?.viewModels) Object.assign(t.observable.viewModels, o.viewModels || {});
    if (o?.viewModelStores) Object.assign(t.observable.viewModelStores, o.viewModelStores || {});
    if (i != null) t.comparePayload = i;
    Object.assign(t, s);
  });
  return t;
};
var is = Object.freeze({});
var os = () => {
};
var ss = typeof window !== "undefined";
if (false) os.displayName = "DefaultFallback";
var jn = "@view-model@";
var P = {
  key: jn,
  emptyObject: is,
  noop: os,
  isClient: ss,
  marker: Symbol.for(jn),
  comparer: {
    shallow: Pn,
    strict: C.structural
  }
};
var Se = (e) => e[P.marker] === true;
var or = (e) => e.prototype[P.marker] === true;
var At = (e) => !Se(e);
var as = (e) => !or(e);
var In;
globalThis[In = P.marker] ?? (globalThis[In] = {
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
  getPayload: (e) => e.payload ?? P.emptyObject,
  factory: (e) => {
    const t = e.VM;
    if (as(t)) {
      const n = new t();
      n.id ?? (n.id = e.id);
      return n;
    }
    return new t({
      ...e,
      vmConfig: St(e.vmConfig)
    });
  },
  hooks: { storeCreate: Cn() }
});
var k = globalThis[P.marker];
var Bn = (e, t, n) => {
  if (n.custom) return n.custom(e, t);
  Tn(e, t, n.useDecorators);
};
var us = [[
  re,
  "isMounted",
  "isHydrated",
  "parentViewModel"
], [
  F,
  "willMount",
  "didMount",
  "didUnmount",
  "willUnmount",
  "mount",
  "unmount"
]];
var ve, g, Te;
var cs = (Te = class {
  constructor(t) {
    R(this, "abortController");
    R(this, "unmountSignal");
    R(this, "id");
    R(this, "vm");
    R(this, "props");
    /** In-flight mount(); re-entrant calls must reuse the same Promise. */
    Rt(this, ve);
    Rt(this, g);
    this.id = t.id;
    const n = St(t.vmConfig);
    tt(this, g, de({
      params: t,
      config: n,
      data: t.data,
      state: "init",
      payloadComparator: P.comparer[n.comparePayload] || n.comparePayload || void 0,
      payload: t.payload
    }, {
      state: w.ref,
      payload: n.payloadObservable && w[n.payloadObservable]
    }));
    this.vm = m(this, g);
    this.props = t.props ?? {};
    this.abortController = new AbortController();
    this.unmountSignal = this.abortController.signal;
    const r = [...us];
    if (m(this, g).config.payloadComputed) if (m(this, g).config.payloadComputed === "struct") r.push([re({ equals: C.structural }), "payload"]);
    else r.push([re({ equals: m(this, g).config.payloadComputed === true ? void 0 : m(this, g).config.payloadComputed }), "payload"]);
    Bn(this, r, m(this, g).config.observable.viewModels);
  }
  get payload() {
    return m(this, g).payload;
  }
  get viewModels() {
    if (false) console.error("Error #3: No access to ViewModelStore.\nThis happened because [viewModels] param is not provided during to creating instance ViewModelBase.\nMore info: https://js2me.github.io/mobx-view-model/errors/3");
    return m(this, g).params.viewModels;
  }
  get isMounted() {
    return m(this, g).state === "mounted" || m(this, g).state === "hydrated";
  }
  get isHydrated() {
    return m(this, g).state === "hydrated";
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
    if (m(this, ve)) return m(this, ve);
    if (this.abortController.signal.aborted) {
      this.abortController = new AbortController();
      this.unmountSignal = this.abortController.signal;
    }
    m(this, g).state = "mounting";
    const t = this.willMount();
    const n = () => {
      if (m(this, g).state !== "mounting") return;
      m(this, g).config.onMount?.(this);
      Nt(() => {
        x(() => {
          m(this, g).state = "mounted";
          this.didMount();
        });
      }, { disabled: !m(this, g).config.startViewTransitions.mount });
    };
    if (t != null && typeof t.then === "function") {
      tt(this, ve, Promise.resolve(t).then(n));
      return m(this, ve);
    }
    return n();
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
    tt(this, ve, void 0);
    x(() => m(this, g).state = "unmounting");
    this.willUnmount();
    m(this, g).config.onUnmount?.(this);
    Nt(() => {
      if (m(this, g).state !== "unmounting") return;
      x(() => m(this, g).state = "unmounted");
      this.didUnmount();
      this.abortController.abort();
    }, { disabled: !m(this, g).config.startViewTransitions.unmount });
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
  hasChild(t, n) {
    if (n) {
      let r = t;
      while (r) if (r.parentViewModel === this) return true;
      else r = r.parentViewModel;
      return false;
    }
    return t.parentViewModel === this;
  }
  /**
  * Checks whether the given view model is a parent of the current view model.
  * When `deep` is `true`, checks the whole parent chain.
  *
  * [**Documentation**](https://js2me.github.io/mobx-view-model/api/view-models/base-implementation#hasparent-vm-anyviewmodel--anyviewmodelsimple-deep-boolean-boolean)
  */
  hasParent(t, n) {
    if (n) {
      let r = this.parentViewModel;
      while (r) if (r === t) return true;
      else r = r.parentViewModel;
      return false;
    } else return this.parentViewModel === t;
  }
  /**
  * Returns the parent view model
  */
  get parentViewModel() {
    return m(this, g).params.parentViewModel;
  }
  /**
  * The method is called when the payload changes in the react component
  */
  setPayload(t) {
    const n = !!m(this, g).payloadComparator?.(m(this, g).payload, t);
    if (!n) Nt(() => x(() => m(this, g).payload = t), { disabled: !m(this, g).config.startViewTransitions.payloadChange });
    return n;
  }
}, ve = new WeakMap(), g = new WeakMap(), Te.prototype[P.marker] = true, Te);
var ls = [[
  F,
  "link",
  "unlink"
]];
var fs = class {
  constructor(e) {
    R(this, "config");
    R(this, "viewModels");
    R(this, "linkedAnchorVMClasses");
    R(this, "viewModelIdsByClasses");
    R(this, "vmConfig");
    R(this, "resource");
    this.config = e;
    this.viewModels = w.map([], { deep: false });
    this.linkedAnchorVMClasses = w.map([], { deep: false });
    this.viewModelIdsByClasses = w.map([], { deep: true });
    this.vmConfig = St(e?.vmConfig);
    this.resource = e?.resource ?? this.vmConfig.resource;
    Bn(this, ls, this.vmConfig.observable.viewModelStores);
    this.vmConfig.hooks.storeCreate(this);
  }
  connect(e, t) {
    this.link(t.VM, ...t.anchors ?? []);
    this.viewModels.set(t.id, e);
    this.attachVMConstructor(e);
    e.init?.({
      ...t,
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
  define(e) {
    e.id = this.generateId(e);
    const t = Et(() => this.viewModels.get(e.id));
    if (t) return t;
    const n = this.create(e);
    this.connect(n, e);
    return n;
  }
  unmount(e) {
    e.unmount?.();
    this.dettachVMConstructor(e);
    if (e.id) this.viewModels.delete(e.id);
  }
  /**
  * [**Documentation**](https://js2me.github.io/mobx-view-model/api/view-model-store/interface#createviewmodel-config)
  * Creates a new view model instance based on the provided configuration.
  * @param config - The configuration for creating the view model.
  * @returns The newly created view model instance.
  */
  create(e) {
    const t = St(this.vmConfig, e.vmConfig);
    const n = {
      ...e,
      vmConfig: t
    };
    return e?.factory?.(e) ?? t.factory(n);
  }
  /**
  * [**Documentation**](https://js2me.github.io/mobx-view-model/api/view-model-store/interface#generateid-config)
  * Generates a unique ID for a view model based on the provided configuration.
  * @param config - The configuration for generating the ID.
  * @returns The generated unique ID.
  */
  generateId(e) {
    return e.id;
  }
  /**
  * [**Documentation**](https://js2me.github.io/mobx-view-model/api/view-model-store/interface#link)
  * Link anchors (React components) with view model class.
  * @param VM - The view model class to link to.
  * @param anchors - The anchors to link.
  */
  link(e, ...t) {
    t.forEach((n) => {
      if (n && !this.linkedAnchorVMClasses.has(n)) this.linkedAnchorVMClasses.set(n, e);
    });
  }
  /**
  * [**Documentation**](https://js2me.github.io/mobx-view-model/api/view-model-store/interface#unlink)
  * Unlink anchors (React components) with view model class.
  * @param anchors - The anchors to unlink.
  */
  unlink(...e) {
    e.forEach((t) => {
      if (t && this.linkedAnchorVMClasses.has(t)) this.linkedAnchorVMClasses.delete(t);
    });
  }
  /**
  * [**Documentation**](https://js2me.github.io/mobx-view-model/api/view-model-store/interface#getids-vmlookup)
  * @param vmLookup - The ID or class type of the view model. See {@link ViewModelLookup}.
  * @returns The IDs of the view models
  */
  getIds(e) {
    if (!e) return [];
    if (typeof e === "string") return [e];
    const t = this.linkedAnchorVMClasses.get(e) || e;
    return [...this.viewModelIdsByClasses.get(t) || []];
  }
  /**
  * [**Documentation**](https://js2me.github.io/mobx-view-model/api/view-model-store/interface#getid-vmlookup)
  * @param vmLookup - The ID or class type of the view model. See {@link ViewModelLookup}.
  * @returns The ID of the view model, or null if not found.
  */
  getId(e) {
    const t = this.getIds(e);
    if (t.length === 0) return null;
    if (false) console.warn(`Found more than 1 view model with the same identifier. Last instance will been returned`);
    return t.at(-1);
  }
  /**
  * [**Documentation**](https://js2me.github.io/mobx-view-model/api/view-model-store/interface#has-vmlookup)
  * @param vmLookup - The ID or class type of the view model. See {@link ViewModelLookup}.
  * @returns True if the instance exists, false otherwise.
  */
  has(e) {
    const t = this.getId(e);
    if (!t) return false;
    return this.viewModels.has(t);
  }
  /**
  * [**Documentation**](https://js2me.github.io/mobx-view-model/api/view-model-store/interface#get-vmlookup)
  * @param vmLookup - The ID or class type of the view model. See {@link ViewModelLookup}.
  * @returns The view model instance, or null if not found.
  */
  get(e) {
    const t = this.getId(e);
    if (!t) return null;
    return this.viewModels.get(t) ?? null;
  }
  /**
  * [**Documentation**](https://js2me.github.io/mobx-view-model/api/view-model-store/interface#getall-vmlookup)
  * @param vmLookup - The ID or class type of the view model. See {@link ViewModelLookup}.
  * @returns All view model instances matching the lookup.
  */
  getAll(e) {
    return this.getIds(e).map((t) => this.viewModels.get(t));
  }
  /**
  * Indexes the instance id by its class so `get(CartPageVM)` / `useViewModel(CartPageVM)` work.
  */
  attachVMConstructor(e) {
    const t = e.constructor;
    const n = e.id;
    const r = this.viewModelIdsByClasses.get(t);
    if (r) {
      if (!r.includes(n)) r.push(n);
    } else this.viewModelIdsByClasses.set(t, [n]);
  }
  dettachVMConstructor(e) {
    const t = e.constructor;
    if (this.viewModelIdsByClasses.has(t)) {
      const n = this.viewModelIdsByClasses.get(t).filter((r) => r !== e.id);
      if (n.length > 0) this.viewModelIdsByClasses.set(t, n);
      else this.viewModelIdsByClasses.delete(t);
    }
  }
  clean() {
    this.viewModels.clear();
    this.linkedAnchorVMClasses.clear();
    this.viewModelIdsByClasses.clear();
  }
};

// node_modules/mobx-view-model-react/index.js
import * as Yn from "react";
import { createContext as br, createElement as Vt, forwardRef as ws, useContext as Mt, useEffect as Ns, useId as Ss, useLayoutEffect as As, useRef as Jn, useState as Vs, useSyncExternalStore as Zn } from "react";

// node_modules/mobx-react-lite/es/utils/assertEnvironment.js
import { useState as ds } from "react";
if (!ds) {
  throw new Error("mobx-react-lite requires React with Hooks support");
}
if (!de) {
  throw new Error("mobx-react-lite@3 requires mobx at least version 6 to be available");
}

// scripts/react-batching.ts
function sr(e) {
  return e();
}

// node_modules/mobx-react-lite/es/utils/observerBatching.js
function ps(e) {
  e();
}
function ar(e) {
  if (!e) {
    e = ps;
    if (false) {
      console.warn("[MobX] Failed to get unstable_batched updates from react-dom / react-native");
    }
  }
  gn({ reactionScheduler: e });
}

// node_modules/mobx-react-lite/es/useObserver.js
import $n from "react";

// node_modules/mobx-react-lite/es/utils/printDebugValue.js
function kn(e) {
  return On(e);
}

// node_modules/mobx-react-lite/es/staticRendering.js
var vs = false;
function He() {
  return vs;
}

// node_modules/mobx-react-lite/es/utils/UniversalFinalizationRegistry.js
var hs = 1e4;
var _s = 1e4;
var bs = (
  /** @class */
  (function() {
    function e(t) {
      var n = this;
      Object.defineProperty(this, "finalize", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: t
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
        value: function(r) {
          if (r === void 0) {
            r = hs;
          }
          clearTimeout(n.sweepTimeout);
          n.sweepTimeout = void 0;
          var i = Date.now();
          n.registrations.forEach(function(o, s) {
            if (i - o.registeredAt >= r) {
              n.finalize(o.value);
              n.registrations.delete(s);
            }
          });
          if (n.registrations.size > 0) {
            n.scheduleSweep();
          }
        }
      });
      Object.defineProperty(this, "finalizeAllImmediately", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: function() {
          n.sweep(0);
        }
      });
    }
    Object.defineProperty(e.prototype, "register", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(t, n, r) {
        this.registrations.set(r, {
          value: n,
          registeredAt: Date.now()
        });
        this.scheduleSweep();
      }
    });
    Object.defineProperty(e.prototype, "unregister", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(t) {
        this.registrations.delete(t);
      }
    });
    Object.defineProperty(e.prototype, "scheduleSweep", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function() {
        if (this.sweepTimeout === void 0) {
          this.sweepTimeout = setTimeout(this.sweep, _s);
        }
      }
    });
    return e;
  })()
);
var Ln = typeof FinalizationRegistry !== "undefined" ? FinalizationRegistry : bs;

// node_modules/mobx-react-lite/es/utils/observerFinalizationRegistry.js
var Xe = new Ln(function(e) {
  var t;
  (t = e.reaction) === null || t === void 0 ? void 0 : t.dispose();
  e.reaction = null;
});

// scripts/react-external-store.ts
import { useSyncExternalStore as Un } from "react";

// node_modules/mobx-react-lite/es/useObserver.js
function zn(e) {
  e.reaction = new W("observer".concat(e.name), function() {
    var t;
    e.stateVersion = /* @__PURE__ */ Symbol();
    (t = e.onStoreChange) === null || t === void 0 ? void 0 : t.call(e);
  });
}
function Ye(e, t) {
  if (t === void 0) {
    t = "observed";
  }
  if (He()) {
    return e();
  }
  var n = $n.useRef(null);
  if (!n.current) {
    var r = {
      reaction: null,
      onStoreChange: null,
      stateVersion: /* @__PURE__ */ Symbol(),
      name: t,
      subscribe: function(a) {
        Xe.unregister(r);
        r.onStoreChange = a;
        if (!r.reaction) {
          zn(r);
          r.stateVersion = /* @__PURE__ */ Symbol();
        }
        return function() {
          var u;
          r.onStoreChange = null;
          (u = r.reaction) === null || u === void 0 ? void 0 : u.dispose();
          r.reaction = null;
        };
      },
      getSnapshot: function() {
        return r.stateVersion;
      }
    };
    n.current = r;
  }
  var i = n.current;
  if (!i.reaction) {
    zn(i);
    Xe.register(n, i, i);
  }
  $n.useDebugValue(i.reaction, kn);
  Un(
    // Both of these must be stable, otherwise it would keep resubscribing every render.
    i.subscribe,
    i.getSnapshot,
    i.getSnapshot
  );
  var o;
  var s;
  i.reaction.track(function() {
    try {
      o = e();
    } catch (a) {
      s = a;
    }
  });
  if (s) {
    throw s;
  }
  return o;
}

// node_modules/mobx-react-lite/es/observer.js
import { forwardRef as lr, memo as fr } from "react";
var ur;
var cr;
var qn = typeof Symbol === "function" && Symbol.for;
var ms = (cr = (ur = Object.getOwnPropertyDescriptor(function() {
}, "name")) === null || ur === void 0 ? void 0 : ur.configurable) !== null && cr !== void 0 ? cr : false;
var Fn = qn ? /* @__PURE__ */ Symbol.for("react.forward_ref") : typeof lr === "function" && lr(function(e) {
  return null;
})["$$typeof"];
var Kn = qn ? /* @__PURE__ */ Symbol.for("react.memo") : typeof fr === "function" && fr(function(e) {
  return null;
})["$$typeof"];
function Je(e, t) {
  var n;
  if (false) {
    warnObserverOptionsDeprecated = false;
    console.warn("[mobx-react-lite] `observer(fn, { forwardRef: true })` is deprecated, use `observer(React.forwardRef(fn))`");
  }
  if (Kn && e["$$typeof"] === Kn) {
    throw new Error("[mobx-react-lite] You are trying to use `observer` on a function component wrapped in either another `observer` or `React.memo`. The observer already applies 'React.memo' for you.");
  }
  if (He()) {
    return e;
  }
  var r = (n = t === null || t === void 0 ? void 0 : t.forwardRef) !== null && n !== void 0 ? n : false;
  var i = e;
  var o = e.displayName || e.name;
  if (Fn && e["$$typeof"] === Fn) {
    r = true;
    i = e["render"];
    if (typeof i !== "function") {
      throw new Error("[mobx-react-lite] `render` property of ForwardRef was not a function");
    }
  }
  var s = function(a, u) {
    return Ye(function() {
      return i(a, u);
    }, o);
  };
  s.displayName = e.displayName;
  if (ms) {
    Object.defineProperty(s, "name", {
      value: e.name,
      writable: true,
      configurable: true
    });
  }
  if (e.contextTypes) {
    ;
    s.contextTypes = e.contextTypes;
    if (false) {
      warnLegacyContextTypes = false;
      console.warn("[mobx-react-lite] Support for Legacy Context in function components will be removed in the next major release.");
    }
  }
  if (r) {
    s = lr(s);
  }
  s = fr(s);
  ys(e, s);
  if (false) {
    Object.defineProperty(s, "contextTypes", {
      set: function() {
        var a, u;
        throw new Error("[mobx-react-lite] `".concat(this.displayName || ((a = this.type) === null || a === void 0 ? void 0 : a.displayName) || ((u = this.type) === null || u === void 0 ? void 0 : u.name) || "Component", ".contextTypes` must be set before applying `observer`."));
      }
    });
  }
  return s;
}
var gs = {
  $$typeof: true,
  render: true,
  compare: true,
  type: true,
  // Don't redefine `displayName`,
  // it's defined as getter-setter pair on `memo` (see #3192).
  displayName: true
};
function ys(e, t) {
  Object.keys(e).forEach(function(n) {
    if (!gs[n]) {
      Object.defineProperty(t, n, Object.getOwnPropertyDescriptor(e, n));
    }
  });
}

// node_modules/mobx-react-lite/es/ObserverComponent.js
function Gn(e) {
  var t = e.children, n = e.render;
  if (t && n) {
    console.error("MobX Observer: Do not use children and render in the same time in `Observer`");
  }
  var r = t || n;
  if (typeof r !== "function") {
    return null;
  }
  return Ye(r);
}
if (false) {
  Gn.propTypes = {
    children: ObserverPropsCheck,
    render: ObserverPropsCheck
  };
}
Gn.displayName = "Observer";

// node_modules/mobx-react-lite/es/useLocalObservable.js
import { useState as Ha } from "react";

// node_modules/mobx-react-lite/es/useLocalStore.js
import { useState as tu } from "react";

// node_modules/mobx-react-lite/es/useAsObservableSource.js
import { useState as Za } from "react";

// node_modules/mobx-react-lite/es/index.js
var dr;
ar(sr);
var hu = (dr = Xe["finalizeAllImmediately"]) !== null && dr !== void 0 ? dr : (function() {
});

// node_modules/mobx-view-model-react/index.js
import { Fragment as Ds, jsx as xs } from "react/jsx-runtime";
var Dt = /* @__PURE__ */ Symbol.for(`${P.key}/react/avm-ctx`);
globalThis[Dt] ?? (globalThis[Dt] = br(null));
var Qn = globalThis[Dt];
if (false) Qn.displayName = "ActiveViewModel";
var xt = /* @__PURE__ */ Symbol.for(`${P.key}/react/vms-ctx`);
globalThis[xt] ?? (globalThis[xt] = br(null));
var mr = globalThis[xt];
if (false) mr.displayName = "ViewModels";
var Ms = Qn.Provider;
var hr = Yn.use;
var je = /* @__PURE__ */ new Map();
var pr = false;
var Qe = /* @__PURE__ */ new WeakMap();
var Rs = (e) => {
  Qe.set(e, (Qe.get(e) ?? 0) + 1);
};
var Cs = (e, t) => {
  const n = Qe.get(e);
  if (!n) return;
  if (n > 1) {
    Qe.set(e, n - 1);
    return;
  }
  Qe.delete(e);
  x(() => {
    if (t && (e.id == null || t.get(e.id) === e)) t.unmount(e);
    else e.unmount?.();
  });
};
var Ps = (e, t) => {
  je.set(e, t);
  return { vm: e };
};
var Ts = () => {
  if (pr) return;
  pr = true;
  setTimeout(() => {
    pr = false;
    if (je.size === 0) return;
    for (const [e, t] of je) {
      je.delete(e);
      x(() => {
        if (t) t.unmount(e);
        else e.unmount?.();
      });
    }
  });
};
var js = (e) => {
  je.delete(e.vm);
  if (je.size > 0) Ts();
};
var et = /* @__PURE__ */ new WeakMap();
var gr = typeof FinalizationRegistry === "function" ? new FinalizationRegistry(({ store: e, id: t, vm: n }) => {
  const r = et.get(e);
  if (r?.entries.get(t)?.vm === n) r?.entries.delete(t);
}) : null;
var ei = (e) => {
  let t = et.get(e);
  if (!t) {
    t = {
      entries: /* @__PURE__ */ new Map(),
      epoch: 0,
      sweepScheduled: false
    };
    et.set(e, t);
  }
  return t;
};
var Is = (e, t) => {
  const n = et.get(e);
  if (!n) return null;
  if (typeof t === "string") return n.entries.get(t)?.vm ?? null;
  for (const r of [...n.entries.values()].reverse()) if (r.config.VM === t || r.config.anchors?.includes(t)) return r.vm;
  return null;
};
var vr = (e, t) => Is(e, t) ?? e.get(t);
var Bs = (e) => new Proxy(e, { get(t, n, r) {
  if (n === "get") return (i) => vr(t, i);
  if (n === "has") return (i) => vr(t, i) != null;
  if (n === "getIds") return (i) => {
    const o = t.getIds(i);
    if (typeof i === "string") return o;
    const s = et.get(t);
    for (const [a, u] of s?.entries ?? []) if ((u.config.VM === i || u.config.anchors?.includes(i)) && !o.includes(a)) o.push(a);
    return o;
  };
  if (n === "getId") return (i) => {
    return r.getIds(i).at(-1) ?? null;
  };
  if (n === "getAll") return (i) => r.getIds(i).map((o) => vr(t, o)).filter((o) => o != null);
  return Reflect.get(t, n, r);
} });
var ks = (e, t, n) => {
  t.id = e.generateId(t);
  const r = e.get(t.id);
  if (r) return r;
  const i = ei(e);
  const o = i.entries.get(t.id);
  if (o) return o.vm;
  const s = e.create({
    ...t,
    viewModels: Bs(e)
  });
  i.entries.set(t.id, {
    vm: s,
    config: t,
    epoch: ++i.epoch
  });
  gr?.register(n, {
    store: e,
    id: t.id,
    vm: s
  }, s);
  return s;
};
var Hn = (e) => {
  if (e.sweepScheduled) return;
  e.sweepScheduled = true;
  const t = e.epoch;
  setTimeout(() => {
    e.sweepScheduled = false;
    for (const [n, r] of e.entries) if (r.epoch <= t) {
      e.entries.delete(n);
      gr?.unregister(r.vm);
    }
  });
};
var Ls = (e, t, n) => {
  const r = ei(e);
  if (r.entries.get(t.id)?.vm === n) r.entries.delete(t.id);
  gr?.unregister(n);
  if (e.get(t.id) === n) {
    Hn(r);
    return;
  }
  x(() => {
    e.connect(n, t);
  });
  Hn(r);
};
var Us = [];
var { emptyObject: ti, noop: $s } = P;
var zs = true;
var Fs = () => $s;
var Ks = () => true;
var qs = () => false;
var Xn = typeof window === "undefined" ? Ns : As;
var Ze = /* @__PURE__ */ new WeakMap();
var Gs = (e, t, n, r, i, o, s, a, u) => x(() => {
  const c = {
    ...i,
    id: e,
    payload: n,
    data: r,
    VM: t,
    viewModels: s,
    parentViewModel: a,
    ctx: i?.ctx ?? ti,
    props: o ?? i?.props
  };
  const l = s ? u ? ks(s, c, u) : s.define(c) : c.factory?.(c) ?? k.factory(c);
  if (!s) l.init?.({
    ...c,
    viewModels: void 0
  });
  return {
    instance: l,
    config: c
  };
});
var _r = (e, t, n) => {
  if (At(e)) {
    e.parentViewModel = n;
    e.setPayload?.(t);
  }
};
var Ws = (e, t, n) => x(() => {
  _r(e, t, n);
  return Se(e) && e.isMounted ? void 0 : e.mount?.();
});
var Hs = (e) => x(() => Se(e) && e.isMounted ? void 0 : e.mount?.());
function yr(e, t = ti, n, r) {
  const i = Mt(mr);
  const o = Mt(Qn);
  const s = Jn(null);
  const a = Ss();
  const u = !!s.current;
  const [, c] = Vs(0);
  if (s.current) {
  } else {
    const d = P.isClient;
    const v = k.mode === "ssr";
    const O = n?.id ?? (zs ? a : `${a}:${e.name}`);
    const b = i?.get(O);
    const A = i?.resource ?? k.resource;
    const D = b ? b.vm?.data : A?.read(O);
    const M = d && i != null;
    const { instance: N, config: X } = Gs(O, e, t, D, n, r, i, o, M ? s : void 0);
    const V = d && !!i && i.get(X.id) === N;
    if (d && !V) _r(N, t, o);
    s.current = {
      vm: N,
      config: X,
      appliedPayload: t,
      appliedProps: r,
      bindAfterCommit: V,
      promise: !d ? Ws(N, t, o) : void 0,
      isSSR: v,
      creationEntry: M || !d ? void 0 : Ps(N, i),
      staged: M || void 0,
      fn: () => {
        if (s.current.creationEntry) {
          js(s.current.creationEntry);
          s.current.creationEntry = void 0;
        }
        const E = s.current.vm;
        if (s.current.staged) {
          s.current.staged = false;
          Ls(i, s.current.config, E);
        }
        if (i && Se(E) && E.id != null && !i.has(E.id)) x(() => {
          i.define({
            ...s.current.config,
            factory: () => E
          });
        });
        Rs(E);
        const S = Hs(E);
        if (S) s.current.promise = S;
        if (Se(E) && E.vm.state === "mounted" && s.current.isSSR) x(() => {
          E.vm.state = "hydrated";
        });
        return () => {
          Cs(s.current.vm, i);
        };
      }
    };
  }
  const l = s.current.vm;
  Xn(s.current.fn, Us);
  Xn(() => {
    if (s.current.skipForcedCommit) {
      s.current.skipForcedCommit = false;
      if (s.current.appliedProps === r) return;
    }
    if (s.current.bindAfterCommit) {
      s.current.bindAfterCommit = false;
      x(() => _r(l, t, o));
      if (At(l)) {
        Ze.set(l, (Ze.get(l) ?? 0) + 1);
        s.current.skipForcedCommit = true;
        c((d) => d + 1);
      }
    } else if (u && !Object.is(s.current.appliedPayload, t)) {
      s.current.appliedPayload = t;
      s.current.appliedProps = r;
      l.setPayload?.(t);
      if (At(l)) {
        Ze.set(l, (Ze.get(l) ?? 0) + 1);
        s.current.skipForcedCommit = true;
        c((d) => d + 1);
      }
    }
  }, [t]);
  if (s.current.isSSR) {
    const d = s.current.promise;
    const v = Zn(Fs, Ks, qs);
    if (hr && d && (!P.isClient || !v)) hr(d);
  }
  return l;
}
var xu = Je(({ model: e, config: t, payload: n, children: r }) => {
  const i = yr(e, n, t);
  if (!i.isMounted) return null;
  if (typeof r === "function") return r(i);
  return /* @__PURE__ */ xs(Ds, { children: r });
});
var Xs = mr.Provider;
var Ys = /* @__PURE__ */ Symbol.for("react.memo");
var Js = () => true;
function Zs(e, t, n) {
  const r = n ?? {};
  const i = r.anchors ?? (r.anchors = []);
  const o = r.getPayload ?? k.getPayload;
  const s = !!r.forwardRef;
  const a = r.fallback ?? r.vmConfig?.fallbackComponent ?? k.fallbackComponent;
  const u = (r.vmConfig?.processRender ?? k.processRender)?.(t, e, r) ?? t ?? P.noop;
  if (u?.$$typeof === Ys) {
    if (false) throw new Error(`Error #4: [mobx-view-model-react] You are trying to wrap a View component in \`observer\` or \`React.memo\` inside \`withViewModel\`. \`withViewModel\` already applies \`observer\` automatically, so do not wrap the View component manually.
More info: https://js2me.github.io/mobx-view-model/errors/4`);
    throw new Error("Error #4: https://js2me.github.io/mobx-view-model/errors/4");
  }
  const c = !or(e);
  const l = br(0);
  const d = Je(c ? (b) => {
    Mt(l);
    return u(b);
  } : u);
  if (false) d.displayName = `View(${e.name})`;
  const v = (b, A) => {
    const D = Mt(mr);
    const M = yr(e, o(b), r, b);
    (r.reactHook ?? k.reactHook)?.(b, r.ctx ?? {}, D, A);
    const N = Jn();
    if (N.current) N.current.value = M;
    else N.current = {
      value: M,
      subscribe: (S) => Qt(() => {
        const Ie = N.current.value;
        return !Se(Ie) || Ie.isMounted;
      }, () => {
        S();
      }),
      getSnapshot: () => {
        const S = N.current.value;
        return S.isMounted !== false || S.vm.state === "unmounting" || S.vm.state === "unmounted";
      }
    };
    const X = typeof window !== "undefined" && k.mode === "ssr" && typeof hr === "function" ? Js : N.current.getSnapshot;
    const V = Zn(N.current.subscribe, N.current.getSnapshot, X);
    let E = null;
    if (V) {
      const S = {
        ...b,
        model: M
      };
      delete S.payload;
      if (s) S.ref = A;
      E = Vt(d, S);
      if (c) E = Vt(l.Provider, { value: Ze.get(M) ?? 0 }, E);
    } else if (a) E = Vt(a);
    return Vt(Ms, N.current, E);
  };
  if (false) v.displayName = `withViewModel(${e.name})`;
  const O = s ? ws(v) : v;
  i.push(O);
  O.connect = (b) => {
    if (!i.includes(b)) i.push(b);
    return O;
  };
  return O;
}
export {
  cs as ViewModelBase,
  fs as ViewModelStoreBase,
  Xs as ViewModelsProvider,
  F as action,
  C as comparer,
  re as computed,
  $o as makeAutoObservable,
  de as makeObservable,
  w as observable,
  Je as observer,
  Qt as reaction,
  x as runInAction,
  yr as useCreateViewModel,
  Zs as withViewModel
};
//# sourceMappingURL=mvvm.js.map
