var ft = Object.create;
var R = Object.defineProperty;
var mt = Object.getOwnPropertyDescriptor;
var dt = Object.getOwnPropertyNames;
var gt = Object.getPrototypeOf;
var ht = Object.prototype.hasOwnProperty;
var yt = (t, e, n) => e in t ? R(t, e, { enumerable: true, configurable: true, writable: true, value: n }) : t[e] = n;
var j = (t, e) => () => {
  try {
    return e || t((e = { exports: {} }).exports, e), e.exports;
  } catch (n) {
    throw e = 0, n;
  }
};
var xt = (t, e) => {
  for (var n in e)
    R(t, n, { get: e[n], enumerable: true });
};
var bt = (t, e, n, i) => {
  if (e && typeof e === "object" || typeof e === "function") {
    for (let m of dt(e))
      if (!ht.call(t, m) && m !== n)
        R(t, m, { get: () => e[m], enumerable: !(i = mt(e, m)) || i.enumerable });
  }
  return t;
};
var Xt = (t, e, n) => (n = t != null ? ft(gt(t)) : {}, bt(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  e || !t || !t.__esModule ? R(n, "default", { value: t, enumerable: true }) : n,
  t
));
var S = (t, e, n) => yt(t, typeof e !== "symbol" ? e + "" : e, n);

// node_modules/prop-types/lib/ReactPropTypesSecret.js
var K = j((He, Z) => {
  "use strict";
  var Ot = "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED";
  Z.exports = Ot;
});

// node_modules/prop-types/factoryWithThrowingShims.js
var $ = j((Je, G) => {
  "use strict";
  var Tt = K();
  function H() {
  }
  function J() {
  }
  J.resetWarningCache = H;
  G.exports = function() {
    function t(i, m, y, a, o, r) {
      if (r === Tt) {
        return;
      }
      var s = new Error(
        "Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types"
      );
      s.name = "Invariant Violation";
      throw s;
    }
    ;
    t.isRequired = t;
    function e() {
      return t;
    }
    ;
    var n = {
      array: t,
      bigint: t,
      bool: t,
      func: t,
      number: t,
      object: t,
      string: t,
      symbol: t,
      any: t,
      arrayOf: e,
      element: t,
      elementType: t,
      instanceOf: e,
      node: t,
      objectOf: e,
      oneOf: e,
      oneOfType: e,
      shape: e,
      exact: e,
      checkPropTypes: J,
      resetWarningCache: H
    };
    n.PropTypes = n;
    return n;
  };
});

// node_modules/prop-types/index.js
var tt = j((Qe, Q) => {
  if (false) {
    Ge = null;
    $e = true;
    Q.exports = null(Ge.isElement, $e);
  } else {
    Q.exports = $()();
  }
  var Ge;
  var $e;
});

// node_modules/react-native-animatable/index.js
import {
  View as qe,
  Text as Me,
  Image as We
} from "react-native";

// node_modules/react-native-animatable/createAnimatableComponent.js
var u = Xt(tt());
import Vt, { Component as zt } from "react";
import { Animated as Y, Easing as Rt } from "react-native";

// node_modules/react-native-animatable/wrapStyleTransforms.js
var Yt = [
  "perspective",
  "rotate",
  "rotateX",
  "rotateY",
  "rotateZ",
  "scale",
  "scaleX",
  "scaleY",
  "skewX",
  "skewY",
  "translateX",
  "translateY"
];
function v(t) {
  const e = {};
  Object.keys(t).forEach((n) => {
    if (Yt.indexOf(n) !== -1) {
      if (!e.transform) {
        e.transform = [];
      }
      e.transform.push({
        [n]: t[n]
      });
    } else {
      e[n] = t[n];
    }
  });
  return e;
}

// node_modules/react-native-animatable/flattenStyle.js
import { StyleSheet as wt } from "react-native";
function O(t) {
  const e = Object.assign({}, wt.flatten(t));
  if (e.transform) {
    e.transform.forEach((n) => {
      const i = Object.keys(n)[0];
      e[i] = n[i];
    });
    delete e.transform;
  }
  return e;
}

// node_modules/react-native-animatable/getDefaultStyleValue.js
var nt = {
  Top: ["Vertical", ""],
  Bottom: ["Vertical", ""],
  Vertical: [""],
  Left: ["Horizontal", ""],
  Right: ["Horizontal", ""],
  Horizontal: [""]
};
var et = Object.keys(nt);
function P(t, e) {
  if (t === "backgroundColor") {
    return "rgba(0,0,0,0)";
  }
  if (t === "color" || t.indexOf("Color") !== -1) {
    return "rgba(0,0,0,1)";
  }
  if (t.indexOf("rotate") === 0 || t.indexOf("skew") === 0) {
    return "0deg";
  }
  if (t === "opacity" || t.indexOf("scale") === 0) {
    return 1;
  }
  if (t === "fontSize") {
    return 14;
  }
  if (t.indexOf("margin") === 0 || t.indexOf("padding") === 0) {
    for (let n, i = 0; i < et.length; i++) {
      n = et[i];
      if (t.substr(-n.length) === n) {
        const m = t.substr(0, t.length - n.length);
        const y = nt[n];
        for (let a, o = 0; o < y.length; o++) {
          a = m + y[o];
          if (a in e) {
            return e[a];
          }
        }
        break;
      }
    }
  }
  return 0;
}

