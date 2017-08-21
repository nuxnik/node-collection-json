'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Entity2 = require('./Entity');

var _Entity3 = _interopRequireDefault(_Entity2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Creates a valid collection+json error object
 *
 * @author S. Fleming <npm@int5.net>
 * @since Tue Jul 25 11:07:32 CEST 2017
 */
var Error = function (_Entity) {
  _inherits(Error, _Entity);

  _createClass(Error, null, [{
    key: 'getByObject',

    /**
     * Get error object by json data object
     *
     * @param {Object} json The JSON object
     * @return error
     */
    value: function getByObject(json) {
      //check the title
      var titleString = Error.getObjectValueByKey(json, "title");
      if (titleString === undefined) {
        throw new CollectionError('error.title String undefined');
      }

      //check the code
      var codeString = Error.getObjectValueByKey(json, "code");
      if (codeString === undefined) {
        throw new CollectionError('error.code String undefined');
      }

      //check the message
      var messageString = Error.getObjectValueByKey(json, "message");
      if (messageString === undefined) {
        throw new CollectionError('error.message String undefined');
      }

      // init the object
      var error = new Error(titleString, codeString, messageString);

      return error;
    }

    /**
     * The class constructor
     *
     * @param string title The error title
     * @param string code The error code
     * @param string message The error message
     */

  }]);

  function Error(title, code, message) {
    _classCallCheck(this, Error);

    var _this = _possibleConstructorReturn(this, (Error.__proto__ || Object.getPrototypeOf(Error)).call(this));

    _this.setTitle(title);
    _this.setCode(code);
    _this.setMessage(message);
    return _this;
  }

  /**
   * Get the title string
   *
   * @return string
   */


  _createClass(Error, [{
    key: 'getTitle',
    value: function getTitle() {
      return this.title;
    }

    /**
     * Set the title string
     *
     * @param string title The title string
     * @return Error
     */

  }, {
    key: 'setTitle',
    value: function setTitle(title) {
      this.title = title;

      return this;
    }

    /**
     * Get the code string
     *
     * @return string
     */

  }, {
    key: 'getCode',
    value: function getCode() {
      return this.code;
    }

    /**
     * Set the code string
     *
     * @param string code The code string
     * @return Error
     */

  }, {
    key: 'setCode',
    value: function setCode(code) {
      this.code = code;

      return this;
    }

    /**
     * Get the message string
     *
     * @return string
     */

  }, {
    key: 'getMessage',
    value: function getMessage() {
      return this.message;
    }

    /**
     * Set the message string
     *
     * @param string message The message string
     * @return Error
     */

  }, {
    key: 'setMessage',
    value: function setMessage(message) {
      this.message = message;

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
      var error = {};
      if (this.title) {
        error.title = this.getTitle();
      }
      if (this.code) {
        error.code = this.getCode();
      }
      if (this.message) {
        error.message = this.getMessage();
      }

      return error;
    }

    /**
     * Stringify the error object
     *
     * @return string
     */

  }, {
    key: 'toString',
    value: function toString() {
      return this.getJson().toString();
    }
  }]);

  return Error;
}(_Entity3.default);

exports.default = Error;