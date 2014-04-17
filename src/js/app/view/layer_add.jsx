define(function(require) {

  "use strict";

  var EAU = require("app/ns");
  var React = require("react");

  /**
   *
   *
   *
   */
  var LayerAdd = React.createClass({
    
    getInitialState: function() {
      return {
        currentState: "ok",
        error: null,
        errorField: null
      };
    },

    componentWillMount: function() {
      var modelOrCollection = this.props.fields || this.props.field;

      modelOrCollection.on("invalid", function(model, errorObj) {
        // TODO highlight input that is invalid
        this.setState({
          currentState: "error",
          error: new Error(errorObj.msg),
          errorField: errorObj.fieldRef
        });
      }, this);
    },

    componentWillUnmount: function() {
      var modelOrCollection = this.props.fields || this.props.field;

      modelOrCollection.off(null, null, this);
    },

    render: function() {
      var field = this.props.field,
        inChecked = field && field.get("type") === "in" || "",
        outChecked = field && field.get("type") === "out" || "",
        day = field && new Date(field.get("booked")).getDate() || 1,
        month = field && field.get("booked").getMonth() + 1 || 1,
        desc = field && field.get("description") || null,
        value = field && field.get("value") || null,
        ust = field && field.get("ust") || "19",
        isSending = this.state.currentState === "sending",
        descErrorClass = this.state.errorField === "desc" && "input-error" || null,
        valErrorClass = this.state.errorField === "val" && "input-error" || null,
        ustErrorClass = this.state.errorField === "ust" && "input-error" || null;

      return (
        <div className="easy-modal-add-field">
          <a href="/close" onClick={this.onCloseClick}>&times; schließen</a>
          <h2>Feld hinzufügen</h2>
          <form id="add" onSubmit={this.onSubmit}>
            <label>
              <input type="radio" name="type" ref="typeIn" value="in" defaultChecked={inChecked ? "defaultChecked" : ""}/> Einnahme
            </label><br />
            <label>
              <input type="radio" name="type" value="out" defaultChecked={outChecked ? "defaultChecked" : ""}/> Ausgabe
            </label><br />

            <label htmlFor="value">Tag</label>
            <input type="number" step="1" min="1" max="31" name="day" ref="day" defaultValue={day}/>

            <label htmlFor="value">Monat</label>
            <input type="number" step="1" min="1" max="12" name="month" ref="month" defaultValue={month}/><br />

            
            <label htmlFor="description">Beschreibung</label>
            <input type="text" name="description" ref="desc" defaultValue={desc} className={descErrorClass}/><br />
            <label htmlFor="value">Wert</label>
            <input type="number" step="0.01" min="0" max="1000000" name="value" ref="val" defaultValue={value} className={valErrorClass}/><br />
            <label htmlFor="ust">Umsatzsteuer %</label>
            <input type="number" min="0" max="19" name="ust" ref="ust" defaultValue={ust} className={ustErrorClass}/><br />
            { 
              this.state.error !== null ?
                <div className="error">{this.state.error.message}</div> : null
            }
            <input type="submit" disabled={isSending} />
          </form>
        </div>
      );
    },

    onSubmit: function(event) {
      var typeIn = this.refs.typeIn.getDOMNode(),
        day = this.refs.day.getDOMNode().value,
        month = this.refs.month.getDOMNode().value,
        desc = this.refs.desc.getDOMNode().value.trim(),
        val = this.refs.val.getDOMNode().value,
        ust = this.refs.ust.getDOMNode().value,
        data = {
          description: desc,
          value: val,
          ust: ust,
          booked: new Date(2014, month - 1, day),
          type: typeIn.checked ? "in" : "out"
        },
        options = {
          validate: true,
          parse: true,
          success: this.onSuccess,
          error: this.onError
        };

      event.preventDefault();

      this.setState({
        currentState: "sending",
        error: null
      });

      if (this.props.fields) {
        this.props.fields.create(data, options);
      }

      if (this.props.field) {
        this.props.field.set(data, {validate: true});

        // if set validation failed, nothing has changed
        if (this.props.field.hasChanged()) {
          this.props.field.save({}, options);
        }
      }
      
      return false;
    },

    onCloseClick: function(event) {
      event.preventDefault();
      EAU.vent.trigger("modal:close");
    },

    onError: function(model, xhr) {
      var response = JSON.parse(xhr.responseText);

      this.setState({
        currentState: "error",
        error: new Error("Error: " + response.message)
      });

      // TODO handle wrongly added model in collection
    },

    onSuccess: function() {
      this.refs.desc.getDOMNode().value = "";
      this.refs.val.getDOMNode().value = "";

      this.setState({
        currentState: "ok",
        error: null
      });

      if (this.props.field) {
        EAU.vent.trigger("modal:close");
      }
    }

  }); // end LayerAdd


  return LayerAdd;
});