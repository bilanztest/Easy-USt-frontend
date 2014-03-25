define(function(require) {

  "use strict";

  var React = require("react");
  
  var Menu = require("jsx!app/view/menu");
  var AccountNavigation = require("jsx!app/view/account_navigation");

  /**
   *
   *
   *
   */
  var HeaderComponent = React.createClass({

    render: function() {
      return (
        <nav className="eau-main-navigation">
          <Menu />
          <AccountNavigation />
        </nav>
      );
    }
  }); // end HeaderComponent


  return HeaderComponent;
});