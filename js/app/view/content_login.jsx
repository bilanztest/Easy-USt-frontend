define(function(require) {

  "use strict";

  var React = require("react");

  /**
   *
   *
   *
   */
  var ContentLogin = React.createClass({
    
    render: function() {
      var content;

      if (this.props.user.isLoggedIn()) {
        content = <h2>Login success</h2>;

      } else {
        content = (
          <form id="login" onSubmit={this.onSubmit}>
            <h2>Login</h2>
            <input type="text" name="email" ref="email" />
            <input type="password" name="pwd" ref="pwd" />
            <input type="submit" />
          </form>
        );
      }

      return (
        <div id="content">
          {content}
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

      this.props.user.login(email, pwd);

      // this.refs.email.getDOMNode().value = "";
      // this.refs.pwd.getDOMNode().value = "";
      
      return false;
    }
  }); // end ContentLogin


  return ContentLogin;
});