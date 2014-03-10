define(function(require) {

  "use strict";

  var React = require("react");

  var EAU = require("app/ns");

  var Router = require("app/router");
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
      return [EAU.user];
    },

    getInitialState: function() {
      return {
        router: new Router(),
        pages: {
          home: {comp: ContentHome, loginNeeded: false},
          show: {comp: ContentFields, loginNeeded: true},
          login: {comp: ContentLogin, loginNeeded: false}
        }
      };
    },

    componentWillMount: function() {
      this.state.router.on("route", this.onPathChanged, this);
      EAU.vent.on("goto", this.onGoto, this);
    },

    componentDidMount: function() {
      Backbone.history.start({pushState: true});
    },

    render: function() {
      var content = this.state.pages[this.props.path];

      if (typeof content === "undefined") {
        content = "Error, page not found";
      
      } else if (content.loginNeeded && !EAU.user.isLoggedIn()) {
        content = "Error, unauthorized";
      
      } else {
        content = content.comp();
      }

      return (
        <div id="base" onClick={this.onClick}>
          <Header />
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
          EAU.vent.trigger("goto", event.target.pathname);
        
        } else if (linkType === "action") {
          event.preventDefault();

          if (event.target.pathname === "/logout") {
            EAU.user.logout();
            EAU.vent.trigger("goto", "/");
            return;
          }
        }
      }
    },

    onGoto: function(path) {
      this.state.router.navigate(path, {trigger: true});
    },

    onPathChanged: function(action) {
      this.setProps({path: action});
    }

  }); // end BaseView

  return BaseView;
});