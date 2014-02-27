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
          {href: "/show", label: "Einträge anzeigen", login: true},
          {href: "/about", label: "Über EAU", login: false}
        ]
      };
    },

    render: function() {
      var links,
        index = 1,
        self = this;

      links = this.state.links.map(function(link) {
        if (link.login && !self.props.user.isLoggedIn()) {
          return;
        }

        return <li key={index++}><a href={link.href} data-link="main">{link.label}</a></li>;
      });

      return (
        <ul className="eau-main-navigation">
          <li key="0"><h1><a href="/" data-link="main">Easy Ust</a></h1></li>
          {links}
        </ul>
      );
    }
  }); // end Menu


  return Menu;
});