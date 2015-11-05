"use strict";

function _isDefined(val) {
    return val !== null && val !== undefined;
}

module.exports = function (propValue) {
    var isPropInProps = _isDefined(propValue);

    return {
        result: isPropInProps,
        value: propValue
    };
};