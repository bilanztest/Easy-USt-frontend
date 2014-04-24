define(function(require) {

  "use strict";

  var Backbone = require("backbone");
  var validator = require("validator");

  /**
   *
   *
   *
   */
  var Field = Backbone.Model.extend({
    parse: function(response) {
      if (!response) {
        return null;
      }

      if (typeof response.value !== "undefined") {
        response.value = parseFloat(response.value);
      }

      if (typeof response.ust !== "undefined") {
        response.ust = parseInt(response.ust, 10);
      }
      
      if (typeof response.booked !== "undefined") {
        response.booked = new Date(response.booked);
      }

      return response;
    },

    validate: function(attributes) {
      var errorFields = [];

      if (!validator.isIn(attributes.type, ["in", "out"])) {
        errorFields.push({fieldRef: "type", msg: "type has to be either 'in' or 'out'"});
      }

      if (!validator.isDate(attributes.booked)) {
        errorFields.push({fieldRef: "booked", msg: "booked has to be a Date"});
      } else {
        if (!validator.isAfter(attributes.booked, new Date(2010))) {
          errorFields.push({fieldRef: "booked", msg: "booked too old"});
        }

        if (!validator.isBefore(attributes.booked, new Date())) {
          errorFields.push({fieldRef: "booked", msg: "no future dates"});
        }
      }

      if (!validator.isLength(attributes.description, 1, 100)) {
        errorFields.push({fieldRef: "desc", msg: "description required but can't be longer than 100 characters"});
      }

      if (!validator.isFloat(attributes.value)) {
        errorFields.push({fieldRef: "value", msg: "value has to be a number"});
      }

      if (attributes.value <= 0 || attributes.value > 1000000) {
        errorFields.push({fieldRef: "value", msg: "value has to be between 0 and 1000000"});
      }
      
      if (!validator.isIn(attributes.ust, [0, 7, 19])) {
        errorFields.push({fieldRef: "ust", msg: "ust has to be either 0, 7 or 19"});
      }

      if (errorFields.length > 0) {
        return errorFields;
      }
    }

  }); // end Field


  return Field;
});