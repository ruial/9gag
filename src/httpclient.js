const puppeteer = require('puppeteer');

const DEFAULT_USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36';

class HttpClient {

  async init(useSandbox = false, userAgent = DEFAULT_USER_AGENT) {
    this.browser = await puppeteer.launch({ headless: true, args: useSandbox ? [] : ['--no-sandbox', '--disable-setuid-sandbox'] });
    this.page = await this.browser.newPage();
    this.page.setUserAgent(userAgent);
  }

  async close() {
    this.browser.close();
  }

  async get(url) {
    await this.page.goto(url);
    const html = await this.page.evaluate(() => document.body.innerText);
    return JSON.parse(html);
  }

}

module.exports = HttpClient;
