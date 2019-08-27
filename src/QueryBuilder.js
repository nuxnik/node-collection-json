import ApiQuery from './ApiQuery';

/**
 * Class: QueryBuilder
 *
 * Builds queries for JSON+Collection APIs
 *
 * @author S. Fleming <nuxnik@int5.net>
 * @since Mon 26 Aug 2019 01:46:03 PM CEST
 */
export default class QueryBuilder
{
  /**
   * The class constructor
   */
  constructor()
  {
    /**
     * The current index
     *
     * @var number
     */
    this.index = 0;

    /**
     * The queries array
     *
     * @var array
     */
    this.queries = [];
  }

  /**
   * increment the index
   *
   * @return QueryBuilder
   */ 
  next()
  {
    this.index++;

    return this;
  }

  /**
   * Decrement the index
   *
   * @return QueryBuilder
   */
  prev()
  {
    this.index--;

    return this;
  }

  /**
   * Reset the index
   *
   * @return QueryBuilder
   */
  resetIndex()
  {
    this.index = 0;

    return this;
  }

  /**
   * Get the root node query object
   *
   * @param {String} node The rel/node name
   * @return ApiQuery
   */
  root(node)
  {
    let query = this.getQuery().setType(ApiQuery.ROOT).setNode(node);
    this.next();
    return query;
  }

  /**
   * Get the item node query object
   *
   * @param {String} node The rel/node name
   * @return ApiQuery
   */
  item(node)
  {
    let query = this.getQuery().setType(ApiQuery.ITEM).setNode(node);
    this.next();
    return query;
  }

  link(link)
  {
    let query = this.getQuery().setLink(link);
    this.next();
    return query;
  }

  /**
   * Get the current query object. Alias of getQuery
   *
   * @return ApiQuery
   */
  current()
  {
    return this.getQuery();
  }

  /**
   * Get the current query object.
   *
   * @return ApiQuery
   */
  getQuery()
  {
    if (this.queries[this.index] == undefined) {
      this.queries[this.index] = new ApiQuery();
    }

    return this.queries[this.index];
  }

  /**
   * isQuery
   *
   * @since Mon 26 Aug 2019 03:52:13 PM CEST
   */
  isQuery()
  {
    return this.queries[this.index] ? true : false;
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
}
