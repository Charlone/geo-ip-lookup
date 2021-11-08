/*
|--------------------------------------------------------------------------
| Preloaded File
|--------------------------------------------------------------------------
|
| Any code written inside this file will be executed during the application
| boot.
|
*/
import Rabbit from '@ioc:Adonis/Addons/Rabbit';

async function listen() {
  await Rabbit.assertQueue('ip_queue');
}

listen();
