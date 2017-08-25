import inquirer from 'inquirer';
const config = {
  type : 'list',
  name : 'action'
};

export class Prompts {
  static mainPrompt() {
    return inquirer.prompt( Object.assign( config, {
      message : 'Choose an action',
      choices : [
        'Scan Stocks'
      ]
    }));
  }

  static scanPrompt() {
    return inquirer.prompt( Object.assign( config, {
      message : 'Refresh stock data?',
      choices : [
        'Yes',
        'No'
      ]
    }));
  }

  static sortPrompt() {
    return inquirer.prompt( Object.assign( config, {
      message : 'Sort By',
      choices : [
        'yearlylow',
        'volumespike',
        'biggestGains',
        'lowprice',
        'losers',
        'volume'
      ]
    }));
  }

  static pricePrompt() {
    return inquirer.prompt( Object.assign( config, {
      message : 'PriceRange?',
      choices : [
        '0 - 0.50',
        '0.51 - 1.00',
        '1.01 - 5.00',
        '5.01 +'
      ]
    }));
  }
}
