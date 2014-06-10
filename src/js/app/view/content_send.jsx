define(function(require) {

  "use strict";

  var React = require("react");
  var _ = require("underscore");
  var Moment = require("moment");

  var EAU = require("app/ns");
  var Fields = require("app/model/fields");
  var LayerAdd = require("jsx!app/view/layer_add");
  var FieldView = require("jsx!app/view/field_view");

  /**
   *
   *
   *
   */
  var ContentSend = React.createClass({

    getInitialState: function() {
      var dateRanges = this.createDateRanges();

      return {
        fields: new Fields(),
        fetching: true,
        dateRanges: dateRanges,
        currentDateRangeIndex: 1 // last month is default
      };
    },

    componentWillMount: function() {
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

    handleChange: function(evt) {
      var o = {};
      o[evt.target.name] = evt.target.value;
      this.setState(o);
    },

    render: function() {
      var currentDateRange = this.state.dateRanges[this.state.currentDateRangeIndex],
        rangeMoment = moment().lang("de").subtract(currentDateRange.type, currentDateRange.subtract),
        rangeStart = rangeMoment.clone().startOf(currentDateRange.type),
        rangeEnd = rangeMoment.clone().endOf(currentDateRange.type),
        valueIn = 0, valueOut = 0, valueDiff = 0;

      if (this.state.fetching) {
        return (
          <div className="eau-main-content">
            <p>loading ...</p>
          </div>
        );
      }

      // filter fields for current range
      this.state.fields.filter(function(field) {
        return field.get("booked") > rangeStart && field.get("booked") < rangeEnd;
      })
      // sum in's and out's
      .forEach(function(field) {
        if (field.get("type") === "in") {
          valueIn += field.get("value");
        } else if (field.get("type") === "out") {
          valueOut += field.get("value");
        }
      });

      valueDiff = valueIn - valueOut;

      return (
        <div className="eau-main-content">
          <h2>Umsatzsteuerdaten übertragen</h2>
          <p>Folgende Werte werden ans Finanzamt übertragen:</p>
          <p>Zeitraum: {this.state.dateRanges[this.state.currentDateRangeIndex].label}</p>
          <p>Einnahme Umsatzsteuer: {valueIn}€</p>
          <p>Ausgaben Umsatzsteuer: {valueOut}€</p>
          <p>Differenz: {valueDiff}€</p>
          <p>Zeitraum ändern:</p>
          <select name="currentDateRangeIndex" value={this.state.currentDateRangeIndex} onChange={this.handleChange}>
            {
              this.state.dateRanges.map(function(range) {
                return <option value={range.index}>{range.label}</option>
              })
            }
          </select><br/>
          <button>Jetzt ans Finanzamt übertragen</button>
        </div>
      );
    },

    createDateRanges: function() {
      var dateRanges = [];

      for (var i = 0; i < 6; i++) {
        dateRanges.push(_.extend(this.createDateRange("months", i), {index: dateRanges.length}));
      };

      for (var i = 0; i < 4; i++) {
        dateRanges.push(_.extend(this.createDateRange("quarters", i), {index: dateRanges.length}));
      };

      return dateRanges;
    },

    createDateRange: function(type, subtract) {
      var momentDe = moment().lang("de"),
        changedMoment = momentDe.subtract(type, subtract);

      if (type === "months") {
        return {
          label: changedMoment.format("MMMM YYYY"),
          type: "months",
          subtract: subtract
        }
      } else if (type === "quarters") {
        return {
          label: "Q" + changedMoment.format("Q YYYY"),
          type: "quarters",
          subtract: subtract
        };
      }
    }

  }); // end ContentSend


  return ContentSend;
});