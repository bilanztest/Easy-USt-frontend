define(function(require) {

  "use strict";

  var Backbone = require("backbone");

  /**
   *
   *
   *
   */
  var Router = Backbone.Router.extend({
    routes: {
      "": "home",
      "test": "test",
      "login": "login",
      "logout": "logout",
      "*error": "404"
    }
  }); // end Router


  return Router;
});
