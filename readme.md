# <b>JSON Object Validator</b>
A tool to define templates for JSON objects, and determine if objects match these templates. Another use of this tool is to transform non-matching objects into matching objects.
## <b>Usage</b>
Below is an example of how to use json-object-validator.

```javascript

// Import json-object-validator.
const jv = require('json-object-validator');

// Create a schema/template for your JSON objects.
var schema = jv.createSchema({
  foo: jv.setAttributes().isString().isNotNull().isNotRequired(),
  bar: jv.setAttributes().isNumber().isNotNull().hasDefaultValue(0)
});

// Test your objects against the schema.
let jsonObject = { foo: "foo", bar: 2 };
console.log(jv.objectIsValid(schema, jsonObject)); // logs true.

// Create an invalid object.
let invalidObject = { foo: 0, bar: null };

// Test against the schema.
console.log(jv.validateJson(schema, jsonObject)); // logs false.

// Make the object valid.
invalidObject = jv.makeObjectValid(schema, invalidObject);

// Now you can check to see the result.
console.log(invalidObject);

```
