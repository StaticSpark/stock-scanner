import jsonfile from 'jsonfile';
import fs from 'fs';
const findRemoveSync = require('find-remove');
import path from 'path';
const file = 'allResults.json';

const removeOldFiles = ( file, hours ) => {
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
};

export const cachedStockData = () => {
  return new Promise( ( resolve, reject ) => {
    jsonfile.readFile( file, ( err, stocks ) => {
      if ( err ) {
        console.error( err );
        process.exit(1);
      }

      if ( stocks === undefined ) stocks = [];

      resolve( stocks );
    });
  });
};

export const cachedSymbols = ( cachedFile ) => {
  removeOldFiles( cachedFile, 6 );

  return new Promise( ( resolve, reject ) => {
    jsonfile.readFile( cachedFile, ( err, symbols ) => {
      if ( err && err.code === 'ENOENT' ) {

      } else if ( err ) {
        console.error( err );
        process.exit(1);
      }

      if (symbols === undefined ) symbols = [];

      resolve( symbols );
    });
  });
};

export const setCachedSymbols = ( data, cachedFile ) => {
  return new Promise( ( resolve, reject ) => {
    jsonfile.writeFile( cachedFile, data,  err => {
      if ( err ) {
        console.error( err );
        reject( err );
      } else {
        resolve( true );
      }
    });
  });
};
