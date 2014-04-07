define(function(require) {

  "use strict";

  var _ = require("underscore");
  var $ = require("jquery");

  /**
   *
   *
   *
   */
  var Query = function(queryString) {
    var params = {},
      regex = /([^&=]+)=([^&]*)/g,
      pos = queryString.indexOf("?"),
      m;

    if (pos >= 0) {
      queryString = queryString.substring(pos + 1);
    }

    do {
      if (_.isArray(m)) {
        params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
      }
      
      m = regex.exec(queryString);
    } while (m);

    return {
      remove: function(key) {
        delete params[key];
      },
      get: function(key) {
        return params[key];
      },
      set: function(key, value) {
        params[key] = value;
      },
      toString: function(includeQuestionmark) {
        var str = "";

        includeQuestionmark = includeQuestionmark || false;
        if (includeQuestionmark) {
          str += "?";
        }

        return str + $.param(params);
      }
    };
  };

  return {
    parse: function(queryString) {
      return new Query(queryString);
    }
  };

});