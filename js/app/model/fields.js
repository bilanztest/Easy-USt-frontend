define(function(require) {

  "use strict";

  var Backbone = require("backbone");

  var Field = require("app/model/field");

  /**
   *
   *
   *
   */
  var Fields = Backbone.Collection.extend({
    model: Field,

    initialize: function(options) {
      this.url = "/api/fields?token=" + options.get("token");
    },

    onSync: function(model, response) {
      console.log("onSync()", model, response);

    }
  }); // end Fields


  return Fields;
});