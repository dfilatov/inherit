Node-inherit
============

Inheritance module for node

Installing
------------
    npm install inherit

Usage
------------
    inherit([baseClass], props, [staticProps]);
    
Example
------------
    var inherit = require('inherit');

    // base "class"
    var A = inherit(/** @lends A.prototype */{
        __constructor : function(property) {
            this.property = property;
        },

        getProperty : function() {
            return this.property + ' of instanceA';
        },
        
        getType : function() {
            return 'A';
        },

        getStaticProperty : function() {
            return this.__self.staticMember; // access to static
        }
    }, /** @lends A */ {    
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
        
        getType : function() { // overriding + superCall
            return this.__base() + 'B';
        }
    }, /** @lends B */ {
        staticMethod : function() { // static overriding + superCall
            return this.__base() + ' of staticB';
        }
    });
    
    var instanceOfB = new B('property');
    
    instanceOfB.getProperty(); // return 'property of instanceB'
    instanceOfB.getType(); // return 'AB'
    B.staticMethod() // return 'staticA of staticB'
