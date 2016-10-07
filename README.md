# mapsquare
_Get GeoJSON from the [Foursquare venues API](https://developer.foursquare.com/docs/venues/explore)_

![slc_hardware](slc_hardware.png)

## Installation

`npm install mapsquare -g`

## Usage

`mapsquare -l <placename> -q <venue keyword query> -a <Foursquare authorization token>`

### Arguments

* `-l, --location` A placename for the venue search (e.g. 'Salt Lake City, UT')
* `-q, --query` A venue type keyword (e.g. 'hardware' or 'movie theater')
* `-a, --auth` Foursquare authorization token. [Get a convenience token for testing here](https://developer.foursquare.com/docs/explore#req=venues/explore%3Fnear%3DSalt+Lake+City,+UT%26query%3Dpark) (Foursquare login or signup required).

### Notes

- Limited to 50 venues per request - Foursquare will choose these based on relevance

## License

MIT