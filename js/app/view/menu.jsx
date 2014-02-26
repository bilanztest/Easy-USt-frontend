define(function(require) {

  "use strict";

  var React = require("react");

  /**
   *
   *
   *
   */
  var Menu = React.createClass({

    render: function() {
      return (
        <ul className="eau-main-navigation">
          <li><h1><a href="/" className="main">Easy Ust</a></h1></li>
          <li><a href="/test" className="main">test 1</a></li>
          <li><a href="/page2" className="main">Page 2</a></li>
        </ul>
      );
    }
  }); // end Menu


  return Menu;
});