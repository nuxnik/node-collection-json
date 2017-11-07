import Collection from './Collection';
import Data from './Data';
import Entity from './Entity';
import Library from './Library';
import axios from 'axios';

/**
 * Creates a valid collection+json query object
 *
 * @author S. Fleming <npm@int5.net>
 * @since Tue Jul 25 11:07:32 CEST 2017
 */
export default class Query extends Entity
{
  /**
   * Get query object by json data object
   *
   * @param {Object} json The JSON object
   * @param {Object} config The axios configuration object. See axios documentation for more options
   * @return query
   */
  static getByObject(json, config = {})
  {
    //check the href
    let hrefString = Query.getObjectValueByKey(json, "href");
    if (hrefString === undefined) {
        throw new CollectionError('query.href String undefined');
    }

    //check the rel
    let relString = Query.getObjectValueByKey(json, "rel");
    if (relString === undefined) {
        throw new CollectionError('query.rel String undefined');
    }

    //check the prompt
    let promptString = Query.getObjectValueByKey(json, "prompt");

    // init the object
    let query = new Query(hrefString, relString, promptString, config);

    // check the data object
    let datasObject = Query.getObjectValueByKey(json, "data");
    if (Library.isArray(datasObject)) {
      for (const dataObject of datasObject) {

        // add the data
        try {
          let data = Data.getByObject(dataObject);
          query.addData(data);
        } catch(error) {
          // skip this data
        }
      }
    }

    return query;
  }
  /**
   * The class constructor
   *
   */
  constructor(href, rel, prompt = null, config = {})
  {
    super();

    this.setHref(href);
    this.setRel(rel);
    this.setPrompt(prompt);

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
   * Set a value by name
   *
   * @param {String} name The name of the value
   * @param {String} value The value of the data
   * @param {String} prompt The prompt value of the data
   * @return Query
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
    }
    this.addData(new Data(name, value, prompt));

    return this;
  }

  /**
   * Query the server
   *
   * @param {Object} config The axios configuration object. See axios documentation for more options
   * @return Promise<Collection>
   */
  query(config = {})
  {
    // get the config values
    let mergedConfig = Library.mergeConfigurationValues(this.config, config);

    // build the query
    let href = this.getHref() + '?';
    for (const data of this.getData()) {
      href = href + data.getName() + '=' + data.getValue() + '&';
    }
    return new Promise( (resolve, reject) => {
      axios.get(href, mergedConfig).then( (response) => {
        return resolve(Collection.getByObject(response.data, this.config));
      }).catch( error => {
        return resolve(Collection.getByObject(error.response.data, this.config));
      });
    });
  }


  /**
   * Get compiled json object
   *
   * @return Object
   */
  getJson()
  {
    // push the data
    let query = {};
    if (this.href) {
      query.href = this.getHref();
    }
    if (this.rel) {
      query.rel = this.getRel();
    }
    if (this.prompt) {
      query.prompt = this.getPrompt();
    }

    if (this.getData().length > 0) {
      query.data = [];
      for (const data of this.getData()) {
        query.data.push(data.getJson());
      }
    }

    return query;
  }
}
