/**
 *
 * @name @reduct/component
 * @version 1.1.1
 * @license MIT
 *
 * @author Tyll Weiß <inkdpixels@gmail.com>
 * @author André König <andre.koenig@posteo.de>
 * @author Wilhelm Behncke
 *
 */


(function () {
    var reductOpts = {
        isTestingEnv: false,
        packageVersion: {
            major: 1,
            minor: 1,
            patch: 1
        }
    };
    var world = this;

    // Check for globals.
    if (typeof window !== "undefined") {
        world = window;
    } else if (typeof global !== "undefined") {
        world = global;
    } else if (typeof self !== "undefined") {
        world = self;
    }

    // Execute the isTestingEnv check.
    reductOpts.isTestingEnv = world.process && world.process.title && !!~world.process.title.indexOf('reduct');

    return (function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.component = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
/*global reductOpts*/

'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _reductLogger = require('@reduct/logger');

var messages = {
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
function _isObject(obj) {
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
function _isDefined(val) {
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
function _cloneObject(obj) {
    var target = {};

    for (var i in obj) {
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
function _setInitialStates(component) {
    var _initialState = component.getInitialState();
    var initialState = _isObject(_initialState) ? _initialState : {};

    component.setState(initialState);
}

var Component = (function () {
    function Component(element, opts) {
        _classCallCheck(this, Component);

        // Fail-Safe mechanism if someone is passing an array or the like as a second argument.
        opts = _isObject(opts) ? opts : {};

        if (!_isDefined(element)) {
            _reductLogger.logger.warn(messages.noElement);
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

    _createClass(Component, [{
        key: 'getElement',
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
        key: 'getDefaultProps',
        value: function getDefaultProps() {
            return {};
        }

        /**
         * Returns the property for the given name.
         *
         * @param propName {String} The name of the property.
         * @returns {*} The value of the property.
         *
         */
    }, {
        key: 'getProp',
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
        key: 'hasProp',
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
        key: 'getInitialState',
        value: function getInitialState() {
            return {};
        }

        /**
         * Sets a property to the Component.
         *
         * @param delta {Object} The diff object which holds all state changes for the component.
         * @param opts {Object} Optional options object which f.e. could turn off state events from firing.
         */
    }, {
        key: 'setState',
        value: function setState() {
            var delta = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
            var opts = arguments.length <= 1 || arguments[1] === undefined ? { silent: false } : arguments[1];

            var isNotSilent = !opts.silent;
            var previousState = _cloneObject(this.state);

            for (var key in delta) {
                var newValue = delta[key];
                var oldValue = previousState[key];

                if (newValue !== oldValue) {
                    this.state[key] = newValue;

                    if (isNotSilent) {
                        this.trigger('change:' + key, {
                            key: key,
                            value: newValue,
                            previousValue: oldValue
                        });
                    }
                }
            }

            // Trigger event
            if (isNotSilent) {
                this.trigger('change', {
                    delta: delta,
                    previousState: previousState
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
    }, {
        key: 'getState',
        value: function getState(stateName) {
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
    }, {
        key: 'on',
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
        key: 'trigger',
        value: function trigger(event, data) {
            var value = undefined;
            var key = undefined;

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
        key: 'off',
        value: function off(event, listener) {
            var value = undefined;
            var key = undefined;

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
        key: 'extend',
        value: function extend() {
            _reductLogger.logger.error(messages.extendDeprecate);
        }
    }]);

    return Component;
})();

exports['default'] = {
    Component: Component,
    version: reductOpts.packageVersion
};
module.exports = exports['default'];

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"@reduct/logger":2}],2:[function(require,module,exports){
(function (global){
/**
 *
 * @name @reduct/logger
 * @version 1.1.0
 * @license MIT
 *
 * @author Tyll Weiß <inkdpixels@gmail.com>
 * @author André König <andre.koenig@posteo.de>
 * @author Wilhelm Behncke
 *
 */


(function () {
    var reductOpts = {
        isTestingEnv: false,
        packageVersion: {
            major: 1,
            minor: 1,
            patch: 0
        }
    };
    var world = this;

    // Check for globals.
    if (typeof window !== "undefined") {
        world = window;
    } else if (typeof global !== "undefined") {
        world = global;
    } else if (typeof self !== "undefined") {
        world = self;
    }

    // Execute the isTestingEnv check.
    reductOpts.isTestingEnv = world.process && world.process.title && !!~world.process.title.indexOf('reduct');

    return (function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.logger = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
/*global reductOpts*/

/**
 * @private
 *
 * Checks if the given argument is a Number.
 *
 * @param num {*} The argument which will be validated.
 * @returns {boolean}
 *
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _isNumeric(num) {
    return !isNaN(num);
}

var logLevels = {
    ALL: 2,
    WARNINGS: 1,
    SILENT: 0
};

var Logger = (function () {
    function Logger() {
        var namespace = arguments.length <= 0 || arguments[0] === undefined ? '@reduct/logger' : arguments[0];

        _classCallCheck(this, Logger);

        this.version = reductOpts.packageVersion;
        this.logLevel = logLevels.ALL;
        this.namespace = namespace;

        this.instances = [];
    }

    //
    // Check for the existence of an logger instance in the global namespace,
    // and if none was found create a singleton.
    //

    /**
     * Returns customized version of the logger API.
     *
     * @param namespace {String} The namespace of the new logger instance.
     */

    _createClass(Logger, [{
        key: 'getLogger',
        value: function getLogger() {
            var namespace = arguments.length <= 0 || arguments[0] === undefined ? this.namespace : arguments[0];

            var logger = new Logger(namespace);

            this.instances.push(logger);

            return {
                log: function log(message, appendix) {
                    logger.log(message, appendix);
                },

                info: function info(message, appendix) {
                    logger.info(message, appendix);
                },

                warn: function warn(message, appendix) {
                    logger.warn(message, appendix);
                },

                error: function error(message, appendix) {
                    logger.error(message, appendix);
                }
            };
        }

        /**
         * Adjusts the noise of the centralized instance of the logger.
         * 0 => No messages are displayed
         * 1 => Only severe messages are displayed
         * 2 => Every message is displayed
         *
         * @param int {Number} The new log level.
         * @returns {Logger}
         *
         */
    }, {
        key: 'setLogLevel',
        value: function setLogLevel(int) {
            var logLevel = _isNumeric(int) ? int : 2;

            this.logLevel = logLevel;

            this.instances.forEach(function (logger) {
                logger.logLevel = logLevel;
            });

            return this;
        }

        /**
         * Logs a message to the console API if possible.
         *
         * @param message {String} The message to log.
         * @param appendix {*} An optional appendix for the log.
         * @returns {Logger}
         *
         */
    }, {
        key: 'log',
        value: function log(message) {
            var appendix = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];

            if (this.logLevel < logLevels.ALL) {
                return this;
            }

            try {
                console.log(this.namespace + ': ' + message, appendix);
            } catch (e) {}

            return this;
        }

        /**
         * Logs a info to the console API if possible.
         *
         * @param message {String} The message to log.
         * @param appendix {*} An optional appendix for the info log.
         * @returns {Logger}
         *
         */
    }, {
        key: 'info',
        value: function info(message) {
            var appendix = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];

            if (this.logLevel < logLevels.ALL) {
                return this;
            }

            try {
                console.info(this.namespace + ' Info: ' + message, appendix);
            } catch (e) {}

            return this;
        }

        /**
         * Logs a warning to the console API if possible.
         *
         * @param message {String} The message to log.
         * @param appendix {*} An optional appendix for the warning.
         * @returns {Logger}
         *
         */
    }, {
        key: 'warn',
        value: function warn(message) {
            var appendix = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];

            if (this.logLevel < logLevels.WARNINGS) {
                return this;
            }

            try {
                console.warn(this.namespace + ' Warning: ' + message, appendix);
            } catch (e) {}
        }

        /**
         * Logs a error to the console API if possible.
         *
         * @param message {String} The message to log.
         * @param appendix {*} An optional appendix for the error log.
         * @returns {Logger}
         *
         */
    }, {
        key: 'error',
        value: function error(message) {
            var appendix = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];

            if (this.logLevel < logLevels.SILENT) {
                return this;
            }

            if (appendix !== '') {
                try {
                    // We still need the console.error call since the Error object can't print out references to HTML Elements/Objects etc.
                    console.error(message, appendix);
                } catch (e) {}

                if (!reductOpts.isTestingEnv) {
                    throw new Error(this.namespace + ' Error: Details are posted above.');
                }
            } else {
                if (!reductOpts.isTestingEnv) {
                    throw new Error(this.namespace + ' Error: ' + message);
                }
            }
        }
    }]);

    return Logger;
})();

if (!(global.reductLogger instanceof Logger)) {
    var logger = new Logger();

    //
    // Reduce the logging noise for the unit tests.
    //
    if (reductOpts.isTestingEnv) {
        logger.setLogLevel(0);
    }

    global.reductLogger = logger;
}

exports['default'] = {
    logger: global.reductLogger,
    logLevels: logLevels
};
module.exports = exports['default'];

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[1])(1)
});
}());
                
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[1])(1)
});
}());
                