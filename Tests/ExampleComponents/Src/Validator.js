function _isDefined(val) {
    return val !== null && val !== undefined;
}

module.exports = (propValue) => {
    const isPropInProps = _isDefined(propValue);

    return {
        result: isPropInProps,
        value: propValue
    };
};