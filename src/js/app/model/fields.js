define(function(require) {

  "use strict";

  var Backbone = require("backbone");
  var Field = require("app/model/field");

  var Bloodhound = require("bloodhound");

  /**
   *
   *
   *
   */
  var Fields = Backbone.Collection.extend({
    model: Field,
    url: "/api/field",
    comparator: "booked",
    isFetched: false,

    initialize: function() {
      this.on("reset", this.onReset, this);
      this.on("add", this.onAdd, this);
      this.on("change:booked", this.onBookedChange, this);
    },

    onReset: function() {
      this.isFetched = true;

      // create "search engine" for typeahead
      this.engine = new Bloodhound({
        name: "main",
        local: this.toJSON(),
        datumTokenizer: function(d) {
          return Bloodhound.tokenizers.whitespace(d.description);
        },
        queryTokenizer: Bloodhound.tokenizers.whitespace
      });
      this.engine.initialize();
    },

    onAdd: function(model) {
      this.engine.add([model.toJSON()]);
    },

    onBookedChange: function(model) {
      this.sort();
    },

    getFieldsByRangeAndType: function(start, end, type) {
      return this.filter(function(model) {
        return model.get("type") === type &&
              model.get("booked") >= start.toDate() &&
              model.get("booked") < end.toDate();
      });
    }
    
  }); // end Fields

  return Fields;
});