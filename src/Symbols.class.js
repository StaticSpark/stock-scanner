import notifier from 'node-notifier';
import bluebird from 'bluebird';
import jsonfile from 'jsonfile';
import ProgressBar from 'progress';

import { cachedSymbols, cachedStockData, setCachedSymbols } from './cachedStockData';
import { getRhSymbols } from './getSymbols';
import { quoteData } from './robinhood';
import * as sorting from './sorting';

import { StocksTable } from './StocksTable.class';
import { Utilities } from './Utilities.class';

/**
 * Symbols
 * @TODO: build in progress bar
 */
export class Symbols {
  options;
  min;
  max;
  clearCache;
  cachedFile;
  resultsFile;
  parsedSymbols;
  // pace;
  stocks = [];
  fundamentalsBar;
  quoteBar;

  constructor( options ) {
    this.options = options;
    this.min = options.min;
    this.max = options.max;
    this.clearCache = options.clearCache;

    this.cachedFile = `${this.min}-${this.max}.json`;
    this.resultsFile = 'allResults.json';
  }

  *getParsed() {
    this.parsedSymbols = yield cachedSymbols( this.cachedFile );

    if ( this.parsedSymbols.length === 0 ) {
      this.parsedSymbols = yield getRhSymbols();
    }

    this.fundamentalsBar = new ProgressBar( 'Updating stocks [:bar] :percent :etas', {
      total : this.parsedSymbols.length / 10,
      complete : '=',
      incomplete : ' ',
      width : 20
    });

    if ( this.clearCache ) {
      yield this.updateSymbolData();
    } else {
      this.stocks = yield cachedStockData();
    }
  }

  findParsedSymbols() {
    return new Promise( ( resolve, reject ) => {
      let _this = this;
      bluebird.coroutine( function* () {
        yield* _this.getParsed();

        resolve( true );
      })();
    });
  }

  *updateSymbols() {
    let symbol;
    let result;

    for ( let i = 0; i < this.parsedSymbols.length; i += 10 ) {
      symbol = Utilities.flattenSymbols( this.parsedSymbols, i );
      result = yield Utilities.getFundamentals( symbol, this.options );
      this.stocks = this.stocks.concat( result );
      this.fundamentalsBar.tick();
    }

    this.writeCache();
  }

  updateSymbolData() {
    return new Promise( ( resolve, reject ) => {
      let _this = this;
      bluebird.coroutine( function* () {
        yield* _this.updateSymbols();

        resolve( true );
      })();
    });
  }

  writeCache() {
    jsonfile.writeFile( this.resultsFile, this.stocks, err => {
      if ( err ) {
        console.error( err );
        process.exit(1);
      }
    });
  }

  *sorted() {
    let quoteString;
    let quoteResult;
    let symbols;

    this.stocks = Utilities.filters( this.stocks, this.options );
    symbols = this.stocks.map( stock => {
      return { Symbol : stock.symbol };
    });

    yield setCachedSymbols( symbols, this.cachedFile );

    this.quoteBar = new ProgressBar( '      Retrieving quotes [:bar] :percent :etas', {
      total : this.stocks.length / 10,
      complete : '=',
      incomplete : ' ',
      width : 20
    });

    for ( let i = 0; i < this.stocks.length; i += 10 ) {
      let s = this.stocks.slice( i, i + 10 );

      quoteString = s.map( ( stock ) => {
        return stock.symbol;
      })
        .join(',');

      quoteResult = yield quoteData( quoteString );

      this.quoteBar.tick();

      quoteResult.forEach( ( quote, idx ) => {
        // combine quote data with
        Object.assign( this.stocks[idx + i], quote );

        // fill in null values, it breaks table output.
        Object.keys( this.stocks[idx + i] ).forEach( key => {
          if ( ! this.stocks[idx + i][key] ) {
            this.stocks[idx + i][key] = '-';
          }
        });
      });
    }

    this.stocks = this.stocks.sort( sorting[this.options.sort] )
      .slice( 0, this.options.count );
  }

  sortStocks() {
    let _this = this;
    return new Promise( ( resolve, reject ) => {
      bluebird.coroutine( function* () {
        yield* _this.sorted();
        resolve( true );
      })();
    });
  }

  display() {
    let stocksTable = new StocksTable( this.stocks );
    stocksTable.build();
    stocksTable.show();

    notifier.notify({
      title : 'Scanner',
      message : 'Scan complete'
    });
  }
}
