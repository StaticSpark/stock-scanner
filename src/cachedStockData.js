import jsonfile from 'jsonfile';
const file = 'allResults.json';

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
