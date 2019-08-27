/**
 * Class: ApiQuery
 *
 * Query object for JSON+Collection APIs
 *
 * @author S. Fleming <nuxnik@int5.net>
 * @since Mon 26 Aug 2019 01:46:03 PM CEST
 */
export default class ApiQuery
{
  /**
   * The ROOT type
   *
   * @return string
   */
  static get ROOT() {
    return "ROOT";
  }

  /**
   * The ITEM type
   *
   * @return string
   */
  static get ITEM() {
    return "ITEM" 
  }

  constructor()
  {
    /**
     * The query parameters
     *
     * @var Object
     */
    this.params = {};

    this.index;
    this.searchKey;
    this.searchValue;
    this.node;
    this.type;
    this.link;
  }
  /**
   * Add parameters to the query
   *
   * @param {Object} params The parameter object
   * @since Mon 26 Aug 2019 02:01:12 PM CEST
   * @return ApiQuery
   */
  addParams(params)
  {
    this.params = params;

    return this;
  }

  /**
   * getParamsAsString
   *
   * @since Mon 26 Aug 2019 02:04:35 PM CEST
   * @return string
   */
  getParamsAsString()
  {
    let string = '';
    for (var key in this.params) {
      string += key + '=' + this.params[key] + "&";
    }
    return string.substring(0, string.length - 1);;
  }

  /**
   * setIndex
   *
   * @param {number} index The item index to fetch
   * @since Mon 26 Aug 2019 02:02:05 PM CEST
   * @return ApiQuery
   */
  setIndex(index)
  {
    this.index = index;

    return this;
  }

  /**
   * getIndex
   *
   * @since Mon 26 Aug 2019 02:05:06 PM CEST
   * @return number
   */
  getIndex()
  {
    return this.index;
  }

  /**
   * hasIndex
   *
   * @since Mon 26 Aug 2019 02:05:13 PM CEST
   */
  hasIndex()
  {
    return this.index != undefined ? true : false;
  }

  /**
   * search
   *
   * @since Mon 26 Aug 2019 02:02:48 PM CEST
   * @return ApiQuery
   */
  search(key, value)
  {
    this.searchKey   = key;
    this.searchValue = value;

    return this;
  }

  /**
   * getSearchKey
   *
   * @since Mon 26 Aug 2019 02:06:01 PM CEST
   * @return string
   */
  getSearchKey()
  {
    return this.searchKey;
  }

  /**
   * getSearchValue
   *
   * @since Mon 26 Aug 2019 02:06:12 PM CEST
   * @return string
   */
  getSearchValue()
  {
    return this.searchValue;
  }

  /**
   * isSearchable
   *
   * @since Mon 26 Aug 2019 02:05:37 PM CEST
   * @return boolean
   */
  isSearchable()
  {
    return (this.searchValue != undefined || this.searchKey != undefined) ? true : false;
  }

  /**
   * getNode
   *
   * @since Mon 26 Aug 2019 02:04:07 PM CEST
   * @return string
   */
  getNode()
  {
    return this.node;
  }

  /**
   * setNode
   *
   * @param string node The rel link name
   * @since Mon 26 Aug 2019 02:04:12 PM CEST
   * @return string
   */
  setNode(node)
  {
    this.node = node;

    return this;
  }

  /**
   * getType
   *
   * @since Mon 26 Aug 2019 02:27:50 PM CEST
   * @return string:
   */
  getType()
  {
    return this.type;
  }

  /**
   * setType
   *
   * @param {String} Set the type
   * @since Mon 26 Aug 2019 02:28:07 PM CEST
   */
  setType(type)
  {
    this.type = type;
    return this;
  }

  /**
   * Get Link
   *
   * @since Tue 27 Aug 2019 02:40:22 PM CEST
   * @return string
   */
  getLink()
  {
    return this.link;
  }
  
  /**
   * Set Link
   *
   * @param {String} link The link to set
   * @return QueryBuilder
   */
  setLink(link)
  {
    this.link = link;

    return this;
  }

  /**
   * isRoot
   *
   * @since Mon 26 Aug 2019 03:21:15 PM CEST
   */
  isRoot()
  {
    return this.type == ApiQuery.ROOT ? true : false;
  }

  /**
   * isItem
   *
   * @since Mon 26 Aug 2019 03:21:49 PM CEST
   */
  isItem()
  {
    return this.type == ApiQuery.ITEM ? true : false;
  }
}
