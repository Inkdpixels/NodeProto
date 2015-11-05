var buildTools = require('@reduct/build-tools');
var validator = require('./../ExampleComponents/Dist/Validator.js');
var DefaultComponent = require('./../ExampleComponents/Dist/Default.js');
var ComponentWithoutDefaults = require('./../ExampleComponents/Dist/WithoutDefaults.js');
var chai = buildTools.chai;
var DOM = buildTools.mock;
var expect = chai.expect;

describe('@reduct/component: Prop API', function () {
    it('should return undefined if no prop was set.', function () {
        var instance = new DefaultComponent();

        expect(instance.getProp('myProp')).to.undefined;
    });

    it('should check if a prop is present.', function () {
        var instance = new DefaultComponent();

        expect(instance.hasProp('myProp')).to.false;
    });

    it('should return the value of a state which was previously set.', function () {
        var instance = new DefaultComponent();

        instance.setState({ 'myState': 2 });

        expect(instance.getState('myState')).to.equal(2);
    });

    it('should validate and set the passed props when propTypes are given.', function () {
        var instance = new DefaultComponent(null, {
            'props': {
                'myProp': 2
            },
            'propTypes': {
                'myProp': validator
            }
        });

        expect(instance.getProp('myProp')).to.equal(2);
    });

    it('should validate and set values of the elements dataset when propTypes are given.', function () {
        var element = document.createElement('div');
        var instance;

        element.setAttribute('data-myprop', 'value');

        instance = new DefaultComponent(element, {
            'propTypes': {
                'myProp': validator
            }
        });

        expect(instance.getProp('myProp')).to.equal('value');
    });

    it('should fall back to the getDefaultProps() method when propTypes are given but the prop wasn‘t found in either the passed props or the dataset.', function () {
        var instance = new DefaultComponent(null, {
            'propTypes': {
                'myProp': validator
            }
        });

        expect(instance.getProp('myProp')).to.equal(1);
    });

    it('should return an empty object if no getDefaultProps() method was present.', function () {
        var instanceWithoutDefaults = new ComponentWithoutDefaults();

        expect(instanceWithoutDefaults.getDefaultProps()).to.be.an('object');
    });
});
