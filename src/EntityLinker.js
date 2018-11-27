import Entity from './Entity';
import Link from './Link';

/**
 * EntityLinker class. Used as an abstract class with helper methods that linkable Collection+JSON classes inherit.
 *
 * @author S. Fleming <npm@int5.net>
 * @since Tue Sep 12 12:59:11 CEST 2017
 */
export default class EntityLinker extends Entity
{
  /**
   * Get a link object by the rel name
   *
   * @param {String} name The rel name
   * @return Link
   */
  getLinkByRel(rel)
  {
    // check the links object
    if (this.links !== null && this.links.length > 0) {
      for (const link of this.links) {
        if (link.getRel() == rel) {
          return link;
        }
      }
    }

    // compose the error message
    let errorMessage = "No such link found rel: " + rel;
    console.log(errorMessage);

    // return empty link object
    return new Link(null, null);
  }

}
