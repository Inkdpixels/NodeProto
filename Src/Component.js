/*global reductOpts*/

import { logger } from '@reduct/logger';
import * as messages from './Messages.js';

const componentLogger = logger.getLogger('@reduct/component');

/**
 * @private
 *
 * Checks if the given argument is a Number.
 *
 * @param num {*} The argument which will be validated.
 * @returns {boolean}
 *
 */
function _isNumeric (num) {
    return !isNaN(num);
}

/**
 * @private
 *
 * Checks if the given argument is a object.
 *
 * @param obj {*} The argument which will be validated.
 * @returns {boolean}
 *
 */
function _isObject (obj) {
    return typeof obj === 'object';
}

/**
 * @private
 *
 * Checks if the given argument is defined and not `null`.
 *
 * @param val {*} The argument which will be validated.
 * @returns {boolean}
 *
 */
function _isDefined (val) {
    return val !== null && val !== undefined;
}

/**
 * @private
 *
 * Deep-Clones a object.
 *
 * @param obj {Object} The object to clone.
 * @returns {Object} The cloned object.
 */
function _cloneObject (obj) {
    let target = {};

    for (let i in obj) {
        if (obj.hasOwnProperty(i)) {
            target[i] = obj[i];
        }
    }

    return target;
}

/**
 * Helper function to move passed props via constructor into the component
 * instance and validate them along the way
 *
 * @param {Component} component The component instance
 * @param {Object} propTypes A map of propTypes
 * @returns {Void}
 */
function _validateAndSetProps (component, propTypes, passedProps = {}) {
    const el = component.el;
    const _defaultProps = component.getDefaultProps();
    const defaultProps = _isObject(_defaultProps) ? _defaultProps : {};

    for (let propName in propTypes) {
        const propValue = passedProps[propName] || el.getAttribute('data-' + propName.toLowerCase()) || defaultProps[propName];
        const validator = propTypes[propName];
        const validatorResults = validator(propValue, propName, el);

        if (validatorResults.result) {
            component.props[propName] = validatorResults.value;
        }
    }

    // Freeze the props object to avoid further editing off the object.
    component.props = Object.freeze(component.props);
}

/**
 * Helper function to set initial state variables in the component
 * instance
 *
 * @param {Component} component The component instance
 * @returns {Void}
 */
function _setInitialStates (component) {
    const initialState = component.getInitialState();

    if (_isObject(initialState)) {
        component.initialStateKeys = Object.keys(initialState);
        component.setState(initialState);
    } else {
        componentLogger.warn('Please return a valid object in the getInitialState() method.', component);
    }
}

class Component {
    constructor(element, opts) {
        // Fail-Safe mechanism if someone is passing an array or the like as a second argument.
        opts = _isObject(opts) ? opts : {};

        if (!_isDefined(element)) {
            componentLogger.warn(messages.noElement);
        }

        // Holds all props
        this.props = {};

        // Holds the components state.
        this.state = {};

        // Holds all event listeners.
        this.observers = {};

        // The element property for the getElement() method.
        this.el = element || global.document.createElement('div');

        // Cache for not hitting the DOM over and over again in the `find` and `findOne` methods.
        this.queryCache = {};

        // Holds all keys of the initial state, used to check for the initial existence of state additions.
        this.initialStateKeys = [];

        // Set the props and the initial state of the component.
        _validateAndSetProps(this, opts.propTypes, opts.props);
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
    find (selector) {
        return this.findAll(selector).shift();
    }

    /**
     * Returns all found child nodes by a given selector.
     *
     * @returns {Array<HTMLElement>}
     *
     */
    findAll (selector) {
        if (this.queryCache[selector]) {
            return this.queryCache[selector];
        }

        let nodes = Array.prototype.slice.call(this.getElement().querySelectorAll(selector));

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
     * Returns the property for the given name.
     *
     * @param propName {String} The name of the property.
     * @returns {*} The value of the property.
     *
     */
    getProp(propName) {
        const value = this.props[propName];

        if (!_isDefined(value)) {
            componentLogger.warn(`No value found for the prop ${propName}. Make sure to declare a propType for this property.`);
        }

        return value;
    }

    /**
     * Returns a boolean regarding the existence of the property.
     *
     * @param propName {String} The name of the property.
     * @returns {boolean} The result of the check.
     *
     */
    hasProp(propName) {
        return _isDefined(this.props[propName]);
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
    setState(delta = {}, opts = { silent: false }) {
        const isNotSilent = !opts.silent;
        const previousState = _cloneObject(this.state);
        const initialStateKeys = this.initialStateKeys;

        for (let key in delta) {
            let newValue = delta[key];
            let oldValue = previousState[key];

            if (initialStateKeys.indexOf(key) === -1) {
                componentLogger.error(`Please specify an initial value for '${key}' in your getInitialState() method.`);
            } else if (newValue !== oldValue) {
                this.state[key] = newValue;

                if (isNotSilent) {
                    this.trigger('change:' + key, {
                        key,
                        value: newValue,
                        previousValue: oldValue
                    });
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
     * Returns the property for the given name.
     *
     * @param stateName {String} The name of the property.
     * @returns {*} The value of the property.
     *
     */
    getState(stateName) {
        return this.state[stateName];
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

    /**
     * Extends the Components prototype.
     *
     * @deprecated since version 1.1.0
     */
    extend() {
        componentLogger.error(messages.extendDeprecate);
    }
}

export default {
    Component: Component,
    version: reductOpts.packageVersion
};
