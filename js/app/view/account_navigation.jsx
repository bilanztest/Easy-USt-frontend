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
            Hello {this.props.user.get("email")}. <a href="/logout" className="main">Logout</a>
          </p>
        );

      } else {
        content = (
          <p>
            <a href="/login" className="main">Login</a>
            <a href="/register" className="main">Register</a>
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