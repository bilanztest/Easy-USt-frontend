define(function(require) {

  "use strict";

  var $ = require("jquery");
  var _ = require("underscore");
  var utils = require("app/utils/misc");
  
  var Backbone = require("backbone");
  var backboneSync = Backbone.sync;

  window.EAU = window.EAU || {};
  window.EAU.config = {};

  // global event pipeline
  window.EAU.vent = _.extend({}, Backbone.Events);

  // feature detection flags
  window.EAU.features = require("app/utils/features");

  // override BB's sync
  Backbone.sync = function sync(method, model, options) {
    var lastMethod = method,
      lastModel = model,
      lastOptions = utils.clone(options);

    // TODO check for already existing beforeSend method !?
    options.beforeSend = function(xhr, settings) {
      var token = window.EAU.user.get("token");

      if (typeof token !== "undefined") {
        xhr.setRequestHeader("Authorization", "Bearer " + token);
      }
    };

    options.error = function(xhr, textStatus, message) {
      var auth = xhr.getResponseHeader("Authorization");

      if (auth === "reissue") {
        $.ajax({
          url: "/api/token",
          type: "PUT",
          beforeSend: options.beforeSend,
          contentType: "application/json; charset=utf-8",
          dataType: "json"
        }).done(function(data) {
          // save new token and retry sync
          window.EAU.user.set("token", data.token);
          sync(lastMethod, lastModel, lastOptions);

        }).fail(function() {
          console.error("refresh of token failed");
          window.EAU.user.logout();
        });
      
      } else {
        window.EAU.user.logout();
      }
    };

    backboneSync(method, model, options);
  };

  return window.EAU;
});