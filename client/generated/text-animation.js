var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __defNormalProp = (obj, key, value2) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value: value2 }) : obj[key] = value2;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __publicField = (obj, key, value2) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value2);

// node_modules/prop-types/lib/ReactPropTypesSecret.js
var require_ReactPropTypesSecret = __commonJS({
  "node_modules/prop-types/lib/ReactPropTypesSecret.js"(exports, module) {
    "use strict";
    var ReactPropTypesSecret = "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED";
    module.exports = ReactPropTypesSecret;
  }
});

// node_modules/prop-types/factoryWithThrowingShims.js
var require_factoryWithThrowingShims = __commonJS({
  "node_modules/prop-types/factoryWithThrowingShims.js"(exports, module) {
    "use strict";
    var ReactPropTypesSecret = require_ReactPropTypesSecret();
    function emptyFunction() {
    }
    function emptyFunctionWithReset() {
    }
    emptyFunctionWithReset.resetWarningCache = emptyFunction;
    module.exports = function() {
      function shim(props, propName, componentName, location, propFullName, secret) {
        if (secret === ReactPropTypesSecret) {
          return;
        }
        var err = new Error(
          "Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types"
        );
        err.name = "Invariant Violation";
        throw err;
      }
      ;
      shim.isRequired = shim;
      function getShim() {
        return shim;
      }
      ;
      var ReactPropTypes = {
        array: shim,
        bigint: shim,
        bool: shim,
        func: shim,
        number: shim,
        object: shim,
        string: shim,
        symbol: shim,
        any: shim,
        arrayOf: getShim,
        element: shim,
        elementType: shim,
        instanceOf: getShim,
        node: shim,
        objectOf: getShim,
        oneOf: getShim,
        oneOfType: getShim,
        shape: getShim,
        exact: getShim,
        checkPropTypes: emptyFunctionWithReset,
        resetWarningCache: emptyFunction
      };
      ReactPropTypes.PropTypes = ReactPropTypes;
      return ReactPropTypes;
    };
  }
});

// node_modules/prop-types/index.js
var require_prop_types = __commonJS({
  "node_modules/prop-types/index.js"(exports, module) {
    if (false) {
      ReactIs = null;
      throwOnDirectAccess = true;
      module.exports = null(ReactIs.isElement, throwOnDirectAccess);
    } else {
      module.exports = require_factoryWithThrowingShims()();
    }
    var ReactIs;
    var throwOnDirectAccess;
  }
});

// node_modules/react-native-animatable/index.js
import {
  View as CoreView,
  Text as CoreText,
  Image as CoreImage
} from "react-native";

// node_modules/react-native-animatable/createAnimatableComponent.js
var import_prop_types = __toESM(require_prop_types());
import React, { Component } from "react";
import { Animated, Easing as Easing2 } from "react-native";

