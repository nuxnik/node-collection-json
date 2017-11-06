import Data from './Data';
import Entity from './Entity';
import Library from './Library';

/**
 * Creates a valid collection+json template object
 *
 * @author S. Fleming <npm@int5.net>
 * @since Tue Jul 25 11:07:32 CEST 2017
 */
export default class Template extends Entity
{
  /**
   * Get template object by json data object
   *
   * @param {Object} json The JSON object
   * @return template
   */
  static getByObject(json)
  {
    // init the template object
    let template = new Template();

    // check the datas object
    let datasObject = Template.getObjectValueByKey(json, "data");
    if (Library.isArray(datasObject)) {
      for (const dataObject of datasObject) {

        // add the data
        try {
          let data = Data.getByObject(dataObject);
          template.addData(data);
        } catch(error) {
          // skip this data
        }
      }
    }

    return template;
  }

  /**
   * The class constructor
   *
   */
  constructor()
  {
    super();

    /**
     * The data object
     *
     * @var array
     */
    this.data = [];
  }

  /**
   * Add data object to the collection
   *
   * @param object data The data object
   * @see Data
   * @return Collection
   */
  addData(data)
  {
    this.data.push(data);

    return this;
  }

  /**
   * Get array of data strings
   *
   * @return array
   */
  getData()
  {
    return this.data;
  }


  /**
   * Get compiled json object
   *
   * @return Object
   */
  getJson()
  {
    // push the data
    let template = {};
    template.data = [];
    for (const data of this.getData()) {
      template.data.push(data.getJson());
    }

    return template;
  }

  /**
   * Get database friendly Object
   *
   * @return Object
   */
  getDatabaseObject()
  {
    let dbObject = {};
    for (const data of this.getData()) {
      dbObject[data.getName()] = data.getValue();
    }

    return dbObject;
  }

  /**
   * Set a value by name
   *
   * @param {String} name The name of the value
   * @param {String} value The value of the data
   * @param {String} prompt The prompt value of the data
   * @return Template
   */
  setData(name, value, prompt = null)
  {
    // get the value by name
    for (const data of this.getData()) {
      if (data.getName() == name) {
        data.setValue(value);
        if (prompt !== null) {
          data.setPrompt(prompt);
        }
        return this;
      }
    };
    this.addData(new Data(name, value, prompt));
    return this;
  }

  /**
   * Import an Item object into the template
   *
   * @param {Item} item the item object to import
   * @return Template
   */
  importItem(item)
  {
    for (const templateData of this.getData()) {
      for (const itemData of item.getData()) {
        if (itemData.getName() === templateData.getName()) {
          templateData.setName(itemData.getName());
          templateData.setValue(itemData.getValue());
          templateData.setPrompt(itemData.getPrompt());
        }
      }
    }

    return this;
  }
}
