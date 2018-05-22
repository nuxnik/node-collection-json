import CollectionError from './CollectionError';
import Entity from './Entity';

/**
 * Creates a valid collection+json data object
 *
 * @author S. Fleming <npm@int5.net>
 * @since Tue Jul 25 11:07:32 CEST 2017
 */
export default class Data extends Entity
{
  /**
   * Get data object by json data object
   *
   * @param {Object} json The JSON object
   * @return data
   */
  static getByObject(json)
  {
    //check the name
    let nameString = Data.getObjectValueByKey(json, "name");
    if (nameString === undefined) {
        throw new CollectionError('data.name String undefined');
    }

    //check the value
    let valueString = Data.getObjectValueByKey(json, "value");
    if (valueString === undefined) {
        throw new CollectionError('data.value String undefined');
    }

    //check the prompt - optional
    let promptString = Data.getObjectValueByKey(json, "prompt");
    let data = new Data(nameString, valueString, promptString);

    return data;
  }

  /**
   * The class constructor
   *
   * @param string name The data name
   * @param string value The data value
   * @param string prompt The data prompt
   */
  constructor(name, value = null, prompt = null)
  {
    super();

    this.setName(name);
    this.setValue(value);
    this.setPrompt(prompt);
  }

  /**
   * Get the name string
   *
   * @return string
   */
  getName()
  {
    return this.name;
  }

  /**
   * Set the name string
   *
   * @param string name The name string
   * @return data
   */
  setName(name)
  {
    this.name = name;

    return this;
  }

  /**
   * Get the value string
   *
   * @return string
   */
  getValue()
  {
    return this.value;
  }

  /**
   * Set the value string
   *
   * @param string value The value string
   * @return data
   */
  setValue(value)
  {
    this.value = value;

    return this;
  }

  /**
   * Get the prompt string
   *
   * @return string
   */
  getPrompt()
  {
    return this.prompt;
  }

  /**
   * Set the prompt string
   *
   * @param string prompt The prompt string
   * @return data
   */
  setPrompt(prompt)
  {
    this.prompt = prompt;

    return this;
  }

  /**
   * Get compiled json object
   *
   * @return Object
   */
  getJson()
  {
    let data = {};
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
  getDatabaseObject()
  {
    return {[this.name]: this.value};
  }
}
