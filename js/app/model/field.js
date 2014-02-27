define(function(require) {

  "use strict";

  var Backbone = require("backbone");

  /**
   *
   *
   *
   */
  var Field = Backbone.Model.extend({
    initialize: function(attributes, options) {
      this.url = "/api/field?token=" + options.token;
    }
  }); // end Field


  return Field;
});