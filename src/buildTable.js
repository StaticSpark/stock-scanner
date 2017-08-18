import columns from './columns';

export default ( table, stocks ) => {
  let i = 0;
  stocks.forEach( stock => {
    i++; if (i === 1) { console.log( stock ); }
    Object.keys( columns ).forEach( key => {
      if ( columns[key] && ! stock[key]) {
        stock[columns[key]] = stock[key];
        delete stock[key];
      } else if (! columns[key] ) {
        delete stock[key];
      } else {
        console.log( `keeping ${key}`);
      }
    });

    // return stock;
    table.push( Object.values( stock ) );
  });

  // return stocks;
  return table;
};
