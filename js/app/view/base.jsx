define(function(require) {

  "use strict";

  var React = require("react");

  var mixins = require("app/utils/mixins");

  var Header = require("jsx!app/view/header");
  var ContentHome = require("jsx!app/view/content_home");
  var ContentTest = require("jsx!app/view/content_test");
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

    render: function() {
      var content;

      switch (this.props.path) {
        case "home":
          content = <ContentHome user={this.props.user} />
          break;
        case "test":
          content = <ContentTest user={this.props.user} />
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
        this.props.router.navigate(event.target.pathname, {trigger: true});
      }
    }

  }); // end BaseView

  return BaseView;
});