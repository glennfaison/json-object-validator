const types = require('./types');

/**
 * Constructor for {Attribute}
 */
var Attribute = function(){
  this.valueType = types.Object;
  this.defaultValue = null;
  this.isNullable = true;
  this.isRequired = true;
};
/**
 * Sets that a conforming object is required to be of type String.
 * @returns {Attribute} the current Attribute object.
 */
Attribute.prototype.isString = function() {
  this.valueType = types.String;
  this.defaultValue = "";
  return this;
};
/**
 * Sets that a conforming object is required to be of type Number.
 * @returns {Attribute} the current Attribute object.
 */
Attribute.prototype.isNumber = function() {
  this.valueType = types.Number;
  this.defaultValue = new Number();
  return this;
};
/**
 * Sets that a conforming object is required to be of type Array.
 * @returns {Attribute} the current Attribute object.
 */
Attribute.prototype.isArray = function() {
  this.valueType = types.Array;
  this.defaultValue = new Array();
  return this;
};
/**
 * Sets that a conforming object is required to be of type Date.
 * @returns {Attribute} the current Attribute object.
 */
Attribute.prototype.isDate = function() {
  this.valueType = types.Date;
  this.defaultValue = new Date();
  return this;
};
/**
 * Sets that a conforming object is required to be of type Object (or any type).
 * @returns {Attribute} the current Attribute object.
 */
Attribute.prototype.isObject = function() {
  this.valueType = types.Object;
  this.defaultValue = new Object();
  return this;
};
/**
 * Sets that a conforming object is required to be of type Boolean.
 * @returns {Attribute} the current Attribute object.
 */
Attribute.prototype.isBoolean = function() {
  this.valueType = types.Boolean;
  this.defaultValue = false;
  return this;
};
/**
 * Sets the default value for a conforming object's property.
 * @param {Object} defaultValue The value to set as default.
 * @returns {Attribute} the current Attribute object.
 */
Attribute.prototype.hasDefaultValue = function(defaultValue) {
  this.defaultValue = defaultValue;
  if(defaultValue === null) { this.isNullable = true; }
  return this;
};
/**
 * Set whether or not the value for a conforming object's
 * property could be null.
 * @returns {Attribute} the current Attribute object.
 */
Attribute.prototype.isNotNull = function() {
  this.isNullable = false;
  this.isRequired = true;
  return this;
};
/**
 * Set whether or not the value for a conforming object's
 * property must be defined.
 * @returns {Attribute} the current Attribute object.
 */
Attribute.prototype.isNotRequired = function() {
  this.isRequired = false;
  return this;
};

module.exports = Attribute;