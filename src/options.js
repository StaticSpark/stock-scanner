export default [
  { name : 'scan', type : Boolean, description : 'Scan for stocks.'},
  { name : 'min', type : Number, description : 'Min stock price (scan).'},
  { name : 'max', type : Number, defaultValue : 0, description : 'Max stock price (scan).'},
  { name : 'count', type : Number, description : 'Number of results (scan).' },
  { name : 'sort', type : String, defaultValue : 'volume', description : '`yearlylow`, `volumespike`, `biggestGains`, `lowprice`, `losers` or `volume` (default) (scan)' },
  { name : 'clearCache', type : Boolean, defaultValue : false, description : 'Retrieve new data from Robinhood.' },
  { name : 'debug', type : Boolean, defaultValue : false },
  { name : 'help', type : Boolean, defaultValue : false }
];
