define(function(require) {

  "use strict";

  var React = require("react");

  var mixins = require("app/utils/mixins");

  var Header = require("jsx!app/view/header");
  var ContentHome = require("jsx!app/view/content_home");
  var ContentShow = require("jsx!app/view/content_show");
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

    componentWillMount: function() {
      this.props.router.on("route", this.onPathChanged, this);
    },

    render: function() {
      var content;

      switch (this.props.path) {
        case "home":
          content = <ContentHome user={this.props.user} />
          break;
        case "show":
          content = <ContentShow user={this.props.user} />
          break;
        case "login":
          content = <ContentLogin user={this.props.user} />
          break;

        case "404":
        default:
          content = "Error, page not found";
          break;
      } 

      return (
        <div id="base" onClick={this.onClick}>
          <Header user={this.props.user} />
          {content}
        </div>
      );
    },

    onClick: function(event) {
      if (event.target.tagName.toLowerCase() === "a" &&
          event.target.className === "main") {
        event.preventDefault();

        if (event.target.pathname === "/logout") {
          this.props.user.logout();
          this.props.router.navigate("/", {trigger: true});
        } else {
          this.props.router.navigate(event.target.pathname, {trigger: true});
        }
      }
    },

    onPathChanged: function(action) {
      this.setProps({path: action});
    }

  }); // end BaseView

  return BaseView;
});