# <b>JSON Object Validator</b>
A tool to define templates for JSON objects, and validate object properties according these templates.
## <b>Usage</b>
Below is an example of how to use json-object-validator.
>
  <code style="background-color: dark-grey">

    // Import json-object-validator.
    const jv = require('json-object-validator');

    // Create a schema/template for your JSON objects.
    var schema = jv.createSchema({
      foo: jv.setAttributes().isString().isNotNull().isNotRequired(),
      bar: jv.setAttributes().isNumber().isNotNull().hasDefaultValue(0)
    });

    // Test your objects against the schema.<br/>
    let jsonObject = { foo: "foo", bar: 2 };<br/>
    console.log(jv.validateJson(schema, jsonObject)); // Returns true.
  </code>