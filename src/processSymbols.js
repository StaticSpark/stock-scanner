// import logger from '../../components/logger/logger';
import notifier from 'node-notifier';
import bluebird from 'bluebird';
import Table from 'cli-table';
import jsonfile from 'jsonfile';

import * as sorting from './sorting';
import filters from './filters';
import buildTable from './buildTable';
import tabledef from './tabledef';
import columns from './columns';
import flattenSymbols from './flattenSymbols';
import getFundamentals from './getFundamentals';
import cachedStockData from './cachedStockData';
import { quoteData } from './robinhood';
import { getRhSymbols } from './getSymbols';

const file = 'allResults.json';

module.exports = ( options ) => {
  let stocks = [];

  bluebird.coroutine( function* () {
    // Find all the symbols that Robinhood actually offers
    // @TODO: write this to file so we can save a ton of time.
    const parsedSymbols = yield getRhSymbols();

    // initialize progress bar
    const total = parsedSymbols.length;
    const pace = require('pace')({ total : total, maxBurden : total });

    // pull the data from RH
    if ( options.clearCache ) {
      for ( let i = 0; i < parsedSymbols.length; i += 10 ) {
        // bulk process the symbols max 10x time
        const symbol = flattenSymbols( parsedSymbols, i );
        const result = yield getFundamentals( symbol, options, pace );

        // add the results to the main stock data array
        stocks = stocks.concat( result );
      }

      // write all the newly fetched data to file for caching
      jsonfile.writeFile( file, stocks, ( err ) => {
        console.error( err );
      });
    } else {
      // read cached data out of a file
      stocks = yield cachedStockData();
    }

    // only return stocks less than the max price option
    stocks = filters( stocks, options, pace );

    // update progress bar
    pace.total = pace.total + ( stocks.length / 10);

    // merge up to date quote data into stocks
    for ( let i = 0; i < stocks.length; i += 10 ) {
      let s = stocks.slice( i, i + 10 );

      const quoteString = s.map( ( stock ) => {
        return stock.symbol;
      })
        .join(',');

      const quoteResult = yield quoteData( quoteString );

      pace.op();

      quoteResult.forEach( ( quote, idx ) => {
        // combine quote data with
        Object.assign( stocks[idx + i], quote );

        // fill in null values, it breaks table output.
        Object.keys( stocks[idx + i] ).forEach( key => {
          if ( stocks[idx + i][key] === null ) stocks[idx + i][key] = 'N/A';
        });
      });
    }

    stocks = stocks.sort( sorting[options.sort] )
      .slice( 0, options.count );

    // initialize the output table
    let table = new Table({
      head : Object.values( columns ).filter( value => { return value; } ), //['Symbol', 'Volume', 'Average Vol.', 'High', '52 Week Low'],
      chars : tabledef
    });

    table = buildTable( table, stocks );

    // output the table.
    console.log( '\n\n' );
    console.log( table.toString() );

    notifier.notify({
      title : 'Scanner',
      message : 'Scan complete'
    });
  })();
};
