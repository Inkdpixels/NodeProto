import {logger} from '@reduct/logger';
import {
    cloneObject,
    isDefined,
    isError,
    isObject,
    isFunction,
    protoType
} from './utilities/';
import * as messages from './messages.js';

const componentLogger = logger.getLogger('@reduct/component');

/**
 * Helper function to move passed props via constructor into the component
 * instance and validate them along the way.
 *
 * @param {Function} context The component instance.
 * @param {Object} passedProps An optional props object which can be directly passed to the class.
 * @returns {Void}
 */
function _validateAndSetProps(context, passedProps) {
	const {
		el,
		getDefaultProps
	} = context;
	const defaultProps = getDefaultProps();
	const propTypes = context.constructor.propTypes || {};
	const componentName = context.constructor.name;
	const propNames = Object.keys(propTypes);
	const props = {};

	if (!isObject(defaultProps)) {
		logger.error(`The getDefaultProps() method of Component "${componentName}" did not return a valid Object. This can lead to unexpected behavior and Errors.`);
	}

	//
	// First of, we need to aggregate all props, either from the passed props, the dom or the getDefaultProps() method.
	//
	propNames.forEach(propName => {
		const value = passedProps[propName] || el.getAttribute(`data-${propName.toLowerCase()}`) || defaultProps[propName];

		props[propName] = value;
	});

	//
	// After the aggregation is done, we validate the generated props object with each propType validator.
	// If the user passed an object containing a `isOptional` function as the propType, we map the propType to the function.
	// This reduces the overal code needed to defined propTypes and increases similarity with Reacts syntax.
	//
	propNames.forEach(propName => {
		const propTypeTarget = propTypes[propName];
		const propType = isObject(propTypeTarget) && isFunction(propTypeTarget.isOptional) ? propTypeTarget.isOptional : propTypeTarget;
		const isPropTypeInvalid = !isFunction(propType);

		if (isPropTypeInvalid) {
			logger.error(`Invalid propType "${propName}" specified in Component "${componentName}". Please specify a function as the propType validator.`);
		}

		const propTypeResult = propType(props, propName, componentName);

		if (isError(propTypeResult)) {
			logger.error(`The propType for "${propName}" in Component "${componentName}" returned an Error with the message:

"${propTypeResult.message}".`);
		}

		//
		// If no error was thrown, and the propType has returned a transformed value,
		// which is not `null` or `undefined`, overwrite the aggregated value.
		//
		if (isDefined(propTypeResult)) {
			props[propName] = propTypeResult;
		}
	});

	// Freeze the props object to avoid further editing off the object.
	context.props = Object.freeze(props);
}

/**
 * Helper function to set initial state variables in the component
 * instance.
 *
 * @param {Function} context The component instance.
 * @returns {Void}
 */
function _setInitialStates(context) {
	const initialState = context.getInitialState();

	if (isObject(initialState)) {
		context.initialStateKeys = Object.keys(initialState);
		context.setState(initialState);
	} else {
		componentLogger.warn('Please return a valid object in the getInitialState() method.', context);
	}
}

class ComponentClass {
	constructor(element, props) {
		// Fail-Safe mechanism if someone is passing an array or the like as a second argument.
		props = isObject(props) ? props : {};

		if (!isDefined(element)) {
			componentLogger.warn(messages.noElement);
		}

		// The element property for the getElement() method.
		this.el = element || global.document.createElement('div');

		// Holds all props.
		this.props = {};

		// Holds the components state.
		this.state = {};

		// Holds all event listeners.
		this.observers = {};

		// Cache for not hitting the DOM over and over again in the `find` and `findOne` methods.
		this.queryCache = {};

		// Holds all keys of the initial state, used to check for the initial existence of state additions.
		this.initialStateKeys = [];

		// Set the props and the initial state of the component.
		_validateAndSetProps(this, props);
		_setInitialStates(this);
	}

	/**
	 * Returns the HTML Element on which the Component was mounted upon.
	 *
	 * @returns {HTMLElement}
	 *
	 */
	getElement() {
		return this.el;
	}

	/**
	 * Returns the next found child node by a given selector.
	 *
	 * @returns {HTMLElement}
	 *
	 */
	find(selector) {
		return this.findAll(selector).shift();
	}

	/**
	 * Returns all found child nodes by a given selector.
	 *
	 * @returns {Array<HTMLElement>}
	 *
	 */
	findAll(selector) {
		const cachedResult = this.queryCache[selector];

		if (cachedResult) {
			return cachedResult;
		}

		const nodeList = this.getElement().querySelectorAll(selector);
		const nodes = Reflect.apply(Array.prototype.slice, nodeList, [nodeList]);

		this.queryCache[selector] = [...nodes];

		return nodes;
	}

