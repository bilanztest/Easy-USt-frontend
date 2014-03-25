define(function(require) {

  "use strict";

  var React = require("react");
  var EAU = require("app/ns");

  /**
   *
   *
   *
   */
  var AccountNavigation = React.createClass({

    render: function() {
      return (
        <div className="eau-acoount-nav">
          {
            (function() {
              if (EAU.user.isLoggedIn()) {
                return (
                  <p>
                    Hello {EAU.user.get("email")}. <a href="/logout" data-link="action">Logout</a>
                  </p>
                );

              } else {
                return (
                  <p>
                    <a href="/login" data-link="main">Login</a>
                    <a href="/register" data-link="main">Register</a>
                  </p>
                );
              }
            })()
          }
        </div>
      );
    }
  }); // end AccountNavigation


  return AccountNavigation;
});