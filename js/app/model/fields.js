define(function(require) {

  "use strict";

  var Backbone = require("backbone");

  var EAU = require("app/ns");
  var Field = require("app/model/field");

  /**
   *
   *
   *
   */
  var Fields = Backbone.Collection.extend({
    model: Field,

    initialize: function() {
      this.url = "/api/fields?token=" + EAU.user.get("token");
    }
  }); // end Fields


  return Fields;
});