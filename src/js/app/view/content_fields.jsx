define(function(require) {

  "use strict";

  var React = require("react");
  var moment = require("moment");

  var EAU = require("app/ns");
  var LayerAdd = require("jsx!app/view/layer_add");
  var FieldView = require("jsx!app/view/field_view");
  var Fields = require("app/model/fields");

  /**
   *
   *
   *
   */
  var ContentShow = React.createClass({

    getInitialState: function() {
      return {
        fields: new Fields(),
        displayBy: "month",
        fetching: true,
        lastAddedFieldDate: moment().startOf("month").add("h", 12).format("YYYY-MM-DD"),
        lastAddedFieldType: "in"
      };
    },

    componentWillMount: function() {
      if (this.state.fields.isFetched) {
        this.setState({fetching: false});
      } else {
        this.state.fields.on("reset", function() {
          this.setState({fetching: false});
        }, this);
        this.state.fields.fetch({reset: true});
      }

      this.state.fields.on("remove change", function() {
        this.forceUpdate();
      }, this);

      this.state.fields.on("add", function(model) {
        this.setState({
          lastAddedFieldDate: model.get("booked").toJSON().split("T")[0],
          lastAddedFieldType: model.get("type")
        });
      }, this);
    },

    componentWillUnmount: function() {
      this.state.fields.off(null, null, this);
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
            <div className="eau-fields-table">
              <div>
                <a href="/add" onClick={this.onClickAddField}>+ hinzufügen</a> |
                <span> Ansicht: </span>
                <select name="displayBy" value={this.state.displayBy} onChange={this.handleChange}>
                  <option value="month">Monat</option>
                  <option value="quarter">Quartal</option>
                </select>
              </div>
              <div className="align-right">
                <a href="/send" data-link="main"> Jetzt übertragen</a>
              </div>
            </div>
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

      if (this.state.fields && this.state.fields.length > 0) {
        earliestDate = moment(this.state.fields.at(0).get("booked")).lang("de");
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
          ins: this.state.fields.getFieldsByRangeAndType(start, end, "in"),
          outs: this.state.fields.getFieldsByRangeAndType(start, end, "out")
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
        fields: this.state.fields,
        typeaheadEngine: this.state.fields.engine,
        date: this.state.lastAddedFieldDate,
        type: this.state.lastAddedFieldType
      }));
    },

    onRangeBoxClick: function(event) {
      event.preventDefault();

      EAU.vent.trigger("modal:open", new LayerAdd({
        fields: this.state.fields,
        typeaheadEngine: this.state.fields.engine,
        date: event.target.getAttribute("data-date"),
        type: this.state.lastAddedFieldType
      }));
    }

  }); // end ContentShow


  return ContentShow;
});