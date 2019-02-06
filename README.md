# node-collection-json

Lightweight JavaScript client/server for easy data exchange and manipulation of objects in a [Collection+JSON](http://amundsen.com/media-types/collection/) API. This library can be used in the browser and also server-side.

# Client Usage

The calls to the API listed below are based on an imaginary API which has the following schema:

```JSON
{
    "collection": {
        "version": "1.0",
        "href": "http://plants-api/api/plants",
        "links": [
            {
                "href": "http://plants-api/api",
                "rel": "root"
            },
            {
                "href": "http://plants-api/api/plants",
                "rel": "plants"
            }
        ],
        "queries": [
            {
                "href": "http://plants-api/api/search",
                "rel": "search",
                "data": [
                    {
                        "name": "name",
                        "value": "",
                        "prompt": "The plant name"
                    }
                ]
            }
        ],
        "template": {
            "data": [
                {
                    "name": "name",
                    "value": "",
                    "prompt": "Plant Name"
                },
                {
                    "name": "type",
                    "value": "",
                    "prompt": "Plant type"
                },
                {
                    "name": "color",
                    "value": "",
                    "prompt": "Plant color"
                }
            ]
        }
    }
}
```

## Query/Crawl the API

Query and crawl the Collection+JSON API.

```javascript
import {CJClient} from 'node-collection-json';

// create client
let client = new CJClient("http://plants-api/api");

// get the collection
client.getCollection().then( collection => {

  // follow a link
  collection.getLinkByRel('plants').follow().then( collection => {

    // display the data to console
    console.log("FOLLOW LINK", JSON.stringify(collection.getJson(), null, 2));

  });
}).catch( collection => {

    // display the data to console
    console.log("Crawl ERROR", JSON.stringify(collection.getJson(), null, 2));
});
```

##  POST Data to the API

Post data to the API from the Template object.

```javascript
import {CJClient} from 'node-collection-json';

// create client
let client = new CJClient("http://plants-api/api");

// get the collection
client.getCollection().then( collection => {

  // follow a link
  collection.getLinkByRel('plants').follow().then( collection => {

    // get the template object and add data
    collection.getTemplate()
      .setData('type', 'fruit')
      .setData('name', 'apple')
      .setData('color', 'red');

    // post the template object to the API
    collection.post().then( collection  => {

      // display the data to console
      console.log("CREATED DATA", JSON.stringify(collection.getJson(), null, 2));
    }).catch( collection => {

        // display the data to console
        console.log("POST ERROR", JSON.stringify(collection.getJson(), null, 2));
    });
  }).catch( collection => {

      // display the data to console
      console.log("Follow Link ERROR", JSON.stringify(collection.getJson(), null, 2));
  });
}).catch( collection => {

    // display the data to console
    console.log("Crawl ERROR", JSON.stringify(collection.getJson(), null, 2));
});
```

##  Query/Update the API

Update data based on the Template object.

```javascript
import {CJClient} from 'node-collection-json';

// create client
let client = new CJClient("http://plants-api/api");

// get the collection
client.getCollection().then( collection => {

  // follow a link
  collection.getLinkByRel('plants').follow().then( collection => {

    // query the server
    collection.getQueryByRel('search').setData('name', 'apple').query().then( collection => {

      // import the first item to the template
      let template = collection.getTemplate();
      template.importItem(collection.getFirstItem());

      // update the item
      template.setData('type', 'fruit')
      template.setData('name', 'banana')
      template.setData('color', 'yellow');

      // save the data
      collection.put(collection.getFirstItem().getHref()).then( collection => {

        // display the data to console
        console.log("CREATED DATA", JSON.stringify(collection.getJson(), null, 2));
      }).catch( collection => {

          // display the data to console
          console.log("Update ERROR", JSON.stringify(collection.getJson(), null, 2));
      });
    }).catch( collection => {

        // display the data to console
        console.log("Query ERROR", JSON.stringify(collection.getJson(), null, 2));
    });
  }).catch( collection => {

      // display the data to console
      console.log("Follow Link ERROR", JSON.stringify(collection.getJson(), null, 2));
  });
}).catch( collection => {

    // display the data to console
    console.log("Crawl ERROR", JSON.stringify(collection.getJson(), null, 2));
});
```
##  Query/Delete from API

Query/crawl the API and delete and Item.

```javascript
import {CJClient} from 'node-collection-json';

// create client
let client = new CJClient("http://plants-api/api");

// get the collection
client.getCollection().then( collection => {

  // follow a link
  collection.getLinkByRel('plants').follow().then( collection => {

    // query the server
    collection.getQueryByRel('search').setData('name', 'banana').query().then( collection => {

      // save the data
      collection.getFirstItem().delete().then( collection => {

        // display the data to console
        console.log("DELETED DATA", JSON.stringify(collection.getJson(), null, 2));
      }).catch( collection => {

          // display the data to console
          console.log("Update ERROR", JSON.stringify(collection.getJson(), null, 2));
      });
    }).catch( collection => {

        // display the data to console
        console.log("Query ERROR", JSON.stringify(collection.getJson(), null, 2));
    });
  }).catch( collection => {

      // display the data to console
      console.log("Follow Link ERROR", JSON.stringify(collection.getJson(), null, 2));
  });
}).catch( collection => {

    // display the data to console
    console.log("Crawl ERROR", JSON.stringify(collection.getJson(), null, 2));
});
```
