define(function(require) {

  "use strict";

  var React = require("react");

  var mixins = require("app/utils/mixins");

  var Header = require("jsx!app/view/header");
  var ContentHome = require("jsx!app/view/content_home");
  var ContentFields = require("jsx!app/view/content_fields");
  var ContentLogin = require("jsx!app/view/content_login");

  /**
   *
   *
   *
   */
  var BaseView = React.createClass({
    mixins: [mixins.RerenderOnLogin],

    getBackboneModels: function() {
      return [this.props.user];
    },

    getInitialState: function() {
      return {
        home: {comp: ContentHome, loginNeeded: false},
        show: {comp: ContentFields, loginNeeded: true},
        login: {comp: ContentLogin, loginNeeded: false}
      };
    },

    componentWillMount: function() {
      this.props.router.on("route", this.onPathChanged, this);
    },

    render: function() {
      var content = this.state[this.props.path];

      if (typeof content === "undefined") {
        content = "Error, page not found";
      
      } else if (content.loginNeeded && !this.props.user.isLoggedIn()) {
        content = "Error, unauthorized";
      
      } else {
        content = content.comp({user: this.props.user});
      }

      return (
        <div id="base" onClick={this.onClick}>
          <Header user={this.props.user} />
          {content}
        </div>
      );
    },

    onClick: function(event) {
      var linkType;

      if (event.target.tagName.toLowerCase() === "a") {
        linkType = event.target.getAttribute("data-link");
        
        if (linkType === "main") {
          event.preventDefault();
          this.props.router.navigate(event.target.pathname, {trigger: true});
        
        } else if (linkType === "action") {
          event.preventDefault();

          if (event.target.pathname === "/logout") {
            this.props.user.logout();
            this.props.router.navigate("/", {trigger: true});
            return;
          }
        
        } else if (linkType === "modal") {
          event.preventDefault();
        }

      }
    },

    onPathChanged: function(action) {
      this.setProps({path: action});
    }

  }); // end BaseView

  return BaseView;
});