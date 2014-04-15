define(function(require) {

  "use strict";

  var React = require("react");
  var EAU = require("app/ns");

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
      return (
        <ul className="eau-main-menu">
          <li key="0"><h1><a href="/" data-link="main">Easy Ust</a></h1></li>
          {
            this.state.links.map(function(link, index) {
              if (link.login && !EAU.user.isLoggedIn()) {
                return null;
              }

              return <li key={index}><a href={link.href} data-link="main">{link.label}</a></li>;
            })
          }
        </ul>
      );
    }
  }); // end Menu


  return Menu;
});