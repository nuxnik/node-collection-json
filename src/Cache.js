import Client from './Client';
import Collection from './Collection';

/**
 * Class: Cache
 *
 * Caches collection objects for optimized retrieval
 *
 * @author S. Fleming <nuxnik@int5.net>
 * @since Tue Apr 10 11:38:43 CEST 2018
 */
export default class Cache
{
  /**
   * The default time to live value for the cache. Time is in seconds
   *
   * @return integer
   */
  static get DEFAULT_TTL() {
    return 2 * 60;
  }

  /**
   * The collection cache key
   *
   * @return string
   */
  static get KEY_COLLECTION() {
    return "COLLECTION";
  }

  /**
   * The collection cache key
   *
   * @return string
   */
  static get KEY_TTL() {
    return "TTL";
  }

  /**
   * The collection cache key
   *
   * @return string
   */
  static get KEY_ACCESSED() {
    return "ACCESSED";
  }

  /**
   * The class constructor
   *
   * @param {integer} ttl Time to live (in seconds) before caching object should be refreshed
   */
  constructor( ttl = Cache.DEFAULT_TTL )
  {
    this.setTimeToLive( ttl );
    this.reset();
  }

  /**
   * Get TimeToLive
   *
   * @since Tue Apr 10 12:01:31 CEST 2018
   */
  getTimeToLive()
  {
    return this.ttl;
  }

  /**
   * Set TimeToLive
   *
   * @param {integer} ttl The cache time to live (in seconds)
   * @return Cache
   */
  setTimeToLive( ttl )
  {
    this.ttl = ttl;

    return this;
  }

  /**
   * Reset the cache
   *
   * @since Tue Apr 10 11:43:38 CEST 2018
   */
  reset()
  {
    this.cache = {};
    return this;
  }

  /**
   * clean up the garbage.
   *
   * @since Tue Apr 10 11:43:38 CEST 2018
   */
  clean()
  {
    let now = new Date();
    for( let resource in this.cache ) {
      if ( resource[Client.KEY_TTL] < now ) {
        delete this.cache[resource];
      }
    }

    return this;
  }

  /**
   * Clean the cache by resource name
   *
   * @param {String} resource The resource key
   * @return Cache
   */
  cleanByResource( resource )
  {
    if ( resource in this.cache ) {
       delete this.cache[resource];
    }
    return this;
  }

  /**
   * Add a collection to the cache
   *
   * @since Tue Apr 10 11:45:20 CEST 2018
   */
  addCollection(collection)
  {
    // add the seconds to the time to live
    let ttl = new Date();
    ttl.setSeconds(ttl.getSeconds() + this.ttl);

    this.cache[collection.getHref()] = {};
    this.cache[collection.getHref()][Cache.KEY_COLLECTION] = collection;
    this.cache[collection.getHref()][Cache.KEY_TTL]        = ttl;
    this.cache[collection.getHref()][Cache.KEY_ACCESSED]   = 0;

    return this;
  }

  /**
   * getCollectionByResource
   *
   * @since Tue Apr 10 15:41:00 CEST 2018
   * @param {String} resource The resource key/name
   */
  getCollectionByResource( resource )
  {
    if ( resource in this.cache ){
      console.log(resource);
      return this.cache[resource][Cache.KEY_COLLECTION];
    }

    return new Collection( resource );
  }

  /**
   * getAccessedByResource
   *
   * The number of times the cache has been accessed
   * @since Tue Apr 10 15:41:00 CEST 2018
   * @param {String} resource The resource key/name
   */
  getAccessedByResource( resource )
  {
    if ( resource in this.cache ){
      return this.cache[resource][Cache.KEY_ACCESSED];
    }

    return 0;
  }

  /**
   * getTimeToLiveByResource
   *
   * The time to live value
   * @since Tue Apr 10 15:41:00 CEST 2018
   * @param {String} resource The resource key/name
   * @return Date
   */
  getTimeToLiveByResource( resource )
  {
    if ( resource in this.cache ){
      return new Date(this.cache[resource][Cache.KEY_TTL]);
    }

    return new Collection( resource );
  }

  /**
   * Check if the resource is cached
   *
   * @return boolean
   */
  isResourceCached(resource)
  {
    if ( this.cache[resource] !== undefined ){
      if ( this.cache[resource][Cache.KEY_TTL] > new Date() ) {
        this.cache[resource][Cache.KEY_ACCESSED]++;
        return true;
      } else {

        this.clean();
        return false;
      }
    } else {

      return false;
    }
  }

  /**
   * getData
   *
   * @since Tue Apr 10 15:20:58 CEST 2018
   * @return Object
   */
  getData()
  {
    return this.cache;
  }
}