	/**
	 * The default method which declares the default properties of the Component.
	 *
	 * @returns {Object} The object containing default props.
	 *
	 */
	getDefaultProps() {
		return {};
	}

	/**
	 * Returns a boolean regarding the existence of the property.
	 *
	 * @param propName {String} The name of the property.
	 * @returns {boolean} The result of the check.
	 *
	 */
	hasProp(propName) {
		return isDefined(this.props[propName]);
	}

	/**
	 * The default method which declares the default state of the Component.
	 *
	 * @returns {Object} The object containing default state.
	 *
	 */
	getInitialState() {
		return {};
	}

	/**
	 * Sets all differing state key/value pairs to the Components state.
	 *
	 * @param delta {Object} The diff object which holds all state changes for the component.
	 * @param opts {Object} Optional options object which f.e. could turn off state events from firing.
	 */
	setState(delta = {}, opts = {silent: false}) {
		const isNotSilent = !opts.silent;
		const previousState = cloneObject(this.state);
		const {initialStateKeys} = this;

		for (const key in delta) {
			if (delta.hasOwnProperty(key)) {
				const newValue = delta[key];
				const oldValue = previousState[key];

				if (initialStateKeys.indexOf(key) === -1) {
					componentLogger.error(`Please specify an initial value for '${key}' in your getInitialState() method.`);
				} else if (newValue !== oldValue) {
					this.state[key] = newValue;

					if (isNotSilent) {
						this.trigger(`change:${key}`, {
							key,
							value: newValue,
							previousValue: oldValue
						});
					}
				}
			}
		}

		// Trigger event
		if (isNotSilent) {
			this.trigger('change', {
				delta,
				previousState
			});
		}
	}

	/**
	 * Declares a event listener on the given event name.
	 *
	 * @param event {String} The name of the event under which the listener will be saved under.
	 * @param listener {Function} The listener which will be executed once the event will be fired.
	 * @returns {Number} The length of the event listener array.
	 *
	 */
	on(event, listener) {
		const targetArray = this.observers[event] || (this.observers[event] = []);

		return targetArray.push(listener);
	}

	/**
	 * Triggers the event of the given name with optional data.
	 *
	 * @todo Support for multiple arguments.
	 * @param event {String} The name of the event to trigger.
	 * @param data {*} The data to pass to all listeners.
	 *
	 */
	trigger(event, data) {
		let value;
		let key;

		for (value = this.observers[event], key = 0; value && key < value.length;) {
			value[key++](data);
		}
	}

	/**
	 * Removes the given listener function from the event of the given name.
	 * @param event {String} Name of the event.
	 * @param listener {Function} The listener function to remove.
	 */
	off(event, listener) {
		let value;
		let key;

		for (value = this.observers[event] || []; listener && (key = value.indexOf(listener)) > -1;) {
			value.splice(key, 1);
		}

		this.observers[event] = listener ? value : [];
	}
}

//
// First, we export the named `@component` decorator, for simplified usage.
//
export const component = decoratorPropTypes => CustomComponent => {
	const prototype = protoType.extractFrom(CustomComponent);
	const propTypes = decoratorPropTypes || CustomComponent.propTypes;

	return function Wrapper(el, props) {
		const BaseComponent = ComponentClass;

		//
		// Since the base class gets executed first, we need to transfer / reset the
		// getDefaultProps() and getInitialState() method.
		//
		if (prototype.getDefaultProps) {
			BaseComponent.prototype.getDefaultProps = prototype.getDefaultProps;
		} else {
			BaseComponent.prototype.getDefaultProps = ComponentClass.prototype.getDefaultProps;
		}
		if (prototype.getInitialState) {
			BaseComponent.prototype.getInitialState = prototype.getInitialState;
		} else {
			BaseComponent.prototype.getInitialState = ComponentClass.prototype.getInitialState;
		}

		//
		// Create an instance of the component.
		//
		BaseComponent.propTypes = propTypes;
		const base = new BaseComponent(el, props);
		BaseComponent.propTypes = {};

		//
		// Adjust the prototype of the actual component.
		//
		CustomComponent.prototype = base;

		//
		// Inject the prototype of the `CustomComponent`. This will
		// merge the attributes and the methods of the `CustomComponent`
		// with those from `@reduct/component`.
		//
		protoType.injectInto(CustomComponent, prototype);

		return new CustomComponent();
	};
};

//
// And the ES6 class as the default export for users who would like to use it the traditional way.
//
export default ComponentClass;
