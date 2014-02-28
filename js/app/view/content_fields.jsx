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
      this.closeOverlay();
    },

    getInitialState: function() {
      return {
        fields: new Fields(),
        fetching: true
      };
    },

    render: function() {
      if (this.state.fetching) {
        return <p>loading ...</p>;
      }

      return (
        <div id="content">
          <a href="/add" onClick={this.onClickAddField}>+ hinzufügen</a>
          <ul>
            {
              this.state.fields.map(function(field, index) {
                return (
                  <li key={index}>{field.get("description") + ": " + field.get("value")}</li>
                );
              })
            }
          </ul>
        </div>
      );
    },

    closeOverlay: function() {
      React.unmountComponentAtNode($("#modal")[0]);
    },

    // TODO check if still fetching
    onClickAddField: function(event) {
      var $modal = $("#modal"),
        comp = LayerAdd({
          fields: this.state.fields,
          onClose: this.onClickClose
        });

      event.preventDefault();
      React.renderComponent(comp, $modal[0]);
    },

    onClickClose: function(event) {
      event.preventDefault();
      this.closeOverlay();
    }

  }); // end ContentShow


  return ContentShow;
});