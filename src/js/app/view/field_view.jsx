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
      var val = this.props.field.get("value"),
        ust = this.props.field.get("ust"),
        ustOnly = val / (ust + 100) * ust;

      return (
        <tr key={this.props.type + this.props.index}>
          <td>{formater.date(this.props.field.get("booked"), "dd.MM.")}</td>
          <td className="description">{this.props.field.get("description")}</td>
          <td className="align-right">{val + "€"}</td>
          <td className="grey">*</td>
          <td className="align-right">{ust + "%"}</td>
          <td className="grey">&#61;</td>
          <td className="align-right">{formater.round(ustOnly, 100) + "€"}</td>
          <td><a href="#" onClick={this.onEditItem}><div className="icon icon-edit"></div></a></td>
          <td><a href="#" onClick={this.onRemoveItem}><div className="icon icon-delete"></div></a></td>
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