var JsonValidator = function() {};

JsonValidator.types = {
  "String": String.prototype.constructor,
  "Number": Number.prototype.constructor,
  "Array": Array.prototype.constructor,
  "Buffer": Buffer.prototype.constructor,
  "Object": Object.prototype.constructor,
  "Boolean": Boolean.prototype.constructor,
};

var Attribute = function(){
  this.valueType;
  this.defaultValue = null;
  this.isNullable = true;
  this.isRequired = true;
};
// Set the attribute valueType.
Attribute.prototype.isString = function() {
  this.valueType = JsonValidator.types.String;
  return this;
};
Attribute.prototype.isNumber = function() {
  this.valueType = JsonValidator.types.Number;
  return this;
};
Attribute.prototype.isArray = function() {
  this.valueType = JsonValidator.types.Array;
  return this;
};
Attribute.prototype.isBuffer = function() {
  this.valueType = JsonValidator.types.Buffer;
  return this;
};
Attribute.prototype.isObject = function() {
  this.valueType = JsonValidator.types.Object;
  return this;
};
Attribute.prototype.isBoolean = function() {
  this.valueType = JsonValidator.types.Boolean;
  return this;
};

// Set the attribute defaultValue.
Attribute.prototype.hasDefaultValue = function(defaultValue) {
  this.defaultValue = defaultValue;
  return this;
};
// Set the attribute isNullable.
Attribute.prototype.isNotNull = function() {
  this.isNullable = false;
  return this;
};
// Set the attribute isRequired.
Attribute.prototype.isNotRequired = function() {
  this.isRequired = false;
  return this;
};

// Create Attribute object in Schema.
JsonValidator.setAttributes = function() {
  return new Attribute();
};
JsonValidator.createSchema = function(schemaProps, extensible=false) {
  // Perform error checks first.
  let schema = {};
  schema.properties = schemaProps;
  schema.isExtensible = extensible;
  return schema;
};
JsonValidator.validateJson = function(schema, jsonObject) {
  for(let prop in schema.properties) {
    if(!jsonObject.hasOwnProperty(prop) && schema.properties[prop].isRequired) {
      return false;
    }
    if(jsonObject[prop] === null && schema.properties[prop].isNotNull) {
      return false;
    }
    if(jsonObject[prop].constructor !== schema.properties[prop].valueType) {
      return false;
    }
    if(!Object.keys(schema.properties).includes(prop) && !schema.isExtensible) {
      return false;
    }
  }
  return true;
};


module.exports.JsonValidator = JsonValidator;
module.exports.Attribute = Attribute;
module.exports.createSchema = JsonValidator.createSchema;
module.exports.setAttributes = JsonValidator.setAttributes;
module.exports.validateJson = JsonValidator.validateJson;
module.exports.types = JsonValidator.types;