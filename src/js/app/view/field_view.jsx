define(function(require) {

  "use strict";

  var EAU = require("app/ns");
  var React = require("react");
  var formater = require("app/utils/formater");

  var LayerAdd = require("jsx!app/view/layer_add");

  /**
   *
   *
   *
   */
  var FieldView = React.createClass({

    render: function() {
      return (
        <tr key={this.props.type + this.props.index}>
          <td>{formater.date(this.props.field.get("booked"), "dd.MM.")}</td>
          <td>{this.props.field.get("description")}</td>
          <td>{this.props.field.get("value") + "€"}</td>
          <td>{this.props.field.get("ust") + "%"}</td>
          <td>{formater.round(this.props.field.get("value") * (this.props.field.get("ust") / 100), 100) + "€"}</td>
          <td><a href="#" onClick={this.onEditItem}>edit</a></td>
          <td><a href="#" onClick={this.onRemoveItem}>remove</a></td>
        </tr>
      );
    },

    onEditItem: function(event) {
      var comp = LayerAdd({
        field: this.props.field
      });

      event.preventDefault();

      EAU.vent.trigger("modal:open", comp);
    },

    onRemoveItem: function(event) {
      event.preventDefault();

      this.props.field.destroy();
    }

  }); // end FieldView


  return FieldView;
});