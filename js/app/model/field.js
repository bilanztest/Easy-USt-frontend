define(function(require) {

  "use strict";

  var Backbone = require("backbone");
  var EAU = require("app/ns");

  /**
   *
   *
   *
   */
  var Field = Backbone.Model.extend({
    initialize: function(attributes, options) {
      this.url = "/api/field?token=" + EAU.user.get("token");
    }
  }); // end Field


  return Field;
});