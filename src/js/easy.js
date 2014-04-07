require.config({
  paths:{
    jquery: "vendor/jquery.2.1.0",
    underscore: "vendor/lodash.compat.2.4.1",
    backbone: "vendor/backbone.1.1.2",
    
    react: "vendor/react.0.9.0",
    JSXTransformer: "vendor/plugins/JSXTransformer.0.9.0",

    validator: "vendor/validator.3.4.0",

    text: "vendor/plugins/require.text.2.0.10",
    jsx: "vendor/plugins/require.jsx.0.1.0"
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
    "app/model/user",
    "jsx!app/view/base",
    "react",
    "app/utils/polyfills"
  ],
  function (EAU, User, BaseView, React, polyfills) {
    "use strict";

    EAU.user = new User();
    React.renderComponent(BaseView(), document.getElementById("page"));
  }
);
