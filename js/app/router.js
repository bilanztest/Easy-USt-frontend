define(function(require) {

  "use strict";

  var $ = require("jquery");
  var Backbone = require("backbone");
  var EAU = require("app/ns");

  /**
   *
   *
   *
   */
  var Router = Backbone.Router.extend({
    routes: {
      "*default": "defaultAction"
    },
 
    defaultAction: function() {
      console.log("Hello, world.");
    }
  }); // end Router


  return Router;
});
