define(function(require) {

  "use strict";

  var React = require("react");

  var EAU = require("app/ns");
  var Fields = require("app/model/fields");
  var LayerAdd = require("jsx!app/view/layer_add");
  var FieldView = require("jsx!app/view/field_view");

  /**
   *
   *
   *
   */
  var ContentShow = React.createClass({

    componentWillMount: function() {
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
                <tbody>
                  {
                    ins.map(function(field, index) {
                      return <FieldView type="in" field={field} index={index}/>
                    })
                  }
                </tbody>
              </table>
            </div>
            <div className="eau-table-container">
              <h2>Ausgaben</h2>
              <table className="eau-fields-table">
                <tbody>
                  {
                    outs.map(function(field, index) {
                      return <FieldView type="out" field={field} index={index}/>
                    })
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );
    },

    // TODO check if still fetching
    onClickAddField: function(event) {
      var comp = LayerAdd({
        fields: this.state.fields
      });

      event.preventDefault();
      EAU.vent.trigger("modal:open", comp);
    }

  }); // end ContentShow


  return ContentShow;
});