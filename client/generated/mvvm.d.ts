import * as React$1 from 'react';

interface Lambda {
	(): void;
	name?: string;
}
type ClassAccessorDecorator<This = any, Value = any> = (value: ClassAccessorDecoratorTarget<This, Value>, context: ClassAccessorDecoratorContext) => ClassAccessorDecoratorResult<This, Value> | void;
type ClassGetterDecorator<This = any, Value = any> = (value: (this: This) => Value, context: ClassGetterDecoratorContext) => ((this: This) => Value) | void;
type ClassMethodDecorator<This = any, Value extends (...p: any[]) => any = any> = (value: Value, context: ClassMethodDecoratorContext<This, Value>) => Value | void;
type ClassFieldDecorator<This = any, Value extends (...p: any[]) => any = any> = (value: Value, context: ClassFieldDecoratorContext<This, Value>) => Value | void;
declare const $mobx: unique symbol;
interface IAtom extends IObservable {
	reportObserved(): boolean;
	reportChanged(): void;
}
declare class Atom implements IAtom {
	name_: string;
	private static readonly isBeingObservedMask_;
	private static readonly isPendingUnobservationMask_;
	private static readonly diffValueMask_;
	private flags_;
	observers_: Set<IDerivation>;
	lastAccessedBy_: number;
	lowestObserverState_: IDerivationState_;
	/**
	 * Create a new atom. For debugging purposes it is recommended to give it a name.
	 * The onBecomeObserved and onBecomeUnobserved callbacks can be used for resource management.
	 */
	constructor(name_?: string);
	get isBeingObserved(): boolean;
	set isBeingObserved(newValue: boolean);
	get isPendingUnobservation(): boolean;
	set isPendingUnobservation(newValue: boolean);
	get diffValue(): 0 | 1;
	set diffValue(newValue: 0 | 1);
	onBOL: Set<Lambda> | undefined;
	onBUOL: Set<Lambda> | undefined;
	onBO(): void;
	onBUO(): void;
	/**
	 * Invoke this method to notify mobx that your atom has been used somehow.
	 * Returns true if there is currently a reactive context.
	 */
	reportObserved(): boolean;
	/**
	 * Invoke this method _after_ this method has changed to signal mobx that all its observers should invalidate.
	 */
	reportChanged(): void;
	toString(): string;
}
interface IEqualsComparer<T> {
	(a: T, b: T): boolean;
}
declare function identityComparer(a: any, b: any): boolean;
declare function structuralComparer(a: any, b: any): boolean;
declare function shallowComparer(a: any, b: any): boolean;
declare function defaultComparer(a: any, b: any): boolean;
export declare const comparer: {
	identity: typeof identityComparer;
	structural: typeof structuralComparer;
	default: typeof defaultComparer;
	shallow: typeof shallowComparer;
};
interface IEnhancer<T> {
	(newValue: T, oldValue: T | undefined, name: string): T;
}
interface GenericAbortSignal {
	readonly aborted: boolean;
	onabort?: ((...args: any) => any) | null;
	addEventListener?: (...args: any) => any;
	removeEventListener?: (...args: any) => any;
}
type CreateObservableOptions = {
	name?: string;
	equals?: IEqualsComparer<any>;
	deep?: boolean;
	defaultDecorator?: Annotation;
	proxy?: boolean;
	autoBind?: boolean;
};
interface IObservableValueFactory {
	<T>(value: T, options?: CreateObservableOptions): IObservableValue<T>;
	<T>(value?: T, options?: CreateObservableOptions): IObservableValue<T | undefined>;
}
interface IObservableMapFactory {
	<K = any, V = any>(): ObservableMap<K, V>;
	<K, V>(initialValues?: IMapEntries<K, V>, options?: CreateObservableOptions): ObservableMap<K, V>;
	<K, V>(initialValues?: IReadonlyMapEntries<K, V>, options?: CreateObservableOptions): ObservableMap<K, V>;
	<K, V>(initialValues?: IKeyValueMap<V>, options?: CreateObservableOptions): ObservableMap<K, V>;
	<K, V>(initialValues?: Map<K, V>, options?: CreateObservableOptions): ObservableMap<K, V>;
	<K = any, V = any>(initialValues: undefined, options?: CreateObservableOptions): ObservableMap<K, V>;
}
interface IObservableFactory extends Annotation, PropertyDecorator, ClassAccessorDecorator, ClassFieldDecorator {
	<T = any>(value: T[], options?: CreateObservableOptions): IObservableArray<T>;
	<T = any>(value: Set<T>, options?: CreateObservableOptions): ObservableSet<T>;
	<K = any, V = any>(value: Map<K, V>, options?: CreateObservableOptions): ObservableMap<K, V>;
	<T extends object>(value: T, decorators?: AnnotationsMap<T, never>, options?: CreateObservableOptions): T;
	box: IObservableValueFactory;
	array: <T = any>(initialValues?: T[], options?: CreateObservableOptions) => IObservableArray<T>;
	set: <T = any>(initialValues?: IObservableSetInitialValues<T>, options?: CreateObservableOptions) => ObservableSet<T>;
	map: IObservableMapFactory;
	object: <T = any>(props: T, decorators?: AnnotationsMap<T, never>, options?: CreateObservableOptions) => T;
	/**
	 * Decorator that creates an observable that only observes the references, but doesn't try to turn the assigned value into an observable.ts.
	 */
	ref: Annotation & PropertyDecorator & ClassAccessorDecorator & ClassFieldDecorator;
	/**
	 * Decorator that creates an observable converts its value (objects, maps or arrays) into a shallow observable structure
	 */
	shallow: Annotation & PropertyDecorator & ClassAccessorDecorator & ClassFieldDecorator;
	deep: Annotation & PropertyDecorator & ClassAccessorDecorator & ClassFieldDecorator;
	struct: Annotation & PropertyDecorator & ClassAccessorDecorator & ClassFieldDecorator;
}
export declare var observable: IObservableFactory;
interface IComputedFactory extends Annotation, PropertyDecorator, ClassGetterDecorator {
	<T>(options: IComputedValueOptions<T>): Annotation & PropertyDecorator & ClassGetterDecorator;
	<T>(func: () => T, options?: IComputedValueOptions<T>): IComputedValue<T>;
	struct: Annotation & PropertyDecorator & ClassGetterDecorator;
}
/**
 * Decorator for class properties: @computed get value() { return expr; }.
 * For legacy purposes also invokable as ES5 observable created: `computed(() => expr)`;
 */
