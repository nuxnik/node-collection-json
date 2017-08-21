'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _httpStatus = require('http-status');

var _httpStatus2 = _interopRequireDefault(_httpStatus);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * @extends Error
 */
var ExtendableError = function (_Error) {
  _inherits(ExtendableError, _Error);

  function ExtendableError(message, isPublic) {
    _classCallCheck(this, ExtendableError);

    var _this = _possibleConstructorReturn(this, (ExtendableError.__proto__ || Object.getPrototypeOf(ExtendableError)).call(this, message));

    _this.name = _this.constructor.name;
    _this.message = message;
    _this.isPublic = isPublic;
    _this.isOperational = true; // This is required since bluebird 4 doesn't append it anymore.
    Error.captureStackTrace(_this, _this.constructor.name);
    return _this;
  }

  return ExtendableError;
}(Error);

/**
 * Class representing an API error.
 * @extends ExtendableError
 */


var CollectionError = function (_ExtendableError) {
  _inherits(CollectionError, _ExtendableError);

  /**
   * Creates an API error.
   * @param {string} message - Error message.
   * @param {number} status - HTTP status code of error.
   * @param {boolean} isPublic - Whether the message should be visible to user or not.
   */
  function CollectionError(message) {
    var isPublic = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    _classCallCheck(this, CollectionError);

    return _possibleConstructorReturn(this, (CollectionError.__proto__ || Object.getPrototypeOf(CollectionError)).call(this, message, isPublic));
  }

  return CollectionError;
}(ExtendableError);

exports.default = CollectionError;