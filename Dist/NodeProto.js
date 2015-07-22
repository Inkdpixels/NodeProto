"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function (global, factory) {
    'use strict';

    // If the env is browserify, export the factory using the module object.
    if (typeof module === "object" && typeof module.exports === "object") {
        module.exports = factory(global);

        // If the env is AMD, register the Module as 'componentprototype'.
    } else if (global.define && typeof global.define === "function" && global.define.amd) {
            global.define("nodeProto", [], function () {
                return factory(global);
            });

            // If the env is a browser(without CJS or AMD support), export the factory into the global window object.
        } else {
                global.nodeProto = factory(global);
            }
})(window, function (global) {
    'use strict';

    var _this = this,
        _arguments = arguments;

    var doc = global.document;
    var isScriptExecutedByNode = process && process.title && process.title.indexOf('node') > -1;

    function _isFunction(func) {
        return typeof func === 'function';
    }

    function _isNumeric(num) {
        return !isNaN(num);
    }

    function _isBoolean(bol) {
        return typeof bol === 'boolean' || bol === 'true' || bol === 'false';
    }

    function _isObject(obj) {
        return typeof obj === 'object';
    }

    function _isString(str) {
        return typeof str === 'string';
    }

    function _isDefined(val) {
        return val !== null && val !== undefined;
    }

    var propTypes = {
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
            isRequired: function isRequired(propValue, propName, el) {
                var isObject = undefined;
                var result = true;

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
            isOptional: function isOptional(propValue, propName, el) {
                var isObject = undefined;
                var result = true;
                var isPropValueDefined = _isDefined(propValue);

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
        // 2: Every message is displayed
        // 1: Only severe messages are displayed
        // 0: No messages are displayed
        _logLevel: 2,
        setLogLevel: function setLogLevel(int) {
            logger._logLevel = _isNumeric(int) ? int : 2;
        },

        log: function log(message) {
            var targetElement = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];

            if (logger._logLevel <= 2) {
                return;
            }

            try {
                console.log('NodeProto: ' + message, targetElement);
            } catch (e) {}
        },
        info: function info(message) {
            var targetElement = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];

            if (logger._logLevel <= 2) {
                return;
            }

            try {
                console.info('NodeProto Info: ' + message, targetElement);
            } catch (e) {}
        },
        warn: function warn(message) {
            var targetElement = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];

            if (logger._logLevel <= 1) {
                return;
            }

            try {
                console.warn('NodeProto Warning: ' + message, targetElement);
            } catch (e) {}
        },
        error: function error(message) {
            var targetElement = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];

            if (logger._logLevel <= 0) {
                return;
            }

            try {
                console.error('NodeProto Error: ' + message, targetElement);
            } catch (e) {}
        }
    };

    if (isScriptExecutedByNode) {
        logger.setLogLevel(0);
    }

    var Component = (function () {
        function Component(element, opts) {
            _classCallCheck(this, Component);

            // Fail-Safe mechanism if someone is passing an array or the like as a second argument.
            opts = _isObject(opts) ? opts : {};

            if (!_isDefined(element)) {
                logger.warn('No element was specified while creating a new instance of a Class. Creating a virtual DOM Element instead.');
            }

            this._passedProps = opts.props || {};
            this.props = {};
            this.states = {};
            this.observers = {};
            this.el = element || doc.createElement('div');
            this.elementCache = {};

            this._validateAndSetProps(opts.propTypes);
            this._setInitialStates();
        }

        _createClass(Component, [{
            key: "_validateAndSetProps",
            value: function _validateAndSetProps(propTypes) {
                var el = this.el;
                var _passedProps = this._passedProps;
                var _defaultProps = this.getDefaultProps();
                var defaultProps = _isObject(_defaultProps) ? _defaultProps : {};

                for (var propName in propTypes) {
                    var propValue = _passedProps[propName] || el.getAttribute('data-' + propName.toLowerCase()) || defaultProps[propName];
                    var validator = propTypes[propName];
                    var validatorResults = validator(propValue, propName, el);

                    if (validatorResults.result) {
                        this._setProp(propName, validatorResults.value);
                    }
                }
            }
        }, {
            key: "_setInitialStates",
            value: function _setInitialStates() {
                var _initialStates = this.getInitialStates();
                var initialStates = _isObject(_initialStates) ? _initialStates : {};

                for (var stateKey in initialStates) {
                    var value = initialStates[stateKey];

                    this.setState(stateKey, value);
                }
            }
        }, {
            key: "getElement",
            value: function getElement(query) {
                if ('string' === typeof query) {
                    var elements = [].slice.call(this.elementsCache[query] || this.el.querySelectorAll(query));

                    if (!this.elementCache[query] && elements.length) {
                        this.elementCache[query] = elements;
                    }

                    return elements;
                }

                return this.el;
            }

            // Prop related methods.
        }, {
            key: "getDefaultProps",
            value: function getDefaultProps() {
                return {};
            }
        }, {
            key: "_setProp",
            value: function _setProp(propName, propVal) {
                this.props[propName] = propVal;
            }
        }, {
            key: "getProp",
            value: function getProp(propName) {
                return this.props[propName];
            }
        }, {
            key: "hasProp",
            value: function hasProp(propName) {
                return _isDefined(this.props[propName]);
            }

            // State related methods.
        }, {
            key: "getInitialStates",
            value: function getInitialStates() {
                return {};
            }
        }, {
            key: "setState",
            value: function setState(stateName, stateVal) {
                this.states[stateName] = stateVal;
            }
        }, {
            key: "getState",
            value: function getState(stateName) {
                return this.states[stateName];
            }

            // Event System
        }, {
            key: "on",
            value: function on(event, listener) {
                var targetArray = this.observers[event] || (this.observers[event] = []);

                return targetArray.push(listener);
            }

            // ToDo: Support for multiple arguments.
        }, {
            key: "trigger",
            value: function trigger(event, data) {
                var value = undefined;
                var key = undefined;

                for (value = this.observers[event], key = 0; value && key < value.length;) {
                    value[key++](data);
                }
            }
        }, {
            key: "off",
            value: function off(event, listener) {
                var value = undefined;
                var key = undefined;

                for (value = this.observers[event] || []; listener && (key = value.indexOf(listener)) > -1;) {
                    value.splice(key, 1);
                }

                this.observers[event] = listener ? value : [];
            }
        }, {
            key: "extend",
            value: function extend(instance, mixinObject) {
                for (var _name in mixinObject) {
                    var mixinFunction = mixinObject[_name];

                    if (_isFunction(mixinFunction)) {
                        // ToDo: __proto__ shouldn't be used, find a better way to mixin functionality into ES6 classes.
                        if (!instance.__proto__.hasOwnProperty(_name)) {
                            instance.__proto__[_name] = mixinFunction;
                        }
                    }
                }
            }
        }]);

        return Component;
    })();

    return {
        Component: Component,
        propTypes: propTypes
    };
});
/* NodeProto 1.0.5 | @license MIT */
