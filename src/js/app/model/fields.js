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
    url: "/api/field"
    
  }); // end Fields

  return Fields;
});