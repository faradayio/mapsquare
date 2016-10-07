// USAGE: node index.js <location (e.g. 'Salt Lake City, UT')> <query (e.g. 'Hardware')> <foursquare auth token>
// API options: https://developer.foursquare.com/docs/venues/explore 

"use strict"
let fs = require('fs')
let request = require('request')

let near = process.argv[2]
let query = process.argV[3]
let authToken = process.argv[4]

let exploreUrl = 'https://api.foursquare.com/v2/venues/explore?limit=50&near=' + near + '&query=' + query + '&oauth_token=' + authToken + '&v=20161005'

let outGeojson = {type: 'FeatureCollection', features: []}
request(exploreUrl, function (error, response, body) {
  if (!error && response.statusCode == 200) {
    let payload = JSON.parse(body)
    let items = payload.response.groups[0].items
    console.log(items.length)
    for (var i = 0; i < items.length; i++) {
      outGeojson.features.push({
        type: 'Feature', 
        properties: {
          name: items[i].venue.name || '',
          phone: items[i].venue.contact.phone || '',
          url: items[i].venue.url || '',
          address: items[i].venue.location.address || '',
          city: items[i].venue.location.city || '',
          state: items[i].venue.location.state || '',
          postcode: items[i].venue.location.postalCode || '',
          foursquare_rating: items[i].venue.rating || ''
        }, 
        geometry: { 
          type: 'Point', 
          coordinates: [ 
            items[i].venue.location.lng, 
            items[i].venue.location.lat
          ]
        }
      })
    }
    fs.writeFileSync('foursquare_' + payload.response.geocode.slug + '.geojson', JSON.stringify(outGeojson, NULL, 2))
  }
})


