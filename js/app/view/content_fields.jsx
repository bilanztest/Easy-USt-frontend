define(function(require) {

  "use strict";

  var React = require("react");
  var Fields = require("app/model/fields");
  var LayerAdd = require("jsx!app/view/layer_add");

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

      this.state.fields.on("add remove change", function() {
        this.forceUpdate();
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
          <a href="/add" onClick={this.onClickAddField}>+ hinzufügen</a>
          <ul>
            {fields}
          </ul>
        </div>
      );
    },

    // TODO check fetching
    onClickAddField: function(event) {
      var $modal = $("#modal"),
        comp = LayerAdd({
          user: this.props.user,
          fields: this.state.fields,
          onClose: this.onCloseOverlay
        });

      event.preventDefault();
      React.renderComponent(comp, $modal[0]);
    },

    onCloseOverlay: function(event) {
      var $modal = $("#modal");

      event.preventDefault();
      React.unmountComponentAtNode($modal[0]);
    }

  }); // end ContentShow


  return ContentShow;
});