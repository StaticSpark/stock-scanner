import { fundamentals } from './robinhood';
import bluebird from 'bluebird';

export default ( symbol, options, pace ) => {
  return new Promise( ( resolve, reject ) => {
    bluebird.coroutine( function* () {
      let res = yield fundamentals( symbol );
      const symbols = symbol.split(',');

      res.forEach( ( stock, idx ) => {
        if ( res[idx] ) {
          res[idx].symbol = symbols[idx];
        }

        // move the progressbar
        pace.op();
        resolve( res );
      });
    })();
  });
};
