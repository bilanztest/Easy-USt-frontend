define(function(require) {

  "use strict";

  var React = require("react");
  var Fields = require("app/model/fields");
  var LayerAdd = require("jsx!app/view/layer_add");
  var formater = require("app/utils/formater");

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
      var ins = [],
        outs = [];

      if (this.state.fetching) {
        return (
          <div className="eau-main-content">
            <p>loading ...</p>
          </div>
        );
      }

      this.state.fields.forEach(function(field) {
        if (field.get("type") === "in") {
          ins.push(field);
        } else {
          outs.push(field);
        }
      });

      // XXX do we have to sort or could we rely on server response

      return (
        <div className="eau-main-content">
          <a href="/add" onClick={this.onClickAddField}>+ hinzufügen</a>
          <div className="eau-fields-tables">
            <div className="eau-fields-table-container">
              <h2>Einnahmen</h2>
              <table className="eau-fields-table">
                {
                  ins.map(function(field, index) {
                    return (
                      <tr key={"ins" + index}>
                        <td>{formater.date(field.get("date"), "dd.MM.")}</td>
                        <td>{field.get("description")}</td>
                        <td>{field.get("value") + "€"}</td>
                        <td>{field.get("ust") + "%"}</td>
                        <td>{formater.round(field.get("value") * (field.get("ust")/100), 100) + "€"}</td>
                      </tr>
                    );
                  })
                }
              </table>
            </div>
            <div className="eau-table-container">
              <h2>Ausgaben</h2>
              <table className="eau-fields-table">
                {
                  outs.map(function(field, index) {
                    return (
                      <tr key={"outs" + index}>
                        <td>{formater.date(field.get("date"), "dd.MM.")}</td>
                        <td>{field.get("description")}</td>
                        <td>{field.get("value") + "€"}</td>
                      </tr>
                    );
                  })
                }
              </table>
            </div>
          </div>
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