// node_modules/react-native-animatable/getStyleValues.js
function V(t, e) {
  const n = {};
  const i = O(e);
  (typeof t === "string" ? [t] : t).forEach((m) => {
    n[m] = m in i ? i[m] : P(m, i);
  });
  return n;
}

// node_modules/react-native-animatable/createAnimation.js
function It(t, e) {
  return t - e;
}
function St(t) {
  return t !== null;
}
function At(t) {
  if (t === "from") {
    return 0;
  }
  if (t === "to") {
    return 1;
  }
  const e = parseFloat(t, 10);
  if (Number.isNaN(e) || e < 0 || e > 1) {
    return null;
  }
  return e;
}
var _ = {};
function A(t) {
  const e = JSON.stringify(t);
  if (_[e]) {
    return _[e];
  }
  const n = Object.keys(t).map(At).filter(St);
  n.sort(It);
  if (n.length < 2) {
    throw new Error("Animation definitions must have at least two values.");
  }
  const i = {};
  if (t.easing) {
    i.easing = t.easing;
  }
  if (t.style) {
    i.style = t.style;
  }
  for (let m = 0; m < n.length; m += 1) {
    const y = n[m];
    let a = t[y];
    if (!a) {
      if (y === 0) {
        a = t.from;
      } else if (y === 1) {
        a = t.to;
      }
    }
    if (!a) {
      throw new Error("Missing animation keyframe, this should not happen");
    }
    a = O(a);
    Object.keys(a).forEach((o) => {
      if (!(o in i)) {
        i[o] = {
          inputRange: [],
          outputRange: []
        };
      }
      i[o].inputRange.push(y);
      i[o].outputRange.push(a[o]);
    });
  }
  _[e] = i;
  return i;
}

// node_modules/react-native-animatable/registry.js
var F = {};
function at(t, e) {
  F[t] = e;
}
function ot(t) {
  return F[t];
}
function it() {
  return Object.keys(F);
}
function U(t) {
  Object.keys(t).forEach((e) => {
    at(
      e,
      A(t[e])
    );
  });
}

// node_modules/react-native-animatable/easing.js
import { Easing as p } from "react-native";
var Et = {
  // Standard CSS easings
  linear: p.linear,
  ease: p.bezier(0.25, 0.1, 0.25, 1),
  "ease-in": p.bezier(0.42, 0, 1, 1),
  "ease-out": p.bezier(0, 0, 0.58, 1),
  "ease-in-out": p.bezier(0.42, 0, 0.58, 1),
  // Penner Equations - http://matthewlein.com/ceaser/ & http://easings.net
  "ease-in-cubic": p.bezier(0.55, 0.055, 0.675, 0.19),
  "ease-out-cubic": p.bezier(0.215, 0.61, 0.355, 1),
  "ease-in-out-cubic": p.bezier(0.645, 0.045, 0.355, 1),
  "ease-in-circ": p.bezier(0.6, 0.04, 0.98, 0.335),
  "ease-out-circ": p.bezier(0.075, 0.82, 0.165, 1),
  "ease-in-out-circ": p.bezier(0.785, 0.135, 0.15, 0.86),
  "ease-in-expo": p.bezier(0.95, 0.05, 0.795, 0.035),
  "ease-out-expo": p.bezier(0.19, 1, 0.22, 1),
  "ease-in-out-expo": p.bezier(1, 0, 0, 1),
  "ease-in-quad": p.bezier(0.55, 0.085, 0.68, 0.53),
  "ease-out-quad": p.bezier(0.25, 0.46, 0.45, 0.94),
  "ease-in-out-quad": p.bezier(0.455, 0.03, 0.515, 0.955),
  "ease-in-quart": p.bezier(0.895, 0.03, 0.685, 0.22),
  "ease-out-quart": p.bezier(0.165, 0.84, 0.44, 1),
  "ease-in-out-quart": p.bezier(0.77, 0, 0.175, 1),
  "ease-in-quint": p.bezier(0.755, 0.05, 0.855, 0.06),
  "ease-out-quint": p.bezier(0.23, 1, 0.32, 1),
  "ease-in-out-quint": p.bezier(0.86, 0, 0.07, 1),
  "ease-in-sine": p.bezier(0.47, 0, 0.745, 0.715),
  "ease-out-sine": p.bezier(0.39, 0.575, 0.565, 1),
  "ease-in-out-sine": p.bezier(0.445, 0.05, 0.55, 0.95),
  "ease-in-back": p.bezier(0.6, -0.28, 0.735, 0.045),
  "ease-out-back": p.bezier(0.175, 0.885, 0.32, 1.275),
  "ease-in-out-back": p.bezier(0.68, -0.55, 0.265, 1.55)
};
var N = Et;