export declare const computed: IComputedFactory;
interface IValueWillChange<T> {
	object: IObservableValue<T>;
	type: "update";
	newValue: T;
}
type IValueDidChange<T = any> = {
	type: "update";
	observableKind: "value";
	object: IObservableValue<T>;
	debugObjectName: string;
	newValue: T;
	oldValue: T | undefined;
};
interface IObservableValue<T> {
	get(): T;
	set(value: T): void;
}
declare class ObservableValue<T> extends Atom implements IObservableValue<T>, IInterceptable<IValueWillChange<T>>, IListenable {
	enhancer: IEnhancer<T>;
	name_: string;
	private equals;
	hasUnreportedChange_: boolean;
	interceptors_: any;
	changeListeners_: any;
	value_: any;
	dehancer: any;
	constructor(value: T, enhancer: IEnhancer<T>, name_?: string, notifySpy?: boolean, equals?: IEqualsComparer<any>);
	private dehanceValue;
	set(newValue: T): void;
	private prepareNewValue_;
	setNewValue_(newValue: T): void;
	get(): T;
	intercept_(handler: IInterceptor<IValueWillChange<T>>): Lambda;
	observe_(listener: (change: IValueDidChange<T>) => void, fireImmediately?: boolean): Lambda;
	raw(): any;
	toJSON(): T;
	toString(): string;
	valueOf(): T;
	[Symbol.toPrimitive](): T;
}
interface IComputedValue<T> {
	get(): T;
	set(value: T): void;
}
interface IComputedValueOptions<T> {
	get?: () => T;
	set?: (value: T) => void;
	name?: string;
	equals?: IEqualsComparer<T>;
	context?: any;
	requiresReaction?: boolean;
	keepAlive?: boolean;
}
type IComputedDidChange<T = any> = {
	type: "update";
	observableKind: "computed";
	object: unknown;
	debugObjectName: string;
	newValue: T;
	oldValue: T | undefined;
};
declare class ComputedValue<T> implements IObservable, IComputedValue<T>, IDerivation {
	dependenciesState_: IDerivationState_;
	observing_: IObservable[];
	newObserving_: null;
	observers_: Set<IDerivation>;
	runId_: number;
	lastAccessedBy_: number;
	lowestObserverState_: IDerivationState_;
	unboundDepsCount_: number;
	protected value_: T | undefined | CaughtException;
	name_: string;
	triggeredBy_?: string;
	private static readonly isComputingMask_;
	private static readonly isRunningSetterMask_;
	private static readonly isBeingObservedMask_;
	private static readonly isPendingUnobservationMask_;
	private static readonly diffValueMask_;
	private flags_;
	derivation: () => T;
	setter_?: (value: T) => void;
	isTracing_: TraceMode;
	scope_: Object | undefined;
	private equals_;
	private requiresReaction_;
	keepAlive_: boolean;
	/**
	 * Create a new computed value based on a function expression.
	 *
	 * The `name` property is for debug purposes only.
	 *
	 * The `equals` property specifies the comparer function to use to determine if a newly produced
	 * value differs from the previous value. Two comparers are provided in the library; `defaultComparer`
	 * compares based on identity comparison (===), and `structuralComparer` deeply compares the structure.
	 * Structural comparison can be convenient if you always produce a new aggregated object and
	 * don't want to notify observers if it is structurally the same.
	 * This is useful for working with vectors, mouse coordinates etc.
	 */
	constructor(options: IComputedValueOptions<T>);
	onBecomeStale_(): void;
	onBOL: Set<Lambda> | undefined;
	onBUOL: Set<Lambda> | undefined;
	onBO(): void;
	onBUO(): void;
	private get isComputing();
	private set isComputing(value);
	private get isRunningSetter();
	private set isRunningSetter(value);
	get isBeingObserved(): boolean;
	set isBeingObserved(newValue: boolean);
	get isPendingUnobservation(): boolean;
	set isPendingUnobservation(newValue: boolean);
	get diffValue(): 0 | 1;
	set diffValue(newValue: 0 | 1);
	/**
	 * Returns the current value of this computed value.
	 * Will evaluate its computation first if needed.
	 */
	get(): T;
	set(value: T): void;
	trackAndCompute(): boolean;
	computeValue_(track: boolean): T | CaughtException;
	suspend_(): void;
	observe_(listener: (change: IComputedDidChange<T>) => void, fireImmediately?: boolean): Lambda;
	warnAboutUntrackedRead_(): void;
	toString(): string;
	valueOf(): T;
	[Symbol.toPrimitive](): T;
}
declare enum IDerivationState_ {
	NOT_TRACKING_ = -1,
	UP_TO_DATE_ = 0,
	POSSIBLY_STALE_ = 1,
	STALE_ = 2
}
declare enum TraceMode {
	NONE = 0,
	LOG = 1,
	BREAK = 2
}
interface IDerivation extends IDepTreeNode {
	observing_: IObservable[];
	newObserving_: null | IObservable[];
	dependenciesState_: IDerivationState_;
	/**
	 * Id of the current run of a derivation. Each time the derivation is tracked
	 * this number is increased by one. This number is globally unique
	 */
	runId_: number;
	/**
	 * amount of dependencies used by the derivation in this run, which has not been bound yet.
	 */
	unboundDepsCount_: number;
	onBecomeStale_(): void;
	isTracing_: TraceMode;
	/**
	 *  warn if the derivation has no dependencies after creation/update
	 */
	requiresObservable_?: boolean;
}
declare class CaughtException {
	cause: any;
	constructor(cause: any);
}
interface IDepTreeNode {
	name_: string;
	observing_?: IObservable[];
}
interface IObservable extends IDepTreeNode {
	diffValue: number;
	/**
	 * Id of the derivation *run* that last accessed this observable.
	 * If this id equals the *run* id of the current derivation,
	 * the dependency is already established
	 */
	lastAccessedBy_: number;
	isBeingObserved: boolean;
	lowestObserverState_: IDerivationState_;
	isPendingUnobservation: boolean;
	observers_: Set<IDerivation>;
	onBUO(): void;
	onBO(): void;
	onBUOL: Set<Lambda> | undefined;
	onBOL: Set<Lambda> | undefined;
}
interface IReactionPublic {
	dispose(): void;
	trace(enterBreakPoint?: boolean): void;
}
interface IReactionDisposer {
	(): void;
	[$mobx]: Reaction;
}
declare class Reaction implements IDerivation, IReactionPublic {
	name_: string;
	private onInvalidate_;
	private errorHandler_?;
	requiresObservable_?: any;
	observing_: IObservable[];
	newObserving_: IObservable[];
	dependenciesState_: IDerivationState_;
	runId_: number;
	unboundDepsCount_: number;
	private static readonly isDisposedMask_;
	private static readonly isScheduledMask_;
	private static readonly isTrackPendingMask_;
	private static readonly isRunningMask_;
	private static readonly diffValueMask_;
	private flags_;
	isTracing_: TraceMode;
	constructor(name_: string | undefined, onInvalidate_: () => void, errorHandler_?: ((error: any, derivation: IDerivation) => void) | undefined, requiresObservable_?: any);
	get isDisposed(): boolean;
	set isDisposed(newValue: boolean);
	get isScheduled(): boolean;
	set isScheduled(newValue: boolean);
	get isTrackPending(): boolean;
	set isTrackPending(newValue: boolean);
	get isRunning(): boolean;
	set isRunning(newValue: boolean);
	get diffValue(): 0 | 1;
	set diffValue(newValue: 0 | 1);
	onBecomeStale_(): void;
	schedule_(): void;
	/**
	 * internal, use schedule() if you intend to kick off a reaction
	 */
	runReaction_(): void;
	track(fn: () => void): void;
	reportExceptionInDerivation_(error: any): void;
	dispose(): void;
	getDisposer_(abortSignal?: GenericAbortSignal): IReactionDisposer;
	toString(): string;
	trace(enterBreakPoint?: boolean): void;
}
type IObjectDidChange<T = any> = {
	observableKind: "object";
	name: PropertyKey;
	object: T;
	debugObjectName: string;
} & ({
	type: "add";
	newValue: any;
} | {
	type: "update";
	oldValue: any;
	newValue: any;
} | {
	type: "remove";
	oldValue: any;
});
type IObjectWillChange<T = any> = {
	object: T;
	type: "update" | "add";
	name: PropertyKey;
	newValue: any;
} | {
	object: T;
	type: "remove";
	name: PropertyKey;
};
declare class ObservableObjectAdministration implements IInterceptable<IObjectWillChange>, IListenable {
	target_: any;
	values_: Map<PropertyKey, ComputedValue<any> | ObservableValue<any>>;
	name_: string;
	defaultAnnotation_: Annotation;
	keysAtom_: IAtom;
	changeListeners_: any;
	interceptors_: any;
	proxy_: any;
	isPlainObject_: boolean;
	appliedAnnotations_?: object;
	private pendingKeys_;
	lazyComputedKeys_: undefined | Map<PropertyKey, () => ComputedValue<any>>;
	lazyObservableKeys_: undefined | Map<PropertyKey, () => ObservableValue<any>>;
	constructor(target_: any, values_: Map<PropertyKey, ComputedValue<any> | ObservableValue<any>> | undefined, name_: string, defaultAnnotation_?: Annotation);
	getObservablePropValue_(key: PropertyKey): any;
	materializeLazyComputed_(key: PropertyKey): ComputedValue<any> | undefined;
	materializeLazyObservable_(key: PropertyKey): ObservableValue<any> | undefined;
	setObservablePropValue_(key: PropertyKey, newValue: any): boolean | null;
	get_(key: PropertyKey): any;
	/**
	 * @param {PropertyKey} key
	 * @param {any} value
	 * @param {Annotation|boolean} annotation true - use default annotation, false - copy as is
	 * @param {boolean} proxyTrap whether it's called from proxy trap
	 * @returns {boolean|null} true on success, false on failure (proxyTrap + non-configurable), null when cancelled by interceptor
	 */
	set_(key: PropertyKey, value: any, proxyTrap?: boolean): boolean | null;
	has_(key: PropertyKey): boolean;
	/**
	 * @param {PropertyKey} key
	 * @param {Annotation|boolean} annotation true - use default annotation, false - ignore prop
	 */
	make_(key: PropertyKey, annotation: Annotation | boolean): void;
	/**
	 * @param {PropertyKey} key
	 * @param {PropertyDescriptor} descriptor
	 * @param {Annotation|boolean} annotation true - use default annotation, false - copy as is
	 * @param {boolean} proxyTrap whether it's called from proxy trap
	 * @returns {boolean|null} true on success, false on failure (proxyTrap + non-configurable), null when cancelled by interceptor
	 */
	extend_(key: PropertyKey, descriptor: PropertyDescriptor, annotation: Annotation | boolean, proxyTrap?: boolean): boolean | null;
	/**
	 * @param {PropertyKey} key
	 * @param {PropertyDescriptor} descriptor
	 * @param {boolean} proxyTrap whether it's called from proxy trap
	 * @returns {boolean|null} true on success, false on failure (proxyTrap + non-configurable), null when cancelled by interceptor
	 */
	defineProperty_(key: PropertyKey, descriptor: PropertyDescriptor, proxyTrap?: boolean): boolean | null;
	defineObservableProperty_(key: PropertyKey, value: any, enhancer: IEnhancer<any>, proxyTrap?: boolean): boolean | null;
	defineComputedProperty_(key: PropertyKey, options: IComputedValueOptions<any>, proxyTrap?: boolean): boolean | null;
	/**
	 * @param {PropertyKey} key
	 * @param {PropertyDescriptor} descriptor
	 * @param {boolean} proxyTrap whether it's called from proxy trap
	 * @returns {boolean|null} true on success, false on failure (proxyTrap + non-configurable), null when cancelled by interceptor
	 */
	delete_(key: PropertyKey, proxyTrap?: boolean): boolean | null;
	/**
	 * Observes this object. Triggers for the events 'add', 'update' and 'delete'.
	 * See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/observe
	 * for callback details
	 */
	observe_(callback: (changes: IObjectDidChange) => void, fireImmediately?: boolean): Lambda;
	intercept_(handler: any): Lambda;
	notifyPropertyAddition_(key: PropertyKey, value: any): void;
	ownKeys_(): Array<string | symbol>;
	keys_(): PropertyKey[];
}
interface IObservableArray<T = any> extends Array<T> {
	spliceWithArray(index: number, deleteCount?: number, newItems?: T[]): T[];
	clear(): T[];
	replace(newItems: T[]): T[];
	remove(value: T): boolean;
	toJSON(): T[];
}
interface IActionFactory extends Annotation, PropertyDecorator, ClassMethodDecorator, ClassFieldDecorator {
	<T extends Function | undefined | null>(fn: T): T;
	<T extends Function | undefined | null>(name: string, fn: T): T;
	(customName: string): PropertyDecorator & Annotation & ClassMethodDecorator & ClassFieldDecorator;
	bound: Annotation & PropertyDecorator & ClassMethodDecorator & ClassFieldDecorator;
}
export declare const action: IActionFactory;
export declare function runInAction<T>(fn: () => T): T;
interface IAutorunOptions {
	delay?: number;
	name?: string;
	/**
	 * Experimental.
	 * Warns if the view doesn't track observables
	 */
	requiresObservable?: boolean;
	scheduler?: (callback: () => void) => any;
	onError?: (error: any) => void;
	signal?: GenericAbortSignal;
}
type IReactionOptions<T, FireImmediately extends boolean> = IAutorunOptions & {
	fireImmediately?: FireImmediately;
	equals?: IEqualsComparer<T>;
};
export declare function reaction<T, FireImmediately extends boolean = false>(expression: (r: IReactionPublic) => T, effect: (arg: T, prev: FireImmediately extends true ? T | undefined : T, r: IReactionPublic) => void, opts?: IReactionOptions<T, FireImmediately>): IReactionDisposer;
type IInterceptor<T> = (change: T) => T | null;
interface IInterceptable<T> {
	interceptors_: IInterceptor<T>[] | undefined;
}
interface IListenable {
	changeListeners_: Function[] | undefined;
}
type NoInfer$1<T> = [
	T
][T extends any ? 0 : never];
type MakeObservableOptions = Omit<CreateObservableOptions, "proxy">;
export declare function makeObservable<T extends object, AdditionalKeys extends PropertyKey = never>(target: T, annotations?: AnnotationsMap<T, NoInfer$1<AdditionalKeys>>, options?: MakeObservableOptions): T;
export declare function makeAutoObservable<T extends object, AdditionalKeys extends PropertyKey = never>(target: T, overrides?: AnnotationsMap<T, NoInfer$1<AdditionalKeys>>, options?: MakeObservableOptions): T;
interface IKeyValueMap<V = any> {
	[key: string]: V;
}
type IMapEntry<K = any, V = any> = [
	K,
	V
];
type IReadonlyMapEntry<K = any, V = any> = readonly [
	K,
	V
];
type IMapEntries<K = any, V = any> = IMapEntry<K, V>[];
type IReadonlyMapEntries<K = any, V = any> = readonly IReadonlyMapEntry<K, V>[];
type IMapDidChange<K = any, V = any> = {
	observableKind: "map";
	debugObjectName: string;
} & ({
	object: ObservableMap<K, V>;
	name: K;
	type: "update";
	newValue: V;
	oldValue: V;
} | {
	object: ObservableMap<K, V>;
	name: K;
	type: "add";
	newValue: V;
} | {
	object: ObservableMap<K, V>;
	name: K;
	type: "delete";
	oldValue: V;
});
interface IMapWillChange<K = any, V = any> {
	object: ObservableMap<K, V>;
	type: "update" | "add" | "delete";
	name: K;
	newValue?: V;
}
type IObservableMapInitialValues<K = any, V = any> = IMapEntries<K, V> | IReadonlyMapEntries<K, V> | IKeyValueMap<V> | Map<K, V>;
declare class ObservableMap<K = any, V = any> implements Map<K, V>, IInterceptable<IMapWillChange<K, V>>, IListenable {
	enhancer_: IEnhancer<V>;
	name_: string;
	[$mobx]: {};
	data_: Map<K, ObservableValue<V>>;
	hasMap_: Map<K, ObservableValue<boolean>>;
	keysAtom_: IAtom;
	interceptors_: any;
	changeListeners_: any;
	dehancer: any;
	constructor(initialData?: IObservableMapInitialValues<K, V>, enhancer_?: IEnhancer<V>, name_?: string);
	private has_;
	has(key: K): boolean;
	set(key: K, value: V): this;
	delete(key: K): boolean;
	private updateValue_;
	private addValue_;
	get(key: K): V | undefined;
	getOrInsert(key: K, value: V): V;
	getOrInsertComputed(key: K, callback: (key: K) => V): V;
	private dehanceValue_;
	keys(): MapIterator<K>;
	values(): MapIterator<V>;
	entries(): MapIterator<IMapEntry<K, V>>;
	[Symbol.iterator](): MapIterator<IMapEntry<K, V>>;
	forEach(callback: (value: V, key: K, object: Map<K, V>) => void, thisArg?: any): void;
	/** Merge another object into this object, returns this. */
	merge(other?: IObservableMapInitialValues<K, V>): ObservableMap<K, V>;
	clear(): void;
	replace(values: IObservableMapInitialValues<K, V>): ObservableMap<K, V>;
	get size(): number;
	toString(): string;
	toJSON(): [
		K,
		V
	][];
	get [Symbol.toStringTag](): string;
	/**
	 * Observes this object. Triggers for the events 'add', 'update' and 'delete'.
	 * See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/observe
	 * for callback details
	 */
	observe_(listener: (changes: IMapDidChange<K, V>) => void, fireImmediately?: boolean): Lambda;
	intercept_(handler: IInterceptor<IMapWillChange<K, V>>): Lambda;
}
type IObservableSetInitialValues<T> = Set<T> | readonly T[];
type ISetDidChange<T = any> = {
	object: ObservableSet<T>;
	observableKind: "set";
	debugObjectName: string;
	type: "add";
	newValue: T;
} | {
	object: ObservableSet<T>;
	observableKind: "set";
	debugObjectName: string;
	type: "delete";
	oldValue: T;
};
type ISetWillDeleteChange<T = any> = {
	type: "delete";
	object: ObservableSet<T>;
	oldValue: T;
};
type ISetWillAddChange<T = any> = {
	type: "add";
	object: ObservableSet<T>;
	newValue: T;
};
type ISetWillChange<T = any> = ISetWillDeleteChange<T> | ISetWillAddChange<T>;
declare class ObservableSet<T = any> implements Set<T>, IInterceptable<ISetWillChange>, IListenable {
	name_: string;
	[$mobx]: {};
	private data_;
	atom_: IAtom;
	changeListeners_: any;
	interceptors_: any;
	dehancer: any;
	enhancer_: (newV: any, oldV: any | undefined) => any;
	constructor(initialData?: IObservableSetInitialValues<T>, enhancer?: IEnhancer<T>, name_?: string);
	private dehanceValue_;
	clear(): void;
	forEach(callbackFn: (value: T, value2: T, set: Set<T>) => void, thisArg?: any): void;
	get size(): number;
	add(value: T): this;
	delete(value: T): boolean;
	has(value: T): boolean;
	entries(): SetIterator<[
		T,
		T
	]>;
	keys(): SetIterator<T>;
	values(): SetIterator<T>;
	intersection<U>(otherSet: ReadonlySetLike<U> | Set<U>): Set<T & U>;
	union<U>(otherSet: ReadonlySetLike<U> | Set<U>): Set<T | U>;
	difference<U>(otherSet: ReadonlySetLike<U>): Set<T>;
	symmetricDifference<U>(otherSet: ReadonlySetLike<U> | Set<U>): Set<T | U>;
	isSubsetOf(otherSet: ReadonlySetLike<unknown>): boolean;
	isSupersetOf(otherSet: ReadonlySetLike<unknown>): boolean;
	isDisjointFrom(otherSet: ReadonlySetLike<unknown> | Set<unknown>): boolean;
	replace(other: ObservableSet<T> | IObservableSetInitialValues<T>): ObservableSet<T>;
	observe_(listener: (changes: ISetDidChange<T>) => void, fireImmediately?: boolean): Lambda;
	intercept_(handler: IInterceptor<ISetWillChange<T>>): Lambda;
	toJSON(): T[];
	toString(): string;
	[Symbol.iterator](): SetIterator<T>;
	get [Symbol.toStringTag](): string;
}
declare const enum MakeResult {
	Cancel = 0,
	Break = 1,
	Continue = 2
}
type Annotation = {
	annotationType_: string;
	make_(adm: ObservableObjectAdministration, key: PropertyKey, descriptor: PropertyDescriptor, source: object): MakeResult;
	extend_(adm: ObservableObjectAdministration, key: PropertyKey, descriptor: PropertyDescriptor, proxyTrap: boolean): boolean | null;
	decorate_20223_(value: any, context: DecoratorContext): any;
	options_?: any;
};
type AnnotationMapEntry = Annotation | true | false;
type AnnotationsMap<T, AdditionalFields extends PropertyKey> = {
	[P in Exclude<keyof T, "toString">]?: AnnotationMapEntry;
} & Record<AdditionalFields, AnnotationMapEntry>;
type Maybe<T> = Nullable<T> | undefined;
type Nullable<T> = T | null;
type AnyObject = Record<keyof any, any>;
type EmptyObject = Record<keyof any, never>;
type Class<T, Args extends any[] = any[]> = new (...args: Args) => T;
type DeepPartial<T> = T extends BrowserNativeObject ? T : {
	[K in keyof T]?: ExtractObjects<T[K]> extends never ? T[K] : DeepPartial<T[K]>;
};
type PartialKeys<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
type IsPartial<T> = keyof T extends never ? true : {
	[K in keyof T]-?: undefined extends T[K] ? never : K;
} extends {
	[K in keyof T]: never;
} ? true : T extends EmptyObject ? true : false;
type BrowserNativeObject = Date | FileList | File | Element | Node;
type ExtractObjects<T> = T extends infer U ? U extends object ? U : never : never;
type MaybePromise<T> = T | Promise<T>;
type Defined<T> = Exclude<T, undefined>;
type HasKey<T, TKey extends string> = string extends keyof T ? false : TKey extends keyof T ? true : false;
type IsAny<T> = 0 extends 1 & T ? true : false;
type IsUnknown<T> = [
	unknown
] extends [
	T
] ? true : false;
type SubFn<PubArgs extends any[] = any[]> = (...args: PubArgs) => void;
interface PubSub<PubArgs extends any[] = any[]> {
	(...args: PubArgs): void;
	/**
	 * Last published arguments
	 */
	lastPub: PubArgs | undefined;
	/**
	 * An array of subscriber functions (sub) that will be called
	 * when an event is published. Each subscriber must match the type SubFn,
	 * taking the arguments that will be passed to it when the publisher calls pub.
	 */
	subs: SubFn<PubArgs>[];
	/**
	 * A function to unsubscribe from events. When a subscriber function (sub) is passed,
	 * it will be removed from the `subs` array, and will no longer receive notifications.
	 */
	unsub(sub: SubFn<PubArgs>): void;
	/**
	 * A function to subscribe to events. When a subscriber function (sub) is passed,
	 * it will be added to the `subs` array, and will receive notifications when the publisher calls pub.
	 * Returns a function that can be used to unsubscribe from events.
	 */
	sub(sub: SubFn<PubArgs>): VoidFunction;
}
type ObservableAnnotationsArray<T extends AnyObject = AnyObject> = [
	AnnotationMapEntry,
	...(keyof T | (string & {}))[]
][];
type InferViewModelParams<T> = T extends ViewModelBase<infer T1, infer T2, infer T3> ? ViewModelParams<T1, T2, T3> : ViewModelParams<{}, null, {}>;
type InferViewModelPayload<T> = InferViewModelParams<T>["payload"];
type InferViewModelProps<T> = Defined<InferViewModelParams<T>["props"]>;
type ViewModelLifecycleState = "init" | "mounting" | "mounted" | "hydrated" | "unmounting" | "unmounted";
interface ViewModelStoreConfig {
	/**
	 * Resource scoped to this store/request.
	 * [**Documentation**](https://js2me.github.io/mobx-view-model/api/view-model-store/interface#resource)
	 */
	resource?: ViewModelResource;
	/**
	 * [**Documentation**](https://js2me.github.io/mobx-view-model/api/view-models/view-models-config)
	 */
	vmConfig?: ViewModelsRawConfig;
}
interface ViewModelGenerateIdConfig<VM extends AnyViewModel | AnyViewModelSimple> {
	VM: Class<VM>;
	/** tree render id (received and generated from view) */
	id: string;
	ctx?: AnyObject;
	parentViewModel?: Maybe<AnyViewModel | AnyViewModelSimple>;
}
interface ViewModelCreateConfig<VM extends AnyViewModel | AnyViewModelSimple> extends ViewModelParams<InferViewModelPayload<VM>, AnyViewModelSimple | AnyViewModel | null, InferViewModelProps<VM>> {
	VM: Class<VM>;
	/**
	 * Additional component anchors for the same VM instance.
	 * useViewModel(AnchorComponent) will return this VM when mounted.
	 */
	anchors?: unknown[];
	factory?: ViewModelsConfig["factory"];
}
interface ViewModelComponentRef<T extends AnyViewModel | AnyViewModelSimple = AnyViewModel | AnyViewModelSimple> {
	readonly $viewModel?: T;
}
type ViewModelLookup<T extends AnyViewModel | AnyViewModelSimple> = AnyViewModel["id"] | Class<T> | ViewModelComponentRef<T>
/** Plain anchor components registered via `anchors` / `connect()` */
 | object;
