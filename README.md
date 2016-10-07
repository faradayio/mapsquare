# mapsquare
_Get GeoJSON from the Foursquare venues API_

## Installation

`npm install mapsquare -g`

## Usage

`mapsquare -l <placename> -q <venue type query> -a <foursquare authorization token>`

### Arguments

* `-l, --location` A placename for the venue search (e.g. 'Salt Lake City, UT')
* `-q, --query` A venue type (e.g. 'hardware' or 'movie theater')
* `-a, --auth` Foursquare authorization token. [Get a convenience token for testing here](https://developer.foursquare.com/docs/explore#req=venues/explore%3Fnear%3DSalt+Lake+City,+UT%26query%3Dpark) (Foursquare login or signup required).

### Notes

- Limited to 50 venues per request - foursquare will choose these based on relevance

## License

MIT