define(function(require) {

  "use strict";

  var _ = require("underscore");
  var query = require("app/utils/query");
  var Backbone = require("backbone");
  var sync = Backbone.sync;

  window.EAU = window.EAU || {};
  window.EAU.config = {};

  // global event pipeline
  window.EAU.vent = _.extend({}, Backbone.Events);

  // feature detection flags
  window.EAU.features = require("app/utils/features");

  // override BB's sync
  Backbone.sync = function(method, model, options) {
    options.beforeSend = function (xhr, settings) {
      var q = query.parse(settings.url),
        token = window.EAU.user.get("token");

      if (typeof token !== "undefined") {
        q.set("token", token);
        settings.url += q.toString(true);
      }
    };
    sync(method, model, options);
  };

  return window.EAU;
});