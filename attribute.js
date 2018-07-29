const types = require('./types');
/**
 * @description Constructor for {Attribute}
 */
var Attribute = function(){
  this.valueType = types.Object;
  this.defaultValue = null;
  this.isNullable = true;
  this.isRequired = true;
};
// Set the attribute valueType.
Attribute.prototype.isString = function() {
  this.valueType = types.String;
  this.defaultValue = "";
  return this;
};
Attribute.prototype.isNumber = function() {
  this.valueType = types.Number;
  this.defaultValue = new Number();
  return this;
};
Attribute.prototype.isArray = function() {
  this.valueType = types.Array;
  this.defaultValue = new Array();
  return this;
};
Attribute.prototype.isDate = function() {
  this.valueType = types.Date;
  this.defaultValue = new Date();
  return this;
};
Attribute.prototype.isObject = function() {
  this.valueType = types.Object;
  this.defaultValue = new Object();
  return this;
};
Attribute.prototype.isBoolean = function() {
  this.valueType = types.Boolean;
  this.defaultValue = false;
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
  if(defaultValue === null) { this.isNullable = true; }
  return this;
};
// Set the attribute isNullable.
Attribute.prototype.isNotNull = function() {
  this.isNullable = false;
  this.isRequired = true;
  return this;
};
// Set the attribute isRequired.
Attribute.prototype.isNotRequired = function() {
  this.isRequired = false;
  return this;
};

module.exports = Attribute;