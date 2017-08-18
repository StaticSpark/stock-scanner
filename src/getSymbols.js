import ftp from 'ftp-get';
import parse from 'csv-parse';
import fs from 'fs';
import bluebird from 'bluebird';
import { getUrl } from './robinhood';

const getNext = ( url, symbols ) => {
  return new Promise( ( resolve, reject ) => {
    getUrl( url ).then( res => {
      symbols = symbols || [];

      for ( let i = 0; i < res.results.length; i++ ) {
        symbols.push({ Symbol : res.results[i].symbol });
      }
      
      if ( res.next ) {
        resolve( getNext( res.next, symbols ) );
      } else {
        fs.writeFile( 'rhSymbols.json', JSON.stringify(symbols, null, 2), err => {
          if ( err ) {
            console.error( 'There was an error saving robinhood symbols.', err );
          }
          resolve( symbols );
        });
      }
    });
  });
};

export const getRhSymbols = ( symbols ) => {
  return new Promise( ( resolve, reject ) => {
    if ( fs.existsSync('rhSymbols.json') ) {
      fs.readFile( 'rhSymbols.json', 'utf8', ( err, data ) => {
        data = JSON.parse( data );
        resolve( data );
      });
    } else {
      getUrl('https://api.robinhood.com/instruments/').then( res => {
        symbols = symbols || [];

        for (let i = 0; i < res.results.length; i++) {
          symbols.push({ Symbol : res.results[i].symbol });
        }

        if ( res.next ) {
          resolve( getNext( res.next, symbols ) );
        }
      });
    }
  });
};
