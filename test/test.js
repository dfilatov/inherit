var inherit = require('..');

exports.testIsFunction = function(test) {

    test.equal(typeof inherit, 'function');
    test.done();

};

exports.testInstanceProperties = function(test) {

    var A = inherit({
        __constructor : function(val) {
            this.prop = val;
        }
    });

    test.equal(new A('test').prop, 'test');
    test.equal(new A('other').prop, 'other');
    test.done();

};

exports.testInstanceOf = function(test) {

    var A = inherit({}),
        B = inherit(A, {});

    test.ok(new A() instanceof A);
    test.ok(!(new A() instanceof B));
    test.ok(new B() instanceof A);
    test.ok(new B() instanceof B);
    test.done();

};

exports.testSelf = function(test) {

    var A = inherit({}),
        B = inherit(A, {});

    test.strictEqual(new A().__self, A);
    test.strictEqual(new B().__self, B);
    test.done();

};

exports.testInherit = function(test) {

    var A = inherit({
            method1 : function() {
                return 'A';
            }
        }),
        B = inherit(A, {
            method2 : function() {
                return 'B';
            }
        });

    test.equal(typeof new A().method2, 'undefined');
    test.equal(new B().method1(), 'A');
    test.done();

};

exports.testStaticInherit = function(test) {

    var A = inherit({}, {
            method1 : function() {
                return 'A';
            }
        }),
        B = inherit(A, {}, {
            method2 : function() {
                return 'B';
            }
        });

    test.equal(typeof A.method2, 'undefined');
    test.equal(B.method1(), 'A');
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

    test.equal(new A().method(), 'A');
    test.equal(new B().method(), 'B');
    test.done();

};

exports.testStaticOverride = function(test) {

    var A = inherit({}, {
            method : function() {
                return 'A';
            }
        }),
        B = inherit(A, {}, {
            method : function() {
                return 'B';
            }
        });

    test.equal(A.method(), 'A');
    test.equal(B.method(), 'B');
    test.done();

};

exports.testBase = function(test) {

    var A = inherit({
            method1 : function() {
                return 'A';
            }
        }),
        B = inherit(A, {
            method1 : function() {
                return this.__base() + 'B';
            },
            method2 : function() {
                return this.__base() + 'B2';
            }
        });

    test.equal(new B().method1(), 'AB');
    test.equal(new B().method2(), 'undefinedB2');
    test.done();

};

exports.testStaticBase = function(test) {

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

    test.equal(B.staticMethod(), 'AB');
    test.done();

};