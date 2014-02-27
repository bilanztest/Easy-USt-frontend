define(function(require) {

  "use strict";

  var React = require("react");
  var Fields = require("app/model/fields");

  /**
   *
   *
   *
   */
  var ContentShow = React.createClass({

    componentWillMount: function() {
      var self = this;

      this.state.fields.on("reset", function() {
        this.setState({
          fetching: false
        });
      }, this);

      this.state.fields.fetch({reset: true});
    },

    componentWillUnmount: function() {
      this.state.fields.off(null, null, this);
    },

    getInitialState: function() {
      return {
        fields: new Fields(this.props.user),
        fetching: true
      };
    },

    render: function() {
      var fields,
        index = 0;

      if (this.state.fetching) {
        return <p>loading ...</p>;
      }

      fields = this.state.fields.map(function(field) {
        return (
          <li key={index++}>{field.get("description") + ": " + field.get("value")}</li>
        );
      });

      return (
        <div id="content">
          <a href="/add" data-link="modal">+ hinzufügen</a>
          <ul>
            {fields}
          </ul>
        </div>
      );
    }
  }); // end ContentShow


  return ContentShow;
});