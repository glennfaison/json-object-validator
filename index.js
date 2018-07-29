const Attribute = require('./attribute');
const types = require('./types');
/**
 * @description Constructor for {JsonValidator}
 */
var JsonValidator = function() {};

const constructors = {
  "String": String.prototype.constructor,
  "Number": Number.prototype.constructor,
  "Array": Array.prototype.constructor,
  "Date": Date.prototype.constructor,
  "Object": Object.prototype.constructor,
  "Boolean": Boolean.prototype.constructor
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
      if(schema.properties[prop].valueType === types.Date) {
        if(propConstructorName === types.Boolean) { return false; }
        if(propConstructorName === types.String) {
          try {
            Date.parse(jsonObject[prop]);
          } catch (error) {
            return false;
          }
        }
      }
      if(schema.properties[prop].valueType !== types.Object &&
        schema.properties[prop].valueType !== types.Date) { return false; }
    }
    if(!Object.keys(schema.properties).includes(prop) && !schema.isExtensible) {
      return false;
    }
  }
  return true;
};
JsonValidator.makeObjectValid = function(schema, jsonObject) {
  // Remove unneeded properties.
  if(!schema.isExtensible) {
    for(let prop in jsonObject) {
      if(!Object.keys(schema.properties).includes(prop)) {
        delete jsonObject[prop];
      }
    }
  }
  // Introduce missing properties.
  for(let prop in schema.properties) {
    let defaultValue = schema.properties[prop].defaultValue;
    if(defaultValue === undefined) {
      if(schema.properties[prop].valueType === types.String) {
        defaultValue = "";
      }
      else if(schema.properties[prop].valueType === types.Boolean) {
        defaultValue = false;
      } else {
        defaultValue = new constructors[schema.properties[prop].valueType]();
      }
    }
    if(!jsonObject.hasOwnProperty(prop) && schema.properties[prop].isRequired) {
      jsonObject[prop] = defaultValue;
      continue;
    }
    if(jsonObject[prop] === null && schema.properties[prop].isNotNull) {
      jsonObject[prop] = defaultValue;
      continue;
    }
    if(jsonObject[prop] === null && schema.properties[prop].defaultValue !== null) {
      jsonObject[prop] = defaultValue;
      continue;
    }
    if(jsonObject[prop] === null) { continue; }
    let propConstructorName = jsonObject[prop].constructor.name;
    if(propConstructorName !== schema.properties[prop].valueType) {
      if(schema.properties[prop].valueType === types.Date) {
        if(propConstructorName === types.Boolean) {
          jsonObject[prop] = defaultValue;
          continue;
        }
        if(propConstructorName === types.String) {
          try {
            Date.parse(jsonObject[prop]);
          } catch (error) {
            jsonObject[prop] = defaultValue;
            continue;
          }
        }
      }
      if(schema.properties[prop].valueType !== types.Object &&
        schema.properties[prop].valueType !== types.Date) {
        jsonObject[prop] = defaultValue;
        continue;
      }
    }
  }
  return jsonObject;
};

JsonValidator.Attribute = Attribute;
JsonValidator.types = types;


module.exports = JsonValidator;
module.exports.Attribute = Attribute;
module.exports.types = types;