interface ViewModelStore<VMBase extends AnyViewModel = AnyViewModel> {
	/**
	 * Resource scoped to this store/request, if configured.
	 * [**Documentation**](https://js2me.github.io/mobx-view-model/api/view-model-store/interface#resource)
	 */
	resource?: ViewModelResource;
	/**
	 * Effective merged `ViewModelsConfig` for this store: values from the store constructor are layered over the global defaults (see `ViewModelStoreBase` / `mergeVMConfigs`).
	 * Drives `factory`, lifecycle hooks, and other behavior for view models owned by this store.
	 *
	 * [**Documentation**](https://js2me.github.io/mobx-view-model/api/view-models/view-models-config)
	 */
	vmConfig?: ViewModelsConfig;
	/**
	 * [**Documentation**](https://js2me.github.io/mobx-view-model/api/view-model-store/interface#getids-vmlookup)
	 * @param vmLookup - The ID or class type of the view model. See {@link ViewModelLookup}.
	 * @returns The IDs of the view models
	 */
	getIds<T extends VMBase | AnyViewModelSimple>(vmLookup: Maybe<ViewModelLookup<T>>): string[];
	/**
	 * [**Documentation**](https://js2me.github.io/mobx-view-model/api/view-model-store/interface#getid-vmlookup)
	 * @param vmLookup - The ID or class type of the view model. See {@link ViewModelLookup}.
	 * @returns The ID of the view model, or null if not found.
	 */
	getId<T extends VMBase | AnyViewModelSimple>(vmLookup: Maybe<ViewModelLookup<T>>): string | null;
	/**
	 * [**Documentation**](https://js2me.github.io/mobx-view-model/api/view-model-store/interface#has-vmlookup)
	 * @param vmLookup - The ID or class type of the view model. See {@link ViewModelLookup}.
	 * @returns True if the instance exists, false otherwise.
	 */
	has<T extends VMBase | AnyViewModelSimple>(vmLookup: Maybe<ViewModelLookup<T>>): boolean;
	/**
	 * [**Documentation**](https://js2me.github.io/mobx-view-model/api/view-model-store/interface#get-vmlookup)
	 * @param vmLookup - The ID or class type of the view model. See {@link ViewModelLookup}.
	 * @returns The view model instance, or null if not found.
	 */
	get<T extends VMBase | AnyViewModelSimple>(vmLookup: Maybe<ViewModelLookup<T>>): T | null;
	/**
	 * [**Documentation**](https://js2me.github.io/mobx-view-model/api/view-model-store/interface#getall-vmlookup)
	 * @param vmLookup - The ID or class type of the view model. See {@link ViewModelLookup}.
	 * @returns The view model instance, or null if not found.
	 */
	getAll<T extends VMBase | AnyViewModelSimple>(vmLookup: Maybe<ViewModelLookup<T>>): T[];
	unmount(instance: any): any;
	/**
	 * [**Documentation**](https://js2me.github.io/mobx-view-model/api/view-model-store/interface#createviewmodel-config)
	 * Creates a new view model instance based on the provided configuration.
	 * @param config - The configuration for creating the view model.
	 * @returns The newly created view model instance.
	 */
	create<VM extends VMBase | AnyViewModelSimple>(config: ViewModelCreateConfig<VM>): VM;
	/**
	 * Registers an already created view model using the supplied configuration.
	 * This is primarily intended for integrations that must defer registration
	 * until after a render has committed.
	 */
	connect(instance: AnyViewModel | AnyViewModelSimple, config: ViewModelCreateConfig<any>): void;
	/**
	 * Defines a view model: returns the existing instance if one with the same ID
	 * is already registered, otherwise creates a new instance, connects it to the
	 * store, and returns it.
	 *
	 * This is the recommended way to obtain a VM from the store — it replaces the
	 * manual `generateId` → `get` → `create` → `connect` flow.
	 *
	 * [**Documentation**](https://js2me.github.io/mobx-view-model/api/view-model-store/interface#define)
	 */
	define<VM extends VMBase | AnyViewModelSimple>(config: ViewModelCreateConfig<VM>): VM;
	/**
	 * [**Documentation**](https://js2me.github.io/mobx-view-model/api/view-model-store/interface#link)
	 * Link anchors (React components) with view model class.
	 * @param VM - The view model class to link to.
	 * @param anchors - The anchors to link.
	 */
	link(VM: Class<VMBase>, ...anchors: Maybe<unknown>[]): void;
	/**
	 * [**Documentation**](https://js2me.github.io/mobx-view-model/api/view-model-store/interface#unlink)
	 * Unlink anchors (React components) with view model class.
	 * @param anchors - The anchors to unlink.
	 */
	unlink(...anchors: Maybe<unknown>[]): void;
	/**
	 * [**Documentation**](https://js2me.github.io/mobx-view-model/api/view-model-store/interface#generateid-config)
	 * Generates a unique ID for a view model based on the provided configuration.
	 * @param config - The configuration for generating the ID.
	 * @returns The generated unique ID.
	 */
	generateId<VM extends VMBase>(config: ViewModelGenerateIdConfig<VM>): string;
	/**
	 * [**Documentation**](https://js2me.github.io/mobx-view-model/api/view-model-store/interface#clean)
	 * Clean up resources associated with the view model store.
	 * Clean all inner data structures.
	 */
	clean(): void;
}
interface ViewModelSimple<Payload extends AnyObject = EmptyObject, ParentViewModel extends AnyViewModel | AnyViewModelSimple | null = null> {
	/**
	 * Unique identifier for the view model instance.
	 * If not provided, it will be autogenerated by the library.
	 */
	id?: string;
	/**
	 * Automatically setted by the library.
	 */
	parentViewModel?: ParentViewModel;
	init?(config: ViewModelInitConfig<this>): void;
	mount?(): void;
	unmount?(): void;
	setPayload?(payload: Payload): void;
}
type AnyViewModel = ViewModel<any, any>;
type AnyViewModelSimple = ViewModelSimple<any, AnyViewModel | AnyViewModelSimple | null>;
type PayloadCompareFn<TPayload extends AnyObject = AnyObject> = (currentPayload: TPayload | undefined, nextPayload: TPayload) => boolean;
export interface ViewModelParams<Payload extends AnyObject = EmptyObject, ParentViewModel extends AnyViewModel | AnyViewModelSimple | null = null, ComponentProps extends AnyObject = AnyObject> {
	/**
	 * Unique identifier for the view
	 */
	id: string;
	payload: Payload;
	viewModels?: Maybe<ViewModelStore>;
	parentViewModel?: Maybe<ParentViewModel>;
	/**
	 * Additional data that may be useful when creating the VM
	 */
	ctx?: AnyObject;
	/**
	 * Additional configuration for the view model
	 * See {@link ViewModelsConfig}
	 * [**Documentation**](https://js2me.github.io/mobx-view-model/api/view-models/view-models-config)
	 */
	vmConfig?: ViewModelsRawConfig;
	/**
	 * Original component props
	 */
	props?: ComponentProps;
	/** Data resolved by the store resource for this VM id. */
	data?: any;
}
type ViewModelInitConfig<VM extends AnyViewModel | AnyViewModelSimple> = ViewModelCreateConfig<VM> & {
	viewModels?: ViewModelStore;
};
interface ViewModelInfo {
	/** [**Documentation**](https://js2me.github.io/mobx-view-model/api/view-models/interface#vm-state-viewmodellifecyclestate) */
	state: ViewModelLifecycleState;
	data: any;
}
interface ViewModel<Payload extends AnyObject = EmptyObject, ParentViewModel extends AnyViewModel | AnyViewModelSimple | null = null> {
	/** [**Documentation**](https://js2me.github.io/mobx-view-model/api/view-models/interface#vm-viewmodelinfo) */
	readonly vm: ViewModelInfo;
	/** [**Documentation**](https://js2me.github.io/mobx-view-model/api/view-models/interface#id-string) */
	readonly id: string;
	/** [**Documentation**](https://js2me.github.io/mobx-view-model/api/view-models/interface#payload-payload) */
	readonly payload: Payload;
	/** [**Documentation**](https://js2me.github.io/mobx-view-model/api/view-models/interface#ismounted-boolean) */
	readonly isMounted: boolean;
	/** [**Documentation**](https://js2me.github.io/mobx-view-model/api/view-models/interface#ishydrated-boolean) */
	readonly isHydrated: boolean;
	/** [**Documentation**](https://js2me.github.io/mobx-view-model/api/view-models/interface#parentviewmodel-parentviewmodel-null) */
	readonly parentViewModel: ParentViewModel;
	/** [**Documentation**](https://js2me.github.io/mobx-view-model/api/view-models/interface#init) */
	init?(config: ViewModelInitConfig<this>): void;
	/** [**Documentation**](https://js2me.github.io/mobx-view-model/api/view-models/interface#mount-void-promise-void) */
	mount(): MaybePromise<void>;
	/** [**Documentation**](https://js2me.github.io/mobx-view-model/api/view-models/interface#unmount-void-promise-void) */
	unmount(): void;
	/**
	 * [**Documentation**](https://js2me.github.io/mobx-view-model/api/view-models/interface#setpayload-payload-payload-void)
	 *
	 * The React integration may call this on **every render** while the component is mounted in the tree,
	 * including **before** `mount()` has finished (and while `isMounted` is still `false`), so
	 * side effects should not assume a fully mounted view model.
	 */
	setPayload(payload: Payload): boolean;
}
export declare class ViewModelBase<Payload extends AnyObject = EmptyObject, ParentViewModel extends AnyViewModel | AnyViewModelSimple | null = null, ComponentProps extends AnyObject = AnyObject> implements ViewModel<Payload, ParentViewModel> {
	#private;
	private abortController;
	unmountSignal: AbortSignal;
	id: string;
	readonly vm: ViewModelInfo;
	protected props: ComponentProps;
	constructor(params: ViewModelParams<Payload, ParentViewModel, ComponentProps>);
	get payload(): Payload;
	protected get viewModels(): ViewModelStore;
	get isMounted(): boolean;
	get isHydrated(): boolean;
	protected willUnmount(): void;
	/**
	 * Empty method to be overridden
	 */
	protected willMount(): MaybePromise<void>;
	/**
	 * The method is called when the view starts mounting
	 */
	mount(): MaybePromise<void>;
	/**
	 * The method is called when the view was mounted
	 */
	protected didMount(): void;
	/**
	 * The method is called when the view starts unmounting
	 */
	unmount(): void;
	/**
	 * The method is called when the view was unmounted
	 */
	protected didUnmount(): void;
	/**
	 * Checks whether the given view model is a child of the current view model.
	 * When `deep` is `true`, checks the whole parent chain.
	 *
	 * [**Documentation**](https://js2me.github.io/mobx-view-model/api/view-models/base-implementation#haschild-vm-anyviewmodel--anyviewmodelsimple-deep-boolean-boolean)
	 */
	protected hasChild(vm: AnyViewModel | AnyViewModelSimple, deep?: boolean): boolean;
	/**
	 * Checks whether the given view model is a parent of the current view model.
	 * When `deep` is `true`, checks the whole parent chain.
	 *
	 * [**Documentation**](https://js2me.github.io/mobx-view-model/api/view-models/base-implementation#hasparent-vm-anyviewmodel--anyviewmodelsimple-deep-boolean-boolean)
	 */
	protected hasParent(vm: AnyViewModel | AnyViewModelSimple, deep?: boolean): boolean;
	/**
	 * Returns the parent view model
	 */
	get parentViewModel(): ParentViewModel;
	/**
	 * The method is called when the payload changes in the react component
	 */
	setPayload(payload: Payload): boolean;
}
export declare class ViewModelStoreBase<VMBase extends AnyViewModel = AnyViewModel> implements ViewModelStore<VMBase> {
	protected config?: ViewModelStoreConfig | undefined;
	protected viewModels: Map<string, VMBase | AnyViewModelSimple>;
	protected linkedAnchorVMClasses: Map<unknown, Class<VMBase>>;
	protected viewModelIdsByClasses: Map<Class<VMBase> | Class<AnyViewModelSimple>, string[]>;
	vmConfig: ViewModelsConfig;
	resource: ViewModelStoreConfig["resource"];
	constructor(config?: ViewModelStoreConfig | undefined);
	connect(instance: AnyViewModel | AnyViewModelSimple, config: ViewModelCreateConfig<any>): void;
	/**
	 * Defines a view model: returns the existing instance if one with the same ID
	 * is already registered, otherwise creates a new instance, connects it to the
	 * store, and returns it.
	 *
	 * [**Documentation**](https://js2me.github.io/mobx-view-model/api/view-model-store/interface#define)
	 */
	define<VM extends VMBase | AnyViewModelSimple>(config: ViewModelCreateConfig<VM>): VM;
	unmount(instance: VMBase | AnyViewModelSimple): void;
	/**
	 * [**Documentation**](https://js2me.github.io/mobx-view-model/api/view-model-store/interface#createviewmodel-config)
	 * Creates a new view model instance based on the provided configuration.
	 * @param config - The configuration for creating the view model.
	 * @returns The newly created view model instance.
	 */
	create<VM extends VMBase | AnyViewModelSimple>(config: ViewModelCreateConfig<VM>): VM;
	/**
	 * [**Documentation**](https://js2me.github.io/mobx-view-model/api/view-model-store/interface#generateid-config)
	 * Generates a unique ID for a view model based on the provided configuration.
	 * @param config - The configuration for generating the ID.
	 * @returns The generated unique ID.
	 */
	generateId<VM extends VMBase | AnyViewModelSimple>(config: ViewModelGenerateIdConfig<VM>): string;
	/**
	 * [**Documentation**](https://js2me.github.io/mobx-view-model/api/view-model-store/interface#link)
	 * Link anchors (React components) with view model class.
	 * @param VM - The view model class to link to.
	 * @param anchors - The anchors to link.
	 */
	link(VM: Class<VMBase>, ...anchors: Maybe<unknown>[]): void;
	/**
	 * [**Documentation**](https://js2me.github.io/mobx-view-model/api/view-model-store/interface#unlink)
	 * Unlink anchors (React components) with view model class.
	 * @param anchors - The anchors to unlink.
	 */
	unlink(...anchors: Maybe<unknown>[]): void;
	/**
	 * [**Documentation**](https://js2me.github.io/mobx-view-model/api/view-model-store/interface#getids-vmlookup)
	 * @param vmLookup - The ID or class type of the view model. See {@link ViewModelLookup}.
	 * @returns The IDs of the view models
	 */
	getIds<T extends VMBase | AnyViewModelSimple>(vmLookup: Maybe<ViewModelLookup<T>>): string[];
	/**
	 * [**Documentation**](https://js2me.github.io/mobx-view-model/api/view-model-store/interface#getid-vmlookup)
	 * @param vmLookup - The ID or class type of the view model. See {@link ViewModelLookup}.
	 * @returns The ID of the view model, or null if not found.
	 */
	getId<T extends VMBase | AnyViewModelSimple>(vmLookup: Maybe<ViewModelLookup<T>>): string | null;
	/**
	 * [**Documentation**](https://js2me.github.io/mobx-view-model/api/view-model-store/interface#has-vmlookup)
	 * @param vmLookup - The ID or class type of the view model. See {@link ViewModelLookup}.
	 * @returns True if the instance exists, false otherwise.
	 */
	has<T extends VMBase | AnyViewModelSimple>(vmLookup: Maybe<ViewModelLookup<T>>): boolean;
	/**
	 * [**Documentation**](https://js2me.github.io/mobx-view-model/api/view-model-store/interface#get-vmlookup)
	 * @param vmLookup - The ID or class type of the view model. See {@link ViewModelLookup}.
	 * @returns The view model instance, or null if not found.
	 */
	get<T extends VMBase | AnyViewModelSimple>(vmLookup: Maybe<ViewModelLookup<T>>): T | null;
	/**
	 * [**Documentation**](https://js2me.github.io/mobx-view-model/api/view-model-store/interface#getall-vmlookup)
	 * @param vmLookup - The ID or class type of the view model. See {@link ViewModelLookup}.
	 * @returns All view model instances matching the lookup.
	 */
	getAll<T extends VMBase | AnyViewModelSimple>(vmLookup: Maybe<ViewModelLookup<T>>): T[];
	/**
	 * Indexes the instance id by its class so `get(CartPageVM)` / `useViewModel(CartPageVM)` work.
	 */
	protected attachVMConstructor(model: VMBase | AnyViewModelSimple): void;
	protected dettachVMConstructor(model: VMBase | AnyViewModelSimple): void;
	clean(): void;
}
interface ViewModelObservableConfig {
	/**
	 * [**Documentation**](https://js2me.github.io/mobx-view-model/api/view-models/view-models-config.html#usedecorators)
	 */
	useDecorators: boolean;
	/**
	 * [**Documentation**](https://js2me.github.io/mobx-view-model/api/view-models/view-models-config.html#custom-context-annotationsarray)
	 */
	custom?: (context: AnyObject, annotationsArray: ObservableAnnotationsArray) => void;
}
type CreateViewModelFactoryFn<TViewModel extends AnyViewModel | AnyViewModelSimple = AnyViewModel | AnyViewModelSimple> = (config: ViewModelCreateConfig<TViewModel>) => TViewModel;
interface ViewModelResource<TData = unknown> {
	read(id: string): TData;
}
type PayloadComparator = PayloadCompareFn | "strict" | "shallow" | false;
interface ViewModelsConfig<TViewModel extends AnyViewModel = AnyViewModel> {
	/**
	 * Default resource used when a store does not provide one.
	 * [**Documentation**](https://js2me.github.io/mobx-view-model/api/view-models/view-models-config#resource)
	 */
	resource?: ViewModelResource;
	getPayload: (allProps: any) => any;
	mode: "csr-only" | "ssr";
	/** [**Documentation**](https://js2me.github.io/mobx-view-model/api/view-models/view-models-config#startviewtransitions) */
	startViewTransitions: {
		mount: boolean;
		unmount: boolean;
		payloadChange: boolean;
	};
	/** [**Documentation**](https://js2me.github.io/mobx-view-model/api/view-models/view-models-config#comparepayload) */
	comparePayload?: PayloadComparator;
	/** [**Documentation**](https://js2me.github.io/mobx-view-model/api/view-models/view-models-config#payloadobservable) */
	payloadObservable: "ref" | "deep" | "shallow" | "struct" | false;
	/** [**Documentation**](https://js2me.github.io/mobx-view-model/api/view-models/view-models-config#payloadcomputed) */
	payloadComputed: "struct" | boolean | ((a: any, b: any) => boolean);
	/** [**Documentation**](https://js2me.github.io/mobx-view-model/api/view-models/view-models-config#factory) */
	factory: CreateViewModelFactoryFn<AnyViewModel | AnyViewModelSimple>;
	/** [**Documentation**](https://js2me.github.io/mobx-view-model/api/view-models/view-models-config#fallbackcomponent) */
	fallbackComponent?: unknown;
	/** [**Documentation**](https://js2me.github.io/mobx-view-model/react/api/with-view-model.html#reacthook) */
	reactHook?: (allProps: AnyObject, ctx: AnyObject, viewModels: Maybe<ViewModelStore>, ref?: any) => void;
	/** [**Documentation**](https://js2me.github.io/mobx-view-model/api/view-models/view-models-config#onmount) */
	onMount?: (viewModel: TViewModel) => void;
	/** [**Documentation**](https://js2me.github.io/mobx-view-model/api/view-models/view-models-config#onunmount) */
	onUnmount?: (viewModel: TViewModel) => void;
	/** [**Documentation**](https://js2me.github.io/mobx-view-model/api/view-models/view-models-config#hooks) */
	readonly hooks: {
		/** [**Documentation**](https://js2me.github.io/mobx-view-model/api/view-models/view-models-config#hooks) */
		readonly storeCreate: PubSub<[
			viewModelStore: ViewModelStore<AnyViewModel>
		]>;
	};
	/** [**Documentation**](https://js2me.github.io/mobx-view-model/api/view-models/view-models-config#processviewcomponent) */
	processRender?: (renderFn: ((props: AnyObject) => unknown) | undefined, VM: Class<TViewModel>,
	/** Полный тип HOC — `ViewModelHocConfig` в `mobx-view-model-react`. */
	config: AnyObject) => Maybe<(props: any) => unknown>;
	/** [**Documentation**](https://js2me.github.io/mobx-view-model/api/view-models/view-models-config#observable) */
	observable: {
		viewModels: ViewModelObservableConfig;
		viewModelStores: ViewModelObservableConfig;
	};
}
type ViewModelsRawConfig<TViewModel extends AnyViewModel = AnyViewModel> = PartialKeys<Omit<ViewModelsConfig<TViewModel>, "startViewTransitions" | "observable" | "factory" | "hooks" | "mode" | "getPayload">, "payloadObservable" | "payloadComputed" | "fallbackComponent"> & {
	startViewTransitions?: DeepPartial<ViewModelsConfig["startViewTransitions"]> | boolean;
	observable?: DeepPartial<ViewModelsConfig["observable"]>;
	factory?: ViewModelsConfig["factory"];
};
type RReactNode = React$1.ReactNode;
type RForwardedRef<T> = React$1.ForwardedRef<T>;
type RComponentType<P = {}> = React$1.ComponentType<P>;
type RLegacyRef<T> = React$1.LegacyRef<T>;
type RRenderFn<P = {}> = (props: P) => RReactNode;
interface UseCreateViewModelConfig<TViewModel extends AnyViewModel> extends Pick<ViewModelCreateConfig<TViewModel>, "vmConfig" | "ctx" | "anchors" | "props"> {
	/**
	 * Unique identifier for the view
	 *
	 * [**Documentation**](https://js2me.github.io/mobx-view-model/react/api/with-view-model.html#id)
	 */
	id?: Maybe<string>;
	/**
	 * Function to create an instance of the VM class
	 *
	 * [**Documentation**](https://js2me.github.io/mobx-view-model/react/api/with-view-model.html#factory)
	 */
	factory?: ViewModelsConfig<TViewModel>["factory"];
}
/**
 * Creates new instance of ViewModel
 *
 * [**Documentation**](https://js2me.github.io/mobx-view-model/react/api/use-create-view-model.html)
 */
