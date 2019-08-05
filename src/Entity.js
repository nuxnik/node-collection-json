/**
 * Entity class. Used as an abstract class with helper methods that all Collection+JSON classes inherit.
 *
 * @author S. Fleming <nuxnik@int5.net>
 * @since Tue Aug  8 15:15:35 CEST 2017
 */
export default class Entity
{
  /**
   * Helper method for getting an object value by key
   *
   * @param Object object the object to check
   * @param String key The key the chec
   * @return mixed
   */
  static getObjectValueByKey(object, key)
  {
    let value = object[key];
    return value;
  }

  /**
   * Get the data value by name
   *
   * @param {string} key the key value
   * @return mixed
   */
  get(key)
  {
    return this.getDataByName(key).getValue();
  }

  /**
   * Get the data value by name
   *
   * @param {string} key the key value
   * @param {string} value the data value
   * @return mixed
   */
  set(key, value)
  {
    this.getDataByName(key).setValue(value);

    return this;
  }

  /**
   * Output the collection to string format
   *
   * @return string
   */
  toString()
  {
    return JSON.stringify(this.getJson());
  }
}
