import { fundamentals } from './robinhood';
import bluebird from 'bluebird';
import fs from 'fs';
import path from 'path';
const findRemoveSync = require('find-remove');

export class Utilities {
  constructor() {
  }

  static flattenSymbols( output, i ) {
    return output.slice( i, i + 10 )
      .map( ( obj ) => {
        return obj.Symbol;
      })
      .join(',');
  }

  static filters( stocks = [], options ) {
    return stocks.filter( ( obj ) => {
      if ( !options.clearCache ) { }
      if ( !obj ) return false;
      return obj.average_volume > 0
             && obj.market_cap > 0
             && obj.open > 0
             && ( options.max ? parseFloat( obj.open ) <= parseFloat( options.max ) : true )
             && ( options.min ? parseFloat( obj.open ) >= parseFloat( options.min ) : true );
    });
  }

  static getFundamentals( symbol, options ) {
    return new Promise( ( resolve, reject ) => {
      bluebird.coroutine( function* () {
        let res = yield fundamentals( symbol );
        const symbols = symbol.split(',');

        res.forEach( ( stock, idx ) => {
          if ( res[idx] ) {
            res[idx].symbol = symbols[idx];
          }

          // move the progressbar
          // pace.op();
          resolve( res );
        });
      })();
    });
  }

  static removeOldCache( file, hours) {
    const fileWithPath = path.join( path.dirname(require.main.filename), file);
    let stats;

    if ( ! fs.existsSync( fileWithPath ) ) {
      return;
    }

    try {
      stats = fs.statSync( fileWithPath );
    } catch ( err ) {
      console.error( 'something went wrong', err );
      return;
    }
    let endTime, now;
    now = new Date().getTime();
    endTime = new Date(stats.mtime).getTime() + 1000 * 60 * 60 * hours;

    if ( now > endTime ) {
      // delete file
      console.log( `removing old cache file ${file}` );
      fs.unlinkSync(  path.join( path.dirname( require.main.filename ), file ) );
    }
  }
}
