define(function(require) {

  "use strict";

  var React = require("react");

  /**
   *
   *
   *
   */
  var LayerAdd = React.createClass({
    
    render: function() {
      return (
        <div>
          <a href="/close" onClick={this.props.onClose}>&times; schließen</a>
          <h2>Feld hinzufügen</h2>
          <form id="add" onSubmit={this.onSubmit}>
            <label htmlFor="description">Beschreibung</label>
            <input type="text" name="description" ref="desc" /><br />
            <label htmlFor="value">Wert</label>
            <input type="number" name="value" ref="val" /><br />
            <label htmlFor="ust">Umsatzsteuer %</label>
            <input type="number" name="ust" ref="ust" /><br />
            <input type="submit" />
          </form>
        </div>
      );
    },

    onSubmit: function(event) {
      var desc = this.refs.desc.getDOMNode().value.trim();
      var val = this.refs.val.getDOMNode().value;
      var ust = this.refs.ust.getDOMNode().value;

      event.preventDefault();

      console.log("onSubmit()", desc, val, ust);
      
      this.props.fields.create({
        description: desc,
        value: val,
        ust: ust,
        date: new Date().toISOString().slice(0, 19).replace("T", " "),
        type: "in"
      }, {
        token: this.props.user.get("token")
      });

      // this.props.fields.save();

      // this.refs.email.getDOMNode().value = "";
      // this.refs.pwd.getDOMNode().value = "";
      
      return false;
    }

  }); // end LayerAdd


  return LayerAdd;
});