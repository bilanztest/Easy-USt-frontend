define(function(require) {

  "use strict";

  var $ = require("jquery");
  var Backbone = require("backbone");
  var EAU = require("app/ns");

  /**
   *
   *
   *
   */
  var User = Backbone.Model.extend({
    url: "/api/user/me",
    defaults: {
      lastName: "",
      firstName: "",
      companyType: "",
      legalForm: "",
      street: "",
      streetNumber: "",
      zipCode: "",
      city: "",
      taxNumber: ""
    },

    initialize: function() {
      var data;

      // read user info from localStorage
      if (EAU.features.localStorage) {
        data = localStorage.getItem("user");

        if (data) {
          data = JSON.parse(data);
        }
        
        // sync changes to localStorage
        this.on("sync", this.onSync, this);
      }

      console.log("User data", data);
      if (typeof data === "undefined" || data === null) {
        data = {};
      }

      this.set(data);
    },

    isLoggedIn: function() {
      return !!this.get("token");
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

    onSync: function() {
      // don't save pwd to localStorage
      this.unset("pwd", {silent: true});

      if (this.isLoggedIn()) {
        localStorage.setItem("user", JSON.stringify(this.toJSON()));
      }
    }
  }); // end User


  return User;
});