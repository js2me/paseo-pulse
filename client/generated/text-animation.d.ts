import { ClassicComponentClass, Component } from 'react';
import { ImageStyle, NativeMethods, TextProps, TextStyle, ViewStyle } from 'react-native';

type EasingFunction = {
	(t: number): number;
};
type Easing = "linear" | "ease" | "ease-in" | "ease-out" | "ease-in-out" | "ease-in-cubic" | "ease-out-cubic" | "ease-in-out-cubic" | "ease-in-circ" | "ease-out-circ" | "ease-in-out-circ" | "ease-in-expo" | "ease-out-expo" | "ease-in-out-expo" | "ease-in-quad" | "ease-out-quad" | "ease-in-out-quad" | "ease-in-quart" | "ease-out-quart" | "ease-in-out-quart" | "ease-in-quint" | "ease-out-quint" | "ease-in-out-quint" | "ease-in-sine" | "ease-out-sine" | "ease-in-out-sine" | "ease-in-back" | "ease-out-back" | "ease-in-out-back" | EasingFunction;
type Animation = "bounce" | "flash" | "jello" | "pulse" | "rotate" | "rubberBand" | "shake" | "swing" | "tada" | "wobble" | "bounceIn" | "bounceInDown" | "bounceInUp" | "bounceInLeft" | "bounceInRight" | "bounceOut" | "bounceOutDown" | "bounceOutUp" | "bounceOutLeft" | "bounceOutRight" | "fadeIn" | "fadeInDown" | "fadeInDownBig" | "fadeInUp" | "fadeInUpBig" | "fadeInLeft" | "fadeInLeftBig" | "fadeInRight" | "fadeInRightBig" | "fadeOut" | "fadeOutDown" | "fadeOutDownBig" | "fadeOutUp" | "fadeOutUpBig" | "fadeOutLeft" | "fadeOutLeftBig" | "fadeOutRight" | "fadeOutRightBig" | "flipInX" | "flipInY" | "flipOutX" | "flipOutY" | "lightSpeedIn" | "lightSpeedOut" | "slideInDown" | "slideInUp" | "slideInLeft" | "slideInRight" | "slideOutDown" | "slideOutUp" | "slideOutLeft" | "slideOutRight" | "zoomIn" | "zoomInDown" | "zoomInUp" | "zoomInLeft" | "zoomInRight" | "zoomOut" | "zoomOutDown" | "zoomOutUp" | "zoomOutLeft" | "zoomOutRight";
type Direction = "normal" | "reverse" | "alternate" | "alternate-reverse";
type TransformKeys = "perspective" | "rotate" | "rotateX" | "rotateY" | "rotateZ" | "scale" | "scaleX" | "scaleY" | "translateX" | "translateY" | "skewX" | "skewY" | "matrix";
interface AnimatableProps<S extends {}> {
	animation?: Animation | string | CustomAnimation;
	duration?: number;
	delay?: number;
	direction?: Direction;
	easing?: Easing;
	iterationCount?: number | "infinite";
	iterationDelay?: number;
	transition?: (keyof S | TransformKeys) | ReadonlyArray<keyof S | TransformKeys>;
	useNativeDriver?: boolean;
	isInteraction?: boolean;
	onAnimationBegin?: Function;
	onAnimationEnd?: Function;
	onTransitionBegin?: (property: string) => void;
	onTransitionEnd?: (property: string) => void;
}
type AnimatableAnimationMethods = Partial<{
	[k in Animation]: (duration?: number) => Promise<{
		finished: boolean;
	}>;
}>;
interface AnimatableComponent<P extends {}, S extends {}> extends NativeMethods, AnimatableAnimationMethods, Component, ClassicComponentClass<AnimatableProps<S> & P> {
	refs: {
		[key: string]: Component<P, S>;
	};
	stopAnimation(): void;
	animate(animation: Animation | CustomAnimation, duration?: number, iterationDelay?: number): Promise<void>;
	transition<T extends S>(fromValues: T, toValues: T, duration?: number, easing?: Easing): void;
	transitionTo<T extends S>(toValues: T, duration?: number, easing?: Easing): void;
}
interface CustomAnimation<T = TextStyle & ViewStyle & ImageStyle> {
	from?: T;
	to?: T;
	style?: T;
	easing?: Easing;
	[progress: number]: T;
}
declare const Text$1: AnimatableComponent<TextProps, TextStyle>;
type Text$1 = AnimatableComponent<TextProps, TextStyle>;

export {
	Text$1 as AnimatableText,
};

export {};
