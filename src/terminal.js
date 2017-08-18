import scan from './scan';
import { mainPrompt, scanPrompt, sortPrompt, pricePrompt } from './prompts';
import bluebird from 'bluebird';

export const showPrompt = () => {
  bluebird.coroutine( function* () {
    const clearCache = yield scanPrompt();
    const sorting = yield sortPrompt();
    const price = yield pricePrompt();
    const prices = price.action.split(' - ');
    const min = parseFloat(prices[0]);
    let max = ( prices[1] !== '+' ? prices[1] : 99999.0 );
    max = parseFloat( max );

    if ( clearCache.action === 'Yes' ) {
      scan({ min : min, max : max, count : 10, sort : sorting.action, clearCache : true });
    } else {
      scan({ min : min, max : max, count : 10, sort : sorting.action });
    }
  })();
};