// node_modules/react-native-animatable/createAnimatableComponent.js
var q = [
  // Transform styles
  "rotate",
  "rotateX",
  "rotateY",
  "rotateZ",
  "skewX",
  "skewY",
  "transformMatrix",
  // View styles
  "backgroundColor",
  "borderColor",
  "borderTopColor",
  "borderRightColor",
  "borderBottomColor",
  "borderLeftColor",
  "shadowColor",
  // Text styles
  "color",
  "textDecorationColor",
  // Image styles
  "tintColor"
];
var rt = ["width", "height"];
function vt(t, e) {
  const n = {};
  Object.keys(e).forEach((i) => {
    if (t.indexOf(i) === -1) {
      n[i] = e[i];
    }
  });
  return n;
}
function Nt(t, e) {
  return t === e || JSON.stringify(t) === JSON.stringify(e);
}
function ut(t, e) {
  switch (e) {
    case "reverse":
      return 0;
    case "alternate":
      return t % 2 ? 0 : 1;
    case "alternate-reverse":
      return t % 2 ? 1 : 0;
    case "normal":
    default:
      return 1;
  }
}
function st(t, e) {
  return ut(t, e) ? 0 : 1;
}
function ct(t) {
  if (typeof t === "string") {
    const e = ot(t);
    if (!e) {
      throw new Error(`No animation registred by the name of ${t}`);
    }
    return e;
  }
  return A(t);
}
function lt(t, e) {
  const n = {};
  Object.keys(t).forEach((i) => {
    if (i === "style") {
      Object.assign(n, t.style);
    } else if (i !== "easing") {
      n[i] = e.interpolate(t[i]);
    }
  });
  return v(n);
}
function pt(t, e, n, i, m, y = false, a, o, r) {
  const s = i || m || a ? Y.timing(e, {
    toValue: n,
    delay: a,
    duration: i || 1e3,
    easing: typeof m === "function" ? m : N[m || "ease"],
    useNativeDriver: y
  }) : Y.spring(e, { toValue: n, useNativeDriver: y });
  setTimeout(() => o(t), a);
  s.start(() => r(t));
}
function z(t) {
  var i;
  const e = t.displayName || t.name || "Component";
  const n = Y.createAnimatedComponent(t);
  return i = class extends zt {
    constructor(a) {
      super(a);
      S(this, "ref", null);
      S(this, "handleRef", (a) => {
        this.ref = a;
      });
      const o = new Y.Value(
        st(0, this.props.direction)
      );
      let r = {};
      let s = {};
      if (a.animation) {
        s = ct(a.animation);
        r = lt(
          s,
          o
        );
      }
      this.state = {
        animationValue: o,
        animationStyle: r,
        compiledAnimation: s,
        transitionStyle: {},
        transitionValues: {},
        currentTransitionValues: {}
      };
      if (a.transition) {
        this.state = {
          ...this.state,
          ...this.initializeTransitionState(a.transition)
        };
      }
      this.delayTimer = null;
      it().forEach((l) => {
        if (!(l in this)) {
          this[l] = this.animate.bind(this, l);
        }
      });
    }
    initializeTransitionState(a) {
      const o = {};
      const r = {};
      const s = V(
        a,
        this.props.style
      );
      Object.keys(s).forEach((l) => {
        const d = s[l];
        if (q.indexOf(l) !== -1 || typeof d !== "number") {
          o[l] = new Y.Value(0);
          r[l] = d;
        } else {
          const c = new Y.Value(d);
          o[l] = c;
          r[l] = c;
        }
      });
      return {
        currentTransitionValues: s,
        transitionStyle: r,
        transitionValues: o
      };
    }
    getTransitionState(a) {
      const o = typeof a === "string" ? [a] : a;
      let { transitionValues: r, currentTransitionValues: s, transitionStyle: l } = this.state;
      const d = o.filter(
        (c) => !this.state.transitionValues[c]
      );
      if (d.length) {
        const c = this.initializeTransitionState(d);
        r = {
          ...r,
          ...c.transitionValues
        };
        s = {
          ...s,
          ...c.currentTransitionValues
        };
        l = {
          ...l,
          ...c.transitionStyle
        };
      }
      return { transitionValues: r, currentTransitionValues: s, transitionStyle: l };
    }
    setNativeProps(a) {
      if (this.ref) {
        this.ref.setNativeProps(a);
      }
    }
    componentDidMount() {
      const { animation: a, duration: o, delay: r, onAnimationBegin: s, iterationDelay: l } = this.props;
      if (a) {
        const d = () => {
          s();
          this.startAnimation(
            o,
            0,
            l,
            (c) => this.props.onAnimationEnd(c)
          );
          this.delayTimer = null;
        };
        if (r) {
          this.delayTimer = setTimeout(d, r);
        } else {
          d();
        }
      }
    }
    // eslint-disable-next-line camelcase
    UNSAFE_componentWillReceiveProps(a) {
      const {
        animation: o,
        delay: r,
        duration: s,
        easing: l,
        iterationDelay: d,
        transition: c,
        onAnimationBegin: f
      } = a;
      if (c) {
        const x = V(c, a.style);
        this.transitionTo(x, s, l, r);
      } else if (!Nt(o, this.props.animation)) {
        if (o) {
          if (this.delayTimer) {
            this.setAnimation(o);
          } else {
            f();
            this.animate(o, s, d).then(
              (x) => this.props.onAnimationEnd(x)
            );
          }
        } else {
          this.stopAnimation();
        }
      }
    }
    componentWillUnmount() {
      if (this.delayTimer) {
        clearTimeout(this.delayTimer);
      }
    }
    setAnimation(a, o) {
      const r = ct(a);
      this.setState(
        (s) => ({
          animationStyle: lt(
            r,
            s.animationValue
          ),
          compiledAnimation: r
        }),
        o
      );
    }
    animate(a, o, r) {
      return new Promise((s) => {
        this.setAnimation(a, () => {
          this.startAnimation(o, 0, r, s);
        });
      });
    }
    stopAnimation() {
      this.setState({
        scheduledAnimation: false,
        animationStyle: {}
      });
      this.state.animationValue.stopAnimation();
      if (this.delayTimer) {
        clearTimeout(this.delayTimer);
        this.delayTimer = null;
      }
    }
    startAnimation(a, o, r, s) {
      const { animationValue: l, compiledAnimation: d } = this.state;
      const { direction: c, iterationCount: f, useNativeDriver: x, isInteraction: X } = this.props;
      let g = this.props.easing || d.easing || "ease";
      let b = o || 0;
      const T = st(b, c);
      const h = ut(b, c);
      l.setValue(T);
      if (typeof g === "string") {
        g = N[g];
      }
      const E = c === "reverse" || c === "alternate" && !h || c === "alternate-reverse" && !h;
      if (E) {
        g = Rt.out(g);
      }
      const L = {
        toValue: h,
        easing: g,
        isInteraction: typeof X !== "undefined" ? X : f <= 1,
        duration: a || this.props.duration || 1e3,
        useNativeDriver: x,
        delay: r && b > 0 ? r : 0
      };
      Y.timing(l, L).start((W) => {
        b += 1;
        if (W.finished && this.props.animation && (f === "infinite" || b < f)) {
          this.startAnimation(
            a,
            b,
            r,
            s
          );
        } else if (s) {
          s(W);
        }
      });
    }
    transition(a, o, r, s) {
      const l = O(a);
      const d = O(o);
      const c = Object.keys(d);
      const { transitionValues: f, currentTransitionValues: x, transitionStyle: X } = this.getTransitionState(c);
      c.forEach((g) => {
        const b = l[g];
        const T = d[g];
        let h = f[g];
        if (!h) {
          h = new Y.Value(0);
        }
        const E = q.indexOf(g) !== -1 || typeof value !== "number";
        const L = rt.indexOf(g) !== -1;
        if (E) {
          h.setValue(0);
          X[g] = h.interpolate({
            inputRange: [0, 1],
            outputRange: [b, T]
          });
          x[g] = T;
          d[g] = 1;
        } else {
          if (L) {
            X[g] = h.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 1],
              extrapolateLeft: "clamp"
            });
            x[g] = T;
          } else {
            X[g] = h;
          }
          h.setValue(b);
        }
      });
      this.setState(
        { transitionValues: f, transitionStyle: X, currentTransitionValues: x },
        () => {
          this.transitionToValues(
            d,
            r || this.props.duration,
            s,
            this.props.delay
          );
        }
      );
    }
    transitionTo(a, o, r, s) {
      const { currentTransitionValues: l } = this.state;
      const d = O(a);
      const c = {
        from: {},
        to: {}
      };
      Object.keys(d).forEach((f) => {
        const x = d[f];
        const X = q.indexOf(f) !== -1 || typeof value !== "number";
        const g = rt.indexOf(f) !== -1;
        const b = this.state.transitionStyle[f];
        const T = this.state.transitionValues[f];
        if (!X && !g && b && b === T) {
          pt(
            f,
            T,
            x,
            o,
            r,
            this.props.useNativeDriver,
            s,
            (h) => this.props.onTransitionBegin(h),
            (h) => this.props.onTransitionEnd(h)
          );
        } else {
          let h = l[f];
          if (typeof h === "undefined" && this.props.style) {
            const E = V(f, this.props.style);
            h = E[f];
          }
          c.from[f] = h;
          c.to[f] = x;
        }
      });
      if (Object.keys(c.from).length) {
        this.transition(c.from, c.to, o, r);
      }
    }
    transitionToValues(a, o, r, s) {
      Object.keys(a).forEach((l) => {
        const d = this.state.transitionValues[l];
        const c = a[l];
        pt(
          l,
          d,
          c,
          o,
          r,
          this.props.useNativeDriver,
          s,
          (f) => this.props.onTransitionBegin(f),
          (f) => this.props.onTransitionEnd(f)
        );
      });
    }
    render() {
      const { style: a, animation: o, transition: r } = this.props;
      if (o && r) {
        throw new Error("You cannot combine animation and transition props");
      }
      const s = vt(
        [
          "animation",
          "duration",
          "direction",
          "delay",
          "easing",
          "iterationCount",
          "iterationDelay",
          "onAnimationBegin",
          "onAnimationEnd",
          "onTransitionBegin",
          "onTransitionEnd",
          "style",
          "transition",
          "useNativeDriver",
          "isInteraction"
        ],
        this.props
      );
      return /* @__PURE__ */ Vt.createElement(
        n,
        {
          ref: this.handleRef,
          style: [
            a,
            this.state.animationStyle,
            v(this.state.transitionStyle)
          ],
          ...s
        }
      );
    }
  }, S(i, "displayName", `withAnimatable(${e})`), S(i, "propTypes", {
    animation: u.default.oneOfType([u.default.string, u.default.object]),
    duration: u.default.number,
    direction: u.default.oneOf([
      "normal",
      "reverse",
      "alternate",
      "alternate-reverse"
    ]),
    delay: u.default.number,
    easing: u.default.oneOfType([
      u.default.oneOf(Object.keys(N)),
      u.default.func
    ]),
    iterationCount(a, o) {
      const r = a[o];
      if (r !== "infinite" && !(typeof r === "number" && r >= 1)) {
        return new Error(
          'iterationCount must be a positive number or "infinite"'
        );
      }
      return null;
    },
    iterationDelay: u.default.number,
    onAnimationBegin: u.default.func,
    onAnimationEnd: u.default.func,
    onTransitionBegin: u.default.func,
    onTransitionEnd: u.default.func,
    style: u.default.oneOfType([
      u.default.number,
      u.default.array,
      u.default.object
    ]),
    transition: u.default.oneOfType([
      u.default.string,
      u.default.arrayOf(u.default.string)
    ]),
    useNativeDriver: u.default.bool,
    isInteraction: u.default.bool
  }), S(i, "defaultProps", {
    animation: void 0,
    delay: 0,
    direction: "normal",
    duration: void 0,
    easing: void 0,
    iterationCount: 1,
    iterationDelay: 0,
    onAnimationBegin() {
    },
    onAnimationEnd() {
    },
    onTransitionBegin() {
    },
    onTransitionEnd() {
    },
    style: void 0,
    transition: void 0,
    useNativeDriver: false,
    isInteraction: void 0
  }), i;
}

