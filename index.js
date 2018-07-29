/**
 * @description Constructor for {JsonValidator}
 */
var JsonValidator = function() {};

JsonValidator.types = {
  "String": "String",
  "Number": "Number",
  "Array": "Array",
  "Buffer": "Buffer",
  "Object": "Object",
  "Boolean": "Boolean",
  "Function": "Function",
  "Date": "Date",
};
/**
 * @description Constructor for {Attribute}
 */
var Attribute = function(){
  this.valueType = JsonValidator.types.Object;
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
/**
 * @description Sets the default value for a conforming object's property.
 *
 * @param {String} directory The directory where the db files should be installed.
 */
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
  let schema = {};
  schema.properties = schemaProps;
  schema.isExtensible = extensible;
  let schemaSchema = {
    properties: {
      valueType: {
        valueType: JsonValidator.types.String,
        defaultValue: JsonValidator.types.Object,
        isNullable: false,
        isRequired: true
      },
      defaultValue: {
        valueType: JsonValidator.types.Object,
        defaultValue: null,
        isNullable: true,
        isRequired: true
      },
      isNullable: {
        valueType: JsonValidator.types.Boolean,
        defaultValue: true,
        isNullable: false,
        isRequired: true
      },
      isRequired: {
        valueType: JsonValidator.types.Boolean,
        defaultValue: true,
        isNullable: false,
        isRequired: true
      }
    },
    isExtensible: false
  };
  // Perform error checks.
  for(let prop in schema.properties) {
    if(!JsonValidator.objectIsValid(schemaSchema, schema.properties[prop])) {
      if(!isValid) { throw new Error("Invalid schema object"); }
    }
  }
  return schema;
};
JsonValidator.objectIsValid = function(schema, jsonObject) {
  for(let prop in schema.properties) {
    if(!jsonObject.hasOwnProperty(prop) && schema.properties[prop].isRequired) {
      return false;
    }
    if(jsonObject[prop] === null && schema.properties[prop].isNotNull) {
      return false;
    }
    if(jsonObject[prop] === null && schema.properties[prop].defaultValue !== null) {
      return false;
    }
    if(jsonObject[prop] === null) { continue; }
    let propConstructorName = jsonObject[prop].constructor.name;
    if(propConstructorName !== schema.properties[prop].valueType) {
      if(schema.properties[prop].valueType === JsonValidator.types.Date) {
        if(propConstructorName === JsonValidator.types.Boolean) { return false; }
        if(propConstructorName === JsonValidator.types.String) {
          try {
            Date.parse(jsonObject[prop]);
          } catch (error) {
            return false;
          }
        }
      }
      if(schema.properties[prop].valueType !== JsonValidator.types.Object &&
        schema.properties[prop].valueType !== JsonValidator.types.Date) { return false; }
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
module.exports.objectIsValid = JsonValidator.objectIsValid;
module.exports.types = JsonValidator.types;