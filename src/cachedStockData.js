import jsonfile from 'jsonfile';
const file = 'allResults.json';

export default () => {
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
