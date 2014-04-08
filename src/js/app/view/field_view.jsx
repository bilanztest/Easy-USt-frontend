define(function(require) {

  "use strict";

  var React = require("react");
  var formater = require("app/utils/formater");

  /**
   *
   *
   *
   */
  var FieldView = React.createClass({

    render: function() {
      return (
        <tr key={this.props.type + this.props.index}>
          <td>{formater.date(this.props.field.get("date"), "dd.MM.")}</td>
          <td>{this.props.field.get("description")}</td>
          <td>{this.props.field.get("value") + "€"}</td>
          <td>{this.props.field.get("ust") + "%"}</td>
          <td>{formater.round(this.props.field.get("value") * (this.props.field.get("ust")/100), 100) + "€"}</td>
          <td><a href="#" onClick={this.onRemoveItem}>remove</a></td>
        </tr>
      )
    },

    onRemoveItem: function(event) {
      event.preventDefault();

      this.props.field.destroy();
    }

  }); // end FieldView


  return FieldView;
});