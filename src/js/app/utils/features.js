define(function(require) {

  "use strict";

  /**
   *
   *
   */
  var FeatureDetection = function() {

    // http://diveintohtml5.info/everything.html
    var detectHTML5History = function() {
      return !!(window.history && window.history.pushState);
    };

    // https://github.com/Modernizr/Modernizr/blob/master/feature-detects/storage-localstorage.js
    var detectLocalStorage = function() {
      var mod = "localStorageCheck";

      try {
        localStorage.setItem(mod, mod);
        localStorage.removeItem(mod);
        return true;
      
      } catch (e) {
        return false;
      }
    };


    return {
      history: detectHTML5History(),
      localStorage: detectLocalStorage()
    };
  };

  return new FeatureDetection();
});