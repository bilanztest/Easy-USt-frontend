define(function(require) {

  "use strict";

  var React = require("react");
  var _ = require("underscore");
  var Moment = require("moment");
  var formater = require("app/utils/formater");

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
        sendSuccess: false,
        dateRanges: dateRanges,
        currentDateRangeIndex: 1 // last month is default
      };
    },

    componentWillMount: function() {
      this.state.fields.on("reset", function() {
        this.setState(_.extend(this.calcTax(this.state.dateRanges, this.state.currentDateRangeIndex), {
          fetching: false
        }));
      }, this);

      this.state.fields.fetch({reset: true});
    },

    componentWillUnmount: function() {
      this.state.fields.off(null, null, this);
    },

    handleChange: function(evt) {
      var o = {};
      o[evt.target.name] = evt.target.value;

      if (evt.target.name === "currentDateRangeIndex") {
        _.extend(o, this.calcTax(this.state.dateRanges, evt.target.value));
      }

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

      if (this.state.sendSuccess) {
        return (
          <div className="eau-main-content">
            <h2>Umsatzsteuerdaten erfolgreich übertragen</h2>
            {
              (function(self) {
                if (self.state.valueTaxDiff > 0) {
                  return (
                    <p>Wenn Sie keine Lastschrift erteilt haben, müssen Sie nun {formater.round(self.state.valueTaxDiff, 100)}€ an das Finanzamt überweisen.</p>
                  )
                } else {
                  return (
                    <p>Die erhalten vom Finanzamt eine Erstattung von {formater.round(self.state.valueTaxDiff, 100)}.</p>
                  )
                }
              })(this)
            }
          </div>
        );
      }

      return (
        <div className="eau-main-content">
          <h2>Umsatzsteuerdaten übertragen</h2>
          <span>Zeitraum:</span>
          <select name="currentDateRangeIndex" value={this.state.currentDateRangeIndex} onChange={this.handleChange}>
            {
              this.state.dateRanges.map(function(range) {
                return <option value={range.index}>{range.label}</option>
              })
            }
          </select><br/>
          <p>Einnahmen: {this.state.valueIn}€ (Umsatzsteuer: {formater.round(this.state.valueTaxIn, 100)}€)</p>
          <p>Ausgaben: {this.state.valueOut}€ (Umsatzsteuer: {formater.round(this.state.valueTaxOut, 100)}€)</p>
          <p>Abzuführende / erstattbare Umsatzsteuer: {this.state.valueTaxDiff}€</p>
          <button onClick={this.onSendClick}>Jetzt ans Finanzamt übertragen</button><br/>
          <span>(Nach erfolgreicher Übertragung können Sie sich ein Übertragungsprotokoll heruntergeladen)</span>
        </div>
      );
    },

    calcTax: function(dateRanges, currentDateRangeIndex) {
      var currentDateRange = dateRanges[currentDateRangeIndex],
        rangeMoment = moment().lang("de").subtract(currentDateRange.type, currentDateRange.subtract),
        rangeStart = rangeMoment.clone().startOf(currentDateRange.type),
        rangeEnd = rangeMoment.clone().endOf(currentDateRange.type),
        valueIn = 0, valueTaxIn = 0, valueOut = 0, valueTaxOut = 0, valueTaxDiff = 0;

      // filter fields for current range
      this.state.fields.filter(function(field) {
        return field.get("booked") > rangeStart && field.get("booked") < rangeEnd;
      })
      // sum in's and out's
      .forEach(function(field) {
        if (field.get("type") === "in") {
          valueIn += field.get("value");
          valueTaxIn += field.get("value") * (field.get("ust") / 100);
        } else if (field.get("type") === "out") {
          valueOut += field.get("value");
          valueTaxOut += field.get("value") * (field.get("ust") / 100);
        }
      });

      valueTaxDiff = valueTaxIn - valueTaxOut;

      return {
        valueIn: valueIn,
        valueTaxIn: valueTaxIn,
        valueOut: valueOut,
        valueTaxOut: valueTaxOut,
        valueTaxDiff: valueTaxDiff
      };
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
    },

    onSendClick: function(evt) {
      evt.preventDefault();

      this.setState({
        sendSuccess: true
      })
    }

  }); // end ContentSend


  return ContentSend;
});