define(function (require) {

  "use strict";

  window.EAU = window.EAU || {};
  window.EAU.config = {
    
  };

  // feature detection flags
  window.EAU.features = require("app/utils/features");

  return window.EAU;
});