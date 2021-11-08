/*
|--------------------------------------------------------------------------
| Preloaded File
|--------------------------------------------------------------------------
|
| Any code written inside this file will be executed during the application
| boot.
|
*/
import Redis from '@ioc:Adonis/Addons/Redis';
import {stringify} from 'flatted';

Redis.subscribe('ip', async (ip) => {
  await Redis.set('ip', stringify(ip));
})
