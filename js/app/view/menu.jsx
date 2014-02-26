define(function(require) {

  "use strict";

  var React = require("react");

  /**
   *
   *
   *
   */
  var Menu = React.createClass({

    getInitialState: function() {
      return {
        links: [
          {href: "/", label: "Easy Ust", h1: true, login: false},
          {href: "/add", label: "Eintrag hinzufügen", h1: false, login: true},
          {href: "/page2", label: "Seite gibts nicht", h1: false, login: false}
        ]
      };
    },

    render: function() {
      var links,
        self = this;

      links = this.state.links.map(function(link) {
        var comp;

        if (link.login && !self.props.user.isLoggedIn()) {
          return;
        }

        if (link.h1) {
          comp = <li><h1><a href={link.href} className="main">{link.label}</a></h1></li>;

        } else {
          comp = <li><a href={link.href} className="main">{link.label}</a></li>
        }

        return comp;
      });

      return (
        <ul className="eau-main-navigation">
          {links}
        </ul>
      );
    }
  }); // end Menu


  return Menu;
});