// node_modules/react-native-animatable/definitions/index.js
var M = {};
xt(M, {
  bounce: () => Ct,
  bounceIn: () => qt,
  bounceInDown: () => Wt,
  bounceInLeft: () => Kt,
  bounceInRight: () => Zt,
  bounceInUp: () => Mt,
  bounceOut: () => Ht,
  bounceOutDown: () => Gt,
  bounceOutLeft: () => Qt,
  bounceOutRight: () => $t,
  bounceOutUp: () => Jt,
  fadeIn: () => te,
  fadeInDown: () => ee,
  fadeInDownBig: () => ie,
  fadeInLeft: () => ae,
  fadeInLeftBig: () => se,
  fadeInRight: () => oe,
  fadeInRightBig: () => ce,
  fadeInUp: () => ne,
  fadeInUpBig: () => re,
  fadeOut: () => le,
  fadeOutDown: () => pe,
  fadeOutDownBig: () => de,
  fadeOutLeft: () => fe,
  fadeOutLeftBig: () => he,
  fadeOutRight: () => me,
  fadeOutRightBig: () => ye,
  fadeOutUp: () => ue,
  fadeOutUpBig: () => ge,
  flash: () => kt,
  flipInX: () => xe,
  flipInY: () => be,
  flipOutX: () => Xe,
  flipOutY: () => Oe,
  jello: () => Dt,
  lightSpeedIn: () => Te,
  lightSpeedOut: () => Ye,
  pulse: () => Bt,
  rotate: () => Lt,
  rubberBand: () => _t,
  shake: () => jt,
  slideInDown: () => we,
  slideInLeft: () => Se,
  slideInRight: () => Ae,
  slideInUp: () => Ie,
  slideOutDown: () => Ee,
  slideOutLeft: () => ze,
  slideOutRight: () => Re,
  slideOutUp: () => Ve,
  swing: () => Pt,
  tada: () => Ft,
  wobble: () => Ut,
  zoomIn: () => Ne,
  zoomInDown: () => Ce,
  zoomInLeft: () => De,
  zoomInRight: () => Be,
  zoomInUp: () => ke,
  zoomOut: () => je,
  zoomOutDown: () => Pe,
  zoomOutLeft: () => Fe,
  zoomOutRight: () => Ue,
  zoomOutUp: () => _e
});

