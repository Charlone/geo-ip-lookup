import Database from '@ioc:Adonis/Lucid/Database';
import Rabbit from '@ioc:Adonis/Addons/Rabbit';
import Ws from 'App/Services/Ws';

export default class AdminsController {
  public async index({view}) {
    const requests = await Database
      .from('ip_logs')
      .select('country')
      .count('country')
      .groupBy('country')
      .orderBy('count', 'desc');

    await Rabbit.consumeFrom('ip_queue', async (message) => {
      Ws.io.emit('searchedCountry', message.content);
      const data = JSON.parse(message.content);
      await Database
        .insertQuery()
        .table('ip_logs')
        .insert({ip: data.ip, country: data.country_name});
      await Rabbit.ackAll();
    });

    return view.render('admin', {searchedCountries: requests});
  }
}
