/**
 * Class: Library
 *
 * General static methods needed in this project
 *
 * @author S. Fleming <s.fleming@sma-dev.de>
 * @since Mon Nov  6 15:02:42 CET 2017
 */
 export default class Library
 {

  /**
   * Helper method to check if a variable is an array
   *
   * @param {array} variable The variable to check
   * @return boolean
   */
  static isArray(variable)
  {
    let result = false;
    if( Object.prototype.toString.call( variable ) === '[object Array]' ) {
      result = true;
    }

    return result;
  }

  /**
   * Merge the client configuration values
   *
   * @param {Object} global The global config values
   * @param {Object} local The local config values
   *
   * @return {Object}
   */
  static mergeConfigurationValues(global, local)
  {
    if (Object.keys(local).length === 0 && local.constructor === Object) {
      return global;
    } else {
      return local;
    }
  }
}
