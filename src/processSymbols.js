// import logger from '../../components/logger/logger';
import bluebird from 'bluebird';
import { Symbols } from './Symbols.class';

module.exports = ( options ) => {
  let symbols;

  bluebird.coroutine( function* () {
    symbols = new Symbols( options );

    yield symbols.findParsedSymbols();
    yield symbols.sortStocks();
    symbols.display();
  })();
};
