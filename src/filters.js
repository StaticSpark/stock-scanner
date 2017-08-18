export default ( stocks, options, pace ) => {
  return stocks.filter( ( obj ) => {
    if ( !options.clearCache ) {pace.op();}
    if ( !obj ) return false;
    return obj.average_volume > 0
           && obj.market_cap > 0
           && obj.open > 0
           && ( options.max ? parseFloat( obj.open ) <= parseFloat( options.max ) : true )
           && ( options.min ? parseFloat( obj.open ) >= parseFloat( options.min ) : true );
  });
};
