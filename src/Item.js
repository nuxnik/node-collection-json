import Collection from './Collection';
import CollectionError from './CollectionError';
import Data from './Data';
import EntityLinker from './EntityLinker';
import Library from './Library';
import Link from './Link';
import axios from 'axios';

/**
 * Creates a valid collection+json item object
 *
 * @author S. Fleming <npm@int5.net>
 * @since Tue Jul 25 11:07:32 CEST 2017
 */
export default class Item extends EntityLinker
{

  /**
   * Get item object by json data object
   *
   * @param {Object} json The JSON object
   * @param {Object} config The axios configuration object. See axios documentation for more options
   * @return item
   */
  static getByObject(json, config = {})
  {
    //check the href
    let hrefString = Item.getObjectValueByKey(json, "href");
    if (hrefString === undefined) {
        throw new CollectionError('item.href String undefined');
    }

    // init the Item object
    let item = new Item(hrefString, config);

    // check the datas object
    let datasObject = Item.getObjectValueByKey(json, "data");
    if (Library.isArray(datasObject)) {
      for (const dataObject of datasObject) {

        // add the data
        try {
          let data = Data.getByObject(dataObject);
          item.addData(data);
        } catch(error) {
          // skip this data
        }
      }
    }

    // check the links object
    let linksObject = Item.getObjectValueByKey(json, "links");
    if (Library.isArray(linksObject)) {
      for (const linkObject of linksObject) {

        // add the link
        try {
          let link = Link.getByObject(linkObject, config);
          item.addLink(link);
        } catch(error) {
          // skip this link
        }
      }
    }

    return item;
  }

  /**
   * The class constructor
   *
   * @param string href The href uri
   * @param {Object} config The axios configuration object. See axios documentation for more options
   */
  constructor(href, config = {})
  {
    super();
    this.setHref(href);

    /**
     * The global axios client configuration object
     */
    this.config = config;

    /**
     * The data object
     *
     * @var array
     */
    this.data = [];

    /**
     * The items data array
     *
     * @var array
     */
    this.items = [];

    /**
     * The links data array
     *
     * @var array
     */
    this.links = [];
  }

  /**
   * Get the link string
   *
   * @return string
   */
  getHref()
  {
    return this.href;
  }

  /**
   * Set the link string
   *
   * @param string link The link uri
   * @return Link
   */
  setHref(href)
  {
    this.href = href;

    return this;
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
   * Get the data object by name
   *
   * @param {string} name The name of the key to find
   * @return Data
   */
  getDataByName(name)
  {
    for(let data of this.data) {
        if(data.getName() === name) {
            return data;
        }
    }

    return new Data(key);
  }

  /**
   * Add link object to the collection
   *
   * @param object link The link object
   * @see Link
   * @return Collection
   */
  addLink(link)
  {
    this.links.push(link);

    return this;
  }

  /**
   * Get array of link strings
   *
   * @return array
   */
  getLinks()
  {
    return this.links;
  }

  /**
   * Get compiled json object
   *
   * @return Object
   */
  getJson()
  {
    let item = {};
    if (this.href) {
      item.href = this.href;
    }

    // push the data
    if (this.getData().length > 0) {
      item.data = [];
      for (const data of this.getData()) {
        item.data.push(data.getJson());
      }
    }

    // push the links
    if (this.getLinks().length > 0) {
      item.links = [];
      for (const link of this.getLinks()) {
        item.links.push(link.getJson());
      }
    }

    return item;
  }

  /**
   * Get item as a flattened vanilla JSON object
   *
   * @return Object
   */
  asJson()
  {
    let json = {};

    // flatten the data into an object
    if (this.getData().length > 0) {
      for (const data of this.getData()) {
        json[data.getName()] = data.getValue();
      }
    }

    return json;
  }

  /**
   * Get a template object modeled on the data is defined in the object
   *
   * @return Template
   */
  getTemplate()
  {
    let template = new Template();
    template.addData();

    return template;
  }

  /**
   * Get a data value by the name key
   *
   * @param {String} name The name key to search by
   */
  getDataValueByName(name)
  {
    let foundData = null;
    for (const data of this.getData()) {
      if (data.getName() === name) {
        foundData = data.getValue();
      }
    }

    return foundData;
  }

  /**
   * Delete the item from the server
   *
   * @param {Object} config The axios configuration object. See axios documentation for more options
   * @return Promise<Collection>
   */
  delete(config = {})
  {
    // get the config values
    let mergedConfig = Library.mergeConfigurationValues(this.config, config);

    return new Promise( (resolve, reject) => {
      axios.delete(this.getHref(), mergedConfig).then( (response) => {
        return resolve(Collection.getByObject(response.data, this.config));
      }).catch( error => {
        return resolve(Collection.getByObject(error.response.data, this.config));
      });
    });
  }

  /**
   * Follow the href link
   *
   * @param {Array} params Extra params to add to the url
   * @param {Object} config The axios configuration object. See axios documentation for more options
   * @return Promise
   */
  follow(params = null, config = {})
  {
    // get the config values
    let mergedConfig = Library.mergeConfigurationValues(this.config, config);

    return new Promise( (resolve, reject) => {
      let url = this.getHref();
      if (params !== null && params.constructor === Array) {
        url += '?';
        for(let key in params) {
            url += '&' + key + '=' + params[key];
        }
      }
      axios.get(url, mergedConfig).then( (response) => {
        return resolve(Collection.getByObject(response.data, this.config));
      }).catch( error => {
        return reject(Collection.getByObject(error.response.data, this.config));
      });
    });
  }
}
