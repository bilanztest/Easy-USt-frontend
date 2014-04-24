define(function(require) {

  "use strict";

  var EAU = require("app/ns");
  var React = require("react");
  var $ = require("jquery");

  var Field = require("app/model/field");

  require("typeahead");

  /**
   *
   *
   *
   */
  var LayerAdd = React.createClass({
    
    getInitialState: function() {
      return {
        currentState: "ok",
        errors: [],
        errorField: null,

        type: "in",
        day: "",
        month: "",
        year: "",
        desc: "",
        value: "",
        ust: 19,
        isSending: null
      };
    },

    componentWillMount: function() {
      // for add we pass the fieldColletion, for edit the fieldModel to edit
      var modelOrCollection = this.props.fields || this.props.field,
        field = this.props.field;

      // set field states if this is an edit
      this.setState({
        type: field && field.get("type"),
        day: field && new Date(field.get("booked")).getDate(),
        month: field && field.get("booked").getMonth() + 1,
        year: field && field.get("booked").getFullYear(),
        desc: field && field.get("description"),
        value: field && field.get("value"),
        ust: field && field.get("ust") || "19"
      });

      modelOrCollection.on("invalid", function(model, errorArray) {
        var stateObj = {
          currentState: "error",
          // create array of error messages
          errors: errorArray.map(function(item) {
            return item.msg;
          })
        };

        // add error classes
        errorArray.forEach(function(item) {
          stateObj[item.fieldRef + "ErrorClass"] = "input-error";
        });

        this.setState(stateObj);
      }, this);
    },

    componentWillUnmount: function() {
      var modelOrCollection = this.props.fields || this.props.field;
      modelOrCollection.off(null, null, this);
    },

    componentDidMount: function() {
      // check if typeaheadEngine was passed, if this is an edit the
      // typeaheadEngine is NOT passed
      if (this.props.typeaheadEngine) {
        var $input = $(this.getDOMNode()).find("input[name=desc]");
        $input.typeahead({
          minLength: 3,
          highlight: true,
        },
        {
          name: "dataset",
          displayKey: "description",
          source: this.props.fields.engine.ttAdapter()
        });

        $input.on("typeahead:selected", $.proxy(this._typeaheadSelected, this));
        $input.on("typeahead:autocompleted", $.proxy(this._typeaheadSelected, this));
      }
    },

    _typeaheadSelected: function(evt, data) {
      // manually close typeahead because this is not done by default
      // on autocomplete
      var $input = $(this.getDOMNode()).find("input[name=desc]");
      $input.typeahead("close");

      this.setState({
        type: data && data.type,
        day: data && data.booked.getDate(),
        month: data && data.booked.getMonth() + 1,
        year: data && data.booked.getFullYear(),
        desc: data && data.description,
        value: data && data.value,
        ust: data && data.ust
      });
    },

    handleChange: function(evt) {
      var o = {};
      o[evt.target.name] = evt.target.value;
      this.setState(o);
    },

    render: function() {
      return (
        <div className="easy-modal-add-field">
          <a href="/close" onClick={this.onCloseClick}>&times; schließen</a>
          <h2>Feld hinzufügen</h2>
          <form id="add" onSubmit={this.onSubmit}>
            <label>
              <input type="radio" name="type" ref="typeIn" value="in" checked={this.state.type === "in"} className={this.state.typeErrorClass} onChange={this.handleChange}/> Einnahme
            </label><br />
            <label>
              <input type="radio" name="type" ref="typeOut" value="out" checked={this.state.type === "out"} className={this.state.typeErrorClass} onChange={this.handleChange}/> Ausgabe
            </label><br />

            <label htmlFor="day">Tag</label>
            <input type="number" step="1" min="1" max="31" name="day" ref="day" value={this.state.day} className={this.state.bookedErrorClass} onChange={this.handleChange}/>

            <label htmlFor="month">Monat</label>
            <input type="number" step="1" min="1" max="12" name="month" ref="month" value={this.state.month} className={this.state.bookedErrorClass} onChange={this.handleChange}/>

            <label htmlFor="year">Jahr</label>
            <input type="number" step="1" min="2010" max="2015" name="year" ref="year" value={this.state.year} className={this.state.bookedErrorClass} onChange={this.handleChange}/><br />
            
            <label htmlFor="desc">Beschreibung</label>
            <input type="text" name="desc" ref="desc" defaultValue={this.state.desc} className={this.state.descErrorClass}/><br />

            <label htmlFor="value">Wert</label>
            <input type="number" step="1" min="0" max="1000000" name="value" ref="value" value={this.state.value} className={this.state.valueErrorClass} onChange={this.handleChange}/><br />

            <label htmlFor="ust">Umsatzsteuer %</label>
            <select name="ust" ref="ust" value={this.state.ust} className={this.state.ustErrorClass} onChange={this.handleChange}>
              <option value="0">0</option> 
              <option value="7">7</option>
              <option value="19">19</option>
            </select><br/>
            {
              this.state.errors.map(function(error) {
                return <p>{error}</p>
              })
            }
            <input type="submit" disabled={this.state.isSending} />
          </form>
        </div>
      );
    },

    onSubmit: function(event) {
      var data = {
          type: this.state.type,
          // special handling for the desciption field. Since we apply typeahead
          // to this DOM element we use it as "Uncontrolled Component" (see
          // react docs)
          description: this.refs.desc.getDOMNode().value,
          value: this.state.value,
          ust: this.state.ust,
          booked: new Date(this.state.year, this.state.month - 1, this.state.day)
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
        errors: []
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
      // TODO this will break things until the backend validater is modified

      var response = JSON.parse(xhr.responseText);

      this.setState({
        currentState: "error",
        error: new Error("Error: " + response.message)
      });

      // TODO handle wrongly added model in collection
    },

    onSuccess: function() {
      this.refs.desc.getDOMNode().value = "";
      this.setState(this.getInitialState());

      if (this.props.field) {
        EAU.vent.trigger("modal:close");
      }
    }

  }); // end LayerAdd


  return LayerAdd;
});