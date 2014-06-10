define(function(require) {

  "use strict";

  var React = require("react");

  var EAU = require("app/ns");
  var LayerAdd = require("jsx!app/view/layer_add");
  var FieldView = require("jsx!app/view/field_view");

  /**
   *
   *
   *
   */
  var ContentShow = React.createClass({

    getInitialState: function() {
      return {
        fetching: true
      };
    },

    componentWillMount: function() {
      if (this.props.fields.isFetched) {
        this.setState({
          fetching: false
        });
      } else {
        this.props.fields.on("reset", function() {
          this.setState({
            fetching: false
          });
        }, this);
      }

      this.props.fields.on("add remove change", function() {
        this.forceUpdate();
      }, this);
    },

    componentWillUnmount: function() {
      this.props.fields.off(null, null, this);
      EAU.vent.trigger("modal:close");
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

      this.props.fields.forEach(function(field) {
        if (field.get("type") === "in") {
          ins.push(field);
        } else {
          outs.push(field);
        }
      });

      return (
        <div className="eau-main-content">
          <div className="eau-main-content-fields-header">
            <a href="/add" onClick={this.onClickAddField}>+ hinzufügen</a> | <a href="/send" data-link="main">Jetzt übertragen</a>
          </div>
          <div className="eau-fields-tables">
            <div>
              <h2>Einnahmen</h2>
              <table>
                <tbody>
                  {
                    ins.map(function(field, index) {
                      return <FieldView type="in" field={field} index={index}/>;
                    })
                  }
                </tbody>
              </table>
            </div>
            <div>
              <h2>Ausgaben</h2>
              <table>
                <tbody>
                  {
                    outs.map(function(field, index) {
                      return <FieldView type="out" field={field} index={index}/>;
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
        fields: this.props.fields,
        typeaheadEngine: this.props.fields.engine
      });

      event.preventDefault();
      EAU.vent.trigger("modal:open", comp);
    }

  }); // end ContentShow


  return ContentShow;
});