// node_modules/react-native-animatable/definitions/attention-seekers.js
var Ct = {
  0: {
    translateY: 0
  },
  0.2: {
    translateY: 0
  },
  0.4: {
    translateY: -30
  },
  0.43: {
    translateY: -30
  },
  0.53: {
    translateY: 0
  },
  0.7: {
    translateY: -15
  },
  0.8: {
    translateY: 0
  },
  0.9: {
    translateY: -4
  },
  1: {
    translateY: 0
  }
};
var kt = {
  0: {
    opacity: 1
  },
  0.25: {
    opacity: 0
  },
  0.5: {
    opacity: 1
  },
  0.75: {
    opacity: 0
  },
  1: {
    opacity: 1
  }
};
var Dt = {
  0: {
    skewX: "0deg",
    skewY: "0deg"
  },
  0.111: {
    skewX: "0deg",
    skewY: "0deg"
  },
  0.222: {
    skewX: "-12.5deg",
    skewY: "-12.5deg"
  },
  0.333: {
    skewX: "6.25deg",
    skewY: "6.25deg"
  },
  0.444: {
    skewX: "-3.125deg",
    skewY: "-3.125deg"
  },
  0.555: {
    skewX: "1.5625deg",
    skewY: "1.5625deg"
  },
  0.666: {
    skewX: "-0.78125deg",
    skewY: "-0.78125deg"
  },
  0.777: {
    skewX: "0.390625deg",
    skewY: "0.390625deg"
  },
  0.888: {
    skewX: "-0.1953125deg",
    skewY: "-0.1953125deg"
  },
  1: {
    skewX: "0deg",
    skewY: "0deg"
  }
};
var Bt = {
  0: {
    scale: 1
  },
  0.5: {
    scale: 1.05
  },
  1: {
    scale: 1
  }
};
var Lt = {
  0: {
    rotate: "0deg"
  },
  0.25: {
    rotate: "90deg"
  },
  0.5: {
    rotate: "180deg"
  },
  0.75: {
    rotate: "270deg"
  },
  1: {
    rotate: "360deg"
  }
};
var jt = {
  0: {
    translateX: 0
  },
  0.1: {
    translateX: -10
  },
  0.2: {
    translateX: 10
  },
  0.3: {
    translateX: -10
  },
  0.4: {
    translateX: 10
  },
  0.5: {
    translateX: -10
  },
  0.6: {
    translateX: 10
  },
  0.7: {
    translateX: -10
  },
  0.8: {
    translateX: 10
  },
  0.9: {
    translateX: -10
  },
  1: {
    translateX: 0
  }
};
var Pt = {
  0: {
    rotate: "0deg"
  },
  0.2: {
    rotate: "15deg"
  },
  0.4: {
    rotate: "-10deg"
  },
  0.6: {
    rotate: "5deg"
  },
  0.8: {
    rotate: "-5deg"
  },
  1: {
    rotate: "0deg"
  }
};
var _t = {
  0: {
    scaleX: 1,
    scaleY: 1
  },
  0.3: {
    scaleX: 1.25,
    scaleY: 0.75
  },
  0.4: {
    scaleX: 0.75,
    scaleY: 1.25
  },
  0.5: {
    scaleX: 1.15,
    scaleY: 0.85
  },
  0.65: {
    scaleX: 0.95,
    scaleY: 1.05
  },
  0.75: {
    scaleX: 1.05,
    scaleY: 0.95
  },
  1: {
    scaleX: 1,
    scaleY: 1
  }
};
var Ft = {
  0: {
    scale: 1,
    rotate: "0deg"
  },
  0.1: {
    scale: 0.9,
    rotate: "-3deg"
  },
  0.2: {
    scale: 0.9,
    rotate: "-3deg"
  },
  0.3: {
    scale: 1.1,
    rotate: "-3deg"
  },
  0.4: {
    rotate: "3deg"
  },
  0.5: {
    rotate: "-3deg"
  },
  0.6: {
    rotate: "3deg"
  },
  0.7: {
    rotate: "-3deg"
  },
  0.8: {
    rotate: "3deg"
  },
  0.9: {
    scale: 1.1,
    rotate: "3deg"
  },
  1: {
    scale: 1,
    rotate: "0deg"
  }
};
var Ut = {
  0: {
    translateX: 0,
    rotate: "0deg"
  },
  0.15: {
    translateX: -25,
    rotate: "-5deg"
  },
  0.3: {
    translateX: 20,
    rotate: "3deg"
  },
  0.45: {
    translateX: -15,
    rotate: "-3deg"
  },
  0.6: {
    translateX: 10,
    rotate: "2deg"
  },
  0.75: {
    translateX: -5,
    rotate: "-1deg"
  },
  1: {
    translateX: 0,
    rotate: "0deg"
  }
};

