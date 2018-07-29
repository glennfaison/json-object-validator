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
    console.log(jv.objectIsValid(schema, jsonObject)); // logs true.
    
    // Create an invalid object.<br/>
    let invalidObject = { foo: 0, bar: null };<br/>
    
    // Test against the schema.<br/>
    console.log(jv.validateJson(schema, jsonObject)); // logs false.<br/>
    
    // Make the object valid.
    invalidObject = jv.makeObjectValid(schema, invalidObject);<br/>
    
    // Now you can check to see the result.<br/>
    console.log(invalidObject);<br/>
    
  </code>
