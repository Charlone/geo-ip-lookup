import publicIp from "public-ip";
import ip from "ip";
import axios from "axios";
import Redis from '@ioc:Adonis/Addons/Redis';
import { stringify, parse } from 'flatted';
import Rabbit from '@ioc:Adonis/Addons/Rabbit';

export default class IpsController {
  public async index({ view }) {
    return view.render('home', {ip: await publicIp.v4()});
  }

  public async postIp({request, view}) {
    const ipApi = "https://ipapi.co",
      format = "json",
      submittedIp = request.input('ip-address'),
      url = `${ipApi}/${submittedIp}/${format}`,
      cachedApiCalls = await Redis.get('ip');

    if (ip.isPrivate(submittedIp) || !ip.isV4Format(submittedIp)) {
      return view.render('home', {ip: await publicIp.v4(), errors: 'IP is not valid, please submit a valid IP!'});
    }

    if (cachedApiCalls) {
      let apiCall = parse(cachedApiCalls);

      if (apiCall.ip == submittedIp) {
        await Rabbit.sendToQueue('ip_queue', apiCall);

        return view.render('home', {ip: await publicIp.v4(), data: apiCall})
      }
    }

    let apiCall = await axios.post(url);
    Redis.set('ip', stringify(apiCall.data));
    await Rabbit.sendToQueue('ip_queue', apiCall.data);

    return view.render('home', {ip: await publicIp.v4(), data: apiCall.data})
  }
}

module.exports = IpsController;
