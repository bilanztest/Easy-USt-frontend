define(function(require) {

  "use strict";

  var React = require("react");

  var EAU = require("app/ns");

  /**
   *
   *
   *
   */
  var ContentSettings = React.createClass({

    getInitialState: function() {
      var userModel = EAU.user;

      return {
        lastName: userModel.get("lastName") || "",
        firstName: userModel.get("firstName") || "",
        companyType: userModel.get("companyType") || "",
        legalForm: userModel.get("legalForm") || "",
        street: userModel.get("street") || "",
        streetNumber: userModel.get("streetNumber") || "",
        zipCode: userModel.get("zipCode") || "",
        city: userModel.get("city") || "",
        taxNumber: userModel.get("taxNumber") || ""
      };
    },

    handleChange: function(evt) {
      var o = {};
      
      o[evt.target.name] = evt.target.value;
      this.setState(o);
    },

    render: function() {
      return (
        <div className="eau-main-content">
          <h2>Einstellungen</h2>
          <p>Folgende Angaben werden für die Übermittlung der Daten an das Finanzamt benötigt.</p>
          <form onSubmit={this.onSubmit}>
            <input type="text" name="lastName" placeholder="Nachname" value={this.state.lastName} onChange={this.handleChange}/><br/>
            <input type="text" name="firstName" placeholder="Vorname" value={this.state.firstName} onChange={this.handleChange}/><br/>
            <input type="text" name="companyType" placeholder="Unternehmensart (?)" value={this.state.companyType} onChange={this.handleChange}/><br/>
            <input type="text" name="legalForm" placeholder="Rechtsform" value={this.state.legalForm} onChange={this.handleChange}/><br/>
            <input type="text" name="street" placeholder="Strasse" value={this.state.street} onChange={this.handleChange}/>
            <input type="text" name="streetNumber" placeholder="Hausnummer" value={this.state.streetNumber} onChange={this.handleChange}/><br/>
            <input type="text" name="zipCode" placeholder="PLZ" value={this.state.zipCode} onChange={this.handleChange}/>
            <input type="text" name="city" placeholder="Ort" value={this.state.city} onChange={this.handleChange}/><br/>
            <hr/>
            <input type="text" name="taxNumber" placeholder="Steuernummer" value={this.state.taxNumber} onChange={this.handleChange}/><br/>
            <input type="submit" />
          </form>
        </div>
      );
    },

    onSubmit: function(event) {
      var userModel = EAU.user;

      userModel.save({
        lastName: this.state.lastName,
        firstName: this.state.firstName,
        companyType: this.state.companyType,
        legalForm: this.state.legalForm,
        street: this.state.street,
        streetNumber: this.state.streetNumber,
        zipCode: this.state.zipCode,
        city: this.state.city,
        taxNumber: this.state.taxNumber
      }, {
        success: this.onSuccess
      });

      event.preventDefault();

      return false;
    },

    onSuccess: function() {
      console.log("success");
    }

  }); // end ContentSettings


  return ContentSettings;
});