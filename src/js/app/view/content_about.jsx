define(function(require) {

  "use strict";

  var React = require("react");

  /**
   *
   *
   *
   */
  var ContentAbout = React.createClass({

    render: function() {
      return (
        <div className="eau-main-content">
          <h2>About Easy-USt</h2>
          <p>Easy-USt ist der schnellste und unkomplizierteste Weg ihr monatliche oder quartalsweise Umsatzseteuervoranmeldung zu erledigen. Das Interface ist auf die typischen Anwendungsfälle optimiert und zeigt Ihnen nur die Optionen an, die Sie wiklich benötigen. Alle Komplexität passiert hinter den Kulissen.</p>
          <p>Tragen Sie ihre Einzelposten (Umsätze und Ausgaben) ein. Anschließend überträgt Easy-USt ihr Voranmeldung mittels der ELSTER Schnittstelle an ihr zuständiges Finanzamt.</p>
          <p>Nach erfolgreicher Übertragung können Sie sich ein Übertragungsprotokoll herunterladen. Außerdem können Sie sich alle eingetragen Posten exportieren und z.B. für die Steuererklärung nutzen.</p>
          <p>Easy-USt dient aussschließlich zur Abwicklung der Umsatzseteuervoranmeldung. Für ihre Steuererklärung nutzen gibt es alternative Software (oder den Steuerberater). Natürlich können Sie die übers Jahr eingepflegten Posten als Hilfe oder Vorlage für den Jahresabschluss nutzen.</p>
        </div>
      );
    }
  }); // end ContentAbout


  return ContentAbout;
});