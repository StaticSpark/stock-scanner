const bluebird = require('bluebird');
const jsonfile = bluebird.promisifyAll( require('jsonfile') );

export class Cache {
  constructor() {

  }

  static async readCache( file, def = [] ) {
    let contents;

    try {
      contents = await jsonfile.readFileAsync( file );
    } catch ( err ) {
      console.error( err.Error );
    }

    if ( typeof contents === 'undefined' ) {
      contents = def;
    }

    return contents;
  }

  static async writeCache( file, data ) {
    try {
      console.log( `writing file : ${file}` ); 
      await jsonfile.writeFileAsync( file, data );
    } catch ( err ) {
      console.error( err.Error );
    }
  }

  removeCache( file ) {

  }
}
