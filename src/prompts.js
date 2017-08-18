import inquirer from 'inquirer';

export const mainPrompt = () => {
  return inquirer.prompt([{
    type : 'list',
    name : 'action',
    message : 'Choose an action',
    choices : [
      'Scan Stocks'
    ]
  }]);
};

export const scanPrompt = () => {
  return inquirer.prompt([{
    type : 'list',
    name : 'action',
    message : 'Refresh stock data?',
    choices : [
      'Yes',
      'No'
    ]
  }]);
};

export const sortPrompt = () => {
  return inquirer.prompt([{
    type : 'list',
    name : 'action',
    message : 'Sort By?',
    choices : [
      'yearlylow',
      'volumespike',
      'biggestGains',
      'lowprice',
      'losers',
      'volume'
    ]
  }]);
};

export const pricePrompt = () => {
  return inquirer.prompt([{
    type : 'list',
    name : 'action',
    message : 'PriceRange?',
    choices : [
      '0 - 0.50',
      '0.51 - 1.00',
      '1.01 - 5.00',
      '5.01 +'
    ]
  }]);
};
