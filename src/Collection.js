import EntityLinker from './EntityLinker';
import Error from './Error';
import Item from './Item';
import Link from './Link';
import Library from './Library';
import Query from './Query';
import Template from './Template';
import axios from 'axios';

/**
 * Creates and validates collection+json object
 *
 * @author S. Fleming <nuxnik@int5.net>
 * @since Tue Jul 25 11:07:32 CEST 2017
 */
export default class Collection extends EntityLinker
{
  /**
   * Get the collection version
   *
   * @return string
   */
  static get VERSION() {
    return "1.0";
  }

  /**
   * Get the default content type
   *
   * @return string
   */
  static get CONTENT_TYPE() {
    return "application/vnd.collection+json";
  }

  /**
   * Get collection node name
   *
   * @return string
   */
  static get COLLECTION() {
    return "collection";
  }

  /**
   * Get links node name
   *
   * @return string
   */
  static get LINKS() {
    return "links";
  }

  /**
   * Get items node name
   *
   * @return string
   */
  static get ITEMS() {
    return "items";
  }

  /**
   * Get queries node name
   *
   * @return string
   */
  static get QUERIES() {
    return "queries";
  }

  /**
   * Get template node name
   *
   * @return string
   */
  static get TEMPLATE() {
    return "template";
  }

  /**
   * Get error node name
   *
   * @return string
   */
  static get ERROR() {
    return "error";
  }

  /**
   * parse data request in template form into a database friendly json object
   *
   * @param {Object} json The JSON object to parse (should be in Collection+JSON Template form)
   * @return Object
   */
  static parseTemplate(json)
  {
    let dbObject = {};

    //check the template object
    let templateObject = Collection.getObjectValueByKey(json, Collection.TEMPLATE);
    if (templateObject !== undefined) {
      let template = Template.getByObject(templateObject);
      dbObject = template.getDatabaseObject();
    }
    return dbObject;
  }

  /**
   * Import a collection string and transform into a collection object
   *
   * @param {String} collection - The string to import
   * @param {Object} config The axios configuration object. See axios documentation for more options
   * @param {Object} cache The caching object
   * @return Collection
   */
  static getByObject(json, config = {}, cache = null )
  {
    //check the collection object
    let collectionObject = Collection.getObjectValueByKey(json, Collection.COLLECTION);
    if (collectionObject === undefined) {
        //throw new CollectionError('collection Object undefined');
    }

    //check the version
    let versionString = Collection.getObjectValueByKey(collectionObject, "version");
    if (versionString === undefined) {
        //throw new CollectionError('collection.version String undefined');
    }

    //check the href
    let hrefString = Collection.getObjectValueByKey(collectionObject, "href");
    if (hrefString === undefined) {
        //throw new CollectionError('collection.href String undefined');
    }

    // create the collection object
    let collection = new Collection(hrefString, config, cache);

    // check the links object
    let linksObject = Collection.getObjectValueByKey(collectionObject, Collection.LINKS);
    if (Library.isArray(linksObject)) {
      for (const linkObject of linksObject) {

        // add the link
        try {
          let link = Link.getByObject(linkObject, config, cache);
          collection.addLink(link);
        } catch(error) {
          // skip this link
        }
      }
    }

    // check the items object
    let itemsObject = Collection.getObjectValueByKey(collectionObject, Collection.ITEMS);
    if (Library.isArray(itemsObject)) {
      for (const itemObject of itemsObject) {

        // add the item
        try {
          let item = Item.getByObject(itemObject, config, cache);
          collection.addItem(item);

          if (cache !== null) {
            // cache the item into seperate collection
            let itemCollection = new Collection(item.getHref(), config, cache);

            // check the links object
            let linksObject = Collection.getObjectValueByKey(collectionObject, Collection.LINKS);
            if (Library.isArray(linksObject)) {
              for (const linkObject of linksObject) {

                // add the link
                try {
                  let link = Link.getByObject(linkObject, config, cache);
                  itemCollection.addLink(link);
                } catch(error) {
                  // skip this link
                }
              }
            }
            itemCollection.addItem(item);
            cache.addCollection(itemCollection);
          }
        } catch(error) {
          // skip this item
        }
      }
    }

    // check the querys object
    let queriesObject = Collection.getObjectValueByKey(collectionObject, Collection.QUERIES);
    if (Library.isArray(queriesObject)) {
      for (const queryObject of queriesObject) {

        // add the query
        try {
          let query = Query.getByObject(queryObject, config, cache);
          collection.addQuery(query);
        } catch(error) {
          console.log(error.message);
        }
      }
    }

    //check the template object
    let templateObject = Collection.getObjectValueByKey(collectionObject, Collection.TEMPLATE);
    if (templateObject !== undefined) {

      // add the template
      try {
        let template = Template.getByObject(templateObject);
        collection.setTemplate(template);
      } catch(error) {
        console.log(error.message);
      }
    }

    //check the error object
    let errorObject = Collection.getObjectValueByKey(collectionObject, Collection.ERROR);
    if (errorObject !== undefined) {

      // add the error
      try {
        let error = Error.getByObject(errorObject);
        collection.setError(error);
      } catch(error) {
        console.log(error.message);
      }
    }

    // cache collection
    if (cache !== null) {
      cache.addCollection(collection);
    }

    return collection;
  }

