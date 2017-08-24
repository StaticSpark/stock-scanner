import Table from 'cli-table';

export class StocksTable {
  tabledef;
  table;
  stocks;
  columns;

  constructor( stocks ) {
    this.tabledef = {
      'top' : '═',
      'top-mid' : '╤',
      'top-left' : '╔',
      'top-right' : '╗',
      'bottom' : '═',
      'bottom-mid' : '╧',
      'bottom-left' : '╚',
      'bottom-right' : '╝',
      'left' : '║',
      'left-mid' : '╟',
      'mid' : '─',
      'mid-mid' : '┼',
      'right' : '║',
      'right-mid' : '╢',
      'middle' : '│'
    };

    this.columns = {
      'symbol' : 'symbol',
      'volume' : 'volume',
      'average_volume' : 'average_volume',
      'last_trade_price' : 'last',
      'last_extended_hours_trade_price' : 'last_ah',
      'ask_price' : 'ask',
      'ask_size' : false,
      'bid_price' : 'bid',
      'bid_size' : false,
      'open' : 'open',
      'high' : 'high',
      'low' : 'low',
      'high_52_weeks' : 'high_52_weeks',
      'low_52_weeks' : 'low_52_weeks',
      'market_cap' : 'market_cap',
      'previous_close' : 'close',
      'adjusted_previous_close' : false,
      'previous_close_date' : false,
      'trading_halted' : false,
      'has_traded' : false,
      'last_trade_price_source' : false,
      'updated_at' : false,
      'description' : false,
      'instrument' : false,
      'pe_ratio' : false,
      'dividend_yield' : false,
      'ceo' : false,
      'headquarters_city' : false,
      'headquarters_state' : false,
      'num_employees' : false,
      'year_founded' : false
    };

    this.table = new Table({
      head : Object.values( this.columns ).filter( value => { return value; } ),
      chars : this.tabledef
    });

    this.stocks = stocks;
  }

  build() {
    let i = 0;
    this.stocks.forEach( stock => {
      let tableEntry = [];

      Object.keys( this.columns ).forEach( key => {
        if ( this.columns[key] && ! stock[key]) {
          stock[this.columns[key]] = stock[key];
          delete stock[key];
        } else if (! this.columns[key] ) {
          delete stock[key];
          return;
        }

        tableEntry.push( stock[key] );
      });

      this.table.push( tableEntry );
    });
  }

  show() {
    console.log( '\n\n' );
    console.log( this.table.toString() );
  }
}
