# Contributing.md

## Coding style

Use the [Google JavaScript Style Guide](http://google-styleguide.googlecode.com/svn/trunk/javascriptguide.xml)

Exception:
* Use double quotes.

Use [require.js](http://requirejs.org/) modules in [CommonJS-style](http://requirejs.org/docs/api.html#cjsmodule).

Spaces after `:`, `()` and `if` (and others).  
No linebreaks between BB properties.  
Linebreaks between BB functions.  
First BB "public" functions, then custom "public" functions, then "private".  
Linebreak after single var statements on beginning of function.

Example (stripped):

```javascript
define(function(require) {

  "use strict";

  /** imports **/
  var Backbone = require("backbone");

  /**
   *
   *
   *
   */
  var BlockView = Backbone.View.extend({
    attr: "lorem",
    template: _.template(tmpl),
    events: {
      "click a": "deleteBlock"
    },

    initialize: function() {
      this.model.on("change", this._onModelUpdate, this);
      if (this.attr === "lorem") {
        // do this ...
      } else {
        // do that ...
      }
      this.render();
    },

    _onModelUpdate: function(model) {
      var obj;

      this.$el.find("h4").text("Block + " + model.id);

      // it's ok to write objects with a single value like this
      // btw: always space after colon (:)
      obj = {key: "value"};
      // but when there are more than one, it should be
      obj = {
        key1: "value1",
        key2: "value2"
      };
    }
  });

  return BlockView;
});
```

## Commit messages

Inpired by [Git Commit Message Conventions](https://docs.google.com/document/d/1QrDFcIiPjSLDn3EL15IJygNPiHORgU1_OOAqWjiDU5Y/edit) by google.

When doing unimportant stuff like adding/removing spaces/empty lines, indentation use

```clean code[write here whatever you want]```

Example:

```
clean code, remove line break
clean code: change intention from tabs to spaces
```
