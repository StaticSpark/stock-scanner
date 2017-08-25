import commandLineArgs from 'command-line-args';
import Jetty from 'jetty';
import bluebird from 'bluebird';

import scan from './scan';
import { Prompts } from './Prompts.class';

const jetty = new Jetty( process.stdout );

const showPrompt = () => {
  bluebird.coroutine( function* () {
    const clearCache = yield Prompts.scanPrompt();
    const sorting = yield Prompts.sortPrompt();
    const price = yield Prompts.pricePrompt();
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

jetty.nuke;

setTimeout( () => {
  showPrompt();
}, 500 );
