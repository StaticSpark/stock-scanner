// sort from high volume [0] to low volume [end of arr]
const volume = ( a, b ) => {
  if ( a === null || b === null ) return 0;

  if ( parseFloat(a.volume) < parseFloat(b.volume) ) {
    return 1;
  } else if ( parseFloat(a.volume) > parseFloat(b.volume) ) {
    return -1;
  }
  return 0;
};

const yearlylow = ( a, b ) => {
  if ( a === null || b === null ) return 0;

  if ( ( parseFloat(a.low) - parseFloat(a.low_52_weeks) ) / parseFloat(a.low_52_weeks) > ( parseFloat(b.low) - parseFloat(b.low_52_weeks) ) / parseFloat(b.low_52_weeks) ) {
    return 1;
  } else if ( ( parseFloat(a.low) - parseFloat(a.low_52_weeks) ) / parseFloat(a.low_52_weeks) < ( parseFloat(b.low) - parseFloat(b.low_52_weeks) ) / parseFloat(b.low_52_weeks) ) {
    return -1;
  }
  return 0;
};

const volumespike = ( a, b ) => {
  if ( a === null || b === null || !a.average_volume || !b.average_volume ) return 0;

  if ( ( parseFloat(a.volume) - parseFloat(a.average_volume) ) / parseFloat(a.average_volume) < ( parseFloat(b.volume) - parseFloat(b.average_volume) ) / parseFloat(b.average_volume) ) {
    return 1;
  } else if ( ( parseFloat(a.volume) - parseFloat(a.average_volume) ) / parseFloat(a.average_volume) > ( parseFloat(b.volume) - parseFloat(b.average_volume) ) / parseFloat(b.average_volume) ) {
    return -1;
  }
  return 0;
};

const biggestGains = ( a, b ) => {
  if (a === null || b === null ) return 0;

  if ( (( parseFloat(a.last_trade_price) - parseFloat(a.open) )) < (( parseFloat(b.last_trade_price) - parseFloat(b.open) )) ) {
    return 1;
  } else if ( (( parseFloat(a.last_trade_price) - parseFloat(a.open) )) > (( parseFloat(b.last_trade_price) - parseFloat(b.open) )) ) {
    return -1;
  }
  return 0;
};

const losers = ( a, b ) => {
  if (!a || !b) return 0;

  if (parseFloat(a.last_trade_price) - parseFloat(a.open) > parseFloat(b.last_trade_price) - parseFloat(b.open) ) {
    return 1;
  } else if (parseFloat(a.last_trade_price) - parseFloat(a.open) < parseFloat(b.last_trade_price) - parseFloat(b.open) ) {
    return -1;
  }
  return 0;
};

const lowprice = ( a, b ) => {
  if (!a || !b) return 0;

  if ( parseFloat(a.open) > parseFloat(b.open) ) {
    return 1;
  } else if ( parseFloat(a.open) < parseFloat(b.open) ) {
    return -1;
  }

  return 0;
};

export { volume, yearlylow, volumespike, biggestGains, losers, lowprice };
