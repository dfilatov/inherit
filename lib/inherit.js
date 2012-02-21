var util = require('util'),
    emptyFn = function() {};

function extend(o1, o2) {
    for(var i in o2) {
        o2.hasOwnProperty(i) && (o1[i] = o2[i]);
    }

    return o1;
}

function isFunction(o) {
    return typeof o === 'function';
}

function override(base, res, add) {

    for(var name in add) {
        if(add.hasOwnProperty(name)) {
            var prop = add[name];
            isFunction(prop) && prop.toString().indexOf('.__base') > -1?
                (function(name) {
                    var baseMethod = base[name] || emptyFn;
                    res[name] = function() {
                        var _this = this,
                            baseSaved = _this.__base;

                        _this.__base = baseMethod;
                        var res = add[name].apply(_this, arguments);
                        _this.__base = baseSaved;
                        return res;
                    };
                })(name) :
                res[name] = prop;
        }
    }

}

module.exports = function() {

    var hasBase = isFunction(arguments[0]),
        base = hasBase? arguments[0] : emptyFn,
        props = arguments[hasBase? 1 : 0] || {},
        staticProps = arguments[hasBase? 2 : 1],
        res = props.__constructor || (hasBase && base.prototype.__constructor)?
            function() {
                return this.__constructor.apply(this, arguments);
            } :
            function() {};

    if(!hasBase) {
        (res.prototype = props).__self = res;
        return extend(res, staticProps);
    }

    util.inherits(extend(res, base), base);

    var resPtp = res.prototype;
    resPtp.__self = res;

    override(base.prototype, resPtp, props);
    staticProps && override(base, res, staticProps);

    return res;

};