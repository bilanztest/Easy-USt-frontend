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

    initialize: function() {
      this.url = "/api/fields";
    }
  }); // end Fields


  return Fields;
});