export declare function useCreateViewModel<TViewModel extends AnyViewModel>(VM: Class<TViewModel>, ...args: IsPartial<TViewModel["payload"]> extends true ? [
	payload?: TViewModel["payload"],
	config?: UseCreateViewModelConfig<TViewModel>,
	_props?: any
] : [
	payload: TViewModel["payload"],
	config?: UseCreateViewModelConfig<TViewModel>,
	_props?: any
]): TViewModel;
/**
 * Creates new instance of ViewModelSimple
 *
 * [**Documentation**](https://js2me.github.io/mobx-view-model/react/api/use-create-view-model.html)
 */
export declare function useCreateViewModel<TPayload extends AnyObject, TViewModelSimple extends ViewModelSimple<TPayload>>(VM: Class<TViewModelSimple>, ...args: IsPartial<TPayload> extends true ? [
	payload?: TPayload,
	config?: ViewModelCreateConfig<TViewModelSimple>
] : [
	payload: TPayload,
	config?: ViewModelCreateConfig<TViewModelSimple>
]): TViewModelSimple;
/**
 * Creates new instance of ViewModelSimple
 *
 * [**Documentation**](https://js2me.github.io/mobx-view-model/react/api/use-create-view-model.html)
 */
export declare function useCreateViewModel<TViewModelSimple>(VM: Class<TViewModelSimple>): TViewModelSimple;
export declare const ViewModelsProvider: RComponentType<{
	value: ViewModelStore;
	children?: RReactNode;
}>;
type ExtractReactRef<T> = Defined<T> extends RForwardedRef<infer TForwardedRef> ? TForwardedRef : Defined<T> extends RLegacyRef<infer TRef> ? TRef : T;
type ViewModelProps<VM, TForwardedRef = unknown> = IsAny<TForwardedRef> extends true ? {
	model: VM;
	ref?: RForwardedRef<TForwardedRef>;
} : IsUnknown<TForwardedRef> extends true ? {
	model: VM;
} : {
	model: VM;
	ref?: RForwardedRef<TForwardedRef>;
};
type ViewModelPropsChargedProps<TComponentOriginProps extends AnyObject, TViewModel, TForwardedRef = unknown> = HasKey<TComponentOriginProps, "ref"> extends true ? Omit<TComponentOriginProps, "ref"> & ViewModelProps<TViewModel, ExtractReactRef<TComponentOriginProps["ref"]>> : TComponentOriginProps & ViewModelProps<TViewModel, IsUnknown<TForwardedRef> extends true ? any : TForwardedRef>;
type VMInputPayloadProp<TPayload> = TPayload extends EmptyObject ? {} : IsPartial<TPayload> extends true ? {
	payload?: TPayload;
} : {
	payload: TPayload;
};
type VMInputPayloadPropObj<VM> = VM extends ViewModel<infer TPayload, any> ? VMInputPayloadProp<TPayload> : VM extends ViewModelSimple<infer TPayload> ? VMInputPayloadProp<TPayload> : {};
type WithViewModelReactHook = (allProps: AnyObject, ctx: AnyObject, viewModels: Maybe<ViewModelStore>, ref?: any) => void;
interface ViewModelHocConfig<VM extends AnyViewModel> extends Omit<UseCreateViewModelConfig<VM>, "component" | "componentProps"> {
	/**
	 * Component to render if the view model initialization takes too long
	 *
	 * [**Documentation**](https://js2me.github.io/mobx-view-model/react/api/with-view-model.html#fallback)
	 */
	fallback?: RComponentType;
	/**
	 * Function to invoke additional React hooks in the resulting component
	 *
	 * [**Documentation**](https://js2me.github.io/mobx-view-model/react/api/with-view-model.html#reacthook)
	 */
	reactHook?: WithViewModelReactHook;
	/**
	 * Function that should return the payload for the VM
	 * by default, it is - (props) => props.payload
	 *
	 * [**Documentation**](https://js2me.github.io/mobx-view-model/react/api/with-view-model.html#getpayload)
	 */
	getPayload?: (allProps: any) => any;
	/**
	 * Forwards ref using `RforwardRef` but pass it to props as prop `ref`
	 *
	 * [**Documentation**](https://js2me.github.io/mobx-view-model/react/api/with-view-model.html#forwardref)
	 */
	forwardRef?: boolean;
	/**
	 * Additional component anchors for the same VM instance.
	 * useViewModel(AnchorComponent) will return this VM when the connected component is mounted.
	 */
	anchors?: RComponentType[];
}
interface ViewModelSimpleHocConfig<_VM> {
	/**
	 * Component to render if the view model initialization takes too long
	 *
	 * [**Documentation**](https://js2me.github.io/mobx-view-model/react/api/with-view-model.html#fallback)
	 */
	fallback?: RComponentType;
	/**
	 * Function to invoke additional React hooks in the resulting component
	 *
	 * [**Documentation**](https://js2me.github.io/mobx-view-model/react/api/with-view-model.html#reacthook)
	 */
	reactHook?: WithViewModelReactHook;
	/**
	 * Function that should return the payload for the VM
	 * by default, it is - (props) => props.payload
	 *
	 * [**Documentation**](https://js2me.github.io/mobx-view-model/react/api/with-view-model.html#getpayload)
	 */
	getPayload?: (allProps: any) => any;
	/**
	 * Forwards ref using `RforwardRef` but pass it to props as prop `ref`
	 *
	 * [**Documentation**](https://js2me.github.io/mobx-view-model/react/api/with-view-model.html#forwardref)
	 */
	forwardRef?: boolean;
	/**
	 * Additional component anchors for the same VM instance.
	 * useViewModel(AnchorComponent) will return this VM when the connected component is mounted.
	 */
	anchors?: RComponentType[];
}
type AllViewModelPropsKeys = keyof Required<ViewModelProps<any, any>>;
type VMComponentProps<TViewModel, TComponentOriginProps extends AnyObject = AnyObject, TForwardedRef = unknown> = Omit<TComponentOriginProps, AllViewModelPropsKeys> & VMInputPayloadPropObj<TViewModel> & (HasKey<TComponentOriginProps, "ref"> extends true ? Required<TComponentOriginProps>["ref"] extends RForwardedRef<infer R> ? {
	ref?: RLegacyRef<R>;
} : Required<TComponentOriginProps>["ref"] extends RLegacyRef<infer R> ? {
	ref?: RLegacyRef<R>;
} : {
	ref?: RLegacyRef<ExtractReactRef<TComponentOriginProps["ref"]>>;
} : IsUnknown<TForwardedRef> extends true ? {} : {
	ref?: RLegacyRef<TForwardedRef>;
});
interface VMComponent<TViewModel, TComponentOriginProps extends AnyObject = AnyObject, TForwardedRef = unknown> extends ViewModelComponentRef<TViewModel extends AnyViewModel | AnyViewModelSimple ? TViewModel : AnyViewModel | AnyViewModelSimple> {
	(props: VMComponentProps<TViewModel, TComponentOriginProps, TForwardedRef>): RReactNode;
	/**
	 * Registers an anchor component for the same VM instance.
	 * `useViewModel(anchor)` will return this VM when the connected component is mounted.
	 * Anchors are stored in config.anchors and passed to the store's link() during processCreateConfig.
	 * @param anchor - React component to use as lookup key for useViewModel
	 */
	connect(anchor: RComponentType<any>): VMComponent<TViewModel, TComponentOriginProps, TForwardedRef>;
}
/**
 * A Higher-Order Component that connects React components to their ViewModels, providing seamless MobX integration.
 *
 * [**Documentation**](https://js2me.github.io/mobx-view-model/react/api/with-view-model.html)
 */
