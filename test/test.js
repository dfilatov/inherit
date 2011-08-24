var inherit = require('../index.js').inherit;

exports.testIsFunction = function(test) {

    test.ok(typeof inherit == 'function');
    test.done();

};

exports.testInstanceProperties = function(test) {

    var A = inherit({
        __constructor : function(val) {
            this.prop = val;
        }
    });

    test.ok(new A('test').prop == 'test');
    test.done();

};

exports.testBaseMethod = function(test) {

    var A = inherit({
            method : function() {
                return 'A';
            }
        }),
        B = inherit(A, {
            method : function() {
                return this.__base() + 'B';
            }
        });

    test.ok(new B().method() === 'AB');
    test.done();

};

exports.testStaticBaseMethod = function(test) {

    var A = inherit({}, {
            staticMethod : function() {
                return 'A';
            }
        }),
        B = inherit(A, {}, {
            staticMethod : function() {
                return this.__base() + 'B';
            }
        });

    test.ok(B.staticMethod() === 'AB');
    test.done();

};