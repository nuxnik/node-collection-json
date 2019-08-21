import Collection from './Collection';
import CollectionError from './CollectionError';
import Entity from './Entity';
import Library from './Library';
import axios from 'axios';

/**
 * Creates a valid collection+json link object
 *
 * @author S. Fleming <nuxnik@int5.net>
 * @since Tue Jul 25 11:07:32 CEST 2017
 *
 */
export default class Link extends Entity
{
  /**
   * Get link object by json data object
   *
   * @todo - finish this
   * @param {Object} json The JSON object
   * @param {Object} config The axios configuration object. See axios documentation for more options
   * @param {Object} cache The caching object
   * @return Link
   */
  static getByObject(json, config = {}, cache = null)
  {
    //check the href
    let hrefString = Link.getObjectValueByKey(json, "href");
    if (hrefString === undefined) {
        throw new CollectionError('link.href String undefined');
    }

    //check the rel
    let relString = Link.getObjectValueByKey(json, "rel");
    if (relString === undefined) {
        throw new CollectionError('link.rel String undefined');
    }

    //check the render
    let renderString = Link.getObjectValueByKey(json, "render");

    let link = new Link(hrefString, relString, renderString, config, cache);

    //check the prompt
    let promptString = Link.getObjectValueByKey(json, "prompt");
    if (promptString !== undefined) {
      link.setPrompt(promptString);
    }

    return link;
  }

  /**
   * The class constructor
   *
   * @param string href The link uri
   * @param string rel The relational element
   * @param string render The render type
   * @param {Object} config The axios configuration object. See axios documentation for more options
   * @param {Object} cache The caching object
   */
  constructor(href, rel, render = null, config = {}, cache = null)
  {
    super();

    /**
     * The global axios client configuration object
     */
    this.config = config;

    /**
     * The cache object
     *
     * @var array
     */
    this.cache = cache;

    this.setHref(href);
    this.setRel(rel);
    this.setRender(render);
    this.setPrompt('');
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
   * Get the rel string
   *
   * @return string
   */
  getRel()
  {
    return this.rel;
  }

  /**
   * Set the rel string
   *
   * @param string rel The rel element
   * @return rel
   */
  setRel(rel)
  {
    this.rel = rel;

    return this;
  }

  /**
   * Get the link string
   *
   * @return string
   */
  getPrompt()
  {
    return this.prompt;
  }

  /**
   * Set the link string
   *
   * @param string link The link uri
   * @return Link
   */
  setPrompt(prompt)
  {
    this.prompt = prompt;

    return this;
  }

  /**
   * Get the render string
   *
   * @return string
   */
  getRender()
  {
    return this.render;
  }

  /**
   * Set the render string
   *
   * @param string render The render type string
   * @return Link
   */
  setRender(render)
  {
    this.render = render;

    return this;
  }

  /**
   * Follow a link and return the collection object
   *
   * @param {Array} params Extra params to add to the url
   * @param {Object} config The axios configuration object. See axios documentation for more options
   * @return Collection
   */
  follow(params = null, config = {})
  {
    // get the config values
    let mergedConfig = Library.mergeConfigurationValues(this.config, config);

    return new Promise( (resolve, reject) => {
      let url = this.getHref();
      if (params !== null) {
        url += '?';
        for(let key in params) {
            url += '&' + key + '=' + params[key];
        }
      }
      // get from cache?
      if(this.cache !== null && this.cache.isResourceCached(url)){
        return this.cache.getCollectionByResource(url);
      } else {
        axios.get(url, mergedConfig).then( (response) => {
          let collection = Collection.getByObject(response.data, this.config, this.cache);
          return resolve(collection);
        }).catch( error => {
          let collection = Collection.getByObject(error.response.data, this.config, this.cache);
          return resolve(collection);
        });
      }
    });
  }

  /**
   * Get compiled json object
   *
   * @return Object
   */
  getJson()
  {
    let link = {};
    if (this.href) {
      link.href = this.getHref();
    }
    if (this.rel) {
      link.rel = this.getRel();
    }
    if (this.render) {
      link.render = this.getRender();
    }
    if (this.prompt) {
      link.prompt = this.getPrompt();
    }

    return link;
  }

  /**
   * Add collection to cache
   *
   * @param Collection collection The collection to cache
   * @return Link
   */
  addCache(collection)
  {
    if (this.cache !== null) {
      this.cache.addCollection(collection);
    }
    return this;
  }
}
