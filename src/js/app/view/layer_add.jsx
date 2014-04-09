define(function(require) {

  "use strict";

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
      var field = this.props.field;
      var inChecked = field && field.get("type") === "in" || "";
      var outChecked = field && field.get("type") === "out" || "";
      var desc = field && field.get("description") || null;
      var value = field && field.get("value") || null;
      var ust = field && field.get("ust") || "19";
      var isSending = this.state.currentState === "sending";
      var descErrorClass = this.state.errorField === "desc" && "input-error" || null;
      var valErrorClass = this.state.errorField === "val" && "input-error" || null;
      var ustErrorClass = this.state.errorField === "ust" && "input-error" || null;

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
      var typeIn = this.refs.typeIn.getDOMNode();
      var desc = this.refs.desc.getDOMNode().value.trim();
      var val = this.refs.val.getDOMNode().value;
      var ust = this.refs.ust.getDOMNode().value;
      var data = {
        description: desc,
        value: val,
        ust: ust,
        date: new Date(),
        type: typeIn.checked ? "in" : "out"
      }
      var options = {
        validate: true,
        parse: true,
        success: this.onSuccess,
        error: this.onError
      }

      event.preventDefault();

      this.setState({
        currentState: "sending",
        error: null
      });

      if(this.props.fields) {
        this.props.fields.create(data, options);
      }

      if(this.props.field) {
        this.props.field.set(data, {validate: true});

        // if set validation failed, nothing has changed
        if(this.props.field.hasChanged()) {
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
      var desc = this.refs.desc.getDOMNode().value = "";
      var val = this.refs.val.getDOMNode().value = "";

      this.setState({
        currentState: "ok",
        error: null
      });

      if(this.props.field) {
        EAU.vent.trigger("closeModal");
      }
    }

  }); // end LayerAdd


  return LayerAdd;
});