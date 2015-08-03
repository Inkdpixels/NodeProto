/**
 *
 * @name @reduct/component
 * @version 1.0.6
 * @license MIT
 *
 * @author Tyll Weiß <inkdpixels@gmail.com>
 * @author André König <andre.koenig@posteo.de>
 * @author Wilhelm Behncke <undefined>
 *
 */

"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function (factory) {
    var version = {
        major: 1,
        minor: 0,
        patch: 6
    };
    var world;

    if (typeof window !== "undefined") {
        world = window;
    } else if (typeof global !== "undefined") {
        world = global;
    } else if (typeof self !== "undefined") {
        world = self;
    } else {
        world = this;
    }

    if (typeof exports === "object" && typeof module !== "undefined") {
        module.exports = factory(world, version);
    } else if (typeof define === "function" && define.amd) {
        define([], function () {
            return factory(world, version);
        });
    } else {
        world.reductComponent = factory(world, version);
    }
})(function factory(global, version) {
    var _this = this,
        _arguments = arguments;

    var messages = {
        noElement: 'No element was specified while creating a instance of a Class. Creating a detached DOM Element instead.',
        extendDeprecate: '@reduct/component.extend() is deprecated since v1.0.7 - Use the native ES6 extend instead.'
    };

    /**
     * @private
     *
     * Checks if the given argument is a function.
     *
     * @param func {*} The argument which will be validated.
     * @returns {boolean}
     *
     */
    function _isFunction(func) {
        return typeof func === 'function';
    }

    /**
     * @private
     *
     * Checks if the given argument is a Number.
     *
     * @param num {*} The argument which will be validated.
     * @returns {boolean}
     *
     */
    function _isNumeric(num) {
        return !isNaN(num);
    }

    /**
     * @private
     *
     * Checks if the given argument is a boolean or a string containing a boolean.
     *
     * @param bol {*} The argument which will be validated.
     * @returns {boolean}
     *
     */
    function _isBoolean(bol) {
        return typeof bol === 'boolean' || bol === 'true' || bol === 'false';
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
    function _isObject(obj) {
        return typeof obj === 'object';
    }

    /**
     * @private
     *
     * Checks if the given argument is a string.
     *
     * @param str {*} The argument which will be validated.
     * @returns {boolean}
     *
     */
    function _isString(str) {
        return typeof str === 'string';
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
    function _isDefined(val) {
        return val !== null && val !== undefined;
    }

    var propTypes = {
        /**
         * Represents a general required check against a value.
         *
         * @param propValue {*} The value which will be validated.
         * @param propName {String} The name which will be logged in case of errors.
         * @param el {HTMLElement} The element on which the value was expected on.
         * @returns {{result: boolean, value: *}}
         *
         */
        isRequired: function isRequired(propValue, propName, el) {
            var isPropInProps = _isDefined(propValue);

            if (!isPropInProps) {
                logger.error('The prop "' + propName + '" is required and wasn‘t found on: ', el);
            }

            return {
                result: isPropInProps,
                value: propValue
            };
        },

        /**
         * Represents a general optional check against a value.
         *
         * @param propValue {*} The value which will be validated.
         * @param propName{String} The name which will be logged in case of errors.
         * @param el {HTMLElement} The element on which the value was expected on.
         * @returns {{result: boolean, value: *}}
         *
         */
        isOptional: function isOptional(propValue, propName, el) {
            var isPropInProps = _isDefined(propValue);

            if (!isPropInProps) {
                logger.info('The prop "' + propName + '" is optional and wasn‘t found on: ', el);
            }

            return {
                result: true,
                value: propValue
            };
        },

        isString: {
            /**
             * Extends the general required validator for the type `String`.
             *
             * @param propValue {*} The value which will be validated.
             * @param propName {String} The name which will be logged in case of errors.
             * @param el {HTMLElement} The element on which the value was expected on.
             * @returns {{result: boolean, value: *}}
             *
             */
            isRequired: function isRequired(propValue, propName, el) {
                var isString = _isString(propValue);
                var result = true;

                propTypes.isRequired.apply(_this, _arguments);

                if (!isString) {
                    logger.error('The prop "' + propName + '" is not a string. ', el);
                    result = false;
                }

                return {
                    result: result,
                    value: propValue
                };
            },

            /**
             * Extends the general optional validator for the type `String`.
             *
             * @param propValue {*} The value which will be validated.
             * @param propName {String} The name which will be logged in case of errors.
             * @param el {HTMLElement} The element on which the value was expected on.
             * @returns {{result: boolean, value: *}}
             *
             */
            isOptional: function isOptional(propValue, propName, el) {
                var isString = _isString(propValue);
                var result = true;

                if (!isString) {
                    logger.error('The prop "' + propName + '" is not a string. ', el);
                    result = false;
                }

                return {
                    result: result,
                    value: propValue
                };
            }
        },

        isBoolean: {
            /**
             * Extends the general required validator for the type `Boolean`.
             *
             * @param propValue {*} The value which will be validated.
             * @param propName {String} The name which will be logged in case of errors.
             * @param el {HTMLElement} The element on which the value was expected on.
             * @returns {{result: boolean, value: *}}
             *
             */
            isRequired: function isRequired(propValue, propName, el) {
                var isBoolean = _isBoolean(propValue);
                var result = true;

                propTypes.isRequired.apply(_this, _arguments);

                if (!isBoolean) {
                    logger.error('The prop "' + propName + '" is not a boolean. ', el);
                    result = false;
                } else {
                    result = !!propValue;
                }

                return {
                    result: result,
                    value: propValue
                };
            },

            /**
             * Extends the general optional validator for the type `Boolean`.
             *
             * @param propValue {*} The value which will be validated.
             * @param propName {String} The name which will be logged in case of errors.
             * @param el {HTMLElement} The element on which the value was expected on.
             * @returns {{result: boolean, value: *}}
             *
             */
            isOptional: function isOptional(propValue, propName, el) {
                var isBoolean = _isBoolean(propValue);
                var result = true;

                if (!isBoolean) {
                    logger.error('The prop "' + propName + '" is not a boolean. ', el);
                    result = false;
                } else {
                    result = !!propValue;
                }

                return {
                    result: result,
                    value: propValue
                };
            }
        },

        isNumber: {
            /**
             * Extends the general required validator for the type `Number`.
             *
             * @param propValue {*} The value which will be validated.
             * @param propName {String} The name which will be logged in case of errors.
             * @param el {HTMLElement} The element on which the value was expected on.
             * @returns {{result: boolean, value: *}}
             *
             */
            isRequired: function isRequired(propValue, propName, el) {
                var isNumber = _isNumeric(propValue);
                var result = true;

                // Since The prop is required, check for it's value beforehand.
                propTypes.isRequired.apply(_this, _arguments);

                if (!isNumber) {
                    logger.error('The prop "' + propName + '" is not a number. ', el);
                    result = false;
                } else {
                    propValue = Math.abs(propValue);
                }

                return {
                    result: result,
                    value: propValue
                };
            },

            /**
             * Extends the general optional validator for the type `Number`.
             *
             * @param propValue {*} The value which will be validated.
             * @param propName {String} The name which will be logged in case of errors.
             * @param el {HTMLElement} The element on which the value was expected on.
             * @returns {{result: boolean, value: *}}
             *
             */
            isOptional: function isOptional(propValue, propName, el) {
                var isNumber = _isNumeric(propValue);
                var result = true;

                if (propValue && !isNumber) {
                    logger.error('The prop "' + propName + '" is not a number. ', el);
                    result = false;
                }

                propValue = Math.abs(propValue);

                return {
                    result: result,
                    value: _isNumeric(propValue) ? propValue : undefined
                };
            }
        },

        isObject: {
            /**
             * Extends the general required validator for the type `Object`.
             *
             * @param propValue {*} The value which will be validated.
             * @param propName {String} The name which will be logged in case of errors.
             * @param el {HTMLElement} The element on which the value was expected on.
             * @returns {{result: boolean, value: *}}
             *
             */
            isRequired: function isRequired(propValue, propName, el) {
                var result = true;
                var isObject = undefined;

                // Since The prop is required, check for it's value beforehand.
                propTypes.isRequired.apply(_this, _arguments);

                // If the passed Property is a string, convert it to a JSON object beforehand.
                try {
                    propValue = JSON.parse(propValue);
                } catch (e) {}

                // Verify the type of the value.
                isObject = _isObject(propValue);

                if (!isObject) {
                    logger.error('The prop "' + propName + '" is not an valid JSON object. ', el);
                    result = false;
                }

                return {
                    result: result,
                    value: propValue
                };
            },

            /**
             * Extends the general optional validator for the type `Object`.
             *
             * @param propValue {*} The value which will be validated.
             * @param propName {String} The name which will be logged in case of errors.
             * @param el {HTMLElement} The element on which the value was expected on.
             * @returns {{result: boolean, value: *}}
             *
             */
            isOptional: function isOptional(propValue, propName, el) {
                var isPropValueDefined = _isDefined(propValue);
                var result = true;
                var isObject = undefined;

                // If the passed Property is a string, convert it to a JSON object beforehand.
                try {
                    propValue = JSON.parse(propValue);
                } catch (e) {}

                // Verify the type of the value.
                isObject = _isObject(propValue);

                if (isPropValueDefined && !isObject) {
                    logger.error('The prop "' + propName + '" is not an valid JSON object. ', el);
                    result = false;
                }

                return {
                    result: result,
                    value: propValue
                };
            }
        }
    };

    var logger = {
        _logLevel: 2,

        /**
         * Adjusts the noise of the logger.
         * 0 => No messages are displayed
         * 1 => Only severe messages are displayed
         * 2 => Every message is displayed
         *
         * @param int {Number} The new log level.
         * @returns {Void}
         *
         */
        setLogLevel: function setLogLevel(int) {
            logger._logLevel = _isNumeric(int) ? int : 2;
        },

        /**
         * Logs a message to the console API if possible.
         *
         * @param message {String} The message to log.
         * @param targetElement {HTMLElement} An optional target element which will be appended to the log.
         * @returns {Void}
         *
         */
        log: function log(message) {
            var targetElement = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];

            if (logger._logLevel <= 2) {
                return;
            }

            try {
                console.log('@reduct/component: ' + message, targetElement);
            } catch (e) {}
        },

        /**
         * Logs a info to the console API if possible.
         *
         * @param message {String} The message to log.
         * @param targetElement {HTMLElement} An optional target element which will be appended to the info.
         * @returns {Void}
         *
         */
        info: function info(message) {
            var targetElement = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];

            if (logger._logLevel <= 2) {
                return;
            }

            try {
                console.info('@reduct/component Info: ' + message, targetElement);
            } catch (e) {}
        },

        /**
         * Logs a warning to the console API if possible.
         *
         * @param message {String} The message to log.
         * @param targetElement {HTMLElement} An optional target element which will be appended to the warning.
         * @returns {Void}
         *
         */
        warn: function warn(message) {
            var targetElement = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];

            if (logger._logLevel <= 1) {
                return;
            }

            try {
                console.warn('@reduct/component Warning: ' + message, targetElement);
            } catch (e) {}
        },

        /**
         * Logs a error to the console API if possible.
         *
         * @param message {String} The message to log.
         * @param targetElement {HTMLElement} An optional target element which will be appended to the error.
         * @returns {Void}
         *
         */
        error: function error(message) {
            var targetElement = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];

            if (logger._logLevel <= 0) {
                return;
            }

            try {
                // We still need the console.error call since the Error object can't print out references to HTML Elements.
                console.error(message, targetElement);
            } catch (e) {}

            throw new Error('@reduct/component Error: Details are posted above.');
        }
    };

    //
    // Reduce the logging noise for the unit tests.
    //
    if (process && process.title && !! ~process.title.indexOf('reduct')) {
        logger.setLogLevel(0);
    }

    /**
     * Helper function to move passed props via constructor into the component
     * instance and validate them along the way
     *
     * @param {Component} component The component instance
     * @param {Object} propTypes A map of propTypes
     * @returns {Void}
     */
    function _validateAndSetProps(component, propTypes) {
        var el = component.el;
        var _passedProps = component._passedProps;
        var _defaultProps = component.getDefaultProps();
        var defaultProps = _isObject(_defaultProps) ? _defaultProps : {};

        for (var propName in propTypes) {
            var propValue = _passedProps[propName] || el.getAttribute('data-' + propName.toLowerCase()) || defaultProps[propName];
            var validator = propTypes[propName];
            var validatorResults = validator(propValue, propName, el);

            if (validatorResults.result) {
                component._setProp(propName, validatorResults.value);
            }
        }
    }

    /**
     * Helper function to set initial state variables in the component
     * instance
     *
     * @param {Component} component The component instance
     * @returns {Void}
     */
    function _setInitialStates(component) {
        var _initialStates = component.getInitialStates();
        var initialStates = _isObject(_initialStates) ? _initialStates : {};

        for (var stateKey in initialStates) {
            var value = initialStates[stateKey];

            component.setState(stateKey, value);
        }
    }

    var Component = (function () {
        function Component(element, opts) {
            _classCallCheck(this, Component);

            // Fail-Safe mechanism if someone is passing an array or the like as a second argument.
            opts = _isObject(opts) ? opts : {};

            if (!_isDefined(element)) {
                logger.warn(messages.noElement);
            }

            this._passedProps = opts.props || {};
            this.props = {};
            this.states = {};
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

        _createClass(Component, [{
            key: "getElement",
            value: function getElement() {
                return this.el;
            }

            /**
             * The default method which declares the default properties of the Component.
             *
             * @returns {Object} The object containing default props.
             *
             */
        }, {
            key: "getDefaultProps",
            value: function getDefaultProps() {
                return {};
            }

            /**
             * @private
             *
             * Sets a property to the Component.
             *
             * @param propName {String} The name under which the value will be saved under.
             * @param propVal {*} The value of the property.
             *
             */
        }, {
            key: "_setProp",
            value: function _setProp(propName, propVal) {
                this.props[propName] = propVal;
            }

            /**
             * Returns the property for the given name.
             *
             * @param propName {String} The name of the property.
             * @returns {*} The value of the property.
             *
             */
        }, {
            key: "getProp",
            value: function getProp(propName) {
                return this.props[propName];
            }

            /**
             * Returns a boolean regarding the existence of the property.
             *
             * @param propName {String} The name of the property.
             * @returns {boolean} The result of the check.
             *
             */
        }, {
            key: "hasProp",
            value: function hasProp(propName) {
                return _isDefined(this.props[propName]);
            }

            /**
             * The default method which declares the default state of the Component.
             *
             * @returns {Object} The object containing default state.
             *
             */
        }, {
            key: "getInitialStates",
            value: function getInitialStates() {
                return {};
            }

            /**
             * Sets a property to the Component.
             *
             * @param stateName {String} The name under which the value will be saved under.
             * @param stateVal {*} The value of the property.
             *
             */
        }, {
            key: "setState",
            value: function setState(stateName, stateVal) {
                this.states[stateName] = stateVal;
            }

            /**
             * Returns the property for the given name.
             *
             * @param stateName {String} The name of the property.
             * @returns {*} The value of the property.
             *
             */
        }, {
            key: "getState",
            value: function getState(stateName) {
                return this.states[stateName];
            }

            /**
             * Declares a event listener on the given event name.
             *
             * @param event {String} The name of the event under which the listener will be saved under.
             * @param listener {Function} The listener which will be executed once the event will be fired.
             * @returns {Number} The length of the event listener array.
             *
             */
        }, {
            key: "on",
            value: function on(event, listener) {
                var targetArray = this.observers[event] || (this.observers[event] = []);

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
        }, {
            key: "trigger",
            value: function trigger(event, data) {
                var value;
                var key;

                for (value = this.observers[event], key = 0; value && key < value.length;) {
                    value[key++](data);
                }
            }

            /**
             * Removes the given listener function from the event of the given name.
             * @param event {String} Name of the event.
             * @param listener {Function} The listener function to remove.
             */
        }, {
            key: "off",
            value: function off(event, listener) {
                var value;
                var key;

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
        }, {
            key: "extend",
            value: function extend() {
                logger.error(messages.extendDeprecate);
            }
        }]);

        return Component;
    })();

    return {
        Component: Component,
        propTypes: propTypes,
        version: version
    };
});