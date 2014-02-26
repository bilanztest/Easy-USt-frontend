require.config({
  paths:{
    plugins: "vendor/plugins",

    jquery: "vendor/jquery.2.1.0",
    underscore: "vendor/lodash.compat.2.4.1",
    backbone: "vendor/backbone.1.1.2",

    text: "vendor/plugins/require.text.2.0.10"
  },

  shim:{
    "backbone": {
      deps: ["underscore", "jquery"],
      exports: "Backbone"
    },

    "underscore": {
      exports: "_"
    }
  }
});

require(
  [
    "app/ns",
    "app/router",
    "backbone"
  ],
  function (EAU, Router, Backbone) {
    "use strict";

    EAU.router = new Router();
    Backbone.history.start({pushState: true});
  }
);
