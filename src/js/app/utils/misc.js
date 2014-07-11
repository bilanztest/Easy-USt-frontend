define(function(require) {

  "use strict";

  /**
   *
   *
   *
   */
  var clone = function(obj) {
    // http://stackoverflow.com/a/8566313/388026
    return Object.create(
      Object.getPrototypeOf(obj),
      Object.getOwnPropertyDescriptors(obj)
    );
  };

  return {
    clone: clone
  };

});
