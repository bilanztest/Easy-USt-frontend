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
      "show": "show",
      "login": "login",
      "logout": "logout",
      "register": "register",
      "about": "about",
      "settings": "settings",
      "*error": "404"
    }
  }); // end Router


  return Router;
});
