/* NodeProto 1.0.5 | @license MIT */

(function(global, factory) {
    'use strict';

    // If the env is browserify, export the factory using the module object.
    if (typeof module === "object" && typeof module.exports === "object") {
        module.exports = factory(global);

    // If the env is AMD, register the Module as 'componentprototype'.
    } else if (global.define && typeof global.define === "function" && global.define.amd) {
        global.define("nodeProto", [], function() {
            return factory(global);
        });

    // If the env is a browser(without CJS or AMD support), export the factory into the global window object.
    } else {
        global.nodeProto = factory(global);
    }
}(window, function(global) {
    'use strict';

    const doc = global.document;
    const isScriptExecutedByNode = process && process.title && process.title.indexOf('node') > -1;

    function _isFunction(func) {
        return typeof func === 'function';
    }

    function _isNumeric(num){
        return !isNaN(num);
    }

    function _isBoolean(bol){
        return typeof bol === 'boolean' || bol === 'true' || bol === 'false';
    }

    function _isObject(obj){
        return typeof obj === 'object';
    }

    function _isString(str) {
        return typeof str === 'string';
    }

    function _isDefined(val) {
        return val !== null && val !== undefined;
    }

    const propTypes = {
        isRequired: (propValue, propName, el) => {
            const isPropInProps = _isDefined(propValue);

            if(!isPropInProps) {
                logger.error('The prop "' + propName + '" is required and wasn‘t found on: ', el);
            }

            return {
                result: isPropInProps,
                value: propValue
            };
        },
        isOptional: (propValue, propName, el) => {
            const isPropInProps = _isDefined(propValue);

            if(!isPropInProps) {
                logger.info('The prop "' + propName + '" is optional and wasn‘t found on: ', el);
            }

            return {
                result: true,
                value: propValue
            };
        },
        isString: {
            isRequired: (propValue, propName, el) => {
                const isString = _isString(propValue);
                let result = true;

                propTypes.isRequired.apply(this, arguments);

                if (!isString) {
                    logger.error('The prop "' + propName + '" is not a string. ', el);
                    result = false;
                }

                return {
                    result: result,
                    value: propValue
                };
            },
            isOptional: (propValue, propName, el) => {
                const isString = _isString(propValue);
                let result = true;

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
            isRequired: (propValue, propName, el) => {
                const isBoolean = _isBoolean(propValue);
                let result = true;

                propTypes.isRequired.apply(this, arguments);

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
            isOptional: (propValue, propName, el) => {
                const isBoolean = _isBoolean(propValue);
                let result = true;

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
            isRequired: (propValue, propName, el) => {
                const isNumber = _isNumeric(propValue);
                let result = true;

                // Since The prop is required, check for it's value beforehand.
                propTypes.isRequired.apply(this, arguments);

                if(!isNumber) {
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
            isOptional: (propValue, propName, el) => {
                const isNumber = _isNumeric(propValue);
                let result = true;

                if(propValue && !isNumber) {
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
            isRequired: (propValue, propName, el) => {
                let isObject;
                let result = true;

                // Since The prop is required, check for it's value beforehand.
                propTypes.isRequired.apply(this, arguments);

                // If the passed Property is a string, convert it to a JSON object beforehand.
                try {
                    propValue = JSON.parse(propValue);
                } catch(e) {}

                // Verify the type of the value.
                isObject = _isObject(propValue);

                if(!isObject) {
                    logger.error('The prop "' + propName + '" is not an valid JSON object. ', el);
                    result = false;
                }

                return {
                    result: result,
                    value: propValue
                };
            },
            isOptional: (propValue, propName, el) => {
                let isObject;
                let result = true;
                let isPropValueDefined = _isDefined(propValue);

                // If the passed Property is a string, convert it to a JSON object beforehand.
                try {
                    propValue = JSON.parse(propValue);
                } catch(e) {}

                // Verify the type of the value.
                isObject = _isObject(propValue);

                if(isPropValueDefined && !isObject) {
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

    const logger = {
        // 2: Every message is displayed
        // 1: Only severe messages are displayed
        // 0: No messages are displayed
        _logLevel: 2,
        setLogLevel: (int) => {
            logger._logLevel = _isNumeric(int) ? int : 2;
        },

        log: (message, targetElement = '') => {
            if(logger._logLevel <= 2) {
                return;
            }

            try {
                console.log('NodeProto: ' + message, targetElement);
            } catch(e) {}
        },
        info: (message, targetElement = '') => {
            if(logger._logLevel <= 2) {
                return;
            }

            try {
                console.info('NodeProto Info: ' + message, targetElement);
            } catch(e) {}
        },
        warn: (message, targetElement = '') => {
            if(logger._logLevel <= 1) {
                return;
            }

            try {
                console.warn('NodeProto Warning: ' + message, targetElement);
            } catch(e) {}
        },
        error: (message, targetElement = '') => {
            if(logger._logLevel <= 0) {
                return;
            }

            try {
                console.error('NodeProto Error: ' + message, targetElement);
            } catch(e) {}
        }
    };

    if(isScriptExecutedByNode) {
        logger.setLogLevel(0);
    }

    class Component {
        constructor(element, opts) {
            // Fail-Safe mechanism if someone is passing an array or the like as a second argument.
            opts = _isObject(opts) ? opts : {};

            if(!_isDefined(element)) {
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

        _validateAndSetProps(propTypes) {
            const el = this.el;
            const _passedProps = this._passedProps;
            const _defaultProps = this.getDefaultProps();
            const defaultProps = _isObject(_defaultProps) ? _defaultProps : {};

            for (let propName in propTypes) {
                const propValue = _passedProps[propName] || el.getAttribute('data-' + propName.toLowerCase()) || defaultProps[propName];
                const validator = propTypes[propName];
                const validatorResults = validator(propValue, propName, el);

                if(validatorResults.result) {
                    this._setProp(propName, validatorResults.value);
                }
            }
        }

        _setInitialStates() {
            const _initialStates = this.getInitialStates();
            const initialStates = _isObject(_initialStates) ? _initialStates : {};

            for (let stateKey in initialStates) {
                const value = initialStates[stateKey]

                this.setState(stateKey, value);
            }
        }

        getElement(query) {
            if ('string' === typeof query) {
                let elements = [].slice.call(this.elementsCache[query] || this.el.querySelectorAll(query));

                if (!this.elementCache[query] && elements.length) {
                    this.elementCache[query] = elements;
                }

                return elements;
            }

            return this.el;
        }

        // Prop related methods.
        getDefaultProps() {
            return {};
        }

        _setProp(propName, propVal) {
            this.props[propName] = propVal;
        }

        getProp(propName) {
            return this.props[propName];
        }

        hasProp(propName) {
            return _isDefined(this.props[propName]);
        }

        // State related methods.
        getInitialStates() {
            return {};
        }

        setState(stateName, stateVal) {
            this.states[stateName] = stateVal;
        }

        getState(stateName) {
            return this.states[stateName];
        }

        // Event System
        on(event, listener) {
            const targetArray = this.observers[event] || (this.observers[event] = []);

            return targetArray.push(listener);
        }

        // ToDo: Support for multiple arguments.
        trigger(event, data) {
            let value;
            let key;

            for (value = this.observers[event], key = 0; value && key < value.length;) {
                value[key++](data);
            }
        }

        off(event, listener) {
            let value;
            let key;

            for (value = this.observers[event] || []; listener && (key = value.indexOf(listener)) > -1;) {
                value.splice(key, 1);
            }

            this.observers[event] = listener ? value : [];
        }

        extend(instance, mixinObject) {
            for (let name in mixinObject) {
                let mixinFunction = mixinObject[name];

                if(_isFunction(mixinFunction)) {
                    // ToDo: __proto__ shouldn't be used, find a better way to mixin functionality into ES6 classes.
                    if (!instance.__proto__.hasOwnProperty(name)) {
                        instance.__proto__[name] = mixinFunction;
                    }
                }
            }
        }
    }

    return {
        Component: Component,
        propTypes: propTypes
    };
}));
