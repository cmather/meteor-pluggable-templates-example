## Dependencies

I've made some customizations to the templates package in my
fork of Meteor.  You can see the changes on the 'cmather' branch of my fork:

git@github.com:cmather/meteor.git

## Goal

The goal is to be able to add functionality to Meteor templates without tight
coupling to the templates. This will allow third parties to develop packages
that can plugin to users' templates easily. For example, a user might want
standard form parsing. To do that they might install the simple-forms package
and plugin a new SimpleForm instance into whatever template they want.

## Example

```javascript
  function SimpleForm (options) {
    var self = this;
    var defaults = {
      selector: "form",
      onSubmit: function (fields) { console.log(fields) }
    };

    self.name = "SimpleForm";
    self.options = _.extend(defaults, options);
    self.onSubmit = self.onSubmit || self.options.onSubmit;
  }

  _.extend(SimpleForm.prototype, {
    events: {
      "submit form": function (e, tmpl) {
        e.preventDefault();
        var fields = this.serialize(tmpl);
        this.onSubmit(fields);
      }
    },

    serialize: function (template) {
      var self = this;
      var fields = {};
      var field;

      self.eachField(template, function (field) {
        if (field.type === 'submit') return;
        fields[field.name] = field.value;
      });

      return fields;
    },

    eachField: function (template, fn) {
      var self = this;
      var form = template.find(self.options.selector);
      
      for (var i = 0; i < form.length; i++) {
        fn(form[i]);
      }
    }
  });

  // Now plug my Template with the SimpleForm behavior!

  Template.someForm.plugin({
    "simpleForm" : new SimpleForm({
      selector: "form",
      onSubmit: function (fields) {
        // do something special with the fields
      }
    }),

    "someOther" : new SomeOtherPlugin({})
  });
```