export declare function withViewModel<TViewModel extends AnyViewModel, TComponentOriginProps extends AnyObject = AnyObject, TForwardedRef = unknown>(VM: Class<TViewModel>, renderFn: RRenderFn<ViewModelPropsChargedProps<TComponentOriginProps, TViewModel, TForwardedRef>>, config?: ViewModelHocConfig<TViewModel>): VMComponent<TViewModel, TComponentOriginProps, TForwardedRef>;
/**
 * A Higher-Order Component that connects React components to their ViewModels, providing seamless MobX integration.
 *
 * [**Documentation**](https://js2me.github.io/mobx-view-model/react/api/with-view-model.html)
 */
export declare function withViewModel<TViewModel, TComponentOriginProps extends AnyObject = ViewModelProps<TViewModel>, TForwardedRef = unknown>(VM: Class<TViewModel>, renderFn: RRenderFn<ViewModelPropsChargedProps<TComponentOriginProps, TViewModel, TForwardedRef>>, config?: ViewModelSimpleHocConfig<TViewModel>): VMComponent<TViewModel, TComponentOriginProps, TForwardedRef>;
interface IObserverOptions {
	/**
	 * @deprecated Pass a `React.forwardRef` component to observer instead of using the options object
	 * e.g. `observer(React.forwardRef(fn))`
	 */
	readonly forwardRef?: boolean;
}
export declare function observer<P extends object, TRef = {}>(baseComponent: React$1.ForwardRefRenderFunction<TRef, P>, options: IObserverOptions & {
	/**
	 * @deprecated Pass a `React.forwardRef` component to observer instead of using the options object
	 * e.g. `observer(React.forwardRef(fn))`
	 */
	forwardRef: true;
}): React$1.MemoExoticComponent<React$1.ForwardRefExoticComponent<React$1.PropsWithoutRef<P> & React$1.RefAttributes<TRef>>>;
export declare function observer<P extends object>(baseComponent: React$1.FunctionComponent<P>, options?: IObserverOptions): React$1.FunctionComponent<P>;
export declare function observer<P extends object, TRef = {}>(baseComponent: React$1.ForwardRefExoticComponent<React$1.PropsWithoutRef<P> & React$1.RefAttributes<TRef>>): React$1.MemoExoticComponent<React$1.ForwardRefExoticComponent<React$1.PropsWithoutRef<P> & React$1.RefAttributes<TRef>>>;
export declare function observer<C extends React$1.FunctionComponent<any> | React$1.ForwardRefRenderFunction<any>, Options extends IObserverOptions>(baseComponent: C, options?: Options): Options extends {
	forwardRef: true;
} ? C extends React$1.ForwardRefRenderFunction<infer TRef, infer P> ? C & React$1.MemoExoticComponent<React$1.ForwardRefExoticComponent<React$1.PropsWithoutRef<P> & React$1.RefAttributes<TRef>>> : never : C & {
	displayName: string;
};

export {};
