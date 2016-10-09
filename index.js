#!/usr/bin/env node

"use strict"
let fs = require('fs')
let request = require('request')
let GitHubApi = require("github")
let commandLineArgs = require('command-line-args')
 
let optionDefinitions = [
  { name: 'location', alias: 'l', type: String },
  { name: 'query', alias: 'q', type: String },
  { name: 'auth', alias: 'a', type: String },
  { name: 'gist', alias: 'g', type: Boolean, defaultValue: false }
]

let options = commandLineArgs(optionDefinitions)

if (options.auth) {
  console.log('***********************')
} else {
  console.log('Please specify a foursquare authorization key (get one here: https://developer.foursquare.com/docs/explore)')
  exit()
}

let near = options.location
let query = options.query
let authToken = options.auth
let gistFlag = options.gist

let github = new GitHubApi();

let exploreUrl = 'https://api.foursquare.com/v2/venues/explore?limit=50&near=' + near + '&query=' + query + '&oauth_token=' + authToken + '&v=20161005'

let outGeoJson = {type: 'FeatureCollection', features: []}

request(exploreUrl, function (error, response, body) {
  if (!error && response.statusCode == 200) {
    let payload = JSON.parse(body)
    let items = payload.response.groups[0].items
    for (var i = 0; i < items.length; i++) {
      let markerColor = items[i].venue.ratingColor || 'A8A7A9'
      outGeoJson.features.push({
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
          "marker-color": '#' + markerColor
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
    let fileName = 'foursquare_' + payload.response.geocode.slug + '_' + query + '.geojson'
    if (gistFlag === true) {
      let gistPost = {
        "description": "Foursquare venues: " + query + " in " + near,
        "public": true,
        "files": {}
      }
      gistPost.files[fileName] = {}
      gistPost.files[fileName]['content'] = JSON.stringify(outGeoJson)
      
      //console.log(JSON.stringify(gistPost))
      github.gists.create(
        gistPost, 
        function(err, rest) {
          if (err) {
            console.log(err)
          } else {
            console.log(rest.html_url);
            //console.log('You GeoJSON is available in this anonymous gist: ')
          }
        }
      )
    } else {
      fs.writeFileSync(fileName, JSON.stringify(outGeoJson, null, 2))
      console.log('Output file: "' + fileName + '"')
    }
  }
})