// node_modules/react-native-animatable/wrapStyleTransforms.js
var TRANSFORM_STYLE_PROPERTIES = [
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
function wrapStyleTransforms(style) {
  const wrapped = {};
  Object.keys(style).forEach((key) => {
    if (TRANSFORM_STYLE_PROPERTIES.indexOf(key) !== -1) {
      if (!wrapped.transform) {
        wrapped.transform = [];
      }
      wrapped.transform.push({
        [key]: style[key]
      });
    } else {
      wrapped[key] = style[key];
    }
  });
  return wrapped;
}

// node_modules/react-native-animatable/flattenStyle.js
import { StyleSheet } from "react-native";
function flattenStyle(style) {
  const flatStyle = Object.assign({}, StyleSheet.flatten(style));
  if (flatStyle.transform) {
    flatStyle.transform.forEach((transform) => {
      const key = Object.keys(transform)[0];
      flatStyle[key] = transform[key];
    });
    delete flatStyle.transform;
  }
  return flatStyle;
}

// node_modules/react-native-animatable/getDefaultStyleValue.js
var DIRECTIONAL_FALLBACKS = {
  Top: ["Vertical", ""],
  Bottom: ["Vertical", ""],
  Vertical: [""],
  Left: ["Horizontal", ""],
  Right: ["Horizontal", ""],
  Horizontal: [""]
};
var DIRECTIONAL_SUFFICES = Object.keys(DIRECTIONAL_FALLBACKS);
function getDefaultStyleValue(key, flatStyle) {
  if (key === "backgroundColor") {
    return "rgba(0,0,0,0)";
  }
  if (key === "color" || key.indexOf("Color") !== -1) {
    return "rgba(0,0,0,1)";
  }
  if (key.indexOf("rotate") === 0 || key.indexOf("skew") === 0) {
    return "0deg";
  }
  if (key === "opacity" || key.indexOf("scale") === 0) {
    return 1;
  }
  if (key === "fontSize") {
    return 14;
  }
  if (key.indexOf("margin") === 0 || key.indexOf("padding") === 0) {
    for (let suffix, i = 0; i < DIRECTIONAL_SUFFICES.length; i++) {
      suffix = DIRECTIONAL_SUFFICES[i];
      if (key.substr(-suffix.length) === suffix) {
        const prefix = key.substr(0, key.length - suffix.length);
        const fallbacks = DIRECTIONAL_FALLBACKS[suffix];
        for (let fallback, j = 0; j < fallbacks.length; j++) {
          fallback = prefix + fallbacks[j];
          if (fallback in flatStyle) {
            return flatStyle[fallback];
          }
        }
        break;
      }
    }
  }
  return 0;
}

// node_modules/react-native-animatable/getStyleValues.js
function getStyleValues(keys, style) {
  const values = {};
  const flatStyle = flattenStyle(style);
  (typeof keys === "string" ? [keys] : keys).forEach((key) => {
    values[key] = key in flatStyle ? flatStyle[key] : getDefaultStyleValue(key, flatStyle);
  });
  return values;
}

// node_modules/react-native-animatable/createAnimation.js
function compareNumbers(a, b) {
  return a - b;
}
function notNull(value2) {
  return value2 !== null;
}
function parsePosition(value2) {
  if (value2 === "from") {
    return 0;
  }
  if (value2 === "to") {
    return 1;
  }
  const parsed = parseFloat(value2, 10);
  if (Number.isNaN(parsed) || parsed < 0 || parsed > 1) {
    return null;
  }
  return parsed;
}
var cache = {};
function createAnimation(definition) {
  const cacheKey = JSON.stringify(definition);
  if (cache[cacheKey]) {
    return cache[cacheKey];
  }
  const positions = Object.keys(definition).map(parsePosition).filter(notNull);
  positions.sort(compareNumbers);
  if (positions.length < 2) {
    throw new Error("Animation definitions must have at least two values.");
  }
  const compiled = {};
  if (definition.easing) {
    compiled.easing = definition.easing;
  }
  if (definition.style) {
    compiled.style = definition.style;
  }
  for (let i = 0; i < positions.length; i += 1) {
    const position = positions[i];
    let keyframe = definition[position];
    if (!keyframe) {
      if (position === 0) {
        keyframe = definition.from;
      } else if (position === 1) {
        keyframe = definition.to;
      }
    }
    if (!keyframe) {
      throw new Error("Missing animation keyframe, this should not happen");
    }
    keyframe = flattenStyle(keyframe);
    Object.keys(keyframe).forEach((key) => {
      if (!(key in compiled)) {
        compiled[key] = {
          inputRange: [],
          outputRange: []
        };
      }
      compiled[key].inputRange.push(position);
      compiled[key].outputRange.push(keyframe[key]);
    });
  }
  cache[cacheKey] = compiled;
  return compiled;
}

// node_modules/react-native-animatable/registry.js
var animationRegistry = {};
function registerAnimation(animationName, animation) {
  animationRegistry[animationName] = animation;
}
function getAnimationByName(animationName) {
  return animationRegistry[animationName];
}
function getAnimationNames() {
  return Object.keys(animationRegistry);
}
function initializeRegistryWithDefinitions(definitions) {
  Object.keys(definitions).forEach((animationName) => {
    registerAnimation(
      animationName,
      createAnimation(definitions[animationName])
    );
  });
}

// node_modules/react-native-animatable/easing.js
import { Easing } from "react-native";
var EASING_FUNCTIONS = {
  // Standard CSS easings
  linear: Easing.linear,
  ease: Easing.bezier(0.25, 0.1, 0.25, 1),
  "ease-in": Easing.bezier(0.42, 0, 1, 1),
  "ease-out": Easing.bezier(0, 0, 0.58, 1),
  "ease-in-out": Easing.bezier(0.42, 0, 0.58, 1),
  // Penner Equations - http://matthewlein.com/ceaser/ & http://easings.net
  "ease-in-cubic": Easing.bezier(0.55, 0.055, 0.675, 0.19),
  "ease-out-cubic": Easing.bezier(0.215, 0.61, 0.355, 1),
  "ease-in-out-cubic": Easing.bezier(0.645, 0.045, 0.355, 1),
  "ease-in-circ": Easing.bezier(0.6, 0.04, 0.98, 0.335),
  "ease-out-circ": Easing.bezier(0.075, 0.82, 0.165, 1),
  "ease-in-out-circ": Easing.bezier(0.785, 0.135, 0.15, 0.86),
  "ease-in-expo": Easing.bezier(0.95, 0.05, 0.795, 0.035),
  "ease-out-expo": Easing.bezier(0.19, 1, 0.22, 1),
  "ease-in-out-expo": Easing.bezier(1, 0, 0, 1),
  "ease-in-quad": Easing.bezier(0.55, 0.085, 0.68, 0.53),
  "ease-out-quad": Easing.bezier(0.25, 0.46, 0.45, 0.94),
  "ease-in-out-quad": Easing.bezier(0.455, 0.03, 0.515, 0.955),
  "ease-in-quart": Easing.bezier(0.895, 0.03, 0.685, 0.22),
  "ease-out-quart": Easing.bezier(0.165, 0.84, 0.44, 1),
  "ease-in-out-quart": Easing.bezier(0.77, 0, 0.175, 1),
  "ease-in-quint": Easing.bezier(0.755, 0.05, 0.855, 0.06),
  "ease-out-quint": Easing.bezier(0.23, 1, 0.32, 1),
  "ease-in-out-quint": Easing.bezier(0.86, 0, 0.07, 1),
  "ease-in-sine": Easing.bezier(0.47, 0, 0.745, 0.715),
  "ease-out-sine": Easing.bezier(0.39, 0.575, 0.565, 1),
  "ease-in-out-sine": Easing.bezier(0.445, 0.05, 0.55, 0.95),
  "ease-in-back": Easing.bezier(0.6, -0.28, 0.735, 0.045),
  "ease-out-back": Easing.bezier(0.175, 0.885, 0.32, 1.275),
  "ease-in-out-back": Easing.bezier(0.68, -0.55, 0.265, 1.55)
};
var easing_default = EASING_FUNCTIONS;

// node_modules/react-native-animatable/createAnimatableComponent.js
var INTERPOLATION_STYLE_PROPERTIES = [
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
var ZERO_CLAMPED_STYLE_PROPERTIES = ["width", "height"];
function omit(keys, source) {
  const filtered = {};
  Object.keys(source).forEach((key) => {
    if (keys.indexOf(key) === -1) {
      filtered[key] = source[key];
    }
  });
  return filtered;
}
function deepEquals(a, b) {
  return a === b || JSON.stringify(a) === JSON.stringify(b);
}
function getAnimationTarget(iteration, direction) {
  switch (direction) {
    case "reverse":
      return 0;
    case "alternate":
      return iteration % 2 ? 0 : 1;
    case "alternate-reverse":
      return iteration % 2 ? 1 : 0;
    case "normal":
    default:
      return 1;
  }
}
function getAnimationOrigin(iteration, direction) {
  return getAnimationTarget(iteration, direction) ? 0 : 1;
}
function getCompiledAnimation(animation) {
  if (typeof animation === "string") {
    const compiledAnimation = getAnimationByName(animation);
    if (!compiledAnimation) {
      throw new Error(`No animation registred by the name of ${animation}`);
    }
    return compiledAnimation;
  }
  return createAnimation(animation);
}
function makeInterpolatedStyle(compiledAnimation, animationValue) {
  const style = {};
  Object.keys(compiledAnimation).forEach((key) => {
    if (key === "style") {
      Object.assign(style, compiledAnimation.style);
    } else if (key !== "easing") {
      style[key] = animationValue.interpolate(compiledAnimation[key]);
    }
  });
  return wrapStyleTransforms(style);
}
function transitionToValue(property, transitionValue, toValue, duration, easing, useNativeDriver = false, delay, onTransitionBegin, onTransitionEnd) {
  const animation = duration || easing || delay ? Animated.timing(transitionValue, {
    toValue,
    delay,
    duration: duration || 1e3,
    easing: typeof easing === "function" ? easing : easing_default[easing || "ease"],
    useNativeDriver
  }) : Animated.spring(transitionValue, { toValue, useNativeDriver });
  setTimeout(() => onTransitionBegin(property), delay);
  animation.start(() => onTransitionEnd(property));
}
function createAnimatableComponent(WrappedComponent) {
  var _a;
  const wrappedComponentName = WrappedComponent.displayName || WrappedComponent.name || "Component";
  const Animatable = Animated.createAnimatedComponent(WrappedComponent);
  return _a = class extends Component {
    constructor(props) {
      super(props);
      __publicField(this, "ref", null);
      __publicField(this, "handleRef", (ref) => {
        this.ref = ref;
      });
      const animationValue = new Animated.Value(
        getAnimationOrigin(0, this.props.direction)
      );
      let animationStyle = {};
      let compiledAnimation = {};
      if (props.animation) {
        compiledAnimation = getCompiledAnimation(props.animation);
        animationStyle = makeInterpolatedStyle(
          compiledAnimation,
          animationValue
        );
      }
      this.state = {
        animationValue,
        animationStyle,
        compiledAnimation,
        transitionStyle: {},
        transitionValues: {},
        currentTransitionValues: {}
      };
      if (props.transition) {
        this.state = {
          ...this.state,
          ...this.initializeTransitionState(props.transition)
        };
      }
      this.delayTimer = null;
      getAnimationNames().forEach((animationName) => {
        if (!(animationName in this)) {
          this[animationName] = this.animate.bind(this, animationName);
        }
      });
    }
    initializeTransitionState(transitionKeys) {
      const transitionValues = {};
      const styleValues = {};
      const currentTransitionValues = getStyleValues(
        transitionKeys,
        this.props.style
      );
      Object.keys(currentTransitionValues).forEach((key) => {
        const value2 = currentTransitionValues[key];
        if (INTERPOLATION_STYLE_PROPERTIES.indexOf(key) !== -1 || typeof value2 !== "number") {
          transitionValues[key] = new Animated.Value(0);
          styleValues[key] = value2;
        } else {
          const animationValue = new Animated.Value(value2);
          transitionValues[key] = animationValue;
          styleValues[key] = animationValue;
        }
      });
      return {
        currentTransitionValues,
        transitionStyle: styleValues,
        transitionValues
      };
    }
    getTransitionState(keys) {
      const transitionKeys = typeof keys === "string" ? [keys] : keys;
      let { transitionValues, currentTransitionValues, transitionStyle } = this.state;
      const missingKeys = transitionKeys.filter(
        (key) => !this.state.transitionValues[key]
      );
      if (missingKeys.length) {
        const transitionState = this.initializeTransitionState(missingKeys);
        transitionValues = {
          ...transitionValues,
          ...transitionState.transitionValues
        };
        currentTransitionValues = {
          ...currentTransitionValues,
          ...transitionState.currentTransitionValues
        };
        transitionStyle = {
          ...transitionStyle,
          ...transitionState.transitionStyle
        };
      }
      return { transitionValues, currentTransitionValues, transitionStyle };
    }
    setNativeProps(nativeProps) {
      if (this.ref) {
        this.ref.setNativeProps(nativeProps);
      }
    }
    componentDidMount() {
      const { animation, duration, delay, onAnimationBegin, iterationDelay } = this.props;
      if (animation) {
        const startAnimation = () => {
          onAnimationBegin();
          this.startAnimation(
            duration,
            0,
            iterationDelay,
            (endState) => this.props.onAnimationEnd(endState)
          );
          this.delayTimer = null;
        };
        if (delay) {
          this.delayTimer = setTimeout(startAnimation, delay);
        } else {
          startAnimation();
        }
      }
    }
    // eslint-disable-next-line camelcase
    UNSAFE_componentWillReceiveProps(props) {
      const {
        animation,
        delay,
        duration,
        easing,
        iterationDelay,
        transition,
        onAnimationBegin
      } = props;
      if (transition) {
        const values = getStyleValues(transition, props.style);
        this.transitionTo(values, duration, easing, delay);
      } else if (!deepEquals(animation, this.props.animation)) {
        if (animation) {
          if (this.delayTimer) {
            this.setAnimation(animation);
          } else {
            onAnimationBegin();
            this.animate(animation, duration, iterationDelay).then(
              (endState) => this.props.onAnimationEnd(endState)
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
    setAnimation(animation, callback) {
      const compiledAnimation = getCompiledAnimation(animation);
      this.setState(
        (state) => ({
          animationStyle: makeInterpolatedStyle(
            compiledAnimation,
            state.animationValue
          ),
          compiledAnimation
        }),
        callback
      );
    }
    animate(animation, duration, iterationDelay) {
      return new Promise((resolve) => {
        this.setAnimation(animation, () => {
          this.startAnimation(duration, 0, iterationDelay, resolve);
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
    startAnimation(duration, iteration, iterationDelay, callback) {
      const { animationValue, compiledAnimation } = this.state;
      const { direction, iterationCount, useNativeDriver, isInteraction } = this.props;
      let easing = this.props.easing || compiledAnimation.easing || "ease";
      let currentIteration = iteration || 0;
      const fromValue = getAnimationOrigin(currentIteration, direction);
      const toValue = getAnimationTarget(currentIteration, direction);
      animationValue.setValue(fromValue);
      if (typeof easing === "string") {
        easing = easing_default[easing];
      }
      const reversed = direction === "reverse" || direction === "alternate" && !toValue || direction === "alternate-reverse" && !toValue;
      if (reversed) {
        easing = Easing2.out(easing);
      }
      const config = {
        toValue,
        easing,
        isInteraction: typeof isInteraction !== "undefined" ? isInteraction : iterationCount <= 1,
        duration: duration || this.props.duration || 1e3,
        useNativeDriver,
        delay: iterationDelay && currentIteration > 0 ? iterationDelay : 0
      };
      Animated.timing(animationValue, config).start((endState) => {
        currentIteration += 1;
        if (endState.finished && this.props.animation && (iterationCount === "infinite" || currentIteration < iterationCount)) {
          this.startAnimation(
            duration,
            currentIteration,
            iterationDelay,
            callback
          );
        } else if (callback) {
          callback(endState);
        }
      });
    }
    transition(fromValues, toValues, duration, easing) {
      const fromValuesFlat = flattenStyle(fromValues);
      const toValuesFlat = flattenStyle(toValues);
      const transitionKeys = Object.keys(toValuesFlat);
      const { transitionValues, currentTransitionValues, transitionStyle } = this.getTransitionState(transitionKeys);
      transitionKeys.forEach((property) => {
        const fromValue = fromValuesFlat[property];
        const toValue = toValuesFlat[property];
        let transitionValue = transitionValues[property];
        if (!transitionValue) {
          transitionValue = new Animated.Value(0);
        }
        const needsInterpolation = INTERPOLATION_STYLE_PROPERTIES.indexOf(property) !== -1 || typeof value !== "number";
        const needsZeroClamping = ZERO_CLAMPED_STYLE_PROPERTIES.indexOf(property) !== -1;
        if (needsInterpolation) {
          transitionValue.setValue(0);
          transitionStyle[property] = transitionValue.interpolate({
            inputRange: [0, 1],
            outputRange: [fromValue, toValue]
          });
          currentTransitionValues[property] = toValue;
          toValuesFlat[property] = 1;
        } else {
          if (needsZeroClamping) {
            transitionStyle[property] = transitionValue.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 1],
              extrapolateLeft: "clamp"
            });
            currentTransitionValues[property] = toValue;
          } else {
            transitionStyle[property] = transitionValue;
          }
          transitionValue.setValue(fromValue);
        }
      });
      this.setState(
        { transitionValues, transitionStyle, currentTransitionValues },
        () => {
          this.transitionToValues(
            toValuesFlat,
            duration || this.props.duration,
            easing,
            this.props.delay
          );
        }
      );
    }
    transitionTo(toValues, duration, easing, delay) {
      const { currentTransitionValues } = this.state;
      const toValuesFlat = flattenStyle(toValues);
      const transitions = {
        from: {},
        to: {}
      };
      Object.keys(toValuesFlat).forEach((property) => {
        const toValue = toValuesFlat[property];
        const needsInterpolation = INTERPOLATION_STYLE_PROPERTIES.indexOf(property) !== -1 || typeof value !== "number";
        const needsZeroClamping = ZERO_CLAMPED_STYLE_PROPERTIES.indexOf(property) !== -1;
        const transitionStyle = this.state.transitionStyle[property];
        const transitionValue = this.state.transitionValues[property];
        if (!needsInterpolation && !needsZeroClamping && transitionStyle && transitionStyle === transitionValue) {
          transitionToValue(
            property,
            transitionValue,
            toValue,
            duration,
            easing,
            this.props.useNativeDriver,
            delay,
            (prop) => this.props.onTransitionBegin(prop),
            (prop) => this.props.onTransitionEnd(prop)
          );
        } else {
          let currentTransitionValue = currentTransitionValues[property];
          if (typeof currentTransitionValue === "undefined" && this.props.style) {
            const style = getStyleValues(property, this.props.style);
            currentTransitionValue = style[property];
          }
          transitions.from[property] = currentTransitionValue;
          transitions.to[property] = toValue;
        }
      });
      if (Object.keys(transitions.from).length) {
        this.transition(transitions.from, transitions.to, duration, easing);
      }
    }
    transitionToValues(toValues, duration, easing, delay) {
      Object.keys(toValues).forEach((property) => {
        const transitionValue = this.state.transitionValues[property];
        const toValue = toValues[property];
        transitionToValue(
          property,
          transitionValue,
          toValue,
          duration,
          easing,
          this.props.useNativeDriver,
          delay,
          (prop) => this.props.onTransitionBegin(prop),
          (prop) => this.props.onTransitionEnd(prop)
        );
      });
    }
    render() {
      const { style, animation, transition } = this.props;
      if (animation && transition) {
        throw new Error("You cannot combine animation and transition props");
      }
      const restProps = omit(
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
      return /* @__PURE__ */ React.createElement(
        Animatable,
        {
          ref: this.handleRef,
          style: [
            style,
            this.state.animationStyle,
            wrapStyleTransforms(this.state.transitionStyle)
          ],
          ...restProps
        }
      );
    }
  }, __publicField(_a, "displayName", `withAnimatable(${wrappedComponentName})`), __publicField(_a, "propTypes", {
    animation: import_prop_types.default.oneOfType([import_prop_types.default.string, import_prop_types.default.object]),
    duration: import_prop_types.default.number,
    direction: import_prop_types.default.oneOf([
      "normal",
      "reverse",
      "alternate",
      "alternate-reverse"
    ]),
    delay: import_prop_types.default.number,
    easing: import_prop_types.default.oneOfType([
      import_prop_types.default.oneOf(Object.keys(easing_default)),
      import_prop_types.default.func
    ]),
    iterationCount(props, propName) {
      const val = props[propName];
      if (val !== "infinite" && !(typeof val === "number" && val >= 1)) {
        return new Error(
          'iterationCount must be a positive number or "infinite"'
        );
      }
      return null;
    },
    iterationDelay: import_prop_types.default.number,
    onAnimationBegin: import_prop_types.default.func,
    onAnimationEnd: import_prop_types.default.func,
    onTransitionBegin: import_prop_types.default.func,
    onTransitionEnd: import_prop_types.default.func,
    style: import_prop_types.default.oneOfType([
      import_prop_types.default.number,
      import_prop_types.default.array,
      import_prop_types.default.object
    ]),
    transition: import_prop_types.default.oneOfType([
      import_prop_types.default.string,
      import_prop_types.default.arrayOf(import_prop_types.default.string)
    ]),
    useNativeDriver: import_prop_types.default.bool,
    isInteraction: import_prop_types.default.bool
  }), __publicField(_a, "defaultProps", {
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
  }), _a;
}

// node_modules/react-native-animatable/definitions/index.js
var definitions_exports = {};
__export(definitions_exports, {
  bounce: () => bounce,
  bounceIn: () => bounceIn,
  bounceInDown: () => bounceInDown,
  bounceInLeft: () => bounceInLeft,
  bounceInRight: () => bounceInRight,
  bounceInUp: () => bounceInUp,
  bounceOut: () => bounceOut,
  bounceOutDown: () => bounceOutDown,
  bounceOutLeft: () => bounceOutLeft,
  bounceOutRight: () => bounceOutRight,
  bounceOutUp: () => bounceOutUp,
  fadeIn: () => fadeIn,
  fadeInDown: () => fadeInDown,
  fadeInDownBig: () => fadeInDownBig,
  fadeInLeft: () => fadeInLeft,
  fadeInLeftBig: () => fadeInLeftBig,
  fadeInRight: () => fadeInRight,
  fadeInRightBig: () => fadeInRightBig,
  fadeInUp: () => fadeInUp,
  fadeInUpBig: () => fadeInUpBig,
  fadeOut: () => fadeOut,
  fadeOutDown: () => fadeOutDown,
  fadeOutDownBig: () => fadeOutDownBig,
  fadeOutLeft: () => fadeOutLeft,
  fadeOutLeftBig: () => fadeOutLeftBig,
  fadeOutRight: () => fadeOutRight,
  fadeOutRightBig: () => fadeOutRightBig,
  fadeOutUp: () => fadeOutUp,
  fadeOutUpBig: () => fadeOutUpBig,
  flash: () => flash,
  flipInX: () => flipInX,
  flipInY: () => flipInY,
  flipOutX: () => flipOutX,
  flipOutY: () => flipOutY,
  jello: () => jello,
  lightSpeedIn: () => lightSpeedIn,
  lightSpeedOut: () => lightSpeedOut,
  pulse: () => pulse,
  rotate: () => rotate,
  rubberBand: () => rubberBand,
  shake: () => shake,
  slideInDown: () => slideInDown,
  slideInLeft: () => slideInLeft,
  slideInRight: () => slideInRight,
  slideInUp: () => slideInUp,
  slideOutDown: () => slideOutDown,
  slideOutLeft: () => slideOutLeft,
  slideOutRight: () => slideOutRight,
  slideOutUp: () => slideOutUp,
  swing: () => swing,
  tada: () => tada,
  wobble: () => wobble,
  zoomIn: () => zoomIn,
  zoomInDown: () => zoomInDown,
  zoomInLeft: () => zoomInLeft,
  zoomInRight: () => zoomInRight,
  zoomInUp: () => zoomInUp,
  zoomOut: () => zoomOut,
  zoomOutDown: () => zoomOutDown,
  zoomOutLeft: () => zoomOutLeft,
  zoomOutRight: () => zoomOutRight,
  zoomOutUp: () => zoomOutUp
});

// node_modules/react-native-animatable/definitions/attention-seekers.js
var bounce = {
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
var flash = {
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
var jello = {
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
var pulse = {
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
var rotate = {
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
var shake = {
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
var swing = {
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
var rubberBand = {
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
var tada = {
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
var wobble = {
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
var bounceIn = {
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
var bounceInUp = {
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
var bounceInDown = {
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
var bounceInRight = {
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
var bounceInLeft = {
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
var bounceOut = {
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
var bounceOutUp = {
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
var bounceOutDown = {
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
var bounceOutRight = {
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
var bounceOutLeft = {
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
function makeFadeInTranslation(translationType, fromValue) {
  return {
    from: {
      opacity: 0,
      [translationType]: fromValue
    },
    to: {
      opacity: 1,
      [translationType]: 0
    }
  };
}
var fadeIn = {
  from: {
    opacity: 0
  },
  to: {
    opacity: 1
  }
};
var fadeInDown = makeFadeInTranslation("translateY", -100);
var fadeInUp = makeFadeInTranslation("translateY", 100);
var fadeInLeft = makeFadeInTranslation("translateX", -100);
var fadeInRight = makeFadeInTranslation("translateX", 100);
var fadeInDownBig = makeFadeInTranslation("translateY", -500);
var fadeInUpBig = makeFadeInTranslation("translateY", 500);
var fadeInLeftBig = makeFadeInTranslation("translateX", -500);
var fadeInRightBig = makeFadeInTranslation("translateX", 500);

// node_modules/react-native-animatable/definitions/fading-exits.js
function makeFadeOutTranslation(translationType, toValue) {
  return {
    from: {
      opacity: 1,
      [translationType]: 0
    },
    to: {
      opacity: 0,
      [translationType]: toValue
    }
  };
}
var fadeOut = {
  from: {
    opacity: 1
  },
  to: {
    opacity: 0
  }
};
var fadeOutDown = makeFadeOutTranslation("translateY", 100);
var fadeOutUp = makeFadeOutTranslation("translateY", -100);
var fadeOutLeft = makeFadeOutTranslation("translateX", -100);
var fadeOutRight = makeFadeOutTranslation("translateX", 100);
var fadeOutDownBig = makeFadeOutTranslation("translateY", 500);
var fadeOutUpBig = makeFadeOutTranslation("translateY", -500);
var fadeOutLeftBig = makeFadeOutTranslation("translateX", -500);
var fadeOutRightBig = makeFadeOutTranslation("translateX", 500);

// node_modules/react-native-animatable/definitions/flippers.js
var flipInX = {
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
var flipInY = {
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
var flipOutX = {
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
var flipOutY = {
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
var lightSpeedIn = {
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
var lightSpeedOut = {
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
function makeSlideInTranslation(translationType, fromValue) {
  return {
    from: {
      [translationType]: fromValue
    },
    to: {
      [translationType]: 0
    }
  };
}
var slideInDown = makeSlideInTranslation("translateY", -100);
var slideInUp = makeSlideInTranslation("translateY", 100);
var slideInLeft = makeSlideInTranslation("translateX", -100);
var slideInRight = makeSlideInTranslation("translateX", 100);

// node_modules/react-native-animatable/definitions/sliding-exits.js
function makeSlideOutTranslation(translationType, fromValue) {
  return {
    from: {
      [translationType]: 0
    },
    to: {
      [translationType]: fromValue
    }
  };
}
var slideOutDown = makeSlideOutTranslation("translateY", 100);
var slideOutUp = makeSlideOutTranslation("translateY", -100);
var slideOutLeft = makeSlideOutTranslation("translateX", -100);
var slideOutRight = makeSlideOutTranslation("translateX", 100);

// node_modules/react-native-animatable/definitions/zooming-entrances.js
import { Easing as Easing3 } from "react-native";
function makeZoomInTranslation(translationType, pivotPoint) {
  const modifier = Math.min(1, Math.max(-1, pivotPoint));
  return {
    easing: Easing3.bezier(0.175, 0.885, 0.32, 1),
    0: {
      opacity: 0,
      scale: 0.1,
      [translationType]: modifier * -1e3
    },
    0.6: {
      opacity: 1,
      scale: 0.457,
      [translationType]: pivotPoint
    },
    1: {
      scale: 1,
      [translationType]: 0
    }
  };
}
var zoomIn = {
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
var zoomInDown = makeZoomInTranslation("translateY", 60);
var zoomInUp = makeZoomInTranslation("translateY", -60);
var zoomInLeft = makeZoomInTranslation("translateX", 10);
var zoomInRight = makeZoomInTranslation("translateX", -10);

// node_modules/react-native-animatable/definitions/zooming-exits.js
import { Easing as Easing4 } from "react-native";
function makeZoomOutTranslation(translationType, pivotPoint) {
  const modifier = Math.min(1, Math.max(-1, pivotPoint));
  return {
    easing: Easing4.bezier(0.175, 0.885, 0.32, 1),
    0: {
      opacity: 1,
      scale: 1,
      [translationType]: 0
    },
    0.4: {
      opacity: 1,
      scale: 0.457,
      [translationType]: pivotPoint
    },
    1: {
      opacity: 0,
      scale: 0.1,
      [translationType]: modifier * -1e3
    }
  };
}
var zoomOut = {
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
var zoomOutDown = makeZoomOutTranslation("translateY", 60);
var zoomOutUp = makeZoomOutTranslation("translateY", -60);
var zoomOutLeft = makeZoomOutTranslation("translateX", 10);
var zoomOutRight = makeZoomOutTranslation("translateX", -10);

// node_modules/react-native-animatable/index.js
initializeRegistryWithDefinitions(definitions_exports);
var View = createAnimatableComponent(CoreView);
var Text = createAnimatableComponent(CoreText);
var Image = createAnimatableComponent(CoreImage);
export {
  Text as AnimatableText
};
//# sourceMappingURL=text-animation.js.map
