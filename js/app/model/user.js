define(function(require) {

  "use strict";

  var Backbone = require("backbone");
  var EAU = require("app/ns");

  /**
   *
   *
   *
   */
  var User = Backbone.Model.extend({
    initialize: function() {
      var data;

      this.on("sync", this.onSync, this);

      // read user info from localStorage
      if (EAU.features.localStorage) {
        data = localStorage.getItem("user");

        if (data) {
          data = JSON.parse(data);
        }
      }

      console.log("User data", data);
      if (typeof data === "undefined" || data === null) {
        data = {};
      }

      this.set(data);
    },

    isLoggedIn: function() {
      return !!this.id;
    },

    login: function(email, pwd) {
      var self = this;

      $.ajax({
        url: "/api/user/auth",
        type: "POST",
        data: JSON.stringify({
          email: email,
          pwd: pwd
        }),
        contentType: "application/json; charset=utf-8",
        dataType: "json"

      }).done(function(data) {
        var userData = data.user;

        userData.token = data.token;
        self.set(userData);

        if (EAU.features.localStorage) {
          localStorage.setItem("user", JSON.stringify(userData));
        }

      }).fail(function() {
        console.log("FAIL", arguments);
      });
      
    },

    logout: function() {
      if (EAU.features.localStorage) {
        localStorage.removeItem("user");
      }
      this.clear();
    },

    onSync: function(model, response) {
      console.log("onSync()", model, response);

    }
  }); // end User


  return User;
});