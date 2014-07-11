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
    url: "/api/user",
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

      // read user info from sessionStorage
      if (EAU.features.sessionStorage) {
        data = sessionStorage.getItem("user");

        if (data) {
          data = JSON.parse(data);
        }
        
        // sync changes to sessionStorage
        this.on("sync", this.onSync, this);
        this.on("change", this.onSync, this);
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
        url: "/api/token",
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

        if (EAU.features.sessionStorage) {
          sessionStorage.setItem("user", JSON.stringify(userData));
        }

      }).fail(function() {
        console.log("FAIL", arguments);
      });
    },

    logout: function() {
      // TODO also tell backend about logout
      if (EAU.features.sessionStorage) {
        sessionStorage.removeItem("user");
      }
      this.clear();

      EAU.vent.trigger("goto", "login");
    },

    onSync: function() {
      var data = this.toJSON();

      console.log("USER onSync", data);

      // don't save pwd to sessionStorage
      delete data.pwd;

      if (this.isLoggedIn()) {
        sessionStorage.setItem("user", JSON.stringify(data));
      }
    }
  }); // end User


  return User;
});