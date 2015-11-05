var buildTools = require('@reduct/build-tools');
var chai = buildTools.chai;
var DOM = buildTools.mock;
var spies = buildTools.spies;
var DefaultComponent = require('./../ExampleComponents/Dist/Default.js');
var ComponentWithoutDefaults = require('./../ExampleComponents/Dist/WithoutDefaults.js');
var expect = chai.expect;

chai.use(spies);

describe('@reduct/component: State API', function () {
    var instance;

    beforeEach(function () {
        instance = new DefaultComponent();
    });

    it('should return undefined if no state was set.', function () {
        expect(instance.getState('anotherState')).to.be.undefined;
    });

    it('should return the value of a state which was previously set.', function () {
        instance.setState({ 'myState': 2 });

        expect(instance.getState('myState')).to.equal(2);
    });

    it('should fire an general change event if any state was set.', function () {
        const eventCallback = chai.spy(function (payload) { });

        instance.on('change', eventCallback);

        instance.setState({ 'myState': 2 });

        expect(eventCallback).to.have.been.called.with({
            delta: {
                'myState': 2
            },
            previousState: {
                'myState': 1
            }
        });
    });

    it('should fire a specific change event if a state was set.', function () {
        const eventCallback = chai.spy(function (payload) { });

        instance.on('change:myState', eventCallback);

        instance.setState({ 'myState': 2 });

        expect(eventCallback).to.have.been.called.with({
            key: 'myState',
            value: 2,
            previousValue: 1
        });
    });

    it('should not fire change events if the silent option is true.', function () {
        const eventCallback = chai.spy(function (payload) { });

        instance.on('change:myState', eventCallback);
        instance.on('change', eventCallback);

        instance.setState({
            myState: 2
        }, {
            silent: true
        });

        expect(eventCallback).to.not.have.been.called();
    });

    it('should return the initial state if present.', function () {
        expect(instance.getState('myState')).to.equal(1);
    });

    it('should return an empty object if no getInitialState() method was present.', function () {
        var instanceWithoutDefaults = new ComponentWithoutDefaults();

        expect(instanceWithoutDefaults.getInitialState()).to.be.an('object');
    });

    it('should only set state diffs if each key was described in the getInitialState() method.', function () {
        var instanceWithoutDefaults = new ComponentWithoutDefaults();

        expect(function callGetWithoutHavingRegisteredTheRequestedItem () {
            instanceWithoutDefaults.setState({ myState: 2 });
        }).to.throw("@reduct/component Error: Please specify an initial value for 'myState' in your getInitialState() method.");

        expect(instanceWithoutDefaults.getState('myState')).to.be.undefined;
    });

    afterEach(function () {
        instance = null;
    });
});
