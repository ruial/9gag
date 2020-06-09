const fetch = require('node-fetch');

class HttpClient {

  async get(url) {
    const res = await fetch(url);
    const data = await res.json();
    return data;
  }

}

module.exports = HttpClient;
