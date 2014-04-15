define(function(require) {

  "use strict";

  var React = require("react");
  var EAU = require("app/ns");

  /**
   *
   *
   *
   */
  var ContentRegister = React.createClass({
    
    render: function() {
      var self = this;

      return (
        <div className="eau-main-content">
          {
            (function() {
              if (EAU.user.isLoggedIn()) {
                return <h2>Benutzer ist bereits registriert</h2>;

              }
              
              return (
                <form id="register" onSubmit={self.onSubmit}>
                  <h2>Registrieren</h2>
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

      // TODO disable button & second submission

      EAU.user.save({
        email: email,
        pwd: pwd
      }, {
        success: function(model, response) {
          EAU.vent.trigger("goto", "/login");
        },
        error: function() {
          // TODO error handling
          console.error("user create error", arguments);
        }
      });

      
      return false;
    }
  }); // end ContentRegister


  return ContentRegister;
});