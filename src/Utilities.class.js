import { fundamentals } from './robinhood';
import bluebird from 'bluebird';

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

  static filters( stocks, options ) {
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
}
