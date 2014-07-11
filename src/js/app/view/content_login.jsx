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
      var self = this;

      return (
        <div className="eau-main-content">
          {
            (function() {
              if (EAU.user.isLoggedIn()) {
                return <h2>Login success</h2>;
              }
              
              return (
                <form id="login" onSubmit={self.onSubmit}>
                  <h2>Anmelden</h2>
                  <label htmlFor="email">E-Mail</label>
                  <input type="email" name="email" ref="email" /><br />
                  <label htmlFor="pwd">Passwort</label>
                  <input type="password" name="pwd" ref="pwd" /><br />
                  <input type="submit" />
                </form>
              );
            })()
          }
        </div>
      );
    },

    onSubmit: function(event) {
      var email = this.refs.email.getDOMNode().value.trim();
      var pwd = this.refs.pwd.getDOMNode().value;

      console.log("onSubmit()", email, pwd);
      event.preventDefault();

      if (!email || !pwd) {
        return false;
      }

      // TODO add error handling
      EAU.user.login(email, pwd);
      
      return false;
    }
  }); // end ContentLogin


  return ContentLogin;
});