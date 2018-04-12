import Collection from './Collection';
import Cache from './Cache';
import Library from './Library';
import axios from 'axios';

/**
 * Class: Client for communication with collection+json enabled servers
 *
 * @author S. Fleming <npm@int5.net>
 * @since Mon Aug 14 16:47:09 CEST 2017
 */
export default class Client
{
  /**
   * The API type
   *
   * @return string
   */
  static get API() {
    return "api";
  }

  /**
   * The JSON type
   *
   * @return string
   */
  static get JSON() {
    return "json";
  }

  /**
   * The class constructor
   *
   * @param {mixed} resource The resource url or collection object
   * @param {Object} config The axios option object. See axios documentation for possible configuration options
   * @param {String} type The type of resource
   * @param {Cache} cache The Caching object.
   */
  constructor(resource, config = {}, type = Client.API, cache = null)
  {
    // The main collection object
    this.collection = null;

    // The resource address
    this.resource = null;

    // The global axios client configuration object
    this.config = config;

    // caching
    if (cache == null) {
      this.cache = new Cache();
    } else {
      this.cache = cache;
    }

    switch(type) {
      case Client.JSON:
        this.collection = resource;
        this.resource   = this.collection.getHref();
        this.cache.addCollection(this.collection);
        break;
      default:
      case Client.API:
        this.resource = resource;
        break;
    }
  }

  /**
   * Call the API and get collection object
   *
   * @param {String} resource The resource string
   * @param {Object} config The axios configuration object. See axios documentation for more options
   * @return Promise
   */
  getCollectionByResource(resource, config = {})
  {
    // get the config values
    let mergedConfig = Library.mergeConfigurationValues(this.config, config);

    return new Promise( (resolve, reject) => {

      // get from cache?
      if(this.cache.isResourceCached(resource)){
          return this.cache.getCollectionByResource(resource);
      } else {
        axios.get(resource, mergedConfig).then( (response) => {
          let collection = Collection.getByObject(response.data, mergedConfig);
          this.cache.addCollection(collection);

          return resolve(Collection.getByObject(collection));
        }).catch( error => {
          let collection = Collection.getByObject(error.response.data, mergedConfig);
          this.cache.addCollection(collection);

          return reject(collection);
        });
      }
    });
  }

  /**
   * Get the collection
   *
   * @return Collection
   */
  getCollection()
  {
    if (this.collection === null) {
      return this.getCollectionByResource(this.resource);
    } else {
      return new Promise( (resolve, reject) => {
        resolve(this.collection);
      });
    }
  }

  /**
   * Get the resource string
   *
   * @return {String}
   */
  getResource()
  {
    return this.resource;
  }

  /**
   * getCache
   *
   * @since Tue Apr 10 15:19:04 CEST 2018
   * @return Cache
   */
  getCache()
  {
    return this.cache;
  }

  /**
   * Reset and empty the cache
   *
   * @since Tue Apr 10 13:17:40 CEST 2018
   * @return Client
   */
  resetCache()
  {
    this.cache.reset();

    return this;
  }
}
