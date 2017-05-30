const inherit = require('..');

describe('Base', function () {
    test('Is Function', function() {
        expect(typeof inherit).toBe('function');
    });
});

describe('Instance', function () {
    test('Instance empty', function() {
        var A = inherit();
        expect(new A).toBeInstanceOf(A);
    });

    test('Instance properties', function() {
        var A = inherit({
            __constructor : function(val) {
                this.prop = val;
            }
        });
        expect(new A('test').prop).toBe('test');
        expect(new A('other').prop).toBe('other');
    });

    test('Instance of', function() {
        var A = inherit({});
        var B = inherit(A, {});
        
        expect(new A()).toBeInstanceOf(A);
        expect(new A()).not.toBeInstanceOf(B);
        expect(new B()).toBeInstanceOf(A);
        expect(new B()).toBeInstanceOf(B);
    });

    test('Instance of constructor result', function() {
        var A = inherit({});
        var B = inherit({
            __constructor : function() {
                return new A();
            }
        });
        
        expect(new B()).toBeInstanceOf(A);
    });

    test('Instance of self', function() {
        var A = inherit({
            method : function () {
                return 'A';
            }
        });
        var B = inherit({
            propB : 'B'
        });
        var C = inherit.self([A, B, { propExtend: 'E' }], {
            prop : 'C',
            method : function () {
                return {
                    base : this.__base(),
                    mix : [
                        this.propB,
                        this.propExtend,
                    ],
                };
            }
        });

        expect(new C().method()).toEqual({
            "base": "A",
            "mix": [
                "B",
                "E",
            ]
        });
    });
});

describe('Inherit', function () {
    test('Self', function() {
        var A = inherit({});
        var B = inherit(A, {});

        expect(new A().__self).toBe(A);
        expect(new B().__self).toBe(B);
    });   

    test('Base inherit', function() {
        var A = inherit({
            method1 : function() {
                return 'A';
            }
        });
        var B = inherit(A, {
            method2 : function () {
                return 'B';
            }
        });

        expect(typeof new A().method2).toBe('undefined');
        expect(new B().method1()).toBe('A');
    });

    test('Inherit from plane function', function() {
        var A = function(val) {
            this.prop = val;
        };
        var B = inherit(A, {});

        expect(new B()).toBeInstanceOf(A);
        expect(new B('val').prop).toBe('val');
    });

    test('Inherit and base call from plane function', function() {
        var A = function(val) {
            this.prop = val;
        };
        var B = inherit(A, {
            __constructor : function() {
                this.__base('fromB');
            }
        });

        expect(new B()).toBeInstanceOf(A);
        expect(new B().prop).toBe('fromB');
    });

    test('Static inherit', function() {
        var A = inherit({}, {
            method1 : function() {
                return 'A';
            }
        });
        var B = inherit(A, {}, {
            method2 : function() {
                return 'B';
            }
        });

        expect(typeof A.method2).toBe('undefined');
        expect(B.method1()).toBe('A');
    });
});

describe('Override', function () {
    test('Override method', function() {
        var A = inherit({
            method : function() {
                return 'A';
            }
        });
        var B = inherit(A, {
            method : function() {
                return 'B';
            }
        });

        expect(new A().method()).toBe('A');
        expect(new B().method()).toBe('B');
    });

    test('Override static method', function() {
        var A = inherit({}, {
            method : function() {
                return 'A';
            }
        });
        var B = inherit(A, {}, {
            method : function() {
                return 'B';
            }
        });

        expect(A.method()).toBe('A');
        expect(B.method()).toBe('B');
    });

    test('Override base', function() {
        var A = inherit({
            method1 : function() {
                return 'A';
            }
        });
        var B = inherit(A, {
            method1 : function() {
                return this.__base() + 'B';
            },
            method2 : function() {
                return this.__base() + 'B2';
            }
        });

        expect(new B().method1()).toBe('AB');
        expect(new B().method2()).toBe('undefinedB2');
    });

    test('Override static base', function() {
        var A = inherit({}, {
            staticMethod : function() {
                return 'A';
            }
        });
        var B = inherit(A, {}, {
            staticMethod : function() {
                return this.__base() + 'B';
            }
        });

        expect(B.staticMethod()).toBe('AB');
    });
});

describe('Mixin', function () {
    test('Object mixin', function () {
        var A = inherit();
        var M = {
            methodM : function() {
                return 'M';
            }
        };
        var B = inherit([A, M]);

        expect(new B().methodM()).toBe('M');
    });
    
    test('Function mixin', function () {
        var A = inherit();
        var M = inherit({
            methodM : function() {
                return 'M';
            }
        });
        var B = inherit([A, M]);

        expect(new B().methodM()).toBe('M');
        expect(new B().__self).toBe(B);
    });

    test('Function mixin static', function () {
        var A = inherit();
        var M = inherit({}, {
            staticMethodM : function() {
                return 'M';
            }
        });
        var B = inherit([A, M]);

        expect(B.staticMethodM()).toBe('M');
    });
});

describe('Mocking', function () {
    test('Base mocking', function () {
        var A = inherit({
            m : function() {
                return 'A';
            }
        });
        var B = inherit(A, {
            m : function() {
                return this.__base() + 'B';
            }
        });

        B.prototype.m.__base = function() { return 'C'; };

        var b = new B();

        expect(b.m()).toBe('CB');
    });
});

describe("Use cases", function() {
    test('Example from docs', function () {
        // base "class"
        var A = inherit(/** @lends A.prototype */{
            __constructor : function(property) { // constructor
                this.property = property;
            },

            getProperty : function() {
                return this.property + ' of instanceA';
            },

            getType : function() {
                return 'A';
            },

            getStaticProperty : function() {
                return this.__self.staticProperty; // access to static
            }
        },/** @lends A */ {
            staticProperty : 'staticA',

            staticMethod : function() {
                return this.staticProperty;
            }
        });

        // inherited "class" from A
        var B = inherit(A, /** @lends B.prototype */{
            getProperty : function() { // overriding
                return this.property + ' of instanceB';
            },

            getType : function() { // overriding + "super" call
                return this.__base() + 'B';
            }
        }, /** @lends B */ {
            staticMethod : function() { // static overriding + "super" call
                return this.__base() + ' of staticB';
            }
        });

        // mixin M
        var M = inherit({
            getMixedProperty : function() {
                return 'mixed property';
            }
        });

        // inherited "class" from A with mixin M
        var C = inherit([A, M], {
            getMixedProperty : function() {
                return this.__base() + ' from C';
            }
        });

        var instanceOfB = new B('property');

        expect(instanceOfB.getProperty()).toBe('property of instanceB');
        expect(instanceOfB.getType()).toBe('AB');
        expect(B.staticMethod()).toBe('staticA of staticB');

        var instanceOfC = new C();

        expect(instanceOfC.getMixedProperty()).toBe('mixed property from C');
        expect(instanceOfC.getType()).toBe('A');
    });

    test('Inherited functions with private variables', function () {
        var A = inherit(function () {
            var _privateVariable = 1;
            this.method = function () {
                return _privateVariable + 2;
            };
        });
        var B = inherit(A, {
            __constructor : function () {
                this.__base.apply(this, arguments);
                var _privateVariable = 9;
                this.method = function () {
                    return _privateVariable + 2;
                };
            }
        });

        expect(new A().method()).toBe(3);
        expect(new B().method()).toBe(11);
    });
});
