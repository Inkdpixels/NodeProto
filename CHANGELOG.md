# Changelog

## 2.0.0
**Implemented enhancements:**
- Throw a warning if a prop was requested but not value was found.
- Implicitly only allow state changes if the representative key was specified in the getInitialState() method.
- Throw a warning if the return value of the getInitialState method is not an object.
- Less memory consumption for each component.
- Added `.find` and `.findAll` API methods to search for DOM selectors in the components element.
- Add the `previousStateValues` to the state change event arguments.
- Only fire specific change `events` if a state change has really occurred
- Moved the `propTypes` into it's own repository located on https://github.com/reduct/nitpick
- Implemented a `silent` option for the setState method.
- Rewrite of the internal state methods.

## 1.1.1
**Fixed issues:**
- Fixed an issue where the global `process` object is not defined.

## 1.1.0
**Implemented enhancements:**
- Moved the `_setInitialStates` and `_validateAndSetProps` methods out of the class.
- Added documentation for all methods.
- Adjusted the throwing of errors while checking for propTypes.
- Freezed the props object after setting all props to avoid further editing of them.
- The component now triggers events for each state change.
- Removed the `_setProp` method since it is useless and still consumes memory fo each class instance.

**Fixed issues:**
- Fixed the `isBoolean` propType result and value.

**Deprecations:**
- Dropped the extend method since it's behavior was unreliable.

## 1.0.6
**Implemented enhancements:**
- Renamed the package to @reduct/component
- Added a semver oriented version object to the module exports.

## 1.0.5
**Implemented enhancements:**
- Added the `isString` and `isBoolean` propType validators.

## 1.0.4
**Implemented enhancements:**
- Renamed the getInitialState() method (Added an trailing 's').

## 1.0.3
**Implemented enhancements:**
- Reduced the overall number of arguments for the Constructor.
- Added support for the getInitialState method.

## 1.0.2
**Fixed issues:**
- Fixed the name reference for the logger warn function in the constructor.
- Fixed the `_isDefined` util function and the corresponding `isRequired` validator test.

**Implemented enhancements:**
- Added unit test specs for quality ensurance.

## 1.0.1
**Fixed issues:**
- Fixed the return value of the `isNumber.isOptional` propType validator if no argument was passed.

## 1.0.0 (Initial version)
