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
        displayBy: "month",
        fetching: true,
        lastAddedFieldDate: moment().startOf("month").add("h", 12).format("YYYY-MM-DD"),
        lastAddedFieldType: "in"
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

      this.props.fields.on("remove change", function() {
        this.forceUpdate();
      }, this);

      this.props.fields.on("add", function(model) {
        this.setState({
          lastAddedFieldDate: model.get("booked").toJSON().split("T")[0],
          lastAddedFieldType: model.get("type")
        });
      }, this);
    },

    componentWillUnmount: function() {
      this.props.fields.off(null, null, this);
      EAU.vent.trigger("modal:close");
    },

    handleChange: function(evt) {
      var o = {};
      o[evt.target.name] = evt.target.value;
      this.setState(o);
    },

    render: function() {
      if (this.state.fetching) {
        return (
          <div className="eau-main-content">
            <p>loading ...</p>
          </div>
        );
      }

      return (
        <div className="eau-main-content">
          <div className="eau-main-content-fields-header">
            <a href="/add" onClick={this.onClickAddField}>+ hinzufügen</a> |
            <a href="/send" data-link="main"> Jetzt übertragen</a> |
            <span> Ansicht: </span>
            <select name="displayBy" value={this.state.displayBy} onChange={this.handleChange}>
              <option value="month">Monat</option>
              <option value="quarter">Quartal</option>
            </select>
          </div>
          <div className="eau-fields-table">
            <h2>Einnahmen</h2>
            <div className="table-spacer">&nbsp;</div>
            <h2>Ausgaben</h2>
          </div>
          {
            this.getFieldsSortedAndFilteredByDate().map(function(item) {
              return (
                <div className="eau-fields-range-box">
                  <h3><a href="#" data-date={item.date} onClick={this.onRangeBoxClick}>{item.label}</a></h3>
                  <div className="eau-fields-table">
                    <div>
                      <table>
                        <tbody>
                          {
                            item.ins.map(function(field, index) {
                              return <FieldView type="in" field={field} index={index}/>;
                            })
                          }
                        </tbody>
                      </table>
                    </div>
                    <div className="table-spacer">&nbsp;</div>
                    <div>
                      <table>
                        <tbody>
                          {
                            item.outs.map(function(field, index) {
                              return <FieldView type="out" field={field} index={index}/>;
                            })
                          }
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )
            }, this)
          }
        </div>
      );
    },

    getFieldsSortedAndFilteredByDate: function() {
      var resultArray = [],
        currentMonth = moment().startOf(this.state.displayBy),
        earliestDate, i, currentDate, start, end, label;

      if (this.props.fields && this.props.fields.length > 0) {
        earliestDate = moment(this.props.fields.at(0).get("booked")).lang("de");
      } else {
        earliestDate = moment().lang("de").startOf("month").add("h", 8);
      }

      for (i = 0; true; i++) {
        currentDate = earliestDate.clone().add(this.state.displayBy + "s", i);
        start = currentDate.clone().startOf(this.state.displayBy);
        end = currentDate.clone().endOf(this.state.displayBy);
        label;

        if (this.state.displayBy === "month") {
          label = currentDate.format("MMMM YYYY");
        } else if (this.state.displayBy === "quarter") {
          label = "Q" + currentDate.format("Q YYYY")
        }

        resultArray.push({
          label: label,
          date: currentDate.clone().startOf(this.state.displayBy).add("h", 12).format("YYYY-MM-DD"),
          ins: this.props.fields.getFieldsByRangeAndType(start, end, "in"),
          outs: this.props.fields.getFieldsByRangeAndType(start, end, "out")
        });

        if (currentDate.startOf(this.state.displayBy) >= currentMonth) {
          break;
        }

        // better save then sorry
        if (i >= 100) {
          console.error("force abort loop")
          break;
        }
      };

      return resultArray;
    },

    onClickAddField: function(event) {
      event.preventDefault();

      EAU.vent.trigger("modal:open", new LayerAdd({
        fields: this.props.fields,
        typeaheadEngine: this.props.fields.engine,
        date: this.state.lastAddedFieldDate,
        type: this.state.lastAddedFieldType
      }));
    },

    onRangeBoxClick: function(event) {
      event.preventDefault();

      EAU.vent.trigger("modal:open", new LayerAdd({
        fields: this.props.fields,
        typeaheadEngine: this.props.fields.engine,
        date: event.target.getAttribute("data-date"),
        type: this.state.lastAddedFieldType
      }));
    }

  }); // end ContentShow


  return ContentShow;
});