  /**
   * The class constructor
   *
   * @param {String} url The api root uri
   * @param {Object} config The axios configuration object. See axios documentation for more options
   * @param {Object} cache The caching object
   */
  constructor(uri, config = {}, cache = null) 
    {
      super();

      /**
       * The axios configuration object.
       */
      this.config = config;

      /**
       * The default content type header
       *
       * @var string
       */
      this.contentType = Collection.CONTENT_TYPE;

      /**
       * The api root uri
       *
       * @var string
       */
      this.href = uri;

      /**
       * The api links array
       *
       * @var array
       */
      this.links = [];

      /**
       * The items data array
       *
       * @var array
       */
      this.items = [];

      /**
       * The query method data definition array
       *
       * @var array
       */
      this.queries = [];

      /**
       * The data template definition
       *
       * @var object
       */
      this.template = {};

      /**
       * The error object
       *
       * @var object
       */
      this.error = {};

      /**
       * The cache object
       *
       * @var array
       */
      this.cache = cache;
    }

    /**
     * Get the API uri definition
     *
     * @return string
     */
    getHref()
    {
      return this.href;
    }

    /**
     * Get the colleciton version number
     *
     * @return String
     */
    getVersion()
    {
      return Collection.VERSION;
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
     * Add item object to the collection
     *
     * @param object item The item object
     * @see Item
     * @return Collection
     */
    addItem(item)
    {
      this.items.push(item);

      return this;
    }

    /**
     * Get an item instance
     *
     * @param String url - The item url
     * @return Item
     */
    getItem(url)
    {
      return new Item(url);
    }

    /**
     * Get array of item strings
     *
     * @return array
     */
    getItems()
    {
      return this.items;
    }

    /**
     * Get Item by value
     *
     * @param String key The item key
     * @param String value The item value to search for
     */
    getItemByKeyAndValue(key, value)
    {
      for (let item in this.items) {
        if (this.items[item].getDataValueByName(key) == value) {
          return this.items[item];
        }
      }
    }

    /**
     * Get Item by array position index
     *
     * @param String index The item index
     */
    getItemByIndex(key)
    {
      return this.items[key];
    }

    /**
     * Get the first item
     *
     * @return Item
     */
    getFirstItem()
    {
      let item = null;
      if (typeof this.items[0] !== "undefined") {
        item = this.items[0];
      }

      return item;
    }

    /**
     * Add query object to the collection
     *
     * @param object query The query object
     * @see Query
     * @return Collection
     */
    addQuery(query)
    {
      this.queries.push(query);

      return this;
    }

    /**
     * Get an query instance
     *
     * @param String url - The item url
     * @return Query
     */
    getQuery()
    {
      return new Query();
    }

    /**
     * Get an query instance by rel
     *
     * @param String rel - The query rel
     * @return Query
     */
    getQueryByRel(rel)
    {
      for (const query of this.getQueries()) {
        if (query.getRel() == rel) {
          return query;
        }
      }
      return new Query(url);
    }

    /**
     * Get array of query objects
     *
     * @return array
     */
    getQueries()
    {
      return this.queries;
    }

    /**
     * Set the template object
     *
     * @param Template template The template object
     * @see Template
     * @return Collection
     */
    setTemplate(template)
    {
      this.template = template;
    }

    /**
     * Get the template object
     *
     * @return Template
     */
    getTemplate()
    {
      return this.template;
    }

    /**
     * Set the error object
     *
     * @param Error error The error object
     * @see error
     * @return Collection
     */
    setError(error)
    {
      this.error = error;
    }

    /**
     * Get the error object
     *
     * @return error
     */
    getError()
    {
      return this.error;
    }

    /**
     * Get compiled json object
     *
     * @return Object
     */
    getJson()
    {
      // create the collection
      let collection = {};
      collection.version = Collection.VERSION;
      collection.href = this.href;

      // add the links
      if (this.getLinks().length > 0) {
        collection.links = [];
        for(const link of this.getLinks()){
          collection.links.push(link.getJson());
        }
      }

      // add the items
      if (this.getItems().length > 0) {
        collection.items = [];
        for(const item of this.getItems()) {
          collection.items.push(item.getJson());
        }
      }

      // add the querys
      if (this.getQueries().length > 0) {
        collection.queries = [];
        for (const query of this.getQueries()) {
          collection.queries.push(query.getJson());
        }
      }

      // add template
      if(Object.keys(this.getTemplate()).length > 0 && this.getTemplate().getData().length > 0 ) {
        collection.template = this.getTemplate().getJson();
      }

      // add error
      if (Object.keys(this.getError()).length > 0) {
        collection.error = this.getError().getJson();
      }

      return {collection};
    }

    /**
     * Get item as a flattened vanilla JSON object
     *
     * @return Object
     */
    itemsAsJson()
    {
      let json = [];

      // flatten the data into an object
      if (this.getItems().length > 0) {
        for (const item of this.getItems()) {
          json.push(item.asJson());
        }
      }

      return json;
    }


    /**
     * Get ContentType
     *
     * @return String
     */
    getContentType()
    {
      return this.contentType;
    }

    /**
     * Set ContentType
     *
     * @param {contentType} The contentType header value to set
     * @return Collection
     */
    setContentType(contentType)
    {
      this.contentType = contentType;

      return this;
    }

    /**
     * Post template contents to the server
     *
     * @return Promise
     */
    post(config = {})
    {
      return this.dispatch('post', null, config);
    }

    /**
     * Put template contents to the server
     *
     * @return Promise
     */
    put(resource, config = {})
    {
      return this.dispatch('put', resource, config);
    }

    /**
     * Send template contents to the server and get new collection
     *
     * @param {String} method The HTTP method
     * @param {String} resource The resource URL string
     * @param {Object} config The axios configuration object. See axios documentation for options
     * @return Promise
     */
    dispatch(method, resource = null, config = {})
    {
      if(Object.keys(config).length === 0 && config.constructor === Object) {
        config = this.config;
      }

      // set the method
      config.method = method;

      // set the resource
      let url = this.getHref();
      if (resource !== null) {
        url = resource;
      }
      config.url = url;

      // add the content type header
      if (config.headers === undefined) {
        config.headers = {};
      }

      // set the content type header
      if (config.headers["Content-Type"] === undefined) {
        config.headers["Content-Type"] = this.contentType;
      }

      // create the template payload
      let templateData = {};
      if( typeof config.data != "undefined") {
        for(const key in config.data) {
          this.getTemplate().setData(key, config.data[key]);
        }
      }
      templateData.template = this.getTemplate().getJson();
      config.data = JSON.stringify(templateData);

      // dispatch
      switch (method) {
        case 'put':
        case 'post':
          return new Promise( (resolve, reject) => {
            axios(config).then( (response) => {
              let collection = (Collection.getByObject(response.data, this.config, this.cache));
              this.cache.addCollection(collection);
              return resolve(collection);
            }).catch ( error => {
              let collection = (Collection.getByObject(response.data, this.config, this.cache));
              this.cache.addCollection(collection);
              return reject(collection);
            });
          });
        break;
        // case 'patch':
        default:
          throw new Error("Method type: " + method + " not found");
        break;
    }
  }
}
