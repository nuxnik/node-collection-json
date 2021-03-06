import CollectionError from './CollectionError';
import Data from './Data';
import EntityLinker from './EntityLinker';
import Library from './Library';
import Link from './Link';
import axios from 'axios';

/**
 * Creates a valid collection+json item object
 *
 * @author S. Fleming <nuxnik@int5.net>
 * @since Tue Jul 25 11:07:32 CEST 2017
 */
export default class Item extends EntityLinker
{

  /**
   * Get item object by json data object
   *
   * @param {Object} json The JSON object
   * @param {Object} config The axios configuration object. See axios documentation for more options
   * @param {Object} cache The caching object
   * @return item
   */
  static getByObject(json, config = {}, cache = null)
  {
    //check the href
    let hrefString = Item.getObjectValueByKey(json, "href");
    if (hrefString === undefined) {
        throw new CollectionError('item.href String undefined');
    }

    // init the Item object
    let item = new Item(hrefString, config, cache);

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
          let link = Link.getByObject(linkObject, config, cache);
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
   * @param {Object} cache The caching object
   */
  constructor(href, config = {}, cache = null)
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

    /**
     * The cache object
     *
     * @var array
     */
    this.cache = cache;
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
   * @return Item
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
   * Add link object to the collection
   *
   * @param object link The link object
   * @see Link
   * @return Item
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
        if (this.cache !== null) {
          this.cache.cleanByResource(this.getHref());
        }
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

    // todo update the url parser
    let url = this.getHref();
    if (params !== null && params.constructor === Array) {
      url += '?';
      for(let key in params) {
        url += '&' + key + '=' + params[key];
      }
    }

    if (this.cache !== null && this.cache.isResourceCached(url)) {
      return Promise.resolve(this.cache.getCollectionByResource(url));
    } else {
      return axios.get(url, mergedConfig).then( (response) => {
        response.data.collection.href = url;
        let collection = Collection.getByObject(response.data, mergedConfig, this.cache);
        this.cache.addCollection(collection);
        return collection;
      }).catch( error => {
        let collection = Collection.getByObject(error.response.data, this.config, this.cache);
        return Promise.resolve(collection);
      });
    }
  }

  /**
   * follow and hydrate the links with data
   *
   * @param {array} rels The array of rels
   * @return Item
   */
  hydrateLinks(rels = [])
    {
      let links = this.getLinks();
      let promiseArray = [];
      for (const link of links) {
        if (rels.includes(link.getRel())) {
          promiseArray.push(new Promise((resolve, reject) => {
            link.follow().then(collection => {
              this.addData(new Data(link.getRel(), collection, link.getRel()));
              resolve(true);
            });
          }));
        }
      }
      return Promise.all(promiseArray).then(() => {
        return this;
      });
    }

    /**
     * Add collection to cache
     *
     * @param Collection collection The collection to cache
     * @return Item
     */
    addCache(collection)
    {
      if (this.cache !== null) {
        this.cache.addCollection(collection);
      }
      return this;
    }
}
