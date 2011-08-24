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
    test.ok(new A('other').prop == 'other');
    test.done();

};

exports.testInstanceOf = function(test) {

    var A = inherit({}),
        B = inherit(A, {});

    test.ok(new A() instanceof A);
    test.ok(new B() instanceof A);
    test.ok(new B() instanceof B);
    test.done();

};

exports.testSelfFromInstance = function(test) {

    var A = inherit({}),
        B = inherit(A, {});

    test.ok(new A().__self === A);
    test.ok(new B().__self === B);
    test.done();

};


exports.testOverride = function(test) {

    var A = inherit({
        method : function() {
            return 'A';
        }
    }),
    B = inherit(A, {
        method : function() {
            return 'B';
        }
    });

    test.ok(new B().method() === 'B');
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