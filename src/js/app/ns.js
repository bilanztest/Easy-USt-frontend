define(function (require) {

  "use strict";

  var _ = require("underscore");
  var Backbone = require("backbone");

  window.EAU = window.EAU || {};
  window.EAU.config = {
    
  };

  // global event pipeline
  window.EAU.vent = _.extend({}, Backbone.Events);

  // feature detection flags
  window.EAU.features = require("app/utils/features");

  return window.EAU;
});