// node_modules/react-native-animatable/definitions/bouncing-entrances.js
var qt = {
  0: {
    opacity: 0,
    scale: 0.3
  },
  0.2: {
    scale: 1.1
  },
  0.4: {
    scale: 0.9
  },
  0.6: {
    opacity: 1,
    scale: 1.03
  },
  0.8: {
    scale: 0.97
  },
  1: {
    opacity: 1,
    scale: 1
  }
};
var Mt = {
  0: {
    opacity: 0,
    translateY: 800
  },
  0.6: {
    opacity: 1,
    translateY: -25
  },
  0.75: {
    translateY: 10
  },
  0.9: {
    translateY: -5
  },
  1: {
    translateY: 0
  }
};
var Wt = {
  0: {
    opacity: 0,
    translateY: -800
  },
  0.6: {
    opacity: 1,
    translateY: 25
  },
  0.75: {
    translateY: -10
  },
  0.9: {
    translateY: 5
  },
  1: {
    translateY: 0
  }
};
var Zt = {
  0: {
    opacity: 0,
    translateX: 600
  },
  0.6: {
    opacity: 1,
    translateX: -20
  },
  0.75: {
    translateX: 8
  },
  0.9: {
    translateX: -4
  },
  1: {
    translateX: 0
  }
};
var Kt = {
  0: {
    opacity: 0,
    translateX: -600
  },
  0.6: {
    opacity: 1,
    translateX: 20
  },
  0.75: {
    translateX: -8
  },
  0.9: {
    translateX: 4
  },
  1: {
    translateX: 0
  }
};

