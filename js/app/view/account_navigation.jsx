define(function(require) {

  "use strict";

  var React = require("react");

  /**
   *
   *
   *
   */
  var AccountNavigation = React.createClass({

    render: function() {
      var content, user;

      if (this.props.user.isLoggedIn()) {
        content = (
          <p>
            Hello {this.props.user.get("email")}. <a href="/logout" data-link="action">Logout</a>
          </p>
        );

      } else {
        content = (
          <p>
            <a href="/login" data-link="main">Login</a>
            <a href="/register" data-link="main">Register</a>
          </p>
        );
      }

      return (
        <div className="eau-acoount-nav">
          {content}
        </div>
      );
    }
  }); // end AccountNavigation


  return AccountNavigation;
});