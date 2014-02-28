define(function(require) {

  "use strict";

  var React = require("react");
  var EAU = require("app/ns");

  /**
   *
   *
   *
   */
  var ContentLogin = React.createClass({
    
    render: function() {
      return (
        <div id="content">
          {
            (function() {
              if (EAU.user.isLoggedIn()) {
                return <h2>Login success</h2>;

              } else {
                return (
                  <form id="login" onSubmit={this.onSubmit}>
                    <h2>Login</h2>
                    <input type="text" name="email" ref="email" />
                    <input type="password" name="pwd" ref="pwd" />
                    <input type="submit" />
                  </form>
                );
              }
            })()
          }
        </div>
      );
    },

    onSubmit: function() {
      var email = this.refs.email.getDOMNode().value.trim();
      var pwd = this.refs.pwd.getDOMNode().value;

      console.log("onSubmit()", email, pwd);

      if (!email || !pwd) {
        return false;
      }

      EAU.user.login(email, pwd);
      
      return false;
    }
  }); // end ContentLogin


  return ContentLogin;
});