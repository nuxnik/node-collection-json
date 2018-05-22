import CollectionError from './CollectionError';
import Entity from './Entity';

/**
 * Creates a valid collection+json error object
 *
 * @author S. Fleming <npm@int5.net>
 * @since Tue Jul 25 11:07:32 CEST 2017
 */
export default class Error extends Entity
{
  /**
   * Get error object by json data object
   *
   * @param {Object} json The JSON object
   * @return error
   */
  static getByObject(json)
  {
    //check the title
    let titleString = Error.getObjectValueByKey(json, "title");
    if (titleString === undefined) {
        throw new CollectionError('error.title String undefined');
    }

    //check the code
    let codeString = Error.getObjectValueByKey(json, "code");
    if (codeString === undefined) {
        throw new CollectionError('error.code String undefined');
    }

    //check the message
    let messageString = Error.getObjectValueByKey(json, "message");
    if (messageString === undefined) {
        throw new CollectionError('error.message String undefined');
    }

    // init the object
    let error = new Error(titleString, codeString, messageString);

    return error;
  }

  /**
   * The class constructor
   *
   * @param string title The error title
   * @param string code The error code
   * @param string message The error message
   */
  constructor(title, code, message)
  {
    super();

    this.setTitle(title);
    this.setCode(code);
    this.setMessage(message);
  }

  /**
   * Get the title string
   *
   * @return string
   */
  getTitle()
  {
    return this.title;
  }

  /**
   * Set the title string
   *
   * @param string title The title string
   * @return Error
   */
  setTitle(title)
  {
    this.title = title;

    return this;
  }

  /**
   * Get the code string
   *
   * @return string
   */
  getCode()
  {
    return this.code;
  }

  /**
   * Set the code string
   *
   * @param string code The code string
   * @return Error
   */
  setCode(code)
  {
    this.code = code;

    return this;
  }

  /**
   * Get the message string
   *
   * @return string
   */
  getMessage()
  {
    return this.message;
  }

  /**
   * Set the message string
   *
   * @param string message The message string
   * @return Error
   */
  setMessage(message)
  {
    this.message = message;

    return this;
  }

  /**
   * Get compiled json object
   *
   * @return Object
   */
  getJson()
  {
    let error = {};
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
  toString()
  {
    return this.getJson().toString();
  }
}
