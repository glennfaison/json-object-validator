const Attribute = require('./attribute');
const types = require('./types');

const constructors = {
  "String": String.prototype.constructor,
  "Number": Number.prototype.constructor,
  "Array": Array.prototype.constructor,
  "Date": Date.prototype.constructor,
  "Object": Object.prototype.constructor,
  "Boolean": Boolean.prototype.constructor
};

/**
 * Constructor for {JsonValidator}.
 */
var JsonValidator = function() {};

JsonValidator.Attribute = Attribute;
JsonValidator.types = types;

/**
 * Create default {Attribute} object in Schema.
 * @returns {Attribute} a default Attribute object.
 */
JsonValidator.setAttributes = function() {
  return new Attribute();
};
/**
 * Check if {property} is of type {valueType}.
 * @param {Any} property The value to be tested.
 * @param {String} valueType The name of the type.
 */
JsonValidator.valueTypeMatches = function(property, valueType) {
  if(property === null || property === undefined) { return false; }
  if(!Object.keys(types).includes(valueType)) {
    throw new Error("Invalid value type provided.");
  }
  if(property.constructor.name === valueType
    || valueType === types.Object) { return true; }
  else if(valueType === types.Date) {
    try {
      new Date(property);
    } catch (error) {
      return false;
    }
    try {
      Date.parse(property);
    } catch (error) {
      return false;
    }
    return true;
  }
  return false;
};
/**
 * Create a Schema/template object,
 * and set a value for whether or not it should be extensible.
 * @param {Object} schemaProps An object containing all expected object
 * properties, along with their {Attribute} specifications.
 * @param {Boolean} extensible Is false by default.
 */
JsonValidator.createSchema = function(schemaProps, isExtensible=false) {
  let schema = {};
  schema.properties = schemaProps;
  schema.isExtensible = isExtensible;
  let schemaSchema = {
    properties: {
      valueType: {
        valueType: types.String,
        defaultValue: types.Object,
        isNullable: false,
        isRequired: true
      },
      defaultValue: {
        valueType: types.Object,
        defaultValue: null,
        isNullable: true,
        isRequired: true
      },
      isNullable: {
        valueType: types.Boolean,
        defaultValue: true,
        isNullable: false,
        isRequired: true
      },
      isRequired: {
        valueType: types.Boolean,
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
/**
 * Evaluate whether an object conforms to a schema.
 * @param {Object} schema The schema to use as template.
 * @param {Object} jsonObject The object to be evaluated.
 */
JsonValidator.objectIsValid = function(schema, jsonObject) {
  let schemaPropss = Object.keys(schema.properties);
  // Check for missing properties.
  for(let prop in schema.properties) {
    // Check for unneeded properties
    if(!schemaPropss.includes(prop) && !schema.isExtensible) {
      return false;
    }
    let schemaDefaultValue = schema.properties[prop].defaultValue;
    let schemaValueType = schema.properties[prop].valueType;
    let propIsInValid =
      (jsonObject[prop] === undefined && schema.properties[prop].isRequired)
      || (jsonObject[prop] === null && schema.properties[prop].isNotNull);
    if(propIsInValid) { return false; }
    if(jsonObject[prop] === null || jsonObject[prop] === undefined) { continue; }
    let propConstructorName = jsonObject[prop].constructor.name;
    if(!JsonValidator.valueTypeMatches(jsonObject[prop], schemaValueType)) {
      if(schemaValueType === types.Date) {
        if(propConstructorName === types.String) {
          try {
            Date.parse(jsonObject[prop]);
            continue;
          } catch (error) { return false; }
        }
        else if(propConstructorName === types.Number) {
          try {
            new Date(jsonObject[prop]);
            continue;
          } catch (error) { return false; }
        }
        return false;
      }
      else if(schemaValueType === types.Object) { continue; }
      return false;
    }
  }
  return true;
};
/**
 * Evaluate whether an object conforms to a schema. If it doesn't,
 * edit the object's properties to make it conform.
 * @param {Object} schema The schema to be used as template.
 * @param {Object} jsonObject The object to be evaluated and edited.
 */
JsonValidator.makeObjectValid = function(schema, jsonObject) {
  let schemaPropss = Object.keys(schema.properties);
  // Introduce missing properties.
  for(let prop in schema.properties) {
    // Remove unneeded properties
    if(!schemaPropss.includes(prop) && !schema.isExtensible) {
      delete jsonObject[prop];
      continue;
    }
    let schemaDefaultValue = schema.properties[prop].defaultValue;
    let schemaValueType = schema.properties[prop].valueType;
    let propIsInValid =
      (jsonObject[prop] === undefined && schema.properties[prop].isRequired)
      || (jsonObject[prop] === null && schema.properties[prop].isNotNull);
    if(propIsInValid) {
      jsonObject[prop] = schemaDefaultValue;
      continue;
    }
    if(jsonObject[prop] === null || jsonObject[prop] === undefined) { continue; }
    let propConstructorName = jsonObject[prop].constructor.name;
    if(!JsonValidator.valueTypeMatches(jsonObject[prop], schemaValueType)) {
      if(schemaValueType === types.Date) {
        if(propConstructorName === types.String) {
          try {
            Date.parse(jsonObject[prop]);
            continue;
          } catch (error) {
            jsonObject[prop] = schemaDefaultValue;
            continue;
          }
        }
        else if(propConstructorName === types.Number) {
          try {
            new Date(jsonObject[prop]);
            continue;
          } catch (error) {
            jsonObject[prop] = schemaDefaultValue;
            continue;
          }
        }
        jsonObject[prop] = schemaDefaultValue;
        continue;
      }
      else if(schemaValueType === types.Object) { continue; }
      jsonObject[prop] = schemaDefaultValue;
      continue;
    }
  }
  return jsonObject;
};

module.exports = JsonValidator;
module.exports.Attribute = Attribute;
module.exports.types = types;
