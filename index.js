// USAGE: node index.js <location (e.g. 'Salt Lake City, UT')> <query (e.g. 'Hardware')> <foursquare auth token>
// API options: https://developer.foursquare.com/docs/venues/explore 

"use strict"
let fs = require('fs')
let request = require('request')
let commandLineArgs = require('command-line-args')
 
let optionDefinitions = [
  { name: 'location', alias: 'l', type: String },
  { name: 'query', alias: 'q', type: String },
  { name: 'auth', alias: 'a', type: String },
  //{ name: 'gist', alias: 'g', type: Boolean, defaultValue: false }
]

let options = commandLineArgs(optionDefinitions)

let near = options.location
let query = options.query
let authToken = options.auth
//let gistFlag = options.gist

let exploreUrl = 'https://api.foursquare.com/v2/venues/explore?limit=50&near=' + near + '&query=' + query + '&oauth_token=' + authToken + '&v=20161005'

let outGeojson = {type: 'FeatureCollection', features: []}

request(exploreUrl, function (error, response, body) {
  if (!error && response.statusCode == 200) {
    let payload = JSON.parse(body)
    let items = payload.response.groups[0].items
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
          foursquare_rating: items[i].venue.rating || '',
          marker-color: '#' + items[i].venue.ratingColor || '#DCDCDC'
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
    //if (gistFlag === true) {
      //console.log('Anonymous gist posted to XXXXXXX')
    //} else {
      fs.writeFileSync('foursquare_' + payload.response.geocode.slug + '.geojson', JSON.stringify(outGeojson, null, 2))
      console.log('Output file: "foursquare_' + payload.response.geocode.slug + '.geojson"')
    //}
  }
})