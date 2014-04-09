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
        error: null
      };
    },

    componentWillMount: function() {
      this.props.fields.on("invalid", function(model, msg) {
        // TODO highlight input that is invalid
        this.setState({
          currentState: "error",
          error: new Error(msg)
        });
      }, this);
    },

    componentWillUnmount: function() {
      this.props.fields.off(null, null, this);
    },

    render: function() {
      return (
        <div className="easy-modal-add-field">
          <a href="/close" onClick={this.onCloseClick}>&times; schließen</a>
          <h2>Feld hinzufügen</h2>
          <form id="add" onSubmit={this.onSubmit}>
            <label>
              <input type="radio" name="type" ref="typeIn" value="in" defaultChecked /> Einnahme
            </label><br />
            <label>
              <input type="radio" name="type" value="out" /> Ausgabe
            </label><br />
            <label htmlFor="description">Beschreibung</label>
            <input type="text" name="description" ref="desc" /><br />
            <label htmlFor="value">Wert</label>
            <input type="number" step="0.01" min="0" max="1000000" name="value" ref="val" /><br />
            <label htmlFor="ust">Umsatzsteuer %</label>
            <input type="number" min="0" max="19" name="ust" ref="ust" defaultValue="19" /><br />
            { 
              this.state.error !== null ?
                <div className="error">{this.state.error.message}</div> : null
            }
            {
              this.state.currentState === "sending" ?
                <input type="submit" disabled /> : <input type="submit" />
            }
          </form>
        </div>
      );
    },

    onSubmit: function(event) {
      var typeIn = this.refs.typeIn.getDOMNode();
      var desc = this.refs.desc.getDOMNode().value.trim();
      var val = this.refs.val.getDOMNode().value;
      var ust = this.refs.ust.getDOMNode().value;

      event.preventDefault();

      this.setState({
        currentState: "sending",
        error: null
      });

      this.props.fields.create({
        description: desc,
        value: val,
        ust: ust,
        date: new Date().toISOString().slice(0, 19).replace("T", " "),
        type: typeIn.checked ? "in" : "out"
      }, {
        validate: true,
        parse: true,
        success: this.onSuccess,
        error: this.onError
      });
      
      return false;
    },

    onCloseClick: function(event) {
      event.preventDefault();

      EAU.vent.trigger("closeModal");
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
    }

  }); // end LayerAdd


  return LayerAdd;
});