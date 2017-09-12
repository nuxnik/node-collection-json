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
    let link = null;

    // check the links object
    if (this.links !== null && this.links.length > 0) {
      for (const link of this.links) {
        if (link.getRel() == rel) {
          return link;
        }
      }
    }

    /*
    let errorMessage = "No such link found rel: " + rel;
    console.error(errorMessage);
    */
    return new Link(null, null);
  }

}
