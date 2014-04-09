define(function(require) {

  "use strict";

  var React = require("react");

  var EAU = require("app/ns");

  /**
   *
   *
   *
   */
  var ModalView = React.createClass({

    getInitialState: function() {
      return {
        contentView: null
      };
    },

    componentDidMount: function() {
      EAU.vent.on("modal:open", this.openModal, this);
      EAU.vent.on("modal:close", this.closeModal, this);
    },

    render: function() {
      return (
        <div className="easy-modal-table" onClick={this.onCloseClick}>
          <div className="easy-modal-content">
            {this.state.contentView}
          </div>
        </div>
      );
    },

    openModal: function(contentView) {
      this.state.contentView = contentView;
      $("#modal").show();
      this.forceUpdate();
    },

    closeModal: function() {
      this.state.contentView = null;
      $("#modal").hide();
      this.forceUpdate();
    },

    onCloseClick: function(event) {
      // only fire when background (and not the content) was clicked
      if(event.target.className === "easy-modal-content") {
        EAU.vent.trigger("modal:close");
      }
    }

  }); // end ModalView

  return ModalView;
});