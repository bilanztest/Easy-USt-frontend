define(function(require) {

  "use strict";

  /**
   *
   *
   *
   */
  
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind
  if (!Function.prototype.bind) {
    Function.prototype.bind = function(oThis) {

      if (typeof this !== "function") {
        // closest thing possible to the ECMAScript 5 internal IsCallable function
        throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
      }

      var aArgs = Array.prototype.slice.call(arguments, 1),
        self = this,
        FNOP = function() {},
        FBound = function() {
          return self.apply(this instanceof FNOP && oThis ? this : oThis,
            aArgs.concat(Array.prototype.slice.call(arguments)));
        };

      FNOP.prototype = this.prototype;
      FBound.prototype = new FNOP();

      return FBound;
    };
  }

  // http://stackoverflow.com/a/8566313/388026
  if (!Object.getOwnPropertyDescriptors) {
    var getOwnPropertyDescriptors = function(object) {
      var keys = Object.getOwnPropertyNames(object),
        returnObj = {},
        getPropertyDescriptor = function(key) {
          returnObj[key] = Object.getOwnPropertyDescriptor(object, key);
        };

      keys.forEach(getPropertyDescriptor);
      return returnObj;
    };
    Object.getOwnPropertyDescriptors = getOwnPropertyDescriptors;
  }
    

  return {};
});