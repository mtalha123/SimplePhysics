//Using Universal Module Definition to support RequireJS, CommonJS, and browser globals.
//This piece of code will be added to the beginning of the library when it is built (using the 'wrap' property in the build file)

(function (root, factory) {
    if (typeof define === 'function') {
        define(factory);
    }else if (typeof exports === 'object') {
        module.exports = factory();
    }else {
        root.SimplePhysics = factory();
    }
}(this, function () {