'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Entity2 = require('./Entity');

var _Entity3 = _interopRequireDefault(_Entity2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Creates a valid collection+json data object
 *
 * @author S. Fleming <npm@int5.net>
 * @since Tue Jul 25 11:07:32 CEST 2017
 */
var Data = function (_Entity) {
  _inherits(Data, _Entity);

  _createClass(Data, null, [{
    key: 'getByObject',

    /**
     * Get data object by json data object
     *
     * @todo - finish this
     * @param {Object} json The JSON object
     * @return data
     */
    value: function getByObject(json) {
      //check the name
      var nameString = Data.getObjectValueByKey(json, "name");
      if (nameString === undefined) {
        throw new CollectionError('data.name String undefined');
      }

      //check the value
      var valueString = Data.getObjectValueByKey(json, "value");
      if (valueString === undefined) {
        throw new CollectionError('data.value String undefined');
      }

      //check the prompt - optional
      var promptString = Data.getObjectValueByKey(json, "prompt");
      var data = new Data(nameString, valueString, promptString);

      return data;
    }

    /**
     * The class constructor
     *
     * @param string name The data name
     * @param string value The data value
     * @param string prompt The data prompt
     */

  }]);

  function Data(name) {
    var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    var prompt = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

    _classCallCheck(this, Data);

    var _this = _possibleConstructorReturn(this, (Data.__proto__ || Object.getPrototypeOf(Data)).call(this));

    _this.setName(name);
    _this.setValue(value);
    _this.setPrompt(prompt);
    return _this;
  }

  /**
   * Get the name string
   *
   * @return string
   */


  _createClass(Data, [{
    key: 'getName',
    value: function getName() {
      return this.name;
    }

    /**
     * Set the name string
     *
     * @param string name The name string
     * @return data
     */

  }, {
    key: 'setName',
    value: function setName(name) {
      this.name = name;

      return this;
    }

    /**
     * Get the value string
     *
     * @return string
     */

  }, {
    key: 'getValue',
    value: function getValue() {
      return this.value;
    }

    /**
     * Set the value string
     *
     * @param string value The value string
     * @return data
     */

  }, {
    key: 'setValue',
    value: function setValue(value) {
      this.value = value;

      return this;
    }

    /**
     * Get the prompt string
     *
     * @return string
     */

  }, {
    key: 'getPrompt',
    value: function getPrompt() {
      return this.prompt;
    }

    /**
     * Set the prompt string
     *
     * @param string prompt The prompt string
     * @return data
     */

  }, {
    key: 'setPrompt',
    value: function setPrompt(prompt) {
      this.prompt = prompt;

      return this;
    }

    /**
     * Get compiled json object
     *
     * @return Object
     */

  }, {
    key: 'getJson',
    value: function getJson() {
      var data = {};
      data.name = this.getName();
      data.value = this.getValue();
      data.prompt = this.getPrompt();

      return data;
    }

    /**
     * transform collection+json format to a database friendly format
     *
     * @return Object
     */

  }, {
    key: 'getDatabaseObject',
    value: function getDatabaseObject() {
      return _defineProperty({}, this.name, this.value);
    }
  }]);

  return Data;
}(_Entity3.default);

exports.default = Data;