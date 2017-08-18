import bluebird from 'bluebird';

let _rhAuthenticated = false;
let _rhUnauthenticated = false;
const credentials =  {
  username : process.env.USER,
  password : process.env.PASS
};

/**
 * authenticated - Gets an authenticated Robinhood API object.
 *
 * @returns {Object} Robinhood API object
 */
export const authenticated = () => {
  return new Promise( ( resolve, reject ) => {
    if ( _rhAuthenticated ) {
      resolve( _rhAuthenticated );
    } else {
      const Robinhood = require('robinhood')( credentials, () => {
        // logger.info( 'authenticated robinhood' );
        _rhAuthenticated = Robinhood;
        resolve( Robinhood );
      });
    }
  });
};

/**
 * unauthenticated - Gets an unauthenticated Robinhood API object.
 *
 * @returns {Object} Robinhood API object
 */
export const unauthenticated = () => {
  return new Promise( ( resolve, reject ) => {
    if ( _rhUnauthenticated ) {
      resolve( _rhUnauthenticated );
    } else {
      const Robinhood = require('robinhood')( {}, () => {
        // logger.info( 'authenticated robinhood without credentials' );
        _rhUnauthenticated = Robinhood;
        resolve( Robinhood );
      });
    }
  });
};

/**
 * quoteData - Retrieve a quote for a symbol(s)
 *
 * @example
 * [
    {
        "description" : "Tesla, Inc. engages in the designing, development, manufacturing and sale of electric vehicles and electric power train components. Its products include electric vehicles such as the Model S, Model X, Model 3 and the Tesla Roadster. The company also manufactures home batteries and solar roof. Tesla was founded by Jeffrey B. Straubel, Elon Reeve Musk, Martin Eberhard, and Marc Tarpenning on July 1, 2003 and is headquartered in Palo Alto, CA.",
        "pe_ratio" : null,
        "market_cap" : "53395982600.0000",
        "low_52_weeks" : "178.1900",
        "dividend_yield" : null,
        "high_52_weeks" : "386.9900",
        "average_volume" : "5350085.7649",
        "volume" : "387077.0000",
        "low" : "325.9800",
        "high" : "327.3400",
        "open" : "326.9000",
        "instrument" : "https://api.robinhood.com/instruments/e39ed23a-7bd1-4587-b060-71988d9ef483/",
        "updated_at" : "2017-07-20T13:31:42Z",
        "last_trade_price_source" : "nls",
        "has_traded" : true,
        "trading_halted" : false,
        "symbol" : "TSLA",
        "previous_close_date" : "2017-07-19",
        "adjusted_previous_close" : "325.2600",
        "previous_close" : "325.2600",
        "last_extended_hours_trade_price" : null,
        "last_trade_price" : "327.3399",
        "bid_size" : 100,
        "bid_price" : "326.6500",
        "ask_size" : 600,
        "ask_price" : "326.8000"
    }
   ]
 *
 * @param {String} symbol Symbol to query
 * @param {Number} to     Description
 * @param {Number} from   Description
 *
 * @returns {Array} Quotes from Robinhood
 */
export const quoteData = ( symbol, to, from ) => {
  return new Promise( ( resolve, reject ) => {
    bluebird.coroutine( function* () {
      const Robinhood = yield unauthenticated();
      const results = [];

      Robinhood.quote_data( symbol, ( err, response, body ) => {
        if ( err || ! body ) {
          reject( err );
        }

        // this is where our quote data actually gets inserted into the db
        if ( to && from ) {
          fundamentals( symbol ).then( ( result ) => {
            // combine fundamental data to get volume
            for ( let i = 0; i < body.results.length; i++ ) {
              results.push( Object.assign( {}, body.results[i], result[0] ) );
            }
            pushQuoteData( symbol, results );
            resolve( results );
          });
        } else {
          resolve( body.results );
        }
      });
    })();
  });
};

/**
 * fundamentals - Get fundamental information for an instrument
 *
 * @param {String} symbol Instrument to query
 *
 * @returns {Object} Instrument detail
 */
export const fundamentals = ( symbol ) => {
  return new Promise( ( resolve, reject ) => {
    bluebird.coroutine( function* () {
      const Robinhood = yield unauthenticated();

      Robinhood.fundamentals( symbol, ( err, response, body ) => {
        if ( err || ! body ) {
          reject( err );
        }

        if ( body && body.results ) {
          resolve( body.results );
        } else {
          resolve([]);
        }
      });
    })();
  });
};

/**
 * getUrl - Get the response on a URL when requested with Robinhood headers
 *
 * @param {String} url URL to request
 *
 * @returns {Object} The response body
 */
export const getUrl = ( url ) => {
  return new Promise( ( resolve, reject ) => {
    bluebird.coroutine( function* () {
      const Robinhood = yield authenticated();

      Robinhood.url( url, ( err, response, body ) => {
        if ( err || body === undefined ) {
          reject( err );
        }

        resolve( body );
      });
    })();
  });
};
