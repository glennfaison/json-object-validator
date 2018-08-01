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
 * @description Constructor for {JsonValidator}
 */
var JsonValidator = function() {};

// Create Attribute object in Schema.
JsonValidator.setAttributes = function() {
  return new Attribute();
};
JsonValidator.isNullOrUndefined = function(value) {
  return value === null || value === undefined;
};
JsonValidator.valueTypeMatches = function(property, valueType) {
  if(JsonValidator.isNullOrUndefined(property)) { return false; }
  if(!Object.keys(types).includes(valueType)) { console.log(valueType)
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
JsonValidator.createSchema = function(schemaProps, extensible=false) {
  let schema = {};
  schema.properties = schemaProps;
  schema.isExtensible = extensible;
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
JsonValidator.getDefaultValueForType = function(valueType) {
  let defaultValue;
  if (valueType === types.String) {
    defaultValue = "";
  }
  else if (valueType === types.Boolean) {
    defaultValue = false;
  }
  else {
    defaultValue = new constructors[valueType]();
  }
  return defaultValue;
};
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

JsonValidator.Attribute = Attribute;
JsonValidator.types = types;


module.exports = JsonValidator;
module.exports.Attribute = Attribute;
module.exports.types = types;
