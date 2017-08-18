import notifier from 'node-notifier';
import processSymbols from './processSymbols';

export default ( options ) => {
  notifier.notify({
    title : 'Scanner',
    message : 'scanning'
  });

  processSymbols( options );
};