// node_modules/react-native-animatable/definitions/bouncing-exits.js
var Ht = {
  0: {
    opacity: 1,
    scale: 1
  },
  0.2: {
    scale: 0.9
  },
  0.5: {
    opacity: 1,
    scale: 1.11
  },
  0.55: {
    scale: 1.11
  },
  1: {
    opacity: 0,
    scale: 0.3
  }
};
var Jt = {
  0: {
    opacity: 1,
    translateY: 0
  },
  0.2: {
    opacity: 1,
    translateY: -10
  },
  0.4: {
    translateY: 20
  },
  0.45: {
    translateY: 20
  },
  0.55: {
    opacity: 1
  },
  1: {
    opacity: 0,
    translateY: -800
  }
};
var Gt = {
  0: {
    opacity: 1,
    translateY: 0
  },
  0.2: {
    opacity: 1,
    translateY: 10
  },
  0.4: {
    translateY: -20
  },
  0.45: {
    translateY: -20
  },
  0.55: {
    opacity: 1
  },
  1: {
    opacity: 0,
    translateY: 800
  }
};
var $t = {
  0: {
    opacity: 1,
    translateX: 0
  },
  0.2: {
    opacity: 1,
    translateX: 10
  },
  0.4: {
    translateX: -20
  },
  0.45: {
    translateX: -20
  },
  0.55: {
    opacity: 1
  },
  1: {
    opacity: 0,
    translateX: 600
  }
};
var Qt = {
  0: {
    opacity: 1,
    translateX: 0
  },
  0.2: {
    opacity: 1,
    translateX: -10
  },
  0.4: {
    translateX: 20
  },
  0.45: {
    translateX: 20
  },
  0.55: {
    opacity: 1
  },
  1: {
    opacity: 0,
    translateX: -600
  }
};

// node_modules/react-native-animatable/definitions/fading-entrances.js
function w(t, e) {
  return {
    from: {
      opacity: 0,
      [t]: e
    },
    to: {
      opacity: 1,
      [t]: 0
    }
  };
}
var te = {
  from: {
    opacity: 0
  },
  to: {
    opacity: 1
  }
};
var ee = w("translateY", -100);
var ne = w("translateY", 100);
var ae = w("translateX", -100);
var oe = w("translateX", 100);
var ie = w("translateY", -500);
var re = w("translateY", 500);
var se = w("translateX", -500);
var ce = w("translateX", 500);

// node_modules/react-native-animatable/definitions/fading-exits.js
function I(t, e) {
  return {
    from: {
      opacity: 1,
      [t]: 0
    },
    to: {
      opacity: 0,
      [t]: e
    }
  };
}
var le = {
  from: {
    opacity: 1
  },
  to: {
    opacity: 0
  }
};
var pe = I("translateY", 100);
var ue = I("translateY", -100);
var fe = I("translateX", -100);
var me = I("translateX", 100);
var de = I("translateY", 500);
var ge = I("translateY", -500);
var he = I("translateX", -500);
var ye = I("translateX", 500);

