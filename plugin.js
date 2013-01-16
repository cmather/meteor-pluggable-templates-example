if (Meteor.isClient) {

  function inherit (Super, Child) {
    if (Object.create) {
      Child.prototype = Object.create(Super.prototype);
    } else {
      var F = function () {};
      F.prototype = Super.prototype;
      Child.prototype = new F();
      Child.prototype.constructor = Child;
    }

    return Child;
  }

  function TemplatePlugin (options) {
    this.options = options || {};
    this.name = options.name || "Plugin";
  }

  TemplatePlugin.prototype = {
    constructor: TemplatePlugin,

    created: function (template) {
      console.log(this.name, ' created callback', 'this: ', this, 
                  'args: ', arguments);
    },

    rendered: function (template) {
      console.log(this.name, ' rendered callback', 
                  'this: ', this, 'args: ', arguments);
    },

    destroyed: function (template) {
      console.log(this.name, ' destroyed callback', 'this: ', this, 'args: ',
                  arguments);
    },

    events: {}
  };

  function SimpleForm (options) {
    var defaults = {
      selector: "form"
    };
    TemplatePlugin.prototype.constructor.call(this, options);

    this.name = "SimpleForm";
    this.options = _.extend(defaults, this.options);
  }

  inherit(TemplatePlugin, SimpleForm);

  _.extend(SimpleForm.prototype, {
    events: {
      "submit form": function (e, tmpl) {
        e.preventDefault();

        var fields = this.serialize(tmpl);
        console.log("SimpleForm Submit Handler", this, arguments);
        console.log("SimpleForm Fields: ", fields);
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

  function AnotherPlugin (options) {
    this.name = "AnotherPlugin";
    TemplatePlugin.prototype.constructor.call(this, options);
  }

  inherit(TemplatePlugin, AnotherPlugin);

  _.extend(AnotherPlugin.prototype, {
    events: {
      "submit form": function (e, tmpl) {
        console.log("Another plugin handling submit", this, arguments);
      }
    }
  });

  Template.myForm.plugins({
    "form": new SimpleForm({}),
    "another": new AnotherPlugin({})
  });
}
