var buildTools = require('@reduct/build-tools');
var DefaultComponent = require('./../ExampleComponents/Dist/Default.js');
var chai = buildTools.chai;
var DOM = buildTools.mock;
var expect = chai.expect;

describe('@reduct/component: Find API', function () {
    beforeEach(function before (done) {
        return DOM.create(DOM.defaultMock, done);
    });

    it('should be capable of returning one child node of the component\'s root node', function () {
        var component = new DefaultComponent();
        var selector = '.foo';
        var node = component.find(selector);

        expect(node).to.not.be.undefined;
        expect(node.nodeName).to.not.be.undefined;

        // Call again in order to check that there is already only one cached item
        component.find(selector);
        expect(Object.keys(component.queryCache).length).to.equal(1);
    });

    it('should be capable of returning multiple child nodes of the component\'s root node', function () {
        var component = new DefaultComponent();
        var selector = '.foo';
        var nodes = component.findAll(selector);

        expect(nodes.length).to.equal(5);

        component.findAll(selector);
        expect(Object.keys(component.queryCache).length).to.equal(1);
    });
});