// node_modules/react-native-animatable/definitions/flippers.js
var xe = {
  easing: "ease-in",
  style: {
    backfaceVisibility: "visible",
    perspective: 400
  },
  0: {
    opacity: 0,
    rotateX: "90deg"
  },
  0.4: {
    rotateX: "-20deg"
  },
  0.6: {
    opacity: 1,
    rotateX: "10deg"
  },
  0.8: {
    rotateX: "-5deg"
  },
  1: {
    opacity: 1,
    rotateX: "0deg"
  }
};
var be = {
  easing: "ease-in",
  style: {
    backfaceVisibility: "visible",
    perspective: 400
  },
  0: {
    opacity: 0,
    rotateY: "90deg"
  },
  0.4: {
    rotateY: "-20deg"
  },
  0.6: {
    opacity: 1,
    rotateY: "10deg"
  },
  0.8: {
    rotateY: "-5deg"
  },
  1: {
    opacity: 1,
    rotateY: "0deg"
  }
};
var Xe = {
  style: {
    backfaceVisibility: "visible",
    perspective: 400
  },
  0: {
    opacity: 1,
    rotateX: "0deg"
  },
  0.3: {
    opacity: 1,
    rotateX: "-20deg"
  },
  1: {
    opacity: 0,
    rotateX: "90deg"
  }
};
var Oe = {
  style: {
    backfaceVisibility: "visible",
    perspective: 400
  },
  0: {
    opacity: 1,
    rotateY: "0deg"
  },
  0.3: {
    opacity: 1,
    rotateY: "-20deg"
  },
  1: {
    opacity: 0,
    rotateY: "90deg"
  }
};

// node_modules/react-native-animatable/definitions/lightspeed.js
var Te = {
  easing: "ease-out",
  0: {
    opacity: 0,
    translateX: 200,
    skewX: "-30deg"
  },
  0.6: {
    opacity: 1,
    translateX: 0,
    skewX: "20deg"
  },
  0.8: {
    skewX: "-5deg"
  },
  1: {
    opacity: 1,
    translateX: 0,
    skewX: "0deg"
  }
};
var Ye = {
  easing: "ease-in",
  0: {
    opacity: 1,
    translateX: 0,
    skewX: "0deg"
  },
  1: {
    opacity: 0,
    translateX: 200,
    skewX: "30deg"
  }
};

// node_modules/react-native-animatable/definitions/sliding-entrances.js
function C(t, e) {
  return {
    from: {
      [t]: e
    },
    to: {
      [t]: 0
    }
  };
}
var we = C("translateY", -100);
var Ie = C("translateY", 100);
var Se = C("translateX", -100);
var Ae = C("translateX", 100);

// node_modules/react-native-animatable/definitions/sliding-exits.js
function k(t, e) {
  return {
    from: {
      [t]: 0
    },
    to: {
      [t]: e
    }
  };
}
var Ee = k("translateY", 100);
var Ve = k("translateY", -100);
var ze = k("translateX", -100);
var Re = k("translateX", 100);

// node_modules/react-native-animatable/definitions/zooming-entrances.js
import { Easing as ve } from "react-native";
function D(t, e) {
  const n = Math.min(1, Math.max(-1, e));
  return {
    easing: ve.bezier(0.175, 0.885, 0.32, 1),
    0: {
      opacity: 0,
      scale: 0.1,
      [t]: n * -1e3
    },
    0.6: {
      opacity: 1,
      scale: 0.457,
      [t]: e
    },
    1: {
      scale: 1,
      [t]: 0
    }
  };
}
var Ne = {
  from: {
    opacity: 0,
    scale: 0.3
  },
  0.5: {
    opacity: 1
  },
  to: {
    opacity: 1,
    scale: 1
  }
};
var Ce = D("translateY", 60);
var ke = D("translateY", -60);
var De = D("translateX", 10);
var Be = D("translateX", -10);

// node_modules/react-native-animatable/definitions/zooming-exits.js
import { Easing as Le } from "react-native";
function B(t, e) {
  const n = Math.min(1, Math.max(-1, e));
  return {
    easing: Le.bezier(0.175, 0.885, 0.32, 1),
    0: {
      opacity: 1,
      scale: 1,
      [t]: 0
    },
    0.4: {
      opacity: 1,
      scale: 0.457,
      [t]: e
    },
    1: {
      opacity: 0,
      scale: 0.1,
      [t]: n * -1e3
    }
  };
}
var je = {
  from: {
    opacity: 1,
    scale: 1
  },
  0.5: {
    opacity: 1,
    scale: 0.3
  },
  to: {
    opacity: 0,
    scale: 0
  }
};
var Pe = B("translateY", 60);
var _e = B("translateY", -60);
var Fe = B("translateX", 10);
var Ue = B("translateX", -10);

// node_modules/react-native-animatable/index.js
U(M);
var Gn = z(qe);
var Ze = z(Me);
var $n = z(We);
export {
  Ze as AnimatableText
};
//# sourceMappingURL=text-animation.js.map
