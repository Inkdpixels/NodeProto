/*global reductOpts*/

import { logger } from '@reduct/logger';

const messages = {
    noElement: 'No element was specified while creating a instance of a Class. Creating a detached DOM Element instead.',
    extendDeprecate: '@reduct/component.extend() is deprecated since v1.0.7 - Use the native ES6 extend instead.'
};

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
function _validateAndSetProps (component, propTypes) {
    const el = component.el;
    const _passedProps = component._passedProps;
    const _defaultProps = component.getDefaultProps();
    const defaultProps = _isObject(_defaultProps) ? _defaultProps : {};

    for (let propName in propTypes) {
        const propValue = _passedProps[propName] || el.getAttribute('data-' + propName.toLowerCase()) || defaultProps[propName];
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
    const _initialState = component.getInitialState();
    const initialState = _isObject(_initialState) ? _initialState : {};

    component.setState(initialState);
}

class Component {
    constructor(element, opts) {
        // Fail-Safe mechanism if someone is passing an array or the like as a second argument.
        opts = _isObject(opts) ? opts : {};

        if (!_isDefined(element)) {
            logger.warn(messages.noElement);
        }

        this._passedProps = opts.props || {};
        this.props = {};
        this.state = {};
        this.observers = {};
        this.el = element || global.document.createElement('div');

        _validateAndSetProps(this, opts.propTypes);
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
        return this.props[propName];
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
     * Sets a property to the Component.
     *
     * @param delta {Object} The diff object which holds all state changes for the component.
     * @param opts {Object} Optional options object which f.e. could turn off state events from firing.
     */
    setState(delta = {}, opts = { silent: false }) {
        const isNotSilent = !opts.silent;
        const previousState = _cloneObject(this.state);

        for (let key in delta) {
            let newValue = delta[key];
            let oldValue = previousState[key];

            if (newValue !== oldValue) {
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
        logger.error(messages.extendDeprecate);
    }
}

export default {
    Component,
    version: reductOpts.packageVersion
};
