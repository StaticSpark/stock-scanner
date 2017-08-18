import commandLineArgs from 'command-line-args';
import Jetty from 'jetty';

import optionsDefinitions from './options';
import { showPrompt } from './terminal';

const jetty = new Jetty( process.stdout );

jetty.nuke;

setTimeout( () => {
  showPrompt();
}, 500 );
